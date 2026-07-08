# Local Development

This repo uses a small local process setup with one app and one local database.

## Process Manager

```bash
pnpm dev:procs
```

`mprocs.yaml` starts:

- `database`: local PostgreSQL through Docker Compose.
- `main-app`: the Next.js app at the repo root.
- `database-studio`: Prisma Studio, manual start only.

## Database

```bash
pnpm docker:dev
pnpm db:generate
pnpm db:migrate
pnpm db:studio
pnpm db:seed
```

Production database migrations use:

```bash
pnpm db:deploy
```

`DATABASE_URL` is documented in [.env.example](../../.env.example). Local Docker defaults to:

```text
postgresql://postgres:postgres@localhost:5432/dev_starter_dev
```

The Prisma schema, migrations, seed, and client boundary live in [packages/database/](../../packages/database/). App and service code should import `db` from [lib/db.ts](../../lib/db.ts).

## Auth

Copy [.env.example](../../.env.example) values into a local `.env` file and set at minimum:

- `AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

After migrations, seed the admin account from the repo-root `.env`:

```bash
pnpm db:seed
```

`db:seed` and other database package scripts load environment variables from the repo-root `.env`, not from `packages/database/.env`.

Auth routes:

| Route     | Purpose                      |
| --------- | ---------------------------- |
| `/login`  | Sign in; redirects by role   |
| `/signup` | Create standard user account |
| `/app`    | Protected user workspace     |
| `/admin`  | Protected admin dashboard    |

- `/signup` creates standard `USER` accounts and redirects to `/app`
- `/login` signs in any account and redirects admins to `/admin`, users to `/app`
- `/admin` and `/app` are protected by [proxy.ts](../../proxy.ts)

User-facing auth copy lives in `@shared/app-strings`. Service validation errors live in `@shared/app-errors`. See [packages/shared/AGENTS.md](../../packages/shared/AGENTS.md).

## UI and attribution

- Reusable primitives live in `components/ui/` (`Button`, `ButtonLink`, `Input`, `Card`, `PageShell`).
- Creator portfolio and GitHub links are centralized in [packages/shared/src/creator-links/index.ts](../../packages/shared/src/creator-links/index.ts).
- The home page, auth screens, and dashboards render `CreatorAttribution` with UTM referral params so clones can track traffic back to the starter author.
- Forks should update `CreatorLinks` in that file and the README author line.
