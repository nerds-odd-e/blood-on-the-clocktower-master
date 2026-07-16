<!-- gsd-project-start source:PROJECT.md -->

## Project

**Blood on the Clocktower — Storyteller Copilot**

A phone-first digital co-pilot for **Blood on the Clocktower** Storytellers. A human still runs the table and talks to players; the app designs the game setup (bag, seating guidance, first-night prep) from script and table inputs, then coaches the Storyteller beat-by-beat through the night and day with short prompts they can expand for detail.

**Core Value:** A new Storyteller can run a complete Trouble Brewing game without a paper night sheet — always knowing what to do next and what to say.

### Constraints

- **Script (v1)**: Trouble Brewing only — prove end-to-end coach before expanding
- **Device**: Phone-first layout and interaction; tablet is secondary
- **Role dealing**: Random from bag; Storyteller must log assignments back into the app
- **Audience**: Optimized for new Storytellers (hand-holding over power-user density)
- **Build approach**: Vibe coding with GSD (Get Ship Done) harness

<!-- gsd-project-end -->

<!-- gsd-stack-start source:research/STACK.md -->

## Technology Stack

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| **React** | 19.2.x (`^19.2.7`) | UI runtime | Official `create-vite` `react-ts` template baseline; huge hiring/docs surface for vibe-coding a coaching UI | HIGH |
| **TypeScript** | 6.0.x (`~6.0.2`) | Types + domain modeling | Matches official Vite React-TS scaffold; prefer template line over npm `typescript@7` on day one (7.x is brand-new) | HIGH |
| **Vite** | 8.1.x (`^8.1.4`) | Dev server + static build | Fastest SPA DX; emits a static app shell that service workers cache cleanly — ideal for offline Storyteller use at a table | HIGH |
| **`@vitejs/plugin-react`** | 6.0.x (`^6.0.3`) | React Fast Refresh / JSX | Official Vite React plugin paired with Vite 8 | HIGH |
| **Tailwind CSS** | 4.3.x (`^4.3.2`) | Phone-first styling | Utility-first mobile layout without a design-system tax; v4 Vite plugin is the current official install path | HIGH |
| **`@tailwindcss/vite`** | 4.3.x (`^4.3.2`) | Tailwind ↔ Vite integration | Official docs: `plugins: [tailwindcss()]` + `@import "tailwindcss"` — replaces Tailwind v3 PostCSS pipeline | HIGH |
| **Zustand** | 5.0.x (`^5.0.14`) | Live game + coach state | Tiny API, no provider tree, `persist` middleware fits “grimoire + next beat” session state better than Redux | HIGH |
| **`idb-keyval`** | 6.3.x (`^6.3.0`) | IndexedDB key/value for Zustand persist | Official Zustand persist docs use `idb-keyval` for async IndexedDB storage — survives refresh/tab kill better than `localStorage` for structured game JSON | HIGH |
| **`vite-plugin-pwa`** | 1.3.x (`^1.3.0`) | Manifest + Workbox service worker | De-facto standard for Vite PWAs; `generateSW` + `registerType: 'autoUpdate'` + SPA `navigateFallback` | HIGH |
| **React Router** | 7.18.x (`react-router-dom@^7.18.1`) | Setup vs play screens | Shallow route tree (`/`, `/setup`, `/play`); coach “beat” stays in Zustand, not URL — RR7 is lower ceremony than TanStack for this shape | MEDIUM |
| **Zod** | 4.4.x (`^4.4.3`) | Validate setup inputs + persisted game blobs | Bag generation and night-order data need runtime schemas; Zod 4 is current npm stable | HIGH |

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| **Dexie** | 4.4.x (`^4.4.4`) | Typed IndexedDB tables + schema migrations | Player profiles and past game history (queryable). Keep *active* coach session in Zustand; don’t put hot UI ticks only in Dexie | HIGH |
| **`nanoid`** | 5.x / 6.x (`^5` or `^6.0.0`) | Stable IDs for players / sessions | Any entity that must survive re-renders and export/import | HIGH |
| **`clsx` + `tailwind-merge`** | `clsx@^2.1.1`, `tailwind-merge@^3.6.0` | Conditional class composition | Any reusable UI primitive (buttons, coach cards) | HIGH |
| **`class-variance-authority`** | `^0.7.1` | Variant APIs for phone controls | Optional; add when button/chip variants multiply | MEDIUM |
| **`lucide-react`** | `^0.544` / current (`^1.24.0` on npm at research time) | Icons | Sparse iconography for Next / expand / player actions — avoid emoji-as-UI | MEDIUM |
| **Vaul** | `^1.1.2` | Bottom drawers / sheets | Phone-first progressive disclosure (“tap for more detail”) without a full modal system | MEDIUM |
| **Sonner** | `^2.0.7` | Toasts | Soft confirmations (role recorded, beat advanced) — not for core coaching content | MEDIUM |
| **Vitest** | `^4.1.10` | Unit tests | Pure domain: bag builder, night order, coach step machine | HIGH |
| **`@testing-library/react`** | `^16.3.2` | Component tests | Wizard step transitions and “Next” coach CTA | HIGH |
| **`jsdom`** | `^29.1.1` | DOM env for Vitest | Default companion for RTL in Vite projects | HIGH |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `npm create vite@latest -- --template react-ts` | Scaffold | Align majors with official template; then add PWA + Tailwind |
| `npm create @vite-pwa/pwa@latest` (optional) | PWA-aware scaffold | Alternative if you want manifest/SW wired on day zero |
| `vite-plugin-pwa` client types | SW typings | Add `/// <reference types="vite-plugin-pwa/client" />` |
| Vitest + Testing Library | Domain correctness | Prioritize bag/night-order tests over pixel UI |
| ESLint / oxlint (template default) | Lint | Follow create-vite defaults; don’t invent a second lint stack |
| Static host (Cloudflare Pages / Netlify / GitHub Pages) | Deploy | No Node server — HTTPS origin required for SW installability |
| Chrome DevTools → Application | PWA debug | Service worker, Cache Storage, IndexedDB inspection |

