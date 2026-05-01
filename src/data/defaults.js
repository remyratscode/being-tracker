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
    id: 'bc47b342-7f90-485a-a090-f5635a7b712f',
    name: 'Sleep',
    type: 'outcome',
    tags: ['morning'],
    fields: [
      { id: 'sleep-range', label: 'Sleep', type: 'time_range', config: { goal: { target: 7, operator: 'gte' } } },
    ],
  },
  {
    id: 'a54c910e-9ada-436a-9234-f862e1f60273',
    name: 'Sleep quality',
    type: 'outcome',
    tags: ['morning'],
    fields: [
      { id: 'rating', label: 'Quality', type: 'rating', config: { goal: { target: 4, operator: 'gte' } } },
    ],
  },
  {
    id: '2f762b00-5782-477c-b2b1-708d1db51022',
    name: 'Morning energy',
    type: 'outcome',
    tags: ['morning'],
    fields: [
      { id: 'rating', label: 'Energy', type: 'rating', config: {} },
    ],
  },
  {
    id: '937e9791-3aba-45ca-8069-c487b7a3b3ee',
    name: 'Mood',
    type: 'outcome',
    tags: ['morning'],
    fields: [
      { id: 'rating', label: 'Mood', type: 'rating', config: {} },
    ],
  },
  {
    id: '821c4910-cadd-41cd-8d93-b48b9e044df8',
    name: 'Morning sunlight',
    type: 'input',
    tags: ['morning'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
      { id: 'time', label: 'Time', type: 'time_point', config: {} },
    ],
  },
  {
    id: 'b21c0fe4-604d-4f93-8d6b-db6e51fbc421',
    name: 'Cold shower',
    type: 'input',
    tags: ['morning'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
      { id: 'time', label: 'Time', type: 'time_point', config: {} },
    ],
  },
  {
    id: 'fc33a9dc-f69f-497c-985f-93c6fec815a7',
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
    id: 'efa8a03b-1a27-4838-9b90-9c024eafdf69',
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
    id: '930b1211-e22d-4051-862f-77fa9bd47ae8',
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
    id: 'd23fe949-c237-4d68-91fb-08a773c365fc',
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
    id: '3e7fa311-59d2-4dd5-ab6b-c792ee7414a3',
    name: 'Water',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'amount', label: 'Amount', type: 'quantity', config: { units: ['ml'], bottleSize: 700 } },
    ],
  },
  {
    id: 'f5756293-3a9a-474a-9141-bc7e53caaef6',
    name: 'Creatine',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'c1c02830-c4ef-4982-badd-c31ba845fc02',
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
    id: '23f45f1b-22a9-4338-be31-87715fff4a04',
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
    id: '9d2c3452-03f6-493c-89bf-a953a4c4b34c',
    name: 'Naisen',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done',  label: 'Done',  type: 'toggle', config: {} },
      { id: 'pills', label: 'Pills', type: 'number', config: { defaultValue: 2 } },
    ],
  },
  {
    id: '2faad6c0-c0fd-4320-9d51-23fab725f7de',
    name: 'Alcohol',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'done',   label: 'Done',   type: 'toggle', config: {} },
      { id: 'drinks', label: 'Drinks', type: 'number', config: { placeholder: '0' } },
    ],
  },
  {
    id: 'c3b41a83-0148-43f0-9892-de7889f8b024',
    name: 'Social',
    type: 'input',
    tags: ['routines'],
    fields: [
      { id: 'rating', label: 'Quality', type: 'rating', config: {} },
    ],
  },

  // ── Body ─────────────────────────────────────────────────────────────────
  {
    id: '639244a1-37a2-4416-ab8e-acecb8cb147d',
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
    id: 'b6af0279-1110-4642-9af4-b3487e7d9a23',
    name: 'Walking',
    type: 'input',
    tags: ['body'],
    fields: [
      { id: 'done',     label: 'Done',     type: 'toggle',   config: {} },
      { id: 'duration', label: 'Duration', type: 'duration', config: {} },
    ],
  },
  {
    id: '62c5a95e-4f07-4efe-8143-8df223497cfb',
    name: 'Nutrition quality',
    type: 'outcome',
    tags: ['body'],
    fields: [
      { id: 'rating', label: 'Quality', type: 'rating', config: {} },
    ],
  },

  // ── Work ─────────────────────────────────────────────────────────────────
  {
    id: '8af72220-1a4e-464a-b25b-7dfe190d31be',
    name: 'Deep work',
    type: 'input',
    tags: ['work'],
    fields: [
      { id: 'duration', label: 'Duration', type: 'duration', config: { goal: { target: 120, operator: 'gte' } } },
    ],
  },
  {
    id: '415f2df9-db79-4a7d-8a5a-0c097ccd24cc',
    name: 'Focus / clarity',
    type: 'outcome',
    tags: ['work'],
    fields: [
      { id: 'rating', label: 'Rating', type: 'rating', config: {} },
    ],
  },

  // ── Mind ─────────────────────────────────────────────────────────────────
  {
    id: 'c2a65d7d-b3eb-40b0-85de-6624631c5150',
    name: 'Resistance',
    type: 'outcome',
    tags: ['mind'],
    fields: [
      { id: 'rating', label: 'Level', type: 'rating', config: {} },
      { id: 'note',   label: 'Note',  type: 'text',   config: { placeholder: 'What are you resisting?' } },
    ],
  },
  {
    id: '35512093-2158-4323-baaf-b49ba429dd5a',
    name: 'Afternoon energy',
    type: 'outcome',
    tags: ['mind'],
    fields: [
      { id: 'rating', label: 'Energy', type: 'rating', config: {} },
    ],
  },
  {
    id: '96779c90-8e40-449c-ae11-5dce920198ee',
    name: 'Stress / anxiety',
    type: 'outcome',
    tags: ['mind'],
    fields: [
      { id: 'rating', label: 'Level', type: 'rating', config: {} },
      { id: 'note',   label: 'Note',  type: 'text',   config: { placeholder: "What's on your mind?" } },
    ],
  },
  {
    id: 'f7d90e09-17b1-43ce-8cf4-f44789c642dd',
    name: 'Creativity',
    type: 'outcome',
    tags: ['mind'],
    fields: [
      { id: 'rating', label: 'Level', type: 'rating', config: {} },
    ],
  },
  {
    id: '04832a7b-4e1f-43b1-aef8-708abaacb51d',
    name: 'Curiosity',
    type: 'outcome',
    tags: ['mind'],
    fields: [
      { id: 'rating', label: 'Level', type: 'rating', config: {} },
    ],
  },

  // ── Evening ──────────────────────────────────────────────────────────────
  {
    id: '383c2ad7-a703-4f2f-87ee-d466c03eb803',
    name: 'Blue light glasses',
    type: 'input',
    tags: ['evening'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'a63d472a-a53d-4135-ba3b-f4379af7448a',
    name: 'Red light therapy',
    type: 'input',
    tags: ['evening'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'a314299a-07f3-40e7-8e66-d0ce5c6f290e',
    name: 'Screen cutoff',
    type: 'input',
    tags: ['evening'],
    fields: [
      { id: 'time', label: 'Time', type: 'time_point', config: {} },
    ],
  },
  {
    id: 'fd33aadb-3725-469c-be91-4cd86e06d25f',
    name: 'Last meal',
    type: 'input',
    tags: ['evening'],
    fields: [
      { id: 'time', label: 'Time', type: 'time_point', config: {} },
    ],
  },
]
