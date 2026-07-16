# Phase 1: Phone Shell & TB Catalog - Research

**Researched:** 2026-07-16
**Domain:** Vite React SPA + PWA shell; Trouble Brewing client-side catalog (roles, setup chart, night ordinals)
**Confidence:** HIGH (scaffold/PWA/Tailwind); MEDIUM (TB interchange JSON vs official Script Tool parity)

<user_constraints>
## User Constraints (from CONTEXT.md)

> **No CONTEXT.md** — discuss-phase was skipped. Constraints below are derived from PROJECT.md, REQUIREMENTS.md, ROADMAP.md, and STATE.md for planner use.

### Locked Decisions (project-level)
- Phone-first UI; tablet secondary
- Trouble Brewing only in v1
- Offline PWA after first load; no account
- Storyteller co-pilot (not AI-as-Storyteller / not player-facing town square)
- Wizard → next-beat coach UX (Phase 1 only ships shell + catalog; wizard/coach later)
- Role dealing stays random; ST records assignments later (not Phase 1 UI)
- Do not distribute official BotC token art / App Store without TPI approval

### Claude's Discretion
- Exact scaffold path (`create-vite` vs `create @vite-pwa/pwa`)
- Home/catalog UI density within phone-first rules
- Whether travelers appear in catalog data (recommend: exclude for v1)
- Precise Zod schema field optionality for reminders / image URLs

### Deferred Ideas (OUT OF SCOPE)
- Setup wizard, bag builder, role recording (Phase 2)
- Night coach, live grimoire tokens/bluffs (Phase 3)
- Bad Moon Rising / Sects & Violets / custom scripts / Travelers & Fabled as product features
- Zustand session persist / Dexie profiles (not required for PLAT-01/02)
- Online Town Square, Discord bots, AI speaking to players
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PLAT-01 | UI is phone-first and usable on tablet | Viewport `device-width` + `viewport-fit=cover`; safe-area padding via `env(safe-area-inset-*)`; single-column shell; overflow-x containment; ≥44px touch targets; tablet = same layout with max readable width |
| PLAT-02 | App works offline as a PWA after first load with no account | `vite-plugin-pwa` `generateSW` + `registerType: 'autoUpdate'` + `workbox.navigateFallback: '/index.html'`; precache app shell + bundled TB JSON; no auth; HTTPS host for installability |
</phase_requirements>

## Summary

Phase 1 is a greenfield walking-skeleton: scaffold a Vite + React 19 + TypeScript SPA, add Tailwind CSS v4 via `@tailwindcss/vite`, wire an installable offline PWA with Workbox, and ship a curated Trouble Brewing catalog (roles, setup chart, night-order ordinals + procedural beats) validated by Zod. Success is a phone-usable shell that reloads offline and exposes TB as the only script for later setup/coach phases — not the wizard or coach themselves.

Authoritative night-order truth is the official Script Tool / night sheet; community `roles.json` (bra1n/townsquare shape) is the de facto interchange for fields like `id`, `team`, `firstNight`, `otherNight`, reminders, and `setup`. Bundle a curated TB subset in the client (do not fetch at runtime). Exclude Travelers from the v1 catalog. Do not ship official purple-box token art.

**Primary recommendation:** `npm create vite@latest . -- --template react-ts`, then add Tailwind 4 + `vite-plugin-pwa` + Zod + React Router 7 shallow routes (`/`, `/setup`, `/play` stubs), and commit curated TB JSON under `src/data/scripts/trouble-brewing/` validated at load time.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Phone shell layout / safe areas | Browser / Client | — | CSS viewport + Tailwind utilities only |
| Client routing (`/`, `/setup`, `/play`) | Browser / Client | CDN / Static | SPA routes; SW navigateFallback → `index.html` |
| PWA install + offline asset cache | Browser / Client | CDN / Static | Service worker precaches build output; no server |
| TB roles / setup chart / night ordinals | Browser / Client | — | Immutable bundled data; Zod at module init |
| Script catalog API for later phases | Browser / Client | — | Pure loaders in `domain/script` — no backend |
| Auth / accounts | — | — | Explicitly none (PLAT-02) |
| Session persist / IndexedDB | — (defer Phase 2+) | — | Not required for PLAT-01/02 |

