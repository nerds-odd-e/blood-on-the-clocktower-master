---
status: complete
phase: quick-260716-r7m
plan: 01
subsystem: ui
tags: [home, reset, session, confirm]

requires: []
provides:
  - Home Start over control that wipes persisted session via resetFresh
  - Destructive ConfirmDialog before wipe
affects: [home, setup-session]

tech-stack:
  added: []
  patterns:
    - Reuse ConfirmDialog destructive + existing resetFresh store action

key-files:
  created: []
  modified:
    - src/ui/home/ScriptHome.tsx
    - e2e/home.spec.ts

key-decisions:
  - "Show Start over only when session has progress (players, bag, playStarted, or wizard past script)"
  - "Start setup remains primary CTA; Start over is secondary underline control"

requirements-completed: [QUICK-HOME-START-OVER]

---

# Summary

Home shows **Start over** when a hydrated session has progress. Confirm clears players, bag, roles, and night progress via `resetFresh`. Playwright covers fresh hide, Keep game dismiss, and post-confirm empty roster.
