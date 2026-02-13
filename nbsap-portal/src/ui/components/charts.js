/**
 * Simple bar chart component (vanilla JS, no dependencies).
 * Renders horizontal bar charts for province breakdown data.
 */

/**
 * Renders a horizontal bar chart for province breakdown.
 * @param {HTMLElement} container
 * @param {Array<{ province: string, terrestrial_ha: number, marine_ha: number, total_ha: number }>} data
 */
export function renderProvinceChart(container, data) {
  if (!data || data.length === 0) {
    container.innerHTML = '<p style="color:var(--text-light);font-size:13px;padding:10px">No province data available</p>';
    return;
  }

  const maxVal = Math.max(...data.map(d => d.total_ha), 1);

  const rows = data.map(d => {
    const tPct = (d.terrestrial_ha / maxVal * 100).toFixed(1);
    const mPct = (d.marine_ha / maxVal * 100).toFixed(1);

    return `
      <div class="bar-row">
        <span class="bar-label" title="${d.province}">${d.province}</span>
        <div class="bar-track">
          <div class="bar-fill terrestrial" style="width: ${tPct}%; position:absolute; left:0; top:0; height:100%"></div>
          <div class="bar-fill marine" style="width: ${mPct}%; position:absolute; left:${tPct}%; top:0; height:100%"></div>
        </div>
        <span class="bar-value">${formatHa(d.total_ha)}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="chart-container">
      <div style="display:flex;gap:14px;margin-bottom:8px;font-size:11px">
        <span><span style="display:inline-block;width:10px;height:10px;background:var(--primary);border-radius:2px;margin-right:4px"></span>Terrestrial</span>
        <span><span style="display:inline-block;width:10px;height:10px;background:var(--secondary);border-radius:2px;margin-right:4px"></span>Marine</span>
      </div>
      <div class="bar-chart" style="position:relative">
        ${rows}
      </div>
    </div>
  `;

  // Fix stacking by using relative position on bar-track
  container.querySelectorAll('.bar-track').forEach(track => {
    track.style.position = 'relative';
  });
}

/**
 * Renders a simple summary table of province data.
 * @param {HTMLElement} container
 * @param {Array} data
 */
export function renderProvinceTable(container, data) {
  if (!data || data.length === 0) {
    container.innerHTML = '<p style="color:var(--text-light);font-size:13px">No data</p>';
    return;
  }

  const rows = data.map(d => `
    <tr>
      <td>${d.province}</td>
      <td style="text-align:right">${formatHa(d.terrestrial_ha)}</td>
      <td style="text-align:right">${formatHa(d.marine_ha)}</td>
      <td style="text-align:right"><strong>${formatHa(d.total_ha)}</strong></td>
      <td style="text-align:right">${d.features}</td>
    </tr>
  `).join('');

  const totals = data.reduce((acc, d) => ({
    terrestrial_ha: acc.terrestrial_ha + d.terrestrial_ha,
    marine_ha: acc.marine_ha + d.marine_ha,
    total_ha: acc.total_ha + d.total_ha,
    features: acc.features + d.features
  }), { terrestrial_ha: 0, marine_ha: 0, total_ha: 0, features: 0 });

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Province</th>
          <th style="text-align:right">Terrestrial (ha)</th>
          <th style="text-align:right">Marine (ha)</th>
          <th style="text-align:right">Total (ha)</th>
          <th style="text-align:right">Features</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr style="font-weight:600;border-top:2px solid var(--border)">
          <td>Total</td>
          <td style="text-align:right">${formatHa(totals.terrestrial_ha)}</td>
          <td style="text-align:right">${formatHa(totals.marine_ha)}</td>
          <td style="text-align:right">${formatHa(totals.total_ha)}</td>
          <td style="text-align:right">${totals.features}</td>
        </tr>
      </tfoot>
    </table>
  `;
}

function formatHa(val) {
  if (!val && val !== 0) return '-';
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
  return val.toFixed(1);
}
