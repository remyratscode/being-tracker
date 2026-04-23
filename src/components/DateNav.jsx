import { todayStr, shiftDate, formatDateLabel } from '../utils/date'

export { todayStr } from '../utils/date'

export default function DateNav({ date, onChange }) {
  const isToday = date === todayStr()

  return (
    <div className="date-nav">
      <button className="date-nav-btn" onClick={() => onChange(shiftDate(date, -1))} aria-label="Previous day">←</button>
      <span className="date-nav-label">{formatDateLabel(date)}</span>
      <button className="date-nav-btn" onClick={() => onChange(shiftDate(date, 1))} disabled={isToday} aria-label="Next day">→</button>
    </div>
  )
}
