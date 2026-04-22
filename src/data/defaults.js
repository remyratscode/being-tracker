export const defaultActivities = [
  {
    id: 'sleep',
    name: 'Sleep',
    tags: ['night', 'body', 'recovery'],
    fields: [
      { id: 'range', label: 'Sleep', type: 'time_range', config: {} },
    ],
  },
  {
    id: 'red-lights',
    name: 'Red lights',
    tags: ['night', 'sleep hygiene'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'blue-light-glasses',
    name: 'Blue light glasses',
    tags: ['night', 'sleep hygiene'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'phone-away',
    name: 'Phone away from bed',
    tags: ['night', 'sleep hygiene', 'habits'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'off-phone-morning',
    name: 'Off phone 45 min',
    tags: ['morning', 'habits', 'mind'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'outside-breathe',
    name: 'Outside & breathe',
    tags: ['morning', 'body', 'habits'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'meditation',
    name: 'Meditation',
    tags: ['morning', 'mind', 'spirit'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'journaling',
    name: 'Journaling',
    tags: ['morning', 'mind', 'spirit'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'reading',
    name: 'Reading',
    tags: ['morning', 'mind', 'learning'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
      { id: 'pages', label: 'Pages read', type: 'number', config: { placeholder: '0' } },
    ],
  },
  {
    id: 'supplements',
    name: 'Supplements',
    tags: ['morning', 'body', 'supplements'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
  {
    id: 'workout',
    name: 'Workout',
    tags: ['body', 'fitness'],
    fields: [
      { id: 'type', label: 'Type', type: 'select', config: { options: ['Strength', 'Cardio', 'Mobility', 'Sport', 'Other'] } },
      { id: 'range', label: 'Session', type: 'time_range', config: {} },
    ],
  },
  {
    id: 'stretching',
    name: 'Stretching',
    tags: ['body', 'fitness', 'mobility'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
      { id: 'duration', label: 'Duration', type: 'duration', config: {} },
    ],
  },
  {
    id: 'eating',
    name: 'Eating',
    tags: ['body', 'nutrition'],
    fields: [
      { id: 'notes', label: 'Notes', type: 'text', config: { placeholder: 'How did you eat today' } },
    ],
  },
  {
    id: 'coding',
    name: 'Coding',
    tags: ['skills', 'learning', 'day'],
    fields: [
      { id: 'duration', label: 'Duration', type: 'duration', config: {} },
      { id: 'notes', label: 'Notes', type: 'text', config: { placeholder: 'What you built' } },
    ],
  },
  {
    id: 'university',
    name: 'University',
    tags: ['mind', 'learning', 'day'],
    fields: [
      { id: 'duration', label: 'Duration', type: 'duration', config: {} },
      { id: 'notes', label: 'Notes', type: 'text', config: { placeholder: 'What you worked on' } },
    ],
  },
  {
    id: 'parents',
    name: 'Talked to parents',
    tags: ['relationships', 'day'],
    fields: [
      { id: 'done', label: 'Done', type: 'toggle', config: {} },
    ],
  },
]
