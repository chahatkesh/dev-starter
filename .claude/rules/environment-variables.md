---
paths:
  - ".env.example"
  - "lib/env.ts"
  - "secrets/**"
  - "infrastructure/**"
  - ".github/workflows/**"
---

# Environment Variable Contract

- Supported app environments are `development`, `test`, and `production`.
- Keep runtime secrets out of git. Document only non-secret contracts in `.env.example`.
- Update validation/access, `.env.example`, SOPS/deployment wiring, and docs in the same change when configuration changes.
- Document purpose, requirement, security/build scope and numeric units.
- Never put real credentials in example files.
- Never put secrets in `NEXT_PUBLIC_*`; those values are bundled for the browser.
- Re-run affected quality gates before finishing.
