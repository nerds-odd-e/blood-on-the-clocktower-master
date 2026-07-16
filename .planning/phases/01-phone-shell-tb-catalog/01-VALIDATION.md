---
phase: 1
slug: phone-shell-tb-catalog
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-16
updated: 2026-07-16
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> **CONTEXT lock (D-05–D-08):** Playwright E2E only — no Vitest / jsdom / Testing Library gates in Phase 1.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (`@playwright/test`) — real app + real TB JSON, no mocks |
| **Config file** | `playwright.config.ts` (created in plan `01-01`) |
| **Quick run command** | `nix-shell -p nodejs --run 'npx playwright test'` |
| **Full suite command** | `nix-shell -p nodejs --run 'npm run build && npx playwright test'` |
| **Estimated runtime** | ~60–90 seconds (includes preview webServer) |
| **Accepted latency** | Full suite 60–90s is **accepted** under CONTEXT D-05–D-07 Playwright-only lock — do not reintroduce a unit-test runner to chase &lt;30s feedback |

---

## Sampling Rate

- **After every task commit:** `nix-shell -p nodejs --run 'npx playwright test'` (or the plan task's narrower spec list)
- **After every plan wave:** `nix-shell -p nodejs --run 'npm run build && npx playwright test'`
- **Before `/gsd-verify-work`:** Full Playwright suite green; optional DevTools offline as supplement only
- **Max feedback latency:** ~90 seconds (PWA preview + SW) — accepted for this phase (see Accepted latency above)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | PLAT-01 / PLAT-02 | T-01-SC | Playwright infra + RED smoke (Playwright-only; ban unit-test runner) | e2e (RED) | `nix-shell -p nodejs --run 'npx playwright test e2e/home.spec.ts e2e/stubs.spec.ts'; exit_code=$?; test "$exit_code" -ne 0'` | ✅ | ❌ red |
| 01-01-02 | 01 | 1 | PLAT-01 / PLAT-02 | T-01-SC | create-vite scaffold builds; smoke remains RED | build + e2e (RED) | `nix-shell -p nodejs --run 'npm run build && (npx playwright test e2e/home.spec.ts e2e/stubs.spec.ts; exit_code=$?; test "$exit_code" -ne 0)'` | ✅ | ❌ red |
| 01-02-01 | 02 | 2 | PLAT-01 | T-01-01 | Tailwind tokens + PhoneShell + viewport | build | `nix-shell -p nodejs --run 'npm run build'` | ❌ until 01-02 | ⬜ pending |
| 01-02-02 | 02 | 2 | PLAT-01 | T-01-01 | Routes + stubs + ScriptHome composition | build + ripgrep | `nix-shell -p nodejs ripgrep --run 'npm run build && ! rg -q "dangerouslySetInnerHTML" src --glob "*.tsx"'` | ❌ until 01-02 | ⬜ pending |
| 01-03-01 | 03 | 3 | Catalog | T-01-02 | TB JSON + Zod loadCatalog + 13/4/4/1 | build + ripgrep | See plan 01-03 Task 1 `<automated>` | ❌ until 01-03 | ⬜ pending |
| 01-03-02 | 03 | 3 | PLAT-02 / Catalog | T-01-01 T-01-06 | ScriptHome catalog + PWA + smoke GREEN | e2e + build | `nix-shell -p nodejs --run 'npm run build && npx playwright test e2e/home.spec.ts e2e/stubs.spec.ts'` | ❌ until 01-03 | ⬜ pending |
| 01-04-01 | 04 | 4 | Catalog | T-01-08 | Setup chart 5–15 + Zod sum + team 13/4/4/1 | build + ripgrep | See plan 01-04 Task 1 `<automated>` | ❌ until 01-04 | ⬜ pending |
| 01-04-02 | 04 | 4 | Catalog | T-01-07 | Catalog facts via UI (no JSON mocks) | e2e | `nix-shell -p nodejs --run 'npx playwright test e2e/catalog.spec.ts'` | ❌ until 01-04 | ⬜ pending |
| 01-05-01 | 05 | 5 | PLAT-01 / PLAT-02 | T-01-10 T-01-11 | Offline reload + viewport no horizontal scroll | e2e | `nix-shell -p nodejs --run 'npm run build && npx playwright test e2e/offline.spec.ts'` | ❌ until 01-05 | ⬜ pending |
| 01-05-02 | 05 | 5 | PLAT-01 / PLAT-02 | T-01-SC | VALIDATION status sync; Playwright-only package.json | e2e + node | `nix-shell -p nodejs --run 'npx playwright test'` | ❌ until 01-05 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 / Wave 1 Requirements (Playwright-first)

- [x] `playwright.config.ts` with `testDir: e2e`, preview `webServer` on 4173
- [x] `e2e/home.spec.ts` + `e2e/stubs.spec.ts` (RED in 01-01, GREEN in 01-03)
- [x] Vite react-ts scaffold + scripts `dev`, `build`, `preview`, `test:e2e`
- [ ] PWA icons (original / CCC-safe — not official BotC art)
- [ ] Setup-chart locked to RESEARCH table; source note in `loadCatalog.ts` header
- [x] No Vitest / jsdom / `@testing-library/react` in `package.json` (D-05 D-07) — ban prose in this file may name that runner; absence is enforced via `package.json` dependency check, not `grep -c Vitest == 0` on this document

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Calm Offline ready chip + long-copy wrap | PLAT-01 / D-01 | Visual hierarchy / wrap backstops | At 390×844 after preview: chip is meta not a second primary; display/supporting copy wraps (UI-SPEC backstops) |
| DevTools offline (optional supplement) | PLAT-02 | Human SW/Cache Storage inspection | After `npm run build && npm run preview`, load once online, DevTools → Offline, reload — primary gate remains `e2e/offline.spec.ts` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (Playwright or build+ripgrep/node)
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 1 Playwright config + RED specs exist before green shell/catalog plans
- [ ] No Vitest Wave 0 gates (unit-test runner absent from package.json)
- [ ] No watch-mode flags
- [ ] Feedback latency &lt; 90s (60–90s full suite accepted under D-05–D-07)
- [ ] `nyquist_compliant: true` set in frontmatter after full suite green (plan 01-05)

**Approval:** pending (Playwright-retargeted 2026-07-16 per D-05–D-08; plan map revised to 5 plans)
