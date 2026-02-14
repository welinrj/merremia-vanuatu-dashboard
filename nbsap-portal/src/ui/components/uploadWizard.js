/**
 * Upload Wizard component.
 * Multi-step wizard for uploading geospatial data.
 * Supports: Zipped Shapefiles (.zip), KML (.kml), CSV (.csv), GeoJSON (.geojson/.json)
 * Steps: File Select → Configure → Processing → Results
 */
import { CATEGORIES, CATEGORY_KEYS } from '../../config/categories.js';
import targetsConfig from '../../config/targets.js';
import { runPipeline } from '../../core/pipeline.js';
import { saveLayer, addAuditEntry, setSetting } from '../../services/storage/index.js';
import { getAppState, addLayer, trackLayer } from '../state.js';

let wizardState = { step: 1, file: null, geojson: null, prjText: null, opts: {}, expectedLayer: null };
let wizardOpen = false;

/** Returns true while the upload wizard modal is active. */
export function isWizardOpen() { return wizardOpen; }

/** Warn user before leaving the page while upload wizard is active. */
function beforeUnloadGuard(e) {
  e.preventDefault();
  e.returnValue = '';
}

/**
 * Opens the upload wizard modal.
 * @param {object} [options] - Optional config
 * @param {object} [options.expectedLayer] - If uploading for a tracked expected layer, pre-populates fields
 */
export function openUploadWizard(options = {}) {
  wizardState = { step: 1, file: null, geojson: null, prjText: null, opts: {}, expectedLayer: options.expectedLayer || null };
  wizardOpen = true;
  window.addEventListener('beforeunload', beforeUnloadGuard);
  const overlay = document.getElementById('upload-wizard-modal');
  overlay.classList.add('active');

  // Wire modal X button to use closeUploadWizard (cleans up beforeunload guard)
  const closeBtn = document.getElementById('wizard-modal-close-btn');
  if (closeBtn) closeBtn.onclick = () => closeUploadWizard();

  renderWizardStep();
}

/**
 * Closes the upload wizard modal.
 */
export function closeUploadWizard() {
  wizardOpen = false;
  window.removeEventListener('beforeunload', beforeUnloadGuard);
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

/**
 * Detects file format from extension.
 */
function detectFormat(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  if (ext === 'zip') return 'shapefile';
  if (ext === 'kml') return 'kml';
  if (ext === 'csv') return 'csv';
  if (ext === 'geojson' || ext === 'json') return 'geojson';
  return null;
}

/**
 * Parses a zipped shapefile into GeoJSON using shpjs.
 */
async function parseShapefile(arrayBuffer) {
  // Polyfill Buffer for shpjs/JSZip before importing
  if (typeof globalThis.Buffer === 'undefined') {
    const bufferModule = await import('buffer');
    globalThis.Buffer = bufferModule.Buffer;
  }
  const { default: shp } = await import('shpjs');
  const geojson = await shp(arrayBuffer);
  // shpjs may return a single FeatureCollection or an array
  return Array.isArray(geojson) ? geojson[0] : geojson;
}

/**
 * Parses a KML file into GeoJSON.
 */
function parseKML(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) throw new Error('Invalid KML: XML parsing failed');

  const features = [];
  const placemarks = doc.querySelectorAll('Placemark');

  for (const pm of placemarks) {
    const props = {};

    // Extract name
    const nameEl = pm.querySelector('name');
    if (nameEl) props.name = nameEl.textContent.trim();

    // Extract description
    const descEl = pm.querySelector('description');
    if (descEl) props.notes = descEl.textContent.trim();

    // Extract ExtendedData / SimpleData fields
    const simpleDataEls = pm.querySelectorAll('SimpleData');
    for (const sd of simpleDataEls) {
      const fieldName = sd.getAttribute('name');
      if (fieldName) props[fieldName] = sd.textContent.trim();
    }

    // Extract Data elements
    const dataEls = pm.querySelectorAll('Data');
    for (const d of dataEls) {
      const fieldName = d.getAttribute('name');
      const valueEl = d.querySelector('value');
      if (fieldName && valueEl) props[fieldName] = valueEl.textContent.trim();
    }

    // Parse geometry
    const geometry = parseKMLGeometry(pm);
    if (!geometry) continue;

    features.push({ type: 'Feature', properties: props, geometry });
  }

  return { type: 'FeatureCollection', features };
}

/**
 * Parses KML geometry elements into GeoJSON geometry.
 */
