---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 02
current_phase_name: setup-wizard-grimoire-capture
status: verifying
stopped_at: Phase 02 verification human_needed (12/13)
last_updated: "2026-07-16T08:48:30Z"
last_activity: 2026-07-16
last_activity_desc: Phase 02 re-verification after 02-06 gap closure
progress:
  total_phases: 2
  completed_phases: 2
  total_plans: 11
  completed_plans: 11
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-16)

**Core value:** A new Storyteller can run a complete Trouble Brewing game without a paper night sheet — always knowing what to do next and what to say.
**Current focus:** Phase 02 — setup-wizard-grimoire-capture

## Current Position

Phase: 02 (setup-wizard-grimoire-capture) — VERIFYING
Plan: 6 of 6
Status: Verification human_needed (12/13) — overflow backstops + judgment prohibitions
Last activity: 2026-07-16 — Re-verified after 02-06; report at 02-VERIFICATION.md

Progress: [██████████] 100% (6/6 plans executed)

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**

- Last 5 plans: —
- Trend: —

*Updated after each plan completion*
**Per-Plan Metrics:**

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 01 P01 | 10min | 2 tasks | 25 files |
| Phase 01 P02 | 5min | 2 tasks | 13 files |
| Phase 01 P03 | 9min | 2 tasks | 15 files |
| Phase 01 P04 | 7min | 2 tasks | 5 files |
| Phase 01 P05 | 8min | 2 tasks | 4 files |
| Phase 02 P01 | 9min | 2 tasks | 7 files |
| Phase 02 P02 | 14min | 2 tasks | 12 files |
| Phase 02 P03 | 6min | 2 tasks | 12 files |
| Phase 02 P04 | 5min | 2 tasks | 11 files |
| Phase 02 P05 | 4min | 2 tasks | 7 files |
| Phase 02 P06 | 6min | 3 tasks | 45 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Roadmap: 3-phase MVP so playable TB night lands at end of Phase 3 (wizard → bag → record → coach)
- Phone-first + offline PWA ships in Phase 1 with the shell, not deferred
- v2 (assists, day phase, other scripts) stays out of this milestone
- [Phase ?]: Scaffolded create-vite via /tmp merge to preserve e2e/.planning
- [Phase ?]: Playwright-only Phase 1 testing; no Vitest/jsdom/Testing Library (D-05 D-07)
- [Phase ?]: Kept create-vite 9.x oxlint baseline over outdated eslint/vite.svg assumptions
- [Phase ?]: Confirmed fontsource + Tailwind + react-router-dom on npm before install (T-01-SC)
- [Phase ?]: Start setup CTA stays hidden until loadCatalog greens in 01-03
- [Phase ?]: Thin-reexport src/App.tsx so create-vite path does not dual-mount
- [Phase ?]: TB roles from townsquare TB interchange excluding travelers (22 / 13-4-4-1)
- [Phase ?]: Setup chart locked to RESEARCH A1; verification note in loadCatalog.ts header
- [Phase ?]: Offline ready chip optimistic on Zod success; original PWA icons only
- [Phase ?]: E2E hooks: tb-script-card, tb-team-counts, tb-setup-chart, tb-role-row with data-first-night
- [Phase ?]: teamCounts derived in loadCatalog (not stored in JSON) for UI + later phases
- [Phase ?]: Night-order sample: Poisoner firstNight < Washerwoman and Spy via visible data attrs
- [Phase ?]: Offline proof uses browserContext.setOffline against vite preview after SW control
- [Phase ?]: wave_0_complete true; nyquist_compliant left for validate-phase
- [Phase ?]: TDD Task 1 suite green on first run — PWA already in 01-03; no separate RED fail
- [Phase ?]: Validate persisted setup data during Zustand merge and expose hydration failure as an ephemeral UI flag.
- [Phase ?]: Keep optional player profiles in session state only; bag generation remains independent of profiles.
- [Phase 02]: Represent Drunk with a Townsfolk cover token while retaining true Outsider composition. — Keeps the digital grimoire aligned with the physical token players draw.
- [Phase 02]: Generate bags from player count, difficulty, and catalog only. — Enforces D-07 profile isolation at the type and store boundary.
- [Phase 02]: Derive the visible role picker from the globally unassigned physical bag-token multiset, including when editing an assigned player. — Keeps assigned physical tokens out of the available pool until explicitly cleared.
- [Phase 02]: Persist both true Drunk identity and the Townsfolk role the player believes when its physical cover token is recorded. — Preserves both mechanical truth and player-facing knowledge for night coaching.
- [Phase 02]: Keep Start night primary on the record surface, but render Start anyway as a neutral secondary outline inside the warning dialog. — Preserves one clear forward action without styling a local override as destructive or as the default.
- [Phase 02]: Advance by persisted wizardStep only, retaining /setup and exposing no /play affordance until Phase 3. — Keeps the setup handoff available to the next phase without prematurely opening the coach.
- [Phase ?]: Semantic hydration failures reuse Zod hydrationError recovery path
- [Phase ?]: Night ready saved assurance gated on persistWriteStatus after awaitCriticalPersist
- [Phase ?]: Phase 2 test-tier prohibitions wired via tests/prohibitions node:test + check_* descriptors

### Pending Todos

None yet.

### Blockers/Concerns

- Phase 2 bag difficulty/profile heuristics need Almanac/TPI validation during plan-phase research
- Coach copy must be paraphrased ST coaching (not scraped Almanac) — review before public demo
- Distribution posture (personal/CCC vs TPI approval) before any public URL or store listing

## Deferred Items

Items acknowledged and carried forward from previous milestone close:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| *(none)* | | | |

## Quick Tasks Completed

| Date | Task | Directory | Status |
|------|------|-----------|--------|
| 2026-07-16 | Setup nix flake + agent/cursor/claude nix prefix rules | `260716-j2f-setup-nix-flake-and-agent-cursor-claude-` | complete |
| 2026-07-16 | Setup GitHub Actions CI to run tests and lint/build | `260716-j64-setup-github-actions-ci-to-run-tests-and` | complete |

## Session Continuity

Last session: 2026-07-16T08:42:48.644Z
Stopped at: Completed 02-06-PLAN.md
Resume file: None
