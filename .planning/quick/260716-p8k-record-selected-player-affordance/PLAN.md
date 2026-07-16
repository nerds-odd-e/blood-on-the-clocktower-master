---
status: complete
slug: record-selected-player-affordance
quick_id: 260716-p8k
---

# Quick: Record-step selected player affordance

## Goal

Make the currently selected player visible on Record roles when assigning a character (outline ring + named RolePicker heading).

## Tasks

1. Add text-primary outline on selected player rows in `RecordStep`; keep accent left bar for assigned-only.
2. Pass `playerName` into `RolePicker`; heading `Pick character for {name}`.
3. Sync `02-UI-SPEC.md` Record step copy/behavior.
4. Extend `e2e/setup-record.spec.ts` for pressed state + picker title.
