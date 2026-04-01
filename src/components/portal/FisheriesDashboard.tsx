import { useState, useEffect, useCallback, type FC } from 'react'
import {
  listActivities,
  listQuarterlyProgressForYear,
  saveQuarterlyProgress,
  type ProDocActivity,
  type QuarterlyProgress,
  type ActivityStatus,
} from '../../services/proDocStore'
import UpdateProgressModal from './UpdateProgressModal'
import './DataPortal.css'
import './GISDatabase.css'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CURRENT_YEAR = 2026
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const
type Quarter = (typeof QUARTERS)[number]

/** VT per USD exchange rate */
const VT_RATE = 119.25

// ---------------------------------------------------------------------------
// Status badge helpers
// ---------------------------------------------------------------------------

interface BadgeStyle {
  background: string
  color: string
}

const STATUS_BADGE: Record<ActivityStatus, BadgeStyle> = {
  'Not Started': { background: '#f3f4f6', color: '#6b7280' },
  'In Progress': { background: '#dbeafe', color: '#1d4ed8' },
  'Completed':   { background: '#dcfce7', color: '#166534' },
  'On Hold':     { background: '#ffedd5', color: '#c2410c' },
  'Delayed':     { background: '#fee2e2', color: '#b91c1c' },
}

function StatusBadge({ status }: { status: ActivityStatus }) {
  const s = STATUS_BADGE[status]
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.15rem 0.55rem',
        borderRadius: 100,
        fontSize: '0.7rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
        background: s.background,
        color: s.color,
      }}
    >
      {status}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Currency formatters
// ---------------------------------------------------------------------------

