/**
 * Admin page.
 * Auth gate, data upload, layer tracker, sync, audit log, backup/restore, and settings.
 * Supports multiple shapefile uploads per expected layer.
 * Data syncs in real time via Firestore across all devices.
 */
import { login, logout, getAuthState, isAdmin } from '../services/auth/index.js';
import { getAuditLog, exportBackup, importBackup, syncImport, addAuditEntry, getSetting, setSetting } from '../services/storage/index.js';
import { getAppState, setAdminState, trackLayer, untrackLayer, setLayerTracker, getExpectedLayerName, setCustomLayerName } from '../ui/state.js';
import { openUploadWizard } from '../ui/components/uploadWizard.js';
import EXPECTED_LAYERS from '../config/expectedLayers.js';
import { CATEGORIES } from '../config/categories.js';
import { showConfirm } from '../ui/components/dialog.js';

/** Safe accessor for Vite's BASE_URL */
function getBaseUrl() {
  try { return (import.meta.env && import.meta.env.BASE_URL) || './'; }
  catch { return './'; }
}

/**
 * Initializes the Admin page.
 */
export function initAdmin() {
  renderAdminPage();
}

/**
 * Renders the admin page based on auth state.
 */
export function renderAdminPage() {
  const page = document.getElementById('page-admin');
  const auth = getAuthState();

  if (!auth.isAuthenticated) {
    renderLoginForm(page);
  } else {
    renderAdminDashboard(page);
  }
}

