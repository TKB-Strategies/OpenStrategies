# Project Roadmap

This roadmap is the source of truth for phased delivery in the `tkb-strategies` repository. Use task IDs when discussing work, recording closeouts, and deciding what can happen next.

Roadmap status note:

- This roadmap predates the 2026-03-29 monorepo migration and still reflects the original public-repo sequencing.
- The structural migration tracked in [MONOREPO-MIGRATION-PLAN.md](MONOREPO-MIGRATION-PLAN.md) has completed its core phases: app import, shared-package extraction, legacy isolation, root workflow promotion, and initial service contract definition.
- Use the migration plan for current repository structure decisions. Use this roadmap for the older public-site and operational task inventory until it is refreshed against the new monorepo model.

Status legend:

- `COMPLETE` - finished and verified
- `IN PROGRESS` - currently active
- `NEXT` - ready to start when the current dependency clears
- `PLANNED` - queued for a later phase

## Phase Summary

| Phase | Title | Status | Tasks |
|---|---|---|---:|
| Phase 1 | Local Repository Foundation | COMPLETE | 19 |
| Phase 2 | GitHub Organization & Remote Setup | NEXT | 10 |
| Phase 3 | Docusaurus Public Site | NEXT | 13 |
| Phase 4 | Staging Environment (WordPress) | PLANNED | 8 |
| Phase 5 | CI/CD Pipeline | PLANNED | 8 |
| Phase 6 | Plugin Development Workflow | PLANNED | 7 |
| Phase 7 | Framework & Content Publishing | PLANNED | 7 |
| Phase 8 | Digital Products Pipeline | PLANNED | 5 |
| Phase 9 | MCP Integrations & Automation | PLANNED | 5 |

Total tasks: 82

## Phase 1 — Local Repository Foundation

Goal: establish the local repository, AI context, governance docs, and safe operating boundaries before any remote or site work.

| ID | Task | Status | Depends On | Owner |
|---|---|---|---|---|
| P1.1 | Create the local `tkb-strategies` working tree in WSL | COMPLETE | None | Repo maintainer |
| P1.2 | Create the baseline directory structure | COMPLETE | P1.1 | Repo maintainer |
| P1.3 | Add Claude Code permissions placeholder in `.claude/settings.json` | COMPLETE | P1.2 | Repo maintainer |
| P1.4 | Add `.mcp.json` placeholder for future integrations | COMPLETE | P1.2 | Repo maintainer |
| P1.5 | Create the root `CLAUDE.md` project memory file | COMPLETE | P1.2 | Repo maintainer |
| P1.6 | Add plugin-specific Claude context | COMPLETE | P1.2 | Repo maintainer |
| P1.7 | Add theme-specific Claude context | COMPLETE | P1.2 | Repo maintainer |
| P1.8 | Add framework-specific Claude context | COMPLETE | P1.2 | Repo maintainer |
| P1.9 | Add placeholder README files across subdirectories | COMPLETE | P1.2 | Repo maintainer |
| P1.10 | Create `docs/CONTRIBUTING.md` | COMPLETE | P1.2 | Repo maintainer |
| P1.11 | Create `docs/SECURITY.md` | COMPLETE | P1.2 | Repo maintainer |
| P1.12 | Create `docs/STACK.md` | COMPLETE | P1.2 | Repo maintainer |
| P1.13 | Create `.gitignore` boundary and artifact exclusions | COMPLETE | P1.2 | Repo maintainer |
| P1.14 | Create `.env.example` | COMPLETE | P1.2 | Repo maintainer |
| P1.15 | Add root `README.md` and `LICENSE` | COMPLETE | P1.2 | Repo maintainer |
| P1.16 | Initialize Git on `main` and create the initial commit | COMPLETE | P1.1 | Repo maintainer |
| P1.17 | Migrate Git metadata to a persistent WSL gitdir | COMPLETE | P1.16 | Repo maintainer |
| P1.18 | Restructure the operations journal around a daily closeout template | COMPLETE | P1.17 | Repo maintainer |
| P1.19 | Create the phased project roadmap | COMPLETE | P1.18 | Repo maintainer |

## Phase 2 — GitHub Organization & Remote Setup

Goal: create the public GitHub surface and connect the local repository to its remote home.

