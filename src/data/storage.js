const ACTIVITIES_KEY = 'lifelog:activities'
const TAGS_KEY = 'lifelog:tags'

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
    return raw ? JSON.parse(raw) : null
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
