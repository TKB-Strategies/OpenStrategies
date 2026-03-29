# Docusaurus Site - AI Context

## Overview

This directory contains the Docusaurus project that powers the TKB Strategies public documentation site at `https://tkb-strategies.github.io`.

## Build Commands

- `npm run start` - Local development server with hot reload (port 3000)
- `npm run build` - Production build to `apps/docs-site/build/`
- `npm run serve` - Serve production build locally for testing

## Content Mapping

Source markdown from the repository root is mapped into this site's docs structure:

| Source Directory | Site Location | Content Type |
|---|---|---|
| `frameworks/compassionate-agility/` | `docs/frameworks/compassionate-agility/` | Framework methodology |
| `frameworks/liberation-mapping/` | `docs/frameworks/liberation-mapping/` | Framework methodology |
| `frameworks/stewards-manual/` | `docs/frameworks/stewards-manual/` | Framework methodology |
| `workshops/templates/` | `docs/workshops/` | Facilitation templates |
| `presentations/templates/` | `docs/presentations/` | Deck outlines |
| `legacy/wordpress-plugin-quiz-tracker/` | `docs/tools/quiz/` | Legacy plugin documentation |

## Deployment

Deployed via GitHub Actions (`.github/workflows/deploy-docs.yml`) on merge to `main`. The workflow runs `npm run build` and pushes the `apps/docs-site/build/` output to GitHub Pages.

## Code Standards

- Landing page and custom components use React (JSX)
- Styling uses Docusaurus CSS modules or Infima (the built-in CSS framework)
- Theme colors should align with TKB Strategies brand
- All content must pass the `CONTRIBUTING.md` public disclosure test - no client names, financials, or engagement details

## What Does NOT Belong Here

- `apps/docs-site/node_modules/` - excluded by `.gitignore`
- `apps/docs-site/.docusaurus/` - build cache, excluded by `.gitignore`
- `apps/docs-site/build/` - build output, excluded by `.gitignore`
- Any client-specific content, credentials, or internal operational documents
