---
phase: 02-setup-wizard-grimoire-capture
reviewed: 2026-07-16T08:55:00Z
depth: standard
files_reviewed: 62
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
  - tests/prohibitions/_subject.mjs
  - tests/prohibitions/fixtures/auto-assign-record.bad.tsx
  - tests/prohibitions/fixtures/auto-assign-roster.bad.tsx
  - tests/prohibitions/fixtures/bag-legal.clean.json
  - tests/prohibitions/fixtures/bag-step-regenerate.bad.tsx
  - tests/prohibitions/fixtures/bag-with-drunk-token.bad.json
  - tests/prohibitions/fixtures/buildBag-with-profiles.bad.ts
  - tests/prohibitions/fixtures/hard-disable-start-night.bad.tsx
  - tests/prohibitions/fixtures/illegal-difficulty-mix.bad.ts
  - tests/prohibitions/fixtures/merge-without-semantics.bad.ts
  - tests/prohibitions/fixtures/night-ready-play-nav.bad.tsx
  - tests/prohibitions/fixtures/night-ready-premature-saved.bad.tsx
  - tests/prohibitions/fixtures/non-remaining-roles.bad.tsx
  - tests/prohibitions/fixtures/players-drag-drop.bad.tsx
  - tests/prohibitions/fixtures/session-bag-null-nightReady.bad.json
  - tests/prohibitions/fixtures/session-valid-minimal.clean.json
  - tests/prohibitions/fixtures/silent-bypass-start.bad.tsx
  - tests/prohibitions/fixtures/wizard-step-in-url.bad.tsx
  - tests/prohibitions/no-auto-assign-record.test.mjs
  - tests/prohibitions/no-auto-assign-roster.test.mjs
  - tests/prohibitions/no-drag-drop-seating.test.mjs
  - tests/prohibitions/no-drunk-in-bag-tokens.test.mjs
  - tests/prohibitions/no-hard-disable-start-night.test.mjs
  - tests/prohibitions/no-illegal-difficulty-mix.test.mjs
  - tests/prohibitions/no-impossible-session-merge.test.mjs
  - tests/prohibitions/no-non-remaining-roles.test.mjs
  - tests/prohibitions/no-play-navigation.test.mjs
  - tests/prohibitions/no-premature-saved-assurance.test.mjs
  - tests/prohibitions/no-profiles-in-bag-generation.test.mjs
  - tests/prohibitions/no-profiles-into-buildBag.test.mjs
  - tests/prohibitions/no-regenerate-manual-edit.test.mjs
  - tests/prohibitions/no-silent-bypass-start.test.mjs
  - tests/prohibitions/no-wizard-step-in-url.test.mjs
  - vitest.config.ts
findings:
  critical: 1
  warning: 4
  info: 3
  total: 8
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-07-16T08:55:00Z
**Depth:** standard
**Files Reviewed:** 62
**Status:** issues_found

## Summary

Reviewed production setup/grimoire paths under `src/` plus supporting e2e, unit, and prohibition fixtures. Domain bag validation, Drunk cover assignment, soft-gate Start night, and critical IndexedDB retry are largely coherent. One critical defect remains: empty IndexedDB hydration is treated as a corrupt restore, so every cold `/setup` visit shows the failure banner. Additional gaps: role-picker exclusion when editing, uncaught `buildBag` failures, Drunk truth not surfaced in UI, and semantic merge not checking assignment tokens against the bag.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: Empty storage hydration sets a false `hydrationError`

