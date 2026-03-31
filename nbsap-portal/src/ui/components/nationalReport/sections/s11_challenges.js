/**
 * s11_challenges.js — Challenges and Barriers
 *
 * @param {object} _ctx - report context
 * @returns {string}
 */
import { dataGap } from '../reportUtils.js';

export function renderChallenges(_ctx) {
  return `
<!-- ══ CHALLENGES AND BARRIERS ═══════════════════════════════════════════════ -->
<div class="page page-break" id="s8-challenges">
  <div class="section">
    <div class="section-label">Section 8</div>
    <h2>Challenges and Barriers</h2>

    <p>
      Implementing the NBSAP and achieving GBF 2030 targets presents significant
      challenges for Vanuatu. These are documented here not as reasons to delay
      action, but as barriers that require targeted solutions and additional support.
    </p>

    <h3>8.1 Capacity and Human Resources</h3>
    <div class="two-col">
      <div>
        <h4>Challenge</h4>
        <ul>
          <li>Limited number of trained biodiversity scientists, GIS specialists, and conservation managers within government.</li>
          <li>High staff turnover in technical roles.</li>
          <li>Community conservation coordinators are often volunteers with limited support.</li>
          <li>Limited capacity for systematic species identification and monitoring.</li>
        </ul>
      </div>
      <div>
        <h4>Required Actions</h4>
        <ul>
          <li>Invest in in-country training and university-level biodiversity programmes.</li>
          <li>Develop clear career pathways for environmental professionals.</li>
          <li>Strengthen community ranger programmes with structured training and stipends.</li>
          <li>Engage regional institutions (USP, SPC) for capacity support.</li>
        </ul>
      </div>
    </div>

    <h3>8.2 Financing Constraints</h3>
    <div class="two-col">
      <div>
        <h4>Challenge</h4>
        <ul>
          <li>Domestic biodiversity budget is insufficient for national-scale conservation implementation.</li>
          <li>Dependence on project-based international funding creates discontinuity.</li>
          <li>Economic pressures on communities may conflict with conservation goals.</li>
          <li>Limited domestic mechanisms for sustainable conservation finance.</li>
        </ul>
      </div>
      <div>
        <h4>Required Actions</h4>
        <ul>
          <li>Complete Biodiversity Finance Needs Assessment (BIOFIN methodology).</li>
          <li>Explore biodiversity credits, eco-tourism revenue sharing, and debt-for-nature mechanisms.</li>
          <li>Establish a national biodiversity conservation trust fund.</li>
          <li>Increase domestic budget allocation to DEPC.</li>
        </ul>
      </div>
    </div>

    <h3>8.3 Invasive Alien Species (Merremia peltata and others)</h3>
    <div class="two-col">
      <div>
        <h4>Challenge</h4>
        <ul>
          <li>Merremia peltata (Big Leaf Vine) is spreading rapidly across degraded and secondary forest across multiple islands, smothering native vegetation.</li>
          <li>Crown-of-thorns starfish outbreaks periodically devastate coral reefs.</li>
          <li>Biosecurity capacity at ports of entry is limited.</li>
          <li>Control programmes are costly and require sustained effort.</li>
        </ul>
      </div>
      <div>
        <h4>Required Actions</h4>
        <ul>
          <li>Complete national IAS mapping (T6 dataset) and distribution monitoring.</li>
          <li>Implement integrated Merremia management strategy (mechanical, biological, community-based).</li>
          <li>Strengthen port biosecurity with dedicated IAS screening protocols.</li>
          <li>Establish early warning system for new IAS detections.</li>
        </ul>
      </div>
    </div>

    <h3>8.4 Climate Change Impacts</h3>
    <div class="two-col">
      <div>
        <h4>Challenge</h4>
        <ul>
          <li>Increasing cyclone intensity damages terrestrial and marine ecosystems faster than they can recover.</li>
          <li>Ocean warming and acidification bleach coral reefs and reduce marine productivity.</li>
          <li>Sea-level rise threatens low-lying coastal habitats, including mangroves and nesting beaches.</li>
          <li>Shifting rainfall patterns affect forest composition and freshwater systems.</li>
        </ul>
      </div>
      <div>
        <h4>Required Actions</h4>
        <ul>
          <li>Integrate biodiversity considerations into national climate adaptation plans.</li>
          <li>Designate climate refugia as priority areas for conservation.</li>
          <li>Establish coral reef resilience monitoring network.</li>
          <li>Implement ecosystem-based adaptation (EbA) across all provinces.</li>
        </ul>
      </div>
    </div>

    <h3>8.5 Data and Information Gaps</h3>
    <div class="two-col">
      <div>
        <h4>Challenge</h4>
        <ul>
          <li>Baseline biodiversity surveys are incomplete for many islands and taxonomic groups.</li>
          <li>Conservation areas are not fully digitised — actual conservation coverage may be higher than reported but cannot be counted without spatial data.</li>
          <li>No standardised biodiversity monitoring protocol is in place nationally.</li>
          <li>Limited remote sensing analysis for land cover change tracking.</li>
        </ul>
      </div>
      <div>
        <h4>Required Actions</h4>
        <ul>
          <li>Prioritise digitisation of all known CCAs and LMMAs into the GIS portal.</li>
          <li>Establish national biodiversity baseline database.</li>
          <li>Implement standardised monitoring protocols across all provinces.</li>
          <li>Partner with VMGD and international agencies for regular land cover change analysis.</li>
        </ul>
      </div>
    </div>

    <h3>8.6 Land Tenure and Customary Rights</h3>
    <div class="two-col">
      <div>
        <h4>Challenge</h4>
        <ul>
          <li>Conservation agreements on customary land require ongoing negotiation and can be revoked if community circumstances change.</li>
          <li>Land disputes (including lease disputes) can undermine long-term conservation commitments.</li>
          <li>Integrating kastom governance systems with formal legal frameworks remains complex.</li>
        </ul>
      </div>
      <div>
        <h4>Required Actions</h4>
        <ul>
          <li>Develop formal legal mechanisms for long-term CCA agreements that respect customary rights.</li>
          <li>Ensure communities derive tangible benefits from conservation to sustain commitment.</li>
          <li>Integrate kastom tabu recognition into the protected area legal framework.</li>
        </ul>
      </div>
    </div>

    ${dataGap(
      'Formal risk register for NBSAP implementation — probability and impact ratings for each identified challenge, and mitigation measures with assigned owners and timelines.',
      'DEPC NBSAP implementation team'
    )}
  </div>
</div>
`;
}