function renderLoginForm(page) {
  const base = getBaseUrl();
  page.innerHTML = `
    <div class="admin-layout">
      <div class="login-container">
        <div class="login-card">
          <div class="login-card-header">
            <div class="login-official-banner">
              <img src="${base}vanuatu-coat-of-arms.svg"
                   alt="Republic of Vanuatu Coat of Arms"
                   width="48" height="48"
                   style="filter:brightness(1.1)">
            </div>
            <h3 style="margin-top:4px">Restricted Access</h3>
            <p>Enter your administrator passphrase to access data management features</p>
          </div>
          <div class="login-card-body">
            <div class="form-group">
              <label for="admin-passphrase">Passphrase</label>
              <input type="password" id="admin-passphrase" placeholder="Enter admin passphrase" autocomplete="current-password">
            </div>
            <div id="login-error" style="color:var(--danger);font-size:13px;margin-bottom:12px;display:none;padding:8px 12px;background:var(--danger-light);border-radius:var(--radius-sm)" role="alert"></div>
            <button class="btn btn-primary" id="btn-admin-login" style="width:100%;justify-content:center;padding:10px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Login
            </button>
            <div class="admin-system-info" style="margin-top:16px">
              <table>
                <tr><td>Portal</td><td>Vanuatu NBSAP GIS v2.0.0</td></tr>
                <tr><td>Operator</td><td>DEPC, Republic of Vanuatu</td></tr>
                <tr><td>Framework</td><td>Kunming-Montreal GBF 2024&ndash;2030</td></tr>
                <tr><td>Access</td><td>Authorised personnel only</td></tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const input = page.querySelector('#admin-passphrase');
  const btn = page.querySelector('#btn-admin-login');
  const errorEl = page.querySelector('#login-error');

  const doLogin = async () => {
    const result = await login(input.value);
    if (result.success) {
      setAdminState(true);
      renderAdminPage();
      updateNavAuthBadge(true);
    } else {
      errorEl.textContent = result.error || 'Login failed';
      errorEl.style.display = '';
    }
  };

  btn.addEventListener('click', doLogin);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });
}

async function renderAdminDashboard(page) {
  const auditLog = await getAuditLog();
  const state = getAppState();
  const tracker = state.layerTracker;
  const submittedCount = Object.keys(tracker).length;
  const totalExpected = EXPECTED_LAYERS.length;

  // Count total uploaded files across all expected layers
  const totalFiles = Object.values(tracker).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);

  page.innerHTML = `
    <div class="admin-layout">
      <div class="admin-header">
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
            <h2>Admin Panel</h2>
            <span class="badge badge-success" style="font-size:11px;padding:3px 10px">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:3px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Authenticated
            </span>
          </div>
          <p style="font-size:13px;color:var(--text-secondary);margin-top:2px">
            Vanuatu NBSAP GIS Portal &mdash; DEPC Administrator &mdash; data syncs in real time via Firestore
          </p>
        </div>
        <button class="btn btn-outline" id="btn-admin-logout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Data Layer Tracker
          </div>
          <span style="font-size:13px;color:var(--text-secondary)">${submittedCount} / ${totalExpected} layers &middot; ${totalFiles} file${totalFiles !== 1 ? 's' : ''} uploaded</span>
        </div>
        <div class="card-body" style="padding:0">
          <div style="padding:12px 16px 8px;border-bottom:1px solid var(--border)">
            <div class="progress-bar-container" style="height:8px">
              <div class="progress-bar-fill terrestrial" style="width:${totalExpected > 0 ? (submittedCount / totalExpected * 100).toFixed(0) : 0}%;transition:width 0.3s"></div>
            </div>
            <p style="font-size:12px;color:var(--text-tertiary);margin-top:6px">Upload GIS data layers. You can upload <strong>multiple shapefiles</strong> per target. Data syncs across all devices in real time.</p>
          </div>
          <table class="data-table" id="tracker-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Layer</th>
                <th>Category</th>
                <th>Target</th>
                <th>Realm</th>
                <th>Uploaded Files</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${EXPECTED_LAYERS.map(el => {
                const entries = tracker[el.id] || [];
                const isSubmitted = entries.length > 0;
                const catConfig = CATEGORIES[el.category] || {};

                // Build uploaded files list
                const filesHtml = entries.map(entry => {
                  const uploadedLayer = state.layers.find(l => l.id === entry.layerId);
                  const filename = uploadedLayer?.metadata?.originalFilename || entry.layerId;
                  const date = new Date(entry.uploadedAt).toLocaleDateString();
                  const shortName = filename.length > 22 ? filename.slice(0, 22) + '...' : filename;
                  return `<div style="display:flex;align-items:center;gap:4px;margin-bottom:2px">
                    <span style="font-size:11px" title="${filename}">${shortName}</span>
                    <span style="font-size:10px;color:var(--text-tertiary)">${date}</span>
                    <button class="btn btn-sm btn-ghost tracker-remove-one" data-expected-id="${el.id}" data-layer-id="${entry.layerId}" title="Remove this file" style="padding:1px 4px;font-size:10px;color:var(--danger);min-width:0">&times;</button>
                  </div>`;
                }).join('');

                return `
                  <tr>
                    <td>
                      ${isSubmitted
                        ? `<span class="badge badge-success">${entries.length} file${entries.length !== 1 ? 's' : ''}</span>`
                        : '<span class="badge" style="background:var(--warning-light);color:var(--warning)">Pending</span>'}
                    </td>
                    <td>
                      <div style="display:flex;align-items:center;gap:8px">
                        <span style="width:4px;height:24px;border-radius:2px;background:${catConfig.color || '#95a5a6'};flex-shrink:0"></span>
                        <div>
                          <strong class="layer-name-editable" data-expected-id="${el.id}" style="font-size:13px;cursor:pointer;border-bottom:1px dashed var(--text-tertiary)" title="Click to rename">${getExpectedLayerName(el)}</strong>
                          <div style="font-size:11px;color:var(--text-tertiary)">${el.description}</div>
                        </div>
                      </div>
                    </td>
                    <td style="font-size:12px">${catConfig.label || el.category}</td>
                    <td><span class="badge badge-info">${el.target}</span></td>
                    <td style="text-transform:capitalize;font-size:12px">${el.realm}</td>
                    <td style="font-size:12px;color:var(--text-secondary)">
                      ${isSubmitted ? filesHtml : '<span style="color:var(--text-tertiary)">--</span>'}
                    </td>
                    <td>
                      <button class="btn btn-sm btn-primary tracker-upload" data-expected-id="${el.id}">
                        ${isSubmitted ? 'Add More' : 'Upload'}
                      </button>
                      ${isSubmitted
                        ? `<button class="btn btn-sm btn-danger tracker-remove-all" data-expected-id="${el.id}" style="margin-left:4px" title="Remove all files for this layer">Clear</button>`
                        : ''}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Other Data
          </div>
        </div>
        <div class="card-body">
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">Upload additional GIS data not listed in the tracker above.</p>
          <button class="btn btn-primary" id="btn-admin-upload">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload File
          </button>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
            Sync & Backup
          </div>
        </div>
        <div class="card-body">
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">Data syncs automatically via Firestore. Use Export/Import for offline backup or migration.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
            <button class="btn btn-primary" id="btn-export-backup">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Data
            </button>
            <label class="btn btn-secondary" style="cursor:pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Sync / Import
              <input type="file" id="btn-sync-import" accept=".json" style="display:none">
            </label>
            <label class="btn btn-outline" style="cursor:pointer" title="Destructive: clears all data before importing">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Full Restore
              <input type="file" id="btn-import-backup" accept=".json" style="display:none">
            </label>
            <span id="backup-status" style="font-size:13px;color:var(--text-secondary);margin-left:4px"></span>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Audit Log
          </div>
          <button class="btn btn-sm btn-outline" id="btn-export-audit">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
        </div>
        <div class="card-body" style="max-height:400px;overflow-y:auto;padding:0">
          ${auditLog.length === 0
            ? '<div class="empty-state" style="padding:32px"><div class="empty-state-title">No actions recorded</div><div class="empty-state-text">Audit log entries will appear here as actions are performed</div></div>'
            : `
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Layer</th>
                    <th>Category</th>
                    <th>Targets</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  ${auditLog.map(e => `
                    <tr>
                      <td style="font-size:12px;color:var(--text-secondary)">${new Date(e.timestamp).toLocaleString()}</td>
                      <td style="text-transform:capitalize;font-weight:500">${e.action || ''}</td>
                      <td style="font-size:12px">${e.filename || e.layer_id || ''}</td>
                      <td>${e.category || ''}</td>
                      <td>${(e.targets || []).map(t => `<span class="badge badge-info" style="margin-right:2px">${t}</span>`).join('')}</td>
                      <td><span class="badge badge-${(e.result || '').toLowerCase()}">${e.result || ''}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `
          }
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
            System Information
          </div>
          <span class="badge badge-success" style="font-size:10px">Online</span>
        </div>
        <div class="card-body" style="font-size:13px">
          <table class="metadata-table">
            <tr><td>Portal Version</td><td><strong>v2.0.0</strong></td></tr>
            <tr><td>Operator</td><td>Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu</td></tr>
            <tr><td>Framework</td><td>Kunming-Montreal Global Biodiversity Framework, 2024&ndash;2030</td></tr>
            <tr><td>Auth Provider</td><td>Local Passphrase (bcrypt)</td></tr>
            <tr><td>Storage</td><td>Google Firestore &mdash; real-time sync across all devices</td></tr>
            <tr><td>Auth Status</td><td><span class="badge badge-success">Authenticated</span></td></tr>
            <tr><td>Session</td><td>Active &mdash; clears on page reload</td></tr>
            <tr><td>Session Time</td><td id="admin-session-time">&mdash;</td></tr>
          </table>
          <p style="margin-top:12px;color:var(--text-tertiary);font-size:12px;line-height:1.6">
            To change the admin passphrase, update the hash stored in localStorage key
            <code style="background:var(--gray-100);padding:2px 6px;border-radius:4px;font-size:11px">nbsap_admin_hash</code>.
            For security incidents, contact DEPC system administrator immediately.
          </p>
        </div>
      </div>
    </div>
  `;

  // Set session start time
  const sessionEl = page.querySelector('#admin-session-time');
  if (sessionEl) {
    const now = new Date();
    sessionEl.textContent = now.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  }

  // Logout
  page.querySelector('#btn-admin-logout').addEventListener('click', () => {
    logout();
    setAdminState(false);
    renderAdminPage();
    updateNavAuthBadge(false);
  });

  // Upload shapefile (generic)
  page.querySelector('#btn-admin-upload').addEventListener('click', () => openUploadWizard());

  // Tracker: Upload / Add More buttons
  page.querySelectorAll('.tracker-upload').forEach(btn => {
    btn.addEventListener('click', () => {
      const expectedId = btn.dataset.expectedId;
      const expected = EXPECTED_LAYERS.find(el => el.id === expectedId);
      if (expected) {
        openUploadWizard({ expectedLayer: expected });
      }
    });
  });

  // Tracker: Remove single file buttons
  page.querySelectorAll('.tracker-remove-one').forEach(btn => {
    btn.addEventListener('click', async () => {
      const expectedId = btn.dataset.expectedId;
      const layerId = btn.dataset.layerId;
      untrackLayer(expectedId, layerId);
      await setSetting('layerTracker', getAppState().layerTracker);
      renderAdminPage();
    });
  });

  // Tracker: Inline rename on layer names
  page.querySelectorAll('.layer-name-editable').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const expectedId = el.dataset.expectedId;
      const expectedLayer = EXPECTED_LAYERS.find(l => l.id === expectedId);
      if (!expectedLayer) return;

      const currentName = getExpectedLayerName(expectedLayer);
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentName;
      input.style.cssText = 'font-size:13px;font-weight:600;padding:2px 6px;border:2px solid var(--primary);border-radius:4px;outline:none;width:100%;box-sizing:border-box';

      const parent = el.parentNode;
      parent.replaceChild(input, el);
      input.focus();
      input.select();

      const save = async () => {
        const newName = input.value.trim();
        if (newName && newName !== expectedLayer.name) {
          setCustomLayerName(expectedId, newName);
          await setSetting('customLayerNames', getAppState().customLayerNames);
        } else if (newName === expectedLayer.name) {
          // Reset to default — remove custom override
          const state = getAppState();
          delete state.customLayerNames[expectedId];
          await setSetting('customLayerNames', state.customLayerNames);
        }
        renderAdminPage();
      };

      input.addEventListener('blur', save);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
        if (e.key === 'Escape') {
          input.value = currentName;
          input.blur();
        }
      });
    });
  });

  // Tracker: Clear All buttons (remove all files for an expected layer)
  page.querySelectorAll('.tracker-remove-all').forEach(btn => {
    btn.addEventListener('click', async () => {
      const expectedId = btn.dataset.expectedId;
      const expected = EXPECTED_LAYERS.find(el => el.id === expectedId);
      const displayName = expected ? getExpectedLayerName(expected) : expectedId;
      if (!await showConfirm(`Remove all uploaded files for "${displayName}"? The files remain in storage but won't appear on the dashboard.`, { title: 'Remove Files', okLabel: 'Remove', danger: true })) return;

      untrackLayer(expectedId, null);
      await setSetting('layerTracker', getAppState().layerTracker);
      renderAdminPage();
    });
  });

  // Export backup
  page.querySelector('#btn-export-backup').addEventListener('click', async () => {
    const statusEl = page.querySelector('#backup-status');
    statusEl.textContent = 'Exporting...';
    try {
      const backup = await exportBackup();
      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nbsap-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      await addAuditEntry({ action: 'export_backup', result: 'success' });
      statusEl.textContent = 'Backup exported successfully';
    } catch (err) {
      statusEl.textContent = `Error: ${err.message}`;
    }
  });

  // Sync / Import (merge-based, ID dedup)
  page.querySelector('#btn-sync-import').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const statusEl = page.querySelector('#backup-status');
    statusEl.textContent = 'Syncing...';

    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      const result = await syncImport(backup);

      await addAuditEntry({
        action: 'sync_import',
        result: 'success',
        notes: `${result.added} added, ${result.updated} updated, ${result.skippedAudit} audit entries skipped`
      });

      statusEl.textContent = `Sync complete: ${result.added} new layers, ${result.updated} updated.`;
      window.dispatchEvent(new CustomEvent('nbsap:refresh'));
    } catch (err) {
      statusEl.textContent = `Sync failed: ${err.message}`;
    }
    e.target.value = '';
  });

  // Full Restore (destructive import)
  page.querySelector('#btn-import-backup').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!await showConfirm('Full Restore will clear ALL existing data and replace it with the backup. Continue?', { title: 'Full Restore', okLabel: 'Restore', danger: true })) {
      e.target.value = '';
      return;
    }

    const statusEl = page.querySelector('#backup-status');
    statusEl.textContent = 'Restoring...';

    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      const result = await importBackup(backup);

      await addAuditEntry({
        action: 'import_backup',
        result: 'success',
        notes: `${result.layersImported} layers imported`
      });

      statusEl.textContent = `Restored ${result.layersImported} layers.`;
      window.dispatchEvent(new CustomEvent('nbsap:refresh'));
    } catch (err) {
      statusEl.textContent = `Restore failed: ${err.message}`;
    }
    e.target.value = '';
  });

  // Export audit log as CSV
  page.querySelector('#btn-export-audit').addEventListener('click', async () => {
    const log = await getAuditLog();
    const rows = [['Timestamp', 'Action', 'Layer ID', 'Filename', 'Category', 'Targets', 'Result']];
    for (const e of log) {
      rows.push([
        e.timestamp || '',
        e.action || '',
        e.layer_id || '',
        e.filename || '',
        e.category || '',
        (e.targets || []).join(';'),
        e.result || ''
      ]);
    }
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-log.csv';
    a.click();
    URL.revokeObjectURL(url);
  });
}

/**
 * Updates the auth badge in the navbar.
 */
function updateNavAuthBadge(authenticated) {
  const badge = document.getElementById('auth-badge');
  if (badge) {
    const span = badge.querySelector('span');
    if (authenticated) {
      if (span) span.textContent = 'Admin';
      badge.classList.add('admin');
    } else {
      if (span) span.textContent = 'Public';
      badge.classList.remove('admin');
    }
  }
}
