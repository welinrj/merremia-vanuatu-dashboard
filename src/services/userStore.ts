import type { UserProfile } from '../types/user'

const DB_NAME = 'vcap2-users'
const DB_VERSION = 1
const STORE_USERS = 'users'

let dbInstance: IDBDatabase | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance)

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_USERS)) {
        db.createObjectStore(STORE_USERS, { keyPath: 'id' })
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
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export async function createUser(name: string, avatar: string | null): Promise<UserProfile> {
  const user: UserProfile = {
    id: generateId(),
    name,
    avatar,
    createdAt: new Date().toISOString(),
  }

  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_USERS, 'readwrite')
    tx.objectStore(STORE_USERS).put(user)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })

  return user
}

export async function getUser(id: string): Promise<UserProfile | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_USERS, 'readonly')
    const req = tx.objectStore(STORE_USERS).get(id)
    req.onsuccess = () => resolve((req.result as UserProfile) ?? null)
    req.onerror = () => reject(req.error)
  })
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>,
): Promise<UserProfile | null> {
  const user = await getUser(id)
  if (!user) return null

  Object.assign(user, updates)

  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_USERS, 'readwrite')
    tx.objectStore(STORE_USERS).put(user)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })

  return user
}

export async function listUsers(): Promise<UserProfile[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_USERS, 'readonly')
    const req = tx.objectStore(STORE_USERS).getAll()
    req.onsuccess = () => resolve(req.result as UserProfile[])
    req.onerror = () => reject(req.error)
  })
}

export async function findUserByName(name: string): Promise<UserProfile | null> {
  const users = await listUsers()
  return users.find((u) => u.name.toLowerCase() === name.toLowerCase()) ?? null
}
