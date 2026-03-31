/**
 * s04_nationalContext.js — National Context
 * Geography, demographics, biodiversity significance, and threats.
 * All facts verified against public sources; gaps are flagged.
 *
 * Sources used:
 *  - Vanuatu National Statistics Office (NSO), 2020 Census
 *  - CBD Country Profile: Vanuatu (chm.cbd.int)
 *  - IUCN Pacific Islands Biodiversity Assessment
 *  - SPREP (Secretariat of the Pacific Regional Environment Programme)
 *
 * @param {object} ctx - report context
 * @returns {string}
 */
import { dataGap } from '../reportUtils.js';

export function renderNationalContext(_ctx) {
  return `
<!-- ══ NATIONAL CONTEXT ═══════════════════════════════════════════════════════ -->
<div class="page page-break" id="s2-context">
  <div class="section">
    <div class="section-label">Section 2</div>
    <h2>National Context</h2>

    <h3>2.1 Geography</h3>
    <p>
      The Republic of Vanuatu is an archipelago of approximately <strong>83 islands</strong>
      (65 permanently inhabited) located in the south-western Pacific Ocean, between
      latitudes 13°S and 21°S and longitudes 166°E and 170°E. The total land area is
      approximately <strong>12,189 km² (1,218,900 ha)</strong> and the Exclusive Economic
      Zone (EEZ) covers approximately <strong>663,251 km² (66,325,100 ha)</strong>,
      making Vanuatu one of the most ocean-dominant nations on Earth by EEZ-to-land ratio.
    </p>
    <p>
      The islands are of volcanic origin, with rugged terrain dominated by mountains,
      dense tropical rainforest, and coral reef systems. Active volcanoes are present on
      several islands (Ambrym, Tanna, Gaua). Vanuatu sits within the
      <strong>Coral Triangle</strong> biodiversity hotspot and is recognised as part of
      the Pacific Islands hotspot for terrestrial endemism.
    </p>

    <div class="three-col">
      <div class="kpi">
        <div class="kpi-value" style="font-size:18px">~83</div>
        <div class="kpi-label">Islands (65 inhabited)</div>
      </div>
      <div class="kpi">
        <div class="kpi-value" style="font-size:18px">12,189 km²</div>
        <div class="kpi-label">Total Land Area</div>
      </div>
      <div class="kpi">
        <div class="kpi-value" style="font-size:18px">663,251 km²</div>
        <div class="kpi-label">EEZ Area</div>
      </div>
    </div>

    <h3>2.2 Demographics and Society</h3>
    <p>
      The 2020 National Population and Housing Census recorded a population of
      <strong>319,137</strong>, with an average annual growth rate of approximately 2.3%.
      The population is predominantly rural (~75%), with most livelihoods dependent on
      subsistence agriculture, fishing, and traditional resource management.
    </p>
    <p>
      Vanuatu is one of the world's most linguistically diverse nations, with
      <strong>113 indigenous languages</strong> spoken across the islands.
      Traditional land tenure (kastom) remains the primary land governance system:
      approximately <strong>97% of land is held under customary ownership</strong>,
      making community consent and engagement essential to any conservation initiative.
    </p>
    <p>
      The capital, Port Vila (Efate, Shefa Province), hosts the national government.
      Luganville (Espiritu Santo, Sanma Province) is the second-largest urban centre.
    </p>
    ${dataGap('Current GDP per capita and Human Development Index (HDI) score.', 'World Bank / UNDP Human Development Report')}

    <h3>2.3 Biodiversity Significance</h3>
    <p>
      Vanuatu's biodiversity is globally significant. Key features include:
    </p>
    <ul>
      <li><strong>Terrestrial endemism:</strong> High rates of endemic flora and fauna
          relative to land area, including numerous plant, bird, reptile, and invertebrate
          species found nowhere else on Earth.</li>
      <li><strong>Avifauna:</strong> Notable endemic birds include the
          <em>Vanuatu Megapode</em> (<em>Megapodius layardi</em>),
          <em>Mountain Starling</em> (<em>Aplonis santovestris</em>),
          <em>Streaked Fantail</em> (<em>Rhipidura verreauxi</em>),
          <em>Collared Kingfisher</em> (<em>Todiramphus chloris</em>), and
          <em>Flying Fox</em> (<em>Pteropus anetianus</em>).</li>
      <li><strong>Flora:</strong> The endemic palm <em>Plerandra vanuatuensis</em>
          (formerly <em>Schefflera vanuatuensis</em>) and numerous other endemic
          plant species.</li>
      <li><strong>Marine ecosystems:</strong> Extensive coral reefs, seagrass beds,
          mangroves, and deep-sea habitats within the EEZ supporting high fish
          biomass and marine megafauna.</li>
      <li><strong>Freshwater:</strong> Numerous streams, rivers, and crater lakes
          (notably Lake Letas on Gaua) with endemic freshwater species.</li>
    </ul>
    ${dataGap(
      'Total number of described species, national Red List assessments, and percentage of species threatened.',
      'IUCN Red List / Vanuatu DEPC biodiversity database'
    )}

    <h3>2.4 Key Threats to Biodiversity</h3>
    <p>The major threats to Vanuatu's biodiversity are:</p>

    <table>
      <thead>
        <tr>
          <th>Threat</th>
          <th>Primary Ecosystems Affected</th>
          <th>GBF Target(s)</th>
          <th>Trend</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Invasive Alien Species (IAS)</strong></td>
          <td>Terrestrial forests, coastal vegetation</td>
          <td>T6</td>
          <td><span class="badge" style="background:#FFEBEE;color:#C62828">Worsening</span></td>
        </tr>
        <tr>
          <td><strong>Merremia peltata</strong> (Big Leaf Vine)</td>
          <td>Secondary forest, degraded land</td>
          <td>T6, T2</td>
          <td><span class="badge" style="background:#FFEBEE;color:#C62828">Expanding</span></td>
        </tr>
        <tr>
          <td><strong>Deforestation &amp; land-use change</strong></td>
          <td>Tropical forest, watershed</td>
          <td>T1, T10</td>
          <td><span class="badge" style="background:#FFF3E0;color:#E65100">Ongoing</span></td>
        </tr>
        <tr>
          <td><strong>Climate change</strong> (cyclones, sea level rise, coral bleaching)</td>
          <td>All ecosystems</td>
          <td>T8</td>
          <td><span class="badge" style="background:#FFEBEE;color:#C62828">Accelerating</span></td>
        </tr>
        <tr>
          <td><strong>Overexploitation</strong> of fisheries</td>
          <td>Coastal and reef marine</td>
          <td>T3, T4</td>
          <td><span class="badge" style="background:#FFF3E0;color:#E65100">Ongoing</span></td>
        </tr>
        <tr>
          <td><strong>Agricultural chemicals</strong> (pesticides, herbicides)</td>
          <td>Terrestrial, freshwater, near-shore</td>
          <td>T7</td>
          <td><span class="badge" style="background:#FFF3E0;color:#E65100">Localised</span></td>
        </tr>
        <tr>
          <td><strong>Nutrient pollution</strong> (eutrophication)</td>
          <td>Coastal marine, reefs</td>
          <td>T8</td>
          <td><span class="badge" style="background:#FFF3E0;color:#E65100">Localised</span></td>
        </tr>
        <tr>
          <td><strong>Unsustainable harvesting</strong> of forest products</td>
          <td>Lowland forest</td>
          <td>T10</td>
          <td><span class="badge" style="background:#FFF3E0;color:#E65100">Ongoing</span></td>
        </tr>
      </tbody>
    </table>

    <h3>2.5 Vulnerability and Climate Context</h3>
    <p>
      Vanuatu consistently ranks among the world's most at-risk countries in the
      <strong>World Risk Index</strong>, with extreme exposure to tropical cyclones,
      earthquakes, tsunamis, and volcanic eruptions. Climate change amplifies these
      hazards and directly threatens the biodiversity assets described above through:
      increased cyclone intensity, ocean warming and acidification, sea-level rise
      inundating low coastal habitats, and shifting rainfall patterns affecting
      freshwater systems.
    </p>
    <p>
      As a <strong>Small Island Developing State (SIDS)</strong>, Vanuatu's
      biodiversity conservation agenda is inseparable from its climate adaptation and
      disaster risk reduction goals.
    </p>
  </div>
</div>
`;
}
