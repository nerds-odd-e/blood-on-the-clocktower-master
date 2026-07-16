---
phase: 02-setup-wizard-grimoire-capture
plan: 06
subsystem: persistence
tags: [zustand, indexeddb, hydration, prohibitions, playwright, vitest, gap-closure]

requires:
  - phase: 02-setup-wizard-grimoire-capture
    provides: Setup wizard through Night ready with shape Zod persist merge
provides:
  - assertSetupSessionSemantics after Zod merge (G-01)
  - persistWriteStatus-gated Night ready saved assurance (G-02)
  - ConfirmDialog focus restore proven by Playwright (WR-01)
  - Drunk cover assignRole unit proof
  - Phase 2 test-tier prohibition check_* descriptors + node:test suite (G-03)
affects:
  - phase-02-verification
  - phase-03-night-coach

tech-stack:
  added: []
  patterns:
    - "Semantic validation after Zod shape parse on persist merge"
    - "Ephemeral persistWriteStatus with explicit awaitCriticalPersist"
    - "GSD_PROHIB_SUBJECT node:test fail-first prohibition guards"

key-files:
  created:
    - src/state/setupSessionSemantics.ts
    - src/state/persistStatus.ts
    - src/state/setupSessionSemantics.test.ts
    - src/state/setupSessionStore.assignRole.test.ts
    - src/state/setupSessionStore.persist.test.ts
    - tests/prohibitions/
  modified:
    - src/state/setupSessionStore.ts
    - src/state/idbStorage.ts
    - src/ui/setup/steps/NightReadyStep.tsx
    - src/ui/setup/SetupWizard.tsx
    - src/ui/setup/components/ConfirmDialog.tsx
    - e2e/setup-wizard.spec.ts
    - e2e/setup-record.spec.ts
    - .planning/phases/02-setup-wizard-grimoire-capture/02-02-PLAN.md
    - .planning/phases/02-setup-wizard-grimoire-capture/02-03-PLAN.md
    - .planning/phases/02-setup-wizard-grimoire-capture/02-04-PLAN.md
    - .planning/phases/02-setup-wizard-grimoire-capture/02-05-PLAN.md
    - .planning/phases/02-setup-wizard-grimoire-capture/02-VALIDATION.md
    - package.json

key-decisions:
  - "Semantic failures reuse the same hydrationError + Couldn’t restore your setup path as Zod failures"
  - "Critical Night ready durability uses awaitCriticalPersist against the same partialize envelope as Zustand persist"
  - "IDB write failure seam for E2E is window.__ST_FAIL_IDB_WRITES on idbStorage.setItem"
  - "All 13 prior test-tier prohibitions wired as node-test (none re-authored to judgment)"

patterns-established:
  - "Pattern: persist merge = Zod shape then assertSetupSessionSemantics then accept"
  - "Pattern: Night ready assurance copy branches on persistWriteStatus (saving|saved|error+Retry)"
  - "Pattern: prohibition guards under tests/prohibitions with GSD_PROHIB_SUBJECT injection"

requirements-completed: [SETUP-05, GRIM-01, GRIM-02, SETUP-04]

coverage:
  - id: D1
    description: Shape-valid impossible sessions recover to a fresh wizard with hydrate error copy
    requirement: SETUP-05
    verification:
      - kind: unit
        ref: src/state/setupSessionSemantics.test.ts#rejects bag/deal/record/nightReady when bag is null
        status: pass
      - kind: e2e
        ref: e2e/setup-wizard.spec.ts#recovers shape-valid nightReady with null bag
        status: pass
    human_judgment: false
  - id: D2
    description: Assignments are saved only after durable IndexedDB write success; Retry on failure
    requirement: GRIM-02
    verification:
      - kind: unit
        ref: src/state/setupSessionStore.persist.test.ts#sets persistWriteStatus to error when the critical write rejects
        status: pass
      - kind: e2e
        ref: e2e/setup-record.spec.ts#withholds saved assurance when the critical IndexedDB write fails, then retries
        status: pass
    human_judgment: false
  - id: D3
    description: Drunk cover assignRole persists trueRoleId drunk and believedRoleId cover
    requirement: GRIM-01
    verification:
      - kind: unit
        ref: src/state/setupSessionStore.assignRole.test.ts#persists trueRoleId drunk and believedRoleId equal to the cover bagRoleId
        status: pass
    human_judgment: false
  - id: D4
    description: ConfirmDialog restores focus to Start night after soft-gate dismiss
    requirement: GRIM-02
    verification:
      - kind: e2e
        ref: e2e/setup-record.spec.ts#restores focus to Start night after soft-gate Keep recording
        status: pass
    human_judgment: false
  - id: D5
    description: Phase 2 test-tier prohibitions carry check_kind/check_target/check_violation_fixture
    requirement: SETUP-04
    verification:
      - kind: other
        ref: npm run test:prohibitions
        status: pass
    human_judgment: false

duration: 6min
completed: 2026-07-16
status: complete
---

# Phase 02 Plan 06: Persisted Session Integrity Summary

**Gap closure for semantic hydration recovery, truthful Night ready save assurance, Drunk assign proof, dialog focus restore, and enforceable prohibition fixtures.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-07-16T08:35:25Z
- **Completed:** 2026-07-16T08:42:16Z
- **Tasks:** 3
- **Files modified:** ~45 (including prohibition fixtures)

