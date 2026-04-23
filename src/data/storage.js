const ACTIVITIES_KEY = 'lifelog:activities'
const TAGS_KEY = 'lifelog:tags'

export const TAG_PALETTE = [
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f97316', // orange
  '#06b6d4', // cyan
  '#f43f5e', // rose
  '#84cc16', // lime
  '#a78bfa', // lavender
  '#fb923c', // peach
]

export function loadActivities() {
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveActivities(activities) {
  try {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities))
  } catch {}
}

export function loadTags() {
  try {
    const raw = localStorage.getItem(TAGS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed.length) return []
    // Migrate: string[] → { name, color }[]
    if (typeof parsed[0] === 'string') {
      return parsed.map((name, i) => ({ name, color: TAG_PALETTE[i % TAG_PALETTE.length] }))
    }
    return parsed
  } catch {
    return null
  }
}

export function saveTags(tags) {
  try {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags))
  } catch {}
}

export function loadEntries(date) {
  try {
    const raw = localStorage.getItem(`lifelog:entries:${date}`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveEntries(date, entries) {
  try {
    localStorage.setItem(`lifelog:entries:${date}`, JSON.stringify(entries))
  } catch {}
}
