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
    if (v) seen.add(v);
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
  const types    = getUniqueValues(layerData, 'type');
  const statuses = getUniqueValues(layerData, 'status');
  const hasCategories = types.length > 0 || statuses.length > 0;

  // Resolve current values (override → default)
  const mode     = existing?.mode || 'single';
  const fill     = existing?.fillColor    || defaultColors.fill;
  const stroke   = existing?.strokeColor  || defaultColors.stroke;
  const opacity  = existing?.fillOpacity  ?? 0.45;
  const weight   = existing?.weight       ?? 2.5;
  const dash     = existing?.dashArray    || '';
  const radius   = existing?.pointRadius  ?? 6;

  const singleActive = mode === 'single'      ? 'active' : '';
  const catActive    = mode === 'categorized' ? 'active' : '';

  // Tabs
  let tabs = `<button class="sym-tab ${singleActive}" data-tab="single">Simple</button>`;
  if (hasCategories) {
    tabs += `<button class="sym-tab ${catActive}" data-tab="categorized">Categorized</button>`;
  }

  // Preview dash style CSS
  const dashCSS = dash ? 'dashed' : 'solid';

  // Simple tab
  const simpleTab = `
    <div class="sym-tab-content ${singleActive}" data-content="single">
      <div class="sym-field">
        <label>Fill Color</label>
        <div class="sym-color-row">
          <input type="color" class="sym-color" id="sym-fill" value="${fill}">
          <span class="sym-color-hex">${fill}</span>
        </div>
      </div>
      <div class="sym-field">
        <label>Fill Opacity</label>
        <div class="sym-slider-row">
          <input type="range" class="sym-slider" id="sym-opacity" min="0" max="1" step="0.05" value="${opacity}">
          <span class="sym-slider-val">${Math.round(opacity * 100)}%</span>
        </div>
      </div>
      <div class="sym-field">
        <label>Stroke Color</label>
        <div class="sym-color-row">
          <input type="color" class="sym-color" id="sym-stroke" value="${stroke}">
          <span class="sym-color-hex">${stroke}</span>
        </div>
      </div>
      <div class="sym-field">
        <label>Stroke Width</label>
        <div class="sym-slider-row">
          <input type="range" class="sym-slider" id="sym-weight" min="0.5" max="8" step="0.5" value="${weight}">
          <span class="sym-slider-val">${weight}px</span>
        </div>
      </div>
      <div class="sym-field">
        <label>Stroke Style</label>
        <select class="sym-select" id="sym-dash">
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
        <div class="sym-preview-swatch" id="sym-preview"
          style="background:${fill};border:${weight}px ${dashCSS} ${stroke};opacity:${Math.min(opacity + 0.55, 1)}">
        </div>
        <span class="sym-preview-label">Preview</span>
      </div>
    </div>`;

  // Categorized tab
  let catTab = '';
  if (hasCategories) {
    const catBy        = existing?.categoryBy || (types.length > 0 ? 'type' : 'status');
    const items        = catBy === 'status' ? statuses : types;
    const catColors    = existing?.categoryColors || {};

    const typeActive   = catBy === 'type'   ? 'active' : '';
    const statusActive = catBy === 'status' ? 'active' : '';

    const groupByBtns = (types.length > 0 && statuses.length > 0) ? `
      <div class="sym-field">
        <label>Categorize by</label>
        <div class="sym-btn-group">
          <button class="sym-grp-btn ${typeActive}"   data-groupby="type">Type</button>
          <button class="sym-grp-btn ${statusActive}" data-groupby="status">Status</button>
        </div>
      </div>` : '';

    catTab = `
      <div class="sym-tab-content ${catActive}" data-content="categorized">
        ${groupByBtns}
        <div class="sym-cat-list" data-groupby="${catBy}">
          ${buildCatRows(items, cat, catColors)}
        </div>
      </div>`;
  }

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
      ${simpleTab}
      ${catTab}
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

  // Group-by (categorized tab)
  panel.querySelectorAll('.sym-grp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('.sym-grp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      rebuildCatList(panel, layerData, btn.dataset.groupby);
    });
  });

  // Live preview
  const fillInput    = panel.querySelector('#sym-fill');
  const strokeInput  = panel.querySelector('#sym-stroke');
  const opacityInput = panel.querySelector('#sym-opacity');
  const weightInput  = panel.querySelector('#sym-weight');
  const dashSel      = panel.querySelector('#sym-dash');
  const preview      = panel.querySelector('#sym-preview');

  function updatePreview() {
    if (!preview || !fillInput) return;
    const f  = fillInput.value;
    const s  = strokeInput?.value || '#000';
    const o  = parseFloat(opacityInput?.value ?? 0.45);
    const w  = parseFloat(weightInput?.value  ?? 2.5);
    const isDashed = dashSel && dashSel.value !== '';
    preview.style.background  = f;
    preview.style.border      = `${w}px ${isDashed ? 'dashed' : 'solid'} ${s}`;
    preview.style.opacity     = Math.min(o + 0.55, 1);
  }

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

    if (activeTab === 'single') {
      const isPoint = hasPointGeometry(layerData);
      const styleObj = {
        mode:        'single',
        fillColor:   fillInput?.value   || resolveColors(layerData.metadata.category || 'OTHER').fill,
        strokeColor: strokeInput?.value || resolveColors(layerData.metadata.category || 'OTHER').stroke,
        fillOpacity: parseFloat(opacityInput?.value ?? 0.45),
        weight:      parseFloat(weightInput?.value  ?? 2.5),
        dashArray:   dashSel?.value || null,
      };
      if (isPoint) {
        const r = panel.querySelector('#sym-radius');
        if (r) styleObj.pointRadius = parseFloat(r.value);
      }
      setLayerStyle(layerData.id, styleObj);
    } else {
      const groupByBtn = panel.querySelector('.sym-grp-btn.active');
      const catList    = panel.querySelector('.sym-cat-list');
      const catBy      = groupByBtn?.dataset.groupby || catList?.dataset.groupby || 'type';
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

function rebuildCatList(panel, layerData, groupBy) {
  const meta      = layerData.metadata;
  const cat       = meta.category || 'OTHER';
  const existing  = getLayerStyle(layerData.id);
  const catColors = existing?.categoryColors || {};
  const items     = getUniqueValues(layerData, groupBy === 'status' ? 'status' : 'type');

  const catList = panel.querySelector('.sym-cat-list');
  if (catList) {
    catList.dataset.groupby = groupBy;
    catList.innerHTML = buildCatRows(items, cat, catColors);
    bindCatColorEvents(panel);
  }
}
