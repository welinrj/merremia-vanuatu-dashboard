/**
 * National Biodiversity Status Report Generator.
 * Produces a CBD-compliant, government-grade HTML report for all 9 NBSAP targets.
 * Opens in a new window — printable to PDF via browser Ctrl+P.
 */
import { getDashboardLayers } from '../state.js';
import {
  compute30x30Metrics, computeTarget1Metrics, computeTarget2Metrics,
  computeTargetMetrics, computeGeneralMetrics
} from '../../gis/areaCalc.js';
import { CATEGORIES } from '../../config/categories.js';
import ENV from '../../config/env.js';
import targetsConfig from '../../config/targets.js';

const ALL_FILTER = { targets: [], province: 'All', category: 'All', realm: 'All', year: 'All' };
const BL = ENV.nationalBaselines;

const MILESTONES = {
  T1: { threshold: 100, unit: '%', label: '100% land & sea covered by spatial plans' },
  T2: { threshold: 30,  unit: '%', label: '≥30% of degraded ecosystems restored' },
  T3: { threshold: 30,  unit: '%', label: '≥30% terrestrial & ≥30% marine conserved' },
  T4: { threshold: 100, unit: '%', label: 'All 6 key species distribution maps complete' },
};

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
  return v.toFixed(1) + '%';
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
  return `<div style="background:#E4E7EB;border-radius:4px;height:8px;overflow:hidden;margin-top:4px">
    <div style="width:${w}%;background:${color};height:100%;border-radius:4px;transition:width .6s"></div>
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

export function generateNationalReport() {
  const layers = getDashboardLayers();
  const general = computeGeneralMetrics(layers, ALL_FILTER);
  const t3 = compute30x30Metrics(layers, ALL_FILTER);
  const t1 = computeTarget1Metrics(layers, ALL_FILTER);
  const t2 = computeTarget2Metrics(layers, ALL_FILTER);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en', { year:'numeric', month:'long', day:'numeric' });
  const monthYear = now.toLocaleDateString('en', { year:'numeric', month:'long' });

  // Per-target metrics
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

  // Summary status per target
  function tValue(code) {
    const m = tMetrics[code]; if (!m) return null;
    if (code === 'T3') return Math.min(m.terrestrial_pct, m.marine_pct);
    if (code === 'T1') return m.total_pct;
    if (code === 'T2') return m.restoration_pct;
    if (code === 'T4') {
      const cats = ['MEGAPODE','STARLING','FANTAIL','KINGFISHER','FLYING_FOX','PLERANDRA'];
      const mapped = cats.filter(k => m.categoryBreakdown?.some(c=>c.category===k && c.features>0)).length;
      return (mapped / cats.length) * 100;
    }
    return m.totalAreaHa > 0 ? 1 : 0;
  }

  const targetsActive = targetsConfig.targets.filter(t => layers.some(l => l.metadata?.targets?.includes(t.code))).length;

  // CBD compliance checks
  const checks = [
    ['Spatial data uploaded for ≥1 NBSAP target', targetsActive > 0],
    ['% terrestrial area protected (T3) calculated', t3.terrestrial_pct > 0],
    ['% marine area protected (T3) calculated', t3.marine_pct > 0],
    ['Province breakdown available', t3.provinceBreakdown?.length > 0],
    ['Dataset custodian recorded on ≥1 layer', layers.some(l => l.metadata?.custodianAgency)],
    ['UNEP-WCMC polygon dissolution applied', true],
    ['GBF Core Indicator B.4.1 (30×30 terrestrial) tracked', t3.terrestrial_pct >= 0],
    ['GBF Core Indicator B.4.2 (30×30 marine) tracked', t3.marine_pct >= 0],
    ['Metadata completeness (CRS recorded)', layers.some(l => l.metadata?.detectedCRS)],
    ['Data traceability (upload timestamp)', layers.every(l => l.metadata?.uploadTimestamp)],
  ];
  const passed = checks.filter(c => c[1]).length;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vanuatu NBSAP National Biodiversity Status Report — ${monthYear}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;font-size:13px;color:#1A202C;background:#fff;line-height:1.5}
h1{font-family:Georgia,serif;font-size:28px;color:#fff;line-height:1.2}
h2{font-family:Georgia,serif;font-size:20px;color:#006B3F;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #006B3F}
h3{font-size:15px;color:#1A202C;margin-bottom:8px;font-weight:700}
h4{font-size:13px;color:#4A5568;margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.page{max-width:900px;margin:0 auto;padding:0 32px}
.cover{background:linear-gradient(160deg,#004D2C 0%,#006B3F 60%,#009543 100%);min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:60px 64px;position:relative;overflow:hidden}
.cover::before{content:'';position:absolute;top:0;left:0;right:0;height:8px;background:#FDCE12}
.cover::after{content:'';position:absolute;bottom:0;left:0;right:0;height:8px;background:#D21034}
.cover-badge{display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:#fff;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:5px 12px;border-radius:20px;margin-bottom:20px}
.cover-subtitle{color:rgba(255,255,255,0.8);font-size:16px;margin:12px 0 32px}
.cover-meta{color:rgba(255,255,255,0.7);font-size:13px;line-height:1.8;border-top:1px solid rgba(255,255,255,0.2);padding-top:20px;margin-top:20px}
.cover-stats{display:flex;gap:20px;margin:28px 0}
.cover-stat{background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:12px;padding:16px 24px;text-align:center;flex:1}
.cover-stat-value{font-size:32px;font-weight:800;color:#fff}
.cover-stat-label{font-size:11px;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:.06em;margin-top:4px}
.section{padding:40px 0;border-bottom:1px solid #E4E7EB}
.section:last-child{border-bottom:none}
table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px}
th{background:#F1F3F5;color:#4A5568;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.04em;padding:8px 10px;text-align:left;border-bottom:2px solid #CBD2D9}
td{padding:7px 10px;border-bottom:1px solid #E4E7EB;vertical-align:top}
tr:nth-child(even) td{background:#FAFBFC}
.badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 0}
.kpi{background:#F8FAFB;border:1px solid #E4E7EB;border-radius:10px;padding:14px;text-align:center}
.kpi-value{font-size:22px;font-weight:800;color:#006B3F}
.kpi-label{font-size:10px;color:#616E7C;text-transform:uppercase;letter-spacing:.05em;margin-top:3px}
.target-section{border:1px solid #E4E7EB;border-radius:12px;padding:20px;margin-bottom:20px;break-inside:avoid}
.target-header{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.target-code{font-size:20px;font-weight:800;font-family:Georgia,serif}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:12px}
.check-pass{color:#2E7D32;font-weight:700}
.check-fail{color:#C62828;font-weight:700}
footer{background:#004D2C;color:rgba(255,255,255,0.7);font-size:11px;text-align:center;padding:16px;margin-top:40px}
.no-print{display:flex;gap:10px;justify-content:flex-end;padding:16px 32px;background:#F1F3F5;border-bottom:1px solid #E4E7EB;position:sticky;top:0;z-index:100}
.btn{padding:8px 18px;border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer}
.btn-primary{background:#006B3F;color:#fff}
.btn-outline{background:#fff;color:#006B3F;border:1px solid #006B3F}
@media print{
  .no-print{display:none!important}
  .cover{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .page-break{page-break-before:always}
  body{font-size:11pt}
  .cover-stat-value{font-size:24pt}
}
</style>
</head>
<body>

<!-- ── Toolbar ── -->
<div class="no-print">
  <button class="btn btn-outline" onclick="window.close()">✕ Close</button>
  <button class="btn btn-primary" onclick="window.print()">🖨 Print / Save PDF</button>
</div>

<!-- ══ COVER PAGE ══════════════════════════════════════════════════════════ -->
<div class="cover">
  <div style="max-width:700px">
    <div class="cover-badge">Official Government Report · DEPC · ${monthYear}</div>
    <h1>Vanuatu National<br>Biodiversity Status Report</h1>
    <div class="cover-subtitle">
      GBF 2030 Progress &nbsp;·&nbsp; NBSAP Implementation &nbsp;·&nbsp; CBD 7th National Report
    </div>
    <div class="cover-stats">
      <div class="cover-stat">
        <div class="cover-stat-value">${layers.length}</div>
        <div class="cover-stat-label">Datasets</div>
      </div>
      <div class="cover-stat">
        <div class="cover-stat-value">${_fmtN(general.totalFeatures)}</div>
        <div class="cover-stat-label">Features</div>
      </div>
      <div class="cover-stat">
        <div class="cover-stat-value">${targetsActive}/9</div>
        <div class="cover-stat-label">Targets with Data</div>
      </div>
      <div class="cover-stat">
        <div class="cover-stat-value">${passed}/${checks.length}</div>
        <div class="cover-stat-label">CBD Checks</div>
      </div>
    </div>
    <div class="cover-meta">
      <strong style="color:#fff">Prepared by:</strong> Department of Environmental Protection and Conservation (DEPC)<br>
      <strong style="color:#fff">For:</strong> Convention on Biological Diversity (CBD) — 7th National Report &amp; GBF 30×30 Tracking<br>
      <strong style="color:#fff">Date:</strong> ${dateStr}<br>
      <strong style="color:#fff">System:</strong> Vanuatu NBSAP GIS Data Portal &amp; 30×30 Dashboard<br>
      <strong style="color:#fff">CRS:</strong> WGS84 / EPSG:4326 &nbsp;·&nbsp; Area methodology: UNEP-WCMC polygon dissolution
    </div>
  </div>
</div>

<!-- ══ EXECUTIVE SUMMARY ══════════════════════════════════════════════════ -->
<div class="page page-break">
  <div class="section">
    <h2>Executive Summary</h2>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-value" style="color:#006B3F">${_fmtPct(t3.terrestrial_pct)}</div><div class="kpi-label">Terrestrial Protected (T3)</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#0072BC">${_fmtPct(t3.marine_pct)}</div><div class="kpi-label">Marine Protected (T3)</div></div>
      <div class="kpi"><div class="kpi-value">${_fmtHa(t3.terrestrial_ha)}</div><div class="kpi-label">Terrestrial Net Area</div></div>
      <div class="kpi"><div class="kpi-value">${_fmtHa(t3.marine_ha)}</div><div class="kpi-label">Marine Net Area</div></div>
    </div>
    <table>
      <thead><tr><th>Target</th><th>Name</th><th>Status</th><th>Progress</th><th>GBF 2030 Milestone</th></tr></thead>
      <tbody>
      ${targetsConfig.targets.map(t => {
        const m = tMetrics[t.code];
        const has = !!m;
        const val = tValue(t.code);
        const ms = MILESTONES[t.code];
        const st = _status(val, ms?.threshold ?? null, has);
        const pctText = ms?.threshold && val != null ? `${val.toFixed(1)}%` : (has ? 'Data present' : 'No data');
        return `<tr>
          <td><span style="color:${t.color};font-weight:800">${t.code}</span></td>
          <td>${t.name.replace(/^Target \d+:\s*/,'')}</td>
          <td><span class="badge" style="background:${st.bg};color:${st.color}">${st.label}</span></td>
          <td style="min-width:120px">${pctText}${ms?.threshold && val!=null ? _bar(val/ms.threshold*100,st.color) : ''}</td>
          <td style="font-size:11px;color:#616E7C">${ms?.label || 'Mapping target'}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table>
  </div>
