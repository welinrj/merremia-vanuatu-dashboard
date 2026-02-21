/**
 * Leaflet Map component.
 * Renders the interactive map with basemap selector, layer controls,
 * dissolved category boundaries, and popups showing standardized attributes.
 *
 * Dissolution: overlapping polygons within each category (or sub-type for
 * LAND_COVER) are dissolved (unioned) into a single boundary for clean
 * cartographic display.  Individual features are rendered as thin outlines
 * for popup interactivity.
 *
 * Professional symbology is driven by config/symbology.js which provides
 * distinct fill/stroke colours per category, LAND_COVER sub-type colours,
 * status-based modifiers, and legend helpers.
 */
import L from 'leaflet';
import ENV from '../../config/env.js';
import { CATEGORIES } from '../../config/categories.js';
import {
  featureGroupKey,
  resolveColors,
  dissolvedFillStyle,
  featureOutlineStyle,
  referencePolygonStyle,
  referencePointStyle,
  pointMarkerStyle,
  collectLegendEntries
} from '../../config/symbology.js';
import { getAppState, getDashboardLayers } from '../state.js';
import { dissolveFeatures } from '../../gis/areaCalc.js';

let map = null;
let baseLayers = {};
let overlayGroup = null;
let provincesLayer = null;
let legendControl = null;

/**
 * Canvas renderer — much faster than SVG for large feature sets.
 * SVG creates one DOM element per feature; canvas draws to a single bitmap.
 */
const canvasRenderer = L.canvas({ padding: 0.5 });

/**
 * Above this feature count, skip individual popup-outline layers
 * and use a lightweight click handler on the fill layer instead.
 * This prevents creating thousands of interactive DOM nodes.
 */
const LARGE_LAYER_THRESHOLD = 1000;

/**
 * Initializes the Leaflet map.
 * @param {string} containerId - DOM element ID for the map
 * @returns {L.Map}
 */
export function initMap(containerId) {
  if (map) {
    map.invalidateSize();
    return map;
  }

  map = L.map(containerId, {
    center: ENV.mapCenter,
    zoom: ENV.mapZoom,
    zoomControl: true
  });

  // Add basemaps
  for (const [key, src] of Object.entries(ENV.tileSources)) {
    baseLayers[src.name] = L.tileLayer(src.url, {
      attribution: src.attribution,
      maxZoom: src.maxZoom
    });
  }

  // Add default basemap
  const defaultBase = Object.values(baseLayers)[0];
  if (defaultBase) defaultBase.addTo(map);

  // featureGroup (not layerGroup) so getBounds() is available for fitBounds
  overlayGroup = L.featureGroup();
  overlayGroup.addTo(map);

  L.control.layers(baseLayers, {}, { position: 'topright' }).addTo(map);

  // Scale bar
  L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

  return map;
}

/**
 * Updates map layers based on current app state and filters.
 * Renders dissolved category boundaries for clean cartographic display,
 * with individual feature outlines for popup interactivity.
 */
