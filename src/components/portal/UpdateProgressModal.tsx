import { useState, useEffect, type FC } from 'react'
import type { ActivityStatus, QuarterlyProgress } from '../../services/proDocStore'

interface UpdateProgressModalProps {
  activityCode: string
  activityDescription: string
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  year: number
  existing: QuarterlyProgress | null
  onSave: (progress: {
    status: ActivityStatus
    actualSpendUSD: number
    percentComplete: number
    notes: string
  }) => Promise<void>
  onCancel: () => void
}

const STATUS_OPTIONS: ActivityStatus[] = [
  'Not Started',
  'In Progress',
  'Completed',
  'On Hold',
  'Delayed',
]

const PRIMARY = '#2d6a4f'
const PRIMARY_LIGHT = '#40916c'
const PRIMARY_BG = '#f0fdf4'

const UpdateProgressModal: FC<UpdateProgressModalProps> = ({
  activityCode,
  activityDescription,
  quarter,
  year,
  existing,
  onSave,
  onCancel,
}) => {
  const [status, setStatus] = useState<ActivityStatus>(
    existing?.status ?? 'Not Started'
  )
  const [actualSpendUSD, setActualSpendUSD] = useState<string>(
    existing?.actualSpendUSD !== undefined ? String(existing.actualSpendUSD) : ''
  )
  const [percentComplete, setPercentComplete] = useState<string>(
    existing?.percentComplete !== undefined ? String(existing.percentComplete) : ''
  )
  const [notes, setNotes] = useState<string>(existing?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Re-populate if the `existing` prop changes (e.g. modal re-used for a different row)
  useEffect(() => {
    setStatus(existing?.status ?? 'Not Started')
    setActualSpendUSD(
      existing?.actualSpendUSD !== undefined ? String(existing.actualSpendUSD) : ''
    )
    setPercentComplete(
      existing?.percentComplete !== undefined ? String(existing.percentComplete) : ''
    )
    setNotes(existing?.notes ?? '')
    setError(null)
  }, [existing])

  const handleSave = async () => {
    setError(null)
    const spend = parseFloat(actualSpendUSD)
    const pct = parseFloat(percentComplete)

    if (isNaN(spend) || spend < 0) {
      setError('Actual Spend must be a non-negative number.')
      return
    }
    if (isNaN(pct) || pct < 0 || pct > 100) {
      setError('% Complete must be between 0 and 100.')
      return
    }

    setSaving(true)
    try {
      await onSave({ status, actualSpendUSD: spend, percentComplete: pct, notes })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.')
      setSaving(false)
    }
  }

  // Styles
  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  }

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: 12,
    padding: '2rem',
    maxWidth: 500,
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    position: 'relative',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: PRIMARY,
    marginBottom: '0.25rem',
  }

  const subtitleStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
    lineHeight: 1.4,
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '0.35rem',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.55rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: '0.95rem',
    color: '#1b1b1b',
    background: '#ffffff',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  const fieldStyle: React.CSSProperties = {
    marginBottom: '1.1rem',
  }

  const buttonRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
  }

  const cancelBtnStyle: React.CSSProperties = {
    padding: '0.55rem 1.25rem',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#374151',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: saving ? 'not-allowed' : 'pointer',
    opacity: saving ? 0.6 : 1,
  }

  const saveBtnStyle: React.CSSProperties = {
    padding: '0.55rem 1.5rem',
    borderRadius: 6,
    border: 'none',
    background: saving ? PRIMARY_LIGHT : PRIMARY,
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: saving ? 'not-allowed' : 'pointer',
    opacity: saving ? 0.8 : 1,
    transition: 'background 0.15s',
  }

  const errorStyle: React.CSSProperties = {
    marginTop: '0.75rem',
    padding: '0.5rem 0.75rem',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 6,
    color: '#b91c1c',
    fontSize: '0.85rem',
  }

  const yearBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    marginLeft: '0.4rem',
    fontSize: '0.75rem',
    color: PRIMARY,
    background: PRIMARY_BG,
    padding: '0.1rem 0.5rem',
    borderRadius: 4,
    fontWeight: 600,
  }

  return (
    <div style={backdropStyle} onClick={onCancel} role="dialog" aria-modal="true">
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={titleStyle}>
          Update Progress — {quarter}
          <span style={yearBadgeStyle}>{year}</span>
        </div>
        <div style={subtitleStyle}>
          <strong>{activityCode}</strong> — {activityDescription}
        </div>

        {/* Status */}
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="upm-status">Status</label>
          <select
            id="upm-status"
            style={inputStyle}
            value={status}
            onChange={(e) => setStatus(e.target.value as ActivityStatus)}
            disabled={saving}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Actual Spend */}
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="upm-spend">Actual Spend (USD)</label>
          <input
            id="upm-spend"
            type="number"
            min={0}
            step={0.01}
            style={inputStyle}
            placeholder="0.00"
            value={actualSpendUSD}
            onChange={(e) => setActualSpendUSD(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* % Complete */}
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="upm-pct">% Complete</label>
          <input
            id="upm-pct"
            type="number"
            min={0}
            max={100}
            step={1}
            style={inputStyle}
            placeholder="0"
            value={percentComplete}
            onChange={(e) => setPercentComplete(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* Notes */}
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="upm-notes">Notes</label>
          <textarea
            id="upm-notes"
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            placeholder="Add any relevant notes…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={saving}
          />
        </div>

        {/* Buttons */}
        <div style={buttonRowStyle}>
          <button
            style={cancelBtnStyle}
            onClick={onCancel}
            disabled={saving}
            type="button"
          >
            Cancel
          </button>
          <button
            style={saveBtnStyle}
            onClick={handleSave}
            disabled={saving}
            type="button"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        {error && <div style={errorStyle}>{error}</div>}
      </div>
    </div>
  )
}

export default UpdateProgressModal
