# Feature Research

**Domain:** Blood on the Clocktower Storyteller co-pilot / digital grimoire / night-order coach
**Researched:** 2026-07-16
**Confidence:** MEDIUM

## Feature Landscape

Mapped against existing ST aids (official night sheets + Almanac, clocktower.online/townsquare, botc.app, Pocket Grimoire, BotC Storyteller iOS, BotC Helper, desktop Grimoire apps, Discord bots) and this project's vision: phone-first co-pilot, wizard → next-beat coach, Trouble Brewing only, human Storyteller remains.

### Table Stakes (Users Expect These)

Features Storytellers treat as baseline once they leave paper. Missing these = “not a real ST tool.”

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Player roster + seating order | Every grim is a circle/seat map; night info depends on neighbors | LOW | Names unique per game; clockwise order must match the table |
| Player-count → team composition | Official setup sheet: Townsfolk/Outsider/Minion/Demon counts by N | LOW | Pocket Grimoire and wiki Setup both surface this table; hardcode TB 5–15 |
| Secret bag construction | ST chooses which tokens go in the bag before random deal | MEDIUM | Includes orange-leaf setup modifiers (Baron +2 Outsiders, Drunk, etc.) |
| Role → player recording after deal | Digital grimoire is useless without assignments | LOW | Project default: tap player → pick character; deal stays random |
| First Night vs Other Nights wake order | Official night sheet is the ST’s primary running aid | LOW | Filter to roles in play; skip dead/inactive as rules require |
| Per-wake action reminder text | Night sheets tell ST what to do/say at each step | MEDIUM | Ben Finney–style reminders used by townsquare / Pocket Grimoire |
| Reminder tokens (poisoned, drunk, dead, protected, etc.) | Physical grim is mostly reminder placement | MEDIUM | At least TB reminder set; ST must place/clear during night |
| Alive / dead / shroud state | Day and night both depend on who can die/vote | LOW | Ghost vote tracking is expected once day phase is in scope |
| Demon bluffs tracking | First-night Demon info + bluffs is core ST bookkeeping | LOW | Three bluff slots standard |
| Script/edition lock (TB for v1) | Tools always declare which script’s order/abilities apply | LOW | Multi-script is table stakes in competitors; we defer but must feel intentional |

### Differentiators (Competitive Advantage)

Where this co-pilot can win vs “another digital grimoire.” Align with Core Value: new ST runs a full TB game knowing what to do next.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Setup wizard (script → players → difficulty/profiles → bag → deal → record) | Competitors dump ST into a blank circle; new STs fail at bag design first | MEDIUM | Encodes Almanac / TPI recommended TB setups + difficulty dial |
| Next-beat coach (one primary “what now?” screen) | Official sheets and townsquare show the whole night list; coach reduces cognitive load at the table | HIGH | Landing view = current wake + short prompt + Next; grim one tap away |
| Progressive disclosure (tap for detail) | BotC Helper reviews: useful prompts without replacing judgment; avoids wall-of-text Almanac | MEDIUM | Default short; expand ability text, edge cases, false-info guidance |
| Difficulty-aware bag suggestions | Profiles/difficulty affect overall setup, not who draws what | MEDIUM | Softer bags for new tables (info-heavy, safer evil); harder bags for veterans |
| Optional player profiles (experience, age band, notes) | Unique vs circle-grim tools; helps ST tailor pace without breaking random deal | LOW | Must not auto-assign roles to people |
| Spoken coach prompts (“what to say / show”) | Night sheets are terse; new STs freeze on delivery | MEDIUM | Coach language, not AI talking to players |
| Smart info-role assist (suggest Empath count, Washerwoman pair, etc.) | BotC Storyteller iOS differentiates here; huge for new STs | HIGH | Suggest + ST confirms; never silent auto-resolve judgment calls |
| Drunk/poisoned false-info suggestions | Official teaching setups emphasize this; easy to forget | HIGH | Surface ST-chosen false option at the wake moment |
| Phone-first one-handed night flow | Pocket Grimoire is closest; most tools are laptop/online | MEDIUM | Large Next, minimal chrome, readable in low light |
| Private offline ST device | BotC Storyteller markets no account/offline; fits physical-table privacy | LOW | No player-facing live session in v1 |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| AI / app speaks to players or replaces the ST | “Fully automated narrator” | Breaks the humanized social game; out of product scope | Co-pilot prompts for the human ST only |
| Assign specific characters to specific players | “Balance the table” / “protect new players” | Violates random bag deal; spoils trust; PROJECT.md forbids | Difficulty/profiles tune the bag, not the draw |
| Full custom-script editor / multi-script automation in v1 | Power users live on Script Tool + townsquare | Explodes night-order, jinxes, and coach content before TB loop is proven | TB-only coach; import later if needed |
| Player-facing Town Square / live online session | clocktower.online / botc.app are the online standard | Different product (remote play + sync + voting UX); dilutes phone ST coach | Stay ST-private; optional export later |
| Discord channel / cottage bots | Online Discord groups need them | Irrelevant to physical-table phone co-pilot | Out of scope |
| Replace physical tokens for players | Phone-only pickup games | Players still need tokens/sheets; BotC Helper reviews say apps shouldn’t pretend to replace the box | Coach + ST grim; physical deal remains |
| Fully auto night resolution (app decides kills/info without ST) | “Just run the night for me” | ST judgment, pacing, and storytelling are the job; over-automation teaches bad habits | Suggest → confirm → log |
| Always-on dense grimoire dashboard as home screen | Power ST preference | New STs get lost; contradicts wizard → next-beat UX | Coach home; grim secondary |
| Travelers / Fabled / experimental overlays in v1 | Complete Base 3 parity | Extra night-order and social rules before TB mastery | Defer until TB coach is validated |

