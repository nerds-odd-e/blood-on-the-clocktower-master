# Phase 2: Setup Wizard & Grimoire Capture - Research

**Researched:** 2026-07-16
**Domain:** Trouble Brewing bag builder + setup wizard step machine + role recording / night gate (Vite React SPA, Zustand persist)
**Confidence:** HIGH (bag legality + persist patterns); MEDIUM (Easy/Standard/Hard role-preference heuristics — no official named dial)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
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

### Deferred Ideas (OUT OF SCOPE)
- **v2 — Profile→bag influence:** experience/age/notes should affect bag/difficulty heuristics (explicitly deferred from v1; user: do not forget).
- **v2 — Bag regenerate with confirm:** “New bag” control with confirmation (v1 = accept or Back only).
- Quit-before-start / dropout re-bag flow — not in v1.
- Night coach UI and `/play` live grimoire — Phase 3.
- Install coaching, Vitest-first domain suite (unless planner adds minimal bag unit tests), shadcn/Vaul — prior Phase 1 deferrals.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SETUP-01 | Select TB + unique names + seating order | Wizard `script` → `players` steps; uniqueness on Next (D-03); Up/Down seating (D-02); catalog already locks TB |
| SETUP-02 | Set game difficulty | `difficulty` step: Easy/Standard/Hard, default Standard (D-05–D-06); feeds bag builder only |
| SETUP-03 | Optional experience / age / notes per player | Collapsed “More” per row (D-04/D-08); **not** passed into bag (D-07) |
| SETUP-04 | Legal TB bag from player count + difficulty (+ profiles in REQ text) | Pure `buildBag({ playerCount, difficulty, catalog })`; D-07 ignores profiles for v1; Baron/Drunk legality below |
| SETUP-05 | Wizard order script→players→difficulty→bag→deal→record | Zustand `wizardStep` enum on `/setup` only (D-18); replace `SetupStub` |
| GRIM-01 | Record who got which role (tap player → pick character) | Remaining-token pool from `BagPlan.tokens` (D-13–D-14); Drunk cover-token model |
| GRIM-02 | Block night start until composition matches | Soft confirm-to-override (D-15): validate + warn, then confirm; Night ready stays on `/setup` (D-17) |
</phase_requirements>

## Summary

Phase 2 turns `/setup` from a stub into a linear phone wizard that produces a **legal Trouble Brewing bag**, coaches a **physical random deal**, and captures a **digital grimoire** via remaining-token assignment — ending on a **Night ready** handoff without shipping the night coach. Phase 1 already provides PhoneShell, TB catalog (roles + setup chart 5–15 + Zod), and Playwright preview E2E; this phase adds domain modules (`bag`, `grimoire`), a Zustand setup session with IndexedDB persist, and wizard UI under `src/ui/setup/`.

Bag legality is non-negotiable: base team counts from the locked setup chart, then orange-leaf mutations (**Baron** `[+2 Outsiders]` replacing Townsfolk; **Drunk** never places its token in the bag — a Townsfolk cover token does). Easy/Standard/Hard are **product labels** with no official TPI dial; map them to Almanac/TPI recommended setup *preferences* among legal bags. GRIM-02 is implemented as D-15’s soft gate (surface mismatches → confirm to proceed), not a silent bypass and not a forever-disabled button.

**Primary recommendation:** Implement pure `buildBag` + `validateBag` / `validateAssignments` first (Vitest node unit tests), then a Zustand `setupSession` store with `persist` → `idb-keyval`, then replace `SetupStub` with a step machine UI that reuses Phase 1 visual tokens and Playwright patterns.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Wizard step UI (roster, difficulty, bag review, deal, record) | Browser / Client | — | Phone SPA only; no SSR |
| TB bag generation + legality validation | Browser / Client (domain) | — | Pure functions over bundled catalog |
| Role assignment / remaining token pool | Browser / Client (domain + state) | — | Grimoire mutations in Zustand |
| Mid-wizard session persistence | Browser / Client | Database / Storage (IndexedDB) | Zustand persist → idb-keyval |
| Soft night-start gate + Night ready | Browser / Client | — | Stays on `/setup`; Phase 3 consumes |
| Script catalog load | Browser / Client | CDN / Static | Already shipped Phase 1 |
| Auth / backend / multiplayer | — | — | Explicitly none |

