/**
 * Executive Summary component.
 * Shows a compact 9-target status grid at the top of the dashboard —
 * designed for decision makers who need an instant overview.
 *
 * Each card shows:
 *   - Target code + icon + short name
 *   - Key metric (ha or %) if data exists
 *   - Status colour: green = data present, amber = data partial, red = no data
 *   - Clicking a card selects that target in the filter
 */
import targetsConfig from '../../config/targets.js';
import { getDashboardLayers, getAppState, updateFilters } from '../state.js';
import {
  compute30x30Metrics,
  computeTargetMetrics,
  computeTarget1Metrics,
  computeTarget2Metrics
} from '../../gis/areaCalc.js';

const TARGET_SHORT = {
  T1:  'Spatial Planning',
  T2:  'Restoration',
  T3:  '30×30 Conserv.',
  T4:  'Species',
  T6:  'Invasive IAS',
  T7:  'Pesticides',
  T8:  'Eutrophication',
  T10: 'Land Cover',
  T12: 'Green Spaces'
};

/**
 * Renders the executive summary banner.
 * @param {HTMLElement} container
 */
export function renderExecutiveSummary(container) {
  const layers  = getDashboardLayers();
  const state   = getAppState();
  const activeTargets = state.filters.targets;

  const filters = { ...state.filters, targets: [], province: 'All', category: 'All', realm: 'All', year: 'All' };

  const cards = targetsConfig.targets.map(t => {
    // Compute a quick metric for this target
    let metric    = '—';
    let hasData   = false;
    let statusCls = 'exec-card-none';   // red

    try {
      const layersForTarget = layers.filter(
        l => l.metadata.targets && l.metadata.targets.includes(t.code)
      );
      hasData = layersForTarget.length > 0;

      if (hasData) {
        let m;
        if (t.code === 'T3') {
          m = compute30x30Metrics(layers, filters);
          metric = `${m.terrestrial_pct.toFixed(1)}% land`;
        } else if (t.code === 'T1') {
          m = computeTarget1Metrics(layers, filters);
          metric = `${m.total_pct.toFixed(1)}%`;
        } else if (t.code === 'T2') {
          m = computeTarget2Metrics(layers, filters);
          metric = fmtHa(m.degraded_ha);
        } else {
          m = computeTargetMetrics(layers, t.code, filters);
          metric = fmtHa(m.totalAreaHa);
        }
        statusCls = 'exec-card-ok';    // green
      }
    } catch (_) { /* ignore calc errors — show no-data */ }

    const isActive = activeTargets.includes(t.code);
    return `
      <button class="exec-card ${statusCls} ${isActive ? 'exec-card-active' : ''}"
              data-target="${t.code}"
              title="${t.name}"
              aria-pressed="${isActive}">
        <span class="exec-card-icon" style="color:${t.color}">${t.icon}</span>
        <span class="exec-card-code" style="color:${t.color}">${t.code}</span>
        <span class="exec-card-name">${TARGET_SHORT[t.code] || t.code}</span>
        <span class="exec-card-metric ${hasData ? '' : 'exec-card-metric-none'}">${metric}</span>
        <span class="exec-card-dot ${statusCls}-dot"></span>
      </button>`;
  }).join('');

  const withData    = targetsConfig.targets.filter(t =>
    layers.some(l => l.metadata.targets && l.metadata.targets.includes(t.code))
  ).length;
  const gapCount    = targetsConfig.targets.length - withData;
  const gapWarning  = gapCount > 0
    ? `<span class="exec-gap-badge" title="${gapCount} target${gapCount > 1 ? 's' : ''} have no GIS data uploaded yet">
         <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
         ${gapCount} data gap${gapCount > 1 ? 's' : ''}
       </span>`
    : `<span class="exec-complete-badge">
         <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
         All targets have data
       </span>`;

  container.innerHTML = `
    <div class="exec-summary">
      <div class="exec-summary-header">
        <span class="exec-summary-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          NBSAP Target Coverage
        </span>
        <div style="display:flex;align-items:center;gap:8px">
          ${gapWarning}
          <span class="exec-summary-count">${withData}/${targetsConfig.targets.length} targets with data</span>
        </div>
      </div>
      <div class="exec-cards" role="group" aria-label="NBSAP target quick-select">
        ${cards}
      </div>
    </div>
  `;

  // Bind click events
  container.querySelectorAll('.exec-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.target;
      updateFilters({ targets: [code] });
    });
  });
}

function fmtHa(val) {
  if (!val) return '0 ha';
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M ha';
  if (val >= 1000)    return (val / 1000).toFixed(1) + 'K ha';
  return val.toFixed(0) + ' ha';
}
