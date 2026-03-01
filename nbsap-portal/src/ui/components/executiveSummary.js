/**
 * Data Overview banner.
 * Shows aggregate statistics about all loaded GIS data —
 * datasets, features, total mapped area, provinces, target coverage, and last upload.
 *
 * Sits at the top of the dashboard as a quick-status strip.
 * Designed for decision makers who need an instant state-of-the-data glance.
 */
import targetsConfig from '../../config/targets.js';
import { getDashboardLayers, getAppState } from '../state.js';
import { computeGeneralMetrics } from '../../gis/areaCalc.js';

const ic = (path, w = 16) =>
  `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const ICONS = {
  layers:    ic('<path d="m2 8 10-6 10 6v10l-10 6L2 18V8z"/><path d="m22 8-10 6L2 8"/>'),
  records:   ic('<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>'),
  area:      ic('<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>'),
  provinces: ic('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'),
  targets:   ic('<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'),
  calendar:  ic('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'),
};

/**
 * Renders the data overview banner.
 * @param {HTMLElement} container
 */
export function renderExecutiveSummary(container) {
  const layers = getDashboardLayers();
  const state  = getAppState();

  // Total datasets
  const totalLayers = layers.length;

  // Total features from loaded GeoJSON
  let totalFeatures = 0;
  for (const l of layers) totalFeatures += l.geojson?.features?.length ?? 0;

  // Total gross mapped area across all layers
  let totalAreaHa = 0;
  try {
    const blanket = { targets: [], province: 'All', category: 'All', realm: 'All', year: 'All' };
    totalAreaHa = computeGeneralMetrics(layers, blanket).grossAreaHa;
  } catch (_) {}

  // Provinces with data
  const provinceCount = state.provinces.length;

  // Targets with at least one layer
  const targetsWithData = targetsConfig.targets.filter(t =>
    layers.some(l => l.metadata?.targets?.includes(t.code))
  ).length;
  const totalTargets = targetsConfig.targets.length;

  // Most recent upload timestamp
  let latestDate = null;
  for (const l of layers) {
    const ts = l.metadata?.uploadTimestamp;
    if (ts) {
      const d = new Date(ts);
      if (!latestDate || d > latestDate) latestDate = d;
    }
  }
  const dateStr = latestDate
    ? latestDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : '—';

  const stats = [
    { icon: ICONS.layers,    value: totalLayers || '—',              label: 'Datasets',    color: '#1565C0' },
    { icon: ICONS.records,   value: fmtNum(totalFeatures),           label: 'Features',    color: '#7E57C2' },
    { icon: ICONS.area,      value: fmtHa(totalAreaHa),              label: 'Mapped Area', color: '#2E7D32' },
    { icon: ICONS.provinces, value: provinceCount ? `${provinceCount}/6` : '—', label: 'Provinces', color: '#D84315' },
    { icon: ICONS.targets,   value: `${targetsWithData}/${totalTargets}`, label: 'Targets', color: '#00838F' },
    { icon: ICONS.calendar,  value: dateStr,                         label: 'Last Upload', color: '#795548' },
  ];

  const tiles = stats.map(s => `
    <div class="data-stat-tile">
      <span class="data-stat-icon" style="color:${s.color}">${s.icon}</span>
      <div class="data-stat-body">
        <span class="data-stat-value">${s.value}</span>
        <span class="data-stat-label">${s.label}</span>
      </div>
    </div>
  `).join('<div class="data-stat-divider"></div>');

  container.innerHTML = `
    <div class="exec-summary">
      <div class="data-stat-bar">${tiles}</div>
    </div>
  `;
}

function fmtHa(val) {
  if (!val) return '0 ha';
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M ha';
  if (val >= 1000)    return (val / 1000).toFixed(1) + 'K ha';
  return Math.round(val) + ' ha';
}

function fmtNum(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}
