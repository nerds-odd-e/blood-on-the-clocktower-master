---
phase: 01-phone-shell-tb-catalog
plan: 04
subsystem: catalog
tags: [tb-catalog, playwright, zod, e2e]

requires:
  - phase: 01-phone-shell-tb-catalog
    provides: Zod loadCatalog, TB JSON bundle, ScriptHome card, PWA shell
provides:
  - Home catalog observability (team counts, roster, setup-chart markers, night ordinals)
  - e2e/catalog.spec.ts proving 22 roles / 13-4-4-1 / setup 5–15 via real UI
  - loadCatalog teamCounts helper for Phase 2/3 consumers
affects:
  - 01-05 offline PWA proof
  - Phase 2 setup wizard / bag builder
  - Phase 3 night coach ordinals

tech-stack:
  added: []
  patterns:
    - Catalog correctness asserted through Playwright UI hooks only (D-07 D-08)
    - data-testid / data-* attributes expose Zod-validated catalog facts without JSON imports in tests
    - Compact roster names + team badges; ability text omitted on home (T-01-09)

key-files:
  created:
    - e2e/catalog.spec.ts
  modified:
    - src/domain/script/loadCatalog.ts
    - src/domain/script/index.ts
    - src/ui/home/ScriptHome.tsx
    - src/index.css

key-decisions:
  - "E2E hooks: tb-script-card, tb-team-counts, tb-setup-chart, tb-role-row with data-first-night"
  - "teamCounts derived in loadCatalog (not stored in JSON) for UI + later phases"
  - "Night-order sample: Poisoner firstNight < Washerwoman and Spy via visible data attrs"
  - "TDD Task 2: catalog suite landed after Task 1 surface — no separate RED fail (same-plan dependency)"

patterns-established:
  - "Playwright catalog gate reads DOM data attributes from real bundled JSON path"
  - "Setup-chart player counts exposed as comma-separated data-player-counts on home"
  - "Optional roster scrolls vertically (max-h-64); shell keeps overflow-x-hidden"

requirements-completed: [PLAT-01, PLAT-02]

coverage:
  - id: D1
    description: Home surfaces TB Available card with 22 roles meta, team counts 13/4/4/1, and Offline ready chip
    requirement: PLAT-01
    verification:
      - kind: e2e
        ref: "playwright: e2e/catalog.spec.ts#home shows Trouble Brewing Available with catalog meta"
        status: pass
      - kind: e2e
        ref: "playwright: e2e/catalog.spec.ts#UI reveals 22 roles and team split 13/4/4/1"
        status: pass
    human_judgment: false
  - id: D2
    description: Setup chart ready for player counts 5–15 exposed via UI markers
    requirement: PLAT-01
    verification:
      - kind: e2e
        ref: "playwright: e2e/catalog.spec.ts#setup chart ready for player counts 5 through 15"
        status: pass
    human_judgment: false
  - id: D3
    description: First-night ordinal sample (Poisoner before Washerwoman/Spy) readable from roster data attrs
    requirement: PLAT-01
    verification:
      - kind: e2e
        ref: "playwright: e2e/catalog.spec.ts#first-night ordinal sample from visible roster data"
        status: pass
    human_judgment: false
  - id: D4
    description: Phone viewport has no horizontal overflow with scrollable roster
    requirement: PLAT-01
    verification:
      - kind: e2e
        ref: "playwright: e2e/catalog.spec.ts#page does not gain horizontal scroll at phone viewport"
        status: pass
    human_judgment: false

duration: 7min
completed: 2026-07-16
status: complete
---

# Phase 01 Plan 04: TB Catalog E2E Surface Summary

**Home exposes Zod-validated Trouble Brewing facts (22 roles, 13/4/4/1, setup 5–15, night ordinals) and Playwright proves them against the real bundled catalog with no JSON mocks.**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-07-16T05:31:08Z
- **Completed:** 2026-07-16T05:37:26Z
- **Tasks:** 2 completed
- **Files modified:** 5

## Accomplishments

