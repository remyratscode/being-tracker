import { useMemo } from 'react'
import { todayStr } from '../utils/date'
import { loadEntries } from '../data/storage'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function entryHasData(entries) {
  return entries.some(e =>
    e.values && Object.values(e.values).some(v => {
      if (v === null || v === undefined) return false
      if (typeof v === 'boolean') return v
      if (typeof v === 'object') return Object.values(v).some(x => x !== '' && x !== null && x !== undefined)
      return v !== ''
    })
  )
}

export default function WeekStrip({ currentDate, onDateChange, todayEntryCount }) {
  const days = useMemo(() => {
    const today = todayStr()
    const ref = new Date(currentDate + 'T12:00:00')
    const dow = ref.getDay()
    const monday = new Date(ref)
    monday.setDate(ref.getDate() - (dow === 0 ? 6 : dow - 1))

    return DAY_LABELS.map((label, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      const dateStr = d.toISOString().split('T')[0]
      const isFuture = dateStr > today
      const isToday = dateStr === today
      const isSelected = dateStr === currentDate

      let status = 'empty'
      if (!isFuture) {
        const entries = loadEntries(dateStr)
        if (entryHasData(entries)) status = 'logged'
      }

      return { label, dateStr, isFuture, isToday, isSelected, status }
    })
  }, [currentDate, todayEntryCount])

  return (
    <div className="week-strip">
      {days.map(day => (
        <button
          key={day.dateStr}
          className={[
            'week-day',
            day.isSelected && 'week-day--selected',
            day.isToday   && 'week-day--today',
            day.isFuture  && 'week-day--future',
          ].filter(Boolean).join(' ')}
          onClick={() => !day.isFuture && onDateChange(day.dateStr)}
          disabled={day.isFuture}
          title={day.dateStr}
        >
          <span className="week-day-label">{day.label}</span>
          <span className={`week-day-dot ${day.status === 'logged' ? 'week-day-dot--logged' : ''}`} />
        </button>
      ))}
    </div>
  )
}