## Project Constraints (from .cursor/rules/)

`.cursor/rules/` exists but is **empty** — no project-specific rule directives. Honor AGENTS.md (TB-only, phone-first, random deal, GSD workflow) and Phase 1 UI-SPEC visual language.

## Standard Stack

### Core (already installed — reuse)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React / react-dom | `^19.2.7` [VERIFIED: npm registry] | UI | Phase 1 baseline |
| Vite | `^8.1.1` [VERIFIED: npm registry] | Build | Phase 1 |
| TypeScript | `~6.0.2` [VERIFIED: npm registry] | Types | Phase 1 |
| Tailwind CSS + `@tailwindcss/vite` | `^4.3.2` [VERIFIED: npm registry] | Phone layout | Phase 1 UI-SPEC |
| `react-router-dom` | `^7.18.1` [VERIFIED: npm registry] | `/` `/setup` `/play` | Wizard state **not** in URL (D-18) |
| Zod | `^4.4.3` [VERIFIED: npm registry] | Session + bag schemas | Catalog already Zod-validated |
| Playwright | `^1.61.1` [VERIFIED: npm registry] | E2E wizard flows | Phase 1 D-05–D-08; D-21 |

### Core (install this phase)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `zustand` | `5.0.14` [VERIFIED: npm registry] [CITED: Context7 /pmndrs/zustand] | Setup session + wizard step | STACK persist pattern; no provider tree |
| `idb-keyval` | `6.3.0` [VERIFIED: npm registry] [CITED: Context7 /jakearchibald/idb-keyval] | Async IndexedDB for persist | Official Zustand persist example |

### Supporting (install this phase — bag unit tests)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `vitest` | `4.1.10` [VERIFIED: npm registry] [CITED: Context7 /vitest-dev/vitest] | Domain unit tests | Bag legality / Drunk / Baron (D-21) |

### Do not install this phase

| Library | Why |
|---------|-----|
| Dexie | No profile/history queries yet (D-07 profiles are form fields only) |
| Vaul / Sonner / lucide-react / shadcn | CONTEXT rejected add-player sheet; keep hand-rolled Tailwind |
| `nanoid` | Prefer `crypto.randomUUID()` for player ids — zero new dep [ASSUMED: available in target evergreen browsers used by Phase 1 PWA] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zustand + idb-keyval | `localStorage` only | STACK rejects for structured game JSON; refresh mid-wizard still OK but weaker offline survival |
| Vitest domain tests | Playwright-only bag checks | E2E cannot safely exhaust Baron×Drunk×N; D-21 allows focused unit tests |
| `nanoid` | `crypto.randomUUID()` | STACK lists nanoid; UUID is fine for local ids and avoids another package |

**Installation:**

```bash
npm install zustand@^5.0.14 idb-keyval@^6.3.0
npm install -D vitest@^4.1.10
```

**Version verification (2026-07-16):** `npm view` → zustand `5.0.14`, idb-keyval `6.3.0`, vitest `4.1.10`. No `postinstall` scripts on these packages [VERIFIED: npm registry].

## Package Legitimacy Audit

| Package | Registry | Age signal | Downloads (wk) | Source Repo | Verdict | Disposition |
|---------|----------|------------|----------------|-------------|---------|-------------|
| zustand | npm | 2026-05-28 | ~35M | github.com/pmndrs/zustand | OK | Approved |
| idb-keyval | npm | 2026-07-08 | ~6.6M | github.com/jakearchibald/idb-keyval | SUS (too-new) | Approved — official Jake Archibald repo; STACK + Context7; no checkpoint |
| vitest | npm | 2026-07-06 | ~73M | github.com/vitest-dev/vitest | SUS (too-new) | Approved — false-positive age heuristic; official docs |
| nanoid | npm | 2026-07-12 | ~177M | github.com/ai/nanoid | SUS (too-new) | **REMOVED from install list** — use `crypto.randomUUID()` instead |

**Packages removed due to [SLOP] verdict:** none  
**Packages flagged as suspicious [SUS]:** idb-keyval, vitest — age-heuristic only; **no `checkpoint:human-verify` required** (same treatment as Phase 1 Tailwind/Vite SUS).

## Architecture Patterns

### System Architecture Diagram

