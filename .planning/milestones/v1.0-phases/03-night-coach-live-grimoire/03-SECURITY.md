---
phase: 03
slug: night-coach-live-grimoire
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: 2026-07-16
---

# Phase 03 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| IndexedDB → session merge | Untrusted persisted JSON crosses into app state | Setup + play session blob (roles, deaths, reminders, bluffs, cursor) |
| UI chip/mutation → store | ST device-local inputs must stay within catalog eligibility | Demon bluff role ids, reminder tokens, dead player ids |
| Catalog/coach-copy → UI text | Static bundled content rendered as text | Short/detail prompts, role labels |
| Player names → coach / grimoire | Untrusted local strings | Display names in wake sub-label and grimoire rows |
| Reminder/death UI → wake derivation | Local mutations affecting night queue | deadPlayerIds, diedTonightIds, reminders |
| Test author → CI | Specs must not embed secrets or privileged persistence bypass | E2E fixtures / Playwright helpers |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-03-01 | Tampering | setDemonBluffs / hydrate | medium | mitigate | `eligibleBluffRoleIds` filter on mutate; Zod `demonBluffs` + `assertDemonBluffEligibility` on restore → `hydrationError` | closed |
| T-03-02 | Tampering | setupSessionStore merge / reminders / deadPlayerIds | medium | mitigate | `PersistedSetupSessionSchema` v2 + `assertSetupSessionSemantics` (reminder ⊆ catalog role.reminders; life ids ⊆ seated); fail-closed fresh session | closed |
| T-03-03 | Spoofing | NightBridgeView / PlayScreen | medium | mitigate | Bridge CTA `Start other night` only; no nomination/vote/execution chrome in play UI | closed |
| T-03-04 | Tampering / XSS | CoachBeatView text render | medium | mitigate | Player names and prompts as React text children only; no `dangerouslySetInnerHTML` / HTML injection APIs in `src/ui/play` | closed |
| T-03-05 | Information Disclosure | Spy wake / LiveGrimoireView | low | accept | ST-private by default; Spy privacy tip in coach-copy; dedicated shutter deferred | closed |
| T-03-06 | Elevation of Privilege | N/A | low | accept | Single-operator local device; no auth boundary | closed |
| T-03-SC | Tampering | npm installs | high | accept | No new packages in phase 03 plans; reuse Phase 1/2 stack (no Vaul) | closed |

*Status: open · closed · open — below high threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above workflow.security_block_on (`high`) count toward threats_open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

**Note on ID reuse:** Plan `03-01` also labeled an E2E-fixtures accept risk as `T-03-01` (low). The product register above uses `T-03-01` for Demon-bluff tampering from plan `03-04`. The Wave 0 E2E accept is recorded in the Accepted Risks Log as `T-03-01-E2E`.

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| T-03-05 | T-03-05 | Spy sees grimoire at table; coach-copy warns to orient/cover ST chrome; dedicated shutter deferred per UI-SPEC. ST-private grimoire line ships (`Private — Storyteller only.`). | plan 03-03 / 03-05 | 2026-07-16 |
| T-03-06 | T-03-06 | Single-operator local Storyteller device; no multi-user auth boundary in v1. | plan 03-04 | 2026-07-16 |
| T-03-SC | T-03-SC | Phase plans forbid new npm packages; `package.json` has no Vaul/new runtime deps beyond prior stack. Supply-chain risk accepted at plan time. | plans 03-01–05 | 2026-07-16 |
| T-03-01-E2E | plan 03-01 T-03-01 | Wave 0 Playwright specs drive UI only; no privileged persistence bypass helpers. | plan 03-01 | 2026-07-16 |

*Accepted risks do not resurface in future audit runs.*

---

## Verification Evidence (ASVS L1)

| Threat ID | Evidence |
|-----------|----------|
| T-03-01 | `src/domain/grimoire/eligibleBluffs.ts` (`eligibleBluffRoleIds`); `src/state/setupSessionStore.ts` `setDemonBluffs` / `toggleDemonBluff` eligible filter + max 3; `src/state/setupSessionSemantics.ts` `assertDemonBluffEligibility`; hydrate fail-closed via `merge` → `hydrationError` |
| T-03-02 | `PersistedSetupSessionSchema` (`deadPlayerIds`, `reminders`, …) + `version: 2`; `merge` Zod + `assertSetupSessionSemantics`; `assertReminderCatalog` / `assertLifePlayerIds`; `setPlayerReminders` filters to `role.reminders` |
| T-03-03 | `src/ui/play/NightBridgeView.tsx` — `Start other night` only; grep of `src/ui/play` finds no nomination/vote/execution chrome |
| T-03-04 | `src/ui/play/CoachBeatView.tsx` renders `{playerName}`, `{prompt.short}`, `{prompt.detail}` as text children; no `dangerouslySetInnerHTML` under `src/ui/play` |
| T-03-05 | Accepted (see log); supporting copy: `coach-copy.json` `wake:spy` privacy tip; `LiveGrimoireView` privacy line |
| T-03-06 | Accepted (see log) |
| T-03-SC | Accepted (see log); `package.json` dependencies unchanged from Phase 1/2 stack (no Vaul) |

---

## Unregistered Flags

None. SUMMARY `## Threat Flags` entries (03-01, 03-02) reported no new network/auth surfaces; remaining summaries omitted flags or mapped to existing T-03-* ids.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-16 | 7 | 7 | 0 | gsd-security-auditor |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-16
