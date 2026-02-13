/**
 * Layer category definitions and their default properties.
 */
export const CATEGORIES = {
  CCA: { label: 'Community Conserved Area', defaultRealm: 'terrestrial', color: '#2ecc71' },
  MPA: { label: 'Marine Protected Area', defaultRealm: 'marine', color: '#3498db' },
  PA: { label: 'Protected Area', defaultRealm: 'terrestrial', color: '#27ae60' },
  OECM: { label: 'Other Effective Conservation Measure', defaultRealm: 'terrestrial', color: '#9b59b6' },
  KBA: { label: 'Key Biodiversity Area', defaultRealm: 'terrestrial', color: '#e67e22' },
  RESTORATION: { label: 'Restoration Site', defaultRealm: 'terrestrial', color: '#f1c40f' },
  INVASIVE: { label: 'Invasive Species Area', defaultRealm: 'terrestrial', color: '#e74c3c' },
  OTHER: { label: 'Other', defaultRealm: 'terrestrial', color: '#95a5a6' }
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);

export const REALMS = ['terrestrial', 'marine'];

export const STATUS_OPTIONS = ['Designated', 'Proposed', 'Active', 'Inactive', 'Unknown'];
