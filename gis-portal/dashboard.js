// ═══════════════════════════════════════════════════════
// VCAP2 GIS Dashboard — Analytics & Data Management
// ═══════════════════════════════════════════════════════

(function() {
  'use strict';

  // ── Configuration ──
  const CONFIG = {
    github: {
      owner: 'welinrj',
      repo: 'merremia-vanuatu-dashboard',
      branch: 'main',
      dataPath: 'gis-portal/data'
    }
  };

  let coverageMap = null;
  let charts = {};

  // ── Initialize ──
  async function init() {
    initCoverageMap();
    await loadData();
  }

  function initCoverageMap() {
    coverageMap = L.map('coverage-map', {
      center: [-15.3767, 166.9592],
      zoom: 7,
      zoomControl: true
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OSM &copy; CARTO', subdomains: 'abcd', maxZoom: 20
    }).addTo(coverageMap);
  }

  // ── Load Data ──
  async function loadData() {
    let allFeatures = [];
    let datasetInfos = [];

    try {
      // Try GitHub API first
      const url = 'https://api.github.com/repos/' + CONFIG.github.owner + '/' +
        CONFIG.github.repo + '/contents/' + CONFIG.github.dataPath + '/index.json?ref=' + CONFIG.github.branch;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const file = await resp.json();
      const catalog = JSON.parse(decodeURIComponent(escape(atob(file.content))));

      for (const ds of catalog.datasets) {
        try {
          const dsUrl = 'https://api.github.com/repos/' + CONFIG.github.owner + '/' +
            CONFIG.github.repo + '/contents/' + CONFIG.github.dataPath + '/' + ds.filename + '?ref=' + CONFIG.github.branch;
          const dsResp = await fetch(dsUrl);
          if (!dsResp.ok) continue;
          const dsFile = await dsResp.json();
          const geojson = JSON.parse(decodeURIComponent(escape(atob(dsFile.content))));
          allFeatures = allFeatures.concat(geojson.features || []);
          datasetInfos.push({ name: ds.name, features: (geojson.features || []).length, meta: ds, geojson: geojson });
        } catch (e) {
          console.warn('Failed to load dataset:', ds.filename, e);
        }
      }
    } catch (err) {
      console.warn('GitHub load failed, trying local:', err.message);
      // Fallback to local
      try {
        const resp = await fetch('data/sample-marine-areas.geojson');
        if (resp.ok) {
          const geojson = await resp.json();
          allFeatures = geojson.features || [];
          datasetInfos.push({ name: geojson.name || 'Sample Data', features: allFeatures.length, meta: {}, geojson: geojson });
        }
      } catch (e) {
        console.warn('Local load failed:', e);
      }
    }

    renderStats(allFeatures, datasetInfos);
    renderCharts(allFeatures, datasetInfos);
    renderCoverage(allFeatures);
    renderTable(datasetInfos);
    renderActivity(datasetInfos);
  }

  // ── Stats ──
  function renderStats(features, datasets) {
    document.getElementById('stat-datasets').textContent = datasets.length;
    document.getElementById('stat-datasets-sub').textContent = datasets.length + ' in catalog';

    document.getElementById('stat-features').textContent = features.length;
    document.getElementById('stat-features-sub').textContent = 'across ' + datasets.length + ' dataset' + (datasets.length !== 1 ? 's' : '');

    let totalArea = 0;
    const provinces = new Set();
    features.forEach(function(f) {
      if (f.properties) {
        totalArea += (f.properties.area_ha || f.properties.estimatedArea || 0);
        if (f.properties.province) provinces.add(f.properties.province);
      }
    });

    document.getElementById('stat-area').textContent = totalArea.toLocaleString(undefined, { maximumFractionDigits: 1 });
    document.getElementById('stat-provinces').textContent = provinces.size || '--';
  }

  // ── Charts ──
  function renderCharts(features, datasets) {
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

    // Features by dataset
    if (charts.features) charts.features.destroy();
    charts.features = new Chart(document.getElementById('chart-features'), {
      type: 'bar',
      data: {
        labels: datasets.map(function(d) { return d.name.length > 25 ? d.name.slice(0, 25) + '...' : d.name; }),
        datasets: [{ label: 'Features', data: datasets.map(function(d) { return d.features; }), backgroundColor: colors.slice(0, datasets.length), borderRadius: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { color: '#64748b', font: { size: 11 } }, grid: { color: '#e2e8f0' } }, x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } } }
      }
    });

    // Area distribution (doughnut)
    const areaByName = {};
    features.forEach(function(f) {
      var name = f.properties.name || 'Unknown';
      areaByName[name] = (areaByName[name] || 0) + (f.properties.area_ha || 0);
    });
    const areaLabels = Object.keys(areaByName);
    const areaValues = Object.values(areaByName);

    if (charts.area) charts.area.destroy();
    charts.area = new Chart(document.getElementById('chart-area'), {
      type: 'doughnut',
      data: {
        labels: areaLabels,
        datasets: [{ data: areaValues, backgroundColor: colors.slice(0, areaLabels.length), borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { font: { size: 10 }, color: '#64748b', boxWidth: 12 } } }
      }
    });

    // Status breakdown
    const statusCount = {};
    features.forEach(function(f) {
      var status = f.properties.status || 'Unknown';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    const statusColors = { 'Active': '#10b981', 'Proposed': '#f59e0b', 'Inactive': '#ef4444', 'Unknown': '#94a3b8' };

    if (charts.status) charts.status.destroy();
    charts.status = new Chart(document.getElementById('chart-status'), {
      type: 'pie',
      data: {
        labels: Object.keys(statusCount),
        datasets: [{ data: Object.values(statusCount), backgroundColor: Object.keys(statusCount).map(function(s) { return statusColors[s] || '#94a3b8'; }), borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { font: { size: 11 }, color: '#64748b', boxWidth: 12 } } }
      }
    });

    // Biodiversity index bar chart
    const bioData = features.filter(function(f) { return f.properties.biodiversity_index; })
      .map(function(f) { return { name: f.properties.name || 'Unknown', value: f.properties.biodiversity_index }; })
      .sort(function(a, b) { return b.value - a.value; });

    if (charts.bio) charts.bio.destroy();
    charts.bio = new Chart(document.getElementById('chart-bio'), {
      type: 'bar',
      data: {
        labels: bioData.map(function(d) { return d.name.length > 20 ? d.name.slice(0, 20) + '...' : d.name; }),
        datasets: [{ label: 'Index', data: bioData.map(function(d) { return d.value; }),
          backgroundColor: bioData.map(function(d) { return d.value >= 8 ? '#10b981' : d.value >= 6 ? '#f59e0b' : '#ef4444'; }),
          borderRadius: 4 }]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, max: 10, ticks: { color: '#64748b', font: { size: 11 } }, grid: { color: '#e2e8f0' } }, y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } } }
      }
    });
  }

  // ── Coverage Map ──
  function renderCoverage(features) {
    if (!coverageMap) return;
    const fc = { type: 'FeatureCollection', features: features };
    const layer = L.geoJSON(fc, {
      style: function(feature) {
        var status = (feature.properties.status || '').toLowerCase();
        var color = status === 'active' ? '#10b981' : status === 'proposed' ? '#f59e0b' : '#94a3b8';
        return { color: color, weight: 2, fillColor: color, fillOpacity: 0.3 };
      },
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, { radius: 6, fillColor: '#10b981', fillOpacity: 0.7, color: '#065f46', weight: 2 });
      },
      onEachFeature: function(feature, layer) {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup('<strong>' + feature.properties.name + '</strong><br>' +
            (feature.properties.area_ha ? feature.properties.area_ha + ' ha' : '') +
            (feature.properties.status ? ' &mdash; ' + feature.properties.status : ''));
        }
      }
    });
    layer.addTo(coverageMap);
    if (features.length > 0) {
      try { coverageMap.fitBounds(layer.getBounds(), { padding: [30, 30] }); } catch (e) {}
    }
  }

  // ── Dataset Table ──
  function renderTable(datasets) {
    var tbody = document.getElementById('ds-table-body');
    if (datasets.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:2rem">No datasets found</td></tr>';
      return;
    }

    tbody.innerHTML = datasets.map(function(ds) {
      var totalArea = 0;
      var statuses = {};
      if (ds.geojson && ds.geojson.features) {
        ds.geojson.features.forEach(function(f) {
          totalArea += (f.properties.area_ha || 0);
          var s = f.properties.status || 'Unknown';
          statuses[s] = (statuses[s] || 0) + 1;
        });
      }
      var statusHtml = Object.entries(statuses).map(function(e) {
        var cls = e[0] === 'Active' ? 'badge-green' : 'badge-amber';
        return '<span class="badge ' + cls + '">' + e[1] + ' ' + e[0] + '</span>';
      }).join(' ');

      return '<tr>' +
        '<td style="font-weight:600">' + (ds.name || '--') + '</td>' +
        '<td>' + ds.features + '</td>' +
        '<td>' + totalArea.toLocaleString(undefined, { maximumFractionDigits: 1 }) + '</td>' +
        '<td>' + statusHtml + '</td>' +
        '<td style="color:#94a3b8;font-size:0.72rem">' + (ds.meta.updated ? new Date(ds.meta.updated).toLocaleDateString() : '--') + '</td>' +
      '</tr>';
    }).join('');
  }

  // ── Activity Feed ──
  function renderActivity(datasets) {
    var feed = document.getElementById('activity-feed');
    var items = [];

    datasets.forEach(function(ds) {
      items.push({
        text: 'Dataset "' + ds.name + '" loaded (' + ds.features + ' features)',
        time: ds.meta.updated || ds.meta.created || new Date().toISOString()
      });
    });

    items.push({ text: 'Dashboard initialized', time: new Date().toISOString() });
    items.push({ text: 'Portal connected to GitHub repository', time: new Date().toISOString() });

    items.sort(function(a, b) { return new Date(b.time) - new Date(a.time); });

    feed.innerHTML = items.slice(0, 10).map(function(item) {
      return '<div class="activity-item">' +
        '<div class="activity-dot"></div>' +
        '<div><div class="activity-text">' + item.text + '</div>' +
        '<div class="activity-time">' + new Date(item.time).toLocaleString() + '</div></div></div>';
    }).join('');
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
