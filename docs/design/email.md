# Email Service Documentation

## Overview

The email service handles sending transactional emails using Resend API and React Email templates.

## Architecture

**Location:** `services/email/`

### Key Components

- **[service.ts](../services/email/service.ts)** - Main email service class
- **[config.ts](../services/email/config.ts)** - Resend client and email configuration
- **[types.ts](../services/email/types.ts)** - TypeScript types for email templates
- **[templates/](../services/email/templates/)** - React Email templates

## Configuration

Set up environment variables in `.env`:

```env
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@example.com"
```

## Available Templates

### Account Created Email

Sent when a user successfully registers an account.

**Template:** `account-created.tsx`

**Usage:**

```typescript
import { EmailService } from '@/services/email';

await EmailService.sendAccountCreated({
  to: 'user@example.com',
  userName: 'John Doe',
  loginUrl: 'https://example.com/login'
});
```

**Template Data:**
- `userName` - Name of the user
- `loginUrl` - URL to login page

## Email Service API

### `EmailService.send(config: EmailConfig)`

Low-level method to send any email with a template.

```typescript
await EmailService.send({
  to: 'user@example.com',
  subject: 'Welcome',
  template: {
    type: 'account-created',
    data: {
      userName: 'John Doe',
      loginUrl: 'https://example.com/login'
    }
  }
});
```

**Returns:** `Promise<EmailResult>`

```typescript
{
  success: boolean;
  id?: string;        // Resend email ID
  error?: unknown;    // Error if failed
}
```

### `EmailService.sendAccountCreated(params)`

Convenience method for sending account creation emails.

**Parameters:**
- `to` - Recipient email address
- `userName` - User's name
- `loginUrl` - Login page URL

**Returns:** `Promise<EmailResult>`

## Adding New Templates

1. Create a new React Email template in `services/email/templates/`
2. Export it from `services/email/templates/index.ts`
3. Add the template type to `EmailTemplate` in `services/email/types.ts`
4. Update the switch case in `EmailService.getTemplateComponent()`
5. Add a convenience method to `EmailService` class
