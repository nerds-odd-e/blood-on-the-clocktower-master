---
phase: 03-night-coach-live-grimoire
plan: 02
subsystem: night-coach
tags: [night-coach, beat-queue, handoff, zustand, buildNightBeats]

requires:
  - phase: 03-night-coach-live-grimoire
    provides: Wave 0 RED goldens for buildNightBeats; inverted Night ready /play contracts
  - phase: 02-setup-wizard-grimoire-capture
    provides: Assignment model, Night ready step, Zustand+idb session persist v1
provides:
  - Pure buildNightBeats engine (COACH-01/04 gating, Drunk believed wakes, Ravenkeeper A1)
  - Persist v2 play fields + startFirstNight action
  - Night ready sticky Start first night → /play
  - PlayScreen landing with re-derived current beat title
affects:
  - 03-03 (composePrompt + coach chrome)
  - 03-04 (bluffs + Demon Info picker)
  - 03-05 (grimoire + night bridge)

tech-stack:
  added: []
  patterns:
    - Re-derive Beat[] each render; never persist frozen queues
    - Single Zustand session document with persist version migrate
    - truthRoleId for team presence vs wakeRoleId for Drunk wakes

key-files:
  created:
    - src/domain/engine/types.ts
    - src/domain/engine/buildNightBeats.ts
    - src/domain/engine/index.ts
    - src/ui/play/PlayScreen.tsx
  modified:
    - src/state/setupSessionStore.ts
    - src/state/setupSessionSemantics.ts
    - src/state/setupSessionSemantics.test.ts
    - src/ui/setup/steps/NightReadyStep.tsx
    - src/app/routes.tsx
  deleted:
    - src/ui/play/PlayStub.tsx

key-decisions:
  - "Resolve hasMinion/hasDemon via trueRoleId ?? bagRoleId (truth), not believed wake role"
  - "PlayScreen empty coach when !playStarted or no assignments; otherwise night meta + beat label"
  - "Delete PlayStub; /play routes only to PlayScreen"

patterns-established:
  - "domain/engine barrel mirrors domain/bag (types + pure builder + index)"
  - "Persist v2 migrate fills play defaults; awaitCriticalPersist writes version 2"
  - "Night ready sticky accent CTA pattern reused for Start first night"

requirements-completed: [COACH-01, COACH-04]

coverage:
  - id: D1
    description: buildNightBeats derives First/Other queues with ≥7 Minion/Demon Info gating
    requirement: COACH-01
    verification:
      - kind: unit
        ref: src/domain/engine/buildNightBeats.test.ts
        status: pass
    human_judgment: false
  - id: D2
    description: Drunk wakes via believedRoleId; no drunk wake step
    requirement: COACH-01
    verification:
      - kind: unit
        ref: src/domain/engine/buildNightBeats.test.ts#wakes the Drunk via believedRoleId on first night
        status: pass
    human_judgment: false
  - id: D3
    description: Minion/Demon Info omitted below 7 players even with Imp/Minion present
    requirement: COACH-04
    verification:
      - kind: unit
        ref: src/domain/engine/buildNightBeats.test.ts#omits Minion Info and Demon Info on first night with 5 players
        status: pass
    human_judgment: false
  - id: D4
    description: Start first night navigates to /play showing derived beat title
    requirement: COACH-01
    verification:
      - kind: other
        ref: rg Start first night NightReadyStep + PlayScreen buildNightBeats + routes PlayScreen
        status: pass
    human_judgment: false

duration: 5min
completed: 2026-07-16
status: complete
---

# Phase 03 Plan 02: Night Beat Engine & Start Handoff Summary

**Rules-correct first-night beat queue plus Night ready → /play landing that shows the current derived beat title.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-07-16T09:45:17Z
- **Completed:** 2026-07-16T09:48:30Z
- **Tasks:** 2/2
- **Files modified:** 10

## Accomplishments

- Implemented pure `buildNightBeats` greening all Wave 0 COACH-01/04 goldens (5 vs 7+ info gating, Drunk believed, Ravenkeeper, Scarlet Woman)
- Bumped session persist to version 2 with play cursor fields and `startFirstNight`
- Wired Night ready sticky **Start first night** CTA and replaced `PlayStub` with thin `PlayScreen` beat landing

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement buildNightBeats and green unit goldens** - `f0dc728` (feat)
2. **Task 2: Persist v2 play fields + Start first night → PlayScreen beat landing** - `50ccdc0` (feat)

**Plan metadata:** (pending docs commit)

## Files Created/Modified

- `src/domain/engine/types.ts` — `NightKind`, `Beat`, `BuildNightBeatsInput`
- `src/domain/engine/buildNightBeats.ts` — pure queue builder + `wakeRoleId`
- `src/domain/engine/index.ts` — barrel exports
- `src/state/setupSessionStore.ts` — persist v2, migrate, `startFirstNight`
- `src/state/setupSessionSemantics.ts` — light play-field shape checks
- `src/state/setupSessionSemantics.test.ts` — play-field shape cases
- `src/ui/setup/steps/NightReadyStep.tsx` — UI-SPEC copy + sticky Start CTA
- `src/ui/play/PlayScreen.tsx` — hydrate gate + re-derived beat landing
- `src/app/routes.tsx` — `/play` → PlayScreen
- `src/ui/play/PlayStub.tsx` — deleted (intentional)

## Decisions Made

- Team presence for Minion/Demon Info uses grimoire truth (`trueRoleId ?? bagRoleId`), not Drunk believed cover
- Empty `/play` shows **Nothing to coach yet** when play has not started or no roles are recorded
- Deleted `PlayStub` rather than leaving an unused export

## Deviations from Plan

None - plan executed exactly as written.

Note: full `npm run test:unit` still fails on Wave 0 RED scaffolds for `composePrompt` and `eligibleBluffs` (plans 03-03/03-04). Plan-scoped engine + semantics + persist tests pass (19/19).

## Known Stubs

- `PlayScreen` is intentionally thin — no Next/expand/bluff UI yet (03-03/03-04). Shows night meta + current beat label only.
- `playSurface` coach-only; grimoire/bridge views deferred to 03-05.

## Threat Flags

None — no new network/auth endpoints; persist boundary still Zod-validated (T-03-02 mitigated via v2 schema + semantics).

## TDD Gate Compliance

- RED gate: Wave 0 plan 03-01 (`5dfd627` buildNightBeats tests)
- GREEN gate: `f0dc728` (engine), `50ccdc0` (handoff/PlayScreen)
- No separate REFACTOR commit required

## Self-Check: PASSED

- FOUND: `src/domain/engine/buildNightBeats.ts`
- FOUND: `src/domain/engine/types.ts`
- FOUND: `src/domain/engine/index.ts`
- FOUND: `src/ui/play/PlayScreen.tsx`
- FOUND: `src/state/setupSessionStore.ts` (version 2)
- FOUND: commit `f0dc728`
- FOUND: commit `50ccdc0`
- FOUND: PlayStub deleted
