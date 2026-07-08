Run a full deep codebase audit.

Do not edit application code unless the user explicitly asks.

## Phase 0 - Preflight and auto-setup

Stop immediately if preflight fails. Do not run survey, auditors or triage until PASS.

Run from repo root:

```bash
.claude/scripts/audit-preflight.sh --install-deps --install-mem
```

Required checks:

- `gh` installed and authenticated
- repo resolves via `gh repo view`
- `viewerPermission` is WRITE, MAINTAIN, or ADMIN
- `gh issue list --limit 1 --state all` succeeds
- Node 24.x present
- dependencies installed with pnpm if missing

If BLOCKED, print **GitHub setup required** with exact steps and stop.

## Phase 0.5 - Cost estimate and consent

Stop until the user explicitly approves. Skip this phase only if the user's message already includes `continue audit` or `skip cost estimate`.

Run:

```bash
.claude/scripts/audit-cost-estimate.sh --with-mem --with-issue-filing --scope=full
```

Present the output and wait for:

- `continue` - start full audit
- `continue quick` - backend, security and auth focus only
- `cancel` - no audit and no issue filing

## Phase A - Audit

Read:

- `README.md`
- `package.json`
- `AGENTS.md`
- `pnpm-workspace.yaml`
- `.env.example`
- `docs/`
- `.github/workflows/`
- `.claude/rules/`
- `infrastructure/`
- `app/`
- `components/`
- `hooks/`
- `lib/`
- `services/`
- `workers/`
- `packages/database/`
- `tests/`

Do not read `.env*`, `.age-key.txt`, encrypted secrets, `node_modules/`, `.next/`, generated database clients or coverage.

Spawn focused audit agents:

1. `workflow-mapper`
2. `backend-auditor`
3. `frontend-auditor`
4. `database-prisma-auditor`
5. `security-auditor`
6. `workers-auditor`

For quick scope, spawn `workflow-mapper`, `backend-auditor`, and `security-auditor`.

Each subagent must cite exact files/functions and separate **Confirmed**, **Inferred**, and **Suggested**.

## Phase B - Merge report

# Deep Codebase Audit

## 1. Executive Summary

## 2. Repository Map

## 3. Key Workflows

## 4. Architecture / Data Flow

## 5. Subagent Findings

## 6. Bugs and Vulnerabilities

Use P0 / P1 / P2 tables with evidence.

## 7. Missing Tests

## 8. Refactor Opportunities

## 9. Useful Tools

## 10. Prioritized Next Actions

## Phase C - GitHub issue filing

Only after user confirmation:

1. Collect confirmed IssueCandidates.
2. Spawn `github-issue-triage`.
3. Present triage table: **Create** | **Duplicate** | **Defer**.
4. Ask user to confirm issue creation unless they already said "create issues".
5. Create approved issues using `.claude/skills/dev-starter-issue/SKILL.md`.
