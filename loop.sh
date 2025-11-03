#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROMPT_FILE="${SCRIPT_DIR}/PROMPT.md"

while true; do
  codex exec --json --dangerously-bypass-approvals-and-sandbox - < "${PROMPT_FILE}"
  echo -n "\n\n=====================LOOP=====================\n\n"
  sleep 10
done
