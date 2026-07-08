<div align="center">

  <!-- Header: https://github.com/ryo-ma/capsule-render (free) -->
  <a href="https://github.com/chahatkesh/dev-starter">
    <img
      alt="Dev Starter"
      src="https://capsule-render.vercel.app/api?type=venom&color=0:F36458,100:0B0B0B&height=180&section=header&text=Dev%20Starter&fontSize=62&fontColor=ffffff&stroke=ffffff&strokeWidth=1"
    />
  </a>

  <!-- Tagline: https://github.com/DenverCoder1/readme-typing-svg (free) -->
  <a href="https://github.com/chahatkesh/dev-starter">
    <img
      alt="Production-focused Next.js monorepo starter with auth, Prisma, and deploy contracts"
      src="https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=400&size=18&duration=2800&pause=1200&color=B9B9B9&center=true&vCenter=true&width=920&lines=Production-focused+Next.js+monorepo+starter;Auth+%2B+Prisma+%2B+shared+copy;Clone+and+ship+from+one+repo"
    />
  </a>

  <br />

  <!-- Badges: https://shields.io (free) -->

<a href="https://nextjs.org/"><img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-0B0B0B?style=for-the-badge&logo=next.js&logoColor=white" /></a>
<a href="https://www.typescriptlang.org/"><img alt="TypeScript 5" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /></a>
<a href="https://www.prisma.io/"><img alt="Prisma 7" src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" /></a>
<a href="https://www.postgresql.org/"><img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" /></a>
<a href="https://tailwindcss.com/"><img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" /></a>
<a href="https://pnpm.io/"><img alt="pnpm" src="https://img.shields.io/badge/pnpm-10-F69220?style=for-the-badge&logo=pnpm&logoColor=white" /></a>

  <br />

<a href="https://github.com/chahatkesh/dev-starter/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/chahatkesh/dev-starter?style=for-the-badge&logo=github&label=Stars&color=F36458&logoColor=white" /></a>
<a href="https://github.com/chahatkesh/dev-starter/forks"><img alt="GitHub forks" src="https://img.shields.io/github/forks/chahatkesh/dev-starter?style=for-the-badge&logo=github&label=Forks&color=212121&logoColor=white" /></a>
<a href="https://github.com/chahatkesh/dev-starter/actions/workflows/root-ci.yml"><img alt="CI status" src="https://img.shields.io/github/actions/workflow/status/chahatkesh/dev-starter/root-ci.yml?branch=main&style=for-the-badge&label=CI&logo=githubactions&logoColor=white&color=0B0B0B" /></a>

  <br />

<a href="https://chahatkesh.me/"><img alt="Portfolio" src="https://img.shields.io/badge/Portfolio-chahatkesh.me-F36458?style=for-the-badge&logo=googlechrome&logoColor=white" /></a>
<a href="https://github.com/chahatkesh"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-@chahatkesh-0B0B0B?style=for-the-badge&logo=github&logoColor=white" /></a>
<a href="https://github.com/chahatkesh/dev-starter"><img alt="Repository" src="https://img.shields.io/badge/Repo-dev--starter-212121?style=for-the-badge&logo=git&logoColor=white" /></a>

</div>

<br />

Production-focused Next.js starter for open-source apps and internal products. One app, one production runtime, auth included, and conventions that stay boring on purpose.

