/**
 * Professional GIS symbology for the Vanuatu NBSAP Portal.
 *
 * Defines:
 *   - Category color palettes (fill + stroke)
 *   - LAND_COVER sub-type colors (CORINE/NLCD conventions)
 *   - Status-based style modifiers
 *   - Feature-level style resolver functions for polygons and points
 *   - Legend helpers
 */

// ── Category colour palette ──────────────────────────────────────────
// Stroke colours are a darker shade of the fill for professional contrast.
export const SYMBOLOGY = {
  // Boundary / Reference
  EEZ:            { fill: '#0277BD', stroke: '#01579B' },
  ADMIN_BOUNDARY: { fill: '#546E7A', stroke: '#37474F' },
  // Conservation — green spectrum
  CCA:            { fill: '#43A047', stroke: '#2E7D32' },
  PA:             { fill: '#1B5E20', stroke: '#0D3311' },
  OECM:           { fill: '#7E57C2', stroke: '#5E35B1' },
  KBA:            { fill: '#F57C00', stroke: '#E65100' },
  // Marine — blue spectrum
  MPA:            { fill: '#1565C0', stroke: '#0D47A1' },
  LMMA:           { fill: '#00897B', stroke: '#00695C' },
  INLAND_WATER:   { fill: '#0288D1', stroke: '#01579B' },
  // Planning
  SPATIAL_PLAN:   { fill: '#455A64', stroke: '#263238' },
  // Degradation & restoration
  DEGRADED:       { fill: '#D84315', stroke: '#BF360C' },
  RESTORATION:    { fill: '#F9A825', stroke: '#F57F17' },
  // Species — distinctive per-taxon colours
  SPECIES_DIST:   { fill: '#26A69A', stroke: '#00897B' },
  MEGAPODE:       { fill: '#E65100', stroke: '#BF360C' },
  STARLING:       { fill: '#5C6BC0', stroke: '#3949AB' },
  FANTAIL:        { fill: '#FFB300', stroke: '#FF8F00' },
  KINGFISHER:     { fill: '#00ACC1', stroke: '#00838F' },
  FLYING_FOX:     { fill: '#6D4C41', stroke: '#4E342E' },
  PLERANDRA:      { fill: '#66BB6A', stroke: '#43A047' },
  // Threats — warm/red spectrum (IAS per species)
  INVASIVE:       { fill: '#C62828', stroke: '#B71C1C' },
  MERREMIA:       { fill: '#BF360C', stroke: '#8D2409' },
  CROWN_OF_THORNS:{ fill: '#FF6F00', stroke: '#E65100' },
  MILE_A_MINUTE:  { fill: '#AD1457', stroke: '#880E4F' },
  SOLANUM_TORVUM: { fill: '#6A1B9A', stroke: '#4A148C' },
  PESTICIDE:      { fill: '#8E24AA', stroke: '#6A1B9A' },
  EUTROPHICATION: { fill: '#D81B60', stroke: '#AD1457' },
  // Land use & green space
  LAND_COVER:     { fill: '#795548', stroke: '#5D4037' },
  GREEN_SPACE:    { fill: '#388E3C', stroke: '#2E7D32' },
  // Fallback
  OTHER:          { fill: '#78909C', stroke: '#546E7A' }
};

