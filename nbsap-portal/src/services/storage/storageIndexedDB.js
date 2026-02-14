/**
 * IndexedDB Storage Adapter.
 * Primary storage backend for GitHub Pages (static) deployment.
 * Stores layers, metadata, metrics snapshots, and audit logs.
 *
 * All UI and GIS logic uses this adapter via the storage interface
 * — no direct IndexedDB calls elsewhere in the codebase.
 */

const DB_NAME = 'VanuatuNBSAP';
const DB_VERSION = 1;

let dbInstance = null;

/**
 * Opens (or creates) the IndexedDB database.
 * @returns {Promise<IDBDatabase>}
 */
function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Layers store: keyed by layer ID
      if (!db.objectStoreNames.contains('layers')) {
        const layerStore = db.createObjectStore('layers', { keyPath: 'id' });
        layerStore.createIndex('category', 'metadata.category', { unique: false });
        layerStore.createIndex('uploadTimestamp', 'metadata.uploadTimestamp', { unique: false });
      }

      // Metrics snapshots
      if (!db.objectStoreNames.contains('metrics')) {
        db.createObjectStore('metrics', { keyPath: 'id', autoIncrement: true });
      }

      // Audit log
      if (!db.objectStoreNames.contains('auditLog')) {
        const auditStore = db.createObjectStore('auditLog', { keyPath: 'id', autoIncrement: true });
        auditStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Settings
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject(new Error(`IndexedDB error: ${event.target.error}`));
    };
  });
}

/**
 * Generic transaction helper.
 */
async function withStore(storeName, mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = fn(store);

    if (result && result.onsuccess !== undefined) {
      result.onsuccess = () => resolve(result.result);
      result.onerror = () => reject(result.error);
    } else {
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
    }
  });
}

// ─── Layer operations ───────────────────────────────────────

export async function listLayers() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('layers', 'readonly');
    const store = tx.objectStore('layers');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function getLayer(id) {
  return withStore('layers', 'readonly', (store) => store.get(id));
}

export async function saveLayer(layerRecord) {
  // layerRecord = { id, metadata, geojson }
  return withStore('layers', 'readwrite', (store) => store.put(layerRecord));
}

export async function deleteLayer(id) {
  return withStore('layers', 'readwrite', (store) => store.delete(id));
}

// ─── Metrics operations ─────────────────────────────────────

export async function saveMetrics(snapshot) {
  const record = { ...snapshot, timestamp: new Date().toISOString() };
  return withStore('metrics', 'readwrite', (store) => store.add(record));
}

export async function getMetrics(filters = {}) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('metrics', 'readonly');
    const request = tx.objectStore('metrics').getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// ─── Audit log operations ───────────────────────────────────

export async function addAuditEntry(entry) {
  const record = {
    ...entry,
    timestamp: new Date().toISOString()
  };
  return withStore('auditLog', 'readwrite', (store) => store.add(record));
}

export async function getAuditLog() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('auditLog', 'readonly');
    const request = tx.objectStore('auditLog').getAll();
    request.onsuccess = () => {
      const results = request.result || [];
      results.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

// ─── Settings operations ────────────────────────────────────

export async function getSetting(key) {
  const result = await withStore('settings', 'readonly', (store) => store.get(key));
  return result ? result.value : null;
}

export async function setSetting(key, value) {
  return withStore('settings', 'readwrite', (store) => store.put({ key, value }));
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

  const db = await openDB();

  // Clear existing data
  const clearStores = ['layers', 'auditLog', 'metrics'];
  for (const storeName of clearStores) {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const req = tx.objectStore(storeName).clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Import layers
  for (const layer of (backup.layers || [])) {
    await saveLayer(layer);
  }

  // Import audit log
  for (const entry of (backup.auditLog || [])) {
    await withStore('auditLog', 'readwrite', (store) => {
      const { id, ...rest } = entry;
      return store.add(rest);
    });
  }

  // Import metrics
  for (const metric of (backup.metrics || [])) {
    await withStore('metrics', 'readwrite', (store) => {
      const { id, ...rest } = metric;
      return store.add(rest);
    });
  }

  return { layersImported: (backup.layers || []).length };
}

/**
 * Merge-based sync import: adds/updates layers by ID without clearing existing data.
 * Layers with the same ID are updated (upsert). New layers are added.
 * Audit log entries are deduped by timestamp+action+layer_id.
 * @param {object} backup - Backup object with version, layers, auditLog, metrics
 * @returns {Promise<{ added: number, updated: number, skippedAudit: number }>}
 */
export async function syncImport(backup) {
  if (!backup || backup.version !== 1) {
    throw new Error('Invalid backup format');
  }

  let added = 0;
  let updated = 0;

  // Merge layers by ID (put = upsert)
  const existingLayers = await listLayers();
  const existingIds = new Set(existingLayers.map(l => l.id));

  for (const layer of (backup.layers || [])) {
    if (!layer.id) continue;
    if (existingIds.has(layer.id)) {
      updated++;
    } else {
      added++;
    }
    await saveLayer(layer);
  }

  // Merge audit log: dedup by timestamp + action + layer_id
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
    await withStore('auditLog', 'readwrite', (store) => {
      const { id, ...rest } = entry;
      return store.add(rest);
    });
    auditKeys.add(key);
  }

  return { added, updated, skippedAudit };
}
