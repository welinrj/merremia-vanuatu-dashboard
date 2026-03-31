/**
 * s08_dataMonitoring.js — Data and Monitoring Systems
 *
 * @param {object} ctx - report context
 * @returns {string}
 */
import { fmtHa, fmtN, fmtDate, dataGap, badge } from '../reportUtils.js';
import { CATEGORIES } from '../../../../config/categories.js';

export function renderDataMonitoring(ctx) {
  const { layers, dateStr } = ctx;

  const dataRows = layers
    .filter(l => !l.metadata?.isReference)
    .map(l => {
      const m = l.metadata || {};
      const catCfg = CATEGORIES[m.category] || {};
      return `<tr>
        <td>
          <strong>${m.name || '—'}</strong>
          ${m.countsToward30x30 ? ' <span style="color:#006B3F;font-weight:700" title="Counts toward 30×30">★</span>' : ''}
        </td>
        <td style="font-size:11px">${catCfg.label || m.category || '—'}</td>
        <td style="font-size:11px">${(m.targets || []).join(', ') || '—'}</td>
        <td style="font-size:11px">${m.realm || '—'}</td>
        <td style="text-align:right">${fmtN(m.featureCount)}</td>
        <td style="text-align:right">${m.totalAreaHa ? fmtN(m.totalAreaHa.toFixed(0)) : '—'}</td>
        <td style="font-size:11px">${m.custodianAgency || '—'}</td>
        <td style="font-size:11px">${m.dateUpdated || m.uploadTimestamp?.substring(0, 10) || '—'}</td>
        <td style="font-size:11px">${m.detectedCRS || '—'}</td>
        <td>
          <span class="badge" style="background:${m.approvalStatus==='Official'||m.approvalStatus==='Approved'?'#E8F5E9':'#F1F3F5'};color:${m.approvalStatus==='Official'||m.approvalStatus==='Approved'?'#2E7D32':'#616E7C'}">
            ${m.approvalStatus || 'Draft'}
          </span>
        </td>
      </tr>`;
    }).join('');

  return `
<!-- ══ DATA AND MONITORING SYSTEMS ══════════════════════════════════════════ -->
<div class="page page-break" id="s5-data">
  <div class="section">
    <div class="section-label">Section 5</div>
    <h2>Data and Monitoring Systems</h2>

    <h3>5.1 Vanuatu NBSAP GIS Data Portal</h3>
    <p>
      The primary data infrastructure for biodiversity monitoring in Vanuatu is the
      <strong>Vanuatu NBSAP GIS Data Portal</strong>, operated by DEPC. The portal
      provides:
    </p>
    <ul>
      <li><strong>Geospatial data upload:</strong> Staff can upload shapefiles, GeoJSON,
          and GeoPackage datasets with automatic CRS detection and reprojection to
          WGS84 / EPSG:4326.</li>
      <li><strong>Automated metrics calculation:</strong> Area, coverage percentages,
          and province breakdowns are computed automatically on upload using geodesic
          (turf.js) calculations.</li>
      <li><strong>CBD/GBF alignment:</strong> Datasets are tagged to one or more NBSAP
          targets, enabling automatic per-target progress tracking.</li>
      <li><strong>Polygon dissolution:</strong> UNEP-WCMC methodology applied to prevent
          double-counting in coverage calculations.</li>
      <li><strong>Export:</strong> CSV, GeoJSON, and national report (this document).</li>
      <li><strong>Real-time cross-device sync:</strong> Data stored in Firebase
          Firestore with browser-based IndexedDB fallback.</li>
    </ul>
    <div class="info-box">
      <h4>Migration note — future government server</h4>
      The portal's storage and authentication layers are modular and abstracted
      behind interface stubs (<code>storageApiStub.js</code>, <code>authApiTokenStub.js</code>).
      Migration from Firebase to a Vanuatu government server requires only implementing
      these stubs — all business logic, metrics, and this report generator remain unchanged.
    </div>

    <h3>5.2 Complete Dataset Inventory</h3>
    <p style="font-size:12px;color:#616E7C;margin-bottom:12px">
      All datasets in the system as of <strong>${dateStr}</strong>.
      Datasets marked <span style="color:#006B3F;font-weight:700">★</span> count toward the 30×30 Target 3 coverage calculation.
    </p>
    ${layers.filter(l => !l.metadata?.isReference).length === 0
      ? `<div class="data-gap"><span class="data-gap-icon">⚠</span><div><strong>DATA REQUIRED:</strong> No non-reference datasets uploaded yet. Upload GIS layers via the Data Portal tab.</div></div>`
      : `<table>
          <thead>
            <tr>
              <th>Dataset</th>
              <th>Category</th>
              <th>Target(s)</th>
              <th>Realm</th>
              <th style="text-align:right">Features</th>
              <th style="text-align:right">Area (ha)</th>
              <th>Custodian</th>
              <th>Updated</th>
              <th>CRS</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${dataRows}</tbody>
        </table>`
    }

    <h3>5.3 Monitoring Framework</h3>
    <p>
      Effective biodiversity monitoring requires a structured framework linking
      data collection, analysis, reporting, and management response. The following
      framework is recommended for Vanuatu's NBSAP monitoring cycle:
    </p>
    <table>
      <thead>
        <tr><th>Level</th><th>Indicator Type</th><th>Frequency</th><th>Responsible Agency</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>National</td>
          <td>GBF Core Indicators (B.4.1, B.4.2, B.4.3) — 30×30 coverage</td>
          <td>Annual update in GIS portal</td>
          <td>DEPC</td>
        </tr>
        <tr>
          <td>National</td>
          <td>Species distribution completeness (T4)</td>
          <td>Biennial survey</td>
          <td>DEPC, ornithologists</td>
        </tr>
        <tr>
          <td>National</td>
          <td>IAS distribution and extent (T6)</td>
          <td>Annual field survey / remote sensing</td>
          <td>DEPC, Biosecurity</td>
        </tr>
        <tr>
          <td>National</td>
          <td>Ecosystem restoration progress (T2)</td>
          <td>Annual</td>
          <td>DEPC, DoF</td>
        </tr>
        <tr>
          <td>Site</td>
          <td>CCA / MPA patrol records and condition</td>
          <td>Quarterly (per site)</td>
          <td>Community managers / DoFisheries</td>
        </tr>
        <tr>
          <td>Site</td>
          <td>METT management effectiveness assessment</td>
          <td>Every 3 years</td>
          <td>DEPC / IUCN</td>
        </tr>
        <tr>
          <td>Site</td>
          <td>Coral reef condition (GCRMN protocol)</td>
          <td>Biennial</td>
          <td>DoFisheries / SPREP</td>
        </tr>
      </tbody>
    </table>

    ${dataGap(
      'Current status of the national biodiversity monitoring system: Is a formal Monitoring, Evaluation, Reporting and Learning (MERL) framework in place? Date of last systematic national biodiversity survey.',
      'DEPC NBSAP implementation team'
    )}

    <h3>5.4 Data Gaps and Priorities</h3>
    <p>The following data gaps were identified from the current portal inventory:</p>
    <ul>
      ${layers.length === 0 ? '<li>No data uploaded — all targets lack spatial coverage data.</li>' : ''}
      ${[1,2,3,4,6,7,8,10,12].filter(n => {
        const code = `T${n}`;
        return !layers.some(l => l.metadata?.targets?.includes(code));
      }).map(n => `<li><strong>T${n}:</strong> No spatial datasets uploaded yet.</li>`).join('')}
    </ul>
    ${dataGap(
      'Remote sensing-derived land cover change dataset (T10), national coral reef survey GIS layer (T8), systematic invasive species distribution map (T6).',
      'DEPC, DoFisheries, VMGD, SPREP Remote Sensing Centre'
    )}
  </div>
</div>
`;
}
