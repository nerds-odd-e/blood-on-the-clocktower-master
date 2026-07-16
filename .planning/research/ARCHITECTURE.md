# Architecture Research

**Domain:** Blood on the Clocktower Storyteller co-pilot / digital grimoire (phone-first, in-person)
**Researched:** 2026-07-16
**Confidence:** HIGH (component boundaries); MEDIUM (coach UX specifics)

## Standard Architecture

BotC Storyteller tools in the wild (townsquare / clocktower.online, Pocket Grimoire, botc.games, Grimmy, The Grim, tchajed/botc-tools) converge on the same seams: **script catalog → bag/setup → grimoire state → night-order derivation → ST-facing UI**. Online tools add player townsquare sync; **this product deliberately omits that** — it is a private co-pilot, not a remote narrator or shared table app.

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     PRESENTATION (phone-first)                          │
│  ┌──────────────────────┐    ┌──────────────────────────────────────┐   │
│  │   Setup Wizard UI    │    │         Next-Beat Coach UI           │   │
│  │ script→players→diff  │    │ current beat · short prompt · Next   │   │
│  │ →bag→deal→record     │    │ tap → detail · grimoire 1 tap away   │   │
│  └──────────┬───────────┘    └──────────────────┬───────────────────┘   │
│             │                                   │                       │
│             │         ┌─────────────────┐       │                       │
│             └────────►│ Grimoire / Ref  │◄──────┘                       │
│                       │ (secondary pane)│                               │
│                       └────────┬────────┘                               │
├────────────────────────────────┴────────────────────────────────────────┤
│                     DOMAIN SERVICES                                     │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ Bag Builder│  │ Deal/Record│  │ Night/Day    │  │ Coach Prompt    │  │
│  │ difficulty │  │ random deal│  │ Engine       │  │ Composer        │  │
│  │ + profiles │  │ ST assigns │  │ beat queue   │  │ short + detail  │  │
│  └─────┬──────┘  └─────┬──────┘  └──────┬───────┘  └────────┬────────┘  │
│        │               │                │                    │          │
├────────┴───────────────┴────────────────┴────────────────────┴──────────┤
│                     GAME STATE + DATA                                   │
│  ┌──────────────┐  ┌──────────────────┐  ┌────────────────────────────┐ │
│  │ Script Data  │  │ Grimoire State   │  │ Session / Phase State      │ │
│  │ (TB catalog) │  │ players·roles·   │  │ phase·day#·beatIndex·      │ │
│  │ night ords   │  │ reminders·alive  │  │ wizardStep·bagContents     │ │
│  └──────────────┘  └──────────────────┘  └────────────────────────────┘ │
│                              ▲                                          │
│                              │ local persistence (offline-first)        │
└──────────────────────────────┴──────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Script Data** | Immutable TB character catalog: id, team, ability, `firstNight`/`otherNight` ordinals, night reminder text, reminder token names, `setup` flag (Baron/Drunk). Script = curated TB role list (+ optional `_meta`). | Static JSON aligned with official Script Tool / townsquare `roles.json` shape; no custom-script editor in v1 |
| **Bag Builder** | From player count → base TF/Out/Min/Dem counts; apply setup mutations; **difficulty + optional profiles tune which roles enter the bag**, never who draws what | Pure function: `(players, difficulty, profiles, script) → BagPlan` |
| **Deal / Role Recording** | Physical random bag draw stays outside the app; ST logs `player → character` after draw (tap player → pick character) | Wizard step + mutation of grimoire assignments |
| **Grimoire State** | Source of truth for seating order, names, assigned roles (incl. Drunk overlay), alive/dead, reminder tokens, demon bluffs, poison/drunk marks | Client store; circular player list matching physical seating |
| **Night/Day Engine** | Phase state machine; builds ordered **beat queue** from in-play roles + night ordinals + fixed procedural steps (dusk, Minion Info, Demon Info, dawn); day beats (open discussion, nominations, execution) | Deterministic derive-from-state; filter out roles not in play / not waking |
| **Coach Prompt Composer** | Turns current beat into short ST prompt + expandable detail (what to say, hand signals, common pitfalls) | Template library keyed by beat id + context from grimoire |
| **Setup Wizard UI** | Linear phone flow: script (TB) → players/profiles → difficulty → review bag → deal instructions → record roles | Step machine; one job per screen |
| **Next-Beat Coach UI** | Landing play view answers only “what do I do next?”; primary **Next**; grimoire/reference secondary | Progressive disclosure; thumb-zone Next |
| **Persistence** | Survive refresh / pocket mid-game | Local storage / IndexedDB; optional export later |

**Explicit non-components (v1):** player-facing townsquare sync, live voting, AI voice to players, auto-assign roles to named players, multi-script loader, custom script editor.

