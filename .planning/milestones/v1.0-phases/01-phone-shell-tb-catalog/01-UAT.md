---
status: testing
phase: 01-phone-shell-tb-catalog
source: [01-VERIFICATION.md]
started: 2026-07-16T06:04:02Z
updated: 2026-07-16T06:04:02Z
---

## Current Test

number: 1
name: MVP user-flow walk-through
expected: |
  Storyteller Copilot home with Trouble Brewing Available, Offline ready chip as calm meta, Start setup → Setup stub; later phases have a real shell + catalog
awaiting: user response

## Tests

### 1. MVP user-flow walk-through
expected: Open preview home → see TB card → Start setup → Back to home; optionally hard-reload offline after first load. Usable phone-first home with TB catalog; stubs reachable; offline still works; no account prompt.
result: [pending]

### 2. Calm Offline ready chip + long-copy wrap
expected: At 390×844, Offline ready chip reads as calm meta (not a second primary); display/supporting/stub copy wraps; primary CTA remains Start setup only.
result: [pending]

### 3. Long shell/stub copy wrap backstop
expected: Long shell copy and stub body copy wrap within max-width 40rem without horizontal scroll at 390×844; no meaning lost to clipping.
result: [pending]

### 4. Role roster vertical scroll backstop
expected: On home, role roster scrolls vertically inside the card; document does not gain horizontal scroll at 390×844.
result: [pending]

### 5. Display/supporting copy wrap backstop
expected: Display and supporting lines wrap fully at 390×844; no ellipsis hiding meaning.
result: [pending]

### 6. Stub body wrap backstop
expected: /setup and /play stub headings and body sit inside PhoneShell column without overflow at 390×844.
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0
blocked: 0

## Gaps
