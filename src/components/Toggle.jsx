export default function Toggle({ label, checked, onChange }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        <span className="toggle-track" />
      </label>
    </div>
  )
}
