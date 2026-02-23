# Vanuatu NBSAP GIS Portal — Methodology Report

## Geospatial Calculation, Analysis & Reporting Methodologies

**Department of Environmental Protection & Conservation (DEPC), Vanuatu**
**National Biodiversity Strategies and Action Plan (NBSAP)**

---

## 1. Introduction

The Vanuatu NBSAP GIS Portal is a geospatial analysis and reporting platform that tracks progress toward nine Global Biodiversity Framework (GBF) targets. It implements dissolution-based area calculation methodology following UNEP-WCMC standards, ensuring each point on Earth's surface is counted only once toward coverage targets, preventing double-counting of overlapping designations.

### 1.1 National Baselines

All percentage-based metrics are calculated against Vanuatu's national baselines:

| Baseline | Area (ha) | Area (km²) |
|----------|-----------|------------|
| **Terrestrial (land)** | 1,219,000 | 12,190 |
| **Marine (sea)** | 66,300,000 | 663,000 |

### 1.2 Coordinate Reference System

All geospatial data is standardised to **EPSG:4326 (WGS 84)** using geodesic area calculations via Turf.js, which accounts for Earth's curvature.

### 1.3 Province Framework

Analysis is disaggregated by Vanuatu's six provinces:

> Torba, Sanma, Penama, Malampa, Shefa, Tafea

---

## 2. Core Area Calculation Methodology

### 2.1 Geodesic Area Computation

All area calculations use **geodesic measurement** on WGS 84 coordinates via `turf.area()`, which computes the area of a polygon on an ellipsoidal Earth model. Results are converted from square metres to hectares:

```
Area (ha) = turf.area(polygon) / 10,000
```

This method produces accurate results for Vanuatu's equatorial-to-subtropical latitude range without requiring projection to a local coordinate system.

### 2.2 Gross Area vs Net Area

The portal distinguishes between two area measures:

| Measure | Definition | Method |
|---------|-----------|--------|
| **Gross Area** | Sum of individual feature areas | Simple addition of `area_ha` per feature |
| **Net Area** | Actual geographic coverage (overlap removed) | Polygon dissolution (union) then area recomputation |

**Gross area** treats each designation independently — if two protected areas overlap by 100 ha, both contribute their full area. **Net area** merges overlapping geometries so that shared land is counted only once.

### 2.3 Polygon Dissolution (Union) — UNEP-WCMC Methodology

Dissolution follows the UNEP-WCMC / GBF methodology for calculating effective conservation coverage. Overlapping features are unioned into a single merged geometry before area is recomputed.

#### Algorithm

1. **Filter**: Extract Polygon and MultiPolygon features (points and lines excluded from area calculations)
2. **Size check**:
   - 0 polygons → return null (no area)
   - 1 polygon → return as-is (no overlap possible)
   - \>500 polygons → skip dissolution, fall back to gross area (performance safeguard)
3. **Chunked tree-merge** (for 100–500 polygons):
   - Split into chunks of 100 features
   - Dissolve each chunk using `turf.union()`
   - Recursively merge chunk results
4. **Direct dissolution** (<100 polygons):
   - Batch union via `turf.union(featureCollection)`
   - Fallback to iterative pairwise union if batch fails
   - Invalid geometries are logged and skipped

#### Overlap Indicator

When net area differs from gross area by more than 1 ha, the overlap percentage is reported:

```
Overlap % = (1 - Net Area / Gross Area) × 100
```

This quantifies the degree of spatial overlap between designations.

### 2.4 Reference Layers

Layers marked as **reference** (`isReference: true`) are displayed on maps for context but are **excluded from all area calculations, totals, and statistics**. Examples include administrative boundaries and historical comparison datasets.

---

## 3. Spatial Join — Province Assignment

Features are assigned to provinces using a point-in-polygon spatial join:

1. **Centroid extraction**: Each feature's effective centroid is calculated:
   - Point features → used directly
   - Polygon features → geometric centroid
   - MultiPolygon features → centroid of the largest polygon part
2. **Bounding box pre-filter**: Province bounding boxes are pre-computed; features outside a province's bbox are rejected before the expensive point-in-polygon test (~80% rejection rate)
3. **Point-in-polygon test**: `turf.booleanPointInPolygon()` determines which province the centroid falls within
4. **Assignment**: The first matching province name is assigned to `feature.properties.province`

Features that fall outside all province boundaries retain their original province value or are marked "Unassigned" and excluded from provincial breakdowns.

---

## 4. Metrics Computation by Target

### 4.1 Target 3 — 30×30 Conservation (Protected Areas & OECMs)

**GBF Goal**: Protect 30% of terrestrial and 30% of marine areas by 2030.

