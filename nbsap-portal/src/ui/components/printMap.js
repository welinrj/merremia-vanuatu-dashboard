/**
 * Print Map — standardized cartographic map templates for each NBSAP target.
 *
 * Creates a full-screen print overlay with a professional map layout:
 *   - Title block (target name, description, NBSAP branding)
 *   - Leaflet map showing dissolved (union) boundaries per category
 *   - Legend (category colours used by the target, with LAND_COVER sub-types)
 *   - North arrow
 *   - Scale bar (Leaflet built-in)
 *   - Metadata footer (date, layers, features, area, CRS)
 *   - Comprehensive Analysis Page with quantitative and qualitative results
 *
 * Uses @media print CSS to hide everything except the print overlay,
 * so the user can call window.print() or Ctrl+P for a clean output.
 *
 * Polygon dissolution follows UNEP-WCMC methodology: overlapping features
 * are unioned per category for clean cartographic boundaries.
 *
 * Professional symbology is driven by config/symbology.js for consistent
 * colouring across interactive and print maps.
 */
import L from 'leaflet';
import ENV from '../../config/env.js';
import { CATEGORIES } from '../../config/categories.js';
import targetsConfig from '../../config/targets.js';
import EXPECTED_LAYERS from '../../config/expectedLayers.js';
import {
  resolveColors,
  featureGroupKey,
  printDissolvedStyle,
  printPointStyle,
  referencePolygonStyle,
  referencePointStyle,
  collectLegendEntries
} from '../../config/symbology.js';
import { getAppState, getDashboardLayers } from '../state.js';
import { compute30x30Metrics, computeTargetMetrics, dissolveFeatures } from '../../gis/areaCalc.js';

const OVERLAY_ID = 'print-map-overlay';

/** Vanuatu flag SVG for print headers (from flag-icons project) */
const FLAG_SVG = `<svg width="48" height="36" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="border:0.5px solid #ccc;border-radius:2px;flex-shrink:0"><defs><clipPath id="vu-a"><path d="M0 0v475l420-195h480v-85H420Z"/></clipPath></defs><path fill="#009543" d="M0 0h640v480H0z"/><path fill="#d21034" d="M0 0h640v240H0z"/><g clip-path="url(#vu-a)" transform="scale(.71111 1.01053)"><path stroke="#fdce12" stroke-width="110" d="m0 0 420 195h480v85H420L0 475"/><path fill="none" stroke="#000" stroke-width="60" d="m0 0 420 195h480m0 85H420L0 475"/></g><g fill="#fdce12" transform="translate(-22)scale(1.01053)"><path d="M106.9 283v27c23.5 0 69.7-18 69.7-76.1s-49.3-68.9-64-68.9-60.3 10.6-60.3 58c0 47.6 44.7 52 53.5 52s41.8-8 38-43.6a35.5 35.5 0 0 1-35.4 31.5c-24 0-39-17.8-39-35.4s14.6-41.2 39.9-41.2 43.8 22.5 43.8 45.1-17.8 51.5-46.2 51.5z"/><g id="vu-b"><path stroke="#fdce12" stroke-width=".8" d="m86.2 247.7 1.4 1s11.2-25.5 41.1-43.6c-3.8 2-23.8 12-42.5 42.6z"/><path d="M89.1 243.3s-3.4-7-.4-10.2 1.7 8.3 1.7 8.3l1.3-1.9s-2-8.6.2-10.4 1.2 8.3 1.2 8.3l1.4-1.8s-1.5-8.4.7-10 .9 8 .9 8l1.6-2s-1.2-8 1.5-9.9.3 7.6.3 7.6l1.8-2s-.8-7.3 1.5-9c2.3-1.6.4 7 .4 7l1.6-1.8s-.5-6.8 1.7-8.4.2 6.5.2 6.5l1.7-1.6s-.4-6.9 2.4-8.2-.5 6.4-.5 6.4l2-1.6s.5-8 2.9-8.7c2.4-.8-1 7-1 7l1.7-1.4s.9-6.8 3.5-7.6c2.7-.9-1.6 6.2-1.6 6.2l1.7-1.3s1.9-6.8 4.4-7.6c2.4-.7-2.6 6.5-2.6 6.5l1.7-1.2s2.7-6.2 5-6.6c2.1-.4-2.6 5.1-2.6 5.1l2.1-1.2s3.5-6.4 4.8-4.5-5 4.9-5 4.9l-2 1.2s7.5-3.6 8.4-1.8-10.3 3-10.3 3l-1.8 1.2s7.5-2 6.6-.1-8.4 1.5-8.4 1.5l-1.7 1.2s7.5-1.8 6.5 0c-1 1.6-8.3 1.5-8.3 1.5l-1.8 1.5s7.3-2 6.2.3-9.4 2.1-9.4 2.1l-2 2s7.7-2.7 7-.6c-.6 2-9.4 3-9.4 3l-2 2s8.3-2.7 5.8-.2c-2.4 2.6-8.5 3.2-8.5 3.2l-2.3 3s8.2-5 7-2.2-9.2 4.7-9.2 4.7l-1.6 2s7.4-4.3 6.6-2c-.7 2.5-8.6 5-8.6 5l-1.3 1.8s8.7-5.2 8-2.5c-.8 2.6-9.1 4.5-9.1 4.5l-1 1.7s8-4.7 8-2.4c.2 2.2-9.4 4.4-9.4 4.4z"/></g><use xlink:href="#vu-b" width="100%" height="100%" transform="matrix(-1 0 0 1 220 0)"/></g></svg>`;

/** Gets layers that belong to a specific target */
function getTargetLayers(targetCode) {
  const layers = getDashboardLayers();
  return layers.filter(l => l.metadata?.targets?.includes(targetCode));
}

/** Gets the target config object */
function getTargetConfig(targetCode) {
  return targetsConfig.targets.find(t => t.code === targetCode);
}

/** Gets the expected layers for a target */
function getExpectedForTarget(targetCode) {
  return EXPECTED_LAYERS.filter(el => el.target === targetCode);
}

/** Format hectares with appropriate precision */
function fmtHa(val) {
  if (!val && val !== 0) return '0';
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(2) + 'M';
  if (val >= 1_000) return (val / 1_000).toFixed(1) + 'K';
  return val.toFixed(1);
}

