/**
 * Dashboard page.
 * Target-based results, Target 3 analytics, map, charts, and export buttons.
 */
import { renderFilterPanel } from '../ui/components/filterPanel.js';
import { renderKPIWidgets } from '../ui/components/kpiWidgets.js';
import { initMap, updateMapLayers, resizeMap } from '../ui/components/mapView.js';
import { renderProvinceChart, renderProvinceTable } from '../ui/components/charts.js';
import { exportCSV, exportTORSnapshot, exportMapPNG } from '../ui/components/exportTools.js';
import { compute30x30Metrics } from '../gis/areaCalc.js';
import { getAppState } from '../ui/state.js';

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
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
          <button class="btn btn-sm btn-outline" id="btn-export-csv" title="Export filtered data as CSV">Export CSV</button>
          <button class="btn btn-sm btn-outline" id="btn-export-json" title="Export TOR reporting snapshot">Export JSON</button>
          <button class="btn btn-sm btn-outline" id="btn-export-png" title="Export map view">Export PNG</button>
        </div>
      </div>
      <div class="dashboard-main">
        <div class="map-container">
          <div id="map"></div>
        </div>
        <div class="dashboard-bottom" id="dashboard-bottom">
          <div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap">
            <div style="flex:1;min-width:300px">
              <h4 style="margin-bottom:8px;font-size:14px">Provincial Breakdown</h4>
              <div id="province-table-container"></div>
            </div>
            <div style="flex:1;min-width:300px">
              <h4 style="margin-bottom:8px;font-size:14px">Area by Province</h4>
              <div id="province-chart-container"></div>
            </div>
          </div>
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

  // Update province breakdown (only for T3)
  const filters = state.filters;
  const t3Active = filters.targets.length === 0 || filters.targets.includes('T3');

  const tableContainer = document.getElementById('province-table-container');
  const chartContainer = document.getElementById('province-chart-container');

  if (t3Active) {
    const metrics = compute30x30Metrics(state.layers, filters);
    if (tableContainer) renderProvinceTable(tableContainer, metrics.provinceBreakdown);
    if (chartContainer) renderProvinceChart(chartContainer, metrics.provinceBreakdown);
  } else {
    if (tableContainer) tableContainer.innerHTML = '<p style="color:var(--text-light);font-size:13px">Select Target 3 to see provincial breakdown</p>';
    if (chartContainer) chartContainer.innerHTML = '';
  }
}

/**
 * Called when dashboard tab becomes active.
 */
export function onDashboardShow() {
  resizeMap();
  refreshDashboard();
}
