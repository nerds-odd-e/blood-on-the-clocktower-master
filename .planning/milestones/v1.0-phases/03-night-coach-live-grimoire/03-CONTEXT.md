# Phase 3: Night Coach & Live Grimoire - Context

**Gathered:** 2026-07-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the next-beat night coach so a Storyteller can run First Night and Other Nights without a paper night sheet — current step, short prompt, expand for detail, primary Next — plus live grimoire controls (alive/dead, reminder tokens, Demon bluffs). Wire Night ready → `/play` (replace `PlayStub`). Scope: COACH-01–04, GRIM-03–04. Day-phase nomination/vote tools stay out of scope (DAY-*).

</domain>

<decisions>
## Implementation Decisions

### Coach beat layout
- **D-01:** **Full-screen next-beat** is the play landing — current step, short prompt, and Next dominate. Grimoire is secondary (“one tap away”), not a permanent split with a player strip.
- **D-02:** **Expand detail** uses the lightest one-thumb pattern — prefer **inline expand** on the beat card; introduce a sheet only if content length forces it. Do not add Vaul solely for this.
- **D-03:** Primary **Next** lives in a **sticky thumb footer** (same pattern as Phase 2 wizard sticky CTAs).
- **D-04:** Grimoire access is **secondary chrome** (e.g. header text link) that must not compete with Next’s accent weight.

### Night flow & transitions
- **D-05:** Night ready gains a primary **Start first night** CTA → navigate to `/play` and begin the First Night beat queue immediately (clearest one-tap table path).
- **D-06:** **No day-phase UI** in this phase. Between nights use a **minimal bridge** (“Night complete” → **Start other night**). Do not fake nominations/votes.
- **D-07:** Beat queue is **filtered to in-play roles** (by true role / grimoire truth) **plus required procedural beats** from `procedural-beats.json` (Dusk, Minion Info when applicable, Demon Info when applicable, Dawn). Do not show the full TB sheet with empty “not in play” slots.
- **D-08:** Prefer a queue that rarely needs Skip. Allow a light **Back one beat** if cheap to implement; Skip unused wakes is not a primary feature when filtering is correct.

### Demon info & bluffs
- **D-09:** **Rules-accurate gating** — omit Minion Info / Demon Info when those steps do not apply (e.g. no Minions / no Demon in play); do not always show placeholder “not needed” beats.
- **D-10:** Record Demon bluffs **on the Demon Info beat** (so first-night coaching stays complete); bluffs remain **editable later** on the grimoire.
- **D-11:** Bluff pool = **exactly three characters** that are **not in play** and are **Townsfolk or Outsiders only** (classic TB Demon bluffs — never Minion/Demon, never seated roles).
- **D-12:** Leaving Demon Info with fewer than three bluffs uses a **soft confirm** (warn + allow continue) — matches Phase 2 soft Start night gate, not a hard-only block.

### Live grimoire controls
- **D-13:** Live grimoire is a **dedicated panel/screen** opened from coach secondary chrome (space for tokens); Back returns to the current beat. Prefer this over a thin overlay if reminder UI needs room.
- **D-14:** **Alive/dead** via a simple per-player **Dead / Alive toggle** on the grimoire list.
- **D-15:** Reminder tokens: **tap player → place/clear** from relevant reminder lists (role reminders + clear existing). Global “token tray then tap player” is not required for v1.
- **D-16:** Grimoire always shows **ST-private truth** (e.g. Drunk true role + “believes {cover}”). Do not hide true role behind an expand by default.

### Carried forward (ratified — not re-litigated)
- **D-17:** Phase 2 Night ready handoff is the entry; Phase 3 owns `/play` coach (Phase 2 D-17).
- **D-18:** Soft incomplete recording may still reach Night ready (Phase 2 D-15) — coach/engine must tolerate partial grimoires safely (research: wake list from what’s recorded; don’t invent players).
- **D-19:** Follow Phase 1/2 visual language (`01-UI-SPEC.md`, `02-UI-SPEC.md`) — table-lantern shell, Fraunces + Source Sans 3, 44px targets, sticky primary CTAs.
- **D-20:** Prefer Playwright E2E with real TB data for shipped coach/grimoire flows; domain unit tests for beat-queue derivation are Claude discretion when E2E alone is unsafe.

