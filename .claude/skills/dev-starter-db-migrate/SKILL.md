---
name: dev-starter-db-migrate
description: Prisma schema and migration workflow for packages/database changes.
---

# Database Migration

Read [packages/database/AGENTS.md](../../../packages/database/AGENTS.md) before editing schema.

## Hard rules

- Never edit `packages/database/generated/` by hand.
- Never run Prisma CLI from outside root pnpm scripts unless diagnosing a tool issue.
- Business logic stays in `services/`; shared database access belongs behind `lib/db.ts` and package exports.

## Workflow

1. Edit [packages/database/prisma/schema.prisma](../../../packages/database/prisma/schema.prisma).
2. `pnpm db:generate` refreshes client types.
3. `pnpm db:migrate` creates a development migration with a meaningful name.
4. Commit the migration folder.
5. If seed changed, run `pnpm db:seed`.
6. Run `pnpm db:check-migration`.

## Indexing

Add indexes for fields used in `where`, `orderBy`, joins, account/user scoping, or frequent auth lookup queries.

## Production path

Production deploys use `pnpm db:deploy` through the production runtime contract.