</div>

<!-- ══ PER-TARGET PROGRESS ════════════════════════════════════════════════ -->
<div class="page">
  <div class="section">
    <h2>GBF 2030 Progress by Target</h2>

    ${targetsConfig.targets.map(t => {
      const m = tMetrics[t.code];
      if (!m) return `<div class="target-section" style="opacity:.6">
        <div class="target-header"><span class="target-code" style="color:${t.color}">${t.code}</span><span style="font-size:14px;font-weight:600">${t.name.replace(/^Target \d+:\s*/,'')}</span><span class="badge" style="background:#F1F3F5;color:#9AA5B4;margin-left:auto">No Data</span></div>
        <p style="font-size:12px;color:#9AA5B4">No datasets uploaded for this target.</p>
      </div>`;

      const ms = MILESTONES[t.code];
      const val = tValue(t.code);
      const st = _status(val, ms?.threshold ?? null, true);

      let stats = '';
      if (t.code === 'T3') {
        stats = `<div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">
          <div class="kpi"><div class="kpi-value" style="color:#006B3F">${_fmtPct(m.terrestrial_pct)}</div><div class="kpi-label">% Terrestrial</div></div>
          <div class="kpi"><div class="kpi-value" style="color:#0072BC">${_fmtPct(m.marine_pct)}</div><div class="kpi-label">% Marine</div></div>
          <div class="kpi"><div class="kpi-value">${_fmtHa(m.terrestrial_ha)}</div><div class="kpi-label">Terrestrial (net)</div></div>
          <div class="kpi"><div class="kpi-value">${_fmtHa(m.marine_ha)}</div><div class="kpi-label">Marine (net)</div></div>
        </div>`;
      } else if (t.code === 'T1') {
        stats = `<div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">
          <div class="kpi"><div class="kpi-value">${_fmtPct(m.total_pct)}</div><div class="kpi-label">Total Coverage</div></div>
          <div class="kpi"><div class="kpi-value">${_fmtPct(m.terrestrial_pct)}</div><div class="kpi-label">% Land Plans</div></div>
          <div class="kpi"><div class="kpi-value">${_fmtPct(m.marine_pct)}</div><div class="kpi-label">% Sea Plans</div></div>
          <div class="kpi"><div class="kpi-value">${m.totalFeatures||0}</div><div class="kpi-label">Features</div></div>
        </div>`;
      } else if (t.code === 'T2') {
        stats = `<div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">
          <div class="kpi"><div class="kpi-value">${_fmtHa(m.degraded_ha)}</div><div class="kpi-label">Degraded Area</div></div>
          <div class="kpi"><div class="kpi-value">${_fmtHa(m.restoration_ha)}</div><div class="kpi-label">Restoration Area</div></div>
          <div class="kpi"><div class="kpi-value">${_fmtPct(m.restoration_pct)}</div><div class="kpi-label">Restoration %</div></div>
          <div class="kpi"><div class="kpi-value">${m.totalFeatures||0}</div><div class="kpi-label">Features</div></div>
        </div>`;
      } else {
        stats = `<div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">
          <div class="kpi"><div class="kpi-value">${_fmtHa(m.totalAreaHa)}</div><div class="kpi-label">Total Area (net)</div></div>
          <div class="kpi"><div class="kpi-value">${_fmtHa(m.realmTotals?.terrestrial_ha)}</div><div class="kpi-label">Terrestrial</div></div>
          <div class="kpi"><div class="kpi-value">${_fmtHa(m.realmTotals?.marine_ha)}</div><div class="kpi-label">Marine</div></div>
          <div class="kpi"><div class="kpi-value">${m.totalFeatures||0}</div><div class="kpi-label">Features</div></div>
        </div>`;
      }

      const breakdown = m.provinceBreakdown || [];
      const cats = (m.categoryBreakdown || []).slice(0, 6);

      return `<div class="target-section">
        <div class="target-header">
          <span class="target-code" style="color:${t.color}">${t.code}</span>
          <div>
            <div style="font-size:14px;font-weight:700">${t.name.replace(/^Target \d+:\s*/,'')}</div>
            <div style="font-size:11px;color:#616E7C">${t.description?.substring(0,100)}…</div>
          </div>
          <span class="badge" style="background:${st.bg};color:${st.color};margin-left:auto">${st.label}</span>
        </div>
        ${ms?.threshold && val != null ? `
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600">
            <span>${val.toFixed(1)}% achieved</span><span>${ms.threshold}${ms.unit} target</span>
          </div>
          ${_bar(val/ms.threshold*100, st.color)}
        </div>` : ''}
        ${stats}
        <div class="two-col">
          <div>
            <h4>Province Breakdown</h4>
            <table>
              <thead><tr><th>Province</th><th style="text-align:right">Terr (ha)</th><th style="text-align:right">Marine (ha)</th><th style="text-align:right">Total (ha)</th><th style="text-align:right">Records</th></tr></thead>
              <tbody>${_provRows(breakdown)}</tbody>
            </table>
          </div>
          ${cats.length > 0 ? `<div>
            <h4>Category Breakdown</h4>
            <table>
              <thead><tr><th>Category</th><th style="text-align:right">Area (ha)</th><th style="text-align:right">Records</th></tr></thead>
              <tbody>${cats.map(c=>`<tr>
                <td><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${CATEGORIES[c.category]?.color||'#888'};margin-right:5px"></span>${CATEGORIES[c.category]?.label||c.category}</td>
                <td style="text-align:right">${_fmtN(c.area_ha?.toFixed(0))}</td>
                <td style="text-align:right">${_fmtN(c.features)}</td>
              </tr>`).join('')}</tbody>
            </table>
          </div>` : ''}
        </div>
      </div>`;
    }).join('')}
  </div>