```
Storyteller phone
    │
    ▼
[/] ScriptHome ──Start setup──► [/setup] SetupWizard (PhoneShell)
                                    │
                    ┌───────────────┼───────────────────────────────┐
                    ▼               ▼                               ▼
              wizardStep      setupSessionStore              loadCatalog()
           (script…nightReady)  (Zustand + persist)         (Phase 1 Zod TB)
                    │               │                               │
                    │               ▼                               ▼
                    │         IndexedDB (idb-keyval)         roles + setupChart
                    │                                               │
                    ▼                                               ▼
         ┌─ script (TB locked)                                     │
         ├─ players (5–15, seating, optional profiles)             │
         ├─ difficulty (Easy|Standard|Hard)                        │
         ├─ bag  ◄── buildBag(playerCount, difficulty, catalog) ◄─┘
         │         validateBag → BagPlan { tokens, drunk, whyNote }
         ├─ deal (coaching card only)
         ├─ record ◄── assign/clear from remaining token pool
         │         validateAssignments → soft gate (warn + confirm)
         └─ nightReady (summary; stay on /setup)
                                    │
                                    ▼  (Phase 3)
                              [/play] coach (stub this phase)
```

### Recommended Project Structure

```
src/
├── domain/
│   ├── script/                 # existing loadCatalog + schemas
│   ├── bag/
│   │   ├── types.ts            # Difficulty, BagPlan, BuildBagInput
│   │   ├── buildBag.ts         # pure generator
│   │   ├── validateBag.ts      # legality
│   │   ├── heuristics.ts       # Easy/Standard/Hard role weights
│   │   └── buildBag.test.ts    # Vitest
│   └── grimoire/
│       ├── types.ts            # Player, Assignment, SetupSession
│       ├── validateAssignments.ts
│       └── validateAssignments.test.ts
├── state/
│   ├── setupSessionStore.ts    # Zustand + persist
│   └── idbStorage.ts           # createJSONStorage → idb-keyval
├── ui/
│   └── setup/
│       ├── SetupWizard.tsx     # step switch (replaces SetupStub)
│       ├── steps/
│       │   ├── ScriptStep.tsx
│       │   ├── PlayersStep.tsx
│       │   ├── DifficultyStep.tsx
│       │   ├── BagStep.tsx
│       │   ├── DealStep.tsx
│       │   ├── RecordStep.tsx
│       │   └── NightReadyStep.tsx
│       └── components/         # PlayerRow, RolePicker, ConfirmDialog
└── app/routes.tsx              # /setup → SetupWizard
```

### Pattern 1: Bag Builder Separated from Assignment

**What:** `buildBag` returns a multiset of **physical bag tokens** plus Drunk metadata; never `playerId → roleId`.  
**When to use:** Always (D-19).  
**Example:**

```typescript
// Source: project ARCHITECTURE.md + wiki Drunk/Baron rules
export type Difficulty = 'easy' | 'standard' | 'hard'

export type BagPlan = {
  tokens: string[] // length === playerCount; never includes 'drunk'
  composition: {
    townsfolk: number
    outsiders: number
    minions: number
    demons: number
  } // TRUE team counts after Baron (Drunk counts as outsider)
  drunk: { coverRoleId: string } | null
  setupNotes: string[] // e.g. "Baron: +2 Outsiders"
  whyNote: string // one short difficulty-tied sentence for UI (D-09)
}

export function buildBag(input: {
  playerCount: number
  difficulty: Difficulty
  catalog: LoadedCatalog
}): BagPlan { /* chart → pick → Baron → Drunk cover → validate */ }
```

### Pattern 2: Wizard Step Machine in Zustand (not URL)

**What:** `wizardStep` enum advances with Back/Next; route stays `/setup`.  
**When to use:** SETUP-05 / D-18.  
**Example:**

```typescript
type WizardStep =
  | 'script'
  | 'players'
  | 'difficulty'
  | 'bag'
  | 'deal'
  | 'record'
  | 'nightReady'
```

Clear bag + assignments when leaving `difficulty` backward or regenerating via Back→Next (D-10: no regenerate button).

### Pattern 3: Remaining-Token Pool Recording

**What:** `remainingTokens = multiset(bag.tokens) − assigned`; picker only offers remaining (D-13). Clear returns token (D-14). When assigning `drunk.coverRoleId`, set `trueRoleId: 'drunk'`, `believedRoleId: coverRoleId`.  
**When to use:** GRIM-01.

