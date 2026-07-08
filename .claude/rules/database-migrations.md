---
paths:
  - "packages/database/**"
  - "lib/db.ts"
  - "services/**"
  - "tests/unit/packages/**"
---

# Database and Migration Policy

- Database schema, Prisma config, generated client boundary and migrations live in `packages/database/`.
- Do not edit `packages/database/generated/` by hand.
- Use root pnpm scripts for database work: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:deploy`, `pnpm db:check-migration`.
- Schema changes must include a migration folder unless the user explicitly asks for a prototype that is not being committed.
- Run `pnpm db:check-migration` before committing schema changes.
- Business logic stays in `services/`; app routes and UI should not reach directly around service boundaries for complex workflows.
- Add indexes for fields used in hot `where`, `orderBy`, joins, or account/user scoping queries.
- Keep persisted auth and account data auditable: store role, timestamps, and enough metadata to reproduce access decisions when needed.
