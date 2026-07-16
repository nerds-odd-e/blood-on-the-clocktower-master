---
phase: 01-phone-shell-tb-catalog
plan: 01
subsystem: testing
tags: [playwright, vite, react, scaffold, e2e]

requires: []
provides:
  - Vite react-ts app scaffold with build/preview/dev scripts
  - Playwright config with real preview webServer on 4173
  - RED e2e/home.spec.ts and e2e/stubs.spec.ts smoke gate
  - Playwright-only 01-VALIDATION.md Nyquist contract (D-05–D-08)
affects:
  - 01-02-phone-shell
  - 01-03-catalog-pwa

tech-stack:
  added:
    - react@^19.2.7
    - react-dom@^19.2.7
    - vite@^8.1.1
    - "@vitejs/plugin-react@^6.0.3"
    - typescript@~6.0.2
    - "@playwright/test@^1.61.1"
    - oxlint@^1.71.0
  patterns:
    - Playwright-only Phase 1 testing (no Vitest/jsdom/Testing Library)
    - webServer builds then previews on 127.0.0.1:4173 (no route/catalog mocks)
    - Default create-vite App left in place so smoke stays RED until 01-03

key-files:
  created:
    - playwright.config.ts
    - e2e/home.spec.ts
    - e2e/stubs.spec.ts
    - package.json
    - vite.config.ts
    - index.html
    - src/main.tsx
    - src/App.tsx
    - src/index.css
  modified:
    - .planning/phases/01-phone-shell-tb-catalog/01-VALIDATION.md

key-decisions:
  - "Scaffolded create-vite into /tmp then merged to preserve e2e/.planning (avoid --overwrite)"
  - "Kept create-vite 9.x oxlint baseline instead of eslint.config.js / public/vite.svg from older plan assumptions"
  - "Installed only @playwright/test as test layer — no unit-test runner (D-05 D-07)"

patterns-established:
  - "E2E gate: npm run build && npx playwright test against real preview"
  - "RED until shell/catalog: smoke asserts Storyteller Copilot / Start setup / Setup / Play / Back to home"

requirements-completed: [PLAT-01, PLAT-02]

coverage:
  - id: D1
    description: Playwright config with e2e testDir and preview webServer on 4173 (no mocks)
    requirement: PLAT-01
    verification:
      - kind: e2e
        ref: "playwright.config.ts#webServer"
        status: pass
    human_judgment: false
  - id: D2
    description: RED home and stubs Playwright specs assert UI-SPEC copy
    requirement: PLAT-01
    verification:
      - kind: e2e
        ref: "playwright:e2e/home.spec.ts+e2e/stubs.spec.ts (expect non-zero until 01-03)"
        status: fail
    human_judgment: false
    rationale: "Intentional RED gate — status fail until plan 01-03 greens smoke; not a human UAT item"
  - id: D3
    description: Vite react-ts scaffold builds; Playwright remains RED; no unit-test runner
    requirement: PLAT-02
    verification:
      - kind: other
        ref: "npm run build (exit 0) && playwright smoke (exit != 0)"
        status: pass
    human_judgment: false

duration: 10min
completed: 2026-07-16
status: complete
---

# Phase 01 Plan 01: Scaffold + RED Playwright Summary

**Vite react-ts scaffold plus Playwright RED smoke (`home`/`stubs`) and Playwright-only VALIDATION.md — walking-skeleton gate before shell/catalog.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-07-16T04:51:28Z
- **Completed:** 2026-07-16T05:02:24Z
- **Tasks:** 2
- **Files modified:** 25

## Accomplishments

- Playwright config targets real Vite preview on `127.0.0.1:4173` with `testDir: e2e` (D-08, no mocks)
- Failing `e2e/home.spec.ts` and `e2e/stubs.spec.ts` assert UI-SPEC copy verbatim at 390×844
- create-vite react-ts scaffold builds; default App keeps smoke RED until plans 01-02/01-03
- `01-VALIDATION.md` retargeted and Wave 0 checklist partially checked for Playwright infra

## Task Commits

Each task was committed atomically:

1. **Task 1: Playwright RED smoke + VALIDATION Playwright retarget** - `bf1c9b4` (test)
2. **Task 2: create-vite react-ts scaffold without shell/catalog** - `e30f49c` (feat)

**Plan metadata:** (pending docs commit)

_Note: TDD Task 1 is RED-only by design; GREEN lands in plan 01-03._

## Files Created/Modified

- `playwright.config.ts` — e2e runner + build/preview webServer
- `e2e/home.spec.ts` — Storyteller Copilot + Start setup navigation smoke
- `e2e/stubs.spec.ts` — /setup and /play stub copy + Back to home
- `package.json` / `package-lock.json` — Vite React-TS deps + `@playwright/test` + `test:e2e`
- `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css` — default scaffold
- `tsconfig*.json`, `.oxlintrc.json`, `.gitignore`, `public/*`, `src/assets/*` — create-vite side effects
- `.planning/phases/01-phone-shell-tb-catalog/01-VALIDATION.md` — Playwright-only map updates

## Decisions Made

- Merged create-vite from `/tmp` into the repo root so `.planning/` and e2e files were not wiped (`--overwrite` avoided)
- Accepted create-vite 9.x output (oxlint, `public/favicon.svg`) over outdated plan mentions of `eslint.config.js` / `public/vite.svg`
- Minimal Task 1 `package.json` with only Playwright, then replaced by full scaffold merge in Task 2

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Ignore Playwright output artifacts**
- **Found during:** Task 2
- **Issue:** `test-results/` appeared untracked after RED runs
- **Fix:** Added `test-results`, `playwright-report`, `blob-report`, `playwright/.cache` to `.gitignore`
- **Files modified:** `.gitignore`
- **Verification:** artifacts no longer show as untracked after ignore
- **Committed in:** `e30f49c` (Task 2)

**2. [Rule 3 - Blocking] Scaffold via /tmp merge instead of in-place create-vite**
- **Found during:** Task 2
- **Issue:** `npm create vite@latest .` cannot safely overwrite a non-empty root without destroying e2e/.planning; relative path under nix-shell also mis-resolved once
- **Fix:** Scaffolded in `/tmp/botc-vite-scaffold-*`, copied files, merged `package.json` keeping `@playwright/test` + `test:e2e`
- **Files modified:** scaffold roots listed above
- **Verification:** `npm run build` exit 0; Playwright smoke still non-zero
- **Committed in:** `e30f49c` (Task 2)

---

**Total deviations:** 2 auto-fixed (1 missing critical, 1 blocking)
**Impact on plan:** Necessary for safe greenfield merge and clean git hygiene; no scope creep into shell/catalog/PWA.

## Issues Encountered

- create-vite under `nix-shell` with a macOS `/var/folders/...` path initially resolved relative to the repo; fixed by scaffolding under `/tmp` from `/tmp` cwd

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for plan 01-02 (PhoneShell / Tailwind / routes) — smoke intentionally still RED
- Plan 01-03 must green home/stubs and add catalog/PWA

## TDD Gate Compliance

- RED commit present: `bf1c9b4` (`test(01-01): ...`)
- GREEN deferred by plan design to 01-03 (scaffold Task 2 keeps assertions failing) — not a missing gate for this plan

## Self-Check: PASSED

- FOUND: playwright.config.ts, e2e/home.spec.ts, e2e/stubs.spec.ts, package.json, vite.config.ts, src/App.tsx, src/main.tsx, index.html
- FOUND commits: bf1c9b4, e30f49c

---
*Phase: 01-phone-shell-tb-catalog*
*Completed: 2026-07-16*
