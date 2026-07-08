---
paths:
  - "**/*"
---

# Branch and PR Policy

- Never stage, commit, amend, push, create/close issues, or create/retarget/merge PRs unless explicitly requested in the current message.
- Inspect status and relevant diffs first; stage only task-owned paths and preserve unrelated worktree changes.
- Default PR base is `main`. `main` is production.
- Use feature/fix/docs branches for all routine work; merge through PRs into `main`.
- Commit messages and PR titles use `<type>(<optional-scope>): <imperative summary>` with the allowed types in [GitHub governance](../../docs/deployment/github-governance.md#commit-convention).
- Use the committed PR/issue templates; search duplicate issues first and never include secrets, decrypted env or unnecessary personal data.

Full workflow: [docs/deployment/github-governance.md](../../docs/deployment/github-governance.md).
