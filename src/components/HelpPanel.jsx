const sections = [
  {
    title: 'DAILY VIEW',
    items: [
      { label: 'Date navigation', body: 'Use ← → arrows in the header to move between days. The → is disabled on today. The label reads "Today" for the current date.' },
      { label: 'Capture groups', body: 'Trackables are organised into capture groups (Morning, Routines, Body, Work, Evening). Groups are purely for display — reorganising them never affects your data.' },
      { label: 'Group filter', body: 'Chips at the top of the view toggle groups on/off independently. All shows everything. Click any group chip to hide or reveal it. Multiple groups can be active at once.' },
      { label: 'Drag to reorder', body: 'Grab the ⠿ handle on any card and drag it to a new position within the list.' },
    ],
  },
  {
    title: 'TRACKABLES',
    items: [
      { label: 'Inputs vs outcomes', body: 'Input trackables are things you directly do or control (workout, meditation, blue light glasses). Outcome trackables are states you measure (sleep quality, mood, morning energy). Both are logged the same way — the distinction drives future analysis.' },
      { label: 'Border colour', body: 'No tint = nothing logged. Dark blue = partially filled. Green = all fields complete or all goals met.' },
      { label: '✎  Edit', body: 'Opens the trackable editor. Change name, group, fields, or goals. Appears on card hover.' },
      { label: '≡  History', body: 'Shows last 30 days with any entry data, newest first. Appears on card hover.' },
      { label: 'Stats footer', body: 'Shows streak (green flame) and 14-day rolling averages per numeric field. Only visible when data exists.' },
      { label: 'Archive', body: 'Hides a trackable from the daily view without deleting it or its data. Restore from the Archived section at the bottom.' },
    ],
  },
  {
    title: 'FIELD TYPES',
    items: [
      { label: 'Toggle', body: 'On/off switch. Counts as complete when switched on.' },
      { label: 'Text', body: 'Free-form notes. Optional placeholder.' },
      { label: 'Number', body: 'Numeric input. Supports goals.' },
      { label: 'Time', body: 'Single time picker — records when something happened (bedtime, wake time, screen cutoff).' },
      { label: 'Time Range', body: 'Start + end time. Duration computed automatically. Handles midnight crossing. Supports goals in hours.' },
      { label: 'Duration', body: 'Minutes input for elapsed time. Supports goals.' },
      { label: 'Quantity + unit', body: 'Number with selectable unit (g, kg, ml, capsules or custom). Supports goals.' },
      { label: 'Select', body: 'Dropdown with fixed options. Set options in the field editor (comma-separated).' },
      { label: 'Rating', body: '1–5 star rating. Supports goals. Used for sleep quality, mood, energy, focus.' },
      { label: 'Checklist', body: 'Multiple checkbox items. Counts as complete when any item is checked. Configure items in the field editor.' },
    ],
  },
  {
    title: 'GOALS',
    items: [
      { label: 'Setting a goal', body: 'Enable "Set goal" on any Number, Duration, Time Range, Quantity, or Rating field. Choose operator and target.' },
      { label: 'Operators', body: '≥ at least (sleep ≥ 7h)\n≤ at most (screen time ≤ 2h)\n= exactly (capsules = 3)' },
      { label: 'Goal badge', body: 'Green ✓ = goal met. Muted "/ target" = not yet reached.' },
      { label: 'Completion', body: 'If a field has a goal, the green border requires the goal to be met — not just any value entered.' },
    ],
  },
  {
    title: 'CAPTURE GROUPS & TAGS',
    items: [
      { label: 'First tag = group', body: 'The first tag on a trackable determines which group it appears under in the daily view.' },
      { label: 'Adding tags', body: 'In the trackable editor, click the tag field to see all tags. Type to filter. Enter or comma to confirm. Backspace removes the last tag.' },
      { label: '#  Tag manager', body: 'Create, rename, reorder (↑↓), recolour, and delete tags. Rename propagates to all trackables automatically.' },
      { label: 'Group order', body: 'Reorder tags in the # manager to rearrange the daily view sections without touching individual trackables.' },
    ],
  },
  {
    title: 'CREATING & EDITING',
    items: [
      { label: 'New trackable', body: 'Click + in the header or the + New trackable button at the bottom of the list. Name → assign to a group (optional) → add fields.' },
      { label: 'Delete', body: 'Click Delete in the editor, then Confirm delete. Permanent — all historical entries for that trackable are removed.' },
      { label: 'Shortcuts', body: 'Escape closes any modal. Enter/comma confirms a tag. In the tag manager: Enter confirms rename, Escape cancels.' },
    ],
  },
  {
    title: 'STATS & HISTORY',
    items: [
      { label: 'Streak', body: 'Consecutive days with any logged value, counting back from today. Refreshes when you change date.' },
      { label: '14-day average', body: 'Rolling average for numeric fields (number, duration, rating, quantity). Requires at least 2 data points.' },
      { label: 'History view', body: 'Up to 30 past days with entries, newest first. Days with no data are omitted.' },
    ],
  },
  {
    title: 'STORAGE & BACKUP',
    items: [
      { label: 'Where', body: 'Browser localStorage only. Nothing leaves your device.' },
      { label: 'Auto-save', body: 'Every field change saves immediately. No save button.' },
      { label: 'Export ↓', body: 'Downloads a complete JSON backup of all activities, tags, and entries.' },
      { label: 'Import ↑', body: 'Restores from a JSON backup. Replaces all current data — confirm before proceeding.' },
      { label: 'Warning', body: 'Clearing browser data erases everything. Export regularly to keep a backup.' },
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
