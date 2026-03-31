/**
 * GBF 2030 Progress Report Card.
 *
 * Shows all tracked NBSAP targets with a traffic-light status against their
 * GBF Kunming-Montreal 2030 milestones. Each card is clickable to drill into
 * that target in the dashboard.
 *
 * Status logic:
 *   on-track  — metric ≥ milestone threshold (green)
 *   at-risk   — metric ≥ 50% of threshold (amber)
 *   critical  — metric > 0 but < 50% of threshold (red)
 *   has-data  — non-quantified target with data present (blue)
 *   no-data   — no layers uploaded for this target (grey)
 */
import TARGETS_CONFIG from '../../config/targets.js';
import { getDashboardLayers } from '../state.js';
import {
  compute30x30Metrics,
  computeTarget1Metrics,
  computeTarget2Metrics,
  computeTargetMetrics
} from '../../gis/areaCalc.js';
import ENV from '../../config/env.js';

const ALL_FILTER = { targets: [], province: 'All', category: 'All', realm: 'All', year: 'All' };
const T4_SPECIES_KEYS = ['MEGAPODE', 'STARLING', 'FANTAIL', 'KINGFISHER', 'FLYING_FOX', 'PLERANDRA'];

// GBF 2030 milestones per target code
const MILESTONES = {
  T1:  { label: '100% land & sea covered by biodiversity-inclusive spatial plans', threshold: 100, unit: '%' },
  T2:  { label: '≥30% of degraded ecosystems restored',                           threshold: 30,  unit: '%' },
  T3:  { label: '≥30% terrestrial, ≥30% marine & ≥30% combined area conserved',   threshold: 30,  unit: '%' },
  T4:  { label: 'All 6 key Vanuatu species mapped',                               threshold: 100, unit: '%' },
  T6:  { label: 'IAS priority areas mapped & under management',                   threshold: null, unit: null },
  T7:  { label: 'Pesticide & pollution zones mapped',                             threshold: null, unit: null },
  T8:  { label: 'Eutrophication hotspots mapped',                                 threshold: null, unit: null },
  T10: { label: 'Land cover change areas mapped',                                 threshold: null, unit: null },
  T12: { label: 'Urban green & blue spaces mapped',                               threshold: null, unit: null },
};

const YEARS_TO_2030 = Math.max(0, 2030 - new Date().getFullYear());

function _getStatus(value, threshold, hasData) {
  if (!hasData || value === null || value === undefined) return 'no-data';
  if (threshold == null) return value > 0 ? 'has-data' : 'no-data';
  if (value >= threshold) return 'on-track';
  if (value >= threshold * 0.5) return 'at-risk';
  return 'critical';
}

const STATUS_LABELS = {
  'on-track': 'On Track',
  'at-risk':  'At Risk',
  'critical': 'Critical',
  'has-data': 'Data Present',
  'no-data':  'No Data'
};

const STATUS_COLORS = {
  'on-track': '#2E7D32',
  'at-risk':  '#ED6C02',
  'critical': '#C62828',
  'has-data': '#1565C0',
  'no-data':  '#9AA5B4'
};

/**
 * Renders the GBF 2030 Progress Report Card into a container element.
 * Cards are clickable — dispatches 'nbsap:set-target' to switch the dashboard.
 * @param {HTMLElement} container
 */
