# Pitfalls Research

**Domain:** Blood on the Clocktower Storyteller co-pilot / digital grimoire / night-order coaching
**Researched:** 2026-07-16
**Confidence:** HIGH (official wiki + TPI policy primary; community tools secondary)

## Critical Pitfalls

### Pitfall 1: Wrong night order or missing wake steps

**What goes wrong:**
The coach wakes characters out of script order, skips Minion/Demon info + bluffs, wakes dead players who should not act, or leaves Spy/Poisoner in the wrong place. New Storytellers trust the app and deliver broken first nights. Fan night-order widgets sometimes disagree with the official script sheet (e.g. Spy placement).

**Why it happens:**
Hard-coding a generic night list instead of deriving order from the script's first-night / other-nights data; treating "in play" as "always wakes"; forgetting that Drunks wake *as* their fake Townsfolk; not removing night steps when a character dies.

**How to avoid:**
- Encode Trouble Brewing night order from the official script/night sheet as data, not UI copy.
- Filter steps to: in-play roles that wake tonight + always-on setup steps (Minion info, Demon info/bluffs) when player count requires them.
- Drunk: wake on the *believed* Townsfolk's step, not a Drunk step.
- Dead players: drop their night abilities except where rules say otherwise (TB: most do not wake when dead).
- Golden tests: full TB first-night and other-nights sequences for representative bags (with/without Baron, Drunk, Spy, Poisoner).

**Warning signs:**
- Coach shows Spy after all Townsfolk on N1, or Poisoner after info roles.
- "Wake everyone in play" lists without Minion/Demon info cards.
- ST reports "the app told me to skip the Demon bluffs."

**Phase to address:**
Night-order / next-beat coach engine (before any day-phase polish).

---

### Pitfall 2: Broken Drunk / Poisoner / false-info model

**What goes wrong:**
App puts the Drunk *token* in the bag; fails to mark `IS THE DRUNK` in the grimoire; treats Drunk as a known Outsider to the player; auto-forces always-false or always-true info; forgets poison clears at dusk; spends once-per-game abilities while poisoned without tracking; collapses Drunk vs Poisoner into one "broken info" flag.

**Why it happens:**
Modeling characters as simple "role assigned to player" without secret true identity, believed identity, and ability-malfunction state. Automating Storyteller judgment that the rules leave discretionary.

**How to avoid:**
- Setup: Drunk token never enters the bag; a Townsfolk token does; grimoire holds true character = Drunk + believed Townsfolk.
- Runtime state: `poisoned` reminder each night; clear at dusk; Drunk is permanent for the game.
- Coach prompts: "You may give false/unreliable info" — never "the correct answer is X" for malfunctioning abilities.
- Track once-per-game use even when the ability "failed" under poison/drunk.
- Teach new STs the Drunk vs Poisoner *feel* (one consistent broken Townsfolk vs rotating targets) without automating the detective work for players.

**Warning signs:**
- Bag UI offers "Drunk" as a drawable token.
- Coach outputs definitive Empath numbers while player is marked Drunk/Poisoned.
- No dusk step to clear POISONED.

**Phase to address:**
Bag + grimoire state model (setup), then coach prompts (play loop).

---

### Pitfall 3: Illegal or opaque bag construction

**What goes wrong:**
Wrong Townsfolk/Outsider/Minion/Demon counts for player count; Baron without +2 Outsiders replacing Townsfolk; Drunk mishandled; Spy/Scarlet Woman/Baron mixes that violate intended difficulty; "random bag" that ignores script constraints. New STs ship an illegal setup and the whole deduction game is nonsense.

**Why it happens:**
Treating bag as "pick N roles from the script" instead of applying setup modifiers (`[+2 Outsiders]` etc.). Skipping validation because "the ST can fix it."

**How to avoid:**
- Implement bag generation as: base distribution for player count → apply in-bag modifiers (Baron, etc.) → Drunk swap → validate.
- Block "Start game" until bag is legal; show *why* (e.g. "Baron requires two extra Outsiders").
- Difficulty/profiles adjust *which legal bags* are preferred, never illegal ones.
- Keep deal random after bag is fixed; do not assign roles to named players.

