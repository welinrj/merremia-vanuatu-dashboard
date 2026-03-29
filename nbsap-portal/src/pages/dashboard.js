/**
 * Dashboard page.
 * Per-target results, analytics, map, charts, and export buttons.
 * Shows target-specific breakdowns when a single target is selected.
 */
import { renderFilterPanel } from '../ui/components/filterPanel.js';
import { renderKPIWidgets, animateKPINumbers } from '../ui/components/kpiWidgets.js';
import { initMap, updateMapLayers, resizeMap } from '../ui/components/mapView.js';
import { renderProvinceChart, renderProvinceTable } from '../ui/components/charts.js';
import { exportCSV, exportTORSnapshot, exportMapPNG } from '../ui/components/exportTools.js';
import { openPrintMap, openPrintAllMaps, openPrintProvinceMaps, openPrintSpeciesMaps } from '../ui/components/printMap.js';
import { compute30x30Metrics, computeTargetMetrics, computeTarget1Metrics } from '../gis/areaCalc.js';
import { getAppState, getDashboardLayers } from '../ui/state.js';
import { CATEGORIES } from '../config/categories.js';
import ENV from '../config/env.js';
import TARGETS_CONFIG from '../config/targets.js';
import { isAdmin } from '../services/auth/index.js';
import { showAlert } from '../ui/components/dialog.js';
import { renderExecutiveSummary } from '../ui/components/executiveSummary.js';

const DATA_REQUEST_EMAILS = ['rbaereleo@vanuatu.gov.vu', 'dlaunder@vanuatu.gov.vu'];

/** Target descriptions for the dashboard header */
const TARGET_HEADERS = {
  T1:  { title: 'Target 1: Biodiversity Spatial Planning',   desc: 'Participatory spatial planning to reduce biodiversity loss — tracking % of land and sea area covered by biodiversity-inclusive plans' },
  T2:  { title: 'Target 2: Ecosystem Restoration',           desc: 'Restore ≥30% of degraded terrestrial, inland water, marine and coastal ecosystems by 2030' },
  T3:  { title: 'Target 3: 30×30 Conservation',              desc: 'Conserve ≥30% of terrestrial, inland water, and marine areas by 2030 through protected areas and other effective area-based conservation measures' },
  T4:  { title: 'Target 4: Species Recovery & Biodiversity', desc: 'Halt human-induced extinction and support recovery of threatened species — distribution maps of significant Vanuatu species and Key Biodiversity Areas' },
  T6:  { title: 'Target 6: Invasive Alien Species',          desc: 'Reduce IAS introductions by ≥50% and minimize ecological impacts — coverage and distribution of Merremia, Fire Ants, African Snail, Crown-of-Thorns, Sako, Coconut Beetle' },
  T7:  { title: 'Target 7: Pollution Reduction',             desc: 'Reduce pollution to non-harmful levels — spatial mapping of pesticide and herbicide use in commercial farming across Vanuatu' },
  T8:  { title: 'Target 8: Climate & Ocean Impacts',         desc: 'Minimize climate change and ocean acidification impacts on biodiversity — mapping coastal eutrophication and nutrient-impacted zones' },
  T10: { title: 'Target 10: Sustainable Land Use',           desc: 'Sustainable biodiversity practices across agriculture, aquaculture, fisheries and forestry — land cover change mapping' },
  T12: { title: 'Target 12: Urban Green & Blue Spaces',      desc: 'Increase and enhance urban and peri-urban green and blue spaces for biodiversity, connectivity and human well-being' }
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
<div class="sidebar-section-title" style="margin-top:4px">Last Updated</div>
        <div id="last-updated-container" style="margin-bottom:8px">
          <span class="last-updated-badge" title="Data last refreshed from Firestore">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.58-4.7"/></svg>
            <span id="last-updated-text">Syncing&hellip;</span>
          </span>
        </div>
        <div class="sidebar-section-title">Export</div>
        <div class="export-toolbar">
          <button class="btn btn-sm btn-outline" id="btn-export-csv" title="${isAdmin() ? 'Export filtered data as CSV' : 'Request data access'}" style="position:relative">
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
        <div class="sidebar-section-title">Print Maps</div>
        <div class="export-toolbar">
          <button class="btn btn-sm btn-outline" id="btn-print-target" title="Print map for the selected target" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Target
          </button>
          <button class="btn btn-sm btn-outline" id="btn-print-province" title="Print target maps by province (select a target first)" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            By Province
          </button>
          <button class="btn btn-sm btn-outline" id="btn-print-species" title="Print T4 species maps (select T4 first)" disabled style="display:none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>
            By Species
          </button>
          <button class="btn btn-sm btn-primary" id="btn-print-all" title="Print maps for all 9 NBSAP targets">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            All Targets
          </button>
        </div>
      </div>
      <div class="dashboard-main">
        <div id="exec-summary-container"></div>
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
          <div id="context-panel-container"></div>
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
  document.getElementById('btn-export-csv').addEventListener('click', () => {
    if (isAdmin()) {
      exportCSV();
    } else {
      showAlert(`CSV data download is restricted.\n\nTo request data access, please email:\n${DATA_REQUEST_EMAILS.join('\n')}`, { title: 'Access Restricted' });
    }
  });
  document.getElementById('btn-export-json').addEventListener('click', exportTORSnapshot);
  document.getElementById('btn-export-png').addEventListener('click', exportMapPNG);

  // Print map buttons
  document.getElementById('btn-print-all').addEventListener('click', openPrintAllMaps);
  document.getElementById('btn-print-target').addEventListener('click', () => {
    const state = getAppState();
    if (state.filters.targets.length === 1) {
      openPrintMap(state.filters.targets[0]);
    }
  });
  document.getElementById('btn-print-province').addEventListener('click', () => {
    const state = getAppState();
    if (state.filters.targets.length === 1) {
      openPrintProvinceMaps(state.filters.targets[0]);
    }
  });
  document.getElementById('btn-print-species').addEventListener('click', () => {
    const state = getAppState();
    if (state.filters.targets.length === 1 && state.filters.targets[0] === 'T4') {
      openPrintSpeciesMaps('T4');
    }
  });
}

