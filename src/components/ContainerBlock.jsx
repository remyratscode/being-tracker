import { useState, useRef, useEffect } from 'react'
import { getCompletionStatus } from '../utils/completion'

export default function ContainerBlock({ container, items, getEntry, onBatchComplete, onDelete, onRename, renderItem }) {
  const [open, setOpen] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(container.name)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const doneCount = items.filter(a => getCompletionStatus(a, getEntry(a.id)) === 'complete').length
  const allDone = items.length > 0 && doneCount === items.length

  function commitRename() {
    const trimmed = editName.trim()
    if (trimmed && trimmed !== container.name) onRename(container.id, trimmed)
    else setEditName(container.name)
    setEditing(false)
  }

  return (
    <div className="container-block">
      <div className="container-block-header">
        <button className="container-collapse-btn" onClick={() => setOpen(o => !o)} title={open ? 'Collapse' : 'Expand'}>
          {open ? '▾' : '▸'}
        </button>

        {editing ? (
          <input
            ref={inputRef}
            className="container-name-input"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setEditName(container.name); setEditing(false) } }}
          />
        ) : (
          <span className="container-name" onClick={() => setEditing(true)} title="Click to rename">
            {container.name}
          </span>
        )}

        <span className="container-count">{doneCount}/{items.length}</span>

        {!allDone && (
          <button
            className="container-complete-btn"
            onClick={() => onBatchComplete(items.map(a => a.id))}
            title="Complete all"
          >✓ all</button>
        )}

        <button
          className="container-delete-btn"
          onClick={() => onDelete(container.id)}
          title="Remove container (activities become ungrouped)"
        >×</button>
      </div>

      {open && (
        <div className="container-block-items">
          {items.map(a => renderItem(a))}
        </div>
      )}
    </div>
  )
}
