/**
 * API Storage Adapter (Stub for future backend).
 * Matches the same interface as storageIndexedDB.js.
 * Replace the base URL in env.js when a backend is available.
 */
import ENV from '../../config/env.js';

const API = ENV.apiBaseUrl;

async function apiFetch(path, opts = {}) {
  const resp = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {})
    },
    ...opts
  });
  if (!resp.ok) throw new Error(`API error: ${resp.status} ${resp.statusText}`);
  return resp.json();
}

export async function listLayers() {
  return apiFetch('/layers');
}

export async function getLayer(id) {
  return apiFetch(`/layers/${id}`);
}

export async function saveLayer(layerRecord) {
  return apiFetch('/layers', {
    method: 'POST',
    body: JSON.stringify(layerRecord)
  });
}

export async function deleteLayer(id) {
  return apiFetch(`/layers/${id}`, { method: 'DELETE' });
}

export async function saveMetrics(snapshot) {
  return apiFetch('/metrics', {
    method: 'POST',
    body: JSON.stringify(snapshot)
  });
}

export async function getMetrics(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  return apiFetch(`/metrics?${params}`);
}

export async function addAuditEntry(entry) {
  return apiFetch('/audit', {
    method: 'POST',
    body: JSON.stringify(entry)
  });
}

export async function getAuditLog() {
  return apiFetch('/audit');
}

export async function getSetting(key) {
  return apiFetch(`/settings/${key}`);
}

export async function setSetting(key, value) {
  return apiFetch('/settings', {
    method: 'POST',
    body: JSON.stringify({ key, value })
  });
}

export async function exportBackup() {
  return apiFetch('/backup/export');
}

export async function importBackup(backup) {
  return apiFetch('/backup/import', {
    method: 'POST',
    body: JSON.stringify(backup)
  });
}