**Warning signs:**
- Generator can emit Drunk token in the physical/digital bag list.
- Outsider count unchanged when Baron selected.
- No validator; ST can record impossible grimoires.

**Phase to address:**
Setup wizard / bag generator (first playable vertical slice dependency).

---

### Pitfall 4: Information-token and reminder-token amnesia

**What goes wrong:**
Coach says "show the Demon" without the info card; forgets three not-in-play bluffs; Washerwoman/Librarian/Investigator without pre-placed TOWNSFOLK/WRONG (or equivalent) reminders; Spy shown a messy/unoriented grimoire; Poisoned reminder left overnight.

**Why it happens:**
Building a chatty checklist that describes *who* to wake but not *which physical/digital tokens* to use. Reminder prep is easy to skip in software that only tracks "current step."

**How to avoid:**
- Each night step includes: wake whom, which info/reminder tokens, what to point to, what to record after.
- First-night prep mode: place reminders *before* lights-out (Washerwoman pair, Drunk mark, etc.).
- Spy step: explicit "orient grimoire / privacy mode" before reveal.
- Persist reminders in digital grimoire as first-class state, not notes.

**Warning signs:**
- Prompts like "wake the Washerwoman and tell them something" with no token checklist.
- ST loses track mid-night of who was shown as which character.

**Phase to address:**
Next-beat coach content + grimoire reminder system.

---

### Pitfall 5: Leaking the grimoire (screen-share / table privacy)

**What goes wrong:**
Players see true roles because the ST's phone brightness, notification banners, screen recording, screen share, or "show Spy the grimoire" flow exposes the full state. Online tools historically needed Discord screenshots/cottage screen-share — easy to share the wrong window. Blur-only overlays can still leak under bright rooms or screenshots.

**Why it happens:**
Designing for a solo ST at a desk, not a dark circle of leaning players. Treating Spy reveal as "flip the phone around" without a dedicated safe view.

**How to avoid:**
- Default UI: large type, high contrast, but **no role text visible from across the table** unless in ST-private mode (consider privacy shutter / dim / hold-to-reveal).
- Spy/Widow-style reveal: dedicated player-safe view that shows the grimoire and nothing else (no coach tips about "give false info to Alice").
- Pocket Grimoire lesson: **fully obscure** ST-only chrome when showing the device to players; blur is not enough.
- Disable (or aggressively scrub) previews in notifications; warn if screen recording / AirPlay is active.
- Never put secret state on a secondary "town square" display.

**Warning signs:**
- Demo videos show full role names readable over the ST's shoulder.
- Single view used both for coaching and for Spy reveal.
- Players joke they "saw the Imp on your lock screen."

**Phase to address:**
Phone-first UX / privacy pass (parallel to coach; gate any "show player" features).

---

### Pitfall 6: Over-automating the Storyteller's fun and judgment away

**What goes wrong:**
App chooses all false info, auto-registers Spy, auto-balances who dies, or gives "definitive" jinx/interaction rulings. The ST becomes a button-clicker; games feel sterile; TPI explicitly treats ambiguity and ST judgment as design intent. Community policy rejects tools that "provide definitive rulings on character interactions" and override that philosophy.

**Why it happens:**
Engineer instinct to "solve" uncertainty; AI co-pilot feature creep into player-facing narration or adjudicator role.

**How to avoid:**
- Product stance (already in PROJECT.md): co-pilot, not AI Storyteller; human talks to players.
- For discretionary calls (false info content, Spy registration, borderline interactions): present **options + reminders**, require ST confirm.
- Prefer "What usually works…" coaching over "The rule is…" when the almanac leaves room.
- Do not auto-speak to players; do not assign characters to specific people.

**Warning signs:**
- Features named "auto-resolve night" or "generate all info tokens."
- ST never has to think about whether Empath info should be wrong.
- Scope creep toward competing with the official online app as a full game runner.

**Phase to address:**
Product principles in coach UX (every play-loop phase); revisit at any AI-assist expansion.

---

### Pitfall 7: Phone UX fails at a dark, standing table

