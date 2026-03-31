/**
 * s14_references.js — References
 *
 * @returns {string}
 */
export function renderReferences() {
  const refs = [
    {
      id: 'CBD2022',
      text: 'Convention on Biological Diversity (2022). Kunming-Montreal Global Biodiversity Framework. CBD/COP/DEC/15/4. Montreal: CBD Secretariat.',
      url: 'https://www.cbd.int/gbf/'
    },
    {
      id: 'CBD2023',
      text: 'Convention on Biological Diversity (2023). Monitoring Framework for the Kunming-Montreal Global Biodiversity Framework. CBD/COP/DEC/15/5. Montreal: CBD Secretariat.',
      url: 'https://www.cbd.int/gbf/monitoring/'
    },
    {
      id: 'VNSO2020',
      text: 'Vanuatu National Statistics Office (2020). 2020 Vanuatu National Population and Housing Census. Port Vila: Government of Vanuatu.',
      url: 'https://vnso.gov.vu'
    },
    {
      id: 'DEPC_ENV',
      text: 'Government of Vanuatu (2002). Environment Management and Conservation Act [Cap. 283]. Port Vila: Government of Vanuatu.',
      url: null
    },
    {
      id: 'VAN_SDPF',
      text: 'Government of Vanuatu (2016). National Sustainable Development Plan 2016–2030 ("People\'s Plan"). Port Vila: Department of Strategic Policy, Planning and Aid Coordination.',
      url: null
    },
    {
      id: 'SPREP2016',
      text: 'SPREP (2016). Pacific Islands Regional Ocean Policy and Framework for Integrated Strategic Action. Apia: Secretariat of the Pacific Regional Environment Programme.',
      url: 'https://www.sprep.org'
    },
    {
      id: 'IUCN_PA',
      text: 'IUCN (2019). Protected Area Categories. Gland: IUCN.',
      url: 'https://www.iucn.org/theme/protected-areas/about/protected-area-categories'
    },
    {
      id: 'WCMC2021',
      text: 'UNEP-WCMC and IUCN (2021). Protected Planet Report 2020. Cambridge / Gland: UNEP-WCMC and IUCN.',
      url: 'https://livereport.protectedplanet.net/'
    },
    {
      id: 'TURF_JS',
      text: 'Turfjs contributors (2024). Turf.js — Advanced geospatial analysis for browsers and Node.js. Version 7.x.',
      url: 'https://turfjs.org'
    },
    {
      id: 'BIOFIN',
      text: 'UNDP (2020). BIOFIN Workbook: Mobilizing Resources for Biodiversity and the SDGs. New York: United Nations Development Programme.',
      url: 'https://www.biofin.org'
    },
    {
      id: 'GBF_IND',
      text: 'CBD (2023). Headline, Component and Complementary Indicators for the Kunming-Montreal Global Biodiversity Framework. CBD/SBSTTA/25/L.2. Montreal: CBD Secretariat.',
      url: 'https://www.cbd.int/gbf/monitoring/'
    },
    {
      id: 'METT',
      text: 'Stolton, S., Hockings, M., Dudley, N., MacKinnon, K. and Whitten, T. (2003). Management Effectiveness Tracking Tool: Reporting Progress at Protected Area Sites. Washington DC: World Bank/WWF.',
      url: null
    },
    {
      id: 'VAN_NBSAP',
      text: 'Government of Vanuatu / DEPC. Vanuatu National Biodiversity Strategy and Action Plan (NBSAP). Port Vila: Department of Environmental Protection and Conservation.',
      url: 'https://www.cbd.int/nbsap/targets/vanuatu'
    },
  ];

  return `
<!-- ══ REFERENCES ════════════════════════════════════════════════════════════ -->
<div class="page page-break" id="references">
  <div class="section">
    <div class="section-label">References</div>
    <h2>References</h2>
    <p style="font-size:12px;color:#4A5568;margin-bottom:16px">
      All references are to publicly available sources. URLs were verified at the time
      of portal development. Link availability is not guaranteed.
    </p>
    <table>
      <thead>
        <tr>
          <th style="width:90px">ID</th>
          <th>Citation</th>
        </tr>
      </thead>
      <tbody>
        ${refs.map(r => `<tr>
          <td style="font-weight:700;font-family:monospace;font-size:11px">[${r.id}]</td>
          <td style="font-size:12px">
            ${r.text}
            ${r.url ? `<br><a href="${r.url}" style="font-size:10px">${r.url}</a>` : ''}
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>
`;
}
