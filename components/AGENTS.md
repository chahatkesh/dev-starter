# components/AGENTS.md

Rules for reusable React components. Read after the root [AGENTS.md](../AGENTS.md).

## Layout

- `components/ui/` is reserved for low-level UI primitives (`Button`, `Input`, `Card`, `PageShell`, etc.).
- `components/marketing/` holds reusable attribution and landing helpers.
- Feature folders under `components/` should match the domain they serve.
- Export stable cross-feature components through [index.ts](index.ts).
- Never hardcode user-facing copy in components. Import strings from `@shared/app-strings`.

## Patterns

- Prefer server components unless interactivity requires `"use client"`.
- Keep data loading in routes, server actions, hooks, or services. Components should receive data and callbacks through props.
- One significant component per file. Use PascalCase filenames for component files.
- Keep reusable text, formatting, and validation outside components when they are shared by routes or services.
- Use `components/ui/` primitives for buttons, inputs, cards, and layout shells. Do not duplicate Tailwind button/input styles in pages.
