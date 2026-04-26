export const defaultTags = [
  { name: 'morning', color: '#f59e0b' },
  { name: 'routines', color: '#10b981' },
  { name: 'body', color: '#3b82f6' },
  { name: 'work', color: '#8b5cf6' },
  { name: 'evening', color: '#06b6d4' },
]

export const defaultActivities = [
  // ── Morning ──────────────────────────────────────────────────────────────
  {
    id: 'wake-time',
    name: 'Wake time',
    type: 'outcome',
    tags: ['morning'],
    fields: [
      { id: 'time', label: 'Time', type: 'time_point', config: {} },
    ],
  },
  {
    id: 'sleep-duration',
    name: 'Sleep duration',
    type: 'outcome',
    tags: ['morning'],
    fields: [
      { id: 'duration', label: 'Duration', type: 'duration', config: { goal: { target: 420, operator: 'gte' } } },
    ],
  },
  {
    id: 'sleep-quality',
    name: 'Sleep quality',
    type: 'outcome',
    tags: ['morning'],
    fields: [
      { id: 'rating', label: 'Quality', type: 'rating', config: { goal: { target: 4, operator: 'gte' } } },
    ],
  },
  {
    id: 'morning-energy',
    name: 'Morning energy',
    type: 'outcome',
    tags: ['morning'],
    fields: [
      { id: 'rating', label: 'Energy', type: 'rating', config: {} },
    ],
  },
  {
    id: 'mood',
    name: 'Mood',
    type: 'outcome',
    tags: ['morning'],
    fields: [
      { id: 'rating', label: 'Mood', type: 'rating', config: {} },
    ],
  },

  // ── Routines ─────────────────────────────────────────────────────────────
  {
    id: 'morning-sunlight',
    name: 'Morning sunlight',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'cold-shower',
    name: 'Cold shower',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'meditation',
    name: 'Meditation',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
      { id: 'duration', label: 'Duration', type: 'duration', config: {} },
    ],
  },
  {
    id: 'journaling',
    name: 'Journaling',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'reading',
    name: 'Reading',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
      { id: 'duration', label: 'Duration', type: 'duration', config: {} },
    ],
  },

  // ── Body ─────────────────────────────────────────────────────────────────
  {
    id: 'workout',
    name: 'Workout',
    type: 'input',
    tags: ['body'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
      { id: 'type', label: 'Type', type: 'select', config: { options: ['Strength', 'Cardio', 'Mobility', 'Sport', 'Other'] } },
      { id: 'duration', label: 'Duration', type: 'duration', config: {} },
    ],
  },
  {
    id: 'hydration',
    name: 'Hydration',
    type: 'outcome',
    tags: ['body'],
    fields: [
      { id: 'rating', label: 'Rating', type: 'rating', config: {} },
    ],
  },
  {
    id: 'nutrition-quality',
    name: 'Nutrition quality',
    type: 'outcome',
    tags: ['body'],
    fields: [
      { id: 'rating', label: 'Quality', type: 'rating', config: {} },
    ],
  },

  // ── Work ─────────────────────────────────────────────────────────────────
  {
    id: 'deep-work',
    name: 'Deep work',
    type: 'input',
    tags: ['work'],
    fields: [
      { id: 'duration', label: 'Duration', type: 'duration', config: { goal: { target: 120, operator: 'gte' } } },
    ],
  },
  {
    id: 'focus-clarity',
    name: 'Focus / clarity',
    type: 'outcome',
    tags: ['work'],
    fields: [
      { id: 'rating', label: 'Rating', type: 'rating', config: {} },
    ],
  },

  // ── Evening ──────────────────────────────────────────────────────────────
  {
    id: 'blue-light-glasses',
    name: 'Blue light glasses',
    type: 'input',
    tags: ['evening'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'red-light-therapy',
    name: 'Red light therapy',
    type: 'input',
    tags: ['evening'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'screen-cutoff',
    name: 'Screen cutoff',
    type: 'input',
    tags: ['evening'],
    fields: [
      { id: 'time', label: 'Time', type: 'time_point', config: {} },
    ],
  },
  {
    id: 'last-meal',
    name: 'Last meal',
    type: 'input',
    tags: ['evening'],
    fields: [
      { id: 'time', label: 'Time', type: 'time_point', config: {} },
    ],
  },
  {
    id: 'bedtime',
    name: 'Bedtime',
    type: 'input',
    tags: ['evening'],
    fields: [
      { id: 'time', label: 'Time', type: 'time_point', config: {} },
    ],
  },
]
