# Phase 3: Night Coach & Live Grimoire - Research

**Researched:** 2026-07-16
**Domain:** Next-beat night coach + live grimoire (Trouble Brewing, phone-first PWA)
**Confidence:** HIGH (architecture + existing code seams); MEDIUM (official gating nuances for conditional other-night wakes)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Coach beat layout
- **D-01:** **Full-screen next-beat** is the play landing — current step, short prompt, and Next dominate. Grimoire is secondary (“one tap away”), not a permanent split with a player strip.
- **D-02:** **Expand detail** uses the lightest one-thumb pattern — prefer **inline expand** on the beat card; introduce a sheet only if content length forces it. Do not add Vaul solely for this.
- **D-03:** Primary **Next** lives in a **sticky thumb footer** (same pattern as Phase 2 wizard sticky CTAs).
- **D-04:** Grimoire access is **secondary chrome** (e.g. header text link) that must not compete with Next’s accent weight.

#### Night flow & transitions
- **D-05:** Night ready gains a primary **Start first night** CTA → navigate to `/play` and begin the First Night beat queue immediately (clearest one-tap table path).
- **D-06:** **No day-phase UI** in this phase. Between nights use a **minimal bridge** (“Night complete” → **Start other night**). Do not fake nominations/votes.
- **D-07:** Beat queue is **filtered to in-play roles** (by true role / grimoire truth) **plus required procedural beats** from `procedural-beats.json` (Dusk, Minion Info when applicable, Demon Info when applicable, Dawn). Do not show the full TB sheet with empty “not in play” slots.
- **D-08:** Prefer a queue that rarely needs Skip. Allow a light **Back one beat** if cheap to implement; Skip unused wakes is not a primary feature when filtering is correct.

#### Demon info & bluffs
- **D-09:** **Rules-accurate gating** — omit Minion Info / Demon Info when those steps do not apply (e.g. no Minions / no Demon in play); do not always show placeholder “not needed” beats.
- **D-10:** Record Demon bluffs **on the Demon Info beat** (so first-night coaching stays complete); bluffs remain **editable later** on the grimoire.
- **D-11:** Bluff pool = **exactly three characters** that are **not in play** and are **Townsfolk or Outsiders only** (classic TB Demon bluffs — never Minion/Demon, never seated roles).
- **D-12:** Leaving Demon Info with fewer than three bluffs uses a **soft confirm** (warn + allow continue) — matches Phase 2 soft Start night gate, not a hard-only block.

#### Live grimoire controls
- **D-13:** Live grimoire is a **dedicated panel/screen** opened from coach secondary chrome (space for tokens); Back returns to the current beat. Prefer this over a thin overlay if reminder UI needs room.
- **D-14:** **Alive/dead** via a simple per-player **Dead / Alive toggle** on the grimoire list.
- **D-15:** Reminder tokens: **tap player → place/clear** from relevant reminder lists (role reminders + clear existing). Global “token tray then tap player” is not required for v1.
- **D-16:** Grimoire always shows **ST-private truth** (e.g. Drunk true role + “believes {cover}”). Do not hide true role behind an expand by default.

#### Carried forward (ratified — not re-litigated)
- **D-17:** Phase 2 Night ready handoff is the entry; Phase 3 owns `/play` coach (Phase 2 D-17).
- **D-18:** Soft incomplete recording may still reach Night ready (Phase 2 D-15) — coach/engine must tolerate partial grimoires safely (research: wake list from what’s recorded; don’t invent players).
- **D-19:** Follow Phase 1/2 visual language (`01-UI-SPEC.md`, `02-UI-SPEC.md`) — table-lantern shell, Fraunces + Source Sans 3, 44px targets, sticky primary CTAs.
- **D-20:** Prefer Playwright E2E with real TB data for shipped coach/grimoire flows; domain unit tests for beat-queue derivation are Claude discretion when E2E alone is unsafe.

### Claude's Discretion
- Exact short/detail coach copy templates and paraphrase boundaries (IP-safe; no scraped Almanac dumps).
- Whether Back is shipped in v1 or deferred if it complicates beat-cursor persistence.
- Exact Minion Info player-count / in-play gating details within official TB rules — research must validate.
- Whether “Start other night” bridge is a distinct route state vs end-of-queue beat mutation.
- Persist schema extension for play cursor, dead flags, reminders, bluffs (extend Zustand + idb-keyval session).
- Whether grimoire is `/play` nested view vs query/hash secondary surface — keep shallow RR; coach cursor in store not URL.

