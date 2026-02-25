/**
 * Filter Panel component.
 * Renders target, province, category, realm, and year filters.
 * Dispatches filter change events to update map, KPIs, tables, and exports.
 */
import targetsConfig from '../../config/targets.js';
import { CATEGORIES } from '../../config/categories.js';
import { getAppState, updateFilters, getDashboardLayers } from '../state.js';

/**
 * Renders the filter panel into a container element.
 * @param {HTMLElement} container
 */
export function renderFilterPanel(container) {
  const state = getAppState();
  const provinces = state.provinces || [];

  container.innerHTML = `
    <div class="filter-panel">
      <div class="filter-panel-header">
        <span>Filters</span>
        <button class="btn btn-sm btn-outline" id="btn-clear-filters">Clear</button>
      </div>

      <div class="filter-group">
        <label>NBSAP Target</label>
        <div class="target-checkboxes" id="target-filter-checkboxes">
          ${targetsConfig.targets.map(t => {
            const sel = state.filters.targets.includes(t.code);
            const selStyle = sel ? `background:${t.color};border-color:${t.color};color:#fff` : '';
            return `
            <label class="target-checkbox ${sel ? 'selected' : ''}"
                   data-code="${t.code}" title="${t.description}"
                   style="${selStyle}">
              <input type="radio" name="nbsap-target" value="${t.code}" ${sel ? 'checked' : ''}>
              <span class="target-pill-icon">${t.icon || ''}</span>${t.code}
            </label>`;
          }).join('')}
        </div>
      </div>

      <div class="filter-group">
        <label>Province</label>
        <select id="filter-province">
          <option value="All">All Provinces</option>
          ${provinces.map(p => `
            <option value="${p}" ${state.filters.province === p ? 'selected' : ''}>${p}</option>
          `).join('')}
        </select>
      </div>

      <div class="filter-group">
        <label>Category</label>
        <select id="filter-category">
          <option value="All">All Categories</option>
          ${Object.entries(CATEGORIES).map(([key, val]) => `
            <option value="${key}" ${state.filters.category === key ? 'selected' : ''}>${val.icon || ''} ${val.label}</option>
          `).join('')}
        </select>
      </div>

      <div class="filter-group">
        <label>Realm</label>
        <select id="filter-realm">
          <option value="All" ${state.filters.realm === 'All' ? 'selected' : ''}>All</option>
          <option value="terrestrial" ${state.filters.realm === 'terrestrial' ? 'selected' : ''}>Terrestrial</option>
          <option value="marine" ${state.filters.realm === 'marine' ? 'selected' : ''}>Marine</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Year</label>
        <select id="filter-year">
          <option value="All">All Years</option>
        </select>
      </div>
    </div>
  `;

  // Bind target selection events (single target at a time)
  container.querySelectorAll('.target-checkbox').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const code = el.dataset.code;
      updateFilters({ targets: [code] });
    });
  });

  // Province filter
  container.querySelector('#filter-province').addEventListener('change', (e) => {
    updateFilters({ province: e.target.value });
  });

  // Category filter
  container.querySelector('#filter-category').addEventListener('change', (e) => {
    updateFilters({ category: e.target.value });
  });

  // Realm filter
  container.querySelector('#filter-realm').addEventListener('change', (e) => {
    updateFilters({ realm: e.target.value });
  });

  // Year filter
  container.querySelector('#filter-year').addEventListener('change', (e) => {
    updateFilters({ year: e.target.value });
  });

  // Clear button
  container.querySelector('#btn-clear-filters').addEventListener('click', () => {
    updateFilters({ targets: ['T3'], province: 'All', category: 'All', realm: 'All', year: 'All' });
  });

  // Populate year dropdown from loaded layers
  populateYearFilter(container.querySelector('#filter-year'), state);
}

/** Cached year set — invalidated when layers change (new render cycle). */
let _yearCache = null;
let _yearCacheLayerCount = -1;

function populateYearFilter(select, state) {
  const layers = getDashboardLayers();

  // Only rescan features when the layer count changes
  if (!_yearCache || _yearCacheLayerCount !== layers.length) {
    const years = new Set();
    for (const layer of layers) {
      // Check metadata year first (cheap)
      if (layer.metadata?.year) years.add(layer.metadata.year);
      // Only scan features if year set is still small (avoid full scan for large layers)
      const feats = layer.geojson?.features;
      if (!feats) continue;
      // Sample up to 200 features per layer to discover years — avoids scanning 50K+ features
      const limit = Math.min(feats.length, 200);
      for (let i = 0; i < limit; i++) {
        if (feats[i].properties.year) years.add(feats[i].properties.year);
      }
    }
    _yearCache = [...years].sort((a, b) => b - a);
    _yearCacheLayerCount = layers.length;
  }

  for (const y of _yearCache) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    if (state.filters.year === String(y)) opt.selected = true;
    select.appendChild(opt);
  }
}
