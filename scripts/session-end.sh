#!/usr/bin/env bash
set -euo pipefail

input=$(cat)
if [ -z "$input" ]; then
  input="{}"
fi

mkdir -p logs

if compact=$(printf '%s' "$input" | jq -c . 2>/dev/null); then
  printf '%s\n' "$compact" >> logs/session-end.jsonl
else
  printf '%s\n' "$input" >> logs/session-end.jsonl
fi
