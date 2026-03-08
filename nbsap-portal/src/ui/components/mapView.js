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
  pointMarkerStyle
} from '../../config/symbology.js';
import { getAppState, getDashboardLayers } from '../state.js';
import { dissolveFeatures } from '../../gis/areaCalc.js';
import {
  getLayerStyle,
  hasLayerStyle,
  applyStyleOverride,
  applyPointStyleOverride
} from '../../config/symbolizer.js';
import { openSymbolizer, closeSymbolizer, getOpenSymbolizerLayerId } from './layerSymbolizer.js';
import { isAdmin } from '../../services/auth/index.js';

let map = null;
let baseLayers = {};
let referenceGroup = null;  // Reference layers — rendered behind everything
let overlayGroup = null;
let provincesLayer = null;
let legendControl = null;

/** Tracks which layer IDs the user has hidden via the layer toggle panel */
const hiddenLayers = new Set();

/**
 * Categories that are always displayed on the T1 map regardless of the
 * target tag stored in layer metadata (mirrors T1_AUTO_CATEGORIES in state.js).
 */
const T1_DISPLAY_CATEGORIES = new Set(['ADMIN_BOUNDARY', 'EEZ', 'SPATIAL_PLAN']);

/**
 * Categories that must never appear on the T1 map, even if tagged T1 in Firestore.
 * These belong to other targets (e.g. CCA → T3).
 */
const T1_EXCLUDED_CATEGORIES = new Set(['CCA', 'LMMA']);

/** User-defined layer display order (bottom→top). IDs not in list render in default order. */
let layerOrder = [];

/** Flag to suppress fitBounds during toggle-only rerenders */
let _suppressFitBounds = false;

/**
 * Returns layers sorted by user-defined layerOrder (bottom→top).
 * Layers not in layerOrder keep their original relative position at the end.
 */
