---
status: complete
phase: quick-260716-p8k
plan: 01
subsystem: ui
tags: [setup, record-roles, selection, a11y]

requires: []
provides:
  - Visible selected-player outline on Record roles rows
  - RolePicker heading includes selected player name
affects: [setup-wizard, record-step]

tech-stack:
  added: []
  patterns:
    - Selected list rows use text-primary outline; accent left bar remains “has role” only

key-files:
  created: []
  modified:
    - src/ui/setup/steps/RecordStep.tsx
    - src/ui/setup/components/RolePicker.tsx
    - e2e/setup-record.spec.ts
    - .planning/phases/02-setup-wizard-grimoire-capture/02-UI-SPEC.md

key-decisions:
  - "Selection uses text-primary outline (not accent fill) to avoid colliding with assigned-row accent bar and UI-SPEC accent reservation"

requirements-completed: [QUICK-RECORD-SELECT]

---

# Summary

Record roles now shows a persistent text-primary outline on the tapped player row and titles the picker **Pick character for {Name}**. Assigned rows still use the accent left bar. E2E covers pressed state + named heading clearing after assign.