### Deferred Ideas (OUT OF SCOPE)
- Full **day phase** (nominations, votes, executions, action log) — DAY-01/DAY-02; v2
- Town square / shared player view — out of product scope
- Global physical-style token tray UX — not required for v1 phone path
- Install coaching, multi-script, travelers — prior deferrals
- Profile→bag influence, bag regenerate — Phase 2 v2 deferrals
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| COACH-01 | App derives First Night and Other Nights wake order from roles currently in play | Pure `buildNightBeats()` from catalog ordinals + assignments; Drunk via `believedRoleId`; filter dead on Other Nights |
| COACH-02 | Next-beat screen shows current step, short prompt, primary Next | Replace `PlayStub`; sticky footer Next; `PromptComposer` short copy |
| COACH-03 | Tap to expand ability/procedure detail | Inline expand on beat card (D-02); detail from coach-copy + catalog reminders |
| COACH-04 | First-night Demon/Minion info when those roles apply | Gate: first night ∧ playerCount ≥ 7 ∧ relevant team in play; bluff picker on Demon Info |
| GRIM-03 | Mark alive/dead; place/clear TB reminder tokens | Live grimoire panel; per-player Dead/Alive; tap player → place/clear from `role.reminders` |
| GRIM-04 | Record Demon bluffs | Demon Info beat + grimoire edit; pool = 3 good not-in-play; soft confirm if <3 |
</phase_requirements>

## Summary

Phase 3 is the playable vertical slice: Night ready → `/play` next-beat coach for First Night and Other Nights, with a secondary live grimoire for deaths, reminder tokens, and Demon bluffs. Phase 2 already delivers catalog night ordinals, procedural beat stubs, Drunk true/believed assignments, Zustand+IndexedDB session persistence, sticky footers, and `ConfirmDialog`. No new npm packages are required.

The critical correctness seam is a pure night-order engine that **re-derives** the beat queue from grimoire truth (not a frozen sheet). Official rules gate Minion/Demon Info on **first night + ≥7 players**; omit those steps below 7 even when an Imp/Minion exists. Drunk wakes on the **believed Townsfolk** step. Dead players do not wake. Coach copy must be paraphrased ST coaching (IP-safe), not Almanac dumps.

**Primary recommendation:** Extend `useSetupSessionStore` with play fields (cursor, surface, dead, reminders, bluffs, night kind); add `src/domain/engine/` + `src/domain/coach/`; replace `PlayStub` with full-screen coach + dedicated grimoire surface; wire Night ready **Start first night** → `/play`.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Beat-queue derivation (COACH-01) | Browser / Client (domain module) | — | Pure function over catalog + grimoire; no server |
| Next-beat coach UI (COACH-02/03) | Browser / Client | — | Phone SPA presentation |
| Minion/Demon Info gating + bluffs (COACH-04 / GRIM-04) | Browser / Client (domain + UI) | — | Rules in engine; picker on Demon Info beat |
| Alive/dead + reminder tokens (GRIM-03) | Browser / Client (session store) | — | ST-private mutations; re-derive wakes |
| Session persistence / mid-night resume | Browser / Client (IndexedDB) | — | Zustand persist + idb-keyval already wired |
| Static TB catalog / coach-copy data | CDN / Static | Browser | Bundled JSON; SW-cached with PWA |
| Auth / multiplayer sync | — | — | Out of scope (offline single-device) |

## Project Constraints (from .cursor/rules/)

