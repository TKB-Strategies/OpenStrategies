# Onboarding Guide

This guide gets a new contributor from zero to running the Healing-Centered Leadership Action Plan locally and understanding how the production pipeline works.

## Prerequisites

- **Node.js 20+** — [Download](https://nodejs.org/) or use `nvm install 20`
- **Git** — [Download](https://git-scm.com/)
- **VS Code** (recommended) — [Download](https://code.visualstudio.com/)

Verify your setup:

```bash
node -v    # Should print v20.x.x or higher
npm -v     # Should print 10.x.x or higher
git -v     # Should print git version 2.x.x
```

## Clone and run locally

```bash
git clone https://github.com/TKB-Strategies/healing-plan.git
cd healing-plan
npm install
npm run dev
```

The app opens at [http://localhost:5173](http://localhost:5173). Vite provides hot module replacement — edits to files in `src/` appear in the browser immediately.

## Project overview

This is a Vite 6 + React 18.3 single-page application. It has no backend, no database, and no API calls. All user input stays in the browser and can be exported as a local text file.

### How the code is organized

| Path | What it does |
|------|-------------|
| `src/App.jsx` | The entire application — all 7 sections, navigation, state management, and export logic |
| `src/main.jsx` | React entry point — mounts `<App />` to the DOM |
| `src/index.css` | Global styles |
| `public/favicon.svg` | Browser tab icon |
| `index.html` | Vite HTML shell — the `<div id="root">` that React renders into |
| `vite.config.js` | Build configuration — sets `base: '/healing-plan/'` for subdirectory hosting |

### Key design decisions

The app is a single component (`App.jsx`) rather than a multi-file architecture. This is intentional — the tool is a focused facilitator companion, not a growing product. If that changes, see the ADR at `docs/adr/001-static-deploy.md` for context on the deployment architecture.

## How deployment works

```
You push to main
        ↓
GitHub Actions runs (.github/workflows/deploy.yml)
        ↓
Builds the Vite SPA (npm ci → npm run build)
        ↓
rsync copies dist/ to the server via SSH
        ↓
Live at tkbstrategies.com/healing-plan/
```

There is nothing to do manually. Every push to `main` triggers a deploy. The workflow takes about 30-40 seconds end to end.

### What the workflow does step by step

1. Checks out the repo
2. Sets up Node.js 20 with npm caching
3. Runs `npm ci` (deterministic install from `package-lock.json`)
4. Runs `npm run build` (produces `dist/` with hashed JS/CSS assets)
5. Loads the SSH private key from GitHub secrets
6. Adds the Namecheap server's host key to `known_hosts`
7. Creates the target directory on the server if it doesn't exist
8. Runs `rsync --delete` to sync `dist/` to `public_html/healing-plan/`
9. Runs a smoke test (`curl -sI` on the live URL)

### Where secrets live

All deployment credentials are stored as GitHub **environment secrets** under the `production` environment:

| Secret | What it is |
|--------|-----------|
| `NC_HOST` | Namecheap server hostname |
| `NC_PORT` | SSH port (21098 for Namecheap shared hosting) |
| `NC_USER` | cPanel username |
| `NC_SSH_PRIVATE_KEY` | RSA 4096 private key (no passphrase) |
| `NC_TARGET_DIR` | Absolute server path to `public_html/healing-plan` |

To view or update: GitHub repo → Settings → Environments → production.

## Common tasks

### Make a content change

Edit `src/App.jsx`, save, verify in the browser at localhost, then:

```bash
git add src/App.jsx
git commit -m "Update [section name] content"
git push origin main
```

The site updates automatically within a minute.

### Change the app's subdirectory path

If the app needs to move from `/healing-plan/` to a different path:

1. Update `base` in `vite.config.js`
2. Update `NC_TARGET_DIR` in GitHub environment secrets
3. Push — the workflow deploys to the new path

### Build locally to inspect output

```bash
npm run build
```

The production output lands in `dist/`. You can preview it:

```bash
npm run preview
```

Opens at [http://localhost:4173/healing-plan/](http://localhost:4173/healing-plan/)

### Check deployment status

Visit the [Actions tab](https://github.com/TKB-Strategies/healing-plan/actions) to see recent workflow runs. Green checkmark = deployed successfully.

### Trigger a deploy without code changes

Go to Actions → Deploy Healing Plan → Run workflow → Run workflow (on `main` branch). This re-runs the build and deploy from the current `main`.

## Server access

If you need to inspect the deployed files directly:

- **cPanel Terminal:** [server109.web-hosting.com:2083](https://server109.web-hosting.com:2083) → Terminal
- **SSH from local:** `ssh -p 21098 mvisdrda@server109.web-hosting.com`
- **Deployed files:** `/home/mvisdrda/public_html/healing-plan/`

## Who to ask

| Question | Person |
|----------|--------|
| App content, facilitation context | Tekoah Boatner |
| CI/CD pipeline, hosting, infrastructure | Tekoah Boatner (TKB Strategies) |

## Related documents

- [README.md](README.md) — Project overview and structure
- [docs/adr/001-static-deploy.md](docs/adr/001-static-deploy.md) — Why we chose static deployment over Node.js/Passenger
