# services/AGENTS.md

Rules for business logic. Read after the root [AGENTS.md](../AGENTS.md).

## What belongs here

- Durable workflows, database reads/writes, transactions, external API calls, and domain orchestration.
- Route handlers should stay thin and call named service functions.
- Throw and return reusable errors from `@shared/app-errors` instead of inline error strings.

## Boundaries

- No React, JSX, or `"use client"` files.
- Do not initialize databases or SDKs at module scope. Use lazy getters.
- Log through [lib/logger.ts](../lib/logger.ts) and avoid logging secrets, raw tokens, or sensitive user data.
- Keep one service entrypoint per file, named `<domain>-service.ts`.