**Categories**: CCA (Community Conserved Areas), MPA (Marine Protected Areas), LMMA (Locally Managed Marine Areas), PA (Protected Areas — WDPA), OECM (Other Effective Conservation Measures)

**Methodology**:

1. **Filter**: Only layers with `countsToward30x30 = true` and `targets` including T3 are included
2. **Realm separation**: Features are split into terrestrial and marine groups based on `realm` property (or category default realm)
3. **Gross computation**: Sum of all `area_ha` values per realm
4. **Dissolution**: Terrestrial and marine feature sets are dissolved separately using polygon union
5. **Net computation**: Area recomputed from dissolved geometries
6. **Percentage**: `Coverage % = (Net Area / National Baseline) × 100`
7. **Gap analysis**: `Remaining % = max(0, 30 - Coverage %)`; `Remaining ha = Remaining % × Baseline / 100`

**Province breakdown**: Features filtered per province, dissolved per realm within each province, producing per-province terrestrial and marine coverage figures.

**Output metrics**:
- Net terrestrial ha and % of national land
- Net marine ha and % of national sea
- Remaining % and ha to reach 30% for each realm
- Province breakdown (terrestrial, marine, total per province)
- Category breakdown (area per designation type)

---

### 4.2 Target 1 — Biodiversity-Inclusive Spatial Planning

**GBF Goal**: 100% of land and sea areas covered by biodiversity-inclusive spatial plans.

**Categories**: SPATIAL_PLAN (Provincial & Municipal Physical Plans), KBA (Key Biodiversity Areas), CCA (Community Conserved Areas)

**Methodology**:

1. **Filter**: Layers with `targets` including T1
2. **Dissolution**: All features dissolved together; also dissolved by category and by realm
3. **Coverage**: Net area as % of national terrestrial and marine baselines
4. **Category breakdown**: Net area per category (SPATIAL_PLAN, KBA, CCA)
5. **Province breakdown**: Per-province dissolved area

**Key metrics**: Total spatial planning coverage (ha), % of national area, number of provinces with planning data, category contributions.

---

### 4.3 Target 2 — Degraded Area Mapping & Ecosystem Restoration

**GBF Goal**: Map all degraded areas; restore 30% of degraded ecosystems.

**Categories**: DEGRADED (Degraded Terrestrial and Marine/Coastal Areas), RESTORATION (Active & Planned Restoration Sites)

**Methodology**:

1. **Filter**: Layers with `targets` including T2
2. **Category split**: DEGRADED and RESTORATION features computed separately
3. **Dissolution**: Each category dissolved independently to compute net degraded area and net restoration area
4. **Overlap**: Overlap between degraded and restoration layers quantified
5. **Province breakdown**: Per-province degradation and restoration extent

**Key metrics**: Total degraded area (ha), total restoration area (ha), overlap between designations, province-level breakdown.

---

### 4.4 Target 4 — Species & Biodiversity Distribution

**GBF Goal**: Map distribution of significant endemic and threatened species.

**Priority species tracked**:

| Species | Scientific Name | Taxa |
|---------|----------------|------|
| Vanuatu Megapode | *Megapodius layardi* | Bird |
| Vanuatu Mountain Starling | *Aplonis santovestris* | Bird (critically endangered) |
| Vanuatu Streaked Fantail | *Rhipidura spilodera* | Bird |
| Vanuatu Kingfisher | *Todiramphus farquhari* | Bird |
| Vanuatu Flying Fox | *Pteropus anetianus* | Mammal |
| Plerandra vanuatuensis | *Plerandra vanuatuensis* | Plant (endemic) |

**Additional categories**: KBA, SPECIES_DIST (general species distribution)

**Methodology**:

1. **Filter**: Layers with `targets` including T4
2. **Per-species metrics**: Each species category (MEGAPODE, STARLING, etc.) dissolved separately
3. **Distribution mapping**: Both point (observation records) and polygon (range/habitat) data supported
4. **Coverage**: Net area per species, total distribution area
5. **Completeness**: Species mapped vs expected species (6 priority + KBA + general)

**Key metrics**: Number of species mapped, distribution area per species, total observation records, province distribution, data completeness (% of expected species).

**Note**: Only polygon features contribute to area calculations. Point observations contribute to record counts and distribution mapping but not area totals.

---

### 4.5 Target 6 — Invasive Alien Species (IAS)

**GBF Goal**: Map coverage and distribution of priority invasive alien species for management planning.

**Priority IAS tracked**:

