/**
 * Minimal Express server stub for future backend migration.
 * This server matches the API spec used by storageApiStub.js.
 *
 * NOT required for GitHub Pages deployment.
 * To run: cd server_stub && npm install && node server.js
 */
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '100mb' }));

// Serve static frontend from dist/
app.use(express.static(path.join(__dirname, '..', 'dist')));

// ─── In-memory storage (replace with PostGIS/DB in production) ─────

const store = {
  layers: new Map(),
  metrics: [],
  auditLog: [],
  settings: new Map()
};

// ─── Layer endpoints ───────────────────────────────────────────────

app.get('/api/layers', (req, res) => {
  res.json([...store.layers.values()]);
});

app.get('/api/layers/:id', (req, res) => {
  const layer = store.layers.get(req.params.id);
  if (!layer) return res.status(404).json({ error: 'Not found' });
  res.json(layer);
});

app.post('/api/layers', (req, res) => {
  const layer = req.body;
  store.layers.set(layer.id, layer);
  res.json({ success: true, id: layer.id });
});

app.delete('/api/layers/:id', (req, res) => {
  store.layers.delete(req.params.id);
  res.json({ success: true });
});

// ─── Metrics endpoints ────────────────────────────────────────────

app.get('/api/metrics', (req, res) => {
  res.json(store.metrics);
});

app.post('/api/metrics', (req, res) => {
  const metric = { ...req.body, id: Date.now(), timestamp: new Date().toISOString() };
  store.metrics.push(metric);
  res.json(metric);
});

// ─── Audit log endpoints ──────────────────────────────────────────

app.get('/api/audit', (req, res) => {
  res.json(store.auditLog.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || '')));
});

app.post('/api/audit', (req, res) => {
  const entry = { ...req.body, id: Date.now(), timestamp: new Date().toISOString() };
  store.auditLog.push(entry);
  res.json(entry);
});

// ─── Settings endpoints ───────────────────────────────────────────

app.get('/api/settings/:key', (req, res) => {
  const value = store.settings.get(req.params.key);
  res.json(value !== undefined ? value : null);
});

app.post('/api/settings', (req, res) => {
  store.settings.set(req.body.key, req.body.value);
  res.json({ success: true });
});

// ─── Backup / Restore ─────────────────────────────────────────────

app.get('/api/backup/export', (req, res) => {
  res.json({
    version: 1,
    exportTimestamp: new Date().toISOString(),
    layers: [...store.layers.values()],
    auditLog: store.auditLog,
    metrics: store.metrics
  });
});

app.post('/api/backup/import', (req, res) => {
  const backup = req.body;
  store.layers.clear();
  store.auditLog.length = 0;
  store.metrics.length = 0;

  for (const layer of (backup.layers || [])) {
    store.layers.set(layer.id, layer);
  }
  store.auditLog.push(...(backup.auditLog || []));
  store.metrics.push(...(backup.metrics || []));

  res.json({ success: true, layersImported: store.layers.size });
});

// ─── Auth endpoint (simple) ───────────────────────────────────────

app.post('/api/auth/login', (req, res) => {
  // In production, implement proper auth with JWT
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.json({ user: { name: 'Admin', role: 'admin' }, token: 'stub-token-123' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ─── SPA fallback ─────────────────────────────────────────────────

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`NBSAP API server running on http://localhost:${PORT}`);
});
