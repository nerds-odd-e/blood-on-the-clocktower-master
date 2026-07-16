---
phase: 3
slug: night-coach-live-grimoire
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-07-16
updated: 2026-07-16
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
| 01-T1 | 01 | 0 | COACH-01 | — | N/A | unit | `CURSOR_DEV=true nix develop -c npm run test:unit -- src/domain/engine/buildNightBeats.test.ts` | ✅ present | ✅ green |
| 01-T1 | 01 | 0 | COACH-04 | — | N/A | unit | same + golden bags | ✅ present | ✅ green |
| 01-T2 | 01 | 0 | COACH-02 | — | N/A | e2e | `CURSOR_DEV=true nix develop -c npx playwright test e2e/play-coach.spec.ts` | ✅ present | ✅ green |
| 01-T2 | 01 | 0 | COACH-03 | — | N/A | e2e | same | ✅ present | ✅ green |
| 02-T1 | 02 | 1 | COACH-01 | — | N/A | unit | `buildNightBeats.test.ts` | ✅ present | ✅ green |
| 02-T2 | 02 | 1 | COACH-04 | — | N/A | unit + e2e | engine + Start first night handoff | ✅ present | ✅ green |
| 03-T1 | 03 | 2 | COACH-02 | — | N/A | unit | `composePrompt.test.ts` | ✅ present | ✅ green |
| 03-T2 | 03 | 2 | COACH-03 | — | N/A | e2e / file | CoachBeatView expand + play-coach | ✅ present | ✅ green |
| 04-T1 | 04 | 3 | GRIM-04 | T-03-01 | Bluff IDs from eligible catalog set only | unit | `bluffs.test.ts` + `setupSessionStore.demonBluffs.test.ts` | ✅ present | ✅ green |
| 04-T2 | 04 | 3 | COACH-04 | T-03-01 | Soft confirm &lt;3 bluffs | e2e | `play-coach.spec.ts` | ✅ present | ✅ green |
| 05-T1 | 05 | 4 | GRIM-03 | T-03-02 | Reminder strings ⊆ role.reminders; dead ids ⊆ seats | unit | `setupSessionStore.grimoire.test.ts` + `buildNightBeats.test.ts` | ✅ present | ✅ green |
| 05-T2 | 05 | 4 | COACH-01 | T-03-03 | Bridge-only Start other night; no day chrome | e2e | `CURSOR_DEV=true nix develop -c npx playwright test e2e/play-grimoire.spec.ts` | ✅ present | ✅ green |
| 01-T2 | 01 | 0 | handoff | — | N/A | e2e | `e2e/stubs.spec.ts` `/play` + setup-record Start first night | ✅ present | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

*Sampling continuity: every plan 01–05 has automated verify at task commit (unit) and wave/phase gate (Playwright for coach + grimoire).*

---

## Wave 0 Requirements

- [x] `src/domain/engine/buildNightBeats.test.ts` — COACH-01/04 golden cases — **GREEN** (plans 02+)
- [x] `src/domain/coach/composePrompt.test.ts` — short/detail keys resolve — **GREEN** (plan 03)
- [x] `src/domain/grimoire/bluffs.test.ts` — eligible pool + selection constraints — **GREEN** (plan 04)
- [x] `e2e/play-coach.spec.ts` — Night ready → first night → Next → expand → Demon bluffs (7p) — **GREEN** (plan 04)
- [x] `e2e/play-grimoire.spec.ts` — dead toggle + reminder place/clear + other night bridge — **GREEN** (plan 05)
- [x] Rewrite `e2e/stubs.spec.ts` `/play` stub assertions — coach-or-empty contract (no Play stub heading) — **GREEN**
- [x] Update `e2e/setup-record.spec.ts` — expect Start first night CTA — **GREEN** (plan 02)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Phone-thumb coach readability at table | COACH-02 | Lighting / real device | On a phone-width viewport, confirm short prompt + Next are reachable one-handed without scrolling past the CTA |
| Spy / shoulder-surf privacy comfort | COACH-04 | Deferred UI polish unless UI-SPEC requires | Confirm Spy coach copy warns ST; dedicated obscure view deferred |
| Grimoire overflow (15 players + chips) | GRIM-03 | Visual backstop | Confirm vertical scroll without horizontal overflow |
| Long reminder chip wrap | GRIM-03 | Visual backstop | Confirm long reminder strings wrap inside chips |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s (unit)
- [ ] `nyquist_compliant: true` set in frontmatter *(set by validate-phase after full suite)*

**Approval:** pending validate-phase / verify-work