### Pattern 4: Soft Night Gate

**What:** Primary CTA “Start night” always tappable when on record step; if `validateAssignments` fails, show warning sheet listing issues, require explicit confirm (D-15). On success or confirm → `wizardStep = 'nightReady'`.  
**When to use:** GRIM-02 softened by D-15.

### Anti-Patterns to Avoid

- **Putting `drunk` in `BagPlan.tokens`:** Illegal physical bag; breaks D-13 pool. Use cover TF + `drunk` metadata.
- **Auto-assigning roles to named players:** Forbidden (D-19 / out of scope).
- **Hard-only disabled Start night:** Violates D-15.
- **Navigating to `/play` after start:** Violates D-17.
- **Profiles into `buildBag`:** Violates D-07.
- **Regenerate / manual bag edit UI:** Violates D-10 / D-11.
- **URL step ids (`/setup/players`):** Conflicts with shallow-route + Zustand decision unless planner re-litigates (do not).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Async IndexedDB key/value | Custom IDB wrapper | `idb-keyval` + Zustand `persist` | Official adapter; hydration edge cases already solved |
| Session state machine in React `useState` only | Prop-drilled step state | Zustand store | Survive refresh mid-wizard; Phase 3 will share session |
| Bag legality in UI components | Ad-hoc counts in JSX | `validateBag` / `validateAssignments` | Property-testable; PITFALLS #3 |
| Player ids | `Math.random()` strings | `crypto.randomUUID()` | Stable, collision-resistant |
| Confirm dialogs / drawers | Vaul/shadcn this phase | Small hand-rolled confirm (remove + soft gate) | CONTEXT rejected sheets; keep surface small |

**Key insight:** Illegal bags and Drunk mishandling destroy trust before any coach ships — keep bag/assign logic pure and tested.

## Common Pitfalls

### Pitfall 1: Drunk Token in the Bag
**What goes wrong:** Picker offers “Drunk”; players would draw an Outsider token.  
**Why it happens:** Treating Drunk like other outsiders.  
**How to avoid:** When Drunk is selected for the outsider slot, put a **Townsfolk cover** in `tokens` and set `drunk.coverRoleId`. [CITED: wiki.bloodontheclocktower.com/Drunk]  
**Warning signs:** `tokens.includes('drunk')` or UI lists Drunk under bag by team as a draw token.

### Pitfall 2: Baron Without +2 Outsiders
**What goes wrong:** Baron in bag but outsider count unchanged.  
**Why it happens:** Skipping setup mutation step.  
**How to avoid:** After selecting Baron, `outsiders += 2`, `townsfolk -= 2`, then pick extra outsiders / drop two TF. Validate post-mutation sums to N. [CITED: BOTC rulebook Setup step 7 / Baron ability text]  
**Warning signs:** 8-player Baron bag still shows 1 outsider token in true composition.

### Pitfall 3: Difficulty Creates Illegal Mixes
**What goes wrong:** “Hard” invents 2 Demons or skips Imp.  
**Why it happens:** Heuristics mutate counts instead of role *preferences*.  
**How to avoid:** Difficulty only weights **which legal roles** fill the chart slots; always run `validateBag` before returning.  
**Warning signs:** Property tests fail for any N∈[5,15] × difficulty.

### Pitfall 4: Async Persist Flash / Lost Wizard
**What goes wrong:** UI renders empty players before hydration; or stale bag after Back.  
**Why it happens:** Async IndexedDB hydrate.  
**How to avoid:** `persist` + `onFinishHydration` / `hasHydrated` gate; `partialize` session fields; bump `version` + migrate. [CITED: Context7 /pmndrs/zustand persisting-store-data]  
**Warning signs:** First paint shows script step then jumps; duplicate players after reload.

### Pitfall 5: Soft Gate Becomes Silent Bypass
**What goes wrong:** Start night ignores mismatches with no copy.  
**Why it happens:** Misreading D-15 as “always allow.”  
**How to avoid:** Always list concrete failures (“2 players unassigned”, “Empath assigned twice”) before confirm.  
**Warning signs:** Night ready reachable with empty assignments and no modal.

### Pitfall 6: Phase 1 Stub E2E Still Expects “Setup wizard comes in the next phase”
**What goes wrong:** CI red after replacing stub.  
**Why it happens:** `e2e/stubs.spec.ts` asserts stub copy.  
**How to avoid:** Wave 0 — rewrite stub setup test into wizard smoke; keep `/play` stub assertions.  
**Warning signs:** Playwright failure on heading “Setup” alone without wizard CTAs.

