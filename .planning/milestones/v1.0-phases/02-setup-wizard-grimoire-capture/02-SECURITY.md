---
phase: 2
slug: setup-wizard-grimoire-capture
status: verified
threats_open: 0
asvs_level: 1
created: 2026-07-16
---

# Phase 2 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|----------------|
| Device ↔ IndexedDB | Local persist of setup session | Player names, notes, bag, role assignments |
| UI ↔ Zustand store | Wizard steps mutate session | Roster, bag tokens, assignments, persistWriteStatus |
| Storyteller ↔ players | ST-only device; no share mode | Private bag / Drunk truth must not leave device |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-02-SC | Tampering | deps | high | mitigate | Pinned zustand / idb-keyval / vitest | closed |
| T-02-01 | Tampering | hydrate | high | mitigate | Zod safeParse + hydrationError reset | closed |
| T-02-02 | Tampering | notes | medium | mitigate | maxLength 200; no dangerouslySetInnerHTML | closed |
| T-02-03 | Information Disclosure | device | low | accept | Single-operator ST tool; local device | closed |
| T-02-04 | Tampering | bag | high | mitigate | validateBag before return; fail-closed | closed |
| T-02-05 | Elevation of Privilege | bag | medium | mitigate | Chart composition + Imp forced | closed |
| T-02-06 | Information Disclosure | bag UI | low | accept | Privacy line; no share-to-players | closed |
| T-02-07 | Denial of Service | bag | low | mitigate | MAX_BUILD_ATTEMPTS = 5 | closed |
| T-02-08 | Tampering | record | high | mitigate | remainingTokens + assignRole reject | closed |
| T-02-09 | Tampering | grimoire | medium | mitigate | validateAssignments multiset | closed |
| T-02-10 | Information Disclosure | record | low | accept | Roles on ST device only | closed |
| T-02-11 | Repudiation | local | low | accept | No audit server at ASVS L1 | closed |
| T-02-12 | Tampering | start night | high | mitigate | Soft-gate ConfirmDialog + issues list | closed |
| T-02-13 | Spoofing | routing | medium | mitigate | Night ready stays on /setup | closed |
| T-02-14 | Information Disclosure | night ready | low | accept | Counts-only summary | closed |
| T-02-15 | Elevation of Privilege | soft-gate | medium | mitigate | Issues listed before Start anyway | closed |
| T-02-16 | Tampering | hydrate | high | mitigate | assertSetupSessionSemantics | closed |
| T-02-17 | Tampering | persist | high | mitigate | awaitCriticalPersist + Retry | closed |
| T-02-18 | Information Disclosure | night ready | low | accept | ST-only; counts not full bag | closed |
| T-02-19 | Repudiation | persist UI | medium | mitigate | Saved copy only when status saved | closed |
| T-02-20 | Elevation of Privilege | soft-gate | medium | mitigate | validateAssignments before override | closed |

*Status: open · closed · open — below high threshold (non-blocking)*
*Disposition: mitigate · accept · transfer*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-02-03 | T-02-03 | Single-operator ST tool; no accounts; local device (ASVS L1) | plan + audit | 2026-07-16 |
| AR-02-06 | T-02-06 | Privacy line required; no share-to-players mode | plan + audit | 2026-07-16 |
| AR-02-10 | T-02-10 | Roles visible only on ST device | plan + audit | 2026-07-16 |
| AR-02-11 | T-02-11 | Local-only tool; no audit server at ASVS L1 | plan + audit | 2026-07-16 |
| AR-02-14 | T-02-14 | Night ready shows composition counts, not full private bag | plan + audit | 2026-07-16 |
| AR-02-18 | T-02-18 | ST-only local device; summary counts only | plan + audit | 2026-07-16 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-16 | 21 | 21 | 0 | gsd-security-auditor (verify-work post) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-16
