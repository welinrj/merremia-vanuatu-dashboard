/**
 * Layer category definitions and their default properties.
 * Covers all NBSAP/GBF targets for Vanuatu.
 *
 * Each category includes:
 *   - label: human-readable name
 *   - defaultRealm: 'terrestrial' or 'marine'
 *   - color: primary UI color (badges, pills, accents)
 *
 * SVG icons are defined separately in config/icons.js (Lucide, ISC License).
 */
export const CATEGORIES = {
  // ── Boundary / Reference ──────────────────────────────────────────
  EEZ:             { label: 'Exclusive Economic Zone',            defaultRealm: 'marine',      color: '#0277BD' },
  ADMIN_BOUNDARY:  { label: 'National Boundary (Admin0)',         defaultRealm: 'terrestrial', color: '#37474F' },

  // ── Conservation (green spectrum) ─────────────────────────────────
  CCA:             { label: 'Community Conserved Area',           defaultRealm: 'terrestrial', color: '#2E7D32' },
  MPA:             { label: 'Marine Protected Area',              defaultRealm: 'marine',      color: '#1565C0' },
  PA:              { label: 'Protected Area',                     defaultRealm: 'terrestrial', color: '#1B5E20' },
  OECM:            { label: 'Other Effective Conservation Measure', defaultRealm: 'terrestrial', color: '#7E57C2' },
  KBA:             { label: 'Key Biodiversity Area',              defaultRealm: 'terrestrial', color: '#EF6C00' },
  LMMA:            { label: 'Locally Managed Marine Area',        defaultRealm: 'marine',      color: '#00796B' },
  INLAND_WATER:    { label: 'Inland Water',                       defaultRealm: 'terrestrial', color: '#4FC3F7' },

  // ── Planning ──────────────────────────────────────────────────────
  SPATIAL_PLAN:    { label: 'Biodiversity Spatial Plan',          defaultRealm: 'terrestrial', color: '#78909C' },

  // ── Degradation & Restoration ─────────────────────────────────────
  DEGRADED:        { label: 'Degraded Area',                      defaultRealm: 'terrestrial', color: '#D84315' },
  RESTORATION:     { label: 'Restoration Site',                   defaultRealm: 'terrestrial', color: '#F9A825' },

  // ── Species (distinctive per-taxon colours) ───────────────────────
  SPECIES_DIST:    { label: 'Species Distribution',               defaultRealm: 'terrestrial', color: '#26A69A' },
  MEGAPODE:        { label: 'Vanuatu Megapode',                   defaultRealm: 'terrestrial', color: '#E65100' },
  STARLING:        { label: 'Mountain Starling',                  defaultRealm: 'terrestrial', color: '#5C6BC0' },
  FANTAIL:         { label: 'Streaked Fantail',                   defaultRealm: 'terrestrial', color: '#FFB300' },
  KINGFISHER:      { label: 'Vanuatu Kingfisher',                 defaultRealm: 'terrestrial', color: '#00ACC1' },
  FLYING_FOX:      { label: 'Vanuatu Flying Fox',                 defaultRealm: 'terrestrial', color: '#6D4C41' },
  PLERANDRA:       { label: 'Plerandra vanuatuensis',             defaultRealm: 'terrestrial', color: '#66BB6A' },

  // ── Threats / Invasive (warm/red spectrum) ────────────────────────
  INVASIVE:        { label: 'Invasive Alien Species',             defaultRealm: 'terrestrial', color: '#C62828' },
  MERREMIA:        { label: 'Merremia peltata (Big Leaf)',        defaultRealm: 'terrestrial', color: '#BF360C' },
  CROWN_OF_THORNS: { label: 'Crown of Thorns Starfish',          defaultRealm: 'marine',      color: '#FF6F00' },
  MILE_A_MINUTE:   { label: 'Mile a Minute Vine',                defaultRealm: 'terrestrial', color: '#AD1457' },
  SOLANUM_TORVUM:  { label: 'Solanum torvum (Devil Fig)',         defaultRealm: 'terrestrial', color: '#6A1B9A' },

  // ── Chemical / Pollution ──────────────────────────────────────────
  PESTICIDE:       { label: 'Pesticide / Herbicide Area',        defaultRealm: 'terrestrial', color: '#8E24AA' },
  EUTROPHICATION:  { label: 'Coastal Eutrophication Zone',       defaultRealm: 'marine',      color: '#D81B60' },

  // ── Land use & Green space ────────────────────────────────────────
  LAND_COVER:      { label: 'Land Cover / Land Use',             defaultRealm: 'terrestrial', color: '#795548' },
  GREEN_SPACE:     { label: 'Blue & Green Space',                defaultRealm: 'terrestrial', color: '#388E3C' },

  // ── Fallback ──────────────────────────────────────────────────────
  OTHER:           { label: 'Other',                              defaultRealm: 'terrestrial', color: '#78909C' }
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);

export const REALMS = ['terrestrial', 'marine'];

export const STATUS_OPTIONS = ['Designated', 'Proposed', 'Active', 'Inactive', 'Unknown'];
