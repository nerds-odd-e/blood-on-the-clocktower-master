---
phase: 1
slug: phone-shell-tb-catalog
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-16
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest `^4.1.10` + jsdom (Wave 0 install) |
| **Config file** | none yet — Wave 0: `vitest.config.ts` |
| **Quick run command** | `npm test -- --run` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --run`
- **After every plan wave:** Run `npm test -- --run` + `npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green + manual offline preview
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-W0-01 | 00 | 0 | PLAT-01 / PLAT-02 | — | N/A | infra | `npm test -- --run` | ❌ W0 | ⬜ pending |
| 01-XX-01 | TBD | 1 | PLAT-01 | — | PhoneShell safe-area / no overflow-x | unit / component | `npm test -- --run src/app/layout` | ❌ W0 | ⬜ pending |
| 01-XX-02 | TBD | 1 | PLAT-02 | — | PWA navigateFallback + autoUpdate | unit | `npm test -- --run src/app/pwa` | ❌ W0 | ⬜ pending |
| 01-XX-03 | TBD | 1 | Catalog | — | Zod TB roles: 22 roles; teams 13/4/4/1 | unit | `npm test -- --run src/domain/script` | ❌ W0 | ⬜ pending |
| 01-XX-04 | TBD | 1 | Catalog | — | Setup chart 5–15; counts sum to playerCount | unit | `npm test -- --run src/domain/script` | ❌ W0 | ⬜ pending |
| 01-XX-05 | TBD | 1 | Catalog | — | First-night ordinal order matches golden list | unit | `npm test -- --run src/domain/script` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

*Task IDs refined by planner when PLAN.md files are written.*

---

## Wave 0 Requirements

- [ ] Scaffold Vite react-ts app + package scripts (`test`, `build`, `preview`)
- [ ] `vitest.config.ts` with jsdom environment
- [ ] `src/domain/script/*.test.ts` — Zod catalog + setup chart stubs
- [ ] Official setup-chart verification artifact (screenshot/notes) before locking golden JSON
- [ ] PWA icons (original, not official BotC art)
- [ ] Optional: config unit test that `vite.config` PWA options include `navigateFallback`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Offline reload after first load | PLAT-02 | Service worker / Cache Storage behavior needs DevTools Offline | After `npm run build && npm run preview`, load app online once, DevTools → Network → Offline, reload; app still usable with no account |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
