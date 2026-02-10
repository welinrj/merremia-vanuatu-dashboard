# VCAP2 GIS Data Portal

Web-based geographic information system for the Vanuatu Climate Adaptation Project 2 (VCAP2) marine conservation programme.

## Live URLs

- **Map Portal**: https://welinrj.github.io/gis-data-portal/
- **Dashboard**: https://welinrj.github.io/gis-data-portal/dashboard.html
- **Overview**: https://welinrj.github.io/gis-data-portal/dashboard-overview.html

## Features

- Interactive Leaflet map with multiple basemaps (dark, satellite, streets)
- Upload GeoJSON, KML, and Shapefile files
- Attribute table viewer
- Analytics dashboard with Chart.js
- GitHub-integrated data storage
- Sample Vanuatu marine conservation data included

## Project Structure

```
gis-data-portal/
  index.html              - Main map viewer
  app.js                  - Application logic
  dashboard.html          - Analytics dashboard
  dashboard.js            - Dashboard logic
  dashboard-overview.html - Portal overview
  data/
    index.json            - Dataset catalog
    sample-marine-areas.geojson - Sample data
  .github/workflows/
    deploy.yml            - GitHub Pages deployment
```

## Data

Sample data includes 5 marine conservation areas in Vanuatu's Shefa Province:
- Hideaway Island Marine Reserve
- Nguna-Pele Marine Protected Area
- Tranquility Island Conservation Zone
- Lelepa Island Marine Sanctuary
- Erakor Lagoon Marine Area
