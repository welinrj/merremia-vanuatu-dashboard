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
 *
 * 500 is the safe upper bound: turf.union on 500 complex polygons takes
 * ~2-5 s; 3 000 can take 30+ s and freeze the browser.
 */
const DISSOLVE_MAX_POLYGONS = 500;

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

// ─── TARGET 1 METRICS (Biodiversity Spatial Planning) ────────────────────────

/** Categories excluded from T1 terrestrial feature calculations */
const T1_EXCLUDED_CATEGORIES = new Set(['MPA', 'EEZ', 'ADMIN_BOUNDARY']);

/**
 * Categories that count toward T1 terrestrial calculation.
 * T1 Terrestrial = (CCA + Inland Water) / total terrestrial baseline * 100
 */
const T1_TERRESTRIAL_CATEGORIES = new Set(['CCA', 'INLAND_WATER']);

/**
 * Computes Target 1 metrics.
 *
 * Marine:  ((EEZ - National Boundary) / total EEZ) * 100
 *   EEZ and Admin0 (national boundary) are found by category.
 *   Marine coverage represents the ocean portion of the EEZ.
 *
 * Terrestrial: ((CCA + Inland Water) / total terrestrial baseline) * 100
 *   Only CCA and INLAND_WATER categories contribute to terrestrial T1.
 *   Features are dissolved to remove overlaps.
 *
 * @param {Array<{ metadata: object, geojson: object }>} layers
 * @param {object} filters
 * @returns {object} T1 metrics
 */
