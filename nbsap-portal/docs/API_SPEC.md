# API Specification

## Overview

This document defines the REST API endpoints for the future backend server. The `storageApiStub.js` adapter consumes these endpoints. The `server_stub/server.js` provides a reference implementation.

**Base URL:** Configured via `ENV.apiBaseUrl` in `src/config/env.js`

## Authentication

### POST /api/auth/login

Login and receive a JWT token.

**Request:**
```json
{
  "username": "admin",
  "password": "secret"
}
```

**Response (200):**
```json
{
  "user": { "name": "Admin", "role": "admin" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (401):**
```json
{ "error": "Invalid credentials" }
```

All subsequent requests include: `Authorization: Bearer <token>`

## Layer Endpoints

### GET /api/layers

List all layers.

**Response:**
```json
[
  {
    "id": "layer_abc123",
    "metadata": { "name": "Demo CCAs", "category": "CCA", ... },
    "geojson": { "type": "FeatureCollection", "features": [...] }
  }
]
```

### GET /api/layers/:id

Get a single layer by ID.

### POST /api/layers

Create or update a layer.

**Request body:** Full layer record `{ id, metadata, geojson }`

**Response:**
```json
{ "success": true, "id": "layer_abc123" }
```

### DELETE /api/layers/:id

Delete a layer.

**Response:**
```json
{ "success": true }
```

## Metrics Endpoints

### GET /api/metrics

List all metrics snapshots.

**Query params:** `?target=T3&province=Shefa` (optional filters)

### POST /api/metrics

Save a metrics snapshot.

**Request body:**
```json
{
  "terrestrial_ha": 12500,
  "marine_ha": 45000,
  "terrestrial_pct": 1.025,
  "marine_pct": 0.679,
  "filters": { "targets": ["T3"], "province": "All" }
}
```

## Audit Log Endpoints

### GET /api/audit

List all audit log entries, sorted by timestamp descending.

### POST /api/audit

Add an audit log entry.

**Request body:**
```json
{
  "action": "upload",
  "layer_id": "layer_abc123",
  "filename": "ccas.zip",
  "category": "CCA",
  "targets": ["T3"],
  "result": "Clean"
}
```

## Settings Endpoints

### GET /api/settings/:key

Get a setting value.

### POST /api/settings

Set a setting value.

**Request body:**
```json
{ "key": "admin_hash", "value": "abc123..." }
```

## Backup Endpoints

### GET /api/backup/export

Export all data as a JSON bundle.

**Response:**
```json
{
  "version": 1,
  "exportTimestamp": "2024-01-01T00:00:00Z",
  "layers": [...],
  "auditLog": [...],
  "metrics": [...]
}
```

### POST /api/backup/import

Import a backup bundle. Clears existing data first.

**Request body:** Same format as export response.

**Response:**
```json
{ "success": true, "layersImported": 5 }
```
