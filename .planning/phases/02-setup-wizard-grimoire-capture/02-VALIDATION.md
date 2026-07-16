---
phase: 2
slug: setup-wizard-grimoire-capture
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
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
| **Config file** | `playwright.config.ts` (exists); `vitest.config.ts` or Vite `test` key — Wave 0 |
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
| TBD | TBD | TBD | SETUP-01 | — | Unique names + seating 5–15 gate | e2e | `npx playwright test e2e/setup-wizard.spec.ts` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | SETUP-02 | — | Difficulty default Standard; Easy/Hard selectable | e2e | `npx playwright test e2e/setup-wizard.spec.ts` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | SETUP-03 | — | More → experience/age/notes persist in session | e2e | `npx playwright test e2e/setup-wizard.spec.ts` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | SETUP-04 | — | Legal bag for N×difficulty; Baron/Drunk rules | unit | `npx vitest run src/domain/bag` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | SETUP-05 | — | Step order enforced (no skip ahead) | e2e | `npx playwright test e2e/setup-wizard.spec.ts` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | GRIM-01 | — | Tap player → pick remaining token; clear restores | e2e | `npx playwright test e2e/setup-record.spec.ts` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | GRIM-02 | — | Mismatch warning; confirm → Night ready | e2e | `npx playwright test e2e/setup-record.spec.ts` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | — | — | `/setup` stub copy removed; `/play` still stub | e2e | update `e2e/stubs.spec.ts` | ✅ exists | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*Task IDs filled by planner when PLAN.md waves are assigned.*

---

## Wave 0 Requirements

- [ ] Install `zustand`, `idb-keyval`, `vitest`; add `test:unit` script
- [ ] `vitest.config.ts` (or vite `test` block) with `environment: 'node'`, include `src/**/*.test.ts`
- [ ] `src/domain/bag/buildBag.test.ts` — N=5..15 × 3 difficulties; Baron±Drunk fixtures; never `tokens.includes('drunk')`
- [ ] `src/domain/grimoire/validateAssignments.test.ts` — match / missing / duplicate
- [ ] `e2e/setup-wizard.spec.ts` — happy path to bag review
- [ ] `e2e/setup-record.spec.ts` — assign all + soft gate
- [ ] Update `e2e/stubs.spec.ts` — `/setup` no longer stub; keep `/play` stub

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
