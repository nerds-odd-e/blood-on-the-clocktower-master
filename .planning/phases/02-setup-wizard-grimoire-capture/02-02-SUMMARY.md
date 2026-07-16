---
phase: 02-setup-wizard-grimoire-capture
plan: 02
subsystem: ui
tags: [react, zustand, indexeddb, playwright, setup-wizard]

requires:
  - phase: 02-setup-wizard-grimoire-capture
    provides: Wave 0 dependencies and RED setup-wizard browser path from plan 02-01
provides:
  - IndexedDB-backed validated setup session store
  - Script, players, and difficulty wizard steps on /setup
  - Roster seating, profiles, validation, and remove confirmation
  - E2E coverage for roster flow, profile persistence, and corrupt-session recovery
affects: [02-03-bag-builder, 02-04-role-recording, 02-05-night-ready]

tech-stack:
  added: []
  patterns: [Zustand async hydration gate, Zod-validated persisted session, shallow-route wizard state]

key-files:
  created:
    - src/state/idbStorage.ts
    - src/state/setupSessionStore.ts
    - src/ui/setup/SetupWizard.tsx
    - src/ui/setup/steps/PlayersStep.tsx
    - src/ui/setup/components/PlayerRow.tsx
  modified:
    - src/app/routes.tsx
    - e2e/setup-wizard.spec.ts
    - .planning/phases/02-setup-wizard-grimoire-capture/02-VALIDATION.md

key-decisions:
  - "Validate persisted setup data during Zustand merge and expose hydration failure as an ephemeral UI flag."
  - "Keep optional player profiles in session state only; bag generation remains independent of profiles."

patterns-established:
  - "Wizard steps remain on /setup and switch from persisted wizardStep state."
  - "Hydration blocks all interactive wizard controls until IndexedDB restore completes."

requirements-completed: [SETUP-01, SETUP-03, SETUP-05]

coverage:
  - id: D1
    description: Storyteller can confirm Trouble Brewing, enter five unique seated players, and reach Difficulty.
    requirement: SETUP-01
    verification:
      - kind: e2e
        ref: "e2e/setup-wizard.spec.ts#continues from Trouble Brewing through five players to Difficulty"
        status: pass
    human_judgment: false
  - id: D2
    description: Optional experience, age, and notes persist after navigating to Difficulty and back.
    requirement: SETUP-03
    verification:
      - kind: e2e
        ref: "e2e/setup-wizard.spec.ts#continues from Trouble Brewing through five players to Difficulty"
        status: pass
    human_judgment: false
  - id: D3
    description: Wizard step state stays on /setup and corrupt persisted state recovers to a fresh script step.
    requirement: SETUP-05
    verification:
      - kind: e2e
        ref: "e2e/setup-wizard.spec.ts#recovers a corrupt persisted session into a fresh wizard"
        status: pass
    human_judgment: false

duration: 14min
completed: 2026-07-16
status: complete
---

# Phase 02 Plan 02: Setup Roster Wizard Summary

**Phone-first script-to-roster wizard with validated IndexedDB persistence, optional player profiles, and a real Difficulty landing step**

## Performance

- **Duration:** 14 min
- **Started:** 2026-07-16T07:34:00Z
- **Completed:** 2026-07-16T07:48:01Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments

- Replaced `/setup` stub content with a shallow-route wizard covering script confirmation, roster capture, and Difficulty.
- Added persisted seating and profile state with a hydration interactivity gate and safe recovery from corrupt IndexedDB data.
- Enforced the 5–15 player count, trimmed-name uniqueness on Next, ordered seating controls, and confirm-before-remove behavior.
- Expanded Playwright coverage to verify profile persistence, duplicate rejection, empty roster behavior, default Standard difficulty, and hydrate failure recovery.

## Task Commits

Each task was committed atomically:

1. **Task 1: Setup session store + idbStorage adapter** - `dbb4199` (feat)
2. **Task 2: Script/players wizard UI + green roster E2E including SETUP-03** - `b20a8f9` (feat)

## Files Created/Modified

- `src/state/idbStorage.ts` - Zustand StateStorage adapter backed by idb-keyval.
- `src/state/setupSessionStore.ts` - Persisted setup state, validation, hydration flags, and roster actions.
- `src/ui/setup/SetupWizard.tsx` - Hydration-gated wizard step switch and recovery alert.
- `src/ui/setup/steps/ScriptStep.tsx` - Trouble Brewing confirmation step.
- `src/ui/setup/steps/PlayersStep.tsx` - Roster editing, validation, ordering, and removal flow.
- `src/ui/setup/steps/DifficultyStep.tsx` - Easy/Standard/Hard landing step with Standard default.
- `src/ui/setup/components/PlayerRow.tsx` - Inline player name, seating controls, and optional profiles.
- `src/ui/setup/components/ConfirmDialog.tsx` - Accessible confirm dialog with focus containment and Escape dismissal.
- `src/app/routes.tsx` - Mounts SetupWizard on `/setup`.
- `e2e/setup-wizard.spec.ts` - Roster, profiles, duplicates, and corrupt-session E2E gates.
- `.planning/phases/02-setup-wizard-grimoire-capture/02-VALIDATION.md` - Marks the plan 02 validation slice green.

## Decisions Made

- Persisted values are parsed with Zod before merging into the live store; malformed JSON and schema-invalid sessions both reset to fresh state while surfacing the required recovery copy.
- Hydration and error flags are ephemeral and excluded from persisted state.
- Blank profile fields are valid, notes are clamped to 200 characters, and profiles do not flow into bag generation.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed a duplicate accessible Trouble Brewing heading**
- **Found during:** Task 2 targeted Playwright verification
- **Issue:** The page title and confirm-card title both exposed heading semantics, causing strict accessible-role locators to resolve twice.
- **Fix:** Kept the page title as the sole heading and rendered the card title with heading typography but paragraph semantics.
- **Files modified:** `src/ui/setup/steps/ScriptStep.tsx`
- **Verification:** All 11 targeted Playwright tests pass.
- **Committed in:** `b20a8f9`

---

**Total deviations:** 1 auto-fixed (1 bug).
**Impact on plan:** Accessibility semantics and existing E2E compatibility improved without expanding scope.

## Issues Encountered

- Initial targeted Playwright run failed four tests due to the duplicate heading semantic; corrected and rerun green.

## Known Stubs

- `src/state/setupSessionStore.ts`: `bag: null` and empty `assignments` are intentional foundations for plans 02-03 and 02-04.
- `src/ui/setup/steps/DifficultyStep.tsx`: Next advances the persisted step to `bag`; plan 02-03 supplies the bag renderer and generator. The current plan's completed slice ends on Difficulty.

## User Setup Required

None - no external service configuration required.

## Verification

- `CURSOR_DEV=true nix develop -c npx playwright test e2e/setup-wizard.spec.ts e2e/stubs.spec.ts e2e/home.spec.ts` — 11 passed.
- `CURSOR_DEV=true nix develop -c npm run lint` — passed.
- `CURSOR_DEV=true nix develop -c npm run build` — passed.

## Next Phase Readiness

- Plan 02-03 can extend the persisted bag schema, wire generation to Difficulty Next, and render the bag step.
- No blockers for the next plan.

## Self-Check: PASSED

- All created files and task commits verified on disk and in git history.

---
*Phase: 02-setup-wizard-grimoire-capture*
*Completed: 2026-07-16*
