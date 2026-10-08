#!/bin/bash
# Cloud sessions start from a fresh clone without node_modules: install once, so the page workflow's
# first command (pnpm ds:mockup / ds:blocks / ds:review) runs instead of failing on a missing package.
set -euo pipefail
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}"
[ -d node_modules/.pnpm ] && exit 0
pnpm install --frozen-lockfile --reporter=silent
