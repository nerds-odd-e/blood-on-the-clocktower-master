---
phase: 03-night-coach-live-grimoire
verified: 2026-07-16T10:02:19Z
status: passed
score: 8/12 must-haves verified
behavior_unverified: 0
overrides_applied: 0
re_verification: false
behavior_unverified_items: []
human_verification:

  - test: "On a 390×844 phone viewport, open a First Night coach beat with a long role/player name"
    expected: "Heading and player sub-label wrap; page has no horizontal scroll"
    why_human: "PLAN backstop (03-03) — layout overflow cannot be proven by unit/E2E presence checks"

  - test: "On Demon Info with many eligible bluff chips, inspect the beat card at 390×844"
    expected: "Chips wrap or scroll inside the card; page has no horizontal scroll"
    why_human: "PLAN backstop (03-04) — overflow is visual"

  - test: "Seat 15 players, open Grimoire, place several reminder chips"
    expected: "List scrolls vertically; page has no horizontal scroll"
    why_human: "PLAN backstop (03-05) — overflow is visual"

  - test: "Place a long catalog reminder string on a grimoire row"
    expected: "Reminder chip text wraps inside the chip"
    why_human: "PLAN backstop (03-05) — wrap behavior is visual"

  - test: "Run a full table path: Night ready → First Night coach → Grimoire edits → Night complete → Start other night"
    expected: "You always know the next beat and what to say without needing a paper night sheet"
    why_human: "MVP outcome clause is experiential; automated tests prove chrome exists but not table usability"
---

# Phase 3: Night Coach & Live Grimoire Verification Report

**Phase Goal:** Storyteller can run First Night and Other Nights via next-beat coach — always knowing what to do next and what to say — without a paper night sheet

**Verified:** 2026-07-16T10:02:19Z  
**Status:** human_needed  
**Re-verification:** No — initial verification  
**Mode:** mvp

## User Flow Coverage

User story: *As a Storyteller, I want to run First Night and Other Nights via a next-beat coach with a live grimoire, so that I always know what to do next and what to say without a paper night sheet.*

