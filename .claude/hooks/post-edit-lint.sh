#!/usr/bin/env bash
# PostToolUse: quietly format edited files and lint script/code files with the root toolchain.
set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]]; then
  exit 0
fi

PROJECT_DIR=${CLAUDE_PROJECT_DIR:-$(pwd)}

case "$FILE_PATH" in
  "$PROJECT_DIR"/node_modules/*|"$PROJECT_DIR"/.next/*|"$PROJECT_DIR"/packages/database/generated/*)
    exit 0
    ;;
esac

cd "$PROJECT_DIR"

case "$FILE_PATH" in
  *.css|*.json|*.md|*.mdx|*.yml|*.yaml|*.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs)
    pnpm exec prettier --write "$FILE_PATH" >/dev/null 2>&1 || true
    ;;
esac

case "$FILE_PATH" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs)
    pnpm exec eslint --fix "$FILE_PATH" >/dev/null 2>&1 || true
    ;;
esac

exit 0
