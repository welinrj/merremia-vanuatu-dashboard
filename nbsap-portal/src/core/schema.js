/**
 * Standard schema definitions for layers and features.
 * All features stored in the portal conform to this schema.
 */
import { CATEGORIES } from '../config/categories.js';

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
    realm: opts.realm || (CATEGORIES[opts.category]?.defaultRealm) || 'terrestrial',
    countsToward30x30: opts.countsToward30x30 || false,
    isReference: opts.isReference || false,
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
    notes: opts.notes || '',
    // Extended metadata (Vanuatu Spatial Data Standard)
    description: opts.description || '',
    custodianAgency: opts.custodianAgency || '',
    responsibleOfficer: opts.responsibleOfficer || '',
    contactInformation: opts.contactInformation || '',
    dateCreated: opts.dateCreated || '',
    dateUpdated: opts.dateUpdated || '',
    geographicCoverage: opts.geographicCoverage || '',
    dataSource: opts.dataSource || '',
    collectionMethod: opts.collectionMethod || '',
    spatialResolution: opts.spatialResolution || '',
    dataLimitations: opts.dataLimitations || '',
    updateFrequency: opts.updateFrequency || '',
    accessClassification: opts.accessClassification || 'Public'
  };
}

/**
 * Extended metadata fields from the Vanuatu Spatial Data Standard.
 * Used to build the metadata editor form and completeness checks.
 */
export const EXTENDED_METADATA_FIELDS = [
  { key: 'name',                label: 'Dataset Name',          hint: 'Use standardized naming format', required: true },
  { key: 'description',         label: 'Description',           hint: 'Brief 2-3 sentence summary', required: true },
  { key: 'custodianAgency',     label: 'Custodian Agency',      hint: 'Full agency name (e.g. DEPC)', required: true },
  { key: 'responsibleOfficer',  label: 'Responsible Officer',   hint: 'Name and position', required: false },
  { key: 'contactInformation',  label: 'Contact Information',   hint: 'Official email or phone', required: false },
  { key: 'dateCreated',         label: 'Date Created',          hint: 'YYYY-MM-DD format', type: 'date', required: true },
  { key: 'dateUpdated',         label: 'Date Updated',          hint: 'Record when modified', type: 'date', required: false },
  { key: 'geographicCoverage',  label: 'Geographic Coverage',   hint: 'Spatial extent', type: 'select', options: ['National', 'Provincial', 'Marine', 'National + Marine'], required: true },
  { key: 'detectedCRS',         label: 'CRS',                   hint: 'EPSG code', required: false },
  { key: 'dataSource',          label: 'Data Source',            hint: 'Origin', type: 'select', options: ['Field', 'Satellite', 'Digitized', 'Census', 'Survey', 'Other'], required: true },
  { key: 'collectionMethod',    label: 'Collection Method',     hint: 'Brief description of how collected', required: false },
  { key: 'spatialResolution',   label: 'Spatial Resolution',    hint: 'Pixel size or scale', required: false },
  { key: 'dataLimitations',     label: 'Data Limitations',      hint: 'Coverage gaps, known constraints', required: false },
  { key: 'updateFrequency',     label: 'Update Frequency',      hint: 'Revision cycle', type: 'select', options: ['Annual', 'Biennial', 'Project-based', 'One-time', 'As needed'], required: false },
  { key: 'accessClassification', label: 'Access Classification', hint: 'Sensitivity level', type: 'select', options: ['Public', 'Restricted', 'Confidential'], required: true }
];

/**
 * Checks metadata completeness for a layer.
 * Returns { complete, filled, total, missing[] }
 */
export function checkMetadataCompleteness(metadata) {
  const missing = [];
  let filled = 0;
  for (const field of EXTENDED_METADATA_FIELDS) {
    const val = metadata[field.key];
    if (val && String(val).trim()) {
      filled++;
    } else if (field.required) {
      missing.push(field.label);
    }
  }
  const total = EXTENDED_METADATA_FIELDS.length;
  return {
    complete: missing.length === 0,
    filled,
    total,
    pct: Math.round((filled / total) * 100),
    missing
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
    if (f === 'targets') return !Array.isArray(props.targets); // targets can be empty (admin datasets)
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

  // Targets are optional — admin datasets may not be assigned to any target
  // Only warn if targets array is missing entirely (not just empty)

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
