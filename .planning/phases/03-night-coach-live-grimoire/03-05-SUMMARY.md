---
phase: 03-night-coach-live-grimoire
plan: 05
subsystem: live-grimoire
tags: [live-grimoire, other-nights, night-bridge, reminders, dead-alive]

requires:
  - phase: 03-night-coach-live-grimoire
    provides: CoachBeatView, eligibleBluffs/BluffPicker, buildNightBeats dead/Ravenkeeper, playSurface stubs
provides:
  - LiveGrimoireView with ST truth, Dead/Alive, reminder place/clear, bluff edit
  - NightBridgeView Start other night without day-phase chrome
  - Store toggleDead / setPlayerReminders / startOtherNight + reminder catalog semantics
  - Green play-grimoire E2E closing the TB night loop
affects:
  - Phase 04 day tools (DAY-*) when night→day handoff is designed
  - verify-work / validate-phase for Phase 03 UAT

tech-stack:
  added: []
  patterns:
    - Catalog-guarded reminder mutations (strings ⊆ role.reminders for true role)
    - diedTonightIds retained across revive until startOtherNight for Ravenkeeper (A1)
    - playSurface grimoire/bridge checked before empty-beats coach fallback

key-files:
  created:
    - src/ui/play/LiveGrimoireView.tsx
    - src/ui/play/NightBridgeView.tsx
    - src/state/setupSessionStore.grimoire.test.ts
  modified:
    - src/state/setupSessionStore.ts
    - src/state/setupSessionSemantics.ts
    - src/ui/play/PlayScreen.tsx
    - e2e/play-grimoire.spec.ts
    - .planning/phases/03-night-coach-live-grimoire/03-VALIDATION.md

key-decisions:
  - "Reminder catalog uses trueRoleId ?? bagRoleId (Drunk has empty reminders → picker empty copy)"
  - "Reviving a player keeps diedTonightIds until startOtherNight so Ravenkeeper gating stays correct"
  - "E2E uses button locators + data-dead; scans seats for a role with reminder tokens"

patterns-established:
  - "Live grimoire is a dedicated playSurface panel with Back to coach (cursor unchanged)"
  - "Night complete bridge is sticky Start other night only — no nomination/vote chrome"

requirements-completed: [GRIM-03, COACH-01]

coverage:
  - id: D1
    description: Live grimoire Dead/Alive toggles deadPlayerIds; Other Night omits dead wakes; Ravenkeeper diedTonightIds still green
    requirement: GRIM-03
    verification:
      - kind: unit
        ref: src/state/setupSessionStore.grimoire.test.ts#toggleDead adds and removes deadPlayerIds and tracks diedTonightIds
        status: pass
      - kind: unit
        ref: src/domain/engine/buildNightBeats.test.ts#omits dead players on other nights except Ravenkeeper when in diedTonightIds
        status: pass
    human_judgment: false
  - id: D2
    description: Reminder place/clear from role.reminders only; store rejects non-catalog tokens
    requirement: GRIM-03
    verification:
      - kind: unit
        ref: src/state/setupSessionStore.grimoire.test.ts#setPlayerReminders only accepts catalog role.reminders strings
        status: pass
      - kind: e2e
        ref: e2e/play-grimoire.spec.ts
        status: pass
    human_judgment: false
  - id: D3
    description: ST-private grimoire shows truth including Drunk · believes {Cover}; privacy line; bluff edit via BluffPicker
    requirement: GRIM-03
    verification:
      - kind: other
        ref: rg Private — Storyteller only|Drunk · believes|Add reminder|Back to coach in LiveGrimoireView.tsx
        status: pass
    human_judgment: true
    rationale: Visual density of 15-player scroll and long reminder wrap are UI-SPEC backstops
  - id: D4
    description: Night complete bridge → Start other night resets to Other night step 1; no day-phase UI
    requirement: COACH-01
    verification:
      - kind: e2e
        ref: e2e/play-grimoire.spec.ts
        status: pass
      - kind: unit
        ref: src/state/setupSessionStore.grimoire.test.ts#startOtherNight resets night cursor and clears diedTonightIds
        status: pass
      - kind: other
        ref: rg Night complete|Start other night and !nomination|vote in NightBridgeView.tsx
        status: pass
    human_judgment: false

duration: 3min
completed: 2026-07-16
status: complete
---

# Phase 03 Plan 05: Live Grimoire & Night Bridge Summary

