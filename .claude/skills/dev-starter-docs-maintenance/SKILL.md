---
name: dev-starter-docs-maintenance
description: Update AGENTS.md and related docs before opening a PR after behavior-changing work.
---

# Docs Maintenance

Run after implementation, before opening a PR.

## Step 1 - Identify scope

List touched areas: `app/`, `components/`, `hooks/`, `lib/`, `services/`, `workers/`, `packages/database/`, `infrastructure/`, `.github/`, `.claude/`, `tests/`, or `docs/`.

## Step 2 - AGENTS cascade

For each applicable `AGENTS.md`, update layout, file paths, env flags, and constraints when behavior changed.

If you added a subsystem with non-trivial conventions, create `<folder>/AGENTS.md` and add one line to root [AGENTS.md](../../../AGENTS.md) when useful.

## Step 3 - Thematic docs

| If you changed...             | Check / update                                                    |
| ----------------------------- | ----------------------------------------------------------------- |
| Folder with `AGENTS.md`       | That `AGENTS.md`                                                  |
| `lib/env.ts` or new env var   | `.env.example`, SOPS/deployment wiring, environment rule docs     |
| Prisma or migrations          | `packages/database/AGENTS.md`, database docs if model shifts      |
| API route or service contract | nearest `AGENTS.md`, architecture docs, tests                     |
| Workers                       | `workers/AGENTS.md` and runtime docs                              |
| Production health or deploy   | `docs/deployment/` and `infrastructure/` docs                     |
| Chart calculation conventions | `.claude/rules/calculation-accuracy.md`, architecture docs, tests |
| Durable architecture choice   | Current architecture doc or ADR under `docs/decisions/`           |
| Tests or commands             | `docs/testing/quality-gates.md`, `tests/AGENTS.md`                |

## Step 4 - Justify or update

- Update when the described system changed.
- Skip standalone docs for trivial refactors; state skip reason in PR summary.
- Create Markdown only for complex systems, integrations, API contracts, calculation contracts, or major architecture.

Use `rg` across `docs/`, `README.md`, `AGENTS.md`, and `.claude/` for changed module names, routes, env vars, provider names, and table names.
