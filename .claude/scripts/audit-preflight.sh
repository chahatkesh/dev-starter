#!/usr/bin/env bash
# Deep codebase audit preflight - blocking gate before audit runs.
# Exit 0 only when gh auth + issue-create permission + Node 24 pass.
# Usage: .claude/scripts/audit-preflight.sh [--skip-mem] [--install-mem] [--install-deps]

set -euo pipefail

SKIP_MEM=0
INSTALL_MEM=0
INSTALL_DEPS=0

for arg in "$@"; do
  case "$arg" in
    --skip-mem) SKIP_MEM=1 ;;
    --install-mem) INSTALL_MEM=1 ;;
    --install-deps) INSTALL_DEPS=1 ;;
    -h|--help)
      echo "Usage: $0 [--skip-mem] [--install-mem] [--install-deps]"
      exit 0
      ;;
    *)
      echo "Unknown flag: $arg" >&2
      exit 1
      ;;
  esac
done

fail() {
  echo "PREFLIGHT_BLOCKED: $1" >&2
  exit 1
}

info() {
  echo "PREFLIGHT_INFO: $1"
}

if ! command -v gh >/dev/null 2>&1; then
  fail "GitHub CLI (gh) not found. Install from https://cli.github.com/."
fi
info "gh installed: pass"

if ! gh auth status >/dev/null 2>&1; then
  fail "GitHub CLI not authenticated. Run: gh auth login"
fi
GH_USER=$(gh auth status 2>&1 | sed -n 's/.*Logged in to github.com account \([^ ]*\).*/\1/p' | head -1)
info "gh authenticated: pass (${GH_USER:-unknown})"

if ! gh repo view >/dev/null 2>&1; then
  fail "Cannot resolve GitHub repo from current directory. Run from repo root and retry."
fi
OWNER=$(gh repo view --json owner -q .owner.login)
REPO=$(gh repo view --json name -q .name)
info "repo resolved: pass (${OWNER}/${REPO})"

PERM=$(gh api graphql -f query='query($o:String!,$n:String!){repository(owner:$o,name:$n){viewerPermission}}' -f o="$OWNER" -f n="$REPO" -q .data.repository.viewerPermission 2>/dev/null || echo "")

case "$PERM" in
  WRITE|MAINTAIN|ADMIN)
    info "issue create permission: pass (${PERM})"
    ;;
  *)
    fail "Insufficient GitHub permission (${PERM:-none}) on ${OWNER}/${REPO}. Need WRITE, MAINTAIN, or ADMIN."
    ;;
esac

if ! gh issue list --limit 1 --state all >/dev/null 2>&1; then
  fail "gh issue list failed. Check token scopes."
fi

if ! command -v node >/dev/null 2>&1; then
  fail "Node.js not found. Use Node 24 for parity with CI and Docker."
fi
NODE_MAJOR=$(node --version | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" != "24" ]; then
  fail "Node 24 required for audit parity (found v${NODE_MAJOR})."
fi
info "node 24: pass ($(node --version))"

if [ ! -d node_modules ] || [ "$INSTALL_DEPS" -eq 1 ]; then
  if command -v pnpm >/dev/null 2>&1; then
    info "pnpm install: running..."
    pnpm install --frozen-lockfile
    info "pnpm deps: pass (installed)"
  else
    fail "pnpm not found. Run: corepack enable"
  fi
else
  info "pnpm deps: pass (node_modules present)"
fi

if [ "$SKIP_MEM" -eq 0 ] && [ "$INSTALL_MEM" -eq 1 ]; then
  if command -v npx >/dev/null 2>&1; then
    info "agent memory: attempting install..."
    if npx --yes claude-mem install 2>/dev/null; then
      info "agent memory: pass (installed)"
    else
      info "agent memory: skipped (install failed; audit can continue without it)"
    fi
  fi
elif [ "$SKIP_MEM" -eq 1 ]; then
  info "agent memory: skipped (--skip-mem)"
else
  info "agent memory: skipped (use --install-mem to auto-install)"
fi

echo "PREFLIGHT_PASS: all required checks passed for ${OWNER}/${REPO}"
exit 0
