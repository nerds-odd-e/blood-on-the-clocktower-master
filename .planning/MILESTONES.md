# Milestones

## v1.0 MVP (Shipped: 2026-07-16)

**Closeout type:** override_closeout  
**Known verification overrides:** 2 (see STATE.md Deferred Items)  
**Phases completed:** 3 phases, 16 plans, 33 tasks  
**Git range:** `8e8f4ec` → `HEAD` (~154 commits, ~5.2k LOC `src/`)  
**Demo:** https://nerds-odd-e.github.io/blood-on-the-clocktower-master/

**Delivered:** A phone-first offline Storyteller co-pilot that runs Trouble Brewing from setup through First Night and Other Nights without a paper night sheet.

**Key accomplishments:**

1. Installable phone PWA with Zod-validated Trouble Brewing catalog (22 roles, setup chart, night ordinals)
2. Setup wizard → difficulty-weighted legal bag → deal coaching → remaining-token role recording
3. Soft composition gate + Night ready handoff with durable IndexedDB persistence
4. Rules-correct night beat queue + full-screen next-beat coach (short/detail prompts)
5. Demon Info bluffs with eligibility + soft incomplete confirm
6. Live grimoire (alive/dead, reminders, ST truth) + Night complete → Start other night bridge

### Known Gaps

- Phase 1 human UAT unfinished (`01-UAT.md` testing — 6 pending visual/MVP scenarios)
- Phase 1 verification left `human_needed` (override at close)
- Code-review debt: play fields may not scrub when roster/assignments change mid-session

Archives:

- [v1.0-ROADMAP.md](./milestones/v1.0-ROADMAP.md)
- [v1.0-REQUIREMENTS.md](./milestones/v1.0-REQUIREMENTS.md)
- [v1.0-phases/](./milestones/v1.0-phases/)

---
