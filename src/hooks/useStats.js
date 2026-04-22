import { useState, useEffect } from 'react'
import { loadEntries } from '../data/storage'

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
  return activity.fields.some(f => {
    const v = entry.values[f.id]
    if (v === undefined || v === null) return false
    if (f.type === 'toggle') return v === true
    if (f.type === 'time_range') return !!(v?.start || v?.end)
    if (f.type === 'quantity') return v?.amount !== undefined && v?.amount !== ''
    return v !== ''
  })
}

function getNumericValue(field, value) {
  if (value === undefined || value === null || value === '') return null
  switch (field.type) {
    case 'number':   return Number(value)
    case 'duration': return Number(value)
    case 'quantity': return Number(value?.amount)
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

export function formatAvg(field, avg) {
  const round1 = v => Math.round(v * 10) / 10
  switch (field.type) {
    case 'number':
      return `${round1(avg)}`
    case 'duration': {
      const m = Math.round(avg)
      const h = Math.floor(m / 60)
      return h > 0 ? `${h}h ${m % 60}m` : `${m}m`
    }
    case 'time_range': {
      const totalM = Math.round(avg * 60)
      const h = Math.floor(totalM / 60)
      return h > 0 ? `${h}h ${totalM % 60}m` : `${totalM}m`
    }
    case 'quantity':
      return `${round1(avg)}${field.config.units?.[0] ?? ''}`
    default: return ''
  }
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
        ['number', 'duration', 'time_range', 'quantity'].includes(f.type)
      )
      const averages = {}
      numericFields.forEach(field => {
        const vals = []
        dates.forEach(d => {
          const entry = entriesByDate[d].find(e => e.activityId === activity.id)
          if (entry?.values) {
            const v = getNumericValue(field, entry.values[field.id])
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
