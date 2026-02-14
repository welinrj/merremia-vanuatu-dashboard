/**
 * About / Help page.
 * Data sources, guidance, documentation links.
 */

export function initAbout() {
  const page = document.getElementById('page-about');
  page.innerHTML = `
    <div class="about-layout">
      <h2>Vanuatu NBSAP GIS Data Portal</h2>
      <p>
        This portal supports monitoring and reporting for Vanuatu's
        <strong style="color:var(--text)">National Biodiversity Strategy and Action Plan (NBSAP)</strong>,
        with a focus on <strong style="color:var(--text)">Target 3 (30x30)</strong> &mdash; conserving at least 30%
        of terrestrial and 30% of marine areas by 2030.
      </p>

      <h3>What This Portal Does</h3>
      <ul>
        <li><strong style="color:var(--text)">Dashboard:</strong> View interactive maps, KPI widgets, and charts showing conservation progress by target and province.</li>
        <li><strong style="color:var(--text)">Data Portal:</strong> Upload, clean, and manage GIS layers (shapefiles). Automatic validation, CRS reprojection, and attribute standardization.</li>
        <li><strong style="color:var(--text)">Admin:</strong> Manage authentication, audit logs, and backup/restore operations.</li>
        <li><strong style="color:var(--text)">Exports:</strong> Download filtered data as CSV, JSON reporting snapshots, or cleaned GeoJSON files.</li>
      </ul>

      <h3>Data Sources</h3>
      <ul>
        <li><strong style="color:var(--text)">Protected Areas:</strong> WDPA (World Database on Protected Areas)</li>
        <li><strong style="color:var(--text)">Community Conserved Areas:</strong> DEPC Vanuatu records</li>
        <li><strong style="color:var(--text)">Marine Protected Areas:</strong> National marine management plans</li>
        <li><strong style="color:var(--text)">Key Biodiversity Areas:</strong> BirdLife International / KBA Partnership</li>
        <li><strong style="color:var(--text)">Province Boundaries:</strong> Vanuatu National Statistics Office</li>
      </ul>

      <h3>NBSAP Targets</h3>
      <p>
        The Kunming-Montreal Global Biodiversity Framework (GBF) sets 23 targets.
        This portal currently tracks Vanuatu's progress on key targets including:
      </p>
      <ul>
        <li><strong style="color:var(--text)">Target 3 (30x30):</strong> Conserve 30% of land and 30% of ocean by 2030</li>
        <li><strong style="color:var(--text)">Target 2:</strong> Restore 30% of degraded ecosystems</li>
        <li><strong style="color:var(--text)">Target 6:</strong> Manage invasive alien species</li>
      </ul>

      <h3>How to Use</h3>
      <ol style="margin-left:20px;margin-bottom:12px">
        <li>Use the <strong style="color:var(--text)">Dashboard</strong> tab to explore conservation data on the map</li>
        <li>Apply <strong style="color:var(--text)">filters</strong> by target, province, category, realm, or year</li>
        <li>View <strong style="color:var(--text)">KPI widgets</strong> for 30x30 progress metrics</li>
        <li>Use <strong style="color:var(--text)">Export</strong> buttons to download data for reporting</li>
        <li>Admin users can <strong style="color:var(--text)">upload</strong> new shapefile layers via the Data Portal</li>
      </ol>

      <h3>Technical Notes</h3>
      <ul>
        <li>All data is stored locally in your browser (IndexedDB) when using static hosting.</li>
        <li>Area calculations use geodesic methods (turf.area) for accuracy on WGS84 coordinates.</li>
        <li>The union/dissolve process removes overlapping areas to prevent double-counting.</li>
        <li>Province assignment uses centroid-in-polygon spatial joins.</li>
      </ul>

      <h3>Links & Resources</h3>
      <ul>
        <li><a href="https://www.cbd.int/gbf/targets/" target="_blank" rel="noopener">GBF Targets (CBD)</a></li>
        <li><a href="https://www.protectedplanet.net/" target="_blank" rel="noopener">Protected Planet / WDPA</a></li>
        <li><a href="https://www.keybiodiversityareas.org/" target="_blank" rel="noopener">Key Biodiversity Areas</a></li>
      </ul>

      <h3>Version</h3>
      <p>v1.0.0 &mdash; Built for the Department of Environmental Protection and Conservation (DEPC), Vanuatu.</p>

      <div style="margin-top:32px;padding:20px;background:var(--gray-50);border:1px solid var(--border);border-radius:var(--radius-md);font-size:12px;color:var(--text-secondary)">
        <p><strong style="color:var(--text)">Disclaimer:</strong> This is a monitoring tool. Data accuracy depends on the quality of uploaded layers.
        Always verify against official sources before using in formal reports.</p>
      </div>
    </div>
  `;
}
