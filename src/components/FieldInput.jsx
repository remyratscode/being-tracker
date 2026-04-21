export default function FieldInput({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <input
        className="field-input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
