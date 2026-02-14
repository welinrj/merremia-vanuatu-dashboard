/**
 * Field mapping module.
 * Maps uploaded shapefile attribute names to the standard schema
 * using config-driven mappings from /src/config/field_mappings.json.
 */
import fieldMappings from '../config/fieldMappings.js';

/**
 * Finds the value for a standard field from raw feature properties.
 * Searches category-specific mappings first, then global mappings.
 *
 * @param {object} rawProps - Original feature properties
 * @param {string} standardField - Target standard field name
 * @param {string} category - Layer category (CCA, MPA, etc.)
 * @returns {*} Matched value or undefined
 */
function findMappedValue(rawProps, standardField, category) {
  const keys = Object.keys(rawProps);
  const lowerKeys = keys.map(k => k.toLowerCase());

  // Check category-specific mappings first
  const catMappings = fieldMappings[category];
  if (catMappings && catMappings[standardField]) {
    for (const candidate of catMappings[standardField]) {
      const idx = lowerKeys.indexOf(candidate.toLowerCase());
      if (idx !== -1) {
        return rawProps[keys[idx]];
      }
    }
  }

  // Then check global mappings
  const globalMappings = fieldMappings.global;
  if (globalMappings && globalMappings[standardField]) {
    for (const candidate of globalMappings[standardField]) {
      const idx = lowerKeys.indexOf(candidate.toLowerCase());
      if (idx !== -1) {
        return rawProps[keys[idx]];
      }
    }
  }

  return undefined;
}

/**
 * Normalizes text: trim whitespace, normalize unicode, fix casing.
 * @param {string} val
 * @returns {string}
 */
function normalizeText(val) {
  if (typeof val !== 'string') return val;
  return val.trim().normalize('NFC').replace(/\s+/g, ' ');
}

/**
 * Maps raw feature properties to the standard schema.
 *
 * @param {object} rawProps - Original properties from shapefile
 * @param {object} layerDefaults - Default values from upload wizard
 *   { category, targets, realm, countsToward30x30, layerId, originalFilename, uploadedBy }
 * @returns {object} Standardized properties
 */
export function mapFeatureProperties(rawProps, layerDefaults) {
  const category = layerDefaults.category || 'OTHER';

  const name = normalizeText(findMappedValue(rawProps, 'name', category)) || 'Unnamed';
  const type = normalizeText(findMappedValue(rawProps, 'type', category)) || category;
  const realm = normalizeText(findMappedValue(rawProps, 'realm', category)) || layerDefaults.realm || 'terrestrial';
  const province = normalizeText(findMappedValue(rawProps, 'province', category)) || '';
  const yearRaw = findMappedValue(rawProps, 'year', category);
  const year = yearRaw ? parseInt(yearRaw, 10) || null : null;
  const status = normalizeText(findMappedValue(rawProps, 'status', category)) || 'Unknown';
  const source = normalizeText(findMappedValue(rawProps, 'source', category)) || '';
  const notes = normalizeText(findMappedValue(rawProps, 'notes', category)) || '';

  return {
    name,
    type,
    realm,
    province,
    year,
    status,
    source,
    notes,
    targets: [...(layerDefaults.targets || [])],
    upload_timestamp: layerDefaults.uploadTimestamp || new Date().toISOString(),
    layer_id: layerDefaults.layerId || '',
    original_filename: layerDefaults.originalFilename || '',
    uploaded_by: layerDefaults.uploadedBy || 'admin'
  };
}

/**
 * Maps all features in a GeoJSON FeatureCollection.
 * @param {object} geojson - Input FeatureCollection
 * @param {object} layerDefaults
 * @returns {object} New FeatureCollection with standardized properties
 */
export function mapAllFeatures(geojson, layerDefaults) {
  return {
    type: 'FeatureCollection',
    features: (geojson.features || []).map(f => ({
      type: 'Feature',
      geometry: f.geometry,
      properties: mapFeatureProperties(f.properties || {}, layerDefaults)
    }))
  };
}