## Project Constraints (from .cursor/rules/)

`.cursor/rules/` exists but is empty — no project-specific rule directives. Follow AGENTS.md / STACK.md conventions and GSD workflow.

## Standard Stack

### Core (Phase 1 install)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vite | `8.1.4` [VERIFIED: npm registry] | Dev server + static build | SPA shell caches cleanly with Workbox |
| React / react-dom | `19.2.7` [VERIFIED: npm registry] | UI runtime | create-vite react-ts baseline |
| TypeScript | `~6.0.2` or `~6.0.3` [VERIFIED: npm registry] | Types | Prefer template line over npm `typescript@7` (7.0.2 is latest but STACK locks 6.x) |
| `@vitejs/plugin-react` | `6.0.3` [VERIFIED: npm registry] | JSX / Fast Refresh | Official Vite React plugin |
| Tailwind CSS | `4.3.2` [VERIFIED: npm registry] | Phone-first styling | Official Vite install path [CITED: tailwindcss.com/docs/installation/using-vite] |
| `@tailwindcss/vite` | `4.3.2` [VERIFIED: npm registry] | Tailwind ↔ Vite | `plugins: [tailwindcss()]` + `@import "tailwindcss"` |
| `vite-plugin-pwa` | `1.3.0` [VERIFIED: npm registry] | Manifest + generateSW | De-facto Vite PWA [CITED: vite-pwa-org.netlify.app/guide] |
| `react-router-dom` | `7.18.1` [VERIFIED: npm registry] | Shallow SPA routes | Library mode; beat cursor stays out of URL until later |
| Zod | `4.4.3` [VERIFIED: npm registry] | Catalog schema validation | Runtime parse of bundled JSON [CITED: zod.dev] |

### Supporting (Phase 1)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | `4.1.10` [VERIFIED: npm registry] | Unit tests | Catalog Zod parse + setup-chart golden tests |
| `jsdom` | `29.1.1` [VERIFIED: npm registry] | DOM env | Vitest browser-ish tests |
| `@testing-library/react` | `16.3.2` [VERIFIED: npm registry] | Component tests | Shell renders + route stubs (optional this phase) |

### Defer to later phases (do not install for PLAT-only)

| Library | Why defer |
|---------|-----------|
| Zustand + idb-keyval | Live game session — Phase 2+ |
| Dexie | Profiles/history — not Phase 1 |
| Vaul / Sonner / lucide-react | Nice for coach/wizard; optional if home needs icons only |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `create-vite` + manual PWA | `npm create @vite-pwa/pwa@latest` | Faster PWA wiring; less control vs STACK-aligned manual config |
| React Router 7 | TanStack Router | Overkill for 3 stub routes |
| Bundled TB JSON | Runtime fetch from Script Tool | Breaks offline + PLAT-02 |
| Community `roles.json` as-is | Hand-typed TS constants | JSON + Zod matches ecosystem and future scripts |

**Installation:**

```bash
npm create vite@latest . -- --template react-ts
npm install react@^19.2.7 react-dom@^19.2.7 react-router-dom@^7.18.1 zod@^4.4.3
npm install -D typescript@~6.0.2 @vitejs/plugin-react@^6.0.3 \
  vite@^8.1.4 vite-plugin-pwa@^1.3.0 \
  tailwindcss@^4.3.2 @tailwindcss/vite@^4.3.2 \
  vitest@^4.1.10 jsdom@^29.1.1 @testing-library/react@^16.3.2
```

**Version verification (2026-07-16):** `npm view` returned the versions in the tables above. No `postinstall` scripts on any Phase 1 package [VERIFIED: npm registry].

## Package Legitimacy Audit

