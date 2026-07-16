---
phase: 02-setup-wizard-grimoire-capture
plan: 01
subsystem: testing
tags: [zustand, idb-keyval, vitest, playwright, setup-wizard]

requires:
  - phase: 01-phone-shell-tb-catalog
    provides: Phone-first Vite/React shell, Trouble Brewing catalog, and Playwright preview server
provides:
  - Zustand and idb-keyval runtime dependencies for persisted setup sessions
  - Node-environment Vitest configuration for domain tests
  - RED Playwright roster path from home through five players to Difficulty
  - Script-step expectations for setup and home route smoke tests
affects:
  - 02-02 wizard shell and roster implementation
  - Phase 2 bag and grimoire domain testing

tech-stack:
  added: [zustand@5.0.14, idb-keyval@6.3.0, vitest@4.1.10]
  patterns:
    - Node-only Vitest domain tests under src/**/*.test.ts
    - Playwright setup flows use real bundled Trouble Brewing data without JSON imports

key-files:
  created:
    - vitest.config.ts
    - e2e/setup-wizard.spec.ts
  modified:
    - package.json
    - package-lock.json
    - e2e/stubs.spec.ts
    - e2e/home.spec.ts
    - .planning/phases/02-setup-wizard-grimoire-capture/02-VALIDATION.md

key-decisions:
  - "Vitest runs in node and includes src/**/*.test.ts for pure Phase 2 domain tests"
  - "The roster E2E deliberately stays RED until 02-02 replaces SetupStub with the wizard"

patterns-established:
  - "Wave 0 browser gate: write the real-data happy path before production wizard UI"
  - "Setup route smoke copy follows UI-SPEC: Trouble Brewing, Continue setup, Back to home"

requirements-completed: [SETUP-01, SETUP-05]

coverage:
  - id: D1
    description: Session persistence and unit-test dependencies are installed with a Node Vitest runner
    requirement: SETUP-01
    verification:
      - kind: other
        ref: "CURSOR_DEV=true nix develop -c npx vitest --version"
        status: pass
    human_judgment: false
  - id: D2
    description: Phone roster E2E specifies script confirmation, five named players, and arrival at Difficulty
    requirement: SETUP-05
    verification:
      - kind: e2e
        ref: "e2e/setup-wizard.spec.ts#continues from Trouble Brewing through five players to Difficulty (expected RED until 02-02)"
        status: pass
    human_judgment: false

duration: 9min
completed: 2026-07-16
status: complete
---

# Phase 02 Plan 01: Wave 0 Setup Wizard Test Stack Summary

**Zustand/IndexedDB persistence dependencies, Node Vitest configuration, and an intentional RED phone roster path prepare the real setup wizard implementation.**

## Performance

- **Duration:** ~9 min
- **Started:** 2026-07-16T07:35:01Z
- **Completed:** 2026-07-16T07:44:00Z
- **Tasks:** 2 completed
- **Files modified:** 7

## Accomplishments

- Installed `zustand`, `idb-keyval`, and `vitest`, including `test:unit` and a Node-only `vitest.config.ts`
- Added the 390×844 RED Playwright path: Start setup → Continue setup → five unique players → Difficulty
- Rewrote `/setup` expectations in stub/home smoke tests to the UI-SPEC script-step contract while keeping `/play` unchanged

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Wave 0 deps and Vitest config** - `0962ad7` (chore)
2. **Task 2: RED wizard E2E + stub/home expectation rewrite** - `57136b5` (test)

## Files Created/Modified

- `vitest.config.ts` — Node Vitest runner for `src/**/*.test.ts`
- `e2e/setup-wizard.spec.ts` — RED phone roster happy path through Difficulty
- `e2e/stubs.spec.ts` — setup script-step expectations; play stub retained
- `e2e/home.spec.ts` — Start setup now expects script-step copy
- `package.json` / `package-lock.json` — session dependencies, Vitest, and `test:unit`
- `.planning/phases/02-setup-wizard-grimoire-capture/02-VALIDATION.md` — Wave 0 dependency and RED E2E progress

## Decisions Made

- Kept Vitest scoped to pure TypeScript domain tests in a Node environment; browser behavior remains Playwright-owned.
- Treated the Playwright non-zero result as the required RED proof: it fails at the absent `Trouble Brewing` wizard heading, exactly where plan 02-02 begins.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. The setup-wizard Playwright failure is intentional and required by this Wave 0 plan.

## TDD Gate Compliance

- Task 1 verified the installed Vitest runner (`vitest/4.1.10`) and configuration contract.
- Task 2 produced the required failing E2E before wizard implementation; failure is at the missing script-step heading, not test infrastructure.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 02-02 can implement the persisted wizard shell and green the script → players → Difficulty path.
- Domain test rows remain pending for bag and grimoire plans as specified by VALIDATION.md.

## Self-Check: PASSED

---
*Phase: 02-setup-wizard-grimoire-capture*
*Completed: 2026-07-16*
