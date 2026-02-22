/**
 * Main application entry point.
 * Initializes the app shell, loads data from Firestore, wires up tab navigation,
 * and subscribes to real-time updates for cross-device sync.
 */
import { listLayers, listLayersMeta, countLayers, saveLayer, deleteLayer, getSetting, getLayer, onLayersChanged, onSettingsChanged } from './services/storage/index.js';
import { getAppState, setLayers, setProvincesGeojson, addLayer, removeLayer, setLayerTracker, ensureGeoJSONForTargets, hasUnloadedTargets } from './ui/state.js';
import { isAdmin } from './services/auth/index.js';
import { initDashboard, refreshDashboard, onDashboardShow, markDashboardDirty } from './pages/dashboard.js';
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

  // 3. Listen for refresh events (debounced to prevent rapid-fire recomputations)
  //    Includes lazy GeoJSON loading when the target filter changes.
  let refreshTimer = null;
  window.addEventListener('nbsap:refresh', () => {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(async () => {
      refreshTimer = null;

      // Lazy-load GeoJSON for any newly-selected targets before rendering
      if (initialLoadComplete) {
        const state = getAppState();
        const targets = state.filters.targets;
        if (targets.length > 0 && hasUnloadedTargets(targets)) {
          showLoadingStatus(`Loading data for ${targets.join(', ')}...`);
          await ensureGeoJSONForTargets(targets);
          hideLoadingStatus();
        }
      }

      if (activeTab === 'dashboard') {
        refreshDashboard();
      } else {
        markDashboardDirty();
      }
      if (activeTab === 'portal') refreshPortal();
      if (activeTab === 'admin' && !isWizardOpen()) renderAdminPage();
      updateNavAuthBadge();
    }, 150);
  });

  // 4. Show dashboard by default
  showTab('dashboard');

  // 5. Load data asynchronously (UI already visible)
  await loadAppData();

  // 6. Subscribe to real-time changes from Firestore
  subscribeToRealtimeUpdates();
}

/**
 * Shows a loading status banner on the dashboard page.
 */
