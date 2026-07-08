---
paths:
  - "app/**"
  - "components/**"
  - "hooks/**"
  - "services/**"
  - "workers/**"
  - "lib/**"
  - "packages/**"
---

# Feature Thinking Contract

Before implementing feature-level or behavior-changing work, define a feature contract. Use `.claude/skills/dev-starter-feature-contract/SKILL.md` for the full checklist.

Full contract required for:

- New features or major enhancements
- User-flow, API, account, integration, worker, persistence, or calculation behavior changes
- Non-trivial async UX such as loading, optimistic updates, retries, polling, or long-running calculation state

Mini contract allowed for:

- typo/copy-only changes
- mechanical renames
- isolated bug fixes with no user-flow, API, persistence, or calculation contract change

Hidden-complexity checks:

- double-submit behavior
- loading, empty, error and retry states
- concurrency and idempotency
- safe logging and no sensitive user data leaks
- undo/reversibility where data can be persisted
- deterministic calculation output and versioned conventions
