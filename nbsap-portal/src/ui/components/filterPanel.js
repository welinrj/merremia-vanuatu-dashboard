/**
 * Filter Panel component.
 * Renders target, province, realm filters.
 * Dispatches filter change events to update map, KPIs, tables, and exports.
 */
import targetsConfig from '../../config/targets.js';
import { targetIcon } from '../../config/icons.js';
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
          ${targetsConfig.targets.map(t => {
            const sel = state.filters.targets.includes(t.code);
            const selStyle = sel ? `background:${t.color};border-color:${t.color};color:#fff` : '';
            return `
            <label class="target-checkbox ${sel ? 'selected' : ''}"
                   data-code="${t.code}" title="${t.description}"
                   style="${selStyle}">
              <input type="radio" name="nbsap-target" value="${t.code}" ${sel ? 'checked' : ''}>
              <span class="target-pill-icon">${targetIcon(t.code, 14)}</span>${t.code}
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
        <label>Realm</label>
        <select id="filter-realm">
          <option value="All" ${state.filters.realm === 'All' ? 'selected' : ''}>All</option>
          <option value="terrestrial" ${state.filters.realm === 'terrestrial' ? 'selected' : ''}>Terrestrial</option>
          <option value="marine" ${state.filters.realm === 'marine' ? 'selected' : ''}>Marine</option>
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

  // Realm filter
  container.querySelector('#filter-realm').addEventListener('change', (e) => {
    updateFilters({ realm: e.target.value });
  });

  // Clear button
  container.querySelector('#btn-clear-filters').addEventListener('click', () => {
    updateFilters({ targets: ['T3'], province: 'All', category: 'All', realm: 'All', year: 'All' });
  });
}
