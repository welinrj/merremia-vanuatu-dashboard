/**
 * s00_cover.js — Cover Page
 *
 * Renders the official cover with:
 *  - Vanuatu Coat of Arms
 *  - CBD logo
 *  - Kunming-Montreal GBF logo
 *  - Report title, date, and at-a-glance statistics
 *  - Geometric abstract watermarks and decorative patterns
 *
 * @param {object} ctx - report context (see index.js for schema)
 * @returns {string}   - HTML string
 */
export function renderCover(ctx) {
  const { dateStr, monthYear, layers, general, t3, targetsActive, checks, passed, logoBase } = ctx;

  const COAT_ARMS = `${logoBase}vanuatu-coat-of-arms.svg`;
  const CBD_LOGO  = `${logoBase}cbd-logo.png`;
  const KM_LOGO   = `${logoBase}kunming-montreal-gbf.svg`;

  return `
<!-- ══════════════════════════════════════════════════════════════════════
     COVER PAGE
     ══════════════════════════════════════════════════════════════════════ -->
<div class="cover">
  <!-- Vanuatu flag stripes -->
  <div class="cover-flag-top"></div>
  <div class="cover-flag-bottom"></div>

  <!-- ── Geometric watermark: full-cover hexagonal grid ─────────────── -->
  <svg class="cover-wm-hex" viewBox="0 0 900 1100" preserveAspectRatio="xMidYMid slice"
       xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <pattern id="hexPat" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
        <polygon points="30,1 58,16 58,46 30,61 2,46 2,16"
                 fill="none" stroke="white" stroke-width="0.7"/>
        <polygon points="30,13 46,22 46,44 30,53 14,44 14,22"
                 fill="none" stroke="white" stroke-width="0.25"/>
      </pattern>
    </defs>
    <rect width="900" height="1100" fill="url(#hexPat)" opacity="0.09"/>
  </svg>

  <!-- ── Geometric watermark: botanical leaf cluster (right side) ────── -->
  <svg class="cover-wm-leaf" viewBox="0 0 420 680" xmlns="http://www.w3.org/2000/svg"
       aria-hidden="true">
    <!-- Central stem -->
    <path d="M210,660 C205,560 195,460 200,300 C202,200 220,120 240,40"
          stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Left fronds -->
    <path d="M205,580 C175,555 130,548 80,540" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="62" cy="537" rx="52" ry="14" fill="white" transform="rotate(-8,62,537)"/>
    <path d="M203,510 C168,480 118,470 65,460" stroke="white" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <ellipse cx="47" cy="457" rx="47" ry="13" fill="white" transform="rotate(-12,47,457)"/>
    <path d="M201,440 C172,408 128,395 78,385" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="60" cy="382" rx="43" ry="12" fill="white" transform="rotate(-15,60,382)"/>
    <path d="M200,370 C176,338 140,322 96,312" stroke="white" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="80" cy="309" rx="38" ry="11" fill="white" transform="rotate(-18,80,309)"/>
    <path d="M200,300 C180,268 152,252 116,244" stroke="white" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <ellipse cx="102" cy="241" rx="32" ry="10" fill="white" transform="rotate(-22,102,241)"/>
    <!-- Right fronds -->
    <path d="M210,548 C242,522 290,514 342,506" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="360" cy="503" rx="52" ry="14" fill="white" transform="rotate(8,360,503)"/>
    <path d="M208,478 C244,448 296,436 350,428" stroke="white" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <ellipse cx="368" cy="425" rx="47" ry="13" fill="white" transform="rotate(12,368,425)"/>
    <path d="M206,408 C244,376 294,362 346,354" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="363" cy="351" rx="43" ry="12" fill="white" transform="rotate(15,363,351)"/>
    <path d="M204,338 C244,308 292,292 342,284" stroke="white" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="358" cy="281" rx="38" ry="11" fill="white" transform="rotate(18,358,281)"/>
    <path d="M203,268 C240,238 285,224 330,217" stroke="white" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <ellipse cx="344" cy="214" rx="32" ry="10" fill="white" transform="rotate(22,344,214)"/>
    <!-- Tip leaf -->
    <ellipse cx="242" cy="35" rx="22" ry="60" fill="white" transform="rotate(12,242,35)"/>
  </svg>

  <!-- ── Geometric watermark: concentric arcs (top-right corner) ─────── -->
  <svg class="cover-wm-arcs" viewBox="0 0 560 560" xmlns="http://www.w3.org/2000/svg"
       aria-hidden="true">
    <circle cx="560" cy="0" r="120" fill="none" stroke="white" stroke-width="1.2" opacity="0.9"/>
    <circle cx="560" cy="0" r="200" fill="none" stroke="white" stroke-width="1.0" opacity="0.7"/>
    <circle cx="560" cy="0" r="285" fill="none" stroke="white" stroke-width="0.8" opacity="0.55"/>
    <circle cx="560" cy="0" r="370" fill="none" stroke="white" stroke-width="0.6" opacity="0.4"/>
    <circle cx="560" cy="0" r="460" fill="none" stroke="white" stroke-width="0.5" opacity="0.28"/>
    <!-- Radial spokes -->
    <line x1="560" y1="0" x2="430" y2="130" stroke="white" stroke-width="0.5" opacity="0.4"/>
    <line x1="560" y1="0" x2="370" y2="80" stroke="white" stroke-width="0.5" opacity="0.4"/>
    <line x1="560" y1="0" x2="480" y2="170" stroke="white" stroke-width="0.5" opacity="0.4"/>
    <line x1="560" y1="0" x2="340" y2="160" stroke="white" stroke-width="0.4" opacity="0.3"/>
  </svg>

  <!-- ── Geometric watermark: scattered diamonds ─────────────────────── -->
  <svg class="cover-wm-diamonds" viewBox="0 0 900 1100" xmlns="http://www.w3.org/2000/svg"
       aria-hidden="true">
    <!-- Small diamonds scattered across cover -->
    <rect x="82" y="160"  width="7" height="7" fill="white" transform="rotate(45,85.5,163.5)" opacity="0.5"/>
    <rect x="148" y="220" width="5" height="5" fill="white" transform="rotate(45,150.5,222.5)" opacity="0.35"/>
    <rect x="55"  y="340" width="9" height="9" fill="white" transform="rotate(45,59.5,344.5)" opacity="0.3"/>
    <rect x="700" y="200" width="6" height="6" fill="white" transform="rotate(45,703,203)" opacity="0.45"/>
    <rect x="760" y="380" width="8" height="8" fill="white" transform="rotate(45,764,384)" opacity="0.3"/>
    <rect x="120" y="480" width="5" height="5" fill="white" transform="rotate(45,122.5,482.5)" opacity="0.4"/>
    <rect x="840" y="500" width="7" height="7" fill="white" transform="rotate(45,843.5,503.5)" opacity="0.35"/>
    <rect x="60"  y="620" width="10" height="10" fill="white" transform="rotate(45,65,625)" opacity="0.25"/>
    <rect x="820" y="660" width="6" height="6" fill="white" transform="rotate(45,823,663)" opacity="0.4"/>
    <rect x="180" y="720" width="5" height="5" fill="white" transform="rotate(45,182.5,722.5)" opacity="0.35"/>
    <rect x="740" y="760" width="9" height="9" fill="white" transform="rotate(45,744.5,764.5)" opacity="0.3"/>
    <rect x="400" y="80"  width="6" height="6" fill="white" transform="rotate(45,403,83)" opacity="0.4"/>
    <rect x="520" y="140" width="5" height="5" fill="white" transform="rotate(45,522.5,142.5)" opacity="0.3"/>
    <rect x="300" y="820" width="7" height="7" fill="white" transform="rotate(45,303.5,823.5)" opacity="0.3"/>
    <rect x="600" y="880" width="6" height="6" fill="white" transform="rotate(45,603,883)" opacity="0.35"/>
    <!-- Larger accent diamonds -->
    <rect x="680" y="580" width="14" height="14" fill="none" stroke="white" stroke-width="0.8"
          transform="rotate(45,687,587)" opacity="0.3"/>
    <rect x="100" y="800" width="12" height="12" fill="none" stroke="white" stroke-width="0.8"
          transform="rotate(45,106,806)" opacity="0.3"/>
    <rect x="460" y="950" width="16" height="16" fill="none" stroke="white" stroke-width="0.7"
          transform="rotate(45,468,958)" opacity="0.25"/>
  </svg>

  <!-- ── Geometric watermark: bottom-left triangle cluster ───────────── -->
  <svg class="cover-wm-tris" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"
       aria-hidden="true">
    <polygon points="0,300 120,300 0,180" fill="none" stroke="white" stroke-width="0.8" opacity="0.18"/>
    <polygon points="0,300 80,300 0,220"  fill="white" opacity="0.05"/>
    <polygon points="0,300 200,300 0,100" fill="none" stroke="white" stroke-width="0.5" opacity="0.12"/>
    <polygon points="0,300 280,300 0,20"  fill="none" stroke="white" stroke-width="0.4" opacity="0.08"/>
    <!-- Small decorative triangles -->
    <polygon points="140,220 165,265 115,265" fill="none" stroke="white" stroke-width="0.7" opacity="0.2"/>
    <polygon points="180,260 196,285 164,285" fill="none" stroke="white" stroke-width="0.6" opacity="0.18"/>
  </svg>

  <!-- ── Content area ────────────────────────────────────────────────── -->

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
  <div class="cover-body">
    <!-- Accent line above badge -->
    <div class="cover-accent-line"></div>

    <div class="cover-badge">
      <span class="cover-badge-dot"></span>
      Official Government Report &nbsp;·&nbsp; DEPC &nbsp;·&nbsp; ${monthYear}
    </div>

    <div class="cover-title">
      Vanuatu National<br>Biodiversity Status Report
    </div>

    <div class="cover-title-rule">
      <span class="cover-title-rule-bar"></span>
      <span class="cover-title-rule-diamond">◆</span>
      <span class="cover-title-rule-bar"></span>
    </div>

    <div class="cover-subtitle">
      Kunming-Montreal GBF 2030 Progress &nbsp;·&nbsp; NBSAP Implementation
      &nbsp;·&nbsp; CBD 7th National Report
    </div>

    <!-- At-a-glance statistics -->
    <div class="cover-stats">
      <!-- GIS Datasets: Heroicons "circle-stack" (database) -->
      <div class="cover-stat cover-stat--blue">
        <div class="cover-stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <ellipse cx="12" cy="6" rx="8.25" ry="3.25"/>
            <path d="M3.75 6v4c0 1.795 3.694 3.25 8.25 3.25S20.25 11.795 20.25 10V6"/>
            <path d="M3.75 10v4c0 1.795 3.694 3.25 8.25 3.25S20.25 15.795 20.25 14v-4"/>
            <path d="M3.75 14v4c0 1.795 3.694 3.25 8.25 3.25S20.25 19.795 20.25 18v-4"/>
          </svg>
        </div>
        <div class="cover-stat-value">${layers.length}</div>
        <div class="cover-stat-label">GIS Datasets</div>
      </div>
      <!-- Spatial Features: Heroicons "map-pin" -->
      <div class="cover-stat cover-stat--teal">
        <div class="cover-stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z"/>
          </svg>
        </div>
        <div class="cover-stat-value">${general.totalFeatures?.toLocaleString() || '0'}</div>
        <div class="cover-stat-label">Spatial Features</div>
      </div>
      <!-- Targets with Data: Heroicons "chart-bar-square" -->
      <div class="cover-stat cover-stat--amber">
        <div class="cover-stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"/>
          </svg>
        </div>
        <div class="cover-stat-value">${targetsActive}/9</div>
        <div class="cover-stat-label">Targets with Data</div>
      </div>
      <!-- CBD Checks Passed: Heroicons "shield-check" -->
      <div class="cover-stat cover-stat--green">
        <div class="cover-stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>
          </svg>
        </div>
        <div class="cover-stat-value">${passed}/${checks.length}</div>
        <div class="cover-stat-label">CBD Checks Passed</div>
      </div>
    </div>

    <div class="cover-divider">
      <span class="cover-divider-hex">⬡</span>
      <span class="cover-divider-hex">⬡</span>
      <span class="cover-divider-hex">⬡</span>
    </div>

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
