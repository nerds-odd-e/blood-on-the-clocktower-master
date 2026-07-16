---
phase: 03-night-coach-live-grimoire
fixed_at: 2026-07-16T10:15:07.020Z
review_path: .planning/phases/03-night-coach-live-grimoire/03-REVIEW.md
iteration: 1
findings_in_scope: 5
fixed: 4
skipped: 1
status: partial
---

# Phase 03: Code Review Fix Report

**Fixed at:** 2026-07-16T10:15:07.020Z
**Source review:** `.planning/phases/03-night-coach-live-grimoire/03-REVIEW.md`
**Iteration:** 1

**Summary:**
- Findings in scope: 5
- Fixed: 4
- Skipped: 1

## Fixed Issues

### CR-01: Play fields not scrubbed on player/assignment lifecycle → hydrate wipe

**Files modified:** `src/state/setupSessionStore.ts`
**Commit:** a6a0924
**Applied fix:** Added `scrubPlayFieldsForPlayers` and call it from `removePlayer`, `assignRole`, and `clearRole`. `generateBag`, `clearBag`, and `setDifficulty` now reset play fields via `PLAY_FIELD_DEFAULTS` when bag/assignments are wiped.

### CR-02: Other-night `beatIndex` drifts when queue membership changes

**Files modified:** `src/state/setupSessionStore.ts`, `src/ui/play/PlayScreen.tsx`
**Commit:** 9869886
**Status:** fixed: requires human verification
**Applied fix:** Added in-memory `currentBeatId` plus `syncBeatCursor(beatIds)` that remaps the cursor by beat id when the queue changes. `advanceBeat` / `retreatBeat` take beat ids and keep the anchor in sync. `PlayScreen` syncs on beat-id membership changes instead of length-only clamp.

### WR-01: Grimoire “Back to coach” discards night-complete bridge

**Files modified:** `src/state/setupSessionStore.ts`, `src/ui/play/PlayScreen.tsx`
**Commit:** 944fa1d
**Applied fix:** Added `grimoireReturnSurface` with `openGrimoire` / `returnFromGrimoire`. Opening grimoire from bridge or coach remembers the prior surface; Back restores it.

### WR-02: `startFirstNight` does not reset prior night grimoire state

**Files modified:** `src/state/setupSessionStore.ts`
**Commit:** 90e2807
**Applied fix:** `startFirstNight` now clears `deadPlayerIds`, `diedTonightIds`, `reminders`, `demonBluffs`, and resets `grimoireReturnSurface` alongside the night cursor.

## Skipped Issues

### WR-03: Stale `demonBluffs` after assignment edits skew soft-confirm and chips

**File:** `src/state/setupSessionStore.ts:340-352`
**Reason:** already addressed by CR-01 scrub helper — `scrubPlayFieldsForPlayers` re-filters `demonBluffs` against `eligibleBluffRoleIds` on `assignRole` / `clearRole` / `removePlayer`, and bag wipe paths clear bluffs via `PLAY_FIELD_DEFAULTS`
**Original issue:** Existing `demonBluffs` were never re-filtered when assignments change, so ineligible selected ids stayed in state while chips hid them and soft-confirm could be skipped.

---

_Fixed: 2026-07-16T10:15:07.020Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
