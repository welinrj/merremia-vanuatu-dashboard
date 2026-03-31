/**
 * nationalReport/index.js
 * ========================
 * Main orchestrator for the Vanuatu National Biodiversity Status Report.
 *
 * Architecture
 * ────────────
 * The report is split into independent section modules (sections/s00_*.js …
 * sections/s15_*.js), each exporting a single render function that accepts a
 * shared `ctx` (report context) object and returns an HTML string.
 *
 * Adding a new section:
 *  1. Create sections/sNN_mySection.js with export function renderMySection(ctx)
 *  2. Import it below and add its output to the SECTIONS array.
 *  3. Add it to the Table of Contents in s01_toc.js.
 *  No other files need changing.
 *
 * Logos
 * ─────
 * Logos are served from public/logos/ relative to the portal root.
 * The base URL is computed from window.location so the report window can
 * resolve absolute paths.  See s00_cover.js for per-logo filenames.
 *
 * Future server migration
 * ───────────────────────
 * To move to a Vanuatu government server:
 *  • Replace the Firebase-backed getDashboardLayers() / compute*Metrics()
 *    calls with API calls to your server endpoint (implement in services/).
 *  • All section modules, utilities, and styles are pure HTML-generation
 *    functions with no Firebase dependency — they remain unchanged.
 *
 * @module nationalReport
 */

import { getDashboardLayers } from '../../state.js';
import {
  compute30x30Metrics,
  computeTarget1Metrics,
  computeTarget2Metrics,
  computeTargetMetrics,
  computeGeneralMetrics,
} from '../../../gis/areaCalc.js';
import targetsConfig from '../../../config/targets.js';
import ENV from '../../../config/env.js';
import { CATEGORIES } from '../../../config/categories.js';

// ── Section modules ──────────────────────────────────────────────────────────
import { renderCover }            from './sections/s00_cover.js';
import { renderTOC }              from './sections/s01_toc.js';
import { renderExecSummary, MILESTONES } from './sections/s02_execSummary.js';
import { renderIntroduction }     from './sections/s03_introduction.js';
import { renderNationalContext }  from './sections/s04_nationalContext.js';
import { renderPolicyFramework }  from './sections/s05_policyFramework.js';
import { renderGBFTargets }       from './sections/s06_gbfTargets.js';
import { renderTarget3 }          from './sections/s07_target3_30x30.js';
import { renderDataMonitoring }   from './sections/s08_dataMonitoring.js';
import { renderFinancing }        from './sections/s09_financing.js';
import { renderStakeholders }     from './sections/s10_stakeholders.js';
import { renderChallenges }       from './sections/s11_challenges.js';
import { renderFuturePriorities } from './sections/s12_futurePriorities.js';
import { renderConclusion }       from './sections/s13_conclusion.js';
import { renderReferences }       from './sections/s14_references.js';
import { renderAnnexes }          from './sections/s15_annexes.js';

// ── Styles ───────────────────────────────────────────────────────────────────
import { getReportStyles } from './reportStyles.js';

