# Changelog

## [1.0.0] - 2026-02-13

### Added
- Initial release of Vanuatu NBSAP GIS Data Portal & Dashboard
- **Dashboard** with interactive Leaflet map, KPI widgets, and province breakdown
- **Data Portal** with layer listing, search, filter, and metadata sidebar
- **Admin** panel with passphrase auth, audit log, and backup/restore
- **About/Help** page with data sources and guidance

### Features
- Multi-target filtering (T1–T8) with province, category, realm, year
- Auto-cleaning pipeline for shapefile uploads:
  - CRS detection and reprojection (proj4)
  - Geometry validation and fixing (buffer(0), simplify)
  - Attribute standardization via config-driven field mappings
  - Province assignment via spatial join
  - Geodesic area calculation
- Union/dissolve for Target 3 no-double-counting
- TOR compliance checker
- Export: CSV, JSON reporting snapshot, GeoJSON per layer
- IndexedDB storage with full backup/restore
- Demo data: 6 CCAs + 5 MPAs with Vanuatu province boundaries
- Migration-ready architecture:
  - Storage adapter interface (IndexedDB / API)
  - Auth provider interface (local passphrase / API token)
  - Environment configuration for subpath deployments
  - Server stub with Express endpoints
  - Deployment docs for Nginx, Apache, IIS

### Technical
- Built with Vite 5, Leaflet 1.9, Turf.js 7, shpjs 4, proj4
- Fully client-side; runs on GitHub Pages
- Strict module separation: config, core, gis, ui, pages, services
