/**
 * Export tools — CSV, JSON snapshot, and professional map PNG.
 */
import { getAppState, getDashboardLayers } from '../state.js';
import {
  compute30x30Metrics, computeGeneralMetrics,
  computeTargetMetrics, computeTarget1Metrics, computeTarget2Metrics
} from '../../gis/areaCalc.js';
import { getMap }                    from './mapView.js';
import { showAlert, showConfirm }    from './dialog.js';
import { exportMapTemplate }         from './mapTemplate.js';
import targetsConfig                 from '../../config/targets.js';
import ENV                           from '../../config/env.js';
import { CATEGORIES }                from '../../config/categories.js';

// ── CSV export ────────────────────────────────────────────────────────────────
export function exportCSV() {
  const state = getAppState(), layers = getDashboardLayers(), filters = state.filters;
  const rows = [['Layer','Category','Realm','Province','Name','Area (ha)','Targets','Status','Year']];
  for (const layer of layers) {
    const meta = layer.metadata;
    if (filters.targets.length > 0 && !meta.targets.some(t => filters.targets.includes(t))) continue;
    if (filters.category && filters.category !== 'All' && meta.category !== filters.category) continue;
    for (const f of (layer.geojson?.features || [])) {
      const p = f.properties || {};
      if (filters.province && filters.province !== 'All' && p.province !== filters.province) continue;
      if (filters.realm    && filters.realm    !== 'All' && p.realm    !== filters.realm)    continue;
      if (filters.year     && filters.year     !== 'All' && String(p.year) !== String(filters.year)) continue;
      rows.push([meta.name, meta.category, p.realm||'', p.province||'', p.name||'',
        (p.area_ha||0).toFixed(2), (p.targets||[]).join(';'), p.status||'', p.year||'']);
    }
  }
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  _dl(csv, 'nbsap-export.csv', 'text/csv');
}

// ── JSON / TOR snapshot ───────────────────────────────────────────────────────
export function exportTORSnapshot() {
  const state = getAppState(), filters = state.filters, layers = getDashboardLayers();
  const snapshot = {
    type:'TOR_Reporting_Snapshot', version:'1.0',
    timestamp: new Date().toISOString(), filters:{...filters},
    includedLayers:[], metrics:{}
  };
  if (filters.targets.length === 0 || filters.targets.includes('T3'))
    snapshot.metrics = compute30x30Metrics(layers, filters);
  snapshot.metrics.general = computeGeneralMetrics(layers, filters);
  for (const layer of layers) {
    const meta = layer.metadata;
    if (filters.targets.length > 0 && !meta.targets.some(t => filters.targets.includes(t))) continue;
    if (filters.category && filters.category !== 'All' && meta.category !== filters.category) continue;
    snapshot.includedLayers.push({
      id:meta.id, name:meta.name, category:meta.category, targets:meta.targets,
      realm:meta.realm, featureCount:meta.featureCount, totalAreaHa:meta.totalAreaHa,
      countsToward30x30:meta.countsToward30x30, status:meta.status
    });
  }
  _dl(JSON.stringify(snapshot, null, 2), 'tor-snapshot.json', 'application/json');
}