export function updateMapLayers() {
  if (!map) return;

  overlayGroup.clearLayers();
  if (provincesLayer) {
    provincesLayer.remove();
    provincesLayer = null;
  }

  const state = getAppState();
  const filters = state.filters;
  const layers = getDashboardLayers();

  // Render provinces boundary
  if (state.provincesGeojson) {
    provincesLayer = L.geoJSON(state.provincesGeojson, {
      style: {
        color: '#555',
        weight: 1.5,
        fillOpacity: 0.03,
        dashArray: '4 4'
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name || feature.properties.province || 'Unknown';
        layer.bindTooltip(name, { sticky: true, className: 'province-tooltip' });
      }
    }).addTo(map);
  }

  // ── Pass 1: Collect features ──────────────────────────────────────
  // Groups polygons by symbology key (category, or sub-type for LAND_COVER)
  // so dissolution + colouring respect sub-types.
  const groupPolygons = {};            // groupKey → Feature[]
  const groupMeta = {};                // groupKey → { cat, typeValue }
  const categoryPolygonMetas = {};     // cat → { features, meta }[] for popup outlines
  const categoryPointFeatures = {};    // cat → { features, meta }
  const refPolygonFeatures = [];
  const refPointFeatures = [];
  const visibleLayers = [];            // for legend

  for (const layerData of layers) {
    const meta = layerData.metadata;
    if (!layerData.geojson) continue;

    // Apply target filter
    if (filters.targets.length > 0) {
      if (!meta.targets.some(t => filters.targets.includes(t))) continue;
    }

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      if (meta.category !== filters.category) continue;
    }

    const cat = meta.category || 'OTHER';
    const features = filterFeatures(layerData.geojson.features || [], filters);
    const isRef = meta.isReference === true;

    if (features.length === 0) continue;
    visibleLayers.push(layerData);

    const polyFeatures = [];
    const pointFeats = [];

    for (const f of features) {
      const geomType = f.geometry?.type;
      if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
        if (isRef) {
          refPolygonFeatures.push({ feature: f, meta, cat });
        } else {
          polyFeatures.push(f);
          // Group by symbology key (sub-type for LAND_COVER)
          const gk = featureGroupKey(cat, f);
          if (!groupPolygons[gk]) groupPolygons[gk] = [];
          groupPolygons[gk].push(f);
          if (!groupMeta[gk]) {
            groupMeta[gk] = { cat, typeValue: cat === 'LAND_COVER' ? (f.properties?.type || null) : null };
          }
        }
      } else if (geomType === 'Point' || geomType === 'MultiPoint') {
        if (isRef) {
          refPointFeatures.push({ feature: f, meta, cat });
        } else {
          pointFeats.push(f);
        }
      }
    }

    // Collect polygon features per layer for popup rendering
    if (polyFeatures.length > 0 && !isRef) {
      if (!categoryPolygonMetas[cat]) categoryPolygonMetas[cat] = [];
      categoryPolygonMetas[cat].push({ features: polyFeatures, meta });
    }

    // Collect point features per category for batched rendering
    if (pointFeats.length > 0 && !isRef) {
      if (!categoryPointFeatures[cat]) {
        categoryPointFeatures[cat] = { features: [], meta };
      }
      categoryPointFeatures[cat].features.push(...pointFeats);
    }
  }

  // ── Pass 2: Reference polygon layers (rendered first = behind data) ──
  if (refPolygonFeatures.length > 0) {
    const refByCat = {};
    for (const { feature, meta, cat } of refPolygonFeatures) {
      if (!refByCat[cat]) refByCat[cat] = { features: [], meta };
      refByCat[cat].features.push(feature);
    }
    for (const [cat, group] of Object.entries(refByCat)) {
      const refLayer = L.geoJSON({ type: 'FeatureCollection', features: group.features }, {
        style: () => referencePolygonStyle(cat),
        onEachFeature: (f, layer) => {
          buildPopup(f, layer, group.meta, true);
        }
      });
      overlayGroup.addLayer(refLayer);
    }
  }

  // ── Pass 3: Reference point features (behind data points) ──────────
  if (refPointFeatures.length > 0) {
    const refPtByCat = {};
    for (const { feature, meta, cat } of refPointFeatures) {
      if (!refPtByCat[cat]) refPtByCat[cat] = { features: [], meta };
      refPtByCat[cat].features.push(feature);
    }
    for (const [cat, group] of Object.entries(refPtByCat)) {
      const pointLayer = L.geoJSON({ type: 'FeatureCollection', features: group.features }, {
        pointToLayer: (f, latlng) => {
          return L.circleMarker(latlng, referencePointStyle(cat));
        },
        onEachFeature: (f, layer) => {
          buildPopup(f, layer, group.meta, true);
        }
      });
      overlayGroup.addLayer(pointLayer);
    }
  }

  // ── Count total data polygons for performance decisions ─────────────
  let totalDataPolygons = 0;
  for (const feats of Object.values(groupPolygons)) totalDataPolygons += feats.length;
  const isLargeDataset = totalDataPolygons > LARGE_LAYER_THRESHOLD;

  // ── Pass 4: Fill layers (per symbology group) ───────────────────────
  // Canvas renderer for large datasets; dissolve only small groups.
  const MAP_DISSOLVE_LIMIT = 200;
  for (const [gk, features] of Object.entries(groupPolygons)) {
    const { cat, typeValue } = groupMeta[gk];
    const style = dissolvedFillStyle(cat, typeValue);
    const rendererOpt = isLargeDataset ? { renderer: canvasRenderer } : {};

    if (isLargeDataset || features.length > MAP_DISSOLVE_LIMIT) {
      // Large dataset or too many polygons — render raw with canvas, no dissolution
      const fillLayer = L.geoJSON({ type: 'FeatureCollection', features }, {
        style: () => style,
        interactive: true,
        renderer: canvasRenderer
      });
      fillLayer.on('click', (e) => {
        if (e.layer && e.layer.feature) {
          const f = e.layer.feature;
          const meta = findMetaForFeature(f, categoryPolygonMetas[cat]);
          if (meta) buildPopup(f, e.layer, meta);
          e.layer.openPopup(e.latlng);
        }
      });
      overlayGroup.addLayer(fillLayer);
    } else {
      const dissolved = dissolveFeatures(features);
      if (dissolved) {
        const dissolvedLayer = L.geoJSON(dissolved, {
          style: () => style,
          interactive: false,
          ...rendererOpt
        });
        overlayGroup.addLayer(dissolvedLayer);
      }
    }
  }

  // ── Pass 5: Feature outlines for popup interactivity ────────────────
  // Skip for large datasets — popups handled via fill-layer click above
  if (!isLargeDataset) {
    for (const [cat, layerGroups] of Object.entries(categoryPolygonMetas)) {
      for (const group of layerGroups) {
        const geojsonLayer = L.geoJSON({ type: 'FeatureCollection', features: group.features }, {
          style: (feature) => featureOutlineStyle(feature, cat),
          onEachFeature: (feature, layer) => {
            buildPopup(feature, layer, group.meta);
          }
        });
        overlayGroup.addLayer(geojsonLayer);
      }
    }
  }

  // ── Pass 6: Point features ──────────────────────────────────────────
  for (const [cat, group] of Object.entries(categoryPointFeatures)) {
    const rendererOpt = group.features.length > LARGE_LAYER_THRESHOLD ? { renderer: canvasRenderer } : {};
    const pointLayer = L.geoJSON({ type: 'FeatureCollection', features: group.features }, {
      pointToLayer: (f, latlng) => {
        return L.circleMarker(latlng, pointMarkerStyle(f, cat));
      },
      onEachFeature: (f, layer) => {
        buildPopup(f, layer, group.meta);
      },
      ...rendererOpt
    });
    overlayGroup.addLayer(pointLayer);
  }

  // ── Legend ─────────────────────────────────────────────────────────
  updateLegend(visibleLayers);

  // Fit bounds to visible features
  if (overlayGroup.getLayers().length > 0) {
    const bounds = overlayGroup.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
    }
  }
}

