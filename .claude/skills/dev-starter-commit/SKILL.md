---
name: dev-starter-commit
description: Create a scoped commit with this repository's Conventional Commit format when explicitly requested.
---

# Repository Commit

Only run when the user explicitly asks to commit in the current message.

## Workflow

1. Inspect `git status --short --branch` and relevant diffs.
2. Identify exactly which files belong to the requested task. Never discard or include unrelated changes.
3. Run the relevant verification or state what remains unverified.
4. Stage explicit paths. Do not use broad staging in a dirty worktree unless the user confirms all changes belong.
5. Review `git diff --cached` before committing.
6. Commit with `<type>(<optional-scope>): <imperative summary>` using [GitHub governance](../../../docs/deployment/github-governance.md#commit-convention).
7. Report the commit SHA, message, included paths and verification. Do not push unless separately requested.

Do not amend, reset, force-push or add agent attribution unless explicitly requested and safe.
