/**
 * Auto-cleaning pipeline orchestrator.
 * Runs all processing steps in sequence on an uploaded shapefile.
 *
 * Pipeline steps:
 *   1. Basic validation (detect type, remove nulls, detect CRS)
 *   2. Reproject to WGS84 if needed
 *   3. Fix geometries (buffer(0), simplify, remove slivers)
 *   4. Map fields to standard schema
 *   5. Assign provinces via spatial join (if missing)
 *   6. Compute areas
 *   7. Generate validation report
 */
import { detectCRS, reprojectToWGS84, basicValidation, fixGeometries } from './validation.js';
import { mapAllFeatures } from './fieldMapper.js';
import { assignProvinces } from '../gis/spatialJoin.js';
import { computeFeatureAreas } from '../gis/areaCalc.js';
import { createLayerMetadata, validateTORCompliance } from './schema.js';

/**
 * Run the full cleaning pipeline on parsed GeoJSON.
 *
 * @param {object} rawGeojson - Parsed GeoJSON from shpjs
 * @param {object} uploadOpts - Upload wizard selections:
 *   { name, category, targets, realm, countsToward30x30, prjText, originalFilename, uploadedBy }
 * @param {object} provincesGeojson - Provinces boundary FeatureCollection
 * @param {function} onProgress - Progress callback: (step, message) => void
 * @returns {Promise<{ geojson: object, metadata: object, report: object }>}
 */
export async function runPipeline(rawGeojson, uploadOpts, provincesGeojson, onProgress) {
  const report = {
    steps: [],
    warnings: [],
    errors: []
  };

  const progress = (step, msg) => {
    report.steps.push({ step, message: msg, timestamp: new Date().toISOString() });
    if (onProgress) onProgress(step, msg);
  };

  // STEP 1: Basic validation
  progress(1, 'Validating geometries...');
  const { cleaned: step1, stats, warnings: w1 } = basicValidation(rawGeojson);
  report.warnings.push(...w1);
  progress(1, `Valid: ${stats.validCount}/${stats.originalCount} features. Types: ${JSON.stringify(stats.typeCounts)}`);

  if (step1.features.length === 0) {
    report.errors.push('No valid features found after basic validation');
    return {
      geojson: step1,
      metadata: createLayerMetadata({ name: uploadOpts.name, status: 'Failed' }),
      report
    };
  }

  // STEP 2: Detect CRS and reproject if needed
  progress(2, 'Checking CRS...');
  const detectedCRS = detectCRS(uploadOpts.prjText);
  progress(2, `Detected CRS: ${detectedCRS}`);

  let step2 = step1;
  if (detectedCRS !== 'EPSG:4326') {
    progress(2, 'Reprojecting to WGS84...');
    const { geojson: reproj, reprojected, error } = reprojectToWGS84(step1, detectedCRS);
    if (error) {
      report.warnings.push(error);
      report.warnings.push('Unverified CRS — layer loaded but coordinates may be incorrect');
    }
    step2 = reproj;
    if (reprojected) progress(2, 'Reprojection successful');
  }

  // STEP 3: Fix geometries
  progress(3, 'Fixing geometry issues...');
  const { cleaned: step3, fixedCount, droppedCount, warnings: w3 } = fixGeometries(step2);
  report.warnings.push(...w3);
  progress(3, `Fixed: ${fixedCount}, Dropped: ${droppedCount}`);

  // STEP 4: Map fields to standard schema
  progress(4, 'Standardizing attributes...');
  const layerMeta = createLayerMetadata({
    name: uploadOpts.name || uploadOpts.originalFilename,
    originalFilename: uploadOpts.originalFilename,
    category: uploadOpts.category,
    targets: uploadOpts.targets,
    realm: uploadOpts.realm,
    countsToward30x30: uploadOpts.countsToward30x30,
    detectedCRS,
    uploadedBy: uploadOpts.uploadedBy || 'admin'
  });

  const step4 = mapAllFeatures(step3, {
    category: uploadOpts.category,
    targets: uploadOpts.targets,
    realm: uploadOpts.realm,
    layerId: layerMeta.id,
    originalFilename: uploadOpts.originalFilename,
    uploadTimestamp: layerMeta.uploadTimestamp,
    uploadedBy: uploadOpts.uploadedBy || 'admin'
  });
  progress(4, `Mapped ${step4.features.length} features to standard schema`);

  // STEP 5: Assign provinces via spatial join
  progress(5, 'Assigning provinces...');
  let step5 = step4;
  if (provincesGeojson && provincesGeojson.features && provincesGeojson.features.length > 0) {
    step5 = assignProvinces(step4, provincesGeojson);
    const assigned = step5.features.filter(f => f.properties.province).length;
    progress(5, `Province assigned to ${assigned}/${step5.features.length} features`);
  } else {
    report.warnings.push('No provinces boundary data — province assignment skipped');
    progress(5, 'Skipped — no provinces data');
  }

  // STEP 6: Compute areas
  progress(6, 'Computing areas...');
  const step6 = computeFeatureAreas(step5);
  const totalAreaHa = step6.features.reduce((sum, f) => sum + (f.properties.area_ha || 0), 0);
  progress(6, `Total area: ${totalAreaHa.toFixed(2)} ha`);

  // Update layer metadata
  layerMeta.featureCount = step6.features.length;
  layerMeta.validGeometryCount = step6.features.filter(f => f.geometry).length;
  layerMeta.fixedCount = fixedCount;
  layerMeta.droppedCount = droppedCount;
  layerMeta.totalAreaHa = totalAreaHa;

  // Determine status
  const hasErrors = report.errors.length > 0;
  const hasWarnings = report.warnings.length > 0;
  layerMeta.status = hasErrors ? 'Failed' : (hasWarnings ? 'Warnings' : 'Clean');
  layerMeta.warnings = report.warnings;

  // TOR compliance check
  const tor = validateTORCompliance(layerMeta, step6);
  report.torCompliance = tor;

  progress(7, `Pipeline complete. Status: ${layerMeta.status}`);

  return {
    geojson: step6,
    metadata: layerMeta,
    report
  };
}
