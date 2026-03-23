#!/bin/bash
# Phase 2 - Connect local repo to GitHub Organization remote
# Run AFTER creating the GitHub org and empty repository
#
# Usage: bash scripts/setup-remote.sh
# This script is currently configured for:
#   https://github.com/TKB-Strategies/OpenStrategies.git

set -euo pipefail

REMOTE_URL="https://github.com/TKB-Strategies/OpenStrategies.git"

echo "Setting remote origin to: ${REMOTE_URL}"
git remote add origin "${REMOTE_URL}" 2>/dev/null || git remote set-url origin "${REMOTE_URL}"

echo "Ensuring branch is named main..."
git branch -M main

echo "Pushing main branch..."
git push -u origin main

echo ""
echo "Remote configured. Next steps:"
echo "  1. Go to https://github.com/TKB-Strategies/OpenStrategies/settings/branches"
echo "     - Add branch protection rule for 'main'"
echo "     - Require pull request reviews before merging"
echo "  2. Go to https://github.com/TKB-Strategies/OpenStrategies/settings/secrets/actions"
echo "     - Add FTP_HOST, FTP_USER, FTP_PASSWORD for deployment"
echo "  3. Go to https://github.com/TKB-Strategies/OpenStrategies/settings/pages"
echo "     - Enable GitHub Pages (source: GitHub Actions)"
echo "  4. Update docs/OPERATIONS-JOURNAL.md with today's closeout entry"
