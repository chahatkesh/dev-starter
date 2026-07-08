#!/usr/bin/env bash
# PreToolUse: block full reads of very large files; use scoped reads or rg instead.
set -euo pipefail

MAX_BYTES=512000

if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]]; then
  exit 0
fi

LIMIT=$(echo "$INPUT" | jq -r '.tool_input.limit // empty')
if [[ -n "$LIMIT" && "$LIMIT" != "null" ]]; then
  exit 0
fi

SIZE=$(stat -c%s "$FILE_PATH" 2>/dev/null || stat -f%z "$FILE_PATH" 2>/dev/null || echo 0)

if [[ "$SIZE" -gt "$MAX_BYTES" ]]; then
  jq -n --arg path "$FILE_PATH" --argjson size "$SIZE" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: ("File is " + ($size|tostring) + " bytes (>500KB). Re-read with offset/limit or use rg: " + $path)
    }
  }'
fi

exit 0