export function renderReportCard(container) {
  const layers = getDashboardLayers();

  const cards = TARGETS_CONFIG.targets.map(t => {
    const hasLayers = layers.some(l => l.metadata?.targets?.includes(t.code));
    const milestone  = MILESTONES[t.code] || { label: 'Milestone not defined', threshold: null };

    let value = null;
    let displayValue = null;
    let secondaryText = null;

    if (hasLayers) {
      try {
        switch (t.code) {
          case 'T3': {
            const m = compute30x30Metrics(layers, ALL_FILTER);
            // Status = worst of all three required conditions (all must reach 30%)
            value        = Math.min(m.terrestrial_pct, m.marine_pct, m.combined_pct);
            displayValue = `${m.terrestrial_pct.toFixed(1)}% T &nbsp;·&nbsp; ${m.marine_pct.toFixed(1)}% M &nbsp;·&nbsp; ${m.combined_pct.toFixed(1)}% C`;
            secondaryText = `${_fmtHa(m.terrestrial_ha)} ha land · ${_fmtHa(m.marine_ha)} ha sea · ${_fmtHa(m.combined_ha)} ha combined`;
            break;
          }
          case 'T1': {
            const m = computeTarget1Metrics(layers, ALL_FILTER);
            value        = m.total_pct;
            displayValue = `${m.total_pct.toFixed(1)}%`;
            secondaryText = `${_fmtHa(m.terrestrial_ha)} ha land · ${_fmtHa(m.marine_ha)} ha sea`;
            break;
          }
          case 'T2': {
            const m = computeTarget2Metrics(layers, ALL_FILTER);
            value        = m.restoration_pct;
            displayValue = `${m.restoration_pct.toFixed(1)}%`;
            secondaryText = `${_fmtHa(m.restoration_ha)} ha restored of ${_fmtHa(m.degraded_ha)} ha degraded`;
            break;
          }
          case 'T4': {
            const m = computeTargetMetrics(layers, 'T4', ALL_FILTER);
            const specificMapped = T4_SPECIES_KEYS.filter(k =>
              m.categoryBreakdown.some(c => c.category === k && c.features > 0)
            ).length;
            // Generic layers (SPECIES_DIST, KBA) count as one slot each when no specific keys found
            const genericMapped = specificMapped === 0
              ? Math.min(m.categoryBreakdown.filter(c => c.features > 0).length, T4_SPECIES_KEYS.length)
              : 0;
            const mapped = Math.min(specificMapped + genericMapped, T4_SPECIES_KEYS.length);
            value        = (mapped / T4_SPECIES_KEYS.length) * 100;
            displayValue = `${mapped} / ${T4_SPECIES_KEYS.length} species`;
            secondaryText = `${m.totalFeatures} occurrence records`;
            break;
          }
          default: {
            const m = computeTargetMetrics(layers, t.code, ALL_FILTER);
            value        = m.totalAreaHa;
            displayValue = `${_fmtHa(m.totalAreaHa)} ha`;
            secondaryText = `${m.totalFeatures} features · ${m.layerCount} dataset${m.layerCount !== 1 ? 's' : ''}`;
          }
        }
      } catch (_) {
        value = null;
      }
    }

    const status      = _getStatus(value, milestone.threshold, hasLayers);
    const statusColor = STATUS_COLORS[status];
    const milePct     = milestone.threshold && value != null
      ? Math.min((value / milestone.threshold) * 100, 100)
      : (hasLayers ? 100 : 0);

    return { t, milestone, value, displayValue, secondaryText, status, statusColor, milePct };
  });

  const deadlineText = YEARS_TO_2030 > 0
    ? `${YEARS_TO_2030} year${YEARS_TO_2030 !== 1 ? 's' : ''} to 2030 GBF deadline`
    : '2030 GBF deadline reached';

  container.innerHTML = `
    <div class="report-card-panel">
      <div class="report-card-header">
        <div class="rc-header-left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <strong>GBF 2030 Progress Report Card</strong>
          <span class="rc-deadline">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            ${deadlineText}
          </span>
        </div>
        <div class="rc-legend">
          ${Object.entries(STATUS_COLORS).map(([s, c]) => `
            <span class="rc-legend-item">
              <span class="rc-legend-dot" style="background:${c}"></span>
              ${STATUS_LABELS[s]}
            </span>`).join('')}
        </div>
      </div>
      <div class="report-card-grid">
        ${cards.map(c => `
          <div class="rc-card" data-target="${c.t.code}" title="Click to explore ${c.t.code}">
            <div class="rc-card-top">
              <span class="rc-code" style="color:${c.t.color}">${c.t.code}</span>
              <span class="rc-status-badge" style="background:${c.statusColor}18;color:${c.statusColor};border:1px solid ${c.statusColor}38">
                <span class="rc-status-dot" style="background:${c.statusColor}"></span>
                ${STATUS_LABELS[c.status]}
              </span>
            </div>
            <div class="rc-name">${c.t.icon} ${c.t.name.replace(/^Target \d+:\s*/, '')}</div>
            <div class="rc-value">${c.displayValue ? `<span>${c.displayValue}</span>` : `<span class="rc-no-data">No data uploaded</span>`}</div>
            ${c.secondaryText ? `<div class="rc-secondary">${c.secondaryText}</div>` : ''}
            <div class="rc-milestone-label">${c.milestone.label}</div>
            ${c.milestone.threshold != null ? `
              <div class="rc-progress-track" title="${c.milePct.toFixed(1)}% of ${c.milestone.threshold}${c.milestone.unit} milestone">
                <div class="rc-progress-fill" style="width:${c.milePct.toFixed(1)}%;background:${c.statusColor}"></div>
                <div class="rc-progress-marker" style="left:${Math.min(c.milestone.threshold / c.milestone.threshold, 1) * 100}%"></div>
              </div>
              <div class="rc-progress-labels">
                <span>${c.milePct.toFixed(0)}% of milestone</span>
                <span style="color:${c.statusColor};font-weight:600">${c.milestone.threshold}${c.milestone.unit}</span>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      <div class="rc-footer">
        Click any target card to explore its data on the map &nbsp;·&nbsp; Metrics calculated using dissolved (no-double-count) areas per UNEP-WCMC methodology
      </div>
    </div>
  `;

  // Cards click → switch dashboard target
  container.querySelectorAll('.rc-card').forEach(card => {
    card.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('nbsap:set-target', { detail: { target: card.dataset.target } }));
    });
  });
}

function _fmtHa(ha) {
  if (!ha && ha !== 0) return '—';
  if (ha >= 1_000_000) return `${(ha / 1_000_000).toFixed(2)}M`;
  if (ha >= 1_000)     return `${(ha / 1_000).toFixed(1)}k`;
  return ha.toFixed(0);
}
