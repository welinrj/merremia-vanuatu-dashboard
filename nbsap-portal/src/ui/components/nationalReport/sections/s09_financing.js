/**
 * s09_financing.js — Financing Biodiversity
 *
 * @param {object} _ctx - report context (not currently data-driven)
 * @returns {string}
 */
import { dataGap } from '../reportUtils.js';

export function renderFinancing(_ctx) {
  return `
<!-- ══ FINANCING BIODIVERSITY ════════════════════════════════════════════════ -->
<div class="page page-break" id="s6-finance">
  <div class="section">
    <div class="section-label">Section 6</div>
    <h2>Financing Biodiversity</h2>

    <p>
      Adequate and sustained financing is essential for Vanuatu to achieve the
      Kunming-Montreal GBF targets by 2030. The KM-GBF includes Target 19, which
      calls for substantially increasing biodiversity finance from all sources —
      public, private, and international — and redirecting harmful subsidies.
    </p>

    <h3>6.1 Current Financing Landscape</h3>
    <p>
      Vanuatu's biodiversity financing comes from multiple sources, with a
      significant proportion originating from international development partners
      given the country's SIDS status and limited domestic fiscal capacity:
    </p>

    <table>
      <thead>
        <tr>
          <th>Source</th>
          <th>Mechanism</th>
          <th>Relevant Targets</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Global Environment Facility (GEF)</strong></td>
          <td>GEF grants through UNDP and direct access; biodiversity and land degradation focal areas</td>
          <td>T1, T3, T4, T6</td>
          <td>Active</td>
        </tr>
        <tr>
          <td><strong>Green Climate Fund (GCF)</strong></td>
          <td>Climate adaptation projects with biodiversity co-benefits</td>
          <td>T8, T2</td>
          <td>Active</td>
        </tr>
        <tr>
          <td><strong>UNDP / UN agencies</strong></td>
          <td>Technical assistance, project support, capacity building</td>
          <td>All</td>
          <td>Active</td>
        </tr>
        <tr>
          <td><strong>Government of Vanuatu (budget)</strong></td>
          <td>DEPC operational budget, DoFisheries, DoForestry</td>
          <td>All</td>
          <td>Active</td>
        </tr>
        <tr>
          <td><strong>Bilateral donors</strong></td>
          <td>Australia, New Zealand, Japan, EU Pacific-regional programmes</td>
          <td>Various</td>
          <td>Project-by-project</td>
        </tr>
        <tr>
          <td><strong>Community self-financing</strong></td>
          <td>Kastom land tenure provides in-kind community conservation labour; eco-tourism revenue in some CCAs</td>
          <td>T3</td>
          <td>Widespread but unquantified</td>
        </tr>
        <tr>
          <td><strong>Private sector</strong></td>
          <td>Tourism operators, fishing industry payments; emerging biodiversity credits</td>
          <td>T3, T10</td>
          <td>Nascent</td>
        </tr>
      </tbody>
    </table>

    ${dataGap(
      'Total annual biodiversity expenditure by government (USD/year) and by category (protected area management, species monitoring, IAS control, restoration). This is required for CBD Finance for Nature reporting (KM-GBF Target 19).',
      'Ministry of Finance / DEPC / Development Partners'
    )}

    <h3>6.2 Harmful Subsidies</h3>
    <p>
      KM-GBF Target 18 calls for identifying, assessing, and eliminating subsidies
      that are harmful to biodiversity by at least USD 500 billion per year globally.
      Vanuatu should identify any domestic subsidies that incentivise land clearing,
      unsustainable fishing, or chemical use that damages biodiversity.
    </p>
    ${dataGap(
      'Inventory of subsidies with potential negative biodiversity impact (e.g. agricultural inputs, land conversion incentives, fishing subsidies) and initial assessment of harm.',
      'Ministry of Finance / Ministry of Agriculture / DEPC'
    )}

    <h3>6.3 Biodiversity Finance Needs Assessment</h3>
    <p>
      To fully implement the NBSAP and achieve all nine targets by 2030, a
      systematic Biodiversity Finance Needs Assessment (BFNA) is required. This
      assessment would:
    </p>
    <ul>
      <li>Quantify the total investment needed to meet each GBF target.</li>
      <li>Map current flows against identified needs (finance gap analysis).</li>
      <li>Identify new finance mechanisms (e.g. biodiversity credits, debt-for-nature
          swaps, conservation trust funds, ocean bonds).</li>
      <li>Assess private sector engagement opportunities.</li>
    </ul>
    ${dataGap(
      'Biodiversity Finance Needs Assessment (BFNA) for Vanuatu. Consider using the BIOFIN methodology (UNDP Biodiversity Finance Initiative).',
      'DEPC, Ministry of Finance, with UNDP BIOFIN technical support'
    )}

    <h3>6.4 Resource Mobilisation Strategy</h3>
    ${dataGap(
      'National Biodiversity Resource Mobilisation Strategy — aligned to KM-GBF Target 19 and the Sharm El-Sheikh to Kunming-Montreal Resource Mobilisation framework.',
      'DEPC / Ministry of Finance'
    )}
  </div>
</div>
`;
}
