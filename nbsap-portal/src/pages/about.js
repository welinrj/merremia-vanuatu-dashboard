/**
 * About / Documentation page.
 * Professional UN-grade layout: hero, key facts, GBF target alignment,
 * partner organisations, data governance, contacts, and technical notes.
 */

/** Safe accessor for Vite's BASE_URL */
function getBaseUrl() {
  try { return (import.meta.env && import.meta.env.BASE_URL) || './'; }
  catch { return './'; }
}

export function initAbout() {
  const page = document.getElementById('page-about');
  const base = getBaseUrl();

  page.innerHTML = `
    <div class="about-layout">

      <!-- ── Page Header ───────────────────────────────────── -->
      <div class="about-page-header">
        <div class="about-page-header-left">
          <img src="${base}vanuatu-coat-of-arms.svg" alt="Vanuatu Coat of Arms" width="28" height="28" style="opacity:0.85">
          <div>
            <div class="about-page-title">Vanuatu NBSAP GIS Data Portal</div>
            <div class="about-page-subtitle">National Biodiversity Strategy &amp; Action Plan &mdash; Kunming-Montreal GBF Monitoring System</div>
          </div>
        </div>
        <div class="about-page-header-meta">
          <span class="about-meta-chip">v2.0.0</span>
          <span class="about-meta-chip">DEPC Vanuatu</span>
          <span class="about-meta-chip">GBF 2024&ndash;2030</span>
        </div>
      </div>

      <!-- ── System Specifications ─────────────────────────── -->
      <h3>System Specifications</h3>
      <div class="about-specs-grid">
        <table class="about-specs-table">
          <tbody>
            <tr><td class="spec-key">Terrestrial Baseline</td><td class="spec-val">1,219,000 ha</td></tr>
            <tr><td class="spec-key">Marine EEZ Baseline</td><td class="spec-val spec-val-marine">66,300,000 ha</td></tr>
            <tr><td class="spec-key">NBSAP Targets Tracked</td><td class="spec-val">9 targets (T1, T2, T3, T4, T6, T7, T8, T10, T12)</td></tr>
            <tr><td class="spec-key">Provinces Covered</td><td class="spec-val">6 (Torba, Sanma, Penama, Malampa, Shefa, Tafea)</td></tr>
            <tr><td class="spec-key">30×30 Conservation Goal</td><td class="spec-val">≥ 30% terrestrial &amp; marine area by 2030</td></tr>
            <tr><td class="spec-key">GBF Reporting Period</td><td class="spec-val">2024 &ndash; 2030</td></tr>
          </tbody>
        </table>
        <table class="about-specs-table">
          <tbody>
            <tr><td class="spec-key">Coordinate System</td><td class="spec-val">WGS84 / EPSG:4326</td></tr>
            <tr><td class="spec-key">Area Calculation</td><td class="spec-val">Geodesic (turf.js), union/dissolve to prevent double-counting</td></tr>
            <tr><td class="spec-key">GIS Library</td><td class="spec-val">Leaflet.js + turf.js + proj4js</td></tr>
            <tr><td class="spec-key">Data Storage</td><td class="spec-val">Google Firestore (real-time sync)</td></tr>
            <tr><td class="spec-key">Auth</td><td class="spec-val">Local passphrase (bcrypt)</td></tr>
            <tr><td class="spec-key">Portal Version</td><td class="spec-val">v2.0.0 &mdash; built for DEPC Vanuatu</td></tr>
          </tbody>
        </table>
      </div>

      <!-- ── Capabilities ──────────────────────────────────── -->
      <h3>Capabilities</h3>
      <table class="about-caps-table">
        <tbody>
          <tr>
            <td class="caps-module">Dashboard &amp; Analytics</td>
            <td>Interactive Leaflet map with per-layer toggles and ordering; target-specific KPI widgets; progress bars toward 30×30 goals; provincial breakdown tables and bar charts; category breakdown tables.</td>
          </tr>
          <tr>
            <td class="caps-module">Data Portal</td>
            <td>Layer catalogue grouped by GBF target; metadata compliance tracking and TOR compliance checks; completeness scoring; GeoJSON export; full-text search and filter by target, category, realm, status.</td>
          </tr>
          <tr>
            <td class="caps-module">Shapefile Upload</td>
            <td>7-step automated pipeline: file validation → CRS detection → WGS84 reprojection (proj4js) → geometry cleaning → field mapping → province assignment (centroid-in-polygon) → geodesic area calculation.</td>
          </tr>
          <tr>
            <td class="caps-module">Reporting &amp; Export</td>
            <td>CSV export of filtered data; JSON reporting snapshots aligned with TOR requirements; print-quality A4 cartographic maps for individual targets, by province, by species, or all 9 targets.</td>
          </tr>
        </tbody>
      </table>

      <div class="about-section-divider"></div>

      <!-- ── GBF Target Alignment ───────────────────────────── -->
      <h3>GBF Target Alignment &mdash; NBSAP Targets Tracked</h3>
      <table class="about-targets-table">
        <thead>
          <tr>
            <th style="width:52px">Target</th>
            <th style="width:200px">Name</th>
            <th>Description</th>
            <th>Primary Layers</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="about-target-badge" style="background:#1565C0">T1</span></td>
            <td><strong>Biodiversity Spatial Planning</strong></td>
            <td>% of land and sea area covered by biodiversity-inclusive spatial plans.</td>
            <td class="spec-layers">Spatial Plans, KBAs, MPAs, LMMAs, CCAs, Inland Water</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#D84315">T2</span></td>
            <td><strong>Degraded Area &amp; Restoration</strong></td>
            <td>Mapping of degraded terrestrial, inland water, marine, and coastal ecosystems; active and planned restoration sites.</td>
            <td class="spec-layers">Degraded Terrestrial, Degraded Marine/Coastal, Restoration Sites</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#2E7D32">T3</span></td>
            <td><strong>30×30 Conservation</strong></td>
            <td>Conserve ≥ 30% terrestrial and marine areas by 2030 via PAs, CCAs, MPAs, LMMAs, OECMs. Primary dashboard target. Baselines: 1,219,000 ha terrestrial / 66,300,000 ha marine.</td>
            <td class="spec-layers">CCAs, MPAs, LMMAs, Protected Areas (WDPA), OECMs</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#7E57C2">T4</span></td>
            <td><strong>Species Distribution</strong></td>
            <td>Distribution maps for 6 significant species: Megapode, Mountain Starling, Streaked Fantail, Kingfisher, Flying Fox, Plerandra.</td>
            <td class="spec-layers">Significant Species Distribution, Key Biodiversity Areas</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#C62828">T6</span></td>
            <td><strong>Invasive Alien Species</strong></td>
            <td>Coverage and distribution of key IAS: <em>Merremia peltata</em>, Fire Ants, African Snail, Crown-of-Thorns, Sako, Coconut Beetle.</td>
            <td class="spec-layers">Merremia peltata Detection, Other IAS</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#8E24AA">T7</span></td>
            <td><strong>Pesticide &amp; Herbicide</strong></td>
            <td>Spatial mapping of pesticide and herbicide use in large-scale and small-scale commercial farming across Vanuatu.</td>
            <td class="spec-layers">Pesticide &amp; Herbicide Use Areas</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#00838F">T8</span></td>
            <td><strong>Coastal Eutrophication</strong></td>
            <td>Mapping of coastal eutrophication zones and nutrient-impacted marine areas around Vanuatu's islands.</td>
            <td class="spec-layers">Coastal Eutrophication Zones</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#795548">T10</span></td>
            <td><strong>Agriculture &amp; Land Cover</strong></td>
            <td>Land cover change for agriculture, livestock, fisheries, and forestry; tracking conversion from natural ecosystems.</td>
            <td class="spec-layers">Land Cover / Land Use Change</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#388E3C">T12</span></td>
            <td><strong>Blue &amp; Green Spaces</strong></td>
            <td>Urban and peri-urban blue and green spaces — parks, botanical gardens, and coastal blue spaces in provincial/municipal areas.</td>
            <td class="spec-layers">Blue &amp; Green Spaces</td>
          </tr>
        </tbody>
      </table>

      <div class="about-section-divider"></div>

      <!-- ── Partner Organisations ──────────────────────────── -->
      <h3>Partner Organisations</h3>
      <table class="about-attribution-table">
        <thead>
          <tr><th>Organisation</th><th>Role</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>DEPC Vanuatu</strong> — Dept. of Environmental Protection &amp; Conservation</td>
            <td>Lead implementing agency &amp; data custodian</td>
          </tr>
          <tr>
            <td><strong>CBD</strong> — Convention on Biological Diversity</td>
            <td>Kunming-Montreal GBF framework &amp; reporting standards</td>
          </tr>
          <tr>
            <td><strong>Ministry of Climate Change</strong>, Meteorology, Geo-Hazards, Environment, Energy &amp; Disaster Management</td>
            <td>Policy ownership &amp; national mandate</td>
          </tr>
          <tr>
            <td><strong>Vanua Spatial Solutions</strong></td>
            <td>GIS system design, development &amp; technical implementation</td>
          </tr>
        </tbody>
      </table>

      <div class="about-section-divider"></div>

      <!-- ── Data Governance ────────────────────────────────── -->
      <h3>Data Governance &amp; Attribution</h3>
      <div class="about-governance-box">
        <h4>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Data Use Requirements
        </h4>
        <ul>
          <li>All data displayed in this portal is the property of the Department of Environmental Protection &amp; Conservation (DEPC), Republic of Vanuatu, unless otherwise stated.</li>
          <li>Users of this portal must cite: <em>"Vanuatu NBSAP GIS Portal, DEPC Vanuatu, [year]"</em> in any publications, reports, or presentations that use data from this system.</li>
          <li>Data classified as <strong>Restricted</strong> must not be shared publicly without prior written approval from DEPC.</li>
          <li>All spatial analyses use geodesic methods with WGS84 (EPSG:4326) coordinates to ensure internationally comparable area measurements.</li>
          <li>For data download requests, contact the DEPC Data Management team (details below).</li>
        </ul>
      </div>

      <div class="about-disclaimer-box">
        <h4>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Data Quality Notice
        </h4>
        <p>
          Spatial data in this portal represents best-available information at the time of upload and may not reflect the most current field conditions.
          Area calculations are computed using union/dissolve methodology to prevent double-counting of overlapping polygons.
          Users should validate data independently before using it for legal or policy decisions.
          Baseline figures (terrestrial: 1,219,000 ha; marine EEZ: 66,300,000 ha) are derived from nationally agreed spatial datasets.
        </p>
      </div>

      <div class="about-section-divider"></div>

      <!-- ── How to Use ─────────────────────────────────────── -->
      <h3>How to Use This Portal</h3>
      <ol style="margin-left:20px;margin-bottom:16px;line-height:2">
        <li>Open the <strong style="color:var(--text)">Dashboard</strong> tab to explore data on an interactive map with legend controls</li>
        <li>Apply <strong style="color:var(--text)">filters</strong> by target, province, category, realm, or year from the sidebar</li>
        <li>Select a <strong style="color:var(--text)">single target</strong> to see target-specific KPIs, progress bars toward GBF targets, provincial breakdown, and category analysis</li>
        <li>For <strong style="color:var(--text)">Target 3</strong>, view 30x30 progress bars showing % of terrestrial and marine baselines conserved toward the 30% GBF goal</li>
        <li>For <strong style="color:var(--text)">Target 6</strong>, view invasive species detection breakdown with Merremia-specific metrics and provincial spread</li>
        <li>Use <strong style="color:var(--text)">Export</strong> buttons to download data as CSV, JSON reporting snapshots, or PNG map screenshots for reports</li>
        <li>Use <strong style="color:var(--text)">Print Maps</strong> to generate standardised A4 cartographic maps for individual targets, by province, or all 9 targets at once</li>
        <li>Admin users can <strong style="color:var(--text)">upload</strong> new shapefile layers and manage metadata via the Admin tab</li>
      </ol>

      <div class="about-section-divider"></div>

      <!-- ── Upload & Analysis Pipeline ────────────────────── -->
      <h3>Automated GIS Processing Pipeline</h3>
      <p style="margin-bottom:12px">When a shapefile is uploaded, the portal runs a fully automated 7-step GIS pipeline:</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px;margin-bottom:20px">
        ${[
          ['1. Validation', 'File format, geometry type, and attribute completeness checks'],
          ['2. CRS Detection', 'Identifies coordinate reference system from .prj file'],
          ['3. Reprojection', 'Converts to WGS84 (EPSG:4326) using proj4js if needed'],
          ['4. Geometry Cleaning', 'Fixes invalid polygons, removes slivers and self-intersections'],
          ['5. Field Mapping', 'Maps attributes to standard names (name, type, province, area_ha)'],
          ['6. Province Assignment', 'Centroid-in-polygon spatial join against Vanuatu province boundaries'],
          ['7. Area Calculation', 'Geodesic area computation using turf.area() in hectares (ha)'],
        ].map(([step, desc], i) => `
          <div style="display:flex;gap:10px;padding:10px 12px;background:var(--bg-white);border:1px solid var(--border);border-radius:var(--radius-sm)">
            <div style="width:28px;height:28px;background:var(--primary);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0">${i + 1}</div>
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--text)">${step}</div>
              <div style="font-size:11px;color:var(--text-secondary)">${desc}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="about-section-divider"></div>

      <!-- ── Contact ────────────────────────────────────────── -->
      <h3>Contact &amp; Data Requests</h3>
      <div class="about-contact-grid">
        <div class="about-contact-card">
          <div class="contact-card-name">Rolenas Baereleo</div>
          <div class="contact-card-title">Manager BioDiversity &amp; Conservation, DEPC</div>
          <a href="mailto:rbaereleo@vanuatu.gov.vu" class="contact-card-email">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            rbaereleo@vanuatu.gov.vu
          </a>
        </div>
        <div class="about-contact-card">
          <div class="contact-card-name">Dean Wotlolan</div>
          <div class="contact-card-title">Senior Biodiversity &amp; Conservation Officer, DEPC</div>
          <a href="mailto:dlaunder@vanuatu.gov.vu" class="contact-card-email">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            dlaunder@vanuatu.gov.vu
          </a>
        </div>
        <div class="about-contact-card">
          <div class="contact-card-name">DEPC Vanuatu</div>
          <div class="contact-card-title">Department of Environmental Protection &amp; Conservation</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">Port Vila, Republic of Vanuatu</div>
        </div>
      </div>

      <div class="about-section-divider"></div>

      <!-- ── Links & Resources ──────────────────────────────── -->
      <h3>Links &amp; Resources</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px">
        ${[
          ['CBD GBF Targets', 'https://www.cbd.int/gbf/targets/'],
          ['Protected Planet / WDPA', 'https://www.protectedplanet.net/'],
          ['Key Biodiversity Areas', 'https://www.keybiodiversityareas.org/'],
          ['LMMA Network', 'https://lmmanetwork.org/'],
          ['UNDP Biodiversity', 'https://www.undp.org/topics/nature-environment/biodiversity'],
          ['Vanuatu DEPC', 'https://depc.gov.vu/'],
        ].map(([label, url]) => `
          <a href="${url}" target="_blank" rel="noopener noreferrer"
             style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;
                    padding:7px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);
                    background:var(--bg-white);color:var(--secondary);text-decoration:none;
                    transition:all 0.15s ease">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            ${label}
          </a>
        `).join('')}
      </div>

      <!-- ── Version ────────────────────────────────────────── -->
      <div style="padding:12px 16px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--border);font-size:12px;color:var(--text-secondary);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
        <span>
          <strong style="color:var(--text)">Version:</strong> v2.0.0 &mdash;
          Built for DEPC Vanuatu.
          GBF reporting period: 2024&ndash;2030.
        </span>
        <span style="font-size:11px;color:var(--text-tertiary)">
          Developed by <strong style="color:var(--text-secondary)">Vanua Spatial Solutions</strong>
        </span>
      </div>

    </div>
  `;
}