| Species | Scientific Name | Threat Description |
|---------|----------------|-------------------|
| Merremia peltata (Big Leaf) | *Merremia peltata* | Invasive vine smothering canopy trees, preventing forest regeneration |
| Crown of Thorns Starfish | *Acanthaster planci* | Outbreaks causing devastating coral mortality across reef systems |
| Mile a Minute Vine | *Mikania micrantha* | Fast-growing vine forming dense mats over native vegetation |
| Devil Fig | *Solanum torvum* | Woody shrub colonising disturbed land, displacing native undergrowth |

**Additional category**: INVASIVE (other IAS — Fire Ants, African Snail, Sako, Coconut Beetle)

**Methodology**:

1. **Filter**: Layers with `targets` including T6
2. **Per-species analysis**: Each IAS category dissolved separately
3. **Total IAS extent**: All IAS features dissolved together for net coverage
4. **Province distribution**: Per-province IAS presence and extent
5. **Type breakdown**: Detection methods, confidence levels where available

**Key metrics**: Total IAS-affected area (ha), per-species area, provinces affected, detection records, % of national terrestrial area affected.

---

### 4.6 Target 10 — Agriculture & Land Cover Change

**GBF Goal**: Map land cover change for agriculture, livestock, fisheries, and forestry sectors.

**Category**: LAND_COVER (Land Cover / Land Use)

**Methodology**:

1. **Filter**: Layers with `targets` including T10
2. **Type disaggregation**: Features grouped by `type` property (land use classification):
   - Examples: Prime Agricultural Land, Non Agricultural Land, Other Agricultural Land, Marginal Agricultural Land
   - Dynamic colour assignment for sub-types not in the predefined palette
3. **Per-type dissolution**: Each land use type dissolved separately for net area
4. **Province breakdown**: Per-province land cover composition
5. **Change detection context**: Type breakdown enables temporal comparison when multiple years uploaded

**Key metrics**: Total area by land use type, number of distinct land use classes, per-province composition, records per type.

**Performance note**: T10 datasets can contain thousands of features. When feature counts exceed 500, dissolution is skipped and gross area is used as the best available estimate to maintain portal responsiveness.

---

### 4.7 Target 7 — Pesticide & Herbicide Mapping

**GBF Goal**: Map areas of chemical use in farming to assess biodiversity risk.

**Category**: PESTICIDE

**Methodology**: Standard target metrics — dissolution of all pesticide-use areas, breakdown by chemical type and province.

---

### 4.8 Target 8 — Coastal Eutrophication

**GBF Goal**: Monitor nutrient-impacted marine zones threatening reef health.

**Category**: EUTROPHICATION (marine realm)

**Methodology**: Standard target metrics — dissolution of eutrophication zones, breakdown by severity level and province.

---

### 4.9 Target 12 — Blue & Green Spaces

**GBF Goal**: Map urban parks, botanical gardens, and green infrastructure.

**Category**: GREEN_SPACE

**Methodology**: Standard target metrics — dissolution of green space polygons, breakdown by space type and province.

---

## 5. Analysis & Reporting Framework

### 5.1 Data Completeness Assessment

For each target, the portal calculates **data completeness** as the percentage of expected data layers that have been uploaded:

```
Data Completeness % = (1 - Missing Layers / Expected Layers) × 100
```

Expected layers are defined per target in the system configuration.

### 5.2 Assessment Status

Each target (and each province within a target) receives a qualitative status:

| Status | Criteria | Colour |
|--------|---------|--------|
| **No Data** | No data layers uploaded | Red |
| **Minimal** | Data completeness < 50% and fewer than 2 layers | Red |
| **Moderate** | Data completeness ≥ 50% or 2+ layers uploaded | Orange |
| **Comprehensive** | Data completeness ≥ 80% and geometry quality ≥ 90% | Green |

### 5.3 Key Findings (Auto-Generated)

The analysis engine generates quantitative findings based on the data:

1. **Coverage summary**: Total net area and % of national baselines
2. **Overlap detection**: Degree of spatial overlap between designations (significant if >5%)
3. **Province distribution**: Province with highest/lowest coverage
4. **Data gaps**: Provinces with no data for the target
5. **Target progress** (T3): Gap to 30% target in % and hectares
6. **Category concentration**: Whether coverage is dominated by a single designation type (>60%)
7. **Geometry types**: Mix of polygon vs point data and implications for area calculations
8. **Reference data**: Count of reference layers shown for context

### 5.4 Target-Specific Insights

Each target receives qualitative insights tailored to its GBF context:

- **T1**: Spatial planning coverage relative to mainstreaming biodiversity
- **T2**: Degradation baseline adequacy and restoration progress
- **T3**: 30×30 progress emphasising CCAs and LMMAs as culturally appropriate pathways for Vanuatu
- **T4**: Species coverage completeness and island-specific endemism
- **T6**: Per-species ecological threat descriptions and management prioritisation
- **T10**: Land cover type diversity and forest-to-agriculture conversion focus
- **T12**: Urban green infrastructure and biodiversity corridors