// ── Legend control ────────────────────────────────────────────────────

function updateLegend(visibleLayers) {
  if (legendControl) {
    legendControl.remove();
    legendControl = null;
  }
  if (!map || visibleLayers.length === 0) return;

  const entries = collectLegendEntries(visibleLayers);
  if (entries.length === 0) return;

  legendControl = L.control({ position: 'bottomright' });
  legendControl.onAdd = function () {
    const div = L.DomUtil.create('div', 'map-legend');
    let html = '<div class="map-legend-title">Legend</div>';
    for (const e of entries) {
      const label = e.label || CATEGORIES[e.key]?.label || e.key;
      html += `<div class="map-legend-row">
        <span class="map-legend-swatch" style="background:${e.fill};border-color:${e.stroke}"></span>
        <span class="map-legend-label">${label}</span>
      </div>`;
    }
    div.innerHTML = html;
    L.DomEvent.disableClickPropagation(div);
    return div;
  };
  legendControl.addTo(map);
}

/**
 * Finds the layer metadata object for a feature (used by large-dataset click handler).
 */
function findMetaForFeature(feature, layerGroups) {
  if (!layerGroups) return null;
  for (const group of layerGroups) {
    if (group.features.includes(feature)) return group.meta;
  }
  // Fallback: return first group's meta
  return layerGroups.length > 0 ? layerGroups[0].meta : null;
}

/**
 * Builds a popup for a feature.
 */
function buildPopup(feature, layer, meta, isReference = false) {
  const p = feature.properties;
  const colors = resolveColors(meta.category, p.type);
  const catLabel = CATEGORIES[meta.category]?.label || meta.category;
  const refBadge = isReference ? '<span style="display:inline-block;background:#f0ad4e;color:#fff;font-size:10px;font-weight:600;padding:1px 6px;border-radius:10px;margin-left:6px">REF</span>' : '';
  const colorDot = `<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${colors.fill};border:1px solid ${colors.stroke};margin-right:5px;vertical-align:middle"></span>`;
  const popup = `
    <div style="min-width:200px">
      <strong>${colorDot}${p.name || 'Unnamed'}</strong>${refBadge}<br>
      <small>${catLabel} | ${p.province || 'No province'}</small>
      <hr style="margin:6px 0;border:none;border-top:1px solid #eee">
      <table style="font-size:12px;width:100%">
        ${p.type ? `<tr><td><b>Type:</b></td><td>${p.type}</td></tr>` : ''}
        ${p.status ? `<tr><td><b>Status:</b></td><td>${p.status}</td></tr>` : ''}
        ${p.year ? `<tr><td><b>Year:</b></td><td>${p.year}</td></tr>` : ''}
        ${p.area_ha ? `<tr><td><b>Area:</b></td><td>${p.area_ha.toFixed(2)} ha</td></tr>` : ''}
        ${p.source ? `<tr><td><b>Source:</b></td><td>${p.source}</td></tr>` : ''}
      </table>
      ${p.notes ? `<p style="font-size:11px;margin-top:6px;color:#666">${p.notes}</p>` : ''}
    </div>
  `;
  layer.bindPopup(popup);
}

/**
 * Filters features by province, realm, and year.
 */
function filterFeatures(features, filters) {
  return features.filter(f => {
    const p = f.properties || {};

    if (filters.province && filters.province !== 'All') {
      if (p.province !== filters.province) return false;
    }

    if (filters.realm && filters.realm !== 'All') {
      if (p.realm !== filters.realm) return false;
    }

    if (filters.year && filters.year !== 'All') {
      if (String(p.year) !== String(filters.year)) return false;
    }

    return true;
  });
}

/**
 * Returns the map instance.
 */
export function getMap() {
  return map;
}

/**
 * Forces a map resize (e.g., after tab switch).
 */
export function resizeMap() {
  if (map) {
    setTimeout(() => map.invalidateSize(), 100);
  }
}
