# TKB Strategies Repository Memory

## Project Overview

TKB Strategies is a human-centered strategy consulting firm specializing in liberation-centered organizational development, executive coaching, and capacity building for mission-driven organizations. This repository is the open consulting company model: public frameworks, reusable tools, and WordPress plugins.

## Architecture

- `legacy/wordpress-plugin-quiz-tracker/` - Transitional WordPress plugin surface for the public quiz experience. This is a legacy bridge, not the future platform center.
- `legacy/wordpress-theme-tkb-child/` - Transitional child theme surface for Divi/Jupiter customizations. This is a legacy bridge, not the future platform center.
- `frameworks/` - Original consulting frameworks intended for public consumption as Markdown-based documentation.
- `workshops/` and `presentations/` - Template structures for facilitation and speaking engagements. These directories must never contain client-specific content.
- `products/` - Digital product source files for Gumroad and course platforms.
- `docs/` - Repository governance, security policy, contributing guidelines, and stack documentation.

## Build And Deploy Commands

- No build step for plugins. PHP is deployed directly.
- Staging deployment: push to a `feature/*` branch, then Softaculous pulls to `dev.tkbstrategies.com`.
- Production deployment: merge to `main`, then Softaculous pulls to the production document root or GitHub Actions deploys by FTP to `/home/mvisdrdaLast/public_html/wp-content/plugins/`.
- Database migrations are handled by WordPress `dbDelta()` on plugin activation. No manual SQL migrations.

## Code Standards

- Follow WordPress PHP coding standards.
- Keep legacy plugin code fully decoupled from the Divi theme by using shortcodes or WordPress hooks. Never introduce hard Divi dependencies.
- All database table names must use `$wpdb->prefix` for multisite compatibility.
- Register AJAX endpoints with `wp_ajax_` and `wp_ajax_nopriv_` hooks and require nonce verification.

## Critical Boundaries

- Never commit client names, financials, engagement-specific data, or personal stories.
- If content references a specific organization or a person's confidential information, it belongs in Google Workspace, not this repository.
- Never commit `.env`, `wp-config.php`, database dumps, or API keys.
- Files or folders prefixed with `client-` and anything inside `/private` directories must remain untracked and ignored.

## Branching Model

- `main` is the production branch and must always remain deployable.
- Use `feature/*` branches for new work.
- Do not commit directly to `main`. Changes should merge through pull requests.

## Project Tracking

This repository uses two living documents for progress tracking:

- `docs/ROADMAP.md` - Phased project plan with task IDs (`P1.1`-`P9.5`), status indicators, dependencies, and ownership. This is the source of truth for what needs to happen and in what order.
- `docs/OPERATIONS-JOURNAL.md` - Daily closeout log recording what was completed, decisions made, blockers, files changed, and next priorities. Every working session ends with an entry.

When assisting with development, reference task IDs from the roadmap (for example, "This completes `P4.3`") and flag when work touches items in upcoming phases.

## Docusaurus Public Site

The `apps/docs-site/` directory contains the Docusaurus project deployed to GitHub Pages at `https://tkb-strategies.github.io`.

- Build: `cd apps/docs-site && npm run build`
- Local dev: `cd apps/docs-site && npm run start`
- Deploy: automated via GitHub Actions on merge to `main` in `.github/workflows/deploy-docs.yml`
- Content source: Markdown from `frameworks/`, `workshops/`, `presentations/`, and `docs/` is mapped into `apps/docs-site/docs/` for publication
- The Docusaurus site is the public-facing layer of the open consulting model and publishes frameworks, tools, and methodology
- The same client-data boundaries apply: nothing client-specific, no credentials, and no engagement details

## Consulting Frameworks Context

- Compassionate Agility: a framework for navigating organizational change through empathy, clarity, and adaptive leadership.
- Liberation Mapping: a strategic planning methodology that centers dignity, collective care, and systemic transformation over deficit-based approaches.
- The Steward's Manual: a guide for mission-driven leaders on sustainable organizational stewardship.
