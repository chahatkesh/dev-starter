#!/usr/bin/env bash
# Deep codebase audit - token and USD cost estimate (approximate).
# Read-only; no network. Exit 0 always (informational).
#
# Usage:
#   .claude/scripts/audit-cost-estimate.sh [--json] [--scope=full|quick]
#          [--with-mem] [--with-issue-filing] [--no-issue-filing]

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CONFIG="${ROOT}/.claude/audit-cost-config.json"
LOCAL_CONFIG="${ROOT}/.claude/audit-cost-config.local.json"

SCOPE="full"
OUTPUT_JSON=0
WITH_MEM=0
WITH_ISSUE_FILING=1

for arg in "$@"; do
  case "$arg" in
    --json) OUTPUT_JSON=1 ;;
    --scope=full) SCOPE="full" ;;
    --scope=quick) SCOPE="quick" ;;
    --with-mem) WITH_MEM=1 ;;
    --with-issue-filing) WITH_ISSUE_FILING=1 ;;
    --no-issue-filing) WITH_ISSUE_FILING=0 ;;
    -h|--help)
      echo "Usage: $0 [--json] [--scope=full|quick] [--with-mem] [--with-issue-filing|--no-issue-filing]"
      exit 0
      ;;
    *)
      echo "Unknown flag: $arg" >&2
      exit 1
      ;;
  esac
done

cd "$ROOT"

SCOPE_DIRS=(app services workers lib components hooks packages/database scripts)
TS_FILES=0
for d in "${SCOPE_DIRS[@]}"; do
  if [ -d "$d" ]; then
    n=$(find "$d" \( -name '*.ts' -o -name '*.tsx' \) 2>/dev/null | wc -l | tr -d ' ')
    TS_FILES=$((TS_FILES + n))
  fi
done

API_ROUTES=0
if [ -d app/api ]; then
  API_ROUTES=$(find app/api -name 'route.ts' 2>/dev/null | wc -l | tr -d ' ')
fi

WORKER_COUNT=0
if [ -d workers ]; then
  WORKER_COUNT=$(find workers -maxdepth 2 -name '*.ts' 2>/dev/null | wc -l | tr -d ' ')
fi

python3 - "$CONFIG" "$LOCAL_CONFIG" "$SCOPE" "$TS_FILES" "$API_ROUTES" "$WORKER_COUNT" "$WITH_MEM" "$WITH_ISSUE_FILING" "$OUTPUT_JSON" <<'PY'
import json
import os
import sys

config_path, local_path, scope, ts_files, api_routes, worker_count, with_mem, with_issue_filing, output_json = sys.argv[1:10]
ts_files = int(ts_files)
api_routes = int(api_routes)
worker_count = int(worker_count)
with_mem = with_mem == "1"
with_issue_filing = with_issue_filing == "1"
output_json = output_json == "1"

def load_config():
    with open(config_path) as f:
        cfg = json.load(f)
    if os.path.isfile(local_path):
        with open(local_path) as f:
            local = json.load(f)
        for k, v in local.items():
            if isinstance(v, dict) and k in cfg and isinstance(cfg[k], dict):
                cfg[k].update(v)
            else:
                cfg[k] = v
    return cfg

cfg = load_config()
models = cfg["models"]
components = cfg["components"]
auditor_count = cfg["auditor_counts"][scope]
rs = cfg["repo_scale"]
scale = max(rs["min"], min(rs["max"], rs["min"] + ts_files / rs["files_divisor"]))

sonnet_in = float(os.environ.get("AUDIT_COST_SONNET_INPUT_PER_M", models["sonnet"]["input_per_million_usd"]))
sonnet_out = float(os.environ.get("AUDIT_COST_SONNET_OUTPUT_PER_M", models["sonnet"]["output_per_million_usd"]))
uncertainty = cfg["uncertainty_pct"] / 100.0

def cost_usd(inp, out):
    return (inp / 1_000_000) * sonnet_in + (out / 1_000_000) * sonnet_out

rows = []
total_in = 0
total_out = 0

def add_row(key, count=1):
    global total_in, total_out
    c = components[key]
    if scope not in c.get("scopes", ["full", "quick"]):
        return
    if c.get("optional") and key == "agent_memory_recall" and not with_mem:
        return
    if key == "github_issue_triage" and not with_issue_filing:
        return
    inp = c["input_tokens"] * count
    out = c["output_tokens"] * count
    if c.get("scales_with_repo"):
        inp = int(inp * scale)
        out = int(out * scale)
    usd = cost_usd(inp, out)
    label = c["label"]
    if count > 1:
        label = f"{label} x{count}"
    rows.append({"label": label, "input_tokens": inp, "output_tokens": out, "usd": round(usd, 4)})
    total_in += inp
    total_out += out

add_row("orchestrator")
add_row("workflow_mapper")
add_row("auditor", count=auditor_count)
if with_issue_filing:
    add_row("github_issue_triage")
if with_mem:
    add_row("agent_memory_recall")

usd_mid = cost_usd(total_in, total_out)
usd_low = usd_mid * (1 - uncertainty)
usd_high = usd_mid * (1 + uncertainty)

assumptions = [
    f"Scope: {scope} ({auditor_count} auditors)",
    f"Model: Claude Sonnet (${sonnet_in}/M input, ${sonnet_out}/M output)",
    f"Repo scale: {scale:.2f}x ({ts_files} TS/TSX files in audit scope)",
    f"API routes: {api_routes}, workers/scripts: {worker_count}",
]
if with_mem:
    assumptions.append("Includes optional agent memory recall")
if with_issue_filing:
    assumptions.append("Includes GitHub issue triage phase")
else:
    assumptions.append("Issue filing phase excluded")

result = {
    "metrics": {
        "ts_files": ts_files,
        "api_routes": api_routes,
        "worker_count": worker_count,
        "repo_scale": round(scale, 2),
        "scope": scope,
    },
    "components": rows,
    "total_tokens_in": total_in,
    "total_tokens_out": total_out,
    "usd_low": round(usd_low, 2),
    "usd_mid": round(usd_mid, 2),
    "usd_high": round(usd_high, 2),
    "uncertainty_pct": cfg["uncertainty_pct"],
    "assumptions": assumptions,
}

if output_json:
    print(json.dumps(result, indent=2))
else:
    def fmt_tokens(n):
        if n >= 1_000_000:
            return f"{n/1_000_000:.2f}M"
        if n >= 1_000:
            return f"{n/1_000:.1f}k"
        return str(n)

    print("## Audit cost estimate (approximate)\n")
    print("| Component | Est. input | Est. output | Est. cost (USD) |")
    print("| --- | --- | --- | --- |")
    for r in rows:
        print(f"| {r['label']} | {fmt_tokens(r['input_tokens'])} | {fmt_tokens(r['output_tokens'])} | ${r['usd']:.2f} |")
    print(f"\n**Total tokens:** {fmt_tokens(total_in)} in / {fmt_tokens(total_out)} out")
    print(f"**Total estimate:** ${usd_low:.2f} - ${usd_high:.2f} (mid: ${usd_mid:.2f})\n")
    print("**Assumptions:**")
    for a in assumptions:
        print(f"- {a}")
    print("\n**Billing note:** Dollar amounts are estimates from token counts times published API rates.")
    print("Pro/Max subscribers may see usage count against plan limits rather than direct per-token billing.")
    print("Reply **continue** to start the audit, **continue quick** for a smaller pass, or **cancel** to abort.")
PY