## Accomplishments

- Impossible shape-valid persisted sessions (null bag on nightReady, roster/bag mismatch) reset via `assertSetupSessionSemantics` with the existing hydrate recovery copy
- Night ready shows “Assignments are saved” only when `persistWriteStatus === 'saved'`; saving/error+Retry for pending/failed critical writes
- Drunk cover assignment unit-proven; ConfirmDialog focus restore proven after Keep recording
- All 13 prior test-tier prohibitions plus this plan’s two guards wired with `check_*` scalars and `tests/prohibitions` node:test suite

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Semantic hydration + Drunk tests** - `da4371a` (test)
2. **Task 1 GREEN: Semantic merge + E2E recovery** - `115e22b` (feat)
3. **Task 2 RED: Durable save + focus tests** - `2d7f1d2` (test)
4. **Task 2 GREEN: persistWriteStatus + focus restore** - `d79706a` (feat)
5. **Task 3: Prohibition fixtures and descriptors** - `3add338` (feat)

**Plan metadata:** (pending docs commit)

_Note: TDD tasks used RED → GREEN commits_

## Files Created/Modified

- `src/state/setupSessionSemantics.ts` — CR-01 cross-field semantic validation
- `src/state/setupSessionStore.ts` — merge wiring; `persistWriteStatus`; `awaitCriticalPersist` / `advanceToNightReady`
- `src/state/idbStorage.ts` — `__ST_FAIL_IDB_WRITES` E2E seam
- `src/ui/setup/steps/NightReadyStep.tsx` — gated saved/saving/error+Retry copy
- `src/ui/setup/components/ConfirmDialog.tsx` — restore prior focus on unmount
- `e2e/setup-wizard.spec.ts` / `e2e/setup-record.spec.ts` — recovery, failed-write, focus restore
- `tests/prohibitions/**` — 15 node:test guards + known-bad/clean fixtures
- Plans `02-02`–`02-05` frontmatter — `check_*` scalars only (task XML unchanged)

## Decisions Made

- Semantic failures share Zod’s `hydrationError` recovery path (no separate UI)
- Critical persist serializes the same partialize envelope (`{state,version}`) under `st-copilot-setup-session`
- Prefer full node-test descriptors over judgment re-author for all 13 prior test-tier items

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] IndexedDB undefined in Vitest when exercising Zustand persist store**
- **Found during:** Task 1 (assignRole Drunk test)
- **Issue:** Store `setState`/`assignRole` triggered `idb-keyval` without IndexedDB in node
- **Fix:** `vi.mock('./idbStorage')` in assignRole and persist unit tests
- **Files modified:** `src/state/setupSessionStore.assignRole.test.ts`, `src/state/setupSessionStore.persist.test.ts`
- **Committed in:** `da4371a`, `2d7f1d2`/`d79706a`

**2. [Rule 1 - Bug] `mockRejectedValueOnce` consumed by middleware before critical write**
- **Found during:** Task 2 (persist unit test)
- **Issue:** Status flip to `saving` triggered another `setItem`; Once mock was spent
- **Fix:** Reject all `setItem` calls in the error case
- **Files modified:** `src/state/setupSessionStore.persist.test.ts`
- **Committed in:** `d79706a`

**3. [Rule 3 - Blocking] Plan verify `node --test tests/prohibitions` does not discover tests on Node 24**
- **Found during:** Task 3
- **Issue:** Directory path is treated as a module, not a test glob
- **Fix:** Added `npm run test:prohibitions` → `node --test 'tests/prohibitions/**/*.test.mjs'`; documented as sampling command in VALIDATION.md
- **Files modified:** `package.json`, `02-VALIDATION.md`
- **Committed in:** `3add338`

---

**Total deviations:** 3 auto-fixed (Rules 1 + 3)
**Impact on plan:** Correctness/testability only; no scope creep

## Issues Encountered

None beyond the auto-fixed deviations above.

## Threat Flags

None — new surfaces match plan threat model (T-02-16 merge semantics, T-02-17/T-02-19 persist status). `__ST_FAIL_IDB_WRITES` is a test-only window flag with no network exposure.

## Known Stubs

None — no placeholder/TODO stubs that block the plan goal.

## TDD Gate Compliance

- Task 1: RED `da4371a` → GREEN `115e22b` (Drunk assign already implemented; semantic RED was substantive)
- Task 2: RED `2d7f1d2` → GREEN `d79706a`

## Fail-first spot-check (Task 3)

- `GSD_PROHIB_SUBJECT=tests/prohibitions/fixtures/night-ready-premature-saved.bad.tsx` → `no-premature-saved-assurance` RED
- `GSD_PROHIB_SUBJECT=tests/prohibitions/fixtures/session-bag-null-nightReady.bad.json` → `no-impossible-session-merge` RED

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 02 gap blockers G-01/G-02/G-03 are closed for re-verification. Phone overflow backstops and judgment-tier prohibitions remain human/backstop per VERIFICATION. Ready for `/gsd-verify-work` or phase transition after verifier pass.

---
*Phase: 02-setup-wizard-grimoire-capture*
*Completed: 2026-07-16*

## Self-Check: PASSED
