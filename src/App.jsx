import { useState, useMemo, useRef, useCallback } from 'react'
import DateNav, { todayStr } from './components/DateNav'
import WeekStrip from './components/WeekStrip'
import ProgressRing from './components/ProgressRing'
import ActivityCard from './components/ActivityCard'
import ActivityModal from './components/ActivityModal'
import TagsModal from './components/TagsModal'
import HistoryModal from './components/HistoryModal'
import HelpPanel from './components/HelpPanel'
import HeatmapView from './components/HeatmapView'
import HeatmapWidget from './components/HeatmapWidget'
import ContainerBlock from './components/ContainerBlock'
import { useActivities } from './hooks/useActivities'
import { useEntries } from './hooks/useEntries'
import { useTags } from './hooks/useTags'
import { useStats } from './hooks/useStats'
import { useContainers } from './hooks/useContainers'
import { getCompletionStatus } from './utils/completion'
import { exportData, importData } from './utils/backup'
import { nowTimeStr } from './utils/time'
import { supabase } from './lib/supabase'

export default function App() {
  const [date, setDate] = useState(todayStr)
  const {
    activities, ready,
    addActivity, updateActivity, deleteActivity,
    archiveActivity, unarchiveActivity,
    renameTagAcrossActivities, reorderActivity,
  } = useActivities()
  const { getEntry, setFieldValue } = useEntries(date)
  const { tags, addTag, renameTag, deleteTag, moveTag, updateTagColor } = useTags()
  const { containers, addContainer, renameContainer, deleteContainer } = useContainers()

  const [view, setView] = useState('daily')
  const [widgetOpen, setWidgetOpen] = useState(false)
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
    const { _newContainer, ...data } = activityData
    if (_newContainer) addContainer(_newContainer.name, _newContainer.tag, _newContainer.id)
    if (editingActivity) updateActivity(data.id, data)
    else addActivity(data)
    data.tags.forEach(t => addTag(t))
  }

  const batchComplete = useCallback((activityIds) => {
    const now = nowTimeStr()
    activityIds.forEach(actId => {
      const activity = activities.find(a => a.id === actId)
      if (!activity) return
      const entry = getEntry(actId)
      const values = entry?.values ?? {}
      activity.fields.forEach(field => {
        if (field.type === 'toggle' && !values[field.id]) {
          setFieldValue(actId, field.id, true)
          activity.fields.forEach(f => {
            if (f.id === field.id) return
            if (f.type === 'time_point' && !values[f.id]) setFieldValue(actId, f.id, now)
            if (f.type === 'number' && f.config?.defaultValue !== undefined && !values[f.id])
              setFieldValue(actId, f.id, String(f.config.defaultValue))
          })
        }
      })
    })
  }, [activities, getEntry, setFieldValue])

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

  function handleDayClick(clickedDate) {
    setDate(clickedDate)
    setView('daily')
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-name">Being Tracker</span>

        <nav className="app-nav">
          <button className={`nav-tab${view === 'daily' ? ' nav-tab--active' : ''}`} onClick={() => setView('daily')}>Daily</button>
          <button className={`nav-tab${view === 'heatmap' ? ' nav-tab--active' : ''}`} onClick={() => setView('heatmap')}>Heatmap</button>
        </nav>

        <div className="app-header-actions">
          <button className="header-action-btn" onClick={() => setModal('create')} title="New trackable">+</button>
          <button className="header-action-btn" onClick={() => setTagsOpen(true)} title="Manage groups">#</button>
          <button className="header-action-btn mobile-hide" onClick={() => setWidgetOpen(o => !o)} title="Toggle heatmap widget">▦</button>
          <span className="header-divider mobile-hide" />
          <button className="header-action-btn mobile-hide" onClick={() => setHelpOpen(true)} title="Help">?</button>
          <button className="header-action-btn mobile-hide" onClick={exportData} title="Export backup">↓</button>
          <button className="header-action-btn mobile-hide" onClick={() => importRef.current.click()} title="Import backup">↑</button>
          <span className="header-divider" />
          <button className="header-action-btn" onClick={() => supabase.auth.signOut()} title="Sign out">⏻</button>
        </div>

        <input
          ref={importRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </header>

      {view === 'daily' && (
        <div className="day-header">
          <div className="day-header-inner">
            <DateNav date={date} onChange={setDate} />
            <div className="day-header-temporal">
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
        </div>
      )}

      <main className="app-main">

      {view === 'heatmap' && (
        <HeatmapView activities={activities} onDayClick={handleDayClick} />
      )}

      {view === 'daily' && (<>

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

        {visibleGroups.map(({ tag, items }) => {
          const groupContainers = containers
            .filter(c => c.tag === tag)
            .map(c => ({ container: c, items: items.filter(a => a.containerId === c.id) }))
            .filter(({ items: ci }) => ci.length > 0)
          const ungrouped = items.filter(a =>
            !a.containerId || !containers.some(c => c.id === a.containerId && c.tag === tag)
          )
          const allDone = items.length > 0 &&
            items.every(a => getCompletionStatus(a, getEntry(a.id)) === 'complete')

          function renderCard(activity) {
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
          }

          return (
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
                {!allDone && items.length > 0 && (
                  <button
                    className="group-complete-btn"
                    onClick={() => batchComplete(items.map(a => a.id))}
                    title="Complete all in group"
                  >✓</button>
                )}
              </div>

              {groupContainers.map(({ container, items: cItems }) => (
                <ContainerBlock
                  key={container.id}
                  container={container}
                  items={cItems}
                  getEntry={getEntry}
                  onBatchComplete={batchComplete}
                  onDelete={deleteContainer}
                  onRename={renameContainer}
                  renderItem={renderCard}
                />
              ))}

              {ungrouped.map(a => renderCard(a))}
            </div>
          )
        })}

        {!ready && (
          <p className="empty-state">Loading…</p>
        )}
        {ready && activeActivities.length === 0 && (
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

      </>)}

      </main>

      {widgetOpen && (
        <HeatmapWidget
          activities={activities}
          onClose={() => setWidgetOpen(false)}
          onDayClick={handleDayClick}
        />
      )}

      {modal && (
        <ActivityModal
          activity={editingActivity ?? null}
          allTags={tags}
          containers={containers}
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
