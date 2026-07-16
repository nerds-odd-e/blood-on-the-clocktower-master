# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-07-16  
**Phases:** 3 | **Plans:** 16 | **Tasks:** 33  
**Closeout:** override_closeout (Phase 1 UAT deferred)

### What Was Built

- Phone-first offline PWA shell with Trouble Brewing catalog
- Setup wizard → legal bag → deal → role recording with composition gate
- Next-beat First/Other night coach with live grimoire and Demon bluffs
- GitHub Pages demo deployment

### What Worked

- Wave 0 RED gates (Vitest + Playwright) before green implementation kept later plans honest
- MVP vertical slices (one playable cut per wave) kept the coach loop shippable early
- Nix-pinned Node tooling avoided agent/local version skew
- Zustand + IndexedDB persistence fit the single-operator offline session model

### What Was Inefficient

- Phase 1 human UAT left open while Phases 2–3 shipped — forced override closeout
- API-coverage verify:pre false-positive blocked UAT until the gate was disabled
- `phase.complete` advanced “next” to Phase 1 because its ROADMAP checkbox was never marked done

### Patterns Established

- Playwright-first for table flows; colocated Vitest for pure domain
- IP-safe paraphrased coach-copy (not official night sheet text)
- Soft confirms for live-table friction (incomplete bluffs, composition override)
- Fail-closed Zod hydrate for persisted session blobs

### Key Lessons

1. Close earlier-phase UAT before later phases finish — or accept override_closeout consciously
2. Keep Wave 0 RED contracts on real catalog data; green stubs hide coach bugs
3. Disable or OPT-OUT capability gates that don't match a local-only product

### Cost Observations

- Model mix: not tracked this milestone
- Sessions: multi-session GSD execute/verify across phases 1–3
- Notable: sequential executors (worktrees off) kept main-tree commits linear

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | multi | 3 | Established Wave 0 RED + MVP vertical slices |

### Cumulative Quality

| Milestone | E2E (Playwright) | Unit (Vitest) | Notes |
|-----------|------------------|---------------|-------|
| v1.0 | 34 passed at Phase 3 close | 73 passed | Phase 1 visual UAT deferred |

### Top Lessons (Verified Across Milestones)

1. Wave 0 RED gates on real data before green implementation
2. Finish human UAT for early phases before declaring the milestone sealed
