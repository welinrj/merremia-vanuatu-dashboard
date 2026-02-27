/**
 * KPI Widgets component.
 * Renders target-specific metric dashboards with dissolved (net) area
 * as the primary metric and gross (sum) as secondary for transparency.
 *
 * - T3: 30x30 progress bars with dissolved terrestrial/marine breakdown
 * - T6: Invasive species with species breakdown
 * - All others: General target metrics with net/gross area display
 */
import { compute30x30Metrics, computeGeneralMetrics, computeTargetMetrics, computeTarget1Metrics, computeTarget2Metrics } from '../../gis/areaCalc.js';
import { getAppState, getDashboardLayers } from '../state.js';
import { CATEGORIES } from '../../config/categories.js';
import { categoryIcon, targetIcon } from '../../config/icons.js';
import { resolveColors } from '../../config/symbology.js';
import ENV from '../../config/env.js';

/** Target display metadata — labels, colours, and units */
const TARGET_META = {
  T1:  { label: 'Biodiversity Spatial Planning', color: '#1565C0', unit: 'ha planned' },
  T2:  { label: 'Degraded Areas & Restoration',  color: '#D84315', unit: 'ha mapped' },
  T3:  { label: '30x30 Conservation',            color: '#2E7D32', unit: 'ha conserved' },
  T4:  { label: 'Species & Biodiversity',        color: '#7E57C2', unit: 'species records' },
  T6:  { label: 'Invasive Alien Species',        color: '#C62828', unit: 'ha detected' },
  T7:  { label: 'Pesticide & Herbicide',         color: '#8E24AA', unit: 'ha mapped' },
  T8:  { label: 'Coastal Eutrophication',        color: '#00838F', unit: 'ha impacted' },
  T10: { label: 'Land Cover Change',             color: '#795548', unit: 'ha mapped' },
  T12: { label: 'Blue & Green Spaces',           color: '#388E3C', unit: 'ha mapped' }
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
    } else if (target === 'T2') {
      renderTarget2KPIs(container, layers, filters);
    } else if (target === 'T3') {
      renderTarget3KPIs(container, layers, filters);
    } else if (target === 'T4') {
      renderSpeciesKPIs(container, layers, filters);
    } else if (target === 'T6') {
      renderInvasiveKPIs(container, layers, filters);
    } else if (target === 'T10') {
      renderLandCoverKPIs(container, layers, filters);
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
 * Renders Target 1 (Biodiversity Spatial Planning) KPIs.
 *
 * Shows terrestrial and marine spatial planning coverage.
 * Terrestrial = dissolved T1 terrestrial features / national terrestrial baseline.
 * Marine = dissolved T1 marine features (MPA, LMMA) / national marine baseline.
 */
function renderTarget1KPIs(container, layers, filters) {
  const m = computeTarget1Metrics(layers, filters);
  const baselines = m.baselines;

  const tPct = m.terrestrial_pct;
  const tPctClamped = Math.min(tPct, 100);
  const mPct = m.marine_pct;
  const mPctClamped = Math.min(mPct, 100);

  // Category badges
  const catBadges = m.categoryBreakdown.map(c => {
    const catDef = CATEGORIES[c.category] || { label: c.category, color: '#95a5a6' };
    return `<span class="cat-badge" style="background:${catDef.color}20;color:${catDef.color};border:1px solid ${catDef.color}40">
      ${categoryIcon(c.category, 13)} ${catDef.label}: ${formatNumber(c.area_ha)} ha (${c.features})
    </span>`;
  }).join('');

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.terrestrial_ha)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
        <div class="kpi-sublabel">CCA, KBA, Spatial Plans (dissolved)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${formatNumber(m.marine_ha)}</div>
        <div class="kpi-label">Marine (ha)</div>
        <div class="kpi-sublabel">MPA, LMMA (dissolved)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.totalFeatures}</div>
        <div class="kpi-label">Data Records</div>
        <div class="kpi-sublabel">${m.layerCount} dataset${m.layerCount !== 1 ? 's' : ''}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With spatial plans</div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Terrestrial coverage: ${tPct.toFixed(2)}%</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill terrestrial"
               style="width: ${Math.min(tPctClamped, 100).toFixed(1)}%">
            ${tPct >= 1 ? tPct.toFixed(1) + '%' : ''}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${formatNumber(m.terrestrial_ha)} ha of ${formatNumber(baselines.terrestrial_ha)} ha total terrestrial
        </div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Marine coverage: ${mPct.toFixed(2)}%</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill marine"
               style="width: ${Math.min(mPctClamped, 100).toFixed(1)}%">
            ${mPct >= 1 ? mPct.toFixed(1) + '%' : ''}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${formatNumber(m.marine_ha)} ha of ${formatNumber(baselines.marine_ha)} ha total marine
        </div>
      </div>
    </div>
    ${catBadges ? `<div class="kpi-cat-badges">${catBadges}</div>` : ''}
    <div class="kpi-methodology-note">
      Terrestrial = (CCA + KBA + Spatial Plans + Inland Water) / ${formatNumber(baselines.terrestrial_ha)} ha &times; 100.
      Marine = (MPA + LMMA) / ${formatNumber(baselines.marine_ha)} ha &times; 100.
    </div>
  `;
}

/**
 * Renders Target 2 (Degraded Areas & Restoration) KPIs with restoration progress bar.
 *
 * Shows:
 * - Degraded area total and restoration area total
 * - Restoration progress bar (restoration_ha / degraded_ha * 100)
 * - Terrestrial vs marine/coastal realm breakdown
 * - Per-province restoration progress bars
 * - Category badges (DEGRADED vs RESTORATION)
 */
function renderTarget2KPIs(container, layers, filters) {
  const m = computeTarget2Metrics(layers, filters);

  const restPctClamped = Math.min(m.restoration_pct, 100);
  const totalMapped = m.degraded_ha + m.restoration_ha;

  // Province progress cards — only provinces with degraded data
  const provCards = m.provinceBreakdown
    .filter(p => p.degraded_ha > 0 || p.restoration_ha > 0)
    .map(p => {
      const pPct = p.restoration_pct || 0;
      const pPctClamped = Math.min(pPct, 100);
      return `
        <div class="t2-province-card">
          <div class="t2-province-header">
            <span class="t2-province-name">${p.province}</span>
            <span class="t2-province-pct">${pPct.toFixed(1)}%</span>
          </div>
          <div class="progress-bar-container" style="height:10px;margin-top:4px">
            <div class="progress-bar-fill t2-restoration"
                 style="width: ${pPctClamped.toFixed(1)}%">
            </div>
          </div>
          <div class="t2-province-stats">
            <span>Degraded: ${formatNumber(p.degraded_ha)} ha</span>
            <span>Restored: ${formatNumber(p.restoration_ha)} ha</span>
          </div>
        </div>
      `;
    }).join('');

  // Category badges
  const catBadges = m.categoryBreakdown.map(c => {
    const catDef = CATEGORIES[c.category] || { label: c.category, color: '#95a5a6' };
    return `<span class="cat-badge" style="background:${catDef.color}20;color:${catDef.color};border:1px solid ${catDef.color}40">
      ${categoryIcon(c.category, 13)} ${catDef.label}: ${formatNumber(c.area_ha)} ha (${c.features})
    </span>`;
  }).join('');

  // Status indicator
  const statusColor = m.restoration_pct >= 30 ? '#065f46' : m.restoration_pct >= 10 ? '#b45309' : '#991b1b';
  const statusText = m.restoration_pct >= 30
    ? 'Strong restoration progress'
    : m.restoration_pct >= 10
      ? 'Restoration underway'
      : m.degraded_ha > 0
        ? 'Early stages — more restoration needed'
        : 'No degraded area data uploaded yet';

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card accent-orange">
        <div class="kpi-value" style="color:#D84315">${formatNumber(m.degraded_ha)}</div>
        <div class="kpi-label">Degraded Area (ha)</div>
        <div class="kpi-sublabel">${m.degraded_features} record${m.degraded_features !== 1 ? 's' : ''}</div>
      </div>
      <div class="kpi-card accent-green">
        <div class="kpi-value" style="color:#2E7D32">${formatNumber(m.restoration_ha)}</div>
        <div class="kpi-label">Restoration Area (ha)</div>
        <div class="kpi-sublabel">${m.restoration_features} site${m.restoration_features !== 1 ? 's' : ''}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(totalMapped)}</div>
        <div class="kpi-label">Total Mapped (ha)</div>
        <div class="kpi-sublabel">${m.layerCount} dataset${m.layerCount !== 1 ? 's' : ''}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With T2 data</div>
      </div>

      <div class="kpi-card wide" style="background:var(--surface-alt, #fef7f0);border:1px solid #fed7aa">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-weight:600;font-size:13px;color:#92400e">
            Restoration Progress: ${m.restoration_pct.toFixed(1)}% of degraded area
          </div>
          <div style="font-size:11px;color:${statusColor};font-weight:600">
            ${statusText}
          </div>
        </div>
        <div class="progress-bar-container" style="height:22px">
          <div class="progress-bar-fill t2-restoration"
               style="width: ${restPctClamped.toFixed(1)}%">
            ${m.restoration_pct >= 2 ? m.restoration_pct.toFixed(1) + '%' : ''}
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px;color:var(--text-secondary)">
          <span>${formatNumber(m.restoration_ha)} ha restored of ${formatNumber(m.degraded_ha)} ha degraded</span>
          <span>${m.degraded_ha > m.restoration_ha
            ? formatNumber(m.degraded_ha - m.restoration_ha) + ' ha remaining'
            : 'Target exceeded!'}</span>
        </div>
      </div>

      ${m.realmTotals.degraded_terrestrial_ha > 0 || m.realmTotals.degraded_marine_ha > 0 ? `
        <div class="kpi-card">
          <div class="kpi-value" style="color:#D84315">${formatNumber(m.realmTotals.degraded_terrestrial_ha)}</div>
          <div class="kpi-label">Terrestrial Degraded</div>
          <div class="kpi-sublabel">${formatNumber(m.realmTotals.restoration_terrestrial_ha)} ha restoring</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value marine">${formatNumber(m.realmTotals.degraded_marine_ha)}</div>
          <div class="kpi-label">Marine/Coastal Degraded</div>
          <div class="kpi-sublabel">${formatNumber(m.realmTotals.restoration_marine_ha)} ha restoring</div>
        </div>
      ` : ''}
    </div>

    ${provCards ? `
      <div class="t2-province-breakdown">
        <div class="breakdown-header" style="font-size:13px;font-weight:600;margin:12px 0 8px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Provincial Restoration Progress
        </div>
        <div class="t2-province-grid">${provCards}</div>
      </div>
    ` : ''}

    ${catBadges ? `<div class="kpi-cat-badges">${catBadges}</div>` : ''}

    <div class="kpi-methodology-note">
      Restoration progress = (restoration area &divide; degraded area) &times; 100. Areas dissolved to remove overlaps.
    </div>
  `;
}