## Feature Dependencies

```
Player roster + seating
    └──requires──> Team composition by player count
                       └──requires──> Bag construction (+ setup modifiers)
                                          └──requires──> Role recording (digital grim)
                                                             ├──requires──> Reminder tokens + alive/dead
                                                             └──requires──> Night order (First / Other)
                                                                                    └──requires──> Next-beat coach
                                                                                           └──enhances──> Progressive disclosure
                                                                                           └──enhances──> Spoken prompts
                                                                                           └──enhances──> Smart info assist

Difficulty control ──enhances──> Bag construction
Player profiles ──enhances──> Difficulty / bag construction
Demon bluffs ──enhances──> First-night coach steps
Game action log ──enhances──> Smart info assist + dispute recall

Next-beat coach ──conflicts──> Dense grim-as-home dashboard
Role auto-assignment ──conflicts──> Random bag deal
AI-to-players narrator ──conflicts──> Human ST co-pilot
Online Town Square ──conflicts──> Phone-first private ST scope (v1)
```

### Dependency Notes

- **Coach requires grim + night order:** “What next?” is meaningless without who is which role and which wakes remain.
- **Bag requires roster + composition:** You cannot suggest tokens until N and team counts exist; orange-leaf roles mutate counts after initial pick.
- **Smart info assist requires live reminders:** Empath/Washerwoman answers depend on poisoned/drunk/dead state.
- **Coach conflicts with grim-first UX:** Competitors optimize for power users staring at a circle; this product optimizes for new STs holding a phone between wakes.
- **Auto-assign conflicts with random deal:** Any “give Alice the Empath” feature fights the product’s fairness rule.

## MVP Definition

### Launch With (v1)

Minimum to validate: a new ST runs one TB game without a paper night sheet.

- [ ] Setup wizard through bag generation (TB, player count, difficulty) — essential; bag design is where new STs stall
- [ ] Record roles into digital grim after random deal — essential; enables all night coaching
- [ ] First/Other night next-beat coach with short prompts + Next — core value proposition
- [ ] Tap-for-detail ability / procedure text — progressive disclosure without Almanac reading mid-game
- [ ] Core reminder tokens + dead state for roles in play — bookkeeping baseline
- [ ] Demon bluffs + first-night Demon/Minion info steps — TB night 1 is incomplete without them

### Add After Validation (v1.x)

- [ ] Player profiles influencing difficulty — trigger: wizard feels thin without table context
- [ ] Smart info-role suggestions (ST confirms) — trigger: STs still freeze on Empath/Washerwoman math
- [ ] False-info suggestions when drunk/poisoned — trigger: teaching games produce “I forgot Drunk was false”
- [ ] Day-phase nomination / vote / execution tracking — trigger: night coach works; day is the next failure point
- [ ] Color-coded action log — trigger: disputes / “what did I tell the FT?”
- [ ] Travelers (TB) — trigger: tables regularly >15 or want mid-game joiners

### Future Consideration (v2+)

