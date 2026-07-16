---
phase: 02-setup-wizard-grimoire-capture
verified: 2026-07-16T08:48:30Z
status: human_needed
score: 12/13 must-haves verified
behavior_unverified: 0
overrides_applied: 0
re_verification:
  previous_status: gaps_found
  previous_score: 7/11
  gaps_closed:
    - "Shape-valid but semantically impossible persisted sessions recover fresh instead of rendering a blank route (G-01)"
    - "Assignments are saved is shown only after the latest IndexedDB write succeeds (G-02)"
    - "Test-tier prohibitions have deterministic enforcement evidence (G-03)"
    - "Assigning the Drunk cover token persists trueRoleId=drunk and believedRoleId=coverRoleId (prior behavior_unverified)"
    - "ConfirmDialog restores focus to the Start night trigger after soft-gate dismiss (prior WR-01 warning)"
  gaps_remaining: []
  regressions: []
behavior_unverified_items: []
human_verification:
  - test: "At 390×844, enter a very long player name on the roster, open a maximum-size role picker (15 remaining tokens), and open a soft-gate dialog with many validation issues"
    expected: "No horizontal scrolling; picker and dialog scroll vertically inside their containers; sticky footer does not cover the last actionable row"
    why_human: "Plan truths are tagged verification: backstop (insufficient_spec). CSS constraints exist and general overflow tests pass, but these extreme scenarios have no scenario-specific held-out assertions"
  - test: "Review the seven judgment-tier prohibitions against the final setup flow and shipped assets/copy"
    expected: "No HTML injection of names/notes, no official BotC token art, no Vaul/sheet role picker, no quit-before-start dropout re-bag, no shaming/guilt framing; Wave-1 temporal judgment items treated as historical only"
    why_human: "Judgment-tier prohibitions are non-authoritative LLM judgments under ADR-550 — human review recommended"
mvp_note: "ROADMAP phase goal is not in As a… I want to… so that… form (user-story.validate=false) while mode is mvp. User Flow Coverage below uses the plan-authored user story from 02-06. Consider /gsd mvp-phase 02 to align ROADMAP wording."
---

# Phase 2: Setup Wizard & Grimoire Capture Verification Report

**Phase Goal:** Storyteller can walk the setup wizard, get a legal TB bag, and record who drew which role before night starts
**Verified:** 2026-07-16T08:48:30Z
**Status:** human_needed
**Re-verification:** Yes — after gap closure (02-06)

## User Flow Coverage

User story (from plan 02-06 objective; ROADMAP goal is abbreviated MVP text): *As a Storyteller, I want to walk the setup wizard, get a legal TB bag, and record who drew which role before night starts, so that I can reach a Night ready handoff without a paper setup sheet.*

| Step | Expected | Evidence | Status |
|------|----------|----------|--------|
| Open setup | Home → Start setup lands on `/setup` Trouble Brewing confirm | `SetupWizard` on `/setup`; `e2e/setup-wizard.spec.ts` | ✓ |
| Enter players | Unique seat-ordered names (5–15), optional More profiles | `PlayersStep` / `PlayerRow`; Playwright roster + More | ✓ |
| Set difficulty | Easy / Standard / Hard, default Standard | `DifficultyStep.tsx`; browser coverage | ✓ |
| Accept bag | Legal private TB bag from count + difficulty only | `buildBag` / `validateBag`; 5–15 × 3 matrix unit tests | ✓ |
| Deal + record | Physical deal coaching; tap player → remaining token | `DealStep` / `RecordStep`; `setup-record.spec.ts` | ✓ |
| Start night | Soft-gate on invalid composition; Night ready on `/setup` | `validateAssignments` + `ConfirmDialog`; Night ready E2E | ✓ |
| Outcome | Night ready handoff without paper setup sheet | Summary labels + durable save gated on `persistWriteStatus` | ✓ |

## Goal Achievement

