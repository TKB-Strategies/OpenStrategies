# ADR 001 — Static Artifact Deployment over Node.js/Passenger

**Status:** Accepted
**Date:** 2026-03-29
**Decision makers:** Tekoah Boatner (TKB Strategies)

## Context

The Healing-Centered Leadership Action Plan is a Vite + React single-page application with no backend, no database, and no API calls. All participant data stays in the browser and can be exported as a local text file. The app is hosted on Namecheap shared hosting (server109.web-hosting.com) under cPanel.

We needed a deployment approach that was reliable, automated, and sustainable for a small team — one that centered the work itself rather than requiring ongoing infrastructure attention.

## Approaches explored

### 1. cPanel Git deployment with server-side build

We registered the repo in cPanel's Git Version Control and configured `.cpanel.yml` to run `npm install && npm run build` on pull. This failed immediately — Vite's esbuild dependency uses WebAssembly, and Namecheap's CloudLinux environment enforces memory limits that prevent `WebAssembly.instantiate()` from completing. The build process was killed with an out-of-memory error every time.

**Outcome:** Not viable. Server-side builds are blocked by shared hosting memory constraints.

### 2. FTP deployment of pre-built artifacts

We built locally and uploaded `dist/` via FTP. This worked initially but revealed two problems: FTP path jailing silently redirected uploads to unexpected directories, and there was no way to atomically replace the previous version. Files could end up in an inconsistent state mid-upload.

**Outcome:** Unreliable. Silent path redirection and non-atomic uploads made this unsuitable for production.

### 3. Node.js application via cPanel Passenger

We registered the app through cPanel's "Setup Node.js App" interface, which runs the app through Passenger. Since this is a static SPA with no server component, Passenger added unnecessary complexity — a runtime process for an app that serves only static files. It also reintroduced the server-side build problem.

**Outcome:** Overengineered. Passenger is designed for applications that need a running process. A static SPA does not.

### 4. GitHub Actions build → SSH/rsync deploy (chosen)

Build the production bundle on GitHub Actions (which has no memory constraints), then deploy the resulting `dist/` directory to `public_html/healing-plan/` via SSH and rsync. The server only receives and serves static files — it never runs Node.js, npm, or any build tool.

**Outcome:** Reliable, fast, and fully automated.

## Decision

We use **GitHub Actions to build and SSH/rsync to deploy**. The server receives pre-built static assets only.

The pipeline:

```
push to main → GitHub Actions → npm ci → npm run build → rsync dist/ over SSH → live
```

Key implementation details:

- **SSH key:** RSA 4096, no passphrase (required for non-interactive CI use), stored as a GitHub environment secret
- **SSH port:** 21098 (Namecheap shared hosting uses a non-standard port)
- **rsync flags:** `-az --delete` — compressed transfer, remove files on server that no longer exist in `dist/`
- **GitHub environment:** `production` — secrets are scoped to this environment, not the repository
- **Smoke test:** The workflow curls the live URL after deploy to confirm the site responds
- **Concurrency:** Only one deploy runs at a time; in-flight deploys are cancelled if a new push arrives

## Consequences

### What this gives us

- **Predictable builds.** GitHub-hosted runners have consistent, generous resources. No more OOM failures.
- **Atomic deploys.** `rsync --delete` replaces the entire directory in one operation. No partial states.
- **Zero server maintenance.** The server runs Apache and serves files. No Node.js runtime, no process manager, no dependency installation on the host.
- **Fast feedback.** The full pipeline — checkout, build, deploy, smoke test — completes in 30–40 seconds.
- **Auditability.** Every deploy is a GitHub Actions run tied to a specific commit. The Actions tab is the deployment log.

### What we accept

- **SSH key management.** The deploy key must be kept in GitHub secrets. If it's rotated on the server, the secret must be updated to match.
- **GitHub dependency.** If GitHub Actions has an outage, deploys are blocked. Manual rsync from a local machine is the fallback (documented in ONBOARDING.md).
- **No server-side rendering.** This architecture only supports static output. If the app ever needs a backend, the deployment approach will need to evolve (see below).

## Future evolution

If the app grows into a fullstack application (e.g., the white-label SaaS direction under exploration), the principle remains the same: **build off-server, run on server.** The pipeline would build the app on GitHub Actions, deploy the built code and production dependencies via rsync, and use Passenger only as a process manager for the Node.js runtime — never for building.

## References

- [ONBOARDING.md](../../ONBOARDING.md) — Full contributor setup and deployment guide
- [README.md](../../README.md) — Project overview and structure