export function computeTarget1Metrics(layers, filters = {}) {
  const key = _cacheKey('t1', null, filters);
  const cached = _metricsCache.get(key);
  if (cached) return cached;

  const baselines = ENV.nationalBaselines;

  // ── Find EEZ and Admin0 layers for marine calculation ──────────────
  let eezAreaHa = 0;
  let admin0AreaHa = 0;

  for (const layer of layers) {
    const meta = layer.metadata;
    if (meta.category === 'EEZ') {
      eezAreaHa = meta.totalAreaHa || 0;
    } else if (meta.category === 'ADMIN_BOUNDARY') {
      admin0AreaHa = meta.totalAreaHa || 0;
    }
  }

  // Marine T1 = (EEZ - National Boundary) / total EEZ * 100
  const marineNetHa = Math.max(0, eezAreaHa - admin0AreaHa);
  const mPct = eezAreaHa > 0 ? (marineNetHa / eezAreaHa) * 100 : 0;

  // ── Terrestrial: CCA + Inland Water only ──────────────────────────
  const terrestrialFeatures = [];
  let grossTerrestrial = 0;
  let totalFeatures = 0;
  let layerCount = 0;
  const provinceGross = {};
  const provinceFeatures = {};
  const categoryGross = {};
  const categoryFeatures = {};

  for (const layer of layers) {
    const meta = layer.metadata;
    if (meta.isReference) continue;
    if (T1_EXCLUDED_CATEGORIES.has(meta.category)) continue;

    // Only include CCA and INLAND_WATER categories (tagged T1 or auto-category)
    const taggedT1 = meta.targets && meta.targets.includes('T1');
    const autoCategory = T1_TERRESTRIAL_CATEGORIES.has(meta.category);
    if (!taggedT1 && !autoCategory) continue;

    // Even T1-tagged layers must be CCA or INLAND_WATER to count toward terrestrial
    if (taggedT1 && !T1_TERRESTRIAL_CATEGORIES.has(meta.category)) continue;

    if (filters.category && filters.category !== 'All' && meta.category !== filters.category) continue;
    if (filters.realm && filters.realm !== 'All' && meta.realm !== filters.realm) continue;

    layerCount++;
    const cat = meta.category || 'OTHER';

    const features = (layer.geojson?.features || []).filter(f => {
      if (filters.province && filters.province !== 'All') {
        if (f.properties.province !== filters.province) return false;
      }
      return true;
    });

    for (const f of features) {
      const areaHa = f.properties.area_ha || 0;
      const realm = f.properties.realm || meta.realm || 'terrestrial';
      totalFeatures++;

      if (realm !== 'terrestrial') continue;

      terrestrialFeatures.push(f);
      grossTerrestrial += areaHa;

      const prov = f.properties.province || 'Unassigned';
      if (!provinceGross[prov]) provinceGross[prov] = { terrestrial: 0, tCount: 0 };
      provinceGross[prov].terrestrial += areaHa;
      provinceGross[prov].tCount++;
      if (!provinceFeatures[prov]) provinceFeatures[prov] = [];
      provinceFeatures[prov].push(f);

      if (!categoryGross[cat]) categoryGross[cat] = { area: 0, count: 0 };
      categoryGross[cat].area += areaHa;
      categoryGross[cat].count++;
      if (!categoryFeatures[cat]) categoryFeatures[cat] = [];
      categoryFeatures[cat].push(f);
    }
  }

  // Dissolve terrestrial features for net area (removes overlaps between CCA + INLAND_WATER)
  const dissolvedTerrestrial = dissolveFeatures(terrestrialFeatures);
  const netTerrestrial = dissolvedTerrestrial ? computeAreaHa(dissolvedTerrestrial) : grossTerrestrial;

  const tPct = baselines.terrestrial_ha > 0 ? (netTerrestrial / baselines.terrestrial_ha) * 100 : 0;

  // Province breakdown (terrestrial only) — dissolve per-province for net area
  const provinceBreakdown = Object.entries(provinceGross)
    .filter(([name]) => VALID_PROVINCES.has(name))
    .map(([name, data]) => {
      const pf = provinceFeatures[name];
      const dissolved = pf ? dissolveFeatures(pf) : null;
      const tNet = dissolved ? computeAreaHa(dissolved) : data.terrestrial;
      return {
        province: name,
        terrestrial_ha: round2(tNet),
        total_ha: round2(tNet),
        features: data.tCount
      };
    }).sort((a, b) => b.total_ha - a.total_ha);

  // Category breakdown — dissolve per-category for net area
  const categoryBreakdown = Object.entries(categoryGross).map(([cat, gross]) => {
    const dissolved = dissolveFeatures(categoryFeatures[cat] || []);
    const netCatArea = dissolved ? computeAreaHa(dissolved) : gross.area;
    return {
      category: cat,
      area_ha: round2(netCatArea),
      gross_area_ha: round2(gross.area),
      features: gross.count
    };
  }).sort((a, b) => b.area_ha - a.area_ha);

  const result = {
    targetCode: 'T1',
    // Marine: (EEZ - National Boundary) / total EEZ
    marine_ha: round2(marineNetHa),
    marine_pct: round3(mPct),
    eez_ha: round2(eezAreaHa),
    admin0_ha: round2(admin0AreaHa),
    hasEEZ: eezAreaHa > 0,
    hasAdmin0: admin0AreaHa > 0,
    // Terrestrial: (CCA + Inland Water) / total terrestrial
    terrestrial_ha: round2(netTerrestrial),
    terrestrial_pct: round3(tPct),
    gross_terrestrial_ha: round2(grossTerrestrial),
    // General
    totalFeatures,
    layerCount,
    provinceBreakdown,
    categoryBreakdown,
    baselines,
    dissolvedTerrestrial
  };
  _metricsCache.set(key, result);
  return result;
}

// ─── TARGET 2 METRICS (Degraded Areas & Restoration) ─────────────────────────

/**
 * Categories relevant to T2.
 * DEGRADED = areas identified as degraded
 * RESTORATION = areas under active restoration
 */
const T2_DEGRADED_CATEGORIES = new Set(['DEGRADED']);
const T2_RESTORATION_CATEGORIES = new Set(['RESTORATION']);

/**
 * Computes Target 2 metrics: degraded area mapping and restoration progress.
 *
 * Separates features into DEGRADED and RESTORATION categories, dissolves
 * each independently, then computes:
 *   - Total degraded area (ha)
 *   - Total restoration area (ha)
 *   - Restoration ratio: restoration_ha / degraded_ha * 100
 *   - Realm breakdown (terrestrial vs marine/coastal)
 *   - Province and category breakdowns
 *
 * @param {Array<{ metadata: object, geojson: object }>} layers
 * @param {object} filters
 * @returns {object} T2 metrics
 */
