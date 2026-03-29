/**
 * Main application entry point.
 * Initializes the app shell, loads data from Firestore, wires up tab navigation,
 * and subscribes to real-time updates for cross-device sync.
 */
import { listLayers, listLayersMeta, countLayers, saveLayer, deleteLayer, getSetting, setSetting, getLayer, onLayersChanged, onSettingsChanged } from './services/storage/index.js';
import { getAppState, setLayers, setProvincesGeojson, addLayer, removeLayer, setLayerTracker, setCustomLayerNames, ensureGeoJSONForTargets, hasUnloadedTargets, cleanStaleTrackerEntries } from './ui/state.js';
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

  // Load custom layer names
  try {
    const names = await withTimeout(getSetting('customLayerNames'), 10000);
    if (names) setCustomLayerNames(names);
  } catch (err) {
    console.warn('Failed to load custom layer names:', err);
  }

  // Load layer METADATA first (fast — no GeoJSON chunks), then lazy-load GeoJSON
  // for the active target only. This prevents large datasets from blocking startup.
  // Track whether the Firestore load succeeded so we don't corrupt the tracker on failure.
  let firestoreLoadSucceeded = false;
  try {
    const stored = await withTimeout(listLayersMeta(), 15000);

    // Separate demo layers from real user-uploaded layers
    const realLayers = stored.filter(l => !isDemoLayer(l));
    const demoLayers = stored.filter(l => isDemoLayer(l));

    if (realLayers.length > 0) {
      // User has real data — use only real layers (metadata only at this point)
      // setLayers returns IDs of duplicates that were removed during dedup
      const removedDupeIds = setLayers(realLayers);
      console.log(`Loaded metadata for ${realLayers.length} layers from Firestore (excluded ${demoLayers.length} demo layers)`);
      firestoreLoadSucceeded = true;

      // Delete duplicate layers from Firestore in background
      if (removedDupeIds.length > 0) {
        console.warn(`Removing ${removedDupeIds.length} duplicate layer(s) from Firestore`);
        cleanupDuplicateLayers(removedDupeIds);
      }

      // Remove demo/seed layers from Firestore in background so they don't pollute metrics
      if (demoLayers.length > 0) {
        console.log(`Removing ${demoLayers.length} seed/demo layer(s) from Firestore (real data present)`);
        cleanupDemoLayers(demoLayers);
      }
    } else if (stored.length > 0) {
      // Only demo data exists — load full GeoJSON for demo layers
      const demoFull = await withTimeout(listLayers(), 60000);
      setLayers(demoFull.filter(l => isDemoLayer(l)));
      firestoreLoadSucceeded = true;
    } else {
      // No data at all — check for failed chunk loads, then fall back to demo
      try {
        const docCount = await withTimeout(countLayers(), 10000);
        if (docCount > 0) {
          console.warn(`Firestore has ${docCount} layer docs but metadata failed to load. Real-time listener will retry.`);
          firestoreLoadSucceeded = true; // Layers exist, load failed transiently — don't corrupt tracker
        } else {
          await loadDemoData(base);
          firestoreLoadSucceeded = true; // Empty DB, demo load is valid state
        }
      } catch {
        await loadDemoData(base);
        firestoreLoadSucceeded = true;
      }
    }
  } catch (err) {
    console.warn('Failed to load stored layers:', err);
    // Do NOT set firestoreLoadSucceeded — skip tracker cleanup to preserve user's data
    try {
      await loadDemoData(base);
    } catch (demoErr) {
      console.warn('Failed to load demo data:', demoErr);
    }
  }

  // Only clean stale tracker entries when we successfully loaded from Firestore.
  // If loading failed, appState.layers is empty/demo-only, and running cleanup would
  // incorrectly delete all the user's tracker entries and overwrite Firestore.
  if (firestoreLoadSucceeded && cleanStaleTrackerEntries()) {
    console.log('Cleaned stale tracker entries for previously deleted layers');
    setSetting('layerTracker', getAppState().layerTracker).catch(err =>
      console.warn('Failed to persist cleaned tracker:', err)
    );
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
  refreshPortal();
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

  // Listen for settings changes (layer tracker + custom names sync)
  onSettingsChanged(async (settings) => {
    if (!initialLoadComplete) return;

    let changed = false;
    if (settings.layerTracker) {
      setLayerTracker(settings.layerTracker);
      changed = true;

      // Race-condition fix: the tracker may reference layer IDs that arrived
      // from another device but whose onLayersChanged event hasn't fired yet.
      // Proactively load any tracked layer that isn't in local state so that
      // getDashboardLayers() never returns [] while the tracker is non-empty.
      const state = getAppState();
      const existingIds = new Set(state.layers.map(l => l.id));
      const missingIds = [];
      for (const entries of Object.values(state.layerTracker)) {
        for (const entry of entries) {
          if (!existingIds.has(entry.layerId)) missingIds.push(entry.layerId);
        }
      }
      if (missingIds.length > 0) {
        await Promise.allSettled(missingIds.map(async (layerId) => {
          const layer = await getLayer(layerId);
          if (layer) addLayer(layer);
        }));
      }
    }
    if (settings.customLayerNames) {
      setCustomLayerNames(settings.customLayerNames);
      changed = true;
    }
    if (changed) window.dispatchEvent(new CustomEvent('nbsap:refresh'));
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
 * Filenames used by the built-in seed/demo layers.
 * Used to identify old seed layers that were saved to Firestore before the
 * _isDemo flag was introduced, so they can be cleaned up when real data arrives.
 */
const SEED_LAYER_FILENAMES = new Set([
  'demo_cca.geojson',
  'demo_mpa.geojson',
  'vut_invasive_merremia_efate_2026_v1.geojson',
]);

/**
 * Detects whether a layer is demo/seed data that should not count as real user data.
 * Checks explicit _isDemo flag, system uploadedBy, or legacy seed filenames.
 */
function isDemoLayer(layer) {
  const meta = layer.metadata;
  if (!meta) return false;
  if (meta._isDemo) return true;
  if (meta.uploadedBy === 'system') return true;
  // Legacy: seed layers saved before _isDemo flag was added (uploaded with 'admin'
  // uploadedBy but identifiable by their original seed filenames).
  if (SEED_LAYER_FILENAMES.has(meta.originalFilename)) return true;
  return false;
}

/**
 * Removes old demo layers from Firestore (background cleanup).
 * Called when real user data exists so old demos don't pollute metrics.
 */
function cleanupDemoLayers(demoLayers) {
  for (const layer of demoLayers) {
    deleteLayer(layer.id).then(() => {
      console.log(`Cleaned up old demo layer from Firestore: ${layer.metadata?.name || layer.id}`);
    }).catch(err => {
      console.warn(`Failed to clean up demo layer ${layer.id}:`, err);
    });
  }
}

/**
 * Removes duplicate layers from Firestore (background cleanup).
 * Called when deduplicateLayers() found and removed stale copies on load.
 */
function cleanupDuplicateLayers(layerIds) {
  for (const id of layerIds) {
    deleteLayer(id).then(() => {
      console.log(`Removed duplicate layer from Firestore: ${id}`);
    }).catch(err => {
      console.warn(`Failed to remove duplicate layer ${id}:`, err);
    });
  }
}

/**
 * Loads seed data (CCAs, MPAs, invasive species) and persists to Firestore.
 * This restores the portal to a functional state with real data.
 */
async function loadDemoData(base) {
  if (!base) base = getBaseUrl();
  const seedLayers = [
    {
      file: 'demo_cca.geojson',
      name: 'Community Conserved Areas (CCA)',
      category: 'CCA',
      realm: 'terrestrial',
      targets: ['T3'],
      countsToward30x30: true,
      description: 'Community-managed conservation areas across Vanuatu including Vatthe, Loru Rainforest, Nagha mo Pineia, and others',
      custodianAgency: 'DEPC Vanuatu',
      dataSource: 'Field',
      geographicCoverage: 'National',
      accessClassification: 'Public'
    },
    {
      file: 'demo_mpa.geojson',
      name: 'Marine Protected Areas (MPA)',
      category: 'MPA',
      realm: 'marine',
      targets: ['T3'],
      countsToward30x30: true,
      description: 'Nationally designated marine protected areas including Aore Island, Hideaway Island, Nguna-Pele, Maskelyne Islands, and Aneityum',
      custodianAgency: 'DEPC Vanuatu',
      dataSource: 'Field',
      geographicCoverage: 'National + Marine',
      accessClassification: 'Public'
    }
  ];

  for (const seed of seedLayers) {
    try {
      const resp = await fetch(`${base}data/${seed.file}`);
      if (!resp.ok) continue;
      const geojson = await resp.json();
      const withAreas = computeFeatureAreas(geojson);

      const meta = createLayerMetadata({
        name: seed.name,
        originalFilename: seed.file,
        category: seed.category,
        targets: seed.targets,
        realm: seed.realm,
        countsToward30x30: seed.countsToward30x30,
        detectedCRS: 'EPSG:4326',
        featureCount: withAreas.features.length,
        validGeometryCount: withAreas.features.length,
        totalAreaHa: withAreas.features.reduce((s, f) => s + (f.properties.area_ha || 0), 0),
        status: 'Clean',
        uploadedBy: 'system',
        description: seed.description,
        custodianAgency: seed.custodianAgency,
        dataSource: seed.dataSource,
        geographicCoverage: seed.geographicCoverage,
        accessClassification: seed.accessClassification,
        dateCreated: '2026-03-16'
      });
      meta._isDemo = true;

      const record = { id: meta.id, metadata: meta, geojson: withAreas };
      addLayer(record);
      // Persist to Firestore so data survives page reloads
      await saveLayer(record).catch(err =>
        console.warn(`Failed to persist seed layer ${seed.name}:`, err)
      );
    } catch (err) {
      console.warn(`Failed to load seed data ${seed.name}:`, err);
    }
  }

  // Also seed the invasive species data (T6)
  try {
    await loadInvasiveSpeciesData(base);
  } catch (err) {
    console.warn('Failed to load invasive species seed data:', err);
  }
}

/**
 * Loads the Merremia peltata invasive species dataset from the geospatial inventory.
 * Persists to Firestore.
 */
async function loadInvasiveSpeciesData() {
  // Inline the invasive species data since it's part of the repo's geospatial inventory
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [168.3273, -17.7333] },
        properties: {
          name: 'Merremia - Mele Bay',
          type: 'MERREMIA',
          realm: 'terrestrial',
          province: 'Shefa',
          year: 2026,
          status: 'Not controlled',
          source: 'DEPC Field Survey 2026',
          notes: 'Dense coverage along coastal area, threatening native vegetation',
          targets: ['T6'],
          species: 'Merremia peltata',
          coverage_category: 'Dense (>50%)',
          affected_area_sqm: 2500,
          threat_level: 'High'
        }
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [168.2947, -17.7184] },
        properties: {
          name: 'Merremia - Port Vila Harbor',
          type: 'MERREMIA',
          realm: 'terrestrial',
          province: 'Shefa',
          year: 2026,
          status: 'Under monitoring',
          source: 'DEPC Field Survey 2026',
          notes: 'Urban area invasion, manual removal planned',
          targets: ['T6'],
          species: 'Merremia peltata',
          coverage_category: 'Moderate (10-50%)',
          affected_area_sqm: 1200,
          threat_level: 'Medium'
        }
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [168.3512, -17.6891] },
        properties: {
          name: 'Merremia - Erakor Village',
          type: 'MERREMIA',
          realm: 'terrestrial',
          province: 'Shefa',
          year: 2026,
          status: 'Controlled',
          source: 'DEPC Field Survey 2026',
          notes: 'Recently cleared area, monitoring for regrowth',
          targets: ['T6'],
          species: 'Merremia peltata',
          coverage_category: 'Sparse (<10%)',
          affected_area_sqm: 450,
          threat_level: 'Low'
        }
      }
    ]
  };

  const withAreas = computeFeatureAreas(geojson);

  const meta = createLayerMetadata({
    name: 'Merremia peltata (Big Leaf) - Efate',
    originalFilename: 'vut_invasive_merremia_efate_2026_v1.geojson',
    category: 'MERREMIA',
    targets: ['T6'],
    realm: 'terrestrial',
    countsToward30x30: false,
    detectedCRS: 'EPSG:4326',
    featureCount: withAreas.features.length,
    validGeometryCount: withAreas.features.length,
    totalAreaHa: withAreas.features.reduce((s, f) => s + (f.properties.area_ha || 0), 0),
    status: 'Clean',
    uploadedBy: 'system',
    description: 'Remote sensing and field survey detections of Merremia peltata invasive vine coverage on Efate Island',
    custodianAgency: 'DEPC Vanuatu',
    dataSource: 'Field',
    geographicCoverage: 'Provincial',
    accessClassification: 'Public',
    dateCreated: '2026-02-10'
  });
  meta._isDemo = true;

  const record = { id: meta.id, metadata: meta, geojson: withAreas };
  addLayer(record);
  await saveLayer(record).catch(err =>
    console.warn('Failed to persist invasive species layer:', err)
  );
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

// Button ripple effect — delegated so it works on dynamically rendered buttons
document.body.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn || btn.disabled) return;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const wave = document.createElement('span');
  wave.className = 'btn-ripple-wave';
  wave.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(wave);
  wave.addEventListener('animationend', () => wave.remove(), { once: true });
}, true);

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
