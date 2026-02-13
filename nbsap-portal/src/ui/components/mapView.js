/**
 * Leaflet Map component.
 * Renders the interactive map with basemap selector, layer controls,
 * and popups showing standardized attributes.
 */
import L from 'leaflet';
import ENV from '../../config/env.js';
import { CATEGORIES } from '../../config/categories.js';
import { getAppState } from '../state.js';

let map = null;
let baseLayers = {};
let overlayGroup = L.layerGroup();
let provincesLayer = null;

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

  // Layer control
  overlayGroup.addTo(map);

  L.control.layers(baseLayers, {}, { position: 'topright' }).addTo(map);

  // Scale bar
  L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

  return map;
}

/**
 * Updates map layers based on current app state and filters.
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
  const layers = state.layers || [];

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

  // Render data layers
  for (const layerData of layers) {
    const meta = layerData.metadata;

    // Apply target filter
    if (filters.targets.length > 0) {
      if (!meta.targets.some(t => filters.targets.includes(t))) continue;
    }

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      if (meta.category !== filters.category) continue;
    }

    const catConfig = CATEGORIES[meta.category] || CATEGORIES.OTHER;
    const features = filterFeatures(layerData.geojson?.features || [], filters);

    if (features.length === 0) continue;

    const geojsonLayer = L.geoJSON({ type: 'FeatureCollection', features }, {
      style: () => ({
        color: catConfig.color,
        weight: 2,
        fillOpacity: 0.25,
        fillColor: catConfig.color
      }),
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: catConfig.color,
          color: '#fff',
          weight: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        const popup = `
          <div style="min-width:200px">
            <strong>${p.name || 'Unnamed'}</strong><br>
            <small>${meta.category} | ${p.realm || ''} | ${p.province || 'No province'}</small>
            <hr style="margin:6px 0;border:none;border-top:1px solid #eee">
            <table style="font-size:12px;width:100%">
              <tr><td><b>Type:</b></td><td>${p.type || '-'}</td></tr>
              <tr><td><b>Status:</b></td><td>${p.status || '-'}</td></tr>
              <tr><td><b>Year:</b></td><td>${p.year || '-'}</td></tr>
              <tr><td><b>Area:</b></td><td>${p.area_ha ? p.area_ha.toFixed(2) + ' ha' : '-'}</td></tr>
              <tr><td><b>Source:</b></td><td>${p.source || '-'}</td></tr>
              <tr><td><b>Targets:</b></td><td>${(p.targets || []).join(', ')}</td></tr>
            </table>
            ${p.notes ? `<p style="font-size:11px;margin-top:6px;color:#666">${p.notes}</p>` : ''}
          </div>
        `;
        layer.bindPopup(popup);
      }
    });

    overlayGroup.addLayer(geojsonLayer);
  }

  // Fit bounds to visible features
  const bounds = overlayGroup.getBounds();
  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
  }
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
