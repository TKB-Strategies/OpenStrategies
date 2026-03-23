#!/bin/bash
# Phase 2 - Connect local repo to GitHub Organization remote
# Run AFTER creating the GitHub org and empty repository
#
# Usage: bash scripts/setup-remote.sh <github-org-name> <repo-name>
# Example: bash scripts/setup-remote.sh tkb-strategies tkb-strategies

set -euo pipefail

ORG="${1:?Usage: $0 <github-org-name> <repo-name>}"
REPO="${2:?Usage: $0 <github-org-name> <repo-name>}"
REMOTE_URL="https://github.com/${ORG}/${REPO}.git"

echo "Setting remote origin to: ${REMOTE_URL}"
git remote add origin "${REMOTE_URL}" 2>/dev/null || git remote set-url origin "${REMOTE_URL}"

echo "Pushing main branch..."
git push -u origin main

echo ""
echo "Remote configured. Next steps:"
echo "  1. Go to https://github.com/${ORG}/${REPO}/settings/branches"
echo "     - Add branch protection rule for 'main'"
echo "     - Require pull request reviews before merging"
echo "  2. Go to https://github.com/${ORG}/${REPO}/settings/secrets/actions"
echo "     - Add FTP_HOST, FTP_USER, FTP_PASSWORD for deployment"
echo "  3. Go to https://github.com/${ORG}/${REPO}/settings/pages"
echo "     - Enable GitHub Pages (source: GitHub Actions)"
echo "  4. Update docs/OPERATIONS-JOURNAL.md with today's closeout entry"
