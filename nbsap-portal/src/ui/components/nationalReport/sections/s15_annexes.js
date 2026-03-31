/**
 * s15_annexes.js — Annexes
 *
 * Annex A: CBD Compliance Checklist
 * Annex B: Methodology
 * Annex C: GBF Core Indicator Definitions
 * Annex D: National Baselines and Baseline Sources
 * Annex E: Glossary
 *
 * @param {object} ctx - report context
 * @returns {string}
 */
import { fmtHa, fmtPct, checkIcon } from '../reportUtils.js';
import ENV from '../../../../config/env.js';

const BL = ENV.nationalBaselines;

export function renderAnnexes(ctx) {
  const { checks, passed, t3, dateStr } = ctx;

  return `
<!-- ══ ANNEXES ══════════════════════════════════════════════════════════════ -->
<div class="page page-break" id="annexes">
  <div class="section">
    <div class="section-label">Annexes</div>
    <h2>Annexes</h2>

    <!-- ── ANNEX A: CBD Compliance Checklist ───────────────────────────── -->
    <h3><span class="annex-tag">Annex A</span> CBD / GBF Compliance Self-Assessment</h3>
    <p style="font-size:12px;color:#4A5568;margin-bottom:12px">
      Self-assessment against CBD and Kunming-Montreal GBF reporting requirements
      as of <strong>${dateStr}</strong>.
      <strong>${passed}/${checks.length} checks passed.</strong>
    </p>
    <div class="compliance-summary">
      <div class="compliance-score">
        <div class="compliance-score-num">${passed}</div>
        <div class="compliance-score-denom"> / ${checks.length}</div>
        <div class="compliance-score-label">Passed</div>
      </div>
      <p style="font-size:12px;color:#4A5568">
        This self-assessment is based on data available in the GIS portal.
        A pass does not substitute for formal CBD Secretariat review.
        Checks marked ❌ represent actions required before submission of the
        7th National Report.
      </p>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width:40px">Status</th>
          <th>Requirement</th>
        </tr>
      </thead>
      <tbody>
        ${checks.map(([label, pass]) => `<tr>
          <td style="text-align:center;padding:6px 4px">${checkIcon(pass)}</td>
          <td class="${pass ? 'check-pass' : 'check-fail'}">${label}</td>
        </tr>`).join('')}
      </tbody>
    </table>

    <!-- ── ANNEX B: Methodology ─────────────────────────────────────────── -->
    <h3 style="margin-top:28px"><span class="annex-tag">Annex B</span> Area Calculation Methodology</h3>
    <div style="font-size:12px;color:#4A5568;line-height:1.8">
      <p>
        <strong>Geodesic area:</strong> All area figures use turf.js
        <code>turf.area()</code> on WGS84 (EPSG:4326) geometries. Turf uses
        the Haversine formula projected to a sphere, providing accurate geodesic
        areas for the Pacific region.
      </p>
      <p>
        <strong>Polygon dissolution (UNEP-WCMC methodology):</strong> Overlapping
        conservation polygons are dissolved (unioned) using turf.js <code>turf.union()</code>
        in a chunked tree-merge algorithm (chunk size: 100 polygons) to prevent
        double-counting. Each point on Earth's surface is counted once toward
        coverage targets. This follows the methodology used by UNEP-WCMC for the
        Protected Planet database.
      </p>
      <p>
        <strong>Gross vs. net area:</strong> Both are reported for transparency.
        Net (dissolved) area is the official figure for GBF reporting. Gross
        (sum of individual polygon areas before dissolution) is shown to indicate
        the extent of overlap in the dataset.
      </p>
      <p>
        <strong>Performance safeguard:</strong> Dissolution is skipped (falls back
        to gross area) if a dataset exceeds 500 polygons — an upper limit to
        prevent browser crashes on large land-cover datasets. A warning is shown
        when this limit is reached.
      </p>
      <p>
        <strong>Realm assignment:</strong> Each feature is assigned a realm
        (terrestrial or marine) using: (1) explicit feature property, then
        (2) layer metadata realm, then (3) category default realm. Marine
        categories (MPA, EEZ, LMMA, etc.) default to marine realm regardless
        of layer-level metadata.
      </p>
      <p>
        <strong>Province attribution:</strong> Features are assigned to provinces
        using centroid-based point-in-polygon join against Vanuatu provincial
        boundary data. Features spanning province boundaries are attributed to
        the province of their geometric centroid.
      </p>
      <p>
        <strong>30×30 eligibility:</strong> Only layers explicitly flagged as
        "counts toward 30×30" OR categorised as CCA / MPA / PA / OECM / LMMA
        and tagged with Target 3 are included in the T3 coverage calculation.
        Reference layers (EEZ boundary, administrative boundaries) are excluded.
      </p>
    </div>

    <!-- ── ANNEX C: GBF Core Indicator Definitions ──────────────────────── -->
    <h3 style="margin-top:28px"><span class="annex-tag">Annex C</span> GBF Core Indicator Definitions</h3>
    <table>
      <thead>
        <tr>
          <th>Indicator</th>
          <th>Definition</th>
          <th>Vanuatu Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>B.4.1</strong></td>
          <td>Terrestrial coverage of protected areas and other effective area-based conservation measures (OECMs) as a percentage of total terrestrial area</td>
          <td>${fmtPct(t3.terrestrial_pct)}</td>
        </tr>
        <tr>
          <td><strong>B.4.2</strong></td>
          <td>Marine coverage of protected areas and OECMs as a percentage of Exclusive Economic Zone (EEZ) area</td>
          <td>${fmtPct(t3.marine_pct)}</td>
        </tr>
        <tr>
          <td><strong>B.4.3</strong></td>
          <td>Combined (terrestrial + marine) coverage of protected areas and OECMs as a percentage of combined national land + EEZ area</td>
          <td>${fmtPct(t3.combined_pct)}</td>
        </tr>
        <tr>
          <td><strong>A.1</strong></td>
          <td>Red List Index (species extinction risk — headline indicator)</td>
          <td><em>Not yet tracked in portal</em></td>
        </tr>
        <tr>
          <td><strong>A.4</strong></td>
          <td>Mountain Green Cover Index (ecosystem condition)</td>
          <td><em>Not applicable to small island state</em></td>
        </tr>
      </tbody>
    </table>

    <!-- ── ANNEX D: National Baselines ──────────────────────────────────── -->
    <h3 style="margin-top:28px"><span class="annex-tag">Annex D</span> National Baselines</h3>
    <table>
      <thead>
        <tr><th>Baseline</th><th>Value (ha)</th><th>Value (km²)</th><th>Source</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>National land area (terrestrial baseline)</strong></td>
          <td>${fmtHa(BL.terrestrial_ha)}</td>
          <td>12,189 km²</td>
          <td>Vanuatu National Statistics Office; national boundary GIS layer</td>
        </tr>
        <tr>
          <td><strong>Exclusive Economic Zone (marine baseline)</strong></td>
          <td>${fmtHa(BL.marine_ha)}</td>
          <td>663,251 km²</td>
          <td>UNCLOS EEZ boundary; Flanders Marine Institute (VLIZ) Maritime Boundaries</td>
        </tr>
        <tr>
          <td><strong>Combined (land + EEZ)</strong></td>
          <td>${fmtHa(BL.terrestrial_ha + BL.marine_ha)}</td>
          <td>675,440 km²</td>
          <td>Sum of above</td>
        </tr>
        <tr>
          <td><strong>30% terrestrial target</strong></td>
          <td>${fmtHa(BL.terrestrial_ha * 0.3)}</td>
          <td>${(BL.terrestrial_ha * 0.3 / 100).toFixed(0)} km²</td>
          <td>30% × national land baseline</td>
        </tr>
        <tr>
          <td><strong>30% marine target</strong></td>
          <td>${fmtHa(BL.marine_ha * 0.3)}</td>
          <td>${(BL.marine_ha * 0.3 / 100).toFixed(0)} km²</td>
          <td>30% × EEZ baseline</td>
        </tr>
        <tr>
          <td><strong>30% combined target</strong></td>
          <td>${fmtHa((BL.terrestrial_ha + BL.marine_ha) * 0.3)}</td>
          <td>${((BL.terrestrial_ha + BL.marine_ha) * 0.3 / 100).toFixed(0)} km²</td>
          <td>30% × combined baseline</td>
        </tr>
      </tbody>
    </table>
    <p style="font-size:11px;color:#9AA5B4;margin-top:8px">
      Note: Any revision to these baselines (e.g. updated EEZ boundary, island reclamation)
      would require recalculation of all percentage figures in this report.
      Update baselines in <code>nbsap-portal/src/config/env.js</code> → <code>nationalBaselines</code>.
    </p>

    <!-- ── ANNEX E: Glossary ─────────────────────────────────────────────── -->
    <h3 style="margin-top:28px"><span class="annex-tag">Annex E</span> Glossary</h3>
    <table>
      <thead><tr><th style="width:150px">Term</th><th>Definition</th></tr></thead>
      <tbody>
        <tr><td><strong>CCA</strong></td><td>Community Conserved Area — a conservation area established and managed by a local community under customary governance</td></tr>
        <tr><td><strong>CBD</strong></td><td>Convention on Biological Diversity — the international treaty governing biodiversity conservation, sustainable use, and benefit-sharing</td></tr>
        <tr><td><strong>DEPC</strong></td><td>Department of Environmental Protection and Conservation — the lead government agency for biodiversity in Vanuatu</td></tr>
        <tr><td><strong>EEZ</strong></td><td>Exclusive Economic Zone — the 200 nautical mile maritime zone in which Vanuatu has sovereign rights over marine resources</td></tr>
        <tr><td><strong>FPIC</strong></td><td>Free, Prior and Informed Consent — the right of communities to be consulted and give consent before projects affecting their land/resources proceed</td></tr>
        <tr><td><strong>GBF</strong></td><td>Global Biodiversity Framework — see KM-GBF</td></tr>
        <tr><td><strong>GEF</strong></td><td>Global Environment Facility — international fund providing grants for environmental projects</td></tr>
        <tr><td><strong>IAS</strong></td><td>Invasive Alien Species — non-native species that cause harm to biodiversity, economies, or human health</td></tr>
        <tr><td><strong>KM-GBF</strong></td><td>Kunming-Montreal Global Biodiversity Framework — the international biodiversity agreement adopted at CBD COP15 (December 2022) with targets for 2030 and 2050</td></tr>
        <tr><td><strong>LMMA</strong></td><td>Locally Managed Marine Area — a community-governed marine area with rotational closures for fisheries management</td></tr>
        <tr><td><strong>METT</strong></td><td>Management Effectiveness Tracking Tool — a standardised tool to assess the management quality of protected areas</td></tr>
        <tr><td><strong>MPA</strong></td><td>Marine Protected Area — a designated area of sea managed for conservation</td></tr>
        <tr><td><strong>NBSAP</strong></td><td>National Biodiversity Strategy and Action Plan — Vanuatu's national plan for implementing the CBD</td></tr>
        <tr><td><strong>OECM</strong></td><td>Other Effective Area-based Conservation Measure — a governance approach that achieves effective conservation of biodiversity but is not a formal protected area</td></tr>
        <tr><td><strong>PA</strong></td><td>Protected Area — a clearly defined geographical space, recognised and managed through legal or other effective means, to achieve long-term conservation</td></tr>
        <tr><td><strong>30×30</strong></td><td>The KM-GBF Target 3 commitment to conserve and effectively manage at least 30% of terrestrial areas, 30% of marine/coastal areas, and 30% combined by 2030</td></tr>
        <tr><td><strong>UNEP-WCMC</strong></td><td>UN Environment Programme World Conservation Monitoring Centre — produces the Protected Planet database and develops 30×30 methodology</td></tr>
        <tr><td><strong>WGS84</strong></td><td>World Geodetic System 1984 — the standard coordinate reference system used globally; EPSG:4326</td></tr>
      </tbody>
    </table>
  </div>
</div>
`;
}
