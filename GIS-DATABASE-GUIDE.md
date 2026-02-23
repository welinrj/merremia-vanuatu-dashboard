# DEPC GIS Database System - User Guide

**Department of Environment Protection and Conservation**
**Vanuatu National Biodiversity Strategy and Action Plan (NBSAP)**

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Uploading Datasets](#uploading-datasets)
5. [Browsing & Searching](#browsing--searching)
6. [Metadata Standards](#metadata-standards)
7. [Data Formats](#data-formats)
8. [Naming Convention](#naming-convention)
9. [Access Control](#access-control)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Overview

The DEPC GIS Database is a centralized geospatial data repository designed to store, manage, and share GIS data for environmental conservation and biodiversity monitoring in Vanuatu. The system follows **ISO 19115** metadata standards and supports both raster and vector formats.

### Key Benefits

- ✅ **Centralized Storage**: All GIS data in one secure location
- ✅ **ISO 19115 Compliant**: International metadata standards
- ✅ **Web-Compatible**: GeoJSON for easy web mapping
- ✅ **Searchable Catalog**: Find datasets by keyword, category, custodian
- ✅ **Access Control**: Public, Restricted, and Confidential classifications
- ✅ **Offline-Capable**: Works without internet connection
- ✅ **Export-Ready**: Download metadata catalogs in JSON/CSV

---

## Features

### 1. Dataset Management
- Upload GeoJSON files with automatic validation
- Store comprehensive ISO 19115 metadata
- Edit and update existing datasets
- Delete datasets with confirmation
- Download data and metadata

### 2. Search & Discovery
- Full-text search across dataset names, descriptions, keywords
- Filter by category (8 thematic categories)
- Filter by access level (Public/Restricted/Confidential)
- Filter by custodian agency
- Sort by date, name, or relevance

### 3. Metadata Catalog
- Export all metadata as JSON or CSV
- View detailed metadata for each dataset
- ISO 19115 compliant metadata structure
- Automatic metadata generation from uploaded files

### 4. Data Organization
```
/nbsap_geospatial_inventory
├── 01_boundaries/              # Administrative boundaries
├── 02_conservation_areas/      # Protected areas
├── 03_ecosystems_land/        # Ecosystems & land cover
├── 04_species/                # Species distribution
├── 05_invasive_species/       # Invasive species (e.g., Merremia)
├── 06_restoration/            # Restoration sites
├── 07_production_pollution/   # Production & pollution
├── 08_urban_green_blue/       # Urban green/blue infrastructure
└── metadata/                  # Metadata catalog (JSON)
```

---

## Getting Started

### Accessing the GIS Database

1. **Navigate to Staff Portal**
   - Log in to the DEPC dashboard
   - Click "Staff Portal" in the sidebar
   - Select "GIS Database"

2. **Dashboard Overview**
   - **Total Datasets**: Count of all datasets
   - **Public Datasets**: Publicly accessible data
   - **GeoJSON Datasets**: Web-compatible format count
   - **Active Categories**: Number of categories with data

3. **Navigation Tabs**
   - **Browse Datasets**: Search and view all datasets
   - **Upload Dataset**: Add new geospatial data
   - **Metadata Catalog**: Export and review metadata

---

## Uploading Datasets

### Step-by-Step Upload Process

#### Step 1: Prepare Your Data

**Supported Formats:**
- ✅ GeoJSON (.geojson, .json)
- ⏳ Shapefile (.shp.zip) - Coming soon
- ⏳ GeoTIFF (.tif) - Coming soon

**Data Requirements:**
- Must be valid GeoJSON
- Coordinate Reference System: **EPSG:4326** (WGS84) recommended
- File size: <50MB (browser storage limit)
- No geometry errors (self-intersections, invalid coordinates)

**Validation Checklist:**
```json
{
  "type": "FeatureCollection",  // Required
  "features": [                  // Required array
    {
      "type": "Feature",
      "geometry": { ... },       // Valid geometry
      "properties": { ... }      // Attributes
    }
  ]
}
```

#### Step 2: Upload File

1. Click **"Upload Dataset"** tab
2. Click **"Choose a file"** or drag-and-drop
3. System validates GeoJSON structure
4. Auto-detects: geometry type, feature count, file size
5. If valid ✅ → Proceed to metadata
6. If invalid ❌ → Error message displayed

#### Step 3: Complete Metadata Form

**Required Fields (marked with *):**

##### Core Identification
- **Dataset Name**: Descriptive name
  - Example: `Merremia Peltata Distribution - Efate Island 2026`
- **Description**: Detailed summary (2-3 sentences)
- **Category**: Select from 8 thematic categories
- **Access Classification**: Public / Restricted / Confidential

##### Responsibility
- **Custodian Agency**: Responsible organization
  - Example: `Department of Environment Protection and Conservation`
- **Contact Person**: Full name of data custodian
- **Contact Email**: Valid email address
- **Contact Phone**: Optional (+678 format)

##### Spatial & Temporal
- **Geographic Coverage**: Area description
  - Example: `Efate Island`, `All Vanuatu`, `Shefa Province`
- **Update Frequency**: How often data is refreshed
  - Options: Daily, Weekly, Monthly, Quarterly, Annual, Ad-hoc
- **CRS**: Coordinate Reference System (default: EPSG:4326)
- **Spatial Accuracy**: Optional (e.g., `±5m`, `±50m`)

##### Lineage
- **Data Source**: Origin of the data
  - Example: `Field survey by DEPC officers using mobile PWA`
- **Methodology Summary**: How data was collected
  - Example: `Ground-based observations with GPS-enabled devices`
- **Data Limitations**: Known issues or constraints
  - Example: `GPS accuracy ±5-15m. Incomplete coverage in remote areas.`

##### Keywords
- Add relevant keywords for discoverability
- Press Enter or click "Add" after typing each keyword
- Examples: `invasive species`, `Merremia peltata`, `biodiversity`

#### Step 4: Submit

1. Click **"Upload Dataset"**
2. System generates unique ID and filename
3. Stores data + metadata in browser storage
4. Success confirmation displayed
5. Dataset appears in Browse view

---

## Browsing & Searching

### Search Interface

**Search Bar:**
- Type keywords, dataset names, descriptions
- Searches across all text fields
- Real-time filtering

**Filters:**
- **Category**: Filter by thematic category
- **Access Level**: Public / Restricted / Confidential
- **Custodian**: Filter by agency name

**Clear Filters:**
- Click "Clear all filters" to reset

### Dataset Cards

Each dataset displays:
- 🗺️ **Category Icon** and name
- 🔒 **Access Badge** (Public/Restricted/Confidential)
- 📊 **Format Badge** (GeoJSON, Shapefile, etc.)
- **Description** (truncated)
- **Custodian Agency**
- **Geographic Coverage**
- **Last Updated Date**
- **CRS** (Coordinate Reference System)
- **Keywords** (first 4 shown)

### Actions

- **View Details**: Opens detailed metadata modal
- **📄 Download Metadata**: Download JSON metadata file
- **⬇️ Download Data**: Download GeoJSON file
- **🗑️ Delete**: Remove dataset (requires confirmation)

---

## Metadata Standards

### ISO 19115 Core Elements

The system implements **13 mandatory metadata fields** aligned with ISO 19115:

| Element | Description | Example |
|---------|-------------|---------|
| **Dataset Name** | Full descriptive title | "Merremia Peltata Distribution - Efate 2026" |
| **Description** | Summary of content | "Point locations of invasive vine observations..." |
| **Custodian Agency** | Responsible organization | "Department of Environment" |
| **Contact Person** | Data custodian name | "John Doe" |
| **Date Created** | Initial creation date | "2026-02-10" |
| **Date Updated** | Last modification | "2026-02-15" |
| **Geographic Coverage** | Spatial extent | "Efate Island, Shefa Province" |
| **CRS** | Coordinate system | "EPSG:4326" |
| **Data Source** | Origin/methodology | "Field survey by DEPC officers" |
| **Methodology Summary** | Collection methods | "GPS-enabled mobile devices..." |
| **Data Limitations** | Known constraints | "GPS accuracy ±5-15m" |
| **Access Classification** | Security level | "Public" |
| **Update Frequency** | Refresh schedule | "Monthly" |

### Optional Metadata Fields

- **Bounding Box**: North, South, East, West coordinates
- **Spatial Accuracy**: Precision estimate
- **Completeness**: 0-100% coverage estimate
- **Feature Count**: Number of features (auto-detected)
- **File Size**: Bytes (auto-detected)
- **Geometry Type**: Point, Line, Polygon (auto-detected)
- **License Type**: Data license
- **Related Datasets**: IDs of linked datasets
- **Citations**: Bibliographic references
- **Thumbnail**: Preview image (base64 or URL)

---

## Data Formats

### Primary Format: GeoJSON

**Why GeoJSON?**
- ✅ Web-native format (JSON)
- ✅ Human-readable
- ✅ Works with Leaflet, Mapbox, OpenLayers
- ✅ Directly usable in web applications
- ✅ GitHub-friendly (version control)

**Structure:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [168.3273, -17.7333]
      },
      "properties": {
        "species": "Merremia peltata",
        "location": "Mele Bay",
        "date": "2026-02-10"
      }
    }
  ]
}
```

### Archive Format: Shapefile (Coming Soon)

- Upload as `.shp.zip` (all components bundled)
- Automatically converted to GeoJSON for web use
- Original shapefile stored for GIS software compatibility

### Future Formats

- **GeoTIFF**: Raster data (satellite imagery, DEMs)
- **KML**: Google Earth compatibility
- **GML**: OGC standard XML format
- **PostGIS**: PostgreSQL spatial database integration

---

## Naming Convention

### Standard Format

```
{country}_{theme}_{dataset}_{year}_{version}.{extension}
```

**Components:**
- `country`: ISO 3166-1 alpha-3 code (**VUT** = Vanuatu)
- `theme`: Category keyword (boundaries, invasive, conservation)
- `dataset`: Descriptive name (provinces, merremia_efate)
- `year`: Data collection/publication year (2026)
- `version`: v1, v2, v3...
- `extension`: .geojson, .shp.zip, .tif

### Examples

| File Name | Description |
|-----------|-------------|
| `vut_boundaries_provinces_2024_v1.geojson` | Provincial boundaries, 2024, version 1 |
| `vut_invasive_merremia_efate_2026_v2.geojson` | Merremia on Efate, 2026, version 2 |
| `vut_conservation_marine_reserves_2025_v1.geojson` | Marine protected areas, 2025, v1 |
| `vut_ecosystems_landcover_tanna_2024_v1.geojson` | Land cover on Tanna, 2024, v1 |

### Auto-Generation

The system **automatically generates** filenames when you upload:
1. Extracts country code (VUT)
2. Uses selected category as theme
3. Derives dataset name from "Dataset Name" field
4. Uses current year
5. Starts at version 1
6. Appends format extension

**You don't need to manually name files!**

---

## Access Control

### Classification Levels

#### 1. Public 🌐
- **Accessible to**: Everyone
- **Use Cases**:
  - General biodiversity data
  - Administrative boundaries
  - Public parks and reserves
  - Educational datasets
- **Examples**:
  - Provincial boundaries
  - Public conservation areas
  - General species distribution

#### 2. Restricted 🔒
- **Accessible to**: DEPC staff and approved partners
- **Use Cases**:
  - Ongoing research data
  - Partner-shared datasets
  - Pre-publication data
  - Working drafts
- **Examples**:
  - Active field survey data
  - Collaborative research datasets
  - Draft management plans

#### 3. Confidential 🔐
- **Accessible to**: DEPC management only
- **Use Cases**:
  - Threatened species locations
  - Culturally sensitive sites
  - Law enforcement data
  - Strategic planning
- **Examples**:
  - Endangered turtle nesting sites
  - Sacred cultural sites
  - Illegal logging locations

### Setting Access Level

1. During upload, select **Access Classification** dropdown
2. Choose: Public / Restricted / Confidential
3. System displays appropriate icon and badge
4. Access level shown in browse view

**Note:** Current version stores data locally in browser. Future versions will implement server-side authentication for Restricted/Confidential datasets.

---

## Best Practices

### Data Quality

1. **Validate Before Upload**
   - Use [geojson.io](https://geojson.io) to validate geometry
   - Check for self-intersections, invalid coordinates
   - Ensure CRS is EPSG:4326 for GeoJSON

2. **Attribute Completeness**
   - Include descriptive property names
   - Use consistent field names across datasets
   - Avoid special characters in property keys

3. **Geometry Precision**
   - Use appropriate decimal places (6 digits for lat/lon)
   - Remove unnecessary vertices
   - Simplify complex geometries when possible

### Metadata Best Practices

1. **Descriptive Names**
   - Be specific: ❌ "Species Data" → ✅ "Fruit Bat Distribution - Santo Island"
   - Include location and year
   - Use plain language, avoid jargon

2. **Detailed Descriptions**
   - Explain what, where, when, why
   - Mention methodology briefly
   - State primary use case

3. **Accurate Keywords**
   - Use 5-10 keywords
   - Include scientific and common names
   - Add location names (island, province)
   - Use standardized terms (NBSAP, biodiversity, conservation)

4. **Contact Information**
   - Use official email addresses
   - Keep contact info current
   - Specify custodian clearly

### Data Versioning

1. **When to Create New Version**
   - Significant data updates
   - Methodology changes
   - Boundary adjustments
   - Error corrections

2. **Version Numbering**
   - Start at v1
   - Increment for major changes (v2, v3...)
   - Use sub-versions for minor edits (v1.1, v1.2) - manual naming

3. **Version Documentation**
   - Update "Date Updated" field
   - Mention changes in Description
   - Keep old versions if needed (manual backup)

### Regular Maintenance

- **Monthly**: Review new datasets for quality
- **Quarterly**: Update frequently-changing datasets
- **Annually**: Audit metadata accuracy
- **As Needed**: Fix errors, respond to user feedback

---

## Troubleshooting

### Common Issues

#### 1. Upload Fails - "Invalid GeoJSON"

**Problem**: File structure doesn't match GeoJSON specification

**Solutions:**
- Validate at [geojson.io](https://geojson.io)
- Check for:
  - Missing `"type": "FeatureCollection"`
  - Missing `"features"` array
  - Invalid geometry coordinates
  - Unclosed brackets/braces
- Use JSON validator (jsonlint.com)

#### 2. Dataset Not Appearing in Browse View

**Problem**: Upload successful but dataset not visible

**Solutions:**
- Refresh the browser page (F5)
- Check filters - clear all filters
- Search for dataset name
- Check browser console for errors

#### 3. "Storage Quota Exceeded"

**Problem**: Browser storage limit reached (~50MB)

**Solutions:**
- Delete old/unused datasets
- Export datasets as backup
- Clear browser storage (Settings → Storage)
- Consider PostGIS migration for large datasets

#### 4. Metadata Form Validation Errors

**Problem**: Cannot submit - required fields missing

**Solutions:**
- Look for red borders around fields
- Fill all fields marked with *
- Check email format (must contain @)
- Ensure dataset name is unique

#### 5. Download Not Working

**Problem**: Click download but nothing happens

**Solutions:**
- Check browser download settings
- Allow pop-ups for the dashboard site
- Check browser storage permissions
- Try different browser (Chrome, Firefox)

### Getting Help

**DEPC IT Support:**
- Email: it@depc.gov.vu
- Phone: +678 XXX-XXXX
- Office: DEPC Headquarters, Port Vila

**Report Bugs:**
- GitHub Issues: [github.com/welinrj/merremia-vanuatu-dashboard/issues](https://github.com/welinrj/merremia-vanuatu-dashboard/issues)

---

## Appendix A: Example Dataset

### Merremia Peltata Distribution - Efate Island

**File:** `vut_invasive_merremia_efate_2026_v1.geojson`

**GeoJSON:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [168.3273, -17.7333]
      },
      "properties": {
        "site_id": "MEL001",
        "species": "Merremia peltata",
        "location_name": "Mele Bay",
        "island": "Efate",
        "coverage_category": "Dense (>50%)",
        "affected_area_sqm": 2500,
        "observed_date": "2026-02-10",
        "observer": "John Doe",
        "control_status": "Not controlled",
        "threat_level": "High",
        "photo_count": 3,
        "notes": "Dense coverage along coastal area"
      }
    }
  ]
}
```

**Metadata:**
- **Dataset Name**: Merremia Peltata Distribution - Efate Island 2026
- **Category**: 05_invasive_species
- **Custodian**: Department of Environment Protection and Conservation
- **Access**: Public
- **Format**: GeoJSON
- **CRS**: EPSG:4326
- **Features**: 3 points
- **Coverage**: Efate Island, Shefa Province
- **Keywords**: invasive species, Merremia peltata, biodiversity threat

---

## Appendix B: Glossary

- **CRS**: Coordinate Reference System - defines how coordinates map to locations on Earth
- **EPSG:4326**: WGS84 latitude/longitude coordinate system (most common)
- **Feature**: A single geographic object (point, line, polygon) with attributes
- **FeatureCollection**: Array of features in GeoJSON format
- **Geometry**: The spatial component (coordinates) of a feature
- **GeoJSON**: Geographic JSON format for encoding spatial data
- **ISO 19115**: International standard for geographic metadata
- **Metadata**: "Data about data" - descriptive information about a dataset
- **NBSAP**: National Biodiversity Strategy and Action Plan
- **Properties**: Attribute data attached to a feature
- **Shapefile**: ESRI vector data format (.shp, .shx, .dbf, .prj)
- **Vector Data**: Points, lines, polygons
- **Raster Data**: Gridded/pixel data (images, elevation models)

---

**Document Version:** 1.0
**Last Updated:** 2026-02-15
**Maintained By:** DEPC IT Department
**Contact:** gis@depc.gov.vu
