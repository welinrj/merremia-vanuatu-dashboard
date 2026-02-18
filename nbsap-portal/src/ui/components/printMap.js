/**
 * Print Map — standardized cartographic map templates for each NBSAP target.
 *
 * Creates a full-screen print overlay with a professional map layout:
 *   - Title block (target name, description, NBSAP branding)
 *   - Leaflet map showing dissolved (union) boundaries per category
 *   - Legend (category colours used by the target)
 *   - North arrow
 *   - Scale bar (Leaflet built-in)
 *   - Metadata footer (date, layers, features, area, CRS)
 *
 * Uses @media print CSS to hide everything except the print overlay,
 * so the user can call window.print() or Ctrl+P for a clean output.
 *
 * Polygon dissolution follows UNEP-WCMC methodology: overlapping features
 * are unioned per category for clean cartographic boundaries.
 */
import L from 'leaflet';
import ENV from '../../config/env.js';
import { CATEGORIES } from '../../config/categories.js';
import targetsConfig from '../../config/targets.js';
import EXPECTED_LAYERS from '../../config/expectedLayers.js';
import { getAppState, getDashboardLayers } from '../state.js';
import { compute30x30Metrics, computeTargetMetrics, dissolveFeatures } from '../../gis/areaCalc.js';

const OVERLAY_ID = 'print-map-overlay';

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

