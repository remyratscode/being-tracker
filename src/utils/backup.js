export function exportData() {
  const data = {
    version: 2,
    exportedAt: new Date().toISOString(),
    activities: JSON.parse(localStorage.getItem('lifelog:activities') ?? 'null'),
    tags: JSON.parse(localStorage.getItem('lifelog:tags') ?? 'null'),
    changelog: JSON.parse(localStorage.getItem('lifelog:changelog') ?? '[]'),
    entries: {},
  }
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('lifelog:entries:')) {
      const date = key.replace('lifelog:entries:', '')
      try { data.entries[date] = JSON.parse(localStorage.getItem(key)) } catch {}
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `lifelog-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (!data.activities) throw new Error('Invalid backup file')
        localStorage.setItem('lifelog:activities', JSON.stringify(data.activities))
        if (data.tags) localStorage.setItem('lifelog:tags', JSON.stringify(data.tags))
        if (data.changelog) localStorage.setItem('lifelog:changelog', JSON.stringify(data.changelog))
        if (data.entries) {
          Object.entries(data.entries).forEach(([date, entries]) => {
            localStorage.setItem(`lifelog:entries:${date}`, JSON.stringify(entries))
          })
        }
        resolve()
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}
