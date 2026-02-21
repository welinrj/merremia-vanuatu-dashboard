/**
 * Geodesic area calculation module with polygon dissolution.
 * Uses turf.area() for accurate geodesic area on WGS84 coordinates.
 * Uses turf.union() to dissolve overlapping polygons for net coverage area.
 *
 * Dissolution follows UNEP-WCMC / GBF methodology: overlapping protected
 * areas are dissolved (unioned) to prevent double-counting, ensuring each
 * point on Earth's surface is counted only once toward coverage targets.
 *
 * Performance: metrics are cached and only recomputed when layer data changes.
 * Dissolution uses chunked tree-merge for large feature sets to avoid
 * browser crashes on datasets with thousands of polygons.
 */
import * as turf from '@turf/turf';
import ENV from '../config/env.js';

/** Official Vanuatu provinces — exclude "Unassigned" and foreign names from breakdowns */
const VALID_PROVINCES = new Set(['Torba', 'Sanma', 'Penama', 'Malampa', 'Shefa', 'Tafea']);

// ─── Metrics cache ──────────────────────────────────────────
// Keyed by (function + targetCode + filters hash). Invalidated when layers change.
let _cacheGen = 0;
const _metricsCache = new Map();

/**
 * Clears the metrics cache. Call when layers are added/removed/modified.
 */
export function clearMetricsCache() {
  _cacheGen++;
  _metricsCache.clear();
}

function _cacheKey(prefix, extra, filters) {
  return `${_cacheGen}:${prefix}:${extra || ''}:${JSON.stringify(filters || {})}`;
}

// Dissolution chunk size — dissolve N polygons at a time, then merge results
const DISSOLVE_CHUNK = 100;

/**
 * Hard cap: skip dissolution when polygon count exceeds this.
 * Agricultural / land-cover datasets often have thousands of non-overlapping
 * parcels where dissolution is both unnecessary and prohibitively expensive
 * (O(n * log n) turf.union calls).  Returning null tells callers to fall
 * back to gross (sum-of-parts) area — accurate for non-overlapping data.
 */
const DISSOLVE_MAX_POLYGONS = 3000;

/**
 * Computes geodesic area of a GeoJSON feature in hectares.
 * @param {object} feature - GeoJSON Feature
 * @returns {number} Area in hectares
 */
export function computeAreaHa(feature) {
  if (!feature || !feature.geometry) return 0;
  const type = feature.geometry.type;
  if (!type.includes('Polygon')) return 0;

  try {
    return turf.area(feature) / 10000;
  } catch {
    return 0;
  }
}

/**
 * Adds area_ha property to each feature in a FeatureCollection.
 * @param {object} geojson - FeatureCollection
 * @returns {object} New FeatureCollection with area_ha on each feature
 */
export function computeFeatureAreas(geojson) {
  return {
    type: 'FeatureCollection',
    features: (geojson.features || []).map(f => ({
      ...f,
      properties: {
        ...f.properties,
        area_ha: Math.round(computeAreaHa(f) * 100) / 100
      }
    }))
  };
}

/**
 * Dissolves (unions) an array of GeoJSON polygon features into a single geometry.
 * Eliminates overlapping areas so each point on the ground is counted once.
 *
 * Uses a chunked tree-merge strategy for large datasets:
 * 1. Split features into chunks of DISSOLVE_CHUNK
 * 2. Dissolve each chunk
 * 3. Recursively dissolve the chunk results
 *
 * This prevents browser crashes on datasets with thousands of polygons
 * while maintaining correct dissolved areas.
 *
 * @param {Array} features - Array of GeoJSON Feature objects
 * @returns {Feature|null} Dissolved polygon feature, or null if no valid polygons
 */
