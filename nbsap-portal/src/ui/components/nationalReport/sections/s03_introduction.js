/**
 * s03_introduction.js — Introduction
 * Purpose, scope, and structure of this report.
 * Contains only verifiable facts; data gaps are flagged.
 *
 * @param {object} ctx - report context
 * @returns {string}
 */
import { dataGap } from '../reportUtils.js';

export function renderIntroduction(ctx) {
  const { dateStr, monthYear } = ctx;
  return `
<!-- ══ INTRODUCTION ══════════════════════════════════════════════════════════ -->
<div class="page page-break" id="s1-intro">
  <div class="section">
    <div class="section-label">Section 1</div>
    <h2>Introduction</h2>

    <h3>1.1 Purpose of this Report</h3>
    <p>
      This National Biodiversity Status Report presents Vanuatu's progress toward the
      goals and targets of the <strong>Kunming-Montreal Global Biodiversity Framework
      (KM-GBF)</strong>, adopted at the 15th Conference of the Parties to the Convention
      on Biological Diversity (COP15) in Montreal, Canada, in December 2022. It fulfils
      Vanuatu's obligation under Article 26 of the CBD to submit a National Report to
      the CBD Secretariat and informs the <strong>7th National Report</strong> cycle.
    </p>
    <p>
      The report draws exclusively on spatial data held in the
      <strong>Vanuatu NBSAP GIS Data Portal</strong>, operated by the Department of
      Environmental Protection and Conservation (DEPC). All metrics are computed in
      real time from uploaded datasets; no figures have been fabricated or estimated
      without a data source. Where data gaps exist, they are explicitly flagged so that
      responsible agencies can prioritise data collection.
    </p>

    <h3>1.2 Scope</h3>
    <p>This report covers:</p>
    <ul>
      <li>All nine NBSAP targets currently tracked in the GIS portal (T1, T2, T3, T4,
          T6, T7, T8, T10, T12) aligned to corresponding KM-GBF global targets.</li>
      <li>Spatial analysis across Vanuatu's six provinces: Torba, Sanma, Penama,
          Malampa, Shefa, and Tafea.</li>
      <li>The 30×30 conservation target (GBF Target 3) with full calculation traces
          and province/category breakdowns.</li>
      <li>A CBD compliance self-assessment against GBF core indicators B.4.1, B.4.2,
          and B.4.3.</li>
    </ul>
    <p>
      The reporting period is from the inception of the GIS portal through
      <strong>${dateStr}</strong>.
    </p>

    <h3>1.3 Report Structure</h3>
    <p>
      Following this introduction, the report proceeds through:
      national context (§2), policy framework (§3), per-target progress (§4),
      a dedicated 30×30 deep-dive (§4.1), data and monitoring systems (§5),
      biodiversity financing (§6), stakeholder engagement (§7), challenges (§8),
      future priorities (§9), and a conclusion (§10). References and annexes
      are provided at the end.
    </p>

    <h3>1.4 Limitations and Caveats</h3>
    <div class="warning-box">
      <strong>Important caveats for data users:</strong>
      <ul style="margin-top:8px">
        <li>Coverage percentages reflect <em>spatial data that has been uploaded to the
            portal</em>. Areas managed for conservation but not yet digitised will not
            appear in these figures and may understate true conservation coverage.</li>
        <li>Polygon dissolution (union) is applied to prevent double-counting, but
            relies on correct realm (terrestrial/marine) attribution by uploading staff.
            Mis-attributed layers may cause over- or under-counting.</li>
        <li>The national baselines (terrestrial: 1,218,900 ha; marine EEZ:
            66,325,100 ha) are drawn from national statistics. Any revision to these
            boundaries would require recalculation of all percentage figures.</li>
        <li>Province attribution uses centroid-based spatial join. Features spanning
            provincial boundaries are assigned to the province of their centroid.</li>
      </ul>
    </div>

    ${dataGap(
      'Official report submission date and CBD clearing-house submission reference number.',
      'DEPC CBD focal point / CBD CHM (https://chm.cbd.int/)'
    )}
  </div>
</div>
`;
}
