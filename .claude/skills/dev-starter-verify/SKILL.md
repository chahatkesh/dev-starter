---
name: dev-starter-verify
description: Run repository checks before marking work done or opening a PR.
---

# Repository Verify

Run verification from repo root.

## Standard checks

```bash
pnpm format:check
pnpm db:check-migration
pnpm lint
pnpm type-check
pnpm test:unit
pnpm build
```

## Targeted tests

When a change has focused coverage, run the smallest meaningful test first:

```bash
pnpm test:unit -- <path-or-pattern>
```

If unsure, run the full standard checks.

## On failure

1. Fix issues in changed files; do not disable checks.
2. Re-run the failed command.
3. Summarize what failed, what changed, and what now passes.

## Pre-PR checklist

- No secrets or decrypted env values in output, logs, fixtures, or docs.
- No placeholder auth/session behavior presented as production-ready security.
- Database schema changes include migrations.
- Docs updated or skip reason stated.
