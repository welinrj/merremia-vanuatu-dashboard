/**
 * Geodesic area calculation module with polygon dissolution.
 * Uses turf.area() for accurate geodesic area on WGS84 coordinates.
 * Uses turf.union() to dissolve overlapping polygons for net coverage area.
 *
 * Dissolution follows UNEP-WCMC / GBF methodology: overlapping protected
 * areas are dissolved (unioned) to prevent double-counting, ensuring each
 * point on Earth's surface is counted only once toward coverage targets.
 */
import * as turf from '@turf/turf';
import ENV from '../config/env.js';

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
 * Uses batch union with iterative fallback for robustness against
 * invalid/self-intersecting geometries common in field-collected GIS data.
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
  const baselines = ENV.nationalBaselines;
  const terrestrialFeatures = [];
  const marineFeatures = [];
  let grossTerrestrial = 0;
  let grossMarine = 0;
  let totalFeatures = 0;
  const provinceFeatures = {};

  for (const layer of layers) {
    const meta = layer.metadata;
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
  const dissolvedTerrestrial = dissolveFeatures(terrestrialFeatures);
  const dissolvedMarine = dissolveFeatures(marineFeatures);
  const netTerrestrial = dissolvedTerrestrial ? computeAreaHa(dissolvedTerrestrial) : 0;
  const netMarine = dissolvedMarine ? computeAreaHa(dissolvedMarine) : 0;

  const terrestrialPct = baselines.terrestrial_ha > 0
    ? (netTerrestrial / baselines.terrestrial_ha) * 100 : 0;
  const marinePct = baselines.marine_ha > 0
    ? (netMarine / baselines.marine_ha) * 100 : 0;

  // Province breakdown with per-province dissolution
  const provinceBreakdown = Object.entries(provinceFeatures).map(([name, data]) => {
    const tDissolved = dissolveFeatures(data.terrestrial);
    const mDissolved = dissolveFeatures(data.marine);
    const tNet = tDissolved ? computeAreaHa(tDissolved) : 0;
    const mNet = mDissolved ? computeAreaHa(mDissolved) : 0;
    return {
      province: name,
      terrestrial_ha: round2(tNet),
      marine_ha: round2(mNet),
      total_ha: round2(tNet + mNet),
      features: data.terrestrial.length + data.marine.length
    };
  }).sort((a, b) => b.total_ha - a.total_ha);

  return {
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
}

// ─── GENERAL METRICS ─────────────────────────────────────────────────────────

/**
 * Computes general layer summary metrics with dissolution.
 * @param {Array} layers
 * @param {object} filters
 * @returns {object}
 */
export function computeGeneralMetrics(layers, filters = {}) {
  let totalFeatures = 0;
  let grossAreaHa = 0;
  const allFeatures = [];
  const categoryCounts = {};
  const realmCounts = { terrestrial: 0, marine: 0 };

  for (const layer of layers) {
    const meta = layer.metadata;

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

  return {
    totalFeatures,
    totalAreaHa: round2(netAreaHa),
    grossAreaHa: round2(grossAreaHa),
    categoryCounts,
    realmCounts
  };
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

  // Dissolve all features for net total
  const dissolvedAll = dissolveFeatures(allFeatures);
  const netAreaHa = dissolvedAll ? computeAreaHa(dissolvedAll) : 0;

  // Dissolve by realm
  const dissolvedTerrestrial = dissolveFeatures(realmFeatures.terrestrial);
  const dissolvedMarine = dissolveFeatures(realmFeatures.marine);
  const netTerrestrial = dissolvedTerrestrial ? computeAreaHa(dissolvedTerrestrial) : 0;
  const netMarine = dissolvedMarine ? computeAreaHa(dissolvedMarine) : 0;

  // Province breakdown with per-province dissolution
  const provinceBreakdown = Object.entries(provinceFeatures).map(([name, data]) => {
    const tDissolved = dissolveFeatures(data.terrestrial);
    const mDissolved = dissolveFeatures(data.marine);
    const tNet = tDissolved ? computeAreaHa(tDissolved) : 0;
    const mNet = mDissolved ? computeAreaHa(mDissolved) : 0;
    return {
      province: name,
      terrestrial_ha: round2(tNet),
      marine_ha: round2(mNet),
      total_ha: round2(tNet + mNet),
      features: data.terrestrial.length + data.marine.length
    };
  }).sort((a, b) => b.total_ha - a.total_ha);

  // Category breakdown with per-category dissolution + map geometries
  const dissolvedByCategory = {};
  const categoryBreakdown = [];
  for (const [cat, features] of Object.entries(categoryFeatures)) {
    const dissolved = dissolveFeatures(features);
    dissolvedByCategory[cat] = dissolved;
    const netCatArea = dissolved ? computeAreaHa(dissolved) : 0;
    const grossCatArea = features.reduce((s, f) => s + (f.properties.area_ha || 0), 0);
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

  return {
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
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function round2(val) {
  return Math.round(val * 100) / 100;
}

function round3(val) {
  return Math.round(val * 1000) / 1000;
}
