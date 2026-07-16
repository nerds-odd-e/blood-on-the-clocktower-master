---
phase: 03-night-coach-live-grimoire
plan: 01
subsystem: testing
tags: [night-coach, wave-0, playwright, vitest, tdd-red]

requires:
  - phase: 02-setup-wizard-grimoire-capture
    provides: Night ready handoff, assignment model, setup-record E2E helpers, TB catalog
provides:
  - RED Vitest scaffolds for buildNightBeats, composePrompt, eligibleBluffRoleIds
  - RED Playwright gates for coach + live grimoire happy paths
  - Inverted Phase 2 /play stub and Night ready Start first night contracts
affects:
  - 03-02 (buildNightBeats GREEN)
  - 03-03 (composePrompt + coach UI GREEN)
  - 03-04 (bluffs GREEN)
  - 03-05 (grimoire + bridge GREEN)

tech-stack:
  added: []
  patterns:
    - Wave 0 RED gates import production symbols that do not exist yet
    - Playwright-first coach flows with real setup wizard path (no catalog JSON mocks)
    - Colocated Vitest next to domain modules with real loadCatalog()

key-files:
  created:
    - src/domain/engine/buildNightBeats.test.ts
    - src/domain/coach/composePrompt.test.ts
    - src/domain/grimoire/bluffs.test.ts
    - e2e/play-coach.spec.ts
    - e2e/play-grimoire.spec.ts
  modified:
    - e2e/stubs.spec.ts
    - e2e/setup-record.spec.ts
    - .planning/phases/03-night-coach-live-grimoire/03-VALIDATION.md

key-decisions:
  - "Bluff helper import path locked to ./eligibleBluffs (PATTERNS preferred name)"
  - "setup-record Night ready asserts Start first night button instead of forbidding /play links"
  - "stubs /play asserts Nothing to coach yet OR night meta — not Play stub heading"

patterns-established:
  - "Wave 0 unit scaffolds fail on missing modules until later plans implement them"
  - "7-player wizard seed in play E2E for Minion/Demon Info path (D-09)"

requirements-completed: [COACH-01, COACH-02, COACH-03, COACH-04, GRIM-03, GRIM-04]

coverage:
  - id: D1
    description: RED unit scaffolds for buildNightBeats golden cases (5 vs 7+ info gating, Drunk believed, Ravenkeeper, Scarlet Woman)
    requirement: COACH-01
    verification:
      - kind: unit
        ref: src/domain/engine/buildNightBeats.test.ts
        status: fail
    human_judgment: false
  - id: D2
    description: RED unit scaffold for composePrompt short+detail
    requirement: COACH-02
    verification:
      - kind: unit
        ref: src/domain/coach/composePrompt.test.ts
        status: fail
    human_judgment: false
  - id: D3
    description: RED unit scaffold for eligibleBluffRoleIds townsfolk/outsider not-in-play pool
    requirement: GRIM-04
    verification:
      - kind: unit
        ref: src/domain/grimoire/bluffs.test.ts
        status: fail
    human_judgment: false
  - id: D4
    description: RED Playwright coach path Start first night → Next → More detail → Demon bluffs
    requirement: COACH-02
    verification:
      - kind: e2e
        ref: e2e/play-coach.spec.ts
        status: fail
    human_judgment: false
  - id: D5
    description: RED Playwright grimoire + Night complete → Start other night bridge
    requirement: GRIM-03
    verification:
      - kind: e2e
        ref: e2e/play-grimoire.spec.ts
        status: fail
    human_judgment: false
  - id: D6
    description: Inverted stubs/setup-record contracts so Phase 2 Play stub cannot stay green
    requirement: COACH-02
    verification:
      - kind: e2e
        ref: e2e/stubs.spec.ts
        status: fail
    human_judgment: false

duration: 2min
completed: 2026-07-16
status: complete
---

# Phase 03 Plan 01: Wave 0 RED Gates Summary

**Locked failing Vitest + Playwright acceptance contracts for night coach, bluffs, and live grimoire so later plans cannot ship a green stub.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-07-16T09:42:37Z
- **Completed:** 2026-07-16T09:44:00Z
- **Tasks:** 2/2
- **Files modified:** 8

## Accomplishments

- Added RED domain unit scaffolds that import missing `buildNightBeats`, `composePrompt`, and `eligibleBluffs` modules against real `loadCatalog()`
- Added RED Playwright specs for 7-player coach (Start first night → Next → More detail → Demon bluffs) and grimoire/bridge (Dead/Alive, reminders, Start other night)
- Inverted Phase 2 `/play` stub and Night ready contracts so “no play affordance” / “Play” heading cannot stay green accidentally
- Marked Wave 0 VALIDATION.md rows present (still red) for unit + E2E files

## Task Commits

Each task was committed atomically:

1. **Task 1: RED domain unit scaffolds for beats, prompts, bluffs** - `5dfd627` (test)
2. **Task 2: RED play E2E + invert Night ready /play stub contracts** - `2688a03` (test)

**Plan metadata:** (pending docs commit)

## Files Created/Modified

- `src/domain/engine/buildNightBeats.test.ts` — COACH-01/04 golden RED cases
- `src/domain/coach/composePrompt.test.ts` — short/detail RED cases
- `src/domain/grimoire/bluffs.test.ts` — eligible bluff pool RED cases
- `e2e/play-coach.spec.ts` — coach + bluffs happy-path RED gate
- `e2e/play-grimoire.spec.ts` — grimoire + other-night bridge RED gate
- `e2e/stubs.spec.ts` — coach-or-empty `/play` contract
- `e2e/setup-record.spec.ts` — expects Start first night on Night ready
- `.planning/phases/03-night-coach-live-grimoire/03-VALIDATION.md` — Wave 0 file-presence notes

## Decisions Made

- Import bluff helper from `./eligibleBluffs` (PATTERNS preferred) rather than `./bluffs`
- Keep Playwright seeds on the real setup wizard path (D-20) — no catalog JSON fixtures in E2E
- setup-record asserts visible `Start first night` button; removed `getByRole('link', /play/i)` count-0 forbid

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None in production code — this plan only added failing tests. Production modules intentionally absent until 03-02+.

## Threat Flags

None — test-only surface; no new network/auth/file trust boundaries.

## TDD Gate Compliance

- RED gate commits present: `5dfd627` (unit), `2688a03` (e2e)
- GREEN/REFACTOR deferred to later plans that implement production modules (plan type is Wave 0 prep only)

## Self-Check: PASSED

- FOUND: `src/domain/engine/buildNightBeats.test.ts`
- FOUND: `src/domain/coach/composePrompt.test.ts`
- FOUND: `src/domain/grimoire/bluffs.test.ts`
- FOUND: `e2e/play-coach.spec.ts`
- FOUND: `e2e/play-grimoire.spec.ts`
- FOUND: commit `5dfd627`
- FOUND: commit `2688a03`
