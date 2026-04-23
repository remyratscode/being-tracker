import { useState, useCallback } from 'react'
import { loadActivities, saveActivities } from '../data/storage'
import { defaultActivities } from '../data/defaults'

function init() {
  const stored = loadActivities()
  if (!stored) {
    saveActivities(defaultActivities)
    return defaultActivities
  }
  return stored
}

export function useActivities() {
  const [activities, setActivities] = useState(init)

  const persist = useCallback((updater) => {
    setActivities(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveActivities(next)
      return next
    })
  }, [])

  const addActivity = useCallback((activity) => {
    persist(prev => [...prev, activity])
  }, [persist])

  const updateActivity = useCallback((id, updates) => {
    persist(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  }, [persist])

  const deleteActivity = useCallback((id) => {
    persist(prev => prev.filter(a => a.id !== id))
  }, [persist])

  const renameTagAcrossActivities = useCallback((oldName, newName) => {
    persist(prev => prev.map(a => ({
      ...a,
      tags: a.tags.map(t => t === oldName ? newName : t),
    })))
  }, [persist])

  const reorderActivity = useCallback((dragId, dropId) => {
    persist(prev => {
      if (dragId === dropId) return prev
      const drag = prev.find(a => a.id === dragId)
      if (!drag) return prev
      const without = prev.filter(a => a.id !== dragId)
      const dropIdx = without.findIndex(a => a.id === dropId)
      if (dropIdx === -1) return prev
      const next = [...without]
      next.splice(dropIdx, 0, drag)
      return next
    })
  }, [persist])

  const archiveActivity = useCallback((id) => {
    persist(prev => prev.map(a => a.id === id ? { ...a, archived: true } : a))
  }, [persist])

  const unarchiveActivity = useCallback((id) => {
    persist(prev => prev.map(a => a.id === id ? { ...a, archived: false } : a))
  }, [persist])

  return { activities, addActivity, updateActivity, deleteActivity, renameTagAcrossActivities, reorderActivity, archiveActivity, unarchiveActivity }
}