| Package | Registry | Age signal | Downloads (wk) | Source Repo | Verdict | Disposition |
|---------|----------|------------|----------------|-------------|---------|-------------|
| vite | npm | recent publish | ~117M | github.com/vitejs/vite | SUS (too-new) | Approved — age heuristic false positive; official docs |
| vite-plugin-pwa | npm | — | ~3.4M | github.com/vite-pwa/vite-plugin-pwa | OK | Approved |
| tailwindcss | npm | recent publish | ~98M | github.com/tailwindlabs/tailwindcss | SUS (too-new) | Approved — official Vite docs |
| @tailwindcss/vite | npm | recent publish | ~38M | github.com/tailwindlabs/tailwindcss | SUS (too-new) | Approved |
| react / react-dom | npm | — | ~145M / ~113M | github.com/facebook/react | OK | Approved |
| react-router-dom | npm | recent publish | ~42M | github.com/remix-run/react-router | SUS (too-new) | Approved — Context7 docs |
| zod | npm | — | ~210M | github.com/colinhacks/zod | OK | Approved |
| vitest | npm | recent publish | ~73M | github.com/vitest-dev/vitest | SUS (too-new) | Approved |
| @vitejs/plugin-react | npm | recent publish | ~55M | github.com/vitejs/vite-plugin-react | SUS (too-new) | Approved |
| jsdom | npm | — | ~62M | github.com/jsdom/jsdom | OK | Approved |
| @testing-library/react | npm | — | ~44M | testing-library/react-testing-library | OK | Approved |

**Packages removed due to [SLOP] verdict:** none  
**Packages flagged as suspicious [SUS]:** several core packages flagged only for `too-new` despite official repos and massive downloads — **no `checkpoint:human-verify` required**; treat as Approved for planning.

## Architecture Patterns

### System Architecture Diagram

```
┌──────────────────┐
│ Storyteller phone│  first load (HTTPS)
└────────┬─────────┘
         │ GET / (JS/CSS/HTML + TB JSON in bundle)
         ▼
┌────────────────────────────────────────────┐
│ Static host (CDN) — no Node API            │
└────────┬───────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ App Shell (React)                          │
│  viewport-fit=cover · safe-area padding    │
│  Routes: / | /setup(stub) | /play(stub)    │
└────────┬───────────────────────────────────┘
         │ import
         ▼
┌────────────────────────────────────────────┐
│ domain/script loaders                      │
│  Zod.parse(roles) · setupChart · nightMeta │
└────────┬───────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ data/scripts/trouble-brewing/*.json        │
│  roles · setup-chart · procedural-beats    │
└────────────────────────────────────────────┘

Service Worker (generateSW)
  precache → app shell + assets
  navigateFallback → /index.html  (offline deep links)
```

### Recommended Project Structure

```
src/
├── app/
│   ├── App.tsx                 # Router + phone chrome
│   ├── routes.tsx              # /, /setup, /play
│   └── layout/
│       └── PhoneShell.tsx      # safe-area, overflow-x, max-width
├── data/scripts/trouble-brewing/
│   ├── roles.json              # 22 TB characters (no travelers)
│   ├── setup-chart.json        # playerCount 5–15 → team counts
│   └── procedural-beats.json   # dusk / minion-info / demon-info / dawn
├── domain/script/
│   ├── schemas.ts              # Zod schemas
│   ├── loadCatalog.ts          # parse + export typed catalog
│   └── index.ts
├── ui/home/
│   └── ScriptHome.tsx          # “Trouble Brewing” available script
└── main.tsx
public/
├── pwa-192x192.png             # original / CCC-safe icons only
└── pwa-512x512.png
```

### Pattern 1: Script Catalog as Read-Only Data Plane

**What:** Characters and night ordinals live in JSON; runtime never hard-codes wake order.  
**When to use:** Always — matches BotC tooling interchange.  
**Example:**

