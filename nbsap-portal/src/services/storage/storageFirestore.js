/**
 * Firestore Storage Adapter for NBSAP Portal.
 * Real-time sync across devices using the same Firebase project
 * as the main React app.
 *
 * GeoJSON data is stored in subcollection chunks (800KB each)
 * to bypass Firestore's 1MB document limit.
 *
 * Uses onSnapshot listeners for live updates across devices.
 */
import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';

// Same Firebase config as the main app
const firebaseConfig = {
  apiKey: 'AIzaSyB2OGgiXUUhyt1aKdHsqIaMS3NDN-tZOdU',
  authDomain: 'vanuatu-nbsap-dashboard-9909a.firebaseapp.com',
  projectId: 'vanuatu-nbsap-dashboard-9909a',
  storageBucket: 'vanuatu-nbsap-dashboard-9909a.firebasestorage.app',
  messagingSenderId: '778670993904',
  appId: '1:778670993904:web:219c671804326d953aed35',
};

// Use a separate app name to avoid conflicts if both portals load on the same page
const app = initializeApp(firebaseConfig, 'nbsap-portal');

// Enable offline persistence so data is cached locally in IndexedDB.
// After the first successful load, subsequent loads (on iPad, etc.) are instant.
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (e) {
  console.warn('Firestore persistence not available, using default:', e.message);
  db = getFirestore(app);
}

// Collection names (prefixed to avoid collision with the React app's 'datasets')
const COL_LAYERS = 'nbsap_layers';
const COL_METRICS = 'nbsap_metrics';
const COL_AUDIT = 'nbsap_audit';
const COL_SETTINGS = 'nbsap_settings';
const CHUNKS_SUB = 'chunks';
const CHUNK_SIZE = 800_000; // 800 KB per chunk
const MAX_BATCH_BYTES = 9_000_000; // Keep batches under Firestore's ~10 MB request limit
const MAX_CHUNKS_PER_BATCH = Math.floor(MAX_BATCH_BYTES / CHUNK_SIZE);

// ─── Chunk helpers ──────────────────────────────────────────

async function writeChunkedGeoJSON(layerId, geojsonObj) {
  // Delete old chunks first to prevent orphans when data shrinks
  await deleteChunks(layerId);

  const json = JSON.stringify(geojsonObj);
  const numChunks = Math.ceil(json.length / CHUNK_SIZE);

  // Write in batches limited by both count (499 Firestore limit) and payload size
  const batchLimit = Math.min(499, MAX_CHUNKS_PER_BATCH);
  for (let batchStart = 0; batchStart < numChunks; batchStart += batchLimit) {
    const batch = writeBatch(db);
    const batchEnd = Math.min(batchStart + batchLimit, numChunks);
    for (let i = batchStart; i < batchEnd; i++) {
      const chunkRef = doc(db, COL_LAYERS, layerId, CHUNKS_SUB, String(i));
      batch.set(chunkRef, { d: json.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE) });
    }
    await batch.commit();
  }

  return numChunks;
}

async function readChunkedGeoJSON(layerId) {
  const chunksSnap = await getDocs(
    collection(db, COL_LAYERS, layerId, CHUNKS_SUB)
  );

  if (chunksSnap.empty) return null;

  // Sort chunks by index
  const sorted = chunksSnap.docs
    .map(d => ({ idx: parseInt(d.id, 10), data: d.data().d }))
    .sort((a, b) => a.idx - b.idx);

  // For small payloads (< 5 MB), use simple concat + parse
  // For larger payloads, still concat but free chunk refs as we go
  // to reduce peak memory from 3× to ~2×.
  let json = '';
  for (const chunk of sorted) {
    json += chunk.data;
    chunk.data = null; // release chunk string ref for GC
  }

  const result = JSON.parse(json);
  json = null; // release the combined string
  return result;
}

