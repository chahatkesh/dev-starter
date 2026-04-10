# Authentication System Documentation

## Overview

This project implements a scalable authentication system using a split architecture with two Next.js applications:

- **Landing App** (Port 3001): Frontend-only app containing all authentication UI (login, signup, etc.)
- **Main App** (Port 3000): Full-stack app with the backend API and protected routes

## Architecture

### Authentication Flow

1. User visits Main App (3000) without authentication → Redirected to Landing App (3001) login
2. User submits login/signup form on Landing App (3001) → API call to Main App (3000)
3. Main App authenticates and sets session cookie → Redirects back to Main App
4. User accesses protected routes on Main App → Middleware validates session

### Key Components

#### Main App (Port 3000)

**Backend Services:**
- [lib/auth/password.ts](lib/auth/password.ts) - Password hashing/verification using scrypt
- [lib/auth/session.ts](lib/auth/session.ts) - Session management with cookies
- [lib/auth/validation.ts](lib/auth/validation.ts) - Zod schemas for validation
- [services/auth/auth-service.ts](services/auth/auth-service.ts) - Core auth business logic
- [lib/db.ts](lib/db.ts) - Prisma database client

**API Routes:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

**Middleware:**
- [middleware.ts](middleware.ts) - Protects all routes, redirects unauthenticated users to Landing App

#### Landing App (Port 3001)

**Frontend Pages:**
- [app/(auth)/login/page.tsx](landing/app/(auth)/login/page.tsx) - Login form
- [app/(auth)/signup/page.tsx](landing/app/(auth)/signup/page.tsx) - Signup form
- [lib/auth-api.ts](landing/lib/auth-api.ts) - API client for auth endpoints

## Database Schema

The authentication system uses the following Prisma models:

```prisma
model User {
  id           String        @id @default(uuid())
  name         String
  email        String        @unique
  passwordHash String?
  avatarUrl    String?
  phone        String?
  status       AccountStatus @default(ACTIVE)
  lastLoginAt  DateTime?
  sessions     Session[]
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  ip        String?
  userAgent String?
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

## Setup Instructions

### 1. Environment Variables

**Main App (.env):**
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/myapp_dev"
NEXT_PUBLIC_LANDING_URL="http://localhost:3001"
NEXT_PUBLIC_MAIN_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Landing App (.env.local):**
```bash
NEXT_PUBLIC_MAIN_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 2. Database Migration

Run the Prisma migration to update the database schema:

```bash
pnpm db:migrate
```

### 3. Install Dependencies

Both apps should already have the necessary dependencies. If needed:

```bash
# Main App
pnpm install

# Landing App
cd landing && pnpm install
```

### 4. Run Both Apps

**Option 1: Using separate terminals**
```bash
# Terminal 1 - Main App
pnpm dev

# Terminal 2 - Landing App
cd landing && pnpm dev
```

**Option 2: Using mprocs (if configured)**
```bash
mprocs
```

## API Reference

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "+1234567890" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe"
    },
    "session": {
      "id": "session-uuid",
      "userId": "uuid",
      "expiresAt": "2026-02-27T..."
    }
  }
}
```

### POST /api/auth/login

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe"
    },
    "session": {
      "id": "session-uuid",
      "userId": "uuid",
      "expiresAt": "2026-02-27T..."
    }
  }
}
```

### GET /api/auth/session

Get current authenticated session.

**Response (200):**
```json
{
  "success": true,
  "authenticated": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe",
      "avatarUrl": null,
      "status": "ACTIVE"
    }
  }
}
```

### POST /api/auth/logout

Logout current user.

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## Security Features

1. **Password Security:**
   - Minimum 8 characters
   - Requires uppercase, lowercase, and numbers
   - Hashed using scrypt with random salt

2. **Session Management:**
   - HTTP-only cookies (not accessible via JavaScript)
   - 30-day expiration
   - Secure flag in production
   - SameSite=Lax for CSRF protection

3. **CORS Configuration:**
   - Configured to allow requests from Landing App
   - Credentials included for cookie sharing

4. **Route Protection:**
   - Middleware validates all non-public routes
   - Automatic redirect to login with return URL
   - Session verified on each request

## Testing the Flow

1. Start both apps (Main: 3000, Landing: 3001)
2. Navigate to `http://localhost:3000` (Main App)
3. You should be redirected to `http://localhost:3001/login?redirect=http://localhost:3000`
4. Register or login on the Landing App
5. After successful authentication, you'll be redirected back to Main App
6. Try accessing protected routes - they should work
7. Logout using the API or by clearing cookies

## Troubleshooting

### Cookies Not Being Set

- Ensure both apps are running on localhost (not 127.0.0.1)
- Check browser dev tools → Application → Cookies
- Verify CORS headers in Network tab

### Redirects Not Working

- Check environment variables are set correctly
- Ensure middleware matcher is configured properly
- Verify the `redirect` query parameter is being passed

### Database Connection Issues

- Confirm PostgreSQL is running
- Check DATABASE_URL is correct
- Run `pnpm db:push` to sync schema

## Future Enhancements

- [ ] Email verification
- [ ] Password reset flow
- [ ] Two-factor authentication
- [ ] OAuth providers (Google, GitHub, etc.)
- [ ] Rate limiting
- [ ] Session management UI
- [ ] Remember me functionality
