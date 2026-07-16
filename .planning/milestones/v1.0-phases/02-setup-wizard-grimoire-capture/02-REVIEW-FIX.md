---
phase: 02-setup-wizard-grimoire-capture
fixed_at: 2026-07-16T09:02:26Z
review_path: .planning/phases/02-setup-wizard-grimoire-capture/02-REVIEW.md
iteration: 1
findings_in_scope: 5
fixed: 5
skipped: 0
status: all_fixed
---

# Phase 02: Code Review Fix Report

**Fixed at:** 2026-07-16T09:02:26Z
**Source review:** `.planning/phases/02-setup-wizard-grimoire-capture/02-REVIEW.md`
**Iteration:** 1

**Summary:**
- Findings in scope: 5
- Fixed: 5
- Skipped: 0

## Fixed Issues

### CR-01: Empty storage hydration sets a false `hydrationError`

**Files modified:** `src/state/setupSessionStore.ts`, `e2e/setup-wizard.spec.ts`
**Commit:** 567b58b
**Applied fix:** Early-return `currentState` from persist `merge` when `persistedState == null` so empty IndexedDB / first visits no longer set `hydrationError`. Added E2E asserting a cold `/setup` visit does not show the restore-failure alert.

### WR-01: Role picker omits the selected player’s token when editing

**Files modified:** `src/ui/setup/steps/RecordStep.tsx`
**Commit:** a728470
**Applied fix:** Pass `selectedPlayerId` as `excludedPlayerId` into `remainingTokens` so the edited player’s physical token stays available in the picker.

### WR-02: `generateBag` can throw through the Difficulty CTA

**Files modified:** `src/ui/setup/steps/DifficultyStep.tsx`
**Commit:** bc7cc11
**Applied fix:** Guard player count (5–15) and wrap `generateBag()` in try/catch on “Next step”; surface a recoverable in-step alert and leave `bag` unchanged on failure.

### WR-03: Drunk truth is persisted but never shown after recording

**Files modified:** `src/ui/setup/steps/RecordStep.tsx`, `src/ui/setup/steps/NightReadyStep.tsx`
**Commit:** 87e446d
**Applied fix:** Record rows show “Drunk (believes {cover})” when `trueRoleId === 'drunk'`; Night ready summary adds a Drunk line with player name and cover role when present.

### WR-04: Semantic hydration does not validate assignment tokens against the bag

**Files modified:** `src/state/setupSessionSemantics.ts`, `src/state/setupSessionSemantics.test.ts`
**Commit:** ff35cda
**Status:** fixed: requires human verification
**Applied fix:** After roster/bag checks, reject assignments whose `bagRoleId` is not in the bag token multiset, and enforce Drunk cover ↔ `trueRoleId: 'drunk'` consistency. Added unit tests for invented tokens and missing Drunk truth.

## Skipped Issues

None — all in-scope findings were fixed.

Info findings (IN-01, IN-02, IN-03) were out of `critical_warning` fix scope and were not attempted.

---

_Fixed: 2026-07-16T09:02:26Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
