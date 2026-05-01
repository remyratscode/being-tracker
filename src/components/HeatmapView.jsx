import { useState, useMemo } from 'react'
import {
  RANGE_OPTIONS, getDaysRange,
  getDayRatio, getActivityValue, ratioToColor,
  buildWeekGrid, getMonthLabels,
} from '../utils/heatmap'
import { useHeatmapEntries } from '../hooks/useHeatmapEntries'
import { todayStr } from '../utils/date'

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function WeekGrid({ weeks, ratios, cellSize = 14, onDayClick }) {
  const gap = 3
  const colWidth = cellSize + gap
  const monthLabels = getMonthLabels(weeks)

  return (
    <div className="hm-wrap">
      <div className="hm-month-row" style={{ paddingLeft: 18 }}>
        {monthLabels.map((label, i) => (
          <div key={i} className="hm-month-label" style={{ width: colWidth }}>{label ?? ''}</div>
        ))}
      </div>
      <div className="hm-body">
        <div className="hm-dow">
          {DOW.map((d, i) => (
            <div key={i} className="hm-dow-label" style={{ height: colWidth }}>{i % 2 === 0 ? d : ''}</div>
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
                    boxShadow: date && ratios[date] >= 1 ? '0 0 6px #22c55e55' : 'none',
                  }}
                  onClick={() => date && onDayClick?.(date)}
                  title={date ? `${date} — ${Math.round((ratios[date] ?? 0) * 100)}%` : ''}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TinyStrip({ activity, days, allEntries, onDayClick }) {
  return (
    <div className="hm-strip">
      {days.map(date => {
        const entry = (allEntries[date] ?? []).find(e => e.activityId === activity.id)
        const val = getActivityValue(activity, entry)
        return (
          <div
            key={date}
            className="hm-strip-cell"
            style={{ background: ratioToColor(val) }}
            onClick={() => onDayClick?.(date)}
            title={`${date} — ${Math.round(val * 100)}%`}
          />
        )
      })}
    </div>
  )
}

export default function HeatmapView({ activities, onDayClick }) {
  const [range, setRange] = useState(30)
  const today = todayStr()
  const active = useMemo(() => activities.filter(a => !a.archived), [activities])

  const days = useMemo(() => getDaysRange(range), [range])
  const weeks = useMemo(() => buildWeekGrid(days), [days])
  const days30 = useMemo(() => getDaysRange(30), [])

  const allEntries = useHeatmapEntries(days)
  const allEntries30 = useMemo(() => {
    if (range === 30) return allEntries
    const res = {}
    days30.forEach(d => { res[d] = allEntries[d] ?? [] })
    return res
  }, [days30, range, allEntries])

  const ratios = useMemo(() => {
    const res = {}
    days.forEach(date => { res[date] = getDayRatio(active, date, allEntries) })
    return res
  }, [days, active, allEntries])

  const { streak, completionRate } = useMemo(() => {
    let streak = 0
    for (let i = days.length - 1; i >= 0; i--) {
      if ((ratios[days[i]] ?? 0) > 0) streak++
      else break
    }
    const logged = days.filter(d => (ratios[d] ?? 0) > 0).length
    return {
      streak,
      completionRate: days.length > 0 ? Math.round((logged / days.length) * 100) : 0,
    }
  }, [ratios, days])

  return (
    <div className="heatmap-view">

      <div className="heatmap-view-header">
        <div className="hm-range-selector">
          {RANGE_OPTIONS.map(r => (
            <button
              key={r}
              className={`hm-range-btn${range === r ? ' hm-range-btn--active' : ''}`}
              onClick={() => setRange(r)}
            >{r}d</button>
          ))}
        </div>
        <div className="hm-stats">
          <div className="hm-stat">
            <span className="hm-stat-value">{streak}</span>
            <span className="hm-stat-label">day streak</span>
          </div>
          <div className="hm-stat">
            <span className="hm-stat-value">{completionRate}%</span>
            <span className="hm-stat-label">logged</span>
          </div>
        </div>
      </div>

      <div className="heatmap-view-section">
        <span className="hm-section-label">Overview</span>
        <div className="hm-grid-scroll">
          <WeekGrid weeks={weeks} ratios={ratios} cellSize={14} onDayClick={onDayClick} />
        </div>
      </div>

      <div className="heatmap-view-section">
        <span className="hm-section-label">Per trackable — last 30 days</span>
        <div className="hm-trackable-list">
          {active.map(activity => (
            <div key={activity.id} className="hm-trackable-row">
              <span className="hm-trackable-name">{activity.name}</span>
              <TinyStrip
                activity={activity}
                days={days30}
                allEntries={allEntries30}
                onDayClick={onDayClick}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
