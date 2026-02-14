/**
 * Application state management.
 * Central store for layers, filters, and UI state.
 * Components import getAppState() to read and updateFilters() etc. to mutate.
 * Changes dispatch a 'nbsap:refresh' event for reactive updates.
 */

const appState = {
  /** Currently loaded layers: Array<{ id, metadata, geojson }> */
  layers: [],

  /** Provinces GeoJSON boundary data */
  provincesGeojson: null,

  /** List of province names (for filter dropdown) */
  provinces: [],

  /** Active filters */
  filters: {
    targets: [],
    province: 'All',
    category: 'All',
    realm: 'All',
    year: 'All'
  },

  /** Auth state */
  isAdmin: false,

  /**
   * Layer tracker: maps expected layer IDs to uploaded layer info.
   * { [expectedLayerId]: { layerId, uploadedAt } }
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
  dispatchRefresh();
}

/**
 * Removes a layer from the state.
 * @param {string} layerId
 */
export function removeLayer(layerId) {
  appState.layers = appState.layers.filter(l => l.id !== layerId);
  extractProvinces();
  dispatchRefresh();
}

/**
 * Sets all layers (e.g., on initial load from storage).
 * @param {Array} layers
 */
export function setLayers(layers) {
  appState.layers = layers;
  extractProvinces();
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
 * @param {object} tracker - { [expectedLayerId]: { layerId, uploadedAt } }
 */
export function setLayerTracker(tracker) {
  appState.layerTracker = tracker || {};
}

/**
 * Links an expected layer to an uploaded layer.
 * @param {string} expectedLayerId
 * @param {string} layerId - The uploaded layer's ID
 */
export function trackLayer(expectedLayerId, layerId) {
  appState.layerTracker[expectedLayerId] = {
    layerId,
    uploadedAt: new Date().toISOString()
  };
  dispatchRefresh();
}

/**
 * Unlinks an expected layer from its uploaded layer.
 * @param {string} expectedLayerId
 */
export function untrackLayer(expectedLayerId) {
  delete appState.layerTracker[expectedLayerId];
  dispatchRefresh();
}

/**
 * Returns only user-uploaded layers (excludes demo/system layers).
 * A layer is considered user-uploaded if it is linked in the tracker.
 */
export function getUserLayers() {
  const trackedLayerIds = new Set(
    Object.values(appState.layerTracker).map(t => t.layerId)
  );
  return appState.layers.filter(l => trackedLayerIds.has(l.id));
}

/**
 * Returns true if any layers have been uploaded by the user via the tracker.
 */
export function hasUserLayers() {
  return Object.keys(appState.layerTracker).length > 0;
}

/**
 * Returns layers for the dashboard display.
 * When any tracked layers exist, returns only those (user-uploaded data).
 * Otherwise falls back to all layers (demo data).
 */
export function getDashboardLayers() {
  if (hasUserLayers()) {
    return getUserLayers();
  }
  return appState.layers;
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
