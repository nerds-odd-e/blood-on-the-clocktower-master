# Phase 3: Night Coach & Live Grimoire - Pattern Map

**Mapped:** 2026-07-16
**Files analyzed:** 22
**Analogs found:** 20 / 22

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/domain/engine/types.ts` | model | transform | `src/domain/bag/types.ts` | exact |
| `src/domain/engine/buildNightBeats.ts` | service | transform | `src/domain/bag/buildBag.ts` | exact |
| `src/domain/engine/buildNightBeats.test.ts` | test | batch | `src/domain/bag/buildBag.test.ts` | exact |
| `src/domain/coach/composePrompt.ts` | service | transform | `src/domain/grimoire/validateAssignments.ts` | role-match |
| `src/domain/coach/composePrompt.test.ts` | test | batch | `src/domain/grimoire/validateAssignments.test.ts` | exact |
| `src/domain/grimoire/eligibleBluffs.ts` (or `bluffs.ts`) | utility | transform | `src/state/setupSessionStore.ts` (`remainingTokens`) | role-match |
| `src/domain/grimoire/bluffs.test.ts` | test | batch | `src/domain/grimoire/validateAssignments.test.ts` | exact |
| `src/domain/grimoire/types.ts` | model | CRUD | `src/domain/grimoire/types.ts` (extend in place) | exact |
| `src/domain/grimoire/index.ts` | utility | — | `src/domain/bag/index.ts` | exact |
| `src/data/scripts/trouble-brewing/coach-copy.json` | config | file-I/O | `src/data/scripts/trouble-brewing/procedural-beats.json` | exact |
| `src/domain/script/schemas.ts` | model | transform | `src/domain/script/schemas.ts` (extend) | exact |
| `src/domain/script/loadCatalog.ts` | service | file-I/O | `src/domain/script/loadCatalog.ts` (extend) | exact |
| `src/state/setupSessionStore.ts` | store | CRUD | `src/state/setupSessionStore.ts` (extend v2) | exact |
| `src/ui/play/PlayScreen.tsx` | component | event-driven | `src/ui/setup/SetupWizard.tsx` | role-match |
| `src/ui/play/CoachBeatView.tsx` | component | event-driven | `src/ui/setup/steps/RecordStep.tsx` | role-match |
| `src/ui/play/NightBridgeView.tsx` | component | event-driven | `src/ui/setup/steps/NightReadyStep.tsx` | role-match |
| `src/ui/play/LiveGrimoireView.tsx` | component | CRUD | `src/ui/setup/steps/RecordStep.tsx` + `RolePicker.tsx` | role-match |
| `src/ui/setup/steps/NightReadyStep.tsx` | component | request-response | `src/ui/setup/steps/RecordStep.tsx` (sticky CTA) | exact |
| `src/app/routes.tsx` | route | request-response | `src/app/routes.tsx` (swap element) | exact |
| `src/ui/play/PlayStub.tsx` | component | — | delete / replace with `PlayScreen` | n/a |
| `e2e/play-coach.spec.ts` | test | request-response | `e2e/setup-record.spec.ts` | exact |
| `e2e/play-grimoire.spec.ts` | test | request-response | `e2e/setup-record.spec.ts` | exact |
| `e2e/stubs.spec.ts` | test | request-response | `e2e/stubs.spec.ts` (rewrite `/play`) | exact |
| `e2e/setup-record.spec.ts` | test | request-response | `e2e/setup-record.spec.ts` (invert Night ready → play) | exact |

## Pattern Assignments

### `src/domain/engine/types.ts` (model, transform)

**Analog:** `src/domain/bag/types.ts`

**Imports / export style** (lines 1–25):
```typescript
import type { LoadedCatalog } from '../script'

export type Difficulty = 'easy' | 'standard' | 'hard'

export type BagPlan = {
  tokens: string[]
  composition: BagComposition
  drunk: { coverRoleId: string } | null
  setupNotes: string[]
  whyNote: string
}

export type BuildBagInput = {
  playerCount: number
  difficulty: Difficulty
  catalog: LoadedCatalog
  rng?: () => number
}
```

**Copy for Phase 3:** Export `NightKind`, `Beat` discriminated union, and `BuildNightBeatsInput` the same way — plain types next to the pure builder, no classes. Prefer importing `Assignment` from `../grimoire` rather than duplicating.

---

### `src/domain/engine/buildNightBeats.ts` (service, transform)

**Analog:** `src/domain/bag/buildBag.ts`

**Imports pattern** (lines 1–4):
```typescript
import type { Role } from '../script'
import { pickWeightedRoles, WHY_NOTE } from './heuristics'
import type { BagPlan, BuildBagInput } from './types'
import { validateBag } from './validateBag'
```

**Core pure-function pattern** (lines 14–16, 92–102):
```typescript
function rolesForTeam(roles: Role[], team: Role['team']): Role[] {
  return roles.filter((role) => role.team === team)
}

