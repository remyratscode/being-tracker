import { useState, useMemo, useRef, useEffect } from 'react'
import {
  getDaysRange, getDayRatio,
  getActivityValue, ratioToColor, buildWeekGrid,
} from '../utils/heatmap'
import { useHeatmapEntries } from '../hooks/useHeatmapEntries'

const WIDGET_RANGES = [30, 60, 90]
const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function MiniGrid({ weeks, ratios, onDayClick }) {
  const cellSize = 10
  const gap = 2
  return (
    <div className="hm-mini-wrap">
      <div className="hm-mini-dow">
        {DOW.map((d, i) => (
          <div key={i} className="hm-mini-dow-label" style={{ height: cellSize + gap }}>{i % 2 === 0 ? d : ''}</div>
        ))}
      </div>
      <div className="hm-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="hm-week" style={{ gap }}>
            {week.map((date, di) => (
              <div
                key={di}
                className={`hm-cell${date ? ' hm-cell--has-date' : ''}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  background: date ? ratioToColor(ratios[date]) : 'transparent',
                  boxShadow: date && ratios[date] >= 1 ? '0 0 4px #22c55e55' : 'none',
                }}
                onClick={() => date && onDayClick?.(date)}
                title={date ? `${date} — ${Math.round((ratios[date] ?? 0) * 100)}%` : ''}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HeatmapWidget({ activities, onClose, onDayClick }) {
  const [range, setRange] = useState(30)
  const [selectedId, setSelectedId] = useState('') // '' = overview
  const [pos, setPos] = useState({ x: undefined, y: undefined })
  const widgetRef = useRef(null)
  const isDragging = useRef(false)
  const dragStart = useRef(null)

  const active = useMemo(() => activities.filter(a => !a.archived), [activities])

  const days = useMemo(() => getDaysRange(range), [range])
  const weeks = useMemo(() => buildWeekGrid(days), [days])

  const allEntries = useHeatmapEntries(days)

  const ratios = useMemo(() => {
    const res = {}
    const selected = selectedId ? active.find(a => a.id === selectedId) : null
    days.forEach(date => {
      if (selected) {
        const entry = (allEntries[date] ?? []).find(e => e.activityId === selected.id)
        res[date] = getActivityValue(selected, entry)
      } else {
        res[date] = getDayRatio(active, date, allEntries)
      }
    })
    return res
  }, [days, active, allEntries, selectedId])

  function onDragStart(e) {
    if (e.button !== 0) return
    isDragging.current = true
    const rect = widgetRef.current.getBoundingClientRect()
    dragStart.current = { mx: e.clientX, my: e.clientY, wx: rect.left, wy: rect.top }
    e.preventDefault()
  }

  useEffect(() => {
    function onMouseMove(e) {
      if (!isDragging.current) return
      setPos({
        x: Math.max(0, dragStart.current.wx + e.clientX - dragStart.current.mx),
        y: Math.max(0, dragStart.current.wy + e.clientY - dragStart.current.my),
      })
    }
    function onMouseUp() { isDragging.current = false }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const posStyle = pos.x !== undefined
    ? { left: pos.x, top: pos.y, bottom: 'auto', right: 'auto' }
    : {}

  const selectedName = selectedId
    ? (active.find(a => a.id === selectedId)?.name ?? 'Overview')
    : 'Overview'

  return (
    <div ref={widgetRef} className="hm-widget" style={posStyle}>
      <div className="hm-widget-handle" onMouseDown={onDragStart}>
        <span className="hm-widget-title">{selectedName}</span>
        <button className="hm-widget-close" onClick={onClose}>×</button>
      </div>

      <div className="hm-widget-controls">
        <div className="hm-range-selector hm-range-selector--sm">
          {WIDGET_RANGES.map(r => (
            <button
              key={r}
              className={`hm-range-btn${range === r ? ' hm-range-btn--active' : ''}`}
              onClick={() => setRange(r)}
            >{r}d</button>
          ))}
        </div>
        <select
          className="hm-widget-select"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
        >
          <option value="">Overview</option>
          {active.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <div className="hm-widget-grid">
        <MiniGrid weeks={weeks} ratios={ratios} onDayClick={onDayClick} />
      </div>
    </div>
  )
}
