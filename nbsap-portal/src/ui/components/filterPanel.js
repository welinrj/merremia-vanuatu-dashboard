/**
 * Filter Panel component.
 * Renders target, province, category, realm, and year filters.
 * Dispatches filter change events to update map, KPIs, tables, and exports.
 */
import targetsConfig from '../../config/targets.js';
import { CATEGORIES } from '../../config/categories.js';
import { getAppState, updateFilters } from '../state.js';

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
          ${targetsConfig.targets.map(t => `
            <label class="target-checkbox ${state.filters.targets.includes(t.code) ? 'selected' : ''}"
                   data-code="${t.code}" title="${t.description}">
              <input type="checkbox" value="${t.code}"
                     ${state.filters.targets.includes(t.code) ? 'checked' : ''}>
              ${t.code}
            </label>
          `).join('')}
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
            <option value="${key}" ${state.filters.category === key ? 'selected' : ''}>${val.label}</option>
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

  // Bind target checkbox events
  container.querySelectorAll('.target-checkbox').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const code = el.dataset.code;
      const current = [...state.filters.targets];
      const idx = current.indexOf(code);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        current.push(code);
      }
      updateFilters({ targets: current });
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
    updateFilters({ targets: [], province: 'All', category: 'All', realm: 'All', year: 'All' });
  });

  // Populate year dropdown from loaded layers
  populateYearFilter(container.querySelector('#filter-year'), state);
}

function populateYearFilter(select, state) {
  const years = new Set();
  for (const layer of (state.layers || [])) {
    for (const f of (layer.geojson?.features || [])) {
      if (f.properties.year) years.add(f.properties.year);
    }
  }
  const sorted = [...years].sort((a, b) => b - a);
  for (const y of sorted) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    if (state.filters.year === String(y)) opt.selected = true;
    select.appendChild(opt);
  }
}
