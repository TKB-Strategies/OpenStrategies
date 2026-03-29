# All-Time Ops Journal

**Prepared:** 2026-03-25 15:18 UTC  
**Prepared by:** Codex  
**Scope:** Repository-wide engineering reconstruction from committed history, governance docs, site implementation, and current build verification.

## Executive Summary

`OpenStrategies` is the public engineering and publishing layer for TKB Strategies. The repository is intentionally split between:

- public methodology and documentation
- deployable infrastructure for a GitHub Pages documentation site
- placeholders and boundaries for future WordPress plugin, theme, staging, CI/CD, and product work

The implemented system today is real but early-stage:

- Git history shows the project was created and materially built on **2026-03-22**
- the GitHub repo, Pages deploy workflow, Docusaurus site, custom landing page, and first public journal posts are in place
- the Docusaurus site currently builds successfully on this machine with `npm run build`
- the WordPress plugin and child theme areas are still documentation shells, not active source trees
- the roadmap file is now partially stale relative to the git history and published site

## Sources Used

This summary was reconstructed from:

- `git log --oneline --graph --all`
- root governance and architecture docs: `README.md`, `CLAUDE.md`, `docs/ROADMAP.md`, `docs/STACK.md`, `docs/SECURITY.md`, `docs/OPERATIONS-JOURNAL.md`
- deployment and setup automation: `.github/workflows/deploy-docs.yml`, `scripts/setup-remote.sh`, `scripts/setup-docusaurus.sh`
- site implementation: `site/docusaurus.config.js`, `site/src/pages/index.js`, `site/src/css/custom.css`, `site/package.json`
- published docs and blog content under `site/docs/` and `site/blog/`
- current build verification from `cd site && npm run build`

## Repository Purpose And Boundaries

The repo is designed as an open consulting operating system, not a private client delivery repo. The repeated boundary across `README.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `SECURITY.md`, and directory-level `README.md` files is consistent:

- reusable frameworks, tooling, templates, and publishing infrastructure belong here
- client names, engagement details, credentials, exports, private data, and operational secrets do not
- WordPress production is expected to stay narrowly scoped to custom code under `wp-content`, not full-site source control

That boundary is reinforced technically by `.gitignore`, `.env.example`, and explicit security guidance around secrets and WordPress AJAX nonce use.

## Development Timeline

### 1. Foundation Build: 2026-03-22

The repo started from an empty local workspace and was shaped into a structured mono-repo for content, tooling, and future deployment. The first commits established:

- directory structure for `frameworks/`, `plugins/`, `themes/`, `workshops/`, `presentations/`, `products/`, `docs/`, and `site/`
- root and directory-specific `CLAUDE.md` context files
- baseline governance documents
- `.gitignore`, `.env.example`, `LICENSE`, and public-facing `README.md`

An early operational issue appeared immediately: Git and filesystem behavior on a WSL-mounted NTFS path was unreliable. The repo history and docs record two related decisions:

- Git metadata was moved into Linux storage with a linked gitdir pattern
- later, the working tree itself was migrated to a WSL-native Linux path

These were not cosmetic decisions. They were required to make Git and Node-based tooling behave predictably.

### 2. Project Tracking And Planning

The second wave of work formalized operating discipline:

- `docs/OPERATIONS-JOURNAL.md` was converted into a reusable closeout format
- `docs/ROADMAP.md` introduced a 9-phase plan with 82 tasks
- setup scripts were added for GitHub remote bootstrap and Docusaurus scaffolding
- `.github/profile/README.md` was created for the GitHub organization surface

This phase established a useful pattern: repo operations are meant to be recoverable from documentation, not tribal knowledge.

### 3. GitHub And Public Repo Activation

The git history shows the GitHub org/repo setup was completed enough to support normal PR-based development:

- remote configured for `https://github.com/TKB-Strategies/OpenStrategies.git`
- `main` established as the deployable branch
- feature branches used for site scaffold, design, deploy workflow, README redesign, and day-one publishing
- multiple pull requests were merged into `main`

Representative merged branches in history:

- `feature/docusaurus-scaffold`
- `feature/docusaurus-editorial-design`
- `feature/deploy-docs-workflow`
- `docs/readme-redesign`
- `feature/day1-progress-post`
- `docs/day1-journal`

