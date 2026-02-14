/**
 * Expected GIS data layers for Vanuatu's NBSAP.
 * Each entry defines a data layer that should be uploaded.
 * The tracker in the admin page shows which have been submitted.
 */
const EXPECTED_LAYERS = [
  {
    id: 'cca-terrestrial',
    name: 'Community Conserved Areas',
    category: 'CCA',
    target: 'T3',
    realm: 'terrestrial',
    countsToward30x30: true,
    description: 'Community-managed conservation areas across Vanuatu provinces'
  },
  {
    id: 'mpa-marine',
    name: 'Marine Protected Areas',
    category: 'MPA',
    target: 'T3',
    realm: 'marine',
    countsToward30x30: true,
    description: 'Nationally designated marine protected areas and management zones'
  },
  {
    id: 'pa-terrestrial',
    name: 'Protected Areas (WDPA)',
    category: 'PA',
    target: 'T3',
    realm: 'terrestrial',
    countsToward30x30: true,
    description: 'Protected areas from the World Database on Protected Areas'
  },
  {
    id: 'oecm-terrestrial',
    name: 'Other Effective Conservation Measures',
    category: 'OECM',
    target: 'T3',
    realm: 'terrestrial',
    countsToward30x30: true,
    description: 'OECMs contributing to in-situ conservation outside protected areas'
  },
  {
    id: 'kba-terrestrial',
    name: 'Key Biodiversity Areas',
    category: 'KBA',
    target: 'T1',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Sites of global importance for biodiversity (BirdLife / KBA Partnership)'
  },
  {
    id: 'restoration-sites',
    name: 'Ecosystem Restoration Sites',
    category: 'RESTORATION',
    target: 'T2',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Active and planned restoration sites for degraded ecosystems'
  },
  {
    id: 'invasive-species',
    name: 'Invasive Species Areas',
    category: 'INVASIVE',
    target: 'T6',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Areas affected by or managed for invasive alien species'
  }
];

export default EXPECTED_LAYERS;