async function deleteChunks(layerId) {
  const chunksSnap = await getDocs(
    collection(db, COL_LAYERS, layerId, CHUNKS_SUB)
  );
  if (chunksSnap.empty) return;

  for (let i = 0; i < chunksSnap.docs.length; i += 499) {
    const batch = writeBatch(db);
    const slice = chunksSnap.docs.slice(i, i + 499);
    for (const d of slice) {
      batch.delete(d.ref);
    }
    await batch.commit();
  }
}

// ─── Layer operations ───────────────────────────────────────

export async function listLayers() {
  // Simple query without orderBy to avoid requiring a Firestore composite index
  const snap = await getDocs(collection(db, COL_LAYERS));
  if (snap.empty) return [];

  // Load all layers' GeoJSON chunks in PARALLEL (much faster than sequential)
  const results = await Promise.allSettled(
    snap.docs.map(async (d) => {
      const data = d.data();
      const geojson = await readChunkedGeoJSON(d.id);
      if (!geojson) {
        console.warn(`Layer ${d.id}: no GeoJSON chunks found`);
        return null;
      }
      return { id: d.id, metadata: data.metadata, geojson };
    })
  );

  const layers = results
    .filter(r => r.status === 'fulfilled' && r.value !== null)
    .map(r => r.value);

  // Sort by upload timestamp (newest first) in JS instead of Firestore query
  layers.sort((a, b) => {
    const ta = a.metadata?.uploadTimestamp || '';
    const tb = b.metadata?.uploadTimestamp || '';
    return tb.localeCompare(ta);
  });

  return layers;
}

/**
 * Returns all layers with metadata ONLY (no GeoJSON chunks loaded).
 * Much faster than listLayers() for initial load — GeoJSON is loaded
 * on-demand per target filter via getLayer().
 */
export async function listLayersMeta() {
  const snap = await getDocs(collection(db, COL_LAYERS));
  if (snap.empty) return [];

  const layers = snap.docs.map(d => {
    const data = d.data();
    return { id: d.id, metadata: data.metadata, geojson: null };
  });

  layers.sort((a, b) => {
    const ta = a.metadata?.uploadTimestamp || '';
    const tb = b.metadata?.uploadTimestamp || '';
    return tb.localeCompare(ta);
  });

  return layers;
}

/**
 * Returns the count of layer documents in Firestore (metadata only, no chunks).
 * Fast check to determine if any data exists before falling back to demo data.
 */
export async function countLayers() {
  const snap = await getDocs(collection(db, COL_LAYERS));
  return snap.size;
}