/** Format hectares with commas, full precision for tables */
function fmtHaFull(val) {
  if (!val && val !== 0) return '0.00';
  return val.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Format percentage */
function fmtPct(val) {
  if (!val && val !== 0) return '0.0%';
  return val.toFixed(1) + '%';
}

/**
 * Builds professional legend HTML from layers, expanding LAND_COVER sub-types.
 */
function buildLegendHtml(layers, showProvince) {
  const entries = collectLegendEntries(layers);
  let html = entries.map(e => {
    const label = e.label || CATEGORIES[e.key]?.label || e.key;
    return `<div class="print-legend-item">
      <span class="print-legend-swatch" style="background:${e.fill};border-color:${e.stroke}"></span>
      <span>${label}</span>
    </div>`;
  }).join('');
  if (showProvince) {
    html += '<div class="print-legend-item"><span class="print-legend-swatch print-legend-swatch-province"></span><span>Province Boundary</span></div>';
  }
  return html;
}

/**
 * Opens the print view for a single target.
 */
export function openPrintMap(targetCode) {
  closePrintOverlay();
  const target = getTargetConfig(targetCode);
  if (!target) return;

  const overlay = buildOverlay([targetCode]);
  document.body.appendChild(overlay);
  document.body.classList.add('print-mode');

  // Render the single page
  const pageContainer = overlay.querySelector('#print-pages');
  renderTargetPage(pageContainer, targetCode, target);

  // Wire close and print buttons
  overlay.querySelector('#print-close-btn').addEventListener('click', closePrintOverlay);
  overlay.querySelector('#print-print-btn').addEventListener('click', () => window.print());
}

/**
 * Opens the print view for a single target with one map page per province.
 */
export function openPrintProvinceMaps(targetCode) {
  closePrintOverlay();
  const target = getTargetConfig(targetCode);
  if (!target) return;

  const state = getAppState();
  const provinces = state.provinces || [];
  if (provinces.length === 0) return;

  const overlay = buildOverlay([targetCode], `${targetCode} — By Province (${provinces.length})`);
  document.body.appendChild(overlay);
  document.body.classList.add('print-mode');

  const pageContainer = overlay.querySelector('#print-pages');

  for (const province of provinces) {
    renderProvincePage(pageContainer, targetCode, target, province);
  }

  overlay.querySelector('#print-close-btn').addEventListener('click', closePrintOverlay);
  overlay.querySelector('#print-print-btn').addEventListener('click', () => window.print());
}

/**
 * Opens the print view for all targets (one map page per target).
 */
export function openPrintAllMaps() {
  closePrintOverlay();

  const targetCodes = targetsConfig.targets.map(t => t.code);
  const overlay = buildOverlay(targetCodes);
  document.body.appendChild(overlay);
  document.body.classList.add('print-mode');

  const pageContainer = overlay.querySelector('#print-pages');

  for (const code of targetCodes) {
    const target = getTargetConfig(code);
    if (!target) continue;
    renderTargetPage(pageContainer, code, target);
  }

  overlay.querySelector('#print-close-btn').addEventListener('click', closePrintOverlay);
  overlay.querySelector('#print-print-btn').addEventListener('click', () => window.print());
}

/**
 * Closes and removes the print overlay.
 */
export function closePrintOverlay() {
  const existing = document.getElementById(OVERLAY_ID);
  if (existing) existing.remove();
  document.body.classList.remove('print-mode');
}

/**
 * Builds the outer overlay DOM with toolbar.
 */
function buildOverlay(targetCodes, customLabel) {
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.className = 'print-overlay';

  const label = customLabel
    ? `Print Maps: ${customLabel}`
    : targetCodes.length === 1
      ? `Print Map: ${targetCodes[0]}`
      : `Print All Target Maps (${targetCodes.length})`;

  overlay.innerHTML = `
    <div class="print-toolbar no-print">
      <div style="display:flex;align-items:center;gap:12px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        <span style="font-weight:600;font-size:15px">${label}</span>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" id="print-print-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print / Save PDF
        </button>
        <button class="btn btn-outline" id="print-close-btn">Close</button>
      </div>
    </div>
    <div class="print-pages" id="print-pages"></div>
  `;

  return overlay;
}

/**
 * Renders one print page for a target and appends it to the container.
 * Includes detailed technical metrics suitable for GBF/NBSAP reporting.
 */
function renderTargetPage(container, targetCode, target) {
  const state = getAppState();
  const layers = getTargetLayers(targetCode);
  const expected = getExpectedForTarget(targetCode);
  const baselines = ENV.nationalBaselines;

  // Compute metrics (now includes dissolution)
  let metrics;
  if (targetCode === 'T3') {
    metrics = compute30x30Metrics(layers, { targets: [targetCode], province: 'All', category: 'All', realm: 'All', year: 'All' });
  } else {
    metrics = computeTargetMetrics(layers, targetCode, { targets: [targetCode], province: 'All', category: 'All', realm: 'All', year: 'All' });
  }

  // Count features (excluding reference layers)
  let totalFeatures = 0;
  let refLayerCount = 0;
  for (const l of layers) {
    if (l.metadata?.isReference) { refLayerCount++; continue; }
    totalFeatures += l.geojson?.features?.length || 0;
  }
  const dataLayerCount = layers.length - refLayerCount;

  // Extract realm and area data
  const isT3 = targetCode === 'T3';
  const netTerrestrial = isT3 ? (metrics.terrestrial_ha || 0) : (metrics.realmTotals?.terrestrial_ha || 0);
  const netMarine = isT3 ? (metrics.marine_ha || 0) : (metrics.realmTotals?.marine_ha || 0);
  const grossTerrestrial = isT3 ? (metrics.gross_terrestrial_ha || 0) : (metrics.realmTotals?.gross_terrestrial_ha || 0);
  const grossMarine = isT3 ? (metrics.gross_marine_ha || 0) : (metrics.realmTotals?.gross_marine_ha || 0);
  const totalNetArea = isT3 ? (netTerrestrial + netMarine) : (metrics.totalAreaHa || 0);
  const totalGrossArea = isT3 ? (grossTerrestrial + grossMarine) : (metrics.grossAreaHa || 0);
  const tPct = baselines.terrestrial_ha > 0 ? (netTerrestrial / baselines.terrestrial_ha) * 100 : 0;
  const mPct = baselines.marine_ha > 0 ? (netMarine / baselines.marine_ha) * 100 : 0;

  const page = document.createElement('div');
  page.className = 'print-page';
  const mapId = `print-map-${targetCode}`;

  // Build legend HTML using symbology-aware helper
  const legendItems = buildLegendHtml(layers, !!state.provincesGeojson);

  // ── Metrics row: 6 boxes with key technical figures ──
  const metricsHtml = `
    <div class="print-metrics-row">
      <div class="print-metric"><span class="print-metric-value">${fmtHa(netTerrestrial)}</span><span class="print-metric-label">Terrestrial (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${fmtHa(netMarine)}</span><span class="print-metric-label">Marine (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${fmtPct(tPct)}</span><span class="print-metric-label">% Land (of ${fmtHa(baselines.terrestrial_ha)})</span></div>
      <div class="print-metric"><span class="print-metric-value">${fmtPct(mPct)}</span><span class="print-metric-label">% Sea (of ${fmtHa(baselines.marine_ha)})</span></div>
      <div class="print-metric"><span class="print-metric-value">${totalFeatures.toLocaleString()}</span><span class="print-metric-label">Features</span></div>
      <div class="print-metric"><span class="print-metric-value">${dataLayerCount}</span><span class="print-metric-label">Data Layers</span></div>
    </div>
  `;

  // ── Province breakdown table (full) ──
  const provBreakdown = metrics?.provinceBreakdown || [];
  let provTableHtml = '';
  if (provBreakdown.length > 0) {
    const provRows = provBreakdown.map(p => {
      const name = p.province || 'Unknown';
      const tHa = p.terrestrial_ha ?? 0;
      const mHa = p.marine_ha ?? 0;
      const total = p.total_ha ?? 0;
      const feats = p.features ?? 0;
      return `<tr><td>${name}</td><td class="r">${fmtHaFull(tHa)}</td><td class="r">${fmtHaFull(mHa)}</td><td class="r"><b>${fmtHaFull(total)}</b></td><td class="r">${feats}</td></tr>`;
    }).join('');
    // Totals row
    const tTotalT = provBreakdown.reduce((s, p) => s + (p.terrestrial_ha || 0), 0);
    const tTotalM = provBreakdown.reduce((s, p) => s + (p.marine_ha || 0), 0);
    const tTotalA = provBreakdown.reduce((s, p) => s + (p.total_ha || 0), 0);
    const tTotalF = provBreakdown.reduce((s, p) => s + (p.features || 0), 0);
    provTableHtml = `
      <div class="print-detail-table">
        <div class="print-section-title">Provincial Breakdown (dissolved net area, UNEP-WCMC)</div>
        <table>
          <thead><tr><th>Province</th><th class="r">Terrestrial (ha)</th><th class="r">Marine (ha)</th><th class="r">Total (ha)</th><th class="r">Features</th></tr></thead>
          <tbody>${provRows}</tbody>
          <tfoot><tr class="total-row"><td><b>TOTAL</b></td><td class="r"><b>${fmtHaFull(tTotalT)}</b></td><td class="r"><b>${fmtHaFull(tTotalM)}</b></td><td class="r"><b>${fmtHaFull(tTotalA)}</b></td><td class="r"><b>${tTotalF}</b></td></tr></tfoot>
        </table>
      </div>
    `;
  }

  // ── Category breakdown table ──
  const catBreakdown = metrics?.categoryBreakdown || [];
  let catTableHtml = '';
  if (catBreakdown.length > 0) {
    const catRows = catBreakdown.map(c => {
      const colors = resolveColors(c.category);
      const catDef = CATEGORIES[c.category] || { label: c.category };
      return `<tr><td><span class="cat-dot" style="background:${colors.fill};border-color:${colors.stroke}"></span>${catDef.label}</td><td class="r">${fmtHaFull(c.area_ha)}</td><td class="r">${fmtHaFull(c.gross_area_ha)}</td><td class="r">${c.features}</td></tr>`;
    }).join('');
    catTableHtml = `
      <div class="print-detail-table">
        <div class="print-section-title">Category Breakdown</div>
        <table>
          <thead><tr><th>Category</th><th class="r">Net Area (ha)</th><th class="r">Gross Area (ha)</th><th class="r">Features</th></tr></thead>
          <tbody>${catRows}</tbody>
        </table>
      </div>
    `;
  }

  // ── Data sources table (detailed) ──
  const srcRows = layers.map(l => {
    const meta = l.metadata || {};
    const name = meta.name || l.id;
    const catLabel = CATEGORIES[meta.category]?.label || meta.category || '-';
    const realm = meta.realm || 'terrestrial';
    const feats = l.geojson?.features?.length || 0;
    const areaHa = (l.geojson?.features || []).reduce((s, f) => s + (f.properties?.area_ha || 0), 0);
    const uploaded = meta.uploadTimestamp ? new Date(meta.uploadTimestamp).toLocaleDateString('en-GB') : '-';
    const ref = meta.isReference ? '<span class="ref-badge">REF</span>' : '';
    return `<tr><td>${name} ${ref}</td><td>${catLabel}</td><td>${realm}</td><td class="r">${feats}</td><td class="r">${fmtHaFull(areaHa)}</td><td>${uploaded}</td></tr>`;
  }).join('');
  const srcTableHtml = layers.length > 0 ? `
    <div class="print-detail-table print-src-table">
      <div class="print-section-title">Data Sources</div>
      <table>
        <thead><tr><th>Layer Name</th><th>Category</th><th>Realm</th><th class="r">Features</th><th class="r">Gross Area (ha)</th><th>Uploaded</th></tr></thead>
        <tbody>${srcRows}</tbody>
      </table>
    </div>
  ` : '<div class="print-detail-table"><div class="print-section-title">Data Sources</div><div style="color:#999;font-size:9px">No data layers uploaded for this target</div></div>';

  // ── Summary stats line ──
  const overlapPct = totalGrossArea > 0 ? ((1 - totalNetArea / totalGrossArea) * 100).toFixed(1) : '0.0';
  const summaryLine = `Net area: ${fmtHaFull(totalNetArea)} ha | Gross area: ${fmtHaFull(totalGrossArea)} ha | Overlap removed: ${overlapPct}%${refLayerCount > 0 ? ` | Reference layers: ${refLayerCount} (excluded from calculations)` : ''}`;

  page.innerHTML = `
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          ${FLAG_SVG}
          <div>
            <div class="print-title-main">Vanuatu NBSAP GIS Portal</div>
            <div class="print-title-sub">National Biodiversity Strategies and Action Plan</div>
          </div>
        </div>
      </div>
      <div class="print-title-right">
        <div class="print-title-date">${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        <div class="print-title-crs">CRS: EPSG:4326 (WGS 84)</div>
      </div>
    </div>

    <div class="print-target-bar">
      <div class="print-target-code">${targetCode}</div>
      <div class="print-target-info">
        <div class="print-target-name">${target.name}</div>
        <div class="print-target-desc">${target.description}</div>
      </div>
    </div>

    ${metricsHtml}

    <div class="print-map-area">
      <div class="print-map-container" id="${mapId}"></div>
      <div class="print-map-furniture">
        <div class="print-legend-box">
          <div class="print-legend-title">Legend</div>
          ${legendItems}
        </div>
        <div class="print-north-arrow">
          <svg width="36" height="48" viewBox="0 0 36 48">
            <polygon points="18,2 24,22 18,18 12,22" fill="#333" stroke="#333" stroke-width="0.5"/>
            <polygon points="18,2 12,22 18,18 24,22" fill="#fff" stroke="#333" stroke-width="0.5" opacity="0.4"/>
            <text x="18" y="38" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">N</text>
          </svg>
        </div>
      </div>
    </div>

    <div class="print-summary-line">${summaryLine}</div>

    <div class="print-bottom-section">
      ${provTableHtml}
      <div class="print-bottom-right">
        ${catTableHtml}
        ${srcTableHtml}
      </div>
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> Vanua Spatial Solutions &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Printed: ${new Date().toLocaleString('en-GB')} &bull; WGS 84 &bull; Dissolution: UNEP-WCMC methodology
      </div>
    </div>
  `;

  container.appendChild(page);

  // ── Render comprehensive analysis page ──
  const analysis = generateTargetAnalysis(targetCode, layers, metrics, expected, baselines);
  renderAnalysisPage(container, targetCode, target, analysis);

  requestAnimationFrame(() => {
    setTimeout(() => initPrintLeafletMap(mapId, targetCode, layers, state.provincesGeojson), 100);
  });
}

/**
 * Renders one print page for a target filtered to a single province.
 * Shows detailed province-specific technical results.
 */
function renderProvincePage(container, targetCode, target, provinceName) {
  const state = getAppState();
  const layers = getTargetLayers(targetCode);
  const baselines = ENV.nationalBaselines;
  const provinceFilter = { targets: [targetCode], province: provinceName, category: 'All', realm: 'All', year: 'All' };

  // Compute metrics filtered to this province
  let metrics;
  const isT3 = targetCode === 'T3';
  if (isT3) {
    metrics = compute30x30Metrics(layers, provinceFilter);
  } else {
    metrics = computeTargetMetrics(layers, targetCode, provinceFilter);
  }

  // Count features in this province (excluding reference layers)
  let totalFeatures = 0;
  let refLayerCount = 0;
  for (const l of layers) {
    if (l.metadata?.isReference) { refLayerCount++; continue; }
    const feats = (l.geojson?.features || []).filter(f => f.properties.province === provinceName);
    totalFeatures += feats.length;
  }

  const netTerrestrial = isT3 ? (metrics.terrestrial_ha || 0) : (metrics.realmTotals?.terrestrial_ha || 0);
  const netMarine = isT3 ? (metrics.marine_ha || 0) : (metrics.realmTotals?.marine_ha || 0);
  const totalNetArea = isT3 ? (netTerrestrial + netMarine) : (metrics.totalAreaHa || 0);
  const totalGrossArea = isT3 ? ((metrics.gross_terrestrial_ha || 0) + (metrics.gross_marine_ha || 0)) : (metrics.grossAreaHa || 0);
  const tPct = baselines.terrestrial_ha > 0 ? (netTerrestrial / baselines.terrestrial_ha) * 100 : 0;
  const mPct = baselines.marine_ha > 0 ? (netMarine / baselines.marine_ha) * 100 : 0;

  const page = document.createElement('div');
  page.className = 'print-page';
  const mapId = `print-map-${targetCode}-${provinceName.replace(/\s+/g, '-')}`;

  // Legend — symbology-aware
  const legendItems = buildLegendHtml(layers, true);

  // Metrics row — detailed
  const metricsHtml = `
    <div class="print-metrics-row">
      <div class="print-metric"><span class="print-metric-value">${fmtHa(netTerrestrial)}</span><span class="print-metric-label">Terrestrial (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${fmtHa(netMarine)}</span><span class="print-metric-label">Marine (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${fmtPct(tPct)}</span><span class="print-metric-label">% National Land</span></div>
      <div class="print-metric"><span class="print-metric-value">${fmtPct(mPct)}</span><span class="print-metric-label">% National Sea</span></div>
      <div class="print-metric"><span class="print-metric-value">${totalFeatures.toLocaleString()}</span><span class="print-metric-label">Features</span></div>
      <div class="print-metric"><span class="print-metric-value">${fmtHa(totalNetArea)}</span><span class="print-metric-label">Total Net (ha)</span></div>
    </div>
  `;

  // Category breakdown for this province
  const catBreakdown = metrics?.categoryBreakdown || [];
  let catTableHtml = '';
  if (catBreakdown.length > 0) {
    const catRows = catBreakdown.map(c => {
      const colors = resolveColors(c.category);
      const catDef = CATEGORIES[c.category] || { label: c.category };
      return `<tr><td><span class="cat-dot" style="background:${colors.fill};border-color:${colors.stroke}"></span>${catDef.label}</td><td class="r">${fmtHaFull(c.area_ha)}</td><td class="r">${c.features}</td></tr>`;
    }).join('');
    catTableHtml = `
      <div class="print-detail-table">
        <div class="print-section-title">Category Breakdown</div>
        <table>
          <thead><tr><th>Category</th><th class="r">Net Area (ha)</th><th class="r">Features</th></tr></thead>
          <tbody>${catRows}</tbody>
        </table>
      </div>
    `;
  }

  // Data sources with province feature counts
  const srcRows = layers.filter(l => !l.metadata?.isReference).map(l => {
    const meta = l.metadata || {};
    const name = meta.name || l.id;
    const catLabel = CATEGORIES[meta.category]?.label || meta.category || '-';
    const provFeats = (l.geojson?.features || []).filter(f => f.properties.province === provinceName);
    const areaHa = provFeats.reduce((s, f) => s + (f.properties?.area_ha || 0), 0);
    if (provFeats.length === 0) return '';
    return `<tr><td>${name}</td><td>${catLabel}</td><td class="r">${provFeats.length}</td><td class="r">${fmtHaFull(areaHa)}</td></tr>`;
  }).filter(Boolean).join('');

  const srcTableHtml = srcRows ? `
    <div class="print-detail-table">
      <div class="print-section-title">Data Sources (${provinceName})</div>
      <table>
        <thead><tr><th>Layer</th><th>Category</th><th class="r">Features</th><th class="r">Gross Area (ha)</th></tr></thead>
        <tbody>${srcRows}</tbody>
      </table>
    </div>
  ` : '';

  const overlapPct = totalGrossArea > 0 ? ((1 - totalNetArea / totalGrossArea) * 100).toFixed(1) : '0.0';
  const summaryLine = `Net area: ${fmtHaFull(totalNetArea)} ha | Gross area: ${fmtHaFull(totalGrossArea)} ha | Overlap removed: ${overlapPct}%`;

  page.innerHTML = `
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          ${FLAG_SVG}
          <div>
            <div class="print-title-main">Vanuatu NBSAP GIS Portal</div>
            <div class="print-title-sub">National Biodiversity Strategies and Action Plan</div>
          </div>
        </div>
      </div>
      <div class="print-title-right">
        <div class="print-title-date">${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        <div class="print-title-crs">CRS: EPSG:4326 (WGS 84)</div>
      </div>
    </div>

    <div class="print-target-bar">
      <div class="print-target-code">${targetCode}</div>
      <div class="print-target-info">
        <div class="print-target-name">${target.name} &mdash; ${provinceName}</div>
        <div class="print-target-desc">${target.description}</div>
      </div>
    </div>

    ${metricsHtml}

    <div class="print-map-area">
      <div class="print-map-container" id="${mapId}"></div>
      <div class="print-map-furniture">
        <div class="print-legend-box">
          <div class="print-legend-title">Legend</div>
          ${legendItems}
        </div>
        <div class="print-north-arrow">
          <svg width="36" height="48" viewBox="0 0 36 48">
            <polygon points="18,2 24,22 18,18 12,22" fill="#333" stroke="#333" stroke-width="0.5"/>
            <polygon points="18,2 12,22 18,18 24,22" fill="#fff" stroke="#333" stroke-width="0.5" opacity="0.4"/>
            <text x="18" y="38" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">N</text>
          </svg>
        </div>
      </div>
    </div>

    <div class="print-summary-line">${summaryLine}</div>

    <div class="print-bottom-section">
      ${catTableHtml}
      ${srcTableHtml}
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> Vanua Spatial Solutions &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Printed: ${new Date().toLocaleString('en-GB')} &bull; WGS 84 &bull; Dissolution: UNEP-WCMC methodology
      </div>
    </div>
  `;

  container.appendChild(page);

  requestAnimationFrame(() => {
    setTimeout(() => initPrintLeafletMap(mapId, targetCode, layers, state.provincesGeojson, provinceName), 100);
  });
}

// ═══════════════════════════════════════════════════════════════════════
//  COMPREHENSIVE ANALYSIS ENGINE
// ═══════════════════════════════════════════════════════════════════════

/** GBF target thresholds — target-specific goals where applicable */
const TARGET_THRESHOLDS = {
  T3: { terrestrial: 30, marine: 30, label: '30% by 2030 (GBF Target 3)' },
  T1: { terrestrial: 100, marine: 100, label: '100% spatial plan coverage' },
  T2: { terrestrial: null, marine: null, label: 'Map all degraded areas' }
};

/** Valid provinces for distribution analysis */
const ANALYSIS_PROVINCES = ['Torba', 'Sanma', 'Penama', 'Malampa', 'Shefa', 'Tafea'];

/**
 * Generates comprehensive quantitative and qualitative analysis for a target.
 *
 * @param {string} targetCode
 * @param {Array} layers - target layers
 * @param {object} metrics - pre-computed metrics from areaCalc
 * @param {Array} expected - expected layers from config
 * @param {object} baselines - national baseline areas
 * @returns {object} Complete analysis results
 */
function generateTargetAnalysis(targetCode, layers, metrics, expected, baselines) {
  const isT3 = targetCode === 'T3';

  // ── Data inventory ──
  const dataLayers = layers.filter(l => !l.metadata?.isReference);
  const refLayers = layers.filter(l => l.metadata?.isReference);
  const uploadedCategories = new Set(dataLayers.map(l => l.metadata?.category));
  const expectedCategories = new Set(expected.map(e => e.category));
  const missingLayers = expected.filter(e => {
    return !dataLayers.some(l => l.metadata?.category === e.category);
  });
  const dataCompleteness = expected.length > 0
    ? Math.round((1 - missingLayers.length / expected.length) * 100)
    : (dataLayers.length > 0 ? 100 : 0);

  // ── Feature statistics ──
  let totalFeatures = 0;
  let totalPolygons = 0;
  let totalPoints = 0;
  let validGeoms = 0;
  let fixedGeoms = 0;
  let droppedGeoms = 0;
  for (const l of dataLayers) {
    const m = l.metadata || {};
    totalFeatures += l.geojson?.features?.length || 0;
    validGeoms += m.validGeometryCount || 0;
    fixedGeoms += m.fixedCount || 0;
    droppedGeoms += m.droppedCount || 0;
    for (const f of (l.geojson?.features || [])) {
      const gt = f.geometry?.type;
      if (gt === 'Polygon' || gt === 'MultiPolygon') totalPolygons++;
      else if (gt === 'Point' || gt === 'MultiPoint') totalPoints++;
    }
  }
  const geomQuality = totalFeatures > 0
    ? Math.round(((totalFeatures - droppedGeoms) / totalFeatures) * 100)
    : 100;

  // ── Area metrics ──
  const netTerrestrial = isT3 ? (metrics.terrestrial_ha || 0) : (metrics.realmTotals?.terrestrial_ha || 0);
  const netMarine = isT3 ? (metrics.marine_ha || 0) : (metrics.realmTotals?.marine_ha || 0);
  const grossTerrestrial = isT3 ? (metrics.gross_terrestrial_ha || 0) : (metrics.realmTotals?.gross_terrestrial_ha || 0);
  const grossMarine = isT3 ? (metrics.gross_marine_ha || 0) : (metrics.realmTotals?.gross_marine_ha || 0);
  const totalNetArea = isT3 ? (netTerrestrial + netMarine) : (metrics.totalAreaHa || 0);
  const totalGrossArea = isT3 ? (grossTerrestrial + grossMarine) : (metrics.grossAreaHa || 0);
  const tPct = baselines.terrestrial_ha > 0 ? (netTerrestrial / baselines.terrestrial_ha) * 100 : 0;
  const mPct = baselines.marine_ha > 0 ? (netMarine / baselines.marine_ha) * 100 : 0;
  const overlapPct = totalGrossArea > 0 ? (1 - totalNetArea / totalGrossArea) * 100 : 0;
  const dissolutionFactor = totalGrossArea > 0 ? totalNetArea / totalGrossArea : 1;

  // ── Province analysis ──
  const provBreakdown = metrics?.provinceBreakdown || [];
  const provincesWithData = provBreakdown.filter(p => p.total_ha > 0);
  const provincesWithoutData = ANALYSIS_PROVINCES.filter(
    prov => !provBreakdown.some(p => p.province === prov && p.total_ha > 0)
  );
  const maxProvince = provBreakdown.length > 0
    ? provBreakdown.reduce((max, p) => p.total_ha > max.total_ha ? p : max, provBreakdown[0])
    : null;
  const minProvince = provincesWithData.length > 0
    ? provincesWithData.reduce((min, p) => p.total_ha < min.total_ha ? p : min, provincesWithData[0])
    : null;

  // ── Category analysis ──
  const catBreakdown = metrics?.categoryBreakdown || [];
  const dominantCategory = catBreakdown.length > 0 ? catBreakdown[0] : null;
  const catConcentration = (catBreakdown.length > 0 && totalNetArea > 0)
    ? (catBreakdown[0].area_ha / totalNetArea * 100)
    : 0;

  // ── Type/species breakdown (for T4, T6, T10) ──
  const typeBreakdown = metrics?.typeBreakdown || [];

  // ── Thresholds & progress ──
  const threshold = TARGET_THRESHOLDS[targetCode];
  let progressAssessment = null;
  if (threshold) {
    const tGap = threshold.terrestrial !== null ? Math.max(0, threshold.terrestrial - tPct) : null;
    const mGap = threshold.marine !== null ? Math.max(0, threshold.marine - mPct) : null;
    progressAssessment = { threshold, tGap, mGap };
  }

  // ── Overall status ──
  let status, statusColor, statusIcon;
  if (dataLayers.length === 0) {
    status = 'No Data';
    statusColor = '#D32F2F';
    statusIcon = 'cross';
  } else if (dataCompleteness >= 80 && geomQuality >= 90) {
    status = 'Comprehensive';
    statusColor = '#2E7D32';
    statusIcon = 'check';
  } else if (dataCompleteness >= 50 || dataLayers.length >= 2) {
    status = 'Moderate';
    statusColor = '#ED6C02';
    statusIcon = 'partial';
  } else {
    status = 'Minimal';
    statusColor = '#D32F2F';
    statusIcon = 'warning';
  }

  // ── Key findings (auto-generated) ──
  const findings = [];
  if (totalNetArea > 0) {
    findings.push(`Total dissolved (net) coverage is <strong>${fmtHaFull(totalNetArea)} ha</strong>, representing <strong>${fmtPct(tPct)}</strong> of national terrestrial area and <strong>${fmtPct(mPct)}</strong> of marine area.`);
  }
  if (overlapPct > 5) {
    findings.push(`Significant spatial overlap detected: <strong>${overlapPct.toFixed(1)}%</strong> of gross area removed during dissolution, indicating overlapping ${CATEGORIES[catBreakdown[0]?.category]?.label || 'conservation'} designations.`);
  } else if (overlapPct > 0 && totalGrossArea > 0) {
    findings.push(`Minimal spatial overlap (<strong>${overlapPct.toFixed(1)}%</strong>) between layers — most designations occupy distinct areas.`);
  }
  if (maxProvince && provincesWithData.length > 1) {
    const maxPct = totalNetArea > 0 ? (maxProvince.total_ha / totalNetArea * 100).toFixed(0) : 0;
    findings.push(`<strong>${maxProvince.province}</strong> province has the highest coverage (<strong>${fmtHaFull(maxProvince.total_ha)} ha</strong>, ${maxPct}% of target total).`);
  }
  if (provincesWithoutData.length > 0 && dataLayers.length > 0) {
    findings.push(`<strong>${provincesWithoutData.length}</strong> province(s) have no reported data: ${provincesWithoutData.join(', ')}.`);
  }
  if (isT3 && progressAssessment) {
    if (tPct >= 30) {
      findings.push(`Terrestrial 30% target <strong>achieved</strong> at ${fmtPct(tPct)} coverage.`);
    } else {
      findings.push(`Terrestrial coverage gap: <strong>${fmtPct(progressAssessment.tGap)}</strong> remaining to reach 30% target (need additional <strong>${fmtHaFull(progressAssessment.tGap * baselines.terrestrial_ha / 100)} ha</strong>).`);
    }
    if (mPct >= 30) {
      findings.push(`Marine 30% target <strong>achieved</strong> at ${fmtPct(mPct)} coverage.`);
    } else {
      findings.push(`Marine coverage gap: <strong>${fmtPct(progressAssessment.mGap)}</strong> remaining to reach 30% target (need additional <strong>${fmtHaFull(progressAssessment.mGap * baselines.marine_ha / 100)} ha</strong>).`);
    }
  }
  if (dominantCategory && catBreakdown.length > 1 && catConcentration > 60) {
    findings.push(`Coverage is concentrated in <strong>${CATEGORIES[dominantCategory.category]?.label || dominantCategory.category}</strong> (${catConcentration.toFixed(0)}% of total), suggesting limited diversity of designation types.`);
  }
  if (refLayers.length > 0) {
    findings.push(`${refLayers.length} reference layer(s) displayed for context but excluded from area calculations.`);
  }
  if (totalPoints > 0 && totalPolygons > 0) {
    findings.push(`Dataset contains both polygon (<strong>${totalPolygons}</strong>) and point (<strong>${totalPoints}</strong>) features. Only polygon features contribute to area calculations.`);
  } else if (totalPoints > 0 && totalPolygons === 0) {
    findings.push(`Dataset contains only point features (<strong>${totalPoints}</strong>). Area calculations are not applicable for point data.`);
  }

  // ── Target-specific qualitative insights ──
  const insights = generateTargetInsights(targetCode, {
    tPct, mPct, totalNetArea, totalFeatures, dataLayers, catBreakdown, typeBreakdown,
    provincesWithData, provincesWithoutData, missingLayers, overlapPct
  });

  // ── Recommendations ──
  const recommendations = [];
  if (missingLayers.length > 0) {
    recommendations.push(`Upload missing data layers: ${missingLayers.map(l => '<strong>' + l.name + '</strong>').join(', ')}.`);
  }
  if (provincesWithoutData.length > 0 && dataLayers.length > 0) {
    recommendations.push(`Collect and upload spatial data for underrepresented provinces: ${provincesWithoutData.join(', ')}.`);
  }
  if (geomQuality < 95 && droppedGeoms > 0) {
    recommendations.push(`${droppedGeoms} feature(s) had invalid geometries and were dropped. Review source data quality for affected layers.`);
  }
  if (fixedGeoms > 0) {
    recommendations.push(`${fixedGeoms} geometry(s) were automatically repaired. Verify spatial accuracy of corrected features.`);
  }
  if (overlapPct > 20) {
    recommendations.push(`High overlap (${overlapPct.toFixed(0)}%) suggests potential boundary duplication. Review layer boundaries for redundant designations.`);
  }
  if (totalPoints > 0 && totalPolygons === 0) {
    recommendations.push(`Convert point observations to polygon coverage areas where feasible to enable area-based reporting.`);
  }
  if (dataLayers.length === 0) {
    recommendations.push(`No data layers have been uploaded for this target. Upload spatial datasets to enable quantitative analysis.`);
  }

  return {
    // Quantitative
    dataLayers: dataLayers.length,
    refLayers: refLayers.length,
    totalFeatures, totalPolygons, totalPoints,
    validGeoms, fixedGeoms, droppedGeoms, geomQuality,
    netTerrestrial, netMarine, grossTerrestrial, grossMarine,
    totalNetArea, totalGrossArea,
    tPct, mPct, overlapPct, dissolutionFactor,
    dataCompleteness,
    missingLayers,
    provBreakdown, provincesWithData, provincesWithoutData,
    maxProvince, minProvince,
    catBreakdown, dominantCategory, catConcentration,
    typeBreakdown,
    progressAssessment,
    // Qualitative
    status, statusColor, statusIcon,
    findings, insights, recommendations
  };
}

/**
 * Generates target-specific qualitative insights based on the target type.
 */
function generateTargetInsights(targetCode, data) {
  const insights = [];

  switch (targetCode) {
    case 'T1':
      if (data.totalNetArea > 0) {
        insights.push(`Spatial planning coverage extends to ${fmtPct(data.tPct)} of national land area. Comprehensive spatial plans are essential for effective biodiversity mainstreaming across all development sectors.`);
      }
      if (data.catBreakdown.some(c => c.category === 'KBA')) {
        insights.push(`Key Biodiversity Areas (KBAs) have been mapped, providing critical context for biodiversity-inclusive spatial planning as required under GBF Target 1.`);
      }
      break;

    case 'T2':
      if (data.catBreakdown.some(c => c.category === 'DEGRADED')) {
        const degraded = data.catBreakdown.find(c => c.category === 'DEGRADED');
        insights.push(`Degraded area mapping covers <strong>${fmtHaFull(degraded.area_ha)} ha</strong>. This baseline is critical for tracking restoration progress under Vanuatu's NBSAP commitments.`);
      }
      if (data.catBreakdown.some(c => c.category === 'RESTORATION')) {
        const restored = data.catBreakdown.find(c => c.category === 'RESTORATION');
        insights.push(`Active restoration sites total <strong>${fmtHaFull(restored.area_ha)} ha</strong>, contributing to the 30% ecosystem restoration goal.`);
      }
      if (!data.catBreakdown.some(c => c.category === 'DEGRADED')) {
        insights.push(`No degraded area mapping data available. Baseline degradation mapping is a prerequisite for planning effective restoration activities.`);
      }
      break;

    case 'T3': {
      const tGap = Math.max(0, 30 - data.tPct);
      const mGap = Math.max(0, 30 - data.mPct);
      if (data.tPct >= 30 && data.mPct >= 30) {
        insights.push(`Vanuatu has achieved the GBF 30x30 target for both terrestrial and marine realms. This analysis uses dissolved area calculations per UNEP-WCMC methodology to prevent double-counting of overlapping designations.`);
      } else {
        const gaps = [];
        if (tGap > 0) gaps.push(`terrestrial (${fmtPct(tGap)} remaining)`);
        if (mGap > 0) gaps.push(`marine (${fmtPct(mGap)} remaining)`);
        insights.push(`Progress toward the 30x30 target shows gaps in ${gaps.join(' and ')}. Expansion of Community Conserved Areas (CCAs) and Locally Managed Marine Areas (LMMAs) represents the most culturally appropriate pathway for Vanuatu.`);
      }
      const ccaData = data.catBreakdown.find(c => c.category === 'CCA');
      const lmmaData = data.catBreakdown.find(c => c.category === 'LMMA');
      if (ccaData || lmmaData) {
        const parts = [];
        if (ccaData) parts.push(`CCAs: ${fmtHaFull(ccaData.area_ha)} ha`);
        if (lmmaData) parts.push(`LMMAs: ${fmtHaFull(lmmaData.area_ha)} ha`);
        insights.push(`Community-based conservation is the primary mechanism: ${parts.join('; ')}. These customary management areas reflect Vanuatu's unique governance structure.`);
      }
      break;
    }

    case 'T4':
      if (data.typeBreakdown.length > 0) {
        insights.push(`Species distribution data covers <strong>${data.typeBreakdown.length}</strong> distinct species/taxa across <strong>${data.totalFeatures}</strong> observation records.`);
        const speciesList = data.typeBreakdown.slice(0, 4).map(t => t.type).join(', ');
        insights.push(`Mapped species include: ${speciesList}${data.typeBreakdown.length > 4 ? `, and ${data.typeBreakdown.length - 4} more` : ''}.`);
      }
      if (data.missingLayers.length > 0) {
        const missingSpecies = data.missingLayers.map(l => l.name).join(', ');
        insights.push(`Distribution data is still needed for: ${missingSpecies}. Complete species mapping is essential for effective conservation planning.`);
      }
      break;

    case 'T6':
      if (data.catBreakdown.some(c => c.category === 'MERREMIA')) {
        const merremia = data.catBreakdown.find(c => c.category === 'MERREMIA');
        insights.push(`Merremia peltata (Big Leaf) detection covers <strong>${fmtHaFull(merremia.area_ha)} ha</strong>. This invasive vine is one of the most significant threats to Vanuatu's native forest ecosystems.`);
      }
      if (data.totalNetArea > 0) {
        const invasivePct = data.tPct;
        insights.push(`Total invasive species coverage represents <strong>${fmtPct(invasivePct)}</strong> of national terrestrial area. Spatial analysis of IAS distribution is critical for prioritising management interventions.`);
      }
      break;

    case 'T7':
      if (data.totalNetArea > 0) {
        insights.push(`Pesticide and herbicide use areas cover <strong>${fmtHaFull(data.totalNetArea)} ha</strong>. This mapping supports biodiversity risk assessment for agricultural chemical impacts on adjacent ecosystems.`);
      } else {
        insights.push(`No pesticide/herbicide mapping data available. Systematic mapping of chemical use areas is needed to assess biodiversity impacts from agricultural practices.`);
      }
      break;

    case 'T8':
      if (data.totalNetArea > 0) {
        insights.push(`Coastal eutrophication zones cover <strong>${fmtHaFull(data.totalNetArea)} ha</strong> of marine area. Nutrient pollution monitoring is critical for coral reef health and marine biodiversity in Vanuatu.`);
      } else {
        insights.push(`No coastal eutrophication data available. Establishing water quality monitoring stations at key coastal sites would enable systematic tracking of nutrient impacts.`);
      }
      break;

    case 'T10':
      if (data.typeBreakdown.length > 0) {
        insights.push(`Land cover classification includes <strong>${data.typeBreakdown.length}</strong> distinct land use types.`);
        const topTypes = data.typeBreakdown.slice(0, 3)
          .map(t => `${t.type} (${fmtHaFull(t.area_ha)} ha)`).join(', ');
        insights.push(`Dominant land cover types: ${topTypes}.`);
      }
      if (data.provincesWithData.length > 0 && data.provincesWithData.length < 6) {
        insights.push(`Land cover data is available for ${data.provincesWithData.length} of 6 provinces. Complete national coverage is needed for comprehensive agricultural and land use change analysis.`);
      }
      break;

    case 'T12':
      if (data.totalNetArea > 0) {
        insights.push(`Blue and green space mapping covers <strong>${fmtHaFull(data.totalNetArea)} ha</strong>. These spaces are vital for urban biodiversity, community wellbeing, and climate resilience.`);
      }
      if (data.provincesWithData.length > 0) {
        insights.push(`Green space data available for ${data.provincesWithData.map(p => p.province).join(', ')}. Expansion of urban green infrastructure should be prioritised in all provincial capitals.`);
      }
      break;

    default:
      if (data.totalNetArea > 0) {
        insights.push(`Total coverage for this target is <strong>${fmtHaFull(data.totalNetArea)} ha</strong> across ${data.dataLayers.length} data layer(s).`);
      }
  }

  return insights;
}

/**
 * Renders a comprehensive analysis page for a target.
 * This page follows the map page and contains detailed quantitative
 * and qualitative results.
 */
function renderAnalysisPage(container, targetCode, target, analysis) {
  const page = document.createElement('div');
  page.className = 'print-page print-analysis-page';

  const baselines = ENV.nationalBaselines;

  // ── Status badge SVG icons ──
  const statusIcons = {
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    partial: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    warning: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    cross: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
  };

  // ── Province bar chart ──
  const maxProvArea = analysis.provBreakdown.length > 0
    ? Math.max(...analysis.provBreakdown.map(p => p.total_ha))
    : 1;
  const provBarsHtml = analysis.provBreakdown.length > 0
    ? analysis.provBreakdown.map(p => {
        const barW = maxProvArea > 0 ? Math.max(2, (p.total_ha / maxProvArea) * 100) : 0;
        return `<div class="analysis-prov-row">
          <span class="analysis-prov-name">${p.province}</span>
          <div class="analysis-prov-bar-bg">
            <div class="analysis-prov-bar" style="width:${barW}%"></div>
          </div>
          <span class="analysis-prov-val">${fmtHa(p.total_ha)} ha</span>
        </div>`;
      }).join('')
    : '<div style="color:#999;font-size:8px;padding:4px 0">No provincial data available</div>';

  // ── Data completeness bar ──
  const compColor = analysis.dataCompleteness >= 80 ? '#2E7D32'
    : analysis.dataCompleteness >= 50 ? '#ED6C02' : '#D32F2F';

  // ── Coverage assessment table ──
  const coverageRows = [
    { label: 'Terrestrial (net)', value: fmtHaFull(analysis.netTerrestrial) + ' ha', pct: fmtPct(analysis.tPct) },
    { label: 'Marine (net)', value: fmtHaFull(analysis.netMarine) + ' ha', pct: fmtPct(analysis.mPct) },
    { label: 'Total (net dissolved)', value: fmtHaFull(analysis.totalNetArea) + ' ha', pct: '' },
    { label: 'Total (gross sum)', value: fmtHaFull(analysis.totalGrossArea) + ' ha', pct: '' },
    { label: 'Overlap removed', value: fmtHaFull(analysis.totalGrossArea - analysis.totalNetArea) + ' ha', pct: analysis.overlapPct.toFixed(1) + '%' }
  ];

  // ── Category composition table ──
  const catCompRows = analysis.catBreakdown.map(c => {
    const colors = resolveColors(c.category);
    const catLabel = CATEGORIES[c.category]?.label || c.category;
    const pctOfTotal = analysis.totalNetArea > 0 ? (c.area_ha / analysis.totalNetArea * 100).toFixed(1) : '0.0';
    return `<tr>
      <td><span class="cat-dot" style="background:${colors.fill};border-color:${colors.stroke}"></span>${catLabel}</td>
      <td class="r">${fmtHaFull(c.area_ha)}</td>
      <td class="r">${pctOfTotal}%</td>
      <td class="r">${c.features}</td>
    </tr>`;
  }).join('');

  // ── Missing layers list ──
  const missingHtml = analysis.missingLayers.length > 0
    ? analysis.missingLayers.map(l =>
        `<div class="analysis-gap-item"><span class="analysis-gap-dot"></span>${l.name} <span style="color:#999">(${CATEGORIES[l.category]?.label || l.category})</span></div>`
      ).join('')
    : '<div style="color:#2E7D32;font-size:8px">All expected data layers have been uploaded</div>';

  // ── 30x30 progress bars (for T3) ──
  let progressHtml = '';
  if (analysis.progressAssessment && targetCode === 'T3') {
    const { tGap, mGap } = analysis.progressAssessment;
    const tBarW = Math.min(100, analysis.tPct / 30 * 100);
    const mBarW = Math.min(100, analysis.mPct / 30 * 100);
    progressHtml = `
      <div class="analysis-card">
        <div class="analysis-card-title">30x30 Target Progress</div>
        <div class="analysis-progress-group">
          <div class="analysis-progress-label">Terrestrial: <strong>${fmtPct(analysis.tPct)}</strong> of 30% target</div>
          <div class="analysis-progress-track">
            <div class="analysis-progress-fill" style="width:${tBarW}%;background:${analysis.tPct >= 30 ? '#2E7D32' : '#006B3F'}"></div>
            <div class="analysis-progress-marker" style="left:100%"></div>
          </div>
          <div class="analysis-progress-detail">${analysis.tPct >= 30 ? 'Target achieved' : `Gap: ${fmtHaFull(tGap * baselines.terrestrial_ha / 100)} ha needed`}</div>
        </div>
        <div class="analysis-progress-group">
          <div class="analysis-progress-label">Marine: <strong>${fmtPct(analysis.mPct)}</strong> of 30% target</div>
          <div class="analysis-progress-track">
            <div class="analysis-progress-fill" style="width:${mBarW}%;background:${analysis.mPct >= 30 ? '#2E7D32' : '#0072BC'}"></div>
            <div class="analysis-progress-marker" style="left:100%"></div>
          </div>
          <div class="analysis-progress-detail">${analysis.mPct >= 30 ? 'Target achieved' : `Gap: ${fmtHaFull(mGap * baselines.marine_ha / 100)} ha needed`}</div>
        </div>
      </div>
    `;
  }

  // ── Type/species breakdown (for targets with diverse types) ──
  let typeTableHtml = '';
  if (analysis.typeBreakdown.length > 1) {
    const typeRows = analysis.typeBreakdown.slice(0, 10).map(t => {
      const pctOfTotal = analysis.totalGrossArea > 0 ? (t.area_ha / analysis.totalGrossArea * 100).toFixed(1) : '0.0';
      return `<tr><td>${t.type}</td><td class="r">${fmtHaFull(t.area_ha)}</td><td class="r">${pctOfTotal}%</td><td class="r">${t.features}</td></tr>`;
    }).join('');
    typeTableHtml = `
      <div class="analysis-card">
        <div class="analysis-card-title">${targetCode === 'T10' ? 'Land Cover Types' : targetCode === 'T4' ? 'Species Distribution' : 'Type Breakdown'}</div>
        <table class="analysis-table">
          <thead><tr><th>${targetCode === 'T4' ? 'Species' : 'Type'}</th><th class="r">Area (ha)</th><th class="r">% Total</th><th class="r">Features</th></tr></thead>
          <tbody>${typeRows}</tbody>
        </table>
        ${analysis.typeBreakdown.length > 10 ? `<div style="font-size:7px;color:#999;margin-top:2px">Showing top 10 of ${analysis.typeBreakdown.length} types</div>` : ''}
      </div>
    `;
  }

  page.innerHTML = `
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          ${FLAG_SVG}
          <div>
            <div class="print-title-main">Vanuatu NBSAP GIS Portal</div>
            <div class="print-title-sub">National Biodiversity Strategies and Action Plan</div>
          </div>
        </div>
      </div>
      <div class="print-title-right">
        <div class="print-title-date">${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        <div class="print-title-crs">Comprehensive Analysis Report</div>
      </div>
    </div>

    <div class="print-target-bar">
      <div class="print-target-code">${targetCode}</div>
      <div class="print-target-info">
        <div class="print-target-name">${target.name} &mdash; Analysis Results</div>
        <div class="print-target-desc">${target.description}</div>
      </div>
      <div class="analysis-status-badge" style="background:${analysis.statusColor}">
        ${statusIcons[analysis.statusIcon] || ''} ${analysis.status}
      </div>
    </div>

    <div class="analysis-layout">
      <div class="analysis-col-left">
        <div class="analysis-card">
          <div class="analysis-card-title">Coverage Assessment (UNEP-WCMC Dissolved)</div>
          <table class="analysis-table">
            <thead><tr><th>Metric</th><th class="r">Area</th><th class="r">% National</th></tr></thead>
            <tbody>
              ${coverageRows.map(r => `<tr><td>${r.label}</td><td class="r">${r.value}</td><td class="r">${r.pct}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>

        ${progressHtml}

        <div class="analysis-card">
          <div class="analysis-card-title">Provincial Distribution</div>
          <div class="analysis-prov-chart">
            ${provBarsHtml}
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">Category Composition</div>
          ${analysis.catBreakdown.length > 0 ? `
            <table class="analysis-table">
              <thead><tr><th>Category</th><th class="r">Net Area (ha)</th><th class="r">% Total</th><th class="r">Features</th></tr></thead>
              <tbody>${catCompRows}</tbody>
            </table>
          ` : '<div style="color:#999;font-size:8px">No category data available</div>'}
        </div>

        ${typeTableHtml}
      </div>

      <div class="analysis-col-right">
        <div class="analysis-card analysis-card-highlight">
          <div class="analysis-card-title">Overall Assessment</div>
          <div class="analysis-assessment">
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Status</span>
              <span class="analysis-assess-value" style="color:${analysis.statusColor};font-weight:700">${analysis.status}</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Data Completeness</span>
              <div style="display:flex;align-items:center;gap:6px;flex:1">
                <div class="analysis-comp-track"><div class="analysis-comp-fill" style="width:${analysis.dataCompleteness}%;background:${compColor}"></div></div>
                <span class="analysis-assess-value" style="color:${compColor}">${analysis.dataCompleteness}%</span>
              </div>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Geometry Quality</span>
              <span class="analysis-assess-value">${analysis.geomQuality}%</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Data Layers</span>
              <span class="analysis-assess-value">${analysis.dataLayers}${analysis.refLayers > 0 ? ` + ${analysis.refLayers} ref` : ''}</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Features</span>
              <span class="analysis-assess-value">${analysis.totalFeatures.toLocaleString()} (${analysis.totalPolygons} poly, ${analysis.totalPoints} pt)</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Dissolution Factor</span>
              <span class="analysis-assess-value">${analysis.dissolutionFactor.toFixed(3)}</span>
            </div>
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">Key Findings</div>
          <div class="analysis-findings">
            ${analysis.findings.length > 0
              ? analysis.findings.map(f => `<div class="analysis-finding-item"><span class="analysis-bullet">&#9654;</span><span>${f}</span></div>`).join('')
              : '<div style="color:#999;font-size:8px">No data available for analysis</div>'
            }
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">Target-Specific Insights</div>
          <div class="analysis-findings">
            ${analysis.insights.length > 0
              ? analysis.insights.map(f => `<div class="analysis-finding-item"><span class="analysis-bullet" style="color:#006B3F">&#9679;</span><span>${f}</span></div>`).join('')
              : '<div style="color:#999;font-size:8px">Upload data to generate target-specific insights</div>'
            }
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">Data Gaps</div>
          ${missingHtml}
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">Recommendations</div>
          <div class="analysis-findings">
            ${analysis.recommendations.length > 0
              ? analysis.recommendations.map(r => `<div class="analysis-finding-item"><span class="analysis-bullet" style="color:#ED6C02">&#9670;</span><span>${r}</span></div>`).join('')
              : '<div style="color:#2E7D32;font-size:8px">No immediate actions required — data is comprehensive</div>'
            }
          </div>
        </div>
      </div>
    </div>

    <div class="analysis-methodology">
      <strong>Methodology:</strong> Area calculations use geodesic measurements (turf.js/WGS84). Overlapping features dissolved per UNEP-WCMC methodology to prevent double-counting.
      Net area = dissolved coverage; Gross area = sum of individual features. Dissolution factor = net/gross ratio (1.0 = no overlap).
      National baselines: Terrestrial ${fmtHaFull(baselines.terrestrial_ha)} ha; Marine ${fmtHaFull(baselines.marine_ha)} ha.
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> Vanua Spatial Solutions &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Generated: ${new Date().toLocaleString('en-GB')} &bull; Analysis Engine v1.0
      </div>
    </div>
  `;

  container.appendChild(page);
}

// ═══════════════════════════════════════════════════════════════════════

/**
 * Initializes a Leaflet map inside the print page for a specific target.
 * Renders dissolved (unioned) boundaries per symbology group (category, or
 * sub-type for LAND_COVER) for clean cartographic output.
 */
function initPrintLeafletMap(containerId, targetCode, layers, provincesGeojson, provinceFilter) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const printMap = L.map(containerId, {
    center: ENV.mapCenter,
    zoom: ENV.mapZoom,
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false
  });

  // Use CartoDB Light basemap for clean print output
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(printMap);

  // Scale bar
  L.control.scale({ imperial: false, position: 'bottomleft', maxWidth: 150 }).addTo(printMap);

  // Province boundaries
  let provinceBoundsLayer = null;
  if (provincesGeojson) {
    const provLayer = L.geoJSON(provincesGeojson, {
      style: (feature) => {
        const name = feature.properties.name || feature.properties.province || '';
        const isTarget = provinceFilter && name === provinceFilter;
        return {
          color: isTarget ? '#333' : '#777',
          weight: isTarget ? 2.5 : 1.2,
          fillOpacity: isTarget ? 0.04 : 0.02,
          dashArray: isTarget ? null : '4 4'
        };
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name || feature.properties.province || '';
        if (name) {
          layer.bindTooltip(name, {
            permanent: true,
            direction: 'center',
            className: 'print-province-label'
          });
        }
        if (provinceFilter && name === provinceFilter) {
          provinceBoundsLayer = layer;
        }
      }
    }).addTo(printMap);
  }

  // Collect features per symbology group for dissolution
  const groupPolygons = {};   // groupKey → Feature[]
  const groupMeta = {};       // groupKey → { cat, typeValue }
  const refFeatures = [];
  const featureGroup = L.featureGroup();

  for (const layerData of layers) {
    const meta = layerData.metadata;
    const cat = meta?.category || 'OTHER';
    const features = (layerData.geojson?.features || []).filter(f => {
      if (provinceFilter && f.properties.province !== provinceFilter) return false;
      return true;
    });
    const isRef = meta?.isReference === true;

    for (const f of features) {
      const geomType = f.geometry?.type;
      if (isRef) {
        refFeatures.push({ feature: f, cat });
      } else if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
        const gk = featureGroupKey(cat, f);
        if (!groupPolygons[gk]) groupPolygons[gk] = [];
        groupPolygons[gk].push(f);
        if (!groupMeta[gk]) {
          groupMeta[gk] = { cat, typeValue: cat === 'LAND_COVER' ? (f.properties?.type || null) : null };
        }
      }
    }
  }

  // Render dissolved boundaries per symbology group
  for (const [gk, features] of Object.entries(groupPolygons)) {
    const { cat, typeValue } = groupMeta[gk];
    const style = printDissolvedStyle(cat, typeValue);
    const dissolved = dissolveFeatures(features);

    if (dissolved) {
      const geoLayer = L.geoJSON(dissolved, {
        style: () => style
      });
      featureGroup.addLayer(geoLayer);
    }
  }

  // Render reference layers with distinct dashed styling
  if (refFeatures.length > 0) {
    const refByCat = {};
    for (const { feature, cat } of refFeatures) {
      if (!refByCat[cat]) refByCat[cat] = [];
      refByCat[cat].push(feature);
    }
    for (const [cat, features] of Object.entries(refByCat)) {
      for (const feature of features) {
        const geomType = feature.geometry?.type;
        if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
          const geoLayer = L.geoJSON(feature, {
            style: () => referencePolygonStyle(cat)
          });
          featureGroup.addLayer(geoLayer);
        } else if (geomType === 'Point' || geomType === 'MultiPoint') {
          const style = referencePointStyle(cat);
          const geoLayer = L.geoJSON(feature, {
            pointToLayer: (f, latlng) => L.circleMarker(latlng, style)
          });
          featureGroup.addLayer(geoLayer);
        }
      }
    }
  }

  // Render non-reference point features
  for (const layerData of layers) {
    const meta = layerData.metadata;
    if (meta?.isReference) continue;
    const cat = meta?.category || 'OTHER';
    const features = (layerData.geojson?.features || []).filter(f => {
      if (provinceFilter && f.properties.province !== provinceFilter) return false;
      return true;
    });
    const points = features.filter(f =>
      f.geometry?.type === 'Point' || f.geometry?.type === 'MultiPoint'
    );

    if (points.length > 0) {
      const style = printPointStyle(cat);
      const geoLayer = L.geoJSON({ type: 'FeatureCollection', features: points }, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, style);
        }
      });
      featureGroup.addLayer(geoLayer);
    }
  }

  featureGroup.addTo(printMap);

  // Fit map bounds: zoom to province boundary if filtering by province, else fit data
  if (provinceFilter && provinceBoundsLayer) {
    const provBounds = provinceBoundsLayer.getBounds();
    if (provBounds.isValid()) {
      printMap.fitBounds(provBounds, { padding: [30, 30], maxZoom: 12 });
    }
  } else if (featureGroup.getLayers().length > 0) {
    const bounds = featureGroup.getBounds();
    if (bounds.isValid()) {
      printMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }

  // Invalidate size after a short delay to ensure proper rendering
  setTimeout(() => printMap.invalidateSize(), 200);
}
