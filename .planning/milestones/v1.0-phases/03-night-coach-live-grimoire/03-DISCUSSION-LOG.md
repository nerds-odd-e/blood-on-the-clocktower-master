# Phase 3: Night Coach & Live Grimoire - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-16
**Phase:** 3-night-coach-live-grimoire
**Areas discussed:** Coach beat layout, Night flow & transitions, Demon info & bluffs, Live grimoire controls

---

## Coach beat layout

### Primary composition

| Option | Description | Selected |
|--------|-------------|----------|
| Full-screen next-beat | Step + prompt + Next dominate; grimoire one tap away | |
| Beat + compact player strip | Always-visible player strip | |
| You decide | Claude picks from research/UI patterns | ✓ |

**User's choice:** You decide  
**Notes:** Ratified leaning in CONTEXT: full-screen next-beat (ARCHITECTURE).

### Expand detail

| Option | Description | Selected |
|--------|-------------|----------|
| Inline expand | Expand beat card in place | |
| Bottom sheet / drawer | Vaul/sheet for full procedure | |
| You decide | Lightest one-thumb pattern | ✓ |

**User's choice:** You decide  
**Notes:** Prefer inline first.

### Next placement

| Option | Description | Selected |
|--------|-------------|----------|
| Sticky thumb footer | Match Phase 2 wizard | |
| In-card button | Scrolls with content | |
| You decide | | ✓ |

**User's choice:** You decide  
**Notes:** Sticky footer.

### Grimoire access

| Option | Description | Selected |
|--------|-------------|----------|
| Secondary header link | Calm chrome | |
| Footer icon beside Next | Secondary in footer | |
| You decide | Next alone as primary | ✓ |

**User's choice:** You decide  
**Notes:** Secondary chrome; don’t compete with Next.

---

## Night flow & transitions

### Enter play

| Option | Description | Selected |
|--------|-------------|----------|
| Start first night on Night ready | CTA → `/play` into First Night | |
| Open night coach then Begin | Two-step entry | |
| You decide | Clearest one-tap path | ✓ |

**User's choice:** You decide  

### Between nights

| Option | Description | Selected |
|--------|-------------|----------|
| Simple bridge screen | Night complete → Start other night | |
| Immediate loop via Next confirm | End beat mutates into start other night | |
| You decide | Minimal bridge; no fake day UI | ✓ |

**User's choice:** You decide  

### Back / Skip

| Option | Description | Selected |
|--------|-------------|----------|
| Forward-only | | |
| Back one beat | | |
| Back + Skip | | |
| You decide | | ✓ |

**User's choice:** You decide  
**Notes:** Lean filtered queue; light Back if cheap.

### Wake queue

| Option | Description | Selected |
|--------|-------------|----------|
| In-play + procedural beats | | |
| Full sheet with empty skips | | |
| You decide | | ✓ |

**User's choice:** You decide  

---

## Demon info & bluffs

### When Minion/Demon Info appear

| Option | Description | Selected |
|--------|-------------|----------|
| Rules-accurate gating | Omit when not applicable | |
| Always show both | Mark not needed | |
| You decide | | ✓ |

**User's choice:** You decide  

### Recording bluffs

| Option | Description | Selected |
|--------|-------------|----------|
| Required on Demon Info beat | | |
| Optional on Demon Info | | |
| Grimoire-only | | |
| You decide | | ✓ |

**User's choice:** You decide  
**Notes:** Capture on Demon Info; editable later; soft confirm if &lt;3.

### Bluff pool

| Option | Description | Selected |
|--------|-------------|----------|
| Not-in-play TF/Out only | Classic TB | |
| Any not-in-play | | |
| You decide | | ✓ |

**User's choice:** You decide  

### Soft vs hard gate

| Option | Description | Selected |
|--------|-------------|----------|
| Soft confirm | | |
| Hard block | | |
| You decide | | ✓ |

**User's choice:** You decide  

---

## Live grimoire controls

### Grimoire surface

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated panel/screen | | |
| Overlay sheet | | |
| You decide | | ✓ |

**User's choice:** You decide  

### Alive/dead

| Option | Description | Selected |
|--------|-------------|----------|
| Per-row Dead/Alive toggle | | |
| Dedicated Mark dead/alive actions | | |
| You decide | | ✓ |

**User's choice:** You decide  

### Reminder tokens

| Option | Description | Selected |
|--------|-------------|----------|
| Tap player → pick/clear reminders | | |
| Global token tray then tap player | | |
| You decide | | ✓ |

**User's choice:** You decide  

### Private truth display

| Option | Description | Selected |
|--------|-------------|----------|
| Always show ST-private truth | Drunk true + believes cover | |
| Cover-only by default | | |
| You decide | | ✓ |

**User's choice:** You decide  

---

## Claude's Discretion

User answered **You decide** on every concrete option across all four areas. CONTEXT.md records the ratified leanings (ARCHITECTURE + Phase 2 patterns) as D-01–D-16, with remaining implementation details under Claude's Discretion.

## Deferred Ideas

- Day phase (DAY-01/DAY-02)
- Town square / shared view
- Global token-tray UX as a primary v1 path
