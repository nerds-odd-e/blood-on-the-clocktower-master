# Requirements: Blood on the Clocktower — Storyteller Copilot

**Defined:** 2026-07-16
**Core Value:** A new Storyteller can run a complete Trouble Brewing game without a paper night sheet — always knowing what to do next and what to say.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Setup

- [ ] **SETUP-01**: Storyteller can select Trouble Brewing and enter unique player names with seating order
- [ ] **SETUP-02**: Storyteller can set game difficulty at the start of a game
- [ ] **SETUP-03**: Storyteller can optionally set experience, age band, and notes per player (sensible defaults when blank)
- [ ] **SETUP-04**: App generates a legal Trouble Brewing bag from player count, difficulty, and optional player profiles
- [ ] **SETUP-05**: Setup wizard walks script → players → difficulty → bag → deal → role recording in order

### Grimoire

- [ ] **GRIM-01**: After a random deal, Storyteller can record who received which role (tap player → pick character)
- [ ] **GRIM-02**: App blocks starting night until recorded roles match the expected team composition
- [ ] **GRIM-03**: Storyteller can mark players alive/dead and place/clear Trouble Brewing reminder tokens
- [ ] **GRIM-04**: Storyteller can record Demon bluffs for the game

### Night Coach

- [ ] **COACH-01**: App derives First Night and Other Nights wake order from roles currently in play
- [ ] **COACH-02**: Next-beat screen shows the current step, a short prompt, and a primary Next action
- [ ] **COACH-03**: Storyteller can tap to expand ability/procedure detail for the current beat
- [ ] **COACH-04**: First-night Demon/Minion information steps appear when those roles are in play

### Platform

- [ ] **PLAT-01**: UI is phone-first and usable on tablet
- [ ] **PLAT-02**: App works offline as a PWA after first load with no account required

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Coaching Assists

- **ASSIST-01**: App suggests info-role answers (e.g. Empath, Washerwoman) for Storyteller confirmation
- **ASSIST-02**: App suggests false-info options when a player is Drunk or poisoned

### Day Phase

- **DAY-01**: Storyteller can track nominations, votes, and executions
- **DAY-02**: App keeps a color-coded action log of information given and deaths

### Script Expansion

- **SCRIPT-01**: Bad Moon Rising and Sects & Violets coach packs
- **SCRIPT-02**: Custom script JSON import
- **SCRIPT-03**: Travelers and Fabled support

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| AI speaking to players / replacing the Storyteller | Product is a co-pilot; keeps the game humanized |
| Auto-assigning characters to specific players | Deal must stay random; profiles tune bag difficulty only |
| Online Town Square / live player session | Different product (remote play); dilutes phone ST coach |
| Discord bots | Irrelevant to physical-table co-pilot |
| Dense grimoire-as-home dashboard | Conflicts with wizard → next-beat UX for new Storytellers |
| Distributing official BotC token art / App Store without TPI approval | IP / CCC policy risk |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SETUP-01 | — | Pending |
| SETUP-02 | — | Pending |
| SETUP-03 | — | Pending |
| SETUP-04 | — | Pending |
| SETUP-05 | — | Pending |
| GRIM-01 | — | Pending |
| GRIM-02 | — | Pending |
| GRIM-03 | — | Pending |
| GRIM-04 | — | Pending |
| COACH-01 | — | Pending |
| COACH-02 | — | Pending |
| COACH-03 | — | Pending |
| COACH-04 | — | Pending |
| PLAT-01 | — | Pending |
| PLAT-02 | — | Pending |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 0
- Unmapped: 15

---
*Requirements defined: 2026-07-16*
*Last updated: 2026-07-16 after requirements approval*
