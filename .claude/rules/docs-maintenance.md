---
paths:
  - "**/*"
---

# Documentation Maintenance

Run after implementation, before marking work done or opening a PR.

1. Read cascade: root `AGENTS.md` plus nearest folder `AGENTS.md` for every touched subtree.
2. Search related docs: `docs/`, `README.md`, `AGENTS.md`, and `.claude/rules/` for changed modules, env vars, routes, scripts, workflows, providers, or database tables.
3. Update or justify skip: update docs in the same PR when behavior, commands, contracts, setup, deployment, or boundaries changed. Otherwise state the skip reason in the PR summary.

Create Markdown only for complex systems, integrations, API contracts, calculation contracts, deployment behavior, or major architecture decisions. Skip standalone docs for trivial refactors.
