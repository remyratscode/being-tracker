import { getCompletionStatus } from './completion'

export const RANGE_OPTIONS = [30, 60, 90, 180]

export function getDaysRange(n) {
  const days = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

export function loadDayEntries(date) {
  try {
    return JSON.parse(localStorage.getItem(`lifelog:entries:${date}`)) ?? []
  } catch {
    return []
  }
}

export function getDayRatio(activities, date, allEntries) {
  const active = activities.filter(a => !a.archived)
  if (!active.length) return null
  const entries = allEntries ? (allEntries[date] ?? []) : loadDayEntries(date)
  const entryMap = Object.fromEntries(entries.map(e => [e.activityId, e]))
  const done = active.filter(a => getCompletionStatus(a, entryMap[a.id]) === 'complete').length
  return done / active.length
}

export function getActivityValue(activity, entry) {
  const status = getCompletionStatus(activity, entry)
  if (status === 'complete') return 1
  if (status === 'partial') return 0.5
  if (!entry?.values) return 0
  const hasAny = Object.values(entry.values).some(v => {
    if (v === null || v === undefined || v === '' || v === false) return false
    if (typeof v === 'object') return Object.values(v).some(vv => vv !== '' && vv != null)
    return true
  })
  return hasAny ? 0.2 : 0
}

export function ratioToColor(ratio) {
  if (ratio === null || ratio === undefined) return 'transparent'
  if (ratio === 0) return '#1e1e24'
  if (ratio < 0.25) return '#14532d'
  if (ratio < 0.5) return '#166534'
  if (ratio < 0.75) return '#15803d'
  if (ratio < 1) return '#16a34a'
  return '#22c55e'
}

export function buildWeekGrid(days) {
  const firstDate = new Date(days[0] + 'T12:00:00')
  const startDow = (firstDate.getDay() + 6) % 7 // Mon=0, Sun=6
  const padded = [...Array(startDow).fill(null), ...days]
  const weeks = []
  for (let i = 0; i < padded.length; i += 7) {
    const week = padded.slice(i, i + 7)
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
}

export function getMonthLabels(weeks) {
  return weeks.map(week => {
    const firstDate = week.find(d => d !== null)
    if (!firstDate) return null
    const date = new Date(firstDate + 'T12:00:00')
    if (date.getDate() <= 7) return date.toLocaleString('default', { month: 'short' })
    return null
  })
}
