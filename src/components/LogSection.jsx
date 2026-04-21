export default function LogSection({ title, children }) {
  return (
    <section className="log-section">
      <h2 className="section-title">{title}</h2>
      <div className="section-fields">{children}</div>
    </section>
  )
}
