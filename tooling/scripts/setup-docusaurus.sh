#!/bin/bash
# Phase 3 - Initialize Docusaurus inside the repository
# Run AFTER Phase 2 is complete and repo is on GitHub
#
# Prerequisites: Node.js and npm installed in WSL
#
# Usage: bash tooling/scripts/setup-docusaurus.sh

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
APPS_DIR="${REPO_ROOT}/apps"
SITE_DIR="${APPS_DIR}/docs-site"

if [ -d "${SITE_DIR}" ]; then
  echo "Error: apps/docs-site/ directory already exists. Remove it first if you want to re-scaffold."
  exit 1
fi

mkdir -p "${APPS_DIR}"

echo "Scaffolding Docusaurus in apps/docs-site/..."
npx create-docusaurus@latest "${SITE_DIR}" classic --javascript

echo ""
echo "Docusaurus scaffolded. Next steps:"
echo "  1. cd apps/docs-site && npm run start    (local dev server)"
echo "  2. Configure docusaurus.config.js for TKB Strategies"
echo "  3. Map framework content from frameworks/ into apps/docs-site/docs/"
echo "  4. Create .github/workflows/deploy-docs.yml for GitHub Pages"
echo "  5. Update .gitignore with apps/docs-site/node_modules/, apps/docs-site/.docusaurus/, apps/docs-site/build/"
echo "  6. Create apps/docs-site/CLAUDE.md with Docusaurus-specific AI context"
echo "  7. Test build: cd apps/docs-site && npm run build"
