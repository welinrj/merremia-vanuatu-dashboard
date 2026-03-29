/**
 * Filter Panel component.
 * Renders target, province, realm filters.
 * Dispatches filter change events to update map, KPIs, tables, and exports.
 */
import targetsConfig from '../../config/targets.js';
import { targetIcon } from '../../config/icons.js';
import { getAppState, updateFilters, getDashboardLayers } from '../state.js';
import { compute30x30Metrics, computeTarget1Metrics, computeTarget2Metrics, computeTargetMetrics, getMetricsCacheGen } from '../../gis/areaCalc.js';
import ENV from '../../config/env.js';

/**
 * Renders the filter panel into a container element.
 * @param {HTMLElement} container
 */
export function renderFilterPanel(container) {
  const state = getAppState();
  const provinces = state.provinces || [];
  const progress = _getTargetProgress();

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
            const p = progress[t.code];
            const pctText = p != null ? `${p.toFixed(1)}%` : '—';
            const barColor = sel ? 'rgba(255,255,255,0.4)' : t.color;
            const barWidth = p != null ? Math.min(p, 100) : 0;
            return `
            <label class="target-checkbox ${sel ? 'selected' : ''}"
                   data-code="${t.code}" title="${t.description}"
                   style="${selStyle}">
              <input type="radio" name="nbsap-target" value="${t.code}" ${sel ? 'checked' : ''}>
              <span class="target-pill-icon">${targetIcon(t.code, 14)}</span>
              <span class="target-pill-label">${t.code}</span>
              <span class="target-pill-pct">${pctText}</span>
              <span class="target-pill-bar" style="width:${barWidth}%;background:${barColor}"></span>
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

/* ── Target progress cache ─────────────────────────────────────────── */
let _progressCache = null;
let _progressLayerCount = -1;
let _progressMetricsGen = -1; // tracks metrics cache generation to detect GeoJSON loads

const ALL_FILTER = { targets: [], province: 'All', category: 'All', realm: 'All', year: 'All' };

const T4_SPECIES_KEYS = ['MEGAPODE', 'STARLING', 'FANTAIL', 'KINGFISHER', 'FLYING_FOX', 'PLERANDRA'];

/**
 * Returns { [targetCode]: number|null } — percentage achieved per target.
 * Cached until layer count changes.
 */
function _getTargetProgress() {
  const layers = getDashboardLayers();
  const metricsGen = getMetricsCacheGen();
  // Invalidate when layer count changes OR when metrics cache is busted
  // (which happens after GeoJSON loads, layer mutations, or filter changes).
  if (_progressCache && layers.length === _progressLayerCount && metricsGen === _progressMetricsGen) return _progressCache;
  _progressLayerCount = layers.length;
  _progressMetricsGen = metricsGen;

  const baselines = ENV.nationalBaselines;
  const progress = {};

  for (const t of targetsConfig.targets) {
    const hasLayers = layers.some(l => l.metadata?.targets?.includes(t.code));
    if (!hasLayers) { progress[t.code] = null; continue; }

    try {
      if (t.code === 'T3') {
        const m = compute30x30Metrics(layers, ALL_FILTER);
        const combined = baselines.terrestrial_ha + baselines.marine_ha;
        progress.T3 = combined > 0
          ? ((m.terrestrial_ha + m.marine_ha) / combined) * 100
          : 0;
      } else if (t.code === 'T1') {
        const m = computeTarget1Metrics(layers, ALL_FILTER);
        progress.T1 = m.total_pct || 0;
      } else if (t.code === 'T2') {
        const m = computeTarget2Metrics(layers, ALL_FILTER);
        progress.T2 = m.restoration_pct || 0;
      } else if (t.code === 'T4') {
        // Species mapped / total species
        const m = computeTargetMetrics(layers, 'T4', ALL_FILTER);
        const mapped = T4_SPECIES_KEYS.filter(k =>
          m.categoryBreakdown.some(c => c.category === k && c.features > 0)
        ).length;
        progress.T4 = (mapped / T4_SPECIES_KEYS.length) * 100;
      } else {
        // Targets without explicit goals: show province coverage (X/6 provinces)
        const m = computeTargetMetrics(layers, t.code, ALL_FILTER);
        const totalProvinces = 6;
        progress[t.code] = (m.provinceBreakdown.length / totalProvinces) * 100;
      }
    } catch (_) {
      progress[t.code] = null;
    }
  }

  _progressCache = progress;
  return progress;
}