export function buildBag(input: BuildBagInput): BagPlan {
  const rng = input.rng ?? cryptoRng
  // …pure transform over catalog + input; throw Error with message on hard failure
  throw new Error(`Could not build a legal bag: ${lastIssues.join(' ')}`)
}
```

**Copy for Phase 3:**
- Keep `buildNightBeats` pure: `(nightKind, input, catalog) => Beat[]` — no Zustand imports.
- Helper filter/map/sort like `rolesForTeam`; resolve Drunk via `believedRoleId ?? trueRoleId ?? bagRoleId`.
- Soft failures for partial grimoire: omit unrecorded players; do not invent seats (D-18).
- Throw only for programmer/catalog invariant breaks (missing chart row style).

---

### `src/domain/engine/buildNightBeats.test.ts` (test, batch)

**Analog:** `src/domain/bag/buildBag.test.ts`

**Test structure** (lines 1–30):
```typescript
import { describe, expect, it } from 'vitest'
import { loadCatalog } from '../script'
import { buildBag } from './buildBag'
import { validateBag } from './validateBag'
import type { Difficulty } from './types'

const catalog = loadCatalog()

describe('buildBag', () => {
  for (let playerCount = 5; playerCount <= 15; playerCount += 1) {
    for (const difficulty of difficulties) {
      it(`builds a legal ${difficulty} bag for ${playerCount} players`, () => {
        const bag = buildBag({ playerCount, difficulty, catalog, rng: () => 0.42 })
        expect(validateBag(bag, playerCount, catalog)).toEqual({ ok: true, issues: [] })
      })
    }
  }
```

**Copy for Phase 3:** Golden cases with real `loadCatalog()` — 5 vs 7+ gating, Drunk→believed wake, dead omit on other nights, Baron/Spy bags. Colocate `*.test.ts` next to the module. No mocks of catalog JSON.

---

### `src/domain/coach/composePrompt.ts` (service, transform)

**Analog:** `src/domain/grimoire/validateAssignments.ts`

**Pure domain shape** (lines 26–56):
```typescript
export function validateAssignments(
  session: AssignmentSession,
): AssignmentIssue[] {
  const issues: AssignmentIssue[] = []
  // …read-only over input; return structured result, no side effects
  return issues
}
```

**Copy for Phase 3:** `composePrompt(beat, ctx) → { short, detail }` — lookup paraphrased `coach-copy.json` by beat id / role id; fall back to catalog `firstNightReminder` / `otherNightReminder` / procedural `notes` when needed. Never scrape Almanac. Keep IP-safe paraphrase in data, not hard-coded paragraphs in the UI.

---

### `src/domain/grimoire/eligibleBluffs.ts` (utility, transform)

**Analog:** `remainingTokens` in `src/state/setupSessionStore.ts`

**Eligibility filter pattern** (lines 109–131):
```typescript
export function remainingTokens(
  bag: BagPlan | null,
  assignments: Record<string, Assignment>,
  excludedPlayerId?: string,
) {
  if (!bag) return []
  const assignedCounts = new Map<string, number>()
  for (const assignment of Object.values(assignments)) {
    if (assignment.playerId === excludedPlayerId) continue
    assignedCounts.set(
      assignment.bagRoleId,
      (assignedCounts.get(assignment.bagRoleId) ?? 0) + 1,
    )
  }
  return bag.tokens.filter((roleId) => {
    const assigned = assignedCounts.get(roleId) ?? 0
    if (assigned === 0) return true
    assignedCounts.set(roleId, assigned - 1)
    return false
  })
}
```

**Copy for Phase 3:** Prefer a **pure domain** helper (not store-local) `eligibleBluffRoleIds(assignments, catalog)`:
- In-play = recorded `trueRoleId ?? bagRoleId` plus physical `bagRoleId` covers.
- Eligible = `team ∈ {townsfolk, outsider}` and not in-play.
- Store actions only validate against this list before mutating `demonBluffs`.

---

### `src/domain/grimoire/types.ts` + `index.ts` (model / barrel)

**Analog:** existing `types.ts` + `src/domain/bag/index.ts`

**Current Assignment model** (`types.ts` lines 3–8):
```typescript
export type Assignment = {
  playerId: string
  bagRoleId: string
  trueRoleId?: string
  believedRoleId?: string
}
```

**Barrel pattern** (`bag/index.ts`):
```typescript
export { buildBag } from './buildBag'
export type { BagPlan, BuildBagInput, Difficulty } from './types'
```

**Copy for Phase 3:** Extend grimoire types with `ReminderPlacement` / life flags only if they are domain-owned; keep persist arrays (`deadPlayerIds`, `reminders`, `demonBluffs`) in the store schema. Re-export new helpers from `grimoire/index.ts` like bag does.

---

### `src/data/.../coach-copy.json` + schema/load (config, file-I/O)

**Analog:** `procedural-beats.json` + `schemas.ts` + `loadCatalog.ts`

**JSON stub shape** (`procedural-beats.json`):
```json
{
  "beats": [
    {
      "id": "dusk",
      "label": "Dusk",
      "phase": "night",
      "ordinal": 1,
      "notes": "Phase 3 coach stub — announce dusk / night begins."
    }
  ]
}
```

**Zod + load pattern** (`schemas.ts` 45–55, `loadCatalog.ts` 15–60):
```typescript
export const ProceduralBeatSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  phase: z.string().min(1),
  ordinal: z.number().int().nonnegative(),
  notes: z.string(),
})

