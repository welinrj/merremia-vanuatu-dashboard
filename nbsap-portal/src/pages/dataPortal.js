/**
 * Data Portal page.
 * Lists all layers, supports search/filter, upload, and layer management.
 */
import { CATEGORIES } from '../config/categories.js';
import { getAppState, removeLayer } from '../ui/state.js';
import { deleteLayer, addAuditEntry } from '../services/storage/index.js';
import { openUploadWizard } from '../ui/components/uploadWizard.js';
import { isAdmin } from '../services/auth/index.js';
import { validateTORCompliance } from '../core/schema.js';

let portalSearch = '';
let portalFilterTarget = 'All';
let portalFilterCategory = 'All';
let portalFilterStatus = 'All';
let selectedLayerId = null;

/**
 * Initializes the Data Portal page.
 */
export function initDataPortal() {
  const page = document.getElementById('page-portal');
  page.innerHTML = `
    <div class="portal-layout">
      <div class="portal-main">
        <div class="portal-toolbar">
          <input type="text" class="search-input" id="portal-search" placeholder="Search layers...">
          <select id="portal-filter-target" style="width:100px;padding:8px;border:1px solid var(--border);border-radius:4px;font-size:13px">
            <option value="All">All Targets</option>
          </select>
          <select id="portal-filter-category" style="width:120px;padding:8px;border:1px solid var(--border);border-radius:4px;font-size:13px">
            <option value="All">All Categories</option>
            ${Object.entries(CATEGORIES).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}
          </select>
          <select id="portal-filter-status" style="width:100px;padding:8px;border:1px solid var(--border);border-radius:4px;font-size:13px">
            <option value="All">All Status</option>
            <option value="Clean">Clean</option>
            <option value="Warnings">Warnings</option>
            <option value="Failed">Failed</option>
          </select>
          <button class="btn btn-primary" id="btn-upload-layer" style="display:none">Upload Layer</button>
        </div>
        <div id="portal-table-container"></div>
      </div>
      <div class="portal-sidebar" id="portal-sidebar">
        <h4 style="margin-bottom:10px">Layer Details</h4>
        <p style="color:var(--text-light);font-size:13px">Select a layer to view details</p>
      </div>
    </div>
  `;

  // Show upload button for admin
  if (isAdmin()) {
    document.getElementById('btn-upload-layer').style.display = '';
  }

  // Populate target filter
  import('../config/targets.json').then(mod => {
    const sel = document.getElementById('portal-filter-target');
    for (const t of mod.default.targets) {
      const opt = document.createElement('option');
      opt.value = t.code;
      opt.textContent = t.code;
      sel.appendChild(opt);
    }
  });

  // Bind events
  document.getElementById('portal-search').addEventListener('input', (e) => {
    portalSearch = e.target.value.toLowerCase();
    renderPortalTable();
  });

  document.getElementById('portal-filter-target').addEventListener('change', (e) => {
    portalFilterTarget = e.target.value;
    renderPortalTable();
  });

  document.getElementById('portal-filter-category').addEventListener('change', (e) => {
    portalFilterCategory = e.target.value;
    renderPortalTable();
  });

  document.getElementById('portal-filter-status').addEventListener('change', (e) => {
    portalFilterStatus = e.target.value;
    renderPortalTable();
  });

  document.getElementById('btn-upload-layer').addEventListener('click', openUploadWizard);

  renderPortalTable();
}

/**
 * Renders the layer table.
 */
