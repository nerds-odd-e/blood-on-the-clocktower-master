---
phase: 02-setup-wizard-grimoire-capture
verified: 2026-07-16T08:24:00Z
status: gaps_found
score: 7/11 must-haves verified
behavior_unverified: 1
behavior_unverified_items:
  - truth: "Assigning the Drunk cover token persists trueRoleId=drunk and believedRoleId=coverRoleId"
    test: "Generate a deterministic Drunk bag, assign its cover token, and inspect the persisted assignment"
    expected: "The assignment keeps the physical cover as bagRoleId/believedRoleId and drunk as trueRoleId"
    why_human: "The transition exists in the store, but no current unit or browser test exercises this branch"
decision_coverage:
  honored: 21
  total: 21
  not_honored: []
gaps:
  - id: G-01
    severity: blocker
    truth: "Persisted setup recovery cannot strand the wizard on an impossible downstream step"
    evidence: "PersistedSetupSessionSchema validates shapes only; wizardStep=bag or nightReady with bag=null parses, while BagStep and NightReadyStep return null"
    fix: "Add semantic session validation during merge and browser tests for shape-valid impossible sessions"
  - id: G-02
    severity: blocker
    truth: "Recorded assignments are durably saved before the app assures the Storyteller that they are saved"
    evidence: "Zustand persistence writes are fire-and-forget, no write error/status is exposed, and NightReadyStep unconditionally renders 'Assignments are saved.'"
    fix: "Await a critical durable save or track saving/saved/error state; gate the assurance and test a rejected IndexedDB write"
  - id: G-03
    severity: workflow
    truth: "Test-tier prohibitions have deterministic enforcement evidence"
    evidence: "All 13 test-tier prohibition descriptors omit check_violation_fixture (most omit the descriptor entirely), so prohibition-enforcement must fail closed even though direct source/tests show no current violation"
    fix: "Project the required check descriptors and known-bad fixtures, or re-author these items at the supported verification tier"
---

# Phase 2: Setup Wizard & Grimoire Capture Verification Report

**Phase Goal:** Storyteller can walk the setup wizard, get a legal TB bag, and record who drew which role before night starts.
**Verified:** 2026-07-16T08:24:00Z
**Status:** gaps_found

## Goal Achievement

The normal setup path is implemented and green end-to-end. The phase does not pass goal-backward verification because two persistence integrity paths can either strand the setup route or lose recorded assignments while claiming they were saved. These are core-session risks, not cosmetic review observations.

### Observable Truths

| # | Truth | Status | Evidence |
|---|---|---|---|
| 1 | Storyteller can confirm Trouble Brewing and enter 5–15 unique, seat-ordered players with optional profiles | ✓ VERIFIED | `PlayersStep`, `PlayerRow`, and `setup-wizard.spec.ts`; browser tests cover five names, duplicate rejection, default/optional profile values, and back navigation persistence |
| 2 | Storyteller can choose Easy / Standard / Hard, defaulting to Standard | ✓ VERIFIED | `DifficultyStep.tsx`; browser test exercises all three selections and the Standard default |
| 3 | App generates a legal TB bag from count and difficulty while excluding profiles | ✓ VERIFIED | `buildBag.ts` accepts count/difficulty/catalog only; 36 bag tests cover all 5–15 × 3 combinations plus Baron and Drunk invariants |
| 4 | Wizard enforces script → players → difficulty → bag → deal → record | ✓ VERIFIED | `SetupWizard.tsx` mounts the persisted step switch on `/setup`; Playwright traverses the sequence without skip controls |
| 5 | Storyteller can tap a player, assign only a remaining physical token, and clear it back into the pool | ✓ VERIFIED | Store guards `assignRole`; `setup-record.spec.ts` assigns all seats and proves clear/restoration |
| 6 | Starting with invalid assignments surfaces concrete issues and requires explicit Start anyway confirmation | ✓ VERIFIED | `RecordStep.tsx` calls `validateAssignments`; incomplete and clean paths both pass E2E. This follows locked D-15, which intentionally softens GRIM-02's literal “blocks” wording |
| 7 | Successful/overridden start reaches Night ready on `/setup`, not `/play` | ✓ VERIFIED | `NightReadyStep.tsx` and E2E assert summary labels, `/setup`, and no play link |
| 8 | Shape-valid but semantically impossible persisted sessions recover fresh instead of rendering a blank route | ✗ FAILED | `setupSessionStore.ts:50-56,222-231` accepts `wizardStep: bag/nightReady` with `bag: null`; both downstream components return `null`. Existing corruption E2E covers invalid JSON only |
| 9 | “Assignments are saved” is shown only after the latest IndexedDB write succeeds | ✗ FAILED | `idbStorage.setItem` can reject, but no persistence status/error reaches UI; `NightReadyStep.tsx:39` asserts saved unconditionally |
| 10 | Drunk cover assignment preserves true and believed identity | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Store branch exists at `setupSessionStore.ts:145-151`; bag unit test proves cover generation, but no test exercises the assignment transition |
| 11 | Long names, a 15-role picker, and a many-issue dialog remain usable at 390×844 | ? UNCERTAIN | CSS contains wrapping/scroll constraints and general phone overflow tests pass, but the three plan backstops have no scenario-specific visual/browser assertions |

