/**
 * Union / Dissolve module for Target 3 (30x30) no-double-counting.
 *
 * Creates a dissolved union geometry by realm across all layers
 * that are flagged "counts toward 30x30" and tagged with Target 3.
 * This removes overlapping areas so they are only counted once.
 *
 * Strategy:
 *   1. Collect all polygons by realm
 *   2. Iteratively union them using turf.union
 *   3. If union fails: simplify -> buffer(0) -> retry
 *   4. Report progress during large operations
 */
import * as turf from '@turf/turf';
import ENV from '../config/env.js';

/**
 * Dissolves/unions an array of polygon features into one combined geometry per realm.
 * Removes overlaps so total area has no double-counting.
 *
 * @param {Array<{ metadata: object, geojson: object }>} layers - Loaded layers
 * @param {function} onProgress - Progress callback: (pct, message) => void
 * @returns {Promise<{ terrestrial: object|null, marine: object|null, stats: object }>}
 *   Each is a GeoJSON Feature (dissolved polygon) or null if no features.
 */
export async function dissolveByRealm(layers, onProgress) {
  const progress = onProgress || (() => {});

  // Collect features by realm from T3 layers marked countsToward30x30
  const byRealm = { terrestrial: [], marine: [] };

  for (const layer of layers) {
    const meta = layer.metadata;
    if (!meta.countsToward30x30) continue;
    if (!meta.targets || !meta.targets.includes('T3')) continue;

    for (const f of (layer.geojson?.features || [])) {
      if (!f.geometry) continue;
      const type = f.geometry.type;
      if (!type.includes('Polygon')) continue;

      const realm = f.properties?.realm || meta.realm || 'terrestrial';
      const target = realm === 'marine' ? 'marine' : 'terrestrial';
      byRealm[target].push(f);
    }
  }

  progress(5, 'Collected features by realm');

  const stats = {
    terrestrial_input: byRealm.terrestrial.length,
    marine_input: byRealm.marine.length,
    terrestrial_area_ha: 0,
    marine_area_ha: 0,
    warnings: []
  };

  // Dissolve each realm
  const terrestrial = await dissolveFeatures(byRealm.terrestrial, (pct, msg) => {
    progress(5 + pct * 0.45, `Terrestrial: ${msg}`);
  });

  const marine = await dissolveFeatures(byRealm.marine, (pct, msg) => {
    progress(50 + pct * 0.45, `Marine: ${msg}`);
  });

  if (terrestrial) {
    stats.terrestrial_area_ha = Math.round(turf.area(terrestrial) / 10000 * 100) / 100;
  }
  if (marine) {
    stats.marine_area_ha = Math.round(turf.area(marine) / 10000 * 100) / 100;
  }

  progress(100, 'Dissolve complete');

  return { terrestrial, marine, stats };
}

/**
 * Dissolves an array of polygon features into a single union geometry.
 * Uses iterative union with fallback simplification.
 *
 * @param {Array} features - Array of GeoJSON polygon features
 * @param {function} onProgress
 * @returns {Promise<object|null>} Single dissolved Feature or null
 */
async function dissolveFeatures(features, onProgress) {
  if (features.length === 0) return null;
  if (features.length === 1) return features[0];

  const progress = onProgress || (() => {});
  let result = features[0];
  const total = features.length;
  let failCount = 0;

  for (let i = 1; i < total; i++) {
    // Yield to main thread periodically for UI responsiveness
    if (i % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
      progress((i / total) * 100, `Unioning ${i}/${total} features...`);
    }

    try {
      const unionResult = turf.union(turf.featureCollection([result, features[i]]));
      if (unionResult) {
        result = unionResult;
        continue;
      }
    } catch {
      // First attempt failed
    }

    // Fallback: simplify both geometries, buffer(0), then retry
    try {
      const simplified1 = turf.simplify(result, {
        tolerance: ENV.simplifyTolerance, highQuality: true
      });
      const buffered1 = turf.buffer(simplified1, 0, { units: 'meters' }) || simplified1;

      const simplified2 = turf.simplify(features[i], {
        tolerance: ENV.simplifyTolerance, highQuality: true
      });
      const buffered2 = turf.buffer(simplified2, 0, { units: 'meters' }) || simplified2;

      const retryResult = turf.union(turf.featureCollection([buffered1, buffered2]));
      if (retryResult) {
        result = retryResult;
      } else {
        failCount++;
      }
    } catch {
      failCount++;
      // Skip this feature — it will be excluded from the union
    }
  }

  progress(100, `Union complete. ${failCount > 0 ? `${failCount} features could not be merged.` : ''}`);

  if (failCount > 0) {
    console.warn(`Dissolve: ${failCount}/${total} features failed to union`);
  }

  return result;
}

/**
 * Computes dissolved 30x30 metrics — uses the dissolved union geometry
 * for accurate no-double-count totals.
 *
 * @param {Array} layers - All loaded layers
 * @param {function} onProgress
 * @returns {Promise<object>} Dissolved metrics
 */
export async function computeDissolvedMetrics(layers, onProgress) {
  const { terrestrial, marine, stats } = await dissolveByRealm(layers, onProgress);
  const baselines = ENV.nationalBaselines;

  const tPct = baselines.terrestrial_ha > 0
    ? (stats.terrestrial_area_ha / baselines.terrestrial_ha) * 100 : 0;
  const mPct = baselines.marine_ha > 0
    ? (stats.marine_area_ha / baselines.marine_ha) * 100 : 0;

  return {
    terrestrial_ha: stats.terrestrial_area_ha,
    marine_ha: stats.marine_area_ha,
    terrestrial_pct: Math.round(tPct * 1000) / 1000,
    marine_pct: Math.round(mPct * 1000) / 1000,
    terrestrial_remaining_pct: Math.round((30 - tPct) * 1000) / 1000,
    marine_remaining_pct: Math.round((30 - mPct) * 1000) / 1000,
    terrestrial_dissolved: terrestrial,
    marine_dissolved: marine,
    stats
  };
}
