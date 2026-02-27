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
  collectLegendEntries,
  isExtinctPresence,
  printExtinctPolygonStyle,
  printExtinctPointStyle
} from '../../config/symbology.js';
import { getAppState, getDashboardLayers, ensureGeoJSONForTargets } from '../state.js';
import { getLayerOrder } from './mapView.js';
import { compute30x30Metrics, computeTarget1Metrics, computeTarget2Metrics, computeTargetMetrics, clearMetricsCache, dissolveFeatures } from '../../gis/areaCalc.js';

const OVERLAY_ID = 'print-map-overlay';

/**
 * Computes target metrics using the correct target-specific function.
 * Routes to specialised functions for T1/T2/T3 to match the dashboard KPI
 * computations, and normalises the output to the format expected by the
 * print page templates.
 *
 * @param {Array} allLayers - All dashboard layers (not pre-filtered)
 * @param {string} targetCode
 * @param {object} filters
 * @returns {object} Normalised metrics
 */
function computePrintMetrics(allLayers, targetCode, filters) {
  if (targetCode === 'T3') {
    return compute30x30Metrics(allLayers, filters);
  }

  if (targetCode === 'T1') {
    const t1 = computeTarget1Metrics(allLayers, filters);
    return {
      ...t1,
      totalAreaHa: t1.terrestrial_ha + t1.marine_ha,
      grossAreaHa: t1.gross_terrestrial_ha + t1.gross_marine_ha,
      realmTotals: {
        terrestrial_ha: t1.terrestrial_ha,
        marine_ha: t1.marine_ha,
        gross_terrestrial_ha: t1.gross_terrestrial_ha,
        gross_marine_ha: t1.gross_marine_ha
      },
      typeBreakdown: []
    };
  }

  if (targetCode === 'T2') {
    const t2 = computeTarget2Metrics(allLayers, filters);
    const netT = (t2.realmTotals?.degraded_terrestrial_ha || 0) + (t2.realmTotals?.restoration_terrestrial_ha || 0);
    const netM = (t2.realmTotals?.degraded_marine_ha || 0) + (t2.realmTotals?.restoration_marine_ha || 0);
    return {
      ...t2,
      totalAreaHa: t2.degraded_ha + t2.restoration_ha,
      grossAreaHa: t2.gross_degraded_ha + t2.gross_restoration_ha,
      realmTotals: {
        terrestrial_ha: netT,
        marine_ha: netM,
        gross_terrestrial_ha: netT,
        gross_marine_ha: netM
      },
      typeBreakdown: []
    };
  }

  return computeTargetMetrics(allLayers, targetCode, filters);
}

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
export async function openPrintMap(targetCode) {
  closePrintOverlay();
  const target = getTargetConfig(targetCode);
  if (!target) return;

  // Ensure GeoJSON is loaded for this target before rendering
  await ensureGeoJSONForTargets([targetCode]);
  clearMetricsCache();

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
 * Renders provinces sequentially — each province's Leaflet map must finish
 * initializing before the next province starts, preventing browser crashes
 * on large datasets like T10.
 */
export async function openPrintProvinceMaps(targetCode) {
  closePrintOverlay();
  const target = getTargetConfig(targetCode);
  if (!target) return;

  // Ensure GeoJSON is loaded for this target before rendering
  await ensureGeoJSONForTargets([targetCode]);
  clearMetricsCache();

  const state = getAppState();
  const provinces = state.provinces || [];
  if (provinces.length === 0) return;

  const overlay = buildOverlay([targetCode], `${targetCode} — By Province (${provinces.length})`);
  document.body.appendChild(overlay);
  document.body.classList.add('print-mode');

  const pageContainer = overlay.querySelector('#print-pages');

  // Pre-compute shared data once (avoids redundant per-province recomputation)
  const layers = getTargetLayers(targetCode);
  const sharedCtx = buildProvinceSharedContext(targetCode, layers, provinces);

  // Sequential province rendering: build DOM + init map for province N,
  // then wait before starting province N+1.  This ensures only ONE Leaflet
  // map is being created at a time, preventing canvas memory overload.
  let idx = 0;
  function renderNext() {
    if (idx >= provinces.length) return;
    const mapId = renderProvincePage(pageContainer, targetCode, target, provinces[idx], sharedCtx);
    idx++;
    // Initialize Leaflet map, then schedule next province after it settles
    requestAnimationFrame(() => {
      initPrintLeafletMap(mapId, targetCode, layers, state.provincesGeojson, provinces[idx - 1], true);
      // Give the canvas time to paint before starting the next province
      setTimeout(() => requestAnimationFrame(renderNext), 600);
    });
  }
  renderNext();

  overlay.querySelector('#print-close-btn').addEventListener('click', closePrintOverlay);
  overlay.querySelector('#print-print-btn').addEventListener('click', () => window.print());
}

/** Species definitions for T4 print maps */
const T4_SPECIES = [
  { key: 'MEGAPODE', name: 'Vanuatu Megapode', scientific: 'Megapodius layardi', taxa: 'Bird' },
  { key: 'STARLING', name: 'Vanuatu Mountain Starling', scientific: 'Aplonis santovestris', taxa: 'Bird' },
  { key: 'FANTAIL', name: 'Vanuatu Streaked Fantail', scientific: 'Rhipidura spilodera', taxa: 'Bird' },
  { key: 'KINGFISHER', name: 'Vanuatu Kingfisher', scientific: 'Todiramphus farquhari', taxa: 'Bird' },
  { key: 'FLYING_FOX', name: 'Vanuatu Flying Fox', scientific: 'Pteropus anetianus', taxa: 'Mammal' },
  { key: 'PLERANDRA', name: 'Plerandra vanuatuensis', scientific: 'Plerandra vanuatuensis', taxa: 'Plant' }
];

/**
 * Opens the print view for T4 with one map page per species.
 * Each page shows the species distribution across all provinces,
 * with resident vs extinct/possibly extinct areas differentiated.
 */
export async function openPrintSpeciesMaps(targetCode) {
  closePrintOverlay();
  const target = getTargetConfig(targetCode || 'T4');
  if (!target) return;

  // Ensure GeoJSON is loaded for this target before rendering
  await ensureGeoJSONForTargets([targetCode || 'T4']);
  clearMetricsCache();

  const state = getAppState();
  const layers = getTargetLayers(targetCode || 'T4');

  // Collect species that have data
  const speciesWithData = [];
  for (const sp of T4_SPECIES) {
    const features = [];
    for (const l of layers) {
      if (l.metadata?.isReference) continue;
      if (l.metadata?.category !== sp.key) continue;
      for (const f of (l.geojson?.features || [])) {
        features.push(f);
      }
    }
    if (features.length > 0) {
      speciesWithData.push({ ...sp, features });
    }
  }

  // Also add KBA and SPECIES_DIST if they have data
  const otherCats = ['KBA', 'SPECIES_DIST'];
  for (const cat of otherCats) {
    const features = [];
    for (const l of layers) {
      if (l.metadata?.isReference) continue;
      if (l.metadata?.category !== cat) continue;
      for (const f of (l.geojson?.features || [])) features.push(f);
    }
    if (features.length > 0) {
      const label = CATEGORIES[cat]?.label || cat;
      speciesWithData.push({ key: cat, name: label, scientific: '', taxa: '', features });
    }
  }

  if (speciesWithData.length === 0) return;

  const overlay = buildOverlay([targetCode || 'T4'], `T4 — By Species (${speciesWithData.length})`);
  document.body.appendChild(overlay);
  document.body.classList.add('print-mode');

  const pageContainer = overlay.querySelector('#print-pages');

  // Sequential rendering — one species map at a time
  let idx = 0;
  function renderNext() {
    if (idx >= speciesWithData.length) return;
    const sp = speciesWithData[idx];
    const mapId = renderSpeciesPage(pageContainer, targetCode || 'T4', target, sp, layers, state);
    idx++;
    requestAnimationFrame(() => {
      initPrintSpeciesMap(mapId, sp, state.provincesGeojson);
      setTimeout(() => requestAnimationFrame(renderNext), 600);
    });
  }
  renderNext();

  overlay.querySelector('#print-close-btn').addEventListener('click', closePrintOverlay);
  overlay.querySelector('#print-print-btn').addEventListener('click', () => window.print());
}

/**
 * Renders one print page for a single species.
 * Shows distribution across provinces with resident/extinct differentiation.
 */
function renderSpeciesPage(container, targetCode, target, species, layers, state) {
  const baselines = ENV.nationalBaselines;
  const features = species.features;

  // Split by presence
  const residentFeatures = features.filter(f => !isExtinctPresence(f));
  const extinctFeatures = features.filter(f => isExtinctPresence(f));
  const hasPresenceData = extinctFeatures.length > 0;

  // Compute areas
  let totalAreaHa = 0;
  let residentAreaHa = 0;
  let extinctAreaHa = 0;
  for (const f of residentFeatures) residentAreaHa += f.properties?.area_ha || 0;
  for (const f of extinctFeatures) extinctAreaHa += f.properties?.area_ha || 0;
  totalAreaHa = residentAreaHa + extinctAreaHa;

  // Province breakdown
  const provData = {};
  for (const f of features) {
    const prov = f.properties?.province || 'Unassigned';
    if (!provData[prov]) provData[prov] = { resident: 0, extinct: 0, features: 0, area_ha: 0 };
    provData[prov].features++;
    const areaHa = f.properties?.area_ha || 0;
    provData[prov].area_ha += areaHa;
    if (isExtinctPresence(f)) provData[prov].extinct++;
    else provData[prov].resident++;
  }

  const page = document.createElement('div');
  page.className = 'print-page';
  const mapId = `print-map-species-${species.key}`;

  const speciesColors = resolveColors(species.key);

  // Metrics row
  const metricsHtml = `
    <div class="print-metrics-row">
      <div class="print-metric"><span class="print-metric-value">${fmtHa(totalAreaHa)}</span><span class="print-metric-label">Total Area (ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${features.length}</span><span class="print-metric-label">Records</span></div>
      ${hasPresenceData ? `
        <div class="print-metric"><span class="print-metric-value">${residentFeatures.length}</span><span class="print-metric-label">Resident Records</span></div>
        <div class="print-metric"><span class="print-metric-value">${extinctFeatures.length}</span><span class="print-metric-label">Extinct Records</span></div>
      ` : `
        <div class="print-metric"><span class="print-metric-value">${Object.keys(provData).length}</span><span class="print-metric-label">Provinces</span></div>
        <div class="print-metric"><span class="print-metric-value">${fmtHa(residentAreaHa)}</span><span class="print-metric-label">Distribution (ha)</span></div>
      `}
      <div class="print-metric"><span class="print-metric-value">${fmtPct(baselines.terrestrial_ha > 0 ? totalAreaHa / baselines.terrestrial_ha * 100 : 0)}</span><span class="print-metric-label">% National Land</span></div>
      <div class="print-metric"><span class="print-metric-value"><span class="cat-dot" style="background:${speciesColors.fill};border-color:${speciesColors.stroke}"></span></span><span class="print-metric-label">${CATEGORIES[species.key]?.label || species.name}</span></div>
    </div>
  `;

  // Legend
  let legendHtml = `<div class="print-legend-item">
    <span class="print-legend-swatch" style="background:${speciesColors.fill};border-color:${speciesColors.stroke}"></span>
    <span>${species.name}${hasPresenceData ? ' (Resident)' : ''}</span>
  </div>`;
  if (hasPresenceData) {
    legendHtml += `<div class="print-legend-item">
      <span class="print-legend-swatch" style="background:#B0BEC5;border-color:#78909C;border-style:dashed"></span>
      <span>${species.name} (Extinct)</span>
    </div>`;
  }
  legendHtml += '<div class="print-legend-item"><span class="print-legend-swatch print-legend-swatch-province"></span><span>Province Boundary</span></div>';

  // Province table
  const provEntries = Object.entries(provData).sort((a, b) => b[1].area_ha - a[1].area_ha);
  let provTableHtml = '';
  if (provEntries.length > 0) {
    const provRows = provEntries.map(([prov, d]) => {
      const presenceCols = hasPresenceData
        ? `<td class="r">${d.resident}</td><td class="r">${d.extinct}</td>`
        : '';
      return `<tr><td>${prov}</td><td class="r">${fmtHaFull(d.area_ha)}</td><td class="r">${d.features}</td>${presenceCols}</tr>`;
    }).join('');
    const totalFeats = provEntries.reduce((s, [, d]) => s + d.features, 0);
    const totalArea = provEntries.reduce((s, [, d]) => s + d.area_ha, 0);
    const presenceHeaders = hasPresenceData ? '<th class="r">Resident</th><th class="r">Extinct</th>' : '';
    const presenceTotals = hasPresenceData
      ? `<td class="r"><b>${residentFeatures.length}</b></td><td class="r"><b>${extinctFeatures.length}</b></td>`
      : '';
    provTableHtml = `
      <div class="print-detail-table">
        <div class="print-section-title">Province Distribution</div>
        <table>
          <thead><tr><th>Province</th><th class="r">Area (ha)</th><th class="r">Records</th>${presenceHeaders}</tr></thead>
          <tbody>${provRows}</tbody>
          <tfoot><tr class="total-row"><td><b>TOTAL</b></td><td class="r"><b>${fmtHaFull(totalArea)}</b></td><td class="r"><b>${totalFeats}</b></td>${presenceTotals}</tr></tfoot>
        </table>
      </div>
    `;
  }

  const scientificLine = species.scientific ? `<i>${species.scientific}</i>` : '';
  const taxaLine = species.taxa ? ` (${species.taxa})` : '';

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
      <div class="print-target-code" style="background:${speciesColors.fill}">${species.key}</div>
      <div class="print-target-info">
        <div class="print-target-name">${species.name}${taxaLine}</div>
        <div class="print-target-desc">${scientificLine} &mdash; T4: Species &amp; Biodiversity Distribution</div>
      </div>
    </div>

    ${metricsHtml}

    <div class="print-map-area">
      <div class="print-map-container" id="${mapId}"></div>
      <div class="print-map-furniture">
        <div class="print-legend-box">
          <div class="print-legend-title">Legend</div>
          ${legendHtml}
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

    <div class="print-summary-line">${species.name}: ${fmtHaFull(totalAreaHa)} ha across ${Object.keys(provData).length} province${Object.keys(provData).length !== 1 ? 's' : ''} | ${features.length} records</div>

    <div class="print-bottom-section">
      ${provTableHtml}
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Printed: ${new Date().toLocaleString('en-GB')}
      </div>
    </div>
  `;

  container.appendChild(page);
  return mapId;
}

/**
 * Initializes a Leaflet map for a species print page.
 * Renders resident and extinct features with different symbology.
 */
function initPrintSpeciesMap(containerId, species, provincesGeojson) {
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
    touchZoom: false,
    preferCanvas: true
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(printMap);

  L.control.scale({ imperial: false, position: 'bottomleft', maxWidth: 150 }).addTo(printMap);

  // Province boundaries
  if (provincesGeojson) {
    L.geoJSON(provincesGeojson, {
      style: () => ({
        color: '#777',
        weight: 1.2,
        fillOpacity: 0.02,
        dashArray: '4 4'
      }),
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name || feature.properties.province || '';
        if (name) {
          layer.bindTooltip(name, {
            permanent: true,
            direction: 'center',
            className: 'print-province-label'
          });
        }
      }
    }).addTo(printMap);
  }

  const featureGroup = L.featureGroup();
  const features = species.features;

  // Split by presence
  const residentFeatures = features.filter(f => !isExtinctPresence(f));
  const extinctFeatures = features.filter(f => isExtinctPresence(f));

  const cat = species.key;
  const normalStyle = printDissolvedStyle(cat);
  const extinctPolyStyle = printExtinctPolygonStyle(cat);
  const normalPointStyle = printPointStyle(cat);
  const extinctPtStyle = printExtinctPointStyle(cat);

  // Render extinct features first (behind resident)
  const extinctPolys = extinctFeatures.filter(f => {
    const t = f.geometry?.type;
    return t === 'Polygon' || t === 'MultiPolygon';
  });
  const extinctPts = extinctFeatures.filter(f => {
    const t = f.geometry?.type;
    return t === 'Point' || t === 'MultiPoint';
  });
  if (extinctPolys.length > 0) {
    const dissolved = dissolveFeatures(extinctPolys);
    if (dissolved) {
      featureGroup.addLayer(L.geoJSON(dissolved, { style: () => extinctPolyStyle }));
    } else {
      featureGroup.addLayer(L.geoJSON({ type: 'FeatureCollection', features: extinctPolys }, { style: () => extinctPolyStyle }));
    }
  }
  if (extinctPts.length > 0) {
    featureGroup.addLayer(L.geoJSON({ type: 'FeatureCollection', features: extinctPts }, {
      pointToLayer: (f, latlng) => L.circleMarker(latlng, extinctPtStyle)
    }));
  }

  // Render resident features on top
  const residentPolys = residentFeatures.filter(f => {
    const t = f.geometry?.type;
    return t === 'Polygon' || t === 'MultiPolygon';
  });
  const residentPts = residentFeatures.filter(f => {
    const t = f.geometry?.type;
    return t === 'Point' || t === 'MultiPoint';
  });
  if (residentPolys.length > 0) {
    const dissolved = dissolveFeatures(residentPolys);
    if (dissolved) {
      featureGroup.addLayer(L.geoJSON(dissolved, { style: () => normalStyle }));
    } else {
      featureGroup.addLayer(L.geoJSON({ type: 'FeatureCollection', features: residentPolys }, { style: () => normalStyle }));
    }
  }
  if (residentPts.length > 0) {
    featureGroup.addLayer(L.geoJSON({ type: 'FeatureCollection', features: residentPts }, {
      pointToLayer: (f, latlng) => L.circleMarker(latlng, normalPointStyle)
    }));
  }

  featureGroup.addTo(printMap);

  // Fit bounds after invalidating size so the container is correctly measured first
  setTimeout(() => {
    printMap.invalidateSize();
    if (featureGroup.getLayers().length > 0) {
      const bounds = featureGroup.getBounds();
      if (bounds.isValid()) {
        printMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      }
    }
  }, 200);
}

/**
 * Pre-computes data shared across all province pages for a target.
 * Builds province→features index, caches legend HTML, caches national metrics,
 * and pre-computes per-province metrics (avoids 6× computeTargetMetrics calls).
 */
function buildProvinceSharedContext(targetCode, layers, provinces) {
  // Build province → features index (one pass over all features)
  const provinceFeatures = {};  // provinceName → Feature[]
  const provinceFeaturesPerLayer = {}; // provinceName → Map<layerId, Feature[]>
  for (const prov of provinces) {
    provinceFeatures[prov] = [];
    provinceFeaturesPerLayer[prov] = new Map();
  }
  const provSet = new Set(provinces);

  for (const l of layers) {
    if (l.metadata?.isReference) continue;
    const lid = l.id || l.metadata?.name || 'unknown';
    for (const f of (l.geojson?.features || [])) {
      const prov = f.properties?.province;
      if (prov && provSet.has(prov)) {
        provinceFeatures[prov].push(f);
        let arr = provinceFeaturesPerLayer[prov].get(lid);
        if (!arr) { arr = []; provinceFeaturesPerLayer[prov].set(lid, arr); }
        arr.push(f);
      }
    }
  }

  // Cache legend HTML (same for all provinces)
  const legendHtml = buildLegendHtml(layers, true);

  // Cache national metrics (called once instead of 6 times)
  const allDashLayers = getDashboardLayers();
  const allFilter = { targets: [targetCode], province: 'All', category: 'All', realm: 'All', year: 'All' };
  const nationalMetrics = computePrintMetrics(allDashLayers, targetCode, allFilter);

  // Pre-compute per-province metrics so renderProvincePage doesn't call
  // computeTargetMetrics 6 times (each of which iterates all features)
  const provinceMetrics = {};
  for (const prov of provinces) {
    const provFilter = { targets: [targetCode], province: prov, category: 'All', realm: 'All', year: 'All' };
    provinceMetrics[prov] = computePrintMetrics(allDashLayers, targetCode, provFilter);
  }

  const expected = getExpectedForTarget(targetCode);

  return { provinceFeatures, provinceFeaturesPerLayer, legendHtml, nationalMetrics, provinceMetrics, expected, layers };
}

/**
 * Opens the print view for all targets (one map page per target).
 */
export async function openPrintAllMaps() {
  closePrintOverlay();

  const targetCodes = targetsConfig.targets.map(t => t.code);

  // Ensure GeoJSON is loaded for ALL targets before rendering
  await ensureGeoJSONForTargets(targetCodes);
  clearMetricsCache();

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
  const allLayers = getDashboardLayers();
  const layers = getTargetLayers(targetCode);
  const expected = getExpectedForTarget(targetCode);
  const baselines = ENV.nationalBaselines;

  // Compute metrics using target-specific functions (matches dashboard KPIs)
  const metrics = computePrintMetrics(allLayers, targetCode, { targets: [targetCode], province: 'All', category: 'All', realm: 'All', year: 'All' });

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
      <div class="print-metric"><span class="print-metric-value">${totalFeatures.toLocaleString()}</span><span class="print-metric-label">Records</span></div>
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
        <div class="print-section-title">Provincial Breakdown</div>
        <table>
          <thead><tr><th>Province</th><th class="r">Terrestrial (ha)</th><th class="r">Marine (ha)</th><th class="r">Total (ha)</th><th class="r">Records</th></tr></thead>
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
      return `<tr><td><span class="cat-dot" style="background:${colors.fill};border-color:${colors.stroke}"></span>${catDef.label}</td><td class="r">${fmtHaFull(c.area_ha)}</td><td class="r">${c.features}</td></tr>`;
    }).join('');
    catTableHtml = `
      <div class="print-detail-table">
        <div class="print-section-title">Category Breakdown</div>
        <table>
          <thead><tr><th>Category</th><th class="r">Area (ha)</th><th class="r">Records</th></tr></thead>
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
    return `<tr><td>${name} ${ref}</td><td>${catLabel}</td><td>${realm}</td><td class="r">${feats}</td><td>${uploaded}</td></tr>`;
  }).join('');
  const srcTableHtml = layers.length > 0 ? `
    <div class="print-detail-table print-src-table">
      <div class="print-section-title">Data Sources</div>
      <table>
        <thead><tr><th>Layer Name</th><th>Category</th><th>Realm</th><th class="r">Records</th><th>Uploaded</th></tr></thead>
        <tbody>${srcRows}</tbody>
      </table>
    </div>
  ` : '<div class="print-detail-table"><div class="print-section-title">Data Sources</div><div style="color:#999;font-size:9px">No data uploaded for this target</div></div>';

  // ── Summary stats line ──
  const summaryLine = `Total area: ${fmtHaFull(totalNetArea)} ha | ${totalFeatures} records across ${layers.filter(l => !l.metadata?.isReference).length} dataset${layers.filter(l => !l.metadata?.isReference).length !== 1 ? 's' : ''}`;

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
      </div>
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Printed: ${new Date().toLocaleString('en-GB')}
      </div>
    </div>
  `;

  container.appendChild(page);

  // ── Render technical analysis page ──
  const analysis = generateTargetAnalysis(targetCode, layers, metrics, expected, baselines);
  renderAnalysisPage(container, targetCode, target, analysis);

  requestAnimationFrame(() => {
    setTimeout(() => initPrintLeafletMap(mapId, targetCode, layers, state.provincesGeojson), 100);
  });
}

/**
 * Renders one print page for a target filtered to a single province.
 * Shows detailed province-specific technical results.
 * Accepts optional sharedCtx from openPrintProvinceMaps to avoid redundant computation.
 * Returns the map container ID so the caller can init the Leaflet map separately.
 */
function renderProvincePage(container, targetCode, target, provinceName, sharedCtx) {
  const state = getAppState();
  const layers = sharedCtx?.layers || getTargetLayers(targetCode);
  const baselines = ENV.nationalBaselines;
  const provinceFilter = { targets: [targetCode], province: provinceName, category: 'All', realm: 'All', year: 'All' };

  // Use pre-computed province metrics if available, else compute on the fly
  const isT3 = targetCode === 'T3';
  const metrics = sharedCtx?.provinceMetrics?.[provinceName] || (
    computePrintMetrics(getDashboardLayers(), targetCode, provinceFilter)
  );

  // Use pre-indexed province features if available, else filter on the fly
  const totalFeatures = sharedCtx?.provinceFeatures?.[provinceName]?.length ??
    layers.reduce((sum, l) => {
      if (l.metadata?.isReference) return sum;
      return sum + (l.geojson?.features || []).filter(f => f.properties.province === provinceName).length;
    }, 0);

  const netTerrestrial = isT3 ? (metrics.terrestrial_ha || 0) : (metrics.realmTotals?.terrestrial_ha || 0);
  const netMarine = isT3 ? (metrics.marine_ha || 0) : (metrics.realmTotals?.marine_ha || 0);
  const totalNetArea = isT3 ? (netTerrestrial + netMarine) : (metrics.totalAreaHa || 0);
  const totalGrossArea = isT3 ? ((metrics.gross_terrestrial_ha || 0) + (metrics.gross_marine_ha || 0)) : (metrics.grossAreaHa || 0);
  const tPct = baselines.terrestrial_ha > 0 ? (netTerrestrial / baselines.terrestrial_ha) * 100 : 0;
  const mPct = baselines.marine_ha > 0 ? (netMarine / baselines.marine_ha) * 100 : 0;

  const page = document.createElement('div');
  page.className = 'print-page';
  const mapId = `print-map-${targetCode}-${provinceName.replace(/\s+/g, '-')}`;

  // Legend — use cached version if available
  const legendItems = sharedCtx?.legendHtml || buildLegendHtml(layers, true);

  // Metrics row — detailed
  const metricsHtml = `
    <div class="print-metrics-row">
      <div class="print-metric"><span class="print-metric-value">${fmtHa(netTerrestrial)}</span><span class="print-metric-label">Terrestrial (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${fmtHa(netMarine)}</span><span class="print-metric-label">Marine (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${fmtPct(tPct)}</span><span class="print-metric-label">% National Land</span></div>
      <div class="print-metric"><span class="print-metric-value">${fmtPct(mPct)}</span><span class="print-metric-label">% National Sea</span></div>
      <div class="print-metric"><span class="print-metric-value">${totalFeatures.toLocaleString()}</span><span class="print-metric-label">Records</span></div>
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
          <thead><tr><th>Category</th><th class="r">Area (ha)</th><th class="r">Records</th></tr></thead>
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
    const lid = l.id || meta.name || 'unknown';
    // Use pre-indexed per-layer features if available
    const provFeats = sharedCtx?.provinceFeaturesPerLayer?.[provinceName]?.get(lid)
      || (l.geojson?.features || []).filter(f => f.properties.province === provinceName);
    const areaHa = provFeats.reduce((s, f) => s + (f.properties?.area_ha || 0), 0);
    if (provFeats.length === 0) return '';
    return `<tr><td>${name}</td><td>${catLabel}</td><td class="r">${provFeats.length}</td><td class="r">${fmtHaFull(areaHa)}</td></tr>`;
  }).filter(Boolean).join('');

  const srcTableHtml = srcRows ? `
    <div class="print-detail-table">
      <div class="print-section-title">Data Sources (${provinceName})</div>
      <table>
        <thead><tr><th>Layer</th><th>Category</th><th class="r">Records</th><th class="r">Area (ha)</th></tr></thead>
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
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Printed: ${new Date().toLocaleString('en-GB')}
      </div>
    </div>
  `;

  container.appendChild(page);

  // ── Render province-specific analysis page ──
  const expected = sharedCtx?.expected || getExpectedForTarget(targetCode);
  const provAnalysis = generateProvinceAnalysis(targetCode, layers, metrics, expected, baselines, provinceName, sharedCtx?.nationalMetrics);
  renderProvinceAnalysisPage(container, targetCode, target, provinceName, provAnalysis);

  // When called from openPrintProvinceMaps, map init is handled by the caller's
  // sequential chain.  When called standalone, init the map here.
  if (!sharedCtx) {
    requestAnimationFrame(() => {
      setTimeout(() => initPrintLeafletMap(mapId, targetCode, layers, state.provincesGeojson, provinceName), 100);
    });
  }

  return mapId;
}

