/**
 * Dashboard page.
 * Per-target results, analytics, map, charts, and export buttons.
 * Shows target-specific breakdowns when a single target is selected.
 */
import { renderFilterPanel } from '../ui/components/filterPanel.js';
import { renderKPIWidgets } from '../ui/components/kpiWidgets.js';
import { initMap, updateMapLayers, resizeMap } from '../ui/components/mapView.js';
import { renderProvinceChart, renderProvinceTable } from '../ui/components/charts.js';
import { exportCSV, exportTORSnapshot, exportMapPNG } from '../ui/components/exportTools.js';
import { compute30x30Metrics, computeTargetMetrics } from '../gis/areaCalc.js';
import { getAppState, getDashboardLayers } from '../ui/state.js';
import { CATEGORIES } from '../config/categories.js';

/** Target descriptions for the dashboard header */
const TARGET_HEADERS = {
  T1: { title: 'Target 1: Biodiversity Spatial Planning', desc: 'Percentage of land and sea covered by biodiversity-inclusive spatial plans' },
  T2: { title: 'Target 2: Degraded Areas & Restoration', desc: 'Mapping of degraded areas and active restoration sites' },
  T3: { title: 'Target 3: 30x30 Conservation', desc: 'Conserve 30% of terrestrial and 30% of marine areas by 2030' },
  T4: { title: 'Target 4: Species & Biodiversity', desc: 'Distribution maps of significant species and key biodiversity areas' },
  T6: { title: 'Target 6: Invasive Alien Species', desc: 'Coverage and distribution of key IAS — Merremia, Fire Ants, African Snail, Crown-of-Thorns, Sako, Coconut Beetle' },
  T7: { title: 'Target 7: Pesticide & Herbicide', desc: 'Areas of pesticide and herbicide use in commercial farming' },
  T8: { title: 'Target 8: Coastal Eutrophication', desc: 'Coastal eutrophication and nutrient-impacted zones' },
  T10: { title: 'Target 10: Land Cover Change', desc: 'Land cover change mapping for agriculture, livestock, fisheries and forestry' },
  T12: { title: 'Target 12: Blue & Green Spaces', desc: 'Parks within provincial and municipal areas, and botanical gardens' }
};

/**
 * Initializes the Dashboard page.
 */
export function initDashboard() {
  const page = document.getElementById('page-dashboard');
  page.innerHTML = `
    <div class="dashboard-layout">
      <div class="dashboard-sidebar">
        <div id="filter-panel-container"></div>
        <div id="kpi-container"></div>
        <div class="sidebar-section-title">Export Data</div>
        <div class="export-toolbar">
          <button class="btn btn-sm btn-outline" id="btn-export-csv" title="Export filtered data as CSV">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            CSV
          </button>
          <button class="btn btn-sm btn-outline" id="btn-export-json" title="Export TOR reporting snapshot">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            JSON
          </button>
          <button class="btn btn-sm btn-outline" id="btn-export-png" title="Export map view">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            PNG
          </button>
        </div>
      </div>
      <div class="dashboard-main">
        <div id="target-header-container"></div>
        <div class="map-container">
          <div id="map"></div>
        </div>
        <div class="dashboard-bottom" id="dashboard-bottom">
          <div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap">
            <div style="flex:1;min-width:300px">
              <div class="breakdown-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="8"/><rect x="14" y="6" width="3" height="12"/></svg>
                Provincial Breakdown
              </div>
              <div id="province-table-container"></div>
            </div>
            <div style="flex:1;min-width:300px">
              <div class="breakdown-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                Area by Province
              </div>
              <div id="province-chart-container"></div>
            </div>
          </div>
          <div id="category-breakdown-container" style="margin-top:20px"></div>
        </div>
      </div>
    </div>
  `;

  // Initialize map
  setTimeout(() => {
    initMap('map');
    refreshDashboard();
  }, 50);

  // Export buttons
  document.getElementById('btn-export-csv').addEventListener('click', exportCSV);
  document.getElementById('btn-export-json').addEventListener('click', exportTORSnapshot);
  document.getElementById('btn-export-png').addEventListener('click', exportMapPNG);
}

