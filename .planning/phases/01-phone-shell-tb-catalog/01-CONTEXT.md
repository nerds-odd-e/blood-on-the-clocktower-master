# Phase 1: Phone Shell & TB Catalog - Context

**Gathered:** 2026-07-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver an installable phone-first offline PWA shell that exposes a curated Trouble Brewing catalog (roles, setup chart, night-order data) so later phases can build setup and coach on top. Phase 1 does **not** ship the setup wizard, bag builder, role recording, or night coach — only the shell, stub routes, and TB data plane (PLAT-01, PLAT-02).

</domain>

<decisions>
## Implementation Decisions

### Offline / install cues
- **D-01:** Show a small **“Offline ready”** status chip on the Trouble Brewing script card — not a competing Install CTA next to “Start setup”.
- **D-02:** Show the chip whenever the TB catalog is valid (optimistic). Do **not** gate the chip on service-worker controller state in Phase 1.
- **D-03:** No live online/offline banner or connectivity HUD in Phase 1 — static chip only.
- **D-04:** No Install / Add-to-Home-Screen coaching copy or custom install button in Phase 1 (deferred).

### Test automation
- **D-05:** Prefer **Playwright end-to-end** as the primary (and Phase 1–only) automated test layer — not Vitest unit suites for catalog/domain.
- **D-06:** Aim for **full coverage of shipped Phase 1 behavior** via Playwright (home/shell, stub routes, catalog surface, offline/PWA checks where feasible in E2E).
- **D-07:** **Playwright-only for Phase 1** — assert catalog correctness (role counts, setup chart, night order) through the running app against the real bundled TB JSON; do **not** add a Vitest domain golden suite this phase. This **overrides** Vitest-first guidance in `01-RESEARCH.md` / `01-VALIDATION.md` for Phase 1 planning.
- **D-08:** **No mocks in test automation** — exercise the real app against real bundled Trouble Brewing data (and real PWA/service-worker behavior where tested). Do not stub/mock the catalog, network layer, or domain loaders. Phase 1 has no external service dependencies; keep tests on the real stack.

### Carried forward (ratified — not re-litigated)
- **D-09:** Follow approved `01-UI-SPEC.md` for visual/copy/layout contract (table-lantern dark shell, Fraunces + Source Sans 3, “Start setup”, stub `/setup` + `/play`, no shadcn/icons in Phase 1).
- **D-10:** Project locks remain: phone-first; TB only; offline PWA after first load; no accounts; no official BotC token art; wizard/coach out of scope.

### Claude's Discretion
- Home catalog depth within UI-SPEC (optional compact role roster vs card-only) — follow UI-SPEC optional roster rules; omit Almanac ability text on home.
- Catalog payload field optionality (reminders, image URLs, short ability strings stored-but-hidden) — follow RESEARCH recommendations; exclude Travelers from v1 catalog UI/data.
- Night-order: ship ordinals (+ any procedural stubs RESEARCH recommends) as data for Phase 3 — no coach UI now.
- Exact Playwright project layout and how offline is asserted in E2E (e.g. browser context offline mode against the real preview build) — choose practical coverage without blocking the walking skeleton; still no catalog/network mocks (D-08).
- Scaffold path (`create-vite` + manual PWA vs PWA scaffold) — follow RESEARCH primary recommendation.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase & requirements
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, PLAT-01/PLAT-02 mapping
- `.planning/REQUIREMENTS.md` — PLAT-01, PLAT-02 definitions; out-of-scope (token art, town square, etc.)
- `.planning/PROJECT.md` — product vision, agreed UX, key decisions table

### Phase artifacts (authoritative for this phase)
- `.planning/phases/01-phone-shell-tb-catalog/01-UI-SPEC.md` — Locked visual/interaction/copy contract (approved). MUST follow for UI implementation.
- `.planning/phases/01-phone-shell-tb-catalog/01-RESEARCH.md` — Stack, structure, TB catalog patterns, PWA wiring — except **test strategy**: CONTEXT D-05–D-07 override Vitest-first sections.
- `.planning/phases/01-phone-shell-tb-catalog/01-VALIDATION.md` — Sampling/Wave 0 notes — **update/plan against Playwright**, not Vitest, per D-05–D-07.

### Stack research
- `.planning/research/STACK.md` — Vite/React/Tailwind/PWA/Zod recommendations
- `.planning/research/PITFALLS.md` — IP / token art / scraping pitfalls
- `.planning/research/ARCHITECTURE.md` — high-level architecture notes (if referenced by planner)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield repo (planning docs only; no `src/` app yet).

### Established Patterns
- None in code. Planning stack: Vite React-TS SPA + Tailwind v4 + `vite-plugin-pwa` + React Router shallow routes + Zod catalog (from RESEARCH/STACK).
- UI patterns locked in `01-UI-SPEC.md` (PhoneShell, home composition, stub pages).

### Integration Points
- New app roots at repo root via Vite scaffold.
- Routes: `/` (home + TB catalog), `/setup` stub, `/play` stub.
- Catalog loaders under proposed `src/domain/script` + `src/data/scripts/trouble-brewing/` (RESEARCH) — consumed by home UI and later phases.

</code_context>

<specifics>
## Specific Ideas

- Offline cue copy should read as calm meta (“Offline ready”), not a second primary button.
- User wants automation confidence via Playwright E2E with full coverage of what ships — treat E2E as the quality gate for Phase 1, not a thin smoke layer on top of unit tests.
- No mocks: real app + real TB data only (no stubbed catalog or fake network).

</specifics>

<deferred>
## Deferred Ideas

- Install / Add-to-Home-Screen coaching for new Storytellers (browser-menu hints or custom install CTA) — after Phase 1 walking skeleton proves useful at the table.
- Vitest (or other unit) domain golden suites — may revisit in later phases if E2E alone is too slow; **not** Phase 1.
- Setup wizard, bag, role recording (Phase 2); night coach / live grimoire (Phase 3).
- Live online/offline connectivity HUD.
- shadcn, lucide-react, Vaul, Sonner, Zustand session persist — deferred per RESEARCH/UI-SPEC.

</deferred>

---

*Phase: 1-phone-shell-tb-catalog*
*Context gathered: 2026-07-16*
