# TracksIt — Milestones (commit-by-commit plan)

> Goal: learn-by-building a modern, cross‑platform notes app (Expo + React Native + TypeScript) with tiny, traceable commits. Each **Milestone** below is intended to be one commit. Sub-bullets are the implementation steps, and **AC** are acceptance criteria.

---

## 0) Project Baseline & Naming
**Why:** lock in the starting point so every change is intentional.

- Verify `expo start` works on **iOS**, **Android**, and **Web**.
- Ensure app displays the current placeholder screen from `app/index.tsx`.
- Rename any remaining “Track Shit” references to **TracksIt**.
- Add repo scaffolding: `README.md` with run instructions.

**Files changed:** `README.md` only (plus any stray rename fixes).

**AC:**
- [x] `npm run web` renders.
- [x] No profanity in repo/app name.

**Commit msg:** `chore: establish baseline and repo README (TracksIt)`

---

## 1) Index screen with a “New Note” CTA
**Why:** provide a simple jumping-off point.

- Keep current `app/index.tsx` but add a large **New Note** button.
- Wire to a placeholder capture route: `/capture` (screen exists but empty).

**Files changed:** `app/index.tsx`, `app/capture.tsx` (new).

**AC:**
- [ ] Tapping **New Note** navigates to `/capture`.

**Commit msg:** `feat(ui): add New Note CTA and empty capture route`

---

## 2) Note model (in code) + AsyncStorage repository (MVP storage)
**Why:** start simple before SQLite; easy to reason about.

- Install `@react-native-async-storage/async-storage`.
- Define `Note` type: `{ id: string; content: string; createdAt: number; updatedAt: number; pinned?: boolean; archived?: boolean; tags?: string[] }`.
- Create `lib/storage.ts` with functions: `loadNotes()`, `saveNotes(notes)`, `addNote(content, tags?)`.
- Use `crypto.randomUUID()` (or a tiny uuid util) for ids.

**Files changed:** `package.json`, `lib/storage.ts`.

**AC:**
- [ ] `addNote` persists a note and `loadNotes` returns it after reload.

**Commit msg:** `feat(storage): MVP repo using AsyncStorage with Note model`

---

## 3) Capture screen — TextInput + Save button
**Why:** make adding a note fast and obvious.

- In `app/capture.tsx`, add a `TextInput` and **Save** button.
- Parse inline `#tags` from the text (e.g., `"Buy milk #errands" → ["errands"]`).
- On save: call `addNote`; then navigate back to `/`.
- Trim content; ignore empty submissions.

**Files changed:** `app/capture.tsx`, `lib/tagParser.ts` (new tiny helper).

**AC:**
- [ ] Typing text and pressing **Save** creates a note.
- [ ] `#tag` tokens are captured (lowercased, deduped).

**Commit msg:** `feat(capture): text input with #tag parsing and save`

---

## 4) Home lists all notes (reverse chronological)
**Why:** immediate feedback that saving worked.

- On `app/index.tsx`, show a flat list of notes (content + timestamp).
- Load notes on mount; refresh after returning from capture.

**Files changed:** `app/index.tsx`.

**AC:**
- [ ] Newly created notes appear at the top.

**Commit msg:** `feat(home): list notes newest-first`

---

## 5) Show tags under each note
**Why:** reinforce the tagging habit.

- Render `#tag` chips under each note.
- Basic style only (no dependency on a design system yet).

**Files changed:** `app/index.tsx`, `components/Tag.tsx` (new).

**AC:**
- [ ] Notes show their tags as small chips.

**Commit msg:** `feat(tags): render tag chips in note list`

---

## 6) Delete & Edit note
**Why:** correctness and basic UX control.

- Add **Delete** action (long-press or swipe, simplest first: a button within item).
- Add **Edit** flow: tap a note → `/edit/[id]` screen with TextInput prefilled.
- Persist changes via `updateNote(id, patch)`.

**Files changed:** `lib/storage.ts`, `app/edit/[id].tsx`, `components/NoteItem.tsx`.

**AC:**
- [ ] A note can be edited and saved.
- [ ] A note can be deleted and no longer appears after reload.

**Commit msg:** `feat(notes): edit and delete note flows`

---

## 7) Search (client-side) by content + tag filter
**Why:** retrieval is a core promise.

- Add a search input on home that filters by content substring (case-insensitive).
- Add a basic **Tag filter** dropdown (all tags aggregated from notes).
- Filtering is live and client-side.

**Files changed:** `app/index.tsx`, `components/TagFilter.tsx`.

**AC:**
- [ ] Typing in search narrows the list.
- [ ] Selecting a tag shows only notes containing that tag.

