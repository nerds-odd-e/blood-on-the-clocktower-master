---
phase: 03-night-coach-live-grimoire
reviewed: 2026-07-16T10:08:30Z
depth: standard
files_reviewed: 31
files_reviewed_list:
  - e2e/play-coach.spec.ts
  - e2e/play-grimoire.spec.ts
  - e2e/setup-record.spec.ts
  - e2e/stubs.spec.ts
  - src/app/routes.tsx
  - src/data/scripts/trouble-brewing/coach-copy.json
  - src/domain/coach/composePrompt.test.ts
  - src/domain/coach/composePrompt.ts
  - src/domain/coach/index.ts
  - src/domain/engine/buildNightBeats.test.ts
  - src/domain/engine/buildNightBeats.ts
  - src/domain/engine/index.ts
  - src/domain/engine/types.ts
  - src/domain/grimoire/bluffs.test.ts
  - src/domain/grimoire/eligibleBluffs.ts
  - src/domain/grimoire/index.ts
  - src/domain/script/index.ts
  - src/domain/script/loadCatalog.ts
  - src/domain/script/schemas.ts
  - src/index.css
  - src/state/setupSessionSemantics.test.ts
  - src/state/setupSessionSemantics.ts
  - src/state/setupSessionStore.demonBluffs.test.ts
  - src/state/setupSessionStore.grimoire.test.ts
  - src/state/setupSessionStore.ts
  - src/ui/play/BluffPicker.tsx
  - src/ui/play/CoachBeatView.tsx
  - src/ui/play/LiveGrimoireView.tsx
  - src/ui/play/NightBridgeView.tsx
  - src/ui/play/PlayScreen.tsx
  - src/ui/setup/steps/NightReadyStep.tsx
findings:
  critical: 2
  warning: 3
  info: 2
  total: 7
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-07-16T10:08:30Z
**Depth:** standard
**Files Reviewed:** 31
**Status:** issues_found

## Summary

Night coach composition, bluff eligibility, and other-night death/Ravenkeeper filtering are mostly sound. The serious defects are state consistency: setup mutations leave play fields that fail-closed hydrate will reject (full session wipe), and other-night `beatIndex` is a bare integer that drifts when the re-derived queue membership changes mid-night. Grimoire navigation also drops the night-complete bridge surface.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: Play fields not scrubbed on player/assignment lifecycle → hydrate wipe

**File:** `src/state/setupSessionStore.ts:183-194`, `195-223`, `260-268`
**Issue:** Phase 03 added `deadPlayerIds`, `diedTonightIds`, `reminders`, and `demonBluffs` with fail-closed semantics (`assertLifePlayerIds`, `assertReminderCatalog`, `assertDemonBluffEligibility`). Setup mutations that change who is seated or which roles are recorded do **not** clear or re-filter those play fields:

1. `removePlayer` deletes the player/assignment but leaves orphan ids in `deadPlayerIds` / `diedTonightIds` and orphan keys in `reminders`.
2. `clearRole` / `assignRole` do not clear or revalidate `reminders[playerId]` — tokens valid for the old role remain after reassign.
3. `generateBag` / `clearBag` / `setDifficulty` clear assignments (and bag) but leave `demonBluffs`, deaths, reminders, and `playStarted` intact.

Night ready → Record → … → Players is reachable via Back after play has started (`SetupWizard` / `NightReadyStep.onBack`). After any of the above, the next IndexedDB restore hits semantics failure and `merge` / `onRehydrateStorage` replaces the session with `freshSession()` + `hydrationError` — full data loss of an in-progress table.

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

Call from `removePlayer`, `assignRole`, `clearRole`, `generateBag`, `clearBag`, and `setDifficulty` (and reset play cursor via `PLAY_FIELD_DEFAULTS` when bag/assignments are wiped).

### CR-02: Other-night `beatIndex` drifts when queue membership changes

