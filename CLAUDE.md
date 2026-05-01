# Being Tracker — Codebase Notes
*v4.0 — 2026-05-02*

Personal daily tracking app. React 19 + Vite + Supabase. Deployed on Vercel as a PWA.
Run locally: `npm run dev` → localhost:5173
Production: https://being-tracker.vercel.app
Deploy: `vercel --prod` from project root

---

## Vision & Purpose

Being Tracker is a personal data capture system designed to reduce friction to near-zero so that data about your life accumulates consistently. That data is run through AI-powered analysis to surface high-leverage insights — not what should work for a person like you, but what does work for you specifically, verified by your own data over time.

The logging is just fuel. The real product is the clarity it generates over time.

### Structural Philosophy

**Capture groups** — UX containers only (Morning, Routines, Body, Work, Mind, Evening). Purely navigational. Renaming or reorganising them has zero effect on data.

**Trackables** — every individual thing logged is its own entity:
- *Input trackables* — things you directly do or control (workout, meditation, supplements)
- *Outcome trackables* — states that emerge and are measured (sleep quality, energy, mood)

**Containers** — named collapsible sub-groups within a capture group. UX only. Batch-complete action (✓ all). No effect on data structure.

**Analysis domains** — Sleep, Energy, Focus, Mood. Not containers — analytical lenses. Input/outcome correlations discovered through data, not declared upfront. Built later.

### Platform Architecture

- **Supabase** — hosted Postgres, realtime sync, built-in auth. Email + password, one account across all devices. RLS protects all data via `auth.uid() = user_id`.
- **PWA** — installable on desktop and phone home screen via Vercel HTTPS deployment. No app store.
- **Vercel** — production hosting. Every `vercel --prod` updates both desktop and phone simultaneously.
- **Offline** — MVP is online-required, graceful failure. Offline-first is a later phase.

### AI Integration Vision

Three modes (future):
- **Input mode** — chat/voice → AI reads schema + history → writes structured entries via Supabase
- **Analysis mode** — surfaces patterns, correlations, personalised insight
- **Planning mode** — proposes structural changes, user confirms, executes

AI operates at the Supabase level — no per-device friction. Data changes appear on all devices instantly. Code/schema changes deploy via `vercel --prod`.

Voice: Web Speech API (browser-native). Mobile: AI voice call mode — log and get insight in real-time conversation anywhere.

Obsidian/second brain integration: tracker writes structured daily summaries to vault files alongside qualitative notes, giving AI the full quantitative + qualitative picture.

---

## Architecture

App.jsx is the single root. All state via hooks. Components are dumb renderers. Logic in hooks/ and utils/.

**Auth:** AuthGate (src/components/AuthGate.jsx) wraps the app. Supabase email + password. Session persists in localStorage by Supabase client.

Hooks:
- `useActivities` — CRUD + archive + reorder + tag rename + changelog events. Reads/writes `activities` Supabase table.
- `useEntries(date)` — getEntry, setFieldValue. Optimistic local update + Supabase RPC `upsert_entry_field`. Functional setState — safe for rapid multiple calls per activityId.
- `useTags` — add/rename/delete/move/updateColor. Reads/writes `tags` Supabase table.
- `useStats(activities, date)` — read-only rolling 14-day stats + streaks. NOT reactive to entry changes (intentional).
- `useContainers` — CRUD for named containers. Reads/writes `containers` Supabase table.
- `useHeatmapEntries(days)` — fetches entries for a date range in one Supabase query. Used by heatmap components.

View routing: `view` state in App.jsx ('daily' | 'heatmap'). No router.

---

## Data Model

**Activities** (`activities` table)
```
{ id (UUID), name, type: 'input'|'outcome', tags: string[], containerId: string|null, fields: Field[], archived: boolean }
Field: { id, label, type, config: { goal?, units?, options?, placeholder?, defaultValue?, bottleSize? } }
```

**Entries** (`entries` table — one per activity per day)
```
{ activityId, date, values: { [fieldId]: value } }
```

**Tags** (`tags` table — ORDER MATTERS: controls group order in daily view and progress ring)
```
{ name: string, color: hex }[]
```

**Containers** (`containers` table)
```
{ id: string, name: string, tag: string }[]
```
Activities reference containers via `containerId`. If container deleted, activities fall back to ungrouped automatically — no cleanup required.

**Changelog** (`changelog` table — append-only)
```
{ type: 'created'|'renamed'|'updated'|'deleted'|'archived'|'restored', activityId, activityName, meta? }
```

### Supabase Security

- All tables: RLS `USING (auth.uid() = user_id)` for all operations
- `set_user_id()` SECURITY DEFINER trigger: auto-fills user_id on every INSERT
- `upsert_entry_field(p_activity_id, p_date, p_field_id, p_value)` RPC: atomic JSONB merge via `||`, uses named constraint `entries_unique_per_user_activity_date`

**Credentials:** in `.env.local` (gitignored)
- VITE_SUPABASE_URL = https://uoyukruwfkhjozjukkhf.supabase.co
- VITE_SUPABASE_ANON_KEY = (in .env.local and Vercel env vars)

---

## Non-Obvious Decisions