**Created by [Chahat Kesharwani](https://chahatkesh.me)** · [Portfolio](https://chahatkesh.me) · [GitHub](https://github.com/chahatkesh) · [Repository](https://github.com/chahatkesh/dev-starter)

## What you get

- **Next.js 16** App Router with TypeScript and Tailwind CSS 4
- **Auth out of the box** — signup, login, signed session cookies, role-based redirects
- **PostgreSQL + Prisma 7** in a workspace package with migrations and admin seeding
- **Centralized copy** — `AppStrings` and `AppErrors` in `packages/shared/`
- **SOPS + age** encrypted secrets for local and production env files
- **Docker** local database and production image/compose contracts
- **GitHub Actions** CI, production deploy workflow, labels, and governance templates
- **Claude Code** skills, agents, and repo guardrails under `.claude/`

## Quick start

### Prerequisites

- Node.js 20.9+
- pnpm 10.34+
- Docker (for local PostgreSQL)
- [age](https://github.com/FiloSottile/age) and [SOPS](https://github.com/getsops/sops) (for encrypted secrets)

### 1. Install and configure

```bash
git clone https://github.com/chahatkesh/dev-starter.git
cd dev-starter
pnpm install
cp .env.example .env
```

Set at minimum in `.env`:

| Variable         | Purpose                                             |
| ---------------- | --------------------------------------------------- |
| `AUTH_SECRET`    | Signs login session cookies (32+ random characters) |
| `ADMIN_EMAIL`    | Email for the seeded admin account                  |
| `ADMIN_PASSWORD` | Password for the seeded admin account               |
| `DATABASE_URL`   | PostgreSQL connection string                        |

### 2. Secrets (optional but recommended)

```bash
age-keygen -o .age-key.txt
chmod 600 .age-key.txt
# Copy the public key into .sops.yaml, then:
export SOPS_AGE_KEY_FILE="$PWD/.age-key.txt"
pnpm secrets:decrypt
```

See [SOPS secret management](docs/setup/secrets/sops-secret-management.md).

### 3. Database

```bash
pnpm docker:dev      # start local PostgreSQL
pnpm db:migrate      # apply migrations
pnpm db:seed         # seed admin from ADMIN_EMAIL / ADMIN_PASSWORD
```

Database package scripts load env from the **repo-root** `.env`.

### 4. Run the app

```bash
pnpm dev:procs       # database + Next.js + Prisma Studio (manual)
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

| Route         | Who            | After login                     |
| ------------- | -------------- | ------------------------------- |
| `/signup`     | New users      | Redirects to `/app`             |
| `/login`      | Everyone       | Admin → `/admin`, user → `/app` |
| `/app`        | Standard users | Protected workspace             |
| `/admin`      | Admin role     | Protected admin dashboard       |
| `/api/health` | Deploy checks  | Public JSON health contract     |

## Repository structure

```text
dev-starter/
├── app/                      # Next.js App Router (pages, layouts, API routes, server actions)
│   ├── admin/                # Admin dashboard (ADMIN role)
│   ├── app/                  # User workspace (authenticated users)
│   ├── (auth)/               # Route group for public auth pages
│   │   ├── login/            # Sign-in form + server action
│   │   └── signup/           # Sign-up form + server action
│   └── api/health/           # Production health endpoint
├── components/               # Reusable React components
│   ├── auth/                 # Auth shell, fields, logout button
│   ├── marketing/            # Creator attribution footer
│   └── ui/                   # Button, Input, Card, PageShell, TextLink
├── hooks/                    # Client-side React hooks
├── lib/                      # Shared server/browser utilities
│   └── auth/                 # Sessions, passwords, constants, sign-out action
├── services/                 # Business logic (auth-service, etc.)
├── workers/                  # Long-running daemon entrypoints (placeholder)
├── scripts/                  # One-shot operational scripts
├── packages/
│   ├── database/             # Prisma schema, migrations, seed, client export
│   └── shared/               # AppStrings + AppErrors (framework-free)
├── tests/
│   └── unit/
│       ├── app/              # Root app tests
│       └── packages/         # database, shared package tests
├── infrastructure/
│   ├── docker/               # docker-compose dev + prod
│   ├── dockerfiles/          # Production Dockerfile
│   └── nginx/                # Reverse proxy template
├── secrets/                  # SOPS-encrypted env files (committed)
├── docs/                     # Engineering docs
├── .claude/                  # Claude Code agents, skills, rules, hooks
├── .github/                  # CI/CD, labels, issue templates, CODEOWNERS
├── proxy.ts                  # Route protection + role redirects (Next.js proxy)
├── mprocs.yaml               # Local process supervisor config
├── Makefile                  # SOPS decrypt/edit helpers
└── .env.example              # Non-secret runtime contract
```

### Code boundaries

| Layer            | Location              | Responsibility                                                     |
| ---------------- | --------------------- | ------------------------------------------------------------------ |
| UI & routes      | `app/`, `components/` | Compose pages, forms, layouts; delegate to services                |
| Business logic   | `services/`           | Auth, DB workflows, external APIs                                  |
| Shared utilities | `lib/`                | Env, logging, auth helpers, worker utils                           |
| Copy & errors    | `packages/shared/`    | `AppStrings` (UI copy), `AppErrors` (service/API errors)           |
| Database         | `packages/database/`  | Prisma schema, migrations, seed, client                            |
| Protection       | `proxy.ts`            | Guards `/admin`, `/app`; redirects logged-in users from auth pages |

Import paths:

- `@/*` — repo root
- `@shared/app-strings` — user-facing copy
- `@shared/app-errors` — reusable errors

## AppStrings convention

All reusable user-facing copy lives in `packages/shared/src/app-strings/index.ts`. Do not hardcode strings in components, pages, or services.

```typescript
import { AppStrings } from "@shared/app-strings";

<h1>{AppStrings.auth.signInTitle}</h1>
```

Service and validation errors use `AppErrors`:

```typescript
import { AppErrors } from "@shared/app-errors";

throw AppErrors.create(AppErrors.invalidCredentials);
```

Add new strings and errors to `packages/shared/` before using them in app code. See [packages/shared/AGENTS.md](packages/shared/AGENTS.md).

## UI components

Reusable primitives live in `components/ui/`:

| Component    | Use case                                      |
| ------------ | --------------------------------------------- |
| `Button`     | Form submits, actions, disabled/loading state |
| `ButtonLink` | Navigation styled as a button                 |
| `Input`      | Text, email, password fields                  |
| `Field`      | Label + input wrapper                         |
| `Card`       | Bordered content panels                       |
| `Alert`      | Inline error messages                         |
| `TextLink`   | Internal routes and external links            |
| `PageShell`  | Shared page layout with optional footer       |

Feature-specific composition stays in folders like `components/auth/` and `components/marketing/`. Pages should import primitives instead of duplicating Tailwind classes.

### Clone attribution

Creator links are centralized in `@shared/creator-links` so forks can customize one file. The home page, auth screens, and dashboards render `CreatorAttribution`, which appends UTM params (`utm_source=dev-starter&utm_medium=referral&utm_campaign=starter-clone`) to portfolio and GitHub URLs for referral tracking.

Update `packages/shared/src/creator-links/index.ts` when you fork this starter for your own project.

## Commands

| Command                | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `pnpm dev:procs`       | Start DB + app + Prisma Studio via mprocs |
| `pnpm dev`             | Next.js dev server only                   |
| `pnpm build`           | Production build                          |
| `pnpm start`           | Run production build locally              |
| `pnpm docker:dev`      | Start local PostgreSQL                    |
| `pnpm db:migrate`      | Apply dev migrations                      |
| `pnpm db:seed`         | Seed admin account                        |
| `pnpm db:studio`       | Open Prisma Studio                        |
| `pnpm secrets:decrypt` | Decrypt `secrets/local.enc.yaml` → `.env` |
| `pnpm type-check`      | TypeScript across app + packages          |
| `pnpm test:unit`       | Vitest unit tests                         |
| `pnpm lint`            | ESLint                                    |
| `pnpm format:check`    | Prettier check                            |

Full quality gate:

```bash
pnpm format:check && pnpm lint && pnpm db:check-migration && pnpm type-check && pnpm test:unit && pnpm build
```

## Production

- Runtime contracts: [infrastructure/](infrastructure/)
- Deploy workflow: [.github/workflows/root-deploy-production.yml](.github/workflows/root-deploy-production.yml)
- Health check: `GET /api/health`
- Encrypted production env: `secrets/production.enc.yaml` → `.env.production`

Details: [Production runtime](docs/deployment/production-runtime.md).

## Documentation

| Doc                                                                                          | Topic                                   |
| -------------------------------------------------------------------------------------------- | --------------------------------------- |
| [docs/architecture/codebase-structure.md](docs/architecture/codebase-structure.md)           | Folder layout and policies              |
| [docs/setup/local-development.md](docs/setup/local-development.md)                           | Local dev, auth, database               |
| [docs/setup/secrets/sops-secret-management.md](docs/setup/secrets/sops-secret-management.md) | age + SOPS setup                        |
| [docs/deployment/github-governance.md](docs/deployment/github-governance.md)                 | Branches, commits, PRs, CI              |
| [docs/testing/quality-gates.md](docs/testing/quality-gates.md)                               | Pre-ship checks                         |
| [AGENTS.md](AGENTS.md)                                                                       | Repo rules for humans and coding agents |

Each major folder also has an `AGENTS.md` with boundary rules.

## Agent and contributor notes

- Read [AGENTS.md](AGENTS.md) before editing.
- One Next.js app with a production deploy path on `main`.
- Never commit `.env`, `.age-key.txt`, or generated Prisma client output.
- Use Conventional Commits; see [GitHub governance](docs/deployment/github-governance.md).
- Coding agents should not commit, push, or open PRs without explicit approval.

## Tech stack

- Next.js 16, React 19, TypeScript 5
- Tailwind CSS 4, Prisma 7, PostgreSQL
- bcryptjs + jose (password hashing, session JWT)
- Vitest, ESLint, Prettier, Husky
- pnpm workspaces (`database`, `shared`)
