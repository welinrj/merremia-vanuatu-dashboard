/**
 * Data Portal page.
 * Lists all layers grouped by target, supports search/filter, upload, and layer management.
 */
import { CATEGORIES } from '../config/categories.js';
import TARGETS_CONFIG from '../config/targets.js';
import { categoryIcon, targetIcon } from '../config/icons.js';
import ENV from '../config/env.js';
import { getAppState, removeLayer } from '../ui/state.js';
import { deleteLayer, addAuditEntry } from '../services/storage/index.js';
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

  // Populate target filter from static import
  const sel = document.getElementById('portal-filter-target');
  const allTargets = TARGETS_CONFIG.targets || [];
  for (const t of allTargets) {
    const opt = document.createElement('option');
    opt.value = t.code;
    opt.textContent = t.code;
    sel.appendChild(opt);
  }

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

  renderPortalTable();
}

/**
 * Builds a table row for a single layer.
 */
function buildLayerRow(l) {
  const m = l.metadata;
  const catConfig = CATEGORIES[m.category] || {};
  const isRef = m.isReference === true;
  const admin = isAdmin();

  let coverageCell;
  if (isRef) {
    const baselines = ENV.nationalBaselines;
    const baseline = m.realm === 'marine' ? baselines.marine_ha : baselines.terrestrial_ha;
    const pct = baseline > 0 ? ((m.totalAreaHa || 0) / baseline * 100) : 0;
    coverageCell = `<span style="font-weight:600">${pct.toFixed(1)}%</span>`;
  } else {
    coverageCell = `${m.featureCount}`;
  }

  const showDownload = !isRef || admin;
  const showRemove = admin && (!isRef || admin);

  return `
    <tr data-layer-id="${l.id}" class="${selectedLayerId === l.id ? 'selected' : ''}" style="cursor:pointer">
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:4px;height:24px;border-radius:2px;background:${catConfig.color || '#95a5a6'};flex-shrink:0"></span>
          <div>
            <strong>${m.name}</strong>
            ${isRef ? '<span style="display:inline-block;background:#fef3cd;color:#856404;font-size:10px;font-weight:700;padding:0 5px;border-radius:10px;margin-left:5px;vertical-align:middle">REF</span>' : ''}
          </div>
        </div>
      </td>
      <td><span style="font-size:12px;color:var(--text-secondary);display:inline-flex;align-items:center;gap:4px"><span style="color:${catConfig.color || '#78909C'}">${categoryIcon(m.category, 14)}</span>${CATEGORIES[m.category]?.label || m.category}</span></td>
      <td style="text-transform:capitalize">${m.realm}</td>
      <td>${coverageCell}</td>
      <td><span class="badge badge-${m.status.toLowerCase()}">${m.status}</span></td>
      <td style="font-size:12px;color:var(--text-secondary)">${new Date(m.uploadTimestamp).toLocaleDateString()}</td>
      <td class="actions">
        <button class="btn btn-sm btn-outline action-view" data-id="${l.id}">View</button>
        ${showDownload ? `<button class="btn btn-sm btn-outline action-download" data-id="${l.id}">GeoJSON</button>` : ''}
        ${showRemove ? `<button class="btn btn-sm btn-danger action-remove" data-id="${l.id}">Remove</button>` : ''}
      </td>
    </tr>
  `;
}

