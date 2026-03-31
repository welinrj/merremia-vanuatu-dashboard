/**
 * s01_toc.js — Table of Contents
 * Auto-generated from the fixed section list.
 *
 * @returns {string} - HTML string
 */
export function renderTOC() {
  const sections = [
    { num: '—',  title: 'Executive Summary' },
    { num: '1',  title: 'Introduction' },
    { num: '2',  title: 'National Context' },
    { num: '3',  title: 'Policy Framework' },
    { num: '4',  title: 'Progress Toward GBF 2030 Targets' },
    { num: '4.1',title: 'Target 3 — 30×30 Conservation (Full Analysis)' },
    { num: '5',  title: 'Data and Monitoring Systems' },
    { num: '6',  title: 'Financing Biodiversity' },
    { num: '7',  title: 'Stakeholder Engagement' },
    { num: '8',  title: 'Challenges and Barriers' },
    { num: '9',  title: 'Future Priorities (2025–2030)' },
    { num: '10', title: 'Conclusion' },
    { num: '—',  title: 'References' },
    { num: '—',  title: 'Annexes' },
  ];

  return `
<div class="page page-break">
  <div class="section">
    <h2>Table of Contents</h2>
    <div class="toc">
      ${sections.map(s => `
        <div class="toc-item">
          <span class="toc-num">${s.num}</span>
          <span class="toc-title">${s.title}</span>
        </div>`).join('')}
    </div>
    <div class="info-box" style="margin-top:16px">
      <h4>About this report</h4>
      This report is generated automatically from spatial data uploaded to the
      Vanuatu NBSAP GIS Data Portal. Sections marked
      <span style="background:#FFFBEB;border:1px solid #F6C744;border-radius:4px;padding:1px 6px;font-size:11px;color:#78350F">⚠ DATA REQUIRED</span>
      indicate where verified data has not yet been entered into the system.
      All area calculations use geodesic methodology (turf.js) with UNEP-WCMC
      polygon dissolution to prevent double-counting.
      Calculations are traced in-line for full transparency.
    </div>
  </div>
</div>
`;
}