| Directive | Implication for Phase 3 |
|-----------|-------------------------|
| All tooling via `CURSOR_DEV=true nix develop -c …` | Plans/tests/builds must use Nix prefix; git does not |
| Do not run bare `npm`/`node`/`npx` outside nix develop | Executor tasks must document Nix-wrapped commands |
| GSD workflow enforcement (AGENTS.md) | Planning artifacts stay in sync; no ad-hoc scope expansion |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^19.2.7 (installed) | Coach + grimoire UI | Existing app shell |
| TypeScript | ~6.0.2 | Domain types for beats/grimoire | Existing |
| Vite | ^8.1.1 | Dev/build | Existing |
| Zustand | 5.0.14 [VERIFIED: npm registry] | Session + play cursor | Already persist+idb; extend schema |
| idb-keyval | 6.3.0 [VERIFIED: npm registry] | IndexedDB for persist | Existing Phase 2 storage |
| Zod | 4.4.3 [VERIFIED: npm registry] | Persist + bluff validation | Existing merge validation |
| react-router-dom | 7.18.1 [VERIFIED: npm registry] | Shallow `/play` only | Keep cursor in Zustand (D discretion) |
| Tailwind CSS | ^4.3.2 | Phone-first coach layout | Existing table-lantern tokens |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | 4.1.10 [VERIFIED: npm registry] | Domain unit tests for beat queue | Wave 0 / every engine change |
| @playwright/test | 1.61.1 [VERIFIED: npm registry] | E2E coach + grimoire flows | Shipped UX (D-20) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zustand `playSurface` flag | Nested `/play/grimoire` route | RR can do pathless layouts [CITED: reactrouter docs], but conflicts with shallow-route convention and puts beat cursor pressure on URL |
| Inline expand | Vaul bottom sheet | CONTEXT forbids adding Vaul solely for detail (D-02) |
| New play store | Separate Zustand store | Split brain with setup assignments; prefer one session document |
| Frozen night list at Start | Re-derive each render | ARCHITECTURE anti-pattern; deaths/star-pass stale the list |

**Installation:**

```bash
# No new packages for Phase 3 — reuse existing deps
CURSOR_DEV=true nix develop -c npm run test:unit
CURSOR_DEV=true nix develop -c npm run test:e2e
```

**Version verification (2026-07-16):** `zustand@5.0.14`, `idb-keyval@6.3.0`, `zod@4.4.3`, `react-router-dom@7.18.1`, `vitest@4.1.10`, `@playwright/test@1.61.1` via `npm view` inside Nix flake. [VERIFIED: npm registry]

## Package Legitimacy Audit

> Phase 3 installs **no new external packages**. Audit covers reuse of already-installed stack.

| Package | Registry | Age / signals | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|---------------|-----------|-------------|---------|-------------|
| zustand | npm | established | ~35M/wk | pmndrs/zustand | OK | Approved — reuse |
| idb-keyval | npm | seam flagged too-new | ~6.6M/wk | jakearchibald/idb-keyval | SUS (too-new) | Approved — already in STACK + Phase 2; official Jake Archibald; no postinstall |
| zod | npm | established | ~210M/wk | colinhacks/zod | OK | Approved — reuse |
| react-router-dom | npm | seam flagged too-new | ~42M/wk | remix-run/react-router | SUS (too-new) | Approved — already installed; STACK-prescribed |
| vitest | npm | seam flagged too-new | ~73M/wk | vitest-dev/vitest | SUS (too-new) | Approved — already used for bag/grimoire tests |
| @playwright/test | npm | seam flagged too-new | ~42M/wk | microsoft/playwright | SUS (too-new) | Approved — Phase 1/2 E2E baseline |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** idb-keyval, react-router-dom, vitest, @playwright/test — all already in-tree with massive download counts; seam “too-new” is a publish-date heuristic, not a legitimacy block. **Do not add install checkpoints**; do not introduce new packages.

## Architecture Patterns

### System Architecture Diagram

```
NightReadyStep ──[Start first night]──► navigate('/play')
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Play surface (Zustand playSurface)                             │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐ │
│  │ COACH (default landing)      │  │ GRIMOIRE (secondary)     │ │
│  │ beat title · short · expand  │◄─┤ alive/dead · reminders   │ │
│  │ sticky Next / optional Back  │  │ bluffs edit · ST truth   │ │
│  └──────────────┬───────────────┘  └────────────▲─────────────┘ │
│                 │ mutations                     │               │
│                 ▼                               │               │
│  SessionStore: assignments · dead · reminders · bluffs ·        │
│                nightKind · beatIndex · playSurface              │
└─────────────────────────────────────────────────────────────────┘
                 │ read-only snapshot
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  domain/engine/buildNightBeats(nightKind, session, catalog)     │
│    procedural (dusk / minion-info? / demon-info? / dawn)        │
│    + role wakes sorted by firstNight|otherNight                 │
│    Drunk → believedRoleId · dead → omit on other nights         │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  domain/coach/composePrompt(beat, ctx) → { short, detail }      │
│  data: coach-copy.json (paraphrased) + role *Reminder strings   │
└─────────────────────────────────────────────────────────────────┘
         End of queue → NIGHT BRIDGE ("Night complete" → Start other night)
```

