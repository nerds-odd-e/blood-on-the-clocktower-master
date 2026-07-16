# Roadmap: Blood on the Clocktower — Storyteller Copilot

## Overview

Ship a phone-first offline co-pilot so a new Storyteller can run Trouble Brewing without a paper night sheet. Phase 1 stands up the installable shell and TB catalog; Phase 2 completes wizard → bag → role recording into a legal grimoire; Phase 3 delivers the next-beat night coach (the first moment you can fully play a TB night). v2 assists, day phase, and other scripts stay deferred.

## Phases

- [ ] **Phase 1: Phone Shell & TB Catalog** - Installable phone-first offline app with Trouble Brewing data
- [ ] **Phase 2: Setup Wizard & Grimoire Capture** - Wizard → legal bag → deal → recorded roles with composition gate
- [ ] **Phase 3: Night Coach & Live Grimoire** - Next-beat First/Other night coach with tokens, bluffs, and detail

## Phase Details

### Phase 1: Phone Shell & TB Catalog

**Goal:** Storyteller can open a phone-first offline app that knows Trouble Brewing roles, setup chart, and night-order data
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements:** PLAT-01, PLAT-02
**Success Criteria** (what must be TRUE):

  1. Storyteller can use the app on a phone-sized viewport without horizontal scrolling or unusable controls
  2. After first load, Storyteller can reload and use the app with no network connection and no account
  3. App exposes Trouble Brewing as the available script with roles/night data loaded for later setup and coach

**Plans:** 5/5 plans executed

Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Scaffold + Playwright RED smoke + VALIDATION Playwright retarget

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — PhoneShell, routes, stubs, index.html viewport

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 01-03-PLAN.md — TB catalog + Zod loaders + VitePWA + smoke GREEN

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 01-04-PLAN.md — Catalog lock + home surface + Playwright catalog assertions

**Wave 5** *(blocked on Wave 4 completion)*

- [x] 01-05-PLAN.md — Offline/viewport Playwright proof + VALIDATION status sync

**UI hint**: yes

### Phase 2: Setup Wizard & Grimoire Capture

**Goal:** Storyteller can walk the setup wizard, get a legal TB bag, and record who drew which role before night starts
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** SETUP-01, SETUP-02, SETUP-03, SETUP-04, SETUP-05, GRIM-01, GRIM-02
**Success Criteria** (what must be TRUE):

  1. Storyteller can select Trouble Brewing, enter unique player names with seating order, set difficulty, and optionally set experience/age/notes per player
  2. App generates a legal Trouble Brewing bag from player count, difficulty, and optional profiles (deal stays random)
  3. Wizard walks script → players → difficulty → bag → deal → role recording in order
  4. After the physical deal, Storyteller can record assignments via tap player → pick character
  5. App blocks starting night until recorded roles match the expected team composition

**Plans:** 3/5 plans executed

Plans:
**Wave 1**

- [x] 02-01-PLAN.md — Wave 0 deps + RED wizard E2E + stub/home expectation rewrite

**Wave 2** *(blocked on Wave 1)*

- [x] 02-02-PLAN.md — Wizard shell + roster (script → players → difficulty UI; Zustand persist; SETUP-03 More)

**Wave 3** *(blocked on Wave 2)*

- [x] 02-03-PLAN.md — Difficulty heuristics + legal bag domain/UI through Accept bag

**Wave 4** *(blocked on Wave 3)*

- [ ] 02-04-PLAN.md — Deal coaching + remaining-token role recording

**Wave 5** *(blocked on Wave 4)*

- [ ] 02-05-PLAN.md — Soft Start night gate + Night ready handoff on /setup

**UI hint**: yes

### Phase 3: Night Coach & Live Grimoire

**Goal:** Storyteller can run First Night and Other Nights via next-beat coach — always knowing what to do next and what to say — without a paper night sheet
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** COACH-01, COACH-02, COACH-03, COACH-04, GRIM-03, GRIM-04
**Success Criteria** (what must be TRUE):

  1. App derives First Night and Other Nights wake order from roles currently in play
  2. Next-beat screen shows the current step, a short prompt, and a primary Next action
  3. Storyteller can tap to expand ability/procedure detail for the current beat
  4. First-night Demon/Minion information steps appear when those roles are in play, and Storyteller can record Demon bluffs
  5. Storyteller can mark players alive/dead and place/clear Trouble Brewing reminder tokens during play

**Plans:** TBD

**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Phone Shell & TB Catalog | 5/5 | In Progress|  |
| 2. Setup Wizard & Grimoire Capture | 3/5 | In Progress|  |
| 3. Night Coach & Live Grimoire | 0/TBD | Not started | - |

## Coverage Map

| Requirement | Phase |
|-------------|-------|
| PLAT-01 | Phase 1 |
| PLAT-02 | Phase 1 |
| SETUP-01 | Phase 2 |
| SETUP-02 | Phase 2 |
| SETUP-03 | Phase 2 |
| SETUP-04 | Phase 2 |
| SETUP-05 | Phase 2 |
| GRIM-01 | Phase 2 |
| GRIM-02 | Phase 2 |
| COACH-01 | Phase 3 |
| COACH-02 | Phase 3 |
| COACH-03 | Phase 3 |
| COACH-04 | Phase 3 |
| GRIM-03 | Phase 3 |
| GRIM-04 | Phase 3 |

**Coverage:** 15/15 v1 requirements mapped ✓

## Playable Cut

**When can I play?** End of Phase 3 — wizard → bag → record → next-beat coach delivers a complete Trouble Brewing night without a paper sheet.

---
*Roadmap created: 2026-07-16*
*Mode: mvp | Granularity: standard (compressed to 3 phases for early playable cut)*
