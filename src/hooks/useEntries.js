import { useState, useEffect, useCallback } from 'react'
import { loadEntries, saveEntries } from '../data/storage'

export function useEntries(date) {
  const [entries, setEntries] = useState(() => loadEntries(date))

  useEffect(() => {
    setEntries(loadEntries(date))
  }, [date])

  const setFieldValue = useCallback((activityId, fieldId, value) => {
    setEntries(prev => {
      const exists = prev.find(e => e.activityId === activityId)
      const next = exists
        ? prev.map(e =>
            e.activityId === activityId
              ? { ...e, values: { ...e.values, [fieldId]: value } }
              : e
          )
        : [...prev, {
            id: `${activityId}-${date}`,
            activityId,
            date,
            values: { [fieldId]: value },
            loggedAt: new Date().toISOString(),
          }]
      saveEntries(date, next)
      return next
    })
  }, [date])

  const getEntry = useCallback(
    (activityId) => entries.find(e => e.activityId === activityId),
    [entries]
  )

  return { getEntry, setFieldValue }
}
