/**
 * Environment configuration for the Vanuatu NBSAP Portal.
 * Adjust these values for different deployment targets:
 * - GitHub Pages: basePath = '/repo-name/' or './'
 * - Government server: basePath = '/', apiBaseUrl = 'https://api.gov.vu/nbsap'
 * - DEPC subpath: basePath = '/nbsap-portal/'
 */
const ENV = {
  /** Base path for all asset and route URLs */
  basePath: './',

  /** API base URL — blank for static-only mode */
  apiBaseUrl: '',

  /** Storage backend: 'firestore' | 'indexeddb' | 'api' */
  storageBackend: 'firestore',

  /** Auth provider: 'local-passphrase' | 'api-token' */
  authProvider: 'local-passphrase',

  /** Tile sources for Leaflet basemaps */
  tileSources: {
    osm: {
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    },
    esriSatellite: {
      name: 'Esri Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
      maxZoom: 18
    },
    cartoLight: {
      name: 'CartoDB Light',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19
    }
  },

  /** Upload limits */
  maxUploadSizeMB: 1024,
  maxFeaturesPerLayer: 50000,

  /** Geometry cleaning defaults */
  sliverThresholdM2: 5,
  simplifyTolerance: 0.0001,

  /**
   * National baseline areas for 30x30 calculations (hectares).
   * terrestrial_ha: Vanuatu total land area — 12,189 km² (UN Stats, 2020)
   * marine_ha:      Vanuatu EEZ — 663,251 km² (VLIZ Maritime Boundaries, 2023)
   */
  nationalBaselines: {
    terrestrial_ha: 1218900,
    marine_ha: 66325100
  },

  /** Default map center and zoom for Vanuatu */
  mapCenter: [-16.5, 168.0],
  mapZoom: 7
};

export default ENV;
