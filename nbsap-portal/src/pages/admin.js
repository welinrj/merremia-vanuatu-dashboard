/**
 * Admin page.
 * Auth gate, audit log, backup/restore, and settings.
 */
import { login, logout, getAuthState, isAdmin } from '../services/auth/index.js';
import { getAuditLog, exportBackup, importBackup, addAuditEntry } from '../services/storage/index.js';
import { setAdminState } from '../ui/state.js';

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
  page.innerHTML = `
    <div class="admin-layout">
      <div style="max-width:400px;margin:60px auto">
        <div class="card">
          <div class="card-header">Admin Login</div>
          <div class="card-body">
            <p style="font-size:13px;color:var(--text-light);margin-bottom:16px">
              Enter the admin passphrase to access upload, management, and settings features.
            </p>
            <div class="form-group">
              <label>Passphrase</label>
              <input type="password" id="admin-passphrase" placeholder="Enter passphrase">
            </div>
            <div id="login-error" style="color:var(--danger);font-size:13px;margin-bottom:10px;display:none"></div>
            <button class="btn btn-primary" id="btn-admin-login" style="width:100%">Login</button>
          </div>
        </div>
        <p style="font-size:11px;color:var(--text-light);margin-top:12px;text-align:center">
          Default passphrase for demo: <code>vanuatu2024</code>
        </p>
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

  page.innerHTML = `
    <div class="admin-layout">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="font-size:20px">Admin Panel</h2>
        <button class="btn btn-outline" id="btn-admin-logout">Logout</button>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          Backup & Restore
        </div>
        <div class="card-body" style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary" id="btn-export-backup">Export Backup</button>
          <label class="btn btn-secondary" style="cursor:pointer">
            Import Backup
            <input type="file" id="btn-import-backup" accept=".json" style="display:none">
          </label>
          <span id="backup-status" style="font-size:13px;color:var(--text-light);align-self:center"></span>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <span>Audit Log</span>
          <button class="btn btn-sm btn-outline" id="btn-export-audit">Export CSV</button>
        </div>
        <div class="card-body" style="max-height:400px;overflow-y:auto">
          ${auditLog.length === 0
            ? '<p style="color:var(--text-light);font-size:13px">No actions recorded yet</p>'
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
                      <td style="font-size:12px">${new Date(e.timestamp).toLocaleString()}</td>
                      <td>${e.action || ''}</td>
                      <td style="font-size:12px">${e.filename || e.layer_id || ''}</td>
                      <td>${e.category || ''}</td>
                      <td>${(e.targets || []).join(', ')}</td>
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
        <div class="card-header">Auth Status</div>
        <div class="card-body" style="font-size:13px">
          <p><b>Provider:</b> Local Passphrase</p>
          <p><b>Status:</b> Authenticated as admin</p>
          <p><b>Session:</b> Active (clears on page reload)</p>
          <p style="margin-top:8px;color:var(--text-light);font-size:12px">
            To change passphrase, update the hash in localStorage key <code>nbsap_admin_hash</code>
            or use the auth provider API.
          </p>
        </div>
      </div>
    </div>
  `;

  // Logout
  page.querySelector('#btn-admin-logout').addEventListener('click', () => {
    logout();
    setAdminState(false);
    renderAdminPage();
    updateNavAuthBadge(false);
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

  // Import backup
  page.querySelector('#btn-import-backup').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const statusEl = page.querySelector('#backup-status');
    statusEl.textContent = 'Importing...';

    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      const result = await importBackup(backup);

      await addAuditEntry({
        action: 'import_backup',
        result: 'success',
        notes: `${result.layersImported} layers imported`
      });

      statusEl.textContent = `Imported ${result.layersImported} layers. Reloading...`;
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      statusEl.textContent = `Import failed: ${err.message}`;
    }
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
    if (authenticated) {
      badge.textContent = 'Admin';
      badge.classList.add('admin');
    } else {
      badge.textContent = 'Public';
      badge.classList.remove('admin');
    }
  }
}
