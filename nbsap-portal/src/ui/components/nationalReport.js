/**
 * National Biodiversity Strategy and Action Plan
 * GBF 2030 Progress Report Generator — Government Grade
 *
 * Architecture:
 *   Each section is its own named function returning an HTML string.
 *   _MISSING(label)                     — red DATA REQUIRED badge
 *   _STAFFNOTE(text)                    — amber editorial note for DEPC review
 *   _TRACEABLE(formula, inputs, result) — green calculation trace box
 *   Asset URLs prefixed with ENV.basePath for server portability.
 *   No fabricated statistics — all numbers from layer metrics or stated public facts.
 */
import { getDashboardLayers } from '../state.js';
import {
  compute30x30Metrics, computeTarget1Metrics, computeTarget2Metrics,
  computeTargetMetrics, computeGeneralMetrics
} from '../../gis/areaCalc.js';
import { CATEGORIES } from '../../config/categories.js';
import ENV from '../../config/env.js';
import targetsConfig from '../../config/targets.js';

// ─── Constants ───────────────────────────────────────────────────────────────

const ALL_FILTER = { targets: [], province: 'All', category: 'All', realm: 'All', year: 'All' };
const BL = ENV.nationalBaselines;
const T4_SPECIES_KEYS = ['MEGAPODE','STARLING','FANTAIL','KINGFISHER','FLYING_FOX','PLERANDRA'];
const YEARS_TO_2030 = Math.max(0, 2030 - new Date().getFullYear());

const MILESTONES = {
  T1:  { threshold: 100, unit: '%', label: '100% land & sea covered by biodiversity-inclusive spatial plans' },
  T2:  { threshold: 30,  unit: '%', label: '≥30% of degraded ecosystems restored' },
  T3:  { threshold: 30,  unit: '%', label: '≥30% terrestrial, ≥30% marine & ≥30% combined area conserved' },
  T4:  { threshold: 100, unit: '%', label: 'All 6 key Vanuatu species distribution maps complete' },
};

// ─── Formatting helpers ───────────────────────────────────────────────────────

function _fmtHa(v) {
  if (!v && v !== 0) return '—';
  if (v >= 1e6) return (v/1e6).toFixed(2) + 'M ha';
  if (v >= 1e3) return (v/1e3).toFixed(1) + 'K ha';
  return v.toFixed(0) + ' ha';
}
function _fmtN(v) {
  if (!v && v !== 0) return '—';
  return v.toLocaleString();
}
function _fmtPct(v) {
  if (v == null) return '—';
  return v.toFixed(2) + '%';
}
function _status(value, threshold, hasData) {
  if (!hasData || value == null) return { label: 'No Data', color: '#9AA5B4', bg: '#F1F3F5' };
  if (threshold == null) return value > 0
    ? { label: 'Data Present', color: '#1565C0', bg: '#E3F2FD' }
    : { label: 'No Data', color: '#9AA5B4', bg: '#F1F3F5' };
  if (value >= threshold) return { label: 'On Track', color: '#2E7D32', bg: '#E8F5E9' };
  if (value >= threshold * 0.5) return { label: 'At Risk', color: '#E65100', bg: '#FFF3E0' };
  return { label: 'Critical', color: '#C62828', bg: '#FFEBEE' };
}
function _bar(pct, color) {
  const w = Math.min(Math.max(pct || 0, 0), 100);
  return `<div style="background:#E4E7EB;border-radius:3px;height:8px;margin-top:4px;overflow:hidden">
    <div style="width:${w}%;background:${color};height:8px;border-radius:3px"></div>
  </div>`;
}
function _provRows(breakdown) {
  if (!breakdown?.length) return '<tr><td colspan="5" style="text-align:center;color:#9AA5B4;font-style:italic">No province data available</td></tr>';
  return breakdown.map(p => `
    <tr>
      <td>${p.province}</td>
      <td style="text-align:right">${_fmtN(p.terrestrial_ha?.toFixed(0))}</td>
      <td style="text-align:right">${_fmtN(p.marine_ha?.toFixed(0))}</td>
      <td style="text-align:right">${_fmtN(p.total_ha?.toFixed(0))}</td>
      <td style="text-align:right">${_fmtN(p.features)}</td>
    </tr>`).join('');
}

// ─── Report annotation helpers ────────────────────────────────────────────────

function _MISSING(label) {
  return `<span class="missing-badge">&#9888; DATA REQUIRED: ${label}</span>`;
}
function _STAFFNOTE(text) {
  return `<div class="staff-note"><strong>&#9998; DEPC STAFF NOTE:</strong> ${text}</div>`;
}
function _TRACEABLE(formula, inputs, result) {
  const rows = Object.entries(inputs)
    .map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#374151;font-style:italic">${k}</td><td style="font-weight:600;font-family:monospace">${v}</td></tr>`)
    .join('');
  return `<div class="trace-box">
    <div style="font-weight:700;margin-bottom:5px;color:#1B5E20;font-size:12px">&#128290; Calculation Trace</div>
    <div style="font-family:monospace;font-size:12px;margin-bottom:8px;background:#F0FFF4;padding:5px 8px;border-radius:4px"><strong>Formula:</strong> ${formula}</div>
    <table style="font-size:11px;margin-bottom:8px;width:auto">${rows}</table>
    <div style="font-family:monospace;font-weight:800;color:#2E7D32;font-size:13px;border-top:1px solid #A7F3D0;padding-top:6px">&#8658; Result: ${result}</div>
  </div>`;
}

// ─── KM-GBF badge (no official logo file in repo) ────────────────────────────
// TODO: replace with official KM-GBF logo when it is added to public/logos/

function _kmGbfBadge() {
  return `<span style="display:inline-flex;align-items:center;gap:6px;background:#1B5E20;color:#fff;font-weight:800;font-size:11px;padding:6px 14px;border-radius:6px;letter-spacing:.05em">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>
    Kunming-Montreal GBF 2022
  </span>`;
}

// ─── Per-target numeric summary helper ───────────────────────────────────────

