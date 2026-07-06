# Claude Code Notes

Read [AGENTS.md](AGENTS.md) before editing. This repo has one Next.js app and one production runtime.

Project-specific Claude Code configuration lives in [.claude/](.claude/):

- `.claude/settings.json` blocks large/generated/secret reads and wires safety hooks.
- `.claude/rules/` contains repo guardrails for branches, docs, env vars, feature contracts, and database work.
- `.claude/skills/` contains repeatable workflows for commits, PRs, verification, database migrations, and issue drafting.
- `.claude/agents/` contains read-only audit agents for deeper reviews (backend, frontend, security, database, workers).

Do not read plaintext secrets, generated clients, `.next/`, `node_modules/`, or `.env*` files. Use explicit user approval for commits, pushes, PRs, issue writes, and history rewrites.
