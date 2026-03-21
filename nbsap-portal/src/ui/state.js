/**
 * Application state management.
 * Central store for layers, filters, and UI state.
 * Components import getAppState() to read and updateFilters() etc. to mutate.
 * Changes dispatch a 'nbsap:refresh' event for reactive updates.
 *
 * Supports lazy GeoJSON loading: layers can be added with geojson: null
 * and loaded on-demand via ensureGeoJSONForTargets().
 */
import { clearMetricsCache } from '../gis/areaCalc.js';
import { getLayer } from '../services/storage/index.js';

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

  /** Custom display names for expected layers: { [expectedLayerId]: string } */
  customLayerNames: {},

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
  _dashboardLayersCache = null;
  clearMetricsCache();
  dispatchRefresh();
}

/**
 * Adds a layer to the state.
 * @param {{ id: string, metadata: object, geojson: object }} layerRecord
 */
export function addLayer(layerRecord) {
  // Replace by exact ID if it already exists
  const existingIdx = appState.layers.findIndex(l => l.id === layerRecord.id);
  if (existingIdx >= 0) {
    appState.layers[existingIdx] = layerRecord;
  } else {
    // Also remove any older duplicate with the same filename + category
    const fname = layerRecord.metadata?.originalFilename;
    const cat = layerRecord.metadata?.category;
    if (fname && cat) {
      appState.layers = appState.layers.filter(l => {
        if (l.metadata?.originalFilename === fname && l.metadata?.category === cat) {
          console.warn(`Dedup on add: replacing "${l.metadata.name}" (${l.id}) with "${layerRecord.metadata.name}" (${layerRecord.id})`);
          return false;
        }
        return true;
      });
    }
    appState.layers.push(layerRecord);
  }
  _dashboardLayersCache = null;
  extractProvinces();
  clearMetricsCache();
  dispatchRefresh();
}

/**
 * Updates metadata for an existing layer in state.
 * Does NOT persist to storage — caller should also call saveLayerMetadata().
 * @param {string} layerId
 * @param {object} metadataUpdates - Partial metadata fields to merge
 */
export function updateLayerMeta(layerId, metadataUpdates) {
  const layer = appState.layers.find(l => l.id === layerId);
  if (!layer) return;
  Object.assign(layer.metadata, metadataUpdates);
  _dashboardLayersCache = null;
  clearMetricsCache();
  dispatchRefresh();
}

/**
 * Removes a layer from the state.
 * @param {string} layerId
 */
export function removeLayer(layerId) {
  appState.layers = appState.layers.filter(l => l.id !== layerId);

  // Clean stale tracker entries that reference this layer ID
  for (const [expectedId, entries] of Object.entries(appState.layerTracker)) {
    const filtered = entries.filter(e => e.layerId !== layerId);
    if (filtered.length === 0) {
      delete appState.layerTracker[expectedId];
    } else if (filtered.length !== entries.length) {
      appState.layerTracker[expectedId] = filtered;
    }
  }

  _trackedIdsCache = null;
  _dashboardLayersCache = null;
  extractProvinces();
  clearMetricsCache();
  dispatchRefresh();
}

/**
 * Sets all layers (e.g., on initial load from storage).
 * Deduplicates layers with the same originalFilename + category,
 * keeping only the most recently uploaded version.
 * @param {Array} layers
 * @returns {Array} IDs of duplicate layers that were removed (for Firestore cleanup)
 */
export function setLayers(layers) {
  const { unique, removedIds } = deduplicateLayers(layers);
  appState.layers = unique;
  _dashboardLayersCache = null;
  extractProvinces();
  clearMetricsCache();
  dispatchRefresh();
  return removedIds;
}

/**
 * Deduplicates layers: when multiple layers share the same
 * originalFilename + category, keep only the most recently uploaded.
 * Layers without originalFilename are never considered duplicates.
 * @param {Array} layers
 * @returns {Array} Deduplicated layers
 */
