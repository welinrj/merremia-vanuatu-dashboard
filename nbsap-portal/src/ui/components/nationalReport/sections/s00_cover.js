/**
 * s00_cover.js — Cover Page
 *
 * Renders the official cover with:
 *  - Vanuatu Coat of Arms
 *  - CBD logo
 *  - Kunming-Montreal GBF logo
 *  - Report title, date, and at-a-glance statistics
 *
 * LOGO PATHS:
 *  Logos are resolved from the portal's public/logos/ directory using the
 *  base URL passed in from the orchestrator (computed from window.location).
 *  To replace placeholder logos:  drop the new file into public/logos/ and
 *  update the filename constant below — no other changes required.
 *
 * @param {object} ctx - report context (see index.js for schema)
 * @returns {string}   - HTML string
 */
export function renderCover(ctx) {
  const { dateStr, monthYear, layers, general, t3, targetsActive, checks, passed, logoBase } = ctx;

  const COAT_ARMS = `${logoBase}vanuatu-coat-of-arms.svg`;
  const CBD_LOGO  = `${logoBase}cbd-logo.png`;
  const KM_LOGO   = `${logoBase}kunming-montreal-gbf.svg`;   // replace with official file when available

  return `
<!-- ══════════════════════════════════════════════════════════════════════
     COVER PAGE
     ══════════════════════════════════════════════════════════════════════ -->
<div class="cover">
  <div class="cover-flag-top"></div>
  <div class="cover-flag-bottom"></div>
  <div class="cover-bg-circle"></div>

  <!-- Top-left: Vanuatu Coat of Arms -->
  <img class="cover-coat" src="${COAT_ARMS}" alt="Vanuatu Coat of Arms"
       onerror="this.style.display='none'">

  <!-- Top-right: partner logos -->
  <div class="cover-logos">
    <img class="cover-logo-img" src="${CBD_LOGO}" alt="Convention on Biological Diversity"
         title="Convention on Biological Diversity (CBD)"
         onerror="this.style.display='none'">
    <img class="cover-logo-svg" src="${KM_LOGO}" alt="Kunming-Montreal GBF"
         title="Kunming-Montreal Global Biodiversity Framework"
         style="height:48px;width:auto"
         onerror="this.style.display='none'">
  </div>

  <!-- Body -->
  <div style="max-width:720px">
    <div class="cover-badge">Official Government Report · DEPC · ${monthYear}</div>

    <div class="cover-title">
      Vanuatu National<br>Biodiversity Status Report
    </div>

    <div class="cover-subtitle">
      Kunming-Montreal GBF 2030 Progress &nbsp;·&nbsp; NBSAP Implementation
      &nbsp;·&nbsp; CBD 7th National Report
    </div>

    <!-- At-a-glance statistics -->
    <div class="cover-stats">
      <div class="cover-stat">
        <div class="cover-stat-value">${layers.length}</div>
        <div class="cover-stat-label">GIS Datasets</div>
      </div>
      <div class="cover-stat">
        <div class="cover-stat-value">${general.totalFeatures?.toLocaleString() || '0'}</div>
        <div class="cover-stat-label">Spatial Features</div>
      </div>
      <div class="cover-stat">
        <div class="cover-stat-value">${targetsActive}/9</div>
        <div class="cover-stat-label">Targets with Data</div>
      </div>
      <div class="cover-stat">
        <div class="cover-stat-value">${passed}/${checks.length}</div>
        <div class="cover-stat-label">CBD Checks Passed</div>
      </div>
    </div>

    <hr class="cover-divider">

    <div class="cover-meta">
      <strong>Prepared by:</strong>
        Department of Environmental Protection &amp; Conservation (DEPC),
        Republic of Vanuatu<br>
      <strong>Submitted to:</strong>
        Convention on Biological Diversity (CBD) Secretariat<br>
      <strong>Purpose:</strong>
        CBD 7th National Report &amp; Kunming-Montreal GBF 30×30 Progress Tracking<br>
      <strong>Report date:</strong> ${dateStr}<br>
      <strong>Data system:</strong>
        Vanuatu NBSAP GIS Data Portal (v1.1)<br>
      <strong>Area methodology:</strong>
        UNEP-WCMC polygon dissolution · WGS84 / EPSG:4326<br>
      <strong>National baselines:</strong>
        Terrestrial 1,218,900 ha · Marine EEZ 66,325,100 ha
    </div>
  </div>
</div>
`;
}
