---
phase: 01-phone-shell-tb-catalog
reviewed: 2026-07-16T05:52:00Z
depth: standard
files_reviewed: 24
files_reviewed_list:
  - playwright.config.ts
  - e2e/home.spec.ts
  - e2e/stubs.spec.ts
  - e2e/catalog.spec.ts
  - e2e/offline.spec.ts
  - package.json
  - vite.config.ts
  - index.html
  - src/main.tsx
  - src/App.tsx
  - src/index.css
  - src/vite-env.d.ts
  - src/app/layout/PhoneShell.tsx
  - src/app/App.tsx
  - src/app/routes.tsx
  - src/ui/home/ScriptHome.tsx
  - src/ui/setup/SetupStub.tsx
  - src/ui/play/PlayStub.tsx
  - src/domain/script/schemas.ts
  - src/domain/script/loadCatalog.ts
  - src/domain/script/index.ts
  - src/data/scripts/trouble-brewing/roles.json
  - src/data/scripts/trouble-brewing/setup-chart.json
  - src/data/scripts/trouble-brewing/procedural-beats.json
findings:
  critical: 0
  warning: 6
  info: 4
  total: 10
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-07-16T05:52:00Z
**Depth:** standard
**Files Reviewed:** 24
**Status:** issues_found

## Summary

Phase 01 delivers a solid walking skeleton: PhoneShell + shallow routes, Zod-gated TB catalog (22 / 13-4-4-1, setup 5–15 verified), text-only catalog rendering (no `dangerouslySetInnerHTML`), and VitePWA offline wiring. No critical security or crash defects found in the reviewed surface. Warnings focus on phone touch targets, blank unknown routes, incomplete Drunk reminder data, a misleading Minion Info stub note, missing unique-id schema guards, and dual night-ordinal spaces that will bite Phase 3.

## Warnings

### WR-01: Stub “Back to home” links miss 44×44 touch targets

**File:** `src/ui/setup/SetupStub.tsx:14-19`
**Also:** `src/ui/play/PlayStub.tsx:14-19`
**Issue:** UI-SPEC / PLAT-01 require minimum **44×44px** touch targets for all tappable controls. Stub back links are plain underlined text with no `min-h-11` / padding, so they are easy to miss on a phone at the table. Primary CTA on home correctly uses `min-h-11`.
**Fix:**
```tsx
<Link
  to="/"
  className="inline-flex min-h-11 items-center text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
>
  Back to home
</Link>
```

### WR-02: Unknown paths render an empty PhoneShell