import proceduralBeatsJson from '../../data/scripts/trouble-brewing/procedural-beats.json'
const proceduralBeats = ProceduralBeatsSchema.parse(proceduralBeatsJson).beats
```

**Copy for Phase 3:** Add Zod schema for coach-copy entries (`id`, `short`, `detail`); parse at load time. Either attach to `LoadedCatalog` or a sibling `loadCoachCopy()` — keep validation fail-fast like catalog (parse throws).

---

### `src/state/setupSessionStore.ts` (store, CRUD)

**Analog:** itself (Phase 2 persist document) — extend in place to version 2.

**Zod persisted shape** (lines 54–60):
```typescript
const PersistedSetupSessionSchema = z.object({
  wizardStep: WizardStepSchema,
  players: z.array(SetupPlayerSchema).max(15),
  difficulty: DifficultySchema,
  bag: BagPlanSchema.nullable(),
  assignments: z.record(z.string(), AssignmentSchema),
})
```

**Persist + merge + hydrate** (lines 248–290):
```typescript
{
  name: SETUP_SESSION_STORAGE_KEY,
  version: 1,
  storage: createJSONStorage(() => idbStorage),
  partialize: (state) => partializedSession(state),
  merge: (persistedState, currentState) => {
    if (persistedState == null) return currentState
    const parsed = PersistedSetupSessionSchema.safeParse(persistedState)
    if (!parsed.success) {
      return { ...currentState, ...freshSession(), hydrationError: true }
    }
    const semantics = assertSetupSessionSemantics(parsed.data, loadCatalog())
    if (!semantics.ok) {
      return { ...currentState, ...freshSession(), hydrationError: true }
    }
    return { ...currentState, ...parsed.data }
  },
  onRehydrateStorage: () => (state, error) => { /* … */ },
}
```

**Mutation style** (lines 153–175):
```typescript
assignRole: (playerId, bagRoleId) =>
  set((state) => {
    if (!/* guards */) return state
    return {
      assignments: { ...state.assignments, [playerId]: assignment },
    }
  }),
