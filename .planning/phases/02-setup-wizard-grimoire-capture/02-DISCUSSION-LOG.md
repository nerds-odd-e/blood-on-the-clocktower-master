# Phase 2: Setup Wizard & Grimoire Capture - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-16
**Phase:** 2-setup-wizard-grimoire-capture
**Areas discussed:** Player roster editing, Difficulty & profile influence, Bag review & regenerate, Role recording & night gate

---

## Player roster editing

| Option | Description | Selected |
|--------|-------------|----------|
| Inline list + Add player | One screen; name fields; Add appends | ✓ |
| Add on a separate sheet | Bottom sheet/form then return | |
| You decide | Claude picks | |

**User's choice:** Inline list + Add player
**Notes:** —

| Option | Description | Selected |
|--------|-------------|----------|
| Up/Down buttons | Thumb-friendly reorder | ✓ |
| Drag to reorder | Drag handles | |
| Entry order only | No reorder UI | |

**User's choice:** Up/Down buttons
**Notes:** —

| Option | Description | Selected |
|--------|-------------|----------|
| Soft remove + live uniqueness | Trash + inline dup errors | |
| Confirm before remove; uniqueness on Next | Confirm dialog; validate on Next | ✓ |
| Remove undoable; dups until bag | Immediate remove; late fail | |

**User's choice:** Confirm before remove; uniqueness on Next
**Notes:** —

| Option | Description | Selected |
|--------|-------------|----------|
| Gate 5–15; profiles collapsed | More expands optional fields | ✓ |
| Gate 5–15; profiles always visible | Inline fields every row | |
| Soft count warning; profiles collapsed | Warn only on count | |

**User's choice:** Gate 5–15; profiles collapsed under More
**Notes:** —

---

## Difficulty & profile influence

| Option | Description | Selected |
|--------|-------------|----------|
| Three named levels | Easy / Standard / Hard | ✓ |
| Numeric scale 1–5 | Slider | |
| Binary | Casual vs Challenging | |

**User's choice:** Three named levels
**Notes:** —

| Option | Description | Selected |
|--------|-------------|----------|
| Difficulty master; profiles nudge | Profiles tilt within level | |
| Profiles suggest difficulty | App proposes; ST overrides | |
| Profiles ignored for bag v1 | Collect only; bag = difficulty + count | ✓ |

**User's choice:** Profiles ignored for bag v1
**Notes:** User required this not be forgotten in v2 — profile→bag influence deferred explicitly.

| Option | Description | Selected |
|--------|-------------|----------|
| Simple enums | Exp New/Some/Veteran; Age Kid/Teen/Adult | ✓ |
| Free text only | Notes only | |
| You decide | Claude picks | |

**User's choice:** Simple enums
**Notes:** —

| Option | Description | Selected |
|--------|-------------|----------|
| Default Standard + one-line help | Preselect Standard; short copy | ✓ |
| Default Easy + longer coaching | Gentler default; bullets | |
| No default — force choice | Next until picked | |

**User's choice:** Default Standard + one-line help
**Notes:** —

---

## Bag review & regenerate

| Option | Description | Selected |
|--------|-------------|----------|
| Full private bag list | Names by team | |
| Counts only | Team totals without names | |
| Full list + why-this-bag note | Names + difficulty rationale line | ✓ |

**User's choice:** Full list + why-this-bag note
**Notes:** —

| Option | Description | Selected |
|--------|-------------|----------|
| Regenerate anytime | Unlimited New bag | |
| Regenerate with confirm | New bag after confirm | ✓ (v2) |
| No regenerate | Accept or Back | ✓ (v1) |

**User's choice:** Regenerate with confirm — postponed to v2; v1 has no regenerate
**Notes:** Explicit deferral.

| Option | Description | Selected |
|--------|-------------|----------|
| No manual edits | Generated bag only | ✓ |
| Swap within team | Legal swaps only | |
| Full manual edit | Free edit + validator | |

**User's choice:** No manual edits in v1
**Notes:** —

| Option | Description | Selected |
|--------|-------------|----------|
| Short coaching card | Physical deal instructions + Continue | ✓ |
| Checklist of bag tokens | Coaching + tick list | |
| Skip deal as own step | Tip on recording screen | |

**User's choice:** Short coaching card
**Notes:** —

---

## Role recording & night gate

| Option | Description | Selected |
|--------|-------------|----------|
| Only remaining bag tokens | Assigned leave picker | ✓ |
| Full roster + warn | Any pick; conflict errors | |
| Remaining + team filters | Remaining + team chips | |

**User's choice:** Only remaining bag tokens
**Notes:** —

| Option | Description | Selected |
|--------|-------------|----------|
| Tap to change or clear | Reopen picker; clear returns token | ✓ |
| Clear-only then re-pick | Must clear first | |
| Reset all only | Nuclear clear all | |

**User's choice:** Tap assigned player → change or clear
**Notes:** —

| Option | Description | Selected |
|--------|-------------|----------|
| Disabled main button | Hard disable until legal | |
| Hard stop modal | Tap shows errors | |
| Allow with warning/confirm | Soft gate | ✓ |

**User's choice:** Allow Start night with warning/confirm
**Notes:** User asked about quit-before-start; clarified no quit feature for v1. Soft gate ≠ dropout flow. Clarified CTA = main button.

| Option | Description | Selected |
|--------|-------------|----------|
| Navigate to `/play` | Hand off to play stub | |
| Stay on setup — Night ready | Summary handoff for Phase 3 | ✓ |
| You decide | Claude picks | |

**User's choice:** Stay on setup with Night ready screen
**Notes:** —

---

## Claude's Discretion

- Easy/Standard/Hard bag heuristics (research-validated)
- Copy for why-bag / deal / soft-gate warnings
- Persistence schema timing
- Night ready vs placeholder `/play` link details

## Deferred Ideas

- v2: Profile→bag/difficulty influence (do not forget)
- v2: Bag regenerate with confirm
- Quit-before-start / dropout re-bag flow (not v1)
- Phase 3: night coach from Night ready handoff
