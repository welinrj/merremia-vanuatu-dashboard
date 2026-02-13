/**
 * Geometry validation and cleaning module.
 * STEP 1: Basic validation — detect type, remove nulls, check CRS
 * STEP 2: Fix common geometry issues — buffer(0), simplify, remove slivers
 */
import * as turf from '@turf/turf';
import proj4 from 'proj4';
import ENV from '../config/env.js';

/**
 * Parses a .prj file string to detect the CRS.
 * Returns EPSG code string if recognized, or the raw WKT.
 * @param {string} prjText - Contents of the .prj file
 * @returns {string} CRS identifier
 */
export function detectCRS(prjText) {
  if (!prjText) return 'EPSG:4326';
  const text = prjText.trim();

  // Common WGS84 patterns
  if (/WGS.?84/i.test(text) && /GEOGCS/i.test(text) && !/UTM/i.test(text)) {
    return 'EPSG:4326';
  }

  // Try to detect UTM zones
  const utmMatch = text.match(/UTM[_ ]?[Zz]one[_ ]?(\d+)([NS]?)/i);
  if (utmMatch) {
    const zone = parseInt(utmMatch[1], 10);
    const south = /S/i.test(utmMatch[2]) || /south/i.test(text);
    return south ? `EPSG:${32700 + zone}` : `EPSG:${32600 + zone}`;
  }

  // Return raw WKT if not recognized
  return text.length > 10 ? text : 'EPSG:4326';
}

/**
 * Attempts to reproject a GeoJSON FeatureCollection to WGS84.
 * @param {object} geojson - FeatureCollection in source CRS
 * @param {string} sourceCRS - Source CRS (EPSG code or WKT)
 * @returns {{ geojson: object, reprojected: boolean, error: string|null }}
 */
export function reprojectToWGS84(geojson, sourceCRS) {
  if (!sourceCRS || sourceCRS === 'EPSG:4326') {
    return { geojson, reprojected: false, error: null };
  }

  try {
    // proj4 can parse EPSG codes and WKT strings
    const transformer = proj4(sourceCRS, 'EPSG:4326');

    const reprojected = {
      type: 'FeatureCollection',
      features: geojson.features.map(f => {
        if (!f.geometry) return f;
        return {
          ...f,
          geometry: reprojectGeometry(f.geometry, transformer)
        };
      })
    };

    return { geojson: reprojected, reprojected: true, error: null };
  } catch (err) {
    return { geojson, reprojected: false, error: `Reprojection failed: ${err.message}` };
  }
}

/**
 * Reprojects a single geometry using a proj4 transformer.
 */
function reprojectGeometry(geometry, transformer) {
  const type = geometry.type;

  if (type === 'Point') {
    return { type, coordinates: transformer.forward(geometry.coordinates) };
  }

  if (type === 'MultiPoint' || type === 'LineString') {
    return { type, coordinates: geometry.coordinates.map(c => transformer.forward(c)) };
  }

  if (type === 'MultiLineString' || type === 'Polygon') {
    return {
      type,
      coordinates: geometry.coordinates.map(ring => ring.map(c => transformer.forward(c)))
    };
  }

  if (type === 'MultiPolygon') {
    return {
      type,
      coordinates: geometry.coordinates.map(poly =>
        poly.map(ring => ring.map(c => transformer.forward(c)))
      )
    };
  }

  return geometry;
}

/**
 * STEP 1: Basic validation
 * - Removes null/empty geometries
 * - Returns geometry type stats and cleaned features
 *
 * @param {object} geojson - FeatureCollection
 * @returns {{ cleaned: object, stats: object, warnings: string[] }}
 */
export function basicValidation(geojson) {
  const warnings = [];
  const typeCounts = {};
  const validFeatures = [];
  let nullCount = 0;

  for (const f of geojson.features || []) {
    if (!f.geometry || !f.geometry.type || !f.geometry.coordinates) {
      nullCount++;
      continue;
    }

    const t = f.geometry.type;
    typeCounts[t] = (typeCounts[t] || 0) + 1;
    validFeatures.push(f);
  }

  if (nullCount > 0) {
    warnings.push(`Removed ${nullCount} feature(s) with null/empty geometry`);
  }

  return {
    cleaned: { type: 'FeatureCollection', features: validFeatures },
    stats: { typeCounts, originalCount: (geojson.features || []).length, validCount: validFeatures.length },
    warnings
  };
}

/**
 * STEP 2: Fix common geometry issues
 * - buffer(0) to fix self-intersections
 * - simplify + buffer(0) if still invalid
 * - remove sliver polygons below threshold
 *
 * @param {object} geojson - FeatureCollection (already through basicValidation)
 * @returns {{ cleaned: object, fixedCount: number, droppedCount: number, warnings: string[] }}
 */
export function fixGeometries(geojson) {
  const warnings = [];
  let fixedCount = 0;
  let droppedCount = 0;
  const resultFeatures = [];

  for (const feature of geojson.features) {
    const geomType = feature.geometry.type;

    // Only fix polygons and multipolygons
    if (!geomType.includes('Polygon')) {
      resultFeatures.push(feature);
      continue;
    }

    try {
      // Try buffer(0) to fix self-intersections
      let fixed = turf.buffer(feature, 0, { units: 'meters' });

      if (!fixed || !fixed.geometry) {
        // buffer(0) failed — try simplify then buffer(0)
        const simplified = turf.simplify(feature, {
          tolerance: ENV.simplifyTolerance,
          highQuality: true
        });
        fixed = turf.buffer(simplified, 0, { units: 'meters' });
      }

      if (!fixed || !fixed.geometry) {
        droppedCount++;
        warnings.push(`Dropped feature "${feature.properties?.name || 'unknown'}" — unfixable geometry`);
        continue;
      }

      // Check for sliver polygons
      const areaM2 = turf.area(fixed);
      if (areaM2 < ENV.sliverThresholdM2) {
        droppedCount++;
        warnings.push(`Removed sliver polygon (${areaM2.toFixed(1)} m²)`);
        continue;
      }

      // Check if geometry was actually modified
      const origArea = turf.area(feature);
      if (Math.abs(origArea - areaM2) > 0.01) {
        fixedCount++;
      }

      resultFeatures.push({
        type: 'Feature',
        geometry: fixed.geometry,
        properties: feature.properties
      });

    } catch (err) {
      // If all fixing attempts fail, keep the original
      resultFeatures.push(feature);
      warnings.push(`Could not validate geometry for "${feature.properties?.name || 'unknown'}": ${err.message}`);
    }
  }

  if (fixedCount > 0) {
    warnings.push(`Fixed ${fixedCount} geometry issue(s) via buffer(0)`);
  }

  return {
    cleaned: { type: 'FeatureCollection', features: resultFeatures },
    fixedCount,
    droppedCount,
    warnings
  };
}