**File:** `src/app/routes.tsx:11-15`
**Issue:** Only `/`, `/setup`, and `/play` are registered. With PWA `navigateFallback: '/index.html'`, any other URL (typo, stale deep link, trailing-slash mismatch) still boots the SPA but React Router matches nothing — user sees a blank shell with no recovery link.
**Fix:**
```tsx
import { Navigate, Route, Routes } from 'react-router-dom'
// ...
<Routes>
  <Route path="/" element={<ScriptHome />} />
  <Route path="/setup" element={<SetupStub />} />
  <Route path="/play" element={<PlayStub />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### WR-03: Drunk role ships with empty `reminders`

**File:** `src/data/scripts/trouble-brewing/roles.json:206-216`
**Issue:** Curated TB data sets Drunk `setup: true` (good — Pitfall 4) but `reminders: []`. Interchange / night-sheet practice expects a **Drunk** reminder token so the Storyteller can mark which Townsfolk is the Drunk. Phase 1 does not render reminders, but this catalog is the Phase 2/3 source of truth — empty reminders will produce incomplete grimoire coaching later.
**Fix:** Set Drunk reminders to the standard token label, e.g.:
```json
"reminders": ["Drunk"]
```

### WR-04: Minion Info stub note incorrectly gates on player count ≥ 7

**File:** `src/data/scripts/trouble-brewing/procedural-beats.json:10-15`
**Issue:** Notes say “wake minions when player count ≥ 7.” Minion Info runs on the first night at all legal TB sizes (including 5–6 with a single minion). The ≥7 threshold is wrong and will mis-coach if Phase 3 reads `notes` verbatim.
**Fix:**
```json
"notes": "Phase 3 coach stub — wake all Minions; show who the Demon is and who the other Minions are (always on first night)."
```

### WR-05: Catalog schema does not enforce unique role IDs

**File:** `src/domain/script/schemas.ts:57-71`
**Issue:** `CatalogSchema` locks length 22 and team split 13/4/4/1 but never requires unique `id` values. Duplicate IDs would still parse, break React `key={role.id}` reconciliation in `RoleRoster`, and confuse Phase 2 bag/grimoire lookups. Current JSON is unique — the guard is missing.
**Fix:**
```ts
.refine(
  (roles) => new Set(roles.map((r) => r.id)).size === roles.length,
  { message: 'role ids must be unique' },
)
```
(chain after the existing team-count refine on the roles array)

### WR-06: Role night ordinals and procedural-beat ordinals use incompatible scales

**File:** `src/data/scripts/trouble-brewing/procedural-beats.json:1-30`
**Also:** `src/domain/script/loadCatalog.ts:11-13` (documents townsquare role ordinals)
**Issue:** Role `firstNight` / `otherNight` use townsquare global ordinals (e.g. Poisoner 17, Washerwoman 33, Spy 49). Procedural beats use a separate local scale (`dusk: 1`, `minion-info: 2`, `demon-info: 3`, `dawn: 99`). Both live on the same `LoadedCatalog` with no merge key or documented total order. Phase 3 “sort by ordinal” across both arrays will produce a wrong night sequence.
**Fix:** Either (a) rewrite procedural-beat ordinals onto the same townsquare scale as roles, or (b) export a single ordered `firstNightSequence: Array<{ kind: 'procedural' | 'role'; id: string; ordinal: number }>` from `loadCatalog()` and document that consumers must not sort the two arrays together.

## Info

### IN-01: Empty catalog UI branch is unreachable under current Zod gates

**File:** `src/ui/home/ScriptHome.tsx:36-39`
**Issue:** `catalog.roles.length === 0` can never succeed after `loadCatalog()` because `CatalogSchema` requires `.length(22)`. Corrupt/empty payloads fail Zod and surface **Error**, not **Empty**. Dead branch matches the SUMMARY “fail-soft for later” note but means UI-SPEC empty copy is untested in production paths.
**Fix:** Drop the empty branch until multi-script / relaxed length is real, or add a dedicated loader result for “parsed but zero scripts” before the length(22) gate.

### IN-02: CTA enter motion from UI-SPEC is not implemented

**File:** `src/ui/home/ScriptHome.tsx:222-228`
**Also:** `src/index.css:100-108` (reduced-motion kill-switch only)
**Issue:** UI-SPEC calls for Start setup `opacity` + `translateY(4px)` ≤200ms on first paint with `prefers-reduced-motion: reduce` disabling it. Only the global reduced-motion override exists — no enter animation.
**Fix:** Add a short `@keyframes` / Tailwind animation on the CTA, relying on the existing reduced-motion media query.

### IN-03: `font-semibold` on CTA is likely overridden by `.text-body`

**File:** `src/ui/home/ScriptHome.tsx:224`
**Also:** `src/index.css:86-91`
**Issue:** `.text-body { font-weight: 400 }` is unlayered custom CSS after Tailwind import, so it typically wins over the `font-semibold` utility on the same element. Harmless visually (400 on accent button still meets contrast), but the class is misleading.
**Fix:** Use a dedicated `.text-cta` role or drop `font-semibold` / set weight on a wrapper that does not use `.text-body`.

### IN-04: `loadCatalog` validates the same payload multiple times

**File:** `src/domain/script/loadCatalog.ts:50-60`
**Issue:** Roles, setup chart, and beats are parsed individually, then assembled and parsed again via `CatalogSchema.parse`. Correct but redundant; future field drift between the piece schemas and `CatalogSchema` could confuse maintainers.
**Fix:** Prefer a single `CatalogSchema.parse({ scriptId, roles: rolesJson, setupChart: setupChartJson.rows, proceduralBeats: proceduralBeatsJson.beats })` (with `setupChartJson` still wrapped so `.rows` is validated), or keep piece parses and drop the final aggregate parse if types are composed explicitly.

---

_Reviewed: 2026-07-16T05:52:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
