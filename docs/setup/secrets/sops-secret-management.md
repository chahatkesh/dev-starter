# SOPS Secret Management

This project uses [SOPS](https://github.com/getsops/sops) with [age](https://github.com/FiloSottile/age) for Git-safe encrypted environment files.

Local development and production secrets are modeled in `secrets/`.

## Install Tools

```bash
brew install age sops
```

## Generate An Age Key

Run these from the repo root:

```bash
age-keygen -o .age-key.txt
chmod 600 .age-key.txt
grep '^# public key:' .age-key.txt
```

Copy the printed public key into [.sops.yaml](../../../.sops.yaml). Keep the private key file local only.

This project already ships with encrypted `secrets/*.enc.yaml` files. If you are bootstrapping a fresh clone, generate a new key, update `.sops.yaml`, then re-encrypt the secret files with `pnpm secrets:updatekeys` or recreate them with `pnpm secrets:edit`.

Set the key file for manual SOPS commands:

```bash
export SOPS_AGE_KEY_FILE="$PWD/.age-key.txt"
```

Optional shell profile entry:

```bash
echo 'export SOPS_AGE_KEY_FILE="/Users/chahatkesharwani/Desktop/CODE/dev-starter/.age-key.txt"' >> ~/.zshrc
source ~/.zshrc
```

## Daily Commands

```bash
pnpm secrets:decrypt
pnpm secrets:decrypt:production
pnpm secrets:edit
pnpm secrets:edit:production
pnpm secrets:updatekeys
```

Equivalent Make targets:

```bash
make decrypt-local
make decrypt-production
make edit-local
make edit-production
make update-secret-keys
```

## Files

```text
.age-key.txt                    # local only, gitignored
.sops.yaml                      # committed SOPS recipient rules
secrets/local.enc.yaml          # encrypted local env
secrets/production.enc.yaml     # encrypted production env
.env                            # generated local env, gitignored
.env.production                 # generated production env, gitignored
```

## Initializing Secret Files

After generating `.age-key.txt` and updating `.sops.yaml`, create or edit encrypted files with:

```bash
pnpm secrets:edit
pnpm secrets:edit:production
```

SOPS decrypts into a temporary editor buffer and re-encrypts on save.

## Security Rules

- Commit encrypted `secrets/*.enc.yaml` only.
- Never commit `.age-key.txt`, `.env`, `.env.production`, decrypted YAML, API keys, tokens, or private user data.
- Never paste age secret keys or decrypted values into chat, logs, issue trackers, PR descriptions, or commit messages.
- Use `NEXT_PUBLIC_*` only for non-secret values that are safe to expose to browsers.

## Key Rotation

```bash
age-keygen -o .age-key-new.txt
chmod 600 .age-key-new.txt
grep '^# public key:' .age-key-new.txt
```

Then:

1. Replace the age recipient in `.sops.yaml` with the new public key.
2. Decrypt with the old key still available.
3. Run `SOPS_AGE_KEY_FILE=.age-key-new.txt pnpm secrets:updatekeys`.
4. Move `.age-key-new.txt` to `.age-key.txt` after confirming decrypt works.
5. Share the new private key only through the approved password manager.