export function dissolveFeatures(features) {
  const polygons = features.filter(f =>
    f && f.geometry &&
    (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')
  );

  if (polygons.length === 0) return null;
  if (polygons.length === 1) return polygons[0];

  // Hard cap — skip dissolution for very large datasets to prevent crashes.
  // Returns null; callers should fall back to gross (sum) area.
  if (polygons.length > DISSOLVE_MAX_POLYGONS) return null;

  // For large sets, use chunked tree-merge to avoid crashes
  if (polygons.length > DISSOLVE_CHUNK) {
    return dissolveChunked(polygons);
  }

  return dissolveDirect(polygons);
}

/**
 * Dissolves a small set of polygons directly.
 */
function dissolveDirect(polygons) {
  // Try batch union first (faster for turf v7)
  try {
    const fc = turf.featureCollection(polygons);
    const result = turf.union(fc);
    if (result) return result;
  } catch {
    // Fall through to iterative approach
  }

  // Iterative union as fallback (handles invalid geometries better)
  let result = null;
  for (const poly of polygons) {
    if (!result) {
      result = poly;
      continue;
    }
    try {
      const merged = turf.union(turf.featureCollection([result, poly]));
      if (merged) result = merged;
    } catch {
      // Skip features that cause union errors
    }
  }

  return result;
}

/**
 * Chunked tree-merge dissolution for large feature sets.
 * Splits into chunks, dissolves each, then recursively merges results.
 */
function dissolveChunked(polygons) {
  const chunks = [];
  for (let i = 0; i < polygons.length; i += DISSOLVE_CHUNK) {
    chunks.push(polygons.slice(i, i + DISSOLVE_CHUNK));
  }

  const dissolved = chunks.map(chunk => dissolveDirect(chunk)).filter(Boolean);

  if (dissolved.length === 0) return null;
  if (dissolved.length === 1) return dissolved[0];

  // Recursively dissolve the merged chunks
  if (dissolved.length > DISSOLVE_CHUNK) {
    return dissolveChunked(dissolved);
  }
  return dissolveDirect(dissolved);
}

// ─── 30x30 METRICS (Target 3) ───────────────────────────────────────────────

/**
 * Computes 30x30 metrics with polygon dissolution per UNEP-WCMC methodology.
 *
 * - Overlapping terrestrial areas dissolved into single coverage polygon
 * - Overlapping marine areas dissolved separately
 * - Net area (dissolved) used for official coverage percentages
 * - Gross area (sum) reported for transparency
 * - Province breakdown: features dissolved within each province
 *
 * @param {Array<{ metadata: object, geojson: object }>} layers
 * @param {object} filters - Active filters { targets, province }
 * @returns {object} Metrics with net/gross breakdown
 */
export function compute30x30Metrics(layers, filters = {}) {
  const key = _cacheKey('30x30', null, filters);
  const cached = _metricsCache.get(key);
  if (cached) return cached;

  const baselines = ENV.nationalBaselines;
  const terrestrialFeatures = [];
  const marineFeatures = [];
  let grossTerrestrial = 0;
  let grossMarine = 0;
  let totalFeatures = 0;
  const provinceFeatures = {};

  for (const layer of layers) {
    const meta = layer.metadata;
    if (meta.isReference) continue;
    if (!meta.countsToward30x30) continue;
    if (!meta.targets || !meta.targets.includes('T3')) continue;

    const features = (layer.geojson?.features || []).filter(f => {
      if (filters.province && filters.province !== 'All') {
        if (f.properties.province !== filters.province) return false;
      }
      return true;
    });

    for (const f of features) {
      const areaHa = f.properties.area_ha || 0;
      const realm = f.properties.realm || meta.realm || 'terrestrial';

      if (realm === 'marine') {
        marineFeatures.push(f);
        grossMarine += areaHa;
      } else {
        terrestrialFeatures.push(f);
        grossTerrestrial += areaHa;
      }
      totalFeatures++;

      const prov = f.properties.province || 'Unassigned';
      if (!provinceFeatures[prov]) {
        provinceFeatures[prov] = { terrestrial: [], marine: [] };
      }
      if (realm === 'marine') {
        provinceFeatures[prov].marine.push(f);
      } else {
        provinceFeatures[prov].terrestrial.push(f);
      }
    }
  }

  // Dissolve by realm for net coverage area
  // Falls back to gross (sum) when dissolution is skipped for very large datasets
  const tooLarge30 = totalFeatures > DISSOLVE_MAX_POLYGONS;
  const dissolvedTerrestrial = dissolveFeatures(terrestrialFeatures);
  const dissolvedMarine = dissolveFeatures(marineFeatures);
  const netTerrestrial = dissolvedTerrestrial ? computeAreaHa(dissolvedTerrestrial) : grossTerrestrial;
  const netMarine = dissolvedMarine ? computeAreaHa(dissolvedMarine) : grossMarine;

  const terrestrialPct = baselines.terrestrial_ha > 0
    ? (netTerrestrial / baselines.terrestrial_ha) * 100 : 0;
  const marinePct = baselines.marine_ha > 0
    ? (netMarine / baselines.marine_ha) * 100 : 0;

  // Province breakdown — skip per-province dissolution for very large datasets
  const provinceBreakdown = Object.entries(provinceFeatures)
    .filter(([name]) => VALID_PROVINCES.has(name))
    .map(([name, data]) => {
      let tNet, mNet;
      if (tooLarge30) {
        tNet = data.terrestrial.reduce((s, f) => s + (f.properties.area_ha || 0), 0);
        mNet = data.marine.reduce((s, f) => s + (f.properties.area_ha || 0), 0);
      } else {
        const tDissolved = dissolveFeatures(data.terrestrial);
        const mDissolved = dissolveFeatures(data.marine);
        tNet = tDissolved ? computeAreaHa(tDissolved) : 0;
        mNet = mDissolved ? computeAreaHa(mDissolved) : 0;
      }
      return {
        province: name,
        terrestrial_ha: round2(tNet),
        marine_ha: round2(mNet),
        total_ha: round2(tNet + mNet),
        features: data.terrestrial.length + data.marine.length
      };
    }).sort((a, b) => b.total_ha - a.total_ha);

  const result = {
    // Net (dissolved) — official coverage figures
    terrestrial_ha: round2(netTerrestrial),
    marine_ha: round2(netMarine),
    terrestrial_pct: round3(terrestrialPct),
    marine_pct: round3(marinePct),
    terrestrial_remaining_pct: round3(Math.max(0, 30 - terrestrialPct)),
    marine_remaining_pct: round3(Math.max(0, 30 - marinePct)),
    // Gross (sum) — for transparency
    gross_terrestrial_ha: round2(grossTerrestrial),
    gross_marine_ha: round2(grossMarine),
    total_features: totalFeatures,
    provinceBreakdown,
    baselines,
    // Dissolved geometries for map rendering
    dissolvedTerrestrial,
    dissolvedMarine
  };
  _metricsCache.set(key, result);
  return result;
}

// ─── GENERAL METRICS ─────────────────────────────────────────────────────────

/**
 * Computes general layer summary metrics with dissolution.
 * @param {Array} layers
 * @param {object} filters
 * @returns {object}
 */
export function computeGeneralMetrics(layers, filters = {}) {
  const key = _cacheKey('general', null, filters);
  const cached = _metricsCache.get(key);
  if (cached) return cached;

  let totalFeatures = 0;
  let grossAreaHa = 0;
  const allFeatures = [];
  const categoryCounts = {};
  const realmCounts = { terrestrial: 0, marine: 0 };

  for (const layer of layers) {
    const meta = layer.metadata;
    if (meta.isReference) continue;

    if (filters.targets && filters.targets.length > 0) {
      if (!meta.targets.some(t => filters.targets.includes(t))) continue;
    }

    const features = (layer.geojson?.features || []).filter(f => {
      if (filters.province && filters.province !== 'All') {
        if (f.properties.province !== filters.province) return false;
      }
      return true;
    });

    for (const f of features) {
      totalFeatures++;
      grossAreaHa += f.properties.area_ha || 0;
      allFeatures.push(f);

      const cat = meta.category || 'OTHER';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      const realm = f.properties.realm || 'terrestrial';
      realmCounts[realm] = (realmCounts[realm] || 0) + 1;
    }
  }

  const dissolved = dissolveFeatures(allFeatures);
  const netAreaHa = dissolved ? computeAreaHa(dissolved) : 0;

  const result = {
    totalFeatures,
    totalAreaHa: round2(netAreaHa),
    grossAreaHa: round2(grossAreaHa),
    categoryCounts,
    realmCounts
  };
  _metricsCache.set(key, result);
  return result;
}

// ─── TARGET-SPECIFIC METRICS ─────────────────────────────────────────────────

/**
 * Computes detailed target-specific metrics with polygon dissolution.
 *
 * For each target:
 * - All features dissolved for net coverage area
 * - Per-realm dissolution for terrestrial/marine breakdown
 * - Per-category dissolution for category breakdown
 * - Per-province dissolution for province breakdown
 * - Gross (sum) totals alongside net for transparency
 *
 * @param {Array<{ metadata: object, geojson: object }>} layers
 * @param {string} targetCode - e.g. 'T1', 'T6', 'T10'
 * @param {object} filters - { province, category, realm, year }
 * @returns {object} Detailed target metrics
 */
export function computeTargetMetrics(layers, targetCode, filters = {}) {
  const key = _cacheKey('target', targetCode, filters);
  const cached = _metricsCache.get(key);
  if (cached) return cached;

  let totalFeatures = 0;
  let grossAreaHa = 0;
  let layerCount = 0;
  const allFeatures = [];
  const provinceFeatures = {};
  const categoryFeatures = {};
  const typeMap = {};
  const realmFeatures = { terrestrial: [], marine: [] };
  let grossTerrestrial = 0;
  let grossMarine = 0;

  for (const layer of layers) {
    const meta = layer.metadata;
    if (meta.isReference) continue;
    if (!meta.targets || !meta.targets.includes(targetCode)) continue;

    if (filters.category && filters.category !== 'All') {
      if (meta.category !== filters.category) continue;
    }
    if (filters.realm && filters.realm !== 'All') {
      if (meta.realm !== filters.realm) continue;
    }

    layerCount++;
    const cat = meta.category || 'OTHER';

    const features = (layer.geojson?.features || []).filter(f => {
      if (filters.province && filters.province !== 'All') {
        if (f.properties.province !== filters.province) return false;
      }
      if (filters.year && filters.year !== 'All') {
        const yr = f.properties.year || meta.year;
        if (yr && String(yr) !== String(filters.year)) return false;
      }
      return true;
    });

    for (const f of features) {
      const areaHa = f.properties.area_ha || 0;
      const realm = f.properties.realm || meta.realm || 'terrestrial';

      totalFeatures++;
      grossAreaHa += areaHa;
      allFeatures.push(f);

      // Realm grouping
      if (realm === 'marine') {
        realmFeatures.marine.push(f);
        grossMarine += areaHa;
      } else {
        realmFeatures.terrestrial.push(f);
        grossTerrestrial += areaHa;
      }

      // Province grouping
      const prov = f.properties.province || 'Unassigned';
      if (!provinceFeatures[prov]) {
        provinceFeatures[prov] = { terrestrial: [], marine: [] };
      }
      if (realm === 'marine') {
        provinceFeatures[prov].marine.push(f);
      } else {
        provinceFeatures[prov].terrestrial.push(f);
      }

      // Category grouping
      if (!categoryFeatures[cat]) {
        categoryFeatures[cat] = [];
      }
      categoryFeatures[cat].push(f);

      // Type/species grouping
      const typeName = f.properties.type || f.properties.species_name || f.properties.name || meta.name || 'Unknown';
      if (!typeMap[typeName]) {
        typeMap[typeName] = { area_ha: 0, features: 0 };
      }
      typeMap[typeName].area_ha += areaHa;
      typeMap[typeName].features++;
    }
  }

  // ── Dissolution — with fallback to gross area for very large datasets ──
  // dissolveFeatures() returns null when count > DISSOLVE_MAX_POLYGONS
  // to prevent browser crashes on large agricultural / land-cover data.
  const tooLarge = totalFeatures > DISSOLVE_MAX_POLYGONS;

  const dissolvedAll = dissolveFeatures(allFeatures);
  const netAreaHa = dissolvedAll ? computeAreaHa(dissolvedAll) : grossAreaHa;

  const dissolvedTerrestrial = dissolveFeatures(realmFeatures.terrestrial);
  const dissolvedMarine = dissolveFeatures(realmFeatures.marine);
  const netTerrestrial = dissolvedTerrestrial ? computeAreaHa(dissolvedTerrestrial) : grossTerrestrial;
  const netMarine = dissolvedMarine ? computeAreaHa(dissolvedMarine) : grossMarine;

  // Province breakdown — skip per-province dissolution for very large datasets
  const provinceBreakdown = Object.entries(provinceFeatures)
    .filter(([name]) => VALID_PROVINCES.has(name))
    .map(([name, data]) => {
      let tNet, mNet;
      if (tooLarge) {
        // Use sum-of-parts (fast) instead of dissolution
        tNet = data.terrestrial.reduce((s, f) => s + (f.properties.area_ha || 0), 0);
        mNet = data.marine.reduce((s, f) => s + (f.properties.area_ha || 0), 0);
      } else {
        const tDissolved = dissolveFeatures(data.terrestrial);
        const mDissolved = dissolveFeatures(data.marine);
        tNet = tDissolved ? computeAreaHa(tDissolved) : 0;
        mNet = mDissolved ? computeAreaHa(mDissolved) : 0;
      }
      return {
        province: name,
        terrestrial_ha: round2(tNet),
        marine_ha: round2(mNet),
        total_ha: round2(tNet + mNet),
        features: data.terrestrial.length + data.marine.length
      };
    }).sort((a, b) => b.total_ha - a.total_ha);

  // Category breakdown — skip per-category dissolution for very large datasets
  const dissolvedByCategory = {};
  const categoryBreakdown = [];
  for (const [cat, features] of Object.entries(categoryFeatures)) {
    const grossCatArea = features.reduce((s, f) => s + (f.properties.area_ha || 0), 0);
    let dissolved = null;
    let netCatArea;
    if (tooLarge) {
      netCatArea = grossCatArea;
    } else {
      dissolved = dissolveFeatures(features);
      netCatArea = dissolved ? computeAreaHa(dissolved) : grossCatArea;
    }
    dissolvedByCategory[cat] = dissolved;
    categoryBreakdown.push({
      category: cat,
      area_ha: round2(netCatArea),
      gross_area_ha: round2(grossCatArea),
      features: features.length
    });
  }
  categoryBreakdown.sort((a, b) => b.area_ha - a.area_ha);

  // Type breakdown (kept as gross — types are typically distinct)
  const typeBreakdown = Object.entries(typeMap)
    .map(([name, data]) => ({ type: name, ...data }))
    .sort((a, b) => b.area_ha - a.area_ha);

  const result = {
    targetCode,
    totalFeatures,
    totalAreaHa: round2(netAreaHa),
    grossAreaHa: round2(grossAreaHa),
    layerCount,
    realmTotals: {
      terrestrial_ha: round2(netTerrestrial),
      marine_ha: round2(netMarine),
      gross_terrestrial_ha: round2(grossTerrestrial),
      gross_marine_ha: round2(grossMarine)
    },
    provinceBreakdown,
    categoryBreakdown,
    typeBreakdown,
    dissolvedByCategory
  };
  _metricsCache.set(key, result);
  return result;
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function round2(val) {
  return Math.round(val * 100) / 100;
}

function round3(val) {
  return Math.round(val * 1000) / 1000;
}