// ═══════════════════════════════════════════════════════════════════════
//  COMPREHENSIVE ANALYSIS ENGINE
// ═══════════════════════════════════════════════════════════════════════

/** GBF target thresholds — target-specific goals where applicable */
const TARGET_THRESHOLDS = {
  T3: { terrestrial: 30, marine: 30, label: '30% by 2030 (GBF Target 3)' },
  T1: { terrestrial: 100, marine: 100, label: '100% spatial plan coverage (terrestrial & marine)' },
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
    findings.push(`Total coverage is <strong>${fmtHaFull(totalNetArea)} ha</strong>, representing <strong>${fmtPct(tPct)}</strong> of national terrestrial area and <strong>${fmtPct(mPct)}</strong> of marine area.`);
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
    findings.push(`${refLayers.length} reference dataset${refLayers.length !== 1 ? 's' : ''} shown for context (not included in area totals).`);
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
    recommendations.push(`No data has been uploaded for this target yet. Upload datasets to enable analysis.`);
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
        insights.push(`Vanuatu has achieved the GBF 30x30 target for both terrestrial and marine realms. Overlapping areas have been merged to prevent double-counting.`);
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

    case 'T6': {
      // Per-species analysis
      const iasSpecies = [
        { cat: 'MERREMIA', name: 'Merremia peltata (Big Leaf)', desc: 'This invasive vine is one of the most significant threats to Vanuatu\'s native forest ecosystems, smothering canopy trees and preventing regeneration.' },
        { cat: 'CROWN_OF_THORNS', name: 'Crown of Thorns Starfish (Acanthaster planci)', desc: 'Outbreaks cause devastating coral mortality across reef systems, threatening marine biodiversity and coastal livelihoods.' },
        { cat: 'MILE_A_MINUTE', name: 'Mile a Minute Vine (Mikania micrantha)', desc: 'A fast-growing tropical vine that forms dense mats over native vegetation, blocking sunlight and causing dieback of native species.' },
        { cat: 'SOLANUM_TORVUM', name: 'Solanum torvum (Devil Fig)', desc: 'A woody invasive shrub that colonises disturbed land, pastures and forest margins, displacing native undergrowth and reducing agricultural productivity.' }
      ];
      const speciesReported = [];
      for (const sp of iasSpecies) {
        const entry = data.catBreakdown.find(c => c.category === sp.cat);
        if (entry) {
          speciesReported.push(sp.name);
          insights.push(`<strong>${sp.name}</strong> covers <strong>${fmtHaFull(entry.area_ha)} ha</strong> across ${entry.features} feature(s). ${sp.desc}`);
        }
      }
      // Generic INVASIVE category
      const genericIAS = data.catBreakdown.find(c => c.category === 'INVASIVE');
      if (genericIAS) {
        insights.push(`Other invasive alien species collectively cover <strong>${fmtHaFull(genericIAS.area_ha)} ha</strong> (${genericIAS.features} features), including Fire Ants, African Snail, Sako, and Coconut Beetle.`);
      }
      if (data.totalNetArea > 0) {
        insights.push(`Total IAS-affected area: <strong>${fmtHaFull(data.totalNetArea)} ha</strong> (${fmtPct(data.tPct)} of national terrestrial area). ${speciesReported.length} of 4 priority species mapped. Spatial analysis of IAS distribution is critical for prioritising eradication and management interventions.`);
      }
      if (data.missingLayers.length > 0) {
        const missing = data.missingLayers.map(l => l.name).join(', ');
        insights.push(`Data gaps remain for: ${missing}. Complete coverage mapping for all priority IAS is needed for national management planning.`);
      }
      break;
    }

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
 * Generates province-scoped quantitative and qualitative analysis.
 * Filters all metrics and features to a single province for focused reporting.
 */
function generateProvinceAnalysis(targetCode, layers, metrics, expected, baselines, provinceName, cachedNationalMetrics) {
  const isT3 = targetCode === 'T3';

  // Province-filtered feature counts
  const dataLayers = layers.filter(l => !l.metadata?.isReference);
  const refLayers = layers.filter(l => l.metadata?.isReference);
  let totalFeatures = 0, totalPolygons = 0, totalPoints = 0;
  const categoriesPresent = new Set();
  const typeMap = {};

  for (const l of dataLayers) {
    const cat = l.metadata?.category || 'OTHER';
    const provFeats = (l.geojson?.features || []).filter(f => f.properties?.province === provinceName);
    if (provFeats.length > 0) categoriesPresent.add(cat);
    for (const f of provFeats) {
      totalFeatures++;
      const gt = f.geometry?.type;
      if (gt === 'Polygon' || gt === 'MultiPolygon') totalPolygons++;
      else if (gt === 'Point' || gt === 'MultiPoint') totalPoints++;
      const typeName = f.properties?.type || f.properties?.species_name || f.properties?.name || l.metadata?.name || 'Unknown';
      if (!typeMap[typeName]) typeMap[typeName] = { area_ha: 0, features: 0 };
      typeMap[typeName].area_ha += f.properties?.area_ha || 0;
      typeMap[typeName].features++;
    }
  }

  // Area metrics from pre-computed province-filtered metrics
  const netTerrestrial = isT3 ? (metrics.terrestrial_ha || 0) : (metrics.realmTotals?.terrestrial_ha || 0);
  const netMarine = isT3 ? (metrics.marine_ha || 0) : (metrics.realmTotals?.marine_ha || 0);
  const grossTerrestrial = isT3 ? (metrics.gross_terrestrial_ha || 0) : (metrics.realmTotals?.gross_terrestrial_ha || 0);
  const grossMarine = isT3 ? (metrics.gross_marine_ha || 0) : (metrics.realmTotals?.gross_marine_ha || 0);
  const totalNetArea = isT3 ? (netTerrestrial + netMarine) : (metrics.totalAreaHa || 0);
  const totalGrossArea = isT3 ? (grossTerrestrial + grossMarine) : (metrics.grossAreaHa || 0);
  const tPct = baselines.terrestrial_ha > 0 ? (netTerrestrial / baselines.terrestrial_ha) * 100 : 0;
  const mPct = baselines.marine_ha > 0 ? (netMarine / baselines.marine_ha) * 100 : 0;
  const overlapPct = totalGrossArea > 0 ? (1 - totalNetArea / totalGrossArea) * 100 : 0;

  // Category breakdown
  const catBreakdown = metrics?.categoryBreakdown || [];

  // Type breakdown
  const typeBreakdown = Object.entries(typeMap)
    .map(([name, data]) => ({ type: name, ...data }))
    .sort((a, b) => b.area_ha - a.area_ha);

  // Data completeness within province
  const missingLayers = expected.filter(e => !categoriesPresent.has(e.category));
  const dataCompleteness = expected.length > 0
    ? Math.round((1 - missingLayers.length / expected.length) * 100)
    : (totalFeatures > 0 ? 100 : 0);

  // National-level metrics for comparison — use cached version if available
  const nationalMetrics = cachedNationalMetrics || (() => {
    const allFilter = { targets: [targetCode], province: 'All', category: 'All', realm: 'All', year: 'All' };
    return computePrintMetrics(getDashboardLayers(), targetCode, allFilter);
  })();
  const nationalNetArea = isT3
    ? ((nationalMetrics.terrestrial_ha || 0) + (nationalMetrics.marine_ha || 0))
    : (nationalMetrics.totalAreaHa || 0);
  const provinceSharePct = nationalNetArea > 0 ? (totalNetArea / nationalNetArea * 100) : 0;

  // Status
  let status, statusColor;
  if (totalFeatures === 0) {
    status = 'No Data'; statusColor = '#D32F2F';
  } else if (dataCompleteness >= 80) {
    status = 'Comprehensive'; statusColor = '#2E7D32';
  } else if (dataCompleteness >= 40 || categoriesPresent.size >= 2) {
    status = 'Moderate'; statusColor = '#ED6C02';
  } else {
    status = 'Minimal'; statusColor = '#D32F2F';
  }

  // Key findings — province specific
  const findings = [];
  if (totalNetArea > 0) {
    findings.push(`${provinceName} province contributes <strong>${fmtHaFull(totalNetArea)} ha</strong> to ${targetCode}, representing <strong>${provinceSharePct.toFixed(1)}%</strong> of the national total for this target.`);
  }
  if (netTerrestrial > 0) {
    findings.push(`Terrestrial coverage: <strong>${fmtHaFull(netTerrestrial)} ha</strong> (${fmtPct(tPct)} of national terrestrial baseline).`);
  }
  if (netMarine > 0) {
    findings.push(`Marine coverage: <strong>${fmtHaFull(netMarine)} ha</strong> (${fmtPct(mPct)} of national marine baseline).`);
  }
  if (overlapPct > 5) {
    findings.push(`Spatial overlap of <strong>${overlapPct.toFixed(1)}%</strong> detected between overlapping designations within ${provinceName}.`);
  }
  if (catBreakdown.length > 1) {
    const top = catBreakdown[0];
    const topLabel = CATEGORIES[top.category]?.label || top.category;
    findings.push(`Dominant designation type: <strong>${topLabel}</strong> (${fmtHaFull(top.area_ha)} ha, ${totalNetArea > 0 ? (top.area_ha / totalNetArea * 100).toFixed(0) : 0}% of province total).`);
  }
  if (totalFeatures === 0) {
    findings.push(`No geospatial data has been uploaded for ${provinceName} province under ${targetCode}. This represents a significant data gap.`);
  }

  // Province-specific qualitative insights
  const insights = [];
  if (isT3) {
    if (totalNetArea > 0) {
      insights.push(`Conservation areas in ${provinceName} include ${catBreakdown.map(c => CATEGORIES[c.category]?.label || c.category).join(', ')}. ${provinceName}'s contribution to the 30x30 target should be assessed in the context of its total land and sea area.`);
    }
    insights.push(`Community-based conservation (CCAs, LMMAs) is the primary conservation mechanism in Vanuatu. Engaging local communities in ${provinceName} is essential for expanding and maintaining conservation areas.`);
  } else if (targetCode === 'T6') {
    if (totalFeatures > 0) {
      insights.push(`Invasive species data in ${provinceName} covers ${totalFeatures} features across ${categoriesPresent.size} IAS category(s). Prioritise management interventions in areas adjacent to native forest and reef ecosystems.`);
    } else {
      insights.push(`No invasive species data available for ${provinceName}. Field surveys should be prioritised to assess IAS presence and distribution in this province.`);
    }
  } else if (targetCode === 'T4') {
    if (totalFeatures > 0) {
      insights.push(`Species distribution records in ${provinceName}: ${totalFeatures} observations across ${typeBreakdown.length} taxa. Island-specific surveys are important for capturing Vanuatu's high endemism.`);
    }
  } else if (targetCode === 'T10') {
    if (typeBreakdown.length > 0) {
      const topTypes = typeBreakdown.slice(0, 3).map(t => `${t.type} (${fmtHaFull(t.area_ha)} ha)`).join(', ');
      insights.push(`Land cover in ${provinceName} is dominated by: ${topTypes}. Change detection analysis should focus on forest-to-agriculture conversion and urban expansion.`);
    }
  } else if (totalNetArea > 0) {
    insights.push(`${provinceName} has active data submissions for ${targetCode}. Continued monitoring and data updates will strengthen provincial-level tracking for this NBSAP target.`);
  }

  // Recommendations
  const recommendations = [];
  if (missingLayers.length > 0 && totalFeatures > 0) {
    recommendations.push(`Upload missing data for ${provinceName}: ${missingLayers.map(l => '<strong>' + l.name + '</strong>').join(', ')}.`);
  }
  if (totalFeatures === 0) {
    recommendations.push(`Prioritise data collection for ${provinceName} to enable provincial-level assessment and reporting for ${targetCode}.`);
  }
  if (provinceSharePct > 0 && provinceSharePct < 5 && nationalNetArea > 0) {
    recommendations.push(`${provinceName} currently contributes only ${provinceSharePct.toFixed(1)}% of the national total. Investigate whether this reflects actual low coverage or a data gap.`);
  }

  return {
    provinceName, totalFeatures, totalPolygons, totalPoints,
    netTerrestrial, netMarine, totalNetArea, totalGrossArea,
    tPct, mPct, overlapPct,
    catBreakdown, typeBreakdown,
    dataCompleteness, missingLayers, categoriesPresent: categoriesPresent.size,
    nationalNetArea, provinceSharePct,
    status, statusColor,
    findings, insights, recommendations,
    dataLayers: dataLayers.length, refLayers: refLayers.length
  };
}

/**
 * Renders a province-specific analysis page with quantitative and qualitative
 * information for decision makers, aligned with ToR requirements.
 */
function renderProvinceAnalysisPage(container, targetCode, target, provinceName, analysis) {
  const page = document.createElement('div');
  page.className = 'print-page print-analysis-page';
  const baselines = ENV.nationalBaselines;
  const tor = getTargetToRContent(targetCode);

  const statusIcons = {
    Comprehensive: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    Moderate: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    Minimal: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'No Data': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
  };

  // Coverage assessment table
  const coverageRows = [
    { label: 'Terrestrial (net)', value: fmtHaFull(analysis.netTerrestrial) + ' ha', pct: fmtPct(analysis.tPct) },
    { label: 'Marine (net)', value: fmtHaFull(analysis.netMarine) + ' ha', pct: fmtPct(analysis.mPct) },
    { label: 'Total Area', value: fmtHaFull(analysis.totalNetArea) + ' ha', pct: '' },
    { label: 'Total gross (sum)', value: fmtHaFull(analysis.totalGrossArea) + ' ha', pct: '' },
    { label: 'Share of national total', value: analysis.provinceSharePct.toFixed(1) + '%', pct: '' },
    { label: 'Overlap removed', value: analysis.overlapPct.toFixed(1) + '%', pct: '' }
  ];

  // Category composition
  const catCompRows = analysis.catBreakdown.map(c => {
    const colors = resolveColors(c.category);
    const catLabel = CATEGORIES[c.category]?.label || c.category;
    const pctOfTotal = analysis.totalNetArea > 0 ? (c.area_ha / analysis.totalNetArea * 100).toFixed(1) : '0.0';
    return `<tr><td><span class="cat-dot" style="background:${colors.fill};border-color:${colors.stroke}"></span>${catLabel}</td><td class="r">${fmtHaFull(c.area_ha)}</td><td class="r">${pctOfTotal}%</td><td class="r">${c.features}</td></tr>`;
  }).join('');

  // Type breakdown
  let typeTableHtml = '';
  if (analysis.typeBreakdown.length > 1) {
    const typeRows = analysis.typeBreakdown.slice(0, 8).map(t => {
      const pctOfTotal = analysis.totalGrossArea > 0 ? (t.area_ha / analysis.totalGrossArea * 100).toFixed(1) : '0.0';
      return `<tr><td>${t.type}</td><td class="r">${fmtHaFull(t.area_ha)}</td><td class="r">${pctOfTotal}%</td><td class="r">${t.features}</td></tr>`;
    }).join('');
    const typeLabel = targetCode === 'T10' ? 'Land Cover Types' : targetCode === 'T4' ? 'Species Observed' : targetCode === 'T6' ? 'IAS Species' : 'Type Breakdown';
    typeTableHtml = `
      <div class="analysis-card">
        <div class="analysis-card-title">${typeLabel} &mdash; ${provinceName}</div>
        <table class="analysis-table">
          <thead><tr><th>${targetCode === 'T4' ? 'Species' : 'Type'}</th><th class="r">Area (ha)</th><th class="r">%</th><th class="r">Records</th></tr></thead>
          <tbody>${typeRows}</tbody>
        </table>
      </div>
    `;
  }

  // 30x30 progress for T3
  let progressHtml = '';
  if (targetCode === 'T3') {
    const tBarW = Math.min(100, (analysis.tPct / 30) * 100);
    const mBarW = Math.min(100, (analysis.mPct / 30) * 100);
    const tGap = Math.max(0, 30 - analysis.tPct);
    const mGap = Math.max(0, 30 - analysis.mPct);
    progressHtml = `
      <div class="analysis-card">
        <div class="analysis-card-title">30x30 Contribution &mdash; ${provinceName}</div>
        <div class="analysis-progress-group">
          <div class="analysis-progress-label">Terrestrial: <strong>${fmtPct(analysis.tPct)}</strong> of national baseline</div>
          <div class="analysis-progress-track">
            <div class="analysis-progress-fill" style="width:${tBarW}%;background:${analysis.tPct >= 30 ? '#2E7D32' : '#006B3F'}"></div>
            <div class="analysis-progress-marker" style="left:100%"></div>
          </div>
          <div class="analysis-progress-detail">${analysis.tPct >= 30 ? 'Provincial contribution exceeds 30% threshold' : `National gap: ${fmtHaFull(tGap * baselines.terrestrial_ha / 100)} ha still needed`}</div>
        </div>
        <div class="analysis-progress-group">
          <div class="analysis-progress-label">Marine: <strong>${fmtPct(analysis.mPct)}</strong> of national baseline</div>
          <div class="analysis-progress-track">
            <div class="analysis-progress-fill" style="width:${mBarW}%;background:${analysis.mPct >= 30 ? '#2E7D32' : '#0072BC'}"></div>
            <div class="analysis-progress-marker" style="left:100%"></div>
          </div>
          <div class="analysis-progress-detail">${analysis.mPct >= 30 ? 'Provincial contribution exceeds 30% threshold' : `National gap: ${fmtHaFull(mGap * baselines.marine_ha / 100)} ha still needed`}</div>
        </div>
      </div>
    `;
  }

  // Missing layers
  const missingHtml = analysis.missingLayers.length > 0
    ? analysis.missingLayers.map(l =>
        `<div class="analysis-gap-item"><span class="analysis-gap-dot"></span>${l.name}</div>`
      ).join('')
    : '<div style="color:#2E7D32;font-size:8px">All expected data layers have data in this province</div>';

  // Completeness colour
  const compColor = analysis.dataCompleteness >= 80 ? '#2E7D32'
    : analysis.dataCompleteness >= 50 ? '#ED6C02' : '#D32F2F';

  // Province-specific actions from ToR
  const provActionsHtml = tor.proposedActions.slice(0, 4).map((a, i) =>
    `<div class="analysis-finding-item"><span class="analysis-bullet" style="color:#006B3F"><strong>${i + 1}.</strong></span><span>${a}</span></div>`
  ).join('');

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
        <div class="print-title-crs">Provincial Analysis Report</div>
      </div>
    </div>

    <div class="print-target-bar">
      <div class="print-target-code">${targetCode}</div>
      <div class="print-target-info">
        <div class="print-target-name">${target.name} &mdash; ${provinceName} Province Analysis</div>
        <div class="print-target-desc">${target.description}</div>
      </div>
      <div class="analysis-status-badge" style="background:${analysis.statusColor}">
        ${statusIcons[analysis.status] || ''} ${analysis.status}
      </div>
    </div>

    <div class="analysis-layout">
      <div class="analysis-col-left">
        <div class="analysis-card analysis-card-highlight">
          <div class="analysis-card-title">Coverage Assessment &mdash; ${provinceName}</div>
          <table class="analysis-table">
            <thead><tr><th>Metric</th><th class="r">Value</th><th class="r">% National</th></tr></thead>
            <tbody>
              ${coverageRows.map(r => `<tr><td>${r.label}</td><td class="r">${r.value}</td><td class="r">${r.pct}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>

        ${progressHtml}

        <div class="analysis-card">
          <div class="analysis-card-title">Category Composition &mdash; ${provinceName}</div>
          ${analysis.catBreakdown.length > 0 ? `
            <table class="analysis-table">
              <thead><tr><th>Category</th><th class="r">Net Area (ha)</th><th class="r">% Total</th><th class="r">Records</th></tr></thead>
              <tbody>${catCompRows}</tbody>
            </table>
          ` : '<div style="color:#999;font-size:8px">No category data for this province</div>'}
        </div>

        ${typeTableHtml}
      </div>

      <div class="analysis-col-right">
        <div class="analysis-card analysis-card-highlight">
          <div class="analysis-card-title">Provincial Assessment</div>
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
              <span class="analysis-assess-label">Records</span>
              <span class="analysis-assess-value">${analysis.totalFeatures.toLocaleString()}</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Categories</span>
              <span class="analysis-assess-value">${analysis.categoriesPresent}</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">National Share</span>
              <span class="analysis-assess-value">${analysis.provinceSharePct.toFixed(1)}% of target total</span>
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
          <div class="analysis-card-title">Provincial Insights</div>
          <div class="analysis-findings">
            ${analysis.insights.length > 0
              ? analysis.insights.map(f => `<div class="analysis-finding-item"><span class="analysis-bullet" style="color:#006B3F">&#9679;</span><span>${f}</span></div>`).join('')
              : '<div style="color:#999;font-size:8px">Upload data to generate provincial insights</div>'
            }
          </div>
        </div>
      </div>
    </div>

    <div class="analysis-methodology">
      <strong>Note:</strong> Overlapping areas have been merged to avoid double-counting.
      National baselines: Terrestrial ${fmtHaFull(baselines.terrestrial_ha)} ha; Marine ${fmtHaFull(baselines.marine_ha)} ha.
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Generated: ${new Date().toLocaleString('en-GB')} &bull; Provincial Analysis &bull; ${provinceName}
      </div>
    </div>
  `;

  container.appendChild(page);
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
    { label: 'Terrestrial', value: fmtHaFull(analysis.netTerrestrial) + ' ha', pct: fmtPct(analysis.tPct) },
    { label: 'Marine', value: fmtHaFull(analysis.netMarine) + ' ha', pct: fmtPct(analysis.mPct) },
    { label: 'Total Area', value: fmtHaFull(analysis.totalNetArea) + ' ha', pct: '' }
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
    : '<div style="color:#2E7D32;font-size:8px">All expected datasets have been uploaded</div>';

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
          <thead><tr><th>${targetCode === 'T4' ? 'Species' : 'Type'}</th><th class="r">Area (ha)</th><th class="r">% Total</th><th class="r">Records</th></tr></thead>
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
          <div class="analysis-card-title">Coverage Assessment</div>
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
              <thead><tr><th>Category</th><th class="r">Net Area (ha)</th><th class="r">% Total</th><th class="r">Records</th></tr></thead>
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
              <span class="analysis-assess-label">Datasets</span>
              <span class="analysis-assess-value">${analysis.dataLayers}</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Records</span>
              <span class="analysis-assess-value">${analysis.totalFeatures.toLocaleString()}</span>
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
      </div>
    </div>

    <div class="analysis-methodology">
      <strong>Note:</strong> Overlapping areas have been merged to avoid double-counting.
      National baselines: Terrestrial ${fmtHaFull(baselines.terrestrial_ha)} ha; Marine ${fmtHaFull(baselines.marine_ha)} ha.
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Generated: ${new Date().toLocaleString('en-GB')}
      </div>
    </div>
  `;

  container.appendChild(page);
}

// ═══════════════════════════════════════════════════════════════════════
//  ToR SECTION: DATA SOURCES, FEASIBILITY & PROPOSED ACTIONS
//  Per TOR Section I (Review), II (Data Sources), III (Strengthening)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Returns ToR-aligned content for each target:
 * - Section I: Feasibility assessment, data requirements, clarity rating
 * - Section II: National and global geospatial data sources
 * - Section III: Proposed new geospatial actions and revisions
 */
function getTargetToRContent(targetCode) {
  const content = {
    T1: {
      feasibility: 'High — Provincial and municipal planning boundaries are well-defined. Existing cadastral, environmental impact assessment (EIA), and provincial development plans provide a strong foundation. Integration with CCA boundary zones is operationally feasible.',
      clarity: 'Clear — Target is well-defined with measurable spatial outputs: percentage of land and sea area under biodiversity-inclusive plans.',
      dataRequirements: [
        'Provincial physical/development plans (shapefiles or digitised boundaries)',
        'Municipal area boundaries and zoning maps',
        'CCA boundary zone polygons',
        'Marine spatial planning zones (where available)',
        'Key Biodiversity Areas (KBA) boundaries for overlay analysis'
      ],
      nationalSources: [
        { name: 'Department of Local Authorities — Provincial Physical Plans', type: 'Polygon', status: 'Available (requires digitisation)', desc: 'Provincial and municipal development plans with land use zones' },
        { name: 'DEPC — Environmental Impact Assessment database', type: 'Point/Polygon', status: 'Partial', desc: 'EIA locations and assessed areas' },
        { name: 'Vanuatu National Statistics Office — Census boundaries', type: 'Polygon', status: 'Available', desc: 'Administrative boundaries for spatial planning context' }
      ],
      globalSources: [
        { name: 'BirdLife / KBA Partnership — Key Biodiversity Areas', type: 'Polygon', status: 'Available', desc: 'Internationally recognised sites of global importance for biodiversity' },
        { name: 'UN-Habitat — National Urban Policies database', type: 'Reference', status: 'Available', desc: 'Urban planning frameworks and policy documents' },
        { name: 'UNEP-WCMC — Protected Planet (WDPA)', type: 'Polygon', status: 'Available', desc: 'For cross-referencing spatial plans with existing protected areas' }
      ],
      proposedActions: [
        'Digitise all six provincial physical/development plans into GIS format (priority: Shefa, Sanma)',
        'Overlay KBA boundaries with existing spatial plans to identify biodiversity gaps in planning',
        'Develop marine spatial planning zones for coastal provinces (Torba, Sanma, Shefa)',
        'Integrate CCA boundary zones into provincial spatial planning frameworks',
        'Establish annual GIS update cycle for spatial plan monitoring'
      ],
      revisions: [
        'Expand target scope to explicitly include marine spatial planning alongside terrestrial plans',
        'Add indicator for proportion of KBAs covered by spatial plans',
        'Include climate vulnerability overlay in spatial planning data requirements'
      ]
    },
    T2: {
      feasibility: 'Moderate — Degradation mapping requires remote sensing analysis (satellite imagery change detection). Restoration site mapping relies on field survey data from DEPC and NGO partners. Technical capacity for remote sensing analysis may need strengthening.',
      clarity: 'Moderate — Target references "degraded areas" without specifying degradation criteria or thresholds. Operational definitions needed for consistent mapping.',
      dataRequirements: [
        'Satellite imagery time series (Sentinel-2, Landsat) for change detection',
        'Field survey data on degraded terrestrial and marine ecosystems',
        'Restoration project locations and boundaries',
        'Baseline land cover / vegetation maps for comparison',
        'Coral reef health assessment data'
      ],
      nationalSources: [
        { name: 'DEPC — Ecosystem health monitoring reports', type: 'Report/Point', status: 'Partial', desc: 'Field assessments of ecosystem condition at specific sites' },
        { name: 'Department of Forests — Forest inventory data', type: 'Polygon', status: 'Available', desc: 'Forest cover assessments and logging concession areas' },
        { name: 'Fisheries Department — Reef monitoring data', type: 'Point', status: 'Partial', desc: 'Coral reef health survey points and assessments' }
      ],
      globalSources: [
        { name: 'Global Forest Watch (WRI) — Forest loss/gain layers', type: 'Raster', status: 'Available', desc: 'Annual tree cover loss and gain at 30m resolution (Hansen et al.)' },
        { name: 'Allen Coral Atlas — Coral reef maps', type: 'Polygon', status: 'Available', desc: 'High-resolution benthic and geomorphic maps of coral reefs' },
        { name: 'UNEP — World Environment Situation Room', type: 'Raster/Vector', status: 'Available', desc: 'Environmental indicators and degradation indices' },
        { name: 'ESA Climate Change Initiative — Land cover', type: 'Raster', status: 'Available', desc: 'Global land cover time series at 300m resolution' }
      ],
      proposedActions: [
        'Conduct national satellite-based degradation assessment using Sentinel-2 change detection (2015–2025)',
        'Map degraded coral reef areas using Allen Coral Atlas combined with local reef monitoring data',
        'Establish degradation criteria and thresholds for consistent national mapping',
        'Create a restoration project register with spatial boundaries for all active/planned sites',
        'Integrate Global Forest Watch data for forest degradation baseline'
      ],
      revisions: [
        'Define clear degradation criteria (e.g., canopy loss >30%, reef health index <3)',
        'Add quantitative restoration targets (hectares per province per year)',
        'Include inland water ecosystem degradation explicitly'
      ]
    },
    T3: {
      feasibility: 'High — Vanuatu has a strong tradition of community-based conservation (Custom Tabu Areas, CCAs, LMMAs). Boundary mapping is operationally feasible through community participatory mapping. WDPA provides baseline for formal protected areas.',
      clarity: 'High — Target is well-defined under GBF: 30% of terrestrial and 30% of marine areas effectively conserved by 2030. Clear, measurable indicators.',
      dataRequirements: [
        'Community Conserved Area (CCA/Tabu) boundaries — all provinces',
        'Marine Protected Area (MPA) boundaries — gazetted and proposed',
        'Locally Managed Marine Area (LMMA) boundaries',
        'World Database on Protected Areas (WDPA) records for Vanuatu',
        'OECM (Other Effective Conservation Measures) boundaries'
      ],
      nationalSources: [
        { name: 'DEPC — Community Conservation Area register', type: 'Polygon', status: 'Partial', desc: 'CCA and Tabu area boundaries from community participatory mapping' },
        { name: 'DEPC — Protected Areas database', type: 'Polygon', status: 'Available', desc: 'Nationally gazetted protected areas and management zones' },
        { name: 'Vanuatu Fisheries Department — LMMA register', type: 'Polygon', status: 'Partial', desc: 'Locally managed marine areas registered with fisheries authorities' },
        { name: 'Provincial Government offices — Tabu area records', type: 'Polygon/Tabular', status: 'Incomplete', desc: 'Custom Tabu area records held at provincial level' }
      ],
      globalSources: [
        { name: 'UNEP-WCMC — Protected Planet (WDPA)', type: 'Polygon', status: 'Available', desc: 'Global database of protected areas — Vanuatu records' },
        { name: 'UNEP-WCMC — World Database on OECMs', type: 'Polygon', status: 'Available', desc: 'Other effective area-based conservation measures' },
        { name: 'Blue Ventures / WCS — LMMA Network Pacific', type: 'Polygon', status: 'Available', desc: 'Pacific LMMA network mapping data' },
        { name: 'BirdLife / KBA Partnership — KBAs', type: 'Polygon', status: 'Available', desc: 'For identifying priority areas for new conservation designations' }
      ],
      proposedActions: [
        'Complete participatory boundary mapping for all registered CCAs across six provinces',
        'Update WDPA submissions for Vanuatu with latest CCA/MPA boundaries',
        'Digitise and verify all LMMA boundaries in collaboration with Fisheries Department',
        'Conduct gap analysis: overlay current protection with KBAs to identify priority expansion areas',
        'Develop standardised area calculation methodology for official 30x30 reporting',
        'Establish annual reporting cycle for conservation area changes'
      ],
      revisions: [
        'Include explicit recognition of Custom Tabu Areas as OECMs in national reporting',
        'Add management effectiveness indicators alongside area-based targets',
        'Set provincial sub-targets to ensure equitable distribution of conservation across all provinces'
      ]
    },
    T4: {
      feasibility: 'Moderate — Species distribution mapping requires systematic field surveys and expert identification. Some species (Megapode, Starling) have existing survey data; others (Plerandra) have very limited baseline data.',
      clarity: 'Clear — Target specifies six priority species and KBAs. Distribution mapping is a standard conservation planning output.',
      dataRequirements: [
        'Vanuatu Megapode (Megapodius layardi) — nesting sites and range polygons',
        'Mountain Starling (Aplonis santovestris) — observation records and modelled range',
        'Streaked Fantail (Rhipidura spilodera) — observation records and habitat range',
        'Vanuatu Kingfisher (Todiramphus farquhari) — island-level distribution',
        'Flying Fox (Pteropus anetianus) — roost sites and foraging range',
        'Plerandra vanuatuensis — known populations and habitat suitability model'
      ],
      nationalSources: [
        { name: 'DEPC — National biodiversity database', type: 'Point/Polygon', status: 'Partial', desc: 'Species observation records from government monitoring programmes' },
        { name: 'Vanuatu Environment Science Society (VESS)', type: 'Point', status: 'Partial', desc: 'Citizen science and research observation records' },
        { name: 'National Herbarium — Plant collections', type: 'Point', status: 'Available', desc: 'Herbarium specimen records for Plerandra and other endemic plants' }
      ],
      globalSources: [
        { name: 'GBIF — Global Biodiversity Information Facility', type: 'Point', status: 'Available', desc: 'Aggregated species occurrence records from museums, surveys, and citizen science' },
        { name: 'IUCN Red List — Species range maps', type: 'Polygon', status: 'Available', desc: 'Expert-assessed range maps for listed species' },
        { name: 'eBird / Cornell Lab — Bird observations', type: 'Point', status: 'Available', desc: 'Citizen science bird observation records for Vanuatu' },
        { name: 'BirdLife International — Important Bird Areas', type: 'Polygon', status: 'Available', desc: 'IBA boundaries relevant to endemic bird species' }
      ],
      proposedActions: [
        'Compile all existing species observation records into a national spatial biodiversity database',
        'Conduct targeted field surveys for Mountain Starling and Plerandra in under-sampled islands',
        'Generate species distribution models (MaxEnt) using GBIF + local records for all six priority species',
        'Map critical habitat for each species and overlay with existing conservation areas',
        'Integrate eBird and GBIF data as reference layers for cross-validation'
      ],
      revisions: [
        'Add population trend indicators alongside distribution mapping',
        'Include marine species (sea turtles, dugong) for comprehensive biodiversity assessment',
        'Set explicit targets for species monitoring frequency and coverage'
      ]
    },
    T6: {
      feasibility: 'High — Invasive species are visible and mappable through remote sensing (Merremia, Mile a Minute) and field surveys (Solanum, Crown of Thorns). Drone and satellite imagery can detect vine coverage. Community reporting networks can support data collection.',
      clarity: 'Clear — Target specifies key IAS and requires total coverage (ha) and distribution mapping. Measurable and achievable with available technology.',
      dataRequirements: [
        'Merremia peltata (Big Leaf) — remote sensing detections and field survey polygons',
        'Crown of Thorns Starfish (Acanthaster planci) — reef outbreak locations and affected areas',
        'Mile a Minute Vine (Mikania micrantha) — coverage polygons from field/remote sensing',
        'Solanum torvum (Devil Fig) — infestation area boundaries from field surveys',
        'Other IAS: Fire Ants, African Snail, Sako, Coconut Beetle — occurrence points and affected areas'
      ],
      nationalSources: [
        { name: 'DEPC — Invasive species monitoring programme', type: 'Point/Polygon', status: 'Partial', desc: 'Field survey records and management intervention sites' },
        { name: 'Department of Agriculture — Pest control records', type: 'Point', status: 'Partial', desc: 'Agricultural pest reporting and control intervention locations' },
        { name: 'Fisheries Department — Crown of Thorns monitoring', type: 'Point', status: 'Partial', desc: 'Reef monitoring stations tracking COTS outbreaks' },
        { name: 'Vanuatu Biosecurity — Border interception data', type: 'Point', status: 'Available', desc: 'IAS interception and quarantine records' }
      ],
      globalSources: [
        { name: 'GBIF — Invasive species occurrence records', type: 'Point', status: 'Available', desc: 'Global observation records for target IAS species' },
        { name: 'CABI — Invasive Species Compendium', type: 'Reference', status: 'Available', desc: 'Comprehensive datasheets on ecology, distribution, and management of IAS' },
        { name: 'Pacific Invasives Partnership — Regional IAS database', type: 'Point/Reference', status: 'Available', desc: 'Pacific-focused invasive species occurrence and management data' },
        { name: 'AIMS — Crown of Thorns Starfish monitoring (Pacific)', type: 'Point', status: 'Available', desc: 'Australian Institute of Marine Science COTS reef monitoring data' }
      ],
      proposedActions: [
        'Conduct national Merremia peltata coverage mapping using Sentinel-2 satellite imagery and NDVI analysis',
        'Establish systematic Crown of Thorns reef monitoring transects at priority reef sites',
        'Map Mile a Minute Vine distribution through field surveys combined with drone imagery in affected provinces',
        'Survey and map Solanum torvum infestations focusing on agricultural areas in Shefa and Sanma',
        'Create IAS early warning system with community reporting linked to GIS database',
        'Develop eradication priority map based on proximity to conservation areas and agricultural land'
      ],
      revisions: [
        'Add monitoring frequency targets for each priority IAS (e.g., annual Merremia coverage update)',
        'Include cost-benefit analysis for IAS management actions per province',
        'Link IAS distribution data to biodiversity impact assessment for conservation areas'
      ]
    },
    T7: {
      feasibility: 'Moderate — Mapping requires collaboration with agricultural sector and Department of Agriculture. Farmer surveys and agrochemical import records can provide spatial data. Remote sensing cannot directly detect pesticide use.',
      clarity: 'Moderate — Target references "large-scale and small-scale commercial farming" but lacks quantitative thresholds. Criteria for what constitutes a mappable pesticide use area need definition.',
      dataRequirements: [
        'Commercial farm boundaries (large-scale and smallholder)',
        'Agrochemical use records by location and type',
        'Agricultural land use maps',
        'Water quality monitoring data near agricultural areas',
        'Crop type maps for identifying high-pesticide-use crops'
      ],
      nationalSources: [
        { name: 'Department of Agriculture — Farm registration data', type: 'Point/Polygon', status: 'Partial', desc: 'Registered commercial farm locations and crop types' },
        { name: 'Vanuatu Customs — Agrochemical import records', type: 'Tabular', status: 'Available', desc: 'Import volumes of pesticides and herbicides by product type' },
        { name: 'Department of Agriculture — Extension office records', type: 'Point', status: 'Partial', desc: 'Agricultural extension activities and pesticide advice records' }
      ],
      globalSources: [
        { name: 'FAO — Global agro-chemical use database', type: 'Tabular', status: 'Available', desc: 'National-level pesticide use statistics' },
        { name: 'ESA — Cropland mapping (WorldCover)', type: 'Raster', status: 'Available', desc: '10m resolution global land cover including cropland classes' },
        { name: 'NASA — Agricultural productivity indices', type: 'Raster', status: 'Available', desc: 'Satellite-derived crop health and agricultural intensity indicators' }
      ],
      proposedActions: [
        'Conduct agricultural pesticide use survey targeting commercial farms in Shefa, Sanma, and Malampa',
        'Map all commercial farm boundaries and classify by crop type and pesticide intensity',
        'Overlay pesticide use areas with adjacent conservation areas and water bodies for risk assessment',
        'Establish baseline water quality monitoring near high-pesticide-use areas',
        'Create pesticide risk heat map combining use intensity, proximity to conservation areas, and downstream impacts'
      ],
      revisions: [
        'Define measurable indicators (e.g., hectares under integrated pest management)',
        'Add explicit targets for pesticide reduction in areas adjacent to KBAs and protected areas',
        'Include organic farming promotion as a measurable alternative action'
      ]
    },
    T8: {
      feasibility: 'Moderate — Coastal eutrophication mapping requires water quality monitoring data (chlorophyll-a, nutrient levels). Satellite remote sensing (Sentinel-2) can detect chlorophyll concentrations in coastal waters. Field validation is needed.',
      clarity: 'Moderate — Target references "coastal eutrophication and nutrient-impacted zones" without specifying monitoring methodology or thresholds.',
      dataRequirements: [
        'Coastal water quality monitoring data (chlorophyll-a, nitrogen, phosphorus)',
        'Sewage discharge and waste management site locations',
        'River discharge points and catchment land use data',
        'Satellite-derived chlorophyll-a concentration maps',
        'Coral reef health data as impact indicator'
      ],
      nationalSources: [
        { name: 'DEPC — Water quality monitoring programme', type: 'Point', status: 'Partial', desc: 'Coastal water quality sample stations and results' },
        { name: 'Public Works Department — Sewage infrastructure', type: 'Point', status: 'Partial', desc: 'Sewage treatment and discharge locations' },
        { name: 'Port Vila Municipal Council — Waste management', type: 'Point/Polygon', status: 'Partial', desc: 'Waste disposal sites and drainage infrastructure' }
      ],
      globalSources: [
        { name: 'Copernicus Marine Service — Ocean colour products', type: 'Raster', status: 'Available', desc: 'Satellite-derived chlorophyll-a and water quality indicators' },
        { name: 'UN Environment — Global Nutrient Management System', type: 'Reference', status: 'Available', desc: 'Global nutrient pollution assessment data and methodology' },
        { name: 'Allen Coral Atlas — Reef water quality', type: 'Raster', status: 'Available', desc: 'Water clarity and turbidity indicators for reef areas' }
      ],
      proposedActions: [
        'Establish permanent coastal water quality monitoring stations at key sites (Port Vila, Luganville, Lakatoro)',
        'Generate satellite-derived eutrophication risk maps using Sentinel-2 chlorophyll-a analysis',
        'Map all point-source nutrient discharge locations (sewage, agriculture, aquaculture)',
        'Conduct catchment-level nutrient loading analysis for priority coastal zones',
        'Develop early warning thresholds for coastal eutrophication based on WHO/UNEP guidelines'
      ],
      revisions: [
        'Define specific eutrophication thresholds (e.g., chlorophyll-a >5 µg/L)',
        'Add monitoring frequency targets (monthly at key sites)',
        'Include freshwater eutrophication in inland water bodies'
      ]
    },
    T10: {
      feasibility: 'High — Land cover mapping is a well-established remote sensing application. Sentinel-2 (10m) and Landsat (30m) imagery are freely available. National land cover mapping can be completed with existing technical capacity.',
      clarity: 'Clear — Target requires mapping of land cover change for agriculture, livestock, fisheries and forestry. Standard remote sensing classification output.',
      dataRequirements: [
        'Multi-temporal satellite imagery (Sentinel-2, Landsat) for change detection',
        'Ground truth / field survey points for classification training and validation',
        'Existing land use maps and agricultural census data',
        'Forest inventory and logging concession boundaries',
        'Fisheries infrastructure and aquaculture site locations'
      ],
      nationalSources: [
        { name: 'Department of Forests — Forest inventory and concessions', type: 'Polygon', status: 'Available', desc: 'Forest cover assessments and logging concession boundaries' },
        { name: 'Department of Agriculture — Agricultural census', type: 'Tabular/Point', status: 'Available', desc: 'Agricultural production data by area council' },
        { name: 'Vanuatu Lands Department — Land tenure and use', type: 'Polygon', status: 'Partial', desc: 'Registered land parcels and designated land uses' },
        { name: 'VANRIS — Vanuatu Resource Information System', type: 'Polygon', status: 'Available', desc: 'Historical land resource mapping (soils, vegetation, climate zones)' }
      ],
      globalSources: [
        { name: 'ESA WorldCover — 10m land cover', type: 'Raster', status: 'Available', desc: '10m resolution global land cover (2020/2021) with 11 classes' },
        { name: 'Global Forest Watch — Tree cover loss/gain', type: 'Raster', status: 'Available', desc: 'Annual forest change data at 30m resolution (Hansen et al.)' },
        { name: 'FAO — Global Land Cover Network (GLCN)', type: 'Raster', status: 'Available', desc: 'UN land cover classification system products' },
        { name: 'Copernicus Global Land Service — Land cover', type: 'Raster', status: 'Available', desc: 'Annual 100m dynamic land cover with change detection' }
      ],
      proposedActions: [
        'Produce national land cover / land use map at 10m resolution using Sentinel-2 imagery',
        'Generate 2015–2025 land cover change analysis for agriculture expansion and deforestation',
        'Classify agricultural areas by crop type (coconut, cocoa, kava, cattle, food crops)',
        'Map forest-to-agriculture conversion hotspots per province for REDD+ reporting',
        'Establish annual land cover monitoring programme using satellite change detection',
        'Validate land cover maps using field surveys and community ground-truthing'
      ],
      revisions: [
        'Add explicit change detection indicators (e.g., hectares of forest loss per year)',
        'Include sustainable land management practices as a positive action indicator',
        'Link land cover change to carbon stock estimates for climate reporting'
      ]
    },
    T12: {
      feasibility: 'Moderate — Green and blue space mapping in urban areas requires detailed spatial data. Provincial capitals have varying levels of existing urban mapping. Drone surveys may be needed for accurate park boundary delineation.',
      clarity: 'Moderate — Target references "parks within provincial and municipal areas, and botanical gardens" but lacks criteria for what constitutes a blue/green space. Needs operational definition.',
      dataRequirements: [
        'Urban park and public garden boundaries',
        'Botanical garden extents',
        'Municipal area boundaries and land use zoning',
        'Waterfront/coastal public access areas (blue spaces)',
        'Tree canopy cover in urban areas'
      ],
      nationalSources: [
        { name: 'Port Vila Municipal Council — Park and open space register', type: 'Polygon', status: 'Partial', desc: 'Municipal parks, gardens, and public open spaces in Port Vila' },
        { name: 'Luganville Municipal Council — Green space inventory', type: 'Polygon', status: 'Partial', desc: 'Parks and recreational areas in Luganville' },
        { name: 'Department of Forests — Botanical garden boundaries', type: 'Polygon', status: 'Available', desc: 'National botanical garden and arboretum boundaries' }
      ],
      globalSources: [
        { name: 'OpenStreetMap — Urban land use features', type: 'Polygon', status: 'Available', desc: 'Community-mapped parks, gardens, and recreational areas' },
        { name: 'ESA WorldCover — Urban vegetation detection', type: 'Raster', status: 'Available', desc: 'Tree cover and vegetation within urban extents' },
        { name: 'Google Open Buildings — Building footprints', type: 'Polygon', status: 'Available', desc: 'For calculating green space ratio vs built-up area' }
      ],
      proposedActions: [
        'Map all public parks and green spaces in Port Vila and Luganville using drone imagery',
        'Conduct green space inventory for all provincial capitals (Lakatoro, Saratamata, Isangel, Sola)',
        'Calculate green space per capita ratios for each urban area (WHO recommends 9 m² per person)',
        'Map blue spaces (coastal access, waterfront parks, mangrove boardwalks) in urban areas',
        'Develop green space expansion plan for under-served urban communities'
      ],
      revisions: [
        'Define minimum green space standards (e.g., WHO 9 m² per capita)',
        'Add accessibility indicators (% of population within 300m of green space)',
        'Include urban tree canopy targets alongside ground-level green space'
      ]
    }
  };

  return content[targetCode] || {
    feasibility: 'Assessment pending — requires further analysis of data availability and institutional capacity.',
    clarity: 'Assessment pending — target definition review needed.',
    dataRequirements: ['Spatial datasets relevant to target objectives'],
    nationalSources: [],
    globalSources: [],
    proposedActions: ['Conduct baseline data assessment for this target'],
    revisions: ['Review target indicators for measurability and spatial relevance']
  };
}

/**
 * Renders the Data Sources & Proposed Actions page (Page 3).
 * Aligns with ToR Sections I, II, III.
 */
function renderDataSourcesAndActionsPage(container, targetCode, target, analysis) {
  const page = document.createElement('div');
  page.className = 'print-page print-analysis-page';

  const tor = getTargetToRContent(targetCode);
  const baselines = ENV.nationalBaselines;

  // ── National data sources table ──
  const nationalRows = tor.nationalSources.map(s =>
    `<tr><td><strong>${s.name}</strong></td><td>${s.type}</td><td class="status-${s.status === 'Available' ? 'ok' : s.status === 'Partial' ? 'partial' : 'gap'}">${s.status}</td><td>${s.desc}</td></tr>`
  ).join('');

  // ── Global data sources table ──
  const globalRows = tor.globalSources.map(s =>
    `<tr><td><strong>${s.name}</strong></td><td>${s.type}</td><td class="status-${s.status === 'Available' ? 'ok' : s.status === 'Partial' ? 'partial' : 'gap'}">${s.status}</td><td>${s.desc}</td></tr>`
  ).join('');

  // ── Data requirements list ──
  const dataReqHtml = tor.dataRequirements.map(r =>
    `<div class="analysis-finding-item"><span class="analysis-bullet">&#9654;</span><span>${r}</span></div>`
  ).join('');

  // ── Proposed actions ──
  const actionsHtml = tor.proposedActions.map((a, i) =>
    `<div class="analysis-finding-item"><span class="analysis-bullet" style="color:#006B3F"><strong>${i + 1}.</strong></span><span>${a}</span></div>`
  ).join('');

  // ── Proposed revisions ──
  const revisionsHtml = tor.revisions.map(r =>
    `<div class="analysis-finding-item"><span class="analysis-bullet" style="color:#ED6C02">&#9670;</span><span>${r}</span></div>`
  ).join('');

  // ── Uploaded data sources summary ──
  const uploadedCount = analysis.dataLayers;
  const missingCount = analysis.missingLayers.length;
  const expectedCount = uploadedCount + missingCount;

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
        <div class="print-title-crs">Data Sources &amp; Proposed Actions</div>
      </div>
    </div>

    <div class="print-target-bar">
      <div class="print-target-code">${targetCode}</div>
      <div class="print-target-info">
        <div class="print-target-name">${target.name}</div>
        <div class="print-target-desc">${target.description}</div>
      </div>
    </div>

    <div class="analysis-layout">
      <div class="analysis-col-left">
        <div class="analysis-card analysis-card-highlight">
          <div class="analysis-card-title">I. Target Review &mdash; Feasibility &amp; Data Requirements</div>
          <div class="tor-review-grid">
            <div class="tor-review-item">
              <div class="tor-review-label">Feasibility Assessment</div>
              <div class="tor-review-text">${tor.feasibility}</div>
            </div>
            <div class="tor-review-item">
              <div class="tor-review-label">Clarity &amp; Measurability</div>
              <div class="tor-review-text">${tor.clarity}</div>
            </div>
            <div class="tor-review-item">
              <div class="tor-review-label">Current Status (Geospatial Assessment)</div>
              <div class="tor-review-text">${analysis.dataLayers > 0
                ? `<strong>${uploadedCount}</strong> of ${expectedCount} expected datasets uploaded (${analysis.dataCompleteness}% complete). Total coverage: <strong>${fmtHaFull(analysis.totalNetArea)} ha</strong> (${fmtPct(analysis.tPct)} terrestrial, ${fmtPct(analysis.mPct)} marine). ${analysis.provincesWithData.length} of 6 provinces have data.`
                : 'No geospatial data uploaded for this target. Baseline data collection is required to assess current status.'
              }</div>
            </div>
          </div>
          <div class="tor-review-item" style="margin-top:4px">
            <div class="tor-review-label">Data Requirements</div>
            <div class="analysis-findings">${dataReqHtml}</div>
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">II. Identification of Geospatial Data Sources &mdash; National</div>
          ${nationalRows ? `
            <table class="analysis-table">
              <thead><tr><th>Source</th><th>Type</th><th>Status</th><th>Description</th></tr></thead>
              <tbody>${nationalRows}</tbody>
            </table>
          ` : '<div style="color:#999;font-size:8px">No national data sources identified</div>'}
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">II. Identification of Geospatial Data Sources &mdash; Global</div>
          ${globalRows ? `
            <table class="analysis-table">
              <thead><tr><th>Source</th><th>Type</th><th>Status</th><th>Description</th></tr></thead>
              <tbody>${globalRows}</tbody>
            </table>
          ` : '<div style="color:#999;font-size:8px">No global data sources identified</div>'}
        </div>
      </div>

      <div class="analysis-col-right">
        <div class="analysis-card">
          <div class="analysis-card-title">III. Strengthening NBSAP Actions &mdash; Proposed New Geospatial Actions</div>
          <div class="analysis-findings">${actionsHtml}</div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">III. Proposed Revisions to Existing Actions</div>
          <div class="analysis-findings">${revisionsHtml}</div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">Data Upload Status</div>
          <div class="analysis-assessment">
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Expected Layers</span>
              <span class="analysis-assess-value">${expectedCount}</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Uploaded</span>
              <span class="analysis-assess-value" style="color:#2E7D32">${uploadedCount}</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Missing</span>
              <span class="analysis-assess-value" style="color:${missingCount > 0 ? '#D32F2F' : '#2E7D32'}">${missingCount}</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Completeness</span>
              <div style="display:flex;align-items:center;gap:6px;flex:1">
                <div class="analysis-comp-track"><div class="analysis-comp-fill" style="width:${analysis.dataCompleteness}%;background:${analysis.dataCompleteness >= 80 ? '#2E7D32' : analysis.dataCompleteness >= 50 ? '#ED6C02' : '#D32F2F'}"></div></div>
                <span class="analysis-assess-value">${analysis.dataCompleteness}%</span>
              </div>
            </div>
          </div>
          ${analysis.missingLayers.length > 0 ? `
            <div style="margin-top:4px;border-top:0.5px solid #eee;padding-top:3px">
              <div style="font-size:7px;font-weight:700;color:#666;margin-bottom:2px">MISSING LAYERS:</div>
              ${analysis.missingLayers.map(l => `<div class="analysis-gap-item"><span class="analysis-gap-dot"></span>${l.name}</div>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    </div>

    <div class="analysis-methodology">
      <strong>Reference:</strong> Terms of Reference — Vanuatu NBSAP Geospatial Consultancy: (I) Review of NBSAP Geospatial Targets and Actions; (II) Identification of Geospatial Data Sources;
      (III) Strengthening NBSAP Actions. Technical oversight: Biodiversity and Conservation Division &amp; NBSAP Draft and Update Team, DEPC.
      National baselines: Terrestrial ${fmtHaFull(baselines.terrestrial_ha)} ha; Marine ${fmtHaFull(baselines.marine_ha)} ha.
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Generated: ${new Date().toLocaleString('en-GB')} &bull; NBSAP GIS Assessment
      </div>
    </div>
  `;

  container.appendChild(page);
}

// ═══════════════════════════════════════════════════════════════════════

/** Max TOTAL features to render on a single print map page (across all groups).
 *  Kept low because province-by-province printing creates up to 6 maps sequentially. */
const PRINT_MAP_TOTAL_CAP = 400;

/**
 * Initializes a Leaflet map inside the print page for a specific target.
 * Renders dissolved (unioned) boundaries per symbology group (category, or
 * sub-type for LAND_COVER) for clean cartographic output.
 *
 * For very large datasets (T10), dissolution is skipped and features are
 * capped to PRINT_MAP_TOTAL_CAP total across all groups.
 */
function initPrintLeafletMap(containerId, targetCode, layers, provincesGeojson, provinceFilter, skipDissolution) {
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
    touchZoom: false,
    preferCanvas: true
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(printMap);

  L.control.scale({ imperial: false, position: 'bottomleft', maxWidth: 150 }).addTo(printMap);

  // Province boundaries
  let provinceBoundsLayer = null;
  if (provincesGeojson) {
    L.geoJSON(provincesGeojson, {
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

  // ── Sort layers by user-defined z-order from interactive map ──
  const order = getLayerOrder();
  const orderIndex = new Map(order.map((id, i) => [id, i]));
  const orderedLayers = [...layers].sort((a, b) => (orderIndex.get(a.id) ?? 999) - (orderIndex.get(b.id) ?? 999));

  // ── Collect features per symbology group ──
  const groupPolygons = {};   // groupKey → Feature[]
  const groupMeta = {};       // groupKey → { cat, typeValue }
  const refPolygons = {};     // cat → Feature[]
  const refPoints = {};       // cat → Feature[]
  const pointsByCat = {};     // cat → Feature[]

  for (const layerData of orderedLayers) {
    const meta = layerData.metadata;
    const cat = meta?.category || 'OTHER';
    const allFeats = layerData.geojson?.features || [];
    const isRef = meta?.isReference === true;

    for (const f of allFeats) {
      if (provinceFilter && f.properties?.province !== provinceFilter) continue;
      const geomType = f.geometry?.type;
      if (isRef) {
        if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
          if (!refPolygons[cat]) refPolygons[cat] = [];
          refPolygons[cat].push(f);
        } else if (geomType === 'Point' || geomType === 'MultiPoint') {
          if (!refPoints[cat]) refPoints[cat] = [];
          refPoints[cat].push(f);
        }
      } else if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
        const gk = featureGroupKey(cat, f);
        if (!groupPolygons[gk]) groupPolygons[gk] = [];
        groupPolygons[gk].push(f);
        if (!groupMeta[gk]) {
          groupMeta[gk] = { cat, typeValue: cat === 'LAND_COVER' ? (f.properties?.type || null) : null };
        }
      } else if (geomType === 'Point' || geomType === 'MultiPoint') {
        if (!pointsByCat[cat]) pointsByCat[cat] = [];
        pointsByCat[cat].push(f);
      }
    }
  }

  // ── Count total data features to decide if we need to cap ──
  let totalDataFeatures = 0;
  for (const features of Object.values(groupPolygons)) totalDataFeatures += features.length;
  for (const features of Object.values(pointsByCat)) totalDataFeatures += features.length;
  const needsCap = totalDataFeatures > PRINT_MAP_TOTAL_CAP;
  // Budget remaining for data features after reference layers
  let featureBudget = PRINT_MAP_TOTAL_CAP;

  const featureGroup = L.featureGroup();

  // ── Reference layers first (behind data layers) — batched per category ──
  for (const [cat, features] of Object.entries(refPolygons)) {
    featureGroup.addLayer(L.geoJSON({ type: 'FeatureCollection', features }, {
      style: () => referencePolygonStyle(cat)
    }));
  }
  for (const [cat, features] of Object.entries(refPoints)) {
    const style = referencePointStyle(cat);
    featureGroup.addLayer(L.geoJSON({ type: 'FeatureCollection', features }, {
      pointToLayer: (f, latlng) => L.circleMarker(latlng, style)
    }));
  }

  // ── Render polygon groups ──
  // Sort groups by size descending so each group gets a fair share of the budget
  const sortedGroups = Object.entries(groupPolygons).sort((a, b) => b[1].length - a[1].length);
  for (const [gk, features] of sortedGroups) {
    if (needsCap && featureBudget <= 0) break;
    const { cat, typeValue } = groupMeta[gk];
    const style = printDissolvedStyle(cat, typeValue);

    // Skip expensive dissolution for province-by-province maps
    const dissolved = skipDissolution ? null : dissolveFeatures(features);

    if (dissolved) {
      featureGroup.addLayer(L.geoJSON(dissolved, { style: () => style }));
    } else if (features.length > 0) {
      const allowed = needsCap ? Math.min(features.length, featureBudget) : features.length;
      const slice = allowed < features.length ? features.slice(0, allowed) : features;
      featureGroup.addLayer(L.geoJSON({ type: 'FeatureCollection', features: slice }, {
        style: () => style
      }));
      if (needsCap) featureBudget -= slice.length;
    }
  }

  // ── Render point features (on top) ──
  for (const [cat, points] of Object.entries(pointsByCat)) {
    if (needsCap && featureBudget <= 0) break;
    if (points.length > 0) {
      const style = printPointStyle(cat);
      const allowed = needsCap ? Math.min(points.length, featureBudget) : points.length;
      const slice = allowed < points.length ? points.slice(0, allowed) : points;
      featureGroup.addLayer(L.geoJSON({ type: 'FeatureCollection', features: slice }, {
        pointToLayer: (feature, latlng) => L.circleMarker(latlng, style)
      }));
      if (needsCap) featureBudget -= slice.length;
    }
  }

  featureGroup.addTo(printMap);

  // Fit map bounds after invalidating size so the container is correctly measured first
  setTimeout(() => {
    printMap.invalidateSize();
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
  }, 200);
}
