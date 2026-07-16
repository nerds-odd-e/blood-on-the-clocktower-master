# Walking Skeleton — Blood on the Clocktower — Storyteller Copilot

**Phase:** 1
**Generated:** 2026-07-16

## Capability Proven End-to-End

A Storyteller can open a phone-first installable offline PWA, see Trouble Brewing as the available script with roles/setup/night data loaded from bundled JSON, tap **Start setup** into a stub route, and reload the app with the network offline and no account.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Vite 8 + React 19 + TypeScript ~6.0.2 (`create-vite` `react-ts`) | Matches STACK/RESEARCH; static SPA caches cleanly for offline ST use |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` | Phone-first utilities without a component-registry tax |
| Routing | `react-router-dom@^7.18.1` shallow routes `/`, `/setup`, `/play` | Wizard/coach stay out of URL until later phases |
| Data layer | Bundled TB JSON under `src/data/scripts/trouble-brewing/` + Zod parse at load | Offline-first; no runtime fetch; typed catalog for Phase 2/3 |
| Auth | None | PLAT-02 — no accounts |
| Offline / PWA | `vite-plugin-pwa` `generateSW`, `registerType: 'autoUpdate'`, `navigateFallback: '/index.html'` | Precache shell + catalog assets; SPA deep links work offline |
| UI contract | Hand-rolled Tailwind per `01-UI-SPEC.md` (no shadcn/icons Phase 1) | Walking skeleton; Fraunces + Source Sans 3; table-lantern dark |
| Persistence (Phase 1) | Catalog read-only load path only (no Zustand/Dexie) | PLAT-01/02 do not need session persist |
| Test gate | Playwright E2E only (CONTEXT D-05–D-08) | Full shipped behavior against real app + real TB JSON; no mocks |
| Deployment target | Local `nix-shell -p nodejs --run 'npm run build && npm run preview'` | HTTPS host deferred; localhost SW sufficient for Phase 1 offline proof |
| Directory layout | `src/app` (shell/routes), `src/domain/script`, `src/data/scripts/trouble-brewing`, `src/ui/*`, `e2e/` | RESEARCH recommended structure |

## Stack Touched in Phase 1

- [x] Project scaffold (framework, build, lint, Playwright test runner)
- [x] Routing — `/`, `/setup`, `/play`
- [x] Data path — real catalog read (Zod-validated bundled JSON); no write store in Phase 1
- [x] UI — **Start setup** → `/setup` stub; **Back to home** → `/`
- [x] Deployment — documented local full-stack run via preview (PWA SW)

## Out of Scope (Deferred to Later Slices)

- Setup wizard, bag builder, role recording (Phase 2)
- Night coach, live grimoire, tokens, bluffs (Phase 3)
- Zustand session persist / Dexie profiles
- Install / A2HS coaching CTA
- Vitest domain golden suites
- Live online/offline connectivity HUD
- shadcn, lucide-react, Vaul, Sonner
- Travelers, Fabled, other scripts, official BotC token art
- Accounts, backends, multi-device sync

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- Phase 2: Setup wizard → legal TB bag → deal → role recording into grimoire
- Phase 3: Next-beat First/Other night coach with tokens and Demon bluffs