This confirms the repo is no longer just local planning collateral. It is operating as a real GitHub-based collaboration surface.

### 4. Docusaurus Site Implementation

The most complete engineering work in the repo today is the Docusaurus site under `site/`.

### Platform

- Docusaurus `3.9.2`
- React `19`
- Node engine requirement `>=20`
- Mermaid support enabled through `@docusaurus/theme-mermaid`

### Deployment Model

`/.github/workflows/deploy-docs.yml` defines GitHub Pages deployment on pushes to `main` when site files or the workflow change. The workflow:

- checks out the repo
- sets up Node 20
- runs `npm ci` in `site/`
- runs `npm run build`
- uploads `site/build`
- deploys via `actions/deploy-pages@v4`

This is a proper static-site CI/CD path, even though broader CI for linting, plugin deploys, and staging promotion is not yet present.

### Site Architecture

`site/docusaurus.config.js` configures:

- production URL `https://tkb-strategies.github.io`
- base URL `/OpenStrategies/`
- docs sidebar navigation for frameworks
- blog as the public build-in-public journal
- external links to the main site and GitHub repo
- a footer organized around frameworks, tools/resources, and contact paths

### Frontend Design Direction

The landing page in `site/src/pages/index.js` is not a stock scaffold. It implements a custom editorial homepage with:

- an intersection-observer-based reveal animation system
- a cinematic hero section
- an impact strip with stats
- framework cards for the three core methodologies
- a philosophy section that states the open-consulting thesis
- a tools section pointing to the quiz/assessment work

The CSS in `site/src/css/custom.css` defines a strong visual system:

- DM Serif Display for headings and Lato for body copy
- a warm editorial palette built around slate, gold, amber, teal, parchment, and dark footer tones
- customized navbar, sidebar, markdown, blockquote, and footer styling
- support for both light and dark mode

This is the most mature part of the repo from an implementation standpoint.

### 5. Published Content State

The repository currently publishes a mixed set of complete and placeholder content.

### Present And Public

- framework overview pages for Compassionate Agility, Liberation Mapping, and The Steward's Manual
- a tool page for the Patterns & Protection workplace quiz
- a workshops overview page
- project roadmap and stack pages that link back to GitHub-hosted source docs
- two blog posts:
  - `Building an Open Consulting Company`
  - `Day 1: From Empty Folder to Live Site`

### Still Placeholder-Level

- framework docs are high-level intros, not full methodological manuals
- workshop docs are still a brief placeholder
- plugin documentation describes the intended product, but actual plugin source code is not in this repo yet
- theme docs describe scope, but no child theme implementation files are present
- products directories are placeholders only

### 6. WordPress / Plugin / Theme State

The repository’s architecture documents describe a future WordPress delivery model:

- plugin deployments via Softaculous Git or GitHub Actions FTP
- staging on `dev.tkbstrategies.com`
- production on Namecheap/cPanel/WordPress
- plugin schema migrations via `dbDelta()`
- WordPress AJAX endpoints protected by nonces

However, the current repo contents do not yet include the actual plugin or theme code needed to exercise those workflows. Today, these areas are preparatory:

- `plugins/tkb-quiz-tracker-v2/` contains boundary and intent documentation only
- `themes/tkb-child/` contains boundary and intent documentation only
- there is no PHP plugin bootstrap, asset pipeline, or theme stylesheet/template code in the tracked tree

Operationally, this means the repo is documentation-site-first right now, not WordPress-source-first.

### 7. Current State Verification

The following was directly verified during this review:

- git worktree is clean
- current branch is `main`
- Docusaurus production build succeeds with `cd site && npm run build`

Build notes from verification:

- static output was generated successfully under `site/build`
- a server-side webpack warning was emitted from a third-party dependency (`vscode-languageserver-types`)
- Docusaurus also emitted an update-check permission warning against `/home/tboat/.config`

Neither warning blocked the build.

### 8. Mismatches, Gaps, And Risks

Several repository documents are now behind the actual implementation state.

### Roadmap Drift

`docs/ROADMAP.md` still marks many Phase 2 and Phase 3 tasks as `NEXT` or `PLANNED`, even though git history shows the corresponding work was completed well enough to merge:

