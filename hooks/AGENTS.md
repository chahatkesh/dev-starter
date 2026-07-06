# hooks/AGENTS.md

Rules for React hooks.

- Hooks are client-side orchestration only. Put server work in route handlers or services.
- Prefix files with `use-` and export named hooks.
- Keep fetch/mutation helpers generic. Domain-specific workflows should live in services and expose route APIs.
- User-visible hook messages should come from `@shared/app-strings`.
