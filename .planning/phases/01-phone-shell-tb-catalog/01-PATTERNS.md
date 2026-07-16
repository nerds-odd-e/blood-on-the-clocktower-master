# Phase 1: Phone Shell & TB Catalog - Pattern Map

**Mapped:** 2026-07-16
**Files analyzed:** 22
**Analogs found:** 0 / 22 (local codebase)
**Repo state:** Greenfield — planning docs only; no `src/`, no `package.json`, no app scaffold yet (`01-CONTEXT.md` § Existing Code Insights).

> **Planner note:** There are **no local code analogs**. Copy patterns from `01-RESEARCH.md` (planned stack) and `01-UI-SPEC.md` (visual/copy contract). After `create-vite` scaffolds, prefer the generated Vite React-TS defaults for entry/`index.html`, then overlay RESEARCH PWA/Tailwind/Router/Zod patterns. CONTEXT **D-05–D-08** override RESEARCH Vitest-first guidance — Phase 1 tests are **Playwright-only**, no mocks.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `package.json` (+ lockfile) | config | batch | none (create-vite react-ts) | no-analog |
| `vite.config.ts` | config | transform | none — RESEARCH Pattern 2 + Tailwind wiring | no-analog |
| `index.html` | config | request-response | none — create-vite + RESEARCH viewport meta | no-analog |
| `src/index.css` | config | transform | none — Tailwind v4 `@import` + UI-SPEC tokens | no-analog |
| `src/vite-env.d.ts` | config | — | none — `vite-plugin-pwa/client` reference | no-analog |
| `src/main.tsx` | route | request-response | none — create-vite entry | no-analog |
| `src/app/App.tsx` | route | request-response | none — RESEARCH Router stub example | no-analog |
| `src/app/routes.tsx` | route | request-response | none — RESEARCH shallow `/` `/setup` `/play` | no-analog |
| `src/app/layout/PhoneShell.tsx` | component | request-response | none — RESEARCH Pattern 3 + UI-SPEC PhoneShell | no-analog |
| `src/ui/home/ScriptHome.tsx` | component | request-response | none — UI-SPEC home composition | no-analog |
| `src/ui/setup/SetupStub.tsx` (or inline route) | component | request-response | none — UI-SPEC stub copy | no-analog |
| `src/ui/play/PlayStub.tsx` (or inline route) | component | request-response | none — UI-SPEC stub copy | no-analog |
| `src/data/scripts/trouble-brewing/roles.json` | model | file-I/O | none — townsquare TB subset (RESEARCH) | no-analog |
| `src/data/scripts/trouble-brewing/setup-chart.json` | model | file-I/O | none — RESEARCH setup chart table | no-analog |
| `src/data/scripts/trouble-brewing/procedural-beats.json` | model | file-I/O | none — RESEARCH procedural beats | no-analog |
| `src/domain/script/schemas.ts` | model | transform | none — RESEARCH Pattern 1 Zod | no-analog |
| `src/domain/script/loadCatalog.ts` | service | transform | none — RESEARCH catalog loaders | no-analog |
| `src/domain/script/index.ts` | utility | transform | none — barrel export (conventional) | no-analog |
| `public/pwa-192x192.png` | config | file-I/O | none — original CCC-safe icons only | no-analog |
| `public/pwa-512x512.png` | config | file-I/O | none — original CCC-safe icons only | no-analog |
| `playwright.config.ts` | config | batch | none — CONTEXT D-05–D-08 (Playwright-only) | no-analog |
| `e2e/*.spec.ts` (home, stubs, catalog, offline) | test | request-response | none — real app + real TB data, no mocks | no-analog |

**Implied but optional (planner discretion):** `tsconfig*.json`, `eslint.config.js` from create-vite; font packages (`@fontsource/fraunces`, `@fontsource/source-sans-3`) or self-hosted woff2 under `public/fonts/`.

## Pattern Assignments

### Scaffold / config files (`package.json`, `vite.config.ts`, `index.html`, `src/index.css`, `src/vite-env.d.ts`)

**Analog:** None in repo. **Planned source:** `01-RESEARCH.md` § Code Examples + Pattern 2; create-vite `react-ts` defaults.