**Score:** 7/11 truths verified (1 present but behavior-unverified; 2 failed; 1 human-only)

### Required Artifacts

| Artifact group | Status | Details |
|---|---|---|
| Session store and IndexedDB adapter | ⚠️ SUBSTANTIVE, INTEGRITY GAPS | Wired throughout wizard; shape validation and hydration gate exist, but semantic validation and write-failure feedback do not |
| Bag builder and validator | ✓ EXISTS + SUBSTANTIVE + WIRED | All four plan artifacts pass automated artifact checks; legal bag matrix passes |
| Setup wizard steps | ✓ EXISTS + SUBSTANTIVE + WIRED | `/setup` mounts `SetupWizard`; script through Night ready components are used |
| Role recording and validation | ✓ EXISTS + SUBSTANTIVE + WIRED | Remaining-token store guard, validator, picker, and record UI are connected |
| Browser/domain tests | ⚠️ SUBSTANTIVE, RECOVERY GAPS | 26 Playwright and 39 unit tests pass; no semantic-corruption, failed-write, or Drunk-assignment transition test |

**Artifacts:** 18/18 declared artifacts exist and pass substantive checks; two session-integrity behaviors remain incomplete.

### Key Link Verification

Automated plan checks verified 12/15 declared links. The three reported failures in plan 02-05 are malformed `from:` descriptors rather than missing product wiring; manual inspection confirms all three connections:

- `RecordStep` calls `validateAssignments` and branches to a soft-gate or Night ready.
- `ConfirmDialog` Start anyway invokes the Night ready transition.
- `NightReadyStep` remains mounted under the `/setup` route and does not navigate to `/play`.

## Requirements Coverage

| Requirement | Status | Evidence / blocking issue |
|---|---|---|
| SETUP-01 | ✓ SATISFIED | Trouble Brewing confirmation, unique named roster, seating controls, and 5–15 gate are browser-tested |
| SETUP-02 | ✓ SATISFIED | Three difficulty levels and Standard default are browser-tested |
| SETUP-03 | ✓ SATISFIED | Optional experience, age, and notes are captured and retained across steps |
| SETUP-04 | ✓ SATISFIED | Legal bag matrix passes; locked D-07 overrides the older profile-input wording for v1 |
| SETUP-05 | ✗ BLOCKED (recovery path) | Normal sequence passes, but a shape-valid impossible persisted step can bypass recovery and blank `/setup` |
| GRIM-01 | ✓ SATISFIED | Physical assignment, remaining-token restriction, and clear restoration are browser-tested |
| GRIM-02 | ✓ SATISFIED under D-15 | Invalid composition cannot proceed silently; explicit issue list + Start anyway is required |

