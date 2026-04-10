# Development Infrastructure

This document describes the development infrastructure setup for this project.

## Prerequisites

- [Docker](https://www.docker.com/) or [Colima](https://github.com/abiosoft/colima) (for macOS)
- [mprocs](https://github.com/pvolok/mprocs) - Process manager for development
- [pnpm](https://pnpm.io/) - Package manager

## Setup

1. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```

2. **Start Docker (if using Colima on macOS)**
   ```bash
   colima start
   ```

3. **Start all development services**
   ```bash
   mprocs
   ```

   This will start:
   - PostgreSQL database (Docker)
   - Main Next.js app (port 3000)
   - Landing page app (port 3001)
   - Database Studio (Prisma Studio) - manual start only

## Manual Commands

### Database

- **Start database only**
  ```bash
  pnpm docker:dev
  ```

- **Stop database**
  ```bash
  pnpm docker:dev:down
  ```

- **View database logs**
  ```bash
  pnpm docker:dev:logs
  ```

- **Open Prisma Studio**
  ```bash
  pnpm db:studio
  ```

- **Run migrations**
  ```bash
  pnpm db:migrate
  ```

- **Generate Prisma Client**
  ```bash
  pnpm db:generate
  ```

### Applications

- **Main app**
  ```bash
  pnpm dev
  ```

- **Landing page**
  ```bash
  cd landing && pnpm dev
  ```

## Database Connection

Default development database connection:
```
postgresql://postgres:postgres@localhost:5432/myapp_dev
```

## mprocs Configuration

The `mprocs.yaml` file defines all development processes. You can create a `mprocs.local.yaml` file (git-ignored) to override settings for your local environment.

### Process Control in mprocs

- `s` - Stop a process
- `r` - Restart a process
- `a` - Toggle autostart
- `x` - Kill a process
- `q` - Quit mprocs
- Arrow keys - Navigate between processes
- `Enter` - Focus on a process output

## Troubleshooting

### Docker not starting

If you see "Cannot connect to the Docker daemon":
- Make sure Docker Desktop is running, or
- If using Colima: `colima start`

### Port already in use

If port 5432 is already in use:
- Check if PostgreSQL is already running: `lsof -i :5432`
- Stop the running instance or change the port in docker-compose.dev.yml
