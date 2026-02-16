/**
 * Main application entry point.
 * Initializes the app shell, loads data from Firestore, wires up tab navigation,
 * and subscribes to real-time updates for cross-device sync.
 */
import { listLayers, saveLayer, getSetting, getLayer, onLayersChanged, onSettingsChanged } from './services/storage/index.js';
import { getAppState, setLayers, setProvincesGeojson, addLayer, removeLayer, setLayerTracker } from './ui/state.js';
import { isAdmin } from './services/auth/index.js';
import { initDashboard, refreshDashboard, onDashboardShow } from './pages/dashboard.js';
import { initDataPortal, refreshPortal } from './pages/dataPortal.js';
import { initAdmin, renderAdminPage } from './pages/admin.js';
import { isWizardOpen } from './ui/components/uploadWizard.js';
import { initAbout } from './pages/about.js';
import { computeFeatureAreas } from './gis/areaCalc.js';
import { createLayerMetadata } from './core/schema.js';

// Fix Leaflet default icon paths (use CDN URLs for universal compatibility)
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

let activeTab = 'dashboard';

/** Track whether initial load has completed to distinguish real-time changes */
let initialLoadComplete = false;

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

  // 3. Listen for refresh events (skip admin re-render while upload wizard is open)
  window.addEventListener('nbsap:refresh', () => {
    if (activeTab === 'dashboard') refreshDashboard();
    if (activeTab === 'portal') refreshPortal();
    if (activeTab === 'admin' && !isWizardOpen()) renderAdminPage();
    updateNavAuthBadge();
  });

  // 4. Show dashboard by default
  showTab('dashboard');

  // 5. Load data asynchronously (UI already visible)
  await loadAppData();

  // 6. Subscribe to real-time changes from Firestore
  subscribeToRealtimeUpdates();
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
    const tracker = await withTimeout(getSetting('layerTracker'), 5000);
    if (tracker) setLayerTracker(tracker);
  } catch (err) {
    console.warn('Failed to load layer tracker:', err);
  }

  // Load layers from Firestore (with generous timeout for network)
  try {
    const stored = await withTimeout(listLayers(), 15000);
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

  initialLoadComplete = true;

  // Refresh all visible components with loaded data
  refreshDashboard();
}

/**
 * Subscribes to real-time Firestore updates.
 * When another device uploads or modifies a layer, this
 * device sees the change and refreshes automatically.
 */
function subscribeToRealtimeUpdates() {
  // Listen for layer changes
  onLayersChanged(async (changes) => {
    if (!initialLoadComplete) return;

    const hasChanges = changes.added.length > 0 ||
                       changes.modified.length > 0 ||
                       changes.removed.length > 0;

    if (!hasChanges) return;

    // Fetch full data for added or modified layers
    for (const layerId of [...changes.added, ...changes.modified]) {
      try {
        const layer = await getLayer(layerId);
        if (layer) {
          addLayer(layer);
        }
      } catch (err) {
        console.warn(`Failed to load layer ${layerId}:`, err);
      }
    }

    // Remove deleted layers from state
    for (const layerId of changes.removed) {
      removeLayer(layerId);
    }

    // Show a brief sync notification
    showSyncNotification(changes);
  });

  // Listen for settings changes (layer tracker sync)
  onSettingsChanged((settings) => {
    if (!initialLoadComplete) return;

    if (settings.layerTracker) {
      setLayerTracker(settings.layerTracker);
      window.dispatchEvent(new CustomEvent('nbsap:refresh'));
    }
  });
}

/**
 * Shows a brief notification when data syncs from another device.
 */
function showSyncNotification(changes) {
  const count = changes.added.length + changes.modified.length + changes.removed.length;
  if (count === 0) return;

  const parts = [];
  if (changes.added.length > 0) parts.push(`${changes.added.length} added`);
  if (changes.modified.length > 0) parts.push(`${changes.modified.length} updated`);
  if (changes.removed.length > 0) parts.push(`${changes.removed.length} removed`);

  const msg = `Synced: ${parts.join(', ')}`;

  // Create notification element
  let toast = document.getElementById('sync-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sync-toast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      background: #006B3F; color: white; padding: 10px 20px;
      border-radius: 8px; font-size: 13px; font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: opacity 0.3s, transform 0.3s;
      opacity: 0; transform: translateY(10px);
      display: flex; align-items: center; gap: 8px;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
    ${msg}
  `;

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  // Animate out after 3s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 3000);
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

  // Trigger page-specific activation (skip admin re-render while upload wizard is open)
  if (tabId === 'dashboard') onDashboardShow();
  if (tabId === 'portal') refreshPortal();
  if (tabId === 'admin' && !isWizardOpen()) renderAdminPage();
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
