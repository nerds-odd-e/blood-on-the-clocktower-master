# Project Research Summary

**Project:** Blood on the Clocktower — Storyteller Copilot
**Domain:** Phone-first Storyteller co-pilot / digital grimoire / night-order coach (private offline PWA)
**Researched:** 2026-07-16
**Confidence:** HIGH

## Executive Summary

This is a **private, phone-first Storyteller co-pilot** for Blood on the Clocktower — not a multiplayer town square and not an AI narrator. Experts in this niche (Pocket Grimoire, townsquare, botc-tools, BotC Storyteller iOS) converge on the same seams: script catalog → bag/setup → grimoire → night-order derivation → ST UI. This product differentiates by optimizing for **new Storytellers**: a setup wizard into a **next-beat coach** (“what do I do next?”) with progressive disclosure, Trouble Brewing only until that loop is proven.

**Recommended approach:** Vite + React 19 SPA/PWA with Zustand + IndexedDB persistence, TB rules bundled as client data, pure domain modules (Bag Builder, Grimoire, Night Engine, Coach Composer) tested independently of UI. Ship data → state → setup path → play path. Difficulty and optional profiles tune **which legal bags** are preferred; the physical deal stays random and the ST records assignments. Coach suggests; ST confirms — never auto-resolve judgment or speak to players.

**Key risks:** wrong night order / Drunk-Poisoner modeling, illegal bags, grimoire desync after deal, table privacy leaks (Spy show), over-automation that fights TPI philosophy, and IP/distribution landmines (no official token art, no App Store under current CCC). Mitigate with official-sheet golden tests, bag validators that block illegal setups, count-match gates before night one, dedicated Spy-safe views, suggest-and-confirm coach UX, and original/CCC-safe assets from day one.

## Key Findings

### Recommended Stack

Ship a **static Vite SPA installable as a PWA** — no Node backend, no WebSockets. Align with create-vite `react-ts`, add Tailwind 4 Vite plugin and `vite-plugin-pwa` (`generateSW`, SPA `navigateFallback`). Live session in Zustand with `persist` → IndexedDB via `idb-keyval`; Dexie only when profile/history queries become real. Zod validates setup and persisted blobs; Vitest covers bag/night-order/coach step machine first.

Details: [STACK.md](./STACK.md)

**Core technologies:**
- **React 19.2 + TypeScript ~6.0 + Vite 8** — official scaffold; static shell caches cleanly for offline table use
- **Tailwind CSS 4 + `@tailwindcss/vite`** — phone-first layout without a design-system tax
- **Zustand 5 + `idb-keyval`** — coherent game-session document + async IndexedDB persist
- **`vite-plugin-pwa` 1.3** — Workbox precache + offline SPA routing
- **Zod 4** — runtime schemas for bag/setup and persisted game JSON
- **React Router 7** — shallow `/` · `/setup` · `/play`; beat cursor stays in Zustand
- **Vitest + Testing Library** — domain correctness over pixel UI

### Expected Features

Table stakes are roster, composition-by-N, legal bag (+ Baron/Drunk), role recording, First/Other night order, wake reminders, alive/dead, Demon bluffs, TB lock. Differentiator is **wizard → next-beat coach**, not another dense circle grim. Defer multi-script, online town square, AI-to-players, and auto seat assignment.

Details: [FEATURES.md](./FEATURES.md)

**Must have (table stakes / P1):**
- Setup wizard + difficulty-aware bag generation — where new STs stall first
- Role recording into digital grimoire after random deal
- Next-beat night coach (short prompt + Next) + tap-for-detail
- Reminder tokens + dead state; Demon bluffs / N1 info steps
- Team composition by player count (TB 5–15)

**Should have (competitive / P2):**
- Player profiles influencing difficulty (not who draws what)
- Smart info-role assist + Drunk/poisoned false-info suggestions (ST confirms)
- Day nomination/vote/execution tracking; color-coded action log
- Offline / no-account privacy (also a stack constraint)

**Defer (v2+):**
- BMR / SnV packs, custom script JSON import, Travelers/Fabled in v1
- Export/sync to Pocket Grimoire or townsquare; player-facing QR sheets
- Online Town Square / Discord bots — different product

### Architecture Approach

Four layers: Presentation (wizard / next-beat coach / secondary grimoire) → Domain services (Bag Builder, Deal/Record, Night/Day Engine, Coach Prompt Composer) → Game state + TB script data → local persistence. **Persist source state; re-derive beat queues** so Imp star-pass and deaths do not stale a frozen night list. Keep TB data as versioned JSON behind a script interface so later editions are additive folders.

