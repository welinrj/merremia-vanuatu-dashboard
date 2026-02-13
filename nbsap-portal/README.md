# Vanuatu NBSAP GIS Data Portal & Dashboard

A web-based GIS data portal and dashboard for monitoring Vanuatu's National Biodiversity Strategy and Action Plan (NBSAP), with a strong focus on **Target 3 (30x30)** — conserving at least 30% of terrestrial and 30% of marine areas by 2030.

## Features

- **Dashboard** — Interactive Leaflet map, KPI widgets, province breakdown charts, and export tools
- **Data Portal** — Upload zipped shapefiles, auto-clean, validate, and manage GIS layers
- **Admin** — Passphrase-gated admin mode, audit logging, backup/restore
- **About / Help** — Data sources, guidance, documentation links

### Key Capabilities

- Multi-target filtering (T1–T8) with province, category, realm, and year filters
- Auto-cleaning pipeline: CRS detection, reprojection, geometry fixing, attribute standardization
- Union/dissolve for no-double-counting area calculations
- Geodesic area computation with provincial breakdown
- TOR compliance checker
- CSV, JSON snapshot, and GeoJSON exports
- IndexedDB persistence (browser-based, no server required)
- Migration-ready architecture for government server deployment

## Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/vanuatu-nbsap-portal.git
cd vanuatu-nbsap-portal

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deploy to GitHub Pages

### Step 1: Create a new GitHub repository

```bash
# On GitHub, create a new repository named "vanuatu-nbsap-portal"
# Then push this code:
cd vanuatu-nbsap-portal
git init
git add -A
git commit -m "Initial commit: Vanuatu NBSAP GIS Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vanuatu-nbsap-portal.git
git push -u origin main
```

### Step 2: Build and deploy

```bash
npm run build
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings → Pages**
3. Under "Source", select **GitHub Actions** or deploy `dist/` via a workflow:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Step 4: Access your portal

Your portal will be available at: `https://YOUR_USERNAME.github.io/vanuatu-nbsap-portal/`

## Verification Checklist

- [ ] App loads with demo data (CCA + MPA layers visible on map)
- [ ] Filters by target (T1–T8) work — map, KPIs, tables update
- [ ] Province filter works — data scoped to selected province
- [ ] Combined target + province filter works
- [ ] Target 3 KPIs show: terrestrial ha, marine ha, % of 30% target
- [ ] Province breakdown table and bar chart display
- [ ] Upload wizard: accepts .zip shapefile, runs pipeline, shows results
- [ ] Cleaning pipeline: validates, fixes geometries, maps fields, assigns provinces
- [ ] Union/dissolve: no double-counting for overlapping areas
- [ ] Export CSV reflects current filters
- [ ] Export JSON produces TOR reporting snapshot
- [ ] Data Portal: lists layers with search/filter
- [ ] Layer details sidebar shows metadata and TOR compliance
- [ ] Admin login with passphrase (default: `vanuatu2024`)
- [ ] Admin: upload button appears after login
- [ ] Audit log records all admin actions
- [ ] Backup export/import works
- [ ] GitHub Pages deployment works (static build, relative paths)

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Map | Leaflet 1.9 |
| GIS Processing | Turf.js 7 |
| Shapefile Parsing | shpjs 4 |
| CRS Reprojection | proj4 |
| Build Tool | Vite 5 |
| Storage | IndexedDB (browser) |
| Hosting | GitHub Pages (static) |

## Project Structure

```
vanuatu-nbsap-portal/
├── index.html                  # App entry point
├── package.json
├── vite.config.js
├── data/                       # Demo GIS data
│   ├── provinces.geojson
│   ├── demo_cca.geojson
│   └── demo_mpa.geojson
├── src/
│   ├── main.js                 # Bootstrap + initialization
│   ├── config/
│   │   ├── env.js              # Environment configuration
│   │   ├── targets.json        # NBSAP target definitions
│   │   ├── categories.js       # Layer categories
│   │   └── field_mappings.json # Attribute mapping rules
│   ├── core/
│   │   ├── schema.js           # Data schemas + validation
│   │   ├── validation.js       # Geometry validation + fixing
│   │   ├── fieldMapper.js      # Attribute field mapping
│   │   └── pipeline.js         # Auto-cleaning pipeline
│   ├── gis/
│   │   ├── areaCalc.js         # Geodesic area computation
│   │   ├── spatialJoin.js      # Province assignment
│   │   └── unionDissolve.js    # Union/dissolve for 30x30
│   ├── ui/
│   │   ├── state.js            # App state management
│   │   ├── styles/main.css     # All styles
│   │   └── components/
│   │       ├── filterPanel.js
│   │       ├── kpiWidgets.js
│   │       ├── mapView.js
│   │       ├── charts.js
│   │       ├── exportTools.js
│   │       └── uploadWizard.js
│   ├── pages/
│   │   ├── dashboard.js
│   │   ├── dataPortal.js
│   │   ├── admin.js
│   │   └── about.js
│   └── services/
│       ├── storage/
│       │   ├── index.js
│       │   ├── storageIndexedDB.js
│       │   └── storageApiStub.js
│       └── auth/
│           ├── index.js
│           ├── authLocalPassphrase.js
│           └── authApiTokenStub.js
├── server_stub/
│   ├── server.js               # Express API stub
│   ├── package.json
│   ├── docker-compose.yml
│   └── nginx.conf              # Nginx deployment config
└── docs/
    ├── USER_GUIDE.md
    ├── ADMIN_GUIDE.md
    ├── DEVELOPER_GUIDE.md
    ├── MIGRATION_GUIDE.md
    ├── API_SPEC.md
    ├── DATA_SCHEMA.md
    ├── SECURITY_GUIDE.md
    └── CHANGELOG.md
```

## License

MIT License — Open source for Vanuatu Government / DEPC use.
