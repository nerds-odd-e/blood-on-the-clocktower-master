---
phase: 01-phone-shell-tb-catalog
plan: 03
subsystem: catalog
tags: [tb-catalog, pwa, zod, playwright, vite-plugin-pwa]

requires:
  - phase: 01-phone-shell-tb-catalog
    provides: PhoneShell, routes /, /setup, /play, ScriptHome composition stub
provides:
  - Zod-validated Trouble Brewing catalog (22 roles, setup chart 5–15, procedural beats)
  - ScriptHome TB card with Offline ready chip and Start setup CTA
  - VitePWA generateSW with navigateFallback and autoUpdate
  - Plan 01 smoke E2E green against real preview
affects:
  - 01-04 catalog Playwright suite
  - 01-05 offline PWA proof
  - Phase 2 setup wizard / bag builder

tech-stack:
  added: [zod@^4.4.3, vite-plugin-pwa@^1.3.0]
  patterns:
    - Bundled JSON + Zod.parse at load; fail-closed Error state
    - Optimistic Offline ready chip on valid catalog (not SW-gated)
    - VitePWA generateSW + registerSW(immediate)

key-files:
  created:
    - src/domain/script/schemas.ts
    - src/domain/script/loadCatalog.ts
    - src/domain/script/index.ts
    - src/data/scripts/trouble-brewing/roles.json
    - src/data/scripts/trouble-brewing/setup-chart.json
    - src/data/scripts/trouble-brewing/procedural-beats.json
    - src/vite-env.d.ts
    - public/pwa-192x192.png
    - public/pwa-512x512.png
  modified:
    - package.json
    - package-lock.json
    - vite.config.ts
    - src/main.tsx
    - src/ui/home/ScriptHome.tsx
    - public/favicon.svg

key-decisions:
  - "TB roles curated from bra1n/townsquare edition=tb excluding travelers (22 / 13-4-4-1)"
  - "Setup chart locked to RESEARCH A1 table; verification note in loadCatalog.ts header"
  - "Offline ready chip optimistic on Zod success (D-01–D-03); no Install CTA (D-04)"
  - "Original geometric PWA icons only — no official BotC token art (D-10 / T-01-06)"
  - "Task 2 TDD RED reused plan 01-01 smoke specs; GREEN is this plan's feat commit"

patterns-established:
  - "Catalog as read-only data plane: JSON under src/data + domain/script Zod loaders"
  - "Home Empty/Error/populated triad driven by loadCatalog parse outcome"
  - "PWA: VitePWA workbox.navigateFallback('/index.html') + registerType autoUpdate"

requirements-completed: [PLAT-01, PLAT-02]

coverage:
  - id: D1
    description: Home shows Trouble Brewing Available card with meta and Start setup CTA
    requirement: PLAT-01
    verification:
      - kind: e2e
        ref: "playwright: e2e/home.spec.ts#shows Storyteller Copilot and Start setup"
        status: pass
    human_judgment: false
  - id: D2
    description: Offline ready chip appears when catalog Zod parse succeeds
    requirement: PLAT-02
    verification:
      - kind: e2e
        ref: "playwright: e2e/home.spec.ts (home renders with valid catalog)"
        status: pass
    human_judgment: false
  - id: D3
    description: VitePWA generateSW with navigateFallback and autoUpdate wired
    requirement: PLAT-02
    verification:
      - kind: other
        ref: "grep navigateFallback/autoUpdate vite.config.ts; npm run build emits dist/sw.js"
        status: pass
    human_judgment: false
  - id: D4
    description: loadCatalog exposes 22 TB roles with 13/4/4/1 team split and setup chart 5–15
    requirement: PLAT-01
    verification:
      - kind: other
        ref: "rg team counts on roles.json; npm run build"
        status: pass
    human_judgment: false

duration: 9min
completed: 2026-07-16
status: complete
---

# Phase 01 Plan 03: TB Catalog + PWA Summary

**Zod-validated Trouble Brewing catalog on home with Offline ready chip, installable VitePWA shell, and green Playwright smoke against the real preview.**

## Performance

- **Duration:** 9 min
- **Started:** 2026-07-16T05:17:49Z
- **Completed:** 2026-07-16T05:26:49Z
- **Tasks:** 2 completed
- **Files modified:** 15

## Accomplishments

- Bundled curated TB data (22 roles, setup chart 5–15, dusk/minion-info/demon-info/dawn stubs) behind `loadCatalog()`
- ScriptHome shows Available TB card, Offline ready chip, and Start setup → `/setup` on valid parse; Empty/Error states on failure
- VitePWA `generateSW` with `autoUpdate` + `navigateFallback: /index.html`; original PWA icons; plan 01 smoke E2E green

## Task Commits

Each task was committed atomically:

1. **Task 1: TB catalog JSON, Zod schemas, and loadCatalog** - `164b7cb` (feat)
2. **Task 2: ScriptHome catalog wire, VitePWA, and green smoke E2E** - `be28d8e` (feat)

**Plan metadata:** `9c001d3` (docs: complete plan)

## TDD Gate Compliance

Task 2 has `tdd="true"`. RED smoke specs already existed from plan 01-01 (`bf1c9b4`); this plan verified they still failed (missing Start setup), then shipped GREEN in `be28d8e`. No new `test(...)` commit in this plan — RED lived upstream by design (D-08 / walking-skeleton).

## Files Created/Modified

- `src/domain/script/schemas.ts` — Role, SetupChart, ProceduralBeats, Catalog Zod schemas
- `src/domain/script/loadCatalog.ts` — parse path + A1 verification header comment
- `src/domain/script/index.ts` — barrel exports
- `src/data/scripts/trouble-brewing/roles.json` — 22 TB characters
- `src/data/scripts/trouble-brewing/setup-chart.json` — playerCount 5–15 rows
- `src/data/scripts/trouble-brewing/procedural-beats.json` — Phase 3 coach stubs
- `src/ui/home/ScriptHome.tsx` — catalog-wired home composition
- `vite.config.ts` — VitePWA plugin config
- `src/main.tsx` — `registerSW({ immediate: true })`
- `src/vite-env.d.ts` — vite-plugin-pwa/client types
- `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/favicon.svg` — original CCC-safe marks
- `package.json` / `package-lock.json` — zod + vite-plugin-pwa

## Decisions Made

- Roles from townsquare TB interchange (no travelers); ability strings stored for later phases but omitted from home UI
- Setup chart matches RESEARCH A1 table; source note only in `loadCatalog.ts` header
- Offline ready is catalog-valid optimistic chip — not gated on service-worker controller
- PWA icons are original geometric lantern-mark PNGs/SVG — never official token art

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

- `src/ui/setup/SetupStub.tsx` / `src/ui/play/PlayStub.tsx` — intentional Phase 2/3 stubs (prior plan); not blocking this plan's goal
- Empty-state branch in ScriptHome is wired but hard to hit with CatalogSchema `.length(22)` — intentional fail-soft for corrupt/empty payloads if schema relaxes later

## Threat Flags

None beyond mitigations already listed in plan threat model (T-01-01 text children, T-01-06 original icons, T-01-05 autoUpdate).

## Issues Encountered

None.

## Next Phase Readiness

- Catalog + PWA wiring ready for plan 01-04 (deeper catalog E2E) and 01-05 (offline reload proof)
- `loadCatalog()` typed surface ready for Phase 2 bag/setup consumers

## Self-Check: PASSED

- All key artifacts present on disk
- Commits `164b7cb` and `be28d8e` present in git log
