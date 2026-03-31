/**
 * s02_execSummary.js — Executive Summary
 * High-level KPIs and target status table drawn from live GIS data.
 *
 * @param {object} ctx - report context
 * @returns {string}
 */
import { fmtHa, fmtPct, fmtN, statusFor, progressBar, badge, kpiCard } from '../reportUtils.js';
import { getTargetIcon } from '../reportIcons.js';
import targetsConfig from '../../../../config/targets.js';

const MILESTONES = {
  T1: { threshold: 100, unit: '%', label: '100% land & sea covered by spatial plans' },
  T2: { threshold: 30,  unit: '%', label: '≥30% of degraded ecosystems restored' },
  T3: { threshold: 30,  unit: '%', label: '≥30% terrestrial AND ≥30% marine AND ≥30% combined' },
  T4: { threshold: 100, unit: '%', label: 'All 6 key species distribution maps complete' },
};

export { MILESTONES };

export function renderExecSummary(ctx) {
  const { t3, t1, t2, tMetrics, tValue, layers, general, targetsActive, dateStr } = ctx;

  const targetRows = targetsConfig.targets.map(t => {
    const m   = tMetrics[t.code];
    const has = !!m;
    const val = tValue(t.code);
    const ms  = MILESTONES[t.code];
    const st  = statusFor(val, ms?.threshold ?? null, has);
    const pctText = ms?.threshold && val != null
      ? `${Number(val).toFixed(1)}%`
      : (has ? 'Data present' : 'No data');
    const barHtml = ms?.threshold && val != null
      ? progressBar((val / ms.threshold) * 100, st.color)
      : '';
    return `<tr>
      <td><span style="color:${t.color};font-weight:800">${t.code}</span></td>
      <td>${getTargetIcon(t.code, t.color, 18)} ${t.name.replace(/^Target \d+:\s*/, '')}</td>
      <td>${badge(st.label, st.color, st.bg)}</td>
      <td style="min-width:120px">${pctText}${barHtml}</td>
      <td style="font-size:11px;color:#616E7C">${ms?.label || 'Mapping / presence target'}</td>
    </tr>`;
  }).join('');

  return `
<!-- ══ EXECUTIVE SUMMARY ══════════════════════════════════════════════════════ -->
<div class="page page-break" id="exec-summary">
  <div class="section">
    <div class="section-label">Executive Summary</div>
    <h2>At a Glance — ${dateStr}</h2>

    <!-- 30×30 headline KPIs -->
    <div class="kpi-grid kpi-grid-6">
      ${kpiCard(fmtPct(t3.terrestrial_pct), 'Terrestrial Protected (T3)', '#2E7D32')}
      ${kpiCard(fmtPct(t3.marine_pct),      'Marine Protected (T3)',      '#0072BC')}
      ${kpiCard(fmtPct(t3.combined_pct),    'Combined 30×30 (T3)',        '#5b21b6')}
      ${kpiCard(fmtHa(t3.terrestrial_ha),   'Terrestrial Net Area',       '#1A202C')}
      ${kpiCard(fmtHa(t3.marine_ha),        'Marine Net Area',            '#1A202C')}
      ${kpiCard(fmtHa(t3.combined_ha),      'Combined Net Area',          '#1A202C')}
    </div>

    <!-- General stats row -->
    <div class="kpi-grid" style="margin-top:8px">
      ${kpiCard(String(layers.length),                   'GIS Datasets',         '#1565C0')}
      ${kpiCard(fmtN(general.totalFeatures),             'Spatial Features',     '#1565C0')}
      ${kpiCard(String(targetsActive) + '/9',            'Targets with Data',    '#006B3F')}
      ${kpiCard(fmtHa(general.totalAreaHa),              'Total Mapped Area',    '#1A202C')}
    </div>

    <!-- Per-target status table -->
    <h3>Progress Against GBF 2030 Milestones</h3>
    <table>
      <thead>
        <tr>
          <th style="width:50px">Code</th>
          <th>Target</th>
          <th>Status</th>
          <th style="min-width:130px">Progress</th>
          <th>2030 Milestone</th>
        </tr>
      </thead>
      <tbody>${targetRows}</tbody>
    </table>

    <div class="info-box">
      <h4>Key Findings</h4>
      <ul>
        <li><strong>30×30 (T3):</strong>
          Terrestrial coverage is <strong>${fmtPct(t3.terrestrial_pct)}</strong> of the
          1,218,900 ha national land area (target: ≥30%).
          Marine coverage is <strong>${fmtPct(t3.marine_pct)}</strong> of the
          66,325,100 ha EEZ (target: ≥30%).
          Combined coverage is <strong>${fmtPct(t3.combined_pct)}</strong> (target: ≥30%).
        </li>
        <li><strong>Data completeness:</strong>
          ${targetsActive} of 9 NBSAP targets have spatial data in the portal.
          ${9 - targetsActive > 0 ? `${9 - targetsActive} target(s) require dataset upload to enable reporting.` : 'All targets have data.'}
        </li>
        <li><strong>Methodology:</strong>
          All area figures use UNEP-WCMC polygon dissolution (no double-counting).
          Full calculation traces are provided in Section 4.1.
        </li>
      </ul>
    </div>
  </div>
</div>
`;
}
