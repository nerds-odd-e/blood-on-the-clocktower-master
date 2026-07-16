---
phase: 01-phone-shell-tb-catalog
verified: 2026-07-16T06:02:10Z
status: human_needed
score: 3/7 must-haves verified
behavior_unverified: 4
overrides_applied: 0
mvp_mode: true
mvp_goal_format_valid: false
mvp_goal_note: "ROADMAP Phase 1 goal is not user-story form (As a…, I want to…, so that…). Plans use a valid user story; run /gsd mvp-phase 1 to align ROADMAP. Verification proceeded against roadmap Success Criteria + plan must_haves using the plan user story for User Flow Coverage."
behavior_unverified_items:
  - truth: "Long shell copy and stub body copy wrap within max-width 40rem without horizontal scroll at 390x844"
    test: "Open /, /setup, /play at 390x844; read display + stub body copy"
    expected: "Copy wraps inside the 40rem column; no meaning lost to clipping; no horizontal page scroll"
    why_human: "verification: backstop — insufficient_spec; Playwright checks scrollWidth only, not wrap/ellipsis quality"
  - truth: "Optional role roster scrolls vertically inside shell; page never gains horizontal scroll at 390x844"
    test: "On home, expand/scroll the role roster at 390x844"
    expected: "Roster scrolls vertically inside the card; document does not gain horizontal scroll"
    why_human: "verification: backstop — horizontal overflow is covered by E2E; vertical roster scroll feel is visual-only"
  - truth: "Long display/supporting copy wraps without ellipsis clipping that hides meaning — visual check at verify"
    test: "View home brand + supporting sentence at 390x844"
    expected: "Display and supporting lines wrap fully; no ellipsis hiding meaning"
    why_human: "verification: backstop — insufficient_spec; no ellipsis CSS found, but wrap quality needs eyes"
  - truth: "Stub /setup and /play body wrap inside PhoneShell — visual check at verify"
    test: "Open /setup and /play at 390x844"
    expected: "Stub headings and body sit inside PhoneShell column without overflow"
    why_human: "verification: backstop — insufficient_spec; code has PhoneShell max-w but wrap is visual"
human_verification:
  - test: "MVP user-flow walk-through: open preview home → see TB card → Start setup → Back to home; optionally hard-reload offline after first load"
    expected: "Storyteller Copilot home with Trouble Brewing Available, Offline ready chip as calm meta, Start setup → Setup stub; later phases have a real shell + catalog"
    why_human: "MVP mode requires human confirmation of the user-visible outcome, not only green E2E"
  - test: "At 390x844 confirm long copy wraps (UI-SPEC backstops) and Offline ready chip reads as calm meta, not a second primary (D-01)"
    expected: "Chip is secondary meta next to Available; copy wraps; primary CTA remains Start setup only"
    why_human: "Harvested from 01-05-PLAN.md <human-check>; visual hierarchy cannot be grepped"
  - test: "Backstop truths (4) — long-copy wrap, roster vertical scroll, display wrap, stub wrap"
    expected: "All four visual backstops hold at phone viewport"
    why_human: "Tagged verification: backstop — honest verifier abstains without held-out visual confirmation"
---

# Phase 1: Phone Shell & TB Catalog Verification Report

**Phase Goal:** Storyteller can open a phone-first offline app that knows Trouble Brewing roles, setup chart, and night-order data  
**Verified:** 2026-07-16T06:02:10Z  
**Status:** human_needed  
**Re-verification:** No — initial verification  
**Mode:** mvp (ROADMAP); goal string fails `user-story.validate` — see frontmatter `mvp_goal_note`

## User Flow Coverage

User story (from plan objectives — ROADMAP goal is abbreviated, not As a/I want/so that):  
«As a new Storyteller, I want to open a phone-first offline app that already knows Trouble Brewing, so that later setup and coach phases have a real shell and catalog to build on.»

| Step | Expected | Evidence | Status |
|------|----------|----------|--------|
| Open app | Home shows Display name Storyteller Copilot | `src/ui/home/ScriptHome.tsx` h1; `e2e/home.spec.ts` green | ✓ |
| See TB catalog | Exactly one Trouble Brewing card: Available, 22 roles · setup chart · night order, Offline ready | `ScriptHome` + `e2e/catalog.spec.ts` (22 roles / 13/4/4/1 / setup 5–15) | ✓ |
| Start setup | Navigates to /setup stub with Back to home | `SetupStub.tsx`; `e2e/home.spec.ts` + `stubs.spec.ts` | ✓ |
| Offline after first load | Reload / and open /setup with no network, no account | `VitePWA` + `registerSW`; `e2e/offline.spec.ts` **passed** this verify | ✓ |
| Outcome | Shell + TB catalog (roles, setup chart, night ordinals/beats) ready for Phase 2/3 | `loadCatalog()` → roles/setupChart/proceduralBeats; routes `/` `/setup` `/play` | ✓ |