function sortByLayerOrder(layers) {
  // Sync layerOrder: add any new IDs, remove stale ones
  const currentIds = new Set(layers.map(l => l.id));
  // Remove stale
  layerOrder = layerOrder.filter(id => currentIds.has(id));
  // Add new IDs not yet in order
  for (const l of layers) {
    if (!layerOrder.includes(l.id)) layerOrder.push(l.id);
  }
  // Sort by position in layerOrder
  const indexMap = new Map(layerOrder.map((id, i) => [id, i]));
  return [...layers].sort((a, b) => (indexMap.get(a.id) ?? 999) - (indexMap.get(b.id) ?? 999));
}

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

  // Reference layers sit behind everything (including province outlines)
  referenceGroup = L.featureGroup();
  referenceGroup.addTo(map);

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

  if (referenceGroup) referenceGroup.clearLayers();
  overlayGroup.clearLayers();
  if (provincesLayer) {
    provincesLayer.remove();
    provincesLayer = null;
  }

  const state = getAppState();
  const filters = state.filters;
  const rawLayers = getDashboardLayers();
  // Sort by user-defined z-order (bottom→top) so later layers render on top
  const layers = sortByLayerOrder(rawLayers);

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
  const groupLayerIds = {};            // groupKey → layerId (first layer for this group)
  const categoryPolygonMetas = {};     // cat → { features, meta }[] for popup outlines
  const categoryPointFeatures = {};    // cat → { features, meta }
  const refPolygonFeatures = [];
  const refPointFeatures = [];
  const visibleLayers = [];            // for legend

  // Collect all matching layers (for the toggle panel) + filtered visible ones
  const matchingLayers = [];  // All layers that pass target/category filters (for toggle UI)

  for (const layerData of layers) {
    const meta = layerData.metadata;
    if (!layerData.geojson) continue;

    // Apply target filter
    if (filters.targets.length > 0) {
      const isT1Selected = filters.targets.includes('T1');
      const isT1Auto = isT1Selected && T1_DISPLAY_CATEGORIES.has(meta.category);
      const isT1TagMatch = isT1Selected && meta.targets.includes('T1') && !T1_EXCLUDED_CATEGORIES.has(meta.category);
      const isOtherMatch = meta.targets.some(t => filters.targets.includes(t) && t !== 'T1');
      if (!isT1Auto && !isT1TagMatch && !isOtherMatch) continue;
    }

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      if (meta.category !== filters.category) continue;
    }

    const cat = meta.category || 'OTHER';
    const features = filterFeatures(layerData.geojson.features || [], filters);
    const isRef = meta.isReference === true;

    if (features.length === 0) continue;

    // Track all matching non-reference layers for the toggle panel
    if (!isRef) matchingLayers.push(layerData);

    // Skip hidden layers from rendering (but still show in toggle panel)
    if (hiddenLayers.has(layerData.id)) continue;

    // Reference layers are excluded from legend (visibleLayers)
    if (!isRef) visibleLayers.push(layerData);

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
          if (!groupLayerIds[gk]) groupLayerIds[gk] = layerData.id;
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

  // ── Pass 2: Reference polygon layers (behind everything incl. provinces) ──
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
      referenceGroup.addLayer(refLayer);
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
      referenceGroup.addLayer(pointLayer);
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
    const layerId  = groupLayerIds[gk];
    const override = getLayerStyle(layerId);
    const rendererOpt = isLargeDataset ? { renderer: canvasRenderer } : {};

    // Style resolver — applies user override on top of default symbology
    const styleFn = (feature) => {
      const base = dissolvedFillStyle(cat, typeValue);
      const fTypeValue = override?.categoryBy === 'status'
        ? feature?.properties?.status
        : (feature?.properties?.type || typeValue);
      return applyStyleOverride(base, override, fTypeValue);
    };

    if (isLargeDataset || features.length > MAP_DISSOLVE_LIMIT) {
      // Large dataset or too many polygons — render raw with canvas, no dissolution
      const fillLayer = L.geoJSON({ type: 'FeatureCollection', features }, {
        style: styleFn,
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
          style: (feature) => styleFn(feature),
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
        const layerOverride = getLayerStyle(group.meta.id);
        const geojsonLayer = L.geoJSON({ type: 'FeatureCollection', features: group.features }, {
          style: (feature) => {
            const base = featureOutlineStyle(feature, cat);
            const fTypeValue = layerOverride?.categoryBy === 'status'
              ? feature.properties?.status
              : feature.properties?.type;
            return applyStyleOverride(base, layerOverride, fTypeValue);
          },
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
    const rendererOpt    = group.features.length > LARGE_LAYER_THRESHOLD ? { renderer: canvasRenderer } : {};
    const pointOverride  = getLayerStyle(group.meta.id);
    const pointLayer = L.geoJSON({ type: 'FeatureCollection', features: group.features }, {
      pointToLayer: (f, latlng) => {
        const base = pointMarkerStyle(f, cat);
        const fTypeValue = pointOverride?.categoryBy === 'status'
          ? f.properties?.status
          : f.properties?.type;
        return L.circleMarker(latlng, applyPointStyleOverride(base, pointOverride, fTypeValue));
      },
      onEachFeature: (f, layer) => {
        buildPopup(f, layer, group.meta);
      },
      ...rendererOpt
    });
    overlayGroup.addLayer(pointLayer);
  }

  // ── Layer toggle panel (replaces static legend) ───────────────────
  updateLayerPanel(matchingLayers, visibleLayers);

  // Fit bounds to visible features (skip during toggle-only rerenders)
  if (!_suppressFitBounds && overlayGroup.getLayers().length > 0) {
    const bounds = overlayGroup.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
    }
  }
  _suppressFitBounds = false;
}

// ── Layer toggle panel ────────────────────────────────────────────────

/**
 * Builds an interactive layer panel with checkboxes per dataset
 * and up/down arrows for z-order reordering.
 * @param {Array} matchingLayers - All layers matching filters (for toggle UI)
 * @param {Array} visibleLayers - Layers actually rendered (not hidden)
 */
function updateLayerPanel(matchingLayers, visibleLayers) {
  if (legendControl) {
    legendControl.remove();
    legendControl = null;
  }
  if (!map || matchingLayers.length === 0) return;

  // Sort matchingLayers by layerOrder so panel reflects render order
  const orderedMatching = sortByLayerOrder(matchingLayers);

  legendControl = L.control({ position: 'bottomright' });
  legendControl.onAdd = function () {
    const div = L.DomUtil.create('div', 'map-legend');
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    const admin = isAdmin();
    let html = `<div class="map-legend-title">Layers${admin ? ' <span class="map-legend-hint">(drag or use arrows to reorder)</span>' : ''}</div>`;

    for (let i = 0; i < orderedMatching.length; i++) {
      const ld = orderedMatching[i];
      const meta = ld.metadata;
      const cat = meta.category || 'OTHER';
      const colors = resolveColors(cat);
      const datasetName = meta.name || 'Unnamed Layer';
      const checked = !hiddenLayers.has(ld.id);
      const isFirst = i === 0;
      const isLast = i === orderedMatching.length - 1;

      // Show override color on swatch if a single-mode override exists
      const override = getLayerStyle(ld.id);
      const swatchFill   = (override?.mode === 'single' && override.fillColor)   ? override.fillColor   : colors.fill;
      const swatchStroke = (override?.mode === 'single' && override.strokeColor) ? override.strokeColor : colors.stroke;
      const styleActive  = getOpenSymbolizerLayerId() === ld.id;
      const hasOverride  = hasLayerStyle(ld.id);

      html += `<div class="map-legend-row map-layer-toggle ${checked ? '' : 'layer-hidden'}" data-layer-id="${ld.id}" ${admin ? 'draggable="true"' : ''} title="${datasetName}">
        ${admin ? `<div class="layer-order-controls">
          <button class="layer-order-btn layer-move-up" data-layer-id="${ld.id}" ${isLast ? 'disabled' : ''} title="Bring forward">&#9650;</button>
          <button class="layer-order-btn layer-move-down" data-layer-id="${ld.id}" ${isFirst ? 'disabled' : ''} title="Send backward">&#9660;</button>
        </div>` : ''}
        <label class="map-layer-label-wrap">
          <input type="checkbox" class="map-layer-cb" data-layer-id="${ld.id}" ${checked ? 'checked' : ''}>
          <span class="map-legend-swatch" style="background:${swatchFill};border-color:${swatchStroke}"></span>
          <span class="map-legend-label">${datasetName}</span>
        </label>
        ${admin ? `<button class="layer-style-btn ${hasOverride ? 'has-override' : ''} ${styleActive ? 'is-open' : ''}" data-layer-id="${ld.id}" title="Symbolize layer" draggable="false">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5l-4 .5.5-4Z"/>
          </svg>
        </button>` : ''}
      </div>`;
    }

    div.innerHTML = html;

    // Bind toggle events
    div.querySelectorAll('.map-layer-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const layerId = cb.dataset.layerId;
        if (cb.checked) {
          hiddenLayers.delete(layerId);
        } else {
          hiddenLayers.add(layerId);
        }
        _suppressFitBounds = true;
        updateMapLayers();
      });
    });

    if (admin) {
      // Bind reorder button events
      div.querySelectorAll('.layer-move-up').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          moveLayer(btn.dataset.layerId, 'up');
        });
      });
      div.querySelectorAll('.layer-move-down').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          moveLayer(btn.dataset.layerId, 'down');
        });
      });

      // Drag-and-drop reordering
      let dragSrcId = null;
      const rows = div.querySelectorAll('.map-layer-toggle[draggable]');
      rows.forEach(row => {
        row.addEventListener('dragstart', (e) => {
          dragSrcId = row.dataset.layerId;
          row.classList.add('layer-dragging');
          e.dataTransfer.effectAllowed = 'move';
        });
        row.addEventListener('dragend', () => {
          row.classList.remove('layer-dragging');
          div.querySelectorAll('.layer-dragover').forEach(el => el.classList.remove('layer-dragover'));
          dragSrcId = null;
        });
        row.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          row.classList.add('layer-dragover');
        });
        row.addEventListener('dragleave', () => {
          row.classList.remove('layer-dragover');
        });
        row.addEventListener('drop', (e) => {
          e.preventDefault();
          row.classList.remove('layer-dragover');
          const targetId = row.dataset.layerId;
          if (dragSrcId && dragSrcId !== targetId) {
            reorderLayer(dragSrcId, targetId);
          }
        });
      });

      // Bind style (symbolizer) button events
      div.querySelectorAll('.layer-style-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const layerId  = btn.dataset.layerId;
          const layerData = orderedMatching.find(l => l.id === layerId);
          if (!layerData) return;
          openSymbolizer(layerData, () => {
            _suppressFitBounds = true;
            updateMapLayers();
          });
        });
      });
    }

    return div;
  };
  legendControl.addTo(map);
}