## Code Examples

### Zustand persist → idb-keyval

```typescript
// Source: https://github.com/pmndrs/zustand/blob/main/docs/reference/integrations/persisting-store-data.md
import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval'

const idbStorage: StateStorage = {
  getItem: async (name) => (await get<string>(name)) ?? null,
  setItem: async (name, value) => {
    await set(name, value)
  },
  removeItem: async (name) => {
    await del(name)
  },
}

export const useSetupSessionStore = create(
  persist(
    (set, get) => ({
      /* wizard fields + actions */
    }),
    {
      name: 'st-copilot-setup-session',
      version: 1,
      storage: createJSONStorage(() => idbStorage),
      partialize: (s) => ({
        /* omit ephemeral UI flags */
      }),
    },
  ),
)
```

### Bag pipeline (prescriptive algorithm)

```typescript
// Source: wiki Drunk + rulebook Setup; project PITFALLS.md
function buildBag({ playerCount, difficulty, catalog }: BuildBagInput): BagPlan {
  const base = catalog.setupChart.find((r) => r.playerCount === playerCount)!
  // 1) Pick demon (always Imp in TB), minions, outsiders, townsfolk using difficulty weights
  // 2) If baron in minions: townsfolkCount -= 2; outsiderCount += 2; re-pick those slots
  // 3) If drunk in outsiders: remove 'drunk' from tokens; pick coverRoleId from unused townsfolk;
  //    tokens.push(coverRoleId); drunk = { coverRoleId }
  // 4) validateBag → throw/retry if illegal
  // 5) whyNote from difficulty template
}
```

### Assignment validation (soft gate input)

```typescript
type AssignmentIssue =
  | { code: 'unassigned'; playerId: string }
  | { code: 'token_mismatch'; detail: string }
  | { code: 'duplicate_token'; roleId: string }

function validateAssignments(session: {
  players: { id: string }[]
  bag: BagPlan
  assignments: Record<string, { bagRoleId: string }> // physical token id assigned
}): AssignmentIssue[] {
  // Multiset(assignments.bagRoleId) must equal Multiset(bag.tokens)
  // Every player assigned exactly once for a clean pass
}
```

### Recommended difficulty heuristics (Claude discretion — lock in plan)

No official Easy/Standard/Hard dial exists; labels are product UX. Map to Almanac / TPI spirit [CITED: BOTC rulebook CHOOSING CHARACTERS; bakery TPI Storyteller Advice]:

| Level | Preference (among legal bags) | Avoid / down-weight |
|-------|-------------------------------|---------------------|
| **Easy** | Scarlet Woman; info-heavy TF (Washerwoman, Librarian, Chef, Empath, Fortune Teller, Undertaker, Monk/Virgin); Recluse; optional Drunk with info cover (Almanac first-game / Ben Burns) | Baron, Poisoner, Spy, Saint, Slayer as first picks |
| **Standard** | Near-uniform random among legal fills; mild bias to ≥2 first-night info roles | None beyond legality |
| **Hard** | Baron; Poisoner and/or Spy; Saint/Drunk outsiders; Slayer/Mayor logic | Over-sanitized SW-only evil |

**Seed templates (8 players — scale by adding/removing TF/Out per chart):**
- Easy Almanac-like: Chef, Empath, Fortune Teller, Undertaker, Virgin, Drunk(cover Investigator), Scarlet Woman, Imp  
- Hard Almanac-like: Washerwoman, Fortune Teller, Undertaker, Slayer, Virgin, Recluse, Spy, Imp  

Always mutate via Baron/Drunk rules after selection; never ship a template that fails `validateBag`.

### Night ready handoff (discretion recommendation)

Use a **pure summary** on `/setup`: roster count, difficulty, bag composition counts, “Assignments recorded”, short line that night coaching arrives next. **Do not** link to `/play` yet (avoids stub confusion). Phase 3 adds the Continue CTA.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Paper setup sheet + Almanac recipes | Digital bag builder + ST record | This product | New STs get legal bags without memorizing modifiers |
| townsquare digital deal to seats | Physical random deal + record | PROJECT / D-19 | Keeps table authenticity |
| Hard block start | Soft confirm-to-override (D-15) | Phase 2 discuss | Matches table reality (fix typos under time pressure) |
| Phase 1 Playwright-only | Playwright + Vitest bag domain | Phase 2 (D-21) | Exhaustive legality without slow E2E matrix |