**Core Vite + Tailwind + PWA pattern** (from RESEARCH — copy into `vite.config.ts`):

```typescript
// Source: 01-RESEARCH.md lines ~358–367, Pattern 2 ~244–267
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "BotC Storyteller Copilot",
        short_name: "ST Copilot",
        display: "standalone",
        start_url: "/",
        background_color: "#0b0b0b",
        theme_color: "#0b0b0b",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2,json}"],
      },
    }),
  ],
});
```

**Tailwind CSS entry** (`src/index.css`):

```css
@import "tailwindcss";
/* Then UI-SPEC CSS variables: --color-dominant #0B0B0B, --accent #C4A35A, fonts Fraunces / Source Sans 3 */
```

**Viewport / PWA HTML** (`index.html` — RESEARCH Pattern 3):

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

**PWA client types** (`src/vite-env.d.ts`):

```typescript
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
```

**Error / validation:** Config has no runtime errors; broken PWA shows as missing SW in preview — gate on `npm run build && npm run preview` (RESEARCH Pitfall 2).

**Do not install for Phase 1:** Zustand, Dexie, Vaul, Sonner, lucide-react, Vitest (CONTEXT D-05–D-07 override RESEARCH Vitest Wave 0).

---

### `src/main.tsx` (route, request-response)

**Analog:** None. **Planned source:** create-vite `main.tsx` + register SW if using `virtual:pwa-register`.

**Core pattern:**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Optional (planner discretion): `import { registerSW } from "virtual:pwa-register"` with `registerType: "autoUpdate"` — matches RESEARCH PWA pattern.

---

### `src/app/App.tsx` + `src/app/routes.tsx` (route, request-response)

**Analog:** None. **Planned source:** `01-RESEARCH.md` § React Router 7 stub routes.

**Imports pattern:**

```tsx
import { BrowserRouter, Routes, Route } from "react-router";
// STACK pins react-router-dom@^7.18.1 — verify import path after install (RESEARCH A3)
import { PhoneShell } from "./layout/PhoneShell";
import { ScriptHome } from "../ui/home/ScriptHome";
```

**Core routing pattern** (RESEARCH ~376–391):

```tsx
export function App() {
  return (
    <BrowserRouter>
      <PhoneShell>
        <Routes>
          <Route path="/" element={<ScriptHome />} />
          <Route path="/setup" element={<SetupStub />} />
          <Route path="/play" element={<PlayStub />} />
        </Routes>
      </PhoneShell>
    </BrowserRouter>
  );
}
```

**Auth pattern:** None — no accounts (PLAT-02).

**Error handling:** Route-level only; catalog errors surface inside `ScriptHome` (UI-SPEC empty/error states), not a global error boundary requirement in Phase 1.

---

### `src/app/layout/PhoneShell.tsx` (component, request-response)

**Analog:** None. **Planned source:** RESEARCH Pattern 3 + UI-SPEC § PhoneShell / Spacing / Color.

**Core layout pattern** (RESEARCH ~283–294 + UI-SPEC):

```tsx
export function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh overflow-x-hidden mx-auto max-w-[40rem] px-6"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        backgroundColor: "#0B0B0B",
        color: "#F2EDE6",
      }}
    >
      {children}
    </div>
  );
}
```

**UI-SPEC must-haves:** horizontal padding `lg` (24px); no bottom tab bar; touch targets ≥44px on descendants; table-lantern dark shell.

**Do not copy:** Dashboard chrome, sticky footers, icon tab bars, shadcn layout primitives.

---

### `src/ui/home/ScriptHome.tsx` (component, request-response)

**Analog:** None. **Planned source:** `01-UI-SPEC.md` home composition + copywriting contract; catalog via `loadCatalog`.

**Core composition** (UI-SPEC first viewport — exactly one composition):

1. Display: **Storyteller Copilot**
2. Supporting: Helps you run Trouble Brewing — offline, on your phone.
3. One script card (secondary `#1A1714`, border `#2A2622`) + CTA **Start setup** → `/setup`
4. Status chip **Offline ready** when catalog valid (CONTEXT D-01–D-03) — not gated on SW controller
5. Meta: `22 roles · setup chart · night order`; status **Available**
6. Optional compact role roster by team (names + badges only; no Almanac ability text)