## Installation

# Scaffold (from empty app dir)

# Core runtime

# Styling + PWA (Vite plugins)

# Dev / test (usually already partially present from create-vite)

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vite SPA | **Next.js 15/16** | Public marketing site + SEO, or you truly need RSC/SSR. Not for a private offline Storyteller tool — App Router + Workbox is harder and buys nothing here |
| React 19 | **Vue 3 / Svelte 5** | Team already ships that stack. React remains the default for GSD/vibe-coding + component examples |
| Zustand + `idb-keyval` | **Redux Toolkit + redux-persist** | Large multi-team codebases with established RTK patterns. Overhead is wrong for a single-operator coach |
| Zustand persist | **Jotai / Recoil** | Fine atomic UI state; worse fit for one coherent “game session” document |
| React Router 7 | **TanStack Router** (`@tanstack/react-router@^1.170`) | You want typed search params / file routes for every wizard step and beat ID in the URL. Add `@tanstack/router-plugin` before `@vitejs/plugin-react` |
| Dexie (profiles/history) | **`idb` (Jake Archibald) only** | Tiny wrapper if you never need indexes/migrations beyond key/value |
| `vite-plugin-pwa` (Workbox) | **Serwist** | Custom TypeScript service-worker authorship; evaluate later if Workbox generateSW limits you |
| Tailwind v4 | **CSS Modules / vanilla CSS** | Extremely small UI surface and strong design constraints; slower iteration for phone layouts |
| PWA in browser | **Capacitor / React Native** | Need App Store distribution or deep native APIs. Skip until web PWA fails at the table |
| Static host | **Firebase / Supabase backend** | Multi-device sync, accounts, shared scripts. Out of scope for v1 local co-pilot |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Next.js / Remix / TanStack Start as the app shell** | SSR/RSC and server loaders fight offline-first caching; private phone tool has no SEO requirement | Vite SPA + `vite-plugin-pwa` |
| **Abandoned `next-pwa` / ad-hoc SW without Workbox** | Stale caches and broken App Router assets are a common PWA footgun | `vite-plugin-pwa` `generateSW` |
| **`localStorage` as primary game store** | Size limits, sync API jank, easy to corrupt large grimoire JSON | Zustand `persist` → IndexedDB via `idb-keyval`; Dexie for tables |
| **Redux / MobX / XState as default** | Boilerplate and ceremony slow vibe-coding; coach UX is a small state machine you can express in Zustand + Zod | Zustand (+ optional tiny pure step reducer) |
| **MUI / Ant Design / Chakra as the UI kit** | Desktop-density components fight one-thumb phone coaching and “next beat” focus | Tailwind + Vaul drawers + a few hand-rolled primitives |
| **Full shadcn install as a prerequisite** | Optional copy-paste later; don’t start by owning a whole component registry | Tailwind utilities first; copy one Radix/shadcn piece only when needed |
| **WebSockets / Ably / Liveblocks / Firebase RTDB** | Product is a *private* Storyteller co-pilot, not a multiplayer client | Local state only in v1 |
| **Capacitor / Cordova / Expo on day one** | Extra native toolchain before the coach loop is proven | Installable PWA (`display: standalone`) |
| **GraphQL / tRPC / REST backend for v1** | No server truth needed for TB-only local coaching | Ship static assets; encode TB rules in the client |
| **React Router `react-router@8` alone while `react-router-dom` is still on 7.18** | Version skew risk across packages at research time | Pin `react-router-dom@^7.18.1` (pulls matching `react-router@7.18.1`) |
| **TypeScript 7 as the forced baseline** | Newer than the official Vite template line; avoid day-one churn | TypeScript `~6.0.2` until template/ecosystem catch up |

