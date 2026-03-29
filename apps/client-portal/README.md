<!--
Summary of created or modified files:
- client.json
- docusaurus.config.ts
- sidebars.ts
- tsconfig.json
- .nvmrc
- README.md
- CLAUDE.md
- docs/intro.md
- docs/01-stabilize/index.md
- docs/02-name/index.md
- docs/03-structure/index.md
- docs/04-practice/index.md
- docs/05-sustain/index.md
- docs/cohort/index.md
- docs/tools-assessments/index.md
- docs/CLAUDE.md
- docs/cohort/CLAUDE.md
- src/css/custom.css
- templates/coaching-profile.md
- templates/session-note.md
- templates/CLAUDE.md
- static/CLAUDE.md
- .github/workflows/deploy.yml
-->

# Client Site Template — TKB Strategies

Docusaurus template for private engagement knowledge bases.

This app now lives inside the `tkb-strategies` monorepo at `apps/client-portal/` as the first imported private delivery surface.

## Requirements

- Node.js 20 LTS (use `nvm use 20`)
- Yarn 1.x

## Local development

```bash
cd apps/client-portal
yarn install
yarn build
yarn serve
```

## What This Repository Does

- Mirrors the OpenStrategies editorial design system while adapting it for private client work
- Reads site identity and engagement structure from `client.json`
- Generates phase-driven navigation from engagement metadata
- Publishes docs at `/` so the knowledge base is the primary site
- Deploys static output to client hosting via GitHub Actions and FTP

## Migration Note

Shared tenant metadata logic now begins in `packages/tenant-config/`, while `client.json` remains the app-local tenant instance consumed by this app.

Shared engagement navigation logic now begins in `packages/workflow-engine/`, rather than living directly in the app sidebar file.

The original deployment workflow file is preserved under `apps/client-portal/.github/workflows/deploy.yml` as a migration reference. Nested workflow files are not active in GitHub Actions from within this monorepo; promoting this deploy path into a root-level workflow is a later migration step.