function deduplicateLayers(layers) {
  const grouped = {};
  const unique = [];
  const removedIds = [];

  for (const l of layers) {
    const fname = l.metadata?.originalFilename;
    const cat = l.metadata?.category;
    if (!fname) { unique.push(l); continue; }

    const key = `${fname}::${cat}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(l);
  }

  for (const dupes of Object.values(grouped)) {
    if (dupes.length === 1) {
      unique.push(dupes[0]);
    } else {
      // Keep the most recently uploaded
      dupes.sort((a, b) =>
        new Date(b.metadata.uploadTimestamp) - new Date(a.metadata.uploadTimestamp)
      );
      unique.push(dupes[0]);
      for (let i = 1; i < dupes.length; i++) {
        removedIds.push(dupes[i].id);
      }
      console.warn(
        `Dedup: kept latest "${dupes[0].metadata.originalFilename}" (${dupes[0].metadata.category}), ` +
        `removed ${dupes.length - 1} older duplicate(s)`
      );
    }
  }
  return { unique, removedIds };
}

/**
 * Finds an existing layer with the same originalFilename + category.
 * Returns the layer record or null.
 * @param {string} filename
 * @param {string} category
 * @returns {object|null}
 */
export function findDuplicateLayer(filename, category) {
  if (!filename) return null;
  return appState.layers.find(l =>
    l.metadata?.originalFilename === filename && l.metadata?.category === category
  ) || null;
}

/**
 * Finds all existing layers that match by filename OR by name+category.
 * Used to warn users before uploading duplicates.
 * @param {string} filename - Original filename being uploaded
 * @param {string} name - Layer name chosen by user
 * @param {string} category - Category chosen by user
 * @returns {Array} Matching layer records
 */
export function findPotentialDuplicates(filename, name, category) {
  const matches = [];
  const seen = new Set();
  for (const l of appState.layers) {
    const m = l.metadata;
    if (!m) continue;
    // Exact filename + category match
    if (filename && m.originalFilename === filename && m.category === category) {
      if (!seen.has(l.id)) { matches.push(l); seen.add(l.id); }
    }
    // Same name + category match
    if (name && m.name === name && m.category === category) {
      if (!seen.has(l.id)) { matches.push(l); seen.add(l.id); }
    }
  }
  return matches;
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
 * Sets custom layer names (loaded from storage on init).
 * @param {object} names - { [expectedLayerId]: string }
 */
export function setCustomLayerNames(names) {
  appState.customLayerNames = names || {};
}

/**
 * Sets a custom display name for an expected layer.
 * Does NOT persist to storage — caller should also call setSetting().
 * @param {string} expectedLayerId
 * @param {string} name
 */
export function setCustomLayerName(expectedLayerId, name) {
  appState.customLayerNames[expectedLayerId] = name;
}

/**
 * Returns the display name for an expected layer, using custom name if set.
 * @param {{ id: string, name: string }} expectedLayer
 * @returns {string}
 */
export function getExpectedLayerName(expectedLayer) {
  return appState.customLayerNames[expectedLayer.id] || expectedLayer.name;
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
    _invalidateTrackerCache();
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
  _invalidateTrackerCache();
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
  _invalidateTrackerCache();
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
  _invalidateTrackerCache();
  dispatchRefresh();
}

/**
 * Removes tracker entries whose layerId doesn't exist in the current layers.
 * Returns true if any entries were removed (caller should persist).
 */
export function cleanStaleTrackerEntries() {
  const validIds = new Set(appState.layers.map(l => l.id));
  let changed = false;
  for (const [expectedId, entries] of Object.entries(appState.layerTracker)) {
    const filtered = entries.filter(e => validIds.has(e.layerId));
    if (filtered.length !== entries.length) {
      changed = true;
      if (filtered.length === 0) {
        delete appState.layerTracker[expectedId];
      } else {
        appState.layerTracker[expectedId] = filtered;
      }
    }
  }
  if (changed) {
    _invalidateTrackerCache();
  }
  return changed;
}

/**
 * Returns all tracked layer IDs from the tracker (all expected layers).
 * Cached — invalidated when layerTracker changes.
 */
let _trackedIdsCache = null;

function getTrackedLayerIds() {
  if (_trackedIdsCache) return _trackedIdsCache;
  const ids = new Set();
  for (const entries of Object.values(appState.layerTracker)) {
    for (const entry of entries) {
      ids.add(entry.layerId);
    }
  }
  _trackedIdsCache = ids;
  return ids;
}

function _invalidateTrackerCache() {
  _trackedIdsCache = null;
  _dashboardLayersCache = null;
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
 *
 * Cached per render cycle — invalidated on layer/tracker mutations.
 */
let _dashboardLayersCache = null;

export function getDashboardLayers() {
  if (_dashboardLayersCache) return _dashboardLayersCache;

  let result;
  if (hasUserLayers()) {
    result = getUserLayers();
  } else {
    const realLayers = appState.layers.filter(l => !isDemoLayer(l));
    result = realLayers.length > 0 ? realLayers : appState.layers;
  }
  _dashboardLayersCache = result;
  return result;
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

/** Official Vanuatu provinces — only these appear in filters and breakdowns */
const VALID_PROVINCES = new Set(['Torba', 'Sanma', 'Penama', 'Malampa', 'Shefa', 'Tafea']);

/**
 * Extracts unique province names from all loaded layers.
 * Filters to only official Vanuatu provinces.
 *
 * Optimised: maintains a running Set of discovered provinces.
 * On addLayer, only scans the new layer; on removeLayer, only
 * rescans if the removed layer might have been the sole source
 * of a province.  For very large datasets this avoids iterating
 * tens of thousands of features on every state change.
 */
let _provincesDirty = true;
const _knownProvinces = new Set();

function extractProvinces() {
  _provincesDirty = true;
  _recomputeProvinces();
}

function _recomputeProvinces() {
  if (!_provincesDirty) return;
  _provincesDirty = false;
  _knownProvinces.clear();
  // Start with provinces from boundary GeoJSON
  for (const p of (appState.provinces || [])) {
    if (VALID_PROVINCES.has(p)) _knownProvinces.add(p);
  }
  // Early exit if all 6 provinces already found
  if (_knownProvinces.size >= VALID_PROVINCES.size) {
    appState.provinces = [..._knownProvinces].sort();
    return;
  }
  // Scan layers — sample up to 500 features per layer to find provinces.
  // For large datasets (10K+), provinces are typically discovered in the
  // first few hundred features; scanning all 50K is unnecessary.
  const PROVINCE_SAMPLE = 500;
  for (const layer of appState.layers) {
    if (!layer.geojson) continue;
    const feats = layer.geojson.features || [];
    const limit = Math.min(feats.length, PROVINCE_SAMPLE);
    for (let i = 0; i < limit; i++) {
      const prov = feats[i].properties?.province;
      if (prov && VALID_PROVINCES.has(prov)) {
        _knownProvinces.add(prov);
        if (_knownProvinces.size >= VALID_PROVINCES.size) break;
      }
    }
    if (_knownProvinces.size >= VALID_PROVINCES.size) break;
  }
  appState.provinces = [..._knownProvinces].sort();
}

// ─── Lazy GeoJSON loading ────────────────────────────────────

/** Set of layer IDs currently being loaded */
const _loadingIds = new Set();

/**
 * Categories that auto-include for T1 (spatial planning) regardless of target tag.
 * ADMIN_BOUNDARY, EEZ, and SPATIAL_PLAN layers are the T1 spatial planning layers.
 */
const T1_AUTO_CATEGORIES = new Set(['ADMIN_BOUNDARY', 'EEZ', 'SPATIAL_PLAN']);

/**
 * Ensures GeoJSON is loaded for all layers matching the given targets.
 * Loads from Firestore on demand for layers that have geojson: null.
 * Returns true if any new data was loaded (caller should refresh).
 *
 * @param {string[]} targets - Target codes to load data for (e.g. ['T3'])
 * @returns {Promise<boolean>} Whether any new GeoJSON was loaded
 */
export async function ensureGeoJSONForTargets(targets) {
  if (!targets || targets.length === 0) return false;

  // When T1 is selected, also load layers from T1 auto-include categories
  // (CCA, KBA, SPATIAL_PLAN) even if they're only tagged with other targets.
  const includeT1Auto = targets.includes('T1');

  const needsLoad = appState.layers.filter(l => {
    if (l.geojson !== null) return false; // already loaded
    if (_loadingIds.has(l.id)) return false; // already in progress
    const meta = l.metadata;
    if (!meta) return false;
    if (meta.targets && meta.targets.some(t => targets.includes(t))) return true;
    if (includeT1Auto && T1_AUTO_CATEGORIES.has(meta.category)) return true;
    return false;
  });

  if (needsLoad.length === 0) return false;

  // Mark as loading to prevent duplicate requests
  for (const l of needsLoad) _loadingIds.add(l.id);

  const results = await Promise.allSettled(
    needsLoad.map(async (layer) => {
      try {
        const full = await getLayer(layer.id);
        if (full && full.geojson) {
          // Update in-place to avoid triggering full state reset
          const idx = appState.layers.findIndex(l => l.id === layer.id);
          if (idx >= 0) {
            appState.layers[idx] = { ...appState.layers[idx], geojson: full.geojson };
          }
          return true;
        }
        return false;
      } finally {
        _loadingIds.delete(layer.id);
      }
    })
  );

  const loaded = results.some(r => r.status === 'fulfilled' && r.value === true);
  if (loaded) {
    _provincesDirty = true;
    _recomputeProvinces();
    clearMetricsCache();
  }
  return loaded;
}

/**
 * Returns true if any layers matching the given targets still need GeoJSON loaded.
 */
export function hasUnloadedTargets(targets) {
  if (!targets || targets.length === 0) return false;
  const includeT1Auto = targets.includes('T1');
  return appState.layers.some(l => {
    if (l.geojson !== null) return false;
    const meta = l.metadata;
    if (!meta) return false;
    if (meta.targets && meta.targets.some(t => targets.includes(t))) return true;
    if (includeT1Auto && T1_AUTO_CATEGORIES.has(meta.category)) return true;
    return false;
  });
}

/**
 * Dispatches the global refresh event.
 */
function dispatchRefresh() {
  window.dispatchEvent(new CustomEvent('nbsap:refresh'));
}
