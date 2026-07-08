# Codebase Structure

This repo follows a production-focused monorepo layout: one Next.js app, two workspace packages, and one production deployment target.

## Top-level folders

| Folder               | Purpose                                                              |
| -------------------- | -------------------------------------------------------------------- |
| `app/`               | Next.js App Router routes, layouts, API handlers, and server actions |
| `components/`        | Reusable React components (`auth/`, `ui/`, `marketing/`)             |
| `hooks/`             | Client-side React hooks                                              |
| `lib/`               | Shared utilities — env, logging, auth, worker helpers                |
| `services/`          | Business workflows and external integrations                         |
| `workers/`           | Long-running daemon entrypoints (placeholder until needed)           |
| `scripts/`           | One-shot local, CI, and production helper scripts                    |
| `packages/database/` | Prisma schema, migrations, seed, and client boundary                 |
| `packages/shared/`   | Framework-free `AppStrings` and `AppErrors` catalogs                 |
| `tests/`             | Vitest unit tests for app and packages                               |
| `infrastructure/`    | Docker compose, production Dockerfile, nginx template                |
| `secrets/`           | SOPS-encrypted environment files (safe to commit)                    |
| `docs/`              | Engineering documentation                                            |
| `.claude/`           | Claude Code agents, skills, rules, and safety hooks                  |
| `.github/`           | CI/CD workflows, labels, issue templates                             |

Root-level runtime files:

| File           | Purpose                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------- |
| `proxy.ts`     | Protects `/admin` and `/app`; redirects authenticated users away from `/login` and `/signup` |
| `mprocs.yaml`  | Local process supervisor (database, app, Prisma Studio)                                      |
| `.env.example` | Documented non-secret env contract                                                           |
| `Makefile`     | SOPS decrypt/edit/updatekeys targets                                                         |

## Workspace packages

### `packages/database`

- Prisma schema: `packages/database/prisma/schema.prisma`
- Migrations: `packages/database/prisma/migrations/`
- Seed: `packages/database/prisma/seed.ts` (admin upsert from env)
- Client export: `packages/database/src/index.ts`
- Env loading: `packages/database/src/load-root-env.ts` reads repo-root `.env`

App code imports the database through [lib/db.ts](../../lib/db.ts), not generated Prisma paths directly.

### `packages/shared`

- UI copy: `@shared/app-strings` → `packages/shared/src/app-strings/`
- Errors: `@shared/app-errors` → `packages/shared/src/app-errors/`
- Pure TypeScript only — no React, Next.js, Prisma, or env reads

## Auth layout

```text
User → /login or /signup (client form + server action)
     → services/auth-service.ts (validate, hash, Prisma)
     → lib/auth/session.ts (signed HTTP-only cookie)
     → proxy.ts redirects by role
         ADMIN → /admin
         USER  → /app
```

Relevant paths:

- `app/(auth)/login/`, `app/(auth)/signup/` — sign-in and sign-up pages with colocated server actions
- `components/auth/` — shared auth UI shell built from `components/ui/`
- `components/ui/` — reusable Button, Input, Card, PageShell primitives
- `components/marketing/` — creator attribution footer for clone referral links
- `lib/auth/` — password hashing, session tokens, sign-out
- `services/auth-service.ts` — signup/signin business logic
- `proxy.ts` — route protection at the network boundary

## Test layout

```text
tests/unit/app/              # Root app route and API tests
tests/unit/packages/database/ # Database config helpers
tests/unit/packages/shared/  # AppStrings and AppErrors
tests/unit/lib/auth/         # Auth helper tests
```

## Environment policy

Supported runtime environments: `development`, `test`, `production`.

- Local Docker provides PostgreSQL for development only.
- Production deploys from `main` when app/runtime paths change.

## Local process policy

Use [mprocs.yaml](../../mprocs.yaml) for the local development process set:

1. `database` — local PostgreSQL via Docker Compose
2. `main-app` — Next.js dev server
3. `database-studio` — Prisma Studio (manual start)

## Copy and error policy

- User-facing strings → `AppStrings` in `packages/shared/`
- Service/API validation errors → `AppErrors` in `packages/shared/`
- Do not hardcode copy in `app/`, `components/`, or `services/`

See [packages/shared/AGENTS.md](../../packages/shared/AGENTS.md).