```

**Critical persist handoff** (lines 243–246):
```typescript
advanceToNightReady: async () => {
  set({ wizardStep: 'nightReady', persistWriteStatus: 'saving' })
  await get().awaitCriticalPersist()
},
```

**Copy for Phase 3:**
- Bump `version: 2` + `migrate` defaults: `nightKind`, `beatIndex`, `playSurface`, `deadPlayerIds`, `reminders`, `demonBluffs`, `diedTonightIds`, `playStarted`.
- Extend `PersistedSetupSessionSchema` + `partializedSession` + `freshSession`.
- Add actions: `startFirstNight`, `advanceBeat`, `setPlaySurface`, `toggleDead`, `setReminders`, `setDemonBluffs`, `startOtherNight`.
- Keep single store (no second Zustand store). Cursor in store, not URL.
- Update `awaitCriticalPersist` payload `version` alongside middleware version.
- Extend `assertSetupSessionSemantics` for bluff IDs ∈ eligible set / reminder strings ∈ catalog when present.

---

### `src/ui/play/PlayScreen.tsx` (component, event-driven)

**Analog:** `src/ui/setup/SetupWizard.tsx` (surface switching via store flag)

**Store-driven view switch** (lines 10–72):
```typescript
export function SetupWizard() {
  const wizardStep = useSetupSessionStore((state) => state.wizardStep)
  const hasHydrated = useSetupSessionStore((state) => state.hasHydrated)
  // …
  if (!hasHydrated) {
    return (
      <div className="min-h-dvh bg-[var(--color-dominant)]" aria-busy="true" aria-label="Restoring setup" />
    )
  }
  return (
    <div className="min-w-0 overflow-x-hidden">
      {wizardStep === 'nightReady' ? (
        <NightReadyStep onBack={() => setWizardStep('record')} />
      ) : null}
    </div>
  )
}
```

**Shell wrap:** `PhoneShell` already wraps routes in `src/app/App.tsx` — do not nest another shell.

**Copy for Phase 3:** `PlayScreen` switches on `playSurface: 'coach' | 'grimoire' | 'bridge'` (and/or end-of-queue). Wait for `hasHydrated`. Re-derive beats each render via `buildNightBeats`; never store frozen `Beat[]`.

---

### `src/ui/play/CoachBeatView.tsx` (component, event-driven)

**Analog:** `src/ui/setup/steps/RecordStep.tsx` (sticky primary + secondary Back)

**Sticky thumb footer** (lines 118–141):
```tsx
<footer className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-[var(--color-dominant)] py-4">
  <button
    type="button"
    className="min-h-11 self-start text-body underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
    onClick={onBack}
  >
    Back
  </button>
  <button
    type="button"
    className="min-h-12 rounded-sm bg-[var(--color-accent)] px-6 text-body font-semibold text-[#0B0B0B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
    onClick={/* primary */}
  >
    Start night
  </button>
</footer>
```

**Inline expand analog** — `src/ui/setup/components/PlayerRow.tsx` (lines 117–136):
```tsx
<button
  type="button"
  className="min-h-11 rounded-sm border border-[var(--color-border)] px-3 text-body"
  aria-expanded={expanded}
  onClick={() => setExpanded((value) => !value)}
>
  {expanded ? 'Less' : 'More'}
</button>
{expanded ? (
  <div className="mt-4 flex flex-col gap-4 border-t border-[var(--color-border)] pt-4">
    {/* detail */}
  </div>
) : null}
```

**Soft confirm** — same file, `ConfirmDialog` with `secondaryConfirm` (lines 143–161):
```tsx
<ConfirmDialog
  title="Recording is incomplete"
  confirmLabel="Start anyway"
  dismissLabel="Keep recording"
  secondaryConfirm
  onConfirm={() => { setStartIssues(null); onStartNight() }}
  onDismiss={() => setStartIssues(null)}
>
```

**Copy for Phase 3:**
- Full-screen beat: title + short + inline expand detail (D-02); **no Vaul**.
- Primary **Next** = accent sticky footer (D-03); optional Back = underline secondary above/beside.
- Grimoire = header text link, not accent (D-04).
- Leaving Demon Info with `<3` bluffs → reuse `ConfirmDialog` + `secondaryConfirm` (D-12).
- ST-private Drunk line pattern from RecordStep rows: `Drunk (believes {cover})`.

---

### `src/ui/play/NightBridgeView.tsx` (component, event-driven)

**Analog:** `src/ui/setup/steps/NightReadyStep.tsx`

**Summary + muted body + secondary Back** (lines 71–114):
```tsx
<section className="flex min-h-dvh flex-col gap-6 pt-8 pb-8">
  <header>
    <h1 className="text-display">Night ready</h1>
    <p className="mt-3 text-body text-[var(--color-text-muted)]">{statusCopy}</p>
  </header>
  {/* summary card */}
  <button type="button" className="min-h-11 self-start text-body underline …" onClick={onBack}>
    Back
  </button>
</section>
```

**Copy for Phase 3:** Minimal “Night complete” + sticky **Start other night** accent CTA (mirror Night ready Start first night). No nomination/vote chrome (D-06). Prefer store `playSurface: 'bridge'` over a new route.

---

### `src/ui/play/LiveGrimoireView.tsx` (component, CRUD)

**Analogs:** `RecordStep.tsx` (tap player list) + `RolePicker.tsx` (chip picker)

**Tap-player list** (`RecordStep` lines 55–91):
```tsx
<button
  key={player.id}
  type="button"
  className={`min-h-14 w-full rounded-sm border bg-[var(--color-secondary)] p-4 text-left …`}
  data-testid="setup-player-row"
  aria-pressed={isSelected}
  onClick={() => setSelectedPlayerId(player.id)}
