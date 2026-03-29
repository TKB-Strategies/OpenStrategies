[![Deploy Healing Plan](https://github.com/TKB-Strategies/healing-plan/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/TKB-Strategies/healing-plan/actions/workflows/deploy.yml)
![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![Vite](https://img.shields.io/badge/vite-6.0-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-18.3-61DAFB?logo=react&logoColor=white)
![License](https://img.shields.io/badge/license-proprietary-red)

# Healing-Centered Leadership Action Plan

**TKB Strategies** — Interactive companion tool for *Trauma-Informed and Healing-Centered Approaches in Organizational Management*

**Live:** [tkbstrategies.com/healing-plan](https://tkbstrategies.com/healing-plan/)

An interactive 7-section action planning tool that participants complete during and after the session. Responses stay local — participants export their own plan as a downloadable text file.

## Sections

1. **Starting place** — Where is the organization on the journey from trauma-informed to healing-centered?
2. **Assessment** — Strengths and growth areas across organizational practice
3. **30-day actions** — Immediate, achievable commitments
4. **60-day actions** — Medium-term structural changes
5. **90-day actions** — Longer-range strategic shifts
6. **Barriers & sustainability** — Anticipating obstacles and building staying power
7. **Commitment** — Naming accountability and next steps

## Local development

```bash
cd apps/healing-plan
npm install
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173)

## Deployment

This project uses a fully automated CI/CD pipeline. Pushing to `main` triggers a build-and-deploy cycle — no manual steps required.

**Pipeline:** GitHub Actions builds the Vite SPA, then deploys the `dist/` output to Namecheap shared hosting via SSH/rsync.

```
push to main → GitHub Actions build → rsync over SSH → tkbstrategies.com/healing-plan/
```

See [ONBOARDING.md](ONBOARDING.md) for environment setup and [docs/adr/001-static-deploy.md](docs/adr/001-static-deploy.md) for the architectural decision behind this approach.

## Migration Note

This app now lives inside the `tkb-strategies` monorepo at `apps/healing-plan/`. Its original deployment workflow is preserved under `apps/healing-plan/.github/workflows/deploy.yml` as a migration reference. Nested workflow files are not active in GitHub Actions from within this monorepo; promoting this deploy path into a root-level workflow is a later migration step.

Its assessment structure and text export assembly are now being extracted into shared packages under `packages/assessment-core/` and `packages/exports/`.

### Manual deploy (without CI)

If you ever need to deploy without the pipeline:

```bash
npm install && npm run build
```

Upload the contents of the `dist/` folder to `/home/mvisdrda/public_html/healing-plan/` on the server.

## Structure

```
healing-plan/
├── .github/workflows/
│   └── deploy.yml          # CI/CD pipeline
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx            # Entry point
│   ├── index.css            # Global styles
│   └── App.jsx              # Application component
├── .cpanel.yml              # cPanel deployment hook (Passenger restart)
├── index.html               # Vite HTML entry
├── package.json
├── package-lock.json
└── vite.config.js           # Vite config (base: /healing-plan/)
```

## Key configuration

| File | Purpose |
|------|---------|
| `vite.config.js` | Sets `base: '/healing-plan/'` for subdirectory hosting |
| `.github/workflows/deploy.yml` | Build + SSH/rsync deploy to Namecheap |
| `.cpanel.yml` | Passenger restart hook (if cPanel Git deploy is used) |

## License

Copyright TKB Strategies, LLC. All rights reserved.
