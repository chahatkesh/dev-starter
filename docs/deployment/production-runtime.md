# Production Runtime

This repo tracks one deployed runtime: production.

## Contracts

- App process: `pnpm start` after `pnpm build`
- Docker image: [../../infrastructure/dockerfiles/Dockerfile.prod](../../infrastructure/dockerfiles/Dockerfile.prod)
- Compose stack: [../../infrastructure/docker/docker-compose.prod.yml](../../infrastructure/docker/docker-compose.prod.yml)
- GitHub deployment template: [../../.github/workflows/root-deploy-production.yml](../../.github/workflows/root-deploy-production.yml)
- Health endpoint: `/api/health`
- Environment contract: [../../.env.example](../../.env.example)

## Supported environments

Supported runtime classes are local development, `test`, and production. See [Environment policy](../../docs/architecture/codebase-structure.md#environment-policy) for details.
