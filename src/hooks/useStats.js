import { useState, useEffect } from 'react'
import { loadEntries } from '../data/storage'
import { hasValue, getActual } from '../utils/completion'

const DAYS = 14

function getDates(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  })
}

function activityHasEntry(activity, entry) {
  if (!entry?.values) return false
  return activity.fields.some(f => hasValue(f, entry.values[f.id]))
}

export function useStats(activities, date) {
  const [stats, setStats] = useState({})

  useEffect(() => {
    const dates = getDates(DAYS)

    const entriesByDate = {}
    dates.forEach(d => { entriesByDate[d] = loadEntries(d) })

    const result = {}
    activities.forEach(activity => {
      // Streak: consecutive days with any entry, newest first
      let streak = 0
      for (const d of dates) {
        const entry = entriesByDate[d].find(e => e.activityId === activity.id)
        if (activityHasEntry(activity, entry)) streak++
        else break
      }

      // Rolling averages for numeric field types
      const numericFields = activity.fields.filter(f =>
        ['number', 'duration', 'time_range', 'quantity', 'rating'].includes(f.type)
      )
      const averages = {}
      numericFields.forEach(field => {
        const vals = []
        dates.forEach(d => {
          const entry = entriesByDate[d].find(e => e.activityId === activity.id)
          if (entry?.values) {
            const v = getActual(field, entry.values[field.id])
            if (v !== null && !isNaN(v) && v > 0) vals.push(v)
          }
        })
        if (vals.length >= 2) {
          averages[field.id] = {
            value: vals.reduce((a, b) => a + b, 0) / vals.length,
            field,
            count: vals.length,
          }
        }
      })

      result[activity.id] = { streak, averages }
    })

    setStats(result)
  }, [activities, date])

  return stats
}