### Recommended Project Structure

```
src/
├── data/scripts/trouble-brewing/
│   ├── roles.json                 # existing night ordinals + reminders
│   ├── procedural-beats.json      # dusk / minion-info / demon-info / dawn
│   └── coach-copy.json            # NEW: short + detail per beat id (IP-safe)
├── domain/
│   ├── engine/                    # NEW: buildNightBeats, gating helpers
│   │   ├── buildNightBeats.ts
│   │   ├── buildNightBeats.test.ts
│   │   └── types.ts
│   ├── coach/                     # NEW: PromptComposer
│   │   ├── composePrompt.ts
│   │   └── composePrompt.test.ts
│   ├── grimoire/                  # extend: ReminderPlacement, PlayerLife
│   └── script/                    # existing loadCatalog / schemas
├── state/
│   └── setupSessionStore.ts       # extend persist schema v2 + play actions
└── ui/
    ├── play/
    │   ├── PlayScreen.tsx         # replaces PlayStub
    │   ├── CoachBeatView.tsx
    │   ├── NightBridgeView.tsx
    │   └── LiveGrimoireView.tsx
    └── setup/steps/NightReadyStep.tsx  # Start first night CTA
```

### Pattern 1: Persist source, re-derive queue

**What:** Store `nightKind`, `beatIndex`, deaths, reminders, bluffs — never a frozen `Beat[]`.
**When to use:** Always for night coach. [CITED: .planning/research/ARCHITECTURE.md]
**Example:**

```typescript
// Source: project ARCHITECTURE.md + Phase 2 store pattern
function currentBeat(state: Session, catalog: Catalog): Beat | 'night-complete' {
  const queue = buildNightBeats(state.nightKind, state, catalog)
  if (state.beatIndex >= queue.length) return 'night-complete'
  return queue[state.beatIndex]
}
```

### Pattern 2: Official Minion/Demon Info gating

**What:** Include `minion-info` / `demon-info` only when all apply:
1. `nightKind === 'first'`
2. `players.length >= 7` [CITED: BotC rulebook — night sheet setup]
3. At least one in-play Minion (for Minion Info) / Demon (for Demon Info) among **recorded** assignments (D-09 + D-18)

**When to use:** First-night queue build. Teensyville/Toymaker exceptions are out of scope.

### Pattern 3: Drunk wakes as believed Townsfolk

**What:** For wake filtering, resolve wake role as `assignment.believedRoleId ?? assignment.trueRoleId ?? assignment.bagRoleId`. Never emit a `drunk` wake step (`firstNight`/`otherNight` are 0 on Drunk). [CITED: wiki.bloodontheclocktower.com/Drunk]

### Pattern 4: Play surface in Zustand, not URL

**What:** `playSurface: 'coach' | 'grimoire' | 'bridge'` on the session store; route stays `/play`.
**When to use:** Grimoire open/close and night-complete bridge (Claude discretion — recommend store flag).

### Anti-Patterns to Avoid

- **Dashboard grimoire as landing:** Conflicts with D-01 / PRODUCT north star.
- **Always show full night sheet with empty slots:** Conflicts with D-07.
- **Hard-block Next without three bluffs:** Use soft confirm (D-12), matching Phase 2.
- **Install Vaul “just in case”:** Forbidden by D-02.
- **Scrape Almanac into coach-copy:** IP pitfall — paraphrase ST coaching only. [CITED: PITFALLS.md]
- **Auto-resolve false Empath/Poison info:** Out of scope (ASSIST-*); coach suggests procedure, ST judges.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Persist mid-night resume | Custom IndexedDB wrapper | Zustand `persist` + existing `idbStorage` | Already proven in Phase 2; `version`/`migrate` documented [CITED: zustand persist docs] |
| Soft confirm dialogs | New modal system | Reuse `ConfirmDialog` | Bluff incomplete + any bridge confirms |
| Sticky primary CTA | Ad-hoc fixed button | Phase 2 sticky footer pattern (`BagStep`/`RecordStep`) | Visual contract D-19 |
| Night ordinal data | Hard-coded wake arrays in UI | `roles.json` `firstNight`/`otherNight` + `procedural-beats.json` | Catalog is source of truth |
| Reminder token names | Free-text notes only | `role.reminders[]` from catalog | TB tokens already curated |
| Schema validation on hydrate | Trust JSON.parse | Zod `PersistedSetupSessionSchema` + semantics assert | Phase 2 integrity path |

