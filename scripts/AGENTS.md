# scripts/AGENTS.md

Rules for one-shot scripts. Long-running daemons belong in [workers/](../workers/).

## What belongs here

- CI checks, deployment helpers, local setup commands, seed scripts, and backfills.
- Scripts should do one job and exit, except local tooling supervisors such as [start-dev-database.ts](start-dev-database.ts) that foreground external development services.

## Pattern

- Reusable logic belongs in [services/](../services/) or [lib/](../lib/).
- Export testable functions from TypeScript scripts and keep CLI execution behind an entrypoint guard.
- Add a root `pnpm` alias for scripts people or CI run regularly.
- Production host bootstrap helpers live under `scripts/production/`.
