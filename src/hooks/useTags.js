import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { defaultTags } from '../data/defaults'
import { TAG_PALETTE } from '../data/storage'

function fromDb(row) {
  return { name: row.name, color: row.color }
}

export function useTags() {
  const [tags, setTags] = useState([])
  const tagsRef = useRef([])

  useEffect(() => { tagsRef.current = tags }, [tags])

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('sort_order')

      if (error) { console.error('[useTags] load error:', error); return }

      if (data.length > 0) {
        setTags(data.map(fromDb))
      } else {
        const rows = defaultTags.map((t, i) => ({ name: t.name, color: t.color, sort_order: i }))
        const { data: seeded, error: seedErr } = await supabase
          .from('tags')
          .insert(rows)
          .select()
        if (seedErr) console.error('[useTags] seed error:', seedErr)
        if (seeded?.length) setTags(seeded.map(fromDb))
      }
    }
    load()
  }, [])

  const addTag = useCallback(async (name) => {
    const n = name.trim().toLowerCase()
    if (!n || tagsRef.current.some(t => t.name === n)) return
    const color = TAG_PALETTE[tagsRef.current.length % TAG_PALETTE.length]
    const sortOrder = tagsRef.current.length
    setTags(prev => [...prev, { name: n, color }])
    const { error } = await supabase.from('tags').insert({ name: n, color, sort_order: sortOrder })
    // Ignore duplicate key errors (23505) — tag already exists in DB
    if (error && error.code !== '23505') {
      setTags(prev => prev.filter(t => t.name !== n))
    }
  }, [])

  const renameTag = useCallback(async (oldName, newName) => {
    const n = newName.trim().toLowerCase()
    if (!n || n === oldName) return
    setTags(prev => prev.map(t => t.name === oldName ? { ...t, name: n } : t))
    await supabase.from('tags').update({ name: n }).eq('name', oldName)
  }, [])

  const deleteTag = useCallback(async (name) => {
    setTags(prev => prev.filter(t => t.name !== name))
    await supabase.from('tags').delete().eq('name', name)
  }, [])

  const moveTag = useCallback(async (name, direction) => {
    setTags(prev => {
      const i = prev.findIndex(t => t.name === name)
      if (i === -1) return prev
      const next = [...prev]
      const target = i + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[i], next[target]] = [next[target], next[i]]
      next.forEach((t, idx) => supabase.from('tags').update({ sort_order: idx }).eq('name', t.name))
      return next
    })
  }, [])

  const updateTagColor = useCallback(async (name, color) => {
    setTags(prev => prev.map(t => t.name === name ? { ...t, color } : t))
    await supabase.from('tags').update({ color }).eq('name', name)
  }, [])

  return { tags, addTag, renameTag, deleteTag, moveTag, updateTagColor }
}
