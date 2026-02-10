import type {
  GeoDataset,
  DatasetSummary,
  DatasetMetadata,
  DatasetFormat,
} from '../types/geospatial'
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson'

const STORAGE_KEY = 'merremia-datasets'
const INDEX_KEY = 'merremia-datasets-index'

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

function getIndex(): DatasetSummary[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveIndex(index: DatasetSummary[]): void {
  localStorage.setItem(INDEX_KEY, JSON.stringify(index))
}

export function listDatasets(): DatasetSummary[] {
  return getIndex()
}

export function getDataset(id: string): GeoDataset | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${id}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function addDataset(
  data: FeatureCollection<Geometry, GeoJsonProperties>,
  metadata: Partial<DatasetMetadata>,
  format: DatasetFormat,
): GeoDataset {
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

  localStorage.setItem(`${STORAGE_KEY}:${id}`, JSON.stringify(dataset))

  const index = getIndex()
  index.unshift({
    id: dataset.id,
    metadata: dataset.metadata,
    format: dataset.format,
    featureCount: dataset.featureCount,
    createdAt: dataset.createdAt,
    updatedAt: dataset.updatedAt,
    sizeBytes: dataset.sizeBytes,
  })
  saveIndex(index)

  return dataset
}

export function updateDatasetMetadata(
  id: string,
  updates: Partial<DatasetMetadata>,
): GeoDataset | null {
  const dataset = getDataset(id)
  if (!dataset) return null

  dataset.metadata = { ...dataset.metadata, ...updates }
  dataset.updatedAt = new Date().toISOString()

  localStorage.setItem(`${STORAGE_KEY}:${id}`, JSON.stringify(dataset))

  const index = getIndex()
  const entry = index.find((d) => d.id === id)
  if (entry) {
    entry.metadata = dataset.metadata
    entry.updatedAt = dataset.updatedAt
    saveIndex(index)
  }

  return dataset
}

export function deleteDataset(id: string): boolean {
  const index = getIndex()
  const idx = index.findIndex((d) => d.id === id)
  if (idx === -1) return false

  index.splice(idx, 1)
  saveIndex(index)
  localStorage.removeItem(`${STORAGE_KEY}:${id}`)
  return true
}

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
