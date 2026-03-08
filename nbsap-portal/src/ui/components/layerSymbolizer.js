/**
 * Layer Symbolizer Panel.
 *
 * Opens a floating panel (similar to QGIS Layer Properties › Symbology) that
 * lets users customise the appearance of any map layer.  Supports two modes:
 *
 *   Simple      — one fill colour, stroke colour, opacity, width, and dash
 *                 pattern for all features in the layer.
 *   Categorized — per-value colour overrides, grouped by "type" or "status".
 *
 * Changes are applied live to the map via the onApply callback.
 * Overrides are persisted in localStorage through the symbolizer store.
 */

import { getLayerStyle, setLayerStyle, resetLayerStyle } from '../../config/symbolizer.js';
import { resolveColors } from '../../config/symbology.js';
import { CATEGORIES } from '../../config/categories.js';
import { isAdmin } from '../../services/auth/index.js';

let _panel = null;
let _currentLayerId = null;
let _onApply = null;

const DASH_OPTIONS = [
  { label: 'Solid',     value: '' },
  { label: 'Dashed',    value: '8 4' },
  { label: 'Short dash',value: '6 4' },
  { label: 'Dotted',    value: '2 4' },
  { label: 'Dash-dot',  value: '10 4 2 4' },
];

// ── Helpers ────────────────────────────────────────────────────────────

function hasPointGeometry(layerData) {
  return !!(layerData.geojson?.features?.some(
    f => f.geometry?.type === 'Point' || f.geometry?.type === 'MultiPoint'
  ));
}

function getUniqueValues(layerData, prop) {
  if (!layerData.geojson?.features) return [];
  const seen = new Set();
  for (const f of layerData.geojson.features) {
    const v = f.properties?.[prop];
    if (v !== undefined && v !== null && v !== '') seen.add(String(v));
  }
  return [...seen].sort();
}

