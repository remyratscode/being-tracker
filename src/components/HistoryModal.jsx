import { useState, useEffect } from 'react'
import { loadEntries } from '../data/storage'
import { computeDuration } from '../utils/time'

function formatValue(field, value) {
  if (value === undefined || value === null || value === '') return '—'
  switch (field.type) {
    case 'toggle': return value ? '✓' : '—'
    case 'time_point': return value
    case 'time_range': {
      if (!value?.start && !value?.end) return '—'
      const dur = computeDuration(value.start, value.end)
      const range = [value.start, value.end].filter(Boolean).join(' – ')
      return dur ? `${range} (${dur})` : range
    }
    case 'duration': return value ? `${value} min` : '—'
    case 'quantity': return value?.amount ? `${value.amount} ${value.unit ?? ''}`.trim() : '—'
    case 'rating': {
      const n = Number(value)
      const max = field.config?.max ?? 5
      return n > 0 ? `${'★'.repeat(n)}${'☆'.repeat(max - n)} (${n}/${max})` : '—'
    }
    case 'checklist': {
      if (!value || typeof value !== 'object') return '—'
      const items = field.config?.items ?? []
      const checked = items.filter(i => value[i])
      return checked.length ? `${checked.join(', ')} (${checked.length}/${items.length})` : '—'
    }
    default: return String(value)
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const DAYS_BACK = 30

export default function HistoryModal({ activity, onClose }) {
  const [rows, setRows] = useState([])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const result = []
    for (let i = 0; i < DAYS_BACK; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const entries = loadEntries(dateStr)
      const entry = entries.find(e => e.activityId === activity.id)
      if (entry && Object.keys(entry.values ?? {}).length > 0) {
        result.push({ date: dateStr, values: entry.values })
      }
    }
    setRows(result)
  }, [activity.id])

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">

        <div className="modal-header">
          <span className="modal-title">{activity.name} — history</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {rows.length === 0 ? (
            <p className="history-empty">No entries in the last {DAYS_BACK} days.</p>
          ) : (
            <div className="history-list">
              {rows.map(({ date, values }) => (
                <div key={date} className="history-row">
                  <span className="history-date">{formatDate(date)}</span>
                  <div className="history-fields">
                    {activity.fields.map(field => (
                      <div key={field.id} className="history-field">
                        <span className="history-field-label">{field.label}</span>
                        <span className="history-field-value">{formatValue(field, values[field.id])}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <span className="history-hint">Last {DAYS_BACK} days with entries</span>
          <div className="modal-footer-right">
            <button className="btn btn--ghost" onClick={onClose}>Close</button>
          </div>
        </div>

      </div>
    </div>
  )
}
