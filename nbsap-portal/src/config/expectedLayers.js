/**
 * Expected GIS data layers for Vanuatu's NBSAP.
 * Each entry defines a data layer that should be uploaded.
 * The tracker in the admin page shows which have been submitted.
 */
const EXPECTED_LAYERS = [
  // Reference layers (EEZ & Admin0 — used for T1 marine calculation)
  {
    id: 'eez-boundary',
    name: 'Exclusive Economic Zone (EEZ)',
    category: 'EEZ',
    target: 'T1',
    realm: 'marine',
    countsToward30x30: false,
    isReference: true,
    description: 'Vanuatu EEZ boundary — used to derive marine spatial planning coverage (EEZ minus land area)'
  },
  {
    id: 'admin0-boundary',
    name: 'National Boundary (Admin0 Coastline)',
    category: 'ADMIN_BOUNDARY',
    target: 'T1',
    realm: 'terrestrial',
    countsToward30x30: false,
    isReference: true,
    description: 'Vanuatu national boundary / coastline — subtracted from EEZ to compute net marine area'
  },
  // Target 1: Biodiversity Spatial Planning
  {
    id: 'spatial-plans',
    name: 'Biodiversity Spatial Plans',
    category: 'SPATIAL_PLAN',
    target: 'T1',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Provincial and municipal physical plans with CCA boundary zones and marine spatial planning areas'
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
  // Target 2: Degraded Areas & Restoration
  {
    id: 'degraded-terrestrial',
    name: 'Degraded Terrestrial Areas',
    category: 'DEGRADED',
    target: 'T2',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Mapped degraded terrestrial and inland water ecosystems'
  },
  {
    id: 'degraded-marine',
    name: 'Degraded Marine & Coastal Areas',
    category: 'DEGRADED',
    target: 'T2',
    realm: 'marine',
    countsToward30x30: false,
    description: 'Mapped degraded marine and coastal ecosystems'
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
  // Target 3: 30x30 Conservation
  {
    id: 'cca-terrestrial',
    name: 'Community Conserved Areas',
    category: 'CCA',
    target: 'T3',
    realm: 'terrestrial',
    countsToward30x30: true,
    description: 'Community-managed conservation areas (Custom Tabu Areas, Community Conservation Areas)'
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
    id: 'lmma-marine',
    name: 'Locally Managed Marine Areas',
    category: 'LMMA',
    target: 'T3',
    realm: 'marine',
    countsToward30x30: true,
    description: 'LMMAs managed by local communities for marine resource conservation'
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
  // Target 4: Species & Biodiversity Distribution
  {
    id: 'megapode-distribution',
    name: 'Vanuatu Megapode Distribution',
    category: 'MEGAPODE',
    target: 'T4',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Distribution range and nesting sites of Megapodius layardi (Vanuatu Megapode) — endemic ground-nesting bird'
  },
  {
    id: 'starling-distribution',
    name: 'Vanuatu Mountain Starling Distribution',
    category: 'STARLING',
    target: 'T4',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Distribution range of Aplonis santovestris (Vanuatu Mountain Starling) — critically endangered endemic bird'
  },
  {
    id: 'fantail-distribution',
    name: 'Vanuatu Streaked Fantail Distribution',
    category: 'FANTAIL',
    target: 'T4',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Distribution range of Rhipidura spilodera (Vanuatu Streaked Fantail) — endemic passerine bird'
  },
  {
    id: 'kingfisher-distribution',
    name: 'Vanuatu Kingfisher Distribution',
    category: 'KINGFISHER',
    target: 'T4',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Distribution range of Todiramphus farquhari (Vanuatu Kingfisher) — endemic kingfisher species'
  },
  {
    id: 'flying-fox-distribution',
    name: 'Vanuatu Flying Fox Distribution',
    category: 'FLYING_FOX',
    target: 'T4',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Distribution range and roost sites of Pteropus anetianus (Vanuatu Flying Fox) — endemic fruit bat'
  },
  {
    id: 'plerandra-distribution',
    name: 'Plerandra vanuatuensis Distribution',
    category: 'PLERANDRA',
    target: 'T4',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Distribution range of Plerandra vanuatuensis — endemic plant species of Vanuatu'
  },
  {
    id: 'kba-t4',
    name: 'Key Biodiversity Areas',
    category: 'KBA',
    target: 'T4',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Key Biodiversity Areas (KBAs) of Vanuatu — sites of global importance for biodiversity (BirdLife / KBA Partnership)'
  },
  // Target 6: Invasive Alien Species
  {
    id: 'merremia-detection',
    name: 'Merremia peltata (Big Leaf)',
    category: 'MERREMIA',
    target: 'T6',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Remote sensing and field survey detections of Merremia peltata invasive vine coverage'
  },
  {
    id: 'crown-of-thorns',
    name: 'Crown of Thorns Starfish',
    category: 'CROWN_OF_THORNS',
    target: 'T6',
    realm: 'marine',
    countsToward30x30: false,
    description: 'Acanthaster planci (Crown-of-Thorns starfish) outbreak locations and affected reef areas'
  },
  {
    id: 'mile-a-minute',
    name: 'Mile a Minute Vine',
    category: 'MILE_A_MINUTE',
    target: 'T6',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Mikania micrantha (Mile a Minute) invasive vine distribution and coverage areas'
  },
  {
    id: 'solanum-torvum',
    name: 'Solanum torvum (Devil Fig)',
    category: 'SOLANUM_TORVUM',
    target: 'T6',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Solanum torvum (Devil Fig / Prickly Nightshade) distribution and infestation areas'
  },
  {
    id: 'invasive-species',
    name: 'Other Invasive Alien Species',
    category: 'INVASIVE',
    target: 'T6',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Fire Ants, African Snail, Sako, Coconut Beetle and other IAS'
  },
  // Target 7: Pesticide & Herbicide
  {
    id: 'pesticide-areas',
    name: 'Pesticide & Herbicide Use Areas',
    category: 'PESTICIDE',
    target: 'T7',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Areas of pesticide and herbicide use in large-scale and small-scale commercial farming'
  },
  // Target 8: Coastal Eutrophication
  {
    id: 'eutrophication-zones',
    name: 'Coastal Eutrophication Zones',
    category: 'EUTROPHICATION',
    target: 'T8',
    realm: 'marine',
    countsToward30x30: false,
    description: 'Mapped coastal eutrophication and nutrient-impacted zones'
  },
  // Target 10: Land Cover Change
  {
    id: 'land-cover',
    name: 'Land Cover / Land Use Change',
    category: 'LAND_COVER',
    target: 'T10',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Land cover change mapping for agriculture, livestock, fisheries and forestry'
  },
  // Target 12: Blue & Green Spaces
  {
    id: 'green-spaces',
    name: 'Blue & Green Spaces',
    category: 'GREEN_SPACE',
    target: 'T12',
    realm: 'terrestrial',
    countsToward30x30: false,
    description: 'Parks within provincial and municipal areas, and botanical gardens'
  }
];

export default EXPECTED_LAYERS;
