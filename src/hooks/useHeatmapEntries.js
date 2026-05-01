import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useHeatmapEntries(days) {
  const [allEntries, setAllEntries] = useState({})

  useEffect(() => {
    if (!days.length) return
    const startDate = days[0]
    const endDate = days[days.length - 1]

    supabase
      .from('entries')
      .select('activity_id, date, values')
      .gte('date', startDate)
      .lte('date', endDate)
      .then(({ data }) => {
        const res = {}
        days.forEach(d => { res[d] = [] })
        data?.forEach(row => {
          if (res[row.date]) {
            res[row.date].push({ activityId: row.activity_id, values: row.values })
          }
        })
        setAllEntries(res)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days[0], days[days.length - 1]])

  return allEntries
}