>
  <span className="block text-body">{player.name}</span>
  <span className="mt-1 block text-label text-[var(--color-text-muted)]">
    {/* ST-private truth always visible */}
  </span>
</button>
```

**Team-grouped chips** (`RolePicker` lines 64–88):
```tsx
<div className="mt-2 flex-wrap gap-2">
  <button
    type="button"
    className={`min-h-11 rounded-sm px-3 py-2 text-label … ${TEAM_BADGE_CLASS[team]}`}
    data-testid="setup-role-chip"
    data-role-id={roleId}
    onClick={() => onAssign(roleId)}
  >
    {role.name}
  </button>
</div>
```

**Copy for Phase 3:**
- Dedicated full panel; Back → `playSurface: 'coach'` (D-13).
- Per-player Dead/Alive toggle (D-14); show true role + Drunk believes cover by default (D-16).
- Reminder place/clear: after tap player, chips from `role.reminders[]` + clear existing (D-15) — reuse RolePicker chip styling / team badges where bluffs edit.
- Bluff edit on grimoire reuses same eligibility helper as Demon Info beat.

---

### `src/ui/setup/steps/NightReadyStep.tsx` (component, request-response)

**Analog for new CTA:** sticky primary from `RecordStep` + `useNavigate` handoff (new — no prior navigate-from-setup).

**Current state:** summary only; copy says coaching “next update”; Back underline only.

**Copy for Phase 3 (D-05):**
```tsx
import { useNavigate } from 'react-router-dom'
// …
const startFirstNight = useSetupSessionStore((s) => s.startFirstNight)
const navigate = useNavigate()

<footer className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-[var(--color-dominant)] py-4">
  <button type="button" className="min-h-11 self-start text-body underline …" onClick={onBack}>
    Back
  </button>
  <button
    type="button"
    className="min-h-12 rounded-sm bg-[var(--color-accent)] px-6 text-body font-semibold text-[#0B0B0B] …"
    onClick={() => {
      startFirstNight()
      navigate('/play')
    }}
  >
    Start first night
  </button>
</footer>
```

Update muted status copy away from “next update” once coach ships.

---

### `src/app/routes.tsx` (route, request-response)

**Analog:** itself

```tsx
import { PlayStub } from '../ui/play/PlayStub'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ScriptHome />} />
      <Route path="/setup" element={<SetupWizard />} />
      <Route path="/play" element={<PlayStub />} />
    </Routes>
  )
}
```

**Copy for Phase 3:** Swap `PlayStub` → `PlayScreen`. Keep shallow `/play` only — no `/play/grimoire`.

---

### E2E: `e2e/play-coach.spec.ts` / `play-grimoire.spec.ts` (test, request-response)

**Analog:** `e2e/setup-record.spec.ts`

**Helpers + phone viewport** (lines 1–30):
```typescript
import { expect, test, type Page } from '@playwright/test'

const PLAYER_NAMES = ['Alice', 'Ben', 'Clara', 'Diego', 'Evelyn']

async function reachRecordStep(page: Page) { /* real TB wizard path */ }

