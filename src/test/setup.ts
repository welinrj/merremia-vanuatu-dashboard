import 'fake-indexeddb/auto'
import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// ── In-memory Firestore mock ──
// Provides a Map-backed mock for firebase/firestore so tests run without network.

const store = new Map<string, Record<string, unknown>>()

function getPath(collectionPath: string, docId: string): string {
  return `${collectionPath}/${docId}`
}

// Mock doc reference
function mockDoc(_db: unknown, collectionPath: string, docId: string) {
  return { __type: 'docRef', collectionPath, docId }
}

// Mock collection reference
function mockCollection(_db: unknown, collectionPath: string) {
  return { __type: 'collectionRef', collectionPath }
}

// Mock query — returns the collection ref unchanged (ordering is done in-memory)
function mockQuery(collectionRef: { __type: string; collectionPath: string }) {
  return collectionRef
}

// Mock orderBy — no-op for tests
function mockOrderBy() {
  return {}
}

async function mockSetDoc(
  ref: { collectionPath: string; docId: string },
  data: Record<string, unknown>,
) {
  store.set(getPath(ref.collectionPath, ref.docId), { ...data })
}

async function mockGetDoc(ref: { collectionPath: string; docId: string }) {
  const path = getPath(ref.collectionPath, ref.docId)
  const data = store.get(path)
  return {
    exists: () => data != null,
    data: () => data ?? null,
  }
}

async function mockGetDocs(ref: { collectionPath: string }) {
  const prefix = ref.collectionPath + '/'
  const docs: Array<{ data: () => Record<string, unknown> }> = []
  for (const [key, value] of store.entries()) {
    if (key.startsWith(prefix)) {
      docs.push({ data: () => value })
    }
  }
  return { docs }
}

async function mockUpdateDoc(
  ref: { collectionPath: string; docId: string },
  updates: Record<string, unknown>,
) {
  const path = getPath(ref.collectionPath, ref.docId)
  const existing = store.get(path)
  if (existing) {
    store.set(path, { ...existing, ...updates })
  }
}

async function mockDeleteDoc(ref: { collectionPath: string; docId: string }) {
  store.delete(getPath(ref.collectionPath, ref.docId))
}

// Reset store between tests
beforeEach(() => {
  store.clear()
})

vi.mock('firebase/app', () => ({
  initializeApp: () => ({}),
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: () => ({}),
  collection: mockCollection,
  doc: mockDoc,
  getDocs: mockGetDocs,
  getDoc: mockGetDoc,
  setDoc: mockSetDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  query: mockQuery,
  orderBy: mockOrderBy,
}))
