/**
 * Application state management.
 * Central store for layers, filters, and UI state.
 * Components import getAppState() to read and updateFilters() etc. to mutate.
 * Changes dispatch a 'nbsap:refresh' event for reactive updates.
 */
import { clearMetricsCache } from '../gis/areaCalc.js';

const appState = {
  /** Currently loaded layers: Array<{ id, metadata, geojson }> */
  layers: [],

  /** Provinces GeoJSON boundary data */
  provincesGeojson: null,

  /** List of province names (for filter dropdown) */
  provinces: [],

  /** Active filters — default to T3 (30x30) so not all datasets are processed on load */
  filters: {
    targets: ['T3'],
    province: 'All',
    category: 'All',
    realm: 'All',
    year: 'All'
  },

  /** Auth state */
  isAdmin: false,

  /**
   * Layer tracker: maps expected layer IDs to arrays of uploaded layer info.
   * { [expectedLayerId]: [{ layerId, uploadedAt }, ...] }
   *
   * Supports multiple shapefile uploads per target/expected layer.
   * Backward compatible: migrates old single-object format on load.
   */
  layerTracker: {}
};

/**
 * Returns the current app state (read-only reference).
 */
export function getAppState() {
  return appState;
}

/**
 * Updates filter values and dispatches a refresh event.
 * @param {object} filterUpdates - Partial filter object
 */
export function updateFilters(filterUpdates) {
  Object.assign(appState.filters, filterUpdates);
  clearMetricsCache();
  dispatchRefresh();
}

/**
 * Adds a layer to the state.
 * @param {{ id: string, metadata: object, geojson: object }} layerRecord
 */
export function addLayer(layerRecord) {
  const existing = appState.layers.findIndex(l => l.id === layerRecord.id);
  if (existing >= 0) {
    appState.layers[existing] = layerRecord;
  } else {
    appState.layers.push(layerRecord);
  }
  extractProvinces();
  clearMetricsCache();
  dispatchRefresh();
}

/**
 * Removes a layer from the state.
 * @param {string} layerId
 */
export function removeLayer(layerId) {
  appState.layers = appState.layers.filter(l => l.id !== layerId);
  extractProvinces();
  clearMetricsCache();
  dispatchRefresh();
}

/**
 * Sets all layers (e.g., on initial load from storage).
 * @param {Array} layers
 */
export function setLayers(layers) {
  appState.layers = layers;
  extractProvinces();
  clearMetricsCache();
}

/**
 * Sets the provinces GeoJSON and extracts province names.
 * @param {object} geojson
 */
export function setProvincesGeojson(geojson) {
  appState.provincesGeojson = geojson;
  if (geojson && geojson.features) {
    const names = geojson.features
      .map(f => f.properties.name || f.properties.province || f.properties.NAME || '')
      .filter(Boolean)
      .sort();
    appState.provinces = [...new Set(names)];
  }
}

/**
 * Sets admin state.
 */
export function setAdminState(isAdmin) {
  appState.isAdmin = isAdmin;
  dispatchRefresh();
}

/**
 * Sets the layer tracker state (loaded from storage on init).
 * Migrates old single-object format to array format.
 * @param {object} tracker - { [expectedLayerId]: { layerId, uploadedAt } | Array }
 */
export function setLayerTracker(tracker) {
  if (!tracker) {
    appState.layerTracker = {};
    return;
  }

  // Migrate old format: { expectedId: { layerId, uploadedAt } } → { expectedId: [{ layerId, uploadedAt }] }
  const migrated = {};
  for (const [key, val] of Object.entries(tracker)) {
    if (Array.isArray(val)) {
      migrated[key] = val;
    } else if (val && val.layerId) {
      migrated[key] = [val];
    }
  }
  appState.layerTracker = migrated;
}

/**
 * Links an expected layer to an uploaded layer.
 * Appends to the array — supports multiple shapefiles per expected layer.
 * @param {string} expectedLayerId
 * @param {string} layerId - The uploaded layer's ID
 */
export function trackLayer(expectedLayerId, layerId) {
  if (!appState.layerTracker[expectedLayerId]) {
    appState.layerTracker[expectedLayerId] = [];
  }

  // Don't add duplicate
  const existing = appState.layerTracker[expectedLayerId].find(e => e.layerId === layerId);
  if (!existing) {
    appState.layerTracker[expectedLayerId].push({
      layerId,
      uploadedAt: new Date().toISOString()
    });
  }
  dispatchRefresh();
}

/**
 * Unlinks a specific uploaded layer from an expected layer.
 * If layerId is null, removes all uploads for that expected layer.
 * @param {string} expectedLayerId
 * @param {string|null} layerId - specific layer to remove, or null for all
 */
export function untrackLayer(expectedLayerId, layerId = null) {
  if (!appState.layerTracker[expectedLayerId]) return;

  if (layerId === null) {
    delete appState.layerTracker[expectedLayerId];
  } else {
    appState.layerTracker[expectedLayerId] = appState.layerTracker[expectedLayerId]
      .filter(e => e.layerId !== layerId);
    if (appState.layerTracker[expectedLayerId].length === 0) {
      delete appState.layerTracker[expectedLayerId];
    }
  }
  dispatchRefresh();
}

/**
 * Returns all tracked layer IDs from the tracker (all expected layers).
 */
function getTrackedLayerIds() {
  const ids = new Set();
  for (const entries of Object.values(appState.layerTracker)) {
    for (const entry of entries) {
      ids.add(entry.layerId);
    }
  }
  return ids;
}

/**
 * Returns only user-uploaded layers (those linked in the tracker).
 */
export function getUserLayers() {
  const trackedIds = getTrackedLayerIds();
  return appState.layers.filter(l => trackedIds.has(l.id));
}

/**
 * Returns true if any layers have been uploaded by the user via the tracker.
 */
export function hasUserLayers() {
  return getTrackedLayerIds().size > 0;
}

/**
 * Returns layers for the dashboard display.
 * When any tracked layers exist, returns only those (user-uploaded data).
 * Otherwise, if any non-demo layers exist, returns only non-demo layers.
 * Falls back to all layers (including demo) only when no real data exists.
 */
export function getDashboardLayers() {
  // If the user has explicitly tracked layers, show only those
  if (hasUserLayers()) {
    return getUserLayers();
  }

  // Otherwise, exclude demo/system layers if any real layers exist
  const realLayers = appState.layers.filter(l => !isDemoLayer(l));
  if (realLayers.length > 0) return realLayers;

  // No real data at all — show demo data
  return appState.layers;
}

/**
 * Detects whether a layer is demo/sample data (not user-uploaded).
 */
function isDemoLayer(layer) {
  const m = layer.metadata;
  if (!m) return false;
  if (m._isDemo) return true;
  if (m.uploadedBy === 'system') return true;
  return (m.name || '').toLowerCase().startsWith('demo ');
}

/**
 * Extracts unique province names from all loaded layers.
 */
function extractProvinces() {
  const provinces = new Set(appState.provinces);
  for (const layer of appState.layers) {
    for (const f of (layer.geojson?.features || [])) {
      if (f.properties?.province) provinces.add(f.properties.province);
    }
  }
  appState.provinces = [...provinces].sort();
}

/**
 * Dispatches the global refresh event.
 */
function dispatchRefresh() {
  window.dispatchEvent(new CustomEvent('nbsap:refresh'));
}