test.describe('setup record roles', () => {
  test.use({ viewport: { width: 390, height: 844 } })
  // …
})
```

**Soft-gate dialog assertions** (lines 85–111):
```typescript
await page.getByRole('button', { name: 'Start night' }).click()
const dialog = page.getByRole('dialog', { name: 'Recording is incomplete' })
await expect(dialog).toBeVisible()
await page.getByRole('button', { name: 'Start anyway' }).click()
await expect(page.getByRole('heading', { name: 'Night ready' })).toBeVisible()
await expect(page.getByRole('link', { name: /play/i })).toHaveCount(0) // ← invert in Phase 3
```

**Copy for Phase 3:**
- Reuse `reachRecordStep` / assign helpers (extract shared if needed).
- New specs: Night ready → Start first night → beat title/short/Next → expand → Demon bluffs (7p); dead + reminders + other-night bridge.
- Prefer role/name locators + `data-testid` for player rows/chips (existing pattern).
- Real bundled TB data only — no mocked catalog.

---

### `e2e/stubs.spec.ts` + `e2e/setup-record.spec.ts` (modify)

**Obsolete assertion to invert** (`stubs.spec.ts` 17–23, `setup-record.spec.ts` 111):
```typescript
await expect(page.getByRole('heading', { name: 'Play' })).toBeVisible()
await expect(page.getByRole('link', { name: /play/i })).toHaveCount(0)
```

**Copy for Phase 3:** `/play` expects coach empty-state or redirect guidance when no session; Night ready expects **Start first night** and navigates to `/play`. Rewrite stub test in Wave 0 RED with coach.

## Shared Patterns

### Sticky primary CTA footer
**Source:** `src/ui/setup/steps/RecordStep.tsx` lines 118–141 (also BagStep, PlayersStep, DifficultyStep, ScriptStep)
**Apply to:** `CoachBeatView`, `NightReadyStep` (Start first night), `NightBridgeView` (Start other night)
```tsx
<footer className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-[var(--color-dominant)] py-4">
  {/* underline secondary Back */}
  {/* min-h-12 accent primary */}
</footer>
```

### Soft confirm gate
**Source:** `src/ui/setup/components/ConfirmDialog.tsx` + `RecordStep` usage
**Apply to:** Demon bluffs &lt; 3 (D-12); any bridge confirms
```tsx
<ConfirmDialog
  title="…"
  confirmLabel="…"
  dismissLabel="…"
  secondaryConfirm
  onConfirm={…}
  onDismiss={…}
/>
```
Do not add Vaul. Move `ConfirmDialog` to a shared UI folder only if play imports from setup feel wrong — optional, not required.

### Zustand + idb-keyval session document
**Source:** `src/state/setupSessionStore.ts`
**Apply to:** All play cursor / dead / reminders / bluffs persistence
- Single store, Zod merge validation, `hydrationError` → fresh session
- `partialize` persisted fields only
- Critical write path via `awaitCriticalPersist` for night-start handoff

### Pure domain + Vitest goldens
**Source:** `src/domain/bag/buildBag.ts` + `buildBag.test.ts`
**Apply to:** `buildNightBeats`, `eligibleBluffs`, `composePrompt`
- `loadCatalog()` in tests; colocated `*.test.ts`
- No UI imports in domain

### ST-private Drunk display
**Source:** `RecordStep.tsx` lines 79–86, `NightReadyStep.tsx` lines 31–41
**Apply to:** Coach wake labels + Live grimoire rows
```tsx
assignment.trueRoleId === 'drunk'
  ? `Drunk (believes ${roleById.get(assignment.bagRoleId)?.name ?? …})`
  : roleName
```

### PhoneShell + shallow routes
**Source:** `src/app/App.tsx`, `src/app/routes.tsx`
**Apply to:** Play coach — already wrapped; keep `/`, `/setup`, `/play` only

### Touch / a11y tokens
**Source:** Phase 2 steps + ConfirmDialog
**Apply to:** All new play controls — `min-h-11` / `min-h-12`, `focus-visible:outline`, CSS vars (`--color-accent`, `--color-dominant`, `--color-secondary`, team badge vars), `text-display` / `text-heading` / `text-body` / `text-label`

### Tooling (Nix)
**Source:** `.cursor/rules/nix.mdc`
**Apply to:** All plan test/build commands
```bash
CURSOR_DEV=true nix develop -c npm run test:unit
CURSOR_DEV=true nix develop -c npm run test:e2e
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| Coach short/detail copy templates (`coach-copy.json` content) | config | — | No paraphrased coach copy exists yet; invent from RESEARCH IP constraints + procedural notes / role reminders |
| Demon Info multi-select bluff UI (pick exactly 3) | component | CRUD | RolePicker is single-select assign; closest chip styling exists, but 3-select + soft confirm is new composition |

Planner should use RESEARCH.md Code Examples for beat-queue / bluff eligibility shapes; UI can compose RolePicker chip patterns + ConfirmDialog.

## Metadata

**Analog search scope:** `src/domain/`, `src/state/`, `src/ui/`, `src/app/`, `src/data/scripts/trouble-brewing/`, `e2e/`
**Files scanned:** ~45 TS/TSX + JSON data + 6 e2e specs
**Strong analogs used:** `buildBag`, `setupSessionStore`, `RecordStep`/`ConfirmDialog`/`RolePicker`, `SetupWizard`, `loadCatalog`/`schemas`, `setup-record` e2e
**Pattern extraction date:** 2026-07-16
