---
name: dev-starter-issue
description: Search and create a standardized GitHub issue when explicitly requested.
---

# Repository Issue

Only run when the user explicitly asks to create an issue in the current message.

## Workflow

1. Search open and closed issues for the same observable problem or outcome.
2. Select bug, feature or engineering-task form from [.github/ISSUE_TEMPLATE/](../../../.github/ISSUE_TEMPLATE/).
3. Use `[Bug]`, `[Feature]` or `[Task]` followed by a concise outcome title.
4. Fill every required field with verified repository context, including **Affected area** when known.
5. Prefer the GitHub issue form UI so template labels and the issue labeler can apply area/risk labels automatically.
6. Remove secrets, decrypted configuration, raw personal data and private security detail.
7. Create the issue and return its URL, title, labels and any duplicate/related issues found.

## Label automation

- Canonical label names and colors live in [.github/labels.yml](../../../.github/labels.yml).
- Issue forms apply `type:bug`, `type:feature`, or `type:chore`.
- [.github/workflows/issue-labeler.yml](../../../.github/workflows/issue-labeler.yml) adds area, `security`, and `risk:*` labels from the issue title, **Affected area** field, and body keywords.
- When creating issues via `gh issue create`, include the same title prefix and form-style sections if you need automated area/risk labels.
