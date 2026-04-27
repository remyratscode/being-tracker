import { useState, useMemo, useRef } from 'react'
import DateNav, { todayStr } from './components/DateNav'
import WeekStrip from './components/WeekStrip'
import ProgressRing from './components/ProgressRing'
import ActivityCard from './components/ActivityCard'
import ActivityModal from './components/ActivityModal'
import TagsModal from './components/TagsModal'
import HistoryModal from './components/HistoryModal'
import HelpPanel from './components/HelpPanel'
import { useActivities } from './hooks/useActivities'
import { useEntries } from './hooks/useEntries'
import { useTags } from './hooks/useTags'
import { useStats } from './hooks/useStats'
import { getCompletionStatus } from './utils/completion'
import { exportData, importData } from './utils/backup'

export default function App() {
  const [date, setDate] = useState(todayStr)
  const {
    activities,
    addActivity, updateActivity, deleteActivity,
    archiveActivity, unarchiveActivity,
    renameTagAcrossActivities, reorderActivity,
  } = useActivities()
  const { getEntry, setFieldValue } = useEntries(date)
  const { tags, addTag, renameTag, deleteTag, moveTag, updateTagColor } = useTags(activities)

  const [modal, setModal] = useState(null)
  const [tagsOpen, setTagsOpen] = useState(false)
  const [historyActivity, setHistoryActivity] = useState(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const [filterTags, setFilterTags] = useState(new Set())
  const [archivedOpen, setArchivedOpen] = useState(false)

  const draggingId = useRef(null)
  const [dragOverId, setDragOverId] = useState(null)
  const importRef = useRef(null)

  const activeActivities = useMemo(() => activities.filter(a => !a.archived), [activities])
  const archivedActivities = useMemo(() => activities.filter(a => a.archived), [activities])

  const stats = useStats(activeActivities, date)

  const editingActivity = typeof modal === 'string' && modal !== 'create'
    ? activities.find(a => a.id === modal)
    : null

  const tagColors = useMemo(() =>
    Object.fromEntries(tags.map(t => [t.name, t.color])),
    [tags]
  )

  function handleSave(activityData) {
    if (editingActivity) updateActivity(activityData.id, activityData)
    else addActivity(activityData)
    activityData.tags.forEach(t => addTag(t))
  }

  function handleRenameTag(oldName, newName) {
    renameTag(oldName, newName)
    renameTagAcrossActivities(oldName, newName)
  }

  // Group active activities by first tag, ordered by registry
  const groups = useMemo(() => {
    const firstTags = activeActivities.map(a => a.tags[0]).filter(Boolean)
    const orderedTagNames = [
      ...tags.filter(t => firstTags.includes(t.name)).map(t => t.name),
      ...[...new Set(firstTags.filter(t => !tags.some(r => r.name === t)))],
    ]
    const result = orderedTagNames
      .map(tagName => ({ tag: tagName, items: activeActivities.filter(a => a.tags[0] === tagName) }))
      .filter(g => g.items.length > 0)
    const untagged = activeActivities.filter(a => !a.tags.length)
    if (untagged.length > 0) result.push({ tag: null, items: untagged })
    return result
  }, [activeActivities, tags])

  const visibleGroups = filterTags.size > 0
    ? groups.filter(g => filterTags.has(g.tag))
    : groups

  // Progress ring data — reactive to entry changes via getEntry
  const ringData = useMemo(() => {
    return groups.map(({ tag, items }) => {
      const color = tagColors[tag] ?? '#52525b'
      const done = items.filter(a =>
        getCompletionStatus(a, getEntry(a.id)) === 'complete'
      ).length
      return { tag: tag ?? 'Uncategorized', color, total: items.length, done }
    })
  }, [groups, tagColors, getEntry])

  const totalDone = ringData.reduce((s, g) => s + g.done, 0)
  const totalAll  = ringData.reduce((s, g) => s + g.total, 0)

  // Changes when any entry changes — triggers WeekStrip today dot refresh
  const todayEntryCount = useMemo(() =>
    activeActivities.reduce((n, a) => n + (getEntry(a.id) ? 1 : 0), 0),
    [activeActivities, getEntry]
  )

  async function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!window.confirm('This will replace all your current data. Continue?')) {
      e.target.value = ''
      return
    }
    try {
      await importData(file)
      window.location.reload()
    } catch {
      alert('Could not read backup — make sure it is a valid Life Log export.')
      e.target.value = ''
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-name">Life Log</span>
          <button className="add-activity-btn" onClick={() => setModal('create')} title="New trackable">+</button>
          <button className="tags-manage-btn" onClick={() => setTagsOpen(true)} title="Manage tags">#</button>
          <button className="help-btn" onClick={() => setHelpOpen(true)} title="Help">?</button>
          <button className="header-icon-btn" onClick={exportData} title="Export backup">↓</button>
          <button className="header-icon-btn" onClick={() => importRef.current.click()} title="Import backup">↑</button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </div>
        <DateNav date={date} onChange={setDate} />
      </header>

      <div className="day-header">
        <div className="day-header-inner">
          <WeekStrip
            currentDate={date}
            onDateChange={setDate}
            todayEntryCount={todayEntryCount}
          />
          <ProgressRing
            groups={ringData}
            totalDone={totalDone}
            totalAll={totalAll}
          />
        </div>
      </div>

      <main className="app-main">

        {/* Tag filter chips */}
        {groups.length > 1 && (
          <div className="tag-filter-bar">
            <button
              className={`tag-filter-chip ${filterTags.size === 0 ? 'tag-filter-chip--active' : ''}`}
              style={filterTags.size === 0
                ? { background: 'var(--color-text-muted)22', color: 'var(--color-text)', borderColor: 'var(--color-text-muted)' }
                : { color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }
              }
              onClick={() => setFilterTags(new Set())}
            >
              All
            </button>
            {groups.map(({ tag }) => {
              const color = tagColors[tag] ?? '#52525b'
              const active = filterTags.size === 0 || filterTags.has(tag)
              return (
                <button
                  key={tag ?? '__untagged'}
                  className={`tag-filter-chip ${active ? 'tag-filter-chip--active' : ''}`}
                  style={active
                    ? { background: `${color}22`, color, borderColor: color }
                    : { color, borderColor: `${color}44` }
                  }
                  onClick={() => setFilterTags(prev => {
                    const base = prev.size === 0
                      ? new Set(groups.map(g => g.tag))
                      : new Set(prev)
                    base.has(tag) ? base.delete(tag) : base.add(tag)
                    return base.size === groups.length ? new Set() : base
                  })}
                >
                  {tag ?? 'Uncategorized'}
                </button>
              )
            })}
          </div>
        )}

        {visibleGroups.map(({ tag, items }) => (
          <div key={tag ?? '__untagged'} className="tag-group">
            <div className="tag-group-header">
              <span
                className="tag-group-label"
                style={{ color: tagColors[tag] ?? 'var(--color-text-muted)' }}
              >
                {tag ?? 'Uncategorized'}
              </span>
              <div
                className="tag-group-line"
                style={{ background: tagColors[tag] ?? 'var(--color-border)' }}
              />
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
                  tagColors={tagColors}
                  onFieldChange={(fieldId, value) => setFieldValue(activity.id, fieldId, value)}
                  onEdit={() => setModal(activity.id)}
                  onHistory={() => setHistoryActivity(activity)}
                  onDragStart={() => { draggingId.current = activity.id }}
                  onDragOver={e => { e.preventDefault(); if (draggingId.current !== activity.id) setDragOverId(activity.id) }}
                  onDragLeave={() => setDragOverId(null)}
                  onDrop={() => {
                    if (draggingId.current && draggingId.current !== activity.id)
                      reorderActivity(draggingId.current, activity.id)
                    draggingId.current = null
                    setDragOverId(null)
                  }}
                  onDragEnd={() => { draggingId.current = null; setDragOverId(null) }}
                />
              )
            })}
          </div>
        ))}

        {activeActivities.length === 0 && (
          <p className="empty-state">No trackables yet. Create one to get started.</p>
        )}

        <button className="add-activity-card" onClick={() => setModal('create')}>
          + New trackable
        </button>

        {/* Archived section */}
        {archivedActivities.length > 0 && (
          <div className="archived-section">
            <button
              className="archived-toggle"
              onClick={() => setArchivedOpen(p => !p)}
            >
              <span>Archived ({archivedActivities.length})</span>
              <span className="archived-toggle-arrow">{archivedOpen ? '▴' : '▾'}</span>
            </button>
            {archivedOpen && (
              <div className="archived-list">
                {archivedActivities.map(a => (
                  <div key={a.id} className="archived-item">
                    <span className="archived-item-name">{a.name}</span>
                    <button
                      className="archived-restore-btn"
                      onClick={() => unarchiveActivity(a.id)}
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {modal && (
        <ActivityModal
          activity={editingActivity ?? null}
          allTags={tags}
          onSave={handleSave}
          onDelete={deleteActivity}
          onArchive={archiveActivity}
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
          onUpdateColor={updateTagColor}
          onClose={() => setTagsOpen(false)}
        />
      )}

      {historyActivity && (
        <HistoryModal
          activity={historyActivity}
          onClose={() => setHistoryActivity(null)}
        />
      )}

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
