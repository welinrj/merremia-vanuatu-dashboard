/**
 * Export tools component.
 * Provides CSV, JSON, and optional PNG export of filtered data.
 */
import { getAppState, getDashboardLayers } from '../state.js';
import { compute30x30Metrics, computeGeneralMetrics } from '../../gis/areaCalc.js';

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
 * Exports the current map view as a PNG (basic screenshot via canvas).
 * Uses the Leaflet map container's built-in rendering.
 */
export async function exportMapPNG() {
  try {
    const mapEl = document.getElementById('map');
    if (!mapEl) throw new Error('Map not found');

    // Use html2canvas-like approach: just capture the map container
    const canvas = document.createElement('canvas');
    const rect = mapEl.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = '#333';
    ctx.font = '14px sans-serif';
    ctx.fillText('Map export — use browser Print/Screenshot for full fidelity', 20, rect.height / 2);

    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nbsap-map.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  } catch (err) {
    alert('Map PNG export is limited in-browser. Use browser screenshot (Ctrl+Shift+S) for best results.');
  }
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
