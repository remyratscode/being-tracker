import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
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
    if (!activities.length) return
    const dates = getDates(DAYS)
    const startDate = dates[dates.length - 1]

    supabase
      .from('entries')
      .select('activity_id, date, values')
      .in('activity_id', activities.map(a => a.id))
      .gte('date', startDate)
      .then(({ data }) => {
        if (!data) return

        // Build lookup: activityId → date → { values }
        const byActivityDate = {}
        data.forEach(row => {
          if (!byActivityDate[row.activity_id]) byActivityDate[row.activity_id] = {}
          byActivityDate[row.activity_id][row.date] = { values: row.values }
        })

        const result = {}
        activities.forEach(activity => {
          const actEntries = byActivityDate[activity.id] ?? {}

          let streak = 0
          for (const d of dates) {
            if (activityHasEntry(activity, actEntries[d])) streak++
            else break
          }

          const numericFields = activity.fields.filter(f =>
            ['number', 'duration', 'time_range', 'quantity', 'rating'].includes(f.type)
          )
          const averages = {}
          numericFields.forEach(field => {
            const vals = []
            dates.forEach(d => {
              const entry = actEntries[d]
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
      })
  }, [activities, date])

  return stats
}
