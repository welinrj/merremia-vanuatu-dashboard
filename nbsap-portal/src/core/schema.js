/**
 * Standard schema definitions for layers and features.
 * All features stored in the portal conform to this schema.
 */

/**
 * Required standard properties on every GeoJSON feature.
 */
export const STANDARD_FIELDS = [
  'name', 'type', 'realm', 'province', 'year',
  'status', 'source', 'notes', 'targets'
];

/**
 * Metadata fields added to every feature during processing.
 */
export const METADATA_FIELDS = [
  'upload_timestamp', 'layer_id', 'original_filename', 'uploaded_by'
];

/**
 * Creates a blank standard feature properties object.
 * @param {object} overrides - Values to merge in
 * @returns {object} Standard properties
 */
export function createStandardProperties(overrides = {}) {
  return {
    name: 'Unnamed',
    type: '',
    realm: 'terrestrial',
    province: '',
    year: null,
    status: 'Unknown',
    source: '',
    notes: '',
    targets: [],
    ...overrides
  };
}

/**
 * Layer metadata schema.
 * @param {object} opts
 * @returns {object} Layer metadata record
 */
export function createLayerMetadata(opts = {}) {
  return {
    id: opts.id || generateLayerId(),
    name: opts.name || 'Untitled Layer',
    originalFilename: opts.originalFilename || '',
    category: opts.category || 'OTHER',
    targets: opts.targets || [],
    realm: opts.realm || 'terrestrial',
    countsToward30x30: opts.countsToward30x30 || false,
    uploadTimestamp: opts.uploadTimestamp || new Date().toISOString(),
    uploadedBy: opts.uploadedBy || 'admin',
    detectedCRS: opts.detectedCRS || 'EPSG:4326',
    featureCount: opts.featureCount || 0,
    validGeometryCount: opts.validGeometryCount || 0,
    fixedCount: opts.fixedCount || 0,
    droppedCount: opts.droppedCount || 0,
    totalAreaHa: opts.totalAreaHa || 0,
    status: opts.status || 'Clean',
    warnings: opts.warnings || [],
    notes: opts.notes || ''
  };
}

/**
 * Generates a unique layer ID.
 */
export function generateLayerId() {
  return 'layer_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

/**
 * Validates that a feature has all required standard fields.
 * @param {object} feature - GeoJSON feature
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validateFeatureSchema(feature) {
  const props = feature.properties || {};
  const missing = STANDARD_FIELDS.filter(f => {
    if (f === 'targets') return !Array.isArray(props.targets) || props.targets.length === 0;
    if (f === 'year') return false; // year is optional
    return !props[f] && props[f] !== 0;
  });
  return { valid: missing.length === 0, missing };
}

/**
 * Validates a full layer for TOR compliance.
 * @param {object} layerMeta - Layer metadata
 * @param {object} geojson - GeoJSON FeatureCollection
 * @returns {{ compliant: boolean, issues: string[] }}
 */
export function validateTORCompliance(layerMeta, geojson) {
  const issues = [];
  const features = geojson.features || [];

  if (!layerMeta.targets || layerMeta.targets.length === 0) {
    issues.push('Layer has no targets assigned');
  }

  if (!layerMeta.category) {
    issues.push('Layer has no category assigned');
  }

  let missingProvince = 0;
  let missingName = 0;
  let invalidGeom = 0;

  for (const f of features) {
    const p = f.properties || {};
    if (!p.province) missingProvince++;
    if (!p.name || p.name === 'Unnamed') missingName++;
    if (!f.geometry) invalidGeom++;
  }

  if (missingProvince > 0) {
    issues.push(`${missingProvince} feature(s) missing province assignment`);
  }
  if (missingName > 0) {
    issues.push(`${missingName} feature(s) with missing/default name`);
  }
  if (invalidGeom > 0) {
    issues.push(`${invalidGeom} feature(s) with null geometry`);
  }

  if (layerMeta.detectedCRS && layerMeta.detectedCRS !== 'EPSG:4326') {
    issues.push(`CRS is ${layerMeta.detectedCRS} — may need verification`);
  }

  return { compliant: issues.length === 0, issues };
}
