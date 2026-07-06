# app/AGENTS.md

Rules for the main Next.js App Router surface. Read after the root [AGENTS.md](../AGENTS.md).

## Routing

- This repo has one primary app: the root `app/` directory.
- Route handlers live under `app/api/` and should delegate business logic to [services/](../services/) or shared helpers in [lib/](../lib/).
- Auth pages live in `app/(auth)/` and use server actions in `app/(auth)/login/actions.ts` and `app/(auth)/signup/actions.ts`.
- Keep pages and layouts server components by default. Add `"use client"` only for browser APIs, state, effects, or event handlers.

## Boundaries

- App files compose UI and call service functions. They should not own durable business workflows directly.
- Shared route-safe helpers belong in [lib/](../lib/).
- Long-running background processes belong in [workers/](../workers/), not route handlers.
- Never hardcode user-facing copy. Import from `@shared/app-strings`.
- Compose pages from `components/ui/` primitives and feature components in `components/` instead of duplicating Tailwind patterns.
- Surface service errors from `@shared/app-errors`; use `AppStrings.auth.genericError` for unexpected failures in actions.

## Runtime

- Production is the only deployed server target tracked in this repo.
- Runtime checks should use `/api/health`.
- Route protection and role redirects live in [proxy.ts](../proxy.ts) at the repo root.
