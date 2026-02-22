/**
 * GIS Database Types
 * ISO 19115 compliant metadata for DEPC geospatial inventory
 */

export type AccessClassification = 'Public' | 'Restricted' | 'Confidential';
export type UpdateFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual' | 'Ad-hoc';
export type DataFormat = 'GeoJSON' | 'Shapefile' | 'GeoTIFF' | 'KML' | 'GML';
export type GeometryType = 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon' | 'GeometryCollection' | 'Raster';

export type GISCategory =
  | '01_boundaries'
  | '02_conservation_areas'
  | '03_ecosystems_land'
  | '04_species'
  | '05_invasive_species'
  | '06_restoration'
  | '07_production_pollution'
  | '08_urban_green_blue';

export interface GISMetadata {
  // Core Identification
  id: string; // Unique identifier (UUID)
  datasetName: string;
  description: string;

  // Responsibility
  custodianAgency: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;

  // Temporal
  dateCreated: string; // ISO 8601
  dateUpdated: string; // ISO 8601
  updateFrequency: UpdateFrequency;

  // Spatial
  geographicCoverage: string; // e.g., "Efate Island", "All Vanuatu"
  boundingBox?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  coordinateReferenceSystem: string; // e.g., "EPSG:4326"
  geometryType: GeometryType;

  // Lineage
  dataSource: string;
  methodologySummary: string;
  dataLimitations: string;

  // Access & Security
  accessClassification: AccessClassification;
  licenseType?: string;

  // Technical
  format: DataFormat;
  category: GISCategory;
  fileName: string; // Following naming convention
  fileSize?: number; // in bytes
  featureCount?: number; // Number of features (for vector)

  // Keywords & Discovery
  keywords: string[];
  language: string; // ISO 639-1 (en, bi, fr)

  // Quality
  spatialAccuracy?: string; // e.g., "±5m"
  completeness?: number; // 0-100%

  // Optional Extensions
  thumbnail?: string; // URL or base64
  relatedDatasets?: string[]; // IDs of related datasets
  citations?: string[];
}

export interface GISDataset {
  metadata: GISMetadata;
  data?: any; // GeoJSON FeatureCollection or other format
  uploaded: boolean;
  uploadedBy?: string;
  uploadedAt?: string;
}

export interface GISSearchFilters {
  category?: GISCategory;
  accessClassification?: AccessClassification;
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
  custodian?: string;
  format?: DataFormat;
}

export const CATEGORY_LABELS: Record<GISCategory, string> = {
  '01_boundaries': 'Administrative Boundaries',
  '02_conservation_areas': 'Conservation Areas',
  '03_ecosystems_land': 'Ecosystems & Land Cover',
  '04_species': 'Species Distribution',
  '05_invasive_species': 'Invasive Species',
  '06_restoration': 'Restoration Sites',
  '07_production_pollution': 'Production & Pollution',
  '08_urban_green_blue': 'Urban Green/Blue Infrastructure'
};

export const CATEGORY_ICONS: Record<GISCategory, string> = {
  '01_boundaries': '🗺️',
  '02_conservation_areas': '🌳',
  '03_ecosystems_land': '🌿',
  '04_species': '🦎',
  '05_invasive_species': '🌱',
  '06_restoration': '♻️',
  '07_production_pollution': '🏭',
  '08_urban_green_blue': '🏙️'
};

export const ACCESS_ICONS: Record<AccessClassification, string> = {
  'Public': '🌐',
  'Restricted': '🔒',
  'Confidential': '🔐'
};

export const FORMAT_EXTENSIONS: Record<DataFormat, string> = {
  'GeoJSON': '.geojson',
  'Shapefile': '.shp.zip',
  'GeoTIFF': '.tif',
  'KML': '.kml',
  'GML': '.gml'
};

/**
 * Generate standardized filename
 * Format: {country}_{theme}_{dataset}_{year}_{version}
 */
export function generateFileName(
  theme: string,
  dataset: string,
  year: number,
  version: number,
  format: DataFormat
): string {
  const country = 'vut'; // Vanuatu ISO 3166-1 alpha-3
  const cleanTheme = theme.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const cleanDataset = dataset.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const versionStr = `v${version}`;
  const ext = FORMAT_EXTENSIONS[format];

  return `${country}_${cleanTheme}_${cleanDataset}_${year}_${versionStr}${ext}`;
}

/**
 * Validate GeoJSON structure
 */
export function isValidGeoJSON(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  if (data.type !== 'FeatureCollection' && data.type !== 'Feature') return false;
  if (data.type === 'FeatureCollection' && !Array.isArray(data.features)) return false;
  return true;
}
