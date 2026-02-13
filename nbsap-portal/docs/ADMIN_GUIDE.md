# Admin Guide

## Authentication

### Logging In

1. Click the **Admin** tab
2. Enter the admin passphrase (default: `vanuatu2024`)
3. Click **Login**

Once authenticated, the navbar badge changes from "Public" to "Admin" and the Upload button appears on the Data Portal tab.

### Changing the Passphrase

The passphrase hash is stored in `localStorage` under key `nbsap_admin_hash`. To change it:

1. Open browser DevTools (F12)
2. Go to Console
3. Run:
```js
// Replace 'your-new-passphrase' with your desired passphrase
crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-new-passphrase'))
  .then(h => localStorage.setItem('nbsap_admin_hash',
    Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('')));
```

## Upload Wizard

### Step 1: Select File

- Upload a `.zip` file containing `.shp`, `.shx`, `.dbf`, `.prj` (and optionally `.cpg`)
- The parser will detect the geometry type and feature count

### Step 2: Configure

- **Layer Name:** Display name for this layer
- **Category:** CCA, MPA, PA, OECM, KBA, RESTORATION, INVASIVE, or OTHER
- **Targets:** Select one or more NBSAP targets (at least one required)
- **Realm:** Terrestrial or Marine (auto-set based on category)
- **Counts toward 30x30:** Toggle if this layer should be included in Target 3 calculations

### Step 3: Processing

The auto-cleaning pipeline runs automatically:

1. **Validation:** Removes null geometries, detects geometry types
2. **CRS Check:** Detects coordinate reference system; reprojects to WGS84 if needed
3. **Geometry Fixing:** buffer(0) to fix self-intersections, removes sliver polygons
4. **Attribute Mapping:** Maps uploaded fields to standard schema using config rules
5. **Province Assignment:** Auto-assigns province via spatial join if missing
6. **Area Calculation:** Computes geodesic area in hectares for each feature

A real-time log shows progress and any warnings.

### Step 4: Results

Shows a summary of the processed layer:
- Metadata, feature counts, area totals
- TOR compliance check results
- Download button for cleaned GeoJSON

## TOR Compliance Checker

Every layer is checked for:
- At least one target assigned
- Category assigned
- Province assigned to all features
- Feature names present
- Valid geometries
- CRS is WGS84

Layers with issues are flagged but can still be saved. To mark a layer as "Counts toward 30x30", compliance checks should pass (warnings are shown but allowed with override).

## Audit Log

Every admin action is logged:
- Upload, delete, export, import operations
- Timestamp, action type, layer details, result

Export the audit log as CSV from the Admin tab.

## Backup & Restore

### Export Backup
Click **Export Backup** to download a JSON file containing:
- All layers (metadata + GeoJSON)
- Audit log entries
- Metrics snapshots

### Import Backup
Click **Import Backup** and select a previously exported JSON file. This replaces all current data.

**Warning:** Import clears existing data before restoring from the backup.