/**
 * Refreshes all dashboard components with current state.
 */
export function refreshDashboard() {
  _dashboardDirty = false;
  const state = getAppState();

  // Render executive summary strip
  const execContainer = document.getElementById('exec-summary-container');
  if (execContainer) renderExecutiveSummary(execContainer);

  // Update last-updated timestamp
  const lastUpdatedEl = document.getElementById('last-updated-text');
  if (lastUpdatedEl) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { day: 'numeric', month: 'short' });
    lastUpdatedEl.textContent = `${dateStr}, ${timeStr}`;
    const badge = lastUpdatedEl.closest('.last-updated-badge');
    if (badge) badge.classList.add('synced');
  }

  // Re-render filter panel
  const filterContainer = document.getElementById('filter-panel-container');
  if (filterContainer) renderFilterPanel(filterContainer);

// Re-render KPIs with smooth transition: fade-out → spinner → compute → fade-in
  // Cancel any in-flight KPI render from a previous refreshDashboard() call to
  // prevent stale renders from overwriting the latest state.
  if (_kpiTimer !== null) {
    clearTimeout(_kpiTimer);
    _kpiTimer = null;
  }
  const kpiContainer = document.getElementById('kpi-container');
  if (kpiContainer) {
    kpiContainer.style.opacity = '0';
    kpiContainer.style.pointerEvents = 'none';
    _kpiTimer = setTimeout(() => {
      _kpiTimer = null;
      kpiContainer.innerHTML = `
        <div class="kpi-computing">
          <div class="loading-spinner" style="width:20px;height:20px;border-width:2px"></div>
          <span>Recalculating&hellip;</span>
        </div>`;
      kpiContainer.style.opacity = '1';
      // Yield one frame so the spinner paints, then compute synchronously
      requestAnimationFrame(() => {
        setTimeout(() => {
          renderKPIWidgets(kpiContainer);
          animateKPINumbers(kpiContainer);
          kpiContainer.style.pointerEvents = '';
        }, 0);
      });
    }, 120);
  }

  // Update map layers
  updateMapLayers();

  // Determine active target context
  const filters = state.filters;
  const activeTargets = filters.targets;
  const dashLayers = getDashboardLayers();

  // Render target header
  const headerContainer = document.getElementById('target-header-container');
  const printTargetBtn = document.getElementById('btn-print-target');
  const printProvinceBtn = document.getElementById('btn-print-province');
  const printSpeciesBtn = document.getElementById('btn-print-species');
  if (headerContainer) {
    if (activeTargets.length === 1) {
      const t = activeTargets[0];
      const hdr = TARGET_HEADERS[t] || { title: t, desc: '' };
      headerContainer.innerHTML = `
        <div class="target-header-bar">
          <div style="flex:1">
            <strong>${hdr.title}</strong>
            <span style="color:var(--text-secondary);font-size:13px;margin-left:12px">${hdr.desc}</span>
          </div>
          <button class="btn btn-sm btn-outline" id="btn-print-header" title="Print map for ${t}" style="flex-shrink:0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print Map
          </button>
        </div>
      `;
      // Wire header print button
      document.getElementById('btn-print-header').addEventListener('click', () => openPrintMap(t));
      // Enable sidebar print target + province buttons
      if (printTargetBtn) {
        printTargetBtn.disabled = false;
        printTargetBtn.title = `Print map for ${t}`;
      }
      if (printProvinceBtn) {
        printProvinceBtn.disabled = false;
        printProvinceBtn.title = `Print ${t} maps by province`;
      }
      // Show/enable "By Species" button only for T4
      if (printSpeciesBtn) {
        if (t === 'T4') {
          printSpeciesBtn.style.display = '';
          printSpeciesBtn.disabled = false;
          printSpeciesBtn.title = 'Print species distribution maps';
        } else {
          printSpeciesBtn.style.display = 'none';
          printSpeciesBtn.disabled = true;
        }
      }
    } else {
      headerContainer.innerHTML = '';
      if (printTargetBtn) {
        printTargetBtn.disabled = true;
        printTargetBtn.title = 'Select a single target first';
      }
      if (printProvinceBtn) {
        printProvinceBtn.disabled = true;
        printProvinceBtn.title = 'Select a single target first';
      }
      if (printSpeciesBtn) {
        printSpeciesBtn.style.display = 'none';
        printSpeciesBtn.disabled = true;
      }
    }
  }

  // Update province breakdown
  const tableContainer = document.getElementById('province-table-container');
  const chartContainer = document.getElementById('province-chart-container');
  const catContainer = document.getElementById('category-breakdown-container');

  if (activeTargets.length === 1) {
    // Single target selected — show that target's province breakdown
    const targetCode = activeTargets[0];

    // Compute metrics once and reuse for province table, chart, and category breakdown
    const metrics = targetCode === 'T3'
      ? compute30x30Metrics(dashLayers, filters)
      : targetCode === 'T1'
        ? computeTarget1Metrics(dashLayers, filters)
        : computeTargetMetrics(dashLayers, targetCode, filters);

    if (tableContainer) renderProvinceTable(tableContainer, metrics.provinceBreakdown);
    if (chartContainer) renderProvinceChart(chartContainer, metrics.provinceBreakdown);

    // Render category breakdown for all single-target views
    if (catContainer) {
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

    if (catContainer) renderAllTargetsSummary(catContainer);
  }

  // Always render the Vanuatu quick-reference context strip
  const contextContainer = document.getElementById('context-panel-container');
  if (contextContainer) renderContextPanel(contextContainer);
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

/**
 * Renders a summary for the "all targets" view:
 * 30×30 progress cards + targets data-coverage table.
 * Replaces the otherwise-empty category-breakdown-container.
 */
function renderAllTargetsSummary(container) {
  const allLayers = getDashboardLayers();
  const targets = TARGETS_CONFIG.targets;

  // Dataset counts and area totals from layer metadata (no GeoJSON needed)
  const datasetsByTarget = {};
  let totalDatasets = 0;
  let allTerrestrialHa = 0;
  let allMarineHa = 0;

  for (const layer of allLayers) {
    totalDatasets++;
    for (const t of (layer.metadata?.targets || [])) {
      datasetsByTarget[t] = (datasetsByTarget[t] || 0) + 1;
    }
    const ha = layer.metadata?.totalAreaHa || 0;
    if (layer.metadata?.realm === 'marine') allMarineHa += ha;
    else allTerrestrialHa += ha;
  }

  // 30×30 progress — sum T3 layers that count toward 30x30
  let conservedTerrestrialHa = 0;
  let conservedMarineHa = 0;
  for (const layer of allLayers) {
    const m = layer.metadata;
    if (!m?.totalAreaHa || !m.countsToward30x30) continue;
    if (!(m.targets || []).includes('T3')) continue;
    if (m.realm === 'marine') conservedMarineHa += m.totalAreaHa;
    else conservedTerrestrialHa += m.totalAreaHa;
  }

  const terrPct = Math.min((conservedTerrestrialHa / ENV.nationalBaselines.terrestrial_ha) * 100, 100);
  const marinePct = Math.min((conservedMarineHa / ENV.nationalBaselines.marine_ha) * 100, 100);
  const targetsWithData = targets.filter(t => (datasetsByTarget[t.code] || 0) > 0).length;

  const tableRows = targets.map(t => {
    const count = datasetsByTarget[t.code] || 0;
    const statusColor = count > 0 ? 'var(--success)' : 'var(--text-tertiary)';
    return `
      <tr>
        <td><span class="badge" style="background:${t.color}20;color:${t.color};border:1px solid ${t.color}40;font-weight:700;font-size:11px;white-space:nowrap">${t.code}</span></td>
        <td style="font-size:13px">${t.name.replace(/^Target \d+:\s*/, '')}</td>
        <td style="font-size:12px">
          <span style="display:inline-flex;align-items:center;gap:5px;color:${statusColor}">
            <span style="width:7px;height:7px;border-radius:50%;background:${statusColor};flex-shrink:0"></span>
            ${count > 0 ? `${count} dataset${count !== 1 ? 's' : ''}` : 'No data yet'}
          </span>
        </td>
        <td style="font-size:11px;color:var(--text-secondary)">${(t.recommendedCategories || []).slice(0, 4).join(', ')}</td>
      </tr>`;
  }).join('');

  container.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">

      <div class="card">
        <div class="card-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          30&times;30 Conservation Progress
          <span style="margin-left:auto;font-size:10px;color:var(--text-tertiary)">Target: 30% by 2030</span>
        </div>
        <div class="card-body">
          <div style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
              <span style="font-size:12px;font-weight:600">Terrestrial</span>
              <span style="font-size:14px;font-weight:700;color:${terrPct >= 30 ? 'var(--success)' : 'var(--primary)'}">${terrPct.toFixed(1)}%</span>
            </div>
            <div style="background:var(--gray-200);border-radius:4px;height:10px;overflow:hidden;position:relative">
              <div style="width:${terrPct}%;background:var(--primary);height:100%;border-radius:4px;transition:width 0.6s ease"></div>
              <div style="position:absolute;left:30%;top:-1px;bottom:-1px;width:2px;background:var(--danger);opacity:0.7" title="30% GBF target"></div>
            </div>
            <div style="font-size:11px;color:var(--text-tertiary);margin-top:3px">${formatHa(conservedTerrestrialHa)} ha conserved of ${formatHa(ENV.nationalBaselines.terrestrial_ha)} ha total</div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
              <span style="font-size:12px;font-weight:600">Marine</span>
              <span style="font-size:14px;font-weight:700;color:${marinePct >= 30 ? 'var(--success)' : 'var(--secondary)'}">${marinePct.toFixed(1)}%</span>
            </div>
            <div style="background:var(--gray-200);border-radius:4px;height:10px;overflow:hidden;position:relative">
              <div style="width:${marinePct}%;background:var(--secondary);height:100%;border-radius:4px;transition:width 0.6s ease"></div>
              <div style="position:absolute;left:30%;top:-1px;bottom:-1px;width:2px;background:var(--danger);opacity:0.7" title="30% GBF target"></div>
            </div>
            <div style="font-size:11px;color:var(--text-tertiary);margin-top:3px">${formatHa(conservedMarineHa)} ha conserved of ${formatHa(ENV.nationalBaselines.marine_ha)} ha total</div>
          </div>
          <div style="margin-top:10px;font-size:11px;color:var(--text-tertiary);display:flex;align-items:center;gap:5px">
            <span style="display:inline-block;width:14px;height:2px;background:var(--danger);opacity:0.7;flex-shrink:0"></span>
            Red line marks the 30% GBF target threshold
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          Dataset Summary
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div style="text-align:center;padding:10px 8px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--border)">
              <div style="font-size:24px;font-weight:800;color:var(--primary);line-height:1">${totalDatasets}</div>
              <div style="font-size:11px;color:var(--text-secondary);margin-top:4px">Datasets Loaded</div>
            </div>
            <div style="text-align:center;padding:10px 8px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--border)">
              <div style="font-size:24px;font-weight:800;color:var(--secondary);line-height:1">${targetsWithData}/${targets.length}</div>
              <div style="font-size:11px;color:var(--text-secondary);margin-top:4px">Targets with Data</div>
            </div>
            <div style="text-align:center;padding:10px 8px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--border)">
              <div style="font-size:18px;font-weight:700;color:var(--primary);line-height:1">${formatHa(allTerrestrialHa)}</div>
              <div style="font-size:11px;color:var(--text-secondary);margin-top:4px">Terrestrial ha</div>
            </div>
            <div style="text-align:center;padding:10px 8px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--border)">
              <div style="font-size:18px;font-weight:700;color:var(--secondary);line-height:1">${formatHa(allMarineHa)}</div>
              <div style="font-size:11px;color:var(--text-secondary);margin-top:4px">Marine ha</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="breakdown-header">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      All NBSAP Targets &mdash; Data Coverage
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width:56px">Target</th>
          <th>GBF Objective</th>
          <th style="width:130px">Datasets</th>
          <th>Key Data Layers</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;
}

/**
 * Renders a static Vanuatu quick-reference context strip at the bottom of the dashboard.
 * Always visible regardless of the active filter.
 */
function renderContextPanel(container) {
  if (!container || container.dataset.rendered) return;
  container.dataset.rendered = '1';
  container.innerHTML = `
    <div style="margin-top:16px;padding:12px 16px;background:linear-gradient(135deg,var(--primary-lighter),var(--secondary-lighter));border:1px solid var(--border);border-radius:var(--radius-md);display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start">
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">Country</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">Republic of Vanuatu</div>
        <div style="font-size:12px;color:var(--text-secondary)">Melanesia &bull; 83 islands</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">Land Area</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">12,190 km&sup2;</div>
        <div style="font-size:12px;color:var(--text-secondary)">6 provinces</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">EEZ</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">663,251 km&sup2;</div>
        <div style="font-size:12px;color:var(--text-secondary)">Coral Triangle adjacent</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">30&times;30 Deadline</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">2030</div>
        <div style="font-size:12px;color:var(--text-secondary)">Kunming-Montreal GBF</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">NBSAP Targets</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">9 National Targets</div>
        <div style="font-size:12px;color:var(--text-secondary)">T1, T2, T3, T4, T6, T7, T8, T10, T12</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">Data Custodian</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">DEPC</div>
        <div style="font-size:12px;color:var(--text-secondary)">Dept. of Env. Protection &amp; Conservation</div>
      </div>
    </div>
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
 * Resizes the map (needed after tab switch) but only refreshes data
 * if state has changed since the last render (via dirty flag).
 */
let _dashboardDirty = true;
let _kpiTimer = null; // tracks pending async KPI render — cancelled on re-render

export function markDashboardDirty() {
  _dashboardDirty = true;
}

export function onDashboardShow() {
  resizeMap();
  if (_dashboardDirty) {
    refreshDashboard();
  }
}