Details: [ARCHITECTURE.md](./ARCHITECTURE.md)

**Major components:**
1. **Script Data (TB)** — immutable catalog: roles, night ordinals, reminders, setup chart, coach copy
2. **Bag Builder** — pure `(players, difficulty, profiles, script) → BagPlan`; never player→role
3. **Grimoire State** — seating, assignments (true vs believed for Drunk), reminders, alive/dead, bluffs
4. **Night/Day Engine** — phase machine + beat queue from in-play roles + fixed procedural steps
5. **Coach Prompt Composer + Next-Beat UI** — short + expandable detail; ST confirms writes
6. **Setup Wizard UI** — linear phone flow ending in deal instructions + role recording
7. **Persistence** — IndexedDB session snapshot; app shell via service worker

### Critical Pitfalls

Details: [PITFALLS.md](./PITFALLS.md)

1. **Wrong night order / missing wakes** — derive from official TB sheet data; golden tests for N1/Other with Baron, Drunk, Spy, Poisoner; Drunk wakes as believed Townsfolk
2. **Illegal bag / Drunk mishandling** — base counts → modifiers → Drunk swap → validate; Drunk token never in bag; block Start until legal
3. **Grimoire desync after deal** — explicit record step + composition match gate before night start
4. **Over-automation / judgment theft** — options + confirm; never auto-false Empath or AI voice to players
5. **Privacy + IP** — Spy show fully obscures coach chrome; no purple-box token art; personal/CCC posture before any public URL or store

## Implications for Roadmap

Based on research, suggested phase structure (data → setup → play → polish):

### Phase 1: Project Shell + TB Script Data
**Rationale:** Unblocks every domain module; IP-safe design tokens and PWA shell must exist before UI content ships.
**Delivers:** Vite/React/Tailwind/PWA scaffold; `data/scripts/trouble-brewing/` (roles, setup chart, night ordinals); Zod schemas; phone chrome + dark-table basics; asset/CCC policy noted.
**Addresses:** Offline/privacy foundation; script/edition lock (TB)
**Avoids:** IP/official art landmines; Next.js/SSR; premature multi-script loader

### Phase 2: Grimoire Model + Bag Builder
**Rationale:** Correct bag and Drunk/Baron rules are the first playable correctness gate; coach on a wrong bag is worse than no coach.
**Delivers:** Player/roster types; Bag Builder + legality validator; Drunk believed-identity model; difficulty (+ profile hooks) selecting among legal bags; Vitest property/golden tests for 5–15 + Baron±Drunk.
**Addresses:** Team composition; secret bag construction; difficulty control; profiles-as-bag-tune (API ready)
**Avoids:** Illegal bags; Drunk token in bag; profiles→seat assignment

### Phase 3: Setup Wizard + Role Recording
**Rationale:** Completes digital grimoire after physical deal — coach is meaningless without assignments.
**Delivers:** Wizard steps (TB → players → difficulty/profiles → bag review → deal instructions → tap player→character); composition match gate; pre-N1 correction UX.
**Addresses:** Setup wizard; role recording; optional profiles in UI
**Avoids:** Grimoire desync; auto role-to-player assignment; digital deal as source of truth

### Phase 4: Night Engine + Next-Beat Coach
**Rationale:** Core value — new ST runs N1/Other without a paper night sheet.
**Delivers:** Beat queue derivation; Next-beat UI (short prompt, tap detail, primary Next); reminder/info-token checklists; Demon/Minion info + bluffs; dusk poison clear; suggest-and-confirm only.
**Addresses:** First/Other night coach; progressive disclosure; spoken/coach prompts; core reminders + dead state; Demon bluffs
**Avoids:** Wrong night order; reminder amnesia; dashboard-as-home; auto-resolved false info

### Phase 5: Persistence, Privacy, Mid-Game Grimoire
**Rationale:** Table reality — phone lock, Spy reveal, mid-night corrections.
**Delivers:** Zustand persist → IndexedDB; mid-game reminder/death edits with re-derive; Spy/player-safe obscure view; shoulder-surf/privacy pass; offline installability verified.
**Addresses:** Offline private ST device; phone-first one-handed flow hardening
**Avoids:** Grimoire leak; blur-only Spy mode; cloud sync as default

### Phase 6 (v1.x): Smart Assists + Day Phase
**Rationale:** After TB night coach UAT; do not inflate v1 with judgment engines.
**Delivers:** Empath/Washerwoman-style suggestions (ST confirms); Drunk/poisoned false-info options; day nomination/vote/execution; action log; Travelers if tables need them.
**Addresses:** P2 differentiators from FEATURES.md
**Avoids:** Definitive jinx oracle; multi-script sprawl before TB UAT

