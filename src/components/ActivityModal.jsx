import { useState, useEffect, useRef } from 'react'

const FIELD_TYPES = [
  { value: 'toggle',     label: 'Toggle' },
  { value: 'text',       label: 'Text' },
  { value: 'number',     label: 'Number' },
  { value: 'time_point', label: 'Time' },
  { value: 'time_range', label: 'Time range' },
  { value: 'duration',   label: 'Duration (min)' },
  { value: 'quantity',   label: 'Quantity + unit' },
  { value: 'select',     label: 'Select' },
  { value: 'rating',     label: 'Rating (1–5)' },
  { value: 'checklist',  label: 'Checklist' },
]

function newField() {
  return { id: crypto.randomUUID(), label: '', type: 'toggle', config: {} }
}

export default function ActivityModal({ activity, allTags, onSave, onDelete, onArchive, onClose }) {
  const isEdit = !!activity
  const nameRef = useRef(null)

  const [name, setName] = useState(activity?.name ?? '')
  const [type, setType] = useState(activity?.type ?? 'input')
  const [tags, setTags] = useState(activity?.tags ?? [])
  const [fields, setFields] = useState(
    activity?.fields?.length ? activity.fields : [newField()]
  )
  const [tagInput, setTagInput] = useState('')
  const [tagFocused, setTagFocused] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { nameRef.current?.focus() }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Tag input — allTags is now [{name, color}]
  const tagColorMap = Object.fromEntries((allTags ?? []).map(t => [t.name, t.color]))

  const suggestions = (allTags ?? [])
    .filter(t => !tags.includes(t.name) && t.name.toLowerCase().includes(tagInput.toLowerCase()))

  const showSuggestions = (tagFocused || tagInput.trim() !== '') && suggestions.length > 0

  function addTag(raw) {
    const tag = raw.trim().toLowerCase()
    if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag])
    setTagInput('')
  }

  function onTagKey(e) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput) }
    if (e.key === 'Backspace' && tagInput === '' && tags.length) setTags(t => t.slice(0, -1))
  }

  // Fields
  function setField(id, key, val) {
    setFields(prev => prev.map(f => f.id === id ? { ...f, [key]: val } : f))
  }

  function setFieldConfig(id, key, val) {
    setFields(prev => prev.map(f => f.id === id ? { ...f, config: { ...f.config, [key]: val } } : f))
  }

  function setFieldGoal(id, updates) {
    setFields(prev => prev.map(f =>
      f.id === id ? { ...f, config: { ...f.config, goal: { operator: 'gte', ...f.config.goal, ...updates } } } : f
    ))
  }

  function clearFieldGoal(id) {
    setFields(prev => prev.map(f =>
      f.id === id ? { ...f, config: { ...f.config, goal: undefined } } : f
    ))
  }

  function goalUnit(field) {
    if (field.type === 'duration') return 'min'
    if (field.type === 'time_range') return 'h'
    if (field.type === 'quantity') return field.config.units?.[0] ?? ''
    return ''
  }

  const GOAL_TYPES = ['number', 'duration', 'time_range', 'quantity', 'rating']

  function removeField(id) {
    setFields(prev => prev.filter(f => f.id !== id))
  }

  // Save
  function handleSave() {
    if (!name.trim()) return setError('Name is required')
    if (!fields.length) return setError('Add at least one field')
    if (fields.some(f => !f.label.trim())) return setError('All fields need a label')

    onSave({
      id: activity?.id ?? crypto.randomUUID(),
      name: name.trim(),
      type,
      tags,
      fields: fields.map(f => ({
        id: f.id,
        label: f.label.trim(),
        type: f.type,
        config: f.config,
      })),
    })
    onClose()
  }

  function handleDelete() {
    if (!confirmDelete) return setConfirmDelete(true)
    onDelete(activity.id)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">

        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Edit trackable' : 'New trackable'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* Name */}
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              ref={nameRef}
              className="form-input"
              type="text"
              value={name}
              placeholder="e.g. Cold shower"
              onChange={e => { setName(e.target.value); setError('') }}
            />
          </div>

          {/* Type */}
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-btn ${type === 'input' ? 'type-btn--active' : ''}`}
                onClick={() => setType('input')}
              >Input</button>
              <button
                type="button"
                className={`type-btn ${type === 'outcome' ? 'type-btn--active' : ''}`}
                onClick={() => setType('outcome')}
              >Outcome</button>
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Group</label>
            <div className="tag-input-wrap" onClick={() => document.getElementById('tag-input').focus()}>
              {tags.map(tag => {
                const c = tagColorMap[tag] ?? '#52525b'
                return (
                  <span key={tag} className="tag-pill" style={{ background: `${c}22`, color: c, border: `1px solid ${c}44` }}>
                    {tag}
                    <button className="tag-pill-remove" style={{ color: c }} onClick={() => setTags(t => t.filter(x => x !== tag))}>×</button>
                  </span>
                )
              })}
              <input
                id="tag-input"
                className="tag-text-input"
                value={tagInput}
                placeholder={tags.length === 0 ? 'morning, evening, body...' : ''}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={onTagKey}
                onFocus={() => setTagFocused(true)}
                onBlur={() => { setTagFocused(false); if (tagInput.trim()) addTag(tagInput) }}
              />
            </div>
            {showSuggestions && (
              <div className="tag-suggestions">
                {suggestions.slice(0, 8).map(t => (
                  <button
                    key={t.name}
                    className="tag-suggestion-btn"
                    style={{ borderColor: `${t.color}55`, color: t.color }}
                    onMouseDown={() => addTag(t.name)}
                  >{t.name}</button>
                ))}
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="form-group">
            <label className="form-label">Fields</label>
            <div className="fields-editor">
              {fields.map((field) => (
                <div key={field.id} className="field-editor-row">
                  <input
                    className="form-input form-input--sm"
                    type="text"
                    value={field.label}
                    placeholder="Label"
                    onChange={e => setField(field.id, 'label', e.target.value)}
                  />
                  <select
                    className="form-input form-input--sm form-select"
                    value={field.type}
                    onChange={e => setField(field.id, 'type', e.target.value)}
                  >
                    {FIELD_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <button
                    className="field-editor-remove"
                    onClick={() => removeField(field.id)}
                    disabled={fields.length === 1}
                    title="Remove field"
                  >×</button>

                  {field.type === 'select' && (
                    <input
                      className="form-input form-input--config"
                      type="text"
                      value={field.config.options?.join(', ') ?? ''}
                      placeholder="Options: Strength, Cardio, Mobility"
                      onChange={e =>
                        setFieldConfig(field.id, 'options',
                          e.target.value.split(',').map(s => s.trim()).filter(Boolean))
                      }
                    />
                  )}
                  {field.type === 'quantity' && (
                    <input
                      className="form-input form-input--config"
                      type="text"
                      value={field.config.units?.join(', ') ?? ''}
                      placeholder="Units: g, kg, ml, capsules"
                      onChange={e =>
                        setFieldConfig(field.id, 'units',
                          e.target.value.split(',').map(s => s.trim()).filter(Boolean))
                      }
                    />
                  )}
                  {field.type === 'checklist' && (
                    <input
                      className="form-input form-input--config"
                      type="text"
                      value={field.config.items?.join(', ') ?? ''}
                      placeholder="Items: Vitamins, Fish oil, Creatine"
                      onChange={e =>
                        setFieldConfig(field.id, 'items',
                          e.target.value.split(',').map(s => s.trim()).filter(Boolean))
                      }
                    />
                  )}
                  {(field.type === 'text' || field.type === 'number') && (
                    <input
                      className="form-input form-input--config"
                      type="text"
                      value={field.config.placeholder ?? ''}
                      placeholder="Placeholder text (optional)"
                      onChange={e => setFieldConfig(field.id, 'placeholder', e.target.value)}
                    />
                  )}

                  {GOAL_TYPES.includes(field.type) && (
                    <div className="field-goal-config">
                      <label className="field-goal-toggle">
                        <input
                          type="checkbox"
                          checked={field.config.goal?.target !== undefined}
                          onChange={e => e.target.checked
                            ? setFieldGoal(field.id, { target: '' })
                            : clearFieldGoal(field.id)
                          }
                        />
                        <span>Set goal</span>
                      </label>
                      {field.config.goal?.target !== undefined && (
                        <>
                          <select
                            className="form-input form-input--xs form-select"
                            value={field.config.goal.operator ?? 'gte'}
                            onChange={e => setFieldGoal(field.id, { operator: e.target.value })}
                          >
                            <option value="gte">≥</option>
                            <option value="lte">≤</option>
                            <option value="eq">=</option>
                          </select>
                          <input
                            className="form-input form-input--xs"
                            type="number"
                            min="0"
                            value={field.config.goal.target}
                            placeholder="Target"
                            onChange={e => setFieldGoal(field.id, { target: e.target.value })}
                          />
                          {goalUnit(field) && (
                            <span className="field-goal-unit">{goalUnit(field)}</span>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="add-field-btn" onClick={() => setFields(prev => [...prev, newField()])}>
              + Add field
            </button>
          </div>

          {error && <p className="form-error">{error}</p>}
        </div>

        <div className="modal-footer">
          <div className="modal-footer-left">
            {isEdit && (
              <button
                className={`btn btn--danger ${confirmDelete ? 'btn--confirming' : ''}`}
                onClick={handleDelete}
              >
                {confirmDelete ? 'Confirm delete' : 'Delete'}
              </button>
            )}
            {isEdit && !activity?.archived && (
              <button
                className="btn btn--ghost"
                onClick={() => { onArchive(activity.id); onClose() }}
              >
                Archive
              </button>
            )}
          </div>
          <div className="modal-footer-right">
            <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSave}>
              {isEdit ? 'Save changes' : 'Create'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
