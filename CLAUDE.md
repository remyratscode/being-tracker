# Being Tracker — Codebase Notes
*v1.0 — 2026-04-26*

Personal daily tracking app. React 19 + Vite. No backend. All data in localStorage.
Run: `npm run dev` → localhost:5173

---

## Vision & Purpose

Being Tracker is a personal data capture system designed to reduce friction to near-zero so that data about your life accumulates consistently. That data is then run through AI-powered analysis to surface high-leverage insights — what specific actions will move your outcomes most effectively.

The logging is just fuel. The real product is the clarity it generates over time.

### Structural Philosophy

**Capture groups** — UX containers only (Morning, Routines, Body, Work, Evening). Purely navigational. Renaming or reorganising them has zero effect on data. They represent your current best guess and will evolve.

**Trackables** — every individual thing logged is its own entity:
- *Input trackables* — things you directly do or control (workout, blue light glasses, meditation)
- *Outcome trackables* — states that emerge and are measured (sleep quality, morning energy, mood)

**Analysis domains** — Sleep, Energy, Focus, Mood. Not containers — analytical lenses. Each has a primary outcome signal. Input/outcome correlations are discovered through data, not declared upfront. Built later.

This separation means the view of how things link evolves with the data, with no structural migration required.

### The Depth of Context — Why This Is Unprecedented

After six months of consistent logging the AI has access to: sleep patterns across every night, which mornings had energy and what the previous 24 hours looked like, mood and focus across hundreds of days, workout frequency, nutrition, meditation consistency — all simultaneously, in relation to each other, over time.

No doctor, therapist, coach, or mentor has this. A therapist works from an hour a week filtered through your own perception. A doctor works from symptoms in a fifteen-minute window. Even people close to you see only the slice you share with them.

This system sees everything you give it, consistently, across time. The context depth is not comparable to anything a human advisor works from — it is categorically more complete. The AI reasoning over that context is not giving population-level advice. It is reasoning specifically about you: your correlations, your patterns, your specific biology and tendencies. The quality of insight that becomes possible is genuinely hard to grasp in advance. It is the difference between a map of a city and a map of every street you have ever walked, annotated with how you felt on each one.

### The Evolutionary Feedback Loop

The deepest value of the system. It is not a static tracker — it is a self-improving optimization engine that compounds through iterative cycles:

1. **Track** — data accumulates across inputs and outcomes
2. **Analyse** — AI surfaces which inputs have the highest leverage on each outcome
3. **Act** — you take those specific high-leverage actions with clarity and intention
4. **Improve** — outcomes measurably shift; the data reflects the change
5. **Reveal** — improved outputs surface new questions and new frontiers
6. **Evolve** — the system updates: new things to track emerge, over-tracked things drop, existing trackables deepen
7. **Repeat** — the next iteration runs on a more accurate, more complete picture of your being

Each cycle brings you closer to your aligned life — not through willpower or generic advice, but through increasingly precise understanding of the specific levers that move your specific outcomes. The tracking schema itself is a living artefact, evolving with your understanding of what actually matters.

### AI Integration Vision (future)
- **Input mode** — conversational/voice logging → AI reads schema + history → writes structured entries
- **Analysis mode** — surfaces patterns, correlations, personalised insight from your data
- **Planning mode** — proposes structural changes, you confirm, it executes

---

## Architecture

App.jsx is the single root. Holds all state via useActivities, useEntries, useTags hooks; passes data + callbacks down. useStats is read-only and side-effect free. No global state library — everything flows through props. Components are dumb renderers. Logic lives in hooks/ and utils/.

---

## Data Model

**Activities** — `lifelog:activities`
```
{ id, name, type: 'input'|'outcome', tags: string[], fields: Field[] }
Field: { id, label, type, config: { goal?, units?, options?, placeholder? } }
```

**Entries** — `lifelog:entries:YYYY-MM-DD`
```
{ id, activityId, date, values: { [fieldId]: value }, loggedAt }
```
One entry per activity per day. Fields added to values on first input.

**Tags** — `lifelog:tags`
```
{ name: string, color: hex }[]
```
ORDER MATTERS — tag order controls group order in daily view and progress ring.

---

## Non-Obvious Decisions

