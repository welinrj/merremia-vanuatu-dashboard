/**
 * Export tools component.
 * Provides CSV, JSON, and PNG export of filtered data.
 */
import { getAppState, getDashboardLayers } from '../state.js';
import { compute30x30Metrics, computeGeneralMetrics } from '../../gis/areaCalc.js';
import { getMap } from './mapView.js';
import { showAlert } from './dialog.js';

/**
 * Exports the current summary table as CSV, respecting active filters.
 */
export function exportCSV() {
  const state = getAppState();
  const layers = getDashboardLayers();
  const filters = state.filters;
  const t3Active = filters.targets.length === 0 || filters.targets.includes('T3');

  const rows = [['Layer', 'Category', 'Realm', 'Province', 'Name', 'Area (ha)', 'Targets', 'Status', 'Year']];

  for (const layer of layers) {
    const meta = layer.metadata;

    if (filters.targets.length > 0 && !meta.targets.some(t => filters.targets.includes(t))) continue;
    if (filters.category && filters.category !== 'All' && meta.category !== filters.category) continue;

    for (const f of (layer.geojson?.features || [])) {
      const p = f.properties || {};
      if (filters.province && filters.province !== 'All' && p.province !== filters.province) continue;
      if (filters.realm && filters.realm !== 'All' && p.realm !== filters.realm) continue;
      if (filters.year && filters.year !== 'All' && String(p.year) !== String(filters.year)) continue;

      rows.push([
        meta.name,
        meta.category,
        p.realm || '',
        p.province || '',
        p.name || '',
        (p.area_ha || 0).toFixed(2),
        (p.targets || []).join(';'),
        p.status || '',
        p.year || ''
      ]);
    }
  }

  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  downloadFile(csv, 'nbsap-export.csv', 'text/csv');
}

/**
 * Exports a TOR reporting snapshot as JSON, respecting active filters.
 */
export function exportTORSnapshot() {
  const state = getAppState();
  const filters = state.filters;
  const layers = getDashboardLayers();
  const t3Active = filters.targets.length === 0 || filters.targets.includes('T3');

  const snapshot = {
    type: 'TOR_Reporting_Snapshot',
    version: '1.0',
    timestamp: new Date().toISOString(),
    filters: { ...filters },
    includedLayers: [],
    metrics: {}
  };

  if (t3Active) {
    snapshot.metrics = compute30x30Metrics(layers, filters);
  }

  const general = computeGeneralMetrics(layers, filters);
  snapshot.metrics.general = general;

  for (const layer of layers) {
    const meta = layer.metadata;
    if (filters.targets.length > 0 && !meta.targets.some(t => filters.targets.includes(t))) continue;
    if (filters.category && filters.category !== 'All' && meta.category !== filters.category) continue;

    snapshot.includedLayers.push({
      id: meta.id,
      name: meta.name,
      category: meta.category,
      targets: meta.targets,
      realm: meta.realm,
      featureCount: meta.featureCount,
      totalAreaHa: meta.totalAreaHa,
      countsToward30x30: meta.countsToward30x30,
      status: meta.status
    });
  }

  const json = JSON.stringify(snapshot, null, 2);
  downloadFile(json, 'tor-snapshot.json', 'application/json');
}

/**
 * Exports the current map view as a PNG.
 *
 * Strategy:
 *   1. Reload every visible tile with crossOrigin='anonymous' so the canvas
 *      is not tainted (Leaflet loads tiles without CORS by default).
 *   2. Composite tile layer + vector overlay (canvas) + SVG overlay onto one canvas.
 *   3. Try canvas.toBlob() — if it still throws a SecurityError (some CDNs
 *      don't return CORS headers) fall back to a vector-only export on a
 *      plain ocean-blue background which always works.
 *   4. Last resort: trigger window.print() so the user can Save as PDF.
 */