function showLoadingStatus(message) {
  let el = document.getElementById('nbsap-loading-status');
  if (!el) {
    el = document.createElement('div');
    el.id = 'nbsap-loading-status';
    el.style.cssText = `
      position: fixed; top: 60px; left: 50%; transform: translateX(-50%);
      z-index: 9998; background: #006B3F; color: white; padding: 8px 20px;
      border-radius: 8px; font-size: 13px; font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex; align-items: center; gap: 8px;
    `;
    document.body.appendChild(el);
  }
  el.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
    ${message}
  `;
  el.style.display = 'flex';
}

function hideLoadingStatus() {
  const el = document.getElementById('nbsap-loading-status');
  if (el) el.style.display = 'none';
}

/**
 * Loads provinces and layer data, then refreshes the UI.
 */
async function loadAppData() {
  const base = getBaseUrl();

  showLoadingStatus('Loading data from Firestore...');

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
    const tracker = await withTimeout(getSetting('layerTracker'), 10000);
    if (tracker) setLayerTracker(tracker);
  } catch (err) {
    console.warn('Failed to load layer tracker:', err);
  }

  // Load layer METADATA first (fast — no GeoJSON chunks), then lazy-load GeoJSON
  // for the active target only. This prevents large datasets from blocking startup.
  try {
    const stored = await withTimeout(listLayersMeta(), 15000);

    // Separate demo layers from real user-uploaded layers
    const realLayers = stored.filter(l => !isDemoLayer(l));
    const demoLayers = stored.filter(l => isDemoLayer(l));

    if (realLayers.length > 0) {
      // User has real data — use only real layers (metadata only at this point)
      setLayers(realLayers);
      console.log(`Loaded metadata for ${realLayers.length} layers from Firestore (excluded ${demoLayers.length} demo layers)`);

      // Remove demo layers from Firestore in background so they don't persist
      if (demoLayers.length > 0) {
        cleanupDemoLayers(demoLayers);
      }
    } else if (stored.length > 0) {
      // Only demo data exists — load full GeoJSON for demo layers
      const demoFull = await withTimeout(listLayers(), 60000);
      setLayers(demoFull.filter(l => isDemoLayer(l)));
    } else {
      // No data at all — check for failed chunk loads, then fall back to demo
      try {
        const docCount = await withTimeout(countLayers(), 10000);
        if (docCount > 0) {
          console.warn(`Firestore has ${docCount} layer docs but metadata failed to load. Real-time listener will retry.`);
        } else {
          await loadDemoData(base);
        }
      } catch {
        await loadDemoData(base);
      }
    }
  } catch (err) {
    console.warn('Failed to load stored layers:', err);
    try {
      await loadDemoData(base);
    } catch (demoErr) {
      console.warn('Failed to load demo data:', demoErr);
    }
  }

  hideLoadingStatus();
  initialLoadComplete = true;

  // Lazy-load GeoJSON for the default active target (T3), then refresh
  const state = getAppState();
  const activeTargets = state.filters.targets;
  if (activeTargets.length > 0 && hasUnloadedTargets(activeTargets)) {
    showLoadingStatus(`Loading GeoJSON for ${activeTargets.join(', ')}...`);
    await ensureGeoJSONForTargets(activeTargets);
    hideLoadingStatus();
  }

  // Refresh all visible components with loaded data
  refreshDashboard();
}

/**
 * Subscribes to real-time Firestore updates.
 * When another device uploads or modifies a layer, this
 * device sees the change and refreshes automatically.
 *
 * The first onSnapshot fires with ALL existing documents as 'added'.
 * We use this to load any layers that the initial listLayers() missed.
 */
function subscribeToRealtimeUpdates() {
  let isFirstSnapshot = true;

  // Listen for layer changes
  onLayersChanged(async (changes) => {
    if (!initialLoadComplete) return;

    const hasChanges = changes.added.length > 0 ||
                       changes.modified.length > 0 ||
                       changes.removed.length > 0;

    if (!hasChanges) return;

    const state = getAppState();
    const existingIds = new Set(state.layers.map(l => l.id));

    // On first snapshot, only load layers we don't already have
    // On subsequent snapshots, load all added/modified layers
    const layerIdsToLoad = [];
    for (const layerId of [...changes.added, ...changes.modified]) {
      if (isFirstSnapshot && existingIds.has(layerId)) continue;
      layerIdsToLoad.push(layerId);
    }

    isFirstSnapshot = false;

    if (layerIdsToLoad.length === 0 && changes.removed.length === 0) return;

    // Load layers in parallel for speed
    if (layerIdsToLoad.length > 0) {
      const results = await Promise.allSettled(
        layerIdsToLoad.map(async (layerId) => {
          const layer = await getLayer(layerId);
          if (layer) addLayer(layer);
          return layerId;
        })
      );

      for (const r of results) {
        if (r.status === 'rejected') {
          console.warn('Failed to load layer via real-time sync:', r.reason);
        }
      }
    }

    // Remove deleted layers from state
    for (const layerId of changes.removed) {
      removeLayer(layerId);
    }

    // Show a brief sync notification (only for non-first snapshots with actual changes)
    if (layerIdsToLoad.length > 0 || changes.removed.length > 0) {
      showSyncNotification({
        added: layerIdsToLoad.filter(id => changes.added.includes(id)),
        modified: layerIdsToLoad.filter(id => changes.modified.includes(id)),
        removed: changes.removed
      });
    }
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
 * Detects whether a layer is demo/sample data (not user-uploaded).
 * Demo layers are identified by their uploadedBy field or name prefix.
 */
function isDemoLayer(layer) {
  const meta = layer.metadata;
  if (!meta) return false;
  if (meta.uploadedBy === 'system') return true;
  if (meta._isDemo) return true;
  const name = (meta.name || '').toLowerCase();
  return name.startsWith('demo ');
}

/**
 * Removes demo layers from Firestore (background cleanup).
 * Called when real user data exists so demos don't pollute metrics.
 */
function cleanupDemoLayers(demoLayers) {
  for (const layer of demoLayers) {
    deleteLayer(layer.id).then(() => {
      console.log(`Cleaned up demo layer from Firestore: ${layer.metadata?.name || layer.id}`);
    }).catch(err => {
      console.warn(`Failed to clean up demo layer ${layer.id}:`, err);
    });
  }
}

/**
 * Loads demo CCA and MPA layers into memory only (NOT saved to Firestore).
 * Demo data is for first-time visitors who haven't uploaded any real data yet.
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
        uploadedBy: 'system',
        _isDemo: true
      });

      const record = { id: meta.id, metadata: meta, geojson: withAreas };
      // Memory only — do NOT save to Firestore
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
