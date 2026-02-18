/**
 * KPI Widgets component.
 * Renders target-specific metric dashboards with dissolved (net) area
 * as the primary metric and gross (sum) as secondary for transparency.
 *
 * - T3: 30x30 progress bars with dissolved terrestrial/marine breakdown
 * - T6: Invasive species with species breakdown
 * - All others: General target metrics with net/gross area display
 */
import { compute30x30Metrics, computeGeneralMetrics, computeTargetMetrics } from '../../gis/areaCalc.js';
import { getAppState, getDashboardLayers } from '../state.js';
import { CATEGORIES } from '../../config/categories.js';
import ENV from '../../config/env.js';

/** Target display metadata */
const TARGET_META = {
  T1: { icon: '\u{1F5FA}', label: 'Biodiversity Spatial Planning', unit: 'ha planned' },
  T2: { icon: '\u{1F33F}', label: 'Degraded Areas & Restoration', unit: 'ha mapped' },
  T3: { icon: '\u{1F30F}', label: '30x30 Conservation', unit: 'ha conserved' },
  T4: { icon: '\u{1F98E}', label: 'Species & Biodiversity', unit: 'species records' },
  T6: { icon: '\u{1FAB2}', label: 'Invasive Alien Species', unit: 'ha detected' },
  T7: { icon: '\u{2697}', label: 'Pesticide & Herbicide', unit: 'ha mapped' },
  T8: { icon: '\u{1F30A}', label: 'Coastal Eutrophication', unit: 'ha impacted' },
  T10: { icon: '\u{1F33E}', label: 'Land Cover Change', unit: 'ha mapped' },
  T12: { icon: '\u{1F333}', label: 'Blue & Green Spaces', unit: 'ha mapped' }
};

/**
 * Renders KPI widgets into a container.
 * @param {HTMLElement} container
 */
export function renderKPIWidgets(container) {
  const state = getAppState();
  const filters = state.filters;
  const layers = getDashboardLayers();
  const activeTargets = filters.targets;

  // Single target selected — show target-specific dashboard
  if (activeTargets.length === 1) {
    const target = activeTargets[0];
    if (target === 'T1') {
      renderTarget1KPIs(container, layers, filters);
    } else if (target === 'T3') {
      renderTarget3KPIs(container, layers, filters);
    } else if (target === 'T4') {
      renderSpeciesKPIs(container, layers, filters);
    } else if (target === 'T6') {
      renderInvasiveKPIs(container, layers, filters);
    } else {
      renderTargetKPIs(container, layers, filters, target);
    }
    return;
  }

  // T3 included or no filter — show 30x30
  const t3Active = activeTargets.length === 0 || activeTargets.includes('T3');
  if (t3Active) {
    renderTarget3KPIs(container, layers, filters);
  } else {
    renderGeneralKPIs(container, layers, filters);
  }
}

/**
 * Renders Target 1 (Biodiversity Spatial Planning) KPIs
 * with percentage of national land and sea area covered.
 */