### Phase Ordering Rationale

- **Data → bag → grim → coach** matches architecture dependencies and prevents “confident wrong advice.”
- **Wizard and bag before coach UI polish** — bag design is where new STs fail first; night order bugs destroy trust.
- **Persistence/privacy after coach loop exists** — need a real session to persist and a Spy step to privacy-test.
- **Multi-script / online town square stay post-milestone** — FEATURES anti-features and PITFALLS #10.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Bag Builder):** Almanac/TPI recommended TB bags and difficulty recipes — FEATURES noted bag-difficulty needs phase-level Almanac validation
- **Phase 4 (Coach copy):** Exact official night-sheet wording vs paraphrased ST coaching; info-token checklists per TB info role
- **Phase 5 (Privacy UX):** Device-specific Spy/show flows and OS share-sheet constraints
- **Phase 6 (Smart assist):** Discretionary false-info pedagogy vs TPI CCC “no definitive rulings”

Phases with standard patterns (skip research-phase):
- **Phase 1 (Scaffold/PWA):** Well-documented Vite + Tailwind 4 + vite-plugin-pwa
- **Phase 3 (Wizard UI):** Linear step machine + phone forms; established patterns once bag API exists
- **Persistence middleware:** Zustand persist + idb-keyval is documented; only schema versioning needs care

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official Vite/Tailwind/PWA/Zustand docs + npm versions; Next rejected with clear offline rationale |
| Features | MEDIUM | Competitor landscape cross-checked; Almanac bag recipes and some App Store review wording not re-fetched from paid PDFs |
| Architecture | HIGH | Ecosystem seams consistent; component boundaries align with PROJECT.md decisions |
| Pitfalls | HIGH | Official wiki + TPI ToU/CCC primary; community tools secondary |

**Overall confidence:** HIGH

### Gaps to Address

- **Difficulty/profile → bag heuristics:** Exact “softer vs harder” role packages need Almanac/TPI validation in Phase 2 planning — do not invent illegal mixes
- **Coach copy authorship:** Short/detail prompts must be paraphrased ST coaching, not scraped Almanac walls; legal/IP review before public demo
- **Distribution posture:** Confirm private/personal vs seeking TPI approval before any public URL, monetization, or store listing
- **Day-phase scope for v1:** FEATURES puts day in v1.x; confirm with requirements whether a minimal “dawn → open discussion” stub ships with Phase 4
- **Dexie timing:** STACK says Dexie when profiles/history need queries — keep v1 on Zustand+idb-keyval unless profiles demand indexes

## Sources

### Primary (HIGH confidence)
- Official Vite PWA guide — `vite-plugin-pwa` install + Workbox SPA fallback
- Official Tailwind Vite install — `@tailwindcss/vite` + `@import "tailwindcss"`
- [BotC Wiki — Setup](https://wiki.bloodontheclocktower.com/Setup), [Trouble Brewing](https://wiki.bloodontheclocktower.com/Trouble_Brewing), Drunk / Baron / Poisoner / Storyteller Advice
- [TPI Terms of Use](https://bloodontheclocktower.com/pages/terms-of-use) + [CCC Policy](https://bloodontheclocktower.com/pages/community-created-content-policy)
- npm registry (2026-07-16) — package versions in STACK.md
- `.planning/PROJECT.md` — co-pilot, TB-only, wizard→coach, random deal

### Secondary (MEDIUM confidence)
- Context7: `/vitejs/vite`, `/vite-pwa/vite-plugin-pwa`, `/pmndrs/zustand`, Dexie docs
- [bra1n/townsquare](https://github.com/bra1n/townsquare) — role JSON schema, grim vs townsquare
- [Pocket Grimoire](https://www.pocketgrimoire.co.uk/en_GB/) / related repos — phone grim, obscure-vs-blur
- [tchajed/botc-tools](https://github.com/tchajed/botc-tools) — offline ST bag/night patterns
- TPI / bakery Storyteller advice — recommended TB bags for new STs
- Competitor pages: BotC Storyteller iOS, BotC Helper, botc.app resources

### Tertiary (LOW confidence)
- Web “best of 2026” SPA/PWA framing — direction agrees with official PWA constraints; not used as version authority
- Exact BotC Helper App Store review wording / paid Almanac page-level bag lists — validate in phase research

---
*Research completed: 2026-07-16*
*Ready for roadmap: yes*