### Claude's Discretion
- Exact short/detail coach copy templates and paraphrase boundaries (IP-safe; no scraped Almanac dumps).
- Whether Back is shipped in v1 or deferred if it complicates beat-cursor persistence.
- Exact Minion Info player-count / in-play gating details within official TB rules — research must validate.
- Whether “Start other night” bridge is a distinct route state vs end-of-queue beat mutation.
- Persist schema extension for play cursor, dead flags, reminders, bluffs (extend Zustand + idb-keyval session).
- Whether grimoire is `/play` nested view vs query/hash secondary surface — keep shallow RR; coach cursor in store not URL.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase & requirements
- `.planning/ROADMAP.md` — Phase 3 goal, success criteria, COACH-01–04 / GRIM-03–04; UI hint yes
- `.planning/REQUIREMENTS.md` — COACH-01–04, GRIM-03–04; DAY-* out of v1 scope
- `.planning/PROJECT.md` — next-beat coach product decision; grimoire one tap away

### Prior phases
- `.planning/phases/02-setup-wizard-grimoire-capture/02-CONTEXT.md` — Night ready handoff (D-17), soft gate (D-15), session store
- `.planning/phases/02-setup-wizard-grimoire-capture/02-UI-SPEC.md` — sticky footer CTA, touch targets, copy voice
- `.planning/phases/01-phone-shell-tb-catalog/01-UI-SPEC.md` — shell/visual contract
- `.planning/phases/01-phone-shell-tb-catalog/01-CONTEXT.md` — Playwright-first, no mocks

### Stack & architecture research
- `.planning/research/ARCHITECTURE.md` — coach vs grimoire UI split; beat queue from grimoire; PromptComposer short+detail
- `.planning/research/STACK.md` — Zustand + idb-keyval persist
- `.planning/research/PITFALLS.md` — wrong wake order, grimoire desync, IP/copy constraints
- `.planning/research/SUMMARY.md` — night-order / coach seams

### Code integration points
- `src/ui/play/PlayStub.tsx` — replace with coach + grimoire
- `src/ui/setup/steps/NightReadyStep.tsx` — add Start first night CTA → `/play`
- `src/app/routes.tsx` — `/play` route
- `src/state/setupSessionStore.ts` — extend or compose play/grimoire session state
- `src/domain/script/loadCatalog.ts` / `schemas.ts` — `firstNight`/`otherNight`, reminders, reminder text
- `src/data/scripts/trouble-brewing/roles.json` — wake ordinals + reminder strings
- `src/data/scripts/trouble-brewing/procedural-beats.json` — Dusk / Minion Info / Demon Info / Dawn stubs

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PhoneShell` — wrap `/play` coach
- `NightReadyStep` — summary + persist status; needs primary CTA into `/play`
- `PlayStub` — replace with real coach
- `loadCatalog()` + role night ordinals / `firstNightReminder` / `otherNightReminder` / `reminders[]`
- `procedural-beats.json` — first-night procedural stubs ready for coach engine
- `useSetupSessionStore` + idb persist — assignments, bag, players; extend for play cursor / dead / tokens / bluffs
- Confirm dialog pattern from setup (`ConfirmDialog`) — reuse for soft bluff / bridge confirms

### Established Patterns
- Shallow routes (`/`, `/setup`, `/play`); wizard/coach step cursor in Zustand, not URL
- Sticky primary footer CTAs (Phase 2 UI-SPEC)
- Soft confirm gates over hard-only blocks (Phase 2 D-15)
- Playwright E2E against real bundled TB data; Vitest already used for bag/grimoire domain in Phase 2

### Integration Points
- Night ready → `/play` navigation + First Night queue build from recorded assignments
- Domain: new night-order / beat-queue builder + coach prompt composer (ARCHITECTURE)
- Live grimoire mutations must share the same session store the coach reads
- Persist across phone lock for mid-night resume

</code_context>

<specifics>
## Specific Ideas

- User selected **You decide** on every concrete option — decisions above are the ratified leanings from discussion (ARCHITECTURE + Phase 2 patterns). Planner/researcher should treat them as locked unless research finds a hard conflict.
- Product north star remains: landing view answers only “what do I do next?”

</specifics>

<deferred>
## Deferred Ideas

- Full **day phase** (nominations, votes, executions, action log) — DAY-01/DAY-02; v2
- Town square / shared player view — out of product scope
- Global physical-style token tray UX — not required for v1 phone path
- Install coaching, multi-script, travelers — prior deferrals
- Profile→bag influence, bag regenerate — Phase 2 v2 deferrals

</deferred>

---

*Phase: 3-night-coach-live-grimoire*
*Context gathered: 2026-07-16*
