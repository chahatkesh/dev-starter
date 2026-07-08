# Root CI/CD

> Status: Current runbook for the single production app.

> Workflows: [root CI](../../.github/workflows/root-ci.yml), [PR title](../../.github/workflows/pr-title.yml), [CodeQL](../../.github/workflows/codeql.yml), and [root production deploy](../../.github/workflows/root-deploy-production.yml).

Branching policy: feature PRs target **`main`** by default; see [GitHub governance](github-governance.md#branching-workflow).

## Architecture

The root app uses GitHub Actions for verification and Docker-based deployment to production.

## Runtime versions

| Tool    | Version | Source                                                        |
| ------- | ------- | ------------------------------------------------------------- |
| Node.js | 24      | Workflow env and production Dockerfile                        |
| pnpm    | 10.34.4 | Workflow env, root `packageManager` and production Dockerfile |

| Workflow               | Trigger                           | Responsibility                                                                            |
| ---------------------- | --------------------------------- | ----------------------------------------------------------------------------------------- |
| PR Title               | PRs to `main`                     | Enforce Conventional Commit PR title format                                               |
| Root CI                | PRs to `main` and manual dispatch | format check, lint, type-check, tests, migration check, production build                  |
| Root Deploy Production | push to `main` or manual dispatch | quality gate, build image, push GHCR image, deploy to production host                     |
| CodeQL                 | PRs and pushes to `main`          | JavaScript/TypeScript static analysis without SARIF upload until code scanning is enabled |

## Workflow split

- PRs run title validation and CI before merge.
- Merges to `main` run production deployment when app/runtime paths changed.
- Deployment uses an immutable SHA image tag plus the mutable `production` tag.
- The production deploy job decrypts `secrets/production.enc.yaml`, transfers the production compose contract, restarts the app, and verifies `/api/health`.
- The production build job depends on the quality gate, so formatting, linting, type-checking, tests and migration checks remain the intended merge signal before build.

## Production flow

1. Run the root quality gate: dependency install, Prisma generate, formatting check, migration check, lint, type-check and unit tests.
2. Build and push the app image from [Dockerfile.prod](../../infrastructure/dockerfiles/Dockerfile.prod) to GHCR.
3. Scan the app image with Trivy, reporting HIGH and CRITICAL findings while blocking only CRITICAL findings.
4. Decrypt [secrets/production.enc.yaml](../../secrets/production.enc.yaml) to `.env.production` inside the workflow.
5. Append `APP_IMAGE=<ghcr image>:<commit sha>` to the decrypted environment.
6. Copy the production compose file and environment to the production host.
7. Pull the image, restart the `app` service and verify local `/api/health`.

The deploy job requires a complete `production.enc.yaml`; until production secrets and host details exist, CI and image build can still pass while deployment remains blocked at input validation.

## Required GitHub secrets

| Secret                       | Purpose                                                   |
| ---------------------------- | --------------------------------------------------------- |
| `PRODUCTION_APP_DOMAIN`      | Public production app domain                              |
| `PRODUCTION_HOST`            | Production host public IP or hostname                     |
| `PRODUCTION_DEPLOY_USER`     | SSH deployment user                                       |
| `PRODUCTION_SSH_PRIVATE_KEY` | SSH private key for production deployment                 |
| `PRODUCTION_SSH_PORT`        | Optional SSH port                                         |
| `PRODUCTION_SSH_KNOWN_HOSTS` | Required pinned known-hosts entry for the production host |
| `SOPS_AGE_KEY`               | Age key used to decrypt `secrets/production.enc.yaml`     |
| `GHCR_READ_USERNAME`         | Registry username used by the server                      |
| `GHCR_READ_TOKEN`            | Registry token used by the server                         |

## Branch protection

Require `PR Title / Conventional Title`, `Root CI / Quality Gate`, `Root CI / Production Build` and `CodeQL / Analyze` before merging to `main`. Do not require deploy jobs for PR merge.
