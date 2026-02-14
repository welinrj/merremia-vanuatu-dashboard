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
          <input type="text" class="search-input" id="portal-search" placeholder="Search layers by name, category, or target...">
          <select id="portal-filter-target">
            <option value="All">All Targets</option>
          </select>
          <select id="portal-filter-category">
            <option value="All">All Categories</option>
            ${Object.entries(CATEGORIES).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}
          </select>
          <select id="portal-filter-status">
            <option value="All">All Status</option>
            <option value="Clean">Clean</option>
            <option value="Warnings">Warnings</option>
            <option value="Failed">Failed</option>
          </select>
          <button class="btn btn-primary" id="btn-upload-layer" style="display:none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Layer
          </button>
        </div>
        <div id="portal-table-container"></div>
      </div>
      <div class="portal-sidebar" id="portal-sidebar">
        <div class="detail-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <p><strong>Layer Details</strong></p>
          <p>Select a layer to view metadata and compliance information</p>
        </div>
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
    const targets = (mod.default || mod)?.targets || [];
    for (const t of targets) {
      const opt = document.createElement('option');
      opt.value = t.code;
      opt.textContent = t.code;
      sel.appendChild(opt);
    }
  }).catch(err => console.warn('Failed to load targets config:', err));

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
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
        </div>
        <div class="empty-state-title">No layers found</div>
        <div class="empty-state-text">${isAdmin() ? 'Upload a shapefile to get started' : 'No data available yet'}</div>
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
          const catConfig = CATEGORIES[m.category] || {};
          return `
            <tr data-layer-id="${l.id}" class="${selectedLayerId === l.id ? 'selected' : ''}" style="cursor:pointer">
              <td>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="width:4px;height:24px;border-radius:2px;background:${catConfig.color || '#95a5a6'};flex-shrink:0"></span>
                  <strong>${m.name}</strong>
                </div>
              </td>
              <td><span style="font-size:12px;color:var(--text-secondary)">${CATEGORIES[m.category]?.label || m.category}</span></td>
              <td>${m.targets.map(t => `<span class="badge badge-info" style="margin-right:3px">${t}</span>`).join('')}</td>
              <td style="text-transform:capitalize">${m.realm}</td>
              <td>${m.featureCount}</td>
              <td><span class="badge badge-${m.status.toLowerCase()}">${m.status}</span></td>
              <td style="font-size:12px;color:var(--text-secondary)">${new Date(m.uploadTimestamp).toLocaleDateString()}</td>
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
    sidebar.innerHTML = '<div class="detail-placeholder"><p>Layer not found</p></div>';
    return;
  }

  const m = layer.metadata;
  const tor = validateTORCompliance(m, layer.geojson);
  const catConfig = CATEGORIES[m.category] || {};

  sidebar.innerHTML = `
    <div class="detail-header">
      <span style="width:4px;height:28px;border-radius:2px;background:${catConfig.color || '#95a5a6'};flex-shrink:0"></span>
      <h4>${m.name}</h4>
    </div>

    <div class="card" style="margin-bottom:14px">
      <div class="card-header">
        <span>Metadata</span>
        <span class="badge badge-${m.status.toLowerCase()}">${m.status}</span>
      </div>
      <div class="card-body">
        <table class="metadata-table">
          <tr><td>Original file</td><td>${m.originalFilename}</td></tr>
          <tr><td>Uploaded</td><td>${new Date(m.uploadTimestamp).toLocaleString()}</td></tr>
          <tr><td>Uploaded by</td><td>${m.uploadedBy}</td></tr>
          <tr><td>Category</td><td>${CATEGORIES[m.category]?.label || m.category}</td></tr>
          <tr><td>Targets</td><td>${m.targets.map(t => `<span class="badge badge-info" style="margin-right:3px">${t}</span>`).join('')}</td></tr>
          <tr><td>Realm</td><td style="text-transform:capitalize">${m.realm}</td></tr>
          <tr><td>CRS</td><td><code style="background:var(--gray-100);padding:2px 6px;border-radius:4px;font-size:12px">${m.detectedCRS}</code></td></tr>
          <tr><td>Features</td><td>${m.featureCount}</td></tr>
          <tr><td>Valid geometries</td><td>${m.validGeometryCount}</td></tr>
          <tr><td>Fixed</td><td>${m.fixedCount}</td></tr>
          <tr><td>Dropped</td><td>${m.droppedCount}</td></tr>
          <tr><td>Total area</td><td><strong>${m.totalAreaHa.toFixed(2)} ha</strong></td></tr>
          <tr><td>30x30</td><td>${m.countsToward30x30 ? '<span class="badge badge-success">Yes</span>' : '<span class="badge" style="background:var(--gray-100);color:var(--text-secondary)">No</span>'}</td></tr>
        </table>
      </div>
    </div>

    <div class="card" style="margin-bottom:14px">
      <div class="card-header">TOR Compliance</div>
      <div class="card-body">
        ${tor.compliant
          ? '<div style="display:flex;align-items:center;gap:8px;color:var(--success);font-weight:600;font-size:13px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>All checks passed</div>'
          : tor.issues.map(i => `<div style="display:flex;align-items:flex-start;gap:6px;color:var(--warning);font-size:12px;margin-bottom:4px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>${i}</div>`).join('')
        }
      </div>
    </div>

    ${m.warnings.length > 0 ? `
      <div class="card">
        <div class="card-header">Warnings (${m.warnings.length})</div>
        <div class="card-body">
          ${m.warnings.map(w => `<div style="font-size:12px;color:var(--warning);margin-bottom:4px;display:flex;align-items:flex-start;gap:6px"><span style="flex-shrink:0">-</span>${w}</div>`).join('')}
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
  document.getElementById('portal-sidebar').innerHTML = `
    <div class="detail-placeholder">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
      <p><strong>Layer Details</strong></p>
      <p>Select a layer to view metadata and compliance information</p>
    </div>
  `;

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
