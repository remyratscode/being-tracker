export function hasValue(field, value) {
  if (value === undefined || value === null) return false
  switch (field.type) {
    case 'toggle':     return value === true
    case 'time_range': return !!(value?.start && value?.end)
    case 'quantity':   return value?.amount !== undefined && value?.amount !== ''
    case 'rating':     return Number(value) > 0
    case 'checklist':  return typeof value === 'object' && Object.values(value).some(Boolean)
    default:           return value !== ''
  }
}

export function getActual(field, value) {
  switch (field.type) {
    case 'number':
    case 'duration':  return Number(value)
    case 'quantity':  return Number(value?.amount)
    case 'rating':    return Number(value)
    case 'time_range': {
      if (!value?.start || !value?.end) return null
      const [sh, sm] = value.start.split(':').map(Number)
      const [eh, em] = value.end.split(':').map(Number)
      let mins = eh * 60 + em - (sh * 60 + sm)
      if (mins < 0) mins += 1440
      return mins / 60
    }
    default: return null
  }
}

export function fieldIsDone(field, value) {
  const goal = field.config?.goal
  if (goal?.target !== undefined && goal?.target !== '') {
    const target = Number(goal.target)
    const op = goal.operator ?? 'gte'
    const actual = getActual(field, value)
    if (actual === null || isNaN(actual)) return false
    return op === 'gte' ? actual >= target
         : op === 'lte' ? actual <= target
         : actual === target
  }
  return hasValue(field, value)
}

export function getCompletionStatus(activity, entry) {
  if (!activity.fields.length) return 'empty'
  const values = entry?.values ?? {}
  const done = activity.fields.filter(f => fieldIsDone(f, values[f.id]))
  if (done.length === 0) return 'empty'
  if (done.length === activity.fields.length) return 'complete'
  return 'partial'
}
