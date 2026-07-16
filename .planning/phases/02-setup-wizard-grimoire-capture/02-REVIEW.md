---
phase: 02-setup-wizard-grimoire-capture
reviewed: 2026-07-16T08:45:00Z
depth: standard
files_reviewed: 32
files_reviewed_list:
  - e2e/home.spec.ts
  - e2e/offline.spec.ts
  - e2e/setup-record.spec.ts
  - e2e/setup-wizard.spec.ts
  - e2e/stubs.spec.ts
  - package.json
  - src/app/routes.tsx
  - src/domain/bag/buildBag.test.ts
  - src/domain/bag/buildBag.ts
  - src/domain/bag/validateBag.ts
  - src/domain/grimoire/validateAssignments.test.ts
  - src/domain/grimoire/validateAssignments.ts
  - src/state/idbStorage.ts
  - src/state/persistStatus.ts
  - src/state/setupSessionSemantics.test.ts
  - src/state/setupSessionSemantics.ts
  - src/state/setupSessionStore.assignRole.test.ts
  - src/state/setupSessionStore.persist.test.ts
  - src/state/setupSessionStore.ts
  - src/ui/setup/SetupWizard.tsx
  - src/ui/setup/components/ConfirmDialog.tsx
  - src/ui/setup/components/PlayerRow.tsx
  - src/ui/setup/components/RolePicker.tsx
  - src/ui/setup/steps/BagStep.tsx
  - src/ui/setup/steps/DealStep.tsx
  - src/ui/setup/steps/DifficultyStep.tsx
  - src/ui/setup/steps/NightReadyStep.tsx
  - src/ui/setup/steps/PlayersStep.tsx
  - src/ui/setup/steps/RecordStep.tsx
  - src/ui/setup/steps/ScriptStep.tsx
  - tests/prohibitions/_subject.mjs
  - vitest.config.ts
findings:
  critical: 1
  warning: 3
  info: 2
  total: 6
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-07-16T08:45:00Z
**Depth:** standard
**Files Reviewed:** 32
**Status:** issues_found

## Summary

Prior review blockers (semantic hydration, IndexedDB save assurance, dialog focus restore) appear addressed in the current tree via `assertSetupSessionSemantics`, `persistWriteStatus` / `awaitCriticalPersist`, and `ConfirmDialog` focus cleanup. A new critical defect remains: empty IndexedDB hydration is misclassified as a corrupt restore, so first-time and cleared-storage visits always show the failure banner. Role reassignment when the bag is fully assigned, uncaught `buildBag` failures, and missing Drunk identity in the record UI are additional quality gaps.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: Empty storage hydration sets a false `hydrationError`

**File:** `src/state/setupSessionStore.ts:253-274`
**Issue:** Zustand persist always calls `merge(migratedState, currentState)` after `getItem`. When there is no stored session, `migratedState` is `undefined` (see `zustand/middleware.js` hydrate path returning `[false, void 0]`). `PersistedSetupSessionSchema.safeParse(undefined)` fails, so merge returns `freshSession()` with `hydrationError: true`. `onRehydrateStorage` then keeps that flag. Every first visit (and every browser context with empty IDB) shows “Couldn’t restore your setup…” even though nothing was lost. Corrupt-session E2Es assert the banner is present, but happy-path E2Es never assert it is absent, so this ships unnoticed.
**Fix:**
```ts
merge: (persistedState, currentState) => {
  if (persistedState == null) {
    return currentState
  }
  const parsed = PersistedSetupSessionSchema.safeParse(persistedState)
  if (!parsed.success) {
    return {
      ...currentState,
      ...freshSession(),
      hydrationError: true,
    }
  }
  // ... existing semantics check ...
}
```
Add an E2E (or unit test of merge) that a cold `/setup` visit does **not** show the restore-failure alert.

## Warnings

### WR-01: Role picker omits the selected player’s token when editing

**File:** `src/ui/setup/steps/RecordStep.tsx:84-86`
**Issue:** `remainingTokens` supports `excludedPlayerId` so a player’s current physical token stays in the pool while editing, and `assignRole` already passes `playerId` into that helper. The Record UI calls `remainingTokens(bag, assignments)` with no exclusion. When the bag is fully assigned, tapping a player yields an empty picker (only Clear works), contradicting D-14 (“change or clear”) and plan 02-04’s key decision that the picker includes the edited player’s token.
**Fix:**
```tsx
remaining={remainingTokens(bag, assignments, selectedPlayerId ?? undefined)}
```

### WR-02: `generateBag` can throw through the Difficulty CTA

**File:** `src/state/setupSessionStore.ts:143-151`; `src/ui/setup/steps/DifficultyStep.tsx:57-62`
**Issue:** `buildBag` throws after failed validation retries (and immediately when the setup chart row is missing). `generateBag` does not catch, and Difficulty’s “Next step” invokes it directly. An unexpected catalog/chart edge case becomes an uncaught render-tree exception instead of an in-step error.
**Fix:** Catch inside `generateBag` (or the click handler), keep the user on Difficulty, and surface a short recoverable error (and optionally keep `bag` unchanged).

### WR-03: Drunk truth is persisted but never shown after recording

**File:** `src/ui/setup/steps/RecordStep.tsx:72-78`; `src/ui/setup/steps/NightReadyStep.tsx:27-37`
**Issue:** `assignRole` correctly sets `trueRoleId: 'drunk'` when the cover token is recorded, but Record rows and Night ready only display `bagRoleId` / assignment counts. The Storyteller has no confirmation of who the Drunk is after logging the cover token, which is the point of persisting Drunk truth in this phase.
**Fix:** When `assignment.trueRoleId === 'drunk'`, show secondary copy such as “Drunk (believes {cover name})” on the player row and include a Drunk line in the Night ready summary when present.

## Info

### IN-01: Production test seam `__ST_FAIL_IDB_WRITES`

**File:** `src/state/idbStorage.ts:3-14,20-24`
**Issue:** Any script on the origin can flip this flag and force persist failures. Acceptable for E2E, but it is always compiled into the app bundle.
**Fix:** Gate the seam behind `import.meta.env.DEV` or a Playwright-only build define.

### IN-02: Unused `resetFresh` action

**File:** `src/state/setupSessionStore.ts:84,227`
**Issue:** `resetFresh` is defined on the store but never called from UI or tests. Dead surface area for a destructive session wipe.
**Fix:** Wire it to an intentional “start over” control, or remove until needed.

---

_Reviewed: 2026-07-16T08:45:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
