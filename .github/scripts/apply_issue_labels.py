#!/usr/bin/env python3
"""Apply GitHub issue labels from .github/issue-labeler.yml."""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    subprocess.check_call(
        [sys.executable, "-m", "pip", "install", "pyyaml", "--quiet"],
        stdout=subprocess.DEVNULL,
    )
    import yaml


REPO_ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = REPO_ROOT / ".github" / "issue-labeler.yml"


def run_gh(args: list[str]) -> str:
    env = os.environ.copy()
    env.setdefault("GH_TOKEN", os.environ.get("GITHUB_TOKEN", ""))
    result = subprocess.run(
        ["gh", *args],
        check=True,
        capture_output=True,
        text=True,
        env=env,
    )
    return result.stdout


def add_labels(repository: str, issue_number: int, labels: set[str]) -> None:
    for label in sorted(labels):
        result = subprocess.run(
            [
                "gh",
                "api",
                "--method",
                "POST",
                f"repos/{repository}/issues/{issue_number}/labels",
                "-f",
                f"labels[]={label}",
            ],
            check=False,
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            detail = (result.stderr or result.stdout).strip()
            print(
                f"Failed to add label {label!r} to issue #{issue_number}: {detail}",
                file=sys.stderr,
            )
            raise subprocess.CalledProcessError(
                result.returncode,
                result.args,
                result.stdout,
                result.stderr,
            )


def extract_form_field(body: str, field_name: str) -> str | None:
    pattern = re.compile(
        rf"^### {re.escape(field_name)}\s*\n(?P<value>.+?)(?:\n\n|\Z)",
        re.MULTILINE,
    )
    match = pattern.search(body)
    if not match:
        return None
    return match.group("value").strip()


def labels_from_patterns(
    text: str,
    rules: dict[str, list[str]] | None,
) -> set[str]:
    matched: set[str] = set()
    if not rules:
        return matched

    for label, patterns in rules.items():
        for pattern in patterns:
            if re.search(pattern, text):
                matched.add(label)
                break

    return matched


def labels_from_form_fields(
    body: str,
    rules: dict[str, dict[str, str]] | None,
) -> set[str]:
    matched: set[str] = set()
    if not rules:
        return matched

    for field_name, mapping in rules.items():
        value = extract_form_field(body, field_name)
        if not value:
            continue
        label = mapping.get(value)
        if label:
            matched.add(label)

    return matched


def load_config() -> dict[str, Any]:
    with CONFIG_PATH.open(encoding="utf-8") as handle:
        return yaml.safe_load(handle)


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: apply_issue_labels.py <issue-number>", file=sys.stderr)
        return 1

    issue_number = sys.argv[1]
    repository = os.environ.get("GITHUB_REPOSITORY")
    if not repository:
        print("GITHUB_REPOSITORY is required", file=sys.stderr)
        return 1

    payload = json.loads(
        run_gh(
            [
                "issue",
                "view",
                issue_number,
                "--repo",
                repository,
                "--json",
                "title,body",
            ],
        ),
    )

    config = load_config()
    labels: set[str] = set()

    body = payload["body"] or ""

    labels |= labels_from_patterns(payload["title"], config.get("title"))
    labels |= labels_from_form_fields(body, config.get("form_fields"))
    labels |= labels_from_patterns(body, config.get("body"))

    environment = extract_form_field(body, "Environment")
    if environment == "Production" and (
        "risk:medium" in labels or "security" in labels
    ):
        labels.add("risk:high")

    if not labels:
        return 0

    try:
        add_labels(repository, int(issue_number), labels)
    except subprocess.CalledProcessError:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
