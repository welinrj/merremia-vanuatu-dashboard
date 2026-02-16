/**
 * Geodesic area calculation module.
 * Uses turf.area() for accurate geodesic area on WGS84 coordinates.
 * Converts results to hectares (m² / 10000).
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
 * Computes 30x30 metrics from a set of layers.
 * @param {Array<{ metadata: object, geojson: object }>} layers - All loaded layers
 * @param {object} filters - Active filters { targets, province }
 * @returns {object} Metrics:
 *   { terrestrial_ha, marine_ha, terrestrial_pct, marine_pct,
 *     terrestrial_remaining_pct, marine_remaining_pct,
 *     total_features, provinceBreakdown }
 */
export function compute30x30Metrics(layers, filters = {}) {
  const baselines = ENV.nationalBaselines;

  let terrestrialHa = 0;
  let marineHa = 0;
  let totalFeatures = 0;
  const provinceMap = {};

  for (const layer of layers) {
    const meta = layer.metadata;

    // Only count layers tagged with T3 and marked countsToward30x30
    if (!meta.countsToward30x30) continue;
    if (!meta.targets || !meta.targets.includes('T3')) continue;

    const features = (layer.geojson?.features || []).filter(f => {
      // Apply province filter
      if (filters.province && filters.province !== 'All') {
        if (f.properties.province !== filters.province) return false;
      }
      return true;
    });

    for (const f of features) {
      const areaHa = f.properties.area_ha || 0;
      const realm = f.properties.realm || meta.realm || 'terrestrial';

      if (realm === 'marine') {
        marineHa += areaHa;
      } else {
        terrestrialHa += areaHa;
      }
      totalFeatures++;

      // Province breakdown
      const prov = f.properties.province || 'Unassigned';
      if (!provinceMap[prov]) {
        provinceMap[prov] = { terrestrial_ha: 0, marine_ha: 0, features: 0 };
      }
      if (realm === 'marine') {
        provinceMap[prov].marine_ha += areaHa;
      } else {
        provinceMap[prov].terrestrial_ha += areaHa;
      }
      provinceMap[prov].features++;
    }
  }

  const terrestrialPct = baselines.terrestrial_ha > 0
    ? (terrestrialHa / baselines.terrestrial_ha) * 100 : 0;
  const marinePct = baselines.marine_ha > 0
    ? (marineHa / baselines.marine_ha) * 100 : 0;

  const provinceBreakdown = Object.entries(provinceMap).map(([name, data]) => ({
    province: name,
    ...data,
    total_ha: data.terrestrial_ha + data.marine_ha
  })).sort((a, b) => b.total_ha - a.total_ha);

  return {
    terrestrial_ha: Math.round(terrestrialHa * 100) / 100,
    marine_ha: Math.round(marineHa * 100) / 100,
    terrestrial_pct: Math.round(terrestrialPct * 1000) / 1000,
    marine_pct: Math.round(marinePct * 1000) / 1000,
    terrestrial_remaining_pct: Math.round((30 - terrestrialPct) * 1000) / 1000,
    marine_remaining_pct: Math.round((30 - marinePct) * 1000) / 1000,
    total_features: totalFeatures,
    provinceBreakdown,
    baselines
  };
}

/**
 * Computes general layer summary metrics (for non-T3 targets).
 * @param {Array} layers
 * @param {object} filters
 * @returns {object}
 */
export function computeGeneralMetrics(layers, filters = {}) {
  let totalFeatures = 0;
  let totalAreaHa = 0;
  const categoryCounts = {};
  const realmCounts = { terrestrial: 0, marine: 0 };

  for (const layer of layers) {
    const meta = layer.metadata;

    // Apply target filter
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
      totalAreaHa += f.properties.area_ha || 0;

      const cat = meta.category || 'OTHER';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      const realm = f.properties.realm || 'terrestrial';
      realmCounts[realm] = (realmCounts[realm] || 0) + 1;
    }
  }

  return {
    totalFeatures,
    totalAreaHa: Math.round(totalAreaHa * 100) / 100,
    categoryCounts,
    realmCounts
  };
}