**Dedicated live grimoire (alive/dead, catalog reminders, ST truth, bluff edit) plus Night complete → Start other night bridge closes the playable TB night loop**

## Performance

- **Duration:** 3 min
- **Started:** 2026-07-16T09:55:11Z
- **Completed:** 2026-07-16T09:58:40Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- LiveGrimoireView ships seat-ordered ST truth, Dead/Alive toggles, reminder picker/clear, Demon bluffs edit, privacy line
- Store mutations guard reminder strings to `role.reminders` and track `diedTonightIds` for Ravenkeeper (A1)
- NightBridgeView provides Start other night with first/other body copy and zero day-phase chrome
- `e2e/play-grimoire.spec.ts` green; Wave 0 / plans 01–05 verification map updated in 03-VALIDATION.md

## Task Commits

Each task was committed atomically:

1. **Task 1: LiveGrimoireView alive/dead + reminders + ST truth** - `a07daa2` (test RED) → `03d0bb4` (feat GREEN)
2. **Task 2: Night bridge + Start other night + green play-grimoire E2E** - `0ae4e1f` (feat)

**Plan metadata:** *(pending docs commit)*

## Files Created/Modified

- `src/ui/play/LiveGrimoireView.tsx` - Dedicated grimoire panel
- `src/ui/play/NightBridgeView.tsx` - Night complete bridge
- `src/ui/play/PlayScreen.tsx` - playSurface switch coach|grimoire|bridge
- `src/state/setupSessionStore.ts` - toggleDead, setPlayerReminders, startOtherNight
- `src/state/setupSessionSemantics.ts` - reminder catalog + life id ⊆ seats (T-03-02)
- `src/state/setupSessionStore.grimoire.test.ts` - store unit coverage
- `e2e/play-grimoire.spec.ts` - green happy path
- `.planning/phases/03-night-coach-live-grimoire/03-VALIDATION.md` - Wave 0 complete, map green

## Decisions Made

- Reminder eligibility keyed off true role (`trueRoleId ?? bagRoleId`); Drunk catalog reminders are empty → empty picker copy
- Reviving clears `deadPlayerIds` only; `diedTonightIds` clears on `startOtherNight`
- E2E locators use buttons (not links) and `data-dead`; scan seats for a role with reminder tokens

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] PlayScreen checked empty beats before grimoire surface**
- **Found during:** Task 1
- **Issue:** Opening Grimoire from an empty queue could not render LiveGrimoireView
- **Fix:** Evaluate `playSurface === 'grimoire'|'bridge'` before the empty-beats fallback
- **Files modified:** `src/ui/play/PlayScreen.tsx`
- **Verification:** surface order in PlayScreen
- **Committed in:** `03d0bb4`

**2. [Rule 2 - Missing Critical] Reminder/dead id semantics on hydrate (T-03-02)**
- **Found during:** Task 1
- **Issue:** Persist merge only shape-checked reminders/dead ids
- **Fix:** Fail closed when reminder tokens ∉ catalog or life ids ∉ seated players
- **Files modified:** `src/state/setupSessionSemantics.ts`
- **Verification:** unit suite still green
- **Committed in:** `03d0bb4`

**3. [Rule 1 - Bug] Wave 0 E2E assumed link roles and always-reminder first seat**
- **Found during:** Task 2
- **Issue:** Coach/grimoire chrome is buttons; first seat may have empty `reminders[]`
- **Fix:** Button locators, `data-dead` asserts, scan seats for a reminder-capable role
- **Files modified:** `e2e/play-grimoire.spec.ts`
- **Verification:** `npx playwright test e2e/play-grimoire.spec.ts` exit 0
- **Committed in:** `0ae4e1f`

---

**Total deviations:** 3 auto-fixed (2 bug, 1 missing critical)
**Impact on plan:** Required for correctness/security and green E2E; no scope creep.

## Issues Encountered

None beyond the auto-fixed items above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 03 playable night loop closed (First Night → grimoire → Other Night)
- Day-phase nomination/vote (DAY-*) remains out of scope; bridge copy states that clearly
- Ready for phase verify-work / validate-phase Nyquist sign-off

## Self-Check: PASSED

- FOUND: `src/ui/play/LiveGrimoireView.tsx`
- FOUND: `src/ui/play/NightBridgeView.tsx`
- FOUND: `src/state/setupSessionStore.grimoire.test.ts`
- FOUND: `a07daa2`, `03d0bb4`, `0ae4e1f` in git log

---
*Phase: 03-night-coach-live-grimoire*
*Completed: 2026-07-16*