**Deprecated/outdated:**
- Treating SETUP-04 “optional profiles” as bag inputs — **overridden by D-07 for v1**.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `crypto.randomUUID()` is available in all target browsers for this PWA | Standard Stack | Need nanoid fallback install |
| A2 | Easy/Hard role weights above match user taste (no official dial) | Difficulty heuristics | User may want different “Hard” (e.g. always Baron) — adjustable in plan without schema change |
| A3 | Recording physical bag tokens + auto Drunk mark on cover assign is enough for Phase 2 grimoire (bluffs/reminders Phase 3) | GRIM-01 | Phase 3 may need richer assignment shape — keep `trueRoleId` / `believedRoleId` fields now |
| A4 | Mid-wizard IndexedDB persist is desired from first wizard commit (not localStorage interim) | Persistence | Slightly more Wave 0 work; STACK-aligned |

## Open Questions (RESOLVED)

1. **Should bag generation be deterministic-seeded for tests only?**
   - What we know: UI has no regenerate; production can use `Math.random` / `crypto.getRandomValues`.
   - What's unclear: Whether to inject `rng` for golden tests.
   - Recommendation: `buildBag(..., rng = defaultRng)` for Vitest; production uses crypto.
   - RESOLVED: Inject optional `rng` into `buildBag` for Vitest determinism; production default uses `crypto.getRandomValues`-backed picker (plans 02-03).

2. **Script step UX when TB is the only script**
   - What we know: SETUP-05 includes script step; home already selected TB.
   - Recommendation: One-screen confirm “Trouble Brewing” + Continue (no multi-script picker).
   - RESOLVED: Single TB confirm card + Continue setup / Back to home (D-18/D-20; UI-SPEC Script step; plan 02-02). No multi-script picker.

3. **Exact copy for whyNote / soft-gate**
   - Discretion: table-lantern voice from 01-UI-SPEC; finalize in UI-SPEC / plan copy table.
   - RESOLVED: Copy ownership is `02-UI-SPEC.md` (whyNote Easy/Standard/Hard lines + soft-gate issue templates). Plans cite UI-SPEC strings; do not invent alternate copy in domain modules.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Nix flake (`flake.nix`) | All repo tooling | ✓ | project flake | — |
| Node.js (via nix develop) | npm scripts / Vitest / Playwright | ✓ | pinned in flake | — |
| npm (via nix develop) | installs | ✓ | pinned in flake | — |
| Playwright preview E2E | SETUP/GRIM flows | ✓ | @playwright/test in package.json | — |
| IndexedDB (browser) | persist | ✓ (Chromium E2E) | — | In-memory mock only for unit tests of domain (not store) |

**Missing dependencies with no fallback:** none  

**Missing dependencies with fallback:** none  

Step 2.6: External tools run through the project Nix flake. Prefix every tooling command with `CURSOR_DEV=true nix develop -c …` per `.cursor/rules/nix.mdc` / `AGENTS.md`. Git commands do not need the Nix prefix.

## Validation Architecture

> `workflow.nyquist_validation` is **true** in `.planning/config.json`.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright `^1.61.1` (E2E) + Vitest `^4.1.10` (domain, Wave 0 install) |
| Config file | `playwright.config.ts` (exists); `vitest.config.ts` or `vite.config.ts` `test` key — **Wave 0** |
| Quick run command | `npx vitest run src/domain/bag src/domain/grimoire` |
| Full suite command | `npm test` (Playwright) && `npm run test:unit` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SETUP-01 | Unique names + seating 5–15 gate | E2E | `npx playwright test e2e/setup-wizard.spec.ts` | ❌ Wave 0 |
| SETUP-02 | Difficulty default Standard; can set Easy/Hard | E2E | same | ❌ Wave 0 |
| SETUP-03 | More → experience/age/notes persist in session | E2E | same | ❌ Wave 0 |
| SETUP-04 | Legal bag for N×difficulty; Baron/Drunk rules | unit | `npx vitest run src/domain/bag` | ❌ Wave 0 |
| SETUP-05 | Step order enforced (no skip ahead) | E2E | `e2e/setup-wizard.spec.ts` | ❌ Wave 0 |
| GRIM-01 | Tap player → pick remaining token; clear restores | E2E | `e2e/setup-record.spec.ts` | ❌ Wave 0 |
| GRIM-02 | Mismatch shows warning; confirm reaches Night ready | E2E | `e2e/setup-record.spec.ts` | ❌ Wave 0 |
| — | `/setup` stub copy removed | E2E | update `e2e/stubs.spec.ts` | ✅ exists (must change) |

