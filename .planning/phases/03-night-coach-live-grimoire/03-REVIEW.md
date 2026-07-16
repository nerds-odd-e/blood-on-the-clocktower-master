---
phase: 03-night-coach-live-grimoire
reviewed: 2026-07-16T10:05:00Z
depth: standard
files_reviewed: 22
files_reviewed_list:
  - src/app/routes.tsx
  - src/data/scripts/trouble-brewing/coach-copy.json
  - src/domain/coach/composePrompt.ts
  - src/domain/coach/index.ts
  - src/domain/engine/buildNightBeats.ts
  - src/domain/engine/index.ts
  - src/domain/engine/types.ts
  - src/domain/grimoire/eligibleBluffs.ts
  - src/domain/grimoire/index.ts
  - src/domain/script/index.ts
  - src/domain/script/loadCatalog.ts
  - src/domain/script/schemas.ts
  - src/index.css
  - src/state/setupSessionSemantics.ts
  - src/state/setupSessionStore.ts
  - src/ui/play/BluffPicker.tsx
  - src/ui/play/CoachBeatView.tsx
  - src/ui/play/LiveGrimoireView.tsx
  - src/ui/play/NightBridgeView.tsx
  - src/ui/play/PlayScreen.tsx
  - src/ui/setup/steps/NightReadyStep.tsx
  - tsconfig.app.json
findings:
  critical: 1
  warning: 2
  info: 2
  total: 5
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-07-16T10:05:00Z
**Depth:** standard
**Files Reviewed:** 22
**Status:** issues_found

## Summary

Reviewed production `src/` files from plans 03-01–03-05 (engine, coach copy/UI, bluffs, live grimoire, night bridge, persist/semantics). Core night-queue and coach UX look coherent, but play-field state is not kept consistent when setup mutations run after night has started — that conflicts with fail-closed hydrate semantics and can wipe the session on restore.

## Critical Issues

### CR-01: Play fields not scrubbed on player/assignment lifecycle → hydrate wipe

**File:** `src/state/setupSessionStore.ts:260-268`, `195-217`, `183-194`, `289-295`
**Issue:** Phase 03 added `deadPlayerIds`, `diedTonightIds`, `reminders`, and `demonBluffs` with fail-closed semantics (`assertLifePlayerIds`, `assertReminderCatalog`, `assertDemonBluffEligibility`). Setup mutations that change who is seated or which roles are recorded do **not** clear or re-filter those play fields:

1. `removePlayer` deletes the player/assignment but leaves orphan ids in `deadPlayerIds` / `diedTonightIds` and orphan keys in `reminders`.
2. `clearRole` / `assignRole` do not clear or revalidate `reminders[playerId]` — tokens valid for the old role remain after reassign.
3. `generateBag` / `clearBag` / `setDifficulty` clear assignments (and bag) but leave `demonBluffs`, deaths, reminders, and `playStarted` intact.

Night ready → Record → … → Players is reachable via Back after play has started. After any of the above, the next IndexedDB restore hits semantics failure and `merge` / `onRehydrateStorage` replaces the session with `freshSession()` + `hydrationError` — full data loss of an in-progress table.

**Fix:** Keep play fields consistent with seated players and current assignments on every mutating path (or centralize a scrub helper):

```ts
function scrubPlayFieldsForPlayers(
  state: PersistedSetupSession,
  catalog: LoadedCatalog,
): Partial<PersistedSetupSession> {
  const playerIds = new Set(state.players.map((p) => p.id))
  const deadPlayerIds = state.deadPlayerIds.filter((id) => playerIds.has(id))
  const diedTonightIds = state.diedTonightIds.filter((id) => playerIds.has(id))
  const reminders: Record<string, string[]> = {}
  for (const [playerId, tokens] of Object.entries(state.reminders)) {
    if (!playerIds.has(playerId)) continue
    const assignment = state.assignments[playerId]
    if (!assignment) continue
    const truthId = assignment.trueRoleId ?? assignment.bagRoleId
    const allowed = new Set(
      catalog.roles.find((r) => r.id === truthId)?.reminders ?? [],
    )
    reminders[playerId] = tokens.filter((t) => allowed.has(t))
  }
  const eligible = new Set(eligibleBluffRoleIds(state.assignments, catalog))
  const demonBluffs = state.demonBluffs.filter((id) => eligible.has(id)).slice(0, 3)
  return { deadPlayerIds, diedTonightIds, reminders, demonBluffs }
}
```

Call from `removePlayer`, `assignRole`, `clearRole`, `generateBag`, `clearBag`, and `setDifficulty` (and consider resetting play cursor via `PLAY_FIELD_DEFAULTS` when bag/assignments are wiped).

## Warnings

### WR-01: `startFirstNight` does not reset prior night grimoire state

**File:** `src/state/setupSessionStore.ts:289-295`
**Issue:** `startFirstNight` only sets `nightKind: 'first'`, `beatIndex: 0`, `playSurface: 'coach'`, `playStarted: true`. It leaves `deadPlayerIds`, `diedTonightIds`, `reminders`, and `demonBluffs` from a previous night/loop. Re-tapping **Start first night** from Night ready (reachable after Back from an in-progress or completed night) resumes a “first night” coach with stale deaths/reminders/bluffs in the live grimoire.
**Fix:** Reset play-derived grimoire fields when (re)starting first night:

```ts
startFirstNight: () =>
  set({
    nightKind: 'first',
    beatIndex: 0,
    playSurface: 'coach',
    playStarted: true,
    deadPlayerIds: [],
    diedTonightIds: [],
    reminders: {},
    // keep demonBluffs only if product wants bluffs retained across restarts
    demonBluffs: [],
  }),
```

### WR-02: Stale `demonBluffs` after assignment edits skew soft-confirm and chips

**File:** `src/state/setupSessionStore.ts:340-352`, `src/ui/play/BluffPicker.tsx:29-49`, `src/ui/play/CoachBeatView.tsx:66-71`
**Issue:** `toggleDemonBluff` / `setDemonBluffs` filter eligibility on write, but existing `demonBluffs` are never re-filtered when assignments change. `BluffPicker` only renders chips from `eligibleBluffRoleIds`, so ineligible selected ids become invisible while `demonBluffs.length` still counts them — soft confirm on Demon Info can be skipped even though the ST sees fewer than three chips.
**Fix:** Re-filter `demonBluffs` whenever assignments change (same scrub helper as CR-01), or derive displayed selection as `demonBluffs.filter(id => eligible.has(id))` and use that length for the soft gate.

## Info

### IN-01: Unreachable empty-beats branch after play has started

**File:** `src/ui/play/PlayScreen.tsx:123-143`
**Issue:** When `playStarted && hasAssignments`, `buildNightBeats` always returns at least Dusk + Dawn (`length >= 2`), so the `beats.length === 0` UI is dead code.
**Fix:** Remove the branch or assert `beats.length > 0` after build for clearer invariants.

### IN-02: Duplicated team badge class maps

**File:** `src/ui/play/BluffPicker.tsx:4-9`, `src/ui/play/LiveGrimoireView.tsx:8-16`
**Issue:** Near-identical `TEAM_BADGE_CLASS` maps live in two play views.
**Fix:** Extract a shared play/ui helper (optional cleanup).

---

_Reviewed: 2026-07-16T10:05:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
