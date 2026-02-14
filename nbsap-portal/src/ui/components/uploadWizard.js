/**
 * Upload Wizard component.
 * Multi-step wizard for uploading zipped shapefiles.
 * Steps: File Select → Configure → Processing → Results
 */
import { CATEGORIES, CATEGORY_KEYS } from '../../config/categories.js';
import targetsConfig from '../../config/targets.js';
import { runPipeline } from '../../core/pipeline.js';
import { saveLayer, addAuditEntry } from '../../services/storage/index.js';
import { getAppState, addLayer } from '../state.js';

let wizardState = { step: 1, file: null, geojson: null, prjText: null, opts: {} };

/**
 * Opens the upload wizard modal.
 */
export function openUploadWizard() {
  wizardState = { step: 1, file: null, geojson: null, prjText: null, opts: {} };
  const overlay = document.getElementById('upload-wizard-modal');
  overlay.classList.add('active');
  renderWizardStep();
}

/**
 * Closes the upload wizard modal.
 */
export function closeUploadWizard() {
  document.getElementById('upload-wizard-modal').classList.remove('active');
}

/**
 * Renders the current wizard step.
 */
function renderWizardStep() {
  const body = document.getElementById('wizard-body');
  const steps = document.getElementById('wizard-steps');

  const stepNames = ['File', 'Configure', 'Processing', 'Results'];
  steps.innerHTML = stepNames.map((name, i) => {
    const num = i + 1;
    let cls = '';
    if (num < wizardState.step) cls = 'done';
    if (num === wizardState.step) cls = 'active';
    return `<div class="wizard-step ${cls}">${num}. ${name}</div>`;
  }).join('');

  switch (wizardState.step) {
    case 1: renderStep1(body); break;
    case 2: renderStep2(body); break;
    case 3: renderStep3(body); break;
    case 4: renderStep4(body); break;
  }
}

// Step 1: File selection
function renderStep1(body) {
  body.innerHTML = `
    <div class="form-group">
      <label>Upload Zipped Shapefile (.zip)</label>
      <input type="file" id="wizard-file-input" accept=".zip">
      <div class="form-hint">Must contain .shp, .shx, .dbf, .prj (optionally .cpg)</div>
    </div>
    <div id="wizard-file-status" style="margin-top:10px"></div>
    <div style="margin-top:16px;text-align:right">
      <button class="btn btn-outline" onclick="document.getElementById('upload-wizard-modal').classList.remove('active')">Cancel</button>
      <button class="btn btn-primary" id="wizard-next-1" disabled>Next</button>
    </div>
  `;

  const fileInput = body.querySelector('#wizard-file-input');
  const nextBtn = body.querySelector('#wizard-next-1');
  const statusEl = body.querySelector('#wizard-file-status');

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    statusEl.innerHTML = '<p>Parsing shapefile...</p>';
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { default: shp } = await import('shpjs');
      const geojson = await shp(arrayBuffer);

      // Handle shpjs returning a single FeatureCollection or array
      const fc = Array.isArray(geojson) ? geojson[0] : geojson;

      if (!fc || !fc.features || fc.features.length === 0) {
        statusEl.innerHTML = '<p style="color:var(--danger)">No features found in shapefile</p>';
        return;
      }

      wizardState.file = file;
      wizardState.geojson = fc;
      wizardState.opts.originalFilename = file.name;

      // shpjs doesn't expose the .prj text directly; we attempt to detect CRS from data
      wizardState.prjText = null;

      statusEl.innerHTML = `
        <p style="color:var(--success)">Parsed successfully: ${fc.features.length} features</p>
        <p style="font-size:12px;color:var(--text-light)">
          Geometry types: ${[...new Set(fc.features.map(f => f.geometry?.type).filter(Boolean))].join(', ')}
        </p>
      `;
      nextBtn.disabled = false;
    } catch (err) {
      statusEl.innerHTML = `<p style="color:var(--danger)">Error parsing: ${err.message}</p>`;
    }
  });

  nextBtn.addEventListener('click', () => {
    wizardState.step = 2;
    renderWizardStep();
  });
}