- Extended `loadCatalog` with derived `teamCounts` and documented Poisoner-before-info ordinal cross-check in the file header
- ScriptHome now shows team count chips, setup-chart ready marker, and a compact scrollable roster with `data-first-night` hooks — ability text still omitted
- `e2e/catalog.spec.ts` green alongside home smoke; asserts catalog only through the UI (D-07 D-08)

## Task Commits

Each task was committed atomically:

1. **Task 1: Lock setup chart, night ordinals, and home catalog surface** - `9cf6160` (feat)
2. **Task 2: Playwright catalog suite against real bundled TB data** - `983e4f2` (test)

**Plan metadata:** _(pending docs commit)_

## Files Created/Modified

- `e2e/catalog.spec.ts` — Playwright catalog correctness suite (no JSON imports / mocks)
- `src/domain/script/loadCatalog.ts` — `summarizeTeamCounts` / `LoadedCatalog`; ordinal source note
- `src/domain/script/index.ts` — re-exports team-count helpers
- `src/ui/home/ScriptHome.tsx` — observable catalog surface + E2E data hooks
- `src/index.css` — UI-SPEC team badge CSS variables

### E2E hook names (executor choices)

| Hook | Purpose |
|------|---------|
| `data-testid="tb-script-card"` | Script card root; `data-role-total` |
| `data-testid="tb-team-counts"` | Team split; `data-team-count-{team}` |
| `data-testid="tb-setup-chart"` | Setup ready; `data-player-counts`, `data-setup-row-count` |
| `data-testid="tb-role-row"` | Roster row; `data-role-id`, `data-first-night`, `data-other-night` |
| `data-testid="tb-role-roster"` | Scrollable roster container |
| `data-testid="offline-ready"` | Optimistic Offline ready chip (unchanged) |

## Decisions Made

- Derived `teamCounts` on `loadCatalog` return rather than duplicating counts in JSON
- Night-order sample asserts Poisoner ordinal before Washerwoman and Spy via visible attributes (not a parallel JSON import)
- Task 2 TDD: surface shipped in Task 1 of this plan, so catalog suite committed green without a failing RED gate

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Comment mentioned `roles.json` and failed acceptance grep**
- **Found during:** Task 2
- **Issue:** Acceptance requires `grep … roles.json` count 0 in `catalog.spec.ts`; file header comment named the JSON file
- **Fix:** Reworded comment to say “catalog JSON” without the filename
- **Files modified:** `e2e/catalog.spec.ts`
- **Verification:** `grep -v '^#' e2e/catalog.spec.ts | grep -c "roles.json"` → 0
- **Committed in:** `983e4f2`

**Total deviations:** 1 auto-fixed (Rule 1)
**Impact on plan:** Cosmetic acceptance-grep fix only; no scope change.

## TDD Gate Compliance

- Task 2 is `tdd="true"` with `<behavior>` for catalog E2E
- RED gate: not a separate failing commit — catalog observability landed in Task 1 (`9cf6160`) before the suite
- GREEN gate: `test(01-04)` commit `983e4f2` — `npx playwright test e2e/catalog.spec.ts e2e/home.spec.ts` exits 0 (7 passed)
- Warning: classic RED-before-GREEN sequence skipped because same-plan Task 1 was the implementation prerequisite (mirrors plan 03 pattern of dependent TDD)

## Issues Encountered

None beyond the acceptance-grep comment fix.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Catalog data plane + E2E gate ready for Phase 2 bag/setup and Phase 3 night coach
- Plan 01-05 can focus on offline/PWA proof without re-opening role counts

## Known Stubs

None that block plan goals. Procedural beat notes remain Phase 3 coach stubs (intentional content in `procedural-beats.json`).

## Self-Check: PASSED

- FOUND: `e2e/catalog.spec.ts`
- FOUND: `src/ui/home/ScriptHome.tsx`
- FOUND: `src/domain/script/loadCatalog.ts`
- FOUND: commit `9cf6160`
- FOUND: commit `983e4f2`

---
*Phase: 01-phone-shell-tb-catalog*
*Completed: 2026-07-16*
