/**
 * Layer category definitions and their default properties.
 * Covers all NBSAP/GBF targets for Vanuatu.
 *
 * Each category includes:
 *   - label: human-readable name
 *   - icon: Unicode symbol for UI display
 *   - defaultRealm: 'terrestrial' or 'marine'
 *   - color: primary UI color (badges, pills, accents)
 */
export const CATEGORIES = {
  // ── Boundary / Reference ──────────────────────────────────────────
  EEZ:             { label: 'Exclusive Economic Zone',            icon: '⚓',  defaultRealm: 'marine',      color: '#0277BD' },
  ADMIN_BOUNDARY:  { label: 'National Boundary (Admin0)',         icon: '🏛',  defaultRealm: 'terrestrial', color: '#546E7A' },

  // ── Conservation (green spectrum) ─────────────────────────────────
  CCA:             { label: 'Community Conserved Area',           icon: '🏘',  defaultRealm: 'terrestrial', color: '#43A047' },
  MPA:             { label: 'Marine Protected Area',              icon: '🌊',  defaultRealm: 'marine',      color: '#1565C0' },
  PA:              { label: 'Protected Area',                     icon: '🛡',  defaultRealm: 'terrestrial', color: '#1B5E20' },
  OECM:            { label: 'Other Effective Conservation Measure', icon: '✦', defaultRealm: 'terrestrial', color: '#7E57C2' },
  KBA:             { label: 'Key Biodiversity Area',              icon: '★',   defaultRealm: 'terrestrial', color: '#F57C00' },
  LMMA:            { label: 'Locally Managed Marine Area',        icon: '🐟',  defaultRealm: 'marine',      color: '#00897B' },

  // ── Planning ──────────────────────────────────────────────────────
  SPATIAL_PLAN:    { label: 'Biodiversity Spatial Plan',          icon: '🗺',  defaultRealm: 'terrestrial', color: '#455A64' },

  // ── Degradation & Restoration ─────────────────────────────────────
  DEGRADED:        { label: 'Degraded Area',                      icon: '⚠',   defaultRealm: 'terrestrial', color: '#D84315' },
  RESTORATION:     { label: 'Restoration Site',                   icon: '🌱',  defaultRealm: 'terrestrial', color: '#F9A825' },

  // ── Species (distinctive per-taxon colours) ───────────────────────
  SPECIES_DIST:    { label: 'Species Distribution',               icon: '🔬',  defaultRealm: 'terrestrial', color: '#26A69A' },
  MEGAPODE:        { label: 'Vanuatu Megapode',                   icon: '🐦',  defaultRealm: 'terrestrial', color: '#E65100' },
  STARLING:        { label: 'Mountain Starling',                  icon: '🐦',  defaultRealm: 'terrestrial', color: '#5C6BC0' },
  FANTAIL:         { label: 'Streaked Fantail',                   icon: '🐦',  defaultRealm: 'terrestrial', color: '#FFB300' },
  KINGFISHER:      { label: 'Vanuatu Kingfisher',                 icon: '🐦',  defaultRealm: 'terrestrial', color: '#00ACC1' },
  FLYING_FOX:      { label: 'Vanuatu Flying Fox',                 icon: '🦇',  defaultRealm: 'terrestrial', color: '#6D4C41' },
  PLERANDRA:       { label: 'Plerandra vanuatuensis',             icon: '🌿',  defaultRealm: 'terrestrial', color: '#66BB6A' },

  // ── Threats / Invasive (warm/red spectrum) ────────────────────────
  INVASIVE:        { label: 'Invasive Alien Species',             icon: '🚫',  defaultRealm: 'terrestrial', color: '#C62828' },
  MERREMIA:        { label: 'Merremia peltata (Big Leaf)',        icon: '🍂',  defaultRealm: 'terrestrial', color: '#BF360C' },
  CROWN_OF_THORNS: { label: 'Crown of Thorns Starfish',          icon: '⊛',   defaultRealm: 'marine',      color: '#FF6F00' },
  MILE_A_MINUTE:   { label: 'Mile a Minute Vine',                icon: '🌀',  defaultRealm: 'terrestrial', color: '#AD1457' },
  SOLANUM_TORVUM:  { label: 'Solanum torvum (Devil Fig)',         icon: '🌵',  defaultRealm: 'terrestrial', color: '#6A1B9A' },

  // ── Chemical / Pollution ──────────────────────────────────────────
  PESTICIDE:       { label: 'Pesticide / Herbicide Area',        icon: '⚗',   defaultRealm: 'terrestrial', color: '#8E24AA' },
  EUTROPHICATION:  { label: 'Coastal Eutrophication Zone',       icon: '💧',  defaultRealm: 'marine',      color: '#D81B60' },

  // ── Land use & Green space ────────────────────────────────────────
  LAND_COVER:      { label: 'Land Cover / Land Use',             icon: '🗂',  defaultRealm: 'terrestrial', color: '#795548' },
  GREEN_SPACE:     { label: 'Blue & Green Space',                icon: '🌳',  defaultRealm: 'terrestrial', color: '#388E3C' },

  // ── Fallback ──────────────────────────────────────────────────────
  OTHER:           { label: 'Other',                              icon: '●',   defaultRealm: 'terrestrial', color: '#78909C' }
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);

export const REALMS = ['terrestrial', 'marine'];

export const STATUS_OPTIONS = ['Designated', 'Proposed', 'Active', 'Inactive', 'Unknown'];
