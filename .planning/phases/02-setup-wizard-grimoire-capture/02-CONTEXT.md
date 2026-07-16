# Phase 2: Setup Wizard & Grimoire Capture - Context

**Gathered:** 2026-07-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the setup wizard through role recording so a Storyteller can select Trouble Brewing, enter a legal player table (5–15), set difficulty, get a legal bag, deal physically, record assignments into a digital grimoire, and reach a “Night ready” handoff — without shipping the night coach (Phase 3). Scope: SETUP-01–05, GRIM-01–02.

</domain>

<decisions>
## Implementation Decisions

### Player roster editing
- **D-01:** Add players via an **inline list + “Add player”** on one screen (each row is a name field). No separate add sheet.
- **D-02:** Change seating with **Up/Down buttons** on each row (not drag-and-drop).
- **D-03:** **Confirm before remove** (“Remove Alice?”). **Name uniqueness checked on Next** (not live inline while typing).
- **D-04:** **Gate player count to 5–15** (Next blocked outside range). Optional profile fields (experience / age / notes) live under a collapsed **“More”** per row.

### Difficulty & profile influence
- **D-05:** Difficulty control is **three named levels: Easy / Standard / Hard**.
- **D-06:** **Default Standard** with **one-line help**: difficulty changes which legal bags are preferred — not who draws what.
- **D-07:** **Profiles do not affect the bag in v1.** Experience / age / notes are collected for later coaching only. Bag generation uses **difficulty + player count** (and TB legality) alone. This **overrides** PROJECT.md’s “profiles influence overall setup difficulty” for v1 bag generation — profile→bag is explicit v2 work (see Deferred).
- **D-08:** Profile enums when expanded: Experience **New / Some / Veteran**; Age **Kid / Teen / Adult**; plus freeform notes.

### Bag review, regenerate, deal
- **D-09:** Bag step shows the **full private bag list** (character names by team) plus a **short “why this bag” note** tied to difficulty.
- **D-10:** **No regenerate in v1** — accept this bag or go **Back** to change players/difficulty. Regenerate-with-confirm is v2 (Deferred).
- **D-11:** **No manual bag edits** in v1 (no swaps/add/remove tokens in UI).
- **D-12:** **Deal step** is a **short coaching card** (“Shuffle and deal face-down… then record who got what”) + Continue — no in-app deal or token checklist.

### Role recording & night gate
- **D-13:** Role picker shows **only remaining bag tokens** (assigned characters leave the pool).
- **D-14:** Fix mistakes by **tapping an assigned player → change or clear** (clear returns the token to the pool).
- **D-15:** **Soft Start night gate** — allow proceeding with a **warning/confirm** when recording is incomplete or composition does not match (not a permanently disabled button-only hard block). Downstream should still surface what’s wrong before confirm. Note: this softens a strict reading of GRIM-02; implement as confirm-to-override, not silent bypass.
- **D-16:** **No quit-before-start feature** in v1 (no special dropout/re-bag flow). Ordinary roster remove during setup remains (D-03).
- **D-17:** After start confirmation, **stay on setup** with a **“Night ready”** summary screen. Do **not** navigate to `/play` yet — Phase 3 wires the night coach from this handoff.

### Carried forward (ratified — not re-litigated)
- **D-18:** Wizard order locked: script → players → difficulty → bag → deal → role recording.
- **D-19:** Deal stays random; app does not auto-assign characters to players.
- **D-20:** Follow Phase 1 visual language (`01-UI-SPEC.md` / PhoneShell); replace `SetupStub` on `/setup`.
- **D-21:** Prefer Playwright E2E with real TB data for shipped flows; bag legality is a domain concern — planner/researcher may add focused domain tests if E2E alone cannot prove bag heuristics safely (Claude discretion on test split).

