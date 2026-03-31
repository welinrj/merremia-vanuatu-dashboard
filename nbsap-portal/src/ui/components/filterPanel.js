/**
 * Filter Panel component.
 * Renders target, province, realm filters.
 * Dispatches filter change events to update map, KPIs, tables, and exports.
 *
 * Also manages URL-based deep links so any filtered view can be shared or
 * bookmarked.  URL params:
 *   ?t=T3          — active target code
 *   &prov=Shefa    — selected province (omitted when "All")
 *   &realm=marine  — selected realm   (omitted when "All")
 *   &yr=2023       — selected year    (omitted when "All")
 */
import targetsConfig from '../../config/targets.js';
import { targetIcon } from '../../config/icons.js';
import { getAppState, updateFilters, getDashboardLayers } from '../state.js';
import { compute30x30Metrics, computeTarget1Metrics, computeTarget2Metrics, computeTargetMetrics, getMetricsCacheGen } from '../../gis/areaCalc.js';
import ENV from '../../config/env.js';

// ── URL deep-link helpers ─────────────────────────────────────────────────────

/**
 * Reads filter values from the current URL search params.
 * Returns a partial filter object, or null if no relevant params are present.
 */
export function readFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  const out    = {};

  const t = params.get('t');
  if (t) out.targets = t.split(',').map(s => s.trim()).filter(Boolean);

  const prov = params.get('prov');
  if (prov) out.province = prov;

  const realm = params.get('realm');
  if (realm) out.realm = realm;

  const yr = params.get('yr');
  if (yr) out.year = yr;

  return Object.keys(out).length > 0 ? out : null;
}

/**
 * Writes the current filter state into the browser URL (no page reload).
 * Omits params that equal their default values so the URL stays clean.
 * @param {object} filters
 */
export function writeFiltersToURL(filters) {
  const params = new URLSearchParams();

  if (filters.targets && filters.targets.length > 0) {
    params.set('t', filters.targets.join(','));
  }
  if (filters.province && filters.province !== 'All') {
    params.set('prov', filters.province);
  }
  if (filters.realm && filters.realm !== 'All') {
    params.set('realm', filters.realm);
  }
  if (filters.year && filters.year !== 'All') {
    params.set('yr', filters.year);
  }

  const qs      = params.toString();
  const newURL  = qs
    ? `${window.location.pathname}?${qs}${window.location.hash}`
    : `${window.location.pathname}${window.location.hash}`;

  history.replaceState(null, '', newURL);
}

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
        <div style="display:flex;gap:4px">
          <button class="btn btn-sm btn-outline" id="btn-copy-link" title="Copy shareable link with current filters">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Link
          </button>
          <button class="btn btn-sm btn-outline" id="btn-clear-filters">Clear</button>
        </div>
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
      writeFiltersToURL(getAppState().filters);
    });
  });

  // Province filter
  container.querySelector('#filter-province').addEventListener('change', (e) => {
    updateFilters({ province: e.target.value });
    writeFiltersToURL(getAppState().filters);
  });

  // Realm filter
  container.querySelector('#filter-realm').addEventListener('change', (e) => {
    updateFilters({ realm: e.target.value });
    writeFiltersToURL(getAppState().filters);
  });

  // Clear button
  container.querySelector('#btn-clear-filters').addEventListener('click', () => {
    updateFilters({ targets: ['T3'], province: 'All', category: 'All', realm: 'All', year: 'All' });
    writeFiltersToURL(getAppState().filters);
  });

  // Copy link button — copies the current URL (with filter params) to clipboard
  container.querySelector('#btn-copy-link').addEventListener('click', (e) => {
    writeFiltersToURL(getAppState().filters);
    const btn = e.currentTarget;
    navigator.clipboard.writeText(window.location.href).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Copied!`;
      btn.style.color = 'var(--success)';
      btn.style.borderColor = 'var(--success)';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2000);
    }).catch(() => {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = window.location.href;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
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
        // Show restoration progress if restoration data exists;
        // otherwise show % of terrestrial area assessed for degradation
        if (m.restoration_ha > 0) {
          progress.T2 = m.restoration_pct || 0;
        } else {
          progress.T2 = baselines.terrestrial_ha > 0
            ? Math.min((m.degraded_ha / baselines.terrestrial_ha) * 100, 100)
            : 0;
        }
      } else if (t.code === 'T4') {
        // Count specific species categories; fall back to generic T4 layers
        const m = computeTargetMetrics(layers, 'T4', ALL_FILTER);
        const specificMapped = T4_SPECIES_KEYS.filter(k =>
          m.categoryBreakdown.some(c => c.category === k && c.features > 0)
        ).length;
        // Generic layers (SPECIES_DIST, KBA) each count as one species slot
        const genericMapped = specificMapped === 0
          ? Math.min(m.categoryBreakdown.filter(c => c.features > 0).length, T4_SPECIES_KEYS.length)
          : 0;
        const mapped = Math.min(specificMapped + genericMapped, T4_SPECIES_KEYS.length);
        progress.T4 = (mapped / T4_SPECIES_KEYS.length) * 100;
      } else {
        // Targets without explicit area goals: show mapped area as % of terrestrial baseline
        const m = computeTargetMetrics(layers, t.code, ALL_FILTER);
        progress[t.code] = m.totalAreaHa > 0
          ? Math.min((m.totalAreaHa / baselines.terrestrial_ha) * 100, 100)
          : 0;
      }
    } catch (_) {
      progress[t.code] = null;
    }
  }

  _progressCache = progress;
  return progress;
}
