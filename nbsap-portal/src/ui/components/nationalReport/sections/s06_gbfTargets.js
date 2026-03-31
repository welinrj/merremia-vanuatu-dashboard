/**
 * s06_gbfTargets.js — Progress Toward GBF Targets (all 9 targets)
 * Renders a card per target with KPIs, province breakdown, and category breakdown.
 * T3 is intentionally brief here — the deep-dive is in s07_target3.js.
 *
 * @param {object} ctx - report context
 * @returns {string}
 */
import { fmtHa, fmtPct, fmtN, statusFor, progressBar, dualBar, badge, kpiCard, provRows, dataGap } from '../reportUtils.js';
import { CATEGORIES } from '../../../../config/categories.js';
import targetsConfig from '../../../../config/targets.js';
import { MILESTONES } from './s02_execSummary.js';

export function renderGBFTargets(ctx) {
  const { tMetrics, tValue } = ctx;

  const targetCards = targetsConfig.targets.map(t => {
    const m   = tMetrics[t.code];
    const ms  = MILESTONES[t.code];
    const val = tValue(t.code);

    // No data placeholder
    if (!m) return `
      <div class="target-section" style="opacity:0.65">
        <div class="target-header">
          <span class="target-icon">${t.icon || ''}</span>
          <span class="target-code" style="color:${t.color}">${t.code}</span>
          <div class="target-info">
            <div class="target-name">${t.name.replace(/^Target \d+:\s*/,'')}</div>
            <div class="target-desc">${t.description?.substring(0,120)}…</div>
          </div>
          ${badge('No Data', '#9AA5B4', '#F1F3F5')}
        </div>
        ${dataGap(`No datasets uploaded for ${t.code}. Upload relevant GIS layers via the Data Portal.`, `DEPC — recommended categories: ${(t.recommendedCategories||[]).join(', ')}`)}
      </div>`;

    const st = statusFor(val, ms?.threshold ?? null, true);

    // ── KPI stats per target type ─────────────────────────────────────────
    let statsHtml = '';

    if (t.code === 'T3') {
      statsHtml = `
        <div class="kpi-grid kpi-grid-6">
          ${kpiCard(fmtPct(m.terrestrial_pct), '% Terrestrial', '#2E7D32', '≥30% target')}
          ${kpiCard(fmtPct(m.marine_pct),      '% Marine',      '#0072BC', '≥30% target')}
          ${kpiCard(fmtPct(m.combined_pct),    '% Combined',    '#5b21b6', '≥30% target')}
          ${kpiCard(fmtHa(m.terrestrial_ha),   'Terr. Net Area', '#1A202C')}
          ${kpiCard(fmtHa(m.marine_ha),        'Marine Net Area','#1A202C')}
          ${kpiCard(fmtHa(m.combined_ha),      'Combined Net',   '#1A202C')}
        </div>
        <p style="font-size:11px;color:#616E7C;margin-top:4px">
          ↳ Full Target 3 analysis with calculation traces in <strong>Section 4.1</strong>.
        </p>`;

    } else if (t.code === 'T1') {
      statsHtml = `
        <div class="kpi-grid">
          ${kpiCard(fmtPct(m.total_pct),       'Total Coverage',  st.color)}
          ${kpiCard(fmtPct(m.terrestrial_pct), '% Land Plans',    '#2E7D32')}
          ${kpiCard(fmtPct(m.marine_pct),      '% Sea Plans',     '#0072BC')}
          ${kpiCard(String(m.totalFeatures||0),'Features',        '#1A202C')}
        </div>`;

    } else if (t.code === 'T2') {
      statsHtml = `
        <div class="kpi-grid">
          ${kpiCard(fmtHa(m.degraded_ha),      'Degraded Area',   '#C62828')}
          ${kpiCard(fmtHa(m.restoration_ha),   'Restoration Area','#2E7D32')}
          ${kpiCard(fmtPct(m.restoration_pct), 'Restoration %',   st.color)}
          ${kpiCard(String(m.totalFeatures||0),'Features',        '#1A202C')}
        </div>`;

    } else if (t.code === 'T4') {
      const SPECIES_CATS = ['MEGAPODE','STARLING','FANTAIL','KINGFISHER','FLYING_FOX','PLERANDRA'];
      const SPECIES_NAMES = {
        MEGAPODE:   'Vanuatu Megapode',
        STARLING:   'Mountain Starling',
        FANTAIL:    'Streaked Fantail',
        KINGFISHER: 'Collared Kingfisher',
        FLYING_FOX: 'Flying Fox',
        PLERANDRA:  'Plerandra vanuatuensis',
      };
      const speciesRows = SPECIES_CATS.map(k => {
        const hasData = m.categoryBreakdown?.some(c => c.category === k && c.features > 0);
        const rec     = m.categoryBreakdown?.find(c => c.category === k);
        return `<tr>
          <td>${SPECIES_NAMES[k] || k}</td>
          <td>${hasData ? badge('Mapped','#2E7D32','#E8F5E9') : badge('Missing','#9AA5B4','#F1F3F5')}</td>
          <td style="text-align:right">${hasData ? fmtN(rec?.features) : '—'}</td>
          <td style="text-align:right">${hasData ? fmtHa(rec?.area_ha) : '—'}</td>
        </tr>`;
      }).join('');
      const mappedCount = SPECIES_CATS.filter(k => m.categoryBreakdown?.some(c => c.category === k && c.features > 0)).length;
      statsHtml = `
        <div class="kpi-grid" style="margin-bottom:12px">
          ${kpiCard(`${mappedCount} / 6`, 'Key Species Mapped', st.color)}
          ${kpiCard(fmtN(m.totalFeatures||0), 'Total Records', '#1A202C')}
          ${kpiCard(fmtHa(m.totalAreaHa), 'Total Area', '#1A202C')}
          ${kpiCard(fmtPct((mappedCount/6)*100), '% Mapped', st.color)}
        </div>
        <h4>Key Species Status</h4>
        <table>
          <thead><tr><th>Species</th><th>Status</th><th style="text-align:right">Records</th><th style="text-align:right">Area (ha)</th></tr></thead>
          <tbody>${speciesRows}</tbody>
        </table>`;

    } else {
      statsHtml = `
        <div class="kpi-grid">
          ${kpiCard(fmtHa(m.totalAreaHa),              'Total Area (net)', st.color)}
          ${kpiCard(fmtHa(m.realmTotals?.terrestrial_ha),'Terrestrial',    '#2E7D32')}
          ${kpiCard(fmtHa(m.realmTotals?.marine_ha),    'Marine',          '#0072BC')}
          ${kpiCard(String(m.totalFeatures||0),          'Features',        '#1A202C')}
        </div>`;
    }

    // Progress bar for metric targets
    const progressHtml = ms?.threshold && val != null ? `
      <div style="margin: 10px 0 14px">
        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;margin-bottom:2px">
          <span>${fmtPct(val)} achieved</span>
          <span>${ms.threshold}${ms.unit} target by 2030</span>
        </div>
        ${dualBar(val, st.color, ms.threshold)}
      </div>` : '';

    // Province breakdown
    const breakdown = m.provinceBreakdown || [];
    const cats = (m.categoryBreakdown || []).filter(c => !['EEZ','ADMIN_BOUNDARY'].includes(c.category)).slice(0, 8);

    const catRows = cats.length > 0
      ? cats.map(c => `<tr>
          <td><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${CATEGORIES[c.category]?.color||'#888'};margin-right:5px"></span>${CATEGORIES[c.category]?.label || c.category}</td>
          <td style="text-align:right">${fmtN(c.area_ha?.toFixed(0))}</td>
          <td style="text-align:right">${fmtN(c.features)}</td>
        </tr>`).join('')
      : '<tr><td colspan="3" style="color:#9AA5B4;font-style:italic;text-align:center">No category data</td></tr>';

    return `
      <div class="target-section">
        <div class="target-header">
          <span class="target-icon">${t.icon || ''}</span>
          <span class="target-code" style="color:${t.color}">${t.code}</span>
          <div class="target-info">
            <div class="target-name">${t.name.replace(/^Target \d+:\s*/, '')}</div>
            <div class="target-desc">${t.description?.substring(0, 130)}…</div>
          </div>
          ${badge(st.label, st.color, st.bg)}
        </div>

        ${progressHtml}
        ${statsHtml}

        <div class="two-col" style="margin-top:14px">
          <div>
            <h4>Province Breakdown</h4>
            <table>
              <thead>
                <tr>
                  <th>Province</th>
                  <th style="text-align:right">Terr (ha)</th>
                  <th style="text-align:right">Marine (ha)</th>
                  <th style="text-align:right">Total (ha)</th>
                  <th style="text-align:right">Records</th>
                </tr>
              </thead>
              <tbody>${provRows(breakdown)}</tbody>
            </table>
          </div>
          <div>
            <h4>Category Breakdown</h4>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th style="text-align:right">Area (ha)</th>
                  <th style="text-align:right">Records</th>
                </tr>
              </thead>
              <tbody>${catRows}</tbody>
            </table>
          </div>
        </div>
      </div>`;
  }).join('');

  return `
<!-- ══ GBF 2030 PROGRESS BY TARGET ══════════════════════════════════════════ -->
<div class="page page-break" id="s4-gbf">
  <div class="section">
    <div class="section-label">Section 4</div>
    <h2>Progress Toward GBF 2030 Targets</h2>
    <p style="font-size:12px;color:#4A5568;margin-bottom:20px">
      Per-target analysis drawn from spatial data in the Vanuatu NBSAP GIS Portal.
      All area figures use geodesic calculation (turf.js) with UNEP-WCMC polygon
      dissolution to prevent double-counting. Targets with no uploaded data are shown
      greyed-out with instructions for completing the data gap.
    </p>
    ${targetCards}
  </div>
</div>
`;
}
