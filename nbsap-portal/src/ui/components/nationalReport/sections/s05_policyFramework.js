/**
 * s05_policyFramework.js — Policy Framework
 * National legislation, strategies, and international commitments.
 *
 * @param {object} ctx - report context
 * @returns {string}
 */
import { dataGap } from '../reportUtils.js';

export function renderPolicyFramework(_ctx) {
  return `
<!-- ══ POLICY FRAMEWORK ══════════════════════════════════════════════════════ -->
<div class="page page-break" id="s3-policy">
  <div class="section">
    <div class="section-label">Section 3</div>
    <h2>Policy Framework</h2>

    <h3>3.1 International Commitments</h3>

    <table>
      <thead>
        <tr>
          <th>Agreement / Framework</th>
          <th>Relevant Obligations</th>
          <th>Ratified / Adopted</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Convention on Biological Diversity (CBD)</strong></td>
          <td>National biodiversity conservation, sustainable use, and benefit-sharing; submission of National Reports</td>
          <td>1993</td>
        </tr>
        <tr>
          <td><strong>Kunming-Montreal Global Biodiversity Framework (KM-GBF)</strong></td>
          <td>23 targets and 4 goals for biodiversity by 2030/2050; 30×30 (Target 3); Updated NBSAP submission</td>
          <td>COP15, December 2022</td>
        </tr>
        <tr>
          <td><strong>Nagoya Protocol on Access and Benefit-Sharing</strong></td>
          <td>Equitable sharing of benefits from genetic resources</td>
          <td>${''}
            <span style="color:#9AA5B4;font-style:italic">Verify ratification date</span>
          </td>
        </tr>
        <tr>
          <td><strong>Cartagena Protocol on Biosafety</strong></td>
          <td>Safe handling of living modified organisms</td>
          <td><span style="color:#9AA5B4;font-style:italic">Verify ratification date</span></td>
        </tr>
        <tr>
          <td><strong>Paris Agreement (UNFCCC)</strong></td>
          <td>Climate mitigation and adaptation; Nationally Determined Contributions (NDCs)</td>
          <td>2016</td>
        </tr>
        <tr>
          <td><strong>UNCLOS (UN Convention on the Law of the Sea)</strong></td>
          <td>EEZ management, marine conservation</td>
          <td>1996</td>
        </tr>
        <tr>
          <td><strong>CITES</strong></td>
          <td>Trade controls for threatened species</td>
          <td><span style="color:#9AA5B4;font-style:italic">Verify ratification date</span></td>
        </tr>
        <tr>
          <td><strong>Ramsar Convention on Wetlands</strong></td>
          <td>Wetland conservation and wise use</td>
          <td><span style="color:#9AA5B4;font-style:italic">Verify ratification status</span></td>
        </tr>
      </tbody>
    </table>

    ${dataGap(
      'Confirmed ratification dates for Nagoya Protocol, Cartagena Protocol, CITES, and Ramsar.',
      'Vanuatu Ministry of Climate Change & Environment / CBD treaty database (https://www.cbd.int/information/parties.shtml)'
    )}

    <h3>3.2 National Biodiversity Strategy and Action Plan (NBSAP)</h3>
    <p>
      The <strong>National Biodiversity Strategy and Action Plan (NBSAP)</strong> is
      Vanuatu's primary instrument for implementing the CBD at the national level.
      The current NBSAP aligns with the Kunming-Montreal GBF and identifies nine
      priority targets tracked through this reporting system (T1, T2, T3, T4, T6,
      T7, T8, T10, T12).
    </p>
    ${dataGap(
      'NBSAP version number, adoption date, and cabinet endorsement reference.',
      'DEPC / Ministry of Climate Change & Environment'
    )}

    <h3>3.3 Related National Legislation and Policies</h3>
    <table>
      <thead>
        <tr><th>Instrument</th><th>Relevance to Biodiversity</th><th>Status</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Environment Management and Conservation Act [Cap. 283]</strong></td>
          <td>Principal environmental legislation; establishment of protected areas and DEPC mandate</td>
          <td>In force</td>
        </tr>
        <tr>
          <td><strong>Forests Act [Cap. 276]</strong></td>
          <td>Forest management, harvesting licences, custom forest protection</td>
          <td>In force</td>
        </tr>
        <tr>
          <td><strong>Fisheries Act [Cap. 158]</strong></td>
          <td>Marine resource management, LMMAs, fishing zone restrictions</td>
          <td>In force</td>
        </tr>
        <tr>
          <td><strong>Land Leases Act [Cap. 163]</strong></td>
          <td>Governs leasehold land (relevant to conservation agreements on custom land)</td>
          <td>In force</td>
        </tr>
        <tr>
          <td><strong>Biosecurity Act</strong></td>
          <td>Prevention of invasive alien species introductions</td>
          <td><span style="color:#9AA5B4;font-style:italic">Verify current status</span></td>
        </tr>
        <tr>
          <td><strong>National Sustainable Development Plan (People's Plan) 2016–2030</strong></td>
          <td>National development vision; biodiversity as a cross-cutting priority</td>
          <td>In force</td>
        </tr>
        <tr>
          <td><strong>National Forest Policy 2013–2023</strong></td>
          <td>Sustainable forest management; tenure, custom tabu areas</td>
          <td><span style="color:#9AA5B4;font-style:italic">Review/replacement status unknown</span></td>
        </tr>
        <tr>
          <td><strong>National Adaptation Plan (NAP)</strong></td>
          <td>Climate-biodiversity nexus; ecosystem-based adaptation</td>
          <td><span style="color:#9AA5B4;font-style:italic">Verify current version</span></td>
        </tr>
        <tr>
          <td><strong>Nationally Determined Contribution (NDC) to UNFCCC</strong></td>
          <td>Nature-based solutions, reforestation commitments</td>
          <td><span style="color:#9AA5B4;font-style:italic">Check NDC update status (2025)</span></td>
        </tr>
      </tbody>
    </table>

    <h3>3.4 Institutional Responsibilities</h3>
    <table>
      <thead>
        <tr><th>Institution</th><th>Biodiversity Role</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>DEPC</strong> — Dept of Environmental Protection &amp; Conservation</td>
          <td>CBD focal point, NBSAP implementation, protected area management, NBSAP GIS portal</td>
        </tr>
        <tr>
          <td><strong>VMGD</strong> — Vanuatu Meteorology &amp; Geo-Hazards Dept</td>
          <td>Geospatial data, climate monitoring, disaster risk</td>
        </tr>
        <tr>
          <td><strong>DoF</strong> — Department of Forestry</td>
          <td>Forest management, custom tabu areas, T1/T10 data</td>
        </tr>
        <tr>
          <td><strong>DoFish</strong> — Department of Fisheries</td>
          <td>LMMA network, marine spatial planning, T3/T4 marine data</td>
        </tr>
        <tr>
          <td><strong>SLO / VLAG</strong> — Survey &amp; Land Records / Vanuatu Land Use Planning</td>
          <td>Land tenure, customary land, spatial planning (T1)</td>
        </tr>
        <tr>
          <td><strong>UNDP / GEF</strong></td>
          <td>Development partner — GEF-funded biodiversity projects</td>
        </tr>
        <tr>
          <td><strong>VSS</strong> — Vanuatu Spatial Solutions</td>
          <td>GIS technical support, portal development</td>
        </tr>
        <tr>
          <td><strong>SPREP / SPC</strong></td>
          <td>Regional biodiversity support, data sharing, capacity building</td>
        </tr>
        <tr>
          <td><strong>Civil society / NGOs</strong></td>
          <td>Community conservation, CCA facilitation, species monitoring</td>
        </tr>
      </tbody>
    </table>

    <h3>3.5 Alignment with the Kunming-Montreal GBF</h3>
    <p>
      The KM-GBF, adopted at COP15, provides the global biodiversity agenda through
      2030 and 2050. Vanuatu's NBSAP targets map to KM-GBF goals and targets as follows:
    </p>
    <table>
      <thead>
        <tr>
          <th>Vanuatu NBSAP Target</th>
          <th>KM-GBF Global Target</th>
          <th>GBF Goal</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>T1 — Biodiversity Spatial Planning</td><td>Target 1 (spatial planning)</td><td>B</td></tr>
        <tr><td>T2 — Ecosystem Restoration</td><td>Target 2 (30% restoration)</td><td>A</td></tr>
        <tr><td>T3 — 30×30 Conservation</td><td>Target 3 (30×30)</td><td>B</td></tr>
        <tr><td>T4 — Species Recovery</td><td>Target 4 (species extinction), Target 21 (knowledge)</td><td>A, D</td></tr>
        <tr><td>T6 — Invasive Alien Species</td><td>Target 6 (IAS)</td><td>A</td></tr>
        <tr><td>T7 — Pollution Reduction</td><td>Target 7 (pollution)</td><td>A</td></tr>
        <tr><td>T8 — Climate &amp; Ocean Impacts</td><td>Target 8 (climate)</td><td>A</td></tr>
        <tr><td>T10 — Sustainable Land Use</td><td>Target 10 (agriculture/forestry)</td><td>A</td></tr>
        <tr><td>T12 — Urban Green &amp; Blue Spaces</td><td>Target 12 (urban biodiversity)</td><td>B</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
}
