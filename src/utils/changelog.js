const KEY = 'lifelog:changelog'

export function loadChangelog() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch {
    return []
  }
}

export function appendChangelogEvent(event) {
  const log = loadChangelog()
  log.push({ ...event, timestamp: new Date().toISOString() })
  localStorage.setItem(KEY, JSON.stringify(log))
}
