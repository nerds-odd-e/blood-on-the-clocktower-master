---
status: testing
phase: 02-setup-wizard-grimoire-capture
source: [02-VERIFICATION.md]
started: 2026-07-16T08:50:00Z
updated: 2026-07-16T08:50:00Z
---

## Current Test

number: 1
name: Phone overflow backstops at 390×844
expected: |
  No horizontal scrolling; picker and dialog scroll vertically inside their containers; sticky footer does not cover the last actionable row
awaiting: user response

## Tests

### 1. Phone overflow backstops
expected: At 390×844, enter a very long player name on the roster, open a maximum-size role picker (15 remaining tokens), and open a soft-gate dialog with many validation issues — no horizontal scrolling; picker and dialog scroll vertically; sticky footer does not cover the last actionable row
result: [pending]

### 2. Judgment-tier prohibitions
expected: No HTML injection of names/notes, no official BotC token art, no Vaul/sheet role picker, no quit-before-start dropout re-bag, no shaming/guilt framing; Wave-1 temporal judgment items treated as historical only
result: [pending]

## Summary

total: 2
passed: 0
issues: 0
pending: 2
skipped: 0
blocked: 0

## Gaps