**Commit msg:** `feat(search): content query and tag filter`

---

## 8) Pin and Archive
**Why:** keep the feed tidy and focused.

- Add `pinned` and `archived` fields to notes (already in model).
- In list: pinned notes float to top; archived notes hidden by default.
- Add toggle actions on a note.
- Add an **Archived** tab/route to view and unarchive.

**Files changed:** `lib/storage.ts`, `components/NoteItem.tsx`, `app/archived.tsx`.

**AC:**
- [ ] Pinned notes render above others.
- [ ] Archived notes don’t appear on Home but are visible in `/archived`.

**Commit msg:** `feat(notes): pin and archive support`

---

## 9) Basic insights (no charts yet)
**Why:** early validation of the “visualize later” goal.

- Compute derived stats in-memory: notes per day (last 14), top tags (top 5).
- Create `/insights` route to display simple numbers and lists.

**Files changed:** `app/insights.tsx`, `lib/derived.ts`.

**AC:**
- [ ] Insights page shows counts that match current data.

**Commit msg:** `feat(insights): notes/day and top tags (text only)`

---

## 10) Styling pass (optional NativeWind setup)
**Why:** make it pleasant without coupling to heavy UI libs.

- Add Tailwind/NativeWind; migrate a few key components to utility classes.
- Keep styles minimal. Avoid refactors beyond classNames.

**Files changed:** `tailwind.config.js`, `app.json` (if needed), components/styles.

**AC:**
- [ ] App compiles and looks the same or cleaner.

**Commit msg:** `chore(style): introduce NativeWind and tidy UI`

---

## 11) Testing foundation (smoke tests)
**Why:** confidence and interview-ready rigor.

- Install React Native Testing Library (RNTL) + Vitest.
- Pin `react-test-renderer@19.1.x` to match your `react@19.1.0`.
- Add two tests: (1) capture saves a note; (2) search filters list.

**Files changed:** test setup files, `__tests__/capture.test.tsx`, `__tests__/search.test.tsx`.

**AC:**
- [ ] `npm test` runs and passes locally.

**Commit msg:** `test: add RNTL+Vitest and first smoke tests`

---

## 12) Migrate storage to SQLite (offline-first upgrade)
**Why:** scalability; prep for FTS and future sync.

- Introduce `expo-sqlite` and a **new repo** parallel to AsyncStorage.
- Migration script: read all notes from AsyncStorage → insert into SQLite → flip a feature flag `STORAGE_BACKEND=sqlite`.
- Keep the same `Note` interface.

**Files changed:** `lib/db.ts`, `lib/sqliteRepo.ts`, `lib/migrate.ts`, env flag.

**AC:**
- [ ] After migrating, all existing notes still appear.
- [ ] New notes are written to SQLite.

**Commit msg:** `feat(storage): migrate notes to SQLite with one-way importer`

---

## 13) Search v2 — basic FTS (platform-aware)
**Why:** faster and better matching.

- For native: enable SQLite FTS5 table or prefix index.
- For web: fallback to in-memory index (simple tokenize + prefix match).
- Abstract behind `searchNotes(query, tag?)` that dispatches based on platform.

**Files changed:** `lib/search.ts`, `lib/sqliteRepo.ts`.

**AC:**
- [ ] Large datasets (5k notes) search quickly on native.

**Commit msg:** `feat(search): platform-aware FTS with web fallback`

---

## 14) Charts for Insights (react-native-svg)
**Why:** visual “aha”.

- Add simple line chart (notes/day) and bar chart (top tags).
- No heavy charting libs; keep code small and interview-friendly.

**Files changed:** `app/insights.tsx`, `components/LineChart.tsx`, `components/BarChart.tsx`.

**AC:**
- [ ] Charts render on native and web.

**Commit msg:** `feat(insights): add minimal SVG charts`

---

## 15) Nice-to-haves / later
- Share sheet ingestion (mobile): quick add from other apps.
- Deep links: `tracksit://capture?text=...` prefill.
- Tag manager screen (rename/merge tags).
- Saved filters (smart views).
- Sync (Supabase/Hasura/Firestore) behind a service layer.
- E2E smoke (Detox or Maestro) for capture→list flow.

---

## Working rules for this repo
- **One milestone = one commit.** Keep diffs tiny; prefer follow-up commits.
- **AC first:** don’t move on until boxes check.
- **Docs per commit:** each commit touches this file to mark progress.

---

## Next up
Start at **Milestone 1** (you already have 0 effectively). When you’re ready, say “let’s do Milestone 1,” and I’ll provide the exact diff for that single commit.

