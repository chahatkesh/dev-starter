# Engineering Docs

Documentation for the Dev Starter open-source template.

## Architecture

- [Codebase structure](architecture/codebase-structure.md) — folders, packages, auth, tests

## Setup

- [Local development](setup/local-development.md) — mprocs, database, auth, env loading
- [SOPS secret management](setup/secrets/sops-secret-management.md) — age keys and encrypted env files

## Deployment

- [GitHub governance](deployment/github-governance.md) — branches, commits, PRs, labels, CI
- [Production runtime](deployment/production-runtime.md) — Docker, health checks, deploy contracts
- [Root CI/CD](deployment/root-ci-cd.md) — workflow overview

## Testing

- [Quality gates](testing/quality-gates.md) — commands to run before shipping

## Decisions

- [Decision records](decisions/README.md) — architecture decision log

## Agent rules

Repo and folder-level rules for humans and coding agents live in [AGENTS.md](../AGENTS.md) and `**/AGENTS.md` throughout the tree.
