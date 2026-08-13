#!/usr/bin/env bash
# Publish a change. Netlify redeploys automatically.
#   ./push.sh "fixed the phone number"
set -euo pipefail
cd "$(dirname "$0")"

MSG="${1:-Update site}"

if [ ! -d .git ]; then
  echo "This folder is not set up yet. Run ./setup.sh first."
  exit 1
fi

git add -A
if git diff --cached --quiet; then
  echo "No changes to publish."
  exit 0
fi

git commit -q -m "$MSG"
git push -q origin main

printf "\n\033[1;32mPushed.\033[0m Netlify is building. Live in about 30 seconds.\n"
if command -v gh >/dev/null 2>&1; then
  OWNER=$(gh api user --jq .login 2>/dev/null || echo "")
  [ -n "$OWNER" ] && echo "https://github.com/$OWNER/samsellsit-site/commits/main"
fi
echo
