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

/** Yield to main thread so the browser stays responsive. */
const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

/** Process this many features between yields. */
const YIELD_BATCH = 2000;

/**
 * Pre-compute bounding box [west, south, east, north] for a province feature.
 * Used to quickly reject centroids that can't be inside the province.
 */
function computeBBox(feature) {
  const bbox = turf.bbox(feature);
  return bbox; // [minX, minY, maxX, maxY]
}

/**
 * Fast check: is a point [lng, lat] inside a bounding box?
 */
function pointInBBox(coords, bbox) {
  return coords[0] >= bbox[0] && coords[0] <= bbox[2] &&
         coords[1] >= bbox[1] && coords[1] <= bbox[3];
}

/**
 * Assigns province names to features by spatial join with province polygons.
 * Always assigns from the official province boundaries to ensure consistent
 * naming, even if the uploaded data already has a province field.
 *
 * Optimisations for large datasets (10K+ features):
 * - Pre-computes bounding boxes for provinces — cheap rejection test
 * - Only calls expensive turf.booleanPointInPolygon when bbox matches
 * - Yields to main thread every YIELD_BATCH features
 *
 * @param {object} featureCollection - FeatureCollection to process
 * @param {object} provincesGeoJSON - Provinces boundary FeatureCollection
 *   Each province feature must have a 'name' or 'province' property.
 * @returns {Promise<object>} Updated FeatureCollection
 */
export async function assignProvinces(featureCollection, provincesGeoJSON) {
  const rawProvinces = provincesGeoJSON.features || [];
  const src = featureCollection.features;
  const features = new Array(src.length);

  // Pre-compute province bboxes and names (once, not per-feature)
  const provinces = rawProvinces.map(prov => ({
    feature: prov,
    name: prov.properties.name || prov.properties.province ||
          prov.properties.NAME || prov.properties.PROVINCE || '',
    bbox: computeBBox(prov)
  }));

  for (let i = 0; i < src.length; i++) {
    const feature = src[i];
    const centroid = getEffectiveCentroid(feature);

    if (centroid) {
      const coords = turf.getCoord(centroid);
      let matched = false;
      for (const prov of provinces) {
        // Fast bbox rejection — avoids expensive point-in-polygon for ~80% of tests
        if (!pointInBBox(coords, prov.bbox)) continue;
        try {
          if (turf.booleanPointInPolygon(centroid, prov.feature)) {
            features[i] = {
              ...feature,
              properties: { ...feature.properties, province: prov.name }
            };
            matched = true;
            break;
          }
        } catch {
          continue;
        }
      }
      if (!matched) features[i] = feature;
    } else {
      features[i] = feature;
    }

    // Yield every YIELD_BATCH features so the UI thread isn't blocked
    if (i > 0 && i % YIELD_BATCH === 0) {
      await yieldToMain();
    }
  }

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
