/**
 * s10_stakeholders.js — Stakeholder Engagement
 *
 * @param {object} _ctx - report context
 * @returns {string}
 */
import { dataGap } from '../reportUtils.js';

export function renderStakeholders(_ctx) {
  return `
<!-- ══ STAKEHOLDER ENGAGEMENT ════════════════════════════════════════════════ -->
<div class="page page-break" id="s7-stakeholders">
  <div class="section">
    <div class="section-label">Section 7</div>
    <h2>Stakeholder Engagement</h2>

    <p>
      Vanuatu's approach to biodiversity conservation is fundamentally rooted in
      community partnership. Customary land ownership (~97% of national land) means
      that effective conservation cannot be achieved without free, prior, and informed
      consent (FPIC) and active participation of custom landowners and local communities.
      The KM-GBF explicitly recognises the role of Indigenous Peoples and Local
      Communities (IPLCs) in biodiversity governance.
    </p>

    <h3>7.1 Key Stakeholder Groups</h3>
    <table>
      <thead>
        <tr>
          <th>Stakeholder Group</th>
          <th>Role in Biodiversity Conservation</th>
          <th>Engagement Mechanism</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Custom landowners &amp; communities</strong></td>
          <td>CCA establishment and governance; kastom tabu areas; LMMA management; traditional ecological knowledge holders</td>
          <td>Community consultations, nakamal meetings, FPIC processes</td>
        </tr>
        <tr>
          <td><strong>Provincial governments</strong></td>
          <td>Provincial-level land use planning, local enforcement, data collection</td>
          <td>Provincial biodiversity committee meetings, provincial officers</td>
        </tr>
        <tr>
          <td><strong>DEPC (lead agency)</strong></td>
          <td>CBD focal point, NBSAP coordination, protected area management, GIS portal</td>
          <td>Inter-agency working groups, national consultations</td>
        </tr>
        <tr>
          <td><strong>Department of Fisheries (DoFish)</strong></td>
          <td>LMMA network facilitation, marine surveys, fisheries management</td>
          <td>LMMA network coordination meetings</td>
        </tr>
        <tr>
          <td><strong>Department of Forestry (DoF)</strong></td>
          <td>Forest management, custom forest tabu, T1/T10 spatial data</td>
          <td>Forest sector working group</td>
        </tr>
        <tr>
          <td><strong>VMGD</strong></td>
          <td>Geospatial data, climate monitoring, hazard mapping</td>
          <td>Data sharing agreements, technical working groups</td>
        </tr>
        <tr>
          <td><strong>NGOs / civil society</strong></td>
          <td>CCA facilitation, species monitoring, community capacity building, advocacy</td>
          <td>National Environment Forum, project partnerships</td>
        </tr>
        <tr>
          <td><strong>Academic / research institutions</strong></td>
          <td>Biodiversity surveys, species identification, ecological research</td>
          <td>Research partnerships, data sharing</td>
        </tr>
        <tr>
          <td><strong>Private sector (tourism, agriculture, fisheries)</strong></td>
          <td>Potential funder of conservation; responsible business practices</td>
          <td>Business roundtables, voluntary commitments</td>
        </tr>
        <tr>
          <td><strong>Development partners (UNDP, GEF, bilateral)</strong></td>
          <td>Financing, technical assistance, capacity building</td>
          <td>Project steering committees, government-donor dialogue</td>
        </tr>
        <tr>
          <td><strong>Regional organisations (SPREP, SPC, FFA)</strong></td>
          <td>Regional data, capacity building, Pacific reporting</td>
          <td>Pacific regional meetings, SPREP Noumea Convention</td>
        </tr>
      </tbody>
    </table>

    <h3>7.2 Community Conservation Governance</h3>
    <p>
      Community Conserved Areas (CCAs) and Locally Managed Marine Areas (LMMAs)
      represent Vanuatu's primary community-based conservation governance model:
    </p>
    <ul>
      <li><strong>CCA establishment process:</strong> Community passes a resolution
          through the nakamal, boundaries are mapped (often with DEPC/NGO support),
          a management plan is developed, and the area is registered with DEPC.</li>
      <li><strong>LMMA model:</strong> Villages identify reef areas for rotational
          closure, conduct baseline surveys, close areas (tabu) for agreed periods,
          and re-open after stock recovery is documented.</li>
      <li><strong>Kastom tabu:</strong> Traditional prohibition systems can function as
          de-facto conservation measures and may qualify as OECMs under the KM-GBF if
          management effectiveness is documented.</li>
    </ul>

    ${dataGap(
      'Number of active CCAs, LMMAs, and kastom tabu areas; total community members participating in governance; gender breakdown of governance bodies.',
      'DEPC CCA register / DoFisheries LMMA network database'
    )}

    <h3>7.3 NBSAP Consultation Process</h3>
    ${dataGap(
      'Documentation of the NBSAP consultation process — number of provincial consultations held, total participants, IPLCs consulted, and how community input shaped the final NBSAP.',
      'DEPC NBSAP team records'
    )}

    <h3>7.4 Gender Equity and Social Inclusion</h3>
    <p>
      The KM-GBF emphasises gender equity and the rights of women, youth, and
      marginalised groups in biodiversity governance. Vanuatu's national gender
      policy recognises women's important roles in natural resource management,
      though women's formal representation in conservation governance bodies
      remains an area for improvement.
    </p>
    ${dataGap(
      'Gender-disaggregated data on participation in NBSAP consultations and CCA/LMMA governance; progress toward gender equity targets in conservation decision-making.',
      'DEPC / Vanuatu National Gender Policy / MWCFA (Ministry of Women, Children and Families)'
    )}
  </div>
</div>
`;
}
