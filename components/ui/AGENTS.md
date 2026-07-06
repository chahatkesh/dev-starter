# components/ui/AGENTS.md

Rules for UI primitives.

- Keep this folder framework-level and business-logic-free.
- Prefer accessible primitives and stable props over page-specific styling.
- Do not import services, database helpers, or environment-only modules here.
- Labels, placeholders, and aria text should be passed in from callers using `@shared/app-strings`.
- Pages and feature components should compose these primitives instead of copying Tailwind class strings.

## Primitives

| File              | Export       | Notes                                        |
| ----------------- | ------------ | -------------------------------------------- |
| `button.tsx`      | `Button`     | `primary`, `secondary`, `ghost` variants     |
| `button-link.tsx` | `ButtonLink` | Next.js `Link` with button styling           |
| `badge.tsx`       | `Badge`      | Mono pill for stack tags and metadata        |
| `input.tsx`       | `Input`      | Base text input                              |
| `input.tsx`       | `Field`      | Label + `Input` wrapper                      |
| `card.tsx`        | `Card`       | Bordered panel container                     |
| `alert.tsx`       | `Alert`      | Inline error/status message                  |
| `text-link.tsx`   | `TextLink`   | Internal `Link` or external `<a>`            |
| `page-shell.tsx`  | `PageShell`  | Shared page layout with optional footer slot |

Shared class merging lives in [lib/cn.ts](../../lib/cn.ts).
