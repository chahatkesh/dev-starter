# Infrastructure

Local and production runtime contracts for the single Dev Starter app.

## Local Docker

- Run local services: `pnpm docker:dev`
- Stop local services: `pnpm docker:dev:down`
- Tail local logs: `pnpm docker:dev:logs`
- Local stack: [docker/docker-compose.dev.yml](docker/docker-compose.dev.yml)
- Default database URL: `postgresql://postgres:postgres@localhost:5432/dev_starter_dev`

## Production

- Build image: [dockerfiles/Dockerfile.prod](dockerfiles/Dockerfile.prod)
- Run stack: [docker/docker-compose.prod.yml](docker/docker-compose.prod.yml)
- Health check: `/api/health`
- Reverse proxy template: [nginx/dev-starter.conf](nginx/dev-starter.conf)
