const CX = 50, CY = 50, R = 35
const SW_DONE = 9, SW_UNDONE = 6, SW_TRACK = 7
const CATEGORY_GAP = 5 // degrees between groups

function polarToXY(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx, cy, r, a1, a2) {
  const span = a2 - a1
  if (span <= 0.1) return null
  const s = polarToXY(cx, cy, r, a1)
  const e = polarToXY(cx, cy, r, a2)
  const large = span > 180 ? 1 : 0
  return `M ${s.x.toFixed(3)} ${s.y.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}`
}

export default function ProgressRing({ groups, totalDone, totalAll }) {
  if (totalAll === 0) {
    return (
      <div className="progress-ring">
        <svg viewBox="0 0 100 100" className="progress-ring-svg">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#131318" strokeWidth={SW_TRACK} />
        </svg>
        <div className="progress-ring-center">
          <span className="progress-ring-num">—</span>
        </div>
      </div>
    )
  }

  const numGaps = groups.length > 1 ? groups.length : 0
  const availableDeg = 360 - numGaps * CATEGORY_GAP

  let angle = 0
  const arcs = []

  groups.forEach((g) => {
    if (!g.total) return
    const groupDeg = (g.total / totalAll) * availableDeg
    const doneDeg = (g.done / g.total) * groupDeg
    const undoneDeg = groupDeg - doneDeg

    const doneEnd = angle + doneDeg
    const undoneEnd = doneEnd + undoneDeg

    if (doneDeg > 0.1) {
      const d = arcPath(CX, CY, R, angle, doneEnd)
      if (d) arcs.push({ d, color: g.color, done: true, key: `${g.tag}-d` })
    }
    if (undoneDeg > 0.1) {
      const d = arcPath(CX, CY, R, doneEnd, undoneEnd)
      if (d) arcs.push({ d, color: g.color, done: false, key: `${g.tag}-u` })
    }
    angle = undoneEnd + CATEGORY_GAP
  })

  return (
    <div className="progress-ring">
      <svg viewBox="0 0 100 100" className="progress-ring-svg">
        <defs>
          <filter id="arc-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#131318" strokeWidth={SW_TRACK} />

        {/* Segments */}
        {arcs.map(arc => (
          <path
            key={arc.key}
            d={arc.d}
            fill="none"
            stroke={arc.color}
            strokeWidth={arc.done ? SW_DONE : SW_UNDONE}
            strokeLinecap="butt"
            opacity={arc.done ? 1 : 0.15}
            filter={arc.done ? 'url(#arc-glow)' : undefined}
          />
        ))}
      </svg>

      <div className="progress-ring-center">
        <span className="progress-ring-num">{totalDone}/{totalAll}</span>
        <span className="progress-ring-label">logged</span>
      </div>
    </div>
  )
}
