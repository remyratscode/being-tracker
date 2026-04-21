export function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  const isToday = dateStr === todayStr()
  const formatted = d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  return isToday ? `Today — ${formatted}` : formatted
}

function shiftDate(dateStr, days) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function DateNav({ date, onChange }) {
  const isToday = date === todayStr()

  return (
    <div className="date-nav">
      <button
        className="date-nav-btn"
        onClick={() => onChange(shiftDate(date, -1))}
        aria-label="Previous day"
      >
        ←
      </button>
      <span className="date-nav-label">{formatDate(date)}</span>
      <button
        className="date-nav-btn"
        onClick={() => onChange(shiftDate(date, 1))}
        disabled={isToday}
        aria-label="Next day"
      >
        →
      </button>
    </div>
  )
}