export async function exportMapPNG() {
  const leafletMap = getMap();
  const mapEl = document.getElementById('map');
  if (!leafletMap || !mapEl) {
    showAlert('Map not ready. Please wait for layers to load.');
    return;
  }

  try {
    const size = leafletMap.getSize();
    const dpr  = Math.min(window.devicePixelRatio || 1, 2); // cap at 2× for memory

    // ── Collect tile sources before touching the canvas ──────────────────
    const mapPane      = mapEl.querySelector('.leaflet-map-pane');
    const mapTransform = _parseTransform(mapPane);
    const tilePane     = mapEl.querySelector('.leaflet-tile-pane');
    const tileItems    = []; // { src, x, y, w, h }

    if (tilePane) {
      for (const container of tilePane.querySelectorAll('.leaflet-tile-container')) {
        const cT = _parseTransform(container);
        for (const tile of container.querySelectorAll('img.leaflet-tile')) {
          if (!tile.src || tile.naturalWidth === 0) continue;
          const tT = _parseTransform(tile);
          tileItems.push({
            src: tile.src,
            x: mapTransform.x + cT.x + tT.x,
            y: mapTransform.y + cT.y + tT.y,
            w: tile.width || 256,
            h: tile.height || 256
          });
        }
      }
    }

    // ── Load tiles with crossOrigin to avoid tainting the canvas ─────────
    const tileImages = await Promise.all(
      tileItems.map(item =>
        _loadImageCORS(item.src)
          .then(img => ({ img, ...item }))
          .catch(() => null) // skip tiles that fail CORS (CDN without CORS headers)
      )
    );

    // ── Load SVG overlays as images (blob URL, always safe) ──────────────
    const overlayPane = mapEl.querySelector('.leaflet-overlay-pane');
    const mapRect     = mapEl.getBoundingClientRect();
    const svgImages   = [];
    for (const svg of mapEl.querySelectorAll('.leaflet-overlay-pane svg')) {
      try {
        const svgBlob = new Blob(
          [new XMLSerializer().serializeToString(svg)],
          { type: 'image/svg+xml;charset=utf-8' }
        );
        const svgUrl = URL.createObjectURL(svgBlob);
        const img    = await _loadImage(svgUrl);
        URL.revokeObjectURL(svgUrl);
        const r = svg.getBoundingClientRect();
        svgImages.push({ img, x: r.left - mapRect.left, y: r.top - mapRect.top, w: r.width, h: r.height });
      } catch (_) { /* skip */ }
    }

    // ── Build canvas ──────────────────────────────────────────────────────
    const canvas = _makeCanvas(size.x, size.y, dpr);
    const ctx    = canvas.ctx;

    // Background
    ctx.fillStyle = '#e8f4f8'; // ocean blue — visible if tiles fail
    ctx.fillRect(0, 0, size.x, size.y);

    // Tile layer
    for (const item of tileImages) {
      if (!item) continue;
      try { ctx.drawImage(item.img, item.x, item.y, item.w, item.h); } catch (_) { /* skip */ }
    }

    // Vector canvas overlays (GeoJSON polygons/lines rendered by Leaflet)
    for (const cvs of mapEl.querySelectorAll('.leaflet-overlay-pane canvas')) {
      if (!cvs.width || !cvs.height) continue;
      try {
        const pT = _parseTransform(overlayPane);
        const cT = _parseTransform(cvs);
        ctx.drawImage(cvs, mapTransform.x + pT.x + cT.x, mapTransform.y + pT.y + cT.y);
      } catch (_) { /* tainted — skip */ }
    }

    // SVG overlays (province boundaries, tooltips)
    for (const item of svgImages) {
      try { ctx.drawImage(item.img, item.x, item.y, item.w, item.h); } catch (_) { /* skip */ }
    }

    _drawAttribution(ctx, size);

    // ── Export ────────────────────────────────────────────────────────────
    const ok = await _downloadCanvas(canvas.el, 'nbsap-map.png');
    if (!ok) {
      // Canvas tainted despite CORS attempt — vector-only fallback
      await _exportVectorOnly(mapEl, mapTransform, overlayPane, svgImages, size, dpr, mapRect);
    }

  } catch (err) {
    console.error('Map PNG export failed:', err);
    _printFallback();
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Creates a 2× (retina) canvas and returns { el, ctx }. */
function _makeCanvas(w, h, dpr) {
  const el  = document.createElement('canvas');
  el.width  = w * dpr;
  el.height = h * dpr;
  const ctx = el.getContext('2d');
  ctx.scale(dpr, dpr);
  return { el, ctx };
}

/** Draws an attribution bar at the bottom of the canvas. */
function _drawAttribution(ctx, size) {
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.fillRect(0, size.y - 22, size.x, 22);
  ctx.fillStyle = '#444';
  ctx.font = '11px sans-serif';
  ctx.fillText(
    'Vanuatu NBSAP GIS Portal — ' + new Date().toLocaleDateString('en-GB'),
    8, size.y - 7
  );
}

/**
 * Fallback: render only the vector overlays on a plain background.
 * Never tainted because GeoJSON canvas layers are drawn from local data.
 */
async function _exportVectorOnly(mapEl, mapTransform, overlayPane, svgImages, size, dpr, mapRect) {
  const canvas = _makeCanvas(size.x, size.y, dpr);
  const ctx    = canvas.ctx;

  ctx.fillStyle = '#d6eaf5';
  ctx.fillRect(0, 0, size.x, size.y);

  // Note banner
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillRect(4, 4, 280, 22);
  ctx.fillStyle = '#555';
  ctx.font = '11px sans-serif';
  ctx.fillText('Background tiles omitted (cross-origin restriction)', 8, 19);

  for (const cvs of mapEl.querySelectorAll('.leaflet-overlay-pane canvas')) {
    if (!cvs.width || !cvs.height) continue;
    try {
      const pT = _parseTransform(overlayPane);
      const cT = _parseTransform(cvs);
      ctx.drawImage(cvs, mapTransform.x + pT.x + cT.x, mapTransform.y + pT.y + cT.y);
    } catch (_) { /* skip */ }
  }

  for (const item of svgImages) {
    try { ctx.drawImage(item.img, item.x, item.y, item.w, item.h); } catch (_) { /* skip */ }
  }

  _drawAttribution(ctx, size);

  const ok = await _downloadCanvas(canvas.el, 'nbsap-map.png');
  if (!ok) _printFallback();
}

/**
 * Attempts to download the canvas as a PNG.
 * Returns true on success, false if the canvas is still tainted (SecurityError).
 */
function _downloadCanvas(canvas, filename) {
  return new Promise(resolve => {
    try {
      canvas.toBlob(blob => {
        if (!blob) { resolve(false); return; }
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href    = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        resolve(true);
      }, 'image/png');
    } catch (secErr) {
      // SecurityError: canvas tainted by cross-origin images
      console.warn('Canvas tainted —', secErr.message);
      resolve(false);
    }
  });
}

/**
 * Loads an image with crossOrigin='anonymous'.
 * Prevents canvas tainting when the CDN supports CORS (OSM, CartoDB, Esri do).
 */
function _loadImageCORS(src) {
  return new Promise((resolve, reject) => {
    const img    = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src     = src;
  });
}

/** Offer browser Print as a last resort. */
function _printFallback() {
  if (window.confirm(
    'PNG export could not complete due to browser security restrictions on tile images.\n\n' +
    'Press OK to open the Print dialog — choose "Save as PDF" or take a screenshot instead.'
  )) {
    window.print();
  }
}

/** Parses CSS translate3d/translate transform into {x, y} offsets. */
function _parseTransform(el) {
  if (!el) return { x: 0, y: 0 };
  const st = el.style?.transform || window.getComputedStyle(el).transform || '';
  // translate3d(Xpx, Ypx, 0px) or translate(Xpx, Ypx) or matrix(...)
  const m3d = st.match(/translate3d\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px/);
  if (m3d) return { x: parseFloat(m3d[1]), y: parseFloat(m3d[2]) };
  const m2d = st.match(/translate\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px/);
  if (m2d) return { x: parseFloat(m2d[1]), y: parseFloat(m2d[2]) };
  const matrix = st.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)/);
  if (matrix) return { x: parseFloat(matrix[1]), y: parseFloat(matrix[2]) };
  return { x: 0, y: 0 };
}

/** Promise-wrapper for loading an image. */
function _loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