```typescript
// Shape aligned with townsquare roles.json [VERIFIED: bra1n/townsquare roles.json]
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

### Pattern 2: SPA Offline with navigateFallback

**What:** Workbox precaches build assets; navigation requests fall back to `index.html` so `/setup` works offline.  
**When to use:** Any React Router SPA PWA.  
**Example:**

```typescript
// Source: vite-plugin-pwa guide + STACK.md [CITED: vite-pwa-org.netlify.app/guide]
import { VitePWA } from "vite-plugin-pwa";

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
      { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  },
  workbox: {
    navigateFallback: "/index.html",
    globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2,json}"],
  },
  // Optional for SW debugging:
  // devOptions: { enabled: true },
});
```

Add `/// <reference types="vite-plugin-pwa/client" />` for virtual module types [CITED: vite-pwa-org.netlify.app/guide/faq].

### Pattern 3: Phone Shell Chrome

**What:** One column, safe-area padding, no horizontal scroll, thumb-reachable primary actions.  
**When to use:** Every Phase 1+ screen.  
**Example:**

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

```css
/* Source: MDN env() [CITED: developer.mozilla.org/en-US/docs/Web/CSS/env] */
.app-shell {
  min-height: 100dvh;
  padding:
    env(safe-area-inset-top, 0px)
    env(safe-area-inset-right, 0px)
    env(safe-area-inset-bottom, 0px)
    env(safe-area-inset-left, 0px);
  overflow-x: hidden;
  max-width: 40rem; /* tablet: readable column */
  margin-inline: auto;
}
```

### Anti-Patterns to Avoid

- **Fetching TB data at runtime** — breaks offline and introduces network dependency
- **Hard-coding night order in UI components** — use catalog ordinals + procedural beats
- **Including Travelers/Fabled in v1 catalog UI** — SCRIPT expansion is deferred
- **Official token art / purple-box assets** — IP / CCC landmine [CITED: .planning/research/PITFALLS.md]
- **Building wizard/coach in Phase 1** — out of success criteria; stubs only
- **SSR frameworks (Next/Remix)** — fights offline SPA + Workbox story

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Service worker precache + update | Custom SW + Cache API | `vite-plugin-pwa` generateSW | Workbox edge cases (revisioning, navigateFallback) |
| Tailwind build pipeline | Hand-rolled PostCSS v3 | `@tailwindcss/vite` | Official v4 path |
| Catalog validation | Ad-hoc `if (!role.id)` | Zod schemas + Vitest | Corrupt JSON fails fast |
| SPA offline deep links | Manual fetch handler | `navigateFallback: '/index.html'` | Standard Workbox SPA pattern |
| Route matching | `window.location` switch | React Router 7 | Future wizard/play screens |

**Key insight:** Phase 1 value is correct *data + shell*, not custom platform plumbing.

## Common Pitfalls

### Pitfall 1: Offline routes 404 without navigateFallback
**What goes wrong:** `/setup` works online, blank/404 offline after reload.  
**Why:** SW caches assets but navigation requests miss SPA fallback.  
**How to avoid:** Set `workbox.navigateFallback: '/index.html'`; verify with `npm run build && npm run preview` + DevTools offline.  
**Warning signs:** Only `/` works offline.

### Pitfall 2: Testing PWA only in `vite dev`
**What goes wrong:** “Offline works in my head” — SW not active or incomplete.  
**Why:** Dev SW is optional/`devOptions`; production precache differs.  
**How to avoid:** Gate PLAT-02 on production build + preview (or `devOptions.enabled` explicitly for smoke).  
**Warning signs:** Application tab empty in preview.

### Pitfall 3: Wrong or incomplete night ordinals
**What goes wrong:** Later coach wakes Spy/Poisoner in wrong order; fan sheets disagree.  
**Why:** Copying an outdated night sheet; mixing editions.  
**How to avoid:** Curate from townsquare TB `edition: "tb"` + cross-check Script Tool / official night sheet; golden-test known TB first-night order sample.  
**Warning signs:** Spy after all Townsfolk on N1.

### Pitfall 4: Shipping Drunk as a bag token in data misuse
**What goes wrong:** Later bag builder treats Drunk like a drawable token.  
**Why:** Catalog marks `setup: true` but UI/docs unclear.  
**How to avoid:** Keep `setup: true` on Drunk/Baron; document that Drunk token handling is Phase 2 bag logic — Phase 1 only exposes data.  
**Warning signs:** Home UI lists Drunk as “draw me.”