### 5.5 Province-Level Analysis

Each province receives individual analysis including:

- Province's contribution to the national total (ha and %)
- Per-province category breakdown
- Per-province type/species breakdown
- Province-specific data completeness
- Province share vs national total comparison
- Targeted findings and insights for the province

---

## 6. Map Production Methodology

### 6.1 Symbology

Maps use consistent symbology driven by a central configuration:

- Each category has a predefined fill colour and stroke colour
- LAND_COVER sub-types receive dynamically assigned colours from a 20-colour high-contrast palette using hash-based stable assignment
- Reference layers are rendered with dashed outlines and low fill opacity
- Province boundaries shown as context with permanent labels

### 6.2 Print Map Production

Print maps follow a standardised cartographic template:

1. **Title block**: Target name, province (if filtered), NBSAP branding, Vanuatu flag, date, CRS
2. **Map**: Leaflet-rendered map with CartoDB Light basemap, dissolved feature boundaries per symbology group, province boundaries, scale bar, north arrow
3. **Legend**: Category colours with labels, including LAND_COVER sub-type expansion
4. **Metrics row**: Terrestrial/marine net area, % national baselines, record count
5. **Category breakdown table**: Per-category area and record counts
6. **Analysis page**: Quantitative metrics, qualitative findings, insights

### 6.3 Dissolution on Maps

For cartographic output, features are dissolved per symbology group (category, or sub-type for LAND_COVER) following the same UNEP-WCMC union methodology used for metrics. For very large datasets (>500 features), raw features are rendered with a feature cap to maintain browser performance.

---

## 7. Data Pipeline & Quality Assurance

### 7.1 Upload Processing Pipeline

Uploaded datasets pass through a standardised pipeline:

1. **Validation**: File format check (GeoJSON, Shapefile, CSV with coordinates)
2. **Reprojection**: Transformation to EPSG:4326 (WGS 84) if necessary
3. **Geometry repair**: Automatic fix of self-intersections and ring-winding errors
4. **Field mapping**: Source field names mapped to canonical schema using category-specific lookup tables
5. **Province assignment**: Spatial join against province boundaries
6. **Area computation**: Geodesic area calculated for each polygon feature

### 7.2 Geometry Quality Tracking

The pipeline tracks three geometry quality indicators per layer:

| Indicator | Description |
|-----------|-------------|
| **Valid geometries** | Features with geometries that passed validation |
| **Fixed geometries** | Features with geometries that were automatically repaired |
| **Dropped geometries** | Features with irreparably invalid geometries (excluded from analysis) |

```
Geometry Quality % = (Total Features - Dropped) / Total Features × 100
```

### 7.3 Field Mapping

The system supports flexible field name mapping to accommodate diverse data sources. Each category defines acceptable input field names that are automatically mapped to canonical properties (`name`, `type`, `realm`, `province`, `year`, `status`, `source`, `notes`).

---

## 8. Summary — Methodology by Target

| Target | Dissolution | Realm Split | Key Metric | Threshold |
|--------|------------|-------------|------------|-----------|
| **T1** | By category & realm | Yes | Coverage % of national area | 100% spatial plan coverage |
| **T2** | By category | Optional | Degraded + Restoration ha | Map all degraded areas |
| **T3** | By realm, province, category | Yes | % of 30% target achieved | 30% terrestrial & marine |
| **T4** | By species category | No (terrestrial) | Species mapped / expected | All priority species mapped |
| **T6** | By IAS species | Optional | Total IAS extent (ha) | All priority IAS mapped |
| **T7** | Standard | No (terrestrial) | Pesticide use area (ha) | — |
| **T8** | Standard | No (marine) | Eutrophication zone (ha) | — |
| **T10** | By land use type | No (terrestrial) | Land cover composition | — |
| **T12** | Standard | No (terrestrial) | Green space area (ha) | — |

---

## 9. Standards & References

- **UNEP-WCMC**: Methodology for calculating protected area coverage — polygon dissolution to prevent double-counting
- **Global Biodiversity Framework (GBF)**: Kunming-Montreal targets and indicators
- **WDPA**: World Database on Protected Areas — PA and OECM standards
- **Turf.js**: Geodesic spatial analysis library for area computation and polygon union
- **EPSG:4326 (WGS 84)**: Standard geographic coordinate reference system
- **BirdLife International**: KBA Partnership methodology for Key Biodiversity Areas

---

*Document generated for the Vanuatu NBSAP GIS Portal. Technical oversight: Biodiversity and Conservation Division & NBSAP Draft and Update Team, DEPC.*
