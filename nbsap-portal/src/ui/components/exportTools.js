/**
 * Export tools component.
 * Provides CSV, JSON, and PNG export of filtered data.
 */
import { getAppState, getDashboardLayers } from '../state.js';
import { compute30x30Metrics, computeGeneralMetrics } from '../../gis/areaCalc.js';
import { getMap } from './mapView.js';

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
 * Exports the current map view as a PNG by compositing tile images and
 * Leaflet canvas layers onto a single export canvas.
 */
export async function exportMapPNG() {
  const leafletMap = getMap();
  const mapEl = document.getElementById('map');
  if (!leafletMap || !mapEl) {
    alert('Map not ready. Please wait for layers to load.');
    return;
  }

  try {
    const size = leafletMap.getSize();
    const dpr = 2; // retina-quality output
    const canvas = document.createElement('canvas');
    canvas.width = size.x * dpr;
    canvas.height = size.y * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // 1) White background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size.x, size.y);

    // 2) Draw tile images
    const mapPane = mapEl.querySelector('.leaflet-map-pane');
    const mapTransform = _parseTransform(mapPane);
    const tilePane = mapEl.querySelector('.leaflet-tile-pane');

    if (tilePane) {
      const tileContainers = tilePane.querySelectorAll('.leaflet-tile-container');
      for (const container of tileContainers) {
        const containerTransform = _parseTransform(container);
        const tiles = container.querySelectorAll('img.leaflet-tile');
        for (const tile of tiles) {
          if (!tile.complete || tile.naturalWidth === 0) continue;
          try {
            const tileTransform = _parseTransform(tile);
            const x = mapTransform.x + containerTransform.x + tileTransform.x;
            const y = mapTransform.y + containerTransform.y + tileTransform.y;
            ctx.drawImage(tile, x, y, tile.width, tile.height);
          } catch (_) { /* CORS tile — skip */ }
        }
      }
    }

    // 3) Draw all canvas layers (feature overlays rendered by Leaflet canvas renderer)
    const canvasLayers = mapEl.querySelectorAll('.leaflet-overlay-pane canvas');
    for (const cvs of canvasLayers) {
      if (cvs.width === 0 || cvs.height === 0) continue;
      try {
        const paneTransform = _parseTransform(mapEl.querySelector('.leaflet-overlay-pane'));
        const cvsTransform = _parseTransform(cvs);
        const x = mapTransform.x + paneTransform.x + cvsTransform.x;
        const y = mapTransform.y + paneTransform.y + cvsTransform.y;
        ctx.drawImage(cvs, x, y);
      } catch (_) { /* tainted canvas — skip */ }
    }

    // 4) Draw SVG overlay (province boundaries, tooltips) if present
    const svgOverlays = mapEl.querySelectorAll('.leaflet-overlay-pane svg');
    for (const svg of svgOverlays) {
      try {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const img = await _loadImage(svgUrl);
        URL.revokeObjectURL(svgUrl);
        const paneTransform = _parseTransform(mapEl.querySelector('.leaflet-overlay-pane'));
        const svgRect = svg.getBoundingClientRect();
        const mapRect = mapEl.getBoundingClientRect();
        const x = svgRect.left - mapRect.left;
        const y = svgRect.top - mapRect.top;
        ctx.drawImage(img, x, y, svgRect.width, svgRect.height);
      } catch (_) { /* SVG render fail — skip */ }
    }

    // 5) Attribution line
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillRect(0, size.y - 22, size.x, 22);
    ctx.fillStyle = '#555';
    ctx.font = '11px sans-serif';
    ctx.fillText('Vanuatu NBSAP GIS Portal — ' + new Date().toLocaleDateString('en-GB'), 8, size.y - 7);

    // 6) Export as PNG download
    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nbsap-map.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  } catch (err) {
    console.error('Map PNG export failed:', err);
    alert('Map PNG export failed. Try using browser Print/Screenshot (Ctrl+Shift+S) instead.');
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
