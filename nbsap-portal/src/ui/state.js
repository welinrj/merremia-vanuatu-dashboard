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
  isAdmin: false
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
