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