/**
 * Refreshes all dashboard components with current state.
 */
export function refreshDashboard() {
  const state = getAppState();

  // Re-render filter panel
  const filterContainer = document.getElementById('filter-panel-container');
  if (filterContainer) renderFilterPanel(filterContainer);

  // Re-render KPIs
  const kpiContainer = document.getElementById('kpi-container');
  if (kpiContainer) renderKPIWidgets(kpiContainer);

  // Update map layers
  updateMapLayers();

  // Determine active target context
  const filters = state.filters;
  const activeTargets = filters.targets;
  const dashLayers = getDashboardLayers();

  // Render target header
  const headerContainer = document.getElementById('target-header-container');
  if (headerContainer) {
    if (activeTargets.length === 1) {
      const t = activeTargets[0];
      const hdr = TARGET_HEADERS[t] || { title: t, desc: '' };
      headerContainer.innerHTML = `
        <div class="target-header-bar">
          <strong>${hdr.title}</strong>
          <span style="color:var(--text-secondary);font-size:13px;margin-left:12px">${hdr.desc}</span>
        </div>
      `;
    } else {
      headerContainer.innerHTML = '';
    }
  }

  // Update province breakdown
  const tableContainer = document.getElementById('province-table-container');
  const chartContainer = document.getElementById('province-chart-container');
  const catContainer = document.getElementById('category-breakdown-container');

  if (activeTargets.length === 1) {
    // Single target selected — show that target's province breakdown
    const targetCode = activeTargets[0];

    if (targetCode === 'T3') {
      const metrics = compute30x30Metrics(dashLayers, filters);
      if (tableContainer) renderProvinceTable(tableContainer, metrics.provinceBreakdown);
      if (chartContainer) renderProvinceChart(chartContainer, metrics.provinceBreakdown);
    } else {
      const metrics = computeTargetMetrics(dashLayers, targetCode, filters);
      if (tableContainer) renderProvinceTable(tableContainer, metrics.provinceBreakdown);
      if (chartContainer) renderProvinceChart(chartContainer, metrics.provinceBreakdown);
    }

    // Render category breakdown for all single-target views
    if (catContainer) {
      const metrics = computeTargetMetrics(dashLayers, targetCode, filters);
      renderCategoryBreakdown(catContainer, metrics);
    }
  } else {
    // Multiple or no targets — show T3 if included
    const t3Active = activeTargets.length === 0 || activeTargets.includes('T3');

    if (t3Active) {
      const metrics = compute30x30Metrics(dashLayers, filters);
      if (tableContainer) renderProvinceTable(tableContainer, metrics.provinceBreakdown);
      if (chartContainer) renderProvinceChart(chartContainer, metrics.provinceBreakdown);
    } else {
      if (tableContainer) tableContainer.innerHTML = '<p style="color:var(--text-tertiary);font-size:13px;padding:12px 0">Select a target to see provincial breakdown</p>';
      if (chartContainer) chartContainer.innerHTML = '';
    }

    if (catContainer) catContainer.innerHTML = '';
  }
}

/**
 * Renders a category breakdown section for the selected target.
 */
function renderCategoryBreakdown(container, metrics) {
  if (!metrics.categoryBreakdown || metrics.categoryBreakdown.length === 0) {
    container.innerHTML = '';
    return;
  }

  const rows = metrics.categoryBreakdown.map(c => {
    const catDef = CATEGORIES[c.category] || { label: c.category, color: '#95a5a6' };
    return `
      <tr>
        <td>
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${catDef.color};margin-right:6px"></span>
          ${catDef.label}
        </td>
        <td style="text-align:right">${formatHa(c.area_ha)}</td>
        <td style="text-align:right">${c.features}</td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="breakdown-header">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 2v20"/></svg>
      Category Breakdown
    </div>
    <table class="data-table">
      <thead>
        <tr><th>Category</th><th style="text-align:right">Area (ha)</th><th style="text-align:right">Features</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function formatHa(val) {
  if (!val && val !== 0) return '-';
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
  return val.toFixed(1);
}

/**
 * Called when dashboard tab becomes active.
 */
export function onDashboardShow() {
  resizeMap();
  refreshDashboard();
}