**File:** `src/state/setupSessionStore.ts:253-274`
**Issue:** Zustand persist always calls `merge(migratedState, currentState)` after `getItem`. When there is no stored session, `migratedState` is `undefined` (confirmed against `zustand/middleware` + a local empty-storage repro: `merge` receives `undefined`). `PersistedSetupSessionSchema.safeParse(undefined)` fails, so merge returns `freshSession()` with `hydrationError: true`. `onRehydrateStorage` preserves that flag. Every first visit (and every fresh browser context) shows “Couldn’t restore your setup…” even though nothing was lost. Corrupt-session E2Es assert the banner is present; happy-path E2Es never assert it is absent.
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
**Issue:** `remainingTokens` supports `excludedPlayerId` so a player’s current physical token stays in the pool while editing, and `assignRole` already passes `playerId` into that helper. The Record UI calls `remainingTokens(bag, assignments)` with no exclusion. When the bag is fully assigned, tapping a player yields an empty picker (only Clear works), contradicting D-14 (“change or clear”) and plan 02-04’s decision that the picker includes the edited player’s token.
**Fix:**
```tsx
remaining={remainingTokens(bag, assignments, selectedPlayerId ?? undefined)}
```

### WR-02: `generateBag` can throw through the Difficulty CTA

**File:** `src/state/setupSessionStore.ts:143-151`; `src/ui/setup/steps/DifficultyStep.tsx:57-62`
**Issue:** `buildBag` throws after failed validation retries (and immediately when the setup chart row is missing). `generateBag` does not catch, and Difficulty’s “Next step” invokes it directly. An unexpected catalog/chart edge case — or a hydrated early-step session with fewer than 5 players (semantics allow empty rosters on `difficulty`) — becomes an uncaught exception instead of an in-step error.
**Fix:** Catch inside `generateBag` (or the click handler), keep the user on Difficulty, and surface a short recoverable error (leave `bag` unchanged on failure). Optionally guard `playerCount` before calling `buildBag`.

### WR-03: Drunk truth is persisted but never shown after recording

**File:** `src/ui/setup/steps/RecordStep.tsx:72-78`; `src/ui/setup/steps/NightReadyStep.tsx:27-37`
**Issue:** `assignRole` correctly sets `trueRoleId: 'drunk'` when the cover token is recorded, but Record rows and Night ready only display `bagRoleId` / assignment counts. The Storyteller has no confirmation of who the Drunk is after logging the cover token, which is the point of persisting Drunk truth in this phase.
**Fix:** When `assignment.trueRoleId === 'drunk'`, show secondary copy such as “Drunk (believes {cover name})” on the player row and include a Drunk line in the Night ready summary when present.

### WR-04: Semantic hydration does not validate assignment tokens against the bag

**File:** `src/state/setupSessionSemantics.ts:102-111`
**Issue:** For downstream steps, semantics checks bag legality and that assignment keys/playerIds are on the roster, but never that `bagRoleId` / `trueRoleId` / `believedRoleId` are consistent with `bag.tokens` (or Drunk cover). A shape-valid, bag-valid `nightReady` blob with invented `bagRoleId` values merges successfully. That can strand Night ready / later coaching on a false grimoire without tripping the corrupt-restore path.
**Fix:** After the existing player/bag checks, reject when any assignment’s `bagRoleId` is not among remaining multiset counts from `bag.tokens`, and when Drunk cover assignments do not set `trueRoleId: 'drunk'` (or call `validateAssignments` and fail merge on hard invariants you choose to enforce at hydrate time).

## Info

### IN-01: Production test seam `__ST_FAIL_IDB_WRITES`

**File:** `src/state/idbStorage.ts:3-14,20-24`
**Issue:** Any script on the origin can flip this flag and force persist failures. Acceptable for E2E, but it is always compiled into the app bundle.
**Fix:** Gate the seam behind `import.meta.env.DEV` or a Playwright-only build define.

### IN-02: Unused `resetFresh` action

**File:** `src/state/setupSessionStore.ts:84,227`
**Issue:** `resetFresh` is defined on the store but never called from UI or tests. Dead surface area for a destructive session wipe.
**Fix:** Wire it to an intentional “start over” control, or remove until needed.

### IN-03: Empty-name validation reuses the duplicate-name alert copy

**File:** `src/ui/setup/steps/PlayersStep.tsx:20-28,87-90`
**Issue:** `next()` treats blank trimmed names and duplicate names as the same `duplicateError` flag, but the alert only mentions unique names. Empty names produce a misleading message.
**Fix:** Split empty vs duplicate errors (or broaden the copy to cover both).

---

_Reviewed: 2026-07-16T08:55:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
