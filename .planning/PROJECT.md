# Blood on the Clocktower — Storyteller Copilot

## What This Is

A phone-first offline PWA co-pilot for **Blood on the Clocktower** Storytellers. A human still runs the table and talks to players; the app walks setup (script → roster → difficulty → legal bag → deal → role recording), then coaches First Night and Other Nights beat-by-beat with short prompts, expandable detail, a live grimoire, and Demon bluffs.

## Core Value

A new Storyteller can run a complete Trouble Brewing game without a paper night sheet — always knowing what to do next and what to say.

## Current State

**Shipped:** v1.0 MVP (2026-07-16) — installable phone PWA, TB catalog, setup wizard → bag → record, next-beat night coach + live grimoire.

**Stack:** React 19 + Vite 8 + TypeScript + Tailwind 4 + Zustand/idb-keyval + Zod + vite-plugin-pwa + Playwright + Vitest.

**Demo:** https://nerds-odd-e.github.io/blood-on-the-clocktower-master/

**Closeout:** override_closeout — Phase 1 human UAT (6 scenarios) deferred; see STATE.md Deferred Items.

## Next Milestone Goals

Candidates for v1.1 / v2 (not committed):

- Day phase (nominations, votes, executions)
- Info-role assist suggestions (Empath, Washerwoman, Drunk/poison false info)
- Bad Moon Rising / Sects & Violets packs
- Close Phase 1 deferred visual UAT + store scrub on roster edits (code-review debt)

Start next cycle with `/gsd-new-milestone`.

## Requirements

### Validated

- ✓ Phone-first offline PWA with Trouble Brewing catalog — v1.0
- ✓ Setup wizard: script → players → difficulty → bag → deal → record — v1.0
- ✓ Legal TB bag from count + difficulty (+ optional profiles) — v1.0
- ✓ Soft composition gate before Night ready — v1.0
- ✓ Next-beat First/Other night coach with expand + sticky Next — v1.0
- ✓ Live grimoire: alive/dead, reminders, Demon bluffs, ST truth — v1.0

### Active

_(none — define in `/gsd-new-milestone`)_

### Out of Scope

- AI speaking directly to players / replacing the human Storyteller — co-pilot, not remote narrator
- Auto-assigning characters to specific players — deal stays random
- Online Town Square / live player session — different product
- Discord bots — irrelevant to physical-table coach
- Dense grimoire-as-home dashboard — conflicts with wizard → next-beat UX
- Official BotC token art / App Store without TPI approval — IP / CCC policy risk
- Scripts beyond Trouble Brewing in v1 — proven coach loop first (now shipped; expansion is next-milestone work)

## Context

Shipped ~5.2k LOC under `src/` (TypeScript/TSX). Persistence: Zustand + IndexedDB (`idb-keyval`). Rules content: Zod-validated TB JSON + IP-safe coach-copy. Testing: Playwright E2E (34 green at Phase 3 close) + Vitest domain suites.

Known debt at close: Phase 1 visual UAT unfinished; play fields may not scrub when roster/assignments change after night starts (Phase 3 code review).

## Constraints

- **Script (v1 shipped):** Trouble Brewing only
- **Device:** Phone-first; tablet secondary
- **Role dealing:** Random from bag; Storyteller logs assignments
- **Audience:** New Storytellers — hand-holding over power-user density
- **Build approach:** Vibe coding with GSD harness

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Storyteller co-pilot (not AI-as-Storyteller) | Keep the game humanized | ✓ Good |
| Phone-first offline PWA | ST holds device at a physical table | ✓ Good |
| Trouble Brewing only in v1 | Nail one script end-to-end | ✓ Good |
| Wizard → next-beat coach | New STs need “what next?” | ✓ Good |
| Difficulty as start-of-game UI control | Explicit control over hardness | ✓ Good |
| Profiles optional; tune bag difficulty only | Bag remains random | ✓ Good |
| Short prompts + tap for detail | Friendly without blocking depth | ✓ Good |
| Soft confirm on incomplete Demon bluffs | Don't hard-block a live table | ✓ Good |
| Playwright-first + colocated Vitest for domain | Table-critical paths need E2E | ✓ Good |
| IP-safe paraphrased coach-copy | Avoid shipping official night sheet text | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-16 after v1.0 MVP milestone*
