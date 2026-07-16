---
phase: 02-setup-wizard-grimoire-capture
plan: 04
subsystem: domain-ui
tags: [react, zustand, vitest, playwright, grimoire]

requires:
  - phase: 02-setup-wizard-grimoire-capture
    provides: Legal persisted physical bag tokens and Drunk cover metadata from plan 02-03
provides:
  - Structured assignment validation for the soft night gate
  - Physical deal coaching followed by seat-ordered role recording
  - Remaining-token picker with clear restoration and Drunk truth metadata
affects: [02-05-night-ready, phase-03-night-coach]

tech-stack:
  added: []
  patterns: [physical-token assignment multiset, store-enforced remaining-token selection, Drunk cover truth mapping]

key-files:
  created:
    - src/domain/grimoire/validateAssignments.ts
    - src/ui/setup/steps/DealStep.tsx
    - src/ui/setup/steps/RecordStep.tsx
    - src/ui/setup/components/RolePicker.tsx
    - e2e/setup-record.spec.ts
  modified:
    - src/state/setupSessionStore.ts
    - src/ui/setup/SetupWizard.tsx

key-decisions:
  - "Derive the visible role picker from the globally unassigned physical bag-token multiset, including when editing an assigned player."
  - "Persist both true Drunk identity and the Townsfolk role the player believes when its physical cover token is recorded."

patterns-established:
  - "Assignment records use bagRoleId as the physical-token identity; trueRoleId and believedRoleId preserve character knowledge separately."
  - "The store rejects assignment attempts for players or token occurrences outside the current bag's remaining multiset."

requirements-completed: [GRIM-01, SETUP-05]

coverage:
  - id: D1
    description: Assignment validation reports unassigned players, duplicate physical tokens, and bag-token multiset mismatches without throwing.
    requirement: GRIM-01
    verification:
      - kind: unit
        ref: "src/domain/grimoire/validateAssignments.test.ts#validateAssignments"
        status: pass
    human_judgment: false
  - id: D2
    description: The wizard coaches a physical random deal and advances only through the locked deal-to-record sequence.
    requirement: SETUP-05
    verification:
      - kind: e2e
        ref: "e2e/setup-record.spec.ts#reachRecordStep"
        status: pass
    human_judgment: false
  - id: D3
    description: Storytellers assign roles from remaining bag tokens only and clearing a role restores its picker chip.
    requirement: GRIM-01
    verification:
      - kind: e2e
        ref: "e2e/setup-record.spec.ts#assigns only remaining bag roles and Clear role restores a chip"
        status: pass
    human_judgment: false

duration: 5min
completed: 2026-07-16
status: complete
---

# Phase 02 Plan 04: Deal Coaching and Grimoire Recording Summary

**Physical deal coaching and seat-ordered grimoire capture backed by a store-enforced remaining-token multiset**

## Performance

- **Duration:** 5 min
- **Started:** 2026-07-16T08:00:00Z
- **Completed:** 2026-07-16T08:05:30Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Added a non-throwing assignment validator with structured issues for missing players, duplicate physical tokens, and bag multiset mismatches.
- Added the short physical Deal coaching step and the seat-ordered Record roles step without any automatic role dealing.
- Added a team-grouped remaining-token picker whose assignment and clear actions preserve Drunk cover knowledge correctly.

## Task Commits

Each task was committed atomically:

1. **Task 1: validateAssignments domain + RED record E2E** - `c9de92f` (test)
2. **Task 2: Deal + Record UI with remaining-token picker** - `05353f9` (feat)

## Files Created/Modified

- `src/domain/grimoire/types.ts` - Assignment, issue, and validator session contracts.
- `src/domain/grimoire/validateAssignments.ts` - Physical token multiset validator for soft-gate consumers.
- `src/domain/grimoire/validateAssignments.test.ts` - Clean, missing, duplicate, and mismatch coverage.
- `src/domain/grimoire/index.ts` - Grimoire domain exports.
- `src/state/setupSessionStore.ts` - Typed persisted assignments, remaining-token helper, and guarded assign/clear actions.
- `src/ui/setup/steps/DealStep.tsx` - Physical random-deal coaching card.
- `src/ui/setup/steps/RecordStep.tsx` - Seat-ordered player assignment list and picker integration.
- `src/ui/setup/components/RolePicker.tsx` - Inline, team-grouped remaining-token chips and Clear role control.
- `src/ui/setup/SetupWizard.tsx` - Locked deal and record step mounts.
- `e2e/setup-record.spec.ts` - Real-preview assign-all and clear-restoration proof.
- `.planning/phases/02-setup-wizard-grimoire-capture/02-VALIDATION.md` - GRIM-01 Wave 4 coverage marked green.

## Decisions Made

- Editing an assigned player still shows only globally unassigned tokens. Their current token remains absent until Clear role returns it, matching D-13 literally.
- Assignment mutations are guarded in the store as well as filtered in the UI, so stale or forged clicks cannot consume a non-remaining token occurrence.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Verification

- `CURSOR_DEV=true nix develop -c npm run test:unit` — 39 passed.
- `CURSOR_DEV=true nix develop -c npx playwright test e2e/setup-wizard.spec.ts e2e/setup-record.spec.ts` — 4 passed.
- `CURSOR_DEV=true nix develop -c npm run lint` — passed.
- `CURSOR_DEV=true nix develop -c npm run build` — passed.

## Next Phase Readiness

- Plan 02-05 can consume `validateAssignments` to implement the soft Start night gate and Night ready summary.
- No blockers for the next plan.

## Self-Check: PASSED

- All created artifacts, task commits, acceptance criteria, and plan-level verification commands were confirmed.

---
*Phase: 02-setup-wizard-grimoire-capture*
*Completed: 2026-07-16*