// ── Constants ────────────────────────────────────────────────────────────────
const ALL_FILTER = {
  targets: [], province: 'All', category: 'All', realm: 'All', year: 'All',
};
const BL = ENV.nationalBaselines;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD REPORT CONTEXT
// All data-gathering happens here so section modules stay pure / testable.
// ─────────────────────────────────────────────────────────────────────────────
function buildContext(logoBase) {
  const layers  = getDashboardLayers();
  const general = computeGeneralMetrics(layers, ALL_FILTER);
  const t3      = compute30x30Metrics(layers, ALL_FILTER);
  const t1      = computeTarget1Metrics(layers, ALL_FILTER);
  const t2      = computeTarget2Metrics(layers, ALL_FILTER);

  const now      = new Date();
  const dateStr  = now.toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' });
  const monthYear = now.toLocaleDateString('en', { year: 'numeric', month: 'long' });

  // Per-target metrics map
  const tMetrics = {};
  for (const t of targetsConfig.targets) {
    const has = layers.some(l => l.metadata?.targets?.includes(t.code));
    if (!has) { tMetrics[t.code] = null; continue; }
    try {
      if      (t.code === 'T3') tMetrics.T3 = t3;
      else if (t.code === 'T1') tMetrics.T1 = t1;
      else if (t.code === 'T2') tMetrics.T2 = t2;
      else                       tMetrics[t.code] = computeTargetMetrics(layers, t.code, ALL_FILTER);
    } catch (_) { tMetrics[t.code] = null; }
  }

  /**
   * Returns a representative scalar value for a target's progress.
   * Used for status badges, progress bars, and the executive summary table.
   */
  function tValue(code) {
    const m = tMetrics[code];
    if (!m) return null;
    if (code === 'T3') return Math.min(m.terrestrial_pct ?? 0, m.marine_pct ?? 0, m.combined_pct ?? 0);
    if (code === 'T1') return m.total_pct ?? null;
    if (code === 'T2') return m.restoration_pct ?? null;
    if (code === 'T4') {
      const SPECIES_CATS = ['MEGAPODE','STARLING','FANTAIL','KINGFISHER','FLYING_FOX','PLERANDRA'];
      const mapped = SPECIES_CATS.filter(k =>
        m.categoryBreakdown?.some(c => c.category === k && c.features > 0)
      ).length;
      return (mapped / SPECIES_CATS.length) * 100;
    }
    return (m.totalAreaHa ?? 0) > 0 ? 100 : 0;
  }

  const targetsActive = targetsConfig.targets.filter(t =>
    layers.some(l => l.metadata?.targets?.includes(t.code))
  ).length;

  // CBD compliance checks
  const checks = [
    ['Spatial data uploaded for ≥1 NBSAP target',                    targetsActive > 0],
    ['% terrestrial area protected (GBF B.4.1) calculated',           (t3.terrestrial_pct ?? -1) >= 0],
    ['% marine area protected (GBF B.4.2) calculated',                (t3.marine_pct ?? -1) >= 0],
    ['% combined land+sea protected (GBF B.4.3) calculated',          (t3.combined_pct ?? -1) >= 0],
    ['Province breakdown available for ≥1 target',                    (t3.provinceBreakdown?.length ?? 0) > 0],
    ['Dataset custodian agency recorded on ≥1 layer',                 layers.some(l => l.metadata?.custodianAgency)],
    ['UNEP-WCMC polygon dissolution applied (no double-counting)',     true],  // always applied by areaCalc.js
    ['GBF Core Indicator B.4.1 (30×30 terrestrial) tracked',         (t3.terrestrial_pct ?? -1) >= 0],
    ['GBF Core Indicator B.4.2 (30×30 marine) tracked',              (t3.marine_pct ?? -1) >= 0],
    ['GBF Core Indicator B.4.3 (30×30 combined) tracked',            (t3.combined_pct ?? -1) >= 0],
    ['Metadata completeness: CRS recorded on ≥1 layer',              layers.some(l => l.metadata?.detectedCRS)],
    ['Data traceability: upload timestamp on all layers',             layers.length > 0 && layers.every(l => l.metadata?.uploadTimestamp)],
  ];
  const passed = checks.filter(c => c[1]).length;

  return {
    // Raw data
    layers, general, t3, t1, t2, tMetrics,
    // Helpers
    tValue,
    // Derived scalars
    targetsActive, checks, passed,
    // Date strings
    now, dateStr, monthYear,
    // Config
    BL, CATEGORIES,
    // Logos base URL (absolute, resolved from window.location)
    logoBase,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE REPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates and opens the full National Biodiversity Status Report in a
 * new browser window. The report is a self-contained HTML document with
 * embedded CSS — suitable for printing to PDF via Ctrl+P / browser print.
 *
 * Called from dashboard.js when the user clicks "Generate National Report".
 */
export function generateNationalReport() {
  // Resolve absolute base URL so logos work in the new blank window
  const portalHref = window.location.href;
  const logoBase   = portalHref.replace(/[^/]*$/, '') + 'logos/';

  let ctx;
  try {
    ctx = buildContext(logoBase);
  } catch (err) {
    console.error('[nationalReport] Failed to build report context:', err);
    alert('Error generating report: ' + err.message);
    return;
  }

  // Ordered section array — add/remove/reorder sections here
  const SECTIONS = [
    renderCover(ctx),
    renderTOC(),
    renderExecSummary(ctx),
    renderIntroduction(ctx),
    renderNationalContext(ctx),
    renderPolicyFramework(ctx),
    renderGBFTargets(ctx),
    renderTarget3(ctx),
    renderDataMonitoring(ctx),
    renderFinancing(ctx),
    renderStakeholders(ctx),
    renderChallenges(ctx),
    renderFuturePriorities(ctx),
    renderConclusion(ctx),
    renderReferences(),
    renderAnnexes(ctx),
  ];

  const { monthYear, dateStr, now, passed, checks, logoBase: lb } = ctx;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Vanuatu NBSAP National Biodiversity Status Report — ${monthYear}</title>
  <meta name="description" content="Vanuatu National Biodiversity Status Report — GBF 2030 Progress, NBSAP Implementation, CBD 7th National Report. Generated ${dateStr}.">
  <style>${getReportStyles()}</style>
</head>
<body>

<!-- ── Toolbar (hidden on print) ── -->
<div class="no-print">
  <span class="toc-toggle" onclick="document.querySelector('.section')?.scrollIntoView({behavior:'smooth'})">↓ Jump to contents</span>
  <button class="btn btn-outline" onclick="window.close()">✕ Close</button>

  <!-- Download picker -->
  <div style="position:relative" id="dl-wrap">
    <button class="btn btn-primary" onclick="toggleDlMenu(event)" aria-haspopup="true" aria-expanded="false" id="dl-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"
        style="vertical-align:middle;margin-right:5px;margin-top:-2px">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/>
        <path d="M7 11l5 5l5 -5"/>
        <path d="M12 4l0 12"/>
      </svg>
      Download Report ▾
    </button>

    <div id="dl-menu" role="menu" style="display:none;position:absolute;right:0;top:calc(100% + 6px);
      background:#fff;border:1px solid #CBD2D9;border-radius:10px;padding:6px;min-width:220px;
      box-shadow:0 6px 20px rgba(0,0,0,0.13);z-index:500">

      <!-- PDF option -->
      <button onclick="window.print()" role="menuitem" style="display:flex;align-items:center;gap:10px;
        width:100%;padding:10px 12px;border:none;background:none;cursor:pointer;border-radius:6px;
        font-size:13px;font-weight:600;color:#1A202C;text-align:left" onmouseover="this.style.background='#F0F7F4'" onmouseout="this.style.background='none'">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="#C62828" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
          <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
          <path d="M9 17c0 -1 .889 -2 2 -2s2 .889 2 2c0 1.116 -.958 2 -2 2l-2 0l0 -4" />
        </svg>
        <div>
          <div>Print / Save as PDF</div>
          <div style="font-size:10px;color:#9AA5B4;font-weight:400">Use browser print dialog</div>
        </div>
      </button>

      <div style="height:1px;background:#E4E7EB;margin:4px 6px"></div>

      <!-- Word option -->
      <button onclick="downloadWord()" role="menuitem" style="display:flex;align-items:center;gap:10px;
        width:100%;padding:10px 12px;border:none;background:none;cursor:pointer;border-radius:6px;
        font-size:13px;font-weight:600;color:#1A202C;text-align:left" onmouseover="this.style.background='#F0F7F4'" onmouseout="this.style.background='none'">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="#1565C0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
          <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
          <path d="M9 13l1.5 6l1.5 -4l1.5 4l1.5 -6" />
        </svg>
        <div>
          <div>Download as Word (.doc)</div>
          <div style="font-size:10px;color:#9AA5B4;font-weight:400">Opens in Microsoft Word</div>
        </div>
      </button>
    </div>
  </div>
</div>

<script>
  function toggleDlMenu(e) {
    e.stopPropagation();
    const menu = document.getElementById('dl-menu');
    const btn  = document.getElementById('dl-btn');
    const open = menu.style.display !== 'none';
    menu.style.display = open ? 'none' : 'block';
    btn.setAttribute('aria-expanded', String(!open));
  }
  document.addEventListener('click', function() {
    const menu = document.getElementById('dl-menu');
    const btn  = document.getElementById('dl-btn');
    if (menu) { menu.style.display = 'none'; }
    if (btn)  { btn.setAttribute('aria-expanded', 'false'); }
  });
  function downloadWord() {
    /* Capture full page HTML and wrap it as a Word-compatible document.
       Uses the application/msword MIME type — Word/LibreOffice open these
       directly. For true .docx generation add a server-side endpoint in
       future (government server migration). */
    const reportTitle = document.title;
    const bodyHtml    = document.body.innerHTML;
    const styles      = Array.from(document.styleSheets)
      .map(s => { try { return Array.from(s.cssRules).map(r => r.cssText).join('\\n'); } catch(_) { return ''; } })
      .join('\\n');

    const wordHtml = \`<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8">
  <meta name="ProgId" content="Word.Document">
  <meta name="Generator" content="Vanuatu NBSAP GIS Portal">
  <title>\${reportTitle}</title>
  <!--[if gte mso 9]>
  <xml><w:WordDocument><w:View>Print</w:View><w:Zoom>90</w:Zoom></w:WordDocument></xml>
  <![endif]-->
  <style>
    /* Word page margins */
    @page WordSection1 { size:21.0cm 29.7cm; margin:2.54cm 2.54cm 2.54cm 2.54cm; }
    div.WordSection1   { page:WordSection1; }
    \${styles}
    /* Suppress toolbar in Word */
    .no-print { display:none !important; }
    body { font-size:11pt; }
  </style>
</head>
<body class="WordSection1">
\${bodyHtml}
</body>
</html>\`;

    const filename = reportTitle.replace(/[^a-zA-Z0-9\\s-]/g, '').trim().replace(/\\s+/g, '-') + '.doc';
    const blob = new Blob(['\\ufeff', wordHtml], { type: 'application/msword;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
</script>

${SECTIONS.join('\n')}

<!-- ── Footer ── -->
<footer>
  <div>
    © ${now.getFullYear()} Republic of Vanuatu &nbsp;·&nbsp;
    Department of Environmental Protection &amp; Conservation (DEPC) &nbsp;·&nbsp;
    Vanuatu NBSAP GIS Portal &nbsp;·&nbsp;
    Generated: ${dateStr} &nbsp;·&nbsp;
    CBD Compliance: ${passed}/${checks.length} checks &nbsp;·&nbsp;
    For Official Use
  </div>
  <div class="footer-logos">
    <img class="footer-logo" src="${lb}cbd-logo.png" alt="CBD" onerror="this.style.display='none'">
    <img class="footer-logo" src="${lb}depc-logo.png" alt="DEPC" onerror="this.style.display='none'">
    <img class="footer-logo" src="${lb}undp-logo.png" alt="UNDP" onerror="this.style.display='none'">
    <img class="footer-logo" src="${lb}gef-logo.png" alt="GEF" onerror="this.style.display='none'">
  </div>
</footer>

</body>
</html>`;

  const w = window.open('', '_blank', 'width=1140,height=900,scrollbars=yes');
  if (!w) {
    alert('Pop-up blocked. Please allow pop-ups for this site and try again.');
    return;
  }
  w.document.write(html);
  w.document.close();
  w.document.title = `Vanuatu NBSAP National Report — ${monthYear}`;
}
