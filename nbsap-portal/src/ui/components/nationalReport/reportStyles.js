/**
 * reportStyles.js
 * All embedded CSS for the National Biodiversity Status Report.
 *
 * Returned as a string; injected into the <style> tag of the report window.
 * Fully self-contained — no external stylesheets needed for print/PDF.
 *
 * MAINTAINABILITY NOTE:
 *  When migrating to a government server, extract this into a static CSS file
 *  and link it via <link rel="stylesheet" href="report.css">.
 *  The class names are stable across all section modules.
 */
export function getReportStyles() {
  return `
/* ── Reset & Base ─────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
  font-size: 13px;
  color: #1A202C;
  background: #fff;
  line-height: 1.6;
}

/* ── Typography ───────────────────────────────────────────────────────── */
h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 30px; color: #fff; line-height: 1.2; }
h2 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 21px; color: #004D2C;
  margin-bottom: 14px;
  padding-bottom: 7px;
  border-bottom: 2.5px solid #006B3F;
  page-break-after: avoid;
}
h3 { font-size: 15px; color: #1A202C; margin: 16px 0 8px; font-weight: 700; page-break-after: avoid; }
h4 { font-size: 12px; color: #4A5568; margin-bottom: 6px; font-weight: 700;
     text-transform: uppercase; letter-spacing: 0.05em; }
p  { margin-bottom: 10px; }
ul, ol { margin: 8px 0 10px 20px; }
li { margin-bottom: 4px; }
strong { font-weight: 700; }
em { font-style: italic; }
a  { color: #006B3F; text-decoration: underline; }

/* ── Layout ───────────────────────────────────────────────────────────── */
.page        { max-width: 920px; margin: 0 auto; padding: 0 36px; }
.section     { padding: 36px 0; border-bottom: 1px solid #E4E7EB; }
.section:last-child { border-bottom: none; }
.page-break  { page-break-before: always; }
.two-col     { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 14px; }
.three-col   { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 12px; }

/* ── Section label ────────────────────────────────────────────────────── */
.section-label {
  font-size: 10px; font-weight: 800; letter-spacing: 0.12em;
  text-transform: uppercase; color: #006B3F; margin-bottom: 4px;
}

/* ── Toolbar (hidden on print) ────────────────────────────────────────── */
.no-print {
  display: flex; gap: 10px; justify-content: flex-end; align-items: center;
  padding: 12px 36px; background: #F1F3F5;
  border-bottom: 1px solid #CBD2D9;
  position: sticky; top: 0; z-index: 200;
}
.toc-toggle { font-size: 12px; color: #4A5568; cursor: pointer; margin-right: auto; text-decoration: underline; }
.btn { padding: 8px 20px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-primary { background: #006B3F; color: #fff; }
.btn-outline { background: #fff; color: #006B3F; border: 1.5px solid #006B3F; }
.btn:hover   { opacity: 0.87; }

/* ── Cover Page ───────────────────────────────────────────────────────── */
.cover {
  background: linear-gradient(155deg, #003520 0%, #005b35 55%, #007a45 100%);
  min-height: 100vh;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 48px 64px 56px;
  position: relative; overflow: hidden;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.cover-flag-top    { position: absolute; top: 0; left: 0; right: 0; height: 7px; background: #FDCE12; }
.cover-flag-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 7px; background: #D21034; }
.cover-bg-circle {
  position: absolute; top: -120px; right: -120px;
  width: 520px; height: 520px; border-radius: 50%;
  background: rgba(255,255,255,0.04); pointer-events: none;
}
.cover-logos {
  position: absolute; top: 36px; right: 48px;
  display: flex; align-items: center; gap: 20px;
}
.cover-logo-img { height: 52px; width: auto; object-fit: contain; filter: brightness(0) invert(1); opacity: 0.9; }
.cover-logo-svg { height: 52px; width: auto; }
.cover-coat     { position: absolute; top: 28px; left: 48px; height: 80px; width: auto; opacity: 0.92; }
.cover-badge {
  display: inline-block; background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3); color: #fff;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; padding: 5px 14px;
  border-radius: 20px; margin-bottom: 18px;
}
.cover-title    { font-family: Georgia, serif; font-size: 36px; font-weight: 700; color: #fff; line-height: 1.15; margin-bottom: 10px; }
.cover-subtitle { color: rgba(255,255,255,0.78); font-size: 15px; line-height: 1.6; margin-bottom: 28px; }
.cover-divider  { border: none; border-top: 1px solid rgba(255,255,255,0.2); margin: 20px 0; }
.cover-meta     { color: rgba(255,255,255,0.72); font-size: 12.5px; line-height: 1.9; }
.cover-meta strong { color: #fff; }
.cover-stats    { display: flex; gap: 16px; margin: 24px 0 28px; }
.cover-stat {
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px; padding: 14px 20px; text-align: center; flex: 1;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.cover-stat-value { font-size: 28px; font-weight: 800; color: #fff; }
.cover-stat-label { font-size: 10px; color: rgba(255,255,255,0.68); text-transform: uppercase; letter-spacing: 0.07em; margin-top: 3px; }

/* ── Table of Contents ────────────────────────────────────────────────── */
.toc { background: #F8FAFB; border: 1px solid #E4E7EB; border-radius: 10px; padding: 24px 28px; margin-bottom: 8px; }
.toc h3 { font-size: 14px; margin-bottom: 14px; color: #004D2C; }
.toc-item { display: flex; justify-content: space-between; align-items: baseline;
            padding: 4px 0; border-bottom: 1px dotted #CBD2D9; font-size: 12px; }
.toc-item:last-child { border-bottom: none; }
.toc-num  { color: #006B3F; font-weight: 700; min-width: 28px; }
.toc-title { flex: 1; padding: 0 8px; }
.toc-page  { color: #9AA5B4; font-size: 11px; }
.toc-item a { color: #1A202C; text-decoration: none; }
.toc-item a:hover { color: #006B3F; text-decoration: underline; }

/* ── KPI Grid ─────────────────────────────────────────────────────────── */
.kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin: 14px 0; }
.kpi-grid-6 { grid-template-columns: repeat(6,1fr); }
.kpi-grid-3 { grid-template-columns: repeat(3,1fr); }
.kpi {
  background: #F8FAFB; border: 1px solid #E4E7EB;
  border-radius: 10px; padding: 14px 10px; text-align: center;
  break-inside: avoid;
}
.kpi-value { font-size: 21px; font-weight: 800; color: #006B3F; }
.kpi-label { font-size: 10px; color: #616E7C; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 3px; line-height: 1.3; }
.kpi-sub   { font-size: 10px; color: #9AA5B4; margin-top: 2px; }

/* ── Tables ───────────────────────────────────────────────────────────── */
table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 14px; }
th {
  background: #F1F3F5; color: #4A5568; font-weight: 700;
  font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.04em;
  padding: 9px 10px; text-align: left; border-bottom: 2px solid #CBD2D9;
}
td { padding: 7px 10px; border-bottom: 1px solid #E4E7EB; vertical-align: top; }
tr:nth-child(even) td { background: #FAFBFC; }
tr:hover td { background: #F0F7F4; }

/* ── Badges ───────────────────────────────────────────────────────────── */
.badge {
  display: inline-block; padding: 2px 9px; border-radius: 20px;
  font-size: 10.5px; font-weight: 700; white-space: nowrap;
}

/* ── Target Section Cards ─────────────────────────────────────────────── */
.target-section {
  border: 1px solid #E4E7EB; border-radius: 12px;
  padding: 22px; margin-bottom: 22px; break-inside: avoid;
}
.target-header {
  display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px;
}
.target-icon  { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
.target-code  { font-size: 20px; font-weight: 800; font-family: Georgia, serif; flex-shrink: 0; }
.target-info  { flex: 1; }
.target-name  { font-size: 14px; font-weight: 700; line-height: 1.3; }
.target-desc  { font-size: 11px; color: #616E7C; margin-top: 3px; line-height: 1.5; }

/* ── T3 / 30×30 specific ──────────────────────────────────────────────── */
.t3-three-pillars {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin: 18px 0;
}
.t3-pillar {
  border-radius: 10px; padding: 18px 14px; text-align: center;
  break-inside: avoid;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.t3-pillar-value { font-size: 30px; font-weight: 900; line-height: 1; }
.t3-pillar-label { font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 5px; }
.t3-pillar-ha    { font-size: 12px; opacity: 0.75; margin-top: 3px; }
.t3-pillar-remaining { font-size: 11px; margin-top: 6px; font-weight: 600; }
.t3-indicator-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #E4E7EB; font-size: 12px; }
.t3-indicator-row:last-child { border-bottom: none; }

/* ── Data Gap Warning ─────────────────────────────────────────────────── */
.data-gap {
  display: flex; gap: 10px; align-items: flex-start;
  background: #FFFBEB; border: 1.5px solid #F6C744;
  border-radius: 8px; padding: 10px 14px; margin: 10px 0;
  font-size: 12px; color: #78350F;
}
.data-gap-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

/* ── Calculation Trace ────────────────────────────────────────────────── */
.calc-trace {
  background: #F0F7F4; border-left: 3px solid #006B3F;
  border-radius: 0 6px 6px 0; padding: 10px 14px; margin: 10px 0;
  font-size: 11px; font-family: 'Courier New', Courier, monospace;
}
.calc-title   { font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #004D2C; margin-bottom: 6px; font-family: system-ui; }
.calc-formula { color: #1A4731; font-weight: 600; margin-bottom: 6px; }
.calc-row, .calc-result { display: flex; justify-content: space-between; padding: 2px 0; border-bottom: 1px dotted #A8D5BA; }
.calc-result  { border-bottom: none; margin-top: 4px; border-top: 1px solid #A8D5BA; padding-top: 5px; }
.calc-key     { color: #4A5568; }
.calc-val     { color: #004D2C; }

/* ── Info Box ─────────────────────────────────────────────────────────── */
.info-box {
  background: #EBF8F0; border: 1px solid #A8D5BA;
  border-radius: 8px; padding: 14px 18px; margin: 12px 0;
  font-size: 12px; color: #1A4731; line-height: 1.6;
}
.info-box h4 { color: #004D2C; margin-bottom: 6px; }
.warning-box {
  background: #FFF3E0; border: 1px solid #FFB74D;
  border-radius: 8px; padding: 14px 18px; margin: 12px 0;
  font-size: 12px; color: #4A2400; line-height: 1.6;
}

/* ── Compliance Checklist ─────────────────────────────────────────────── */
.check-pass { color: #2E7D32; font-weight: 700; }
.check-fail { color: #C62828; font-weight: 700; }
.compliance-summary {
  display: flex; gap: 16px; align-items: center; margin-bottom: 16px;
}
.compliance-score {
  background: #E8F5E9; border-radius: 10px; padding: 12px 20px;
  text-align: center; min-width: 90px;
}
.compliance-score-num { font-size: 28px; font-weight: 900; color: #2E7D32; }
.compliance-score-denom { font-size: 13px; color: #2E7D32; }
.compliance-score-label { font-size: 10px; color: #4A5568; text-transform: uppercase; letter-spacing: 0.05em; }

/* ── Footer ───────────────────────────────────────────────────────────── */
footer {
  background: #003520; color: rgba(255,255,255,0.65);
  font-size: 11px; padding: 20px 36px;
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 8px;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
footer a { color: rgba(255,255,255,0.75); }
.footer-logos { display: flex; align-items: center; gap: 16px; }
.footer-logo  { height: 24px; width: auto; filter: brightness(0) invert(1); opacity: 0.6; }

/* ── Annexes ──────────────────────────────────────────────────────────── */
.annex-tag {
  display: inline-block; background: #E3F2FD; color: #1565C0;
  font-size: 9px; font-weight: 800; letter-spacing: 0.08em;
  text-transform: uppercase; padding: 2px 7px; border-radius: 4px; margin-right: 8px;
  vertical-align: middle;
}

/* ── Print media ──────────────────────────────────────────────────────── */
@media print {
  .no-print { display: none !important; }
  body { font-size: 10.5pt; }
  .cover { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .cover-stat { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .t3-pillar  { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  footer { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .kpi { break-inside: avoid; }
  .target-section { break-inside: avoid; }
  h2 { page-break-after: avoid; }
  h3 { page-break-after: avoid; }
  .page-break { page-break-before: always; }
  a { text-decoration: none; color: inherit; }
  .btn { display: none; }
}

/* ── Responsive ───────────────────────────────────────────────────────── */
@media (max-width: 700px) {
  .page { padding: 0 16px; }
  .cover { padding: 40px 24px 48px; }
  .cover-logos { top: 16px; right: 16px; gap: 10px; }
  .cover-logo-img { height: 36px; }
  .cover-coat { top: 16px; left: 16px; height: 56px; }
  .kpi-grid { grid-template-columns: repeat(2,1fr); }
  .kpi-grid-6 { grid-template-columns: repeat(2,1fr); }
  .two-col { grid-template-columns: 1fr; }
  .three-col { grid-template-columns: 1fr; }
  .t3-three-pillars { grid-template-columns: 1fr; }
  .cover-stats { flex-wrap: wrap; }
}
`;
}
