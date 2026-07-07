# Secrets

This directory contains SOPS-encrypted environment files.

- `local.enc.yaml` decrypts to `.env`.
- `production.enc.yaml` decrypts to `.env.production`.
- `.age-key.txt` is the local age private key and must never be committed.

See [SOPS secret management](../docs/setup/secrets/sops-secret-management.md) for setup, key generation, editing, decryption, and rotation commands.