/**
 * Moves a layer up (higher z-index / on top) or down (lower z-index / behind).
 * In layerOrder array, higher index = rendered later = on top.
 */
function moveLayer(layerId, direction) {
  const idx = layerOrder.indexOf(layerId);
  if (idx === -1) return;

  if (direction === 'up' && idx < layerOrder.length - 1) {
    // Swap with next (move toward top)
    [layerOrder[idx], layerOrder[idx + 1]] = [layerOrder[idx + 1], layerOrder[idx]];
  } else if (direction === 'down' && idx > 0) {
    // Swap with previous (move toward bottom)
    [layerOrder[idx], layerOrder[idx - 1]] = [layerOrder[idx - 1], layerOrder[idx]];
  } else {
    return; // Already at boundary
  }
  _suppressFitBounds = true;
  updateMapLayers();
}

/**
 * Reorders a layer by drag-and-drop: moves srcId to the position of targetId.
 */
function reorderLayer(srcId, targetId) {
  const srcIdx = layerOrder.indexOf(srcId);
  const targetIdx = layerOrder.indexOf(targetId);
  if (srcIdx === -1 || targetIdx === -1) return;

  // Remove src and insert at target position
  layerOrder.splice(srcIdx, 1);
  const insertIdx = layerOrder.indexOf(targetId);
  layerOrder.splice(insertIdx, 0, srcId);

  _suppressFitBounds = true;
  updateMapLayers();
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
 * Returns a copy of the current user-defined layer order (bottom→top).
 */
export function getLayerOrder() {
  return [...layerOrder];
}

/**
 * Forces a map resize (e.g., after tab switch).
 */
export function resizeMap() {
  if (map) {
    setTimeout(() => map.invalidateSize(), 100);
  }
}