*Human must still walk the flow once (MVP UAT) — code/E2E evidence above does not replace the interactive checkpoint.*

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
| --- | ------- | ---------- | -------------- |
| 1 | Storyteller can use the app on a phone-sized viewport without horizontal scrolling or unusable controls | ✓ VERIFIED | `PhoneShell` overflow-x-hidden + max-w 40rem; `min-h-11` CTA; `e2e/home.spec.ts` PLAT-01 scroll check **passed**; offline suite also asserts 390×844 |
| 2 | After first load, Storyteller can reload and use the app with no network connection and no account | ✓ VERIFIED | `e2e/offline.spec.ts` setOffline + reload / and /setup **passed**; no login/account UI asserted; `registerSW({ immediate: true })` |
| 3 | App exposes Trouble Brewing as the available script with roles/night data loaded for later setup and coach | ✓ VERIFIED | Bundled JSON 22 / 13/4/4/1; setup rows 5–15 sum OK; beats dusk/minion-info/demon-info/dawn; `e2e/catalog.spec.ts` 22-roles test **passed**; `data-first-night` on roster |
| 4 | Long shell copy and stub body copy wrap within max-width 40rem without horizontal scroll at 390x844 | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | `verification: backstop` — PhoneShell wired; scrollWidth tested; wrap quality not proven |
| 5 | Optional role roster scrolls vertically inside shell; page never gains horizontal scroll at 390x844 | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | `verification: backstop` — `max-h-64 overflow-y-auto` present; horizontal covered by catalog E2E; vertical scroll feel needs eyes |
| 6 | Long display/supporting copy wraps without ellipsis clipping that hides meaning | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | `verification: backstop` — no truncate/ellipsis in `src/`; still visual |
| 7 | Stub /setup and /play body wrap inside PhoneShell | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | `verification: backstop` — stubs render inside shell; wrap visual |

**Score:** 3/7 truths verified (4 present, behavior-unverified / backstop)

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `playwright.config.ts` | Preview webServer e2e | ✓ VERIFIED | testDir e2e; build+preview :4173 |
| `e2e/home.spec.ts` | Home/smoke + viewport | ✓ VERIFIED | Wired; PLAT-01 scroll test passed |
| `e2e/stubs.spec.ts` | Stub routes | ✓ VERIFIED | Setup/Play + Back to home |
| `e2e/catalog.spec.ts` | Catalog facts via UI | ✓ VERIFIED | 22 / teams / setup / night ordinals |
| `e2e/offline.spec.ts` | Offline reload | ✓ VERIFIED | setOffline path passed |
| `src/app/layout/PhoneShell.tsx` | Phone chrome | ✓ VERIFIED | safe-area, overflow-x-hidden, 40rem |
| `src/app/routes.tsx` | Shallow routes | ✓ VERIFIED | `/` `/setup` `/play` (BrowserRouter lives in `App.tsx` — intentional; not a stub) |
| `src/ui/home/ScriptHome.tsx` | Home + catalog | ✓ VERIFIED | loadCatalog, Empty/Error, Offline ready, Start setup |
| `src/domain/script/loadCatalog.ts` | Zod TB load | ✓ VERIFIED | roles + setupChart + proceduralBeats |
| `src/domain/script/schemas.ts` | Zod + refinements | ✓ VERIFIED | length 22, 13/4/4/1, setup sum + 5–15 |
| `vite.config.ts` | VitePWA | ✓ VERIFIED | autoUpdate + navigateFallback `/index.html` |
| `package.json` | Playwright, no Vitest | ✓ VERIFIED | `@playwright/test` present; vitest/jsdom/RTL absent |
| `01-VALIDATION.md` | Playwright-only map | ✓ VERIFIED | D-05–D-08; tasks marked green |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | --- | --- | ------ | ------- |
| `playwright.config.ts` | vite preview | webServer :4173 | ✓ WIRED | Pattern + live runs |
| `src/main.tsx` | `src/app/App.tsx` | createRoot | ✓ WIRED | |
| `src/ui/home/ScriptHome.tsx` | `loadCatalog` | sync read at render | ✓ WIRED | |
| `loadCatalog` | TB JSON | Zod.parse imports | ✓ WIRED | Manual (gsd-tools path false-negative) |
| `vite.config.ts` | workbox | navigateFallback | ✓ WIRED | |
| `e2e/offline.spec.ts` | SW + offline | setOffline after control | ✓ WIRED | Test passed |
| `e2e/catalog.spec.ts` | ScriptHome UI | page.goto, no JSON mocks | ✓ WIRED | |
| `SetupStub` | `/` | Back to home | ✓ WIRED | |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| `ScriptHome` | `view.catalog` | `loadCatalog()` → Zod → JSON imports | Yes — 22 roles, 11 setup rows, 4 beats | ✓ FLOWING |
| `ScriptHome` Empty/Error | catch / roles.length===0 | Same loader fail-closed | Conditional paths present with UI-SPEC copy | ✓ FLOWING (paths ready; not E2E-forced) |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Catalog 13/4/4/1 via UI | `npx playwright test e2e/catalog.spec.ts -g "UI reveals 22 roles"` | 1 passed | ✓ PASS |
| Offline reload | `npx playwright test e2e/offline.spec.ts -g "reloads home and /setup offline"` | 1 passed | ✓ PASS |
| No horizontal scroll / | `npx playwright test e2e/home.spec.ts -g "PLAT-01: / has no horizontal"` | 1 passed | ✓ PASS |
| Role/setup JSON integrity | `node` counts on bundled JSON | 22 roles; 11 rows; 0 bad sums | ✓ PASS |