- [ ] Bad Moon Rising / Sects & Violets coach packs — after TB loop proven
- [ ] Custom script JSON import — power-user demand after Base 3
- [ ] Export/sync to Pocket Grimoire or townsquare — interoperability, not core
- [ ] Optional player-facing role sheet QR — convenience for token-less tables; keep ST private by default
- [ ] Jinx analyzer / edition analyzer — custom-script world only

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Setup wizard + bag generation | HIGH | MEDIUM | P1 |
| Role recording (digital grim) | HIGH | LOW | P1 |
| Next-beat night coach | HIGH | HIGH | P1 |
| Progressive disclosure prompts | HIGH | MEDIUM | P1 |
| Reminder tokens + dead state | HIGH | MEDIUM | P1 |
| Team composition by player count | HIGH | LOW | P1 |
| Demon bluffs / N1 info steps | HIGH | LOW | P1 |
| Difficulty control | HIGH | MEDIUM | P1 |
| Player profiles → difficulty | MEDIUM | LOW | P2 |
| Smart info-role assist | HIGH | HIGH | P2 |
| False-info suggestions | HIGH | HIGH | P2 |
| Day nominations / votes | MEDIUM | MEDIUM | P2 |
| Game action log | MEDIUM | MEDIUM | P2 |
| Offline / no-account privacy | MEDIUM | LOW | P2 |
| Multi-script / custom scripts | MEDIUM | HIGH | P3 |
| Online Town Square / live session | LOW* | HIGH | P3 |
| AI narrator to players | LOW | HIGH | — Anti |
| Auto role-to-player assignment | LOW | LOW | — Anti |

\*Low for this product’s physical-table co-pilot audience; high for online-only groups (served by clocktower.online / botc.app).

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Official night sheet / Almanac | clocktower.online / townsquare | Pocket Grimoire | BotC Storyteller (iOS) | BotC Helper | Our Approach |
|---------|--------------------------------|--------------------------------|-----------------|------------------------|-------------|--------------|
| Night wake order | Paper First/Other lists | Full night sheet + reminders | Swipeable night order | Guided step-through | Night order + info UI | Next-beat coach (one step) |
| Digital grim / seat map | Physical box | Full circle + live session | Phone circle + reminders | Tracks players/states | Explicitly not a grim | ST-private grim, secondary UI |
| Bag / setup help | Setup sheet + recommended bags | Manual token pick | Team-count table + draw | Not primary pitch | N/A | Wizard + difficulty-aware bag |
| Info-role math | ST does it | ST does it | ST does it | Auto-calc engine | Predefined signal options | Suggest + confirm (v1.x) |
| Day phase | Paper process | Live voting | Shroud / ghost vote | Nominations, votes, wins | Limited | Defer to v1.x |
| Custom scripts | Script Tool PDF | JSON import | Custom script | Base 3 (+ overlays) | Official + custom import | TB only until proven |
| Online multiplayer | No | Yes (core) | Soft export/QR | Offline private | Physical table aid | No — anti-scope for v1 |
| New-ST coaching UX | Almanac prose | Power-user density | Reference tool | Strong night guidance | Night communication aid | Wizard → coach + progressive disclosure |

## Sources

- [Blood on the Clocktower Wiki — Setup](https://wiki.bloodontheclocktower.com/Setup) — official bag, seat map, reminder, and recommended TB setups
- [Official Script Tool (wiki)](https://wiki.bloodontheclocktower.com/Script_Tool) — custom scripts + generated night sheets
- [Trouble Brewing product page](https://bloodontheclocktower.com/pages/trouble-brewing) — night sheet in the box; TB as teaching script
- [clocktower.online / bra1n/townsquare](https://github.com/bra1n/townsquare) — virtual grim, night reminders, live voting, custom JSON
- [Pocket Grimoire](https://www.pocketgrimoire.co.uk/en_GB/) — phone grim, team counts, night order, bluffs, jinxes, ST notes
- [botc.app resources / About](https://release.botc.app/resources/) — online grim, nightsheet.json, Spy/Widow grim signals
- [BotC Storyteller App Store](https://apps.apple.com/us/app/botc-storyteller/id6762565903) — guided night, info engine, day phase, offline
- [BotC Helper](https://botc-helper.andro.io/) — night-order + info communication; does not replace physical grim
- [Bakery by the Clocktower — TPI ST advice](https://sites.google.com/view/bakerybytheclocktower/advice/tpi-storyteller-advice) — recommended Base 3 bags for new STs
- [BotC Tracker — NightOrder](https://botc-tracker.com/nightorder/) — interactive night-order reference
- Discord bots (e.g. lilserf/bot-on-the-clocktower) — online phase/channel management; out of physical-table scope
- Project context: `.planning/PROJECT.md` (co-pilot, TB-only, wizard → next-beat, random deal)

**Confidence notes:** Competitor feature claims cross-checked across product pages, READMEs, and wiki (MEDIUM). Exact BotC Helper App Store review wording and Almanac page-level bag lists not re-fetched from paid PDFs — treat bag-difficulty recipes as needing phase-level research against Almanac text.

---
*Feature research for: Blood on the Clocktower Storyteller co-pilot*
*Researched: 2026-07-16*
