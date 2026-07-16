---
phase: 02-setup-wizard-grimoire-capture
reviewed: 2026-07-16T08:17:18Z
depth: standard
files_reviewed: 24
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
  - vitest.config.ts
findings:
  critical: 2
  warning: 1
  info: 0
  total: 3
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-07-16T08:17:18Z
**Depth:** standard
**Files Reviewed:** 24
**Status:** issues_found

## Summary

The bag construction and normal setup path are internally consistent and the unit suite, production build, and lint all pass. The release is nevertheless exposed to two data-integrity failures: shape-valid but semantically impossible persisted sessions can strand the wizard on a blank or unusable step, and failed IndexedDB writes are presented to the Storyteller as successfully saved. The confirmation dialog also loses keyboard focus when it closes.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01 [BLOCKER]: Shape-only hydration accepts impossible sessions that strand the wizard

**File:** `src/state/setupSessionStore.ts:50-56,222-231`
**Issue:** `PersistedSetupSessionSchema` validates individual field shapes but not relationships between them. It accepts, for example, `{ wizardStep: "bag", bag: null }` or `{ wizardStep: "nightReady", bag: null }`; both hydrate successfully, after which `BagStep` or `NightReadyStep` returns `null` and the user sees a blank setup route. It also accepts a record step without a bag, duplicate player IDs, a bag whose token count differs from the roster, assignment record keys that do not match `assignment.playerId`, and bags that fail `validateBag`. These are realistic partial-write/schema-drift corruption cases, but because parsing succeeds the documented fresh-session recovery is never invoked.
**Fix:** Add semantic validation after Zod parsing and before merging. At minimum, require a legal 5–15 named/unique-ID roster for downstream steps, require and `validateBag` the bag for `bag`/`deal`/`record`/`nightReady`, require `bag.tokens.length === players.length`, and require every assignment key and `playerId` to identify the same current player. If any invariant fails, merge `freshSession()` and set `hydrationError: true`. Add corrupt-persistence E2E cases for a shape-valid missing bag and a mismatched roster/bag, not only invalid JSON.

### CR-02 [BLOCKER]: IndexedDB write failures are ignored while the UI claims assignments are saved

**File:** `src/state/idbStorage.ts:8-10`; `src/state/setupSessionStore.ts:115-246`; `src/ui/setup/steps/NightReadyStep.tsx:37-40`
**Issue:** `idbStorage.setItem` correctly rejects when IndexedDB is unavailable, quota-exhausted, or aborts, but the store has no write-error state and none of the state transitions await or surface persistence completion. The Night ready screen then unconditionally says “Assignments are saved.” A Storyteller can complete role capture, see that assurance, reload or have the tab killed, and lose the grimoire without any warning. This is a direct data-loss risk in the app's core offline workflow.
**Fix:** Track persistence status (`saving | saved | error`) around durable writes, prevent the saved assurance until the latest session revision has committed, and show a blocking retry/error state when a write rejects. One practical approach is an explicit repository/save function that awaits `idbStorage.setItem` for critical transitions such as Start night, rather than relying only on fire-and-forget persist middleware. Exercise the failure path in a browser test by injecting an aborting storage adapter or failing `setItem` seam.

## Warnings

### WR-01 [WARNING]: Closing a confirmation dialog does not restore focus to its trigger

**File:** `src/ui/setup/components/ConfirmDialog.tsx:27-51`
**Issue:** The dialog moves focus to its dismiss button and traps Tab, but cleanup only removes the key listener. Dismiss, confirm, Escape, or backdrop close leaves focus on a DOM node that has been removed, so keyboard and assistive-technology users lose their place in the roster/recording flow.
**Fix:** Capture `document.activeElement` before focusing the dialog and restore it during cleanup (when still connected), or pass a trigger ref and focus it after either close path. Add a component or E2E assertion that focus returns to the Remove/Start night trigger after dismissal.

---

_Reviewed: 2026-07-16T08:17:18Z_
_Reviewer: the agent (gsd-code-reviewer; generic-agent workaround)_
_Depth: standard_
