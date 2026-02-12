import type {
  GeoDataset,
  DatasetSummary,
  DatasetMetadata,
  DatasetFormat,
} from '../types/geospatial'
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson'

const DB_NAME = 'merremia-gis'
const DB_VERSION = 1
const STORE_DATASETS = 'datasets'
const STORE_INDEX = 'index'

// Legacy localStorage keys for one-time migration
const LEGACY_STORAGE_KEY = 'merremia-datasets'
const LEGACY_INDEX_KEY = 'merremia-datasets-index'

let dbInstance: IDBDatabase | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance)

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_DATASETS)) {
        db.createObjectStore(STORE_DATASETS, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(STORE_INDEX)) {
        db.createObjectStore(STORE_INDEX, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onerror = () => reject(request.error)
  })
}

/** Reset cached DB connection — used by tests only */
export function _resetForTests(): void {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}

function generateId(): string {
  return `ds_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function computeBbox(
  fc: FeatureCollection,
): [number, number, number, number] | null {
  let minLng = Infinity
  let minLat = Infinity
  let maxLng = -Infinity
  let maxLat = -Infinity
  let hasCoords = false

  function processCoords(coords: unknown): void {
    if (!Array.isArray(coords)) return
    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      const [lng, lat] = coords as [number, number]
      minLng = Math.min(minLng, lng)
      minLat = Math.min(minLat, lat)
      maxLng = Math.max(maxLng, lng)
      maxLat = Math.max(maxLat, lat)
      hasCoords = true
    } else {
      for (const item of coords) {
        processCoords(item)
      }
    }
  }

  for (const feature of fc.features) {
    if (feature.geometry && 'coordinates' in feature.geometry) {
      processCoords(feature.geometry.coordinates)
    }
  }

  return hasCoords ? [minLng, minLat, maxLng, maxLat] : null
}

function extractPropertyNames(fc: FeatureCollection): string[] {
  const keys = new Set<string>()
  for (const feature of fc.features) {
    if (feature.properties) {
      for (const key of Object.keys(feature.properties)) {
        keys.add(key)
      }
    }
  }
  return Array.from(keys).sort()
}

/**
 * Migrate any existing localStorage data to IndexedDB (runs once).
 * Safe to call multiple times — skips if IndexedDB already has data.
 */
export async function migrateFromLocalStorage(): Promise<void> {
  try {
    const raw = localStorage.getItem(LEGACY_INDEX_KEY)
    if (!raw) return

    const legacyIndex: DatasetSummary[] = JSON.parse(raw)
    if (legacyIndex.length === 0) {
      localStorage.removeItem(LEGACY_INDEX_KEY)
      return
    }

    const db = await openDB()

    // Check if IndexedDB already has data
    const existingCount = await new Promise<number>((resolve, reject) => {
      const tx = db.transaction(STORE_INDEX, 'readonly')
      const req = tx.objectStore(STORE_INDEX).count()
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })

    if (existingCount > 0) {
      // Already migrated — clean up localStorage
      localStorage.removeItem(LEGACY_INDEX_KEY)
      for (const s of legacyIndex) {
        localStorage.removeItem(`${LEGACY_STORAGE_KEY}:${s.id}`)
      }
      return
    }

    // Migrate each dataset
    for (const summary of legacyIndex) {
      const dataRaw = localStorage.getItem(`${LEGACY_STORAGE_KEY}:${summary.id}`)
      if (dataRaw) {
        const dataset: GeoDataset = JSON.parse(dataRaw)
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction([STORE_DATASETS, STORE_INDEX], 'readwrite')
          tx.objectStore(STORE_DATASETS).put(dataset)
          tx.objectStore(STORE_INDEX).put(summary)
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        })
      }
    }

    // Clean up localStorage
    localStorage.removeItem(LEGACY_INDEX_KEY)
    for (const s of legacyIndex) {
      localStorage.removeItem(`${LEGACY_STORAGE_KEY}:${s.id}`)
    }
  } catch {
    // Migration failure is non-fatal — data stays in localStorage
  }
}

export async function listDatasets(): Promise<DatasetSummary[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_INDEX, 'readonly')
    const req = tx.objectStore(STORE_INDEX).getAll()
    req.onsuccess = () => {
      const results = req.result as DatasetSummary[]
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      resolve(results)
    }
    req.onerror = () => reject(req.error)
  })
}

export async function getDataset(id: string): Promise<GeoDataset | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DATASETS, 'readonly')
    const req = tx.objectStore(STORE_DATASETS).get(id)
    req.onsuccess = () => resolve((req.result as GeoDataset) ?? null)
    req.onerror = () => reject(req.error)
  })
}

export async function addDataset(
  data: FeatureCollection<Geometry, GeoJsonProperties>,
  metadata: Partial<DatasetMetadata>,
  format: DatasetFormat,
): Promise<GeoDataset> {
  const id = generateId()
  const now = new Date().toISOString()
  const raw = JSON.stringify(data)

  const fullMetadata: DatasetMetadata = {
    name: metadata.name ?? 'Untitled Dataset',
    description: metadata.description ?? '',
    source: metadata.source ?? '',
    license: metadata.license ?? '',
    tags: metadata.tags ?? [],
    crs: metadata.crs ?? 'EPSG:4326',
    status: metadata.status ?? 'active',
  }

  const dataset: GeoDataset = {
    id,
    metadata: fullMetadata,
    format,
    featureCount: data.features.length,
    bbox: computeBbox(data),
    properties: extractPropertyNames(data),
    createdAt: now,
    updatedAt: now,
    sizeBytes: new Blob([raw]).size,
    data,
  }

  const summary: DatasetSummary = {
    id: dataset.id,
    metadata: dataset.metadata,
    format: dataset.format,
    featureCount: dataset.featureCount,
    createdAt: dataset.createdAt,
    updatedAt: dataset.updatedAt,
    sizeBytes: dataset.sizeBytes,
  }

  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_DATASETS, STORE_INDEX], 'readwrite')
    tx.objectStore(STORE_DATASETS).put(dataset)
    tx.objectStore(STORE_INDEX).put(summary)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })

  return dataset
}

export async function updateDatasetMetadata(
  id: string,
  updates: Partial<DatasetMetadata>,
): Promise<GeoDataset | null> {
  const dataset = await getDataset(id)
  if (!dataset) return null

  dataset.metadata = { ...dataset.metadata, ...updates }
  dataset.updatedAt = new Date().toISOString()

  const summary: DatasetSummary = {
    id: dataset.id,
    metadata: dataset.metadata,
    format: dataset.format,
    featureCount: dataset.featureCount,
    createdAt: dataset.createdAt,
    updatedAt: dataset.updatedAt,
    sizeBytes: dataset.sizeBytes,
  }

  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_DATASETS, STORE_INDEX], 'readwrite')
    tx.objectStore(STORE_DATASETS).put(dataset)
    tx.objectStore(STORE_INDEX).put(summary)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })

  return dataset
}

export async function deleteDataset(id: string): Promise<boolean> {
  const db = await openDB()

  // Check if the dataset exists in the index
  const exists = await new Promise<boolean>((resolve, reject) => {
    const tx = db.transaction(STORE_INDEX, 'readonly')
    const req = tx.objectStore(STORE_INDEX).get(id)
    req.onsuccess = () => resolve(req.result != null)
    req.onerror = () => reject(req.error)
  })

  if (!exists) return false

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_DATASETS, STORE_INDEX], 'readwrite')
    tx.objectStore(STORE_DATASETS).delete(id)
    tx.objectStore(STORE_INDEX).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })

  return true
}

// ── Parsers (synchronous — no storage involved) ──

export function parseGeoJSON(text: string): FeatureCollection {
  const parsed = JSON.parse(text)
  if (parsed.type === 'FeatureCollection') {
    return parsed as FeatureCollection
  }
  if (parsed.type === 'Feature') {
    return { type: 'FeatureCollection', features: [parsed] }
  }
  if (parsed.type && parsed.coordinates) {
    return {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: parsed, properties: {} }],
    }
  }
  throw new Error('Invalid GeoJSON: expected FeatureCollection, Feature, or Geometry')
}

export function parseCSV(
  text: string,
  latField = 'latitude',
  lngField = 'longitude',
): FeatureCollection {
  const lines = text.trim().split('\n')
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row')

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  const latIdx = headers.findIndex(
    (h) => h.toLowerCase() === latField.toLowerCase(),
  )
  const lngIdx = headers.findIndex(
    (h) => h.toLowerCase() === lngField.toLowerCase(),
  )

  if (latIdx === -1 || lngIdx === -1) {
    throw new Error(
      `CSV must contain '${latField}' and '${lngField}' columns. Found: ${headers.join(', ')}`,
    )
  }

  const features = lines.slice(1).filter(Boolean).map((line, i) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
    const lat = parseFloat(values[latIdx])
    const lng = parseFloat(values[lngIdx])

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error(`Invalid coordinates on row ${i + 2}: lat=${values[latIdx]}, lng=${values[lngIdx]}`)
    }

    const properties: Record<string, string> = {}
    headers.forEach((h, j) => {
      if (j !== latIdx && j !== lngIdx) {
        properties[h] = values[j] ?? ''
      }
    })

    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [lng, lat],
      },
      properties,
    }
  })

  return { type: 'FeatureCollection', features }
}

export function parseKML(text: string): FeatureCollection {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/xml')

  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    throw new Error('Invalid KML: XML parsing failed')
  }

  const placemarks = doc.querySelectorAll('Placemark')
  const features: FeatureCollection['features'] = []

  placemarks.forEach((pm) => {
    const name = pm.querySelector('name')?.textContent ?? ''
    const description = pm.querySelector('description')?.textContent ?? ''

    const point = pm.querySelector('Point coordinates')
    const lineString = pm.querySelector('LineString coordinates')
    const polygon = pm.querySelector('Polygon outerBoundaryIs LinearRing coordinates')

    const properties: Record<string, string> = { name, description }

    // Extract ExtendedData
    pm.querySelectorAll('ExtendedData Data, ExtendedData SimpleData').forEach((d) => {
      const key = d.getAttribute('name') ?? d.tagName
      properties[key] = d.textContent?.trim() ?? ''
    })

    if (point) {
      const coords = parseKMLCoords(point.textContent ?? '')
      if (coords.length > 0) {
        features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: coords[0] },
          properties,
        })
      }
    } else if (lineString) {
      const coords = parseKMLCoords(lineString.textContent ?? '')
      if (coords.length > 0) {
        features.push({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: coords },
          properties,
        })
      }
    } else if (polygon) {
      const coords = parseKMLCoords(polygon.textContent ?? '')
      if (coords.length > 0) {
        features.push({
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [coords] },
          properties,
        })
      }
    }
  })

  return { type: 'FeatureCollection', features }
}

function parseKMLCoords(text: string): number[][] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((s) => {
      const parts = s.split(',').map(Number)
      return parts.length >= 2 ? [parts[0], parts[1]] : []
    })
    .filter((c) => c.length >= 2)
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
