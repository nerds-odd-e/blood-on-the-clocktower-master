---
status: complete
slug: home-page-start-over
quick_id: 260716-r7m
---

# Quick: Home page Start over

## Goal

Let the Storyteller wipe the persisted setup/play session from the home page and begin again from a clean slate.

## Tasks

1. Wire `resetFresh` on home via secondary **Start over** + destructive `ConfirmDialog`, gated on hydration + session progress.
2. Extend `e2e/home.spec.ts` for hide-when-fresh, dismiss keep, and confirm clears roster.
