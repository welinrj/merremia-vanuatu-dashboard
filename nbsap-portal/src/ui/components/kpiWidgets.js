/**
 * KPI Widgets component.
 * Renders target-specific metric dashboards.
 * - T3: 30x30 progress bars with terrestrial/marine breakdown
 * - T6: Invasive species with species breakdown (Merremia, Fire Ants, etc.)
 * - All others: General target metrics with area, features, category breakdown
 */
import { compute30x30Metrics, computeGeneralMetrics, computeTargetMetrics } from '../../gis/areaCalc.js';
import { getAppState, getDashboardLayers } from '../state.js';
import { CATEGORIES } from '../../config/categories.js';

/** Target display metadata */
const TARGET_META = {
  T1: { icon: '\u{1F5FA}', label: 'Biodiversity Spatial Planning', unit: 'ha planned' },
  T2: { icon: '\u{1F33F}', label: 'Degraded Areas & Restoration', unit: 'ha mapped' },
  T3: { icon: '\u{1F30F}', label: '30x30 Conservation', unit: 'ha conserved' },
  T4: { icon: '\u{1F98E}', label: 'Species & Biodiversity', unit: 'species records' },
  T6: { icon: '\u{1FAB2}', label: 'Invasive Alien Species', unit: 'ha detected' },
  T7: { icon: '\u{2697}', label: 'Pesticide & Herbicide', unit: 'ha mapped' },
  T8: { icon: '\u{1F30A}', label: 'Coastal Eutrophication', unit: 'ha impacted' },
  T10: { icon: '\u{1F33E}', label: 'Land Cover Change', unit: 'ha mapped' },
  T12: { icon: '\u{1F333}', label: 'Blue & Green Spaces', unit: 'ha mapped' }
};

/**
 * Renders KPI widgets into a container.
 * @param {HTMLElement} container
 */
export function renderKPIWidgets(container) {
  const state = getAppState();
  const filters = state.filters;
  const layers = getDashboardLayers();
  const activeTargets = filters.targets;

  // Single target selected — show target-specific dashboard
  if (activeTargets.length === 1) {
    const target = activeTargets[0];
    if (target === 'T3') {
      renderTarget3KPIs(container, layers, filters);
    } else if (target === 'T6') {
      renderInvasiveKPIs(container, layers, filters);
    } else {
      renderTargetKPIs(container, layers, filters, target);
    }
    return;
  }

  // T3 included or no filter — show 30x30
  const t3Active = activeTargets.length === 0 || activeTargets.includes('T3');
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

/**
 * Renders Target 6 (Invasive Alien Species) KPIs with species breakdown.
 */
function renderInvasiveKPIs(container, layers, filters) {
  const m = computeTargetMetrics(layers, 'T6', filters);

  // Separate Merremia from other IAS
  const merremiaTypes = m.categoryBreakdown.find(c => c.category === 'MERREMIA');
  const otherIAS = m.categoryBreakdown.find(c => c.category === 'INVASIVE');

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card accent-red">
        <div class="kpi-value">${formatNumber(m.totalAreaHa)}</div>
        <div class="kpi-label">Total IAS Area (ha)</div>
        <div class="kpi-sublabel">${m.totalFeatures} detections across ${m.layerCount} layer${m.layerCount !== 1 ? 's' : ''}</div>
      </div>
      <div class="kpi-card accent-red">
        <div class="kpi-value">${formatNumber(merremiaTypes ? merremiaTypes.area_ha : 0)}</div>
        <div class="kpi-label">Merremia peltata (ha)</div>
        <div class="kpi-sublabel">${merremiaTypes ? merremiaTypes.features : 0} detections</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(otherIAS ? otherIAS.area_ha : 0)}</div>
        <div class="kpi-label">Other IAS (ha)</div>
        <div class="kpi-sublabel">${otherIAS ? otherIAS.features : 0} records</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces Affected</div>
      </div>
    </div>
    ${m.typeBreakdown.length > 0 ? renderTypeBreakdownTable(m.typeBreakdown, 'Species / Detection Type') : ''}
  `;
}

/**
 * Renders generic target KPIs for any NBSAP target.
 */
function renderTargetKPIs(container, layers, filters, targetCode) {
  const m = computeTargetMetrics(layers, targetCode, filters);
  const meta = TARGET_META[targetCode] || { icon: '', label: targetCode, unit: 'ha' };

  // Build category badges
  const catBadges = m.categoryBreakdown.map(c => {
    const catDef = CATEGORIES[c.category] || { label: c.category, color: '#95a5a6' };
    return `<span class="cat-badge" style="background:${catDef.color}20;color:${catDef.color};border:1px solid ${catDef.color}40">
      ${catDef.label}: ${formatNumber(c.area_ha)} ha (${c.features})
    </span>`;
  }).join('');

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.totalAreaHa)}</div>
        <div class="kpi-label">Total Area (ha)</div>
        <div class="kpi-sublabel">${meta.unit}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.totalFeatures}</div>
        <div class="kpi-label">Features</div>
        <div class="kpi-sublabel">${m.layerCount} layer${m.layerCount !== 1 ? 's' : ''} uploaded</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.realmTotals.terrestrial_ha)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${formatNumber(m.realmTotals.marine_ha)}</div>
        <div class="kpi-label">Marine (ha)</div>
      </div>
    </div>
    ${catBadges ? `<div class="kpi-cat-badges">${catBadges}</div>` : ''}
    ${m.typeBreakdown.length > 1 ? renderTypeBreakdownTable(m.typeBreakdown, 'Type Breakdown') : ''}
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

/**
 * Renders a compact breakdown table for species/type data.
 */
function renderTypeBreakdownTable(typeBreakdown, title) {
  const rows = typeBreakdown.slice(0, 10).map(t => `
    <tr>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${t.type}">${t.type}</td>
      <td style="text-align:right">${formatNumber(t.area_ha)}</td>
      <td style="text-align:right">${t.features}</td>
    </tr>
  `).join('');

  return `
    <div class="kpi-type-breakdown">
      <div class="breakdown-header" style="font-size:12px;margin:10px 0 6px">
        ${title}
      </div>
      <table class="data-table compact">
        <thead><tr><th>Type</th><th style="text-align:right">Area (ha)</th><th style="text-align:right">Count</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toFixed(n % 1 === 0 ? 0 : 1);
}
