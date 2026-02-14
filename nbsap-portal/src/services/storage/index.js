/**
 * Storage adapter facade.
 * All UI and GIS code imports storage from here.
 * Uses IndexedDB by default; switch to API backend via env.js.
 */
import * as indexedDBStorage from './storageIndexedDB.js';

// To use API backend:
// 1. Change import above to: import * as apiStorage from './storageApiStub.js';
// 2. Set ENV.storageBackend = 'api' and ENV.apiBaseUrl in config/env.js
// 3. Replace indexedDBStorage references below with apiStorage

export const {
  listLayers,
  getLayer,
  saveLayer,
  deleteLayer,
  saveMetrics,
  getMetrics,
  addAuditEntry,
  getAuditLog,
  getSetting,
  setSetting,
  exportBackup,
  importBackup,
  syncImport
} = indexedDBStorage;