- remote setup and push
- GitHub Pages enablement
- Docusaurus scaffold
- site branding and navigation
- deploy workflow
- initial site publication

This is the largest operational documentation gap in the repo today.

### Stack Documentation Drift

`docs/STACK.md` is accurate at a high level but under-describes the implemented docs stack. It does not yet capture:

- Docusaurus versioning choices
- React runtime
- GitHub Pages deployment details
- Mermaid usage in published content

### Repo Narrative Drift

The repo contains strong day-one narrative documentation, but the canonical operations artifacts are split across:

- `docs/OPERATIONS-JOURNAL.md`
- `docs/journal/2026-03-22.md`
- site blog posts
- git history

There was no single synthesized engineering narrative before this file.

### Placeholder Surface Risk

The public docs and architecture imply a more complete WordPress/plugin system than the tracked code currently demonstrates. That is not necessarily wrong, but it creates a risk of overestimating operational maturity if someone reads only the high-level docs.

### 9. Current Operational Picture

As of this review, the repository should be understood as:

- a functioning public documentation and narrative publishing system
- a well-documented strategic scaffold for future WordPress and product work
- a repo with strong confidentiality boundaries and operating discipline
- a project whose implementation is ahead of some of its planning documents

In practical terms:

- GitHub-backed publishing works
- the static site is the real production artifact in this repo today
- WordPress/plugin/theme delivery paths are still mostly architectural intent
- framework publishing has started, but only at overview depth

### 10. Recommended Next Engineering Actions

The highest-value follow-up work is operational alignment, not more narrative.

1. Update `docs/ROADMAP.md` so statuses match merged history and current deployment reality.
2. Expand `docs/STACK.md` with the actual Docusaurus/GitHub Pages toolchain now in production.
3. Add a current-session journal entry using the numbered daily format to record this audit and any resulting doc corrections.
4. Decide whether the next execution track is:
   - Phase 4 WordPress staging
   - Phase 7 framework content expansion
   - Phase 5 verification and CI hardening
5. If the plugin is truly production-relevant now, import the real plugin source into `plugins/tkb-quiz-tracker-v2/` so the repo matches its public description.

## Appendix: Commit Spine

The core development spine visible in history is:

- `9ae21df` Initial repository structure for TKB Strategies open consulting model
- `2cba379` Remove failed Git bootstrap artifact
- `69feedb` Add project roadmap and restructure operations journal for daily closeout tracking
- `ea07605` Update CLAUDE.md with project tracking and Docusaurus context
- `1680ab6` Add GitHub Organization profile README for public-facing org page
- `983d750` Add setup scripts for GitHub remote (Phase 2) and Docusaurus scaffold (Phase 3)
- `3d0a4b6` Add Docusaurus AI context and README ahead of Phase 3 scaffold
- `e7ab1ef` Update .gitignore with Docusaurus exclusions (P3.8)
- `3d9cfdd` Daily closeout — Session 2: tracking infrastructure, Docusaurus planning, Phase 2 prep
- `f880b25` Update setup-remote.sh to reflect actual GitHub org and repo (TKB-Strategies/OpenStrategies)
- `a0865d3` Add .gitattributes to enforce LF line endings across environments
- `ae3a656` Scaffold Docusaurus site in Linux-native workspace (P3.1)
- `3efd013` Merge pull request #1 from TKB-Strategies/feature/docusaurus-scaffold
- `d7f840c` Replace default Docusaurus with TKB Strategies editorial design (P3.2-P3.7)
- `85f6437` Merge pull request #2 from TKB-Strategies/feature/docusaurus-editorial-design
- `5dc52c2` Add GitHub Actions workflow for Docusaurus deploy to GitHub Pages (P3.9)
- `ad14073` Merge pull request #3 from TKB-Strategies/feature/deploy-docs-workflow
- `dbc1b4a` Redesign README with structured sections, badges, folder tree, and contribution guidelines
- `51dd2c4` Add Day 1 progress post with Mermaid diagrams, install Mermaid plugin, update operations journal (P3.7)
- `d2addf6` Merge pull request #5 from TKB-Strategies/feature/day1-progress-post
- `4b57f17` Add Day 1 journal with visual progress mapping and architecture diagrams
- `4f8b7f5` Merge pull request #6 from TKB-Strategies/docs/day1-journal