### Sampling Rate

- **Per task commit:** `npx vitest run src/domain/bag src/domain/grimoire` (when touching domain) or targeted Playwright file
- **Per wave merge:** `npm run test:unit && npm test`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] Install `zustand`, `idb-keyval`, `vitest`; add `test:unit` script
- [ ] `vitest.config.ts` (or vite `test` block) with `environment: 'node'`, include `src/**/*.test.ts`
- [ ] `src/domain/bag/buildBag.test.ts` — N=5..15 × 3 difficulties; Baron±Drunk fixtures; never `tokens.includes('drunk')`
- [ ] `src/domain/grimoire/validateAssignments.test.ts` — match / missing / duplicate
- [ ] `e2e/setup-wizard.spec.ts` — happy path to bag review
- [ ] `e2e/setup-record.spec.ts` — assign all + soft gate
- [ ] Update `e2e/stubs.spec.ts` — `/setup` no longer stub; keep `/play` stub

## Security Domain

> `security_enforcement` enabled (ASVS level 1).

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No accounts (PLAT-02) |
| V3 Session Management | partial | Local IndexedDB session only; no server session |
| V4 Access Control | no | Single-device ST tool |
| V5 Input Validation | yes | Zod on rehydrate + player name/profile fields; length limits on notes |
| V6 Cryptography | no | No secrets; `crypto.randomUUID` for ids only |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Persisted session prototype pollution / invalid JSON | Tampering | Zod parse on rehydrate; drop corrupt session to empty wizard |
| XSS via player names / notes | Tampering | React text escaping; no `dangerouslySetInnerHTML` |
| Shoulder-surf bag list | Information Disclosure | Bag step is ST-private (expected); no “show players” mode this phase |
| Dependency postinstall malware | Tampering | Legitimacy gate + no postinstall on chosen packages |

## Sources

### Primary (HIGH confidence)
- [CITED: wiki.bloodontheclocktower.com/Drunk] — Drunk token never in bag; Townsfolk cover; IS THE DRUNK
- [CITED: BOTC rulebook Setup / CHOOSING CHARACTERS] — Baron `[+2 Outsiders]`; Almanac 8p recommended setups
- [CITED: Context7 /pmndrs/zustand] — persist + idb-keyval `StateStorage` adapter
- [CITED: Context7 /jakearchibald/idb-keyval] — `get`/`set`/`del`
- [VERIFIED: npm registry] — zustand 5.0.14, idb-keyval 6.3.0, vitest 4.1.10
- Phase 1 code: `loadCatalog.ts`, `setup-chart.json`, `SetupStub.tsx`, `routes.tsx`, `e2e/*`
- `.planning/research/{STACK,ARCHITECTURE,PITFALLS,SUMMARY}.md`
- `02-CONTEXT.md` decisions D-01–D-21

### Secondary (MEDIUM confidence)
- [CITED: bakery TPI Storyteller Advice] — Ben Burns / TPI recommended beginner bags
- [CITED: Context7 /vitest-dev/vitest] — Vite-native unit config
- Zatu / community ST guides — difficulty as misinfo + SW safety (heuristic color only)

### Tertiary (LOW confidence)
- Exact Almanac page scans behind paywall PDFs — recipes transcribed from secondary extracts; validate any disputed character list against physical Almanac if available

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — registry + Context7 + STACK alignment
- Architecture: HIGH — matches prior research + locked wizard order
- Bag legality (Baron/Drunk): HIGH — official wiki/rulebook
- Difficulty heuristics: MEDIUM — product mapping of Almanac/TPI advice; no official Easy/Hard dial
- Pitfalls: HIGH — PITFALLS.md + wiki cross-check

**Research date:** 2026-07-16  
**Valid until:** 2026-08-16 (stack stable; revisit if TB setup sheet errata appears)
