---
name: dev-starter-feature-contract
description: Define a feature contract before feature-level or behavior-changing implementation.
---

# Feature Contract

Use before implementing feature-level or behavior-changing work.

## When full contract is required

- New feature or major enhancement
- User-flow, API, account, integration, worker, persistence, or calculation behavior change
- Non-trivial async UX: loading, optimistic updates, retries, polling, cancellation or long-running work

## Full contract must include

1. User problem: 1-2 sentences
2. User flow: `Entry -> Trigger -> Core loop -> Value -> Exit/return`
3. Three layers: Surface / Interaction / Engine
4. Technical flow: Input -> Process -> Output -> Failure states -> Data -> Dependencies
5. Accuracy and reproducibility: conventions, engine version, provider data, timezone behavior and fixture expectations
6. Hidden-complexity checks: double-submit, loading/empty/error UI, concurrency, safe logging, undo/reversibility

## Mini contract

Allowed only for typo/copy-only, mechanical rename, or isolated bug fix with no user-flow, API, persistence, or calculation contract change:

- `goal`
- `change`
- `risk`
- reason full contract was skipped

## After contract

Implement only what the contract specifies. Update the contract if scope changes materially.