| ID | Task | Status | Depends On | Owner |
|---|---|---|---|---|
| P2.1 | Create the GitHub Organization | NEXT | P1.19 | Repo maintainer |
| P2.2 | Create the empty `tkb-strategies` repository under the organization | NEXT | P2.1 | Repo maintainer |
| P2.3 | Configure `origin` using `tooling/scripts/setup-remote.sh` | NEXT | P2.2 | Repo maintainer |
| P2.4 | Push `main` to GitHub and verify upstream tracking | NEXT | P2.3 | Repo maintainer |
| P2.5 | Configure branch protection for `main` | NEXT | P2.4 | Repo maintainer |
| P2.6 | Add repository description, topics, and visibility settings | PLANNED | P2.4 | Repo maintainer |
| P2.7 | Add CODEOWNERS and repository defaults | PLANNED | P2.4 | Repo maintainer |
| P2.8 | Create labels, issue templates, and pull request templates | PLANNED | P2.4 | Repo maintainer |
| P2.9 | Enable GitHub Pages via GitHub Actions | NEXT | P2.4 | Repo maintainer |
| P2.10 | Publish the organization profile README | NEXT | P2.1 | Repo maintainer |

## Phase 3 — Docusaurus Public Site

Goal: add a markdown-native public documentation site for frameworks, tools, and methodology.

| ID | Task | Status | Depends On | Owner |
|---|---|---|---|---|
| P3.1 | Scaffold Docusaurus into `apps/docs-site/` | NEXT | P2.4 | Repo maintainer |
| P3.2 | Configure `docusaurus.config.js` for TKB Strategies branding and GitHub Pages | PLANNED | P3.1 | Repo maintainer |
| P3.3 | Create the initial docs information architecture | PLANNED | P3.1 | Repo maintainer |
| P3.4 | Map framework markdown into `apps/docs-site/docs/frameworks/` | PLANNED | P3.3 | Repo maintainer |
| P3.5 | Map workshop and presentation templates into `apps/docs-site/docs/` | PLANNED | P3.3 | Repo maintainer |
| P3.6 | Add plugin and tools documentation pages | PLANNED | P3.3 | Repo maintainer |
| P3.7 | Create the landing page and navigation structure | PLANNED | P3.2 | Repo maintainer |
| P3.8 | Update `.gitignore` with Docusaurus exclusions | COMPLETE | P1.13 | Repo maintainer |
| P3.9 | Add `apps/docs-site/CLAUDE.md` for Docusaurus-specific AI context | COMPLETE | P1.19 | Repo maintainer |
| P3.10 | Add `apps/docs-site/README.md` for local onboarding | COMPLETE | P1.19 | Repo maintainer |
| P3.11 | Create `.github/workflows/deploy-docs.yml` for GitHub Pages deployment | PLANNED | P2.9, P3.1 | Repo maintainer |
| P3.12 | Test local Docusaurus build and production output | PLANNED | P3.2 | Repo maintainer |
| P3.13 | Publish the initial GitHub Pages site | PLANNED | P3.11, P3.12 | Repo maintainer |

## Phase 4 — Staging Environment (WordPress)

Goal: stand up and document the WordPress staging environment before production automation.

| ID | Task | Status | Depends On | Owner |
|---|---|---|---|---|
| P4.1 | Provision `dev.tkbstrategies.com` in Namecheap/cPanel | PLANNED | P2.4 | Repo maintainer |
| P4.2 | Install WordPress and confirm Divi/Jupiter availability | PLANNED | P4.1 | Repo maintainer |
| P4.3 | Configure Softaculous Git integration for the staging document root | PLANNED | P4.1 | Repo maintainer |
| P4.4 | Document staging environment variables and deployment paths | PLANNED | P4.3 | Repo maintainer |
| P4.5 | Validate plugin deployment to staging from a feature branch | PLANNED | P4.3 | Repo maintainer |
| P4.6 | Validate child theme deployment to staging | PLANNED | P4.3 | Repo maintainer |
| P4.7 | Document rollback and recovery steps for staging | PLANNED | P4.5 | Repo maintainer |
| P4.8 | Record staging setup in the operations journal | PLANNED | P4.7 | Repo maintainer |

## Phase 5 — CI/CD Pipeline

Goal: automate verification and deployment while keeping `main` deployable.