**Imports pattern (planned):**

```tsx
import { Link } from "react-router";
import { loadCatalog } from "../../domain/script";
```

**Error / empty handling** (UI-SPEC):

- Zod failure → Error state copy; hide Start setup
- Zero scripts → Empty state copy
- Sync import at module init — no loading skeleton
- Render strings as text nodes only — **never** `dangerouslySetInnerHTML`

**Offline chip (CONTEXT D-01–D-02):** Show when catalog parse succeeds (optimistic). Do not wire to `navigator.onLine` or SW `controller` in Phase 1.

---

### `src/ui/setup/SetupStub.tsx` + `src/ui/play/PlayStub.tsx` (component, request-response)

**Analog:** None. **Planned source:** UI-SPEC stub copy.

**Core pattern:**

```tsx
// Setup
// Heading: Setup
// Body: Setup wizard comes in the next phase.
// Link: Back to home → /

// Play
// Heading: Play
// Body: Night coach comes after setup.
// Link: Back to home → /
```

Keep inside `PhoneShell`. No wizard/coach UI. May be inlined in `routes.tsx` if planner prefers fewer files — same copy contract.

---

### `src/data/scripts/trouble-brewing/*.json` (model, file-I/O)

**Analog:** None in repo. **External shape reference:** bra1n/townsquare `roles.json` filtered `edition === "tb"`, drop travelers (RESEARCH) — **do not fetch at runtime**.

| File | Contents |
|------|----------|
| `roles.json` | 22 characters: 13 townsfolk / 4 outsider / 4 minion / 1 demon; fields per RoleSchema |
| `setup-chart.json` | playerCount 5–15 → team counts (verify official sheet before locking — RESEARCH A1) |
| `procedural-beats.json` | dusk / minion-info / demon-info / dawn (not role rows) |

**Anti-patterns:** Runtime fetch; official token art PNGs; Travelers/Fabled in v1 UI/data.

---

### `src/domain/script/schemas.ts` (model, transform)

**Analog:** None. **Planned source:** RESEARCH Pattern 1.

**Validation pattern** (RESEARCH ~214–231):

```typescript
import { z } from "zod";

export const RoleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  edition: z.literal("tb"),
  team: z.enum(["townsfolk", "outsider", "minion", "demon"]),
  ability: z.string(),
  firstNight: z.number().int().nonnegative(),
  otherNight: z.number().int().nonnegative(),
  firstNightReminder: z.string(),
  otherNightReminder: z.string(),
  reminders: z.array(z.string()).default([]),
  setup: z.boolean(),
});

export const CatalogSchema = z.object({
  scriptId: z.literal("trouble-brewing"),
  roles: z.array(RoleSchema).min(1),
});
```

Extend with Zod schemas for `setup-chart.json` and `procedural-beats.json` in the same file (or sibling modules) — keep all catalog validation in `domain/script`.

**Error handling:** Prefer `.parse()` at load so corrupt JSON fails fast; UI catches and shows Error state.

---

### `src/domain/script/loadCatalog.ts` + `index.ts` (service / utility, transform)

**Analog:** None. **Planned source:** RESEARCH Architecture Patterns — “Script Catalog as Read-Only Data Plane”.

**Core pattern (planned):**

```typescript
import roles from "../../data/scripts/trouble-brewing/roles.json";
import setupChart from "../../data/scripts/trouble-brewing/setup-chart.json";
import proceduralBeats from "../../data/scripts/trouble-brewing/procedural-beats.json";
import { CatalogSchema /* + SetupChartSchema, ProceduralBeatsSchema */ } from "./schemas";

export function loadCatalog() {
  // Zod.parse bundled JSON; return typed { scriptId, roles, setupChart, proceduralBeats }
  // Do not hard-code night order in UI — expose ordinals from data
}
```

**Barrel (`index.ts`):** Re-export `loadCatalog`, schemas, and inferred types for home + later phases.