**What goes wrong:**
Tiny tap targets, low-contrast themes, gesture-heavy UI, modals that need two hands, timeouts, or landscape-only layouts. ST fumbles during night, lights phone flashlight in players' eyes, or abandons the app for paper.

**Why it happens:**
Designing like a desktop grimoire (clocktower.online-style density) then "shrinking" to mobile.

**How to avoid:**
- Phone-first: one primary action (**Next**), thumb-zone controls, large wake name, short prompt.
- Progressive disclosure: detail behind tap, not a dashboard home.
- Dark-table mode: dim optional, but keep contrast for the ST; avoid sudden full-brightness flashes.
- Offline-capable session state (venues have bad Wi‑Fi).
- One-handed flow for walking the circle.

**Warning signs:**
- Usability tests need a table and stylus.
- ST looks down for >10 seconds per wake.
- "I'll just use the paper night sheet."

**Phase to address:**
UI shell + next-beat coach (from first interactive prototype).

---

### Pitfall 8: IP / official asset / distribution landmines

**What goes wrong:**
Shipping with official token art, BotC branding that looks official, App Store listing, or a public tool that TPI treats as competing with the official app/script tool. Terms of Use: do not incorporate original visual assets into digital tools for distribution; personal electronic tools are allowed, public distribution of BotC IP tools is not without approval. CCC Policy: no impersonation, no commercialisation, no competing; don't publish BotC apps on app stores; FAQ: ST aids that give definitive interaction rulings won't be approved.

**Why it happens:**
Copying clocktower.online / wiki art "because everyone does"; assuming fan tools are automatically fine.

**How to avoid:**
- v1: original/abstract UI art or only assets explicitly allowed under current CCC + `release.botc.app` resources; display CCC logo if using those assets.
- Do not use purple box token art or trademarks in a way that implies official TPI product.
- Decide distribution model early: private/personal vs seeking TPI approval; do not plan App Store release under current CCC.
- Position as Storyteller **coaching aid**, not a replacement online town square / script tool clone.
- Legal review before any public URL, monetisation, or store submission.

**Warning signs:**
- Repo contains ripped official token PNGs.
- Marketing copy says "official" or uses the Puck logo as app icon.
- Feature parity checklist vs clocktower.online / official app.

**Phase to address:**
Project bootstrap / design system (before public demo); re-check at ship.

---

### Pitfall 9: Grimoire desync after the deal

**What goes wrong:**
Bag is legal, deal is random, but ST mis-taps roles into the app; digital grimoire ≠ physical tokens. Coach then runs the wrong night. New STs don't notice until Demon bluffs are wrong.

**Why it happens:**
Assuming "generate bag" equals "assigned roles"; weak confirmation UX when logging draws.

**How to avoid:**
- Explicit record step: tap player → pick character; confirm counts match bag.
- Sanity checklist: one Demon, correct Minion/Outsider counts, Drunk mark present if Drunk in bag logic.
- Allow easy corrections pre-first-night lock; warn if editing mid-game.

**Warning signs:**
- No "does this match the tokens in front of you?" confirmation.
- Coach wakes a role nobody drew.

**Phase to address:**
Role-recording / digital grimoire phase immediately after bag generation.

---

### Pitfall 10: Expanding past Trouble Brewing before the coach loop is solid

**What goes wrong:**
Custom scripts, BMR/SnV, Travellers/Fabled, and jinx matrices explode state space; night order and bag rules multiply bugs; new-ST promise dilutes.

**Why it happens:**
Existing fan tools chase script-tool compatibility; scope envy.

**How to avoid:**
- Honor PROJECT.md: TB-only until end-to-end coach is proven.
- Any script loader is a later phase with its own legality engine.
- Resist "just import script JSON" until TB golden paths are green.

**Warning signs:**
- Roadmap schedules "all scripts" before first full TB game with a new ST.
- Issues filed about jinxes before Poisoner dusk-clear works.

