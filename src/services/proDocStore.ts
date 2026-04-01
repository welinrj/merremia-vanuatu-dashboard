import { db } from './firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
} from 'firebase/firestore'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ActivityStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Completed'
  | 'On Hold'
  | 'Delayed'

export interface ProDocActivity {
  id: string              // e.g. "1.1.1"
  code: string            // e.g. "1.1.1"
  description: string
  fundingSource: string   // e.g. "GEF/TF"
  annualBudgetUSD: number
  quarterlyBudgetUSD: number  // annualBudget / 4
  sortOrder: number
}

export interface QuarterlyProgress {
  activityId: string
  year: number
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  status: ActivityStatus
  actualSpendUSD: number
  percentComplete: number  // 0–100
  notes: string
  updatedAt: string        // ISO date string
  updatedBy: string
}

// ---------------------------------------------------------------------------
// Collection names
// ---------------------------------------------------------------------------

const ACTIVITIES_COLLECTION = 'prodoc_activities'
const PROGRESS_COLLECTION = 'quarterly_progress'

// ---------------------------------------------------------------------------
// Default activities
// ---------------------------------------------------------------------------

/**
 * Returns the hardcoded default set of ProDoc activities for the
 * Vanuatu Fisheries project.  Used as a fallback when Firestore is
 * unavailable or the collection is empty.
 */
export function getDefaultActivities(): ProDocActivity[] {
  const defaults: Omit<ProDocActivity, 'quarterlyBudgetUSD'>[] = [
    {
      id: '1.1.1',
      code: '1.1.1',
      description: 'Fisheries Planning Meeting',
      fundingSource: 'GEF/TF',
      annualBudgetUSD: 12_000,
      sortOrder: 1,
    },
    {
      id: '1.1.2',
      code: '1.1.2',
      description: 'Species TOT Training',
      fundingSource: 'GEF/TF',
      annualBudgetUSD: 8_000,
      sortOrder: 2,
    },
    {
      id: '1.1.3',
      code: '1.1.3',
      description: 'Community Engagement',
      fundingSource: 'GEF/TF',
      annualBudgetUSD: 6_000,
      sortOrder: 3,
    },
    {
      id: '1.2.1',
      code: '1.2.1',
      description: 'Coastal Survey',
      fundingSource: 'GEF/TF',
      annualBudgetUSD: 15_000,
      sortOrder: 4,
    },
    {
      id: '1.2.2',
      code: '1.2.2',
      description: 'Stock Assessment',
      fundingSource: 'GEF/TF',
      annualBudgetUSD: 10_000,
      sortOrder: 5,
    },
    {
      id: '1.3.1',
      code: '1.3.1',
      description: 'MPA Monitoring',
      fundingSource: 'GEF/TF',
      annualBudgetUSD: 9_000,
      sortOrder: 6,
    },
    {
      id: '1.3.2',
      code: '1.3.2',
      description: 'Data Collection',
      fundingSource: 'GEF/TF',
      annualBudgetUSD: 7_000,
      sortOrder: 7,
    },
    {
      id: '2.1.1',
      code: '2.1.1',
      description: 'Policy Development',
      fundingSource: 'GEF/TF',
      annualBudgetUSD: 5_000,
      sortOrder: 8,
    },
  ]

  return defaults.map((a) => ({
    ...a,
    quarterlyBudgetUSD: a.annualBudgetUSD / 4,
  }))
}

// ---------------------------------------------------------------------------
// Firestore helpers
// ---------------------------------------------------------------------------

/**
 * Fetch all ProDoc activities from Firestore.
 * Falls back to getDefaultActivities() if db is null or the collection
 * is empty.
 */
export async function listActivities(): Promise<ProDocActivity[]> {
  if (!db) {
    console.warn('proDocStore: Firestore not configured — using default activities.')
    return getDefaultActivities()
  }

  try {
    const snap = await getDocs(collection(db, ACTIVITIES_COLLECTION))

    if (snap.empty) {
      return getDefaultActivities()
    }

    return snap.docs.map((d) => d.data() as ProDocActivity)
  } catch (err) {
    console.error('proDocStore: Failed to fetch activities from Firestore.', err)
    return getDefaultActivities()
  }
}

/**
 * Fetch a single QuarterlyProgress record.
 * Returns null if the record does not exist or db is not configured.
 */
export async function getQuarterlyProgress(
  activityId: string,
  year: number,
  quarter: string,
): Promise<QuarterlyProgress | null> {
  if (!db) {
    console.warn('proDocStore: Firestore not configured — cannot fetch quarterly progress.')
    return null
  }

  try {
    const docId = `${activityId}_${year}_${quarter}`
    const snap = await getDoc(doc(db, PROGRESS_COLLECTION, docId))

    if (!snap.exists()) {
      return null
    }

    return snap.data() as QuarterlyProgress
  } catch (err) {
    console.error(
      `proDocStore: Failed to fetch progress for ${activityId} ${year} ${quarter}.`,
      err,
    )
    return null
  }
}

/**
 * Fetch all QuarterlyProgress records for a given year and quarter.
 *
 * Uses a single-field query on `year` only (no composite index required),
 * then filters by quarter client-side. This avoids a Firestore composite
 * index that would otherwise need to be manually deployed.
 */
export async function listQuarterlyProgressForYear(
  year: number,
  quarter: string,
): Promise<QuarterlyProgress[]> {
  if (!db) {
    console.warn('proDocStore: Firestore not configured — cannot fetch quarterly progress list.')
    return []
  }

  try {
    const q = query(
      collection(db, PROGRESS_COLLECTION),
      where('year', '==', year),
    )
    const snap = await getDocs(q)
    const all = snap.docs.map((d) => d.data() as QuarterlyProgress)
    // Filter by quarter client-side — avoids needing a composite index
    return quarter ? all.filter((r) => r.quarter === quarter) : all
  } catch (err) {
    console.error(
      `proDocStore: Failed to fetch progress list for ${year} ${quarter}.`,
      err,
    )
    return []
  }
}

/**
 * Upsert a QuarterlyProgress record.
 * The document ID is `{activityId}_{year}_{quarter}` (e.g. "1.1.1_2026_Q1").
 * If db is not configured this is a no-op.
 */
export async function saveQuarterlyProgress(
  progress: Omit<QuarterlyProgress, 'updatedAt'> & { updatedAt?: string },
): Promise<void> {
  if (!db) {
    console.warn('proDocStore: Firestore not configured — quarterly progress not saved.')
    return
  }

  const record: QuarterlyProgress = {
    ...progress,
    updatedAt: progress.updatedAt ?? new Date().toISOString(),
  }

  const docId = `${record.activityId}_${record.year}_${record.quarter}`

  try {
    await setDoc(doc(db, PROGRESS_COLLECTION, docId), record)
  } catch (err) {
    console.error(
      `proDocStore: Failed to save progress for ${docId}.`,
      err,
    )
    throw err
  }
}