| ID | Task | Status | Depends On | Owner |
|---|---|---|---|---|
| P5.1 | Create GitHub Actions workflow for docs/site deployment | PLANNED | P2.9, P3.1 | Repo maintainer |
| P5.2 | Create GitHub Actions workflow for plugin FTP deployment | PLANNED | P2.4 | Repo maintainer |
| P5.3 | Add required GitHub Actions secrets for FTP deployment | PLANNED | P5.2 | Repo maintainer |
| P5.4 | Add branch-based deployment rules for staging vs production | PLANNED | P4.3, P5.2 | Repo maintainer |
| P5.5 | Add lint or validation steps for Markdown and shell scripts | PLANNED | P2.4 | Repo maintainer |
| P5.6 | Add release tagging and changelog conventions | PLANNED | P5.2 | Repo maintainer |
| P5.7 | Test production-safe deployment flow from `main` | PLANNED | P5.3, P5.4 | Repo maintainer |
| P5.8 | Document CI/CD operations and incident response | PLANNED | P5.7 | Repo maintainer |

## Phase 6 — Plugin Development Workflow

Goal: make WordPress plugin work repeatable, documented, and safe for production deployment.

| ID | Task | Status | Depends On | Owner |
|---|---|---|---|---|
| P6.1 | Scaffold local source structure for `tkb-quiz-tracker-v2` | PLANNED | P4.5 | Repo maintainer |
| P6.2 | Document activation, deactivation, and dbDelta verification steps | PLANNED | P6.1 | Repo maintainer |
| P6.3 | Add local development README for plugin testing workflow | PLANNED | P6.1 | Repo maintainer |
| P6.4 | Add nonce-verification checklist for AJAX endpoints | PLANNED | P6.2 | Repo maintainer |
| P6.5 | Create release checklist for plugin deployment | PLANNED | P5.2 | Repo maintainer |
| P6.6 | Validate multisite-safe table naming and schema idempotence | PLANNED | P6.2 | Repo maintainer |
| P6.7 | Record plugin workflow in the operations journal | PLANNED | P6.5 | Repo maintainer |

## Phase 7 — Framework & Content Publishing

Goal: turn the repository into a publishable system for frameworks and reusable content.

| ID | Task | Status | Depends On | Owner |
|---|---|---|---|---|
| P7.1 | Define framework document structure and frontmatter conventions | PLANNED | P3.3 | Repo maintainer |
| P7.2 | Draft Compassionate Agility public docs | PLANNED | P7.1 | Repo maintainer |
| P7.3 | Draft Liberation Mapping public docs | PLANNED | P7.1 | Repo maintainer |
| P7.4 | Draft The Steward's Manual public docs | PLANNED | P7.1 | Repo maintainer |
| P7.5 | Add workshop template publishing workflow | PLANNED | P3.5 | Repo maintainer |
| P7.6 | Add presentation template publishing workflow | PLANNED | P3.5 | Repo maintainer |
| P7.7 | Review all published content against confidentiality boundaries | PLANNED | P7.2, P7.3, P7.4, P7.5, P7.6 | Repo maintainer |

## Phase 8 — Digital Products Pipeline

Goal: prepare source material and process for reusable public products.

| ID | Task | Status | Depends On | Owner |
|---|---|---|---|---|
| P8.1 | Define source-file conventions for Gumroad products | PLANNED | P1.19 | Repo maintainer |
| P8.2 | Define source-file conventions for courses | PLANNED | P1.19 | Repo maintainer |
| P8.3 | Create product packaging checklist and review gate | PLANNED | P8.1, P8.2 | Repo maintainer |
| P8.4 | Document publication boundary checks for paid products | PLANNED | P8.3 | Repo maintainer |
| P8.5 | Record the products workflow in the operations journal | PLANNED | P8.4 | Repo maintainer |

## Phase 9 — MCP Integrations & Automation

Goal: add carefully bounded automation after the repository, site, and deployment flows are stable.

| ID | Task | Status | Depends On | Owner |
|---|---|---|---|---|
| P9.1 | Define approved MCP integrations and access boundaries | PLANNED | P2.4 | Repo maintainer |
| P9.2 | Add GitHub MCP configuration for issues and pull requests | PLANNED | P9.1 | Repo maintainer |
| P9.3 | Add Google Workspace reference-only MCP configuration if viable | PLANNED | P9.1 | Repo maintainer |
| P9.4 | Add error logging or observability MCP integration if needed | PLANNED | P9.1 | Repo maintainer |
| P9.5 | Document automation governance, permissions, and review process | PLANNED | P9.2, P9.3, P9.4 | Repo maintainer |
