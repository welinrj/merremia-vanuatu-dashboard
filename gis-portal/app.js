// ═══════════════════════════════════════════════════════
// VCAP2 GIS Data Portal — Main Application
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
    },
    map: {
      center: [-15.3767, 166.9592],
      zoom: 7,
      minZoom: 3,
      maxZoom: 18
    }
  };

  // ── State ──
  let map = null;
  let datasets = [];
  let layers = {};
  let activeDatasetId = null;

  // ── Basemaps ──
  const basemaps = {
    dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd', maxZoom: 20
    }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri', maxZoom: 19
    }),
    streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors', maxZoom: 19
    })
  };

  // ── Initialize ──
  function init() {
    initMap();
    initUpload();
    loadFromGitHub();
    setStatus('Ready');
  }

  function initMap() {
    map = L.map('map', {
      center: CONFIG.map.center,
      zoom: CONFIG.map.zoom,
      minZoom: CONFIG.map.minZoom,
      maxZoom: CONFIG.map.maxZoom,
      zoomControl: true
    });
    basemaps.dark.addTo(map);

    // Basemap control
    L.control.layers({
      'Dark': basemaps.dark,
      'Satellite': basemaps.satellite,
      'Streets': basemaps.streets
    }, null, { position: 'topright' }).addTo(map);

    // Scale bar
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    // Mouse position
    map.on('mousemove', function(e) {
      document.getElementById('status-coords').textContent =
        'Lat: ' + e.latlng.lat.toFixed(5) + ' Lng: ' + e.latlng.lng.toFixed(5);
    });
  }

  // ── GitHub Data Loading ──
  async function loadFromGitHub() {
    setStatus('Loading datasets from GitHub...');
    try {
      const url = 'https://api.github.com/repos/' + CONFIG.github.owner + '/' +
        CONFIG.github.repo + '/contents/' + CONFIG.github.dataPath + '/index.json?ref=' + CONFIG.github.branch;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Could not load index.json (HTTP ' + resp.status + ')');
      const file = await resp.json();
      const content = JSON.parse(decodeURIComponent(escape(atob(file.content))));

      if (content.datasets && content.datasets.length > 0) {
        for (const ds of content.datasets) {
          await loadDatasetFromGitHub(ds);
        }
        setStatus(datasets.length + ' dataset(s) loaded from GitHub');
        showToast(datasets.length + ' dataset(s) loaded', 'success');
      } else {
        setStatus('No datasets found in catalog');
      }
    } catch (err) {
      console.warn('GitHub load:', err.message);
      // Try loading sample data directly
      try {
        const resp = await fetch('data/sample-marine-areas.geojson');
        if (resp.ok) {
          const geojson = await resp.json();
          addDataset('Vanuatu Marine Conservation Areas', geojson, 'sample-marine-areas');
          setStatus('Sample data loaded (local fallback)');
        } else {
          setStatus('No data available — upload GIS files to get started');
        }
      } catch (e) {
        setStatus('Ready — upload GIS files to get started');
      }
    }
    updateDatasetList();
  }

  async function loadDatasetFromGitHub(ds) {
    try {
      const url = 'https://api.github.com/repos/' + CONFIG.github.owner + '/' +
        CONFIG.github.repo + '/contents/' + CONFIG.github.dataPath + '/' + ds.filename +
        '?ref=' + CONFIG.github.branch;
      const resp = await fetch(url);
      if (!resp.ok) return;
      const file = await resp.json();
      const geojson = JSON.parse(decodeURIComponent(escape(atob(file.content))));
      addDataset(ds.name || ds.filename, geojson, ds.id, ds);
    } catch (err) {
      console.warn('Failed to load dataset:', ds.filename, err);
    }
  }

  // ── Dataset Management ──
  function addDataset(name, geojson, id, meta) {
    if (!geojson || !geojson.features) return;
    id = id || Date.now().toString(36);

    // Remove if exists
    const existing = datasets.findIndex(d => d.id === id);
    if (existing >= 0) {
      if (layers[id]) { map.removeLayer(layers[id]); delete layers[id]; }
      datasets.splice(existing, 1);
    }

    // Determine style based on feature properties
    const layer = L.geoJSON(geojson, {
      style: function(feature) {
        const status = (feature.properties.status || '').toLowerCase();
        let color = '#10b981';
        if (status === 'proposed') color = '#f59e0b';
        else if (status === 'inactive') color = '#ef4444';
        return { color: color, weight: 2, fillColor: color, fillOpacity: 0.2 };
      },
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, { radius: 7, fillColor: '#10b981', fillOpacity: 0.7, color: '#065f46', weight: 2 });
      },
      onEachFeature: function(feature, layer) {
        if (feature.properties) {
          const props = feature.properties;
          let html = '<div style="font-family:sans-serif;max-width:280px">';
          html += '<h4 style="margin:0 0 6px;color:#065f46;font-size:14px">' + (props.name || 'Feature') + '</h4>';
          const keys = Object.keys(props).filter(k => k !== 'name' && k !== 'description');
          if (keys.length > 0) {
            html += '<table style="font-size:12px;border-collapse:collapse;width:100%">';
            keys.forEach(k => {
              html += '<tr><td style="padding:2px 8px 2px 0;color:#64748b;font-weight:600;white-space:nowrap">' +
                formatKey(k) + '</td><td style="padding:2px 0;color:#1e293b">' + props[k] + '</td></tr>';
            });
            html += '</table>';
          }
          if (props.description) {
            html += '<p style="margin:6px 0 0;font-size:11px;color:#64748b;line-height:1.4">' + props.description + '</p>';
          }
          html += '</div>';
          layer.bindPopup(html, { maxWidth: 300 });
        }
      }
    });

    layer.addTo(map);
    layers[id] = layer;

    const featureCount = geojson.features.length;
    datasets.push({
      id: id,
      name: name,
      features: featureCount,
      geojson: geojson,
      meta: meta || {},
      created: new Date().toISOString()
    });

    updateDatasetList();
    return id;
  }

  function removeDataset(id) {
    if (layers[id]) { map.removeLayer(layers[id]); delete layers[id]; }
    datasets = datasets.filter(d => d.id !== id);
    if (activeDatasetId === id) activeDatasetId = null;
    updateDatasetList();
    closeAttrPanel();
    showToast('Dataset removed', 'info');
  }

  function zoomToDataset(id) {
    if (layers[id]) {
      map.fitBounds(layers[id].getBounds(), { padding: [40, 40] });
    }
  }

  function toggleDataset(id) {
    if (layers[id]) {
      if (map.hasLayer(layers[id])) {
        map.removeLayer(layers[id]);
      } else {
        layers[id].addTo(map);
      }
    }
  }

  function showAttributes(id) {
    const ds = datasets.find(d => d.id === id);
    if (!ds || !ds.geojson || !ds.geojson.features.length) return;

    activeDatasetId = id;
    const features = ds.geojson.features;
    const allKeys = new Set();
    features.forEach(f => {
      if (f.properties) Object.keys(f.properties).forEach(k => allKeys.add(k));
    });
    const keys = [...allKeys].filter(k => k !== 'description');

    const thead = document.getElementById('attr-thead');
    const tbody = document.getElementById('attr-tbody');
    document.getElementById('attr-title').textContent = ds.name + ' (' + features.length + ' features)';

    thead.innerHTML = '<tr>' + keys.map(k => '<th>' + formatKey(k) + '</th>').join('') + '</tr>';
    tbody.innerHTML = features.map(f => {
      return '<tr>' + keys.map(k => '<td>' + (f.properties[k] != null ? f.properties[k] : '') + '</td>').join('') + '</tr>';
    }).join('');

    document.getElementById('attr-panel').classList.add('open');
  }

  function downloadDataset(id) {
    const ds = datasets.find(d => d.id === id);
    if (!ds) return;
    const blob = new Blob([JSON.stringify(ds.geojson, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (ds.name || 'dataset').replace(/\s+/g, '-').toLowerCase() + '.geojson';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Downloaded ' + ds.name, 'success');
  }

  // ── File Upload ──
  function initUpload() {
    const zone = document.getElementById('upload-zone');
    const input = document.getElementById('file-input');

    zone.addEventListener('click', function() { input.click(); });
    input.addEventListener('change', function() { handleFiles(input.files); input.value = ''; });

    zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', function() { zone.classList.remove('dragover'); });
    zone.addEventListener('drop', function(e) {
      e.preventDefault();
      zone.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });
  }

  async function handleFiles(files) {
    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      try {
        if (ext === 'geojson' || ext === 'json') {
          const text = await readFileText(file);
          const geojson = JSON.parse(text);
          if (geojson.type === 'FeatureCollection' || geojson.type === 'Feature') {
            const fc = geojson.type === 'Feature' ? { type: 'FeatureCollection', features: [geojson] } : geojson;
            addDataset(file.name.replace(/\.\w+$/, ''), fc);
            showToast('Loaded ' + file.name + ' (' + fc.features.length + ' features)', 'success');
          } else {
            showToast('Invalid GeoJSON: ' + file.name, 'error');
          }
        } else if (ext === 'kml') {
          const text = await readFileText(file);
          const geojson = kmlToGeoJSON(text);
          if (geojson.features.length > 0) {
            addDataset(file.name.replace(/\.\w+$/, ''), geojson);
            showToast('Loaded ' + file.name + ' (' + geojson.features.length + ' features)', 'success');
          } else {
            showToast('No features found in KML', 'error');
          }
        } else if (ext === 'zip') {
          setStatus('Processing Shapefile .zip...');
          const buffer = await readFileArrayBuffer(file);
          const result = await shp(buffer);
          // shp() returns a FeatureCollection or array of FeatureCollections
          if (Array.isArray(result)) {
            result.forEach(function(fc, i) {
              if (fc && fc.features && fc.features.length > 0) {
                var layerName = fc.fileName || (file.name.replace(/\.zip$/i, '') + (result.length > 1 ? '-' + i : ''));
                addDataset(layerName, fc);
                showToast('Loaded ' + layerName + ' (' + fc.features.length + ' features)', 'success');
              }
            });
          } else if (result && result.features) {
            addDataset(file.name.replace(/\.zip$/i, ''), result);
            showToast('Loaded ' + file.name + ' (' + result.features.length + ' features)', 'success');
          } else {
            showToast('No features found in Shapefile', 'error');
          }
          setStatus('Ready');
        } else {
          showToast('Unsupported format: .' + ext, 'error');
        }
      } catch (err) {
        showToast('Error reading ' + file.name + ': ' + err.message, 'error');
      }
    }
  }

  function readFileText(file) {
    return new Promise(function(resolve, reject) {
      const reader = new FileReader();
      reader.onload = function() { resolve(reader.result); };
      reader.onerror = function() { reject(reader.error); };
      reader.readAsText(file);
    });
  }

  function readFileArrayBuffer(file) {
    return new Promise(function(resolve, reject) {
      const reader = new FileReader();
      reader.onload = function() { resolve(reader.result); };
      reader.onerror = function() { reject(reader.error); };
      reader.readAsArrayBuffer(file);
    });
  }

  // ── Simple KML parser ──
  function kmlToGeoJSON(kmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(kmlText, 'text/xml');
    const features = [];

    doc.querySelectorAll('Placemark').forEach(function(pm) {
      const name = pm.querySelector('name') ? pm.querySelector('name').textContent : '';
      const desc = pm.querySelector('description') ? pm.querySelector('description').textContent : '';
      const props = { name: name, description: desc };

      // Extract SimpleData / ExtendedData
      pm.querySelectorAll('SimpleData').forEach(function(sd) {
        props[sd.getAttribute('name')] = sd.textContent;
      });

      // Point
      const point = pm.querySelector('Point coordinates');
      if (point) {
        const parts = point.textContent.trim().split(',');
        features.push({ type: 'Feature', properties: props, geometry: { type: 'Point', coordinates: [parseFloat(parts[0]), parseFloat(parts[1])] } });
        return;
      }

      // LineString
      const line = pm.querySelector('LineString coordinates');
      if (line) {
        const coords = line.textContent.trim().split(/\s+/).map(function(c) {
          var p = c.split(','); return [parseFloat(p[0]), parseFloat(p[1])];
        });
        features.push({ type: 'Feature', properties: props, geometry: { type: 'LineString', coordinates: coords } });
        return;
      }

      // Polygon
      const poly = pm.querySelector('Polygon outerBoundaryIs LinearRing coordinates');
      if (poly) {
        const coords = poly.textContent.trim().split(/\s+/).map(function(c) {
          var p = c.split(','); return [parseFloat(p[0]), parseFloat(p[1])];
        });
        features.push({ type: 'Feature', properties: props, geometry: { type: 'Polygon', coordinates: [coords] } });
      }
    });

    return { type: 'FeatureCollection', features: features };
  }

  // ── UI Updates ──
  function updateDatasetList() {
    const list = document.getElementById('dataset-list');
    const empty = document.getElementById('empty-state');
    const count = document.getElementById('dataset-count');

    count.textContent = datasets.length + ' dataset' + (datasets.length !== 1 ? 's' : '');

    if (datasets.length === 0) {
      list.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    list.innerHTML = datasets.map(function(ds) {
      return '<div class="dataset-item' + (activeDatasetId === ds.id ? ' active' : '') + '" onclick="window._portal.zoomTo(\'' + ds.id + '\')">' +
        '<div class="ds-name">' + escapeHtml(ds.name) + '</div>' +
        '<div class="ds-meta">' +
          '<span>' + ds.features + ' features</span>' +
          '<span>' + (ds.meta.tags ? ds.meta.tags.join(', ') : '') + '</span>' +
        '</div>' +
        '<div class="dataset-actions">' +
          '<button class="ds-btn" onclick="event.stopPropagation();window._portal.attrs(\'' + ds.id + '\')">Table</button>' +
          '<button class="ds-btn" onclick="event.stopPropagation();window._portal.download(\'' + ds.id + '\')">Download</button>' +
          '<button class="ds-btn" onclick="event.stopPropagation();window._portal.toggle(\'' + ds.id + '\')">Toggle</button>' +
          '<button class="ds-btn danger" onclick="event.stopPropagation();window._portal.remove(\'' + ds.id + '\')">Remove</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // ── Utilities ──
  function formatKey(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function setStatus(msg) {
    document.getElementById('status-text').textContent = msg;
  }

  function showToast(msg, type) {
    var el = document.createElement('div');
    el.className = 'toast toast-' + (type || 'info');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function() { el.remove(); }, 3500);
  }

  // ── Global API (for onclick handlers) ──
  window._portal = {
    zoomTo: zoomToDataset,
    remove: removeDataset,
    attrs: showAttributes,
    download: downloadDataset,
    toggle: toggleDataset
  };
  window.closeAttrPanel = function() {
    document.getElementById('attr-panel').classList.remove('open');
  };

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