### Pitfall 5: Horizontal scroll / notch clipping
**What goes wrong:** Unusable on iPhone notches / wide tables.  
**Why:** Missing `viewport-fit=cover` / safe-area / `overflow-x`.  
**How to avoid:** PhoneShell pattern above; manual check at 390×844.  
**Warning signs:** Sideways scroll on home.

### Pitfall 6: IP / asset landmines
**What goes wrong:** CCC/TPI complaint for official art.  
**How to avoid:** Original or CCC-safe icons only; ability text short / paraphrased if shown; no store listing this phase.  
**Warning signs:** Wiki-dumped PNG tokens in `/public`.

## Code Examples

### Tailwind v4 Vite wiring

```typescript
// Source: https://tailwindcss.com/docs/installation/using-vite
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({ /* see Pattern 2 */ })],
});
```

```css
@import "tailwindcss";
```

### React Router 7 stub routes

```tsx
// Source: Context7 /remix-run/react-router (library mode)
import { BrowserRouter, Routes, Route } from "react-router";
import { ScriptHome } from "./ui/home/ScriptHome";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScriptHome />} />
        <Route path="/setup" element={<p>Setup (Phase 2)</p>} />
        <Route path="/play" element={<p>Play (Phase 3)</p>} />
      </Routes>
    </BrowserRouter>
  );
}
```

Note: STACK pins `react-router-dom@^7.18.1`; imports may be from `react-router` / `react-router/dom` depending on package re-exports — verify after install against installed package exports.

### Setup chart data (canonical TB distribution)

Encode as JSON (player counts 5–15). Commonly cited distribution [ASSUMED — cross-check against physical setup sheet / wiki Setup before locking golden tests]:

| Players | Townsfolk | Outsiders | Minions | Demons |
|---------|-----------|-----------|---------|--------|
| 5 | 3 | 0 | 1 | 1 |
| 6 | 3 | 1 | 1 | 1 |
| 7 | 5 | 0 | 1 | 1 |
| 8 | 5 | 1 | 1 | 1 |
| 9 | 5 | 2 | 1 | 1 |
| 10 | 7 | 0 | 2 | 1 |
| 11 | 7 | 1 | 2 | 1 |
| 12 | 7 | 2 | 2 | 1 |
| 13 | 9 | 0 | 3 | 1 |
| 14 | 9 | 1 | 3 | 1 |
| 15 | 9 | 2 | 3 | 1 |

> **Planner note:** Secondary web sources disagree on some rows (especially 10–15 Outsider/Minion splits). Treat the table as a draft; **verify against the official TB setup sheet / wiki Setup** in Wave 0 and lock golden tests to that verified chart. Baron `[+2 Outsiders]` is a modifier, not a chart row.

### TB roles source

- Community interchange: `bra1n/townsquare` `src/roles.json`, filter `edition === "tb"`, drop `team === "traveler"` → **22 characters** (13 TF / 4 Out / 4 Min / 1 Demon) [VERIFIED: fetched roles.json 2026-07-16]
- Canonical night order cross-check: official Script Tool (`script.bloodontheclocktower.com`) [CITED: BGG file comments / TPI Script page]
- Procedural first-night steps (Minion Info / Demon Info when ≥7 players) are **not** role rows — ship in `procedural-beats.json` [CITED: .planning/research/ARCHITECTURE.md]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 PostCSS | Tailwind v4 `@tailwindcss/vite` | Tailwind 4 | Simpler Vite config |
| Hand-rolled SW | vite-plugin-pwa generateSW | Ongoing | SPA offline is config, not custom code |
| Hard-coded edition lists | Script Tool + community JSON interchange | BotC online era | Catalog-as-data |

