<!--
Title: <type>(<optional-scope>): <imperative summary>
Default base: main. main is production.
Remove comments and sections that genuinely do not apply; never mark an unchecked activity as complete.
-->

## Problem and outcome

<!-- What user, operator or engineering problem does this solve? What outcome should exist after merge? -->

## Change summary

- <!-- Important change and why -->

## Related issue

<!-- Use Closes #123, Fixes #123 or Refs #123. Write "None" only when no issue is appropriate. -->

## Feature contract

<!-- Feature-level change: link/paste the completed contract. Tiny change: goal/change/risk mini-contract and exemption reason. -->

- **Surface:**
- **Interaction:**
- **Engine:**
- **Data/runtime:**

## Risk, rollout and rollback

- **Risk level:** low / medium / high
- **Rollout:**
- **Rollback or mitigation:**
- **Data/migration impact:** none / describe

## Documentation and configuration

- [ ] Nearest `AGENTS.md` reviewed or updated
- [ ] Related internal/public docs updated, or skip reason stated below
- [ ] `.env.example`, SOPS and deployment wiring updated when configuration changed

<!-- Documentation/configuration notes or explicit skip reason -->

## Verification

- [ ] Dependencies installed with the owning lockfile
- [ ] `pnpm format:check` passed
- [ ] Applicable lint and type-check passed
- [ ] Relevant automated tests passed
- [ ] Affected production build passed
- [ ] Manual verification completed or explicitly not required

<!-- Exact commands, results and manual scenarios. Do not claim checks that did not run. -->