function renderTarget3KPIs(container, layers, filters) {
  const m = compute30x30Metrics(layers, filters);
  const baselines = ENV.nationalBaselines;

  const tPctClamped = Math.min(m.terrestrial_pct, 100);
  const mPctClamped = Math.min(m.marine_pct, 100);

  // 30% target amounts in hectares
  const tTarget30Ha = baselines.terrestrial_ha * 0.3;
  const mTarget30Ha = baselines.marine_ha * 0.3;

  // Progress toward 30% target (e.g. 5% of 30% = 16.7% of target achieved)
  const tProgressPct = m.terrestrial_pct > 0 ? (m.terrestrial_pct / 30 * 100) : 0;
  const mProgressPct = m.marine_pct > 0 ? (m.marine_pct / 30 * 100) : 0;

  // Remaining ha to reach 30%
  const tGapHa = Math.max(0, tTarget30Ha - m.terrestrial_ha);
  const mGapHa = Math.max(0, mTarget30Ha - m.marine_ha);

  // Combined totals
  const combinedTotalHa = baselines.terrestrial_ha + baselines.marine_ha;
  const combinedTarget30Ha = combinedTotalHa * 0.3;
  const combinedCurrentHa = m.terrestrial_ha + m.marine_ha;
  const combinedGapHa = Math.max(0, combinedTarget30Ha - combinedCurrentHa);
  const combinedPct = combinedTotalHa > 0 ? (combinedCurrentHa / combinedTotalHa) * 100 : 0;
  const combinedProgressPct = combinedPct > 0 ? (combinedPct / 30 * 100) : 0;

  // Show gross vs net indicator only when they differ
  const tHasOverlap = m.gross_terrestrial_ha > 0 && Math.abs(m.gross_terrestrial_ha - m.terrestrial_ha) > 1;
  const mHasOverlap = m.gross_marine_ha > 0 && Math.abs(m.gross_marine_ha - m.marine_ha) > 1;

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.terrestrial_ha)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${formatNumber(m.marine_ha)}</div>
        <div class="kpi-label">Marine (ha)</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-value" style="color:#065f46">${m.terrestrial_pct.toFixed(2)}%</div>
        <div class="kpi-label">% of Total Land</div>
        <div class="kpi-sublabel">${formatNumber(m.terrestrial_ha)} of ${formatNumber(baselines.terrestrial_ha)} ha</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${m.marine_pct.toFixed(2)}%</div>
        <div class="kpi-label">% of Total Sea</div>
        <div class="kpi-sublabel">${formatNumber(m.marine_ha)} of ${formatNumber(baselines.marine_ha)} ha</div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Terrestrial: ${m.terrestrial_pct.toFixed(2)}% of 30% target (${tProgressPct.toFixed(1)}% achieved)</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill terrestrial"
               style="width: ${Math.min(tProgressPct, 100).toFixed(1)}%">
            ${m.terrestrial_pct >= 1 ? m.terrestrial_pct.toFixed(1) + '%' : ''}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${m.terrestrial_remaining_pct > 0
            ? `${m.terrestrial_remaining_pct.toFixed(2)}% remaining (${formatNumber(tGapHa)} ha needed)`
            : 'Target reached!'}
        </div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Marine: ${m.marine_pct.toFixed(2)}% of 30% target (${mProgressPct.toFixed(1)}% achieved)</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill marine"
               style="width: ${Math.min(mProgressPct, 100).toFixed(1)}%">
            ${m.marine_pct >= 1 ? m.marine_pct.toFixed(1) + '%' : ''}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${m.marine_remaining_pct > 0
            ? `${m.marine_remaining_pct.toFixed(2)}% remaining (${formatNumber(mGapHa)} ha needed)`
            : 'Target reached!'}
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-value">${m.total_features}</div>
        <div class="kpi-label">Data Records</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With conservation areas</div>
      </div>

      <div class="kpi-card wide" style="background:var(--surface-alt, #f0fdf4);border:1px solid #bbf7d0">
        <div style="font-weight:600;font-size:13px;color:#065f46;margin-bottom:8px">
          Combined: ${combinedPct.toFixed(2)}% of Vanuatu's total spatial zone
        </div>
        <div class="progress-bar-container" style="height:20px">
          <div class="progress-bar-fill terrestrial"
               style="width: ${Math.min(combinedProgressPct, 100).toFixed(1)}%;background:linear-gradient(90deg, #065f46, #0ea5e9)">
            ${combinedPct >= 0.5 ? combinedPct.toFixed(1) + '%' : ''}
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px;color:var(--text-secondary)">
          <span>${formatNumber(combinedCurrentHa)} ha conserved of ${formatNumber(combinedTotalHa)} ha total</span>
          <span>30% target = ${formatNumber(combinedTarget30Ha)} ha</span>
        </div>
        <div style="margin-top:6px;font-size:12px;font-weight:500;color:${combinedProgressPct >= 100 ? '#065f46' : '#b45309'}">
          ${combinedGapHa > 0
            ? `${formatNumber(combinedGapHa)} ha remaining to reach 30% (${combinedProgressPct.toFixed(1)}% of target achieved)`
            : 'Target reached!'}
        </div>
      </div>
    </div>

    <div class="kpi-methodology-note">
      National baselines: ${formatNumber(baselines.terrestrial_ha)} ha terrestrial, ${formatNumber(baselines.marine_ha)} ha marine.
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
          ${categoryIcon('SPECIES_DIST', 13)} Other Species: ${formatNumber(otherDist.area_ha)} ha (${otherDist.features})
        </span>
      </div>
    ` : ''}
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
        <div class="kpi-sublabel">${m.totalFeatures} detections</div>
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
 * Renders Target 10 (Land Cover Change) KPIs with Land_Use_P breakdown.
 * Reuses the typeBreakdown already computed by computeTargetMetrics()
 * instead of re-iterating all features — critical for large datasets.
 */
function renderLandCoverKPIs(container, layers, filters) {
  const m = computeTargetMetrics(layers, 'T10', filters);

  const hasOverlap = m.grossAreaHa > 0 && Math.abs(m.grossAreaHa - m.totalAreaHa) > 1;

  // Use the type breakdown already aggregated in computeTargetMetrics()
  // (keyed by feature.properties.type / name — same as Land_Use_P mapping)
  const landUseBreakdown = m.typeBreakdown;
  const uniqueTypes = landUseBreakdown.length;

  // Build land use breakdown table rows — cap at 25 to avoid massive DOM
  // Use same colours as the map (symbology-resolved per type)
  const MAX_LU_ROWS = 25;
  const displayRows = landUseBreakdown.slice(0, MAX_LU_ROWS);
  const hiddenCount = landUseBreakdown.length - displayRows.length;
  const luRows = displayRows.map((lu) => {
    const colors = resolveColors('LAND_COVER', lu.type);
    const color = colors.fill;
    const pct = m.grossAreaHa > 0 ? (lu.area_ha / m.grossAreaHa * 100) : 0;
    return `
      <tr>
        <td>
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${color};margin-right:6px"></span>
          ${lu.type}
        </td>
        <td style="text-align:right">${formatNumber(lu.area_ha)}</td>
        <td style="text-align:right">${pct.toFixed(1)}%</td>
        <td style="text-align:right">${lu.features}</td>
      </tr>
    `;
  }).join('') + (hiddenCount > 0 ? `<tr><td colspan="4" style="text-align:center;color:var(--text-tertiary);font-size:11px">+ ${hiddenCount} more types</td></tr>` : '');

  const totalRow = `
    <tr style="font-weight:600;border-top:2px solid var(--border)">
      <td>Total</td>
      <td style="text-align:right">${formatNumber(m.grossAreaHa)}</td>
      <td style="text-align:right">100%</td>
      <td style="text-align:right">${m.totalFeatures}</td>
    </tr>
  `;

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.totalAreaHa)}</div>
        <div class="kpi-label">Total Area (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.totalFeatures}</div>
        <div class="kpi-label">Data Records</div>
        <div class="kpi-sublabel">${m.layerCount} dataset${m.layerCount !== 1 ? 's' : ''}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${uniqueTypes}</div>
        <div class="kpi-label">Land Use Types</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With land cover data</div>
      </div>
    </div>
    ${landUseBreakdown.length > 0 ? `
      <div class="kpi-type-breakdown">
        <div class="breakdown-header" style="font-size:12px;margin:10px 0 6px">
          Land Use Breakdown
        </div>
        <table class="data-table compact">
          <thead><tr><th>Land Use Type</th><th style="text-align:right">Area (ha)</th><th style="text-align:right">%</th><th style="text-align:right">Count</th></tr></thead>
          <tbody>${luRows}${totalRow}</tbody>
        </table>
      </div>
    ` : ''}
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
      ${categoryIcon(c.category, 13)} ${catDef.label}: ${formatNumber(c.area_ha)} ha (${c.features})
    </span>`;
  }).join('');

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.totalAreaHa)}</div>
        <div class="kpi-label">Total Area (ha)</div>
        <div class="kpi-sublabel">${meta.unit}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${m.totalFeatures}</div>
        <div class="kpi-label">Data Records</div>
        <div class="kpi-sublabel">${m.layerCount} dataset${m.layerCount !== 1 ? 's' : ''}</div>
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
        <div class="kpi-label">Data Records</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${formatNumber(m.totalAreaHa)}</div>
        <div class="kpi-label">Total Area (ha)</div>
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