function fmtUSD(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function fmtVT(value: number): string {
  return Math.round(value * VT_RATE).toLocaleString('en-US')
}

// ---------------------------------------------------------------------------
// Modal state type
// ---------------------------------------------------------------------------

interface ModalState {
  activity: ProDocActivity
  quarter: Quarter
  existing: QuarterlyProgress | null
}

// ---------------------------------------------------------------------------
// FisheriesDashboard
// ---------------------------------------------------------------------------

const FisheriesDashboard: FC = () => {
  const [activities, setActivities] = useState<ProDocActivity[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, QuarterlyProgress>>({})
  const [loading, setLoading] = useState(true)
  const [modalState, setModalState] = useState<ModalState | null>(null)

  // ── Load activities ────────────────────────────────────────────────────────
  const loadActivities = useCallback(async () => {
    const data = await listActivities()
    // Sort by sortOrder then id to be consistent
    data.sort((a, b) => a.sortOrder - b.sortOrder)
    setActivities(data)
  }, [])

  // ── Load quarterly progress for all four quarters ─────────────────────────
  const loadProgress = useCallback(async () => {
    const results = await Promise.all(
      QUARTERS.map((q) => listQuarterlyProgressForYear(CURRENT_YEAR, q)),
    )

    const map: Record<string, QuarterlyProgress> = {}
    results.flat().forEach((rec) => {
      map[`${rec.activityId}_${rec.quarter}`] = rec
    })
    setProgressMap(map)
  }, [])

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    async function init() {
      setLoading(true)
      await Promise.all([loadActivities(), loadProgress()])
      if (!cancelled) setLoading(false)
    }
    init()
    return () => { cancelled = true }
  }, [loadActivities, loadProgress])

  // ── Open modal ────────────────────────────────────────────────────────────
  const openModal = (activity: ProDocActivity, quarter: Quarter) => {
    const existing = progressMap[`${activity.id}_${quarter}`] ?? null
    setModalState({ activity, quarter, existing })
  }

  // ── Save handler ──────────────────────────────────────────────────────────
  const handleSave = async (progress: {
    status: ActivityStatus
    actualSpendUSD: number
    percentComplete: number
    notes: string
  }) => {
    if (!modalState) return
    const { activity, quarter } = modalState

    await saveQuarterlyProgress({
      activityId: activity.id,
      year: CURRENT_YEAR,
      quarter,
      status: progress.status,
      actualSpendUSD: progress.actualSpendUSD,
      percentComplete: progress.percentComplete,
      notes: progress.notes,
      updatedBy: 'user',
    })

    // Refresh progress data then close modal
    await loadProgress()
    setModalState(null)
  }

  // ── Styles ────────────────────────────────────────────────────────────────

  const containerStyle: React.CSSProperties = {
    padding: '1.5rem',
    minWidth: 0,
  }

  const headerStyle: React.CSSProperties = {
    marginBottom: '1.5rem',
  }

  const h2Style: React.CSSProperties = {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#2d6a4f',
    margin: 0,
    lineHeight: 1.2,
  }

  const subtitleStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  }

  const tableWrapStyle: React.CSSProperties = {
    overflowX: 'auto',
    background: '#ffffff',
    borderRadius: 10,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  }

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
    tableLayout: 'auto',
  }

  const thStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    background: '#f9fafb',
    padding: '0.65rem 0.85rem',
    textAlign: 'left',
    fontWeight: 700,
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#374151',
    borderBottom: '2px solid #e5e7eb',
    whiteSpace: 'nowrap',
    zIndex: 1,
  }

  const thCenterStyle: React.CSSProperties = {
    ...thStyle,
    textAlign: 'center',
  }

  const tdStyle: React.CSSProperties = {
    padding: '0.6rem 0.85rem',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'middle',
    color: '#1f2937',
  }

  const tdCenterStyle: React.CSSProperties = {
    ...tdStyle,
    textAlign: 'center',
  }

  const codeStyle: React.CSSProperties = {
    fontWeight: 700,
    color: '#2d6a4f',
    whiteSpace: 'nowrap',
  }

  const updateBtnStyle: React.CSSProperties = {
    display: 'inline-block',
    marginTop: '0.3rem',
    padding: '0.25rem 0.65rem',
    background: '#2d6a4f',
    color: '#ffffff',
    border: 'none',
    borderRadius: 5,
    fontSize: '0.72rem',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    transition: 'background 0.15s',
    whiteSpace: 'nowrap',
  }

  const budgetLineStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.1rem',
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={h2Style}>Fisheries Dashboard</h2>
          <p style={subtitleStyle}>VCAP2 Project Activity Tracker</p>
        </div>
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#6b7280',
            background: '#ffffff',
            borderRadius: 10,
            border: '1px solid #e5e7eb',
          }}
        >
          Loading activities…
        </div>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={h2Style}>Fisheries Dashboard</h2>
        <p style={subtitleStyle}>VCAP2 Project Activity Tracker</p>
      </div>

      {/* Table */}
      <div style={tableWrapStyle} className="db-table-wrap">
        <table style={tableStyle} className="db-table">
          <thead>
            <tr>
              <th style={thStyle}>Activity Code</th>
              <th style={{ ...thStyle, minWidth: 200 }}>Description</th>
              <th style={thStyle}>Funding Source</th>
              <th style={thStyle}>Annual Budget</th>
              <th style={thStyle}>Quarterly Budget</th>
              {QUARTERS.map((q) => (
                <th key={q} style={thCenterStyle}>{q}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, idx) => (
              <tr
                key={activity.id}
                style={{
                  background: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                }}
              >
                {/* Activity Code */}
                <td style={tdStyle}>
                  <span style={codeStyle}>{activity.code}</span>
                </td>

                {/* Description */}
                <td style={{ ...tdStyle, minWidth: 200 }}>
                  {activity.description}
                </td>

                {/* Funding Source */}
                <td style={tdStyle}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.15rem 0.5rem',
                      background: '#f0fdf4',
                      color: '#2d6a4f',
                      border: '1px solid #bbf7d0',
                      borderRadius: 4,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {activity.fundingSource}
                  </span>
                </td>

                {/* Annual Budget */}
                <td style={tdStyle}>
                  <div style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                    ${fmtUSD(activity.annualBudgetUSD)}
                  </div>
                  <div style={budgetLineStyle}>
                    VT {fmtVT(activity.annualBudgetUSD)}
                  </div>
                </td>

                {/* Quarterly Budget */}
                <td style={tdStyle}>
                  <div style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                    ${fmtUSD(activity.quarterlyBudgetUSD)}
                  </div>
                  <div style={budgetLineStyle}>
                    VT {fmtVT(activity.quarterlyBudgetUSD)}
                  </div>
                </td>

                {/* Q1–Q4 columns */}
                {QUARTERS.map((q) => {
                  const key = `${activity.id}_${q}`
                  const rec = progressMap[key] ?? null
                  return (
                    <td key={q} style={tdCenterStyle}>
                      {rec ? (
                        <StatusBadge status={rec.status} />
                      ) : (
                        <span style={{ color: '#d1d5db', fontSize: '0.85rem' }}>—</span>
                      )}
                      <br />
                      <button
                        style={updateBtnStyle}
                        onClick={() => openModal(activity, q)}
                        type="button"
                      >
                        Update
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}

            {activities.length === 0 && (
              <tr>
                <td
                  colSpan={5 + QUARTERS.length}
                  style={{ ...tdStyle, textAlign: 'center', padding: '2rem', color: '#9ca3af' }}
                >
                  No activities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalState && (
        <UpdateProgressModal
          activityCode={modalState.activity.code}
          activityDescription={modalState.activity.description}
          quarter={modalState.quarter}
          year={CURRENT_YEAR}
          existing={modalState.existing}
          onSave={handleSave}
          onCancel={() => setModalState(null)}
        />
      )}
    </div>
  )
}

export default FisheriesDashboard
