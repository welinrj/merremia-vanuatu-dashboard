/**
 * Feature Editor component.
 * Admin-only modal for editing, adding, and deleting individual GeoJSON features.
 * No Leaflet dependency — pure form UI.
 */
import { STANDARD_FIELDS } from '../../core/schema.js';
import { showConfirm } from './dialog.js';

const PROVINCES = ['Torba', 'Sanma', 'Penama', 'Malampa', 'Shefa', 'Tafea'];

const FIELD_DEFS = [
  { key: 'name',     label: 'Name',     type: 'text',   required: true },
  { key: 'type',     label: 'Type',     type: 'text' },
  { key: 'realm',    label: 'Realm',    type: 'select', options: ['terrestrial', 'marine', 'freshwater'] },
  { key: 'province', label: 'Province', type: 'select', options: ['', ...PROVINCES] },
  { key: 'year',     label: 'Year',     type: 'number' },
  { key: 'status',   label: 'Status',   type: 'select', options: ['Unknown', 'Proposed', 'Gazetted', 'Active', 'Inactive', 'Restored'] },
  { key: 'source',   label: 'Source',   type: 'text' },
  { key: 'notes',    label: 'Notes',    type: 'textarea' },
];

const METADATA_KEYS = new Set(['upload_timestamp', 'layer_id', 'original_filename', 'uploaded_by']);
const STANDARD_KEY_SET = new Set(STANDARD_FIELDS);

let _modal = null;

// ── Modal bootstrap ──────────────────────────────────────────────────

function ensureModal() {
  if (_modal) return;
  const div = document.createElement('div');
  div.className = 'modal-overlay';
  div.id = 'feature-editor-modal';
  div.style.zIndex = '2100';
  div.innerHTML = `
    <div class="modal" style="max-width:540px;max-height:88vh;display:flex;flex-direction:column">
      <div class="modal-header" style="flex-shrink:0">
        <h3 id="fe-title">Edit Feature</h3>
        <button class="modal-close" id="fe-close">&times;</button>
      </div>
      <div id="fe-body" style="overflow-y:auto;flex:1"></div>
    </div>
  `;
  document.body.appendChild(div);
  _modal = div;
  div.querySelector('#fe-close').addEventListener('click', closeFeatureEditor);
  div.addEventListener('click', (e) => { if (e.target === div) closeFeatureEditor(); });
}

export function closeFeatureEditor() {
  _modal?.classList.remove('active');
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Opens the editor for an existing feature.
 * @param {object} feature - GeoJSON feature
 * @param {{ onSave: (props) => void, onDelete: () => void }} callbacks
 */
export function openFeatureEditor(feature, { onSave, onDelete } = {}) {
  ensureModal();
  document.getElementById('fe-title').textContent = 'Edit Feature';
  _renderForm(feature.properties || {}, feature.geometry?.type || 'Unknown', false, onSave, onDelete);
  _modal.classList.add('active');
}

/**
 * Opens the editor for a new feature (after geometry is drawn).
 * @param {string} geomType - GeoJSON geometry type
 * @param {{ onSave: (props) => void }} callbacks
 */
export function openNewFeatureEditor(geomType, { onSave } = {}) {
  ensureModal();
  document.getElementById('fe-title').textContent = 'Add New Feature';
  _renderForm({}, geomType, true, onSave, null);
  _modal.classList.add('active');
}

// ── Form render ──────────────────────────────────────────────────────

function _renderForm(props, geomType, isNew, onSave, onDelete) {
  const body = document.getElementById('fe-body');

  const customProps = Object.entries(props).filter(
    ([k]) => !STANDARD_KEY_SET.has(k) && !METADATA_KEYS.has(k)
  );

  let html = `<div style="padding:16px">`;

  // Geometry badge
  html += `<div style="font-size:12px;color:var(--text-secondary);margin-bottom:14px;padding:5px 10px;background:var(--gray-50,#f8f9fa);border-radius:4px;display:inline-flex;align-items:center;gap:6px">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
    Geometry: <strong>${geomType}</strong>
  </div>`;

  html += `<form id="fe-form">`;

  // Standard fields section
  html += `<div style="font-weight:700;font-size:11px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">NBSAP Standard Fields</div>`;

  for (const f of FIELD_DEFS) {
    const val = props[f.key] ?? '';
    const req = f.required ? ' <span style="color:var(--danger)">*</span>' : '';
    html += `<div style="margin-bottom:10px">
      <label style="font-size:12px;font-weight:600;display:block;margin-bottom:3px">${f.label}${req}</label>`;

    if (f.type === 'select') {
      html += `<select name="${f.key}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:13px">
        ${f.options.map(o => `<option value="${_ea(o)}" ${String(val) === o ? 'selected' : ''}>${o || '(none)'}</option>`).join('')}
      </select>`;
    } else if (f.type === 'textarea') {
      html += `<textarea name="${f.key}" rows="2" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:13px;resize:vertical;box-sizing:border-box">${_eh(val)}</textarea>`;
    } else {
      html += `<input type="${f.type}" name="${f.key}" value="${_ea(val)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:13px;box-sizing:border-box">`;
    }
    html += `</div>`;
  }

  // Custom / extra attributes
  if (customProps.length > 0) {
    html += `<div style="font-weight:700;font-size:11px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.6px;margin:14px 0 10px">Other Attributes</div>`;
    for (const [k, v] of customProps) {
      html += `<div style="margin-bottom:8px">
        <label style="font-size:12px;font-weight:600;display:block;margin-bottom:3px">${_eh(k)}</label>
        <input type="text" name="__custom__${_ea(k)}" value="${_ea(String(v ?? ''))}" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;box-sizing:border-box">
      </div>`;
    }
  }

  // Action buttons
  html += `<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;padding-top:12px;border-top:1px solid var(--border)">`;
  if (!isNew && onDelete) {
    html += `<button type="button" class="btn btn-sm btn-danger" id="fe-delete" style="margin-right:auto">Delete Feature</button>`;
  }
  html += `<button type="button" class="btn btn-sm btn-outline" id="fe-cancel">Cancel</button>
    <button type="submit" class="btn btn-sm btn-primary">${isNew ? 'Add Feature' : 'Save Changes'}</button>
  </div></form></div>`;

  body.innerHTML = html;

  // Events
  document.getElementById('fe-cancel').addEventListener('click', closeFeatureEditor);

  if (!isNew && onDelete) {
    document.getElementById('fe-delete').addEventListener('click', async () => {
      const ok = await showConfirm(
        'Delete this feature? This cannot be undone.',
        { title: 'Delete Feature', okLabel: 'Delete', danger: true }
      );
      if (ok) { closeFeatureEditor(); onDelete(); }
    });
  }

  document.getElementById('fe-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {};

    for (const f of FIELD_DEFS) {
      const el = form.elements[f.key];
      if (!el) continue;
      const raw = el.value.trim();
      updated[f.key] = (f.type === 'number' && raw !== '') ? Number(raw) : (raw || null);
    }

    // Preserve targets and metadata keys from original props
    updated.targets = props.targets ?? [];
    for (const k of METADATA_KEYS) {
      if (props[k] != null) updated[k] = props[k];
    }

    // Custom props
    for (const [k] of customProps) {
      const el = form.elements[`__custom__${k}`];
      if (el) updated[k] = el.value;
    }

    closeFeatureEditor();
    onSave?.(updated);
  });
}

// ── Helpers ───────────────────────────────────────────────────────────

function _eh(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function _ea(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
