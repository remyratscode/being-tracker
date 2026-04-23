import { useState, useEffect } from 'react'
import { TAG_PALETTE } from '../data/storage'

export default function TagsModal({ tags, onAdd, onRename, onDelete, onMove, onUpdateColor, onClose }) {
  const [newTag, setNewTag] = useState('')
  const [renamingTag, setRenamingTag] = useState(null)
  const [renameValue, setRenameValue] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleAdd() {
    const tag = newTag.trim().toLowerCase()
    if (tag) { onAdd(tag); setNewTag('') }
  }

  function startRename(name) {
    setRenamingTag(name)
    setRenameValue(name)
  }

  function commitRename() {
    const val = renameValue.trim().toLowerCase()
    if (val && val !== renamingTag) onRename(renamingTag, val)
    setRenamingTag(null)
  }

  function cycleColor(tag) {
    const idx = TAG_PALETTE.indexOf(tag.color)
    const next = TAG_PALETTE[(idx + 1) % TAG_PALETTE.length]
    onUpdateColor(tag.name, next)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">

        <div className="modal-header">
          <span className="modal-title">Manage tags</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="tags-manage-list">
            {tags.length === 0 && (
              <p className="tags-empty">No tags yet. Create one below.</p>
            )}
            {tags.map((tag, i) => (
              <div key={tag.name} className="tag-manage-row">
                <div className="tag-manage-order">
                  <button className="tag-order-btn" onClick={() => onMove(tag.name, -1)} disabled={i === 0} title="Move up">↑</button>
                  <button className="tag-order-btn" onClick={() => onMove(tag.name, 1)} disabled={i === tags.length - 1} title="Move down">↓</button>
                </div>

                <button
                  className="tag-color-cycle"
                  style={{ background: tag.color }}
                  onClick={() => cycleColor(tag)}
                  title="Click to change colour"
                />

                {renamingTag === tag.name ? (
                  <input
                    className="form-input form-input--sm tag-rename-input"
                    value={renameValue}
                    autoFocus
                    onChange={e => setRenameValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitRename()
                      if (e.key === 'Escape') setRenamingTag(null)
                    }}
                  />
                ) : (
                  <span className="tag-manage-name" onClick={() => startRename(tag.name)} title="Click to rename">
                    {tag.name}
                  </span>
                )}

                <button className="tag-manage-delete" onClick={() => onDelete(tag.name)} title="Delete tag">×</button>
              </div>
            ))}
          </div>

          <div className="tag-add-row">
            <input
              className="form-input"
              type="text"
              value={newTag}
              placeholder="New tag name..."
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button className="btn btn--primary" onClick={handleAdd}>Add</button>
          </div>
        </div>

        <div className="modal-footer">
          <p className="tags-hint">Click colour dot to cycle. Click name to rename. First tag = group.</p>
          <div className="modal-footer-right">
            <button className="btn btn--ghost" onClick={onClose}>Done</button>
          </div>
        </div>

      </div>
    </div>
  )
}
