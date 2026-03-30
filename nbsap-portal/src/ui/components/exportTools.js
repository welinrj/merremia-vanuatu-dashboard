/**
 * Export tools component.
 * Provides CSV, JSON, and PNG export of filtered data.
 */
import { getAppState, getDashboardLayers } from '../state.js';
import { compute30x30Metrics, computeGeneralMetrics } from '../../gis/areaCalc.js';
import { getMap } from './mapView.js';
import { showAlert } from './dialog.js';
import { exportMapTemplate } from './mapTemplate.js';
import targetsConfig from '../../config/targets.js';

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
 * Exports the current map view as a professional A4-landscape PNG
 * using the cartographic template (header, map, sidebar, footer).
 */
export async function exportMapPNG() {
  const leafletMap = getMap();
  const mapEl = document.getElementById('map');
  if (!leafletMap || !mapEl) {
    showAlert('Map not ready. Please wait for layers to load.');
    return;
  }

  try {
    const state   = getAppState();
    const layers  = getDashboardLayers();
    const filters = state.filters;

    // ── Derive title / subtitle from active target ────────────────────────
    const activeTargets = filters.targets || [];
    let title    = 'Vanuatu NBSAP Conservation Areas';
    let subtitle = '';
    if (activeTargets.length === 1) {
      const tCode = activeTargets[0];
      const tConf = targetsConfig.targets.find(t => t.code === tCode);
      if (tConf) {
        title    = `${tCode}: ${tConf.name}`;
        subtitle = tConf.description || '';
      }
    }
    if (filters.province && filters.province !== 'All') {
      subtitle = [subtitle, `Province: ${filters.province}`].filter(Boolean).join('  ·  ');
    }
    if (filters.realm && filters.realm !== 'All') {
      subtitle = [subtitle, `Realm: ${filters.realm}`].filter(Boolean).join('  ·  ');
    }

    // ── Build legend items from visible layers ────────────────────────────
    const legendLayers = layers
      .filter(l => {
        const meta = l.metadata;
        if (activeTargets.length > 0 && !meta.targets.some(t => activeTargets.includes(t))) return false;
        if (filters.category && filters.category !== 'All' && meta.category !== filters.category) return false;
        return true;
      })
      .slice(0, 16) // cap legend at 16 items
      .map(l => ({
        label:   l.metadata.name,
        color:   l.metadata.color || '#006B3F',
        symbol:  l.metadata.geometryType === 'Point' ? 'point' : 'polygon',
        area_ha: l.metadata.totalAreaHa || null,
      }));

    await exportMapTemplate(leafletMap, mapEl, {
      title,
      subtitle,
      layers: legendLayers,
    });

  } catch (err) {
    console.error('Map PNG export failed:', err);
    if (window.confirm(
      'PNG export could not complete.\n\nPress OK to open the Print dialog instead.'
    )) {
      window.print();
    }
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