**Deprecated/outdated:**
- Tailwind v3-only PostCSS pipeline for new Vite apps
- Next.js / `next-pwa` for this private offline tool

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Exact TB setup-chart rows for 10–15 players as tabulated | Code Examples / Setup chart | Illegal bags in Phase 2 if chart wrong — must verify vs official sheet |
| A2 | Excluding Travelers from catalog is correct for Phase 1 | User Constraints / Structure | May need empty traveler array for Script Tool JSON compatibility |
| A3 | `react-router` import paths match `react-router-dom@7.18.1` re-exports | Code Examples | Fix imports after scaffold if build fails |
| A4 | Touch-target ≥44px guideline sufficient for PLAT-01 | Patterns | Prefer device UAT over pixel doctrine |

**If empty of unverified claims beyond A1–A4:** core stack/PWA claims were registry- and docs-verified.

## Open Questions (RESOLVED)

1. **Setup chart authoritative source** — RESOLVED
   - What we know: Chart exists on physical setup sheet / wiki Setup; community PDFs list counts
   - What's unclear: Exact Outsider/Minion counts for 10–15 in secondary web sources conflict
   - Recommendation: Wave 0 task — photograph/transcribe official sheet or wiki Setup table; lock JSON + tests
   - **RESOLVED:** Lock `setup-chart.json` to the distribution table in this RESEARCH.md (A1 / official sheet transcription path). Plans `01-02` (initial bundle) and `01-03` (Zod sum refinement + Playwright catalog suite) treat that table as authoritative; put the verification source note in the `loadCatalog.ts` header comment (not inside the JSON).

2. **Ability text provenance** — RESOLVED
   - What we know: townsquare includes ability strings; Almanac scraping is IP-sensitive
   - What's unclear: How much ability text to show on Phase 1 home
   - Recommendation: Show role names + teams + night ordinals; keep ability strings short; paraphrase if displaying coaching later
   - **RESOLVED:** Per CONTEXT Claude's Discretion + UI-SPEC catalog content policy — Phase 1 home shows names + team badges (+ optional compact roster); omit Almanac ability dump on home. Ability strings may exist on role rows for later phases but must not be featured as home Almanac paragraphs (D-09 / plan `01-02`–`01-03`).

3. **UI-phase** — RESOLVED
   - Roadmap marks `UI hint: yes`; `workflow.ui_phase: true`
   - Recommendation: Planner should expect `/gsd-ui-phase` or minimal UI-SPEC for home shell before execute if orchestrator runs UI gate
   - **RESOLVED:** `01-UI-SPEC.md` is approved and locked via CONTEXT D-09. Execute follows that contract; no further UI-phase gate before Wave 1 execute.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite / npm | ✓ | v24.5.0 | — (≥18 required by Vite) |
| npm | Install | ✓ | 11.5.1 | — |
| nix | User rule prefix | ✓ | 2.30.2 | Prefer homebrew node for speed; use `nix` when user requires |
| HTTPS static host | PWA installability | ✗ (local) | — | `vite preview` over localhost OK for SW; real install needs HTTPS deploy later |
| Graphify graph | Cross-doc intel | ✗ | — | Continue without graph |

**Missing dependencies with no fallback:** none for local scaffold  
**Missing dependencies with fallback:** production HTTPS host — not required to implement Phase 1 locally

Step 2.6: External deps identified and probed (Node/npm available).

## Validation Architecture

