const sections = [
  {
    title: 'DAILY VIEW',
    items: [
      { label: 'Date navigation', body: 'Use ← → arrows in the header to move between days. The → is disabled on today. The label reads "Today" for the current date.' },
      { label: 'Tag groups', body: "Activities are grouped by their first tag, in the order set in the tag manager (#). Untagged activities appear at the bottom as 'Uncategorized'." },
      { label: 'Drag to reorder', body: 'Grab the ⠿ handle on any card header and drag it to a new position. Drop target highlights in blue while dragging.' },
    ],
  },
  {
    title: 'ACTIVITY CARDS',
    items: [
      { label: 'Border colour', body: 'No tint = nothing logged. Dark blue = partially filled. Green = all fields complete (or all goals met).' },
      { label: '✎  Edit', body: 'Opens the activity editor. Change name, tags, fields, or goals. Appears on card hover.' },
      { label: '≡  History', body: 'Shows last 30 days with any entry data, newest first. Appears on card hover.' },
      { label: 'Stats footer', body: 'Shows streak (green) and 14-day averages per numeric field. Only visible when data exists.' },
    ],
  },
  {
    title: 'FIELD TYPES',
    items: [
      { label: 'Toggle', body: 'On/off switch. Only counts as complete when switched on.' },
      { label: 'Text', body: 'Free-form text. Optional placeholder.' },
      { label: 'Number', body: 'Numeric input. Optional placeholder. Supports goals.' },
      { label: 'Time', body: 'Single time picker. Records when something happened.' },
      { label: 'Time Range', body: 'Start + end time. Duration computed automatically. Handles midnight crossing. Supports goals in hours.' },
      { label: 'Duration', body: 'Minutes input. For elapsed time recorded directly. Supports goals in minutes.' },
      { label: 'Quantity + unit', body: 'Number with selectable unit. Default: g, kg, ml, capsules. Set custom units in the field editor. Supports goals.' },
      { label: 'Select', body: 'Dropdown with fixed options. Configure options in the field editor (comma-separated).' },
    ],
  },
  {
    title: 'GOALS',
    items: [
      { label: 'Setting a goal', body: 'In the field editor, enable "Set goal" on any Number, Duration, Time Range, or Quantity field. Choose operator and target.' },
      { label: 'Operators', body: '≥ at least (sleep ≥ 8h)\n≤ at most (screen time ≤ 2h)\n= exactly (capsules = 3)' },
      { label: 'Goal badge', body: 'Green ✓ = goal met. Muted "/ 8h" = not yet reached.' },
      { label: 'Completion', body: 'If a field has a goal, the green border requires that goal to be met — not just any value entered.' },
    ],
  },
  {
    title: 'TAGS',
    items: [
      { label: 'Purpose', body: 'Tags are the entire organisational layer. The first tag = group on the daily view. Other tags are descriptors.' },
      { label: 'Adding tags', body: 'Click the tag field in the activity editor to see all tags. Type to filter. Enter or comma to confirm. Backspace removes the last tag.' },
      { label: '#  Tag manager', body: 'Create, rename (click name), reorder (↑↓), and delete tags. Rename propagates to all activities.' },
      { label: 'Group order', body: 'Reorder tags in the # manager to rearrange the daily view layout without touching individual activities.' },
    ],
  },
  {
    title: 'CREATING & EDITING',
    items: [
      { label: 'New activity', body: 'Click + in the header or the dashed card at the bottom of the list. Name → tags → add fields.' },
      { label: 'Delete', body: 'Click Delete in the editor, then Confirm delete. Permanent — historical entries are also removed.' },
      { label: 'Shortcuts', body: 'Escape closes any modal. Enter/comma confirms a tag. In the tag manager: Enter confirms rename, Escape cancels.' },
    ],
  },
  {
    title: 'STATS & HISTORY',
    items: [
      { label: 'Streak', body: 'Consecutive days with any logged value, counting back from today. Refreshes when you change date.' },
      { label: '14-day average', body: 'Rolling average for numeric fields. Requires at least 2 data points. Time ranges shown in h m.' },
      { label: 'History view', body: 'Up to 30 past days with entries. Days with no data are omitted.' },
    ],
  },
  {
    title: 'STORAGE',
    items: [
      { label: 'Where', body: 'Browser localStorage only. Nothing leaves your device.' },
      { label: 'Keys', body: 'lifelog:activities — schemas\nlifelog:tags — tag order\nlifelog:entries:YYYY-MM-DD — daily data' },
      { label: 'Auto-save', body: 'Every field change saves immediately. No save button.' },
      { label: 'Note', body: 'Clearing browser data erases everything. Export/import is a planned feature.' },
    ],
  },
]

export default function HelpPanel({ open, onClose }) {
  return (
    <aside className={`help-panel${open ? ' help-panel--open' : ''}`}>
      <div className="help-panel-header">
        <span className="help-panel-title">LIFE LOG — HELP</span>
        <button className="help-panel-close" onClick={onClose}>×</button>
      </div>
      <div className="help-panel-body">
        {sections.map(section => (
          <div key={section.title} className="hp-section">
            <div className="hp-section-title">{section.title}</div>
            {section.items.map(item => (
              <div key={item.label} className="hp-item">
                <div className="hp-item-label">&gt; {item.label}</div>
                <div className="hp-item-body">
                  {item.body.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
  )
}