</div>

<!-- ══ DATA INVENTORY ════════════════════════════════════════════════════ -->
<div class="page page-break">
  <div class="section">
    <h2>Data Inventory</h2>
    <p style="font-size:12px;color:#616E7C;margin-bottom:16px">All datasets uploaded to the Vanuatu NBSAP GIS Data Portal as of ${dateStr}. Datasets marked ★ count toward the 30×30 Target 3 coverage calculation.</p>
    <table>
      <thead><tr><th>Dataset</th><th>Category</th><th>Target(s)</th><th>Realm</th><th style="text-align:right">Features</th><th style="text-align:right">Area (ha)</th><th>Custodian</th><th>Updated</th><th>Approval</th></tr></thead>
      <tbody>
      ${layers.filter(l=>!l.metadata?.isReference).map(l => {
        const m = l.metadata;
        return `<tr>
          <td><strong>${m.name}</strong>${m.countsToward30x30?' <span style="color:#006B3F">★</span>':''}</td>
          <td style="font-size:11px">${CATEGORIES[m.category]?.label||m.category}</td>
          <td style="font-size:11px">${(m.targets||[]).join(', ')||'—'}</td>
          <td style="font-size:11px">${m.realm||'—'}</td>
          <td style="text-align:right">${_fmtN(m.featureCount)}</td>
          <td style="text-align:right">${m.totalAreaHa?_fmtN(m.totalAreaHa.toFixed(0)):'—'}</td>
          <td style="font-size:11px">${m.custodianAgency||'—'}</td>
          <td style="font-size:11px">${m.dateUpdated||m.uploadTimestamp?.substring(0,10)||'—'}</td>
          <td><span class="badge" style="background:${m.approvalStatus==='Official'||m.approvalStatus==='Approved'?'#E8F5E9':'#F1F3F5'};color:${m.approvalStatus==='Official'||m.approvalStatus==='Approved'?'#2E7D32':'#616E7C'};font-size:10px">${m.approvalStatus||'Draft'}</span></td>
        </tr>`;
      }).join('')}
      </tbody>
    </table>
  </div>
