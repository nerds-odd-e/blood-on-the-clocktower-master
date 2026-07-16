---
phase: 02-setup-wizard-grimoire-capture
plan: 03
subsystem: domain-ui
tags: [react, zustand, vitest, playwright, bag-builder]

requires:
  - phase: 02-setup-wizard-grimoire-capture
    provides: Persisted roster, player count, difficulty, and shallow setup wizard from plan 02-02
provides:
  - Pure validated Trouble Brewing bag generation for every supported table size and difficulty
  - Persisted Easy, Standard, and Hard selection with private team-grouped bag review
  - Deterministic Baron and Drunk legality coverage plus wizard E2E through bag acceptance
affects: [02-04-role-recording, 02-05-night-ready, phase-03-night-coach]

tech-stack:
  added: []
  patterns: [pure injected-RNG domain builder, fail-closed bag validation, physical-token Drunk cover model]

key-files:
  created:
    - src/domain/bag/buildBag.ts
    - src/domain/bag/validateBag.ts
    - src/domain/bag/buildBag.test.ts
    - src/ui/setup/steps/BagStep.tsx
  modified:
    - src/state/setupSessionStore.ts
    - src/ui/setup/steps/DifficultyStep.tsx
    - src/ui/setup/SetupWizard.tsx
    - e2e/setup-wizard.spec.ts

key-decisions:
  - "Represent the Drunk as true Outsider composition metadata while placing one otherwise-unused Townsfolk cover token in the physical bag."
  - "Generate bags inside the setup store from only player count, difficulty, and the validated catalog; optional player profiles never cross the builder boundary."

patterns-established:
  - "All generated bags pass validateBag before they can enter persisted setup state."
  - "Backing out of private bag review clears bag and assignment state before returning to difficulty."

requirements-completed: [SETUP-02, SETUP-04]

coverage:
  - id: D1
    description: Legal Trouble Brewing bags are generated for every player count from 5 through 15 and every difficulty, including Baron and Drunk setup rules.
    requirement: SETUP-04
    verification:
      - kind: unit
        ref: "src/domain/bag/buildBag.test.ts#buildBag"
        status: pass
    human_judgment: false
  - id: D2
    description: Storytellers can keep Standard or select Easy or Hard, review the complete private bag by team, and accept it without regenerate or manual-edit controls.
    requirement: SETUP-02
    verification:
      - kind: e2e
        ref: "e2e/setup-wizard.spec.ts#continues from Trouble Brewing through five players to Difficulty"
        status: pass
    human_judgment: false

duration: 6min
completed: 2026-07-16
status: complete
---

# Phase 02 Plan 03: Legal Bag Builder and Review Summary

**Difficulty-weighted legal Trouble Brewing bags with fail-closed validation, persisted generation, and a private phone-first review step**

## Performance

- **Duration:** 6 min
- **Started:** 2026-07-16T07:50:44Z
- **Completed:** 2026-07-16T07:56:05Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments

- Added a pure injected-RNG bag builder and validator that proves legal bags across all 33 player-count/difficulty combinations, including explicit Baron and Drunk fixtures.
- Wired Standard-default difficulty selection to persisted legal bag generation using player count and difficulty only.
- Added a private, team-grouped physical token review with setup notes, difficulty rationale, Back-to-clear behavior, and Accept bag progression.

## Task Commits

Each task was committed atomically:

1. **Task 1: Legal bag domain + Vitest matrix** - `fe6fa40` (feat)
2. **Task 2: Difficulty + bag review UI wired to buildBag** - `039b0d7` (feat)

## Files Created/Modified

- `src/domain/bag/buildBag.ts` - Difficulty-weighted legal bag pipeline with capped validation attempts.
- `src/domain/bag/validateBag.ts` - Physical-token, true-composition, chart, Baron, Imp, and Drunk invariants.
- `src/domain/bag/heuristics.ts` - Legal role preference weights and locked why-this-bag copy.
- `src/domain/bag/types.ts` - Difficulty, bag plan, build input, and validation contracts.
- `src/domain/bag/buildBag.test.ts` - Full 5–15 × three-difficulty matrix and deterministic setup fixtures.
- `src/state/setupSessionStore.ts` - Validated persisted BagPlan plus generate and clear actions.
- `src/ui/setup/steps/DifficultyStep.tsx` - Difficulty selection now generates before entering bag review.
- `src/ui/setup/steps/BagStep.tsx` - Private team-grouped physical bag list and acceptance controls.
- `src/ui/setup/SetupWizard.tsx` - Renders the new bag step.
- `e2e/setup-wizard.spec.ts` - Default Standard, Easy/Hard selection, privacy, and Accept bag coverage.
- `.planning/phases/02-setup-wizard-grimoire-capture/02-VALIDATION.md` - Marks SETUP-02 and SETUP-04 automated gates green.

## Decisions Made

- Drunk uses an unused Townsfolk physical cover token while remaining an Outsider in `BagPlan.composition`; this keeps role recording aligned with what players actually draw.
- Difficulty changes weighted role preferences only. It cannot change chart team counts, and profiles are excluded from `BuildBagInput` by type.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Verification

- `CURSOR_DEV=true nix develop -c npx vitest run src/domain/bag` — 36 passed.
- `CURSOR_DEV=true nix develop -c npx playwright test e2e/setup-wizard.spec.ts` — 3 passed.
- `CURSOR_DEV=true nix develop -c npm run lint` — passed.
- `CURSOR_DEV=true nix develop -c npm run build` — passed.

## Next Phase Readiness

- Plan 02-04 can consume the persisted physical token multiset and Drunk cover metadata to build remaining-token role recording.
- No blockers for the next plan.

## Self-Check: PASSED

- All plan artifacts, task commits, acceptance criteria, and verification commands were confirmed.

---
*Phase: 02-setup-wizard-grimoire-capture*
*Completed: 2026-07-16*
