import { useState, useMemo, useRef } from 'react'
import DateNav, { todayStr } from './components/DateNav'
import ActivityCard from './components/ActivityCard'
import ActivityModal from './components/ActivityModal'
import TagsModal from './components/TagsModal'
import HistoryModal from './components/HistoryModal'
import { useActivities } from './hooks/useActivities'
import { useEntries } from './hooks/useEntries'
import { useTags } from './hooks/useTags'
import { useStats } from './hooks/useStats'

function hasValue(field, value) {
  if (value === undefined || value === null) return false
  switch (field.type) {
    case 'toggle': return value === true
    case 'time_range': return !!(value?.start && value?.end)
    case 'quantity': return value?.amount !== undefined && value?.amount !== ''
    default: return value !== ''
  }
}

function getActual(field, value) {
  switch (field.type) {
    case 'number':   return Number(value)
    case 'duration': return Number(value)
    case 'quantity': return Number(value?.amount)
    case 'time_range': {
      if (!value?.start || !value?.end) return null
      const [sh, sm] = value.start.split(':').map(Number)
      const [eh, em] = value.end.split(':').map(Number)
      let mins = eh * 60 + em - (sh * 60 + sm)
      if (mins < 0) mins += 1440
      return mins / 60
    }
    default: return null
  }
}

function fieldIsDone(field, value) {
  const goal = field.config?.goal
  if (goal?.target !== undefined && goal?.target !== '') {
    const target = Number(goal.target)
    const op = goal.operator ?? 'gte'
    const actual = getActual(field, value)
    if (actual === null || isNaN(actual)) return false
    return op === 'gte' ? actual >= target
         : op === 'lte' ? actual <= target
         : actual === target
  }
  return hasValue(field, value)
}

function getCompletionStatus(activity, entry) {
  if (!activity.fields.length) return 'empty'
  const values = entry?.values ?? {}
  const done = activity.fields.filter(f => fieldIsDone(f, values[f.id]))
  if (done.length === 0) return 'empty'
  if (done.length === activity.fields.length) return 'complete'
  return 'partial'
}

export default function App() {
  const [date, setDate] = useState(todayStr)
  const { activities, addActivity, updateActivity, deleteActivity, renameTagAcrossActivities, reorderActivity } = useActivities()
  const { getEntry, setFieldValue } = useEntries(date)
  const { tags, addTag, renameTag, deleteTag, moveTag } = useTags(activities)

  const stats = useStats(activities, date)

  const [modal, setModal] = useState(null)
  const [tagsOpen, setTagsOpen] = useState(false)
  const [historyActivity, setHistoryActivity] = useState(null)

  const draggingId = useRef(null)
  const [dragOverId, setDragOverId] = useState(null)

  const editingActivity = typeof modal === 'string' && modal !== 'create'
    ? activities.find(a => a.id === modal)
    : null

  function handleSave(activityData) {
    if (editingActivity) updateActivity(activityData.id, activityData)
    else addActivity(activityData)
    activityData.tags.forEach(t => addTag(t))
  }

  function handleRenameTag(oldName, newName) {
    renameTag(oldName, newName)
    renameTagAcrossActivities(oldName, newName)
  }

  const groups = useMemo(() => {
    const firstTags = activities.map(a => a.tags[0]).filter(Boolean)
    const orderedTags = [
      ...tags.filter(t => firstTags.includes(t)),
      ...[...new Set(firstTags.filter(t => !tags.includes(t)))],
    ]
    const result = orderedTags
      .map(tag => ({ tag, items: activities.filter(a => a.tags[0] === tag) }))
      .filter(g => g.items.length > 0)
    const untagged = activities.filter(a => !a.tags.length)
    if (untagged.length > 0) result.push({ tag: null, items: untagged })
    return result
  }, [activities, tags])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-name">Life Log</span>
          <button className="add-activity-btn" onClick={() => setModal('create')} title="New activity">+</button>
          <button className="tags-manage-btn" onClick={() => setTagsOpen(true)} title="Manage tags">#</button>
        </div>
        <DateNav date={date} onChange={setDate} />
      </header>

      <main className="app-main">
        {groups.map(({ tag, items }) => (
          <div key={tag ?? '__untagged'} className="tag-group">
            <div className="tag-group-header">
              <span className="tag-group-label">{tag ?? 'Uncategorized'}</span>
            </div>
            {items.map(activity => {
              const entry = getEntry(activity.id)
              return (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  entry={entry}
                  completionStatus={getCompletionStatus(activity, entry)}
                  isDragOver={dragOverId === activity.id}
                  stats={stats[activity.id]}
                  onFieldChange={(fieldId, value) => setFieldValue(activity.id, fieldId, value)}
                  onEdit={() => setModal(activity.id)}
                  onHistory={() => setHistoryActivity(activity)}
                  onDragStart={() => { draggingId.current = activity.id }}
                  onDragOver={e => { e.preventDefault(); if (draggingId.current !== activity.id) setDragOverId(activity.id) }}
                  onDragLeave={() => setDragOverId(null)}
                  onDrop={() => {
                    if (draggingId.current && draggingId.current !== activity.id) {
                      reorderActivity(draggingId.current, activity.id)
                    }
                    draggingId.current = null
                    setDragOverId(null)
                  }}
                  onDragEnd={() => { draggingId.current = null; setDragOverId(null) }}
                />
              )
            })}
          </div>
        ))}

        {activities.length === 0 && (
          <p className="empty-state">No activities yet. Create one to get started.</p>
        )}

        <button className="add-activity-card" onClick={() => setModal('create')}>
          + New activity
        </button>
      </main>

      {modal && (
        <ActivityModal
          activity={editingActivity ?? null}
          allTags={tags}
          onSave={handleSave}
          onDelete={deleteActivity}
          onClose={() => setModal(null)}
        />
      )}

      {tagsOpen && (
        <TagsModal
          tags={tags}
          onAdd={addTag}
          onRename={handleRenameTag}
          onDelete={deleteTag}
          onMove={moveTag}
          onClose={() => setTagsOpen(false)}
        />
      )}

      {historyActivity && (
        <HistoryModal
          activity={historyActivity}
          onClose={() => setHistoryActivity(null)}
        />
      )}
    </div>
  )
}