Prior blockers G-01 / G-02 / G-03 and the Drunk behavior-unverified item are closed by plan 02-06. Automated evidence is green. Phase status is `human_needed` solely for phone-overflow backstops and judgment-tier prohibition review — not for missing product wiring.

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Storyteller can confirm Trouble Brewing and enter 5–15 unique, seat-ordered players with optional profiles | ✓ VERIFIED | `PlayersStep`, Playwright five-name / duplicate / More path (regression: files present + wired) |
| 2 | Storyteller can choose Easy / Standard / Hard, defaulting to Standard | ✓ VERIFIED | `DifficultyStep.tsx` + prior browser coverage |
| 3 | App generates a legal TB bag from count and difficulty while excluding profiles | ✓ VERIFIED | `buildBag.ts` signature; bag unit matrix; prohibition `no-profiles-into-buildBag` |
| 4 | Wizard enforces script → players → difficulty → bag → deal → record | ✓ VERIFIED | `SetupWizard` step switch on `/setup`; Playwright sequence |
| 5 | Storyteller can tap a player, assign only a remaining physical token, and clear it back into the pool | ✓ VERIFIED | Store `assignRole` guards; `setup-record.spec.ts` |
| 6 | Starting with invalid assignments surfaces concrete issues and requires explicit Start anyway confirmation | ✓ VERIFIED | `RecordStep` → `validateAssignments` + soft-gate (D-15 resolves GRIM-02 “blocks” wording) |
| 7 | Successful/overridden start reaches Night ready on `/setup`, not `/play` | ✓ VERIFIED | `NightReadyStep`; prohibition `no-play-navigation` |
| 8 | Shape-valid but semantically impossible persisted sessions recover fresh instead of a blank `/setup` | ✓ VERIFIED | `assertSetupSessionSemantics` in merge; unit rejects null-bag downstream; E2E `recovers shape-valid nightReady with null bag` + roster/bag mismatch (pass) |
| 9 | “Assignments are saved” only after the latest critical IndexedDB write succeeds | ✓ VERIFIED | `awaitCriticalPersist` + `persistWriteStatus`; `NightReadyStep` gates copy; unit error path; E2E `withholds saved assurance… then retries` (pass) |
| 10 | Drunk cover assignment preserves `trueRoleId=drunk` and `believedRoleId=cover` | ✓ VERIFIED | `setupSessionStore.assignRole.test.ts` named test passes |
| 11 | ConfirmDialog restores focus to the Start night trigger after soft-gate dismiss | ✓ VERIFIED | `ConfirmDialog` cleanup restores `previouslyFocused`; E2E `restores focus to Start night…` (pass) |
| 12 | All Phase 2 test-tier prohibitions carry `check_kind` / `check_target` / `check_violation_fixture` with runnable fixtures | ✓ VERIFIED | 15/15 test-tier items complete; `npm run test:prohibitions` 15/15 pass; fail-first RED with `GSD_PROHIB_SUBJECT` on premature-saved fixture |
| 13 | Long names, 15-role picker, and many-issue soft-gate remain usable at 390×844 | ⚠️ insufficient_spec (backstop) | No scenario-specific held-out test — routes to human verification |

**Score:** 12/13 truths verified (0 present-but-behavior-unverified)

### Deferred Items