// ── LAND_COVER sub-type colours (international cartographic standards) ──
export const LAND_COVER_TYPES = {
  // Forests
  'Forest':                { fill: '#1B5E20', stroke: '#0D3311' },
  'Dense Forest':          { fill: '#1B5E20', stroke: '#0D3311' },
  'Sparse Forest':         { fill: '#388E3C', stroke: '#2E7D32' },
  'Medium Forest':         { fill: '#2E7D32', stroke: '#1B5E20' },
  'Thicket/Dense Shrub':   { fill: '#558B2F', stroke: '#33691E' },
  'Mangrove':              { fill: '#004D40', stroke: '#00251A' },
  // Agriculture
  'Agriculture':           { fill: '#F9A825', stroke: '#F57F17' },
  'Cropland':              { fill: '#FFD54F', stroke: '#FFC107' },
  'Plantation':            { fill: '#827717', stroke: '#524A03' },
  'Coconut':               { fill: '#9E9D24', stroke: '#6D6B1E' },
  'Coconut Plantation':    { fill: '#9E9D24', stroke: '#6D6B1E' },
  'Agroforestry':          { fill: '#8D6E63', stroke: '#6D4C41' },
  // Grassland & shrub
  'Grassland':             { fill: '#AED581', stroke: '#8BC34A' },
  'Shrub':                 { fill: '#7CB342', stroke: '#558B2F' },
  'Savanna':               { fill: '#C0CA33', stroke: '#9E9D24' },
  // Urban & built
  'Urban':                 { fill: '#E53935', stroke: '#C62828' },
  'Built-up':              { fill: '#E53935', stroke: '#C62828' },
  'Settlement':            { fill: '#EF5350', stroke: '#D32F2F' },
  // Bare & rock
  'Bare':                  { fill: '#A1887F', stroke: '#795548' },
  'Bare Ground':           { fill: '#A1887F', stroke: '#795548' },
  'Rock':                  { fill: '#8D6E63', stroke: '#5D4037' },
  'Sand':                  { fill: '#FFE0B2', stroke: '#FFCC80' },
  // Water & wetland
  'Water':                 { fill: '#1565C0', stroke: '#0D47A1' },
  'Inland Water':          { fill: '#1565C0', stroke: '#0D47A1' },
  'Wetland':               { fill: '#00838F', stroke: '#006064' },
  'Swamp':                 { fill: '#00695C', stroke: '#004D40' },
  // Marine/coastal
  'Coral':                 { fill: '#FF7043', stroke: '#E64A19' },
  'Reef':                  { fill: '#FF7043', stroke: '#E64A19' },
  'Lagoon':                { fill: '#4FC3F7', stroke: '#0288D1' },
  'Seagrass':              { fill: '#26A69A', stroke: '#00897B' },
  // Other
  'Cloud':                 { fill: '#ECEFF1', stroke: '#CFD8DC' },
  'Shadow':                { fill: '#90A4AE', stroke: '#607D8B' },
  'No Data':               { fill: '#BDBDBD', stroke: '#9E9E9E' }
};

/**
 * Dynamic colour palette for LAND_COVER sub-types that don't match
 * the predefined LAND_COVER_TYPES. Each unknown type gets a stable,
 * distinct colour derived from a hash of the type name.
 *
 * 20 high-contrast colours chosen for cartographic clarity on
 * both screen and print.
 */
const DYNAMIC_LC_PALETTE = [
  { fill: '#1B5E20', stroke: '#0D3311' },   // deep green
  { fill: '#F9A825', stroke: '#F57F17' },   // amber
  { fill: '#0277BD', stroke: '#01579B' },   // blue
  { fill: '#E53935', stroke: '#C62828' },   // red
  { fill: '#6A1B9A', stroke: '#4A148C' },   // purple
  { fill: '#00838F', stroke: '#006064' },   // teal
  { fill: '#EF6C00', stroke: '#E65100' },   // deep orange
  { fill: '#558B2F', stroke: '#33691E' },   // olive green
  { fill: '#AD1457', stroke: '#880E4F' },   // magenta
  { fill: '#4527A0', stroke: '#311B92' },   // deep purple
  { fill: '#00695C', stroke: '#004D40' },   // dark teal
  { fill: '#9E9D24', stroke: '#6D6B1E' },   // lime
  { fill: '#C62828', stroke: '#B71C1C' },   // dark red
  { fill: '#1565C0', stroke: '#0D47A1' },   // strong blue
  { fill: '#FF8F00', stroke: '#FF6F00' },   // orange
  { fill: '#2E7D32', stroke: '#1B5E20' },   // forest green
  { fill: '#5C6BC0', stroke: '#3949AB' },   // indigo
  { fill: '#D84315', stroke: '#BF360C' },   // burnt orange
  { fill: '#00897B', stroke: '#00695C' },   // cyan
  { fill: '#827717', stroke: '#524A03' }    // dark lime
];

/** Cache for dynamically assigned LAND_COVER colours (stable across renders). */
const _dynamicLCCache = new Map();

/**
 * Returns a stable colour for a LAND_COVER type string not found in
 * the predefined LAND_COVER_TYPES table.  Uses a simple hash to pick
 * from DYNAMIC_LC_PALETTE so the same type always gets the same colour.
 */