1. `todayStr()` is a function, never a constant — app may stay open past midnight.
2. Activities grouped by FIRST tag only. Second+ tags are labels, don't affect grouping.
3. Tag order in registry = group order on screen.
4. Progress ring reactivity: ring useMemo depends on getEntry (useCallback). getEntry's reference changes on every entries update — forces real-time recompute. Intentional.
5. `todayEntryCount` is a dummy reactive trigger for WeekStrip — React can't observe Supabase changes directly; this prop invalidates its memo.
6. `getEntry` returns undefined (not null). All consumers use optional chaining.
7. useStats NOT reactive to entry changes — intentional to avoid a Supabase query per keypress.
8. Completion logic ONLY in `utils/completion.js`. Do not duplicate.
9. `config.defaultValue` on number fields — auto-filled when a toggle sibling fires ON (if currently empty). See ActivityCard handleChange.
10. `config.bottleSize` on quantity fields — enables ±increment buttons. Single-unit quantity shows unit as text, not dropdown.
11. `batchComplete(activityIds)` in App.jsx replicates ActivityCard handleChange for all toggle fields in a set. Auto-time and defaultValue logic applies.
12. Containers: if containerId refers to deleted or wrong-tag container, activity renders as ungrouped — no cleanup required.
13. `activitiesRef` / `tagsRef` useRef patterns: kept in sync with state for use in async callbacks to avoid stale closures.
14. React StrictMode double-runs effects in dev — causes harmless 23505 duplicate key on seed. Suppressed: `if (seedErr && seedErr.code !== '23505')`.
15. `DateNav` is in the day-header bar (not the main header) — frees up header width on mobile. Header contains: app name, nav tabs, action buttons only.
16. `mobile-hide` CSS class hides desktop-only header buttons (widget toggle, help, backup/import) on screens < 640px.
17. Safe-area insets applied via `env(safe-area-inset-*)` on header, day-header, and app-main — required for iPhone notch support with `viewport-fit=cover`.
18. backup.js still reads/writes localStorage — not yet updated for Supabase.
19. `.npmrc` sets `legacy-peer-deps=true` globally — required because `vite-plugin-pwa@1.2.0` peer dep doesn't yet list Vite 8.

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

Goals: `field.config.goal = { target: number, operator: "gte"|"lte"|"eq" }`
Supported on: number, duration, time_range, quantity, rating.

---

## Utility Layer

Pure functions, no React dependencies.

- `completion.js` → hasValue, getActual, fieldIsDone, getCompletionStatus
- `date.js` → todayStr, shiftDate, formatDateLabel
- `time.js` → computeDuration, formatMinutes, formatAvg, nowTimeStr
- `heatmap.js` → getDaysRange, getDayRatio, getActivityValue, ratioToColor, buildWeekGrid, getMonthLabels, RANGE_OPTIONS
- `changelog.js` → appendChangelogEvent (writes to Supabase `changelog` table)
- `backup.js` → exportData, importData (v2 — still localStorage-based, needs Supabase update)

---

## What Is Already Implemented

- **Supabase backend** — all data in cloud Postgres, email+password auth, RLS, auto user_id trigger
- **AuthGate** — login/signup screen on first visit, session persists across refreshes
- **PWA** — installable on iPhone/Android home screen, standalone display, app manifest, Workbox service worker
- **Vercel deployment** — production at being-tracker.vercel.app, deploy with `vercel --prod`
- Archive/restore trackables
- Export / import JSON backup v2 (still localStorage-based)
- Tag filter chips on daily view — multi-toggle with All chip
- Rating field type with goal support (star UI)
- Checklist field type (checkboxes with count)
- History modal — last 30 days
- 14-day rolling stats + streaks on trackable cards
- Progress ring (SVG, grouped by first tag)
- Drag-to-reorder trackables
- Input / outcome type on all trackables
- Auto-time on toggle — toggling ON auto-fills empty time_point siblings with current time
- Default value on toggle — toggling ON auto-fills empty number fields with config.defaultValue
- Bottle buttons on quantity fields
- 31 default trackables across 6 groups (seeded to Supabase on first login)
- Structural changelog — append-only event log in Supabase
- Calendar heatmap — full view tab (30/60/90/180d range, stats, per-trackable strips)
- Floating heatmap widget — draggable, per-trackable or overview
- Header nav bar — brand | Daily/Heatmap tabs | action buttons | sign-out (⏻)
- Containers — named collapsible sub-groups, ✓ all button, inline rename/delete
- Group-level ✓ all — batch-completes all toggle fields in group with auto-time/defaults
- Container assignment in ActivityModal — dropdown + inline create
- Mobile UI — responsive header, safe-area insets, touch targets, DateNav in day-header

---

## Data Survival Principle

Prefer archiving over deleting. Historical entries remain under their original activityId even if the trackable is renamed, split, or replaced. Orphaned entries are not garbage — they are historical signal. The AI can bridge old and new schemas.

---

## Known Gaps / Not Yet Built

- **Offline-first** — MVP is online-required. Offline-first is a later phase.
- **AI conversational input + voice logging** — next major build after data layer is stable.
- **backup.js Supabase update** — currently still reads/writes localStorage.
- **Migration system** — sync missing defaultActivities/defaultTags into existing installs without touching entries.
- **History modal pagination** — hardcoded 30 days.
- **Analysis domain system** — correlations, pattern discovery (month 2+).
- **Obsidian / second brain integration** — discussed, not yet designed.

---

## Approved Build Roadmap

1. ~~Supabase integration~~ ✓ done
2. ~~PWA + Vercel deployment~~ ✓ done
3. **AI input mode** — Claude API + schema context → structured entry writes ← next
4. Voice input — Web Speech API on top of AI input pipeline
5. AI voice call mode — persistent conversation, real-time logging + insight
6. Offline-first (Option B)
7. Analysis domain system
8. Obsidian integration
