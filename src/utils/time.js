export function nowTimeStr() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function computeDuration(start, end) {
  if (!start || !end) return null
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let mins = eh * 60 + em - (sh * 60 + sm)
  if (mins < 0) mins += 1440
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export function formatMinutes(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export function formatAvg(field, avg) {
  const round1 = v => Math.round(v * 10) / 10
  switch (field.type) {
    case 'number':   return `${round1(avg)}`
    case 'duration': return formatMinutes(Math.round(avg))
    case 'time_range': return formatMinutes(Math.round(avg * 60))
    case 'quantity': return `${round1(avg)}${field.config.units?.[0] ?? ''}`
    case 'rating':   return `${round1(avg)}/${field.config?.max ?? 5}`
    default:         return ''
  }
}
