# packages/database/AGENTS.md

Rules for the Prisma workspace package. Read after the root [AGENTS.md](../../AGENTS.md).

## What belongs here

- The Prisma schema in [packages/database/prisma/schema.prisma](prisma/schema.prisma).
- Migrations in [packages/database/prisma/migrations/](prisma/migrations/).
- The seed in [packages/database/prisma/seed.ts](prisma/seed.ts). Seed messages come from `@shared/app-strings`.
- Generated Prisma client output in `packages/database/generated/`.
- A small `src/` surface for database helpers, root env loading, and the shared Prisma client export.

## Hard rules

- Never edit `packages/database/generated/` by hand. It is rewritten by `pnpm db:generate` and remains gitignored.
- Never run Prisma operations from another package. Root database scripts must delegate to this package with `pnpm --filter database ...`.
- Do not import from `app/`, `components/`, or React code.
- App and service code should use [lib/db.ts](../../lib/db.ts), not generated Prisma paths.
- Add package tests under [tests/unit/packages/database/](../../tests/unit/packages/database/).
- Database package scripts load env from the repo-root `.env` via [src/load-root-env.ts](src/load-root-env.ts).

## Workflow

1. Edit [schema.prisma](prisma/schema.prisma).
2. Run `pnpm db:generate` from the repo root.
3. Run `pnpm db:migrate` for development migrations or `pnpm db:deploy` for production migration deploys.
4. Commit schema and migration changes together.
5. The pre-commit hook runs `pnpm db:check-migration` and blocks staged schema changes without a staged `migration.sql`.
