import { useState, useCallback } from 'react'
import { loadTags, saveTags } from '../data/storage'

export function useTags(activities) {
  const [tags, setTags] = useState(() => {
    const stored = loadTags()
    if (stored) return stored
    // Seed from existing activities on first run
    const derived = [...new Set(activities.flatMap(a => a.tags))].sort()
    saveTags(derived)
    return derived
  })

  const persist = useCallback((updater) => {
    setTags(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveTags(next)
      return next
    })
  }, [])

  const addTag = useCallback((name) => {
    const tag = name.trim().toLowerCase()
    if (!tag) return
    persist(prev => prev.includes(tag) ? prev : [...prev, tag])
  }, [persist])

  const renameTag = useCallback((oldName, newName) => {
    const tag = newName.trim().toLowerCase()
    if (!tag || tag === oldName) return
    persist(prev => prev.map(t => t === oldName ? tag : t))
  }, [persist])

  const deleteTag = useCallback((name) => {
    persist(prev => prev.filter(t => t !== name))
  }, [persist])

  const moveTag = useCallback((name, direction) => {
    persist(prev => {
      const i = prev.indexOf(name)
      if (i === -1) return prev
      const next = [...prev]
      const target = i + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[i], next[target]] = [next[target], next[i]]
      return next
    })
  }, [persist])

  return { tags, addTag, renameTag, deleteTag, moveTag }
}
