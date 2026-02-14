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
    if (tableContainer) tableContainer.innerHTML = '<p style="color:var(--text-tertiary);font-size:13px;padding:12px 0">Select Target 3 to see provincial breakdown</p>';
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