**Key insight:** The hard problem is **rules-correct beat derivation + partial-grimoire safety**, not UI chrome. Invest Vitest golden tests there; keep UI thin over the engine.

## Common Pitfalls

### Pitfall 1: Wrong Minion/Demon Info gating
**What goes wrong:** Always showing info steps, or gating only on “minion in play” while still showing them at 5–6 players.
**Why it happens:** Confusing “roles exist” with official night-sheet tokens (7+ only).
**How to avoid:** Implement `playerCount >= 7` ∧ team-in-play ∧ first night. Update `procedural-beats.json` notes to match.
**Warning signs:** 5-player E2E still shows Minion Info.

### Pitfall 2: Drunk wake as Drunk / missing believed wake
**What goes wrong:** No Empath (etc.) step when Drunk believes Empath; or a useless Drunk step.
**Why it happens:** Sorting by `trueRoleId === 'drunk'`.
**How to avoid:** Wake key = believed role; grimoire still shows true Drunk + cover (D-16).
**Warning signs:** Golden test with Drunk→Washerwoman fails first-night order.

### Pitfall 3: Dead players still in Other Night queue
**What goes wrong:** Coach wakes Imp/Empath after death.
**Why it happens:** Filtering only “in play,” not alive.
**How to avoid:** Other Nights: `alive && otherNight > 0` (plus Ravenkeeper exception — see Open Questions). First Night: all recorded living players (none dead yet typically).
**Warning signs:** After marking dead, Next still lands on that role.

### Pitfall 4: Frozen beat list after death mid-night
**What goes wrong:** Cursor points past end or at wrong role after toggle.
**Why it happens:** Snapshotting `Beat[]` into state.
**How to avoid:** Re-derive; clamp `beatIndex` when queue shrinks; prefer advancing by beat **id** if implementing Back.
**Warning signs:** Crash or blank beat after Dead toggle.

### Pitfall 5: Bluff pool includes seated or evil roles
**What goes wrong:** Demon offered Baron/Imp or an in-bag Townsfolk.
**Why it happens:** Filtering bag leftovers incorrectly (Drunk cover vs true set).
**How to avoid:** In-play set = recorded `trueRoleId` values plus bag covers that represent seated tokens; eligible = catalog roles with `team ∈ {townsfolk,outsider}` that are not in that set. Cap select exactly 3; soft confirm if fewer.
**Warning signs:** Bluff picker lists Poisoner.

### Pitfall 6: `/play` stub E2E left green while coach ships
**What goes wrong:** `e2e/stubs.spec.ts` still expects “Play” heading + no Start CTA from Night ready.
**Why it happens:** Phase 2 explicitly asserted no `/play` link from Night ready.
**How to avoid:** Rewrite stub test + extend `setup-record` / new `e2e/play-coach.spec.ts` in Wave 0 RED.

### Pitfall 7: IP / over-automation
**What goes wrong:** Copied Almanac text or “correct Empath answer is 1.”
**How to avoid:** Paraphrased coach-copy; procedure checklists; ST judgment language. [CITED: PITFALLS.md]

## Code Examples

### Beat queue builder (prescriptive shape)

