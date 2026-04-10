<div align="center">
  <img src="landing/public/logo.png" alt="Shuriken logo" width="200" />
  <h1>Shuriken</h1>
</div>

Shuriken is a sharp, production-ready Next.js starter for teams that want a clean, intentional foundation. It makes strong, battle-tested choices so you don’t have to.

The template is inspired by the development environment from my company, [zenbasehq/ninja](https://github.com/zenbasehq).

## Split Architecture

Shuriken runs two Next.js applications that deploy independently.

### Landing app (port 3001)

The landing app lives in the `landing/` directory. This is your public marketing site and the equivalent of `shuriken.com`. It is optimized for fast load times and clean SEO, and it can be deployed to a CDN edge with minimal runtime requirements.

### Main app (port 3000)

The main app lives in the root `app/` directory. This is your product and the equivalent of `app.shuriken.com`. It contains the dashboard, protected routes, and server-side API endpoints. Database access and server-only logic live here.

This separation keeps marketing fast and simple while letting the application scale independently.

## Why these tools

Shuriken is not a grab bag of libraries. Each tool exists to solve a concrete problem with minimal overhead.

- Next.js provides routing, server components, and deployment flexibility in one framework.
- TypeScript keeps the codebase strict and safe.
- Prisma gives a type-safe ORM and predictable migrations.
- Zod validates API inputs and environment variables early.
- Tailwind CSS provides fast, consistent styling.
- shadcn/ui gives a clean component system on top of Radix primitives.
- SWR handles client-side data fetching with cache and revalidation.
- Pino provides structured logging in development.
- Biome replaces ESLint and Prettier with a fast formatter and linter.
- Husky + lint-staged enforce clean commits.
- pnpm keeps installs fast and deterministic.
- Docker enables reproducible production builds.
- SOPS protects secrets across environments.
- mprocs runs the landing app, main app, and database together.

## Quick start

### Requirements

- Node.js 20+
- pnpm
- PostgreSQL (or Docker)
- [age](https://github.com/FiloSottile/age) and [sops](https://github.com/mozilla/sops) for secret decryption
- [mprocs](https://github.com/pvolok/mprocs) (optional, for running all services together)

```bash
# macOS
brew install age sops mprocs
```

See [docs/setup/secrets/sops-secret-management.md](docs/setup/secrets/sops-secret-management.md) for installation on other platforms and full SOPS setup.

### Install

```bash
git clone git@github.com:RishiAhuja/shuriken.git
cd shuriken
pnpm install
```

### Environment

Secrets are encrypted in `secrets/*.enc.yaml` using SOPS + age. To decrypt them into `.env`:

1. Get the age secret key from your team lead and save it:

```bash
echo "AGE-SECRET-KEY-xxxxxxxxxx" > .age-key.txt
chmod 600 .age-key.txt
```

2. Decrypt secrets for local development:

```bash
pnpm secrets:decrypt
```

This generates `.env` from `secrets/local.enc.yaml`. See [.env.example](.env.example) for the full list of variables.

> To edit secrets: `pnpm secrets:edit` opens the encrypted file in your editor, then re-encrypts on save.

### Database

```bash
pnpm db:migrate
pnpm db:seed
```

### Run both apps

```bash
mprocs
```

This starts the database (via Docker), the main app, and the landing app together. Landing runs at [http://localhost:3001](http://localhost:3001). The main app runs at [http://localhost:3000](http://localhost:3000).

Alternatively, run each app individually:

```bash
pnpm dev          # Main app only
cd landing && pnpm dev  # Landing app only
```

## Project layout

```
shuriken/
├── app/                        # Main app routes and API (port 3000)
├── landing/                    # Landing app (port 3001)
├── components/                 # Shared UI components (shadcn/ui)
├── hooks/                      # Shared React hooks
├── lib/                        # Core utilities (auth, db, env, logging)
├── services/                   # Business logic (auth, email)
├── packages/database/          # Prisma schema and migrations
├── secrets/                    # SOPS-encrypted environment secrets
├── infrastructure/             # Docker and deployment configuration
├── scripts/                    # Development scripts
└── docs/                       # Documentation
```

Place your logo at `landing/public/logo.png` to update it in the landing navbar and hero section.

## Deployment

You can deploy the landing app separately from the main app. This allows `shuriken.com` to stay fast and static while `app.shuriken.com` scales for authenticated traffic. Docker configuration is provided for production environments if you want a containerized setup.

```bash
docker build -f infrastructure/dockerfiles/Dockerfile.prod -t shuriken .
docker compose -f infrastructure/docker/docker-compose.prod.yml up -d
```

### Railway / Render / Fly.io

Point to `infrastructure/dockerfiles/Dockerfile.prod` and configure environment variables.

## Performance

- Standalone Next.js output for minimal bundle
- Turbopack dev server
- Server Components for reduced JavaScript
- Prisma connection pooling
- Redis caching (optional)

## Security

- SOPS + age encryption for secrets (no plaintext `.env` in Git)
- Zod validation for all API inputs and environment variables
- Secure password hashing (bcrypt)
- Session-based authentication with expiration
- CORS configuration
- In-memory rate limiting on auth endpoints

### Rate limiting

`lib/rate-limit.ts` implements a sliding window rate limiter applied to the login and register routes. Each client IP is tracked in a `Map` with a request count and a window expiry. Once the count exceeds the configured limit, the endpoint returns `429 Too Many Requests` with a `Retry-After` header.

Default limits: **10 requests per 60 seconds** for auth routes. The store cleans up expired entries every 60 seconds to prevent unbounded memory growth.

This is an in-memory implementation — it resets on process restart and does not share state across multiple instances. For multi-instance deployments, swap the store for Redis using `INCR` / `EXPIRE`.

## Troubleshooting

**Port in use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Prisma out of sync:**
```bash
pnpm db:generate
```

**Docker issues:**
```bash
pnpm docker:dev:down
docker system prune -a
pnpm docker:dev
```

**Secrets decryption failing:**
```bash
# Ensure the age key file exists and SOPS can find it
export SOPS_AGE_KEY_FILE=.age-key.txt
pnpm secrets:decrypt
```

See [docs/setup/secrets/sops-secret-management.md](docs/setup/secrets/sops-secret-management.md) for detailed troubleshooting.

## Contributing

1. Fork repository
2. Create feature branch
3. Run `pnpm lint` and `pnpm type-check`
4. Submit pull request

## License

MIT. See [LICENSE](LICENSE) for details.

Copyright (c) 2026 Rishi Ahuja

## Support

Open a GitHub issue for questions or problems.
