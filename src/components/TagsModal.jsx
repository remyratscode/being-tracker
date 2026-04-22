import { useState, useEffect } from 'react'

export default function TagsModal({ tags, onAdd, onRename, onDelete, onMove, onClose }) {
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

  function startRename(tag) {
    setRenamingTag(tag)
    setRenameValue(tag)
  }

  function commitRename() {
    const val = renameValue.trim().toLowerCase()
    if (val && val !== renamingTag) onRename(renamingTag, val)
    setRenamingTag(null)
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
              <div key={tag} className="tag-manage-row">
                <div className="tag-manage-order">
                  <button
                    className="tag-order-btn"
                    onClick={() => onMove(tag, -1)}
                    disabled={i === 0}
                    title="Move up"
                  >↑</button>
                  <button
                    className="tag-order-btn"
                    onClick={() => onMove(tag, 1)}
                    disabled={i === tags.length - 1}
                    title="Move down"
                  >↓</button>
                </div>

                {renamingTag === tag ? (
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
                  <span
                    className="tag-manage-name"
                    onClick={() => startRename(tag)}
                    title="Click to rename"
                  >{tag}</span>
                )}

                <button
                  className="tag-manage-delete"
                  onClick={() => onDelete(tag)}
                  title="Delete tag"
                >×</button>
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
          <p className="tags-hint">Click a tag name to rename it. First tag = group on daily view.</p>
          <div className="modal-footer-right">
            <button className="btn btn--ghost" onClick={onClose}>Done</button>
          </div>
        </div>

      </div>
    </div>
  )
}
