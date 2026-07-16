---
status: active
slug: setup-nix-flake-and-agent-cursor-claude-
quick_id: 260716-j2f
---

# Quick: Nix flake + agent nix-prefix rules

## Goal

Add a Nix flake for this Vite/React project and enforce `CURSOR_DEV=true nix develop -c …` for all agent tooling commands.

## Tasks

1. Add `flake.nix` (Node 24 + npm tooling), `.envrc` (`use flake`), generate `flake.lock`.
2. Add always-on Cursor rule `.cursor/rules/nix.mdc`, root `CLAUDE.md`, update `AGENTS.md` / `CONVENTIONS.md`.
3. Ignore `.direnv` / Nix `result`; verify `nix develop -c node --version` works.
