#!/usr/bin/env bash
set -euo pipefail

# Change this if needed:
REMOTE_URL_DEFAULT="https://github.com/Matzo12/CLUBA-Site.git"

echo "== Repo check =="
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  echo "❌ Not a git repo here. Run this inside your repo folder."
  exit 1
}

echo "== Ensure origin remote =="
if ! git remote get-url origin >/dev/null 2>&1; then
  echo "No origin remote found. Adding origin -> $REMOTE_URL_DEFAULT"
  git remote add origin "$REMOTE_URL_DEFAULT"
fi
git remote -v

echo "== Ensure we have at least one commit =="
if ! git rev-parse HEAD >/dev/null 2>&1; then
  echo "No commits yet. Creating initial commit..."
  # If you already created index.html/privacy.html etc, they’ll be included.
  git add -A
  git commit -m "Initial commit"
fi

echo "== Switch/rename branch to main =="
CURRENT_BRANCH="$(git branch --show-current || true)"

if [[ "$CURRENT_BRANCH" == "main" ]]; then
  echo "Already on main."
elif git show-ref --verify --quiet refs/heads/main; then
  echo "main branch exists locally. Switching to main..."
  git checkout main
elif [[ "$CURRENT_BRANCH" == "master" ]]; then
  echo "Renaming master -> main..."
  git branch -m master main
else
  echo "Creating main branch..."
  git checkout -b main
fi

echo "== Push main to origin and set upstream =="
git push -u origin main

echo "✅ Done. main exists on GitHub now."