function dynamicLandCoverColor(typeValue) {
  if (_dynamicLCCache.has(typeValue)) return _dynamicLCCache.get(typeValue);

  // Simple string hash → palette index (stable, deterministic)
  let hash = 0;
  for (let i = 0; i < typeValue.length; i++) {
    hash = ((hash << 5) - hash + typeValue.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % DYNAMIC_LC_PALETTE.length;
  const color = DYNAMIC_LC_PALETTE[idx];
  _dynamicLCCache.set(typeValue, color);
  return color;
}

// ── Status-based style modifiers ─────────────────────────────────────
const STATUS_STYLES = {
  'Designated': { fillOpacity: 0.35, dashArray: null,    weight: 2.0 },
  'Active':     { fillOpacity: 0.35, dashArray: null,    weight: 2.0 },
  'Proposed':   { fillOpacity: 0.18, dashArray: '6 4',   weight: 1.5 },
  'Inactive':   { fillOpacity: 0.10, dashArray: '2 4',   weight: 1.0 },
  'Unknown':    { fillOpacity: 0.28, dashArray: null,    weight: 1.5 }
};

const DEFAULT_STATUS = STATUS_STYLES['Unknown'];

// Species categories get larger point markers
const SPECIES_CATS = new Set([
  'MEGAPODE', 'STARLING', 'FANTAIL', 'KINGFISHER',
  'FLYING_FOX', 'PLERANDRA', 'SPECIES_DIST'
]);

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Returns the symbology entry (fill + stroke) for a category,
 * with optional LAND_COVER sub-type resolution.
 */
export function resolveColors(category, typeValue) {
  const cat = category || 'OTHER';
  const sym = SYMBOLOGY[cat] || SYMBOLOGY.OTHER;

  if (cat === 'LAND_COVER' && typeValue) {
    // Exact match
    const exact = LAND_COVER_TYPES[typeValue];
    if (exact) return exact;

    // Case-insensitive partial match
    const upper = typeValue.toUpperCase();
    for (const [key, val] of Object.entries(LAND_COVER_TYPES)) {
      if (upper.includes(key.toUpperCase()) || key.toUpperCase().includes(upper)) {
        return val;
      }
    }

    // Dynamic colour — every unknown type gets its own stable colour
    return dynamicLandCoverColor(typeValue);
  }

  return sym;
}

/**
 * Computes the sub-type grouping key for a feature.
 * LAND_COVER features are grouped by their `type` for sub-type dissolution.
 * All other categories return just the category key.
 */
export function featureGroupKey(category, feature) {
  if (category === 'LAND_COVER') {
    const type = feature.properties?.type || 'Unknown';
    return `LAND_COVER::${type}`;
  }
  return category;
}

// ── Style resolvers ──────────────────────────────────────────────────

/**
 * Returns Leaflet polygon style for a dissolved fill layer.
 * Used for the cartographic dissolved boundary display.
 */
export function dissolvedFillStyle(category, typeValue) {
  const colors = resolveColors(category, typeValue);
  return {
    fillColor: colors.fill,
    color: colors.stroke,
    weight: 2,
    fillOpacity: 0.30,
    interactive: false
  };
}

/**
 * Returns Leaflet polygon style for individual feature outlines (popup layer).
 * Applies status-based modifiers for differentiation.
 */
export function featureOutlineStyle(feature, category) {
  const props = feature.properties || {};
  const colors = resolveColors(category, props.type);
  const status = STATUS_STYLES[props.status] || DEFAULT_STATUS;

  return {
    fillColor: colors.fill,
    color: colors.stroke,
    weight: status.weight * 0.6,
    fillOpacity: 0,
    dashArray: status.dashArray || '4 3'
  };
}

/**
 * Returns Leaflet polygon style for reference layers.
 */
export function referencePolygonStyle(category, typeValue) {
  const colors = resolveColors(category, typeValue);
  return {
    fillColor: colors.fill,
    color: colors.stroke,
    weight: 1.5,
    fillOpacity: 0.08,
    dashArray: '8 4'
  };
}

/**
 * Returns Leaflet circleMarker options for a data point feature.
 */
export function pointMarkerStyle(feature, category) {
  const props = feature.properties || {};
  const colors = resolveColors(category, props.type);
  const isSpecies = SPECIES_CATS.has(category);

  return {
    radius: isSpecies ? 7 : 6,
    fillColor: colors.fill,
    color: '#fff',
    weight: 1.5,
    fillOpacity: 0.85
  };
}

/**
 * Returns Leaflet circleMarker options for a reference point feature.
 */
export function referencePointStyle(category) {
  const colors = resolveColors(category);
  const isSpecies = SPECIES_CATS.has(category);

  return {
    radius: isSpecies ? 6 : 5,
    fillColor: colors.fill,
    color: colors.stroke,
    weight: 1.5,
    fillOpacity: 0.30,
    dashArray: '3 3'
  };
}

/**
 * Returns Leaflet polygon style for print-map dissolved fills.
 * Slightly higher opacity than interactive map for print clarity.
 */
export function printDissolvedStyle(category, typeValue) {
  const colors = resolveColors(category, typeValue);
  return {
    fillColor: colors.fill,
    color: colors.stroke,
    weight: 2,
    fillOpacity: 0.35
  };
}

/**
 * Returns Leaflet circleMarker options for print-map points.
 */
export function printPointStyle(category) {
  const colors = resolveColors(category);
  const isSpecies = SPECIES_CATS.has(category);
  return {
    radius: isSpecies ? 6 : 5,
    fillColor: colors.fill,
    color: '#fff',
    weight: 1,
    fillOpacity: 0.85
  };
}

// ── Presence-based helpers (Resident / Extinct for species) ──────────

/** Extinct fill colour — desaturated red-grey */
const EXTINCT_FILL = '#B0BEC5';
const EXTINCT_STROKE = '#78909C';

/**
 * Checks if a feature's presence value indicates extinction.
 */
export function isExtinctPresence(feature) {
  const p = (feature.properties?.presence || feature.properties?.type || '').toLowerCase();
  return p.includes('extinct') || p.includes('possibly extinct') || p === 'ex';
}

/**
 * Returns Leaflet polygon style for extinct species areas on print maps.
 * Uses desaturated grey with hatched outline to distinguish from resident.
 */
export function printExtinctPolygonStyle(category) {
  return {
    fillColor: EXTINCT_FILL,
    color: EXTINCT_STROKE,
    weight: 2,
    fillOpacity: 0.25,
    dashArray: '6 4'
  };
}

/**
 * Returns Leaflet circleMarker style for extinct species points on print maps.
 */
export function printExtinctPointStyle(category) {
  return {
    radius: 6,
    fillColor: EXTINCT_FILL,
    color: EXTINCT_STROKE,
    weight: 1.5,
    fillOpacity: 0.5,
    dashArray: '4 3'
  };
}

// ── Legend helpers ────────────────────────────────────────────────────

/**
 * Collects the legend entries for a set of layers.
 * Returns an array of { key, label, fill, stroke } for building legends.
 * Expands LAND_COVER into sub-type entries.
 */
export function collectLegendEntries(layers) {
  const seen = new Map(); // key → { label, fill, stroke }

  for (const layerData of layers) {
    const meta = layerData.metadata;
    if (!meta) continue;
    const cat = meta.category || 'OTHER';
    const catLabel = meta.category
      ? (SYMBOLOGY[cat] ? undefined : cat) // use CATEGORIES label externally
      : 'Other';

    if (cat === 'LAND_COVER' && layerData.geojson?.features) {
      // Expand into sub-types
      const types = new Set();
      for (const f of layerData.geojson.features) {
        types.add(f.properties?.type || 'Unknown');
      }
      for (const t of types) {
        const key = `LAND_COVER::${t}`;
        if (!seen.has(key)) {
          const colors = resolveColors('LAND_COVER', t);
          seen.set(key, { label: t, fill: colors.fill, stroke: colors.stroke });
        }
      }
    } else if (!seen.has(cat)) {
      const colors = resolveColors(cat);
      seen.set(cat, { label: catLabel, fill: colors.fill, stroke: colors.stroke });
    }
  }

  return [...seen.entries()].map(([key, val]) => ({
    key,
    label: val.label,
    fill: val.fill,
    stroke: val.stroke
  }));
}
