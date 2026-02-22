/**
 * About / Help page.
 * Comprehensive documentation for all NBSAP targets, data sources, and guidance.
 */

export function initAbout() {
  const page = document.getElementById('page-about');
  page.innerHTML = `
    <div class="about-layout">
      <h2>Vanuatu NBSAP GIS Data Portal</h2>
      <p>
        This portal supports monitoring and reporting for Vanuatu's
        <strong style="color:var(--text)">National Biodiversity Strategy and Action Plan (NBSAP)</strong>,
        aligned with the <strong style="color:var(--text)">Kunming-Montreal Global Biodiversity Framework (GBF)</strong>.
        It tracks progress across 9 key targets covering conservation, species management, land use, and environmental monitoring.
      </p>

      <h3>What This Portal Does</h3>
      <ul>
        <li><strong style="color:var(--text)">Dashboard:</strong> Interactive maps, target-specific KPI widgets, and charts showing progress by target, province, and category.</li>
        <li><strong style="color:var(--text)">Data Portal:</strong> Upload shapefiles (.shp/.zip) with automatic validation, CRS reprojection, geometry cleaning, field mapping, province assignment, and area calculation.</li>
        <li><strong style="color:var(--text)">Admin:</strong> Manage authentication, audit logs, layer tracker, and backup/restore operations.</li>
        <li><strong style="color:var(--text)">Exports:</strong> Download filtered data as CSV, JSON reporting snapshots, or map screenshots (PNG).</li>
      </ul>

      <h3>NBSAP Targets Tracked</h3>

      <div class="target-doc-grid">
        <div class="target-doc-card">
          <div class="target-doc-code">T1</div>
          <div class="target-doc-body">
            <strong>Biodiversity Spatial Planning</strong>
            <p>Percentage of land and sea area covered by biodiversity-inclusive spatial plans &mdash; provincial/municipal physical plans, CCA boundary zones, and marine spatial planning areas.</p>
            <div class="target-doc-layers">Layers: Biodiversity Spatial Plans, Key Biodiversity Areas</div>
          </div>
        </div>

        <div class="target-doc-card">
          <div class="target-doc-code">T2</div>
          <div class="target-doc-body">
            <strong>Degraded Area Mapping & Restoration</strong>
            <p>Mapping of degraded terrestrial, inland water, marine, and coastal ecosystems. Tracking active and planned restoration sites.</p>
            <div class="target-doc-layers">Layers: Degraded Terrestrial Areas, Degraded Marine/Coastal Areas, Ecosystem Restoration Sites</div>
          </div>
        </div>

        <div class="target-doc-card">
          <div class="target-doc-code">T3</div>
          <div class="target-doc-body">
            <strong>30x30 Conservation</strong>
            <p>Conserve at least 30% of terrestrial and 30% of marine areas by 2030 through protected areas, community conserved areas, MPAs, LMMAs, and OECMs.</p>
            <div class="target-doc-layers">Layers: CCAs, MPAs, LMMAs, Protected Areas (WDPA), OECMs</div>
            <div class="target-doc-baseline">Baselines: Terrestrial 1,219,000 ha | Marine 66,300,000 ha</div>
          </div>
        </div>

        <div class="target-doc-card">
          <div class="target-doc-code">T4</div>
          <div class="target-doc-body">
            <strong>Species & Biodiversity Distribution</strong>
            <p>Distribution maps of significant species and key biodiversity areas across Vanuatu's islands.</p>
            <div class="target-doc-layers">Layers: Significant Species Distribution, Key Biodiversity Areas</div>
          </div>
        </div>

        <div class="target-doc-card">
          <div class="target-doc-code">T6</div>
          <div class="target-doc-body">
            <strong>Invasive Alien Species</strong>
            <p>Spatial analysis to identify total coverage (ha) and distribution of key Invasive Alien Species (IAS): <em>Merremia peltata</em> (Big Leaf), Fire Ants, African Snail, Crown-of-Thorns, Sako, Coconut Beetle, and other IAS.</p>
            <div class="target-doc-layers">Layers: Merremia peltata Detection, Other Invasive Alien Species</div>
            <div class="target-doc-note">Merremia detection supports remote sensing and field survey data with confidence scoring.</div>
          </div>
        </div>

        <div class="target-doc-card">
          <div class="target-doc-code">T7</div>
          <div class="target-doc-body">
            <strong>Pesticide & Herbicide Mapping</strong>
            <p>Map out areas of pesticide and herbicide use in large-scale and/or small-scale commercial farming operations.</p>
            <div class="target-doc-layers">Layers: Pesticide & Herbicide Use Areas</div>
          </div>
        </div>

        <div class="target-doc-card">
          <div class="target-doc-code">T8</div>
          <div class="target-doc-body">
            <strong>Coastal Eutrophication</strong>
            <p>Mapping of coastal eutrophication and nutrient-impacted zones around Vanuatu islands.</p>
            <div class="target-doc-layers">Layers: Coastal Eutrophication Zones</div>
          </div>
        </div>

        <div class="target-doc-card">
          <div class="target-doc-code">T10</div>
          <div class="target-doc-body">
            <strong>Agriculture & Land Cover Change</strong>
            <p>Mapping of land cover change for agriculture, livestock, fisheries, and forestry across Vanuatu.</p>
            <div class="target-doc-layers">Layers: Land Cover / Land Use Change</div>
          </div>
        </div>

        <div class="target-doc-card">
          <div class="target-doc-code">T12</div>
          <div class="target-doc-body">
            <strong>Blue & Green Spaces</strong>
            <p>Mapping of blue and green spaces &mdash; parks within provincial and municipal areas, and botanical gardens.</p>
            <div class="target-doc-layers">Layers: Blue & Green Spaces</div>
          </div>
        </div>
      </div>

      <h3>Data Sources</h3>
      <ul>
        <li><strong style="color:var(--text)">Protected Areas:</strong> WDPA (World Database on Protected Areas)</li>
        <li><strong style="color:var(--text)">Community Conserved Areas:</strong> DEPC Vanuatu records, Custom Tabu Areas</li>
        <li><strong style="color:var(--text)">Marine Protected Areas:</strong> National marine management plans</li>
        <li><strong style="color:var(--text)">LMMAs:</strong> Locally Managed Marine Areas Network</li>
        <li><strong style="color:var(--text)">Key Biodiversity Areas:</strong> BirdLife International / KBA Partnership</li>
        <li><strong style="color:var(--text)">Invasive Species:</strong> DEPC IAS surveys, remote sensing imagery, field survey GPS data</li>
        <li><strong style="color:var(--text)">Land Cover:</strong> Satellite imagery classification, national forestry surveys</li>
        <li><strong style="color:var(--text)">Province Boundaries:</strong> Vanuatu National Statistics Office</li>
      </ul>

      <h3>How to Use</h3>
      <ol style="margin-left:20px;margin-bottom:12px">
        <li>Use the <strong style="color:var(--text)">Dashboard</strong> tab to explore data on an interactive map</li>
        <li>Apply <strong style="color:var(--text)">filters</strong> by target, province, category, realm, or year</li>
        <li>Select a <strong style="color:var(--text)">single target</strong> to see target-specific KPIs, province breakdown, and category analysis</li>
        <li>For <strong style="color:var(--text)">Target 3</strong>, view 30x30 progress bars showing % of terrestrial and marine baselines conserved</li>
        <li>For <strong style="color:var(--text)">Target 6</strong>, view invasive species detection breakdown with Merremia-specific metrics</li>
        <li>Use <strong style="color:var(--text)">Export</strong> buttons to download data as CSV, JSON, or PNG for reporting</li>
        <li>Admin users can <strong style="color:var(--text)">upload</strong> new shapefile layers via the Data Portal tab</li>
      </ol>

      <h3>Upload & Analysis Pipeline</h3>
      <p>When you upload a shapefile, the portal automatically:</p>
      <ol style="margin-left:20px;margin-bottom:12px">
        <li><strong style="color:var(--text)">Validates</strong> the file format and geometry types</li>
        <li><strong style="color:var(--text)">Detects CRS</strong> and reprojects to WGS84 (EPSG:4326) if needed</li>
        <li><strong style="color:var(--text)">Cleans geometries</strong> &mdash; fixes invalid polygons, removes slivers</li>
        <li><strong style="color:var(--text)">Maps fields</strong> to standard attribute names (name, type, province, etc.)</li>
        <li><strong style="color:var(--text)">Assigns provinces</strong> using centroid-in-polygon spatial joins against Vanuatu boundaries</li>
        <li><strong style="color:var(--text)">Calculates areas</strong> using geodesic methods (turf.area) in hectares</li>
        <li><strong style="color:var(--text)">Generates a report</strong> with feature count, total area, and any warnings</li>
      </ol>

      <h3>Technical Notes</h3>
      <ul>
        <li>All data is stored locally in your browser (IndexedDB) when using static hosting.</li>
        <li>Area calculations use geodesic methods (turf.area) for accuracy on WGS84 coordinates.</li>
        <li>The union/dissolve process removes overlapping areas to prevent double-counting.</li>
        <li>Province assignment uses centroid-in-polygon spatial joins.</li>
        <li>Supported upload formats: .zip (containing .shp, .dbf, .shx, .prj) up to 50 MB.</li>
      </ul>

      <h3>Links & Resources</h3>
      <ul>
        <li><a href="https://www.cbd.int/gbf/targets/" target="_blank" rel="noopener">GBF Targets (CBD)</a></li>
        <li><a href="https://www.protectedplanet.net/" target="_blank" rel="noopener">Protected Planet / WDPA</a></li>
        <li><a href="https://www.keybiodiversityareas.org/" target="_blank" rel="noopener">Key Biodiversity Areas</a></li>
        <li><a href="https://lmmanetwork.org/" target="_blank" rel="noopener">LMMA Network</a></li>
      </ul>

      <h3>Version</h3>
      <p>v2.0.0 &mdash; Built for the Department of Environmental Protection and Conservation (DEPC), Vanuatu.</p>

      <div style="margin-top:32px;padding:20px;background:var(--gray-50);border:1px solid var(--border);border-radius:var(--radius-md);font-size:12px;color:var(--text-secondary)">
        <p><strong style="color:var(--text)">Disclaimer:</strong> This is a monitoring tool. Data accuracy depends on the quality of uploaded layers.
        Always verify against official sources before using in formal reports.</p>
      </div>
    </div>
  `;
}
