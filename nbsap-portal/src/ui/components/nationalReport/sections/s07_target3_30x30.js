/**
 * s07_target3_30x30.js — Full Target 3 / 30×30 Deep-Dive Section
 *
 * Covers:
 *  - Three-pillar display (terrestrial / marine / combined)
 *  - GBF indicator tracking (B.4.1, B.4.2, B.4.3)
 *  - Calculation traces (fully transparent)
 *  - Province breakdown with per-pillar bars
 *  - Category breakdown (CCA, MPA, PA, OECM, LMMA)
 *  - Remaining area needed to reach 30%
 *  - Management effectiveness discussion
 *  - Data gaps clearly flagged
 *
 * @param {object} ctx - report context
 * @returns {string}
 */
import { fmtHa, fmtPct, fmtN, statusFor, progressBar, dualBar, badge, dataGap, calcTrace } from '../reportUtils.js';
import { CATEGORIES } from '../../../../config/categories.js';
import ENV from '../../../../config/env.js';

const BL = ENV.nationalBaselines;

export function renderTarget3(ctx) {
  const { t3 } = ctx;

  const tPct = t3.terrestrial_pct ?? 0;
  const mPct = t3.marine_pct ?? 0;
  const cPct = t3.combined_pct ?? 0;

  const tHa  = t3.terrestrial_ha ?? 0;
  const mHa  = t3.marine_ha ?? 0;
  const cHa  = t3.combined_ha ?? 0;

  const tRem  = Math.max(0, BL.terrestrial_ha * 0.3 - tHa);
  const mRem  = Math.max(0, BL.marine_ha * 0.3 - mHa);
  const cRem  = Math.max(0, (BL.terrestrial_ha + BL.marine_ha) * 0.3 - cHa);

  const tStatus = statusFor(tPct, 30, true);
  const mStatus = statusFor(mPct, 30, true);
  const cStatus = statusFor(cPct, 30, true);

  const allMet = tPct >= 30 && mPct >= 30 && cPct >= 30;

  // Province rows with individual bars
  const provBreakdown = t3.provinceBreakdown || [];
  const provRowsHtml = provBreakdown.length
    ? provBreakdown.map(p => {
        const totHa = (p.terrestrial_ha || 0) + (p.marine_ha || 0);
        return `<tr>
          <td><strong>${p.province}</strong></td>
          <td style="text-align:right">${fmtN((p.terrestrial_ha||0).toFixed(0))}</td>
          <td style="text-align:right">${fmtN((p.marine_ha||0).toFixed(0))}</td>
          <td style="text-align:right">${fmtN(totHa.toFixed(0))}</td>
          <td style="text-align:right">${fmtN(p.features)}</td>
        </tr>`;
      }).join('')
    : `<tr><td colspan="5" style="color:#9AA5B4;font-style:italic;text-align:center;padding:12px">
         No province data — upload datasets with province attribution.
       </td></tr>`;

  // Category breakdown for T3-eligible categories
  const T3_CATS = ['CCA', 'MPA', 'PA', 'OECM', 'LMMA'];
  const catBreakdown = (t3.categoryBreakdown || []).filter(c => T3_CATS.includes(c.category));
  const otherCats    = (t3.categoryBreakdown || []).filter(c => !T3_CATS.includes(c.category) && c.features > 0);

  const catRowsHtml = catBreakdown.length
    ? catBreakdown.map(c => {
        const cfg = CATEGORIES[c.category] || {};
        return `<tr>
          <td>
            <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${cfg.color||'#888'};margin-right:6px;vertical-align:middle"></span>
            <strong>${cfg.label || c.category}</strong>
          </td>
          <td style="text-align:right">${fmtN((c.area_ha||0).toFixed(0))}</td>
          <td style="text-align:right">${fmtN(c.features)}</td>
          <td style="text-align:right">${fmtPct(c.area_ha / (BL.terrestrial_ha + BL.marine_ha) * 100)}</td>
        </tr>`;
      }).join('')
    : `<tr><td colspan="4" style="color:#9AA5B4;font-style:italic;text-align:center;padding:12px">No conservation area data — upload CCA/MPA/PA/OECM/LMMA layers.</td></tr>`;

  return `
<!-- ══ TARGET 3 — 30×30 DEEP-DIVE ══════════════════════════════════════════ -->
<div class="page page-break" id="s4-1-t3">
  <div class="section">
    <div class="section-label">Section 4.1</div>
    <h2>Target 3 — 30×30 Conservation (Full Analysis)</h2>

    <div class="info-box">
      <h4>KM-GBF Target 3</h4>
      "Ensure and enable that by 2030 at least 30 per cent of terrestrial, inland water,
      and of coastal and marine areas, especially areas of particular importance for
      biodiversity and ecosystem functions and services, are effectively conserved and
      managed through ecologically representative, well-connected and equitably governed
      systems of protected areas and other effective area-based conservation measures
      (OECMs), recognising indigenous and traditional territories where applicable."
      <br><br>
      <strong>For Vanuatu this requires three independent conditions to be met simultaneously:</strong>
      <ul style="margin-top:6px">
        <li>≥30% of national land area (1,218,900 ha) effectively conserved</li>
        <li>≥30% of EEZ marine area (66,325,100 ha) effectively conserved</li>
        <li>≥30% of combined land + sea area (67,544,000 ha) effectively conserved</li>
      </ul>
      Overall T3 status is determined by the <strong>worst-performing</strong> of the three pillars.
    </div>

    <!-- Three pillars -->
    <h3>30×30 Progress — Three Pillars</h3>
    <div class="t3-three-pillars">
      <!-- Terrestrial -->
      <div class="t3-pillar" style="background:${tStatus.bg};border:2px solid ${tStatus.color}20">
        <div class="t3-pillar-value" style="color:${tStatus.color}">${fmtPct(tPct)}</div>
        <div class="t3-pillar-label" style="color:${tStatus.color}">Terrestrial</div>
        <div class="t3-pillar-ha">${fmtHa(tHa)} of ${fmtHa(BL.terrestrial_ha)}</div>
        <div style="margin:10px 0 6px">${dualBar(tPct, tStatus.color, 30)}</div>
        <div class="t3-pillar-remaining" style="color:${tStatus.color}">
          ${tPct >= 30 ? '✓ 30% target met' : `${fmtHa(tRem)} still needed`}
        </div>
        ${badge(tStatus.label, tStatus.color, 'transparent')}
      </div>
      <!-- Marine -->
      <div class="t3-pillar" style="background:${mStatus.bg};border:2px solid ${mStatus.color}20">
        <div class="t3-pillar-value" style="color:${mStatus.color}">${fmtPct(mPct)}</div>
        <div class="t3-pillar-label" style="color:${mStatus.color}">Marine (EEZ)</div>
        <div class="t3-pillar-ha">${fmtHa(mHa)} of ${fmtHa(BL.marine_ha)}</div>
        <div style="margin:10px 0 6px">${dualBar(mPct, mStatus.color, 30)}</div>
        <div class="t3-pillar-remaining" style="color:${mStatus.color}">
          ${mPct >= 30 ? '✓ 30% target met' : `${fmtHa(mRem)} still needed`}
        </div>
        ${badge(mStatus.label, mStatus.color, 'transparent')}
      </div>
      <!-- Combined -->
      <div class="t3-pillar" style="background:${cStatus.bg};border:2px solid ${cStatus.color}20">
        <div class="t3-pillar-value" style="color:${cStatus.color}">${fmtPct(cPct)}</div>
        <div class="t3-pillar-label" style="color:${cStatus.color}">Combined</div>
        <div class="t3-pillar-ha">${fmtHa(cHa)} of ${fmtHa(BL.terrestrial_ha + BL.marine_ha)}</div>
        <div style="margin:10px 0 6px">${dualBar(cPct, cStatus.color, 30)}</div>
        <div class="t3-pillar-remaining" style="color:${cStatus.color}">
          ${cPct >= 30 ? '✓ 30% target met' : `${fmtHa(cRem)} still needed`}
        </div>
        ${badge(cStatus.label, cStatus.color, 'transparent')}
      </div>
    </div>

    <!-- GBF Indicators -->
    <h3>GBF Core Indicators</h3>
    <table>
      <thead>
        <tr>
          <th>Indicator</th>
          <th>Description</th>
          <th style="text-align:right">Value</th>
          <th>Target</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>B.4.1</strong></td>
          <td>Coverage of protected areas and OECMs — terrestrial</td>
          <td style="text-align:right"><strong>${fmtPct(tPct)}</strong></td>
          <td>≥30%</td>
          <td>${badge(tStatus.label, tStatus.color, tStatus.bg)}</td>
        </tr>
        <tr>
          <td><strong>B.4.2</strong></td>
          <td>Coverage of protected areas and OECMs — marine (EEZ)</td>
          <td style="text-align:right"><strong>${fmtPct(mPct)}</strong></td>
          <td>≥30%</td>
          <td>${badge(mStatus.label, mStatus.color, mStatus.bg)}</td>
        </tr>
        <tr>
          <td><strong>B.4.3</strong></td>
          <td>Coverage of protected areas and OECMs — combined land &amp; sea</td>
          <td style="text-align:right"><strong>${fmtPct(cPct)}</strong></td>
          <td>≥30%</td>
          <td>${badge(cStatus.label, cStatus.color, cStatus.bg)}</td>
        </tr>
      </tbody>
    </table>

    <!-- Calculation Traces -->
    <h3>Calculation Traces</h3>
    <p style="font-size:12px;color:#4A5568;margin-bottom:10px">
      All percentages are derived from dissolved (non-overlapping) areas per
      UNEP-WCMC methodology. Gross (sum-of-parts) areas may differ due to polygon
      overlaps and are reported separately for transparency.
    </p>

    ${calcTrace(
      'Terrestrial % = (dissolved terrestrial conservation area ÷ national land baseline) × 100',
      [
        ['Dissolved terrestrial area', fmtHa(tHa)],
        ['National land baseline', fmtHa(BL.terrestrial_ha)],
        ['Gross terrestrial area (pre-dissolution)', fmtHa(t3.gross_terrestrial_ha)],
      ],
      `${fmtHa(tHa)} ÷ ${fmtHa(BL.terrestrial_ha)} × 100 = ${fmtPct(tPct)}`
    )}

    ${calcTrace(
      'Marine % = (dissolved marine conservation area ÷ EEZ baseline) × 100',
      [
        ['Dissolved marine area', fmtHa(mHa)],
        ['EEZ baseline', fmtHa(BL.marine_ha)],
        ['Gross marine area (pre-dissolution)', fmtHa(t3.gross_marine_ha)],
      ],
      `${fmtHa(mHa)} ÷ ${fmtHa(BL.marine_ha)} × 100 = ${fmtPct(mPct)}`
    )}

    ${calcTrace(
      'Combined % = (dissolved total conservation area ÷ (land + EEZ baseline)) × 100',
      [
        ['Dissolved combined area', fmtHa(cHa)],
        ['Combined baseline (land + EEZ)', fmtHa(BL.terrestrial_ha + BL.marine_ha)],
      ],
      `${fmtHa(cHa)} ÷ ${fmtHa(BL.terrestrial_ha + BL.marine_ha)} × 100 = ${fmtPct(cPct)}`
    )}

    ${calcTrace(
      'Remaining area to reach 30% target',
      [
        ['Terrestrial needed', tPct >= 30 ? 'Target met ✓' : fmtHa(tRem)],
        ['Marine needed',      mPct >= 30 ? 'Target met ✓' : fmtHa(mRem)],
        ['Combined needed',    cPct >= 30 ? 'Target met ✓' : fmtHa(cRem)],
      ],
      allMet ? 'All three pillars at or above 30% — T3 target met ✓' : 'One or more pillars below 30% — see individual values'
    )}

    <!-- Province breakdown -->
    <h3>Province Breakdown</h3>
    <table>
      <thead>
        <tr>
          <th>Province</th>
          <th style="text-align:right">Terrestrial (ha)</th>
          <th style="text-align:right">Marine (ha)</th>
          <th style="text-align:right">Total (ha)</th>
          <th style="text-align:right">Records</th>
        </tr>
      </thead>
      <tbody>${provRowsHtml}</tbody>
      ${provBreakdown.length ? `<tfoot style="font-weight:700;background:#F1F3F5">
        <tr>
          <td>Total (dissolved)</td>
          <td style="text-align:right">${fmtN(tHa.toFixed(0))}</td>
          <td style="text-align:right">${fmtN(mHa.toFixed(0))}</td>
          <td style="text-align:right">${fmtN(cHa.toFixed(0))}</td>
          <td style="text-align:right">${fmtN(provBreakdown.reduce((s,p)=>s+(p.features||0),0))}</td>
        </tr>
      </tfoot>` : ''}
    </table>

    <!-- Category breakdown -->
    <h3>Conservation Category Breakdown</h3>
    <p style="font-size:12px;color:#4A5568;margin-bottom:10px">
      Only layers tagged as CCA / MPA / PA / OECM / LMMA and assigned to Target 3
      count toward the 30×30 calculation. Reference layers (EEZ boundary, admin
      boundaries) are excluded.
    </p>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th style="text-align:right">Net Area (ha)</th>
          <th style="text-align:right">Records</th>
          <th style="text-align:right">% of Total Baseline</th>
        </tr>
      </thead>
      <tbody>${catRowsHtml}</tbody>
    </table>

    ${otherCats.length ? `
    <p style="font-size:11px;color:#9AA5B4;margin-top:-8px">
      * ${otherCats.map(c => CATEGORIES[c.category]?.label || c.category).join(', ')} present
      in the dataset but excluded from the 30×30 count (not CCA/MPA/PA/OECM/LMMA category
      or not tagged T3).
    </p>` : ''}

    <!-- Management effectiveness -->
    <h3>Management Effectiveness</h3>
    <p>
      Effective conservation requires not just geographic coverage but genuine
      management capacity, monitoring, and community involvement. The KM-GBF
      emphasises that areas counted toward 30×30 must be
      <em>"effectively conserved and managed."</em>
    </p>
    ${dataGap(
      'Management Effectiveness Tracking Tool (METT) scores or equivalent for individual CCAs/MPAs/LMMAs. Without METT data, reported areas represent designated/mapped coverage, not verified management quality.',
      'DEPC Protected Area Management Team / IUCN Green List / SPREP METT assessments'
    )}
    ${dataGap(
      'Year of designation and active management plan status for each protected area.',
      'DEPC protected area register'
    )}

    <!-- Connectivity -->
    <h3>Ecological Connectivity</h3>
    <p>
      Beyond area coverage, GBF Target 3 calls for conservation areas to be
      <em>"ecologically representative and well-connected."</em>
      Connectivity analysis — identifying corridors between CCAs, landscape-scale
      linkages, and marine connectivity between LMMAs — has not yet been conducted
      in the portal.
    </p>
    ${dataGap(
      'Ecological connectivity and representativeness analysis. Consider applying MARXAN or similar prioritisation tool to identify priority areas that would maximise representativeness when added to the existing network.',
      'DEPC with support from SPREP / IUCN / WWF Pacific'
    )}

    <!-- Governance -->
    <h3>Governance and Equity</h3>
    <p>
      The majority of Vanuatu's conservation areas are
      <strong>Community Conserved Areas (CCAs)</strong> established under customary
      land tenure with community-level governance structures. This is consistent with
      the KM-GBF's recognition of "indigenous and traditional territories" and
      the CBD's Programme of Work on Protected Areas (PoWPA).
    </p>
    <ul>
      <li><strong>CCAs:</strong> Community-governed, typically on customary land.
          Governance through village councils or nakamal agreements.</li>
      <li><strong>MPAs / LMMAs:</strong> Often co-governed with the Department of
          Fisheries. Locally Managed Marine Areas (LMMAs) are community-led with
          periodic monitoring.</li>
      <li><strong>National Protected Areas:</strong> Government-designated under the
          Environment Management and Conservation Act.</li>
    </ul>
    ${dataGap(
      'Breakdown of conservation area governance type (community/government/co-managed/private) and gender-equity indicators in governance bodies.',
      'DEPC / DoFisheries / LMMA network Vanuatu'
    )}

    <!-- Overall T3 summary box -->
    <div class="${allMet ? 'info-box' : 'warning-box'}" style="margin-top:20px">
      <h4>T3 Summary Finding</h4>
      ${allMet
        ? `All three 30×30 pillars have reached ≥30%. Vanuatu meets GBF Target 3 based on
           currently uploaded spatial data. Continued monitoring, management effectiveness
           verification, and data completeness checks are recommended.`
        : `Not all three pillars have reached the 30% threshold.
           Terrestrial: <strong>${fmtPct(tPct)}</strong> (${tPct>=30?'✓ Met':'needs '+fmtHa(tRem)+' more'}),
           Marine: <strong>${fmtPct(mPct)}</strong> (${mPct>=30?'✓ Met':'needs '+fmtHa(mRem)+' more'}),
           Combined: <strong>${fmtPct(cPct)}</strong> (${cPct>=30?'✓ Met':'needs '+fmtHa(cRem)+' more'}).
           <br>Note: coverage figures reflect <em>uploaded data only</em>. Undigitised
           conservation areas may bring actual coverage above 30%. Prioritise digitisation
           of remaining CCAs, MPAs, and LMMAs.`
      }
    </div>
  </div>
</div>
`;
}