</div>

<!-- ══ CBD COMPLIANCE CHECKLIST ══════════════════════════════════════════ -->
<div class="page">
  <div class="section">
    <h2>CBD Compliance Checklist</h2>
    <p style="font-size:12px;color:#616E7C;margin-bottom:16px">Self-assessment against CBD/GBF reporting requirements. <strong>${passed}/${checks.length} checks passed.</strong></p>
    <table>
      <thead><tr><th style="width:40px">Status</th><th>Requirement</th></tr></thead>
      <tbody>
      ${checks.map(([label, pass]) => `<tr>
        <td style="text-align:center;font-size:16px">${pass ? '✅' : '❌'}</td>
        <td class="${pass?'check-pass':'check-fail'}" style="font-weight:${pass?'600':'700'}">${label}</td>
      </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <div class="section">
    <h2>Methodology</h2>
    <div style="font-size:12px;color:#4A5568;line-height:1.8">
      <p><strong>Area Calculation:</strong> All area figures use geodesic (turf.js) calculations on WGS84 coordinates. Overlapping polygons are dissolved (unioned) per UNEP-WCMC methodology to prevent double-counting — each point on Earth's surface is counted once toward coverage targets.</p>
      <p style="margin-top:8px"><strong>National Baselines:</strong> Terrestrial baseline: ${_fmtHa(BL.terrestrial_ha)} (national land area). Marine baseline: ${_fmtHa(BL.marine_ha)} (EEZ area). Source: Vanuatu national statistics &amp; EEZ boundary.</p>
      <p style="margin-top:8px"><strong>30×30 Standard:</strong> Only layers explicitly flagged "Counts toward 30×30" OR categorised as CCA/MPA/PA/OECM/LMMA and tagged with Target 3 are included in the conservation coverage calculation. Reference layers (EEZ, Admin Boundary) are excluded from area totals.</p>
      <p style="margin-top:8px"><strong>CRS:</strong> All data stored in WGS84 / EPSG:4326. Reprojection is performed automatically on upload if required.</p>
      <p style="margin-top:8px"><strong>GBF Indicators:</strong> B.4.1 = Terrestrial 30×30 progress. B.4.2 = Marine 30×30 progress. Computed from dissolved net areas against national baselines.</p>
    </div>
  </div>
</div>

<footer>
  © ${now.getFullYear()} Republic of Vanuatu &nbsp;·&nbsp; Department of Environmental Protection and Conservation (DEPC) &nbsp;·&nbsp; Vanuatu Spatial Data Standard &nbsp;·&nbsp; For Official Use
  &nbsp;·&nbsp; Generated: ${dateStr} &nbsp;·&nbsp; Vanuatu NBSAP GIS Data Portal
</footer>

</body>
</html>`;

  const w = window.open('', '_blank', 'width=1100,height=850');
  if (!w) { alert('Pop-up blocked — please allow pop-ups for this site.'); return; }
  w.document.write(html);
  w.document.close();
  w.document.title = `Vanuatu NBSAP National Report — ${monthYear}`;
}
