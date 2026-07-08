---
paths:
  - "**/*"
---

# Agent Instruction Cascade

Cascading `AGENTS.md` files are the source of truth for code changes.

Before editing:

1. Read root [AGENTS.md](../../AGENTS.md) for project-wide rules.
2. Read the nearest folder `AGENTS.md` for the subtree you are changing.
3. Read any relevant `.claude/rules/` files for the touched paths.
4. Before finishing, follow [docs-maintenance.md](docs-maintenance.md) for behavior-changing work.

Do not duplicate long convention lists in chat. Follow the nearest applicable instructions and keep `.claude` rules aligned with repo docs when workflow policy changes.
