---
phase: 01-phone-shell-tb-catalog
plan: 05
subsystem: testing
tags: [pwa, offline, playwright, plat-01, plat-02]

requires:
  - phase: 01-phone-shell-tb-catalog
    provides: VitePWA autoUpdate + navigateFallback, TB home/catalog, preview Playwright webServer
provides:
  - e2e/offline.spec.ts proving offline reload of / and /setup via real SW
  - PLAT-01 phone viewport no-horizontal-scroll + no-account assertions
  - VALIDATION.md wave_0_complete with green sampling map for plans 01–05
affects:
  - Phase 1 verify-work / validate-phase
  - Phase 2+ offline assumptions for setup wizard

tech-stack:
  added: []
  patterns:
    - Offline E2E: online first load → wait for SW controller → context.setOffline → reload
    - PLAT-01 overflow via documentElement scrollWidth <= clientWidth at 390x844
    - No SW/catalog mocks in Playwright (D-08); Offline ready chip stays optimistic (D-02)

key-files:
  created:
    - e2e/offline.spec.ts
  modified:
    - e2e/home.spec.ts
    - package.json
    - .planning/phases/01-phone-shell-tb-catalog/01-VALIDATION.md

key-decisions:
  - "Offline proof uses browserContext.setOffline against vite preview after SW control (not vite dev)"
  - "TDD Task 1: suite green on first run — PWA already shipped in 01-03; no separate RED fail"
  - "wave_0_complete true; nyquist_compliant left false for validate-phase"
  - "Added npm test + test:e2e:offline aliases; no Vitest dependency"

patterns-established:
  - "waitForServiceWorkerControl: controller or one reload then controller before setOffline"
  - "Playwright-only Phase 1 quality gate closed with offline + full suite green"

requirements-completed: [PLAT-01, PLAT-02]

coverage:
  - id: D1
    description: After first online load, offline reload of / still shows Storyteller Copilot and Trouble Brewing
    requirement: PLAT-02
    verification:
      - kind: e2e
        ref: "playwright: e2e/offline.spec.ts#reloads home and /setup offline after first online load"
        status: pass
    human_judgment: false
  - id: D2
    description: Offline navigation to /setup still serves SPA stub via navigateFallback
    requirement: PLAT-02
    verification:
      - kind: e2e
        ref: "playwright: e2e/offline.spec.ts#reloads home and /setup offline after first online load"
        status: pass
    human_judgment: false
  - id: D3
    description: Phone viewport 390x844 has no horizontal document scroll on /, /setup, /play
    requirement: PLAT-01
    verification:
      - kind: e2e
        ref: "playwright: e2e/offline.spec.ts#phone viewport and no accounts"
        status: pass
      - kind: e2e
        ref: "playwright: e2e/home.spec.ts#PLAT-01 no horizontal document scroll"
        status: pass
    human_judgment: false
  - id: D4
    description: No login/account/signup UI on Phase 1 routes
    requirement: PLAT-01
    verification:
      - kind: e2e
        ref: "playwright: e2e/offline.spec.ts#has no login or account UI"
        status: pass
    human_judgment: false
  - id: D5
    description: Long-copy wrap and calm Offline ready chip visual hierarchy
    requirement: PLAT-01
    verification: []
    human_judgment: true
    rationale: UI-SPEC visual backstops — chip hierarchy and wrap cannot be fully judged by scrollWidth alone

duration: 8min
completed: 2026-07-16
status: complete
---

# Phase 01 Plan 05: Offline PWA & Viewport Proof Summary

**Playwright proves PLAT-02 offline reload (real generateSW + setOffline) and PLAT-01 phone viewport/no-account gates; VALIDATION sampling map is green with wave_0_complete.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-07-16T05:41:06Z
- **Completed:** 2026-07-16T05:49:11Z
- **Tasks:** 2 completed
- **Files modified:** 4

## Accomplishments

- `e2e/offline.spec.ts` waits for service-worker control, goes offline, reloads `/`, and opens `/setup` — no SW or catalog fakes
- Home smoke extended with 390×844 scrollWidth checks and no login/account affordances
- VALIDATION.md rows 01-01–01-05 marked green; `wave_0_complete: true`; `test` / `test:e2e:offline` scripts added

## Task Commits

Each task was committed atomically:

1. **Task 1: Playwright offline reload and phone viewport suite** - `7552a16` (test)
2. **Task 2: Confirm VALIDATION sampling map matches green suite** - `987e5b5` (docs)

**Plan metadata:** `900deb1` (docs: complete plan)

## Files Created/Modified

- `e2e/offline.spec.ts` — offline reload + viewport + no-account Playwright suite
- `e2e/home.spec.ts` — PLAT-01 scroll + no-account smoke extensions
- `package.json` — `test`, `test:e2e`, `test:e2e:offline` → Playwright
- `.planning/phases/01-phone-shell-tb-catalog/01-VALIDATION.md` — green map + Wave 0 complete

## Decisions Made

- Offline acceptance = Playwright `browserContext.setOffline` against `vite preview` after SW controller attaches (D-08; RESEARCH Pitfall 2)
- No separate TDD RED commit: feature already lived in 01-03 PWA wiring; this plan’s deliverable is the proof suite
- Left `nyquist_compliant: false` for `/gsd-validate-phase` while setting `wave_0_complete: true`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Comment wording tripped mock-ban grep**
- **Found during:** Task 1 (Playwright offline suite)
- **Issue:** File header mentioned `mocks` / `route.fulfill`, so acceptance `grep -cE 'mock|...'` was non-zero
- **Fix:** Reworded header to avoid banned tokens while keeping D-08 intent
- **Files modified:** `e2e/offline.spec.ts`
- **Verification:** `grep -v '^#' e2e/offline.spec.ts | grep -cE 'mock|route\\.fulfill|serviceWorkers:\\s*block'` → 0
- **Committed in:** `7552a16`

---

**Total deviations:** 1 auto-fixed (Rule 1)
**Impact on plan:** Cosmetic comment fix only; no scope change.

## Issues Encountered

None beyond the mock-ban comment false positive above.

## TDD Gate Compliance

- Plan task marked `tdd="true"`; RED did not fail — PWA offline behavior already shipped in plan 01-03
- Single `test(01-05)` commit delivers the suite (same pattern as 01-04 catalog E2E after surface)
- Warning: no separate failing RED commit — expected given prior-wave implementation

## Known Stubs

None — offline suite and VALIDATION sync are complete for this plan’s goal.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 1 automated gates for PLAT-01 / PLAT-02 walking skeleton are evidenced
- Ready for phase verify / validate-phase (nyquist) and human visual backstops (chip hierarchy, copy wrap)
- Phase 2 can assume offline SPA shell + navigateFallback are proven

---
*Phase: 01-phone-shell-tb-catalog*
*Completed: 2026-07-16*
## Self-Check: PASSED
