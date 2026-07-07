# app/(auth)/AGENTS.md

Rules for public auth routes. Read after [app/AGENTS.md](../AGENTS.md).

## Routing

- Route group only — URLs stay `/login` and `/signup`.
- Login and signup pages are client components with server actions colocated in each route folder.
- Shared auth UI comes from `components/auth/`; do not duplicate shell markup here.

## Boundaries

- Server actions in `login/actions.ts` and `signup/actions.ts` delegate to `services/auth-service.ts`.
- Redirect authenticated users away from these routes via [proxy.ts](../../proxy.ts), not page-level checks.