**Phase to address:**
Milestone boundary after TB coach validation (explicitly out of scope for v1).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hard-coded TB night order in UI strings | Ships fast | Divergence from script data; i18n/script expansion breaks | Only if mirrored by golden-test fixtures from official order |
| Roles as single enum on player | Simple model | Cannot represent Drunk believed-identity or Spy registration | Never for grimoire — need true vs believed vs registers-as |
| Auto-false all Drunk/Poisoned info | Feels "correct" | Removes ST craft; bad pedagogy; fights TPI philosophy | Never — coach suggestions only |
| Using official token art from wiki dumps | Pretty MVP | IP takedown / CCC violation | Never for distributed builds |
| Blur overlay for "privacy" | One CSS filter | Still leaks; screenshots readable | Never for player-facing show modes |
| Server-synced game as default | Feels modern | Privacy + offline failure at venues | Defer; local-first session OK for v1 |
| Full town-square clone | Feature parity with fan tools | Competes with official app; scope bomb | Out of scope for co-pilot |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Official script tool JSON | Treat as license to redistribute full digital BotC | Use for personal TB data modeling; respect CCC / ToU for distribution |
| `release.botc.app` assets | Use without CCC logo / outside policy | Follow CCC; badge community content; don't App Store it |
| Wiki / almanac text | Copy long ability text into a public competing rules app | Short ST coaching paraphrases; link out; avoid definitive jinx oracle |
| clocktower.online patterns | Copy dense desktop grimoire UX to phone | Steal concepts (night order filter), not layout density |
| AI / LLM for rulings | Model invents jinx answers | Constrain to TB coaching copy you authored/tested; no freeform rules authority |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Re-rendering full grimoire every keystroke on phone | Jank during night | Keep coach view minimal; virtualize reference panels | 15+ players + reminders |
| Cloud round-trip per "Next" | Lag in basement venues | Local state machine; optional sync later | Any offline event |
| Huge asset packs (full token art) | Slow load, IP risk | Minimal vector/unknown art | First install on mid phones |

*Scale note:* This product is one ST device per table (≤20 players). Optimize for reliability and privacy, not million-user backends.

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Secrets in screenshots / share sheet | Role leak to group chat | Spy mode without coach chrome; block accidental share where OS allows |
| Public game URLs with grimoire state | Remote leak | Local-first; no world-readable links in v1 |
| Analytics logging role assignments | Privacy incident | Do not log grimoire contents; opt-in anonymized UX metrics only |
| "Spectator mode" without auth | Casual peeking | No spectator of ST device; town displays are public info only |
| Storing games in cleartext cloud | Breach exposes identities + roles | Encrypt or keep on-device for v1 |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Dashboard-first home | New ST freezes ("what do I do?") | Next-beat coach answers only "what next?" |
| Walls of almanac text | Phone paralysis mid-circle | One short prompt; tap for more |
| Tiny role icons only | Mis-taps wrong character at deal | Name + confirmation; undo |
| Forcing ST to generate speech verbatim | Robotic table; breaks immersion | Bullet intent ("Show Demon card → point") not full script unless expanded |
| Bright white UI at 1 a.m. | Night vision wrecked | Dark-table theme; no sudden flashes |
| Hiding bag legality errors | Illegal game, blame on ST | Hard block + plain-language fix |

## "Looks Done But Isn't" Checklist

