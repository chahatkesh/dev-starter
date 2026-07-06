# packages/shared/AGENTS.md

Rules for the framework-free shared package. Read after the root [AGENTS.md](../../AGENTS.md).

## What belongs here

- `@shared/app-strings` — every reusable user-facing string in the root app. Source of truth: [src/app-strings/index.ts](src/app-strings/index.ts). [src/app-strings.ts](src/app-strings.ts) is a one-line re-export shim only.
- `@shared/app-errors` — reusable validation and service errors. Source of truth: [src/app-errors/index.ts](src/app-errors/index.ts). [src/app-errors.ts](src/app-errors.ts) is a one-line re-export shim only.
- `@shared/creator-links` — portfolio, GitHub, and repo URLs plus UTM attribution helper for clone referral tracking. Source: [src/creator-links/index.ts](src/creator-links/index.ts).

## Hard rules

- Pure TypeScript only. Do not import Next.js, React, Prisma, or environment readers.
- No side effects at module top level.
- Add strings and errors here before using them in `app/`, `components/`, or `services/`.
- UI copy belongs in `AppStrings`. Machine/API/service errors belong in `AppErrors`.

## Adding strings or errors

- Group strings under a feature key on `AppStrings` (for example `AppStrings.auth.signInTitle`).
- Use helper methods when interpolation is required.
- Add new errors to `AppErrors` with a stable key, message, and `statusCode`.
