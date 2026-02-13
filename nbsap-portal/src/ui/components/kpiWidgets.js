/**
 * KPI Widgets component.
 * Displays Target 3 (30x30) metrics when T3 is active,
 * or general summary metrics otherwise.
 */
import { compute30x30Metrics, computeGeneralMetrics } from '../../gis/areaCalc.js';
import { getAppState } from '../state.js';

/**
 * Renders KPI widgets into a container.
 * @param {HTMLElement} container
 */
export function renderKPIWidgets(container) {
  const state = getAppState();
  const filters = state.filters;
  const layers = state.layers || [];

  const t3Active = filters.targets.length === 0 || filters.targets.includes('T3');

  if (t3Active) {
    renderTarget3KPIs(container, layers, filters);
  } else {
    renderGeneralKPIs(container, layers, filters);
  }
}

function renderTarget3KPIs(container, layers, filters) {
  const m = compute30x30Metrics(layers, filters);

  const tPctClamped = Math.min(m.terrestrial_pct, 100);
  const mPctClamped = Math.min(m.marine_pct, 100);

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.terrestrial_ha)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
        <div class="kpi-sublabel">Conserved area</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${formatNumber(m.marine_ha)}</div>
        <div class="kpi-label">Marine (ha)</div>
        <div class="kpi-sublabel">Conserved area</div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Terrestrial: ${m.terrestrial_pct.toFixed(2)}% of 30% target</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill terrestrial"
               style="width: ${(tPctClamped / 30 * 100).toFixed(1)}%">
            ${m.terrestrial_pct >= 1 ? m.terrestrial_pct.toFixed(1) + '%' : ''}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${m.terrestrial_remaining_pct > 0
            ? `${m.terrestrial_remaining_pct.toFixed(2)}% remaining to reach 30%`
            : 'Target reached!'}
        </div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Marine: ${m.marine_pct.toFixed(2)}% of 30% target</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill marine"
               style="width: ${(mPctClamped / 30 * 100).toFixed(1)}%">
            ${m.marine_pct >= 1 ? m.marine_pct.toFixed(1) + '%' : ''}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${m.marine_remaining_pct > 0
            ? `${m.marine_remaining_pct.toFixed(2)}% remaining to reach 30%`
            : 'Target reached!'}
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-value">${m.total_features}</div>
        <div class="kpi-label">Features</div>
        <div class="kpi-sublabel">Counted toward 30x30</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With conservation areas</div>
      </div>
    </div>
  `;
}

function renderGeneralKPIs(container, layers, filters) {
  const m = computeGeneralMetrics(layers, filters);

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${m.totalFeatures}</div>
        <div class="kpi-label">Total Features</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.totalAreaHa)}</div>
        <div class="kpi-label">Total Area (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.realmCounts.terrestrial || 0}</div>
        <div class="kpi-label">Terrestrial</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${m.realmCounts.marine || 0}</div>
        <div class="kpi-label">Marine</div>
      </div>
    </div>
  `;
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toFixed(n % 1 === 0 ? 0 : 1);
}
