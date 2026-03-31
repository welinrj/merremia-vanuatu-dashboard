/**
 * reportUtils.js
 * Shared formatting helpers and UI primitives for the National Report.
 * All pure functions — no side effects, no imports from app state.
 *
 * MAINTAINABILITY NOTE:
 *  When migrating to a Vanuatu government server, this file can be used
 *  unchanged as a utility module in any Node/server-side renderer.
 */

// ─── Number / unit formatters ──────────────────────────────────────────────

/** Format hectares with K/M suffix for large values */
export function fmtHa(v) {
  if (v == null || (v !== 0 && !v)) return '—';
  if (v >= 1e6) return (v / 1e6).toFixed(2) + ' M ha';
  if (v >= 1e3) return (v / 1e3).toFixed(1) + ' K ha';
  return Number(v).toFixed(0) + ' ha';
}

/** Format a plain number with locale thousands separators */
export function fmtN(v) {
  if (v == null || (v !== 0 && !v)) return '—';
  return Number(v).toLocaleString('en');
}

/** Format a percentage to 1 decimal place */
export function fmtPct(v) {
  if (v == null) return '—';
  return Number(v).toFixed(1) + '%';
}

/** Format a date string or timestamp to "DD Month YYYY" */
export function fmtDate(d) {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Status helpers ────────────────────────────────────────────────────────

/**
 * Returns { label, color, bg } for a progress value vs. threshold.
 * @param {number|null} value     - current value
 * @param {number|null} threshold - target threshold (null = presence-only target)
 * @param {boolean}     hasData   - whether any data exists for this target
 */
export function statusFor(value, threshold, hasData) {
  if (!hasData || value == null) return { label: 'No Data', color: '#9AA5B4', bg: '#F1F3F5' };
  if (threshold == null) return value > 0
    ? { label: 'Data Present', color: '#1565C0', bg: '#E3F2FD' }
    : { label: 'No Data',      color: '#9AA5B4', bg: '#F1F3F5' };
  if (value >= threshold)           return { label: 'On Track', color: '#2E7D32', bg: '#E8F5E9' };
  if (value >= threshold * 0.5)     return { label: 'At Risk',  color: '#E65100', bg: '#FFF3E0' };
  return                                   { label: 'Critical', color: '#C62828', bg: '#FFEBEE' };
}

// ─── HTML primitives ───────────────────────────────────────────────────────

/** Render a coloured progress bar */
export function progressBar(pct, color, height = 8) {
  const w = Math.min(Math.max(pct || 0, 0), 100).toFixed(1);
  return `<div style="background:#E4E7EB;border-radius:4px;height:${height}px;overflow:hidden;margin-top:4px">
    <div style="width:${w}%;background:${color};height:100%;border-radius:4px"></div>
  </div>`;
}

/** Render a dual-segment bar (achieved vs. gap) with a 30% threshold line */
export function dualBar(pct, color, threshold = 30) {
  const w = Math.min(Math.max(pct || 0, 0), 100).toFixed(1);
  const thPos = Math.min(threshold, 100);
  return `<div style="position:relative;background:#E4E7EB;border-radius:4px;height:12px;overflow:visible;margin-top:6px">
    <div style="width:${w}%;background:${color};height:12px;border-radius:4px;position:absolute;top:0;left:0"></div>
    <div style="position:absolute;top:-4px;left:${thPos}%;width:2px;height:20px;background:#1A202C;border-radius:1px" title="${threshold}% target"></div>
    <div style="position:absolute;top:-20px;left:${thPos}%;transform:translateX(-50%);font-size:9px;color:#1A202C;font-weight:700;white-space:nowrap">${threshold}%</div>
  </div>`;
}

/** Render province breakdown table rows */
export function provRows(breakdown) {
  if (!breakdown?.length) {
    return '<tr><td colspan="5" style="text-align:center;color:#9AA5B4;font-style:italic;padding:12px">No province data available — upload datasets with province attribution to populate this table.</td></tr>';
  }
  return breakdown.map(p => `
    <tr>
      <td><strong>${p.province}</strong></td>
      <td style="text-align:right">${fmtN(p.terrestrial_ha?.toFixed(0))}</td>
      <td style="text-align:right">${fmtN(p.marine_ha?.toFixed(0))}</td>
      <td style="text-align:right">${fmtN(p.total_ha?.toFixed(0))}</td>
      <td style="text-align:right">${fmtN(p.features)}</td>
    </tr>`).join('');
}

/**
 * Renders a "data gap" warning block — used wherever verified data is unavailable.
 * @param {string} message  - what data is missing
 * @param {string} [source] - recommended data source / responsible agency
 */
export function dataGap(message, source = '') {
  return `<div class="data-gap">
    <span class="data-gap-icon">⚠</span>
    <div>
      <strong>DATA REQUIRED:</strong> ${message}
      ${source ? `<br><span style="font-style:italic;font-size:11px">Recommended source: ${source}</span>` : ''}
    </div>
  </div>`;
}

/** Render a KPI card */
export function kpiCard(value, label, color = '#006B3F', subtext = '') {
  return `<div class="kpi">
    <div class="kpi-value" style="color:${color}">${value}</div>
    <div class="kpi-label">${label}</div>
    ${subtext ? `<div class="kpi-sub">${subtext}</div>` : ''}
  </div>`;
}

/** Render a status badge span */
export function badge(label, color, bg) {
  return `<span class="badge" style="background:${bg};color:${color}">${label}</span>`;
}

/** Render a section header h2 */
export function sectionH2(text, id = '') {
  return `<h2${id ? ` id="${id}"` : ''}>${text}</h2>`;
}

/** Section number prefix — auto-incremented externally, passed in as num */
export function sectionLabel(num, title) {
  return `<div class="section-label">Section ${num}</div><h2>${title}</h2>`;
}

/** Inline footnote marker — renders a superscript with title tooltip */
export function footnote(n, text) {
  return `<sup title="${text}" style="color:#006B3F;cursor:help;font-weight:700">[${n}]</sup>`;
}

/** Calculation trace block — shows formula transparently */
export function calcTrace(formula, inputs, result) {
  return `<div class="calc-trace">
    <div class="calc-title">Calculation trace</div>
    <div class="calc-formula">${formula}</div>
    ${inputs.map(([k, v]) => `<div class="calc-row"><span class="calc-key">${k}</span><span class="calc-val">${v}</span></div>`).join('')}
    <div class="calc-result"><span class="calc-key">Result</span><span class="calc-val"><strong>${result}</strong></span></div>
  </div>`;
}