## Recommended Project Structure

```
src/
├── data/
│   └── scripts/
│       └── trouble-brewing/     # roles, night ordinals, reminders, setup chart
│           ├── roles.json
│           ├── setup-chart.json # playerCount → {townsfolk,outsiders,minions,demons}
│           └── coach-copy.json  # short + detail prompts per beat
├── domain/
│   ├── script/                  # load catalog, resolve role by id
│   ├── bag/                     # BagBuilder: counts, setup mods, difficulty/profile tuning
│   ├── grimoire/                # Player, Reminder, Grimoire aggregate + mutations
│   ├── engine/                  # phase machine, beat queue derivation (night/day)
│   └── coach/                   # PromptComposer (beat → {short, detail})
├── state/
│   ├── session-store.ts         # wizard + play session (single client store)
│   └── persist.ts               # load/save snapshot
├── ui/
│   ├── wizard/                  # setup screens
│   ├── coach/                   # next-beat landing + expand
│   ├── grimoire/                # secondary grimoire / reference
│   └── shared/                  # player chips, role picker, night-safe chrome
└── app/                         # shell: route wizard vs play, phone layout
```

### Structure Rationale

- **`data/scripts/trouble-brewing`:** Keep TB data isolated so later scripts are additive folders, not refactors. Matches ecosystem practice (edition JSON / Script Tool IDs).
- **`domain/*`:** Pure logic with no UI — bag rules and night order are where ST tools get bugs (botc-tools documents complex setup mutations in dedicated `setup` modules). Testable without a device.
- **`state`:** One session store; phone-first apps fail when wizard and coach disagree about “current game.”
- **`ui/wizard` vs `ui/coach`:** PRODUCT decision — wizard then next-beat coach, not a dashboard. Separating folders prevents mixing setup density into play UX.

## Architectural Patterns

### Pattern 1: Script Catalog as Read-Only Data Plane

**What:** Characters and night ordinals live in data files; runtime never hard-codes “Washerwoman wakes before Chef.”
**When to use:** Always for BotC tools — community JSON (`id`, `team`, `firstNight`, `otherNight`, `*Reminder`, `reminders`, `setup`) is the de facto interchange (townsquare, Pocket Grimoire, official Script Tool).
**Trade-offs:** Slight indirection; wins for correctness and future scripts. v1 ships only TB files but keeps the shape.

**Example:**
```typescript
type Role = {
  id: string;
  name: string;
  team: "townsfolk" | "outsider" | "minion" | "demon" | "traveler" | "fabled";
  ability: string;
  firstNight: number;      // 0 = does not wake
  otherNight: number;
  firstNightReminder: string;
  otherNightReminder: string;
  reminders: string[];
  setup: boolean;          // orange leaf — mutates bag
};

// Night beats: sort in-play roles by ordinal, inject fixed steps
function buildFirstNightBeats(grimoire: Grimoire, catalog: Role[]): Beat[] {
  const waking = grimoire.inPlayRoles()
    .map((id) => catalog.find((r) => r.id === id)!)
    .filter((r) => r.firstNight > 0)
    .sort((a, b) => a.firstNight - b.firstNight);
  return [
    { id: "dusk", kind: "procedure" },
    { id: "minion-info", kind: "procedure" },
    { id: "demon-info", kind: "procedure" },
    ...waking.map((r) => ({ id: r.id, kind: "wake" as const })),
    { id: "dawn", kind: "procedure" },
  ];
}
```

### Pattern 2: Bag Builder Separated from Assignment

**What:** Builder outputs a **multiset of role tokens** (and bluff pool). Assignment is a later human step after random physical deal.
**When to use:** Required by PROJECT decisions — difficulty/profiles tune bag composition; deal stays random; AI never picks who is the Imp.
**Trade-offs:** Extra “record roles” step vs tools that shuffle digitally onto seats. Correct for in-person authenticity and product ethics.

**Example:**
```typescript
type BagPlan = {
  tokens: string[];           // role ids in bag (length === playerCount)
  bluffs: string[];           // good roles not in play (demon info)
  composition: { townsfolk: number; outsiders: number; minions: number; demons: number };
  setupNotes: string[];       // e.g. "Baron: +2 Outsiders"
};

// profiles/difficulty adjust token *selection*, never player mapping
function buildBag(input: {
  playerCount: number;
  difficulty: Difficulty;
  profiles: PlayerProfile[];
  script: Script;
}): BagPlan { /* base chart → pick roles → apply Baron/Drunk → validate counts */ }
```

### Pattern 3: Next-Beat Coach over Night Sheet Dump