**File:** `src/ui/play/PlayScreen.tsx:60-63`, `src/state/setupSessionStore.ts:310-320`, `src/domain/engine/buildNightBeats.ts:49-77`
**Issue:** Beats are correctly re-derived each render (good), but the cursor is a bare `beatIndex` integer. `clampBeatIndex` only caps `beatIndex > length - 1`. `PlayScreen`'s effect depends on `beats.length` alone — not beat identity. On other nights, marking a **already-passed** player dead removes their wake and shifts later indices, so the same `beatIndex` now points at a different role (skipped wake). Inserting Ravenkeeper (`diedTonightIds`) before the current index similarly remaps what the ST sees without advancing.

Research Pitfall 4 called for remapping by beat **id** when the queue shrinks; only length clamp shipped.

Example (other night): queue `[dusk, poisoner, monk, scarletwoman, imp, …]`, cursor on Imp (`beatIndex === 4`). Mark Monk dead in grimoire → queue becomes `[dusk, poisoner, scarletwoman, imp, …]` → index `4` is no longer Imp.

**Fix:** Persist `currentBeatId` (or remap on death toggles): after rebuilding `beats`, find the previous beat id; if still present, set index to that id; if removed, advance to the next remaining beat (or clamp). Do not rely on integer stability across membership changes.

```ts
// After buildNightBeats(...):
const prevId = beats[beatIndex]?.id // better: store lastShownBeatId in state
const remapped = beats.findIndex((b) => b.id === lastShownBeatId)
clampOrSet(remapped >= 0 ? remapped : Math.min(beatIndex, beats.length - 1))
```

## Warnings

### WR-01: Grimoire “Back to coach” discards night-complete bridge

**File:** `src/ui/play/PlayScreen.tsx:92-110`, `113-120`
**Issue:** Opening Grimoire from `NightBridgeView` sets `playSurface: 'grimoire'`. `onBackToCoach` always sets `'coach'`, never restores `'bridge'`. After night complete, Grimoire → Back lands on the last coach beat (Dawn) with Next leading back to the bridge — not the Night complete screen the ST left.
**Fix:** Remember the surface before grimoire (e.g. `returnSurface: 'coach' | 'bridge'`) when opening Grimoire; Back restores it.

```ts
// on open from bridge/coach:
set({ playSurface: 'grimoire', grimoireReturnSurface: playSurface })
// on back:
set({ playSurface: state.grimoireReturnSurface ?? 'coach' })
```

### WR-02: `startFirstNight` does not reset prior night grimoire state

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
    demonBluffs: [],
  }),
```

### WR-03: Stale `demonBluffs` after assignment edits skew soft-confirm and chips

**File:** `src/state/setupSessionStore.ts:340-352`, `src/ui/play/BluffPicker.tsx:29-49`, `src/ui/play/CoachBeatView.tsx:66-71`
**Issue:** `toggleDemonBluff` / `setDemonBluffs` filter eligibility on write, but existing `demonBluffs` are never re-filtered when assignments change. `BluffPicker` only renders chips from `eligibleBluffRoleIds`, so ineligible selected ids become invisible while `demonBluffs.length` still counts them — soft confirm on Demon Info can be skipped even though the ST sees fewer than three chips.
**Fix:** Re-filter `demonBluffs` whenever assignments change (same scrub helper as CR-01), or derive displayed selection as `demonBluffs.filter(id => eligible.has(id))` and use that length for the soft gate.

## Info

### IN-01: Unreachable empty-beats branch after play has started

**File:** `src/ui/play/PlayScreen.tsx:123-143`
**Issue:** When `playStarted && hasAssignments`, `buildNightBeats` always returns at least Dusk + Dawn (`length >= 2`), so the `beats.length === 0` UI is dead code after the earlier guards.
**Fix:** Remove the branch or assert `beats.length > 0` after build for clearer invariants.

### IN-02: Duplicated team badge class maps

**File:** `src/ui/play/BluffPicker.tsx:4-9`, `src/ui/play/LiveGrimoireView.tsx:8-16`
**Issue:** Near-identical `TEAM_BADGE_CLASS` maps live in two play views.
**Fix:** Extract a shared play/ui helper (optional cleanup).

---

_Reviewed: 2026-07-16T10:08:30Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