function renderPortalTable() {
  const state = getAppState();
  const container = document.getElementById('portal-table-container');
  if (!container) return;

  let layers = state.layers || [];

  // Apply filters
  layers = layers.filter(l => {
    const meta = l.metadata;
    if (portalSearch) {
      const searchStr = `${meta.name} ${meta.category} ${meta.targets.join(' ')} ${meta.originalFilename}`.toLowerCase();
      if (!searchStr.includes(portalSearch)) return false;
    }
    if (portalFilterTarget !== 'All' && !meta.targets.includes(portalFilterTarget)) return false;
    if (portalFilterCategory !== 'All' && meta.category !== portalFilterCategory) return false;
    if (portalFilterStatus !== 'All' && meta.status !== portalFilterStatus) return false;
    return true;
  });

  if (layers.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px;color:var(--text-light)">
        <p style="font-size:16px;margin-bottom:8px">No layers found</p>
        <p style="font-size:13px">${isAdmin() ? 'Upload a shapefile to get started' : 'No data available yet'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Layer Name</th>
          <th>Category</th>
          <th>Targets</th>
          <th>Realm</th>
          <th>Features</th>
          <th>Status</th>
          <th>Last Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${layers.map(l => {
          const m = l.metadata;
          return `
            <tr data-layer-id="${l.id}" class="${selectedLayerId === l.id ? 'selected' : ''}" style="cursor:pointer">
              <td><strong>${m.name}</strong></td>
              <td>${m.category}</td>
              <td>${m.targets.join(', ')}</td>
              <td>${m.realm}</td>
              <td>${m.featureCount}</td>
              <td><span class="badge badge-${m.status.toLowerCase()}">${m.status}</span></td>
              <td>${new Date(m.uploadTimestamp).toLocaleDateString()}</td>
              <td class="actions">
                <button class="btn btn-sm btn-outline action-view" data-id="${l.id}">View</button>
                <button class="btn btn-sm btn-outline action-download" data-id="${l.id}">GeoJSON</button>
                ${isAdmin() ? `<button class="btn btn-sm btn-danger action-remove" data-id="${l.id}">Remove</button>` : ''}
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;

  // Bind row click → show details
  container.querySelectorAll('tr[data-layer-id]').forEach(tr => {
    tr.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      selectedLayerId = tr.dataset.layerId;
      renderLayerDetails(selectedLayerId);
      renderPortalTable();
    });
  });

  // Action buttons
  container.querySelectorAll('.action-view').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedLayerId = btn.dataset.id;
      renderLayerDetails(btn.dataset.id);
      renderPortalTable();
    });
  });

  container.querySelectorAll('.action-download').forEach(btn => {
    btn.addEventListener('click', () => downloadLayerGeoJSON(btn.dataset.id));
  });

  container.querySelectorAll('.action-remove').forEach(btn => {
    btn.addEventListener('click', () => removeLayerAction(btn.dataset.id));
  });
}

/**
 * Renders layer metadata details in the sidebar.
 */
function renderLayerDetails(layerId) {
  const state = getAppState();
  const sidebar = document.getElementById('portal-sidebar');
  const layer = state.layers.find(l => l.id === layerId);

  if (!layer) {
    sidebar.innerHTML = '<p style="color:var(--text-light)">Layer not found</p>';
    return;
  }

  const m = layer.metadata;
  const tor = validateTORCompliance(m, layer.geojson);

  sidebar.innerHTML = `
    <h4 style="margin-bottom:12px">${m.name}</h4>

    <div class="card" style="margin-bottom:12px">
      <div class="card-header">Metadata</div>
      <div class="card-body" style="font-size:13px">
        <table style="width:100%">
          <tr><td style="padding:3px 0"><b>Original file:</b></td><td>${m.originalFilename}</td></tr>
          <tr><td style="padding:3px 0"><b>Uploaded:</b></td><td>${new Date(m.uploadTimestamp).toLocaleString()}</td></tr>
          <tr><td style="padding:3px 0"><b>Uploaded by:</b></td><td>${m.uploadedBy}</td></tr>
          <tr><td style="padding:3px 0"><b>Category:</b></td><td>${m.category}</td></tr>
          <tr><td style="padding:3px 0"><b>Targets:</b></td><td>${m.targets.join(', ')}</td></tr>
          <tr><td style="padding:3px 0"><b>Realm:</b></td><td>${m.realm}</td></tr>
          <tr><td style="padding:3px 0"><b>CRS:</b></td><td>${m.detectedCRS}</td></tr>
          <tr><td style="padding:3px 0"><b>Features:</b></td><td>${m.featureCount}</td></tr>
          <tr><td style="padding:3px 0"><b>Valid geometries:</b></td><td>${m.validGeometryCount}</td></tr>
          <tr><td style="padding:3px 0"><b>Fixed:</b></td><td>${m.fixedCount}</td></tr>
          <tr><td style="padding:3px 0"><b>Dropped:</b></td><td>${m.droppedCount}</td></tr>
          <tr><td style="padding:3px 0"><b>Total area:</b></td><td>${m.totalAreaHa.toFixed(2)} ha</td></tr>
          <tr><td style="padding:3px 0"><b>30x30:</b></td><td>${m.countsToward30x30 ? 'Yes' : 'No'}</td></tr>
          <tr><td style="padding:3px 0"><b>Status:</b></td><td><span class="badge badge-${m.status.toLowerCase()}">${m.status}</span></td></tr>
        </table>
      </div>
    </div>

    <div class="card" style="margin-bottom:12px">
      <div class="card-header">TOR Compliance</div>
      <div class="card-body">
        ${tor.compliant
          ? '<p style="color:var(--success);font-weight:600;font-size:13px">All checks passed</p>'
          : tor.issues.map(i => `<p style="color:var(--warning);font-size:12px">- ${i}</p>`).join('')
        }
      </div>
    </div>

    ${m.warnings.length > 0 ? `
      <div class="card">
        <div class="card-header">Warnings (${m.warnings.length})</div>
        <div class="card-body">
          ${m.warnings.map(w => `<p style="font-size:12px;color:var(--warning)">- ${w}</p>`).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

function downloadLayerGeoJSON(layerId) {
  const state = getAppState();
  const layer = state.layers.find(l => l.id === layerId);
  if (!layer) return;

  const json = JSON.stringify(layer.geojson, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${layer.metadata.name.replace(/\s+/g, '_')}.geojson`;
  a.click();
  URL.revokeObjectURL(url);
}

async function removeLayerAction(layerId) {
  if (!confirm('Remove this layer? This cannot be undone.')) return;

  const state = getAppState();
  const layer = state.layers.find(l => l.id === layerId);

  await deleteLayer(layerId);
  removeLayer(layerId);

  await addAuditEntry({
    action: 'delete',
    layer_id: layerId,
    filename: layer?.metadata?.originalFilename || '',
    targets: layer?.metadata?.targets || [],
    category: layer?.metadata?.category || '',
    result: 'deleted'
  });

  selectedLayerId = null;
  document.getElementById('portal-sidebar').innerHTML =
    '<h4 style="margin-bottom:10px">Layer Details</h4><p style="color:var(--text-light);font-size:13px">Select a layer to view details</p>';

  renderPortalTable();
}

/**
 * Refreshes the portal when data changes.
 */
export function refreshPortal() {
  if (isAdmin()) {
    const btn = document.getElementById('btn-upload-layer');
    if (btn) btn.style.display = '';
  }
  renderPortalTable();
}