| Step | Expected | Evidence | Status |
|------|----------|----------|--------|
| Start first night | Night ready sticky CTA → `/play` with First Night coach | `NightReadyStep.tsx` calls `startFirstNight()` + `navigate('/play')`; E2E `play-coach.spec.ts` | ✓ |
| See next beat | Current step title, short prompt, sticky Next | `CoachBeatView.tsx` + `composePrompt`; E2E advances beat / asserts step chrome | ✓ |
| Expand detail | More detail / Less detail inline expand | `CoachBeatView` `aria-expanded` + `prompt.detail`; E2E clicks More detail | ✓ |
| Record Demon bluffs | Demon Info + bluff chips + soft confirm | `BluffPicker` + `eligibleBluffRoleIds` + ConfirmDialog; E2E bluff path | ✓ |
| Live grimoire | Dead/Alive, reminders, ST truth, Back to coach | `LiveGrimoireView.tsx`; E2E `play-grimoire.spec.ts` | ✓ |
| Other night | Night complete → Start other night → Other night step | `NightBridgeView` + `startOtherNight`; E2E asserts Other night chrome | ✓ |
| Outcome | Know what to do/say without a paper night sheet | Code + E2E prove the loop; table feel needs human | ⚠️ human |

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | App derives First Night and Other Nights wake order from roles currently in play | ✓ VERIFIED | `buildNightBeats.ts` filters recorded assignments by ordinals; Vitest `buildNightBeats.test.ts` (Drunk, 5-player omit info, dead omit, Ravenkeeper); `PlayScreen` re-derives each render |
| 2 | Next-beat screen shows the current step, a short prompt, and a primary Next action | ✓ VERIFIED | `CoachBeatView` heading + `prompt.short` + sticky Next; Playwright `play-coach.spec.ts` passed |
| 3 | Storyteller can tap to expand ability/procedure detail for the current beat | ✓ VERIFIED | More detail / Less detail toggles `prompt.detail`; E2E passed |
| 4 | First-night Demon/Minion information steps appear when those roles are in play, and Storyteller can record Demon bluffs | ✓ VERIFIED | Gating `playerCount >= 7` + team presence in `buildNightBeats`; `BluffPicker` / `setDemonBluffs` eligibility; unit + E2E bluff soft-confirm path passed |
| 5 | Storyteller can mark players alive/dead and place/clear Trouble Brewing reminder tokens during play | ✓ VERIFIED | `LiveGrimoireView` Dead/Alive + reminder place/clear from `role.reminders`; `toggleDead` / `setPlayerReminders` store tests; E2E `play-grimoire.spec.ts` passed |
| 6 | Night complete → Start other night enables Other Nights without day-phase UI | ✓ VERIFIED | `advanceBeat` → `playSurface: 'bridge'`; `NightBridgeView` sticky Start other night; E2E reaches Other night; no nomination/vote chrome in `src/ui/play` |
| 7 | Grimoire shows ST-private truth including Drunk · believes {Cover} | ✓ VERIFIED | `truthLabel` in `LiveGrimoireView` renders Drunk cover; privacy line "Private — Storyteller only." |
| 8 | Leaving Demon Info with fewer than three bluffs uses soft confirm (Continue anyway) | ✓ VERIFIED | `CoachBeatView` ConfirmDialog when `demonBluffs.length < 3`; E2E asserts dialog |
| 9 | Long role and player names wrap at 390×844 without horizontal scroll | ? UNCERTAIN | `break-words` / `overflow-x-hidden` present; PLAN `verification: backstop` |
| 10 | Many eligible bluff chips wrap/scroll without horizontal page overflow | ? UNCERTAIN | `flex-wrap` on chip grid; PLAN `verification: backstop` |
| 11 | Fifteen players plus reminder chips scroll vertically without horizontal overflow | ? UNCERTAIN | Vertical list + wrap classes; PLAN `verification: backstop` |
| 12 | Long reminder strings wrap inside reminder chips | ? UNCERTAIN | `break-words` on chips; PLAN `verification: backstop` |

