import { useState, useCallback } from 'react'
import { loadTags, saveTags, TAG_PALETTE } from '../data/storage'
import { defaultTags } from '../data/defaults'

export function useTags(activities) {
  const [tags, setTags] = useState(() => {
    const stored = loadTags()
    if (stored) return stored
    saveTags(defaultTags)
    return defaultTags
  })

  const persist = useCallback((updater) => {
    setTags(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveTags(next)
      return next
    })
  }, [])

  const addTag = useCallback((name) => {
    const n = name.trim().toLowerCase()
    if (!n) return
    persist(prev => {
      if (prev.some(t => t.name === n)) return prev
      const color = TAG_PALETTE[prev.length % TAG_PALETTE.length]
      return [...prev, { name: n, color }]
    })
  }, [persist])

  const renameTag = useCallback((oldName, newName) => {
    const n = newName.trim().toLowerCase()
    if (!n || n === oldName) return
    persist(prev => prev.map(t => t.name === oldName ? { ...t, name: n } : t))
  }, [persist])

  const deleteTag = useCallback((name) => {
    persist(prev => prev.filter(t => t.name !== name))
  }, [persist])

  const moveTag = useCallback((name, direction) => {
    persist(prev => {
      const i = prev.findIndex(t => t.name === name)
      if (i === -1) return prev
      const next = [...prev]
      const target = i + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[i], next[target]] = [next[target], next[i]]
      return next
    })
  }, [persist])

  const updateTagColor = useCallback((name, color) => {
    persist(prev => prev.map(t => t.name === name ? { ...t, color } : t))
  }, [persist])

  return { tags, addTag, renameTag, deleteTag, moveTag, updateTagColor }
}
