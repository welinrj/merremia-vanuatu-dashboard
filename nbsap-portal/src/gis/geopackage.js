/**
 * GeoPackage builder for browser.
 * Creates valid OGC GeoPackage files from GeoJSON using sql.js (SQLite in WASM).
 *
 * GeoPackage spec: http://www.geopackage.org/spec/
 * Geometry encoding: GeoPackage Binary (GPKB) wrapping OGC Well-Known Binary (WKB).
 */
import initSqlJs from 'sql.js';

let _SQL = null;

/** Lazily initialise sql.js (downloads WASM once). */
async function getSQL() {
  if (_SQL) return _SQL;
  const baseUrl = (import.meta.env && import.meta.env.BASE_URL) || './';
  _SQL = await initSqlJs({
    locateFile: file => `${baseUrl}${file}`
  });
  return _SQL;
}

/**
 * Creates a GeoPackage (.gpkg) Uint8Array from one or more named GeoJSON layers.
 *
 * @param {Array<{ name: string, geojson: object }>} layers
 *   Each entry has a sanitised table name and a GeoJSON FeatureCollection.
 * @returns {Promise<Uint8Array>} Raw .gpkg bytes ready for download.
 */
export async function buildGeoPackage(layers) {
  const SQL = await getSQL();
  const db = new SQL.Database();

  try {
    // ── Required GeoPackage metadata tables ──────────────────────────
    db.run(`CREATE TABLE gpkg_spatial_ref_sys (
      srs_name     TEXT    NOT NULL,
      srs_id       INTEGER NOT NULL PRIMARY KEY,
      organization TEXT    NOT NULL,
      organization_coordsys_id INTEGER NOT NULL,
      definition   TEXT    NOT NULL,
      description  TEXT
    )`);

    db.run(`INSERT INTO gpkg_spatial_ref_sys VALUES
      ('Undefined cartesian SRS', -1, 'NONE', -1, 'undefined', 'undefined cartesian coordinate reference system'),
      ('Undefined geographic SRS', 0,  'NONE',  0, 'undefined', 'undefined geographic coordinate reference system'),
      ('WGS 84 geodetic', 4326, 'EPSG', 4326,
       'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]',
       'longitude/latitude coordinates in decimal degrees on the WGS 84 spheroid')`);

    db.run(`CREATE TABLE gpkg_contents (
      table_name  TEXT    NOT NULL PRIMARY KEY,
      data_type   TEXT    NOT NULL DEFAULT 'features',
      identifier  TEXT    UNIQUE,
      description TEXT    DEFAULT '',
      last_change TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      min_x       REAL,
      min_y       REAL,
      max_x       REAL,
      max_y       REAL,
      srs_id      INTEGER REFERENCES gpkg_spatial_ref_sys(srs_id)
    )`);

    db.run(`CREATE TABLE gpkg_geometry_columns (
      table_name         TEXT    NOT NULL REFERENCES gpkg_contents(table_name),
      column_name        TEXT    NOT NULL,
      geometry_type_name TEXT    NOT NULL,
      srs_id             INTEGER NOT NULL REFERENCES gpkg_spatial_ref_sys(srs_id),
      z                  INTEGER NOT NULL,
      m                  INTEGER NOT NULL,
      CONSTRAINT pk_geom_cols PRIMARY KEY (table_name, column_name)
    )`);

    // Optional but expected by many GIS clients
    db.run(`CREATE TABLE gpkg_extensions (
      table_name  TEXT,
      column_name TEXT,
      extension_name TEXT NOT NULL,
      definition  TEXT NOT NULL,
      scope       TEXT NOT NULL,
      CONSTRAINT ge_tce UNIQUE (table_name, column_name, extension_name)
    )`);

    // ── Write each layer as a feature table ──────────────────────────
    const now = new Date().toISOString();

    for (const layer of layers) {
      const tbl = _sanitiseTableName(layer.name);
      const features = layer.geojson?.features || [];
      if (features.length === 0) continue;

      // Collect all unique property keys across features
      const propKeys = _collectPropertyKeys(features);

      // Determine bounding box
      const bbox = _computeBBox(features);

      // Determine dominant geometry type
      const geomType = _dominantGeomType(features);

      // Register in gpkg_contents
      db.run(
        `INSERT INTO gpkg_contents VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [tbl, 'features', layer.name, '', now, bbox[0], bbox[1], bbox[2], bbox[3], 4326]
      );

      // Register geometry column
      db.run(
        `INSERT INTO gpkg_geometry_columns VALUES (?,?,?,?,?,?)`,
        [tbl, 'geom', geomType, 4326, 0, 0]
      );

      // Build CREATE TABLE with property columns
      const colDefs = ['fid INTEGER PRIMARY KEY AUTOINCREMENT', 'geom BLOB'];
      for (const key of propKeys) {
        colDefs.push(`"${key}" TEXT`);
      }
      db.run(`CREATE TABLE "${tbl}" (${colDefs.join(', ')})`);

      // Insert features
      const placeholders = ['?', '?'].concat(propKeys.map(() => '?')).join(',');
      const stmt = db.prepare(`INSERT INTO "${tbl}" (fid, geom${propKeys.map(k => `,"${k}"`).join('')}) VALUES (${placeholders})`);

      for (let i = 0; i < features.length; i++) {
        const f = features[i];
        const geomBlob = encodeGPKB(f.geometry);
        const props = f.properties || {};
        const values = [i + 1, geomBlob];
        for (const key of propKeys) {
          const v = props[key];
          values.push(v == null ? null : Array.isArray(v) ? v.join(';') : String(v));
        }
        stmt.bind(values);
        stmt.step();
        stmt.reset();
      }
      stmt.free();

      // Spatial index (R*Tree) — expected by most GIS clients
      db.run(`CREATE VIRTUAL TABLE "rtree_${tbl}_geom" USING rtree(id, minx, maxx, miny, maxy)`);
      const rtStmt = db.prepare(`INSERT INTO "rtree_${tbl}_geom" VALUES (?,?,?,?,?)`);
      for (let i = 0; i < features.length; i++) {
        const fb = _featureBBox(features[i]);
        if (fb) {
          rtStmt.bind([i + 1, fb[0], fb[2], fb[1], fb[3]]);
          rtStmt.step();
          rtStmt.reset();
        }
      }
      rtStmt.free();

      // Register R*Tree extension
      db.run(
        `INSERT INTO gpkg_extensions VALUES (?,?,?,?,?)`,
        [`rtree_${tbl}_geom`, null, 'gpkg_rtree_index',
         'http://www.geopackage.org/spec/#extension_rtree', 'write-update']
      );
    }

    // Set the GeoPackage application_id and user_version
    db.run('PRAGMA application_id = 0x47504B47'); // "GPKG"
    db.run('PRAGMA user_version = 10301');          // GeoPackage 1.3.1

    const data = db.export();
    return new Uint8Array(data);
  } finally {
    db.close();
  }
}

// ── GeoPackage Binary (GPKB) encoding ────────────────────────────────

/**
 * Encodes a GeoJSON geometry as GeoPackage Binary (GPKB).
 * GPKB = 8-byte header + optional envelope + OGC WKB body.
 */
export function encodeGPKB(geometry) {
  if (!geometry) return null;

  const wkb = encodeWKB(geometry);
  if (!wkb) return null;

  const bbox = _geomBBox(geometry);

  // Header: "GP" + version(1) + flags(1) + srs_id(4) + envelope
  // Flags byte: bit0 = byte order (1=LE), bits1-3 = envelope type
  const hasEnvelope = bbox !== null;
  const envelopeType = hasEnvelope ? 1 : 0; // 1 = [minx,maxx,miny,maxy]
  const flags = 0x01 | (envelopeType << 1); // little-endian + envelope indicator

  const envelopeSize = hasEnvelope ? 32 : 0; // 4 doubles * 8 bytes
  const headerSize = 8 + envelopeSize;
  const buf = new ArrayBuffer(headerSize + wkb.byteLength);
  const view = new DataView(buf);
  const u8 = new Uint8Array(buf);

  // Magic "GP"
  view.setUint8(0, 0x47); // G
  view.setUint8(1, 0x50); // P
  // Version
  view.setUint8(2, 0);
  // Flags
  view.setUint8(3, flags);
  // SRS ID (little-endian)
  view.setInt32(4, 4326, true);

  // Envelope [minx, maxx, miny, maxy] as float64 LE
  if (hasEnvelope) {
    view.setFloat64(8, bbox[0], true);
    view.setFloat64(16, bbox[2], true);
    view.setFloat64(24, bbox[1], true);
    view.setFloat64(32, bbox[3], true);
  }

  // WKB body
  u8.set(new Uint8Array(wkb), headerSize);

  return u8;
}

// ── Well-Known Binary (WKB) encoding ─────────────────────────────────

const WKB_POINT = 1;
const WKB_LINESTRING = 2;
const WKB_POLYGON = 3;
const WKB_MULTIPOINT = 4;
const WKB_MULTILINESTRING = 5;
const WKB_MULTIPOLYGON = 6;
const WKB_GEOMETRYCOLLECTION = 7;

/**
 * Encodes a GeoJSON geometry object to OGC WKB (little-endian).
 * @returns {ArrayBuffer|null}
 */
export function encodeWKB(geometry) {
  if (!geometry || !geometry.type) return null;

  switch (geometry.type) {
    case 'Point':              return _wkbPoint(geometry.coordinates);
    case 'LineString':         return _wkbLineString(geometry.coordinates);
    case 'Polygon':            return _wkbPolygon(geometry.coordinates);
    case 'MultiPoint':         return _wkbMulti(WKB_MULTIPOINT, geometry.coordinates, _wkbPoint);
    case 'MultiLineString':    return _wkbMulti(WKB_MULTILINESTRING, geometry.coordinates, _wkbLineString);
    case 'MultiPolygon':       return _wkbMulti(WKB_MULTIPOLYGON, geometry.coordinates, _wkbPolygon);
    case 'GeometryCollection': return _wkbGeometryCollection(geometry.geometries);
    default: return null;
  }
}

function _wkbPoint(coords) {
  if (!coords || coords.length < 2) return null;
  const buf = new ArrayBuffer(21); // 1 + 4 + 16
  const view = new DataView(buf);
  view.setUint8(0, 1); // LE
  view.setUint32(1, WKB_POINT, true);
  view.setFloat64(5, coords[0], true);
  view.setFloat64(13, coords[1], true);
  return buf;
}

function _wkbLineString(coords) {
  if (!coords) return null;
  const n = coords.length;
  const buf = new ArrayBuffer(9 + n * 16);
  const view = new DataView(buf);
  view.setUint8(0, 1);
  view.setUint32(1, WKB_LINESTRING, true);
  view.setUint32(5, n, true);
  let offset = 9;
  for (const c of coords) {
    view.setFloat64(offset, c[0], true); offset += 8;
    view.setFloat64(offset, c[1], true); offset += 8;
  }
  return buf;
}

function _wkbPolygon(rings) {
  if (!rings) return null;
  const numRings = rings.length;
  let totalCoords = 0;
  for (const ring of rings) totalCoords += ring.length;

  const buf = new ArrayBuffer(9 + numRings * 4 + totalCoords * 16);
  const view = new DataView(buf);
  view.setUint8(0, 1);
  view.setUint32(1, WKB_POLYGON, true);
  view.setUint32(5, numRings, true);
  let offset = 9;
  for (const ring of rings) {
    view.setUint32(offset, ring.length, true); offset += 4;
    for (const c of ring) {
      view.setFloat64(offset, c[0], true); offset += 8;
      view.setFloat64(offset, c[1], true); offset += 8;
    }
  }
  return buf;
}

function _wkbMulti(wkbType, items, encodeFn) {
  if (!items) return null;
  const parts = items.map(it => encodeFn(it)).filter(Boolean);
  let totalBytes = 9; // header
  for (const p of parts) totalBytes += p.byteLength;

  const buf = new ArrayBuffer(totalBytes);
  const view = new DataView(buf);
  const u8 = new Uint8Array(buf);
  view.setUint8(0, 1);
  view.setUint32(1, wkbType, true);
  view.setUint32(5, parts.length, true);
  let offset = 9;
  for (const p of parts) {
    u8.set(new Uint8Array(p), offset);
    offset += p.byteLength;
  }
  return buf;
}

function _wkbGeometryCollection(geometries) {
  if (!geometries) return null;
  const parts = geometries.map(g => encodeWKB(g)).filter(Boolean);
  let totalBytes = 9;
  for (const p of parts) totalBytes += p.byteLength;

  const buf = new ArrayBuffer(totalBytes);
  const view = new DataView(buf);
  const u8 = new Uint8Array(buf);
  view.setUint8(0, 1);
  view.setUint32(1, WKB_GEOMETRYCOLLECTION, true);
  view.setUint32(5, parts.length, true);
  let offset = 9;
  for (const p of parts) {
    u8.set(new Uint8Array(p), offset);
    offset += p.byteLength;
  }
  return buf;
}

// ── Helpers ──────────────────────────────────────────────────────────

function _sanitiseTableName(name) {
  return name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^(\d)/, '_$1').substring(0, 63) || 'layer';
}

function _collectPropertyKeys(features) {
  const keys = new Set();
  for (const f of features) {
    if (f.properties) {
      for (const k of Object.keys(f.properties)) keys.add(k);
    }
  }
  // Remove keys that conflict with reserved columns
  keys.delete('fid');
  keys.delete('geom');
  return [...keys];
}

function _computeBBox(features) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const f of features) {
    const fb = _featureBBox(f);
    if (fb) {
      if (fb[0] < minX) minX = fb[0];
      if (fb[1] < minY) minY = fb[1];
      if (fb[2] > maxX) maxX = fb[2];
      if (fb[3] > maxY) maxY = fb[3];
    }
  }
  return [minX, minY, maxX, maxY];
}

function _featureBBox(feature) {
  if (!feature.geometry) return null;
  const coords = _flattenCoords(feature.geometry);
  if (coords.length === 0) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < coords.length; i += 2) {
    if (coords[i] < minX) minX = coords[i];
    if (coords[i + 1] < minY) minY = coords[i + 1];
    if (coords[i] > maxX) maxX = coords[i];
    if (coords[i + 1] > maxY) maxY = coords[i + 1];
  }
  return [minX, minY, maxX, maxY];
}

function _geomBBox(geometry) {
  const coords = _flattenCoords(geometry);
  if (coords.length === 0) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < coords.length; i += 2) {
    if (coords[i] < minX) minX = coords[i];
    if (coords[i + 1] < minY) minY = coords[i + 1];
    if (coords[i] > maxX) maxX = coords[i];
    if (coords[i + 1] > maxY) maxY = coords[i + 1];
  }
  return [minX, minY, maxX, maxY];
}

function _flattenCoords(geometry) {
  const out = [];
  _walkCoords(geometry.coordinates || geometry.geometries, out, geometry.type);
  return out;
}

function _walkCoords(data, out, type) {
  if (!data) return;
  if (type === 'GeometryCollection') {
    for (const g of data) _walkCoords(g.coordinates || g.geometries, out, g.type);
    return;
  }
  if (typeof data[0] === 'number') {
    out.push(data[0], data[1]);
    return;
  }
  for (const item of data) _walkCoords(item, out);
}

const GEOM_TYPE_MAP = {
  Point: 'POINT', LineString: 'LINESTRING', Polygon: 'POLYGON',
  MultiPoint: 'MULTIPOINT', MultiLineString: 'MULTILINESTRING',
  MultiPolygon: 'MULTIPOLYGON', GeometryCollection: 'GEOMETRYCOLLECTION'
};

function _dominantGeomType(features) {
  const counts = {};
  for (const f of features) {
    const t = f.geometry?.type;
    if (t) counts[t] = (counts[t] || 0) + 1;
  }
  let best = 'GEOMETRY', max = 0;
  for (const [t, c] of Object.entries(counts)) {
    if (c > max) { max = c; best = GEOM_TYPE_MAP[t] || 'GEOMETRY'; }
  }
  return best;
}