**Coverage:** 6/7 requirements satisfied without a blocking recovery-path caveat.

## Prohibition Accounting

- **13 test-tier prohibitions:** direct code/test inspection finds no current product violation, but none has the required known-bad `check_violation_fixture`; deterministic prohibition enforcement therefore cannot produce a green verdict and fails closed.
- **7 judgment-tier prohibitions:** non-authoritative source review finds them honored in the final product. Human review is still recommended. The two plan-01 items are temporal wave constraints, not final-product constraints.

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|---|---:|---|---|---|
| `src/state/setupSessionStore.ts` | 50 | Shape-only persistence schema | 🛑 Blocker | Validly-shaped impossible sessions can strand downstream wizard steps |
| `src/state/setupSessionStore.ts` | 121 | Fire-and-forget critical persisted transitions | 🛑 Blocker | IndexedDB failure is invisible to the Storyteller |
| `src/ui/setup/steps/NightReadyStep.tsx` | 39 | Unconditional saved assurance | 🛑 Blocker | UI may claim durability after a failed write |
| `src/ui/setup/components/ConfirmDialog.tsx` | 27 | Dialog focus is not restored to trigger | ⚠️ Warning | Keyboard/assistive-technology users lose their place after close |

## Human Verification Required

### 1. Phone overflow backstops

**Test:** At 390×844, use a very long player name, open a maximum-size role picker, and open a soft-gate with many issues.
**Expected:** No horizontal scrolling; picker and dialog scroll vertically; footer does not cover the last actionable row.
**Why human:** General overflow tests pass, but these exact extreme scenarios are not covered.

### 2. Judgment-tier negative constraints

**Test:** Review the seven judgment-tier prohibitions against the final setup flow and shipped assets/copy.
**Expected:** No HTML injection, token art, Vaul picker, dropout flow, or shaming copy; temporal Wave-1 constraints are treated as historical only.
**Why human:** The GSD contract classifies these as non-authoritative LLM judgments.

## Gaps Summary

### Critical Gaps (Block Progress)

1. **Semantic hydration validation is absent**
   - Add cross-field validation for downstream steps, legal bag/roster cardinality, unique player IDs, and assignment key/player consistency.
   - Reset fresh with the existing recovery alert when an invariant fails.
   - Add browser tests for at least `bag: null` on a downstream step and roster/bag mismatch.

2. **Durable assignment saving is neither awaited nor surfaced**
   - Add saving/saved/error state or an explicit awaited critical save before Night ready.
   - Remove/gate the saved assurance until persistence succeeds and provide retry/error handling.
   - Add a browser test with a rejecting storage seam.

### Workflow Enforcement Gap

3. **Test-tier prohibitions are not mechanically enforceable**
   - Supply projected check descriptors plus known-bad fixtures, or change the authored verification tier where deterministic enforcement is not intended.

## Recommended Fix Plan

### 02-06-PLAN.md: Persisted Session Integrity

**Objective:** Make hydration and critical assignment persistence fail safely.

1. Add semantic validation for hydrated session relationships and fresh-session recovery tests.
2. Add explicit durable-save status/error handling for the Night ready transition and truthful UI copy.
3. Add Drunk assignment, failed-write, and focus-restoration regression coverage; wire prohibition fixtures where applicable.

**Estimated scope:** Medium

## Decision Coverage

All 21 trackable `02-CONTEXT.md` decisions are honored by shipped artifacts. This is a non-blocking heuristic result.

## Automated Verification

- `CURSOR_DEV=true nix develop -c npm run test:unit` — 39/39 passed.
- `CURSOR_DEV=true nix develop -c npm test` — 26/26 Playwright tests passed.
- `CURSOR_DEV=true nix develop -c npm run lint` — passed.
- `CURSOR_DEV=true nix develop -c npm run build` — passed.
- Declared artifacts — 18/18 passed automated checks.
- Declared key links — 12/15 machine-verified; remaining 3 manually verified after descriptor-format failure.

---
*Verifier: gsd-verifier (generic-agent workaround)*