export async function getLayer(id) {
  const ref = doc(db, COL_LAYERS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data();
  const geojson = await readChunkedGeoJSON(id);
  return { id, metadata: data.metadata, geojson };
}

export async function saveLayer(layerRecord) {
  const { id, metadata, geojson } = layerRecord;
  const parentRef = doc(db, COL_LAYERS, id);

  // Write metadata to parent doc
  const chunkCount = await writeChunkedGeoJSON(id, geojson);
  await setDoc(parentRef, { metadata, _chunkCount: chunkCount });

  return layerRecord;
}

/**
 * Updates only the metadata for an existing layer (no GeoJSON re-write).
 * @param {string} id - Layer ID
 * @param {object} metadata - Full metadata object
 */
export async function saveLayerMetadata(id, metadata) {
  const parentRef = doc(db, COL_LAYERS, id);
  const snap = await getDoc(parentRef);
  if (!snap.exists()) throw new Error(`Layer ${id} not found`);
  const existing = snap.data();
  await setDoc(parentRef, { ...existing, metadata });
}

export async function deleteLayer(id) {
  await deleteChunks(id);
  await deleteDoc(doc(db, COL_LAYERS, id));
}

// ─── Metrics operations ─────────────────────────────────────

export async function saveMetrics(snapshot) {
  const id = `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const record = { ...snapshot, timestamp: new Date().toISOString() };
  await setDoc(doc(db, COL_METRICS, id), record);
}

export async function getMetrics() {
  const snap = await getDocs(collection(db, COL_METRICS));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── Audit log operations ───────────────────────────────────

export async function addAuditEntry(entry) {
  const id = `a_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const record = { ...entry, timestamp: new Date().toISOString() };
  await setDoc(doc(db, COL_AUDIT, id), record);
}

export async function getAuditLog() {
  const snap = await getDocs(collection(db, COL_AUDIT));
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  results.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
  return results;
}

// ─── Settings operations ────────────────────────────────────

export async function getSetting(key) {
  const snap = await getDoc(doc(db, COL_SETTINGS, key));
  if (!snap.exists()) return null;
  return snap.data().value;
}

export async function setSetting(key, value) {
  await setDoc(doc(db, COL_SETTINGS, key), { key, value });
}

// ─── Backup / Restore ───────────────────────────────────────

export async function exportBackup() {
  const layers = await listLayers();
  const auditLog = await getAuditLog();
  const metrics = await getMetrics();

  return {
    version: 1,
    exportTimestamp: new Date().toISOString(),
    layers,
    auditLog,
    metrics
  };
}

export async function importBackup(backup) {
  if (!backup || backup.version !== 1) {
    throw new Error('Invalid backup format');
  }

  // Clear existing layers
  const existingSnap = await getDocs(collection(db, COL_LAYERS));
  for (const d of existingSnap.docs) {
    await deleteChunks(d.id);
    await deleteDoc(d.ref);
  }

  // Import layers
  for (const layer of (backup.layers || [])) {
    await saveLayer(layer);
  }

  return { layersImported: (backup.layers || []).length };
}

export async function syncImport(backup) {
  if (!backup || backup.version !== 1) {
    throw new Error('Invalid backup format');
  }

  let added = 0;
  let updated = 0;

  const existingSnap = await getDocs(collection(db, COL_LAYERS));
  const existingIds = new Set(existingSnap.docs.map(d => d.id));

  for (const layer of (backup.layers || [])) {
    if (!layer.id) continue;
    if (existingIds.has(layer.id)) {
      updated++;
    } else {
      added++;
    }
    await saveLayer(layer);
  }

  // Merge audit log
  const existingAudit = await getAuditLog();
  const auditKeys = new Set(existingAudit.map(e =>
    `${e.timestamp}|${e.action}|${e.layer_id || ''}`
  ));

  let skippedAudit = 0;
  for (const entry of (backup.auditLog || [])) {
    const key = `${entry.timestamp}|${entry.action}|${entry.layer_id || ''}`;
    if (auditKeys.has(key)) {
      skippedAudit++;
      continue;
    }
    await addAuditEntry(entry);
    auditKeys.add(key);
  }

  return { added, updated, skippedAudit };
}

// ─── Real-time listener ─────────────────────────────────────

/**
 * Subscribe to real-time layer metadata changes.
 * Calls `onLayerChange(layerIds)` whenever any layer is added, modified, or removed.
 * Returns an unsubscribe function.
 *
 * Note: This listens to metadata docs only (not chunks).
 * The caller should reload full layer data when notified.
 */
export function onLayersChanged(callback) {
  return onSnapshot(collection(db, COL_LAYERS), (snapshot) => {
    const changes = {
      added: [],
      modified: [],
      removed: []
    };

    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') changes.added.push(change.doc.id);
      if (change.type === 'modified') changes.modified.push(change.doc.id);
      if (change.type === 'removed') changes.removed.push(change.doc.id);
    });

    callback(changes);
  });
}

/**
 * Subscribe to real-time settings changes.
 * Returns an unsubscribe function.
 */
export function onSettingsChanged(callback) {
  return onSnapshot(collection(db, COL_SETTINGS), (snapshot) => {
    const settings = {};
    snapshot.docs.forEach(d => {
      settings[d.id] = d.data().value;
    });
    callback(settings);
  });
}
