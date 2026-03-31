/**
 * s12_futurePriorities.js — Future Priorities (2025–2030)
 *
 * @param {object} ctx - report context
 * @returns {string}
 */
import { dataGap } from '../reportUtils.js';

export function renderFuturePriorities(ctx) {
  const { t3, tMetrics } = ctx;

  // Identify targets with no data — these are immediate data collection priorities
  const noDataTargets = ['T1','T2','T3','T4','T6','T7','T8','T10','T12']
    .filter(code => !tMetrics[code]);

  return `
<!-- ══ FUTURE PRIORITIES ══════════════════════════════════════════════════════ -->
<div class="page page-break" id="s9-priorities">
  <div class="section">
    <div class="section-label">Section 9</div>
    <h2>Future Priorities (2025–2030)</h2>

    <p>
      The following priority actions are identified for the period 2025–2030 to
      accelerate Vanuatu's progress toward the KM-GBF 2030 targets. Priorities
      are drawn from the data gaps, challenges, and progress analysis in this report.
    </p>

    <h3>9.1 Immediate Priorities (2025–2026)</h3>

    <table>
      <thead>
        <tr>
          <th>Priority Action</th>
          <th>GBF Target</th>
          <th>Lead Agency</th>
          <th>Timeline</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Complete digitisation of all CCAs, MPAs, and LMMAs into the GIS portal</strong> — this is the single highest-impact action to improve T3 reporting accuracy</td>
          <td>T3</td>
          <td>DEPC / DoFisheries</td>
          <td>2025</td>
        </tr>
        <tr>
          <td><strong>Submit Updated NBSAP to CBD Secretariat</strong> aligned to KM-GBF</td>
          <td>All</td>
          <td>DEPC</td>
          <td>2025</td>
        </tr>
        <tr>
          <td><strong>Complete National IAS mapping</strong> — Merremia peltata priority species distribution map</td>
          <td>T6</td>
          <td>DEPC / Biosecurity</td>
          <td>2025–2026</td>
        </tr>
        <tr>
          <td><strong>Conduct key species distribution surveys</strong> for all 6 priority species (T4)</td>
          <td>T4</td>
          <td>DEPC / ornithologists</td>
          <td>2025–2026</td>
        </tr>
        <tr>
          <td><strong>Undertake BIOFIN biodiversity finance assessment</strong></td>
          <td>T19</td>
          <td>DEPC / MoF / UNDP</td>
          <td>2025–2026</td>
        </tr>
        <tr>
          <td><strong>METT assessments</strong> for all formally gazetted protected areas</td>
          <td>T3</td>
          <td>DEPC</td>
          <td>2026</td>
        </tr>
        ${noDataTargets.length ? noDataTargets.map(code => `
        <tr>
          <td><strong>Upload first datasets for ${code}</strong> into the NBSAP GIS portal</td>
          <td>${code}</td>
          <td>DEPC / relevant custodian</td>
          <td>2025</td>
        </tr>`).join('') : ''}
      </tbody>
    </table>

    <h3>9.2 Medium-Term Priorities (2026–2028)</h3>
    <table>
      <thead>
        <tr>
          <th>Priority Action</th>
          <th>GBF Target</th>
          <th>Lead Agency</th>
          <th>Timeline</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Establish at least 3 new or expanded CCAs / MPAs in provinces with low conservation coverage, prioritising areas identified by representativeness analysis</td>
          <td>T3</td>
          <td>DEPC / Communities</td>
          <td>2026–2028</td>
        </tr>
        <tr>
          <td>Implement national coral reef monitoring network (GCRMN protocol) across all 6 provinces</td>
          <td>T3, T8</td>
          <td>DoFisheries / SPREP</td>
          <td>2026–2027</td>
        </tr>
        <tr>
          <td>Develop national Merremia peltata integrated management strategy and begin control trials on priority islands</td>
          <td>T6</td>
          <td>DEPC / Communities</td>
          <td>2026–2028</td>
        </tr>
        <tr>
          <td>Complete national land cover change analysis (2015–2025 baseline) using satellite imagery</td>
          <td>T10</td>
          <td>VMGD / DEPC</td>
          <td>2026–2027</td>
        </tr>
        <tr>
          <td>Establish national biodiversity conservation trust fund with initial capitalisation</td>
          <td>T19</td>
          <td>MoF / DEPC</td>
          <td>2027</td>
        </tr>
        <tr>
          <td>Conduct ecological connectivity analysis to identify priority corridors</td>
          <td>T3</td>
          <td>DEPC / SPREP / IUCN</td>
          <td>2026–2027</td>
        </tr>
        <tr>
          <td>Expand NBSAP GIS portal to include real-time field data collection (community rangers)</td>
          <td>All</td>
          <td>DEPC / VSS</td>
          <td>2026–2027</td>
        </tr>
      </tbody>
    </table>

    <h3>9.3 Long-Term Priorities (2028–2030)</h3>
    <table>
      <thead>
        <tr>
          <th>Priority Action</th>
          <th>GBF Target</th>
          <th>Lead Agency</th>
          <th>Timeline</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Verify that ≥30% terrestrial and ≥30% marine coverage is <em>effectively managed</em> (METT scores ≥60%)</td>
          <td>T3</td>
          <td>DEPC</td>
          <td>2029–2030</td>
        </tr>
        <tr>
          <td>Complete CBD 7th National Report for submission to CBD Secretariat</td>
          <td>All</td>
          <td>DEPC</td>
          <td>2030</td>
        </tr>
        <tr>
          <td>Achieve restoration of ≥30% of identified degraded ecosystems (T2)</td>
          <td>T2</td>
          <td>DEPC / DoF</td>
          <td>2030</td>
        </tr>
        <tr>
          <td>Migrate NBSAP GIS portal to Vanuatu government server infrastructure for long-term national ownership</td>
          <td>All (data sovereignty)</td>
          <td>DEPC / OGCIO / VSS</td>
          <td>2028–2030</td>
        </tr>
      </tbody>
    </table>

    <h3>9.4 Targets Requiring Most Urgent Attention</h3>
    <div class="info-box">
      Based on current GIS data, the following targets require the most urgent
      attention to avoid falling behind GBF 2030 milestones:
      <ul style="margin-top:8px">
        ${t3.terrestrial_pct < 15 ? `<li><strong>T3 Terrestrial (${(t3.terrestrial_pct||0).toFixed(1)}%):</strong> Well below the 30% threshold. Prioritise CCA digitisation and new conservation area establishment.</li>` : ''}
        ${t3.marine_pct < 15      ? `<li><strong>T3 Marine (${(t3.marine_pct||0).toFixed(1)}%):</strong> Well below the 30% threshold. Accelerate LMMA and MPA mapping and establishment.</li>` : ''}
        ${noDataTargets.length    ? `<li><strong>Targets with no data (${noDataTargets.join(', ')}):</strong> Upload at least one dataset per target to enable monitoring and reporting.</li>` : ''}
        <li><strong>Data completeness:</strong> All reporting figures are contingent on complete data upload. Incomplete upload systematically understates conservation achievement.</li>
      </ul>
    </div>

    ${dataGap(
      'Formal NBSAP implementation work plan with assigned responsibilities, milestones, and budget estimates for each priority action above.',
      'DEPC NBSAP implementation team'
    )}
  </div>
</div>
`;
}
