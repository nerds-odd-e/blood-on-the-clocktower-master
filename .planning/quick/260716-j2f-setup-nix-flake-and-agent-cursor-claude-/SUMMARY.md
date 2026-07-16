---
status: complete
slug: setup-nix-flake-and-agent-cursor-claude-
quick_id: 260716-j2f
completed: 2026-07-16
---

# Summary: Nix flake + agent nix-prefix rules

## Done

- Added `flake.nix` / `flake.lock` (nixos-26.05, Node.js 24) and `.envrc` (`use flake`).
- Enforced tooling prefix via `.cursor/rules/nix.mdc`, `CLAUDE.md`, `AGENTS.md` conventions, and `.planning/CONVENTIONS.md`.
- Verified: `CURSOR_DEV=true nix develop -c node --version` → v24.16.0.

## Prefix

```bash
CURSOR_DEV=true nix develop -c <command>
```

Git is exempt.