```typescript
// Source: ARCHITECTURE.md Pattern 1, adapted to Phase 2 Assignment model
export type NightKind = 'first' | 'other'

export type Beat =
  | { kind: 'procedure'; id: 'dusk' | 'minion-info' | 'demon-info' | 'dawn'; label: string }
  | { kind: 'wake'; id: string; roleId: string; playerId: string; label: string }

export function buildNightBeats(
  nightKind: NightKind,
  input: {
    players: { id: string; name: string }[]
    assignments: Record<string, Assignment>
    deadPlayerIds: Set<string>
    diedTonightIds?: Set<string> // for Ravenkeeper gating
  },
  catalog: LoadedCatalog,
): Beat[] {
  const roleById = new Map(catalog.roles.map((r) => [r.id, r]))
  const playerCount = input.players.length
  const recorded = Object.values(input.assignments)

  const hasMinion = recorded.some((a) => roleById.get(wakeRoleId(a))?.team === 'minion'
    || roleById.get(a.trueRoleId ?? a.bagRoleId)?.team === 'minion')
  const hasDemon = recorded.some((a) => roleById.get(a.trueRoleId ?? a.bagRoleId)?.team === 'demon')

  const beats: Beat[] = [{ kind: 'procedure', id: 'dusk', label: 'Dusk' }]

  if (nightKind === 'first' && playerCount >= 7) {
    if (hasMinion) beats.push({ kind: 'procedure', id: 'minion-info', label: 'Minion Info' })
    if (hasDemon) beats.push({ kind: 'procedure', id: 'demon-info', label: 'Demon Info' })
  }

  const ordinal = nightKind === 'first' ? 'firstNight' : 'otherNight'
  const wakes = recorded
    .map((a) => {
      const roleId = wakeRoleId(a) // believed for Drunk
      const role = roleById.get(roleId)
      if (!role || role[ordinal] <= 0) return null
      if (nightKind === 'other' && input.deadPlayerIds.has(a.playerId)) {
        // Ravenkeeper: include only if diedTonight — see Open Questions
        if (roleId !== 'ravenkeeper' || !input.diedTonightIds?.has(a.playerId)) return null
      }
      return { a, role }
    })
    .filter(Boolean)
    .sort((x, y) => x!.role[ordinal] - y!.role[ordinal])

  for (const item of wakes) {
    beats.push({
      kind: 'wake',
      id: `wake:${item!.a.playerId}:${item!.role.id}`,
      roleId: item!.role.id,
      playerId: item!.a.playerId,
      label: item!.role.name,
    })
  }

  beats.push({ kind: 'procedure', id: 'dawn', label: 'Dawn' })
  return beats
}

function wakeRoleId(a: Assignment): string {
  return a.believedRoleId ?? a.trueRoleId ?? a.bagRoleId
}
```

### Persist schema bump (Zustand)

```typescript
// Source: https://github.com/pmndrs/zustand/blob/main/docs/reference/integrations/persisting-store-data.md
{
  name: SETUP_SESSION_STORAGE_KEY,
  version: 2, // was 1 in Phase 2
  migrate: (persistedState, version) => {
    if (version < 2) {
      return {
        ...persistedState,
        nightKind: 'first',
        beatIndex: 0,
        playSurface: 'coach',
        deadPlayerIds: [],
        reminders: {}, // playerId → string[]
        demonBluffs: [],
        diedTonightIds: [],
        playStarted: false,
      }
    }
    return persistedState
  },
  storage: createJSONStorage(() => idbStorage),
  // keep Zod merge validation for v2 shape
}
```

### Night ready → play handoff

```tsx
// NightReadyStep — add primary sticky CTA (D-05)
<button
  type="button"
  className="min-h-11 w-full rounded-sm bg-[var(--color-accent)] ..."
  onClick={() => {
    startFirstNight() // sets nightKind/first, beatIndex 0, playStarted
    navigate('/play')
  }}
>
  Start first night
</button>
```

### Bluff eligibility

