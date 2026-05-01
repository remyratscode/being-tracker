import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { defaultActivities } from '../data/defaults'

function fromDb(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type ?? 'input',
    tags: row.tags ?? [],
    fields: row.fields ?? [],
    archived: row.archived ?? false,
    containerId: row.container_id ?? null,
  }
}

function toDb(activity, sortOrder) {
  const row = {
    id: activity.id,
    name: activity.name,
    type: activity.type ?? 'input',
    tags: activity.tags ?? [],
    fields: activity.fields ?? [],
    archived: activity.archived ?? false,
    container_id: activity.containerId ?? null,
  }
  if (sortOrder !== undefined) row.sort_order = sortOrder
  return row
}

function log(type, activityId, activityName, meta = {}) {
  supabase.from('changelog').insert({ type, activity_id: activityId, activity_name: activityName, meta })
}

export function useActivities() {
  const [activities, setActivities] = useState([])
  const [ready, setReady] = useState(false)
  const activitiesRef = useRef([])

  useEffect(() => {
    activitiesRef.current = activities
  }, [activities])

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('sort_order')

      if (error) {
        console.error('[useActivities] load error:', error)
        setReady(true)
        return
      }

      if (data.length > 0) {
        setActivities(data.map(fromDb))
      } else {
        const rows = defaultActivities.map((a, i) => toDb(a, i))
        const { data: seeded, error: seedErr } = await supabase
          .from('activities')
          .insert(rows)
          .select()
        if (seedErr && seedErr.code !== '23505') console.error('[useActivities] seed error:', seedErr)
        if (seeded?.length) setActivities(seeded.map(fromDb))
      }

      setReady(true)
    }
    load()
  }, [])

  const addActivity = useCallback(async (activity) => {
    const sortOrder = activitiesRef.current.length
    const { data } = await supabase
      .from('activities')
      .insert(toDb(activity, sortOrder))
      .select()
      .single()
    if (data) {
      setActivities(prev => [...prev, fromDb(data)])
      log('created', activity.id, activity.name)
    }
  }, [])

  const updateActivity = useCallback(async (id, updates) => {
    const old = activitiesRef.current.find(a => a.id === id)
    const merged = { ...old, ...updates }
    const { data } = await supabase
      .from('activities')
      .update(toDb(merged))
      .eq('id', id)
      .select()
      .single()
    if (data) {
      setActivities(prev => prev.map(a => a.id === id ? fromDb(data) : a))
      if (old && updates.name && updates.name !== old.name)
        log('renamed', id, updates.name, { from: old.name, to: updates.name })
      if (old && updates.fields && JSON.stringify(updates.fields) !== JSON.stringify(old.fields))
        log('updated', id, updates.name ?? old.name, { fieldsChanged: true })
    }
  }, [])

  const deleteActivity = useCallback(async (id) => {
    const found = activitiesRef.current.find(a => a.id === id)
    await supabase.from('activities').delete().eq('id', id)
    setActivities(prev => prev.filter(a => a.id !== id))
    if (found) log('deleted', id, found.name)
  }, [])

  const archiveActivity = useCallback(async (id) => {
    const found = activitiesRef.current.find(a => a.id === id)
    await supabase.from('activities').update({ archived: true }).eq('id', id)
    setActivities(prev => prev.map(a => a.id === id ? { ...a, archived: true } : a))
    if (found) log('archived', id, found.name)
  }, [])

  const unarchiveActivity = useCallback(async (id) => {
    const found = activitiesRef.current.find(a => a.id === id)
    await supabase.from('activities').update({ archived: false }).eq('id', id)
    setActivities(prev => prev.map(a => a.id === id ? { ...a, archived: false } : a))
    if (found) log('restored', id, found.name)
  }, [])

  const renameTagAcrossActivities = useCallback(async (oldName, newName) => {
    const affected = activitiesRef.current.filter(a => a.tags.includes(oldName))
    setActivities(prev => prev.map(a => ({
      ...a,
      tags: a.tags.map(t => t === oldName ? newName : t),
    })))
    await Promise.all(affected.map(a =>
      supabase.from('activities')
        .update({ tags: a.tags.map(t => t === oldName ? newName : t) })
        .eq('id', a.id)
    ))
  }, [])

  const reorderActivity = useCallback(async (dragId, dropId) => {
    if (dragId === dropId) return
    setActivities(prev => {
      const drag = prev.find(a => a.id === dragId)
      if (!drag) return prev
      const without = prev.filter(a => a.id !== dragId)
      const dropIdx = without.findIndex(a => a.id === dropId)
      if (dropIdx === -1) return prev
      const next = [...without]
      next.splice(dropIdx, 0, drag)
      next.forEach((a, i) => supabase.from('activities').update({ sort_order: i }).eq('id', a.id))
      return next
    })
  }, [])

  return {
    activities, ready,
    addActivity, updateActivity, deleteActivity,
    archiveActivity, unarchiveActivity,
    renameTagAcrossActivities, reorderActivity,
  }
}
