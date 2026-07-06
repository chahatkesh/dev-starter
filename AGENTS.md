<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Dev Starter Rules

This repo follows a production-focused structure with one main app and one production runtime.

## Shape

- `app/` is the Next.js application in this monorepo.
- Production is the deployed server target.
- Shared UI belongs in `components/`, hooks in `hooks/`, reusable helpers in `lib/`, business logic in `services/`, long-running daemons in `workers/`, and one-shot utilities in `scripts/`.
- Database-specific schema/client code belongs in `packages/database/`.
- Shared copy and reusable errors belong in `packages/shared/` via `@shared/app-strings` and `@shared/app-errors`.
- Route protection and auth redirects live in `proxy.ts` at the repo root.
- Root app tests live in `tests/unit/app/`; package tests live in `tests/unit/packages/`.
- Claude Code repo rules live in `.claude/`; keep them aligned with these instructions when workflow policy changes.

## Runtime

- Supported app environments are `development`, `test`, and `production`.
- Keep runtime secrets out of git. Document non-secret contracts in `.env.example`.
- Use `/api/health` for production health checks.
- Auth uses signed session cookies backed by `AUTH_SECRET`. Seed the admin account with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Never hardcode user-facing copy in product code. Add reusable strings to `@shared/app-strings` and service/API errors to `@shared/app-errors`.
- New contributors should start with [README.md](README.md) and [docs/README.md](docs/README.md).