## Stack Patterns by Variant

- Zustand (live session) + `idb-keyval` persist
- Dexie only when profile/history queries become real
- Because: simplest offline story; fewer sync bugs
- Switch routing to TanStack Router with Zod-validated search params
- Because: typed URL state beats ad-hoc `URLSearchParams`
- Keep Vite SPA; add a sync backend (or CRDT) *after* local model is solid
- Because: local-first schema first, sync second — don’t start with a server
- Wrap the same Vite build in Capacitor
- Because: one UI codebase; native shell is packaging, not a rewrite
- Keep rules as versioned JSON/TS modules validated by Zod; still no CMS required
- Because: content is data; stack stays client-first

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `vite@8.1.x` | `@vitejs/plugin-react@6.x`, `vite-plugin-pwa@1.3.x`, `@tailwindcss/vite@4.3.x` | Verified against current npm + official install docs |
| `react@19.2.x` | `react-dom@19.2.x`, `react-router-dom@7.18.x`, Zustand 5 | Peer ranges accept React ≥18 |
| `tailwindcss@4.3.x` | `@tailwindcss/vite@4.3.x` | Keep majors in lockstep; do not mix v3 PostCSS plugin |
| `zustand@5` + `persist` | `idb-keyval@6` | Use `createJSONStorage(() => customIdbStorage)` for async IndexedDB |
| `vite-plugin-pwa@1.3` | Workbox via plugin | Prefer `generateSW`; set `navigateFallback: '/index.html'` for SPA offline routing |
| `react-router-dom@7.18.1` | `react-router@7.18.1` (dependency) | Do not independently bump to `react-router@8` without matching DOM package |
| `typescript@~6.0.2` | Vite 8 react-ts template | Prefer template TS line over `typescript@7` until scaffold updates |
| `dexie@4.4` | Modern evergreen browsers | Versioned `.stores()` + `.upgrade()` for profile schema changes |

## Persistence Architecture (prescriptive)

## Sources

- Context7 `/vitejs/vite` — create-vite `react-ts` package versions (React 19.2.7, Vite 8.1.x, TS ~6.0.2) — confidence MEDIUM (seam)
- Context7 `/vite-pwa/vite-plugin-pwa` — `registerType: 'autoUpdate'`, Workbox `globPatterns`, SPA navigate fallback — confidence MEDIUM
- Official https://vite-pwa-org.netlify.app/guide/ — install + minimal config — confidence HIGH (official docs; npm version cross-check)
- Context7 `/pmndrs/zustand` — persist + custom IndexedDB via `idb-keyval` — confidence MEDIUM
- Context7 `/websites/dexie` — typed schema + `version().upgrade()` — confidence MEDIUM
- Official https://tailwindcss.com/docs/installation/using-vite — Tailwind 4 + `@tailwindcss/vite` — confidence HIGH
- npm registry (2026-07-16) — package versions listed above — confidence HIGH
- Web comparisons (Vite vs Next for offline/private PWA) — confidence LOW as “trend” sources; conclusion still aligns with official PWA constraints

<!-- gsd-stack-end -->

<!-- gsd-conventions-start source:CONVENTIONS.md -->

## Conventions

### Nix development environment

All repo tooling must run inside the Nix flake:

```bash
CURSOR_DEV=true nix develop -c <command>
```

- Applies to `npm`, `node`, `npx`, Playwright, builds, tests, and linters.
- **Git does not need the Nix prefix** — run `git` directly.
- Cursor rule: `.cursor/rules/nix.mdc` (`alwaysApply: true`).
- Claude entrypoint: `CLAUDE.md`.
<!-- gsd-conventions-end -->

<!-- gsd-architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- gsd-architecture-end -->

<!-- gsd-skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.cursor/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- gsd-skills-end -->

<!-- gsd-workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- gsd-workflow-end -->

<!-- gsd-profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- gsd-profile-end -->