/**
 * Computes detailed target-specific metrics from a set of layers.
 * Provides province breakdown, category breakdown, and species/type breakdown
 * suitable for per-target KPI dashboards.
 *
 * @param {Array<{ metadata: object, geojson: object }>} layers
 * @param {string} targetCode - e.g. 'T1', 'T6', 'T10'
 * @param {object} filters - { province, category, realm, year }
 * @returns {object} Detailed target metrics
 */
export function computeTargetMetrics(layers, targetCode, filters = {}) {
  let totalFeatures = 0;
  let totalAreaHa = 0;
  let layerCount = 0;
  const provinceMap = {};
  const categoryMap = {};
  const typeMap = {};
  const realmTotals = { terrestrial_ha: 0, marine_ha: 0 };

  for (const layer of layers) {
    const meta = layer.metadata;

    // Only include layers tagged with the requested target
    if (!meta.targets || !meta.targets.includes(targetCode)) continue;

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      if (meta.category !== filters.category) continue;
    }
    // Apply realm filter
    if (filters.realm && filters.realm !== 'All') {
      if (meta.realm !== filters.realm) continue;
    }

    layerCount++;

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

    const cat = meta.category || 'OTHER';

    for (const f of features) {
      const areaHa = f.properties.area_ha || 0;
      const realm = f.properties.realm || meta.realm || 'terrestrial';

      totalFeatures++;
      totalAreaHa += areaHa;

      // Realm totals
      if (realm === 'marine') {
        realmTotals.marine_ha += areaHa;
      } else {
        realmTotals.terrestrial_ha += areaHa;
      }

      // Province breakdown
      const prov = f.properties.province || 'Unassigned';
      if (!provinceMap[prov]) {
        provinceMap[prov] = { terrestrial_ha: 0, marine_ha: 0, features: 0 };
      }
      if (realm === 'marine') {
        provinceMap[prov].marine_ha += areaHa;
      } else {
        provinceMap[prov].terrestrial_ha += areaHa;
      }
      provinceMap[prov].features++;

      // Category breakdown
      if (!categoryMap[cat]) {
        categoryMap[cat] = { area_ha: 0, features: 0 };
      }
      categoryMap[cat].area_ha += areaHa;
      categoryMap[cat].features++;

      // Type/species breakdown (uses the mapped 'type' or 'name' property)
      const typeName = f.properties.type || f.properties.species_name || f.properties.name || meta.name || 'Unknown';
      if (!typeMap[typeName]) {
        typeMap[typeName] = { area_ha: 0, features: 0 };
      }
      typeMap[typeName].area_ha += areaHa;
      typeMap[typeName].features++;
    }
  }

  // Sort breakdowns by area descending
  const provinceBreakdown = Object.entries(provinceMap)
    .map(([name, data]) => ({
      province: name,
      ...data,
      total_ha: data.terrestrial_ha + data.marine_ha
    }))
    .sort((a, b) => b.total_ha - a.total_ha);

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([name, data]) => ({ category: name, ...data }))
    .sort((a, b) => b.area_ha - a.area_ha);

  const typeBreakdown = Object.entries(typeMap)
    .map(([name, data]) => ({ type: name, ...data }))
    .sort((a, b) => b.area_ha - a.area_ha);

  return {
    targetCode,
    totalFeatures,
    totalAreaHa: Math.round(totalAreaHa * 100) / 100,
    layerCount,
    realmTotals: {
      terrestrial_ha: Math.round(realmTotals.terrestrial_ha * 100) / 100,
      marine_ha: Math.round(realmTotals.marine_ha * 100) / 100
    },
    provinceBreakdown,
    categoryBreakdown,
    typeBreakdown
  };
}
