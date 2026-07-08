#!/usr/bin/env bash
# PreToolUse: block destructive history/worktree operations and require approval for Git writes.
set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [[ -z "$COMMAND" ]]; then
  exit 0
fi

DENY_REASON=""
ASK_REASON=""

if echo "$COMMAND" | grep -qE 'git[[:space:]]+push([^;&|]*)(--force-with-lease|--force|-f)([[:space:]]|$)'; then
  DENY_REASON="force-pushing is blocked by the project safety hook"
elif echo "$COMMAND" | grep -qE 'git[[:space:]]+reset[[:space:]]+--hard([[:space:]]|$)'; then
  DENY_REASON="git reset --hard is blocked because it can discard shared worktree changes"
elif echo "$COMMAND" | grep -qE 'git[[:space:]]+clean[[:space:]]+-[^[:space:]]*[fdx]'; then
  DENY_REASON="destructive git clean is blocked because it can remove untracked work"
elif echo "$COMMAND" | grep -qE 'git[[:space:]]+restore[[:space:]]+--staged([[:space:]]|$)'; then
  ASK_REASON="unstaging files changes shared Git state; verify the exact paths with the user"
elif echo "$COMMAND" | grep -qE 'git[[:space:]]+(checkout[[:space:]]+--|restore|branch[[:space:]]+-D)([[:space:]]|$)'; then
  DENY_REASON="the requested git operation can discard work and is blocked by the project safety hook"
elif echo "$COMMAND" | grep -qE 'git[[:space:]]+(commit|push|tag)([[:space:]]|$)'; then
  ASK_REASON="commits, pushes and tags require explicit user approval; verify scope, message and target branch"
fi

if [[ -n "$DENY_REASON" ]]; then
  jq -n --arg reason "$DENY_REASON" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
elif [[ -n "$ASK_REASON" ]]; then
  jq -n --arg reason "$ASK_REASON" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "ask",
      permissionDecisionReason: $reason
    }
  }'
fi

exit 0
