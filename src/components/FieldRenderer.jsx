function computeDuration(start, end) {
  if (!start || !end) return null
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let mins = eh * 60 + em - (sh * 60 + sm)
  if (mins < 0) mins += 1440
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function checkGoal(field, actual) {
  const goal = field.config?.goal
  if (!goal || goal.target === '' || goal.target === undefined) return null
  const target = Number(goal.target)
  const op = goal.operator ?? 'gte'
  if (isNaN(actual)) return null
  const met = op === 'gte' ? actual >= target
            : op === 'lte' ? actual <= target
            : actual === target
  const unit = field.type === 'duration' ? 'min'
             : field.type === 'time_range' ? 'h'
             : field.type === 'quantity' ? (field.config.units?.[0] ?? '') : ''
  return { met, target, unit }
}

function GoalBadge({ met, target, unit }) {
  if (met) return <span className="goal-badge goal-badge--met">✓</span>
  return <span className="goal-badge goal-badge--unmet">/ {target}{unit}</span>
}

function Toggle({ field, value, onChange }) {
  return (
    <div className="field">
      <span className="field-label">{field.label}</span>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={!!value}
          onChange={e => onChange(e.target.checked)}
        />
        <span className="toggle-track" />
      </label>
    </div>
  )
}

function TextF({ field, value, onChange }) {
  return (
    <div className="field">
      <span className="field-label">{field.label}</span>
      <input
        className="field-input"
        type="text"
        value={value ?? ''}
        placeholder={field.config.placeholder ?? ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function NumberF({ field, value, onChange }) {
  const goalResult = value !== '' && value !== undefined
    ? checkGoal(field, Number(value)) : null
  return (
    <div className="field">
      <span className="field-label">{field.label}</span>
      <div className="field-unit-group">
        <input
          className="field-input field-input--narrow"
          type="number"
          value={value ?? ''}
          placeholder={field.config.placeholder ?? '0'}
          min="0"
          onChange={e => onChange(e.target.value)}
        />
        {goalResult && <GoalBadge {...goalResult} />}
      </div>
    </div>
  )
}

function TimePoint({ field, value, onChange }) {
  return (
    <div className="field">
      <span className="field-label">{field.label}</span>
      <input
        className="field-input field-input--time"
        type="time"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function TimeRange({ field, value, onChange }) {
  const val = value ?? {}
  const durationStr = computeDuration(val.start, val.end)

  let goalResult = null
  if (durationStr && val.start && val.end) {
    const [sh, sm] = val.start.split(':').map(Number)
    const [eh, em] = val.end.split(':').map(Number)
    let mins = eh * 60 + em - (sh * 60 + sm)
    if (mins < 0) mins += 1440
    goalResult = checkGoal(field, Math.round(mins / 60 * 10) / 10)
  }

  return (
    <>
      <div className="field">
        <span className="field-label">Start</span>
        <input
          className="field-input field-input--time"
          type="time"
          value={val.start ?? ''}
          onChange={e => onChange({ ...val, start: e.target.value })}
        />
      </div>
      <div className="field">
        <span className="field-label">End</span>
        <input
          className="field-input field-input--time"
          type="time"
          value={val.end ?? ''}
          onChange={e => onChange({ ...val, end: e.target.value })}
        />
      </div>
      {durationStr && (
        <div className="field field--derived">
          <span className="field-label field-label--muted">Duration</span>
          <div className="field-unit-group">
            <span className="field-derived">{durationStr}</span>
            {goalResult && <GoalBadge {...goalResult} />}
          </div>
        </div>
      )}
    </>
  )
}

function Duration({ field, value, onChange }) {
  const goalResult = value !== '' && value !== undefined
    ? checkGoal(field, Number(value)) : null
  return (
    <div className="field">
      <span className="field-label">{field.label}</span>
      <div className="field-unit-group">
        <input
          className="field-input field-input--narrow"
          type="number"
          value={value ?? ''}
          placeholder="0"
          min="0"
          onChange={e => onChange(e.target.value)}
        />
        <span className="field-unit">min</span>
        {goalResult && <GoalBadge {...goalResult} />}
      </div>
    </div>
  )
}

function QuantityF({ field, value, onChange }) {
  const val = value ?? {}
  const units = field.config.units?.length ? field.config.units : ['g', 'kg', 'ml', 'capsules']
  const goalResult = val.amount !== '' && val.amount !== undefined
    ? checkGoal(field, Number(val.amount)) : null
  return (
    <div className="field">
      <span className="field-label">{field.label}</span>
      <div className="field-unit-group">
        <input
          className="field-input field-input--narrow"
          type="number"
          value={val.amount ?? ''}
          placeholder="0"
          min="0"
          onChange={e => onChange({ ...val, amount: e.target.value })}
        />
        <select
          className="field-input field-select field-select--unit"
          value={val.unit ?? units[0]}
          onChange={e => onChange({ ...val, unit: e.target.value })}
        >
          {units.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        {goalResult && <GoalBadge {...goalResult} />}
      </div>
    </div>
  )
}

function SelectF({ field, value, onChange }) {
  return (
    <div className="field">
      <span className="field-label">{field.label}</span>
      <select
        className="field-input field-select"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
      >
        <option value="" disabled>Select</option>
        {field.config.options?.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

const renderers = {
  toggle: Toggle,
  text: TextF,
  number: NumberF,
  time_point: TimePoint,
  time_range: TimeRange,
  duration: Duration,
  quantity: QuantityF,
  select: SelectF,
}

export default function FieldRenderer({ field, value, onChange }) {
  const Component = renderers[field.type]
  if (!Component) return null
  return <Component field={field} value={value} onChange={onChange} />
}
