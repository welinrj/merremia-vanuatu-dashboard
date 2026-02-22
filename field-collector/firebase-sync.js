/**
 * Firebase Sync for Field Collector
 *
 * Add this script to field-collector/index.html to enable real-time syncing
 *
 * Usage in HTML:
 * <script type="module" src="firebase-sync.js"></script>
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js'
import { getDatabase, ref, push, set, onValue } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js'

// Firebase configuration - replace with your values
const firebaseConfig = {
  apiKey: window.FIREBASE_API_KEY || localStorage.getItem('firebase_api_key'),
  authDomain: window.FIREBASE_AUTH_DOMAIN || localStorage.getItem('firebase_auth_domain'),
  projectId: window.FIREBASE_PROJECT_ID || localStorage.getItem('firebase_project_id'),
  storageBucket: window.FIREBASE_STORAGE_BUCKET || localStorage.getItem('firebase_storage_bucket'),
  messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || localStorage.getItem('firebase_messaging_sender_id'),
  appId: window.FIREBASE_APP_ID || localStorage.getItem('firebase_app_id'),
  databaseURL: window.FIREBASE_DATABASE_URL || localStorage.getItem('firebase_database_url'),
}

// Check if Firebase is configured
const isConfigured = Object.values(firebaseConfig).every(val => val && val !== 'null')

if (!isConfigured) {
  console.warn('Firebase not configured. Syncing disabled. Set FIREBASE_* environment variables or configure in app.')
}

let app, database, auth, storage
let currentUser = null

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    database = getDatabase(app)
    auth = getAuth(app)
    storage = getStorage(app)

    // Anonymous authentication for field collectors
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = user
        console.log('Firebase: Authenticated', user.uid)
        showSyncStatus('online')
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error('Firebase auth error:', error)
          showSyncStatus('offline')
        })
      }
    })
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
}

/**
 * Save observation to Firebase Realtime Database
 */
export async function saveObservationToFirebase(observation) {
  if (!isConfigured || !currentUser) {
    console.warn('Firebase not available, saving locally only')
    return null
  }

  try {
    const observationsRef = ref(database, 'field_observations')
    const newObservationRef = push(observationsRef)

    const observationData = {
      ...observation,
      id: newObservationRef.key,
      syncedAt: new Date().toISOString(),
      userId: currentUser.uid,
    }

    await set(newObservationRef, observationData)
    console.log('Observation saved to Firebase:', newObservationRef.key)

    showSyncNotification('Observation synced ✓')
    return newObservationRef.key
  } catch (error) {
    console.error('Error saving to Firebase:', error)
    showSyncNotification('Sync failed - saved locally', 'error')
    return null
  }
}

/**
 * Upload image to Firebase Storage
 */
export async function uploadImageToFirebase(file, observationId, index) {
  if (!isConfigured || !currentUser) {
    return null
  }

  try {
    const fileExtension = file.name.split('.').pop()
    const fileName = `${observationId}_${index}.${fileExtension}`
    const imageRef = storageRef(storage, `field-data/images/${fileName}`)

    const uploadResult = await uploadBytes(imageRef, file, {
      customMetadata: {
        observationId,
        uploadedBy: currentUser.uid,
        uploadDate: new Date().toISOString(),
      }
    })

    const downloadURL = await getDownloadURL(uploadResult.ref)
    console.log('Image uploaded to Firebase:', downloadURL)
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

/**
 * Subscribe to real-time observation updates
 */
export function subscribeToObservations(callback) {
  if (!isConfigured) {
    return () => {}
  }

  const observationsRef = ref(database, 'field_observations')

  const unsubscribe = onValue(observationsRef, (snapshot) => {
    const observations = []
    snapshot.forEach((childSnapshot) => {
      observations.push(childSnapshot.val())
    })

    // Sort by timestamp, most recent first
    observations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    callback(observations)
  })

  return unsubscribe
}

/**
 * Sync local observations to Firebase
 */
export async function syncLocalObservationsToFirebase(localObservations) {
  if (!isConfigured || !currentUser) {
    console.warn('Cannot sync - Firebase not available')
    return { synced: 0, failed: 0 }
  }

  let synced = 0
  let failed = 0

  for (const obs of localObservations) {
    // Skip if already synced (has firebaseId)
    if (obs.firebaseId) {
      continue
    }

    try {
      const firebaseId = await saveObservationToFirebase(obs)
      if (firebaseId) {
        // Update local storage to mark as synced
        obs.firebaseId = firebaseId
        synced++
      } else {
        failed++
      }
    } catch (error) {
      console.error('Sync error for observation:', obs.id, error)
      failed++
    }
  }

  if (synced > 0) {
    showSyncNotification(`Synced ${synced} observation(s)`)
  }
  if (failed > 0) {
    showSyncNotification(`${failed} observation(s) failed to sync`, 'error')
  }

  return { synced, failed }
}

/**
 * Show sync status indicator
 */
function showSyncStatus(status) {
  const indicator = document.getElementById('firebase-sync-status')
  if (indicator) {
    indicator.className = `sync-status sync-status-${status}`
    indicator.title = status === 'online' ? 'Connected to Firebase' : 'Offline - saving locally'
  }
}

/**
 * Show sync notification
 */
function showSyncNotification(message, type = 'success') {
  const notification = document.createElement('div')
  notification.className = `sync-notification sync-notification-${type}`
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.classList.add('fade-out')
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Auto-sync on page load (sync any un-synced local observations)
if (isConfigured) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const localData = localStorage.getItem('field-observations')
      if (localData) {
        try {
          const observations = JSON.parse(localData)
          syncLocalObservationsToFirebase(observations)
        } catch (error) {
          console.error('Error loading local observations:', error)
        }
      }
    }, 2000) // Wait 2 seconds after load to ensure auth is ready
  })
}

// Export for use in field collector
window.FirebaseSync = {
  saveObservation: saveObservationToFirebase,
  uploadImage: uploadImageToFirebase,
  subscribe: subscribeToObservations,
  syncLocal: syncLocalObservationsToFirebase,
  isConfigured: () => isConfigured,
}

console.log('Firebase Sync module loaded. Available at window.FirebaseSync')
