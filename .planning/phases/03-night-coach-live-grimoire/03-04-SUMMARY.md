---
phase: 03-night-coach-live-grimoire
plan: 04
subsystem: night-coach
tags: [demon-bluffs, minion-info, soft-confirm, eligibleBluffs, BluffPicker]

requires:
  - phase: 03-night-coach-live-grimoire
    provides: CoachBeatView next-beat UX, buildNightBeats info gating, play persist fields
provides:
  - eligibleBluffRoleIds pure helper (good not-in-play only)
  - setDemonBluffs / toggleDemonBluff with eligibility + max-3 validation
  - Semantics fail-closed on illegal persisted bluff ids (T-03-01)
  - BluffPicker on Demon Info + soft ConfirmDialog when <3 bluffs
  - Green play-coach E2E soft-confirm path
affects:
  - 03-05 (live grimoire bluff edit reuses eligibility helper)

tech-stack:
  added: []
  patterns:
    - Bluff pool = townsfolk|outsider minus trueRoleId/bagRoleId in-play set
    - Soft ConfirmDialog on incomplete Demon bluffs (accent Continue anyway)
    - Store mutations filter to eligibleBluffRoleIds before persist

key-files:
  created:
    - src/domain/grimoire/eligibleBluffs.ts
    - src/ui/play/BluffPicker.tsx
    - src/state/setupSessionStore.demonBluffs.test.ts
  modified:
    - src/domain/grimoire/bluffs.test.ts
    - src/domain/grimoire/index.ts
    - src/state/setupSessionStore.ts
    - src/state/setupSessionSemantics.ts
    - src/state/setupSessionSemantics.test.ts
    - src/ui/play/CoachBeatView.tsx
    - src/ui/play/PlayScreen.tsx

key-decisions:
  - "Continue anyway uses accent ConfirmDialog primary (UI-SPEC reserved CTA), not secondaryConfirm outline"
  - "toggleDemonBluff at cap ignores new taps until a selected chip is cleared"

patterns-established:
  - "eligibleBluffRoleIds(assignments, catalog) for Demon Info + future grimoire edit"
  - "Soft bluff gate: demonBluffs.length < 3 → ConfirmDialog before advanceBeat"

requirements-completed: [COACH-04, GRIM-04]

coverage:
  - id: D1
    description: eligibleBluffRoleIds excludes minion/demon and seated true/bag roles including Drunk cover
    requirement: GRIM-04
    verification:
      - kind: unit
        ref: src/domain/grimoire/bluffs.test.ts
        status: pass
    human_judgment: false
  - id: D2
    description: setDemonBluffs/toggleDemonBluff refuse ineligible ids and cap at 3; semantics reject illegal persisted bluffs
    requirement: GRIM-04
    verification:
      - kind: unit
        ref: src/state/setupSessionStore.demonBluffs.test.ts
        status: pass
      - kind: unit
        ref: src/state/setupSessionSemantics.test.ts
        status: pass
    human_judgment: false
  - id: D3
    description: Demon Info shows BluffPicker; Next with <3 bluffs opens soft confirm Continue anyway
    requirement: GRIM-04
    verification:
      - kind: e2e
        ref: e2e/play-coach.spec.ts
        status: pass
      - kind: other
        ref: rg Demon bluffs / Continue anyway / ConfirmDialog in BluffPicker + CoachBeatView
        status: pass
    human_judgment: false
  - id: D4
    description: Minion/Demon Info present on first night for 7+ players via engine gate (COACH-04)
    requirement: COACH-04
    verification:
      - kind: e2e
        ref: e2e/play-coach.spec.ts reaches Demon Info heading
        status: pass
    human_judgment: false

duration: 2min
completed: 2026-07-16
status: complete
---

# Phase 03 Plan 04: Demon Bluffs + Soft Confirm Summary

**Demon Info records up to three good not-in-play bluffs with eligibility validation and a soft incomplete confirm on Next.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-07-16T09:52:24Z
- **Completed:** 2026-07-16T09:54:20Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Shipped `eligibleBluffRoleIds` (Townsfolk/Outsider only; excludes seated true + bag cover; empty-pool edge)
- Store + semantics reject ineligible/over-length demon bluffs (T-03-01)
- BluffPicker on Demon Info with accent selected chips; soft ConfirmDialog when leaving with fewer than three

## Task Commits

Each task was committed atomically:

1. **Task 1: eligibleBluffs domain + store validation** - `0bc0367` (feat)
2. **Task 2: Demon Info BluffPicker + soft confirm + green play-coach E2E** - `d4c0661` (feat)

**Plan metadata:** `27d63ab` (docs: complete plan)

## Files Created/Modified

- `src/domain/grimoire/eligibleBluffs.ts` — pure eligibility helper
- `src/domain/grimoire/bluffs.test.ts` — Baron/Spy exclusion + empty pool cases
- `src/domain/grimoire/index.ts` — export eligibleBluffRoleIds
- `src/state/setupSessionStore.ts` — setDemonBluffs / toggleDemonBluff
- `src/state/setupSessionStore.demonBluffs.test.ts` — store refusal/cap tests
- `src/state/setupSessionSemantics.ts` — fail closed on illegal bluff ids
- `src/ui/play/BluffPicker.tsx` — Demon bluffs chip grid
- `src/ui/play/CoachBeatView.tsx` — picker + soft confirm
- `src/ui/play/PlayScreen.tsx` — wire bluff state into coach

## Decisions Made

- Soft-confirm primary **Continue anyway** uses accent fill (UI-SPEC reserved CTA list), matching dialog structure from Phase 2 soft gates without the `secondaryConfirm` outline used for Record “Start anyway”
- At three selected bluffs, further chip taps are ignored until a selected chip is cleared

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| Night complete bridge body | `PlayScreen.tsx` | Full bridge CTA lands in 03-05 |
| Grimoire panel body | `PlayScreen.tsx` | Live grimoire + bluff edit lands in 03-05 |

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for 03-05 live grimoire to reuse `eligibleBluffRoleIds` for bluff edit
- COACH-04 / GRIM-04 covered; play-coach E2E green

## Self-Check: PASSED

- FOUND: `src/domain/grimoire/eligibleBluffs.ts`
- FOUND: `src/ui/play/BluffPicker.tsx`
- FOUND: `src/ui/play/CoachBeatView.tsx`
- FOUND: commit `0bc0367`
- FOUND: commit `d4c0661`

---
*Phase: 03-night-coach-live-grimoire*
*Completed: 2026-07-16*
