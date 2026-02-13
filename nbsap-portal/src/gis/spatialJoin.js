/**
 * Spatial join module.
 * Assigns province to features that are missing province data
 * by finding which province polygon contains the feature centroid.
 *
 * For MultiPolygons, uses the centroid of the largest part.
 */
import * as turf from '@turf/turf';

/**
 * Gets the effective centroid of a feature for province assignment.
 * - Point: use directly
 * - Polygon: centroid
 * - MultiPolygon: centroid of the largest polygon part
 * - LineString: midpoint
 *
 * @param {object} feature - GeoJSON Feature
 * @returns {object|null} Point feature or null
 */
function getEffectiveCentroid(feature) {
  if (!feature.geometry) return null;

  const type = feature.geometry.type;

  if (type === 'Point') {
    return feature;
  }

  if (type === 'MultiPolygon') {
    // Find the largest polygon part by area
    const coords = feature.geometry.coordinates;
    let largestArea = 0;
    let largestPoly = null;

    for (const polyCoords of coords) {
      const poly = turf.polygon(polyCoords);
      const area = turf.area(poly);
      if (area > largestArea) {
        largestArea = area;
        largestPoly = poly;
      }
    }

    return largestPoly ? turf.centroid(largestPoly) : turf.centroid(feature);
  }

  try {
    return turf.centroid(feature);
  } catch {
    return null;
  }
}

/**
 * Assigns province names to features by spatial join with province polygons.
 * Only modifies features where province is empty/missing.
 *
 * @param {object} featureCollection - FeatureCollection to process
 * @param {object} provincesGeoJSON - Provinces boundary FeatureCollection
 *   Each province feature must have a 'name' or 'province' property.
 * @returns {object} Updated FeatureCollection (new object, features mutated in place)
 */
export function assignProvinces(featureCollection, provincesGeoJSON) {
  const provinces = provincesGeoJSON.features || [];

  const features = featureCollection.features.map(feature => {
    // Skip if province already assigned
    if (feature.properties.province) return feature;

    const centroid = getEffectiveCentroid(feature);
    if (!centroid) return feature;

    // Find which province contains this centroid
    for (const prov of provinces) {
      try {
        const provName = prov.properties.name || prov.properties.province ||
                         prov.properties.NAME || prov.properties.PROVINCE || '';

        if (turf.booleanPointInPolygon(centroid, prov)) {
          return {
            ...feature,
            properties: { ...feature.properties, province: provName }
          };
        }
      } catch {
        // Skip invalid province polygon
        continue;
      }
    }

    return feature;
  });

  return { type: 'FeatureCollection', features };
}

/**
 * Intersects a geometry with provinces and returns area breakdown.
 * @param {object} geometry - GeoJSON geometry (polygon/multipolygon)
 * @param {object} provincesGeoJSON - Provinces boundary FeatureCollection
 * @returns {Array<{ province: string, area_ha: number }>}
 */
export function getProvinceBreakdown(geometry, provincesGeoJSON) {
  const results = [];
  if (!geometry) return results;

  const feature = { type: 'Feature', geometry, properties: {} };
  const provinces = provincesGeoJSON.features || [];

  for (const prov of provinces) {
    const provName = prov.properties.name || prov.properties.province ||
                     prov.properties.NAME || prov.properties.PROVINCE || 'Unknown';
    try {
      const intersection = turf.intersect(
        turf.featureCollection([feature, prov])
      );
      if (intersection) {
        const areaHa = turf.area(intersection) / 10000;
        if (areaHa > 0.001) {
          results.push({ province: provName, area_ha: Math.round(areaHa * 100) / 100 });
        }
      }
    } catch {
      // Skip failed intersections
    }
  }

  return results;
}
