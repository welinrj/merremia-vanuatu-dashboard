# DEPC Geospatial Inventory

**Department of Environment Protection and Conservation**  
**Vanuatu National Biodiversity Strategy and Action Plan (NBSAP)**

## Overview

This directory contains the centralized GIS database for DEPC, storing geospatial data in standardized formats with comprehensive metadata aligned to ISO 19115 standards.

## Directory Structure

```
/nbsap_geospatial_inventory
├── 01_boundaries/              # Administrative and political boundaries
├── 02_conservation_areas/      # Protected areas, reserves, sanctuaries
├── 03_ecosystems_land/        # Land cover, vegetation, ecosystems
├── 04_species/                # Species occurrence, distribution
├── 05_invasive_species/       # Invasive species monitoring (e.g., Merremia)
├── 06_restoration/            # Restoration sites, projects
├── 07_production_pollution/   # Agriculture, pollution sources
├── 08_urban_green_blue/       # Urban green/blue infrastructure
└── metadata/                  # Metadata catalog (JSON)
```

## Data Formats

### Primary (Web-Compatible)
- **GeoJSON** (EPSG:4326 - WGS84)

### Archive
- **Shapefile** (.shp, .shx, .dbf, .prj)

### Future Analysis
- **PostGIS** spatial database

## Naming Convention

Format: `{country}_{theme}_{dataset}_{year}_{version}`

**Examples:**
- `vut_boundaries_provinces_2024_v1.geojson`
- `vut_invasive_merremia_efate_2026_v2.geojson`
- `vut_conservation_marine_reserves_2025_v1.geojson`

**Components:**
- `country`: ISO 3166-1 alpha-3 code (VUT = Vanuatu)
- `theme`: Category (boundaries, invasive, conservation, etc.)
- `dataset`: Descriptive name (provinces, merremia_efate, etc.)
- `year`: Data collection/publication year
- `version`: v1, v2, v3...

## Metadata Standard

Each dataset includes ISO 19115 compliant metadata:

### Required Fields
1. **Dataset Name** - Full descriptive name
2. **Description** - Summary of dataset content
3. **Custodian Agency** - Responsible organization
4. **Contact Person** - Name and email
5. **Date Created** - Initial creation date (ISO 8601)
6. **Date Updated** - Last modification date (ISO 8601)
7. **Geographic Coverage** - Extent description
8. **Coordinate Reference System** - CRS/EPSG code
9. **Data Source** - Original source/methodology
10. **Methodology Summary** - Collection methods
11. **Data Limitations** - Known issues/constraints
12. **Access Classification** - Public / Restricted / Confidential
13. **Update Frequency** - Daily / Weekly / Monthly / Annual / Ad-hoc

## Access Control

### Public
- Freely accessible to all users
- No authentication required

### Restricted
- Requires DEPC staff login
- Approved partners only

### Confidential
- DEPC management only
- Sensitive environmental/cultural sites

## Usage

### Web Interface
Access the GIS database through the DEPC dashboard:
- Browse datasets by category
- Search metadata
- Preview on map
- Download in multiple formats

### Direct Access
Data can be accessed directly from this directory for GIS software (QGIS, ArcGIS):
```
file:///.../nbsap_geospatial_inventory/05_invasive_species/vut_invasive_merremia_efate_2026_v1.geojson
```

## Data Quality Standards

All datasets must:
- ✅ Use EPSG:4326 for GeoJSON
- ✅ Include complete metadata
- ✅ Follow naming convention
- ✅ Be validated for geometry errors
- ✅ Include data dictionary for attributes

## Maintenance

- **Custodians**: Update datasets according to specified frequency
- **DEPC IT**: Manage database, enforce standards
- **Review**: Annual metadata audit

---

**Managed by:** Department of Environment Protection and Conservation  
**Last Updated:** 2026-02-15  
**Contact:** gis@depc.gov.vu
