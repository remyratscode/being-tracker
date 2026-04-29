export const defaultTags = [
  { name: 'morning',  color: '#f59e0b' },
  { name: 'routines', color: '#10b981' },
  { name: 'body',     color: '#3b82f6' },
  { name: 'work',     color: '#8b5cf6' },
  { name: 'mind',     color: '#ec4899' },
  { name: 'evening',  color: '#06b6d4' },
]

export const defaultActivities = [

  // ── Morning ──────────────────────────────────────────────────────────────
  {
    id: 'sleep',
    name: 'Sleep',
    type: 'outcome',
    tags: ['morning'],
    fields: [
      { id: 'sleep-range', label: 'Sleep', type: 'time_range', config: { goal: { target: 7, operator: 'gte' } } },
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
  {
    id: 'morning-sunlight',
    name: 'Morning sunlight',
    type: 'input',
    tags: ['morning'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
      { id: 'time', label: 'Time', type: 'time_point', config: {} },
    ],
  },
  {
    id: 'cold-shower',
    name: 'Cold shower',
    type: 'input',
    tags: ['morning'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
      { id: 'time', label: 'Time', type: 'time_point', config: {} },
    ],
  },
  {
    id: 'meditation',
    name: 'Meditation',
    type: 'input',
    tags: ['morning'],
    fields: [
      { id: 'done',     label: 'Done',     type: 'toggle',     config: {} },
      { id: 'time',     label: 'Time',     type: 'time_point', config: {} },
      { id: 'duration', label: 'Duration', type: 'duration',   config: {} },
    ],
  },
  {
    id: 'journaling',
    name: 'Journaling',
    type: 'input',
    tags: ['morning'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle',     config: {} },
      { id: 'time', label: 'Time', type: 'time_point', config: {} },
    ],
  },

  // ── Routines ─────────────────────────────────────────────────────────────
  {
    id: 'reading',
    name: 'Reading',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done',     label: 'Done',     type: 'toggle',     config: {} },
      { id: 'time',     label: 'Time',     type: 'time_point', config: {} },
      { id: 'duration', label: 'Duration', type: 'duration',   config: {} },
    ],
  },
  {
    id: 'caffeine',
    name: 'Caffeine',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'count', label: 'Drinks',       type: 'number',     config: { placeholder: '0' } },
      { id: 'first', label: 'First coffee', type: 'time_point', config: {} },
      { id: 'last',  label: 'Last coffee',  type: 'time_point', config: {} },
    ],
  },
  {
    id: 'water',
    name: 'Water',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'amount', label: 'Amount', type: 'quantity', config: { units: ['ml'], bottleSize: 700 } },
    ],
  },
  {
    id: 'creatine',
    name: 'Creatine',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'magnesium',
    name: 'Magnesium',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done',  label: 'Done',  type: 'toggle',     config: {} },
      { id: 'time',  label: 'Time',  type: 'time_point', config: {} },
      { id: 'pills', label: 'Pills', type: 'number',     config: { defaultValue: 2 } },
    ],
  },
  {
    id: 'microdosing',
    name: 'Microdosing',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done',  label: 'Done',  type: 'toggle',     config: {} },
      { id: 'time',  label: 'Time',  type: 'time_point', config: {} },
      { id: 'grams', label: 'Grams', type: 'number',     config: { placeholder: '0.000' } },
    ],
  },
  {
    id: 'naisen',
    name: 'Naisen',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done',  label: 'Done',  type: 'toggle', config: {} },
      { id: 'pills', label: 'Pills', type: 'number', config: { defaultValue: 2 } },
    ],
  },
  {
    id: 'alcohol',
    name: 'Alcohol',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done',   label: 'Done',   type: 'toggle', config: {} },
      { id: 'drinks', label: 'Drinks', type: 'number', config: { placeholder: '0' } },
    ],
  },
  {
    id: 'social',
    name: 'Social',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'rating', label: 'Quality', type: 'rating', config: {} },
    ],
  },

  // ── Body ─────────────────────────────────────────────────────────────────
  {
    id: 'workout',
    name: 'Workout',
    type: 'input',
    tags: ['body'],
    fields: [
      { id: 'done',     label: 'Done',     type: 'toggle',   config: {} },
      { id: 'type',     label: 'Type',     type: 'select',   config: { options: ['Squash', 'Strength', 'Cardio', 'Mobility', 'Other'] } },
      { id: 'duration', label: 'Duration', type: 'duration', config: {} },
    ],
  },
  {
    id: 'walking',
    name: 'Walking',
    type: 'input',
    tags: ['body'],
    fields: [
      { id: 'done',     label: 'Done',     type: 'toggle',   config: {} },
      { id: 'duration', label: 'Duration', type: 'duration', config: {} },
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

  // ── Mind ─────────────────────────────────────────────────────────────────
  {
    id: 'resistance',
    name: 'Resistance',
    type: 'outcome',
    tags: ['mind'],
    fields: [
      { id: 'rating', label: 'Level', type: 'rating', config: {} },
      { id: 'note',   label: 'Note',  type: 'text',   config: { placeholder: 'What are you resisting?' } },
    ],
  },
  {
    id: 'afternoon-energy',
    name: 'Afternoon energy',
    type: 'outcome',
    tags: ['mind'],
    fields: [
      { id: 'rating', label: 'Energy', type: 'rating', config: {} },
    ],
  },
  {
    id: 'stress-anxiety',
    name: 'Stress / anxiety',
    type: 'outcome',
    tags: ['mind'],
    fields: [
      { id: 'rating', label: 'Level', type: 'rating', config: {} },
      { id: 'note',   label: 'Note',  type: 'text',   config: { placeholder: "What's on your mind?" } },
    ],
  },
  {
    id: 'creativity',
    name: 'Creativity',
    type: 'outcome',
    tags: ['mind'],
    fields: [
      { id: 'rating', label: 'Level', type: 'rating', config: {} },
    ],
  },
  {
    id: 'curiosity',
    name: 'Curiosity',
    type: 'outcome',
    tags: ['mind'],
    fields: [
      { id: 'rating', label: 'Level', type: 'rating', config: {} },
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
]