**What:** Engine exposes an ordered beat list + cursor; UI shows one beat. “Next” advances cursor and may apply ST-confirmed state (death, reminders) via explicit actions — not silent AI narration.
**When to use:** New-ST products (The Grim step night order; Pocket Grimoire prompter). Matches agreed UX: landing = “what next?”
**Trade-offs:** Power users may want full night sheet; solve with one-tap “show full order,” not by making the sheet the home screen.

### Pattern 4: Offline-First Single-Device Session

**What:** All ST state lives on the Storyteller’s phone; no multiplayer backend for v1.
**When to use:** In-person co-pilot (botc-tools, Pocket Grimoire local use). Matches “human ST at table.”
**Trade-offs:** No cross-device backup unless you add export later; avoid building WebSocket townsquare “because townsquare has it.”

## Data Flow

### Setup → Play (request / action flow)

```
ST opens app
    ↓
Wizard: select TB (fixed v1)
    ↓
Wizard: enter players (name required; experience/age/notes optional)
    ↓
Wizard: set difficulty (+ optional profiles influence bag difficulty only)
    ↓
Bag Builder → BagPlan (tokens + bluffs + setup notes)
    ↓
Wizard: show bag summary / deal instructions (physical random draw)
    ↓
Wizard: ST records roles (tap player → pick character) → Grimoire State
    ↓
Engine: build first-night beat queue from grimoire + catalog
    ↓
Coach UI: show beat[0] short prompt
    ↓
ST acts at table → optional grimoire updates → Next → beat[n+1]
    ↓
Dawn → Day engine beats → Night* → … → game end
```

### State Management

```
SessionStore
  ├── meta: scriptId, difficulty, phase, dayNumber, beatIndex, wizardStep
  ├── players: [{ id, name, profile?, seatIndex }]
  ├── bag: BagPlan | null
  ├── grimoire: { assignments, reminders, dead, bluffs, marks }
  └── derived: beatQueue = Engine.derive(session)   // not duplicated as source of truth
        ↑
   Coach UI subscribes to currentBeat = beatQueue[beatIndex]
        ↑
   ST actions → mutations → re-derive when roles/deaths change mid-game
```

**Rule:** Persist the **source** (assignments, phase, cursor), re-derive the beat queue. Do not store a frozen night list that drifts when the Imp star-passes or someone dies before a wake.

### Key Data Flows

1. **Difficulty / profiles → bag only:** Profile aggregates (table experience mix, etc.) bias role selection heuristics (more info roles for new tables, safer evil packages, etc.). They never write `playerId → roleId`.
2. **Physical deal → grimoire:** App does not deal; ST observation fills assignments. Coach must not start night until assignments are complete (or explicitly allow “partial” only if you accept incomplete wake lists — prefer gate).
3. **Grimoire → engine → coach:** In-play roles + alive flags filter wakes; reminder text comes from catalog; short/detail copy from coach templates with slots (`{{playerName}}`, neighbor hints).
4. **Coach → grimoire (optional writes):** Some beats suggest placing reminders (Poisoner, Monk protected, FT red herring). ST confirms; composer never invents hidden truth the ST didn’t enter.

## Build Order (Roadmap Dependencies)

Suggested phase order from dependency graph:

| Order | Component | Depends on | Rationale |
|-------|-----------|------------|-----------|
| 1 | **Script Data (TB)** | — | Unblocks everything; tiny, stable |
| 2 | **Grimoire State model** | Script Data | Need players + role assignment types before UI polish |
| 3 | **Bag Builder** | Script Data, players | Setup chart + Baron/Drunk; difficulty/profile knobs |
| 4 | **Setup Wizard UI** | Bag Builder, Grimoire | End-to-end setup without play coach |
| 5 | **Deal / Role Recording** | Wizard, Grimoire | Completes digital grimoire after physical deal |
| 6 | **Night/Day Engine** | Grimoire + Script Data | Beat queue from real assignments |
| 7 | **Coach Prompt Composer + Next-Beat UI** | Engine | Core value: “what do I do next?” |
| 8 | **Persistence + mid-game grimoire edits** | Session store | Survive phone lock; fix mistakes |
| 9 | *(later)* Multi-script / travelers / fabled | Catalog expansion | Only after TB coach loop proven |

**Phase ordering rationale:** Data → state → setup path → play path. Shipping a beautiful coach before a correct bag/grimoire produces confident wrong advice — the critical failure mode for new Storytellers.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Single table, 1 ST phone | Client-only SPA/PWA; local persistence; static TB JSON — **v1 target** |
| Many scripts / homebrew | Swap catalog modules; keep engine interfaces; still no sync required |
| Optional cloud backup / multi-device ST | Add sync of session snapshot only; still no player clients |
| Online Discord-style play | Different product (townsquare); do not bolt onto co-pilot core |

### Scaling Priorities