**Score:** 8/12 truths verified (0 present, behavior-unverified; 4 backstop → human)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/domain/engine/buildNightBeats.ts` | Pure night beat queue | ✓ VERIFIED | Exists, substantive (~81 lines), exported and used by `PlayScreen` |
| `src/domain/engine/types.ts` | NightKind + Beat union | ✓ VERIFIED | Present; imported by engine/coach |
| `src/domain/coach/composePrompt.ts` | Short + detail prompts | ✓ VERIFIED | Wired via `CoachBeatView`; catalog `coach-copy.json` loaded in `loadCatalog` |
| `src/data/scripts/trouble-brewing/coach-copy.json` | IP-safe templates | ✓ VERIFIED | Paraphrased entries for dusk/info/dawn/wakes |
| `src/domain/grimoire/eligibleBluffs.ts` | Good not-in-play bluff pool | ✓ VERIFIED | Used by `BluffPicker` + store mutations |
| `src/ui/play/PlayScreen.tsx` | `/play` coach/grimoire/bridge shell | ✓ VERIFIED | Routed in `routes.tsx`; replaces PlayStub |
| `src/ui/play/CoachBeatView.tsx` | Next-beat UX | ✓ VERIFIED | Wired from PlayScreen when `playSurface === 'coach'` |
| `src/ui/play/BluffPicker.tsx` | Demon bluff chips | ✓ VERIFIED | Embedded in CoachBeatView + LiveGrimoireView |
| `src/ui/play/LiveGrimoireView.tsx` | Live grimoire panel | ✓ VERIFIED | Wired when `playSurface === 'grimoire'` |
| `src/ui/play/NightBridgeView.tsx` | Night complete bridge | ✓ VERIFIED | Wired when `playSurface === 'bridge'`; E2E green |
| `src/ui/setup/steps/NightReadyStep.tsx` | Start first night CTA | ✓ VERIFIED | Sticky CTA + navigate |
| `e2e/play-coach.spec.ts` | Coach E2E gate | ✓ VERIFIED | Passed (chromium) |
| `e2e/play-grimoire.spec.ts` | Grimoire E2E gate | ✓ VERIFIED | Passed (chromium) |

### Key Link Verification

Automated `verify.key-links` failed because PLAN `from:` values are component names, not file paths. Manual wiring check:

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `NightReadyStep.tsx` | `/play` | `startFirstNight()` then `navigate('/play')` | ✓ WIRED | Lines ~125–126 |
| `PlayScreen.tsx` | `buildNightBeats` | Re-derive from session + catalog | ✓ WIRED | Import + call each render |
| `setupSessionStore.ts` | persist v2 | `version: 2` + `migrate` + play defaults | ✓ WIRED | Persist config present |
| `CoachBeatView.tsx` | `composePrompt` | short/detail from beat | ✓ WIRED | Import + render |
| `CoachBeatView` Next | `advanceBeat` | end → bridge surface | ✓ WIRED | `onNext={() => advanceBeat(total)}` |
| `PlayScreen` | `CoachBeatView` | `playSurface === 'coach'` | ✓ WIRED | Default play path |
| `BluffPicker` | `eligibleBluffRoleIds` | chip filter | ✓ WIRED | Direct call |
| Demon Info Next | `ConfirmDialog` | soft gate `< 3` bluffs | ✓ WIRED | Continue anyway / Keep editing |
| `setDemonBluffs` / `toggleDemonBluff` | eligible set | rejects non-eligible IDs | ✓ WIRED | Store filters via helper |
| `toggleDead` | `deadPlayerIds` + beats | Other Night omits dead | ✓ WIRED | PlayScreen passes Set into `buildNightBeats` |
| `NightBridgeView` | `startOtherNight` | other night + clear `diedTonightIds` | ✓ WIRED | Store action + E2E |
| Reminder chips | `role.reminders` | place/clear catalog-only | ✓ WIRED | `setPlayerReminders` filters allowed tokens |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `PlayScreen` | `beats` / `current` | `buildNightBeats(players, assignments, dead…, catalog)` | Yes — session + TB catalog | ✓ FLOWING |
| `CoachBeatView` | `prompt` | `composePrompt` ← `coach-copy.json` / role reminders | Yes — loaded catalog | ✓ FLOWING |
| `BluffPicker` | `options` | `eligibleBluffRoleIds(assignments, catalog)` | Yes — derived from seated roles | ✓ FLOWING |
| `LiveGrimoireView` | rows / reminders | store `players`, `assignments`, `reminders`, `deadPlayerIds` | Yes — Zustand session | ✓ FLOWING |
| `NightBridgeView` | CTA | `startOtherNight` store mutation | Yes — resets night cursor | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Night beat engine + Drunk/dead/Ravenkeeper | `CURSOR_DEV=true nix develop -c npx vitest run src/domain/engine/buildNightBeats.test.ts …` (5 unit files) | 17 tests passed | ✓ PASS |
| Coach E2E happy path | `… npx playwright test e2e/play-coach.spec.ts` | 1 passed (4.5s suite) | ✓ PASS |
| Grimoire + other-night E2E | `… npx playwright test e2e/play-grimoire.spec.ts` | 1 passed | ✓ PASS |

### Probe Execution

| Probe | Command | Result | Status |
|-------|---------|--------|--------|
| — | — | No phase probes declared; no `scripts/*/tests/probe-*.sh` | SKIP |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| COACH-01 | 03-01, 03-02, 03-05 | Derive First/Other night wake order from in-play roles | ✓ SATISFIED | `buildNightBeats` + unit tests + other-night E2E |
| COACH-02 | 03-01, 03-03 | Next-beat: step, short prompt, Next | ✓ SATISFIED | `CoachBeatView` + E2E |
| COACH-03 | 03-01, 03-03 | Expand ability/procedure detail | ✓ SATISFIED | More detail expand + E2E |
| COACH-04 | 03-01, 03-04 | First-night Demon/Minion info when applicable | ✓ SATISFIED | Gating in engine + E2E Demon Info |
| GRIM-03 | 03-01, 03-05 | Alive/dead + reminder tokens | ✓ SATISFIED | Live grimoire + E2E |
| GRIM-04 | 03-01, 03-04 | Record Demon bluffs | ✓ SATISFIED | BluffPicker + store eligibility + E2E |

No orphaned Phase 3 requirement IDs in REQUIREMENTS.md beyond the six above.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | No `TBD`/`FIXME`/`XXX` in phase play/engine/coach files | — | — |
| — | — | No day-phase nomination/vote/execution UI under `src/ui/play` | — | Prohibitions honored |
| — | — | No Vaul / PlayStub remaining on `/play` | — | — |

**Disconfirmation notes (not blockers):**

1. Persist write-error banner UI exists on coach/grimoire but has no dedicated automated test for the error path.
2. Coach E2E assigns roles by clicking the first available chip; Demon Info coverage depends on bag composition (test fails closed if Demon Info never appears).
3. Working tree may still show `NightBridgeView.tsx` untracked — file exists, is imported, and E2E passes (commit hygiene, not a goal gap).

### Research pitfall cross-check

| Pitfall | Mitigated? | Evidence |
|---------|------------|----------|
| Wrong Minion/Demon Info gating | Yes | `playerCount >= 7` + team presence; 5-player unit test |
| Drunk wake as Drunk | Yes | `wakeRoleId` uses `believedRoleId`; unit test |
| Dead players still in Other Night | Yes | omit dead except Ravenkeeper + `diedTonightIds` |
| Frozen beat list after death | Yes | re-derive + `clampBeatIndex` |
| Bluff pool includes evil/seated | Yes | `eligibleBluffRoleIds` + store reject |
| `/play` stub E2E left green | Yes | `PlayScreen` on route; coach/grimoire E2E green |
| Almanac scrape / auto-resolve | Yes | paraphrased `coach-copy.json`; "ST judges" language |

### Human Verification Required

### 1. Long name wrap (backstop)

**Test:** On 390×844, open a beat with a long role/player name.  
**Expected:** Heading/sub-label wrap; no horizontal page scroll.  
**Why human:** PLAN `verification: backstop`.

### 2. Bluff chip overflow (backstop)

**Test:** Demon Info with many eligible chips at phone width.  
**Expected:** Chips wrap/scroll in card; no page horizontal overflow.  
**Why human:** PLAN `verification: backstop`.

### 3. Fifteen-player grimoire scroll (backstop)

**Test:** 15 seated players + several reminders on Grimoire.  
**Expected:** Vertical scroll only; no horizontal overflow.  
**Why human:** PLAN `verification: backstop`.

### 4. Long reminder wrap (backstop)

**Test:** Place a long reminder token string.  
**Expected:** Text wraps inside the chip.  
**Why human:** PLAN `verification: backstop`.

### 5. MVP outcome at the table

**Test:** Run Night ready → First Night → Grimoire → Night complete → Start other night.  
**Expected:** You know what to do next and what to say without a paper night sheet.  
**Why human:** Outcome clause is experiential.

### Gaps Summary

No blocking gaps. Roadmap success criteria and COACH-01–04 / GRIM-03–04 are implemented, wired, and exercised by unit + Playwright tests. Status is `human_needed` solely for four PLAN visual backstops plus MVP outcome confirmation — not for missing features.

---

_Verified: 2026-07-16T10:02:19Z_  
_Verifier: Claude (gsd-verifier)_