export function computeTarget2Metrics(layers, filters = {}) {
  const key = _cacheKey('t2', null, filters);
  const cached = _metricsCache.get(key);
  if (cached) return cached;

  const degradedFeatures = [];
  const restorationFeatures = [];
  let grossDegraded = 0;
  let grossRestoration = 0;
  let totalFeatures = 0;
  let layerCount = 0;

  const provinceGross = {};
  const provinceFeatureRefs = {};
  const categoryGross = {};
  const categoryFeatureRefs = {};

  // Realm accumulators
  let grossDegradedTerrestrial = 0;
  let grossDegradedMarine = 0;
  let grossRestorationTerrestrial = 0;
  let grossRestorationMarine = 0;

  for (const layer of layers) {
    const meta = layer.metadata;
    if (meta.isReference) continue;
    if (!meta.targets || !meta.targets.includes('T2')) continue;
    if (filters.category && filters.category !== 'All' && meta.category !== filters.category) continue;
    if (filters.realm && filters.realm !== 'All' && meta.realm !== filters.realm) continue;

    layerCount++;
    const cat = meta.category || 'OTHER';
    const isDegraded = T2_DEGRADED_CATEGORIES.has(cat);
    const isRestoration = T2_RESTORATION_CATEGORIES.has(cat);

    const features = (layer.geojson?.features || []).filter(f => {
      if (filters.province && filters.province !== 'All') {
        if (f.properties.province !== filters.province) return false;
      }
      return true;
    });

    for (const f of features) {
      const areaHa = f.properties.area_ha || 0;
      const realm = f.properties.realm || meta.realm || 'terrestrial';
      totalFeatures++;

      if (isDegraded) {
        degradedFeatures.push(f);
        grossDegraded += areaHa;
        if (realm === 'marine') grossDegradedMarine += areaHa;
        else grossDegradedTerrestrial += areaHa;
      } else if (isRestoration) {
        restorationFeatures.push(f);
        grossRestoration += areaHa;
        if (realm === 'marine') grossRestorationMarine += areaHa;
        else grossRestorationTerrestrial += areaHa;
      }

      // Province grouping
      const prov = f.properties.province || 'Unassigned';
      if (!provinceGross[prov]) {
        provinceGross[prov] = { degraded: 0, restoration: 0, count: 0 };
      }
      if (isDegraded) provinceGross[prov].degraded += areaHa;
      if (isRestoration) provinceGross[prov].restoration += areaHa;
      provinceGross[prov].count++;
      if (!provinceFeatureRefs[prov]) provinceFeatureRefs[prov] = { degraded: [], restoration: [] };
      if (isDegraded) provinceFeatureRefs[prov].degraded.push(f);
      if (isRestoration) provinceFeatureRefs[prov].restoration.push(f);

      // Category grouping
      if (!categoryGross[cat]) categoryGross[cat] = { area: 0, count: 0 };
      categoryGross[cat].area += areaHa;
      categoryGross[cat].count++;
      if (!categoryFeatureRefs[cat]) categoryFeatureRefs[cat] = [];
      categoryFeatureRefs[cat].push(f);
    }
  }

  // Dissolve degraded and restoration separately for net areas
  const dissolvedDegraded = dissolveFeatures(degradedFeatures);
  const dissolvedRestoration = dissolveFeatures(restorationFeatures);
  const netDegraded = dissolvedDegraded ? computeAreaHa(dissolvedDegraded) : grossDegraded;
  const netRestoration = dissolvedRestoration ? computeAreaHa(dissolvedRestoration) : grossRestoration;

  // Restoration ratio = restoration / degraded * 100
  const restorationPct = netDegraded > 0 ? (netRestoration / netDegraded) * 100 : 0;

  // Province breakdown
  const provinceBreakdown = Object.entries(provinceGross)
    .filter(([name]) => VALID_PROVINCES.has(name))
    .map(([name, data]) => {
      const pf = provinceFeatureRefs[name];
      const dDissolved = pf ? dissolveFeatures(pf.degraded) : null;
      const rDissolved = pf ? dissolveFeatures(pf.restoration) : null;
      const dNet = dDissolved ? computeAreaHa(dDissolved) : data.degraded;
      const rNet = rDissolved ? computeAreaHa(rDissolved) : data.restoration;
      return {
        province: name,
        degraded_ha: round2(dNet),
        restoration_ha: round2(rNet),
        terrestrial_ha: round2(dNet + rNet),
        total_ha: round2(dNet + rNet),
        features: data.count,
        restoration_pct: dNet > 0 ? round3((rNet / dNet) * 100) : 0
      };
    }).sort((a, b) => b.total_ha - a.total_ha);

  // Category breakdown
  const categoryBreakdown = Object.entries(categoryGross).map(([cat, gross]) => {
    const dissolved = dissolveFeatures(categoryFeatureRefs[cat] || []);
    const netCatArea = dissolved ? computeAreaHa(dissolved) : gross.area;
    return {
      category: cat,
      area_ha: round2(netCatArea),
      gross_area_ha: round2(gross.area),
      features: gross.count
    };
  }).sort((a, b) => b.area_ha - a.area_ha);

  const result = {
    targetCode: 'T2',
    // Degraded areas
    degraded_ha: round2(netDegraded),
    gross_degraded_ha: round2(grossDegraded),
    degraded_features: degradedFeatures.length,
    // Restoration sites
    restoration_ha: round2(netRestoration),
    gross_restoration_ha: round2(grossRestoration),
    restoration_features: restorationFeatures.length,
    // Restoration progress ratio
    restoration_pct: round3(restorationPct),
    // Realm breakdown
    realmTotals: {
      degraded_terrestrial_ha: round2(grossDegradedTerrestrial),
      degraded_marine_ha: round2(grossDegradedMarine),
      restoration_terrestrial_ha: round2(grossRestorationTerrestrial),
      restoration_marine_ha: round2(grossRestorationMarine)
    },
    // General
    totalFeatures,
    layerCount,
    provinceBreakdown,
    categoryBreakdown,
    dissolvedDegraded,
    dissolvedRestoration
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

  // Fall back to gross area for large datasets (dissolution would freeze the browser)
  const dissolved = dissolveFeatures(allFeatures);
  const netAreaHa = dissolved ? computeAreaHa(dissolved) : grossAreaHa;

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
  const provinceGross = {};        // province → { terrestrial, marine } gross sums
  const provinceFeatures = {};     // province → { terrestrial: [], marine: [] } — only for dissolution
  const categoryGross = {};        // cat → { area, count }
  const categoryFeatures = {};     // cat → Feature[] — only for dissolution
  const typeMap = {};
  let grossTerrestrial = 0;
  let grossMarine = 0;

  // First pass: count features to decide dissolution strategy early
  let estimatedFeatures = 0;
  for (const layer of layers) {
    const meta = layer.metadata;
    if (meta.isReference) continue;
    if (!meta.targets || !meta.targets.includes(targetCode)) continue;
    if (filters.category && filters.category !== 'All' && meta.category !== filters.category) continue;
    if (filters.realm && filters.realm !== 'All' && meta.realm !== filters.realm) continue;
    estimatedFeatures += layer.geojson?.features?.length || 0;
  }
  const tooLarge = estimatedFeatures > DISSOLVE_MAX_POLYGONS;

  // Only collect feature arrays when dissolution is possible (small datasets)
  const allFeatures = tooLarge ? null : [];
  const realmFeatures = tooLarge ? null : { terrestrial: [], marine: [] };

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

      // Realm grouping — only keep feature refs when we'll dissolve
      if (realm === 'marine') {
        grossMarine += areaHa;
        if (realmFeatures) realmFeatures.marine.push(f);
      } else {
        grossTerrestrial += areaHa;
        if (realmFeatures) realmFeatures.terrestrial.push(f);
      }
      if (allFeatures) allFeatures.push(f);

      // Province grouping — always track gross; only keep refs when small
      const prov = f.properties.province || 'Unassigned';
      if (!provinceGross[prov]) provinceGross[prov] = { terrestrial: 0, marine: 0, tCount: 0, mCount: 0 };
      if (realm === 'marine') {
        provinceGross[prov].marine += areaHa;
        provinceGross[prov].mCount++;
      } else {
        provinceGross[prov].terrestrial += areaHa;
        provinceGross[prov].tCount++;
      }
      if (!tooLarge) {
        if (!provinceFeatures[prov]) provinceFeatures[prov] = { terrestrial: [], marine: [] };
        if (realm === 'marine') provinceFeatures[prov].marine.push(f);
        else provinceFeatures[prov].terrestrial.push(f);
      }

      // Category grouping — always track gross; only keep refs when small
      if (!categoryGross[cat]) categoryGross[cat] = { area: 0, count: 0 };
      categoryGross[cat].area += areaHa;
      categoryGross[cat].count++;
      if (!tooLarge) {
        if (!categoryFeatures[cat]) categoryFeatures[cat] = [];
        categoryFeatures[cat].push(f);
      }

      // Type/species grouping
      const typeName = f.properties.type || f.properties.species_name || f.properties.name || meta.name || 'Unknown';
      if (!typeMap[typeName]) {
        typeMap[typeName] = { area_ha: 0, features: 0 };
      }
      typeMap[typeName].area_ha += areaHa;
      typeMap[typeName].features++;
    }
  }

  // ── Dissolution — only attempted for small datasets ──────────────────
  let netAreaHa, netTerrestrial, netMarine;
  let dissolvedTerrestrial = null, dissolvedMarine = null;

  if (tooLarge) {
    netAreaHa = grossAreaHa;
    netTerrestrial = grossTerrestrial;
    netMarine = grossMarine;
  } else {
    const dissolvedAll = dissolveFeatures(allFeatures);
    netAreaHa = dissolvedAll ? computeAreaHa(dissolvedAll) : grossAreaHa;
    dissolvedTerrestrial = dissolveFeatures(realmFeatures.terrestrial);
    dissolvedMarine = dissolveFeatures(realmFeatures.marine);
    netTerrestrial = dissolvedTerrestrial ? computeAreaHa(dissolvedTerrestrial) : grossTerrestrial;
    netMarine = dissolvedMarine ? computeAreaHa(dissolvedMarine) : grossMarine;
  }

  // Province breakdown
  const provinceBreakdown = Object.entries(provinceGross)
    .filter(([name]) => VALID_PROVINCES.has(name))
    .map(([name, data]) => {
      let tNet, mNet;
      if (tooLarge) {
        tNet = data.terrestrial;
        mNet = data.marine;
      } else {
        const pf = provinceFeatures[name];
        const tDissolved = pf ? dissolveFeatures(pf.terrestrial) : null;
        const mDissolved = pf ? dissolveFeatures(pf.marine) : null;
        tNet = tDissolved ? computeAreaHa(tDissolved) : data.terrestrial;
        mNet = mDissolved ? computeAreaHa(mDissolved) : data.marine;
      }
      return {
        province: name,
        terrestrial_ha: round2(tNet),
        marine_ha: round2(mNet),
        total_ha: round2(tNet + mNet),
        features: data.tCount + data.mCount
      };
    }).sort((a, b) => b.total_ha - a.total_ha);

  // Category breakdown
  const dissolvedByCategory = {};
  const categoryBreakdown = [];
  for (const [cat, gross] of Object.entries(categoryGross)) {
    let dissolved = null;
    let netCatArea;
    if (tooLarge) {
      netCatArea = gross.area;
    } else {
      dissolved = dissolveFeatures(categoryFeatures[cat] || []);
      netCatArea = dissolved ? computeAreaHa(dissolved) : gross.area;
    }
    dissolvedByCategory[cat] = dissolved;
    categoryBreakdown.push({
      category: cat,
      area_ha: round2(netCatArea),
      gross_area_ha: round2(gross.area),
      features: gross.count
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