// Step 2: Configure metadata
function renderStep2(body) {
  body.innerHTML = `
    <div class="form-group">
      <label>Layer Name</label>
      <input type="text" id="wizard-name" value="${wizardState.opts.originalFilename?.replace('.zip', '') || ''}">
    </div>

    <div class="form-group">
      <label>Category</label>
      <select id="wizard-category">
        ${CATEGORY_KEYS.map(k => `<option value="${k}">${CATEGORIES[k].label}</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label>Targets (select at least one)</label>
      <div id="wizard-targets" class="target-checkboxes">
        ${targetsConfig.targets.map(t => `
          <label class="target-checkbox" data-code="${t.code}">
            <input type="checkbox" value="${t.code}">
            ${t.code}
          </label>
        `).join('')}
      </div>
    </div>

    <div class="form-group">
      <label>Realm</label>
      <select id="wizard-realm">
        <option value="terrestrial">Terrestrial</option>
        <option value="marine">Marine</option>
      </select>
    </div>

    <div class="form-group">
      <label class="toggle-switch">
        <input type="checkbox" id="wizard-30x30">
        <span class="toggle-track"></span>
        Counts toward 30x30 (Target 3 only)
      </label>
      <div class="form-hint">Only meaningful if Target 3 is selected</div>
    </div>

    <div style="margin-top:16px;display:flex;justify-content:space-between">
      <button class="btn btn-outline" id="wizard-back-2">Back</button>
      <button class="btn btn-primary" id="wizard-next-2">Process</button>
    </div>
  `;

  // Auto-set realm based on category
  const categorySelect = body.querySelector('#wizard-category');
  const realmSelect = body.querySelector('#wizard-realm');
  categorySelect.addEventListener('change', () => {
    const cat = CATEGORIES[categorySelect.value];
    if (cat) realmSelect.value = cat.defaultRealm;
  });

  // Target checkbox handling
  body.querySelectorAll('#wizard-targets .target-checkbox').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      el.classList.toggle('selected');
      const input = el.querySelector('input');
      input.checked = !input.checked;
    });
  });

  body.querySelector('#wizard-back-2').addEventListener('click', () => {
    wizardState.step = 1;
    renderWizardStep();
  });

  body.querySelector('#wizard-next-2').addEventListener('click', () => {
    // Gather values
    const selectedTargets = [...body.querySelectorAll('#wizard-targets input:checked')].map(i => i.value);
    if (selectedTargets.length === 0) {
      alert('Please select at least one target');
      return;
    }

    wizardState.opts.name = body.querySelector('#wizard-name').value || 'Untitled';
    wizardState.opts.category = categorySelect.value;
    wizardState.opts.targets = selectedTargets;
    wizardState.opts.realm = realmSelect.value;
    wizardState.opts.countsToward30x30 = body.querySelector('#wizard-30x30').checked;
    wizardState.opts.prjText = wizardState.prjText;

    wizardState.step = 3;
    renderWizardStep();
  });
}

// Step 3: Processing pipeline
function renderStep3(body) {
  body.innerHTML = `
    <p style="margin-bottom:10px;font-weight:600">Running auto-cleaning pipeline...</p>
    <div class="pipeline-log" id="pipeline-log"></div>
    <div id="pipeline-status" style="margin-top:10px"></div>
  `;

  const logEl = body.querySelector('#pipeline-log');
  const statusEl = body.querySelector('#pipeline-status');

  function addLog(msg, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
  }

  // Run pipeline
  const state = getAppState();
  runPipeline(
    wizardState.geojson,
    wizardState.opts,
    state.provincesGeojson,
    (step, msg) => addLog(`Step ${step}: ${msg}`)
  ).then(async (result) => {
    wizardState.result = result;

    // Log warnings
    for (const w of result.report.warnings) {
      addLog(`WARNING: ${w}`, 'log-warn');
    }
    for (const e of result.report.errors) {
      addLog(`ERROR: ${e}`, 'log-error');
    }

    // Save to storage
    const layerRecord = {
      id: result.metadata.id,
      metadata: result.metadata,
      geojson: result.geojson
    };

    await saveLayer(layerRecord);
    addLayer(layerRecord);

    // Add audit entry
    await addAuditEntry({
      action: 'upload',
      layer_id: result.metadata.id,
      filename: result.metadata.originalFilename,
      targets: result.metadata.targets,
      category: result.metadata.category,
      result: result.metadata.status
    });

    statusEl.innerHTML = `
      <p style="color:var(--success);font-weight:600">Pipeline complete. Status: ${result.metadata.status}</p>
      <button class="btn btn-primary" id="wizard-next-3" style="margin-top:10px">View Results</button>
    `;

    body.querySelector('#wizard-next-3').addEventListener('click', () => {
      wizardState.step = 4;
      renderWizardStep();
    });

  }).catch(err => {
    addLog(`FATAL: ${err.message}`, 'log-error');
    statusEl.innerHTML = `
      <p style="color:var(--danger)">Pipeline failed: ${err.message}</p>
      <button class="btn btn-outline" onclick="document.getElementById('upload-wizard-modal').classList.remove('active')">Close</button>
    `;
  });
}

// Step 4: Results
function renderStep4(body) {
  const r = wizardState.result;
  if (!r) { body.innerHTML = '<p>No results</p>'; return; }

  const meta = r.metadata;
  const tor = r.report.torCompliance || { compliant: false, issues: [] };

  body.innerHTML = `
    <h4 style="margin-bottom:12px">${meta.name}</h4>
    <table class="data-table" style="margin-bottom:16px">
      <tr><td><b>Category</b></td><td>${meta.category}</td></tr>
      <tr><td><b>Targets</b></td><td>${meta.targets.join(', ')}</td></tr>
      <tr><td><b>Realm</b></td><td>${meta.realm}</td></tr>
      <tr><td><b>Features</b></td><td>${meta.featureCount}</td></tr>
      <tr><td><b>Area</b></td><td>${meta.totalAreaHa.toFixed(2)} ha</td></tr>
      <tr><td><b>Fixed</b></td><td>${meta.fixedCount} geometries</td></tr>
      <tr><td><b>Dropped</b></td><td>${meta.droppedCount} geometries</td></tr>
      <tr><td><b>CRS</b></td><td>${meta.detectedCRS}</td></tr>
      <tr><td><b>Status</b></td><td><span class="badge badge-${meta.status.toLowerCase()}">${meta.status}</span></td></tr>
      <tr><td><b>30x30</b></td><td>${meta.countsToward30x30 ? 'Yes' : 'No'}</td></tr>
    </table>

    <div class="card" style="margin-bottom:12px">
      <div class="card-header">TOR Compliance</div>
      <div class="card-body">
        ${tor.compliant
          ? '<p style="color:var(--success);font-weight:600">All checks passed</p>'
          : tor.issues.map(i => `<p style="color:var(--warning);font-size:13px">- ${i}</p>`).join('')
        }
      </div>
    </div>

    ${meta.warnings.length > 0 ? `
      <div class="card" style="margin-bottom:12px">
        <div class="card-header">Warnings</div>
        <div class="card-body">
          ${meta.warnings.map(w => `<p style="color:var(--warning);font-size:12px">- ${w}</p>`).join('')}
        </div>
      </div>
    ` : ''}

    <div style="display:flex;justify-content:space-between;margin-top:16px">
      <button class="btn btn-outline" id="wizard-download-geojson">Download Cleaned GeoJSON</button>
      <button class="btn btn-primary" id="wizard-done">Done</button>
    </div>
  `;

  body.querySelector('#wizard-download-geojson').addEventListener('click', () => {
    const json = JSON.stringify(r.geojson, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meta.name.replace(/\s+/g, '_')}_cleaned.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  });

  body.querySelector('#wizard-done').addEventListener('click', () => {
    closeUploadWizard();
    // Trigger dashboard refresh
    window.dispatchEvent(new CustomEvent('nbsap:refresh'));
  });
}
