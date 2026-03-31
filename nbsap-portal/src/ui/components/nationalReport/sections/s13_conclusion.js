/**
 * s13_conclusion.js — Conclusion
 *
 * @param {object} ctx - report context
 * @returns {string}
 */
import { fmtPct } from '../reportUtils.js';

export function renderConclusion(ctx) {
  const { t3, targetsActive, dateStr } = ctx;

  return `
<!-- ══ CONCLUSION ════════════════════════════════════════════════════════════ -->
<div class="page page-break" id="s10-conclusion">
  <div class="section">
    <div class="section-label">Section 10</div>
    <h2>Conclusion</h2>

    <p>
      This report presents Vanuatu's progress toward the
      Kunming-Montreal Global Biodiversity Framework 2030 targets, based on
      spatial data held in the Vanuatu NBSAP GIS Data Portal as of
      <strong>${dateStr}</strong>.
    </p>

    <p>
      Vanuatu begins this reporting period with significant biodiversity assets —
      extraordinary marine and terrestrial ecosystems, deeply embedded community
      conservation traditions (kastom), and a growing network of community conserved
      areas and locally managed marine areas. These strengths provide a strong
      foundation for achieving the KM-GBF targets.
    </p>

    <p>
      The data currently in the system shows:
    </p>
    <ul>
      <li>Terrestrial conservation coverage of <strong>${fmtPct(t3.terrestrial_pct)}</strong>
          against a 30% GBF target.</li>
      <li>Marine conservation coverage of <strong>${fmtPct(t3.marine_pct)}</strong>
          against a 30% GBF target.</li>
      <li>Combined coverage of <strong>${fmtPct(t3.combined_pct)}</strong>.</li>
      <li><strong>${targetsActive} of 9</strong> NBSAP targets have spatial data enabling
          quantitative monitoring.</li>
    </ul>

    <p>
      A critical caveat is that these figures reflect only <em>digitised and uploaded
      data</em>. The actual conservation coverage across Vanuatu's 83 islands is almost
      certainly higher, with many community conserved areas and kastom tabu zones not
      yet captured in the system. <strong>The most impactful near-term action is to
      complete the digitisation of all known conservation areas.</strong>
    </p>

    <p>
      Achieving the 2030 targets will require a whole-of-government and whole-of-society
      response — sustained community engagement, adequate financing, inter-agency
      coordination, and robust monitoring. Vanuatu's unique combination of customary
      governance and national institutions, when working in partnership, represents a
      genuinely distinctive model for Pacific island biodiversity conservation.
    </p>

    <p>
      The Vanuatu NBSAP GIS Data Portal will continue to be updated as new datasets
      are uploaded, providing real-time progress tracking toward 2030. This report
      will be regenerated with each major data update to provide the most current
      picture for decision-makers, communities, and international partners.
    </p>

    <div class="info-box" style="margin-top:20px">
      <h4>Commitment</h4>
      The Government of Vanuatu, through the Department of Environmental Protection
      and Conservation, reaffirms its commitment to the Convention on Biological
      Diversity, the Kunming-Montreal Global Biodiversity Framework, and the
      protection of Vanuatu's extraordinary natural heritage for present and
      future generations.
    </div>
  </div>
</div>
`;
}