### Probe Execution

| Probe | Command | Result | Status |
| ----- | ------- | ------ | ------ |
| — | — | No `scripts/*/tests/probe-*.sh` declared | SKIP |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ---------- | ----------- | ------ | -------- |
| PLAT-01 | 01-01…01-05 | UI phone-first and usable on tablet | ✓ SATISFIED | PhoneShell 40rem column; 390×844 E2E no horizontal scroll; tablet = same max-width |
| PLAT-02 | 01-01, 01-03, 01-05 | Offline PWA after first load, no account | ✓ SATISFIED | VitePWA + offline.spec passed; account/login assertions |

No orphaned Phase 1 requirement IDs: REQUIREMENTS.md maps only PLAT-01 and PLAT-02 to Phase 1; both appear in PLAN frontmatter.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| — | — | No TBD/FIXME/XXX in phase `src/` / `e2e/` | — | — |
| — | — | No Vitest/jsdom/RTL deps | — | D-05/D-07 held |
| — | — | No dangerouslySetInnerHTML / Install CTA / Travelers | — | Prohibitions held |

Judgment-tier prohibitions checked via codebase evidence (not silent pass): no unit-test runner; no catalog mocks in e2e; no Install/A2HS CTA; no auth routes; team enum townsfolk\|outsider\|minion\|demon only; Offline ready not gated on SW controller in ScriptHome.

### Human Verification Required

### 1. MVP user-flow walk-through

**Test:** Open production preview; confirm home → TB card → Start setup → Back to home; optionally DevTools offline after first load.  
**Expected:** Usable phone-first home with TB catalog; stubs reachable; offline still works; no account prompt.  
**Why human:** MVP mode requires confirming the user-visible outcome.

### 2. Calm Offline ready chip + long-copy wrap (01-05 human-check)

**Test:** At 390×844, inspect chip vs Start setup and copy wrap.  
**Expected:** Chip is calm meta (D-01); display/supporting/stub copy wraps without clipping meaning.  
**Why human:** Visual hierarchy / typography backstops.

### 3–6. Backstop truths

See `behavior_unverified_items` in frontmatter (four `verification: backstop` items).

### Gaps Summary

No blocking gaps against roadmap Success Criteria 1–3. Implementation and Playwright evidence support the phase goal. Status is **human_needed** solely for MVP UAT + UI-SPEC backstop visuals (not missing code).

**MVP process note:** Align ROADMAP Phase 1 goal to user-story form via `/gsd mvp-phase 1` so future verify runs satisfy `user-story.validate`.

---

_Verified: 2026-07-16T06:02:10Z_  
_Verifier: Claude (gsd-verifier)_
