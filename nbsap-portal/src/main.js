/**
 * Main application entry point.
 * Initializes the app shell, loads demo data, and wires up tab navigation.
 */
import { listLayers, saveLayer, getSetting } from './services/storage/index.js';
import { getAppState, setLayers, setProvincesGeojson, addLayer, setLayerTracker } from './ui/state.js';
import { isAdmin } from './services/auth/index.js';
import { initDashboard, refreshDashboard, onDashboardShow } from './pages/dashboard.js';
import { initDataPortal, refreshPortal } from './pages/dataPortal.js';
import { initAdmin, renderAdminPage } from './pages/admin.js';
import { initAbout } from './pages/about.js';
import { computeFeatureAreas } from './gis/areaCalc.js';
import { createLayerMetadata } from './core/schema.js';
import ENV from './config/env.js';

// Fix Leaflet default icon paths (use CDN URLs for universal compatibility)
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

let activeTab = 'dashboard';

/** Safe accessor for Vite's BASE_URL (returns './' outside Vite) */
function getBaseUrl() {
  try {
    return (import.meta.env && import.meta.env.BASE_URL) || './';
  } catch {
    return './';
  }
}

/**
 * Bootstraps the application.
 * Pages render FIRST (synchronous), then data loads asynchronously.
 */
async function init() {
  // 1. Initialize all pages immediately so UI is visible
  initDashboard();
  initDataPortal();
  initAdmin();
  initAbout();

  // Signal that the app JS has loaded (clears timeout fallback)
  window.__nbsapLoaded = true;

  // 2. Wire up tab navigation
  setupNavigation();

  // 3. Listen for refresh events
  window.addEventListener('nbsap:refresh', () => {
    if (activeTab === 'dashboard') refreshDashboard();
    if (activeTab === 'portal') refreshPortal();
    if (activeTab === 'admin') renderAdminPage();
    updateNavAuthBadge();
  });

  // 4. Show dashboard by default
  showTab('dashboard');

  // 5. Load data asynchronously (UI already visible)
  await loadAppData();
}

/**
 * Loads provinces and layer data, then refreshes the UI.
 */
async function loadAppData() {
  const base = getBaseUrl();

  // Load provinces boundary data
  try {
    const resp = await fetch(`${base}data/provinces.geojson`);
    if (resp.ok) {
      const provinces = await resp.json();
      setProvincesGeojson(provinces);
    }
  } catch (err) {
    console.warn('Failed to load provinces data:', err);
  }

  // Load layer tracker state
  try {
    const tracker = await withTimeout(getSetting('layerTracker'), 2000);
    if (tracker) setLayerTracker(tracker);
  } catch (err) {
    console.warn('Failed to load layer tracker:', err);
  }

  // Load layers from IndexedDB (with timeout to prevent hanging)
  try {
    const stored = await withTimeout(listLayers(), 3000);
    if (stored.length > 0) {
      setLayers(stored);
    } else {
      await loadDemoData(base);
    }
  } catch (err) {
    console.warn('Failed to load stored layers:', err);
    try {
      await loadDemoData(base);
    } catch (demoErr) {
      console.warn('Failed to load demo data:', demoErr);
    }
  }

  // Refresh all visible components with loaded data
  refreshDashboard();
}

/**
 * Wraps a promise with a timeout. Rejects if it doesn't resolve within ms.
 */
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), ms)
    )
  ]);
}

/**
 * Loads demo CCA and MPA layers.
 */
async function loadDemoData(base) {
  if (!base) base = getBaseUrl();
  const demos = [
    { file: 'demo_cca.geojson', name: 'Demo CCAs', category: 'CCA', realm: 'terrestrial' },
    { file: 'demo_mpa.geojson', name: 'Demo MPAs', category: 'MPA', realm: 'marine' }
  ];

  for (const demo of demos) {
    try {
      const resp = await fetch(`${base}data/${demo.file}`);
      if (!resp.ok) continue;
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
  document.querySelectorAll('.nav-tab').forEach(tab => {
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
  document.querySelectorAll('.nav-tab').forEach(tab => {
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
    const span = badge.querySelector('span');
    if (isAdmin()) {
      if (span) span.textContent = 'Admin';
      badge.classList.add('admin');
    } else {
      if (span) span.textContent = 'Public';
      badge.classList.remove('admin');
    }
  }
}

// Start the app
init().catch(err => {
  console.error('App initialization failed:', err);
  const el = document.getElementById('page-dashboard');
  if (el) {
    el.innerHTML = `<div style="padding:40px;max-width:600px;margin:0 auto">
      <h2 style="color:#065f46;margin-bottom:12px">Failed to initialize</h2>
      <p style="color:#64748b;font-size:14px">${err.message}</p>
    </div>`;
  }
});
