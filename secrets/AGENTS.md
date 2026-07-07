# secrets/AGENTS.md

Rules for encrypted environment files. Read after the root [AGENTS.md](../AGENTS.md).

## What lives here

- SOPS-encrypted environment files only: `local.enc.yaml` and `production.enc.yaml`.
- Files are encrypted with [age](https://github.com/FiloSottile/age) using recipients in [.sops.yaml](../.sops.yaml).
- Staging secrets are intentionally not modeled in this repo.

## Hard rules

- Never commit plaintext `.env`, `.env.production`, decrypted YAML, API keys, tokens, or private user data.
- Never commit `.age-key.txt`; it is gitignored and lives at the repo root for local decryption.
- Always edit encrypted files through SOPS. Direct plaintext edits corrupt the workflow and risk leaks.
- Never paste secrets into commit messages, PR descriptions, logs, or chat output.

## Workflow

- `pnpm secrets:decrypt` writes `.env` from `secrets/local.enc.yaml`.
- `pnpm secrets:decrypt:production` writes `.env.production` from `secrets/production.enc.yaml`.
- `pnpm secrets:edit` edits local secrets.
- `pnpm secrets:edit:production` edits production secrets.

The Make targets behind these scripts live in [Makefile](../Makefile). They set `SOPS_AGE_KEY_FILE=.age-key.txt` for you.

## Adding a new secret

1. Classify the value first. Only credentials, signing/encryption material, private tokens, and similarly sensitive values belong here.
2. `pnpm secrets:edit` or `pnpm secrets:edit:production` and add the same granular key to each required environment.
3. Add validation in [lib/env.ts](../lib/env.ts) when app code consumes the value.
4. Add the key to [.env.example](../.env.example) with a safe placeholder or commented example.
5. Wire the key through Docker, CI, or the hosting platform when that runtime consumes it. Never expose secrets through `NEXT_PUBLIC_*`.

Required auth keys in encrypted env files: `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