```typescript
export function eligibleBluffRoleIds(
  assignments: Record<string, Assignment>,
  catalog: LoadedCatalog,
): string[] {
  const inPlay = new Set<string>()
  for (const a of Object.values(assignments)) {
    inPlay.add(a.trueRoleId ?? a.bagRoleId)
    inPlay.add(a.bagRoleId)
  }
  return catalog.roles
    .filter((r) => (r.team === 'townsfolk' || r.team === 'outsider') && !inPlay.has(r.id))
    .map((r) => r.id)
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Paper night sheet | Derive filtered beat queue + next-beat UI | Product Phase 3 | Core value delivery |
| Dense grimoire home (townsquare) | Coach landing; grimoire one tap away | PROJECT decision | New-ST UX |
| Snapshot night list | Re-derive from grimoire | ARCHITECTURE | Survives deaths mid-night |
| Hard Start gate only | Soft confirm pattern | Phase 2 D-15 | Extend to bluffs (D-12) |

**Deprecated/outdated:**
- Treating `/play` stub copy as final — replace entirely.
- Phase 2 E2E assertion “no play affordance from Night ready” — invert in Phase 3.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Ravenkeeper Other Night should appear only when that player died tonight (not every other night while dead) | Pitfalls / Open Questions | Incorrect wake spam or missed Ravenkeeper |
| A2 | Scarlet Woman stays in Other Night queue whenever alive (coach detail explains conditional ability) | Open Questions | Extra beat some STs skip — acceptable for MVP |
| A3 | Star-pass (Imp self-kill → Minion becomes Imp) is coached as grimoire edit note, not a full auto role-swap flow in v1 | Open Questions | ST must manually update truth; still playable |
| A4 | Extending the single `setupSessionStore` (version 2) is better than a second store | Architecture | Larger merge surface — mitigated by Zod |

**Status:** A1–A3 locked in PLAN acceptance criteria (03-02 / 03-03 / 03-05) and listed under Open Questions (RESOLVED) below.

## Open Questions (RESOLVED)

1. **Ravenkeeper / conditional Other Night wakes (A1)** — RESOLVED: `diedTonightIds` / Ravenkeeper
   - What we know: Ravenkeeper has `otherNight: 52` and only acts if killed at night; Imp has `otherNight: 24` and acts each night*.
   - **RESOLVED:** Track `diedTonightIds` (cleared at Dawn→bridge / Start other night). Include Ravenkeeper on Other Night only when that player is in the set. Avoid Skip as primary UX (D-08). Plans 03-02 engine + 03-05 grimoire toggle enforce this.

2. **Scarlet Woman Other Night queue (A2)** — RESOLVED: alive queue + conditional detail
   - **RESOLVED:** Scarlet Woman stays in the Other Night wake queue whenever alive. Coach other-night detail copy explains the conditional ability (becomes Demon if Imp dies with enough living players). Plan 03-03 coach-copy acceptance requires that detail.

3. **Star-pass (A3)** — RESOLVED: tip only
   - **RESOLVED:** Imp self-kill → Minion becomes Imp is coached as a grimoire-edit / tip note only. No auto role-swap engine in Phase 3 (plan 03-02 lock).

4. **Back one beat** — RESOLVED
   - What we know: D-08 allows if cheap; Claude discretion to defer.
   - **RESOLVED:** Ship Back as `beatIndex` decrement with floor 0 (UI-SPEC + plan 03-03). Remap/clamp when re-derived queue shrinks.

5. **Spy “show grimoire” privacy** — RESOLVED: no shutter (UI-SPEC)
   - What we know: PITFALLS require fully obscuring ST chrome for Spy show.
   - **RESOLVED:** No dedicated Spy shutter view in Phase 3 (UI-SPEC Spy privacy lock). Spy wake detail is tip-only — orient privacy / tip device or cover headers. Full obscure view deferred.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Nix flake + Node | All tooling | ✓ | Node v24.16.0 / npm 11.13.0 | — |
| Playwright | E2E coach flows | ✓ | 1.61.1 | — |
| Vitest | Beat-queue unit tests | ✓ | 4.1.10 | — |
| IndexedDB (browser) | Persist play cursor | ✓ (runtime) | — | Persist error UI already exists |
| External BotC API | — | N/A | — | Bundled JSON only |

**Missing dependencies with no fallback:** none

**Missing dependencies with fallback:** none

Step 2.6: external services not required (offline SPA).

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.10 (domain) + Playwright 1.61.1 (E2E) |
| Config file | `vitest.config.ts`, `playwright.config.ts` |
| Quick run command | `CURSOR_DEV=true nix develop -c npm run test:unit` |
| Full suite command | `CURSOR_DEV=true nix develop -c npm run test:unit && CURSOR_DEV=true nix develop -c npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| COACH-01 | First/Other queue from in-play + ordinals; Drunk believed; ≥7 info gating | unit | `npm run test:unit -- src/domain/engine/buildNightBeats.test.ts` | ❌ Wave 0 |
| COACH-01 | Representative bags (Baron, Drunk, Spy, Poisoner, 5 vs 7+ players) | unit golden | same file | ❌ Wave 0 |
| COACH-02 | Next-beat shows step + short + Next; Night ready Start first night | e2e | `npm test -- e2e/play-coach.spec.ts` | ❌ Wave 0 |
| COACH-03 | Expand reveals detail | e2e | same | ❌ Wave 0 |
| COACH-04 | Minion/Demon Info present at 7+ with roles; absent at 5 | unit + e2e | unit + play-coach | ❌ Wave 0 |
| GRIM-04 | Bluff pick 3 good not-in-play; soft confirm <3 | unit + e2e | bluff helper test + e2e | ❌ Wave 0 |
| GRIM-03 | Toggle dead; place/clear reminder; Other Night omits dead | unit + e2e | engine + play-grimoire e2e | ❌ Wave 0 |
| handoff | stubs.spec `/play` expectations updated | e2e | `e2e/stubs.spec.ts` rewrite | ⚠️ exists but obsolete |