/**
 * Renders layers grouped by target category.
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
      const searchStr = `${meta.name} ${meta.category} ${(meta.targets || []).join(' ')} ${meta.originalFilename}`.toLowerCase();
      if (!searchStr.includes(portalSearch)) return false;
    }
    if (portalFilterTarget !== 'All' && !(meta.targets || []).includes(portalFilterTarget)) return false;
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
        <div class="empty-state-text">${isAdmin() ? 'Go to the Admin tab to upload shapefiles' : 'No data available yet'}</div>
      </div>
    `;
    return;
  }

  // Build ordered target list
  const allTargets = TARGETS_CONFIG.targets || [];

  // Group layers by target code
  const groups = {};        // targetCode → [layer, ...]
  const unassigned = [];    // layers with no targets

  for (const l of layers) {
    const targets = l.metadata?.targets || [];
    if (targets.length === 0) {
      unassigned.push(l);
    } else {
      for (const tc of targets) {
        if (!groups[tc]) groups[tc] = [];
        groups[tc].push(l);
      }
    }
  }

  // Render grouped sections in target order
  const tableHeader = `
    <thead>
      <tr>
        <th>Layer Name</th>
        <th>Category</th>
        <th>Realm</th>
        <th>Records</th>
        <th>Status</th>
        <th>Last Updated</th>
        <th>Actions</th>
      </tr>
    </thead>`;

  let html = '';

  for (const t of allTargets) {
    const groupLayers = groups[t.code];
    if (!groupLayers || groupLayers.length === 0) continue;

    html += `
      <div class="portal-target-group">
        <div class="portal-group-header" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:${t.color || '#0072BC'}0A;border:1px solid ${t.color || '#0072BC'}30;border-radius:8px 8px 0 0;margin-top:16px">
          <span class="badge" style="font-size:13px;font-weight:700;padding:3px 10px;background:${t.color || '#0072BC'};color:#fff;border-radius:20px;display:inline-flex;align-items:center;gap:4px">${targetIcon(t.code, 14)} ${t.code}</span>
          <span style="font-weight:600;font-size:14px;color:var(--text-primary)">${t.name}</span>
          <span style="font-size:12px;color:var(--text-secondary);margin-left:auto">${groupLayers.length} dataset${groupLayers.length !== 1 ? 's' : ''}</span>
        </div>
        <table class="data-table" style="border-top:none;border-radius:0 0 8px 8px;margin-bottom:0">
          ${tableHeader}
          <tbody>
            ${groupLayers.map(l => buildLayerRow(l)).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Unassigned / Admin datasets
  if (unassigned.length > 0) {
    html += `
      <div class="portal-target-group">
        <div class="portal-group-header" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--gray-50,#f8f9fa);border:1px solid var(--border-color,#e0e0e0);border-radius:8px 8px 0 0;margin-top:16px">
          <span class="badge" style="font-size:13px;font-weight:700;padding:3px 10px;background:#e0e0e0;color:#555">Admin</span>
          <span style="font-weight:600;font-size:14px;color:var(--text-primary)">Admin / Unassigned Datasets</span>
          <span style="font-size:12px;color:var(--text-secondary);margin-left:auto">${unassigned.length} dataset${unassigned.length !== 1 ? 's' : ''}</span>
        </div>
        <table class="data-table" style="border-top:none;border-radius:0 0 8px 8px;margin-bottom:0">
          ${tableHeader}
          <tbody>
            ${unassigned.map(l => buildLayerRow(l)).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  container.innerHTML = html;

  // Event delegation on the container
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) {
      const id = btn.dataset.id;
      if (btn.classList.contains('action-view')) {
        selectedLayerId = id;
        renderLayerDetails(id);
        renderPortalTable();
      } else if (btn.classList.contains('action-download')) {
        downloadLayerGeoJSON(id);
      } else if (btn.classList.contains('action-remove')) {
        removeLayerAction(id);
      }
      return;
    }
    const tr = e.target.closest('tr[data-layer-id]');
    if (tr) {
      selectedLayerId = tr.dataset.layerId;
      renderLayerDetails(selectedLayerId);
      renderPortalTable();
    }
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
          <tr><td>Uploaded</td><td>${new Date(m.uploadTimestamp).toLocaleString()}</td></tr>
          <tr><td>Category</td><td><span style="display:inline-flex;align-items:center;gap:4px"><span style="color:${catConfig.color || '#78909C'}">${categoryIcon(m.category, 14)}</span>${CATEGORIES[m.category]?.label || m.category}</span></td></tr>
          <tr><td>Targets</td><td>${m.targets.map(t => {
            const tc = (TARGETS_CONFIG.targets || []).find(x => x.code === t);
            return `<span class="badge" style="margin-right:3px;background:${tc?.color || '#0072BC'}20;color:${tc?.color || '#0072BC'};border:1px solid ${tc?.color || '#0072BC'}40;display:inline-flex;align-items:center;gap:3px">${targetIcon(t, 12)} ${t}</span>`;
          }).join('')}</td></tr>
          <tr><td>Realm</td><td style="text-transform:capitalize">${m.realm}</td></tr>
          ${m.isReference
            ? (() => {
                const bl = ENV.nationalBaselines;
                const base = m.realm === 'marine' ? bl.marine_ha : bl.terrestrial_ha;
                const pct = base > 0 ? ((m.totalAreaHa || 0) / base * 100) : 0;
                return `<tr><td>Coverage</td><td><strong>${pct.toFixed(1)}%</strong> of national ${m.realm === 'marine' ? 'marine' : 'terrestrial'} area</td></tr>
          <tr><td>Total area</td><td><strong>${m.totalAreaHa.toFixed(2)} ha</strong></td></tr>`;
              })()
            : `<tr><td>Records</td><td>${m.featureCount}</td></tr>
          <tr><td>Total area</td><td><strong>${m.totalAreaHa.toFixed(2)} ha</strong></td></tr>`
          }
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
  if (!layer || !layer.geojson) return;

  // No pretty-print (null, 2) — saves ~30% memory on large datasets
  const json = JSON.stringify(layer.geojson);
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
  renderPortalTable();
}