// ── Map PNG export ────────────────────────────────────────────────────────────
export async function exportMapPNG() {
  const leafletMap = getMap();
  const mapEl = document.getElementById('map');
  if (!leafletMap || !mapEl) { showAlert('Map not ready. Please wait for layers to load.'); return; }

  try {
    const state   = getAppState();
    const layers  = getDashboardLayers();
    const filters = state.filters;
    const bl      = ENV.nationalBaselines;
    const targets = filters.targets || [];
    const tCode   = targets.length === 1 ? targets[0] : '';

    // ── Title / subtitle ────────────────────────────────────────────────────
    let title = 'Vanuatu NBSAP Conservation Areas', subtitle = '';
    if (tCode) {
      const tc = targetsConfig.targets.find(t => t.code === tCode);
      if (tc) { title = `${tc.code}: ${tc.name}`; subtitle = tc.description || ''; }
    }

    // ── Metrics ─────────────────────────────────────────────────────────────
    let tHa = 0, mHa = 0, tPct = 0, mPct = 0, totalFeats = 0, layerCnt = 0;
    let provRows = [], catRows = [];

    const visLayers = layers.filter(l =>
      targets.length === 0 || l.metadata?.targets?.some(t => targets.includes(t))
    );

    if (!tCode || tCode === 'T3') {
      const m = compute30x30Metrics(layers, filters);
      tHa = m.terrestrial_ha; mHa = m.marine_ha;
      tPct = m.terrestrial_pct; mPct = m.marine_pct;
      totalFeats = m.total_features || 0;
      layerCnt   = visLayers.length;
      provRows   = m.provinceBreakdown || [];
    } else if (tCode === 'T1') {
      const m = computeTarget1Metrics(layers, filters);
      tHa = m.terrestrial_ha; mHa = m.marine_ha;
      tPct = m.terrestrial_pct; mPct = m.marine_pct;
      totalFeats = m.totalFeatures || 0; layerCnt = m.layerCount || visLayers.length;
      provRows = m.provinceBreakdown || []; catRows = m.categoryBreakdown || [];
    } else if (tCode === 'T2') {
      const m = computeTarget2Metrics(layers, filters);
      tHa = m.realmTotals?.terrestrial_ha || 0; mHa = m.realmTotals?.marine_ha || 0;
      tPct = bl.terrestrial_ha > 0 ? tHa/bl.terrestrial_ha*100 : 0;
      mPct = bl.marine_ha      > 0 ? mHa/bl.marine_ha*100      : 0;
      totalFeats = m.totalFeatures || 0; layerCnt = m.layerCount || visLayers.length;
      provRows = m.provinceBreakdown || []; catRows = m.categoryBreakdown || [];
    } else {
      const m = computeTargetMetrics(layers, tCode, filters);
      tHa = m.realmTotals?.terrestrial_ha || 0; mHa = m.realmTotals?.marine_ha || 0;
      tPct = bl.terrestrial_ha > 0 ? tHa/bl.terrestrial_ha*100 : 0;
      mPct = bl.marine_ha      > 0 ? mHa/bl.marine_ha*100      : 0;
      totalFeats = m.totalFeatures || 0; layerCnt = m.layerCount || visLayers.length;
      provRows = m.provinceBreakdown || []; catRows = m.categoryBreakdown || [];
    }

    // ── Stats bar ────────────────────────────────────────────────────────────
    const fH = v => !v&&v!==0?'0': v>=1e6?`${(v/1e6).toFixed(2)}M`: v>=1e3?`${(v/1e3).toFixed(1)}K`: v.toFixed(0);
    const fB = v => !v?'': v>=1e6?`OF ${(v/1e6).toFixed(2)}M`: v>=1e3?`OF ${(v/1e3).toFixed(1)}K`: `OF ${v.toFixed(0)}`;
    const stats = [
      { value: fH(tHa),              label:'TERRESTRIAL (NET, HA)', color:'#006B3F' },
      { value: fH(mHa),              label:'MARINE (NET, HA)',       color:'#0072BC' },
      { value: `${tPct.toFixed(1)}%`,label:'% LAND',                color:'#006B3F', sublabel:fB(bl.terrestrial_ha) },
      { value: `${mPct.toFixed(1)}%`,label:'% SEA',                 color:'#0072BC', sublabel:fB(bl.marine_ha) },
      { value: String(totalFeats),   label:'RECORDS',               color:'#1A202C' },
      { value: String(layerCnt),     label:'DATA LAYERS',           color:'#1A202C' },
    ];

    // ── Color map for categories ─────────────────────────────────────────────
    const colorMap = {};
    for (const l of layers) {
      if (l.metadata?.category && !colorMap[l.metadata.category])
        colorMap[l.metadata.category] = l.metadata.color || '#006B3F';
    }

    // ── Legend items ─────────────────────────────────────────────────────────
    const legendItems = visLayers.slice(0, 14).map(l => ({
      label:  l.metadata.name,
      color:  l.metadata.color || '#006B3F',
      symbol: l.metadata.geometryType === 'Point' ? 'point' : 'polygon',
    }));
    legendItems.push({ label:'Province Boundary', color:'#666', symbol:'province' });

    // ── Category rows ────────────────────────────────────────────────────────
    const categoryRows = catRows.map(c => ({
      label:    CATEGORIES[c.category]?.label || c.category,
      color:    colorMap[c.category] || '#006B3F',
      area_ha:  c.area_ha,
      features: c.features,
    }));

    // ── Summary ──────────────────────────────────────────────────────────────
    const totalHa = (tHa + mHa).toLocaleString('en', { minimumFractionDigits:2, maximumFractionDigits:2 });
    const summary = `Total area: ${totalHa} ha  |  ${totalFeats} records across ${layerCnt} dataset${layerCnt!==1?'s':''}`;

    // ── Fit map to feature bounds so layers appear clearly in the export ─────
    const exportBounds = _computeFeatureBounds(visLayers.filter(l => !l.metadata?.isReference));
    if (exportBounds) {
      leafletMap.fitBounds(exportBounds, { padding: [30, 30], maxZoom: 13, animate: false });
      // Wait for tiles + vector canvas to fully repaint before capturing
      await new Promise(r => setTimeout(r, 800));
    }

    await exportMapTemplate(leafletMap, mapEl, {
      title, subtitle, targetCode:tCode, stats, legendItems,
      summary, provinceRows:provRows, categoryRows,
    });

  } catch (err) {
    console.error('Map PNG export failed:', err);
    const ok = await showConfirm(
      'Map PNG export could not complete.\n\nPress OK to open the Print dialog instead.',
      { title:'Export Error', okLabel:'Open Print Dialog', cancelLabel:'Cancel' }
    );
    if (ok) window.print();
  }
}

// ── Internal ──────────────────────────────────────────────────────────────────

/**
 * Computes [SW, NE] lat/lng bounds from all features in the given layers.
 * Returns null if no valid coordinates are found.
 */
function _computeFeatureBounds(layers) {
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180, found = false;
  for (const layer of layers) {
    for (const f of (layer.geojson?.features || [])) {
      for (const [lng, lat] of _flatCoords(f.geometry)) {
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) continue;
        minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng); maxLng = Math.max(maxLng, lng);
        found = true;
      }
    }
  }
  return found ? [[minLat, minLng], [maxLat, maxLng]] : null;
}

function _flatCoords(geom) {
  if (!geom) return [];
  switch (geom.type) {
    case 'Point':           return [geom.coordinates];
    case 'MultiPoint':
    case 'LineString':      return geom.coordinates;
    case 'MultiLineString':
    case 'Polygon':         return geom.coordinates.flat();
    case 'MultiPolygon':    return geom.coordinates.flat(2);
    default:                return [];
  }
}

function _dl(content, filename, mime) {
  const url = URL.createObjectURL(new Blob([content], { type:mime }));
  const a = document.createElement('a'); a.href=url; a.download=filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