1. **First bottleneck:** Correctness of bag + night order under setup mutations and mid-game role changes — fix with domain tests, not servers.
2. **Second bottleneck:** Coach copy quality / progressive disclosure — content + UX iteration, not architectural split.
3. **Non-bottleneck for v1:** Concurrent users, multiplayer sync, CDN for assets.

## Anti-Patterns

### Anti-Pattern 1: Dashboard-First Grimoire as Home Screen

**What people do:** Open to a dense token circle + night sheet (townsquare power-user default).
**Why it's wrong:** New STs freeze; PRODUCT requires next-beat landing.
**Do this instead:** Coach is home during play; grimoire is one tap away.

### Anti-Pattern 2: AI Assigns Seats / Speaks to Players

**What people do:** “Smart” deal or TTS narrator.
**Why it's wrong:** Breaks humanized table; violates co-pilot scope.
**Do this instead:** Bag design + private coaching only; random physical deal; ST voice.

### Anti-Pattern 3: Coupling Profiles to Individual Role Assignment

**What people do:** “Give the new player Empath.”
**Why it's wrong:** Explicitly out of scope; ruins randomness and trust.
**Do this instead:** Profiles adjust bag difficulty / role mix only.

### Anti-Pattern 4: Duplicating Night Order in UI State

**What people do:** Snapshot night list at game start and never recompute.
**Why it's wrong:** Imp star-pass, deaths, and drunk/poison context make the list stale.
**Do this instead:** Derive beats from grimoire + phase; persist cursor carefully.

### Anti-Pattern 5: Building Custom Script Editor Before TB Coach Loop

**What people do:** Generalize to all scripts on day one (script tool clone).
**Why it's wrong:** Multi-script complexity (jinxes, exotic setup) delays proving the coach.
**Do this instead:** Hard-code TB catalog behind a script interface; expand later.

### Anti-Pattern 6: Player Sync “Because Other Apps Have It”

**What people do:** WebRTC/WebSocket townsquare early.
**Why it's wrong:** Wrong product; security/privacy surface; distracts from ST coaching.
**Do this instead:** ST-private device; optional later export.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Official Script Tool JSON | Import shape compatibility (role `id` list + `_meta`) | v1 can ship baked TB; keep IDs compatible |
| Official wiki / almanac copy | Manual curation into `coach-copy.json` | Do not scrape at runtime; respect IP — paraphrase ST coaching, cite game ownership |
| None required for play | — | Offline-first; no auth backend for v1 |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Wizard UI ↔ Bag Builder | Call pure `buildBag`; display result | No UI in bag module |
| Bag Builder ↔ Grimoire | Bag tokens ≠ assignments until Record step | Clear type split: `BagPlan` vs `Assignment[]` |
| Grimoire ↔ Night/Day Engine | Engine reads grimoire snapshot; returns `Beat[]` | Engine does not mutate |
| Engine ↔ Coach Composer | Beat id + context → `{ short, detail }` | Copy can be data-driven |
| Coach UI ↔ Grimoire UI | Navigation only; shared store | Coach never blocked behind grimoire |

## Sources

- [bra1n/townsquare README](https://github.com/bra1n/townsquare) — role JSON schema (`firstNight`/`otherNight`, reminders, setup), script upload, grimoire vs townsquare split (MEDIUM; cross-checked with release.botc.app character schema)
- [Skateside/pocket-grimoire](https://github.com/Skateside/pocket-grimoire) — mobile in-person grimoire flow: edition → select characters → draw → organize tokens; Script Tool JSON (MEDIUM)
- [tchajed/botc-tools FEATURES](https://github.com/tchajed/botc-tools/blob/main/FEATURES.md) — offline tablet ST tools; bag/setup validation; night sheet; local persistence (MEDIUM)
- [BOTC-Links catalog](https://github.com/yoyosource/BOTC-Links) — ecosystem map: botc.games, Grimmy, The Grim (step night order) (MEDIUM)
- [Wiki: Setup](https://wiki.bloodontheclocktower.com/Setup) — official setup sequence: choose characters → setup mutations → bag → draw → place in grimoire (HIGH)
- [Wiki: Trouble Brewing](https://wiki.bloodontheclocktower.com/Trouble_Brewing) — TB roster for v1 catalog (HIGH)
- [TPI / bakery storyteller advice](https://sites.google.com/view/bakerybytheclocktower/advice/tpi-storyteller-advice) — recommended TB bags inform difficulty presets (MEDIUM)
- Project decisions: `.planning/PROJECT.md` — co-pilot, TB-only v1, wizard→coach, random deal + record, profiles tune bag not seats (HIGH)

---
*Architecture research for: BotC Storyteller co-pilot*
*Researched: 2026-07-16*
