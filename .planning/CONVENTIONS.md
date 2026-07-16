# Conventions

## Nix development environment

All repo tooling must run inside the Nix flake:

```bash
CURSOR_DEV=true nix develop -c <command>
```

- Applies to `npm`, `node`, `npx`, Playwright, builds, tests, and linters.
- **Git does not need the Nix prefix** — run `git` directly.
- Cursor rule: `.cursor/rules/nix.mdc` (`alwaysApply: true`).
- Claude entrypoint: `CLAUDE.md`.
