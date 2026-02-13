import type {
  ProtectedArea,
  ProtectedAreaSummary,
  ProtectedAreaType,
  ProtectedAreaStatus,
  ProtectedAreaAttachment,
} from '../types/protectedArea'
import type { FeatureCollection } from 'geojson'

const DB_NAME = 'vcap2-protected-areas'
const DB_VERSION = 1
const STORE_AREAS = 'areas'
const STORE_INDEX = 'index'

let dbInstance: IDBDatabase | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance)

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_AREAS)) {
        db.createObjectStore(STORE_AREAS, { keyPath: 'id' })
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

function generateId(): string {
  return `pa_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function toSummary(area: ProtectedArea): ProtectedAreaSummary {
  return {
    id: area.id,
    name: area.name,
    type: area.type,
    status: area.status,
    island: area.island,
    province: area.province,
    areaHa: area.areaHa,
    createdAt: area.createdAt,
    updatedAt: area.updatedAt,
  }
}

export async function listProtectedAreas(): Promise<ProtectedAreaSummary[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_INDEX, 'readonly')
    const req = tx.objectStore(STORE_INDEX).getAll()
    req.onsuccess = () => {
      const results = req.result as ProtectedAreaSummary[]
      results.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      resolve(results)
    }
    req.onerror = () => reject(req.error)
  })
}

export async function getProtectedArea(
  id: string,
): Promise<ProtectedArea | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_AREAS, 'readonly')
    const req = tx.objectStore(STORE_AREAS).get(id)
    req.onsuccess = () => resolve((req.result as ProtectedArea) ?? null)
    req.onerror = () => reject(req.error)
  })
}

export async function createProtectedArea(input: {
  name: string
  type: ProtectedAreaType
  status: ProtectedAreaStatus
  description: string
  island: string
  province: string
  areaHa: number | null
  designatedDate: string
  managementAuthority: string
  boundary: FeatureCollection | null
}): Promise<ProtectedArea> {
  const id = generateId()
  const now = new Date().toISOString()

  const area: ProtectedArea = {
    id,
    name: input.name,
    type: input.type,
    status: input.status,
    description: input.description,
    island: input.island,
    province: input.province,
    areaHa: input.areaHa,
    designatedDate: input.designatedDate,
    managementAuthority: input.managementAuthority,
    boundary: input.boundary,
    attachments: [],
    createdAt: now,
    updatedAt: now,
  }

  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_AREAS, STORE_INDEX], 'readwrite')
    tx.objectStore(STORE_AREAS).put(area)
    tx.objectStore(STORE_INDEX).put(toSummary(area))
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })

  return area
}

export async function updateProtectedArea(
  id: string,
  updates: Partial<
    Omit<ProtectedArea, 'id' | 'createdAt' | 'updatedAt' | 'attachments'>
  >,
): Promise<ProtectedArea | null> {
  const area = await getProtectedArea(id)
  if (!area) return null

  Object.assign(area, updates)
  area.updatedAt = new Date().toISOString()

  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_AREAS, STORE_INDEX], 'readwrite')
    tx.objectStore(STORE_AREAS).put(area)
    tx.objectStore(STORE_INDEX).put(toSummary(area))
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })

  return area
}

export async function deleteProtectedArea(id: string): Promise<boolean> {
  const db = await openDB()

  const exists = await new Promise<boolean>((resolve, reject) => {
    const tx = db.transaction(STORE_INDEX, 'readonly')
    const req = tx.objectStore(STORE_INDEX).get(id)
    req.onsuccess = () => resolve(req.result != null)
    req.onerror = () => reject(req.error)
  })

  if (!exists) return false

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_AREAS, STORE_INDEX], 'readwrite')
    tx.objectStore(STORE_AREAS).delete(id)
    tx.objectStore(STORE_INDEX).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })

  return true
}

export async function addAttachment(
  areaId: string,
  file: File,
): Promise<ProtectedArea | null> {
  const area = await getProtectedArea(areaId)
  if (!area) return null

  const data = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })

  const attachment: ProtectedAreaAttachment = {
    id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    data,
  }

  area.attachments.push(attachment)
  area.updatedAt = new Date().toISOString()

  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_AREAS, STORE_INDEX], 'readwrite')
    tx.objectStore(STORE_AREAS).put(area)
    tx.objectStore(STORE_INDEX).put(toSummary(area))
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })

  return area
}

export async function removeAttachment(
  areaId: string,
  attachmentId: string,
): Promise<ProtectedArea | null> {
  const area = await getProtectedArea(areaId)
  if (!area) return null

  area.attachments = area.attachments.filter((a) => a.id !== attachmentId)
  area.updatedAt = new Date().toISOString()

  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_AREAS, STORE_INDEX], 'readwrite')
    tx.objectStore(STORE_AREAS).put(area)
    tx.objectStore(STORE_INDEX).put(toSummary(area))
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })

  return area
}

// ── Sync helpers ──

export async function exportAllAreas(): Promise<ProtectedArea[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_AREAS, 'readonly')
    const req = tx.objectStore(STORE_AREAS).getAll()
    req.onsuccess = () => resolve(req.result as ProtectedArea[])
    req.onerror = () => reject(req.error)
  })
}

export async function importAreas(
  areas: ProtectedArea[],
): Promise<{ imported: number; skipped: number }> {
  let imported = 0
  let skipped = 0
  const db = await openDB()

  for (const area of areas) {
    const exists = await new Promise<boolean>((resolve, reject) => {
      const tx = db.transaction(STORE_INDEX, 'readonly')
      const req = tx.objectStore(STORE_INDEX).get(area.id)
      req.onsuccess = () => resolve(req.result != null)
      req.onerror = () => reject(req.error)
    })

    if (exists) {
      skipped++
      continue
    }

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_AREAS, STORE_INDEX], 'readwrite')
      tx.objectStore(STORE_AREAS).put(area)
      tx.objectStore(STORE_INDEX).put(toSummary(area))
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    imported++
  }

  return { imported, skipped }
}

export async function updateAreaGitHubSha(
  id: string,
  sha: string,
): Promise<void> {
  const db = await openDB()

  const area = await new Promise<ProtectedArea | null>((resolve, reject) => {
    const tx = db.transaction(STORE_AREAS, 'readonly')
    const req = tx.objectStore(STORE_AREAS).get(id)
    req.onsuccess = () => resolve((req.result as ProtectedArea) ?? null)
    req.onerror = () => reject(req.error)
  })

  if (!area) return

  area.githubSha = sha

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_AREAS, STORE_INDEX], 'readwrite')
    tx.objectStore(STORE_AREAS).put(area)
    tx.objectStore(STORE_INDEX).put(toSummary(area))
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export function downloadAttachment(attachment: ProtectedAreaAttachment): void {
  const a = document.createElement('a')
  a.href = attachment.data
  a.download = attachment.name
  a.click()
}

export function formatArea(ha: number | null): string {
  if (ha == null) return 'N/A'
  if (ha >= 100) return `${ha.toLocaleString()} ha`
  return `${ha.toFixed(1)} ha`
}
