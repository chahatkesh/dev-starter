---
name: dev-starter-pr
description: Create a standardized pull request into main when explicitly requested.
---

# Repository Pull Request

Only run when the user explicitly asks to create a PR in the current message. A PR request authorizes the PR operation, not unrelated commits, cleanup or destructive Git changes.

## Pre-flight

Inspect:

- `git status --short --branch`
- relevant staged/unstaged diff
- `git log origin/main..HEAD --oneline`
- current branch and remote tracking
- required checks for touched areas

Confirm commits belong to this task and no unrelated worktree changes are being included.

## Base and title

- Default `--base main`.
- Title format: `<type>(<optional-scope>): <imperative summary>`.
- Allowed types/scopes and message rules are in [GitHub governance](../../../docs/deployment/github-governance.md#commit-convention).

## Body

Use [.github/pull_request_template.md](../../../.github/pull_request_template.md). Include:

- problem and expected outcome
- concise change summary
- linked issue or explicit `None`
- feature contract or mini-contract
- risk, rollout, rollback and data/migration impact
- docs/config changes or skip reason
- exact checks and manual verification that actually ran

Create a draft PR when implementation or required verification is incomplete. Return the PR URL, base/head branches, title and check summary.
