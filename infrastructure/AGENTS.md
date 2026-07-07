# infrastructure/AGENTS.md

Rules for deployment/runtime infrastructure.

- This repo tracks local development and production infrastructure.
- Docker runtime files live under `infrastructure/docker/` and `infrastructure/dockerfiles/`.
- Reverse proxy templates live under `infrastructure/nginx/`.
- Keep app secrets out of this directory; document required keys in [.env.example](../.env.example) and secret handling in [secrets/](../secrets/).
