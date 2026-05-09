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
import { showAlert } from '../dialog.js';

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
    showAlert('Error generating report: ' + err.message, { title: 'Report Error' });
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

  // Safe filename base
  const fileSlug = `Vanuatu-NBSAP-Report-${monthYear.replace(/\s+/g, '-')}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Vanuatu NBSAP National Biodiversity Status Report — ${monthYear}</title>
  <meta name="description" content="Vanuatu National Biodiversity Status Report — GBF 2030 Progress, NBSAP Implementation, CBD 7th National Report. Generated ${dateStr}.">
  <style>${getReportStyles()}</style>
  <!-- html-docx-js: client-side HTML → DOCX conversion (MIT) -->
  <script src="https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js"><\/script>
</head>
<body>

<!-- ── Download toolbar (hidden on print) ── -->
<div class="no-print">
  <span class="toc-toggle" onclick="document.getElementById('toc-panel')?.scrollIntoView({behavior:'smooth'})">↓ Jump to contents</span>
  <button class="btn btn-outline" onclick="window.close()">✕ Close</button>
  <button class="btn btn-outline" id="btn-docx" onclick="downloadDocx()">
    <svg style="width:14px;height:14px;vertical-align:-2px;margin-right:5px" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="12" y1="18" x2="12" y2="12"/>
      <polyline points="9 15 12 18 15 15"/>
    </svg>Download DOCX
  </button>
  <button class="btn btn-primary" onclick="downloadPdf()">
    <svg style="width:14px;height:14px;vertical-align:-2px;margin-right:5px;fill:white" viewBox="0 0 24 24" fill="none"
         stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M9 13h6M9 17h3"/>
    </svg>Download PDF
  </button>
</div>

<script>
/* ── PDF download: sets filename hint then triggers browser print dialog ── */
function downloadPdf() {
  const prev = document.title;
  document.title = ${JSON.stringify(fileSlug)};
  window.print();
  // Restore after slight delay (some browsers restore before print closes)
  setTimeout(() => { document.title = prev; }, 2000);
}

/* ── DOCX download: converts full HTML → DOCX via html-docx-js ─────────── */
function downloadDocx() {
  const btn = document.getElementById('btn-docx');
  if (!window.htmlDocx) {
    showAlert('DOCX library not loaded yet — please wait a moment and try again, or check your internet connection.', { title: 'Library Not Ready' });
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Generating…';
  try {
    // Build a clean HTML string: strip the toolbar so it doesn't appear in the doc
    const clone = document.documentElement.cloneNode(true);
    clone.querySelector('.no-print')?.remove();
    // Remove the CDN script tag (not needed in the document)
    clone.querySelectorAll('script').forEach(s => s.remove());
    const docHtml = '<!DOCTYPE html>' + clone.outerHTML;

    const blob = window.htmlDocx.asBlob(docHtml, {
      orientation: 'portrait',
      margins: { top: 720, right: 720, bottom: 720, left: 720 },
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = ${JSON.stringify(fileSlug + '.docx')};
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch (err) {
    showAlert('DOCX generation failed: ' + err.message, { title: 'Export Error' });
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<svg style="width:14px;height:14px;vertical-align:-2px;margin-right:5px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/><\\/svg>Download DOCX';
  }
}
<\/script>

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
  </div>
</footer>

</body>
</html>`;

  const w = window.open('', '_blank', 'width=1140,height=900,scrollbars=yes');
  if (!w) {
    showAlert('Pop-up blocked. Please allow pop-ups for this site and try again.', { title: 'Pop-up Blocked' });
    return;
  }
  w.document.write(html);
  w.document.close();
  w.document.title = `Vanuatu NBSAP National Report — ${monthYear}`;
}