### Claude's Discretion
- Exact Easy/Standard/Hard bag heuristics (within Almanac/TPI-legal TB) — research must validate; UI labels are locked.
- Copy tone for “why this bag”, deal coaching, and soft-gate warning — match Phase 1 table-lantern voice.
- Mid-wizard persistence (Zustand + IndexedDB) timing and schema — follow STACK unless research finds a simpler Phase 2 cut.
- Whether “Night ready” includes a disabled/placeholder path into `/play` vs pure summary — keep handoff clear for Phase 3.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase & requirements
- `.planning/ROADMAP.md` — Phase 2 goal, success criteria, SETUP-01–05 / GRIM-01–02 mapping
- `.planning/REQUIREMENTS.md` — SETUP-01–05, GRIM-01–02 definitions; out-of-scope (auto-assign, town square, etc.)
- `.planning/PROJECT.md` — agreed wizard UX; note D-07 overrides profile→bag for v1

### Prior phase
- `.planning/phases/01-phone-shell-tb-catalog/01-CONTEXT.md` — shell, Playwright, offline chip, catalog decisions
- `.planning/phases/01-phone-shell-tb-catalog/01-UI-SPEC.md` — visual/copy contract to extend into wizard
- `.planning/phases/01-phone-shell-tb-catalog/01-RESEARCH.md` — setup chart A1, catalog patterns

### Stack & product research
- `.planning/research/STACK.md` — Zustand + idb-keyval persist, Zod, Vite SPA
- `.planning/research/SUMMARY.md` — bag builder / grimoire seams; difficulty tunes legal bags
- `.planning/research/PITFALLS.md` — illegal bags, grimoire desync, IP constraints

### Code integration points
- `src/ui/setup/SetupStub.tsx` — replace with real wizard
- `src/app/routes.tsx` — `/setup` route (stay here for Night ready; `/play` remains stub)
- `src/domain/script/loadCatalog.ts` — roles + setup chart 5–15 for bag builder
- `src/ui/home/ScriptHome.tsx` — “Start setup” → `/setup`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PhoneShell` (`src/app/layout/PhoneShell.tsx`) — wrap wizard steps
- `loadCatalog()` / Zod schemas — TB roles, setup-chart rows, team counts for bag legality
- CSS variables / typography from Phase 1 (`index.css`, Fraunces + Source Sans 3)
- Home “Start setup” CTA already routes to `/setup`

### Established Patterns
- Shallow React Router routes (`/`, `/setup`, `/play`) — wizard state in app state, not URL step IDs (unless planner chooses otherwise)
- Phone-first Tailwind utilities; no shadcn/Vaul required yet (bottom sheet was rejected for add-player)
- Playwright E2E against real bundled data (Phase 1 D-05–D-08)

### Integration Points
- Replace `SetupStub` with multi-step wizard UI under `/setup`
- New domain modules expected: bag builder + grimoire assignment validator (pure functions; research for structure)
- Session persistence not yet in codebase — STACK recommends Zustand + idb-keyval when live game state appears
- “Night ready” remains on `/setup`; Phase 3 consumes recorded grimoire into `/play` coach

</code_context>

<specifics>
## Specific Ideas

- Soft Start night gate is intentional: confirm-to-override when incomplete, not a hard-only disabled button.
- User explicitly asked that **profile→bag influence** and **bag regenerate with confirm** not be forgotten for v2.
- No dedicated “player quit before game start” feature in v1.

</specifics>

<deferred>
## Deferred Ideas

- **v2 — Profile→bag influence:** experience/age/notes should affect bag/difficulty heuristics (explicitly deferred from v1; user: do not forget).
- **v2 — Bag regenerate with confirm:** “New bag” control with confirmation (v1 = accept or Back only).
- Quit-before-start / dropout re-bag flow — not in v1.
- Night coach UI and `/play` live grimoire — Phase 3.
- Install coaching, Vitest-first domain suite (unless planner adds minimal bag unit tests), shadcn/Vaul — prior Phase 1 deferrals.

</deferred>

---

*Phase: 2-setup-wizard-grimoire-capture*
*Context gathered: 2026-07-16*
