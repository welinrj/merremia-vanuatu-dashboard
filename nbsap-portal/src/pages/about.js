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

      <!-- ── Hero ─────────────────────────────────────────── -->
      <div class="about-hero">
        <div class="about-hero-inner">
          <img src="${base}vanuatu-coat-of-arms.svg"
               alt="Republic of Vanuatu Coat of Arms"
               class="about-hero-flag"
               width="72" height="72">
          <div class="about-hero-text">
            <h1>Vanuatu NBSAP GIS Data Portal</h1>
            <p>
              The official GIS monitoring platform for Vanuatu's
              <strong style="color:rgba(255,255,255,0.95)">National Biodiversity Strategy and Action Plan (NBSAP)</strong>,
              aligned with the
              <strong style="color:rgba(255,255,255,0.95)">Kunming-Montreal Global Biodiversity Framework (GBF)</strong>.
              Tracks progress across 9 targets covering conservation, species, land use, and environmental monitoring.
            </p>
            <div class="about-hero-meta">
              <span class="about-hero-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                DEPC Vanuatu
              </span>
              <span class="about-hero-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/><path d="M2 12h20"/></svg>
                CBD / Kunming-Montreal GBF
              </span>
              <span class="about-hero-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="8"/><rect x="14" y="6" width="3" height="12"/></svg>
                9 NBSAP Targets
              </span>
              <span class="about-hero-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.636 5.636l4.243 4.243m4.242 4.242l4.243 4.243"/></svg>
                v2.0.0 &mdash; 2024&ndash;2030
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Key Facts ─────────────────────────────────────── -->
      <h3>Vanuatu at a Glance</h3>
      <div class="about-facts-grid">
        <div class="about-fact-card">
          <div class="about-fact-value">1,219,000</div>
          <div class="about-fact-label">Terrestrial Baseline (ha)</div>
        </div>
        <div class="about-fact-card">
          <div class="about-fact-value marine">66,300,000</div>
          <div class="about-fact-label">Marine EEZ Baseline (ha)</div>
        </div>
        <div class="about-fact-card">
          <div class="about-fact-value">9</div>
          <div class="about-fact-label">NBSAP Targets Tracked</div>
        </div>
        <div class="about-fact-card">
          <div class="about-fact-value">6</div>
          <div class="about-fact-label">Provinces Covered</div>
        </div>
        <div class="about-fact-card">
          <div class="about-fact-value">30%</div>
          <div class="about-fact-label">30x30 Conservation Target</div>
        </div>
        <div class="about-fact-card">
          <div class="about-fact-value">2030</div>
          <div class="about-fact-label">GBF Target Year</div>
        </div>
      </div>

      <div class="about-section-divider"></div>

      <!-- ── What This Portal Does ─────────────────────────── -->
      <h3>Portal Capabilities</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;margin-bottom:24px">
        <div class="card" style="margin:0">
          <div class="card-header" style="gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard &amp; Analytics
          </div>
          <div class="card-body" style="font-size:13px;color:var(--text-secondary);padding:14px 18px">
            Interactive maps, target-specific KPI widgets, progress bars toward GBF targets,
            and charts showing breakdowns by province, category, and realm.
          </div>
        </div>
        <div class="card" style="margin:0">
          <div class="card-header" style="gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" stroke-width="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M3 15h6"/><path d="M6 12v6"/></svg>
            Data Portal
          </div>
          <div class="card-body" style="font-size:13px;color:var(--text-secondary);padding:14px 18px">
            Layer catalogue grouped by target, with metadata compliance tracking,
            TOR compliance checks, and GeoJSON export. Fully searchable and filterable.
          </div>
        </div>
        <div class="card" style="margin:0">
          <div class="card-header" style="gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Shapefile Upload
          </div>
          <div class="card-body" style="font-size:13px;color:var(--text-secondary);padding:14px 18px">
            Automated GIS pipeline: CRS detection, WGS84 reprojection, geometry cleaning,
            field mapping, province assignment via spatial join, and geodesic area calculation.
          </div>
        </div>
        <div class="card" style="margin:0">
          <div class="card-header" style="gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Reporting &amp; Export
          </div>
          <div class="card-body" style="font-size:13px;color:var(--text-secondary);padding:14px 18px">
            Export filtered data as CSV, JSON reporting snapshots aligned with TOR requirements,
            and print-quality A4 cartographic maps for all 9 targets with provincial breakdowns.
          </div>
        </div>
      </div>

      <div class="about-section-divider"></div>

      <!-- ── GBF Target Alignment ───────────────────────────── -->
      <h3>GBF Target Alignment &mdash; NBSAP Targets Tracked</h3>
      <p style="margin-bottom:16px">
        Each portal layer is mapped to a specific Kunming-Montreal GBF target. Below is a summary
        of the nine NBSAP targets covered by this portal, their data requirements, and primary layers.
      </p>
      <div class="gbf-target-grid">

        <div class="gbf-target-card">
          <div class="gbf-target-badge" style="background:#1565C0">T1</div>
          <div class="gbf-target-body">
            <strong>Biodiversity Spatial Planning</strong>
            <p>Percentage of land and sea area covered by biodiversity-inclusive spatial plans. Includes CCAs, KBAs, MPAs, LMMAs, Spatial Plans, and Inland Water.</p>
            <div class="gbf-target-layers">Layers: Biodiversity Spatial Plans, KBAs, MPAs, LMMAs, CCAs, Inland Water</div>
          </div>
        </div>

        <div class="gbf-target-card">
          <div class="gbf-target-badge" style="background:#D84315">T2</div>
          <div class="gbf-target-body">
            <strong>Degraded Area Mapping &amp; Restoration</strong>
            <p>Mapping of degraded terrestrial, inland water, marine, and coastal ecosystems. Tracking active and planned restoration sites with restoration progress bars.</p>
            <div class="gbf-target-layers">Layers: Degraded Terrestrial Areas, Degraded Marine/Coastal, Ecosystem Restoration Sites</div>
          </div>
        </div>

        <div class="gbf-target-card">
          <div class="gbf-target-badge" style="background:#2E7D32">T3</div>
          <div class="gbf-target-body">
            <strong>30&times;30 Conservation</strong>
            <p>Conserve at least 30% of terrestrial and 30% of marine areas by 2030 through protected areas, CCAs, MPAs, LMMAs, and OECMs. Primary dashboard target.</p>
            <div class="gbf-target-layers">Layers: CCAs, MPAs, LMMAs, Protected Areas (WDPA), OECMs</div>
            <div class="gbf-target-layers" style="color:var(--primary);font-style:normal;font-weight:600">Baselines: 1,219,000 ha terrestrial | 66,300,000 ha marine</div>
          </div>
        </div>

        <div class="gbf-target-card">
          <div class="gbf-target-badge" style="background:#7E57C2">T4</div>
          <div class="gbf-target-body">
            <strong>Species &amp; Biodiversity Distribution</strong>
            <p>Distribution maps for Vanuatu&rsquo;s six significant species: Megapode, Mountain Starling, Streaked Fantail, Kingfisher, Flying Fox, and Plerandra. Includes KBA mapping.</p>
            <div class="gbf-target-layers">Layers: Significant Species Distribution, Key Biodiversity Areas</div>
          </div>
        </div>

        <div class="gbf-target-card">
          <div class="gbf-target-badge" style="background:#C62828">T6</div>
          <div class="gbf-target-body">
            <strong>Invasive Alien Species</strong>
            <p>Spatial analysis of total coverage (ha) and distribution of key IAS: <em>Merremia peltata</em> (Big Leaf), Fire Ants, African Snail, Crown-of-Thorns, Sako, and Coconut Beetle.</p>
            <div class="gbf-target-layers">Layers: Merremia peltata Detection, Other IAS</div>
          </div>
        </div>

        <div class="gbf-target-card">
          <div class="gbf-target-badge" style="background:#8E24AA">T7</div>
          <div class="gbf-target-body">
            <strong>Pesticide &amp; Herbicide Mapping</strong>
            <p>Spatial mapping of areas of pesticide and herbicide use in large-scale and small-scale commercial farming operations across Vanuatu&rsquo;s islands.</p>
            <div class="gbf-target-layers">Layers: Pesticide &amp; Herbicide Use Areas</div>
          </div>
        </div>

        <div class="gbf-target-card">
          <div class="gbf-target-badge" style="background:#00838F">T8</div>
          <div class="gbf-target-body">
            <strong>Coastal Eutrophication</strong>
            <p>Mapping of coastal eutrophication zones and nutrient-impacted marine areas around Vanuatu&rsquo;s islands, identifying areas of elevated nutrient loading.</p>
            <div class="gbf-target-layers">Layers: Coastal Eutrophication Zones</div>
          </div>
        </div>

        <div class="gbf-target-card">
          <div class="gbf-target-badge" style="background:#795548">T10</div>
          <div class="gbf-target-body">
            <strong>Agriculture &amp; Land Cover Change</strong>
            <p>Mapping of land cover change for agriculture, livestock, fisheries, and forestry across Vanuatu, tracking conversion from natural ecosystems.</p>
            <div class="gbf-target-layers">Layers: Land Cover / Land Use Change</div>
          </div>
        </div>

        <div class="gbf-target-card">
          <div class="gbf-target-badge" style="background:#388E3C">T12</div>
          <div class="gbf-target-body">
            <strong>Blue &amp; Green Spaces</strong>
            <p>Mapping of urban and peri-urban blue and green spaces &mdash; parks within provincial and municipal areas, botanical gardens, and coastal blue spaces.</p>
            <div class="gbf-target-layers">Layers: Blue &amp; Green Spaces</div>
          </div>
        </div>

      </div>

      <div class="about-section-divider"></div>

      <!-- ── Partner Organisations ──────────────────────────── -->
      <h3>Partner Organisations</h3>
      <div class="about-partner-grid">

        <div class="about-partner-card">
          <div class="partner-card-logo">
            <img src="logos/depc-logo.png" alt="DEPC logo">
          </div>
          <div class="partner-card-fullname">Department of Environmental Protection &amp; Conservation, Vanuatu</div>
          <div class="partner-card-role">Lead implementing agency &amp; data custodian</div>
        </div>

        <div class="about-partner-card">
          <div class="partner-card-logo">
            <img src="logos/cbd-logo.png" alt="CBD logo">
          </div>
          <div class="partner-card-fullname">Convention on Biological Diversity</div>
          <div class="partner-card-role">Kunming-Montreal GBF framework &amp; reporting standards</div>
        </div>

        <div class="about-partner-card">
          <div class="partner-card-logo">
            <img src="logos/vanuatu-coat-of-arms.svg" alt="Vanuatu coat of arms">
          </div>
          <div class="partner-card-fullname">Ministry of Climate Change, Meteorology, Geo-Hazards, Environment, Energy &amp; Disaster Management</div>
          <div class="partner-card-role">Policy ownership &amp; national mandate</div>
        </div>

        <div class="about-partner-card">
          <div class="partner-card-logo">
            <img src="logos/vss-logo.jpeg" alt="Vanua Spatial Solutions logo">
          </div>
          <div class="partner-card-fullname">Vanua Spatial Solutions</div>
          <div class="partner-card-role">GIS system design, development &amp; technical implementation</div>
        </div>

      </div>

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