function getAttributeColumns(layerData) {
  if (!layerData.geojson?.features?.length) return [];
  const seen = new Set();
  for (const f of layerData.geojson.features) {
    if (f.properties) Object.keys(f.properties).forEach(k => seen.add(k));
  }
  return [...seen].sort();
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Opens (or closes if already open for the same layer) the symbolizer panel.
 *
 * @param {object}   layerData - Layer data object {id, metadata, geojson}
 * @param {Function} onApply   - Called after the user applies or resets
 * @param {HTMLElement} [anchorEl] - Optional button element for positioning hint
 */
export function openSymbolizer(layerData, onApply, anchorEl) {
  if (_panel && _currentLayerId === layerData.id) {
    closeSymbolizer();
    return;
  }
  closeSymbolizer();

  _currentLayerId = layerData.id;
  _onApply = onApply;

  _panel = document.createElement('div');
  _panel.className = 'sym-panel';
  _panel.innerHTML = buildPanelHTML(layerData);
  document.body.appendChild(_panel);
  bindPanelEvents(_panel, layerData);
}

/** Closes the symbolizer panel without applying. */
export function closeSymbolizer() {
  if (_panel) {
    _panel.remove();
    _panel = null;
  }
  _currentLayerId = null;
  _onApply = null;
}

/** Returns the layerId whose panel is currently open, or null. */
export function getOpenSymbolizerLayerId() {
  return _currentLayerId;
}

// ── HTML builders ──────────────────────────────────────────────────────

function buildPanelHTML(layerData) {
  const meta = layerData.metadata;
  const cat  = meta.category || 'OTHER';
  const name = meta.name || 'Unnamed Layer';

  const existing     = getLayerStyle(layerData.id);
  const defaultColors = resolveColors(cat);

  const isPoint  = hasPointGeometry(layerData);
  const columns  = getAttributeColumns(layerData);
  const hasCategories = columns.length > 0;

  // Resolve current values (override → default)
  const mode            = existing?.mode || 'single';
  const fill            = existing?.fillColor    || defaultColors.fill;
  const stroke          = existing?.strokeColor  || defaultColors.stroke;
  const opacity         = existing?.fillOpacity  ?? 0.45;
  const weight          = existing?.weight       ?? 2.5;
  const dash            = existing?.dashArray    || '';
  const radius          = existing?.pointRadius  ?? 6;
  const fillTransparent   = existing?.fillTransparent   || false;
  const strokeTransparent = existing?.strokeTransparent || false;

  const admin        = isAdmin();
  const singleActive = (mode !== 'categorized' && mode !== 'labels') ? 'active' : '';
  const catActive    = mode === 'categorized' ? 'active' : '';

  // Tabs — Simple and Categorized are admin-only; Labels is available to all
  let tabs = '';
  if (admin) {
    tabs += `<button class="sym-tab ${singleActive}" data-tab="single">Simple</button>`;
    if (hasCategories) {
      tabs += `<button class="sym-tab ${catActive}" data-tab="categorized">Categorized</button>`;
    }
  }

  // Preview dash style CSS
  const dashCSS = dash ? 'dashed' : 'solid';
  const previewBg     = fillTransparent   ? 'transparent'                                   : fill;
  const previewBorder = strokeTransparent ? 'none'                                           : `${weight}px ${dashCSS} ${stroke}`;
  const previewOpacity = fillTransparent  ? ''                                               : `opacity:${Math.min(opacity + 0.55, 1)}`;
  const fillDisabled   = fillTransparent   ? 'disabled' : '';
  const strokeDisabled = strokeTransparent ? 'disabled' : '';
  const fillGrpClass   = fillTransparent   ? 'sym-field sym-field-disabled' : 'sym-field';
  const strokeGrpClass = strokeTransparent ? 'sym-field sym-field-disabled' : 'sym-field';

  // Simple tab
  const simpleTab = `
    <div class="sym-tab-content ${singleActive}" data-content="single">
      <div class="${fillGrpClass}" id="sym-fill-group">
        <label>Fill Color
          <label class="sym-check-label"><input type="checkbox" id="sym-fill-none" ${fillTransparent ? 'checked' : ''}> No fill</label>
        </label>
        <div class="sym-color-row">
          <input type="color" class="sym-color" id="sym-fill" value="${fill}" ${fillDisabled}>
          <span class="sym-color-hex">${fill}</span>
        </div>
      </div>
      <div class="${fillGrpClass}" id="sym-opacity-group">
        <label>Fill Opacity</label>
        <div class="sym-slider-row">
          <input type="range" class="sym-slider" id="sym-opacity" min="0" max="1" step="0.05" value="${opacity}" ${fillDisabled}>
          <span class="sym-slider-val">${Math.round(opacity * 100)}%</span>
        </div>
      </div>
      <div class="${strokeGrpClass}" id="sym-stroke-group">
        <label>Stroke Color
          <label class="sym-check-label"><input type="checkbox" id="sym-stroke-none" ${strokeTransparent ? 'checked' : ''}> No stroke</label>
        </label>
        <div class="sym-color-row">
          <input type="color" class="sym-color" id="sym-stroke" value="${stroke}" ${strokeDisabled}>
          <span class="sym-color-hex">${stroke}</span>
        </div>
      </div>
      <div class="${strokeGrpClass}" id="sym-weight-group">
        <label>Stroke Width</label>
        <div class="sym-slider-row">
          <input type="range" class="sym-slider" id="sym-weight" min="0.5" max="8" step="0.5" value="${weight}" ${strokeDisabled}>
          <span class="sym-slider-val">${weight}px</span>
        </div>
      </div>
      <div class="${strokeGrpClass}" id="sym-dash-group">
        <label>Stroke Style</label>
        <select class="sym-select" id="sym-dash" ${strokeDisabled}>
          ${DASH_OPTIONS.map(o =>
            `<option value="${o.value}" ${dash === o.value ? 'selected' : ''}>${o.label}</option>`
          ).join('')}
        </select>
      </div>
      ${isPoint ? `
      <div class="sym-field">
        <label>Point Size</label>
        <div class="sym-slider-row">
          <input type="range" class="sym-slider" id="sym-radius" min="3" max="20" step="1" value="${radius}">
          <span class="sym-slider-val">${radius}px</span>
        </div>
      </div>` : ''}
      <div class="sym-preview-row">
        <div class="sym-preview-swatch ${fillTransparent ? 'sym-preview-transparent' : ''}" id="sym-preview"
          style="background:${previewBg};border:${previewBorder};${previewOpacity}">
        </div>
        <span class="sym-preview-label">Preview</span>
      </div>
    </div>`;

  // Categorized tab
  let catTab = '';
  if (hasCategories) {
    const catBy     = existing?.categoryBy && columns.includes(existing.categoryBy)
      ? existing.categoryBy
      : (columns[0] || '');
    const items     = getUniqueValues(layerData, catBy);
    const catColors = existing?.categoryColors || {};

    const colOptions = columns.map(c =>
      `<option value="${c}" ${catBy === c ? 'selected' : ''}>${c}</option>`
    ).join('');

    catTab = `
      <div class="sym-tab-content ${catActive}" data-content="categorized">
        <div class="sym-field">
          <label>Categorize by column</label>
          <select class="sym-select" id="sym-col-select">
            ${colOptions}
          </select>
        </div>
        <div class="sym-cat-list" data-groupby="${catBy}">
          ${buildCatRows(items, cat, catColors)}
        </div>
      </div>`;
  }

  // Labels tab — active by default for non-admins
  const labelsActive = (!admin || mode === 'labels') ? 'active' : '';
  tabs += `<button class="sym-tab ${labelsActive}" data-tab="labels">Labels</button>`;
  const labelTab = buildLabelTabHTML(columns, existing, !admin);

  return `
    <div class="sym-header">
      <div class="sym-title">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;opacity:0.9">
          <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/>
          <circle cx="8.5"  cy="7.5"  r="0.5" fill="currentColor"/>
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5l-4 .5.5-4Z"/>
        </svg>
        Symbolize
      </div>
      <span class="sym-layer-name" title="${name}">${name}</span>
      <button class="sym-close" title="Close">×</button>
    </div>
    <div class="sym-tabs">${tabs}</div>
    <div class="sym-body">
      ${admin ? simpleTab : ''}
      ${admin ? catTab : ''}
      ${labelTab}
    </div>
    <div class="sym-footer">
      <button class="sym-btn sym-btn-reset">Reset Default</button>
      <button class="sym-btn sym-btn-apply">Apply</button>
    </div>`;
}

function buildCatRows(items, cat, catColors) {
  if (items.length === 0) {
    return '<p class="sym-no-types">No values found in layer data.</p>';
  }
  return items.map(val => {
    const defaults = resolveColors(cat, val);
    const oFill   = catColors[val]?.fillColor   || defaults.fill;
    const oStroke = catColors[val]?.strokeColor || defaults.stroke;
    return `
      <div class="sym-cat-row" data-type="${val}">
        <span class="sym-cat-swatch" style="background:${oFill};border:2px solid ${oStroke}"></span>
        <span class="sym-cat-label" title="${val}">${val}</span>
        <input type="color" class="sym-cat-fill"   value="${oFill}"   title="Fill color">
        <input type="color" class="sym-cat-stroke" value="${oStroke}" title="Stroke color">
      </div>`;
  }).join('');
}

function buildLabelTabHTML(columns, existing, activeByDefault = false) {
  const lbl         = existing?.labels || {};
  const enabled     = lbl.enabled     || false;
  const field       = (lbl.field && columns.includes(lbl.field)) ? lbl.field : (columns[0] || 'name');
  const fontSize    = lbl.fontSize    ?? 11;
  const fontColor   = lbl.fontColor   || '#222222';
  const bufferSize  = lbl.bufferSize  ?? 2;
  const bufferColor = lbl.bufferColor || '#ffffff';
  const disabledAttr = enabled ? '' : 'disabled';
  const controlsClass = enabled ? 'sym-field' : 'sym-field sym-field-disabled';

  const colOptions = columns.length > 0
    ? columns.map(c => `<option value="${c}" ${field === c ? 'selected' : ''}>${c}</option>`).join('')
    : '<option value="name">name</option>';

  return `
    <div class="sym-tab-content ${activeByDefault ? 'active' : ''}" data-content="labels">
      <div class="sym-field">
        <label>Show Labels
          <label class="sym-check-label" style="float:right">
            <input type="checkbox" id="sym-label-enabled" ${enabled ? 'checked' : ''}> On
          </label>
        </label>
      </div>
      <div class="${controlsClass}" id="sym-label-field-group">
        <label>Label Field</label>
        <select class="sym-select" id="sym-label-field" ${disabledAttr}>
          ${colOptions}
        </select>
      </div>
      <div class="${controlsClass}" id="sym-label-size-group">
        <label>Font Size</label>
        <div class="sym-slider-row">
          <input type="range" class="sym-slider" id="sym-label-size" min="8" max="24" step="1" value="${fontSize}" ${disabledAttr}>
          <span class="sym-slider-val">${fontSize}px</span>
        </div>
      </div>
      <div class="${controlsClass}" id="sym-label-color-group">
        <label>Font Color</label>
        <div class="sym-color-row">
          <input type="color" class="sym-color" id="sym-label-color" value="${fontColor}" ${disabledAttr}>
          <span class="sym-color-hex">${fontColor}</span>
        </div>
      </div>
      <div class="${controlsClass}" id="sym-label-buf-group">
        <label>Buffer Size</label>
        <div class="sym-slider-row">
          <input type="range" class="sym-slider" id="sym-label-bufsize" min="0" max="5" step="1" value="${bufferSize}" ${disabledAttr}>
          <span class="sym-slider-val">${bufferSize}px</span>
        </div>
      </div>
      <div class="${controlsClass}" id="sym-label-bufcol-group">
        <label>Buffer Color</label>
        <div class="sym-color-row">
          <input type="color" class="sym-color" id="sym-label-bufcolor" value="${bufferColor}" ${disabledAttr}>
          <span class="sym-color-hex">${bufferColor}</span>
        </div>
      </div>
      <div class="sym-label-preview-row" id="sym-label-preview-row">
        <span class="sym-label-preview-text" id="sym-label-preview-text"
          style="font-size:${fontSize}px;color:${fontColor};${buildTextHaloCSS(bufferSize, bufferColor)}">
          Label Preview
        </span>
      </div>
    </div>`;
}

function buildTextHaloCSS(bufferSize, bufferColor) {
  if (!bufferSize || bufferSize <= 0) return '';
  const b = bufferSize;
  const c = bufferColor;
  return `text-shadow:${-b}px ${-b}px ${b}px ${c},${b}px ${-b}px ${b}px ${c},${-b}px ${b}px ${b}px ${c},${b}px ${b}px ${b}px ${c},${-b}px 0 ${b}px ${c},${b}px 0 ${b}px ${c},0 ${-b}px ${b}px ${c},0 ${b}px ${b}px ${c};`;
}

// ── Event binding ──────────────────────────────────────────────────────

function bindPanelEvents(panel, layerData) {
  // Close
  panel.querySelector('.sym-close').addEventListener('click', closeSymbolizer);

  // Tabs
  panel.querySelectorAll('.sym-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      panel.querySelectorAll('.sym-tab').forEach(t => t.classList.remove('active'));
      panel.querySelectorAll('.sym-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      panel.querySelector(`[data-content="${tab.dataset.tab}"]`)?.classList.add('active');
    });
  });

  // Column selector (categorized tab)
  panel.querySelector('#sym-col-select')?.addEventListener('change', (e) => {
    rebuildCatList(panel, layerData, e.target.value);
  });

  // Live preview
  const fillInput      = panel.querySelector('#sym-fill');
  const strokeInput    = panel.querySelector('#sym-stroke');
  const opacityInput   = panel.querySelector('#sym-opacity');
  const weightInput    = panel.querySelector('#sym-weight');
  const dashSel        = panel.querySelector('#sym-dash');
  const preview        = panel.querySelector('#sym-preview');
  const fillNoneChk    = panel.querySelector('#sym-fill-none');
  const strokeNoneChk  = panel.querySelector('#sym-stroke-none');

  function setGroupDisabled(groupIds, disabled) {
    groupIds.forEach(id => {
      const el = panel.querySelector(`#${id}`);
      if (!el) return;
      el.classList.toggle('sym-field-disabled', disabled);
      el.querySelectorAll('input:not([type=checkbox]), select').forEach(i => { i.disabled = disabled; });
    });
  }

  function updatePreview() {
    if (!preview) return;
    const noFill   = fillNoneChk?.checked;
    const noStroke = strokeNoneChk?.checked;
    const f  = fillInput?.value || '#ccc';
    const s  = strokeInput?.value || '#000';
    const o  = parseFloat(opacityInput?.value ?? 0.45);
    const w  = parseFloat(weightInput?.value  ?? 2.5);
    const isDashed = dashSel && dashSel.value !== '';

    preview.classList.toggle('sym-preview-transparent', noFill);
    preview.style.background = noFill   ? 'transparent'                                    : f;
    preview.style.border     = noStroke ? 'none'                                            : `${w}px ${isDashed ? 'dashed' : 'solid'} ${s}`;
    preview.style.opacity    = noFill   ? ''                                                : String(Math.min(o + 0.55, 1));
  }

  fillNoneChk?.addEventListener('change', () => {
    setGroupDisabled(['sym-fill-group', 'sym-opacity-group'], fillNoneChk.checked);
    updatePreview();
  });
  strokeNoneChk?.addEventListener('change', () => {
    setGroupDisabled(['sym-stroke-group', 'sym-weight-group', 'sym-dash-group'], strokeNoneChk.checked);
    updatePreview();
  });

  // Color inputs
  panel.querySelectorAll('.sym-color').forEach(input => {
    input.addEventListener('input', () => {
      const hex = input.nextElementSibling;
      if (hex) hex.textContent = input.value;
      updatePreview();
    });
  });

  // Sliders
  panel.querySelectorAll('.sym-slider').forEach(slider => {
    slider.addEventListener('input', () => {
      const val = slider.nextElementSibling;
      if (val) {
        val.textContent = slider.id === 'sym-opacity'
          ? Math.round(parseFloat(slider.value) * 100) + '%'
          : slider.value + 'px';
      }
      updatePreview();
    });
  });

  dashSel?.addEventListener('change', updatePreview);

  // ── Labels tab events ──────────────────────────────────────────────
  const labelEnabled = panel.querySelector('#sym-label-enabled');
  const labelControls = [
    'sym-label-field-group', 'sym-label-size-group',
    'sym-label-color-group', 'sym-label-buf-group', 'sym-label-bufcol-group'
  ];

  function updateLabelPreview() {
    const txt  = panel.querySelector('#sym-label-preview-text');
    if (!txt) return;
    const sz   = panel.querySelector('#sym-label-size')?.value || 11;
    const col  = panel.querySelector('#sym-label-color')?.value || '#222222';
    const bsz  = parseInt(panel.querySelector('#sym-label-bufsize')?.value ?? 2, 10);
    const bcol = panel.querySelector('#sym-label-bufcolor')?.value || '#ffffff';
    txt.style.fontSize   = sz + 'px';
    txt.style.color      = col;
    txt.style.cssText += buildTextHaloCSS(bsz, bcol);
  }

  labelEnabled?.addEventListener('change', () => {
    const on = labelEnabled.checked;
    labelControls.forEach(id => {
      const el = panel.querySelector(`#${id}`);
      if (!el) return;
      el.classList.toggle('sym-field-disabled', !on);
      el.querySelectorAll('input:not([type=checkbox]), select').forEach(i => { i.disabled = !on; });
    });
    updateLabelPreview();
  });

  panel.querySelector('#sym-label-size')?.addEventListener('input', (e) => {
    const val = e.target.nextElementSibling;
    if (val) val.textContent = e.target.value + 'px';
    updateLabelPreview();
  });
  panel.querySelector('#sym-label-bufsize')?.addEventListener('input', (e) => {
    const val = e.target.nextElementSibling;
    if (val) val.textContent = e.target.value + 'px';
    updateLabelPreview();
  });
  panel.querySelector('#sym-label-color')?.addEventListener('input', (e) => {
    const hex = e.target.nextElementSibling;
    if (hex) hex.textContent = e.target.value;
    updateLabelPreview();
  });
  panel.querySelector('#sym-label-bufcolor')?.addEventListener('input', (e) => {
    const hex = e.target.nextElementSibling;
    if (hex) hex.textContent = e.target.value;
    updateLabelPreview();
  });

  // Categorized color pickers — live swatch
  bindCatColorEvents(panel);

  // Reset
  panel.querySelector('.sym-btn-reset').addEventListener('click', () => {
    resetLayerStyle(layerData.id);
    if (_onApply) _onApply();
    closeSymbolizer();
  });

  // Apply
  panel.querySelector('.sym-btn-apply').addEventListener('click', () => {
    const activeTab = panel.querySelector('.sym-tab.active')?.dataset.tab || 'single';

    // Collect label config regardless of active tab (persisted across tabs)
    const labelEnabledEl  = panel.querySelector('#sym-label-enabled');
    const labelFieldEl    = panel.querySelector('#sym-label-field');
    const labelSizeEl     = panel.querySelector('#sym-label-size');
    const labelColorEl    = panel.querySelector('#sym-label-color');
    const labelBufSizeEl  = panel.querySelector('#sym-label-bufsize');
    const labelBufColorEl = panel.querySelector('#sym-label-bufcolor');
    const labelConfig = {
      enabled:     labelEnabledEl?.checked   || false,
      field:       labelFieldEl?.value       || 'name',
      fontSize:    parseInt(labelSizeEl?.value  ?? 11, 10),
      fontColor:   labelColorEl?.value       || '#222222',
      bufferSize:  parseInt(labelBufSizeEl?.value ?? 2, 10),
      bufferColor: labelBufColorEl?.value    || '#ffffff',
    };

    if (activeTab === 'single') {
      const isPoint = hasPointGeometry(layerData);
      const styleObj = {
        mode:             'single',
        fillColor:        fillInput?.value   || resolveColors(layerData.metadata.category || 'OTHER').fill,
        strokeColor:      strokeInput?.value || resolveColors(layerData.metadata.category || 'OTHER').stroke,
        fillOpacity:      parseFloat(opacityInput?.value ?? 0.45),
        weight:           parseFloat(weightInput?.value  ?? 2.5),
        dashArray:        dashSel?.value || null,
        fillTransparent:   fillNoneChk?.checked   || false,
        strokeTransparent: strokeNoneChk?.checked || false,
        labels:           labelConfig,
      };
      if (isPoint) {
        const r = panel.querySelector('#sym-radius');
        if (r) styleObj.pointRadius = parseFloat(r.value);
      }
      setLayerStyle(layerData.id, styleObj);
    } else if (activeTab === 'labels') {
      // Save only label config (preserve existing fill/stroke override if any)
      const existing = getLayerStyle(layerData.id) || { mode: 'single' };
      setLayerStyle(layerData.id, { ...existing, labels: labelConfig });
    } else {
      const catList = panel.querySelector('.sym-cat-list');
      const catBy   = panel.querySelector('#sym-col-select')?.value || catList?.dataset.groupby || 'type';
      const categoryColors = {};

      panel.querySelectorAll('.sym-cat-row').forEach(row => {
        const typeVal = row.dataset.type;
        const fillVal   = row.querySelector('.sym-cat-fill')?.value;
        const strokeVal = row.querySelector('.sym-cat-stroke')?.value;
        if (typeVal && fillVal) {
          categoryColors[typeVal] = { fillColor: fillVal, strokeColor: strokeVal };
        }
      });

      setLayerStyle(layerData.id, {
        mode: 'categorized',
        categoryBy,
        categoryColors,
        labels: labelConfig,
      });
    }

    if (_onApply) _onApply();
  });
}

function bindCatColorEvents(panel) {
  panel.querySelectorAll('.sym-cat-fill, .sym-cat-stroke').forEach(input => {
    input.addEventListener('input', () => {
      const row    = input.closest('.sym-cat-row');
      const swatch = row?.querySelector('.sym-cat-swatch');
      if (!swatch) return;
      swatch.style.background  = row.querySelector('.sym-cat-fill').value;
      swatch.style.borderColor = row.querySelector('.sym-cat-stroke').value;
    });
  });
}

function rebuildCatList(panel, layerData, column) {
  const meta      = layerData.metadata;
  const cat       = meta.category || 'OTHER';
  const existing  = getLayerStyle(layerData.id);
  const catColors = existing?.categoryColors || {};
  const items     = getUniqueValues(layerData, column);

  const catList = panel.querySelector('.sym-cat-list');
  if (catList) {
    catList.dataset.groupby = column;
    catList.innerHTML = buildCatRows(items, cat, catColors);
    bindCatColorEvents(panel);
  }
}
