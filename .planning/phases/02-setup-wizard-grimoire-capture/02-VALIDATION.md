---
phase: 2
slug: setup-wizard-grimoire-capture
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-07-16
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Sourced from `02-RESEARCH.md` ## Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright `^1.61.1` (E2E) + Vitest `^4.1.10` (domain, Wave 0 install) |
| **Config file** | `playwright.config.ts` + `vitest.config.ts` (`node`, `src/**/*.test.ts`) |
| **Quick run command** | `npx vitest run src/domain/bag src/domain/grimoire` |
| **Full suite command** | `npm run test:unit && npm test` |
| **Estimated runtime** | ~90–120 seconds (unit + Playwright preview) |

---

## Sampling Rate

- **After every task commit:** `npx vitest run src/domain/bag src/domain/grimoire` (when touching domain) or targeted Playwright file
- **After every plan wave:** `npm run test:unit && npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** ~120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-02-T2 | 02 | 2 | SETUP-01 | T-02-02 | Unique names + seating 5–15 gate | e2e | `npx playwright test e2e/setup-wizard.spec.ts` | ✅ exists | ✅ green |
| 02-03-T2 | 03 | 3 | SETUP-02 | — | Difficulty default Standard; Easy/Hard selectable | e2e | `npx playwright test e2e/setup-wizard.spec.ts` | ✅ exists | ✅ green |
| 02-02-T2 | 02 | 2 | SETUP-03 | T-02-02 | More → Experience New/Some/Veteran, Age Kid/Teen/Adult, notes persist after returning from Difficulty | e2e | `npx playwright test e2e/setup-wizard.spec.ts` | ✅ exists | ✅ green |
| 02-03-T1 | 03 | 3 | SETUP-04 | T-02-04 | Legal bag for N×difficulty; Baron/Drunk rules | unit | `npx vitest run src/domain/bag` | ✅ exists | ✅ green |
| 02-02-T2 / 02-05-T2 | 02 / 05 | 2 / 5 | SETUP-05 | — | Script → players → difficulty order enforced; Night ready stays on /setup in plan 05 | e2e | `npx playwright test e2e/setup-wizard.spec.ts e2e/setup-record.spec.ts` | ✅ wizard scaffold | ✅ current slice green |
| 02-04-T2 | 04 | 4 | GRIM-01 | T-02-08 | Tap player → pick remaining token; clear restores | e2e | `npx playwright test e2e/setup-record.spec.ts` | ✅ exists | ✅ green |
| 02-05-T2 | 05 | 5 | GRIM-02 | T-02-12 | Mismatch warning; Start anyway → Night ready | e2e | `npx playwright test e2e/setup-record.spec.ts` | ❌ W0 | ⬜ pending |
| 02-01-T2 / 02-02-T2 | 01 / 02 | 1 / 2 | — | — | `/setup` stub copy removed; `/play` still stub | e2e | update `e2e/stubs.spec.ts` | ✅ rewritten | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*Task IDs: `{plan}-{task}` from PLAN.md after revision (5 plans, waves 1–5).*

---

## Wave 0 Requirements

- [x] Install `zustand`, `idb-keyval`, `vitest`; add `test:unit` script
- [x] `vitest.config.ts` with `environment: 'node'`, include `src/**/*.test.ts`
- [x] `src/domain/bag/buildBag.test.ts` — N=5..15 × 3 difficulties; Baron±Drunk fixtures; never `tokens.includes('drunk')`
- [x] `src/domain/grimoire/validateAssignments.test.ts` — match / missing / duplicate
- [x] `e2e/setup-wizard.spec.ts` — RED happy path through five players to Difficulty
- [x] `e2e/setup-record.spec.ts` — assign all + clear restoration (soft gate follows in plan 05)
- [x] Update `e2e/stubs.spec.ts` — `/setup` expects script-step copy; keep `/play` stub

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Shoulder-surf bag privacy at table | SETUP-04 | Physical table context | Confirm bag step is ST-facing only; no “show players” mode |

*All other phase behaviors have automated verification planned above.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
