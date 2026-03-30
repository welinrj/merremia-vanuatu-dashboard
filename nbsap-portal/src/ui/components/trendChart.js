/**
 * Time-series trend chart.
 *
 * Shows how coverage area for a given NBSAP target has grown over the years,
 * using the `year` property on individual features.
 *
 * - T3, T1, T2 use cumulative mode (conservation areas accumulate year on year)
 * - All other targets use per-year mode (area mapped/recorded in that year)
 * - For T3 a dashed 30% milestone line is overlaid on the chart
 *
 * Rendered as inline SVG — no external chart library required.
 */
import { getDashboardLayers } from '../state.js';
import TARGETS_CONFIG from '../../config/targets.js';
import ENV from '../../config/env.js';

// Targets where area accumulates over time (PAs/CCAs don't disappear)
const CUMULATIVE_TARGETS = new Set(['T3', 'T1', 'T2']);

/**
 * Renders a time-series chart for the given target.
 * @param {HTMLElement} container
 * @param {string} targetCode e.g. 'T3'
 */
export function renderTrendChart(container, targetCode) {
  const layers  = getDashboardLayers();
  const tCfg    = TARGETS_CONFIG.targets.find(t => t.code === targetCode);
  const color   = tCfg?.color || '#006B3F';
  const isCumul = CUMULATIVE_TARGETS.has(targetCode);

  const yearMap = _collectByYear(layers, targetCode);
  const years   = Object.keys(yearMap).map(Number).sort((a, b) => a - b);

  if (years.length < 2) {
    container.innerHTML = `
      <div class="trend-empty">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 4-6"/></svg>
        <span>Trend data unavailable — upload datasets with the <strong>year</strong> field populated to see coverage over time.</span>
      </div>`;
    return;
  }

  // Build series — cumulative or per-year
  let running = 0;
  const series = years.map(yr => {
    const d = yearMap[yr];
    if (isCumul) {
      running += d.area_ha;
      return { year: yr, value: running, features: d.features };
    }
    return { year: yr, value: d.area_ha, features: d.features };
  });

  // Chart geometry
  const W   = 520;
  const H   = 190;
  const PAD = { top: 18, right: 28, bottom: 40, left: 72 };
  const cW  = W - PAD.left - PAD.right;
  const cH  = H - PAD.top  - PAD.bottom;
  const n   = series.length;

  const maxVal  = Math.max(...series.map(s => s.value), 1);
  const xOf     = i  => PAD.left + (n > 1 ? (i / (n - 1)) * cW : cW / 2);
  const yOf     = v  => PAD.top  + cH - (v / maxVal) * cH;

  // SVG path strings
  const pts      = series.map((s, i) => `${xOf(i)},${yOf(s.value)}`);
  const linePath = `M ${pts.join(' L ')}`;
  const areaPath = `M ${xOf(0)},${PAD.top + cH} L ${pts.join(' L ')} L ${xOf(n - 1)},${PAD.top + cH} Z`;

  // Y-axis ticks (5 evenly spaced)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(frac => ({
    y:     yOf(frac * maxVal),
    label: _fmtShort(frac * maxVal)
  }));

  const gridLines = yTicks.map(t =>
    `<line x1="${PAD.left}" y1="${t.y}" x2="${PAD.left + cW}" y2="${t.y}"
           stroke="#E4E7EB" stroke-width="0.5"/>`
  ).join('');

  const yLabels = yTicks.map(t =>
    `<text x="${PAD.left - 6}" y="${t.y + 4}" text-anchor="end"
           font-size="10" fill="#7B8794">${t.label}</text>`
  ).join('');

  const xLabels = series.map((s, i) => {
    // Skip crowded labels — show every nth label when many years
    const step = n > 12 ? 3 : n > 8 ? 2 : 1;
    if (i % step !== 0 && i !== n - 1) return '';
    return `<text x="${xOf(i)}" y="${H - 8}" text-anchor="middle"
                  font-size="10" fill="#7B8794">${s.year}</text>`;
  }).join('');

  // Hover dots with tooltips
  const baselines  = ENV.nationalBaselines;
  const totalHa    = baselines.terrestrial_ha + baselines.marine_ha;
  const isT3       = targetCode === 'T3';

  const dots = series.map((s, i) => {
    const tipPct = isT3 ? ` (${((s.value / totalHa) * 100).toFixed(1)}%)` : '';
    const tip    = `${s.year}: ${_fmtShort(s.value)} ha${tipPct} · ${s.features} feature${s.features !== 1 ? 's' : ''}`;
    return `<circle cx="${xOf(i)}" cy="${yOf(s.value)}" r="4"
                    fill="${color}" stroke="#fff" stroke-width="1.5"
                    class="trend-dot" style="cursor:default">
              <title>${tip}</title>
            </circle>`;
  }).join('');

  // 30% milestone reference line for T3
  let milestoneLine = '';
  if (isT3) {
    const y30 = yOf(0.30 * totalHa);
    if (y30 >= PAD.top && y30 <= PAD.top + cH) {
      milestoneLine = `
        <line x1="${PAD.left}" y1="${y30}" x2="${PAD.left + cW}" y2="${y30}"
              stroke="#2E7D32" stroke-width="1.2" stroke-dasharray="5,3" opacity="0.7"/>
        <text x="${PAD.left + cW + 3}" y="${y30 + 4}"
              font-size="9" fill="#2E7D32" font-weight="600">30%</text>`;
    }
  }

  // Y-axis unit label (rotated)
  const yUnit = isCumul ? 'ha cumulative' : 'ha per year';
  const yUnitX = PAD.left - 56;
  const yUnitY = PAD.top + cH / 2;

  // Last data point annotation
  const last     = series[series.length - 1];
  const lastX    = xOf(n - 1);
  const lastY    = yOf(last.value);
  const lastLabel = isT3
    ? `${((last.value / totalHa) * 100).toFixed(1)}%`
    : _fmtShort(last.value) + ' ha';
  const annotX   = lastX - 6;
  const annotY   = lastY - 10;

  const modeLabel = isCumul ? '(cumulative)' : '(per year)';
  const chartTitle = `${targetCode} Coverage Over Time ${modeLabel}`;

  container.innerHTML = `
    <div class="trend-chart-wrap">
      <div class="trend-chart-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 4-6"/></svg>
        ${chartTitle}
      </div>
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"
           class="trend-chart-svg" role="img"
           aria-label="${chartTitle}">

        <!-- grid lines -->
        ${gridLines}

        <!-- area fill -->
        <path d="${areaPath}" fill="${color}" fill-opacity="0.07"/>

        <!-- 30% milestone line -->
        ${milestoneLine}

        <!-- trend line -->
        <path d="${linePath}" fill="none" stroke="${color}" stroke-width="2"
              stroke-linejoin="round" stroke-linecap="round"/>

        <!-- dots -->
        ${dots}

        <!-- last-point annotation -->
        <text x="${annotX}" y="${annotY}" text-anchor="end"
              font-size="11" font-weight="700" fill="${color}">${lastLabel}</text>

        <!-- y labels -->
        ${yLabels}

        <!-- x labels -->
        ${xLabels}

        <!-- y axis unit (rotated) -->
        <text x="${yUnitX}" y="${yUnitY}" text-anchor="middle"
              font-size="9" fill="#9AA5B4"
              transform="rotate(-90 ${yUnitX} ${yUnitY})">${yUnit}</text>
      </svg>
      ${isCumul ? `
        <div class="trend-note">
          Area shown is cumulative — conservation areas established in earlier years remain in subsequent years.
          ${isT3 ? 'Dashed green line marks the GBF 30% milestone.' : ''}
        </div>` : `
        <div class="trend-note">Area shown is the total mapped for features recorded in that year.</div>`
      }
    </div>
  `;
}

/**
 * Aggregates feature area by year for a target.
 * Returns { [year]: { area_ha: number, features: number } }
 */
function _collectByYear(layers, targetCode) {
  const map = {};
  for (const layer of layers) {
    if (!layer.metadata?.targets?.includes(targetCode)) continue;
    for (const f of (layer.geojson?.features || [])) {
      const yr = f.properties?.year;
      if (!yr || typeof yr !== 'number' || yr < 1980 || yr > 2035) continue;
      if (!map[yr]) map[yr] = { area_ha: 0, features: 0 };
      map[yr].area_ha  += f.properties?.area_ha || 0;
      map[yr].features += 1;
    }
  }
  return map;
}

function _fmtShort(ha) {
  if (!ha && ha !== 0) return '0';
  if (ha >= 1_000_000) return `${(ha / 1_000_000).toFixed(1)}M`;
  if (ha >= 1_000)     return `${(ha / 1_000).toFixed(0)}k`;
  return ha.toFixed(0);
}
