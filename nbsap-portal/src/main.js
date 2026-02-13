/**
 * Main application entry point.
 * Initializes the app shell, loads demo data, and wires up tab navigation.
 */
import 'leaflet/dist/leaflet.css';
import './ui/styles/main.css';

import { listLayers, saveLayer } from './services/storage/index.js';
import { getAppState, setLayers, setProvincesGeojson, addLayer } from './ui/state.js';
import { isAdmin } from './services/auth/index.js';
import { initDashboard, refreshDashboard, onDashboardShow } from './pages/dashboard.js';
import { initDataPortal, refreshPortal } from './pages/dataPortal.js';
import { initAdmin, renderAdminPage } from './pages/admin.js';
import { initAbout } from './pages/about.js';
import { computeFeatureAreas } from './gis/areaCalc.js';
import { createLayerMetadata } from './core/schema.js';
import ENV from './config/env.js';

// Fix Leaflet default icon paths for bundled builds
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow
});

let activeTab = 'dashboard';

/**
 * Bootstraps the application.
 */
async function init() {
  // Load provinces boundary data (served from public/data/)
  try {
    const base = import.meta.env.BASE_URL || './';
    const resp = await fetch(`${base}data/provinces.geojson`);
    const provinces = await resp.json();
    setProvincesGeojson(provinces);
  } catch (err) {
    console.warn('Failed to load provinces data:', err);
  }

  // Load layers from IndexedDB
  try {
    const stored = await listLayers();
    if (stored.length > 0) {
      setLayers(stored);
    } else {
      // Load demo data on first run
      await loadDemoData();
    }
  } catch (err) {
    console.warn('Failed to load stored layers:', err);
    await loadDemoData();
  }

  // Initialize all pages
  initDashboard();
  initDataPortal();
  initAdmin();
  initAbout();

  // Wire up tab navigation
  setupNavigation();

  // Listen for refresh events
  window.addEventListener('nbsap:refresh', () => {
    if (activeTab === 'dashboard') refreshDashboard();
    if (activeTab === 'portal') refreshPortal();
    if (activeTab === 'admin') renderAdminPage();
    updateNavAuthBadge();
  });

  // Show dashboard by default
  showTab('dashboard');
}

/**
 * Loads demo CCA and MPA layers.
 */
async function loadDemoData() {
  const base = import.meta.env.BASE_URL || './';
  const demos = [
    { file: 'demo_cca.geojson', name: 'Demo CCAs', category: 'CCA', realm: 'terrestrial' },
    { file: 'demo_mpa.geojson', name: 'Demo MPAs', category: 'MPA', realm: 'marine' }
  ];

  for (const demo of demos) {
    try {
      const resp = await fetch(`${base}data/${demo.file}`);
      const geojson = await resp.json();

      // Compute areas
      const withAreas = computeFeatureAreas(geojson);

      const meta = createLayerMetadata({
        name: demo.name,
        originalFilename: demo.file,
        category: demo.category,
        targets: ['T3'],
        realm: demo.realm,
        countsToward30x30: true,
        detectedCRS: 'EPSG:4326',
        featureCount: withAreas.features.length,
        validGeometryCount: withAreas.features.length,
        totalAreaHa: withAreas.features.reduce((s, f) => s + (f.properties.area_ha || 0), 0),
        status: 'Clean',
        uploadedBy: 'system'
      });

      const record = { id: meta.id, metadata: meta, geojson: withAreas };
      await saveLayer(record);
      addLayer(record);
    } catch (err) {
      console.warn(`Failed to load demo data ${demo.name}:`, err);
    }
  }
}

/**
 * Sets up tab navigation.
 */
function setupNavigation() {
  document.querySelectorAll('.navbar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      showTab(tab.dataset.tab);
    });
  });
}

/**
 * Shows a tab and hides others.
 */
function showTab(tabId) {
  activeTab = tabId;

  // Update tab buttons
  document.querySelectorAll('.navbar-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });

  // Update pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.toggle('active', page.id === `page-${tabId}`);
  });

  // Trigger page-specific activation
  if (tabId === 'dashboard') onDashboardShow();
  if (tabId === 'portal') refreshPortal();
  if (tabId === 'admin') renderAdminPage();
}

/**
 * Updates the auth badge display.
 */
function updateNavAuthBadge() {
  const badge = document.getElementById('auth-badge');
  if (badge) {
    if (isAdmin()) {
      badge.textContent = 'Admin';
      badge.classList.add('admin');
    } else {
      badge.textContent = 'Public';
      badge.classList.remove('admin');
    }
  }
}

// Start the app
init().catch(err => {
  console.error('App initialization failed:', err);
  document.body.innerHTML = `<div style="padding:40px;text-align:center">
    <h2>Failed to initialize</h2>
    <p>${err.message}</p>
  </div>`;
});