function renderTarget1KPIs(container, layers, filters) {
  const m = computeTargetMetrics(layers, 'T1', filters);
  const baselines = ENV.nationalBaselines;

  const tNet = m.realmTotals.terrestrial_ha;
  const mNet = m.realmTotals.marine_ha;
  const tPct = baselines.terrestrial_ha > 0 ? (tNet / baselines.terrestrial_ha) * 100 : 0;
  const mPct = baselines.marine_ha > 0 ? (mNet / baselines.marine_ha) * 100 : 0;
  const tPctClamped = Math.min(tPct, 100);
  const mPctClamped = Math.min(mPct, 100);

  const tHasOverlap = m.realmTotals.gross_terrestrial_ha > 0 && Math.abs(m.realmTotals.gross_terrestrial_ha - tNet) > 1;
  const mHasOverlap = m.realmTotals.gross_marine_ha > 0 && Math.abs(m.realmTotals.gross_marine_ha - mNet) > 1;

  // Count reference layers
  const refCount = countReferenceLayers(layers, 'T1');

  // Category badges
  const catBadges = m.categoryBreakdown.map(c => {
    const catDef = CATEGORIES[c.category] || { label: c.category, color: '#95a5a6' };
    return `<span class="cat-badge" style="background:${catDef.color}20;color:${catDef.color};border:1px solid ${catDef.color}40">
      ${catDef.label}: ${formatNumber(c.area_ha)} ha (${c.features})
    </span>`;
  }).join('');

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(tNet)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
        <div class="kpi-sublabel">Net coverage (dissolved)${tHasOverlap ? `<br><span style="color:var(--text-tertiary)">Gross: ${formatNumber(m.realmTotals.gross_terrestrial_ha)} ha</span>` : ''}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${formatNumber(mNet)}</div>
        <div class="kpi-label">Marine (ha)</div>
        <div class="kpi-sublabel">Net coverage (dissolved)${mHasOverlap ? `<br><span style="color:var(--text-tertiary)">Gross: ${formatNumber(m.realmTotals.gross_marine_ha)} ha</span>` : ''}</div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Land covered by spatial plans: ${tPct.toFixed(2)}%</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill terrestrial"
               style="width: ${Math.min(tPctClamped, 100).toFixed(1)}%">
            ${tPct >= 1 ? tPct.toFixed(1) + '%' : ''}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${formatNumber(tNet)} ha of ${formatNumber(baselines.terrestrial_ha)} ha national terrestrial area
        </div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Sea covered by spatial plans: ${mPct.toFixed(2)}%</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill marine"
               style="width: ${Math.min(mPctClamped, 100).toFixed(1)}%">
            ${mPct >= 1 ? mPct.toFixed(1) + '%' : ''}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${formatNumber(mNet)} ha of ${formatNumber(baselines.marine_ha)} ha national marine area
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-value">${m.totalFeatures}</div>
        <div class="kpi-label">Features</div>
        <div class="kpi-sublabel">${m.layerCount} layer${m.layerCount !== 1 ? 's' : ''} uploaded</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With spatial plans</div>
      </div>
    </div>
    ${catBadges ? `<div class="kpi-cat-badges">${catBadges}</div>` : ''}
    ${refCount > 0 ? `<div class="kpi-methodology-note">${refCount} reference layer${refCount !== 1 ? 's' : ''} excluded from calculations (visual only).</div>` : ''}
    <div class="kpi-methodology-note">
      Areas dissolved (UNEP-WCMC method) to remove overlaps. Percentages based on national baselines.
    </div>
  `;
}

function renderTarget3KPIs(container, layers, filters) {
  const m = compute30x30Metrics(layers, filters);

  const tPctClamped = Math.min(m.terrestrial_pct, 100);
  const mPctClamped = Math.min(m.marine_pct, 100);

  // Show gross vs net indicator only when they differ
  const tHasOverlap = m.gross_terrestrial_ha > 0 && Math.abs(m.gross_terrestrial_ha - m.terrestrial_ha) > 1;
  const mHasOverlap = m.gross_marine_ha > 0 && Math.abs(m.gross_marine_ha - m.marine_ha) > 1;

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.terrestrial_ha)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
        <div class="kpi-sublabel">Net coverage (dissolved)${tHasOverlap ? `<br><span style="color:var(--text-tertiary)">Gross: ${formatNumber(m.gross_terrestrial_ha)} ha</span>` : ''}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${formatNumber(m.marine_ha)}</div>
        <div class="kpi-label">Marine (ha)</div>
        <div class="kpi-sublabel">Net coverage (dissolved)${mHasOverlap ? `<br><span style="color:var(--text-tertiary)">Gross: ${formatNumber(m.gross_marine_ha)} ha</span>` : ''}</div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Terrestrial: ${m.terrestrial_pct.toFixed(2)}% of 30% target</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill terrestrial"
               style="width: ${(tPctClamped / 30 * 100).toFixed(1)}%">
            ${m.terrestrial_pct >= 1 ? m.terrestrial_pct.toFixed(1) + '%' : ''}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${m.terrestrial_remaining_pct > 0
            ? `${m.terrestrial_remaining_pct.toFixed(2)}% remaining to reach 30%`
            : 'Target reached!'}
        </div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Marine: ${m.marine_pct.toFixed(2)}% of 30% target</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill marine"
               style="width: ${(mPctClamped / 30 * 100).toFixed(1)}%">
            ${m.marine_pct >= 1 ? m.marine_pct.toFixed(1) + '%' : ''}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${m.marine_remaining_pct > 0
            ? `${m.marine_remaining_pct.toFixed(2)}% remaining to reach 30%`
            : 'Target reached!'}
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-value">${m.total_features}</div>
        <div class="kpi-label">Features</div>
        <div class="kpi-sublabel">Counted toward 30x30</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With conservation areas</div>
      </div>
    </div>
    ${(() => { const rc = countReferenceLayers(layers, 'T3'); return rc > 0 ? `<div class="kpi-methodology-note">${rc} reference layer${rc !== 1 ? 's' : ''} excluded from calculations (visual only).</div>` : ''; })()}
    <div class="kpi-methodology-note">
      Areas dissolved (UNEP-WCMC method) to remove overlaps. Each point counted once.
    </div>
  `;
}

