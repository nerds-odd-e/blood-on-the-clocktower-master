---
phase: 01-phone-shell-tb-catalog
plan: 02
subsystem: ui
tags: [phone-shell, routes, tailwind, react-router, playwright]

requires:
  - phase: 01-phone-shell-tb-catalog
    provides: Vite react-ts scaffold + RED Playwright smoke gate
provides:
  - PhoneShell with safe-area, overflow-x hidden, max-width 40rem
  - Shallow BrowserRouter routes /, /setup, /play
  - ScriptHome brand composition with Empty/Error UI-SPEC copy
  - Tailwind v4 tokens + Fraunces / Source Sans 3 typography
affects:
  - 01-03-catalog-pwa
  - 01-04-catalog-ui
  - 01-05-offline-smoke

tech-stack:
  added:
    - tailwindcss@^4.3.2
    - "@tailwindcss/vite@^4.3.2"
    - react-router-dom@^7.18.1
    - "@fontsource/fraunces"
    - "@fontsource/source-sans-3"
  patterns:
    - PhoneShell wraps all routes; single column max-w 40rem
    - UI-SPEC copy as React text children only (no HTML injection)
    - ScriptHome catalogReady hook deferred to plan 01-03 (Start setup hidden)

key-files:
  created:
    - src/app/layout/PhoneShell.tsx
    - src/app/App.tsx
    - src/app/routes.tsx
    - src/ui/home/ScriptHome.tsx
    - src/ui/setup/SetupStub.tsx
    - src/ui/play/PlayStub.tsx
  modified:
    - package.json
    - package-lock.json
    - vite.config.ts
    - index.html
    - src/index.css
    - src/main.tsx
    - src/App.tsx

key-decisions:
  - "Confirmed fontsource + Tailwind + react-router-dom on npm before install (T-01-SC)"
  - "Start setup CTA stays hidden until loadCatalog greens in 01-03 (plan action)"
  - "Thin-reexport src/App.tsx so create-vite path does not dual-mount"

patterns-established:
  - "Entry: main.tsx → src/app/App.tsx → PhoneShell → AppRoutes"
  - "Stub pages: heading + muted body + Back to home text link (no tab bar)"
  - "CSS variables map UI-SPEC colors/typography; Tailwind utilities for layout"

requirements-completed: [PLAT-01]

coverage:
  - id: D1
    description: PhoneShell with Tailwind UI-SPEC tokens, viewport-fit=cover, safe-area, overflow-x hidden
    requirement: PLAT-01
    verification:
      - kind: other
        ref: "npm run build (exit 0) + PhoneShell.tsx export"
        status: pass
    human_judgment: false
  - id: D2
    description: Shallow /, /setup, /play routes with ScriptHome brand + Empty/Error UI-SPEC copy and stub Back to home
    requirement: PLAT-01
    verification:
      - kind: other
        ref: "npm run build && ! rg -q dangerouslySetInnerHTML src --glob *.tsx"
        status: pass
    human_judgment: false
  - id: D3
    description: Start setup CTA and populated TB card (deferred to catalog plan)
    requirement: PLAT-01
    verification:
      - kind: e2e
        ref: "playwright:e2e/home.spec.ts (expect non-zero until 01-03)"
        status: fail
    human_judgment: false
    rationale: "Intentional — Start setup hidden until loadCatalog in 01-03; smoke stays RED"

duration: 5min
completed: 2026-07-16
status: complete
---

# Phase 01 Plan 02: Phone Shell + Routes Summary

**Phone-first PhoneShell with Tailwind UI-SPEC tokens, Fraunces/Source Sans 3, and shallow `/` `/setup` `/play` stubs — catalog/PWA deferred.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-07-16T05:08:51Z
- **Completed:** 2026-07-16T05:14:27Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments

- Tailwind v4 + UI-SPEC CSS variables and self-hosted Fraunces / Source Sans 3
- `PhoneShell` enforces safe-area, `overflow-x: hidden`, and `max-width: 40rem`
- Routes `/`, `/setup`, `/play` with UI-SPEC stub copy and Back to home links
- `ScriptHome` shows Display brand + Empty/Error panels; Start setup reserved for 01-03

## Task Commits

Each task was committed atomically:

1. **Task 1: Tailwind tokens, viewport, and PhoneShell** - `f78663b` (feat)
2. **Task 2: Routes, stubs, and ScriptHome composition** - `ea2c410` (feat)

**Plan metadata:** `bb92c3a` (docs: complete plan)

## Files Created/Modified

- `src/app/layout/PhoneShell.tsx` — phone chrome (safe-area, overflow-x, max-width)
- `src/app/App.tsx` / `src/app/routes.tsx` — BrowserRouter + route table
- `src/ui/home/ScriptHome.tsx` — brand + Empty/Error composition
- `src/ui/setup/SetupStub.tsx` / `src/ui/play/PlayStub.tsx` — stub panels
- `src/main.tsx` / `src/App.tsx` — entry + thin reexport
- `vite.config.ts` / `src/index.css` / `index.html` — Tailwind + viewport-fit=cover
- `package.json` / `package-lock.json` — shell deps (no zod / vite-plugin-pwa)

## Decisions Made

- Confirmed `@fontsource/fraunces`, `@fontsource/source-sans-3`, Tailwind 4.3.x, and `react-router-dom` 7.18.x on npm before install
- Left `catalogReady = false` so Empty/Error panels ship now and Start setup waits for 01-03
- Kept thin `src/App.tsx` reexport to avoid dual-mount confusion with the create-vite path

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for plan 01-03 (Zod TB catalog + VitePWA + Start setup CTA to green smoke)
- Stub routes already satisfy `e2e/stubs.spec.ts` assertions; home smoke stays RED until catalog

## Known Stubs

| File | Stub | Reason |
|------|------|--------|
| `src/ui/home/ScriptHome.tsx` | `catalogReady = false`; no Start setup CTA | Intentional — plan 01-03 wires `loadCatalog` |
| `src/ui/setup/SetupStub.tsx` | Setup wizard body copy only | Phase 2 owns real wizard |
| `src/ui/play/PlayStub.tsx` | Night coach body copy only | Phase 3 owns coach |

## Self-Check: PASSED

- FOUND: src/app/layout/PhoneShell.tsx, src/app/routes.tsx, src/app/App.tsx, src/ui/home/ScriptHome.tsx, src/ui/setup/SetupStub.tsx, src/ui/play/PlayStub.tsx, index.html, src/index.css
- FOUND commits: f78663b, ea2c410

---
*Phase: 01-phone-shell-tb-catalog*
*Completed: 2026-07-16*
