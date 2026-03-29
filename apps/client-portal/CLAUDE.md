# client-template — Repository Context

This repository is the private client-site template for TKB Strategies.
It is cloned for each new engagement, then configured by the pipeline with
`client.json` and deployed to `{slug}.tkbstrategies.com`.

## Boundaries
- No hardcoded client data outside `client.json`
- No `src/pages/index.tsx` because docs mount at `/`
- No blog
- `CLAUDE.md` files inside `docs/` are context only and must be excluded from publishing
- Placeholder docs use `index.md` or normal names, never underscore prefixes

## Architecture
- Docusaurus 3.9.x with TypeScript
- Node.js 20 and Yarn 1.x
- GitHub Actions builds and deploys by FTP to Namecheap
- Content is phase-driven and engagement-aware

## Template Shape
- `docs/` contains published client-facing content
- `templates/` contains generation templates for profiles and session notes
- `static/` contains served assets
- `client.json` is the source of truth for org metadata, phases, and engagement structure

## Voice
- Human-centered, liberation-rooted, direct
- Name systems, not symptoms
- Boundaries are a form of care
- This site should feel like a premium consulting deliverable, not software docs
