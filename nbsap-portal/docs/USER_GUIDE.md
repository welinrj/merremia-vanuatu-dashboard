# User Guide

## Overview

The Vanuatu NBSAP GIS Portal provides an interactive dashboard for viewing conservation data across Vanuatu's provinces, with a focus on Target 3 (30x30) progress monitoring.

## Dashboard Tab

### Interactive Map

- **Basemaps:** Click the layer control (top-right) to switch between OpenStreetMap, Esri Satellite, and CartoDB Light
- **Layer toggles:** Data layers display as colored polygons. Click any feature for a popup with details
- **Zoom/Pan:** Use mouse scroll or buttons to zoom; click and drag to pan

### Filters

The filter panel (left sidebar) controls all displayed data:

1. **NBSAP Target** — Click target codes (T1–T8) to toggle. Multiple targets can be selected. When empty, all targets are shown.
2. **Province** — Dropdown to filter by province. "All Provinces" shows everything.
3. **Category** — Filter by layer category (CCA, MPA, PA, etc.)
4. **Realm** — Terrestrial, Marine, or All
5. **Year** — Filter by establishment year

**Filtering order:** Target filter is applied first, then province, then additional filters.

All components respond to filters: the map, KPI widgets, province table, chart, and exports.

### KPI Widgets (Target 3)

When Target 3 is active (selected or no targets selected), you see:
- **Terrestrial conserved area** (hectares)
- **Marine conserved area** (hectares)
- **Progress bars** showing % of 30% target reached
- **Remaining %** to reach 30%
- **Feature count** and **province count**

When viewing other targets only (without T3), the KPIs show general summary metrics.

### Province Breakdown

The bottom panel shows:
- **Table:** Province-by-province breakdown with terrestrial/marine areas and feature counts
- **Bar chart:** Visual comparison of conservation area by province

### Exports

Three export buttons in the sidebar:
- **Export CSV** — Downloads a spreadsheet of all filtered features
- **Export JSON** — Downloads a TOR reporting snapshot with filters, metrics, and included layers
- **Export PNG** — Basic map screenshot (for full fidelity, use browser's screenshot feature)

## Data Portal Tab

Lists all loaded layers in a searchable, filterable table:
- Search by name, category, or filename
- Filter by target, category, or status
- Click a row to view detailed metadata in the sidebar
- Download cleaned GeoJSON for any layer

## Admin Tab

Public users see a login prompt. After authenticating:
- Upload new layers via the Data Portal
- Export/import project backups
- View the full audit log
- Export audit log as CSV