**Auth:** N/A. **Data flow:** sync module-init transform (file-I/O via Vite JSON import → Zod → typed object).

---

### `public/pwa-*.png` (config, file-I/O)

**Analog:** None. **Constraint:** Original or CCC-safe icons only — **no official BotC purple-box art** (RESEARCH Pitfall 6 / PITFALLS.md).

Match RESEARCH manifest sizes 192 / 512 (+ maskable purpose on 512).

---

### `playwright.config.ts` + `e2e/*.spec.ts` (config / test)

**Analog:** None. **Override source:** CONTEXT D-05–D-08 (not RESEARCH Vitest Validation Architecture).

**Test strategy (locked):**

| Rule | Decision |
|------|----------|
| Framework | Playwright E2E only for Phase 1 |
| Coverage | Full shipped behavior: home/shell, stub routes, catalog surface, offline/PWA where feasible |
| Mocks | **None** — real app, real bundled TB JSON, real SW where tested |
| Vitest | Do **not** add domain golden unit suites this phase |

**Suggested E2E structure (no local analog — planner invents):**

```
e2e/
  home.spec.ts          # app name, TB card, Offline ready chip, Start setup
  stubs.spec.ts         # /setup + /play copy + Back to home
  catalog.spec.ts       # 22 roles / team counts / setup chart / night order via UI against real JSON
  offline.spec.ts       # build+preview or webServer; context.setOffline(true); reload / and /setup
playwright.config.ts    # webServer: vite preview (or preview after build); baseURL localhost
```

**Assert catalog correctness through the running UI**, not by importing JSON in a unit test (D-07).

## Shared Patterns

### No authentication
**Source:** PROJECT / RESEARCH PLAT-02  
**Apply to:** All files  
No auth middleware, guards, or session stores in Phase 1.

### Catalog validation (Zod)
**Source:** `01-RESEARCH.md` Pattern 1  
**Apply to:** `schemas.ts`, `loadCatalog.ts`, home empty/error UI  
Parse at load; fail closed to UI-SPEC Error/Empty copy.

### Phone-first shell
**Source:** RESEARCH Pattern 3 + UI-SPEC PhoneShell  
**Apply to:** All screens  
`viewport-fit=cover`, `env(safe-area-inset-*)`, `overflow-x: hidden`, `max-width: 40rem`, ≥44px touch targets.

### SPA offline PWA
**Source:** RESEARCH Pattern 2  
**Apply to:** `vite.config.ts`, E2E offline specs  
`registerType: 'autoUpdate'`, `navigateFallback: '/index.html'`, precache JSON via `globPatterns`.

### XSS / IP safety
**Source:** RESEARCH Security Domain + PITFALLS  
**Apply to:** Home + any catalog rendering  
Text nodes only; no official token art; no Almanac dump on home.

### Playwright-only quality gate
**Source:** CONTEXT D-05–D-08  
**Apply to:** All Phase 1 automated tests  
Overrides RESEARCH/VALIDATION Vitest Wave 0 checklists — planner must re-target validation to Playwright.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| All Phase 1 app/config/test files (22) | * | * | Repo is greenfield: only `.planning/` + `AGENTS.md`. No `src/` or prior components/services/tests to copy. |

**Planner should:**

1. Scaffold with `npm create vite@latest . -- --template react-ts` (RESEARCH primary recommendation).
2. Overlay RESEARCH PWA/Tailwind/Router/Zod patterns and UI-SPEC visual contract.
3. Use Playwright (not Vitest) per CONTEXT override.
4. Treat RESEARCH code blocks as the canonical “analog excerpts” until real code exists post-execute.

## Metadata

**Analog search scope:** Entire repo root (glob `**/*.{ts,tsx,js,jsx,json,css,html}`); `.cursor/rules/` (empty); `.planning/` docs only  
**Files scanned:** ~20 tracked paths — zero application source files  
**Local analogs:** 0  
**External / planned-stack pattern sources:** `01-RESEARCH.md`, `01-UI-SPEC.md`, `01-CONTEXT.md` (test override), `.planning/research/STACK.md`  
**Pattern extraction date:** 2026-07-16