None. Phone overflow backstops are end-of-phase human checks, not Phase 3 scope.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/state/setupSessionSemantics.ts` | Cross-field hydrate invariants | ✓ VERIFIED | Exports `assertSetupSessionSemantics`; wired in store merge |
| `src/state/setupSessionStore.ts` | Semantic merge + `persistWriteStatus` + critical save | ✓ VERIFIED | Merge → semantics → fresh+`hydrationError`; `advanceToNightReady` awaits persist |
| `src/ui/setup/steps/NightReadyStep.tsx` | Gated saved / saving / error+Retry | ✓ VERIFIED | Conditional on `persistWriteStatus`; Retry calls `retryCriticalPersist` |
| `tests/prohibitions/` | node:test guards + known-bad fixtures | ✓ VERIFIED | 15 guards; fixtures exist; clean suite green |
| `e2e/setup-wizard.spec.ts` | Impossible-session recovery | ✓ VERIFIED | null-bag nightReady + length mismatch cases pass |
| Wizard / bag / record stack (plans 02-01–05) | Prior phase delivery | ✓ VERIFIED (regression) | Core step components + bag domain present and wired |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| Persist merge after Zod | `assertSetupSessionSemantics` | Failure → `freshSession` + `hydrationError` | ✓ WIRED | `setupSessionStore.ts` merge block |
| Start night / Start anyway | `advanceToNightReady` → `awaitCriticalPersist` | Status before assurance | ✓ WIRED | `SetupWizard.tsx` calls `advanceToNightReady` |
| `NightReadyStep` | `persistWriteStatus` | Saved-only assurance; Retry on error | ✓ WIRED | Source branches + Retry button |
| Plan `check_*` scalars | `tests/prohibitions/*.test.mjs` | Fail-first `GSD_PROHIB_MASTER` / subject injection | ✓ WIRED | 15/15 descriptors + suite |

Automated `verify.key-links` reported false for 02-06 because `from:` values are prose descriptors, not file paths — manual inspection confirms wiring.

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|-------------------|--------|
| `NightReadyStep` | `players` / `difficulty` / `bag` / `assignments` | Zustand setup session | Yes — wizard-built bag + recorded assignments | ✓ FLOWING |
| `NightReadyStep` | `persistWriteStatus` | `awaitCriticalPersist` / IDB `setItem` | Yes — `saving`→`saved`/`error` from real await | ✓ FLOWING |
| `BagStep` | `bag.tokens` | `buildBag` via store | Yes — legal generator, not empty stub | ✓ FLOWING |
| Hydrate merge | persisted session | IndexedDB → Zod → semantics | Impossible sessions reset (not hollow blank) | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Semantic + Drunk + persist unit | `CURSOR_DEV=true nix develop -c npx vitest run src/state/setupSessionSemantics.test.ts src/state/setupSessionStore.assignRole.test.ts src/state/setupSessionStore.persist.test.ts` | 11/11 passed | ✓ PASS |
| G-01 E2E recovery | `npx playwright test e2e/setup-wizard.spec.ts -g "recovers shape-valid\|corrupt"` | 3 passed | ✓ PASS |
| G-02 + focus E2E | `npx playwright test e2e/setup-record.spec.ts -g "withholds saved\|restores focus"` | 2 passed | ✓ PASS |
| Prohibitions clean | `CURSOR_DEV=true nix develop -c npm run test:prohibitions` | 15/15 passed | ✓ PASS |
| Prohibition fail-first | `GSD_PROHIB_SUBJECT=…/night-ready-premature-saved.bad.tsx node --test …/no-premature-saved-assurance.test.mjs` | Assertion failure as expected | ✓ PASS |

### Probe Execution

| Probe | Command | Result | Status |
|-------|---------|--------|--------|
| — | — | No `scripts/*/tests/probe-*.sh` declared for this phase | SKIPPED |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| SETUP-01 | 02-02 | TB select + unique names + seating | ✓ SATISFIED | Players step + E2E |
| SETUP-02 | 02-03 | Difficulty at start | ✓ SATISFIED | Difficulty step + E2E |
| SETUP-03 | 02-02 | Optional experience/age/notes | ✓ SATISFIED | More profiles + E2E |
| SETUP-04 | 02-03, 02-06 | Legal bag from count/difficulty (profiles excluded per D-07) | ✓ SATISFIED | Bag matrix + prohibitions |
| SETUP-05 | 02-02–06 | Ordered wizard + recovery | ✓ SATISFIED | Full path E2E + G-01 semantic hydrate |
| GRIM-01 | 02-04, 02-06 | Tap → pick remaining; Drunk metadata | ✓ SATISFIED | Record E2E + Drunk unit |
| GRIM-02 | 02-05, 02-06 | Gate start on composition (D-15 soft confirm) + durable save truth | ✓ SATISFIED | Soft-gate E2E + G-02 persist status |

No orphaned Phase 2 requirement IDs. GRIM-03/GRIM-04 correctly belong to Phase 3.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | No `TBD`/`FIXME`/`XXX` in phase-modified setup/state UI | — | Prior blockers closed |
| `src/ui/setup/steps/NightReadyStep.tsx` | 25 | `if (!bag) return null` | ℹ️ Info | Unreachable after semantic hydrate; defense-in-depth only |

### Human Verification Required

### 1. Phone overflow backstops

**Test:** At 390×844, use a very long player name, open a maximum-size role picker, and open a soft-gate with many issues.
**Expected:** No horizontal scrolling; picker and dialog scroll vertically; footer does not cover the last actionable row.
**Why human:** `verification: backstop` — insufficient_spec without a held-out scenario test.

### 2. Judgment-tier negative constraints

**Test:** Review the seven judgment-tier prohibitions against the final setup flow and shipped assets/copy.
**Expected:** No HTML injection, token art, Vaul picker, dropout flow, or shaming copy; Wave-1 temporal constraints treated as historical.
**Why human:** Judgment-tier contract — non-authoritative without human sign-off.

### Gaps Summary

No blocking gaps remain after 02-06. Previous gaps G-01, G-02, and G-03 are closed with unit, Playwright, and prohibition-enforcement evidence. Awaiting human checkpoint for overflow backstops and judgment-tier review before treating the phase as fully signed off.

### MVP Mode Note

ROADMAP lists `mode: mvp` but the phase goal string fails `user-story.validate`. Plans already use a proper user story in their objectives. Align ROADMAP via `/gsd mvp-phase 02` when convenient — does not block product truths above.

---

_Verified: 2026-07-16T08:48:30Z_
_Verifier: Claude (gsd-verifier)_
