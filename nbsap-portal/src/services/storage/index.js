/**
 * Storage adapter facade.
 * Uses Firestore for real-time cross-device sync.
 * Also re-exports the real-time listener functions.
 *
 * Falls back to IndexedDB if Firestore is unavailable.
 */
import * as firestoreStorage from './storageFirestore.js';

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
  syncImport,
  onLayersChanged,
  onSettingsChanged
} = firestoreStorage;