/** Species categories for T4 dashboard */
const T4_SPECIES = [
  { key: 'MEGAPODE', name: 'Vanuatu Megapode', scientific: 'Megapodius layardi', taxa: 'Bird' },
  { key: 'STARLING', name: 'Vanuatu Mountain Starling', scientific: 'Aplonis santovestris', taxa: 'Bird' },
  { key: 'FANTAIL', name: 'Vanuatu Streaked Fantail', scientific: 'Rhipidura spilodera', taxa: 'Bird' },
  { key: 'KINGFISHER', name: 'Vanuatu Kingfisher', scientific: 'Todiramphus farquhari', taxa: 'Bird' },
  { key: 'FLYING_FOX', name: 'Vanuatu Flying Fox', scientific: 'Pteropus anetianus', taxa: 'Mammal' },
  { key: 'PLERANDRA', name: 'Plerandra vanuatuensis', scientific: 'Plerandra vanuatuensis', taxa: 'Plant' }
];

/**
 * Renders Target 4 (Species & Biodiversity) KPIs with per-species breakdown.
 */
function renderSpeciesKPIs(container, layers, filters) {
  const m = computeTargetMetrics(layers, 'T4', filters);

  // Count species with data
  const speciesWithData = T4_SPECIES.filter(sp =>
    m.categoryBreakdown.some(c => c.category === sp.key && c.features > 0)
  );
  const kba = m.categoryBreakdown.find(c => c.category === 'KBA');
  const otherDist = m.categoryBreakdown.find(c => c.category === 'SPECIES_DIST');

  // Build species cards
  const speciesCards = T4_SPECIES.map(sp => {
    const cat = m.categoryBreakdown.find(c => c.category === sp.key);
    const catDef = CATEGORIES[sp.key] || { color: '#95a5a6' };
    const hasData = cat && cat.features > 0;
    return `
      <div class="species-card ${hasData ? '' : 'species-no-data'}" style="border-left:4px solid ${catDef.color}">
        <div class="species-card-header">
          <span class="species-common-name">${sp.name}</span>
          <span class="species-taxa-badge">${sp.taxa}</span>
        </div>
        <div class="species-scientific"><i>${sp.scientific}</i></div>
        ${hasData
          ? `<div class="species-stats">
              <span class="species-stat-value">${formatNumber(cat.area_ha)} ha</span>
              <span class="species-stat-label">${cat.features} record${cat.features !== 1 ? 's' : ''}</span>
            </div>`
          : '<div class="species-no-data-label">No data uploaded</div>'}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.totalAreaHa)}</div>
        <div class="kpi-label">Total Distribution (ha)</div>
        <div class="kpi-sublabel">Net coverage (dissolved)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${speciesWithData.length} / ${T4_SPECIES.length}</div>
        <div class="kpi-label">Species Mapped</div>
        <div class="kpi-sublabel">${m.totalFeatures} total records</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(kba ? kba.area_ha : 0)}</div>
        <div class="kpi-label">KBA Area (ha)</div>
        <div class="kpi-sublabel">${kba ? kba.features : 0} Key Biodiversity Areas</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With species records</div>
      </div>
    </div>
    <div class="species-breakdown">
      <div class="breakdown-header" style="font-size:13px;font-weight:600;margin:12px 0 8px">Significant Species</div>
      <div class="species-grid">${speciesCards}</div>
    </div>
    ${otherDist && otherDist.features > 0 ? `
      <div class="kpi-cat-badges" style="margin-top:8px">
        <span class="cat-badge" style="background:${CATEGORIES.SPECIES_DIST.color}20;color:${CATEGORIES.SPECIES_DIST.color};border:1px solid ${CATEGORIES.SPECIES_DIST.color}40">
          Other Species: ${formatNumber(otherDist.area_ha)} ha (${otherDist.features})
        </span>
      </div>
    ` : ''}
    ${(() => { const rc = countReferenceLayers(layers, 'T4'); return rc > 0 ? `<div class="kpi-methodology-note">${rc} reference layer${rc !== 1 ? 's' : ''} excluded from calculations (visual only).</div>` : ''; })()}
  `;
}

/**
 * Renders Target 6 (Invasive Alien Species) KPIs with species breakdown.
 */
function renderInvasiveKPIs(container, layers, filters) {
  const m = computeTargetMetrics(layers, 'T6', filters);

  // Separate Merremia from other IAS
  const merremiaTypes = m.categoryBreakdown.find(c => c.category === 'MERREMIA');
  const otherIAS = m.categoryBreakdown.find(c => c.category === 'INVASIVE');

  const hasOverlap = m.grossAreaHa > 0 && Math.abs(m.grossAreaHa - m.totalAreaHa) > 1;

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card accent-red">
        <div class="kpi-value">${formatNumber(m.totalAreaHa)}</div>
        <div class="kpi-label">Total IAS Area (ha)</div>
        <div class="kpi-sublabel">${m.totalFeatures} detections across ${m.layerCount} layer${m.layerCount !== 1 ? 's' : ''}${hasOverlap ? `<br><span style="color:var(--text-tertiary)">Gross: ${formatNumber(m.grossAreaHa)} ha</span>` : ''}</div>
      </div>
      <div class="kpi-card accent-red">
        <div class="kpi-value">${formatNumber(merremiaTypes ? merremiaTypes.area_ha : 0)}</div>
        <div class="kpi-label">Merremia peltata (ha)</div>
        <div class="kpi-sublabel">${merremiaTypes ? merremiaTypes.features : 0} detections</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(otherIAS ? otherIAS.area_ha : 0)}</div>
        <div class="kpi-label">Other IAS (ha)</div>
        <div class="kpi-sublabel">${otherIAS ? otherIAS.features : 0} records</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces Affected</div>
      </div>
    </div>
    ${m.typeBreakdown.length > 0 ? renderTypeBreakdownTable(m.typeBreakdown, 'Species / Detection Type') : ''}
  `;
}

/**
 * Renders generic target KPIs for any NBSAP target.
 */
function renderTargetKPIs(container, layers, filters, targetCode) {
  const m = computeTargetMetrics(layers, targetCode, filters);
  const meta = TARGET_META[targetCode] || { icon: '', label: targetCode, unit: 'ha' };

  const hasOverlap = m.grossAreaHa > 0 && Math.abs(m.grossAreaHa - m.totalAreaHa) > 1;

  // Build category badges
  const catBadges = m.categoryBreakdown.map(c => {
    const catDef = CATEGORIES[c.category] || { label: c.category, color: '#95a5a6' };
    return `<span class="cat-badge" style="background:${catDef.color}20;color:${catDef.color};border:1px solid ${catDef.color}40">
      ${catDef.label}: ${formatNumber(c.area_ha)} ha (${c.features})
    </span>`;
  }).join('');

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.totalAreaHa)}</div>
        <div class="kpi-label">Net Area (ha)</div>
        <div class="kpi-sublabel">${meta.unit}${hasOverlap ? `<br><span style="color:var(--text-tertiary)">Gross: ${formatNumber(m.grossAreaHa)} ha</span>` : ''}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.totalFeatures}</div>
        <div class="kpi-label">Features</div>
        <div class="kpi-sublabel">${m.layerCount} layer${m.layerCount !== 1 ? 's' : ''} uploaded</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.realmTotals.terrestrial_ha)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${formatNumber(m.realmTotals.marine_ha)}</div>
        <div class="kpi-label">Marine (ha)</div>
      </div>
    </div>
    ${catBadges ? `<div class="kpi-cat-badges">${catBadges}</div>` : ''}
    ${m.typeBreakdown.length > 1 ? renderTypeBreakdownTable(m.typeBreakdown, 'Type Breakdown') : ''}
  `;
}

function renderGeneralKPIs(container, layers, filters) {
  const m = computeGeneralMetrics(layers, filters);

  const hasOverlap = m.grossAreaHa > 0 && Math.abs(m.grossAreaHa - m.totalAreaHa) > 1;

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${m.totalFeatures}</div>
        <div class="kpi-label">Total Features</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.totalAreaHa)}</div>
        <div class="kpi-label">Net Area (ha)</div>
        ${hasOverlap ? `<div class="kpi-sublabel"><span style="color:var(--text-tertiary)">Gross: ${formatNumber(m.grossAreaHa)} ha</span></div>` : ''}
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.realmCounts.terrestrial || 0}</div>
        <div class="kpi-label">Terrestrial</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${m.realmCounts.marine || 0}</div>
        <div class="kpi-label">Marine</div>
      </div>
    </div>
  `;
}

/**
 * Renders a compact breakdown table for species/type data.
 */
function renderTypeBreakdownTable(typeBreakdown, title) {
  const rows = typeBreakdown.slice(0, 10).map(t => `
    <tr>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${t.type}">${t.type}</td>
      <td style="text-align:right">${formatNumber(t.area_ha)}</td>
      <td style="text-align:right">${t.features}</td>
    </tr>
  `).join('');

  return `
    <div class="kpi-type-breakdown">
      <div class="breakdown-header" style="font-size:12px;margin:10px 0 6px">
        ${title}
      </div>
      <table class="data-table compact">
        <thead><tr><th>Type</th><th style="text-align:right">Area (ha)</th><th style="text-align:right">Count</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

/**
 * Counts reference layers for a given target.
 */
function countReferenceLayers(layers, targetCode) {
  return layers.filter(l =>
    l.metadata.isReference &&
    l.metadata.targets &&
    l.metadata.targets.includes(targetCode)
  ).length;
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toFixed(n % 1 === 0 ? 0 : 1);
}
