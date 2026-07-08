# GitHub Governance

> Status: Current repository-governance reference.

> Source files: [CODEOWNERS](../../.github/CODEOWNERS), [PR template](../../.github/pull_request_template.md), [issue forms](../../.github/ISSUE_TEMPLATE/), [labels](../../.github/labels.yml), [labeler config](../../.github/labeler.yml), and [Dependabot config](../../.github/dependabot.yml).

## Purpose

GitHub governance keeps review ownership, PR metadata, dependency updates, and required checks predictable while preserving the repo policy of one main app and one production runtime.

## Branching workflow

The repository default and production branch is **`main`**.

| Flow                            | Base branch | When                                  |
| ------------------------------- | ----------- | ------------------------------------- |
| Feature, fix, docs, agent rules | `main`      | Default for all PRs                   |
| Production hotfix               | `main`      | Emergency fix with the same PR checks |

```text
feature/* or docs/* or fix/*  -->  main  -->  production deploy
```

- Merges to `main` deploy production when app/runtime paths changed.
- New PRs use [.github/pull_request_template.md](../../.github/pull_request_template.md), which reminds contributors to target `main`.

## Git write authorization

Coding agents and automation must not stage, commit, amend, push, create/close issues, or create/retarget/merge pull requests without an explicit user request for that write in the current task. Read-only inspection is allowed.

Before committing, inspect status and the relevant diff, then stage only task-owned files. A dirty worktree is normal; never use broad staging or destructive cleanup to make unrelated changes disappear. Force-push, hard reset and destructive clean operations remain prohibited for routine work.

## Commit convention

This repo uses Conventional Commits 1.0 with a bounded type and scope vocabulary:

`<type>(<optional-scope>): <imperative summary>`

| Type       | Use                                                     |
| ---------- | ------------------------------------------------------- |
| `feat`     | New user/developer capability                           |
| `fix`      | Incorrect behavior                                      |
| `refactor` | Internal restructuring without intended behavior change |
| `perf`     | Measured performance improvement                        |
| `test`     | Test-only behavior or infrastructure                    |
| `docs`     | Documentation-only change                               |
| `build`    | Build system, package or generated-artifact workflow    |
| `ci`       | CI/CD and repository automation                         |
| `chore`    | Maintenance not covered above                           |
| `revert`   | Reversal of an earlier commit                           |

Common scopes are `app`, `api`, `engine`, `location`, `timezone`, `database`, `workers`, `services`, `infra`, `ci`, `deps`, `agents` and `docs`. Omit scope when the change genuinely spans several areas.

Subjects are lowercase, imperative, specific, have no trailing period, and should remain at most 72 characters where practical. The body explains why, trade-offs and operational context. Use `BREAKING CHANGE:` only for an incompatible contract, and `Refs #123` or `Closes #123` as footers. Contributors may enable the optional [.gitmessage](../../.gitmessage) template through their local Git configuration:

```bash
git config commit.template .gitmessage
```

## Pull request style

PR titles use the same Conventional Commit format so review and history share one durable summary. The [PR Title](../../.github/workflows/pr-title.yml) workflow enforces this for non-Dependabot PRs.

The body must include problem/outcome, change summary, linked issue, feature/mini-contract, risk, rollout/rollback, data or migration impact, documentation/configuration impact and exact verification.

Draft PRs are appropriate for incomplete implementation or early design review. Checkboxes are evidence, not intent: do not mark a test, build or review complete when it did not run.

## Issue intake

GitHub issue forms under [.github/ISSUE_TEMPLATE/](../../.github/ISSUE_TEMPLATE/) are the required intake path:

| Form             | Title                        | Minimum content                                                            |
| ---------------- | ---------------------------- | -------------------------------------------------------------------------- |
| Bug              | `[Bug] observable impact`    | Environment, sanitized reproduction, expected/actual behavior and evidence |
| Feature          | `[Feature] user outcome`     | User problem, desired outcome, acceptance criteria and boundaries          |
| Engineering task | `[Task] engineering outcome` | Context, concrete deliverable, constraints and verification                |

Search open and closed issues before creation. Do not use GitHub issues for active security incidents or include secrets, decrypted configuration, raw customer payloads, unnecessary PII or exploitable private details.

## Pull request controls

| Control           | Source                                                                 | Behavior                                                                                                           |
| ----------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Code ownership    | [CODEOWNERS](../../.github/CODEOWNERS)                                 | Assigns ownership for app, infra, database, CI and docs paths.                                                     |
| Label catalog     | [labels.yml](../../.github/labels.yml)                                 | Canonical label names, colors and descriptions.                                                                    |
| Label sync        | [sync-labels.yml](../../.github/workflows/sync-labels.yml)             | Creates or updates labels from `labels.yml` on push to `main`, weekly and manually. Does not delete custom labels. |
| Path labels (PRs) | [pr-labeler.yml](../../.github/workflows/pr-labeler.yml)               | Syncs labels first, then applies area, dependency, security, risk and title type labels.                           |
| Issue labels      | [issue-labeler.yml](../../.github/workflows/issue-labeler.yml)         | Syncs labels first, then applies type, area, security and risk labels from issue forms/body.                       |
| Dependabot labels | [dependabot-labels.yml](../../.github/workflows/dependabot-labels.yml) | Adds dependency labels and marks grouped security-update PRs as `security` and `risk:high`.                        |

## Required checks

Use these exact required status checks in branch protection:

| Check                           | Source                                               |
| ------------------------------- | ---------------------------------------------------- |
| `PR Title / Conventional Title` | [pr-title.yml](../../.github/workflows/pr-title.yml) |
| `Root CI / Quality Gate`        | [root-ci.yml](../../.github/workflows/root-ci.yml)   |
| `Root CI / Production Build`    | [root-ci.yml](../../.github/workflows/root-ci.yml)   |
| `CodeQL / Analyze`              | [codeql.yml](../../.github/workflows/codeql.yml)     |

Do not require deploy jobs for merging. Deployment workflows are environment operations and can be blocked by production secrets, host availability or environment approvals.

## Branch protection

Configure `main` manually in GitHub repository settings:

| Branch | Required settings                                                                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main` | Require pull request before merging, 1 approval, CODEOWNERS review, resolved conversations, up-to-date branch and the required checks listed above. |

## Dependency automation

Dependabot opens weekly grouped PRs for:

- Root npm dependencies
- GitHub Actions versions

Security update grouping is configured in [dependabot.yml](../../.github/dependabot.yml). Dependabot security updates must also be enabled in GitHub repository security settings.

## Security automation

| Layer  | Behavior                                                                                                                                                              |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CodeQL | Runs JavaScript/TypeScript analysis on PRs and pushes to `main`. SARIF upload is disabled until GitHub Advanced Security/code scanning is enabled for the repository. |
| Trivy  | Runs after the production app image is built and pushed; reports HIGH and CRITICAL findings, blocks only CRITICAL findings.                                           |
| Labels | Security-sensitive paths and Dependabot security-update groups receive `security` and high-risk labels.                                                               |
