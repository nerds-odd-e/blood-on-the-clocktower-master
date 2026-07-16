---
phase: 02-setup-wizard-grimoire-capture
plan: 05
subsystem: ui-testing
tags: [react, zustand, playwright, accessibility, grimoire]

requires:
  - phase: 02-setup-wizard-grimoire-capture
    provides: Persisted bag, player assignments, assignment validator, and record step from plan 02-04
provides:
  - Explicit soft Start night gate with concrete assignment issues
  - Persisted Night ready summary that remains on /setup
  - End-to-end proof for override and clean assignment paths
affects: [phase-03-night-coach, setup-uat]

tech-stack:
  added: []
  patterns: [explicit local override gate, persisted route-stable handoff, focus-trapped scrollable confirmation]

key-files:
  created:
    - src/ui/setup/steps/NightReadyStep.tsx
  modified:
    - src/ui/setup/steps/RecordStep.tsx
    - src/ui/setup/components/ConfirmDialog.tsx
    - src/ui/setup/SetupWizard.tsx
    - e2e/setup-record.spec.ts
    - e2e/offline.spec.ts
    - .planning/phases/02-setup-wizard-grimoire-capture/02-VALIDATION.md

key-decisions:
  - "Keep Start night primary on the record surface, but render Start anyway as a neutral secondary outline inside the warning dialog."
  - "Advance by persisted wizardStep only, retaining /setup and exposing no /play affordance until Phase 3."

patterns-established:
  - "Soft overrides first render every structured validation issue in a focus-trapped dialog, then require an explicit operator confirmation."
  - "Phase handoffs reuse persisted wizard state and summarize saved data without prematurely mounting the next phase."

requirements-completed: [GRIM-02, SETUP-05, GRIM-01]

coverage:
  - id: D1
    description: Incomplete recording lists concrete assignment issues and requires Start anyway before Night ready.
    requirement: GRIM-02
    verification:
      - kind: e2e
        ref: "e2e/setup-record.spec.ts#lists incomplete recording issues before Start anyway reaches Night ready"
        status: pass
    human_judgment: false
  - id: D2
    description: A complete assignment set advances directly to Night ready without showing the override dialog.
    requirement: GRIM-01
    verification:
      - kind: e2e
        ref: "e2e/setup-record.spec.ts#a complete recording reaches Night ready without an override"
        status: pass
    human_judgment: false
  - id: D3
    description: Night ready remains on /setup and shows Players, Difficulty, Bag, and Assignments without a /play action.
    requirement: SETUP-05
    verification:
      - kind: e2e
        ref: "e2e/setup-record.spec.ts"
        status: pass
    human_judgment: false

duration: 4min
completed: 2026-07-16
status: complete
---

# Phase 02 Plan 05: Soft Night Gate and Night Ready Summary

**Concrete assignment warnings with an explicit neutral override and a persisted Night ready handoff that stays on `/setup`**

## Performance

- **Duration:** 4 min
- **Started:** 2026-07-16T08:08:12Z
- **Completed:** 2026-07-16T08:12:10Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Wired the always-enabled Start night action to `validateAssignments`, translating every structured issue into player- and character-specific copy before an override is possible.
- Added a scrollable, focus-trapped soft-gate variant whose Start anyway action uses neutral outline styling rather than destructive or primary accent treatment.
- Added the persisted Night ready summary with player count, difficulty, legal bag composition, and recorded assignment count, with Back returning to recording and no `/play` affordance.
- Proved incomplete and clean recording paths at the phone viewport, including the invariant that the URL remains `/setup`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Soft Start night gate + Night ready summary** - `9d3a2de` (feat)
2. **Task 2: Full-path E2E soft gate + Night ready + VALIDATION sync** - `f124098` (test)

## Files Created/Modified

- `src/ui/setup/steps/NightReadyStep.tsx` - Route-stable handoff summary for the saved setup session.
- `src/ui/setup/steps/RecordStep.tsx` - Assignment validation, issue copy, explicit override, and Start night control.
- `src/ui/setup/components/ConfirmDialog.tsx` - Neutral secondary confirm style and bounded dialog scrolling.
- `src/ui/setup/SetupWizard.tsx` - Record-to-Night-ready and Back transitions through persisted wizard state.
- `e2e/setup-record.spec.ts` - Incomplete override and complete direct-transition Playwright coverage.
- `e2e/offline.spec.ts` - Current wizard heading assertion for offline `/setup` navigation.
- `.planning/phases/02-setup-wizard-grimoire-capture/02-VALIDATION.md` - Completed SETUP/GRIM sampling map.

## Decisions Made

- Start night remains the record screen’s single primary action; only the exceptional override is visually secondary.
- The handoff retains the existing setup session in Zustand/IndexedDB and changes only `wizardStep`, so Phase 3 can consume the same blob.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated stale offline setup heading assertion**
- **Found during:** Task 2 full-suite verification
- **Issue:** `e2e/offline.spec.ts` still expected the removed Phase 1 “Setup” stub heading, blocking the required Playwright suite after the real wizard had already shipped.
- **Fix:** Assert the current Trouble Brewing wizard heading while retaining the same offline service-worker navigation proof.
- **Files modified:** `e2e/offline.spec.ts`
- **Verification:** Full Playwright suite passes, 26/26.
- **Commit:** `f124098`

**Total deviations:** 1 auto-fixed (1 blocking issue). **Impact:** Test expectation only; no product scope or architecture change.

## Issues Encountered

- The first full-suite run exposed the stale offline assertion described above; the rerun passed after correction.

## User Setup Required

None - no external service configuration required.

## Verification

- `CURSOR_DEV=true nix develop -c npm run build` — passed.
- `CURSOR_DEV=true nix develop -c npx playwright test e2e/setup-record.spec.ts` — 3 passed.
- `CURSOR_DEV=true nix develop -c npm run test:unit` — 39 passed.
- `CURSOR_DEV=true nix develop -c npm test` — 26 passed.

## Next Phase Readiness

- Phase 3 can start from the persisted `nightReady` session and consume its player, bag, and assignment data without reconstructing setup.
- No blockers remain for Night coach planning or execution.

## Self-Check: PASSED

- Created artifacts exist, both task commits are present, no blocking stubs were found, and all acceptance and plan-level verification commands passed.

---
*Phase: 02-setup-wizard-grimoire-capture*
*Completed: 2026-07-16*
