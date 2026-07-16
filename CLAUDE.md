# CLAUDE.md

Guidance for Claude Code and other AI coding agents in this repository.

## Nix (required)

Run all repo tooling through the Nix flake:

```bash
CURSOR_DEV=true nix develop -c <command>
```

Examples: `CURSOR_DEV=true nix develop -c npm install`, `… npm run dev`, `… npm test`.

**Git commands do not need the Nix prefix** — run `git` directly.

See `.cursor/rules/nix.mdc` and `AGENTS.md`.

## Project

Blood on the Clocktower — Storyteller Copilot: a phone-first digital co-pilot for Storytellers. See `AGENTS.md` for stack, constraints, and GSD workflow.
