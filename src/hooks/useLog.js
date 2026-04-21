import { useState, useEffect, useCallback } from 'react'

const defaultLog = {
  night: {
    redLights: false,
    blueLightGlasses: false,
    phoneAwayFromBed: false,
    sleepTime: '',
    wakeTime: '',
  },
  morning: {
    offPhone45: false,
    outsideBreathe: false,
    meditation: false,
    reading: false,
    journaling: false,
    supplements: false,
  },
  bodyAndDay: {
    exercise: '',
    eating: '',
    university: '',
    coding: '',
    pagesRead: '',
    stretching: false,
    talkingToParents: false,
  },
}

function mergeWithDefault(stored) {
  return {
    night: { ...defaultLog.night, ...stored.night },
    morning: { ...defaultLog.morning, ...stored.morning },
    bodyAndDay: { ...defaultLog.bodyAndDay, ...stored.bodyAndDay },
  }
}

function load(date) {
  try {
    const raw = localStorage.getItem(`lifelog-${date}`)
    return raw ? mergeWithDefault(JSON.parse(raw)) : structuredClone(defaultLog)
  } catch {
    return structuredClone(defaultLog)
  }
}

export function useLog(date) {
  const [log, setLog] = useState(() => load(date))

  useEffect(() => {
    setLog(load(date))
  }, [date])

  const update = useCallback((section, field, value) => {
    setLog(prev => {
      const next = {
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }
      try {
        localStorage.setItem(`lifelog-${date}`, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [date])

  return { log, update }
}
