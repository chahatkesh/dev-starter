# Workers

Long-running daemon entrypoints live here. Keep one-shot maintenance, migration, seed, and check commands in [scripts/](../scripts/).

No production worker is required yet. Add `run-<name>-worker.ts` when a durable background workflow exists.
