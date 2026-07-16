---
phase: 3
slug: night-coach-live-grimoire
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-16
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.10 (domain) + Playwright 1.61.1 (E2E) |
| **Config file** | `vitest.config.ts`, `playwright.config.ts` |
| **Quick run command** | `CURSOR_DEV=true nix develop -c npm run test:unit` |
| **Full suite command** | `CURSOR_DEV=true nix develop -c npm run test:unit && CURSOR_DEV=true nix develop -c npm test` |
| **Estimated runtime** | ~60–180 seconds (unit fast; full Playwright longer) |

---

## Sampling Rate

- **After every task commit:** Run `CURSOR_DEV=true nix develop -c npm run test:unit`
- **After every plan wave:** Run unit + affected Playwright specs
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** ~30 seconds for unit; ~3 minutes for full suite

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-T1 | 01 | 0 | COACH-01 | — | N/A | unit | `CURSOR_DEV=true nix develop -c npm run test:unit -- src/domain/engine/buildNightBeats.test.ts` | ✅ present | ❌ red |
| 01-T1 | 01 | 0 | COACH-04 | — | N/A | unit | same + golden bags | ✅ present | ❌ red |
| TBD | TBD | 0 | COACH-02 | — | N/A | e2e | `CURSOR_DEV=true nix develop -c npm test -- e2e/play-coach.spec.ts` | ❌ W0 | ⬜ pending |
| TBD | TBD | 0 | COACH-03 | — | N/A | e2e | same | ❌ W0 | ⬜ pending |
| 01-T1 | 01 | 0 | GRIM-04 | T-03-01 | Bluff IDs from eligible catalog set only | unit + e2e | `bluffs.test.ts` + play-coach | ✅ unit present | ❌ red |
| TBD | TBD | 0 | GRIM-03 | T-03-02 | Reminder strings from catalog enum | unit + e2e | engine + play-grimoire | ❌ W0 | ⬜ pending |
| TBD | TBD | 0 | handoff | — | N/A | e2e | rewrite `e2e/stubs.spec.ts` `/play` | ⚠️ obsolete | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

*Task IDs filled by planner when PLAN.md waves are assigned.*

---

## Wave 0 Requirements

- [x] `src/domain/engine/buildNightBeats.test.ts` — COACH-01/04 golden cases (Drunk believed, ≥7 info gating, 5 vs 7+, Ravenkeeper/Scarlet Woman) — present, still RED (missing `buildNightBeats` module)
- [x] `src/domain/coach/composePrompt.test.ts` — short/detail keys resolve — present, still RED (missing `composePrompt` module)
- [x] `src/domain/grimoire/bluffs.test.ts` — eligible pool + selection constraints — present, still RED (missing `eligibleBluffs` module)
- [ ] `e2e/play-coach.spec.ts` — Night ready → first night → Next → expand → Demon bluffs (7p)
- [ ] `e2e/play-grimoire.spec.ts` — dead toggle + reminder place/clear + other night bridge
- [ ] Rewrite `e2e/stubs.spec.ts` `/play` stub assertions
- [ ] Update `e2e/setup-record.spec.ts` — expect Start first night CTA (invert “no play link”)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Phone-thumb coach readability at table | COACH-02 | Lighting / real device | On a phone-width viewport, confirm short prompt + Next are reachable one-handed without scrolling past the CTA |
| Spy / shoulder-surf privacy comfort | COACH-04 | Deferred UI polish unless UI-SPEC requires | Confirm Spy coach copy warns ST; dedicated obscure view deferred |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s (unit)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