/** Format hectares */
function fmtHa(val) {
  if (!val && val !== 0) return '0';
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(2) + 'M';
  if (val >= 1_000) return (val / 1_000).toFixed(1) + 'K';
  return val.toFixed(1);
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
function buildOverlay(targetCodes) {
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.className = 'print-overlay';

  const label = targetCodes.length === 1
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
 */
function renderTargetPage(container, targetCode, target) {
  const state = getAppState();
  const layers = getTargetLayers(targetCode);
  const expected = getExpectedForTarget(targetCode);

  // Compute metrics (now includes dissolution)
  let metrics;
  if (targetCode === 'T3') {
    metrics = compute30x30Metrics(layers, { targets: [targetCode], province: 'All', category: 'All', realm: 'All', year: 'All' });
  } else {
    metrics = computeTargetMetrics(layers, targetCode, { targets: [targetCode], province: 'All', category: 'All', realm: 'All', year: 'All' });
  }

  // Determine categories used by this target's layers
  const usedCategories = new Set();
  for (const l of layers) {
    if (l.metadata?.category) usedCategories.add(l.metadata.category);
  }
  // Also add expected categories even if no data yet
  for (const el of expected) {
    usedCategories.add(el.category);
  }

  // Count features and area (use dissolved net area from metrics), excluding reference layers
  let totalFeatures = 0;
  for (const l of layers) {
    if (!l.metadata?.isReference) {
      totalFeatures += l.geojson?.features?.length || 0;
    }
  }
  const totalAreaHa = (targetCode === 'T3')
    ? (metrics.terrestrial_ha + metrics.marine_ha)
    : (metrics.totalAreaHa || 0);

  // Build the page
  const page = document.createElement('div');
  page.className = 'print-page';

  const mapId = `print-map-${targetCode}`;

  // Build legend HTML
  const legendItems = [...usedCategories].map(cat => {
    const c = CATEGORIES[cat] || { label: cat, color: '#95a5a6' };
    return `<div class="print-legend-item">
      <span class="print-legend-swatch" style="background:${c.color}"></span>
      <span>${c.label}</span>
    </div>`;
  }).join('');

  // Build metrics summary for T3 vs other targets
  let metricsHtml = '';
  if (targetCode === 'T3' && metrics) {
    metricsHtml = `
      <div class="print-metrics-row">
        <div class="print-metric"><span class="print-metric-value">${metrics.terrestrial_pct?.toFixed(1) || 0}%</span><span class="print-metric-label">Terrestrial</span></div>
        <div class="print-metric"><span class="print-metric-value">${metrics.marine_pct?.toFixed(1) || 0}%</span><span class="print-metric-label">Marine</span></div>
        <div class="print-metric"><span class="print-metric-value">${fmtHa(metrics.terrestrial_ha || 0)}</span><span class="print-metric-label">Terrestrial ha (net)</span></div>
        <div class="print-metric"><span class="print-metric-value">${fmtHa(metrics.marine_ha || 0)}</span><span class="print-metric-label">Marine ha (net)</span></div>
      </div>
    `;
  } else {
    metricsHtml = `
      <div class="print-metrics-row">
        <div class="print-metric"><span class="print-metric-value">${layers.length}</span><span class="print-metric-label">Layers</span></div>
        <div class="print-metric"><span class="print-metric-value">${totalFeatures.toLocaleString()}</span><span class="print-metric-label">Features</span></div>
        <div class="print-metric"><span class="print-metric-value">${fmtHa(totalAreaHa)}</span><span class="print-metric-label">Net Area (ha)</span></div>
        <div class="print-metric"><span class="print-metric-value">${usedCategories.size}</span><span class="print-metric-label">Categories</span></div>
      </div>
    `;
  }

  // Province breakdown mini-table
  const provBreakdown = metrics?.provinceBreakdown || [];

  let provTableHtml = '';
  if (provBreakdown.length > 0) {
    const rows = provBreakdown.slice(0, 8).map(p => {
      const name = p.province || p.name || 'Unknown';
      const area = p.total_ha ?? p.area_ha ?? 0;
      const feats = p.features ?? p.count ?? 0;
      return `<tr><td>${name}</td><td style="text-align:right">${fmtHa(area)} ha</td><td style="text-align:right">${feats}</td></tr>`;
    }).join('');
    provTableHtml = `
      <div class="print-prov-table">
        <div class="print-section-title">Provincial Breakdown (net area, dissolved)</div>
        <table>
          <thead><tr><th>Province</th><th style="text-align:right">Area</th><th style="text-align:right">Features</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  // Data sources list
  const sourcesList = layers.map(l => {
    const name = l.metadata?.name || l.id;
    const cat = CATEGORIES[l.metadata?.category]?.label || l.metadata?.category || '';
    const count = l.geojson?.features?.length || 0;
    return `<span class="print-source-tag">${name} (${cat}, ${count} features)</span>`;
  }).join(' ');

  page.innerHTML = `
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006B3F" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
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
          ${state.provincesGeojson ? '<div class="print-legend-item"><span class="print-legend-swatch print-legend-swatch-province"></span><span>Province Boundary</span></div>' : ''}
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

    <div class="print-bottom-section">
      ${provTableHtml}
      <div class="print-data-sources">
        <div class="print-section-title">Data Sources</div>
        ${layers.length > 0 ? `<div>${sourcesList}</div>` : '<div style="color:#999;font-size:11px">No data layers uploaded for this target</div>'}
      </div>
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> Vanua Spatial Solutions &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Printed: ${new Date().toLocaleString('en-GB')} &bull; Map Projection: WGS 84 &bull; Areas dissolved (UNEP-WCMC)
      </div>
    </div>
  `;

  container.appendChild(page);

  // Initialize Leaflet map for this page (deferred to ensure DOM is ready)
  requestAnimationFrame(() => {
    setTimeout(() => initPrintLeafletMap(mapId, targetCode, layers, state.provincesGeojson), 100);
  });
}

/**
 * Initializes a Leaflet map inside the print page for a specific target.
 * Renders dissolved (unioned) boundaries per category for clean cartographic output.
 */
function initPrintLeafletMap(containerId, targetCode, layers, provincesGeojson) {
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
  if (provincesGeojson) {
    L.geoJSON(provincesGeojson, {
      style: {
        color: '#777',
        weight: 1.2,
        fillOpacity: 0.02,
        dashArray: '4 4'
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
      }
    }).addTo(printMap);
  }

  // Collect features per category for dissolution (excluding reference layers)
  const categoryPolygons = {};
  const refFeatures = [];
  const featureGroup = L.featureGroup();

  for (const layerData of layers) {
    const meta = layerData.metadata;
    const cat = meta?.category || 'OTHER';
    const features = layerData.geojson?.features || [];
    const isRef = meta?.isReference === true;
    const catConfig = CATEGORIES[cat] || CATEGORIES.OTHER;

    for (const f of features) {
      const geomType = f.geometry?.type;
      if (isRef) {
        refFeatures.push({ feature: f, catConfig });
      } else if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
        if (!categoryPolygons[cat]) categoryPolygons[cat] = [];
        categoryPolygons[cat].push(f);
      }
    }
  }

  // Render dissolved boundaries per category
  for (const [cat, features] of Object.entries(categoryPolygons)) {
    const catConfig = CATEGORIES[cat] || CATEGORIES.OTHER;
    const dissolved = dissolveFeatures(features);

    if (dissolved) {
      const geoLayer = L.geoJSON(dissolved, {
        style: () => ({
          color: catConfig.color,
          weight: 2,
          fillOpacity: 0.3,
          fillColor: catConfig.color
        })
      });
      featureGroup.addLayer(geoLayer);
    }
  }

  // Render reference layers with distinct dashed styling
  for (const { feature, catConfig } of refFeatures) {
    const geomType = feature.geometry?.type;
    if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
      const geoLayer = L.geoJSON(feature, {
        style: () => ({
          color: catConfig.color,
          weight: 1.5,
          fillOpacity: 0.06,
          fillColor: catConfig.color,
          dashArray: '6 4'
        })
      });
      featureGroup.addLayer(geoLayer);
    } else if (geomType === 'Point' || geomType === 'MultiPoint') {
      const geoLayer = L.geoJSON(feature, {
        pointToLayer: (f, latlng) => L.circleMarker(latlng, {
          radius: 4,
          fillColor: catConfig.color,
          color: catConfig.color,
          weight: 1,
          fillOpacity: 0.25
        })
      });
      featureGroup.addLayer(geoLayer);
    }
  }

  // Also render non-reference point features normally
  for (const layerData of layers) {
    const meta = layerData.metadata;
    if (meta?.isReference) continue;
    const catConfig = CATEGORIES[meta?.category] || CATEGORIES.OTHER;
    const features = layerData.geojson?.features || [];
    const points = features.filter(f =>
      f.geometry?.type === 'Point' || f.geometry?.type === 'MultiPoint'
    );

    if (points.length > 0) {
      const geoLayer = L.geoJSON({ type: 'FeatureCollection', features: points }, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 5,
            fillColor: catConfig.color,
            color: '#fff',
            weight: 1,
            fillOpacity: 0.8
          });
        }
      });
      featureGroup.addLayer(geoLayer);
    }
  }

  featureGroup.addTo(printMap);

  // Fit map to data bounds
  if (featureGroup.getLayers().length > 0) {
    const bounds = featureGroup.getBounds();
    if (bounds.isValid()) {
      printMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }

  // Invalidate size after a short delay to ensure proper rendering
  setTimeout(() => printMap.invalidateSize(), 200);
}
