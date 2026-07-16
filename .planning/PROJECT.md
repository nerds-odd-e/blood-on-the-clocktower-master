# Blood on the Clocktower — Storyteller Copilot

## What This Is

A phone-first digital co-pilot for **Blood on the Clocktower** Storytellers. A human still runs the table and talks to players; the app designs the game setup (bag, seating guidance, first-night prep) from script and table inputs, then coaches the Storyteller beat-by-beat through the night and day with short prompts they can expand for detail.

## Core Value

A new Storyteller can run a complete Trouble Brewing game without a paper night sheet — always knowing what to do next and what to say.

## Requirements

### Validated

- [x] Setup wizard: script (TB), players, difficulty, optional player profiles → generate bag — Validated in Phase 2: Setup Wizard & Grimoire Capture
- [x] Storyteller records who drew which role into a digital grimoire after random deal — Validated in Phase 2: Setup Wizard & Grimoire Capture
- [x] Difficulty is configurable in the UI at game start — Validated in Phase 2: Setup Wizard & Grimoire Capture
- [x] Player profiles influence overall setup difficulty (not who gets which role — bag draw stays random) — Validated in Phase 2 (profiles optional; bag from count + difficulty)
- [x] Next-beat coach: current wake/step, short prompt, tap for more detail, primary Next action — Validated in Phase 3: Night Coach & Live Grimoire
- [x] Live grimoire during play: alive/dead, reminders, Demon bluffs, ST-private truth — Validated in Phase 3: Night Coach & Live Grimoire
- [x] First Night → Other Nights bridge without day-phase chrome — Validated in Phase 3: Night Coach & Live Grimoire

### Active

_(none for v1.0 — Phase 1 still has open human UAT debt before milestone seal)_

### Out of Scope

- AI speaking directly to players / replacing the human Storyteller — product is a co-pilot, not a remote AI narrator
- Assigning specific characters to specific players by the AI — deal remains random
- Scripts beyond Trouble Brewing in v1 — TB only until the coach loop is proven
- Full custom-script editor — not needed for TB-first v1

## Context

Blood on the Clocktower requires a Storyteller to design the game and facilitate play. New Storytellers struggle with bag construction, night order, and what information to give when. This tool keeps the social game humanized: players interact with a human Narrator/Storyteller; the app is private coaching and state tracking.

**Agreed UX:**
1. **Setup wizard first** — one step at a time (script → players → difficulty/profiles → bag → deal → record roles)
2. **Next-beat coach during play** — landing view answers only “what do I do next?”; full grimoire/reference one tap away
3. **Progressive disclosure** — simple prompts by default; click/tap to review more detail

**Player setup:**
- Name: mandatory, unique per game
- Experience, age band, freeform notes: optional with sensible defaults

**Platform:** Design for phone; usable on tablet.

## Constraints

- **Script (v1)**: Trouble Brewing only — prove end-to-end coach before expanding
- **Device**: Phone-first layout and interaction; tablet is secondary
- **Role dealing**: Random from bag; Storyteller must log assignments back into the app
- **Audience**: Optimized for new Storytellers (hand-holding over power-user density)
- **Build approach**: Vibe coding with GSD (Get Ship Done) harness

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Storyteller co-pilot (not AI-as-Storyteller) | Keep the game humanized and fun; AI designs + coaches | — Pending |
| Phone-first UI | Storyteller holds device at a physical table | — Pending |
| Trouble Brewing only in v1 | Nail one script end-to-end before multi-script complexity | — Pending |
| Wizard → next-beat coach | New STs need “what next?” not a full dashboard | — Pending |
| Script is an input; bag/seating/first-night designed by app | ST chooses script; app handles the rest of setup | — Pending |
| Difficulty is a start-of-game UI control | Explicit control over how hard the game feels | — Pending |
| Player profiles optional; affect overall difficulty, not who draws what | Bag remains random; profiles tune setup | — Pending |
| Short prompts + tap for detail | Friendly to new STs without blocking deeper help | Phase 3 coach UX |
| Role recording: tap player → pick character (v1 default) | Simplest path to a correct digital grimoire | Phase 2 record step |
| Night queue derived from in-play roles + alive filter | Paper night sheet replacement | Phase 3 buildNightBeats |
| Soft confirm on incomplete Demon bluffs | Don't hard-block a live table | Phase 3 BluffPicker |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-16 — Phase 3 complete (night coach + live grimoire UAT passed)*
