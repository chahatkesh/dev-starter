# tests/AGENTS.md

Rules for automated tests.

- Root app tests live under `tests/unit/app/`.
- Package tests live under `tests/unit/packages/<package-name>/` (`database`, `shared`, etc.).
- Lib helper tests live under `tests/unit/lib/`.
- Keep tests behavior-focused and avoid relying on real network, database, or production secrets.
- Use Vitest for unit tests and add fixtures/helpers under `tests/` when shared by more than one test.
