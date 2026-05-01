import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

function fromDb(row) {
  return {
    id: row.id,
    activityId: row.activity_id,
    date: row.date,
    values: row.values ?? {},
    loggedAt: row.logged_at,
  }
}

export function useEntries(date) {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    setEntries([])
    supabase
      .from('entries')
      .select('*')
      .eq('date', date)
      .then(({ data }) => setEntries(data?.map(fromDb) ?? []))
  }, [date])

  const setFieldValue = useCallback(async (activityId, fieldId, value) => {
    // Optimistic local update
    setEntries(prev => {
      const exists = prev.find(e => e.activityId === activityId)
      if (exists) {
        return prev.map(e =>
          e.activityId === activityId
            ? { ...e, values: { ...e.values, [fieldId]: value } }
            : e
        )
      }
      return [...prev, {
        id: `${activityId}-${date}`,
        activityId,
        date,
        values: { [fieldId]: value },
        loggedAt: new Date().toISOString(),
      }]
    })

    // Atomic merge via DB function — safe for concurrent calls
    await supabase.rpc('upsert_entry_field', {
      p_activity_id: activityId,
      p_date: date,
      p_field_id: fieldId,
      p_value: value,
    })
  }, [date])

  const getEntry = useCallback(
    (activityId) => entries.find(e => e.activityId === activityId),
    [entries]
  )

  return { getEntry, setFieldValue }
}
