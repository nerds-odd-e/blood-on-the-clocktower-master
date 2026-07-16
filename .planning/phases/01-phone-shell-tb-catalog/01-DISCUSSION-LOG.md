# Phase 1: Phone Shell & TB Catalog - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-16
**Phase:** 1-phone-shell-tb-catalog
**Areas discussed:** Offline / install cues, Test automation

---

## Offline / install cues

### How should Phase 1 signal offline capability?

| Option | Description | Selected |
|--------|-------------|----------|
| Quiet | No install UI; supporting line only | |
| Status chip | Small “Offline ready” meta on script card; no install button | ✓ |
| Install CTA | Visible Install app / browser install prompt near Start setup | |

**User's choice:** Status chip
**Notes:** Recommended option accepted.

### When should “Offline ready” appear?

| Option | Description | Selected |
|--------|-------------|----------|
| Always after catalog loads | Chip whenever TB data is valid | ✓ (via You decide) |
| Only after SW controlling | Gate on service worker active | |
| You decide | Claude picks simplest | ✓ |

**User's choice:** You decide → always after catalog valid; no SW gating
**Notes:** Claude discretion.

### Live offline UI beyond the chip?

| Option | Description | Selected |
|--------|-------------|----------|
| Static only | No live online/offline banner | ✓ (via You decide) |
| Live banner | Brief “You’re offline” when navigator offline | |
| You decide | Keep Phase 1 simplest | ✓ |

**User's choice:** You decide → static only
**Notes:** Claude discretion.

### Install / Add-to-Home-Screen coaching?

| Option | Description | Selected |
|--------|-------------|----------|
| No coaching | Chip + supporting line; native browser install only | |
| Muted hint | One muted line under card about browser menu | |
| Defer entirely | No install coaching in Phase 1 | ✓ |

**User's choice:** Defer entirely
**Notes:** Captured as deferred idea for later phases.

---

## Test automation

### Primary automation strategy (user-initiated)

| Option | Description | Selected |
|--------|-------------|----------|
| Playwright-heavy E2E + full coverage | Prefer E2E for everything shipped | ✓ (stated) |

**User's choice:** Rely mostly on Playwright end-to-end; prefer full test coverage for everything
**Notes:** Volunteered after offline-cues discussion; folded into CONTEXT.

### Catalog/domain verification approach

| Option | Description | Selected |
|--------|-------------|----------|
| Playwright-only | Assert via UI/app load; no Vitest domain suite in Phase 1 | ✓ |
| E2E primary + thin Vitest | Playwright for flows; Vitest for JSON/schema goldens | |
| You decide | Claude picks | |

**User's choice:** Playwright-only
**Notes:** Explicitly overrides Phase 1 Vitest-first research/validation defaults.

---

## Claude's Discretion

- Offline chip timing (catalog-valid, not SW-gated)
- No live connectivity banner
- Home catalog density / catalog field optionality / night-order stub richness within RESEARCH + UI-SPEC
- Playwright project layout and offline E2E technique
- Scaffold path within RESEARCH recommendation

## Deferred Ideas

- Install / Add-to-Home-Screen coaching
- Vitest domain suites (revisit later if needed)
- Live online/offline HUD
- Phase 2/3 product features
