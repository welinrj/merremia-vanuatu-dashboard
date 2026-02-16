/**
 * Layer category definitions and their default properties.
 * Covers all NBSAP/GBF targets for Vanuatu.
 */
export const CATEGORIES = {
  CCA: { label: 'Community Conserved Area', defaultRealm: 'terrestrial', color: '#2ecc71' },
  MPA: { label: 'Marine Protected Area', defaultRealm: 'marine', color: '#3498db' },
  PA: { label: 'Protected Area', defaultRealm: 'terrestrial', color: '#27ae60' },
  OECM: { label: 'Other Effective Conservation Measure', defaultRealm: 'terrestrial', color: '#9b59b6' },
  KBA: { label: 'Key Biodiversity Area', defaultRealm: 'terrestrial', color: '#e67e22' },
  LMMA: { label: 'Locally Managed Marine Area', defaultRealm: 'marine', color: '#1abc9c' },
  SPATIAL_PLAN: { label: 'Biodiversity Spatial Plan', defaultRealm: 'terrestrial', color: '#2c3e50' },
  DEGRADED: { label: 'Degraded Area', defaultRealm: 'terrestrial', color: '#d35400' },
  RESTORATION: { label: 'Restoration Site', defaultRealm: 'terrestrial', color: '#f1c40f' },
  SPECIES_DIST: { label: 'Species Distribution', defaultRealm: 'terrestrial', color: '#16a085' },
  INVASIVE: { label: 'Invasive Alien Species', defaultRealm: 'terrestrial', color: '#e74c3c' },
  MERREMIA: { label: 'Merremia peltata Detection', defaultRealm: 'terrestrial', color: '#c0392b' },
  PESTICIDE: { label: 'Pesticide / Herbicide Area', defaultRealm: 'terrestrial', color: '#8e44ad' },
  EUTROPHICATION: { label: 'Coastal Eutrophication Zone', defaultRealm: 'marine', color: '#e91e63' },
  LAND_COVER: { label: 'Land Cover / Land Use', defaultRealm: 'terrestrial', color: '#795548' },
  GREEN_SPACE: { label: 'Blue & Green Space', defaultRealm: 'terrestrial', color: '#4caf50' },
  OTHER: { label: 'Other', defaultRealm: 'terrestrial', color: '#95a5a6' }
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);

export const REALMS = ['terrestrial', 'marine'];

export const STATUS_OPTIONS = ['Designated', 'Proposed', 'Active', 'Inactive', 'Unknown'];
