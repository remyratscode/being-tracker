import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useContainers() {
  const [containers, setContainers] = useState([])

  useEffect(() => {
    supabase
      .from('containers')
      .select('*')
      .order('created_at')
      .then(({ data }) => setContainers(data ?? []))
  }, [])

  const addContainer = useCallback(async (name, tag, id = crypto.randomUUID()) => {
    const { data } = await supabase
      .from('containers')
      .insert({ id, name, tag })
      .select()
      .single()
    if (data) setContainers(prev => [...prev, data])
    return id
  }, [])

  const renameContainer = useCallback(async (id, name) => {
    setContainers(prev => prev.map(c => c.id === id ? { ...c, name } : c))
    await supabase.from('containers').update({ name }).eq('id', id)
  }, [])

  const deleteContainer = useCallback(async (id) => {
    setContainers(prev => prev.filter(c => c.id !== id))
    await supabase.from('containers').delete().eq('id', id)
  }, [])

  return { containers, addContainer, renameContainer, deleteContainer }
}