- [ ] **Night order:** Golden tests match official TB first/other nights including Minion info, Demon info, bluffs, Poisoner, Spy — verify against script sheet, not a fan widget alone
- [ ] **Drunk:** Token not in bag; believed Townsfolk in bag; grimoire mark; wakes on Townsfolk step — verify with a Drunk Empath fixture
- [ ] **Poisoner:** Reminder set on target; clears at dusk; once-per-game spent while poisoned stays spent — verify next-day ability failure
- [ ] **Baron bag:** +2 Outsiders replace Townsfolk; combined with Drunk rules — verify counts for 7–15 players
- [ ] **Info tokens:** Demon/Minion/bluffs and Washerwoman-style reminders prompted explicitly — verify first-night prep mode
- [ ] **Privacy:** Spy show view fully obscures coach tips; shoulder-surf test in a lit room — verify no role leak from notifications
- [ ] **Coach philosophy:** Discretionary info requires ST choice — verify no auto-resolved false info
- [ ] **IP:** No unofficial redistribution of purple-box token art; CCC posture documented — verify asset provenance
- [ ] **Phone:** One-handed Next through a full N1 in a dim room — verify with real device
- [ ] **Deal sync:** Recorded roles must match bag composition before night start — verify blockers

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong night wake | LOW–MEDIUM | Quietly resolve missed ability later or private redo; don't publicly narrate the mistake (community ST practice) |
| Illegal bag discovered after deal | HIGH | Rebuild bag / redeal; or restart — tool should prevent this pre-deal |
| Grimoire desync | MEDIUM | Correction UI + recount; pause night until matched |
| Info leaked to table | HIGH | Often unrecoverable fair game; restart or proceed knowing meta is burned — prevent via privacy modes |
| Auto-false info burned a game | MEDIUM | Own it; adjust future nights; disable automation |
| IP complaint | HIGH | Remove assets; take public build down; contact TPI if distributing |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Illegal bag / Drunk setup | Setup wizard + bag engine | Property tests + manual TB setups (Baron±Drunk) |
| Grimoire desync | Role recording after deal | Count match gate before N1 |
| Night order / wake filters | Next-beat coach engine | Golden N1/Other fixtures |
| Reminder & info tokens | Coach content + grimoire reminders | Checklist audit per TB info role |
| Drunk/Poisoner discretion | Coach prompt design | No auto-answer in malfunction states |
| Over-automation / ST judgment | Product rules in coach UX | Review against CCC "ambiguity" FAQ |
| Privacy / Spy leak | Phone privacy + Spy view | Shoulder-surf + share-sheet tests |
| Dark-table phone UX | UI shell / coach layout | Dim-room device test |
| IP / distribution | Design system + release policy | Asset audit; no store submit without approval |
| Multi-script sprawl | Deferred post-TB milestone | Roadmap gate: TB UAT first |

## Sources

- [Drunk (official wiki)](https://wiki.bloodontheclocktower.com/Drunk) — bag swap, false info, wake-as-Townsfolk
- [Baron (official wiki)](https://wiki.bloodontheclocktower.com/Baron) — +2 Outsiders setup
- [Poisoner (official wiki)](https://wiki.bloodontheclocktower.com/Poisoner) — nightly poison, dusk clear, pretend-ability
- [Storyteller Advice (official wiki)](https://wiki.bloodontheclocktower.com/Storyteller_Advice) — false info as balance tool; don't over-coach players
- [Glossary (official wiki)](https://wiki.bloodontheclocktower.com/Glossary) — Drunk/Poisoned/false info/Storyteller definitions
- [TPI Legal & Terms of Use](https://bloodontheclocktower.com/pages/terms-of-use) — no distributing BotC IP digital tools; no official art in apps
- [TPI Community Created Content Policy](https://bloodontheclocktower.com/pages/community-created-content-policy) — don't impersonate / commercialise / compete; ST aids & definitive rulings FAQ
- [Official release assets note](https://release.botc.app/resources/) — CCC-scoped toolmaker resources
- [Pocket Grimoire](https://github.com/CheddarusFritis/pocket-grimoire) — full obscure vs blur for player-facing device
- [Pocket Grimoire tutorial](https://botc.kvn.pt/files/tutorial.html) — digital ST + night order UX patterns
- [ddbrown30/Grimoire](https://github.com/ddbrown30/Grimoire) — Spy screenshot flows (leak surface)
- [pnkfelix/botc-sat](https://github.com/pnkfelix/botc-sat) — bag legality as a formal problem
- [Bakery by the Clocktower — TPI ST advice](https://sites.google.com/view/bakerybytheclocktower/advice/tpi-storyteller-advice) — recommended TB setups for new STs
- [Clockers Con ST tips panel](https://www.youtube.com/watch?v=TirZjNs3Hlo) — take time at night; mistakes from rushing
- Project context: `.planning/PROJECT.md` (co-pilot, phone-first, TB-only, random deal)

---
*Pitfalls research for: Blood on the Clocktower Storyteller co-pilot*
*Researched: 2026-07-16*
