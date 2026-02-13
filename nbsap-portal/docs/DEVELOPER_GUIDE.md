# Developer Guide

## Architecture

The application follows strict module separation:

```
src/
├── config/       # Environment, targets, categories, field mappings
├── core/         # Schema, validation, pipeline, field mapping logic
├── gis/          # Union/dissolve, area calculations, spatial joins
├── ui/           # State management, styles, reusable components
├── pages/        # Page-level modules (Dashboard, Portal, Admin, About)
└── services/     # Storage adapters, auth providers
```

### Key Design Principles

1. **No direct IndexedDB calls outside storage adapter** — All persistence goes through `services/storage/index.js`
2. **Auth provider interface** — Auth calls go through `services/auth/index.js`
3. **State management** — Centralized in `ui/state.js`; components read state and dispatch `nbsap:refresh` events
4. **Config-driven** — Categories, targets, field mappings, and environment settings are all in `/src/config/`

## Module Details

### Core Pipeline (`src/core/pipeline.js`)

Orchestrates the full processing sequence:
1. `basicValidation()` — Remove null geometries, count types
2. `detectCRS()` / `reprojectToWGS84()` — CRS detection from .prj, reprojection via proj4
3. `fixGeometries()` — buffer(0) fix, simplify, sliver removal
4. `mapAllFeatures()` — Attribute standardization using field_mappings.json
5. `assignProvinces()` — Spatial join with provinces boundary
6. `computeFeatureAreas()` — Geodesic area in hectares

### GIS: Union/Dissolve (`src/gis/unionDissolve.js`)

For Target 3 no-double-counting:
- Collects all polygon features from T3 layers marked `countsToward30x30`
- Separates by realm (terrestrial/marine)
- Iteratively unions features using `turf.union()`
- Fallback: simplify → buffer(0) → retry if union fails
- Yields to main thread every 10 iterations for UI responsiveness

### GIS: Area Calculation (`src/gis/areaCalc.js`)

- Uses `turf.area()` for geodesic area on WGS84 coordinates
- Converts m² to hectares (÷ 10000)
- National baselines configured in `env.js`

### Storage Adapter Pattern

```
services/storage/
├── index.js              # Facade — imports active backend
├── storageIndexedDB.js   # Browser-based (active for static hosting)
└── storageApiStub.js     # HTTP API (for future backend)
```

To switch backends, change `storageBackend` in `src/config/env.js`:
```js
storageBackend: 'api',  // 'indexeddb' or 'api'
apiBaseUrl: 'https://api.gov.vu/nbsap'
```

### Auth Provider Pattern

```
services/auth/
├── index.js                   # Facade
├── authLocalPassphrase.js     # SHA-256 passphrase (static hosting)
└── authApiTokenStub.js        # JWT token (future backend)
```

Switch via `authProvider` in `env.js`.

## Adding a New Target

1. Edit `src/config/targets.json` — add a new entry
2. Optionally update `categories.js` if new layer types are needed
3. The filter panel auto-populates from targets.json

## Adding a New Layer Category

1. Add entry to `CATEGORIES` in `src/config/categories.js`
2. Add field mapping rules in `src/config/field_mappings.json`
3. Upload wizard and filter panel auto-populate from these configs

## Development Commands

```bash
npm run dev       # Start Vite dev server on port 3000
npm run build     # Build for production to dist/
npm run preview   # Preview production build locally
```

## Testing

Currently no automated test suite is included. Manual testing:
1. Load the app in browser
2. Verify demo data displays
3. Upload a test shapefile
4. Check filters, KPIs, exports

For future test setup, add Vitest:
```bash
npm install -D vitest
```