1. `todayStr()` is a function, never a constant — app may stay open past midnight.
2. Tags are `{ name, color }` objects. `loadTags()` silently migrates old string[] data. Don't revert to plain strings.
3. Activities grouped by FIRST tag only. Second+ tags are labels, don't affect grouping.
4. Tag order in registry = group order on screen. Reordering tags in TagsModal reorders daily view sections.
5. Progress ring reactivity: ring useMemo depends on getEntry (useCallback). getEntry's reference changes on every entries update — forces real-time ring recompute. Intentional.
6. `todayEntryCount` is a dummy reactive trigger for WeekStrip. WeekStrip reads localStorage directly so React can't observe changes — this prop invalidates its memo. Not a meaningful value.
7. `getEntry` returns undefined (not null). All consumers use optional chaining. Don't change to null without auditing every callsite.
8. useStats runs on activities + date changes, NOT entry changes. Streaks/averages are not live — intentional to avoid 14-day localStorage reads on every keypress.
9. Completion logic lives ONLY in `utils/completion.js`. `getCompletionStatus()` is the single source of truth. Do not duplicate.
10. `persist(updater)` pattern in hooks calls setState + saveToStorage atomically. Never call saveActivities/saveTags directly from a component.

---

## Field Types

| Type | Stored As |
|------|-----------|
| toggle | boolean |
| text | string |
| number | string (parsed on use) |
| time_point | "HH:MM" |
| time_range | `{ start: "HH:MM", end: "HH:MM" }` |
| duration | string (minutes) |
| quantity | `{ amount: string, unit: string }` |
| select | string |
| rating | number (1–5 stars, configurable max) |
| checklist | `{ [item]: boolean }` |

Goals supported on: number, duration, time_range, quantity, rating.
Goal config: `field.config.goal = { target: number, operator: "gte"|"lte"|"eq" }`

---

## Utility Layer

Pure functions, no React dependencies.

- `completion.js` → hasValue, getActual, fieldIsDone, getCompletionStatus
- `date.js` → todayStr, shiftDate, formatDateLabel
- `time.js` → computeDuration, formatMinutes, formatAvg

If logic touches values or dates and isn't component-specific, it belongs here.

---

## Storage Keys

```
lifelog:activities
lifelog:tags
lifelog:entries:YYYY-MM-DD   (one key per day, indefinitely)
```

---

## What Is Already Implemented

- Archive activities (useActivities.js + collapsible section in App.jsx)
- Export / import JSON (utils/backup.js + header buttons)
- Tag filter on daily view (App.jsx)
- Rating field type (star UI in FieldRenderer.jsx)
- Checklist field type (checkboxes with count in FieldRenderer.jsx)
- History modal — last 30 days, no pagination (HistoryModal.jsx)
- 14-day rolling stats + streaks on activity cards
- Progress ring (SVG, grouped by first tag)
- Drag-to-reorder activities

---

## Data Survival Principle

Structural evolution of the system does not require data deletion. When an activity is renamed, split into multiple trackables, or replaced — its historical entries remain in localStorage under the original activityId. That data retains analytical value even if the activity schema has changed.

The analysis layer is designed to interpret evolving data structures over time. Orphaned entries (entries whose activityId no longer matches an active trackable) are not garbage — they are historical signal. The AI can bridge old and new schemas, helping surface what the old data means in the context of the new structure.

Practical implication: prefer archiving over deleting. When expanding an activity into multiple trackables, archive the original rather than deleting it. Its data persists and remains queryable.

## Known Gaps

- Calendar heatmap view
- Weekly summary / data visualization dashboard
- Analysis domain system (correlations, pattern discovery)
- AI integration
- Voice input
- History modal pagination (hardcoded 30 days)

---

## Backlog (priority order)

**Now — before first logging session**
1. Add individual supplement trackables (creatine, magnesium, vitamin D, fish oil etc.)
2. Rename "Tags" label → "Group" in ActivityModal (reduces confusion with the new mental model)

**This week — as logging begins**
3. Structural changelog — lightweight record of when trackables are created, archived, renamed, or split. Gives the analysis layer full context on system evolution from day one.

**Weeks 1–2 — first visual feedback**
4. Calendar heatmap — consistency view over time, motivating, reads existing entry data, no model changes

**Weeks 2–4 — as trackable list grows**
5. Containers — collapsible groupings within capture groups, batch-complete action (e.g. one tap to mark all supplements done)

**Weeks 4–8 — the unlock**
6. AI conversational input — text → structured entries, voice on top via Web Speech API
7. Rename "Tags" manager to "Groups" manager throughout UI

**Month 2+ — the payoff**
8. Analysis domain system — correlations, pattern discovery, which inputs move which outcomes
9. Weekly summary / data visualization
10. Full AI analysis and mentorship mode
