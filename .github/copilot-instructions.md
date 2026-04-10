# Copilot Instructions

## Core Principles
- Simple, readable code over clever solutions
- Explicit over implicit behavior
- Pure functions where possible
- One responsibility per file/function/class

## Code Organization
- `/lib` - Utilities & shared logic
- `/services` - Business logic & integrations
- `/components` - React UI components
- `/hooks` - Custom React hooks
- `/app/api` - API routes
- `/app` - Pages & layouts

## TypeScript
- Strict mode always
- Avoid `any` - use `unknown` or proper types
- Type inference where clear, explicit where helpful

## Error Handling & Logging
**NEVER use console.* in backend** - use `logger` from `@/lib/logger`

```typescript
// ✅ Correct
logger.info({ userId, email }, 'User logged in');
logger.error({ error: err.message }, 'Failed');

// ❌ Forbidden in /app/api, /services, /lib
console.log('...');
```

## Functions & Components
- Small (10-20 lines ideal)
- Descriptive names (verb + noun)
- Max 3-4 params (use objects for more)
- One component per file
- Extract logic to hooks

## Database & API
- Prisma for all DB operations
- Zod validation for inputs
- Queries in service layer, not routes
- Transactions for multi-step ops
- Proper HTTP status codes

## Security
- Validate all inputs
- Use env vars for secrets
- Logger auto-redacts PII (passwords, tokens)
- Rate limiting on public endpoints


## UI Components (shadcn/ui)

### Design System
- **Theme**: Indigo (Primary) + Emerald (Success) + Amber (Warning)
- **Personality**: Professional, Modern, Clean
- **Architecture**: shadcn/ui (Radix) + CVA variants

### Design Tokens
**NEVER hardcode colors** - use CSS variables only:

```typescript
// ✅ Correct
className="bg-primary text-primary-foreground"

// ❌ Forbidden
className="bg-blue-600"
style={{ color: '#4F46E5' }}
```

**Intent Mapping**:
- Primary (Indigo): Main CTAs, active states, highlights
- Success (Emerald): Positive actions, achievements, success
- Warning (Amber): Caution, warnings, pending
- Destructive (Red): Delete, errors, danger only

### Component Pattern (CVA)
```typescript
const variants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      success: "bg-success text-success-foreground",
      warning: "bg-warning text-warning-foreground",
      destructive: "bg-destructive text-destructive-foreground",
    },
    size: { sm: "h-8", default: "h-9", lg: "h-10" }
  }
});
```

### Style Rules
- Spacing: 8px grid (`gap-2`, `gap-4`, `gap-6`)
- Typography: Inter font, min 14px, headings 600-700 weight
- Radius: Use `--radius` variable
- Shadows: Soft only (`shadow-sm`, `shadow-md`)
- Motion: Subtle 150-200ms, no bounce/elastic
- Focus: `focus-visible:ring-ring/50`
- Touch target: ≥ 44px for buttons

### Accessibility
- Min font 14px (12px for metadata only)
- WCAG AA contrast
- Visible focus indicators
- Proper ARIA attributes

### Forbidden
- Hardcoded colors
- Playful animations
- Heavy shadows/borders
- Font < 14px (except metadata)

## Code Review Checklist
- [ ] No console.* in backend (use logger)
- [ ] Errors logged with context
- [ ] Design tokens only (no hardcoded colors)
- [ ] Proper TypeScript types
- [ ] Environment variables for secrets
- [ ] Focus states on interactive elements