function parseKMLGeometry(placemark) {
  const point = placemark.querySelector('Point');
  if (point) {
    const coords = parseKMLCoords(point.querySelector('coordinates'));
    if (coords.length > 0) return { type: 'Point', coordinates: coords[0] };
  }

  const lineString = placemark.querySelector('LineString');
  if (lineString) {
    const coords = parseKMLCoords(lineString.querySelector('coordinates'));
    if (coords.length > 0) return { type: 'LineString', coordinates: coords };
  }

  const polygon = placemark.querySelector('Polygon');
  if (polygon) {
    return parseKMLPolygon(polygon);
  }

  const multiGeom = placemark.querySelector('MultiGeometry');
  if (multiGeom) {
    const geometries = [];
    for (const child of multiGeom.children) {
      const tag = child.tagName;
      if (tag === 'Point') {
        const coords = parseKMLCoords(child.querySelector('coordinates'));
        if (coords.length > 0) geometries.push({ type: 'Point', coordinates: coords[0] });
      } else if (tag === 'LineString') {
        const coords = parseKMLCoords(child.querySelector('coordinates'));
        if (coords.length > 0) geometries.push({ type: 'LineString', coordinates: coords });
      } else if (tag === 'Polygon') {
        const pg = parseKMLPolygon(child);
        if (pg) geometries.push(pg);
      }
    }
    if (geometries.length === 0) return null;
    if (geometries.length === 1) return geometries[0];
    return { type: 'GeometryCollection', geometries };
  }

  return null;
}

function parseKMLPolygon(polygonEl) {
  const rings = [];
  const outerBoundary = polygonEl.querySelector('outerBoundaryIs');
  if (outerBoundary) {
    const coords = parseKMLCoords(outerBoundary.querySelector('coordinates'));
    if (coords.length > 0) rings.push(coords);
  }
  const innerBoundaries = polygonEl.querySelectorAll('innerBoundaryIs');
  for (const ib of innerBoundaries) {
    const coords = parseKMLCoords(ib.querySelector('coordinates'));
    if (coords.length > 0) rings.push(coords);
  }
  if (rings.length === 0) return null;
  return { type: 'Polygon', coordinates: rings };
}

/**
 * Parses a KML <coordinates> element into an array of [lon, lat] or [lon, lat, alt].
 */
function parseKMLCoords(coordsEl) {
  if (!coordsEl) return [];
  const text = coordsEl.textContent.trim();
  if (!text) return [];

  return text.split(/\s+/).map(tuple => {
    const parts = tuple.split(',').map(Number);
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts.length >= 3 ? [parts[0], parts[1], parts[2]] : [parts[0], parts[1]];
    }
    return null;
  }).filter(Boolean);
}

/**
 * Parses a CSV file into GeoJSON point features.
 * Detects lat/lon columns by common naming conventions.
 */
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row');

  const headers = parseCSVRow(lines[0]);
  const lowerHeaders = headers.map(h => h.toLowerCase().trim());

  // Detect latitude column
  const latNames = ['latitude', 'lat', 'y', 'lat_dd', 'latitude_dd', 'decimallatitude'];
  const lonNames = ['longitude', 'lon', 'lng', 'long', 'x', 'lon_dd', 'longitude_dd', 'decimallongitude'];

  const latIdx = lowerHeaders.findIndex(h => latNames.includes(h));
  const lonIdx = lowerHeaders.findIndex(h => lonNames.includes(h));

  if (latIdx === -1 || lonIdx === -1) {
    throw new Error(
      `Could not detect latitude/longitude columns. ` +
      `Found headers: ${headers.join(', ')}. ` +
      `Expected column names like: latitude/lat/y and longitude/lon/lng/x`
    );
  }

  const features = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVRow(lines[i]);
    const lat = parseFloat(values[latIdx]);
    const lon = parseFloat(values[lonIdx]);

    if (isNaN(lat) || isNaN(lon)) continue;

    const props = {};
    for (let j = 0; j < headers.length; j++) {
      if (j === latIdx || j === lonIdx) continue;
      props[headers[j].trim()] = values[j]?.trim() || '';
    }

    features.push({
      type: 'Feature',
      properties: props,
      geometry: { type: 'Point', coordinates: [lon, lat] }
    });
  }

  if (features.length === 0) throw new Error('No valid features found in CSV (no rows with valid lat/lon)');

  return { type: 'FeatureCollection', features };
}

/**
 * Simple CSV row parser that handles quoted fields.
 */
function parseCSVRow(row) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < row.length && row[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}

/**
 * Parses a GeoJSON file.
 */
function parseGeoJSON(text) {
  const data = JSON.parse(text);

  // Handle FeatureCollection
  if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
    return data;
  }

  // Handle single Feature
  if (data.type === 'Feature' && data.geometry) {
    return { type: 'FeatureCollection', features: [data] };
  }

  // Handle bare geometry
  if (data.type && data.coordinates) {
    return {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', properties: {}, geometry: data }]
    };
  }

  throw new Error('Invalid GeoJSON: must be a FeatureCollection, Feature, or Geometry object');
}

