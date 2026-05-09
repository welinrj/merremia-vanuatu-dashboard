/**
 * Dashboard page.
 * Per-target results, analytics, map, charts, and export buttons.
 * Shows target-specific breakdowns when a single target is selected.
 */
import { renderFilterPanel, readFiltersFromURL, writeFiltersToURL } from '../ui/components/filterPanel.js';
import { renderReportCard } from '../ui/components/reportCard.js';
import { renderTrendChart } from '../ui/components/trendChart.js';
import { renderKPIWidgets, animateKPINumbers } from '../ui/components/kpiWidgets.js';
import { initMap, updateMapLayers, resizeMap } from '../ui/components/mapView.js';
import { renderProvinceChart, renderProvinceTable } from '../ui/components/charts.js';
import { exportCSV, exportTORSnapshot, exportMapPNG } from '../ui/components/exportTools.js';
import { openPrintMap, openPrintAllMaps, openPrintProvinceMaps, openPrintSpeciesMaps } from '../ui/components/printMap.js';
import { generateNationalReport } from '../ui/components/nationalReport/index.js';
import { compute30x30Metrics, computeTargetMetrics, computeTarget1Metrics } from '../gis/areaCalc.js';
import { getAppState, getDashboardLayers, updateFilters } from '../ui/state.js';
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

        <!-- ── Action dock (export + print) ───────────────── -->
        <div class="sidebar-action-dock">

          <div class="sidebar-action-group">
            <div class="sidebar-action-group-header">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Data
            </div>
            <div class="sidebar-action-row">
              <button class="sidebar-action-btn" id="btn-export-csv"
                aria-label="${isAdmin() ? 'Download filtered data as CSV' : 'Request CSV data access'}"
                title="${isAdmin() ? 'Download filtered data as CSV' : 'Request data access'}">
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                CSV
              </button>
              <button class="sidebar-action-btn" id="btn-export-json"
                aria-label="Export GBF reporting snapshot as JSON"
                title="Export GBF reporting snapshot as JSON">
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                JSON
              </button>
              <button class="sidebar-action-btn sidebar-action-btn-accent" id="btn-export-png"
                aria-label="Export map as PNG with cartographic template"
                title="Export professional A4 map PNG with cartographic template">
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Map PNG
              </button>
            </div>
          </div>

          <div class="sidebar-action-group">
            <div class="sidebar-action-group-header">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              National Report
            </div>
            <div class="sidebar-action-row">
              <button class="sidebar-action-btn sidebar-action-btn-report" id="btn-national-report"
                aria-label="Generate CBD-compliant National Biodiversity Status Report"
                title="Generate CBD-compliant National Biodiversity Status Report with all targets, province tables, and data inventory" style="flex:1">
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 18v-2"/><path d="M12 18v-4"/><path d="M16 18v-6"/></svg>
                Generate National Report
              </button>
            </div>
          </div>

          <div class="sidebar-action-group">
            <div class="sidebar-action-group-header">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print Maps
            </div>
            <div class="sidebar-action-row">
              <button class="sidebar-action-btn" id="btn-print-target"
                aria-label="Print cartographic map for selected target"
                title="Print cartographic map for the selected target" disabled>
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                Target
              </button>
              <button class="sidebar-action-btn" id="btn-print-province"
                aria-label="Print province-by-province maps"
                title="Print province-by-province maps (select a target first)" disabled>
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Province
              </button>
              <button class="sidebar-action-btn" id="btn-print-species"
                aria-label="Print T4 species distribution maps"
                title="Print T4 species distribution maps" disabled style="display:none">
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>
                Species
              </button>
              <button class="sidebar-action-btn sidebar-action-btn-primary" id="btn-print-all"
                aria-label="Generate print-quality maps for all 9 NBSAP targets"
                title="Generate print-quality maps for all 9 NBSAP targets">
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="8" height="8" rx="1"/></svg>
                All Targets
              </button>
            </div>
          </div>

          <div class="sidebar-sync-bar">
            <span class="last-updated-badge" title="Data last refreshed from Firestore">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.58-4.7"/></svg>
              <span id="last-updated-text">Syncing&hellip;</span>
            </span>
          </div>

        </div><!-- /.sidebar-action-dock -->
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
          <div id="trend-chart-container" style="margin-top:20px"></div>
          <div id="context-panel-container"></div>
        </div>
      </div>
    </div>
  `;

  // Apply URL filter state (deep link / bookmark support)
  const urlFilters = readFiltersFromURL();
  if (urlFilters) updateFilters(urlFilters);

  // Allow report card cards and other components to switch target
  window.addEventListener('nbsap:set-target', (e) => {
    const code = e.detail?.target;
    if (code) {
      updateFilters({ targets: [code] });
      writeFiltersToURL(getAppState().filters);
      // Scroll to map so the user sees the result
      document.getElementById('map')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Initialize map — wait for the #map element to have non-zero dimensions before
  // calling initMap(). A fixed setTimeout(50) is fragile on slow/low-power devices
  // (common in Pacific Island field deployments). ResizeObserver fires as soon as the
  // browser has laid out the container, regardless of device speed.
  const mapEl = document.getElementById('map');
  const _mapInitObserver = new ResizeObserver((entries, observer) => {
    const entry = entries[0];
    if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
      observer.disconnect();
      initMap('map');
      refreshDashboard();
    }
  });
  _mapInitObserver.observe(mapEl);

  // Export buttons
  document.getElementById('btn-national-report').addEventListener('click', generateNationalReport);

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

    // Render time-series trend chart for the selected target
    const trendContainer = document.getElementById('trend-chart-container');
    if (trendContainer) {
      renderTrendChart(trendContainer, targetCode);
    }
  } else {
    // Multiple or no targets — show T3 provincial breakdown + full report card
    const t3Active = activeTargets.length === 0 || activeTargets.includes('T3');

    if (t3Active) {
      const metrics = compute30x30Metrics(dashLayers, filters);
      if (tableContainer) renderProvinceTable(tableContainer, metrics.provinceBreakdown);
      if (chartContainer) renderProvinceChart(chartContainer, metrics.provinceBreakdown);
    } else {
      if (tableContainer) tableContainer.innerHTML = '<p style="color:var(--text-tertiary);font-size:13px;padding:12px 0">Select a target to see provincial breakdown</p>';
      if (chartContainer) chartContainer.innerHTML = '';
    }

    // Replace the old summary with the full GBF 2030 Report Card
    if (catContainer) renderReportCard(catContainer);

    // Clear trend chart in multi-target view
    const trendContainer = document.getElementById('trend-chart-container');
    if (trendContainer) trendContainer.innerHTML = '';
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

// renderAllTargetsSummary removed — replaced by renderReportCard() in reportCard.js

/**
 * @deprecated replaced by renderReportCard — kept as tombstone to aid git blame
 * DO NOT restore: renderAllTargetsSummary was removed during the 2026-05 code review.
 */


/**
 * Renders a static Vanuatu quick-reference context strip at the bottom of the dashboard.
 * Always visible regardless of the active filter.
 * Geographic values are derived from ENV.nationalBaselines to stay in sync with calculations.
 */
function renderContextPanel(container) {
  if (!container || container.dataset.rendered) return;
  container.dataset.rendered = '1';

  // Derive display values from ENV to avoid inconsistency with calculation baselines.
  // terrestrial_ha / 100 = km²; round to nearest 10 for clean display.
  const terrKm2 = Math.round(ENV.nationalBaselines.terrestrial_ha / 100).toLocaleString();
  const marineKm2 = Math.round(ENV.nationalBaselines.marine_ha / 100).toLocaleString();

  container.innerHTML = `
    <div style="margin-top:16px;padding:12px 16px;background:linear-gradient(135deg,var(--primary-lighter),var(--secondary-lighter));border:1px solid var(--border);border-radius:var(--radius-md);display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start">
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">Country</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">Republic of Vanuatu</div>
        <div style="font-size:12px;color:var(--text-secondary)">Melanesia &bull; 83 islands</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">Land Area</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">${terrKm2} km&sup2;</div>
        <div style="font-size:12px;color:var(--text-secondary)">6 provinces</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">EEZ</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">${marineKm2} km&sup2;</div>
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
