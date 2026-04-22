import FieldRenderer from './FieldRenderer'
import { formatAvg } from '../hooks/useStats'

export default function ActivityCard({
  activity, entry, completionStatus, isDragOver, stats,
  onFieldChange, onEdit, onHistory,
  onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd,
}) {
  const cardClass = [
    'activity-card',
    completionStatus === 'complete' ? 'activity-card--complete' : '',
    completionStatus === 'partial'  ? 'activity-card--partial'  : '',
    isDragOver ? 'activity-card--drag-over' : '',
  ].filter(Boolean).join(' ')

  const streakLabel = stats?.streak > 0
    ? `${stats.streak}d streak`
    : null

  const avgLabels = stats?.averages
    ? Object.values(stats.averages).map(({ value, field }) => ({
        key: field.id,
        text: `${field.label}: ${formatAvg(field, value)} avg`,
      }))
    : []

  const hasStats = streakLabel || avgLabels.length > 0

  return (
    <div
      className={cardClass}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="activity-header">
        <span className="drag-handle" title="Drag to reorder">⠿</span>
        <span className="activity-name">{activity.name}</span>
        <div className="activity-header-right">
          <div className="activity-tags">
            {activity.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <button className="card-icon-btn" onClick={onHistory} title="View history">≡</button>
          <button className="card-icon-btn" onClick={onEdit} title="Edit activity">✎</button>
        </div>
      </div>

      <div className="activity-fields">
        {activity.fields.map(field => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={entry?.values?.[field.id]}
            onChange={value => onFieldChange(field.id, value)}
          />
        ))}
      </div>

      {hasStats && (
        <div className="card-stats">
          {streakLabel && (
            <span className="card-stat card-stat--streak">{streakLabel}</span>
          )}
          {avgLabels.map(({ key, text }) => (
            <span key={key} className="card-stat">{text}</span>
          ))}
        </div>
      )}
    </div>
  )
}