// Step 1: File selection
function renderStep1(body) {
  const el = wizardState.expectedLayer;
  const trackerHint = el
    ? `<div style="padding:10px 14px;background:var(--primary-lighter);border:1px solid var(--primary);border-radius:var(--radius-sm);margin-bottom:14px;font-size:13px">
         Uploading for: <strong>${el.name}</strong> (${el.category} / ${el.target})
       </div>`
    : '';

  body.innerHTML = `
    ${trackerHint}
    <div class="form-group">
      <label>Upload Data Layer</label>
      <input type="file" id="wizard-file-input" accept=".zip,.kml,.csv,.geojson,.json">
      <div class="form-hint">
        Supported formats:
        <strong>Shapefile</strong> (.zip with .shp, .shx, .dbf, .prj),
        <strong>KML</strong> (.kml),
        <strong>CSV</strong> (.csv with lat/lon columns),
        <strong>GeoJSON</strong> (.geojson, .json)
      </div>
    </div>
    <div id="wizard-file-status" style="margin-top:10px"></div>
    <div style="margin-top:16px;text-align:right">
      <button class="btn btn-outline" id="wizard-cancel-btn">Cancel</button>
      <button class="btn btn-primary" id="wizard-next-1" disabled>Next</button>
    </div>
  `;

  const fileInput = body.querySelector('#wizard-file-input');
  const nextBtn = body.querySelector('#wizard-next-1');
  const statusEl = body.querySelector('#wizard-file-status');

  body.querySelector('#wizard-cancel-btn').addEventListener('click', () => closeUploadWizard());

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const format = detectFormat(file.name);
    if (!format) {
      statusEl.innerHTML = '<p style="color:var(--danger)">Unsupported file format. Please upload .zip, .kml, .csv, .geojson, or .json</p>';
      return;
    }

    statusEl.innerHTML = `<p>Parsing ${format} file...</p>`;
    nextBtn.disabled = true;

    try {
      let fc;

      if (format === 'shapefile') {
        const arrayBuffer = await file.arrayBuffer();
        fc = await parseShapefile(arrayBuffer);
      } else {
        const text = await file.text();
        if (format === 'kml') {
          fc = parseKML(text);
        } else if (format === 'csv') {
          fc = parseCSV(text);
        } else if (format === 'geojson') {
          fc = parseGeoJSON(text);
        }
      }

      if (!fc || !fc.features || fc.features.length === 0) {
        statusEl.innerHTML = '<p style="color:var(--danger)">No features found in file</p>';
        return;
      }

      wizardState.file = file;
      wizardState.geojson = fc;
      wizardState.opts.originalFilename = file.name;
      wizardState.prjText = null;

      const geomTypes = [...new Set(fc.features.map(f => f.geometry?.type).filter(Boolean))];

      statusEl.innerHTML = `
        <p style="color:var(--success)">Parsed successfully: ${fc.features.length} features</p>
        <p style="font-size:12px;color:var(--text-light)">
          Format: ${format.toUpperCase()} | Geometry types: ${geomTypes.join(', ')}
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
  const el = wizardState.expectedLayer;
  const defaultName = el
    ? el.name
    : (wizardState.opts.originalFilename || '').replace(/\.(zip|kml|csv|geojson|json)$/i, '');
  const defaultCategory = el ? el.category : CATEGORY_KEYS[0];
  const defaultRealm = el ? el.realm : 'terrestrial';
  const defaultTarget = el ? el.target : null;
  const default30x30 = el ? el.countsToward30x30 : false;

  body.innerHTML = `
    ${el ? `<div style="padding:10px 14px;background:var(--primary-lighter);border:1px solid var(--primary);border-radius:var(--radius-sm);margin-bottom:14px;font-size:13px">
      Uploading for: <strong>${el.name}</strong> &mdash; fields have been pre-filled.
    </div>` : ''}
    <div class="form-group">
      <label>Layer Name</label>
      <input type="text" id="wizard-name" value="${defaultName}">
    </div>

    <div class="form-group">
      <label>Category</label>
      <select id="wizard-category">
        ${CATEGORY_KEYS.map(k => `<option value="${k}" ${k === defaultCategory ? 'selected' : ''}>${CATEGORIES[k].label}</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label>Targets (select at least one)</label>
      <div id="wizard-targets" class="target-checkboxes">
        ${targetsConfig.targets.map(t => {
          const preselected = defaultTarget === t.code;
          return `
          <label class="target-checkbox ${preselected ? 'selected' : ''}" data-code="${t.code}">
            <input type="checkbox" value="${t.code}" ${preselected ? 'checked' : ''}>
            ${t.code}
          </label>
        `;}).join('')}
      </div>
    </div>

    <div class="form-group">
      <label>Realm</label>
      <select id="wizard-realm">
        <option value="terrestrial" ${defaultRealm === 'terrestrial' ? 'selected' : ''}>Terrestrial</option>
        <option value="marine" ${defaultRealm === 'marine' ? 'selected' : ''}>Marine</option>
      </select>
    </div>

    <div class="form-group">
      <label class="toggle-switch">
        <input type="checkbox" id="wizard-30x30" ${default30x30 ? 'checked' : ''}>
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

    // Track layer if uploading for an expected layer
    if (wizardState.expectedLayer) {
      trackLayer(wizardState.expectedLayer.id, result.metadata.id);
      await setSetting('layerTracker', getAppState().layerTracker);
      addLog(`Tracked as: ${wizardState.expectedLayer.name}`);
    }

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
      <button class="btn btn-outline" id="wizard-error-close-btn">Close</button>
    `;
    body.querySelector('#wizard-error-close-btn').addEventListener('click', () => closeUploadWizard());
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