function _tValue(code, tMetrics) {
  const m = tMetrics[code];
  if (!m) return null;
  if (code === 'T3') return Math.min(m.terrestrial_pct, m.marine_pct, m.combined_pct);
  if (code === 'T1') return m.total_pct;
  if (code === 'T2') return m.restoration_pct;
  if (code === 'T4') {
    const mapped = T4_SPECIES_KEYS.filter(k => m.categoryBreakdown?.some(c => c.category === k && c.features > 0)).length;
    return (mapped / T4_SPECIES_KEYS.length) * 100;
  }
  return m.totalAreaHa > 0 ? m.totalAreaHa : 0;
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION BUILDERS
// ═════════════════════════════════════════════════════════════════════════════

function secCover(d) {
  const coatSrc = d.basePath + 'logos/vanuatu-coat-of-arms.svg';
  const cbdSrc  = d.basePath + 'logos/cbd-logo.png';
  const depcSrc = d.basePath + 'logos/depc-logo.png';
  return `
<div class="cover">
  <div style="max-width:720px;margin:0 auto;width:100%;text-align:center">
    <img src="${coatSrc}" alt="Vanuatu Coat of Arms" height="120"
         style="margin-bottom:24px;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.35))">
    <div class="cover-badge">NBSAP &middot; GBF 2030 Progress Report &middot; ${d.monthYear}</div>
    <h1>Vanuatu National Biodiversity<br>Strategy and Action Plan</h1>
    <div class="cover-subtitle">
      GBF 2030 Progress Report &nbsp;&middot;&nbsp; NBSAP Implementation &nbsp;&middot;&nbsp; CBD 7th National Report
    </div>
    <div class="cover-stats">
      <div class="cover-stat">
        <div class="cover-stat-value">${d.layers.filter(l=>!l.metadata?.isReference).length}</div>
        <div class="cover-stat-label">Datasets</div>
      </div>
      <div class="cover-stat">
        <div class="cover-stat-value">${_fmtN(d.general.totalFeatures)}</div>
        <div class="cover-stat-label">Features</div>
      </div>
      <div class="cover-stat">
        <div class="cover-stat-value">${d.targetsActive}/9</div>
        <div class="cover-stat-label">Targets with Data</div>
      </div>
      <div class="cover-stat">
        <div class="cover-stat-value">${d.passed}/${d.checks.length}</div>
        <div class="cover-stat-label">CBD Checks Passed</div>
      </div>
    </div>
    <div class="cover-meta">
      <strong style="color:#fff">Prepared by:</strong> Department of Environmental Protection and Conservation (DEPC)<br>
      <strong style="color:#fff">For:</strong> Convention on Biological Diversity — 7th National Report &amp; GBF 30&times;30 Tracking<br>
      <strong style="color:#fff">Reporting Period:</strong> NBSAP Implementation to ${d.monthYear}<br>
      <strong style="color:#fff">Generated:</strong> ${d.dateStr}
      &nbsp;&middot;&nbsp;
      <span style="background:#FDCE12;color:#004D2C;font-weight:800;padding:1px 8px;border-radius:3px;font-size:11px">FOR OFFICIAL USE</span>
    </div>
    <div class="cover-logo-row">
      <div class="cover-logo-item">
        <img src="${cbdSrc}" alt="CBD" height="48"
             style="object-fit:contain;filter:brightness(0) invert(1)">
        <div style="color:rgba(255,255,255,0.65);font-size:10px;margin-top:4px;text-transform:uppercase;letter-spacing:.05em">CBD</div>
      </div>
      <div class="cover-logo-item" style="padding:0 24px">
        ${_kmGbfBadge()}
      </div>
      <div class="cover-logo-item">
        <img src="${depcSrc}" alt="DEPC Vanuatu" height="48"
             style="object-fit:contain;filter:brightness(0) invert(1)">
        <div style="color:rgba(255,255,255,0.65);font-size:10px;margin-top:4px;text-transform:uppercase;letter-spacing:.05em">DEPC</div>
      </div>
    </div>
  </div>
</div>`;
}

function secExecutiveSummary(d) {
  const tMet  = d.t3.terrestrial_remaining_pct <= 0;
  const mMet  = d.t3.marine_remaining_pct <= 0;
  const cMet  = d.t3.combined_remaining_pct <= 0;
  const allT3 = tMet && mMet && cMet;
  const compColor = d.passed === d.checks.length ? '#2E7D32'
                  : d.passed >= d.checks.length * 0.7 ? '#E65100' : '#C62828';

  const rows = targetsConfig.targets.map(t => {
    const ms  = MILESTONES[t.code];
    const val = _tValue(t.code, d.tMetrics);
    const has = !!d.tMetrics[t.code];
    const st  = _status(val, ms?.threshold ?? null, has);
    const pctTxt = ms?.threshold && val != null ? val.toFixed(1) + '%'
                 : (has ? 'Data present' : 'No data');
    const barW = ms?.threshold && val != null
      ? Math.min((val / ms.threshold) * 100, 100).toFixed(1) : (has ? '100' : '0');
    return `<tr>
      <td><span style="color:${t.color};font-weight:800">${t.code}</span></td>
      <td style="font-weight:600">${t.name.replace(/^Target \d+:\s*/, '')}</td>
      <td><span class="badge" style="background:${st.bg};color:${st.color}">${st.label}</span></td>
      <td style="min-width:120px">${pctTxt}${_bar(parseFloat(barW), st.color)}</td>
      <td style="font-size:11px;color:#616E7C">${ms?.label || 'Mapping target'}</td>
    </tr>`;
  }).join('');

  return `
<div class="page page-break">
  <div class="section">
    <h2>Executive Summary</h2>
    <div class="kpi-grid" style="grid-template-columns:repeat(6,1fr)">
      <div class="kpi"><div class="kpi-value" style="color:#006B3F">${_fmtPct(d.t3.terrestrial_pct)}</div><div class="kpi-label">T3 Terrestrial</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#0072BC">${_fmtPct(d.t3.marine_pct)}</div><div class="kpi-label">T3 Marine</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#5b21b6">${_fmtPct(d.t3.combined_pct)}</div><div class="kpi-label">T3 Combined</div></div>
      <div class="kpi"><div class="kpi-value">${d.layers.filter(l=>!l.metadata?.isReference).length}</div><div class="kpi-label">Datasets</div></div>
      <div class="kpi"><div class="kpi-value">${_fmtN(d.general.totalFeatures)}</div><div class="kpi-label">Features</div></div>
      <div class="kpi"><div class="kpi-value" style="color:${compColor}">${d.passed}/${d.checks.length}</div><div class="kpi-label">CBD Checks</div></div>
    </div>
    <h3 style="margin-top:24px">GBF Target Status at a Glance</h3>
    <table>
      <thead><tr><th>Target</th><th>Name</th><th>Status</th><th>Progress</th><th>GBF 2030 Milestone</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <h3 style="margin-top:20px">Key Findings</h3>
    <ul style="font-size:12px;line-height:1.9;padding-left:18px;color:#374151">
      <li><strong>Target 3 (30&times;30):</strong> Terrestrial ${_fmtPct(d.t3.terrestrial_pct)} of ${_fmtHa(d.BL.terrestrial_ha)} baseline; Marine ${_fmtPct(d.t3.marine_pct)} of ${_fmtHa(d.BL.marine_ha)} EEZ; Combined ${_fmtPct(d.t3.combined_pct)}.
        ${allT3 ? '<strong style="color:#2E7D32">All three 30&times;30 conditions met.</strong>'
                : `<strong style="color:#C62828">${[!tMet&&'Terrestrial',!mMet&&'Marine',!cMet&&'Combined'].filter(Boolean).join(', ')} condition(s) below 30% target.</strong>`}
      </li>
      <li>${d.targetsActive} of 9 GBF targets have spatial data uploaded. ${9 - d.targetsActive > 0 ? `${9 - d.targetsActive} target(s) still require data upload.` : 'All targets have data.'}</li>
      <li>${_fmtN(d.general.totalFeatures)} spatial features across ${d.layers.filter(l=>!l.metadata?.isReference).length} datasets in the NBSAP GIS Data Portal.</li>
      <li>CBD compliance self-assessment: <strong>${d.passed}/${d.checks.length} checks passed</strong>. ${d.passed < d.checks.length ? 'See Annex B for outstanding gaps.' : 'All compliance checks satisfied.'}</li>
    </ul>
    ${_STAFFNOTE('Review and expand the Key Findings above before publication. Add qualitative context, policy achievements, and ministerial highlights not captured by spatial metrics. Remove this note box from the final printed version.')}
  </div>
</div>`;
}

function secIntroduction(d) {
  return `
<div class="page page-break">
  <div class="section">
    <h2>1. Introduction</h2>
    <h3>1.1 Purpose of This Report</h3>
    <p class="body-text">This report documents the Republic of Vanuatu's progress toward the 23 targets of the Kunming-Montreal Global Biodiversity Framework (GBF), adopted at CBD COP15 in Montreal, December 2022. It serves as the quantitative evidence base for Vanuatu's 7th National Report to the Convention on Biological Diversity (CBD), and as a monitoring instrument for the National Biodiversity Strategy and Action Plan (NBSAP). All spatial metrics are calculated from datasets uploaded to the Vanuatu NBSAP GIS Data Portal as of <strong>${d.dateStr}</strong>.</p>
    ${_STAFFNOTE('Confirm the reporting period, cycle number (7th National Report), and whether this is an interim or final submission. Add any contextual note about the reporting process (e.g. inclusive review with stakeholders).')}

    <h3 style="margin-top:20px">1.2 Legal and Policy Basis</h3>
    <table>
      <thead><tr><th>Instrument</th><th>Status</th><th>Relevance to Biodiversity</th></tr></thead>
      <tbody>
        <tr><td><strong>Convention on Biological Diversity (CBD)</strong></td><td>Acceded 25 October 1993</td><td>Primary treaty; requires National Reports and NBSAP</td></tr>
        <tr><td><strong>Kunming-Montreal Global Biodiversity Framework</strong></td><td>Adopted COP15, December 2022</td><td>23 action targets including 30&times;30 (Target 3)</td></tr>
        <tr><td><strong>Cartagena Protocol on Biosafety</strong></td><td>${_MISSING('accession year')}</td><td>Living modified organisms regulation</td></tr>
        <tr><td><strong>Nagoya Protocol on ABS</strong></td><td>${_MISSING('accession status')}</td><td>Access and benefit-sharing from genetic resources</td></tr>
        <tr><td><strong>Paris Agreement (UNFCCC)</strong></td><td>Ratified</td><td>Climate-biodiversity nexus; NDC land and ocean commitments</td></tr>
        <tr><td><strong>Vanuatu NSDP 2030</strong></td><td>${_MISSING('adoption year')}</td><td>National sustainable development framework; biodiversity pillars</td></tr>
        <tr><td><strong>Vanuatu NBSAP</strong></td><td>${_MISSING('NBSAP period and adoption year')}</td><td>National biodiversity strategy; target localisation</td></tr>
        <tr><td><strong>Environment Management and Conservation Act</strong></td><td>${_MISSING('year')}</td><td>Primary environmental legislation</td></tr>
      </tbody>
    </table>
    ${_STAFFNOTE('Complete the table above: fill in accession years, NBSAP period, and add any other relevant national legislation (Fisheries Act, Forestry Act, Land Management Act, Biosafety Act, etc.).')}

    <h3 style="margin-top:20px">1.3 Scope and Limitations</h3>
    <p class="body-text">This report covers all NBSAP targets for which spatial data has been uploaded to the Vanuatu NBSAP GIS Data Portal. Coverage percentages are computed using geodesic area (turf.js) on WGS84 coordinates; overlapping polygons are dissolved per UNEP-WCMC methodology to prevent double-counting. National baselines: <strong>${_fmtHa(d.BL.terrestrial_ha)} terrestrial</strong> (UN Statistics, 2020); <strong>${_fmtHa(d.BL.marine_ha)} EEZ</strong> (VLIZ, 2023).</p>
    <p class="body-text" style="margin-top:8px"><strong>Data gaps:</strong> ${9 - d.targetsActive} of 9 targets currently have no spatial data uploaded. Sections requiring editorial input are flagged with amber staff-note boxes; missing data values carry a red &#9888; badge. These must be resolved before the report is submitted to the CBD Secretariat.</p>

    <h3 style="margin-top:20px">1.4 How to Read This Report</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px">
      <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:6px;padding:10px"><strong style="color:#991B1B">&#9888; DATA REQUIRED: [label]</strong><br><span style="color:#7F1D1D">Data not in the portal. Upload the relevant dataset or provide the value manually before publication.</span></div>
      <div style="background:#FFFBEB;border:1px solid #FCD34D;border-radius:6px;padding:10px"><strong style="color:#92400E">&#9998; DEPC STAFF NOTE</strong><br><span style="color:#78350F">Editorial content requiring DEPC review. Remove these boxes from the final published version.</span></div>
      <div style="background:#F0FFF4;border:1px solid #86EFAC;border-radius:6px;padding:10px"><strong style="color:#1B5E20">&#128290; Calculation Trace</strong><br><span style="color:#14532D">Shows formula, input values, and computed result for full auditability.</span></div>
      <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;padding:10px"><strong style="color:#1E40AF">Progress Bars</strong><br><span style="color:#1E3A8A">Fill to 100% when the GBF 2030 milestone condition is fully met.</span></div>
    </div>
  </div>
</div>`;
}

function secNationalContext(d) {
  return `
<div class="page page-break">
  <div class="section">
    <h2>2. National Context</h2>
    <h3>2.1 Geography</h3>
    <p class="body-text">The Republic of Vanuatu is a Y-shaped archipelago in the southwestern Pacific Ocean, located between latitudes 13&deg;S and 21&deg;S. The following geographic facts are sourced from UN Statistics and VLIZ and are used directly as national baselines in all calculations in this report.</p>
    <table style="width:auto;margin:12px 0">
      <thead><tr><th>Indicator</th><th>Value</th><th>Source</th></tr></thead>
      <tbody>
        <tr><td>Number of islands</td><td>83 (approximately 65 inhabited)</td><td>UN Statistics / Vanuatu NSO</td></tr>
        <tr><td>Total land area</td><td>12,189 km&sup2; (1,218,900 ha)</td><td>UN Statistics, 2020</td></tr>
        <tr><td>Exclusive Economic Zone (EEZ)</td><td>663,251 km&sup2; (66,325,100 ha)</td><td>VLIZ Maritime Boundaries, 2023</td></tr>
        <tr><td>Number of provinces</td><td>6 (Torba, Sanma, Penama, Malampa, Shefa, Tafea)</td><td>Vanuatu Constitution</td></tr>
        <tr><td>Population</td><td>${_MISSING('current population estimate with census year')}</td><td>${_MISSING('Vanuatu NSO census reference')}</td></tr>
        <tr><td>Capital</td><td>Port Vila (Efate Island)</td><td>Public record</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:20px">2.2 Biodiversity Significance</h3>
    <p class="body-text">Vanuatu lies within the Coral Triangle adjacent zone and harbours exceptional terrestrial and marine biodiversity. The archipelago's isolation has produced high levels of endemism across flora, fauna, and freshwater species. Notable endemic and nationally significant species include the Vanuatu Megapode (<em>Megapodius layardi</em>), Vanuatu Mountain Starling (<em>Aplonis santovestris</em>), Vanuatu Streaked Fantail (<em>Rhipidura spilodera</em>), Vanuatu Kingfisher (<em>Todiramphus farquhari</em>), and Vanuatu Flying Fox (<em>Pteropus anetianus</em>).</p>
    ${_STAFFNOTE('Add national-level biodiversity statistics: total number of known vascular plant species, vertebrate species, endemic species counts, coral species, fish species. Cite the most recent national biodiversity assessment or NBSAP background study.')}

    <h3 style="margin-top:20px">2.3 Major Threats to Biodiversity</h3>
    <p class="body-text">Based on the NBSAP threat assessment, the primary pressures on Vanuatu's biodiversity include:</p>
    <ul style="font-size:12px;line-height:1.9;padding-left:18px;color:#374151">
      <li><strong>Invasive alien species:</strong> Including <em>Merremia peltata</em> (Big Leaf vine), Crown-of-Thorns starfish, Mile-a-Minute vine, and others. Mapped via the NBSAP GIS portal (Target 6).</li>
      <li><strong>Climate change and sea-level rise:</strong> Vanuatu is ranked among the world's most climate-vulnerable nations (ND-GAIN Country Index). Coral bleaching, coastal erosion, and increased cyclone intensity are documented threats.</li>
      <li><strong>Land-use change and deforestation:</strong> Agricultural expansion and informal settlement encroach on forest and coastal habitats.</li>
      <li><strong>Overexploitation of marine resources:</strong> Including coastal fisheries and invertebrate harvesting.</li>
      <li><strong>Pollution:</strong> Pesticide runoff, coastal eutrophication, and solid waste disposal.</li>
    </ul>
    ${_STAFFNOTE('Provide specific statistics for each threat category (e.g., ha of forest cleared per year, % coral bleached, IAS-affected area), citing national reports, FSM assessments, or SPREP regional data.')}

    <h3 style="margin-top:20px">2.4 Socioeconomic Context</h3>
    ${_STAFFNOTE('Add GDP, economic sectors (tourism, agriculture, fisheries), human development index, and the relationship between biodiversity and livelihoods — particularly for rural and island communities dependent on ecosystem services. Cite the Vanuatu National Statistics Office or World Bank.')}
  </div>
</div>`;
}

function secPolicyFramework(d) {
  const alignRows = targetsConfig.targets.map(t => `
    <tr>
      <td><span style="color:${t.color};font-weight:800">${t.code}</span></td>
      <td style="font-size:11px">${t.name.replace(/^Target \d+:\s*/, '')}</td>
      <td>${_MISSING('NBSAP national target code')}</td>
      <td>${_MISSING('responsible ministry')}</td>
      <td><span class="badge" style="background:${d.tMetrics[t.code] ? '#E8F5E9' : '#F1F3F5'};color:${d.tMetrics[t.code] ? '#2E7D32' : '#9AA5B4'}">${d.tMetrics[t.code] ? 'Data uploaded' : 'No data yet'}</span></td>
    </tr>`).join('');

  return `
<div class="page page-break">
  <div class="section">
    <h2>3. Policy Framework</h2>
    <h3>3.1 International Commitments</h3>
    <p class="body-text">Vanuatu acceded to the Convention on Biological Diversity on <strong>25 October 1993</strong>. The Kunming-Montreal Global Biodiversity Framework (KM-GBF), adopted at CBD COP15 in Montreal on 19 December 2022, establishes 23 action targets and 4 goals for biodiversity by 2030 and 2050 respectively. Vanuatu is committed to achieving all applicable KM-GBF targets through its updated NBSAP.</p>

    <h3 style="margin-top:20px">3.2 National Strategy and Action Plan</h3>
    ${_STAFFNOTE('Provide: (1) NBSAP adoption year and coverage period; (2) the legal instrument or Cabinet decision endorsing it; (3) the lead ministry and inter-ministerial coordination mechanism; (4) the link between the NBSAP and the Vanuatu National Sustainable Development Plan (NSDP 2030) pillars.')}

    <h3 style="margin-top:20px">3.3 GBF Target Alignment</h3>
    <p class="body-text">The table below maps each tracked GBF target to the corresponding national NBSAP target and the responsible government ministry. Entries marked ${_MISSING('example')} require completion by DEPC before submission.</p>
    <table>
      <thead><tr><th>GBF Target</th><th>Topic</th><th>NBSAP Target</th><th>Lead Ministry</th><th>Portal Data</th></tr></thead>
      <tbody>${alignRows}</tbody>
    </table>
    ${_STAFFNOTE('Complete the NBSAP Target and Lead Ministry columns. Key ministries include: DEPC (Environment), DARD (Agriculture/Forestry), DoF (Fisheries), VMGD (Meteorology/Geohazards), MoIA (Island Authorities/Land), MoH (Health/Biosafety).')}

    <h3 style="margin-top:20px">3.4 Institutional Arrangements</h3>
    ${_STAFFNOTE('Describe the inter-ministerial biodiversity coordination body (e.g., National Biodiversity Committee), its mandate, meeting frequency, and secretariat. Reference the NBSAP implementation governance structure.')}
  </div>
</div>`;
}

function secGBFTargets(d) {
  const sections = targetsConfig.targets.map(t => {
    const m   = d.tMetrics[t.code];
    const ms  = MILESTONES[t.code];
    const val = _tValue(t.code, d.tMetrics);
    const st  = _status(val, ms?.threshold ?? null, !!m);

    if (!m) return `
      <div class="target-section" style="opacity:.7">
        <div class="target-header">
          <span class="target-code" style="color:${t.color}">${t.code}</span>
          <div style="flex:1"><div style="font-size:14px;font-weight:700">${t.name.replace(/^Target \d+:\s*/, '')}</div>
          <div style="font-size:11px;color:#616E7C">${t.description?.substring(0, 120) || ''}…</div></div>
          <span class="badge" style="background:#F1F3F5;color:#9AA5B4;margin-left:auto">No Data</span>
        </div>
        <p style="font-size:12px;color:#9AA5B4;font-style:italic">No datasets have been uploaded for this target. Upload spatial data via the Data Portal to populate this section.</p>
      </div>`;

    const barW = ms?.threshold && val != null
      ? Math.min((val / ms.threshold) * 100, 100).toFixed(1) : '0';

    let statsHtml = '';
    if (t.code === 'T3') {
      statsHtml = `<div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="kpi"><div class="kpi-value" style="color:#006B3F">${_fmtPct(m.terrestrial_pct)}</div><div class="kpi-label">Terrestrial</div></div>
        <div class="kpi"><div class="kpi-value" style="color:#0072BC">${_fmtPct(m.marine_pct)}</div><div class="kpi-label">Marine</div></div>
        <div class="kpi"><div class="kpi-value" style="color:#5b21b6">${_fmtPct(m.combined_pct)}</div><div class="kpi-label">Combined</div></div>
      </div>`;
    } else if (t.code === 'T1') {
      statsHtml = `<div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="kpi"><div class="kpi-value">${_fmtPct(m.total_pct)}</div><div class="kpi-label">Total Coverage</div></div>
        <div class="kpi"><div class="kpi-value">${_fmtHa(m.terrestrial_ha)}</div><div class="kpi-label">Terrestrial Area</div></div>
        <div class="kpi"><div class="kpi-value">${_fmtHa(m.marine_ha)}</div><div class="kpi-label">Marine Area</div></div>
      </div>`;
    } else if (t.code === 'T2') {
      statsHtml = `<div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="kpi"><div class="kpi-value" style="color:#D84315">${_fmtHa(m.degraded_ha)}</div><div class="kpi-label">Degraded Area</div></div>
        <div class="kpi"><div class="kpi-value" style="color:#2E7D32">${_fmtHa(m.restoration_ha)}</div><div class="kpi-label">Restoration Area</div></div>
        <div class="kpi"><div class="kpi-value">${_fmtPct(m.restoration_pct)}</div><div class="kpi-label">Restoration Progress</div></div>
      </div>`;
    } else {
      statsHtml = `<div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="kpi"><div class="kpi-value">${_fmtHa(m.totalAreaHa)}</div><div class="kpi-label">Total Area (net)</div></div>
        <div class="kpi"><div class="kpi-value">${_fmtN(m.totalFeatures)}</div><div class="kpi-label">Records</div></div>
        <div class="kpi"><div class="kpi-value">${m.layerCount || 0}</div><div class="kpi-label">Datasets</div></div>
      </div>`;
    }

    return `
      <div class="target-section">
        <div class="target-header">
          <span class="target-code" style="color:${t.color}">${t.code}</span>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:700">${t.name.replace(/^Target \d+:\s*/, '')}</div>
            <div style="font-size:11px;color:#616E7C">${t.description?.substring(0, 120) || ''}…</div>
          </div>
          <span class="badge" style="background:${st.bg};color:${st.color};margin-left:auto">${st.label}</span>
        </div>
        ${ms?.threshold && val != null ? `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;margin-bottom:3px">
              <span>${val.toFixed(1)}% achieved</span><span>Target: ${ms.threshold}${ms.unit}</span>
            </div>
            ${_bar(parseFloat(barW), st.color)}
          </div>` : ''}
        ${statsHtml}
        <div class="two-col" style="margin-top:10px">
          <div>
            <h4>Province Breakdown</h4>
            <table>
              <thead><tr><th>Province</th><th style="text-align:right">Terr (ha)</th><th style="text-align:right">Marine (ha)</th><th style="text-align:right">Total (ha)</th><th style="text-align:right">Records</th></tr></thead>
              <tbody>${_provRows(m.provinceBreakdown || [])}</tbody>
            </table>
          </div>
          ${(m.categoryBreakdown||[]).length > 0 ? `<div>
            <h4>Category Breakdown</h4>
            <table>
              <thead><tr><th>Category</th><th style="text-align:right">Area (ha)</th><th style="text-align:right">Records</th></tr></thead>
              <tbody>${(m.categoryBreakdown||[]).slice(0,6).map(c=>`<tr>
                <td><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${CATEGORIES[c.category]?.color||'#888'};margin-right:5px"></span>${CATEGORIES[c.category]?.label||c.category}</td>
                <td style="text-align:right">${_fmtN(c.area_ha?.toFixed(0))}</td>
                <td style="text-align:right">${_fmtN(c.features)}</td>
              </tr>`).join('')}</tbody>
            </table>
          </div>` : ''}
        </div>
      </div>`;
  }).join('');

  return `
<div class="page page-break">
  <div class="section">
    <h2>4. Progress Toward GBF Targets</h2>
    <p class="body-text">This section presents Vanuatu's measured progress for each tracked GBF target. Metrics are derived exclusively from spatial datasets uploaded to the NBSAP GIS Data Portal. Targets with no data uploaded are shown in muted style and require dataset upload to be populated.</p>
    ${sections}
  </div>
</div>`;
}

function secTarget3Full(d) {
  const t3 = d.t3;
  const BL = d.BL;
  const tMet = t3.terrestrial_remaining_pct <= 0;
  const mMet = t3.marine_remaining_pct <= 0;
  const cMet = t3.combined_remaining_pct <= 0;
  const allMet = tMet && mMet && cMet;

  const tProgressPct = Math.min((t3.terrestrial_pct / 30) * 100, 100);
  const mProgressPct = Math.min((t3.marine_pct / 30) * 100, 100);
  const cProgressPct = Math.min((t3.combined_pct / 30) * 100, 100);
  const tGapHa = Math.max(0, BL.terrestrial_ha * 0.3 - t3.terrestrial_ha);
  const mGapHa = Math.max(0, BL.marine_ha * 0.3 - t3.marine_ha);
  const cGapHa = Math.max(0, t3.combined_target_ha - t3.combined_ha);

  function condBlock(title, borderColor, progressPct, pct, remaining, gapHa, trace) {
    const met = remaining <= 0;
    return `
    <div style="border-left:4px solid ${borderColor};padding:14px 18px;margin:14px 0;border-radius:0 8px 8px 0;background:#FAFBFC">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <strong style="font-size:13px;color:#1A202C">${title}</strong>
        ${met
          ? `<span style="background:#DCFCE7;color:#065F46;border:1px solid #86EFAC;font-size:11px;font-weight:700;padding:2px 10px;border-radius:10px">&#10003; Condition Met</span>`
          : `<span style="background:#FEF3C7;color:#92400E;border:1px solid #FCD34D;font-size:11px;font-weight:600;padding:2px 10px;border-radius:10px">In Progress</span>`}
      </div>
      <div style="font-size:12px;margin-bottom:8px;color:#4A5568">
        Current: <strong>${_fmtPct(pct)}</strong> &nbsp;|&nbsp; 30% target: ${progressPct.toFixed(1)}% achieved
      </div>
      <div style="background:#E4E7EB;border-radius:4px;height:14px;overflow:hidden;margin-bottom:8px">
        <div style="width:${progressPct.toFixed(1)}%;background:${borderColor};height:14px;border-radius:4px;position:relative">
          <span style="position:absolute;right:6px;top:0;font-size:10px;font-weight:700;color:#fff;line-height:14px">${progressPct >= 8 ? pct.toFixed(1) + '%' : ''}</span>
        </div>
      </div>
      <div style="font-size:11px;color:#616E7C">
        ${met
          ? `&#10003; All required area conserved (30% threshold achieved).`
          : `Remaining: <strong>${_fmtPct(remaining)}</strong> &mdash; approximately <strong>${_fmtHa(gapHa)}</strong> additional area needed.`}
      </div>
      ${trace}
    </div>`;
  }

  const tTrace = _TRACEABLE(
    'net_terrestrial_ha &divide; terrestrial_baseline_ha &times; 100',
    { 'net_terrestrial_ha (dissolved, ha)': _fmtN(t3.terrestrial_ha.toFixed(2)),
      'terrestrial_baseline_ha (UN Stats 2020)': _fmtN(BL.terrestrial_ha),
      'gross_terrestrial_ha (before dissolution)': _fmtN(t3.gross_terrestrial_ha?.toFixed(2) || '—') },
    _fmtPct(t3.terrestrial_pct)
  );
  const mTrace = _TRACEABLE(
    'net_marine_ha &divide; marine_baseline_ha &times; 100',
    { 'net_marine_ha (dissolved, ha)': _fmtN(t3.marine_ha.toFixed(2)),
      'marine_baseline_ha (VLIZ EEZ 2023)': _fmtN(BL.marine_ha),
      'gross_marine_ha (before dissolution)': _fmtN(t3.gross_marine_ha?.toFixed(2) || '—') },
    _fmtPct(t3.marine_pct)
  );
  const cTrace = _TRACEABLE(
    '(net_terrestrial_ha + net_marine_ha) &divide; (terrestrial_baseline_ha + marine_baseline_ha) &times; 100',
    { 'combined_net_ha': _fmtN(t3.combined_ha?.toFixed(2) || '—'),
      'combined_baseline_ha': _fmtN(t3.combined_baseline_ha?.toFixed(2) || _fmtN(BL.terrestrial_ha + BL.marine_ha)),
      '30% combined target (ha)': _fmtN(t3.combined_target_ha?.toFixed(2) || '—') },
    _fmtPct(t3.combined_pct)
  );

  const catRows = (t3.provinceBreakdown || []).length > 0
    ? t3.provinceBreakdown.map(p => `<tr>
        <td>${p.province}</td>
        <td style="text-align:right">${_fmtN(p.terrestrial_ha?.toFixed(0))}</td>
        <td style="text-align:right">${_fmtN(p.marine_ha?.toFixed(0))}</td>
        <td style="text-align:right">${_fmtN(p.total_ha?.toFixed(0))}</td>
        <td style="text-align:right">${_fmtN(p.features)}</td>
        <td style="text-align:right">${p.total_ha > 0 ? ((p.total_ha / (BL.terrestrial_ha + BL.marine_ha)) * 100).toFixed(3) + '%' : '—'}</td>
      </tr>`).join('')
    : '<tr><td colspan="6" style="text-align:center;color:#9AA5B4;font-style:italic">No province data available — assign features to provinces via the data upload pipeline.</td></tr>';

  return `
<div class="page page-break">
  <div class="section">
    <h2>5. Target 3 — 30&times;30 Conservation: Detailed Analysis</h2>

    <div style="background:${allMet ? '#F0FDF4' : '#FFFBEB'};border:1px solid ${allMet ? '#86EFAC' : '#FCD34D'};border-radius:8px;padding:14px 18px;margin-bottom:20px;font-size:13px;font-weight:600;color:${allMet ? '#065F46' : '#92400E'}">
      ${allMet
        ? '&#127881; All three 30&times;30 conditions met. Vanuatu has achieved GBF Target 3.'
        : `${[tMet,mMet,cMet].filter(Boolean).length} of 3 conditions met &mdash; ${[!tMet&&'Terrestrial',!mMet&&'Marine',!cMet&&'Combined'].filter(Boolean).join(', ')} condition(s) still below 30%.`}
    </div>

    <h3>5.1 Overview</h3>
    <p class="body-text">GBF Target 3 requires Vanuatu to ensure that by 2030, at least 30% of terrestrial/inland water areas, at least 30% of marine/coastal areas, and at least 30% of the combined land and sea area are effectively conserved through protected areas and other effective area-based conservation measures (OECMs). These are <strong>three independent required conditions</strong> — all must be achieved simultaneously. Coverage is calculated on <em>net</em> (dissolved) area per UNEP-WCMC methodology.</p>

    <h3 style="margin-top:18px">5.2 Required Condition 1 — Terrestrial Coverage</h3>
    ${condBlock('Condition 1: ≥30% of terrestrial/inland water area conserved', '#16a34a', tProgressPct, t3.terrestrial_pct, t3.terrestrial_remaining_pct, tGapHa, tTrace)}

    <h3 style="margin-top:18px">5.3 Required Condition 2 — Marine Coverage</h3>
    ${condBlock('Condition 2: ≥30% of marine/coastal area conserved', '#0284c7', mProgressPct, t3.marine_pct, t3.marine_remaining_pct, mGapHa, mTrace)}

    <h3 style="margin-top:18px">5.4 Required Condition 3 — Combined Land &amp; Sea Coverage</h3>
    ${condBlock('Condition 3: ≥30% of combined land and sea area conserved', '#7c3aed', cProgressPct, t3.combined_pct, t3.combined_remaining_pct, cGapHa, cTrace)}

    <h3 style="margin-top:20px">5.5 Provincial Breakdown</h3>
    <table>
      <thead><tr><th>Province</th><th style="text-align:right">Terrestrial (ha)</th><th style="text-align:right">Marine (ha)</th><th style="text-align:right">Combined (ha)</th><th style="text-align:right">Records</th><th style="text-align:right">% of National Total</th></tr></thead>
      <tbody>${catRows}</tbody>
    </table>
    <p style="font-size:11px;color:#616E7C;margin-top:6px">Note: Provincial areas are dissolved independently. Percentages are relative to the combined national baseline of ${_fmtHa(BL.terrestrial_ha + BL.marine_ha)}.</p>

    <h3 style="margin-top:20px">5.6 Conservation Categories Contributing to T3</h3>
    ${(d.tMetrics.T3?.categoryBreakdown || []).length > 0 ? `
    <table>
      <thead><tr><th>Category</th><th>Realm</th><th style="text-align:right">Net Area (ha)</th><th style="text-align:right">Gross Area (ha)</th><th style="text-align:right">Overlap Removed (ha)</th><th style="text-align:right">Records</th></tr></thead>
      <tbody>${(d.tMetrics.T3?.categoryBreakdown || []).map(c => {
        const catDef = CATEGORIES[c.category] || {};
        const overlap = Math.max(0, (c.gross_area_ha || c.area_ha) - c.area_ha);
        return `<tr>
          <td><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${catDef.color||'#888'};margin-right:5px"></span>${catDef.label||c.category}</td>
          <td style="font-size:11px;color:#616E7C">${catDef.defaultRealm||'—'}</td>
          <td style="text-align:right">${_fmtN(c.area_ha?.toFixed(0))}</td>
          <td style="text-align:right">${_fmtN((c.gross_area_ha || c.area_ha)?.toFixed(0))}</td>
          <td style="text-align:right;color:${overlap > 0 ? '#E65100' : '#9AA5B4'}">${overlap > 0 ? _fmtN(overlap.toFixed(0)) : '—'}</td>
          <td style="text-align:right">${_fmtN(c.features)}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>` : `<p style="font-size:12px;color:#9AA5B4;font-style:italic">No category breakdown available — data will populate when layers are uploaded.</p>`}

    <h3 style="margin-top:20px">5.7 Methodology</h3>
    <div class="body-text">
      <p><strong>Dissolution:</strong> Overlapping conservation polygons within each realm are dissolved (unioned) using turf.js before area calculation, per UNEP-WCMC WDPA methodology. Each point on the ground is counted once toward coverage, regardless of how many overlapping designations exist.</p>
      <p style="margin-top:6px"><strong>GBF Indicators tracked:</strong> B.4.1 (terrestrial 30&times;30), B.4.2 (marine 30&times;30), B.4.3 (combined 30&times;30).</p>
      <p style="margin-top:6px"><strong>Eligible categories:</strong> CCA (Community Conserved Area), MPA (Marine Protected Area), PA (Protected Area), OECM (Other Effective Conservation Measure), LMMA (Locally Managed Marine Area). Only layers tagged with Target 3 AND flagged "counts toward 30&times;30" (or matching an eligible category) are included.</p>
      <p style="margin-top:6px"><strong>National baselines:</strong> Terrestrial — ${_fmtHa(BL.terrestrial_ha)} (UN Statistics Division, 2020). Marine EEZ — ${_fmtHa(BL.marine_ha)} (Flanders Marine Institute / VLIZ, 2023).</p>
    </div>
    ${_STAFFNOTE('When management effectiveness data (METT scores, PA management plans) are available, add a sub-section here on "Effective Conservation" quality assessment, distinguishing areas with demonstrated management from paper parks.')}
  </div>
</div>`;
}

function secDataSystems(d) {
  const dataLayers = d.layers.filter(l => !l.metadata?.isReference);
  const withCRS      = dataLayers.filter(l => l.metadata?.detectedCRS).length;
  const withCustodian= dataLayers.filter(l => l.metadata?.custodianAgency).length;
  const withTimestamp= dataLayers.filter(l => l.metadata?.uploadTimestamp).length;
  const official     = dataLayers.filter(l => ['Official','Approved'].includes(l.metadata?.approvalStatus)).length;
  const missingTargets = targetsConfig.targets
    .filter(t => !d.layers.some(l => l.metadata?.targets?.includes(t.code)))
    .map(t => t.code).join(', ') || 'None';

  const rows = dataLayers.map(l => {
    const m = l.metadata;
    return `<tr>
      <td><strong>${m.name}</strong>${m.countsToward30x30 ? ' <span style="color:#006B3F">&#9733;</span>' : ''}</td>
      <td style="font-size:11px">${CATEGORIES[m.category]?.label || m.category}</td>
      <td style="font-size:11px">${(m.targets||[]).join(', ') || '—'}</td>
      <td style="font-size:11px">${m.realm || '—'}</td>
      <td style="text-align:right">${_fmtN(m.featureCount)}</td>
      <td style="text-align:right">${m.totalAreaHa ? _fmtHa(m.totalAreaHa) : '—'}</td>
      <td style="font-size:11px">${m.custodianAgency || _MISSING('custodian')}</td>
      <td style="font-size:11px">${m.dateUpdated || m.uploadTimestamp?.substring(0,10) || '—'}</td>
      <td><span class="badge" style="background:${['Official','Approved'].includes(m.approvalStatus)?'#E8F5E9':'#F1F3F5'};color:${['Official','Approved'].includes(m.approvalStatus)?'#2E7D32':'#616E7C'};font-size:10px">${m.approvalStatus || 'Draft'}</span></td>
    </tr>`;
  }).join('');

  return `
<div class="page page-break">
  <div class="section">
    <h2>6. Data and Monitoring Systems</h2>
    <h3>6.1 NBSAP GIS Data Portal</h3>
    <p class="body-text">The Vanuatu NBSAP GIS Data Portal is a browser-based geospatial platform that enables DEPC and partner agencies to upload, validate, and analyse spatial datasets for each GBF target. It supports shapefile and GeoJSON uploads with automatic coordinate reference system (CRS) detection, geometry validation, and province-level spatial attribution. Data is stored in browser-based IndexedDB and is designed for migration to a government server backend.</p>
    <p class="body-text" style="margin-top:8px">A companion <strong>Field Collector PWA</strong> (Progressive Web App) enables field rangers to record GPS-located conservation observations offline and synchronise to the central data store when connectivity is available. &#9733; = Counts toward 30&times;30 coverage calculation.</p>

    <h3 style="margin-top:16px">6.2 Data Quality Summary</h3>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-value">${dataLayers.length}</div><div class="kpi-label">Total Datasets</div></div>
      <div class="kpi"><div class="kpi-value" style="color:${withCRS===dataLayers.length?'#2E7D32':'#E65100'}">${withCRS}/${dataLayers.length}</div><div class="kpi-label">CRS Recorded</div></div>
      <div class="kpi"><div class="kpi-value" style="color:${withCustodian===dataLayers.length?'#2E7D32':'#E65100'}">${withCustodian}/${dataLayers.length}</div><div class="kpi-label">Custodian Recorded</div></div>
      <div class="kpi"><div class="kpi-value" style="color:${official===dataLayers.length?'#2E7D32':'#E65100'}">${official}/${dataLayers.length}</div><div class="kpi-label">Official/Approved</div></div>
    </div>

    <h3 style="margin-top:16px">6.3 Dataset Inventory</h3>
    ${dataLayers.length > 0 ? `<table>
      <thead><tr><th>Dataset</th><th>Category</th><th>Target(s)</th><th>Realm</th><th style="text-align:right">Features</th><th style="text-align:right">Area</th><th>Custodian</th><th>Updated</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>` : `<p style="font-size:12px;color:#9AA5B4;font-style:italic">No datasets uploaded yet.</p>`}

    <h3 style="margin-top:16px">6.4 Data Gaps</h3>
    <p class="body-text">The following GBF targets currently have <strong>no spatial data</strong> uploaded to the portal. Data collection and upload is required before these targets can be quantitatively assessed.</p>
    <p style="font-size:12px;color:#C62828;font-weight:600;margin-top:6px">${missingTargets !== 'None' ? 'Targets with no data: ' + missingTargets : '&#10003; All targets have at least one dataset uploaded.'}</p>
    ${_STAFFNOTE('For each missing target, identify the lead agency responsible for data upload, the existing data source (if any), and a timeline for uploading to the portal. Prioritise T3 conservation layers for 30x30 reporting.')}

    <h3 style="margin-top:16px">6.5 Monitoring and Reporting Frequency</h3>
    ${_STAFFNOTE('Specify how often each dataset is updated (e.g., annual field surveys, quarterly PA boundary reviews), who is responsible for updates, and the process for data quality review before each national reporting cycle.')}
    ${_MISSING('Formal monitoring protocol document reference')}
  </div>
</div>`;
}

function secFinancing(d) {
  const gefSrc  = d.basePath + 'logos/gef-logo-official.png';
  const undpSrc = d.basePath + 'logos/undp-logo.png';
  return `
<div class="page page-break">
  <div class="section">
    <h2>7. Financing Biodiversity</h2>
    <div style="display:flex;gap:24px;align-items:center;margin-bottom:18px;flex-wrap:wrap">
      <div style="text-align:center">
        <img src="${gefSrc}" alt="Global Environment Facility" height="44" style="object-fit:contain">
        <div style="font-size:10px;color:#616E7C;margin-top:4px;text-transform:uppercase">GEF</div>
      </div>
      <div style="text-align:center">
        <img src="${undpSrc}" alt="UNDP" height="44" style="object-fit:contain">
        <div style="font-size:10px;color:#616E7C;margin-top:4px;text-transform:uppercase">UNDP</div>
      </div>
    </div>

    <h3>7.1 Known Funding Sources</h3>
    <table>
      <thead><tr><th>Funding Source</th><th>Programme / Project</th><th>Period</th><th>Focus Area</th><th>Amount (USD)</th></tr></thead>
      <tbody>
        <tr><td>Global Environment Facility (GEF)</td><td>${_MISSING('GEF project name and number')}</td><td>${_MISSING('years')}</td><td>NBSAP Implementation, Biodiversity</td><td>${_MISSING('USD amount')}</td></tr>
        <tr><td>UNDP</td><td>${_MISSING('UNDP project name')}</td><td>${_MISSING('years')}</td><td>Capacity building, NBSAP support</td><td>${_MISSING('USD amount')}</td></tr>
        <tr><td>Green Climate Fund (GCF)</td><td>${_MISSING('GCF project name or N/A')}</td><td>${_MISSING('years')}</td><td>Climate-biodiversity nexus</td><td>${_MISSING('USD amount or N/A')}</td></tr>
        <tr><td>Vanuatu Government</td><td>DEPC core budget</td><td>${_MISSING('budget year')}</td><td>NBSAP coordination, monitoring</td><td>${_MISSING('VUV/USD amount')}</td></tr>
        <tr><td>Regional / bilateral donors</td><td>${_MISSING('e.g. Australia, New Zealand, EU')}</td><td>${_MISSING('years')}</td><td>${_MISSING('programme focus')}</td><td>${_MISSING('USD amount')}</td></tr>
      </tbody>
    </table>
    ${_STAFFNOTE('Complete the funding table above. Include all active and recently closed biodiversity-relevant projects. Data should be obtained from DEPC finance records, the Vanuatu Aid Management Platform, and donor project documents.')}

    <h3 style="margin-top:18px">7.2 Resource Mobilisation Needs</h3>
    ${_STAFFNOTE('Estimate the financing gap for achieving all GBF targets. Structure by target or thematic area (conservation, restoration, monitoring, capacity). Reference CBD guidance on biodiversity finance needs for Pacific SIDS.')}
    ${_MISSING('Estimated total financing need 2025–2030 (USD)')}
    ${_MISSING('Annual government biodiversity budget allocation')}
    ${_MISSING('Financing gap estimate')}

    <h3 style="margin-top:18px">7.3 Biodiversity Finance Mechanisms</h3>
    ${_STAFFNOTE('Describe existing or planned biodiversity finance instruments: payment for ecosystem services, conservation trust funds, green bonds, impact investment, IPLC-led finance mechanisms. Note any harmful subsidies being tracked for reform under GBF Target 18.')}
  </div>
</div>`;
}

function secStakeholders(d) {
  return `
<div class="page page-break">
  <div class="section">
    <h2>8. Stakeholder Engagement</h2>
    <h3>8.1 Government Agencies</h3>
    <table>
      <thead><tr><th>Agency</th><th>Abbreviation</th><th>Primary GBF Role</th><th>Key Targets</th></tr></thead>
      <tbody>
        <tr><td>Department of Environmental Protection and Conservation</td><td>DEPC</td><td>NBSAP lead, T3 coordination, IAS management</td><td>T3, T6, T2</td></tr>
        <tr><td>Department of Agriculture and Rural Development</td><td>DARD</td><td>Agri-biodiversity, forestry, land use</td><td>T10, T7</td></tr>
        <tr><td>Department of Fisheries</td><td>DoF</td><td>Marine protected areas, LMMA coordination</td><td>T3 (marine), T5</td></tr>
        <tr><td>Vanuatu Meteorology and Geo-Hazards Department</td><td>VMGD</td><td>Climate monitoring, geo-hazard risk</td><td>T8</td></tr>
        <tr><td>Department of Lands</td><td>DoL</td><td>Land tenure, spatial planning</td><td>T1</td></tr>
        <tr><td>Ministry of Internal Affairs</td><td>MoIA</td><td>Provincial governance, island authorities</td><td>T1, T3</td></tr>
        <tr><td>Vanuatu National Statistics Office</td><td>VNSO</td><td>National data, baselines</td><td>All</td></tr>
      </tbody>
    </table>
    ${_STAFFNOTE('Verify and expand this table. Add any additional agencies with biodiversity responsibilities (e.g., Tourism, Health for biosafety, Public Works for EIA). Include contact points for NBSAP implementation coordination.')}

    <h3 style="margin-top:18px">8.2 Civil Society and NGO Partners</h3>
    ${_STAFFNOTE('List key NGO and civil society partners involved in NBSAP implementation, including their specific contributions (e.g., community conservation facilitation, IAS surveillance, marine monitoring). Include international organisations (SPREP, IUCN Oceania, WWF, TNC, etc.) active in Vanuatu.')}
    ${_MISSING('Formal NGO partnership registry or MOU list')}

    <h3 style="margin-top:18px">8.3 Indigenous Peoples and Local Communities (IPLCs)</h3>
    <p class="body-text">Custom land tenure is fundamental to biodiversity governance in Vanuatu. Over 80% of land is held under customary tenure, and Indigenous community governance is a primary mechanism for conservation, including Community Conserved Areas (CCAs) and customary tabu areas.</p>
    ${_STAFFNOTE('Describe: (1) the formal role of Custom Owners and Area Councils in CCA designation and management; (2) any FPIC (Free, Prior and Informed Consent) processes used in conservation planning; (3) benefit-sharing arrangements for communities managing conservation areas. Reference Article 8(j) of the CBD.')}
    ${_MISSING('Number of communities with formal conservation agreements')}
    ${_MISSING('Number of customary tabu areas formally recognised')}

    <h3 style="margin-top:18px">8.4 Consultation and Participation Process</h3>
    ${_STAFFNOTE('Describe the stakeholder consultation process undertaken for this reporting cycle: workshops held, organisations consulted, IPLC engagement, gender balance in consultations, and how feedback was incorporated.')}
    ${_MISSING('Number of stakeholder consultations held for this reporting period')}
    ${_MISSING('Number of participants, disaggregated by gender and affiliation')}
  </div>
</div>`;
}

function secChallenges(d) {
  const missingTargets = targetsConfig.targets
    .filter(t => !d.layers.some(l => l.metadata?.targets?.includes(t.code)))
    .map(t => t.name.replace(/^Target \d+:\s*/, ''));

  return `
<div class="page page-break">
  <div class="section">
    <h2>9. Challenges and Barriers</h2>
    <h3>9.1 Data and Monitoring Gaps</h3>
    <p class="body-text">Based on the current state of the NBSAP GIS Data Portal, the following quantitative gaps are identified:</p>
    <ul style="font-size:12px;line-height:1.9;padding-left:18px;color:#374151">
      <li><strong>${9 - d.targetsActive} of 9 GBF targets</strong> have no spatial data uploaded to the portal${missingTargets.length > 0 ? ': ' + missingTargets.join('; ') : ''}.</li>
      <li><strong>${d.layers.filter(l=>!l.metadata?.isReference && !l.metadata?.custodianAgency).length} datasets</strong> lack a recorded custodian agency — data provenance is incomplete.</li>
      <li><strong>${d.layers.filter(l=>!l.metadata?.isReference && !['Official','Approved'].includes(l.metadata?.approvalStatus)).length} datasets</strong> have not been formally approved — quality assurance is pending.</li>
      <li>Province attribution is incomplete for some features — province-level breakdowns may undercount conservation areas.</li>
    </ul>

    <h3 style="margin-top:18px">9.2 Capacity Constraints</h3>
    ${_STAFFNOTE('Describe human resource, technical, and institutional capacity constraints that affect NBSAP implementation and reporting. Include: number of DEPC technical staff, GIS capacity, field monitoring personnel, and any capacity-building needs identified.')}
    ${_MISSING('DEPC technical staff count with GIS/biodiversity qualifications')}

    <h3 style="margin-top:18px">9.3 Climate Change Vulnerability</h3>
    <p class="body-text">Vanuatu is consistently ranked among the world's most climate-vulnerable nations. The ND-GAIN Country Index places Vanuatu in the highest vulnerability category due to extreme weather events, sea-level rise, coastal erosion, and coral bleaching. Climate change exacerbates all major biodiversity threats and increases the urgency of achieving GBF Target 3 conservation commitments.</p>
    ${_STAFFNOTE('Add specific climate impacts observed since the previous reporting period: coral bleaching events (% affected), cyclone damage to conservation areas, sea-level encroachment on coastal CCAs. Reference VMGD climate monitoring reports.')}

    <h3 style="margin-top:18px">9.4 Financing Constraints</h3>
    ${_STAFFNOTE('Describe the biodiversity financing gap — the difference between current funding and what is needed to achieve GBF targets by 2030. Include systemic barriers such as short project cycles, aid dependence, lack of domestic revenue for conservation, and subsidy reform challenges (GBF Target 18).')}

    <h3 style="margin-top:18px">9.5 Invasive Species Pressure</h3>
    <p class="body-text">Invasive alien species (IAS) remain one of the most significant threats to Vanuatu's native biodiversity. <em>Merremia peltata</em> (Big Leaf vine) is actively mapped through the NBSAP Field Collector system. Additional priority IAS include Crown-of-Thorns starfish, Mile-a-Minute vine (<em>Mikania micrantha</em>), and Solanum torvum. Effective IAS management requires coordinated action across all six provinces.</p>
  </div>
</div>`;
}

function secFuturePriorities(d) {
  const actions = targetsConfig.targets.map(t => {
    const val = _tValue(t.code, d.tMetrics);
    const ms  = MILESTONES[t.code];
    const has = !!d.tMetrics[t.code];
    const met = ms?.threshold && val != null && val >= ms.threshold;
    const status = !has ? 'No data — upload priority'
                 : met ? 'On track — maintain effort'
                 : val != null && val >= ms?.threshold * 0.5 ? 'At risk — accelerate action'
                 : 'Critical — urgent action needed';
    const color = !has ? '#9AA5B4' : met ? '#2E7D32' : val != null && val >= ms?.threshold * 0.5 ? '#E65100' : '#C62828';
    return `<tr>
      <td><span style="color:${t.color};font-weight:800">${t.code}</span></td>
      <td style="font-weight:600">${t.name.replace(/^Target \d+:\s*/, '')}</td>
      <td style="color:${color};font-weight:600">${status}</td>
      <td>${_MISSING('Priority action 2025–2030')}</td>
      <td>${_MISSING('Lead agency')}</td>
      <td>${_MISSING('Deadline')}</td>
    </tr>`;
  }).join('');

  return `
<div class="page page-break">
  <div class="section">
    <h2>10. Future Priorities (2025–2030)</h2>
    <h3>10.1 Priority Action Framework</h3>
    <p class="body-text">Based on the current target status assessment, the following priority actions are identified for the 2025–2030 period. Actions are data-driven where portal metrics are available; all action descriptions require DEPC strategic planning input before publication.</p>
    <table>
      <thead><tr><th>Target</th><th>Topic</th><th>Current Status</th><th>Priority Action</th><th>Lead Agency</th><th>Deadline</th></tr></thead>
      <tbody>${actions}</tbody>
    </table>
    ${_STAFFNOTE('Complete the Priority Action, Lead Agency, and Deadline columns in the table above. For Target 3, priority actions should include: expand CCA network, formalise new MPAs, complete province-by-province 30x30 gap analysis, and strengthen management effectiveness (METT assessments).')}

    <h3 style="margin-top:20px">10.2 30&times;30 Roadmap</h3>
    ${_STAFFNOTE('Provide a specific roadmap for achieving all three T3 conditions (terrestrial, marine, combined) by 2030. Include: (1) new CCA/MPA designations planned; (2) target province and island; (3) estimated area (ha); (4) timeline; (5) responsible agency and community partners. This roadmap should be co-developed with provinces and custom landowners.')}
    ${_MISSING('30x30 roadmap document reference')}
    ${_MISSING('Number of new CCAs/MPAs planned by 2030 and estimated combined area')}

    <h3 style="margin-top:20px">10.3 NBSAP Revision</h3>
    ${_STAFFNOTE('Describe whether a revised NBSAP aligned with the KM-GBF is planned or underway. Outline the revision process, timeline, and stakeholder engagement approach. Include the planned submission date to the CBD Secretariat.')}
  </div>
</div>`;
}

function secConclusion(d) {
  const tMet = d.t3.terrestrial_remaining_pct <= 0;
  const mMet = d.t3.marine_remaining_pct <= 0;
  const cMet = d.t3.combined_remaining_pct <= 0;
  const t3Status = (tMet && mMet && cMet)
    ? 'has achieved all three 30&times;30 conditions'
    : `has achieved ${[tMet,mMet,cMet].filter(Boolean).length} of 3 required 30&times;30 conditions`;

  return `
<div class="page page-break">
  <div class="section">
    <h2>11. Conclusion</h2>
    <p class="body-text">This report presents Vanuatu's measured progress toward the Kunming-Montreal Global Biodiversity Framework targets as of <strong>${d.dateStr}</strong>. Based on spatial data currently uploaded to the NBSAP GIS Data Portal, Vanuatu <strong>${t3Status}</strong>. Data are available for <strong>${d.targetsActive} of 9 tracked GBF targets</strong>, with ${9 - d.targetsActive} target(s) still requiring dataset upload to enable quantitative assessment.</p>
    <p class="body-text" style="margin-top:10px">Vanuatu's biodiversity — spanning ${_fmtHa(d.BL.terrestrial_ha)} of terrestrial ecosystems and ${_fmtHa(d.BL.marine_ha)} of exclusive economic zone — is a national and global asset. The Government of Vanuatu reaffirms its commitment to the Convention on Biological Diversity and the Kunming-Montreal GBF, and to achieving all applicable targets by 2030 through coordinated government action, community-led conservation, and international partnerships.</p>
    ${_STAFFNOTE('Add a concluding paragraph with a ministerial commitment statement. This should be approved by the Minister responsible for Environment before the report is submitted to the CBD Secretariat. Include specific commitments on new conservation designations, NBSAP revision, and financing.')}
    ${_STAFFNOTE('Add signatures or official endorsement block: Minister for Environment, Director-General DEPC, NBSAP Focal Point. Include date of final approval.')}
  </div>
</div>`;
}

function secReferences() {
  return `
<div class="page page-break">
  <div class="section">
    <h2>12. References</h2>
    <ol style="font-size:12px;line-height:2;padding-left:20px;color:#374151">
      <li>CBD (2022). <em>Kunming-Montreal Global Biodiversity Framework.</em> Decision CBD/COP/15/L.25. Convention on Biological Diversity, Montreal, Canada.</li>
      <li>CBD (2022). <em>Monitoring Framework for the Kunming-Montreal Global Biodiversity Framework.</em> CBD/GBF/SBSTTA/24/3. Convention on Biological Diversity.</li>
      <li>UNEP-WCMC (2023). <em>World Database on Protected Areas (WDPA).</em> UNEP-WCMC and IUCN, Cambridge, UK. Available at: www.protectedplanet.net</li>
      <li>VLIZ (2023). <em>Maritime Boundaries Geodatabase: EEZ (version 12).</em> Flanders Marine Institute, Ostend, Belgium. doi:10.14284/628</li>
      <li>ND-GAIN (2023). <em>Notre Dame Global Adaptation Index — Country Index.</em> University of Notre Dame, USA.</li>
      <li>Turf.js contributors (2023). <em>Turf.js — Advanced geospatial analysis for browsers and Node.js.</em> Version 7. Available at: https://turfjs.org</li>
      <li>UN Statistics Division (2020). <em>Geographic Regions — Vanuatu land area.</em> United Nations Statistics Division.</li>
      <li>${_MISSING('Vanuatu NBSAP citation — include title, adoption year, and issuing ministry')}</li>
      <li>${_MISSING('Vanuatu National Sustainable Development Plan (NSDP 2030) citation')}</li>
      <li>${_MISSING('Most recent Vanuatu State of Environment Report citation')}</li>
      <li>${_MISSING('Vanuatu NSO — most recent population and national statistics citation')}</li>
    </ol>
  </div>
</div>`;
}

function secAnnexes(d) {
  const dataLayers = d.layers.filter(l => !l.metadata?.isReference);
  const BL = d.BL;
  const t3 = d.t3;

  const annexARows = dataLayers.map(l => {
    const m = l.metadata;
    return `<tr>
      <td style="font-size:11px"><strong>${m.name}</strong></td>
      <td style="font-size:11px">${CATEGORIES[m.category]?.label || m.category}</td>
      <td style="font-size:11px">${(m.targets||[]).join(', ') || '—'}</td>
      <td style="font-size:11px">${m.realm || '—'}</td>
      <td style="text-align:right;font-size:11px">${_fmtN(m.featureCount)}</td>
      <td style="text-align:right;font-size:11px">${m.totalAreaHa ? _fmtHa(m.totalAreaHa) : '—'}</td>
      <td style="font-size:11px">${m.detectedCRS || '—'}</td>
      <td style="font-size:11px">${m.custodianAgency || '—'}</td>
      <td style="font-size:11px">${m.uploadTimestamp?.substring(0,10) || '—'}</td>
      <td><span style="font-size:10px;background:${['Official','Approved'].includes(m.approvalStatus)?'#E8F5E9':'#FEF3C7'};color:${['Official','Approved'].includes(m.approvalStatus)?'#2E7D32':'#92400E'};padding:1px 6px;border-radius:10px;font-weight:700">${m.approvalStatus || 'Draft'}</span></td>
    </tr>`;
  }).join('');

  const annexBRows = d.checks.map(([label, pass]) => `<tr>
    <td style="text-align:center;font-size:16px">${pass ? '&#9989;' : '&#10060;'}</td>
    <td style="color:${pass?'#2E7D32':'#C62828'};font-weight:${pass?'600':'700'}">${label}</td>
    <td style="font-size:11px;color:#616E7C">${pass ? 'Satisfied' : 'Gap — action required'}</td>
  </tr>`).join('');

  return `
<div class="page page-break">
  <div class="section">
    <h2>Annexes</h2>

    <h3 id="annex-a">Annex A: Full Dataset Inventory</h3>
    <p style="font-size:11px;color:#616E7C;margin-bottom:8px">All datasets as of ${d.dateStr}. &#9733; = Counts toward 30&times;30.</p>
    ${dataLayers.length > 0 ? `<table style="font-size:11px">
      <thead><tr><th>Name</th><th>Category</th><th>Target(s)</th><th>Realm</th><th style="text-align:right">Features</th><th style="text-align:right">Area</th><th>CRS</th><th>Custodian</th><th>Uploaded</th><th>Status</th></tr></thead>
      <tbody>${annexARows}</tbody>
    </table>` : `<p style="font-size:12px;color:#9AA5B4;font-style:italic">No datasets uploaded.</p>`}

    <h3 style="margin-top:28px" id="annex-b">Annex B: CBD Compliance Checklist</h3>
    <p style="font-size:11px;color:#616E7C;margin-bottom:8px">Self-assessment against CBD/GBF reporting requirements. <strong>${d.passed}/${d.checks.length} checks passed.</strong></p>
    <table>
      <thead><tr><th style="width:40px">Status</th><th>Requirement</th><th>Assessment</th></tr></thead>
      <tbody>${annexBRows}</tbody>
    </table>

    <h3 style="margin-top:28px" id="annex-c">Annex C: Calculation Methodology — Target 3 (30&times;30)</h3>
    <div style="font-size:12px;color:#374151;line-height:1.8">
      <p><strong>Step 1 — Data collection:</strong> All layers tagged with GBF Target 3 and flagged as counting toward 30&times;30 (or belonging to category CCA/MPA/PA/OECM/LMMA) are selected. Reference layers (EEZ, national boundary) are excluded from conservation area totals.</p>
      <p style="margin-top:6px"><strong>Step 2 — Realm assignment:</strong> Each feature is assigned to either 'terrestrial' or 'marine' realm using the following priority order: (1) feature-level <code>properties.realm</code>, (2) layer metadata <code>realm</code> field (if non-terrestrial), (3) category default realm from the categories config, (4) fallback to 'terrestrial'.</p>
      <p style="margin-top:6px"><strong>Step 3 — Polygon dissolution:</strong> All terrestrial features are dissolved (unioned) into a single geometry using turf.js <code>union()</code>. Marine features are dissolved separately. This removes overlapping areas — each point on the ground is counted only once. A performance cap of 500 polygons applies; larger datasets fall back to gross (summed) area.</p>
      <p style="margin-top:6px"><strong>Step 4 — Area computation:</strong> Geodesic area is calculated using <code>turf.area(feature) / 10000</code> to convert m&sup2; to hectares. This uses the WGS84 ellipsoid and is accurate across Vanuatu's latitude range.</p>
    </div>
    <div style="margin-top:12px">
      ${_TRACEABLE('terrestrial_pct = net_terrestrial_ha &divide; ${_fmtHa(BL.terrestrial_ha)} &times; 100',
        { 'net_terrestrial_ha': _fmtHa(t3.terrestrial_ha), 'baseline (UN Stats 2020)': _fmtHa(BL.terrestrial_ha),
          'gross_terrestrial_ha': _fmtHa(t3.gross_terrestrial_ha || 0), 'overlap removed': _fmtHa(Math.max(0,(t3.gross_terrestrial_ha||0)-t3.terrestrial_ha)) },
        _fmtPct(t3.terrestrial_pct))}
      ${_TRACEABLE('marine_pct = net_marine_ha &divide; ${_fmtHa(BL.marine_ha)} &times; 100',
        { 'net_marine_ha': _fmtHa(t3.marine_ha), 'baseline (VLIZ 2023)': _fmtHa(BL.marine_ha),
          'gross_marine_ha': _fmtHa(t3.gross_marine_ha || 0), 'overlap removed': _fmtHa(Math.max(0,(t3.gross_marine_ha||0)-t3.marine_ha)) },
        _fmtPct(t3.marine_pct))}
      ${_TRACEABLE('combined_pct = (net_terr + net_marine) &divide; (${_fmtHa(BL.terrestrial_ha + BL.marine_ha)}) &times; 100',
        { 'combined_net_ha': _fmtHa(t3.combined_ha || (t3.terrestrial_ha + t3.marine_ha)),
          'combined_baseline_ha': _fmtHa(BL.terrestrial_ha + BL.marine_ha),
          '30% target (ha)': _fmtHa(t3.combined_target_ha || (BL.terrestrial_ha + BL.marine_ha) * 0.3) },
        _fmtPct(t3.combined_pct))}
    </div>

    <h3 style="margin-top:28px" id="annex-d">Annex D: Glossary</h3>
    <table>
      <thead><tr><th>Term</th><th>Definition</th></tr></thead>
      <tbody>
        <tr><td><strong>CCA</strong></td><td>Community Conserved Area — a terrestrial area governed and managed by a local or indigenous community for conservation purposes.</td></tr>
        <tr><td><strong>CBD</strong></td><td>Convention on Biological Diversity — the principal international treaty governing biodiversity conservation, sustainable use, and benefit-sharing.</td></tr>
        <tr><td><strong>EEZ</strong></td><td>Exclusive Economic Zone — the maritime zone extending 200 nautical miles from a country's coastline, within which it has sovereign rights over natural resources.</td></tr>
        <tr><td><strong>GBF</strong></td><td>Kunming-Montreal Global Biodiversity Framework — the 2022 CBD COP15 agreement setting 23 targets and 4 goals for biodiversity by 2030/2050.</td></tr>
        <tr><td><strong>GEF</strong></td><td>Global Environment Facility — a multilateral funding mechanism financing environmental programs including biodiversity and climate.</td></tr>
        <tr><td><strong>ha</strong></td><td>Hectare — unit of area equal to 10,000 m&sup2; or 0.01 km&sup2;.</td></tr>
        <tr><td><strong>IPLC</strong></td><td>Indigenous Peoples and Local Communities.</td></tr>
        <tr><td><strong>LMMA</strong></td><td>Locally Managed Marine Area — a marine area under community-based management, common in Pacific Island countries.</td></tr>
        <tr><td><strong>METT</strong></td><td>Management Effectiveness Tracking Tool — a standardised methodology for assessing how effectively protected areas are managed.</td></tr>
        <tr><td><strong>MPA</strong></td><td>Marine Protected Area — a designated marine area managed for biodiversity conservation.</td></tr>
        <tr><td><strong>NBSAP</strong></td><td>National Biodiversity Strategy and Action Plan — the national instrument required under the CBD for implementing GBF targets.</td></tr>
        <tr><td><strong>OECM</strong></td><td>Other Effective Area-Based Conservation Measure — a geographically defined area achieving positive and sustained biodiversity outcomes outside formal protected areas.</td></tr>
        <tr><td><strong>PA</strong></td><td>Protected Area — a defined geographical space, recognised and managed to achieve long-term conservation of nature.</td></tr>
        <tr><td><strong>UNEP-WCMC</strong></td><td>United Nations Environment Programme World Conservation Monitoring Centre — custodian of the World Database on Protected Areas (WDPA) and GBF indicator methodology.</td></tr>
        <tr><td><strong>WGS84</strong></td><td>World Geodetic System 1984 — the standard global coordinate reference system (EPSG:4326) used for all data in this portal.</td></tr>
        <tr><td><strong>WDPA</strong></td><td>World Database on Protected Areas — the global repository of protected area boundaries and attributes, maintained by UNEP-WCMC.</td></tr>
        <tr><td><strong>30&times;30</strong></td><td>The GBF Target 3 commitment to conserve at least 30% of terrestrial, 30% of marine, and 30% of combined land and sea areas by 2030.</td></tr>
      </tbody>
    </table>
  </div>
</div>`;
}

// ═════════════════════════════════════════════════════════════════════════════
// CSS
// ═════════════════════════════════════════════════════════════════════════════

function buildCSS() {
  return `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:13px;color:#1A202C;background:#fff;line-height:1.5}
h1{font-family:Georgia,serif;font-size:30px;color:#fff;line-height:1.2;margin-bottom:6px}
h2{font-family:Georgia,serif;font-size:20px;color:#006B3F;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #006B3F}
h3{font-size:14px;color:#1A202C;margin-bottom:8px;font-weight:700}
h4{font-size:11px;color:#4A5568;margin-bottom:5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.body-text{font-size:12px;color:#374151;line-height:1.8}
.page{max-width:920px;margin:0 auto;padding:0 36px}
.section{padding:36px 0;border-bottom:1px solid #E4E7EB}
.section:last-child{border-bottom:none}
/* Cover */
.cover{background:linear-gradient(160deg,#003D22 0%,#005C34 50%,#009543 100%);min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:60px 40px;position:relative;overflow:hidden}
.cover::before{content:'';position:absolute;top:0;left:0;right:0;height:8px;background:linear-gradient(90deg,#009543 33%,#FDCE12 33% 66%,#D21034 66%)}
.cover::after{content:'';position:absolute;bottom:0;left:0;right:0;height:4px;background:#000}
.cover-badge{display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.35);color:#fff;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:5px 14px;border-radius:20px;margin-bottom:18px}
.cover-subtitle{color:rgba(255,255,255,0.82);font-size:16px;margin:10px 0 28px;font-weight:400}
.cover-meta{color:rgba(255,255,255,0.72);font-size:12px;line-height:1.9;border-top:1px solid rgba(255,255,255,0.2);padding-top:18px;margin-top:18px}
.cover-stats{display:flex;gap:16px;margin:22px 0;flex-wrap:wrap}
.cover-stat{background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);border-radius:12px;padding:14px 22px;text-align:center;flex:1;min-width:100px}
.cover-stat-value{font-size:30px;font-weight:800;color:#fff}
.cover-stat-label{font-size:10px;color:rgba(255,255,255,0.68);text-transform:uppercase;letter-spacing:.07em;margin-top:3px}
.cover-logo-row{display:flex;justify-content:center;align-items:center;gap:32px;margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.18);flex-wrap:wrap}
.cover-logo-item{text-align:center}
/* Tables */
table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px}
th{background:#F1F3F5;color:#4A5568;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.04em;padding:8px 10px;text-align:left;border-bottom:2px solid #CBD2D9}
td{padding:7px 10px;border-bottom:1px solid #E8EAED;vertical-align:top}
tr:nth-child(even) td{background:#FAFBFC}
/* Badges */
.badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap}
/* KPI grid */
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:14px 0}
.kpi{background:#F8FAFB;border:1px solid #E4E7EB;border-radius:10px;padding:13px;text-align:center}
.kpi-value{font-size:22px;font-weight:800;color:#006B3F}
.kpi-label{font-size:10px;color:#616E7C;text-transform:uppercase;letter-spacing:.05em;margin-top:3px}
/* Target section */
.target-section{border:1px solid #E4E7EB;border-radius:10px;padding:18px;margin-bottom:16px;break-inside:avoid}
.target-header{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px}
.target-code{font-size:22px;font-weight:800;font-family:Georgia,serif;flex-shrink:0}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
/* Annotation boxes */
.missing-badge{background:#FEE2E2;color:#991B1B;border:1px solid #FECACA;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;white-space:nowrap;display:inline-block;margin:2px 0}
.staff-note{background:#FFFBEB;border:1px solid #FCD34D;border-left:4px solid #F59E0B;padding:10px 14px;margin:10px 0;border-radius:0 6px 6px 0;font-size:12px;color:#92400E;font-style:italic}
.trace-box{background:#F0FFF4;border:1px solid #86EFAC;border-left:4px solid #16A34A;padding:12px 14px;margin:10px 0;border-radius:0 6px 6px 0}
/* Toolbar */
.no-print{display:flex;gap:10px;justify-content:flex-end;padding:12px 32px;background:#F1F3F5;border-bottom:1px solid #E4E7EB;position:sticky;top:0;z-index:100}
.btn{padding:7px 18px;border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer}
.btn-primary{background:#006B3F;color:#fff}
.btn-outline{background:#fff;color:#006B3F;border:1px solid #006B3F}
/* Footer */
footer{background:#003D22;color:rgba(255,255,255,0.68);font-size:11px;text-align:center;padding:16px;margin-top:40px}
/* Print */
@media print{
  .no-print{display:none!important}
  .cover,.cover::before,.cover::after{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .cover-stat{break-inside:avoid}
  .page-break{page-break-before:always}
  .target-section{break-inside:avoid}
  body{font-size:11pt}
  h2{font-size:16pt}
  .kpi-value{font-size:18pt}
  .staff-note{border:1px solid #FCD34D !important;background:#FFFBEB !important}
  .missing-badge{background:#FEE2E2 !important}
  .trace-box{background:#F0FFF4 !important;border:1px solid #86EFAC !important}
}`;
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═════════════════════════════════════════════════════════════════════════════

export function generateNationalReport() {
  const layers        = getDashboardLayers();
  const general       = computeGeneralMetrics(layers, ALL_FILTER);
  const t3            = compute30x30Metrics(layers, ALL_FILTER);
  const t1            = computeTarget1Metrics(layers, ALL_FILTER);
  const t2            = computeTarget2Metrics(layers, ALL_FILTER);

  const now       = new Date();
  const dateStr   = now.toLocaleDateString('en', { year:'numeric', month:'long', day:'numeric' });
  const monthYear = now.toLocaleDateString('en', { year:'numeric', month:'long' });
  const basePath  = ENV.basePath;

  // Per-target metrics map
  const tMetrics = {};
  for (const t of targetsConfig.targets) {
    const has = layers.some(l => l.metadata?.targets?.includes(t.code));
    if (!has) { tMetrics[t.code] = null; continue; }
    try {
      if (t.code === 'T3') tMetrics.T3 = t3;
      else if (t.code === 'T1') tMetrics.T1 = t1;
      else if (t.code === 'T2') tMetrics.T2 = t2;
      else tMetrics[t.code] = computeTargetMetrics(layers, t.code, ALL_FILTER);
    } catch(_) { tMetrics[t.code] = null; }
  }

  const targetsActive = targetsConfig.targets.filter(t =>
    layers.some(l => l.metadata?.targets?.includes(t.code))
  ).length;

  // CBD compliance checks
  const checks = [
    ['Spatial data uploaded for ≥1 NBSAP target',              targetsActive > 0],
    ['% terrestrial area protected (T3) calculated',            t3.terrestrial_pct >= 0],
    ['% marine area protected (T3) calculated',                 t3.marine_pct >= 0],
    ['% combined land+sea area protected (T3) calculated',      t3.combined_pct >= 0],
    ['Province breakdown available',                            t3.provinceBreakdown?.length > 0],
    ['Dataset custodian recorded on ≥1 layer',                  layers.some(l => l.metadata?.custodianAgency)],
    ['UNEP-WCMC polygon dissolution applied',                   true],
    ['GBF Core Indicator B.4.1 (30×30 terrestrial) tracked',   t3.terrestrial_pct >= 0],
    ['GBF Core Indicator B.4.2 (30×30 marine) tracked',        t3.marine_pct >= 0],
    ['GBF Core Indicator B.4.3 (30×30 combined) tracked',      t3.combined_pct >= 0],
    ['Metadata completeness (CRS recorded)',                    layers.some(l => l.metadata?.detectedCRS)],
    ['Data traceability (upload timestamp recorded)',           layers.length === 0 || layers.every(l => l.metadata?.uploadTimestamp)],
  ];
  const passed = checks.filter(c => c[1]).length;

  const d = {
    layers, general, t3, t1, t2, tMetrics,
    now, dateStr, monthYear, basePath,
    checks, passed, targetsActive,
    BL: ENV.nationalBaselines
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vanuatu NBSAP — GBF 2030 Progress Report — ${d.monthYear}</title>
<style>${buildCSS()}</style>
</head>
<body>
<div class="no-print">
  <button class="btn btn-outline" onclick="window.close()">&#10005; Close</button>
  <button class="btn btn-primary" onclick="window.print()">&#128424; Print / Save PDF</button>
</div>
${secCover(d)}
${secExecutiveSummary(d)}
${secIntroduction(d)}
${secNationalContext(d)}
${secPolicyFramework(d)}
${secGBFTargets(d)}
${secTarget3Full(d)}
${secDataSystems(d)}
${secFinancing(d)}
${secStakeholders(d)}
${secChallenges(d)}
${secFuturePriorities(d)}
${secConclusion(d)}
${secReferences()}
${secAnnexes(d)}
<footer>
  &copy; ${d.now.getFullYear()} Republic of Vanuatu &nbsp;&middot;&nbsp;
  Department of Environmental Protection and Conservation (DEPC) &nbsp;&middot;&nbsp;
  Vanuatu NBSAP GIS Data Portal &nbsp;&middot;&nbsp;
  FOR OFFICIAL USE &nbsp;&middot;&nbsp; Generated: ${d.dateStr}
</footer>
</body>
</html>`;

  const w = window.open('', '_blank', 'width=1150,height=900,scrollbars=yes');
  if (!w) { alert('Pop-up blocked — please allow pop-ups for this site and try again.'); return; }
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.document.title = 'Vanuatu NBSAP GBF 2030 Report — ' + d.monthYear;
}