### Sampling Rate

- **Per task commit (Nyquist):** `CURSOR_DEV=true nix develop -c npm run test:unit` (+ cheap `rg` file-content checks in PLAN verifies). Do not block each task commit on Playwright (&gt;30s latency).
- **Per wave merge:** unit + affected Playwright specs
- **Phase gate:** Full unit + full Playwright green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `src/domain/engine/buildNightBeats.test.ts` — COACH-01/04 golden cases
- [ ] `src/domain/coach/composePrompt.test.ts` — short/detail keys resolve
- [ ] `src/domain/grimoire/bluffs.test.ts` — eligible pool + selection constraints
- [ ] `e2e/play-coach.spec.ts` — Night ready → first night → Next → expand → Demon bluffs (7p)
- [ ] `e2e/play-grimoire.spec.ts` — dead toggle + reminder place/clear + other night bridge
- [ ] Rewrite `e2e/stubs.spec.ts` `/play` stub assertions
- [ ] Update `e2e/setup-record.spec.ts` — expect Start first night CTA (invert “no play link”)

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No accounts (PLAT-02) |
| V3 Session Management | partial | Local IndexedDB session only; no server session |
| V4 Access Control | no | Single-operator device |
| V5 Input Validation | yes | Zod on persist hydrate; bluff role IDs must be in eligible set; reminder strings from catalog enum |
| V6 Cryptography | no | No secrets/tokens beyond local game state |

### Known Threat Patterns for offline ST PWA

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Corrupt/malicious persisted JSON | Tampering | Zod + semantic assert; hydrationError → fresh session (existing) |
| XSS via player names in coach copy | Tampering | React text nodes only; no `dangerouslySetInnerHTML` |
| Shoulder-surf / Spy reveal leak | Information Disclosure | ST-private default; Spy coach tip warns; no shutter in Phase 3 (UI-SPEC RESOLVED) |
| Accidental day-phase fake UI | Spoofing (UX) | Bridge only — no nomination/vote chrome (D-06) |
| Supply-chain new deps | Tampering | No new packages this phase |

## Sources

### Primary (HIGH confidence)

- Codebase: `setupSessionStore.ts`, `NightReadyStep.tsx`, `PlayStub.tsx`, `roles.json` ordinals, `procedural-beats.json`, Phase 2 sticky footer / `ConfirmDialog`
- `.planning/research/ARCHITECTURE.md` — coach vs grimoire; re-derive beats; PromptComposer
- `.planning/research/PITFALLS.md` — night order, Drunk, reminders, IP
- [VERIFIED: npm registry] package versions via `npm view` in Nix
- Context7 `/pmndrs/zustand` — persist `version`/`migrate`/`createJSONStorage`/`partialize`

### Secondary (MEDIUM confidence)

- BotC rulebook excerpt (web3us-hosted Rulebook.pdf text): Minion/Demon info at first night with **7+ players**; Demon shown three not-in-play good tokens; dead players lose ability and are not woken
- [wiki.bloodontheclocktower.com/Drunk](https://wiki.bloodontheclocktower.com/Drunk) — wakes as believed Townsfolk
- [wiki.bloodontheclocktower.com/Imp](https://wiki.bloodontheclocktower.com/Imp) — bluffs; other-night kill; star-pass
- Dicebreaker how-to-play (secondary corroboration of Minion/Demon info)
- Context7 `/remix-run/react-router` — pathless layouts exist; project still prefers Zustand surface flag

### Tertiary (LOW confidence)

- None outstanding for A1–A3 / Spy shutter — all RESOLVED in Open Questions (RESOLVED) and PLAN locks (03-02 / 03-03 / 03-05); UI-SPEC Spy privacy = no shutter

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — reuse verified installed packages; no new installs
- Architecture: HIGH — aligns CONTEXT + ARCHITECTURE + existing Phase 2 seams
- Pitfalls: HIGH for night-order/Drunk/bluffs; HIGH for A1–A3 / Spy (planner + UI-SPEC locked)

**Research date:** 2026-07-16
**Valid until:** 2026-08-16 (stable domain rules; re-check if catalog ordinals change)
**Open questions:** All RESOLVED (A1 diedTonightIds/Ravenkeeper; A2 Scarlet Woman alive queue; A3 star-pass tip only; Spy no shutter per UI-SPEC)
