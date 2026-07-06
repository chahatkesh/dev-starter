# lib/AGENTS.md

Rules for shared utilities. Read after the root [AGENTS.md](../AGENTS.md).

## What belongs here

- Cross-cutting helpers used by app routes, services, workers, scripts, and tests.
- Environment contracts, logging, API helpers, formatting, validation, and worker utilities.
- Auth helpers under `lib/auth/` (sessions, passwords, sign-out actions, constants).

## Boundaries

- No React rendering in `lib/`; React hooks belong in [hooks/](../hooks/).
- Keep browser-safe helpers separate from server-only helpers.
- Do not initialize databases or service SDKs at module scope. Use lazy getters so `next build` remains safe without runtime secrets.
- Do not hardcode user-facing strings. UI copy belongs in `@shared/app-strings`.
