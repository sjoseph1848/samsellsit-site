#!/usr/bin/env bash
# One-time setup. Creates the GitHub repo and pushes this folder to it.
# Run this once. After that, use ./push.sh for every change.
set -euo pipefail

REPO_NAME="samsellsit-site"

say(){ printf "\n\033[1;34m==>\033[0m %s\n" "$1"; }
die(){ printf "\n\033[1;31mStopped:\033[0m %s\n\n" "$1"; exit 1; }

cd "$(dirname "$0")"

say "Checking for the GitHub CLI"
if ! command -v gh >/dev/null 2>&1; then
  cat <<'MSG'

The GitHub CLI is not installed. Install it, then run this script again.

  If you have Homebrew:      brew install gh
  If you do not:             https://cli.github.com  (download the Mac installer)

MSG
  die "gh not found"
fi

say "Checking that you are logged in to GitHub"
if ! gh auth status >/dev/null 2>&1; then
  echo "You are not logged in. Opening the login flow now."
  echo "Choose: GitHub.com  ->  HTTPS  ->  Login with a web browser"
  gh auth login
fi

say "Preparing the local repository"
if [ ! -d .git ]; then
  git init -q
  git branch -M main
fi
git add -A
if git diff --cached --quiet 2>/dev/null && git rev-parse HEAD >/dev/null 2>&1; then
  echo "Nothing new to commit."
else
  git commit -q -m "Instagram bio link page" || true
fi

say "Creating the repo on GitHub and pushing"
if git remote get-url origin >/dev/null 2>&1; then
  echo "A remote already exists. Pushing to it."
  git push -u origin main
else
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
fi

OWNER=$(gh api user --jq .login)

cat <<MSG

$(printf "\033[1;32m")Done. The code is on GitHub.$(printf "\033[0m")

  https://github.com/$OWNER/$REPO_NAME

$(printf "\033[1;34m")Now connect Netlify. Takes about a minute, one time only.$(printf "\033[0m")

  1. Go to  https://app.netlify.com/start
  2. Click  "Import from Git"  ->  GitHub
  3. Authorize Netlify if it asks, then pick  $REPO_NAME
  4. Build command:      leave EMPTY
     Publish directory:  .
  5. Click Deploy

  Netlify gives you a URL like  https://samsellsit.netlify.app
  Rename it under  Site configuration -> Change site name.

$(printf "\033[1;34m")From then on:$(printf "\033[0m")  run  ./push.sh "what you changed"
  and the live site updates by itself in about 30 seconds.

MSG