> Nyquist validation enabled (`workflow.nyquist_validation: true`).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `^4.1.10` + jsdom (Wave 0 install) |
| Config file | none yet — Wave 0: `vitest.config.ts` |
| Quick run command | `npm test -- --run` |
| Full suite command | `npm test -- --run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PLAT-01 | PhoneShell applies safe-area / no overflow-x class contract | unit / component | `npm test -- --run src/app/layout` | ❌ Wave 0 |
| PLAT-02 | PWA config includes navigateFallback + autoUpdate (config assertion) | unit | `npm test -- --run src/app/pwa` | ❌ Wave 0 |
| PLAT-02 | Offline smoke | manual | Chrome DevTools → Offline after preview | N/A manual |
| Catalog | Zod parse of TB roles succeeds; 22 roles; teams 13/4/4/1 | unit | `npm test -- --run src/domain/script` | ❌ Wave 0 |
| Catalog | Setup chart covers 5–15; counts sum to playerCount | unit | `npm test -- --run src/domain/script` | ❌ Wave 0 |
| Catalog | Sample first-night ordinal order matches golden list | unit | `npm test -- --run src/domain/script` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm test -- --run`
- **Per wave merge:** `npm test -- --run` + `npm run build`
- **Phase gate:** Full suite green + manual offline preview before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] Scaffold Vite react-ts app + package scripts (`test`, `build`, `preview`)
- [ ] `vitest.config.ts` with jsdom environment
- [ ] `src/domain/script/*.test.ts` — Zod catalog + setup chart
- [ ] Official setup-chart verification artifact (screenshot/notes) before locking golden JSON
- [ ] PWA icons (original, not official BotC art)
- [ ] Optional: config unit test that `vite.config` PWA options include `navigateFallback`

## Security Domain

> `security_enforcement: true`, ASVS level 1.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No accounts |
| V3 Session Management | no | No server sessions |
| V4 Access Control | no | Single-user local device |
| V5 Input Validation | yes (light) | Zod for catalog JSON; later for setup inputs |
| V6 Cryptography | no | No secrets / no custom crypto |

### Known Threat Patterns for Vite PWA + local catalog

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Tampered catalog JSON in repo | Tampering | Zod parse at load; Vitest golden counts |
| XSS via unsanitized ability HTML | Tampering | Render text nodes only — no `dangerouslySetInnerHTML` |
| Supply-chain install | Tampering | Legitimacy-audited packages; lockfile in Phase 1 |
| Stale SW serving old app | Elevation of privilege (stale UX) | `registerType: 'autoUpdate'` |
| Accidental IP redistribution | Repudiation / Compliance | No official art; CCC posture documented |

## Sources

### Primary (HIGH / MEDIUM confidence)

- npm registry (2026-07-16) — package versions + postinstall empty
- [CITED: tailwindcss.com/docs/installation/using-vite] — Tailwind 4 Vite plugin
- [CITED: vite-pwa-org.netlify.app/guide] — VitePWA install + `registerType: 'autoUpdate'`
- Context7 `/vite-pwa/vite-plugin-pwa` — autoUpdate, globPatterns, navigateFallback allowlist notes [confidence MEDIUM via classify-confidence]
- Context7 `/remix-run/react-router` — BrowserRouter / createBrowserRouter
- Context7 `/websites/zod_dev` — `z.object` / `.parse` / `z.infer`
- [CITED: developer.mozilla.org/en-US/docs/Web/CSS/env] — safe-area insets
- [VERIFIED: bra1n/townsquare `roles.json`] — TB field shape + 22 core + 5 travelers
- `.planning/research/STACK.md`, `ARCHITECTURE.md`, `PITFALLS.md` — project stack + catalog patterns + IP

### Secondary

- WebSearch — TB setup chart counts (conflicting secondaries → A1)
- BGG / Script Tool commentary — Script Tool as night-order authority

### Tertiary

- Touch-target sizing heuristics [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — npm + official Tailwind/PWA docs
- Architecture: HIGH — aligns with existing project ARCHITECTURE research
- TB data parity: MEDIUM — interchange verified; setup chart needs official lock
- Pitfalls: HIGH — PWA SPA + BotC IP pitfalls documented

**Research date:** 2026-07-16  
**Valid until:** 2026-08-16 (stack minors move quickly; re-check npm on execute)

## Walking Skeleton Notes (for planner)

Phase mode is **mvp** and this is Phase 1 of a greenfield app — plan a thin vertical slice:

1. Scaffold + Tailwind + PWA config  
2. PhoneShell + stub routes  
3. TB catalog JSON + Zod loaders + tests  
4. Home screen listing Trouble Brewing as available script  
5. Manual offline verification checklist  

Do **not** implement bag/wizard/coach in this phase.
