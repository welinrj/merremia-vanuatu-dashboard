# Data Schema

## Standard Feature Properties

Every GeoJSON feature in the portal conforms to this schema:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Feature name (e.g., "Vatthe Conservation Area") |
| `type` | string | Yes | Feature type (e.g., "CCA", "MPA", "PA") |
| `realm` | string | Yes | "terrestrial" or "marine" |
| `province` | string | Yes | Province name (auto-assigned if missing) |
| `year` | number | No | Establishment year |
| `status` | string | Yes | "Designated", "Proposed", "Active", "Inactive", "Unknown" |
| `source` | string | Yes | Data source |
| `notes` | string | No | Additional notes |
| `targets` | string[] | Yes | Array of target codes, e.g., ["T3", "T5"] |

### Metadata Fields (added during processing)

| Field | Type | Description |
|-------|------|-------------|
| `upload_timestamp` | string (ISO) | When the feature was uploaded |
| `layer_id` | string | Unique ID of the parent layer |
| `original_filename` | string | Original shapefile name |
| `uploaded_by` | string | Admin label |
| `area_ha` | number | Geodesic area in hectares |

## Layer Metadata Schema

Each layer has a metadata record:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique layer ID |
| `name` | string | Display name |
| `originalFilename` | string | Original upload filename |
| `category` | string | CCA/MPA/PA/OECM/KBA/RESTORATION/INVASIVE/OTHER |
| `targets` | string[] | Assigned NBSAP targets |
| `realm` | string | "terrestrial" or "marine" |
| `countsToward30x30` | boolean | Whether layer is included in T3 calculations |
| `uploadTimestamp` | string (ISO) | Upload time |
| `uploadedBy` | string | User label |
| `detectedCRS` | string | Detected CRS from .prj file |
| `featureCount` | number | Total features after cleaning |
| `validGeometryCount` | number | Features with valid geometry |
| `fixedCount` | number | Geometries fixed by buffer(0) |
| `droppedCount` | number | Geometries dropped (null/sliver) |
| `totalAreaHa` | number | Sum of all feature areas |
| `status` | string | "Clean", "Warnings", or "Failed" |
| `warnings` | string[] | List of warning messages |
| `notes` | string | Additional notes |

## Layer Categories

| Code | Label | Default Realm |
|------|-------|--------------|
| CCA | Community Conserved Area | terrestrial |
| MPA | Marine Protected Area | marine |
| PA | Protected Area | terrestrial |
| OECM | Other Effective Conservation Measure | terrestrial |
| KBA | Key Biodiversity Area | terrestrial |
| RESTORATION | Restoration Site | terrestrial |
| INVASIVE | Invasive Species Area | terrestrial |
| OTHER | Other | terrestrial |

## NBSAP Targets

| Code | Name | Metric Target |
|------|------|---------------|
| T1 | Spatial Planning | No |
| T2 | Ecosystem Restoration | No |
| T3 | 30x30 Conservation | **Yes** |
| T4 | Species Recovery | No |
| T5 | Sustainable Harvesting | No |
| T6 | Invasive Species | No |
| T7 | Pollution Reduction | No |
| T8 | Climate Change | No |

## Target Tagging

- Every layer is tagged with 1+ targets at upload time
- Each feature inherits the layer's targets in its `targets` property
- Stored as: `"targets": ["T3", "T5"]`
- Targets drive filter behavior and KPI display logic

## Province Assignment

Features without a `province` field are auto-assigned by spatial join:
- **Polygon:** centroid of the polygon
- **MultiPolygon:** centroid of the largest polygon part
- **Point:** direct point-in-polygon test

Province names come from the provinces boundary GeoJSON (`data/provinces.geojson`).

## Field Mapping Configuration

`src/config/field_mappings.json` defines how uploaded attributes map to standard fields:

```json
{
  "global": {
    "name": ["name", "site_name", "area_name", ...],
    "type": ["type", "category", "designation", ...],
    ...
  },
  "CCA": {
    "name": ["cca_name", "community_area"],
    ...
  }
}
```

Category-specific mappings take priority over global mappings. First match wins.
