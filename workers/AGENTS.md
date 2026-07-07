# workers/AGENTS.md

Rules for long-running worker processes. One-shot scripts belong in [scripts/](../scripts/).

## What belongs here

- Daemons that poll, subscribe, or process durable queues.
- Entrypoints named `run-<name>-worker.ts`.

## Pattern

- Keep worker files thin. Put reusable processing logic in [services/](../services/).
- Use `createShutdownHandler()` and `sleep()` from [lib/workers/worker-utils.ts](../lib/workers/worker-utils.ts).
- Set `process.exitCode = 1` for top-level failures so supervisors can restart the process.
- Add a `worker:<name>` package script when a worker becomes real.
- Production workers must also be wired into [infrastructure/docker/docker-compose.prod.yml](../infrastructure/docker/docker-compose.prod.yml).
