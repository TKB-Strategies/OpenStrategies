# Operations Journal

This document is the daily closeout log for the `tkb-strategies` repository. Every working session ends with an entry so the repository keeps a durable record of progress, decisions, blockers, and next steps.

For milestone-day narrative summaries, use the journal entries in [`docs/journal/`](journal/README.md).

Recent narrative entries:

- [2026-03-22](journal/2026-03-22.md) — Day 1 foundation, GitHub activation, and first live public site
- [2026-03-29](journal/2026-03-29.md) — Day 2 monorepo migration, shared package extraction, and service-boundary definition

## Daily Closeout Template

Copy this template for each session:

```markdown
## YYYY-MM-DD — Session N

| Field | Value |
|---|---|
| Phase | Phase name or milestone |
| Focus | Short summary of the session objective |
| Branch | Branch name |

### Completed

- `PX.Y` — Task summary
- `PX.Z` — Task summary

### Decisions Made

| Decision | Rationale | Impact |
|---|---|---|
| Decision summary | Why this decision was made | What changes because of it |

### Blockers

| Blocker | Resolution | Status |
|---|---|---|
| Blocker summary | How it was resolved or next action | Open or Closed |

### Files Changed

- `path/to/file`
- `path/to/other-file`

### Next Session

- `PX.Y` — Next task
- `PX.Z` — Next task

### Commits

- `abcdef0` Commit message
```

## 2026-03-22 — Session 1

| Field | Value |
|---|---|
| Phase | Phase 1 — Local Repository Foundation |
| Focus | Establish the local repository structure, governance docs, and AI context for WSL-based development |
| Branch | `main` |

### Completed

- `P1.1` — Created the local `tkb-strategies` working tree in WSL at `/mnt/c/Users/tboat/Documents/OpenTKB/tkb-strategies`
- `P1.2` — Created the baseline repository directory structure for plugins, themes, frameworks, workshops, presentations, products, and docs
- `P1.3` — Added `.claude/settings.json` placeholder for Claude Code managed permissions
- `P1.4` — Added `.mcp.json` placeholder for future MCP integrations
- `P1.5` — Created the root `CLAUDE.md` with project overview, architecture, deployment notes, boundaries, and coding standards
- `P1.6` — Added plugin-level AI context in `plugins/tkb-quiz-tracker-v2/CLAUDE.md`
- `P1.7` — Added theme-level AI context in `themes/tkb-child/CLAUDE.md`
- `P1.8` — Added framework-level AI context in `frameworks/CLAUDE.md`
- `P1.9` — Added placeholder `README.md` files across working directories with public/private boundary guidance
- `P1.10` — Created `docs/CONTRIBUTING.md` with public-disclosure rules for commits
- `P1.11` — Created `docs/SECURITY.md` with secret handling and AJAX nonce expectations
- `P1.12` — Created `docs/STACK.md` documenting the build, publishing, distribution, and hosting stack
- `P1.13` — Created `.gitignore` rules for secrets, dumps, exports, client-prefixed paths, IDE artifacts, and backups
- `P1.14` — Created `.env.example` with local database, FTP, and WordPress environment placeholders
- `P1.15` — Added the root `README.md` and `LICENSE`
- `P1.16` — Initialized the Git repository on `main` and created the initial repository structure commit
- `P1.17` — Migrated Git metadata to a persistent WSL path and documented the linked-gitdir operating pattern

### Decisions Made

| Decision | Rationale | Impact |
|---|---|---|
| Keep the working tree on `/mnt/c` and store Git metadata in WSL Linux storage | Git initialization on the mounted NTFS path failed due to lock and chmod behavior | The repository now uses a linked `.git` pointer file with a persistent gitdir at `/home/tboat/.local/share/git/tkb-strategies.git` |
| Encode confidentiality boundaries directly in repo docs and placeholders from day one | This repo is intended for public and reusable work only, while private client operations live elsewhere | Contributors and AI tools get repeated boundary guidance at the root, docs, and subdirectory levels |
| Use `main` as the local production branch immediately | The repo will later connect to GitHub and deployment workflows that assume `main` is the deployable branch | Branching conventions are established before remote setup and CI/CD work begins |

### Blockers

| Blocker | Resolution | Status |
|---|---|---|
| Standard Git initialization failed on the WSL-mounted Windows path | Switched to a linked Git directory stored in Linux space and then migrated it to a persistent location | Closed |
| Git marked the mounted repository path as a safe-directory issue | Added the repository worktree path to the global Git safe-directory config | Closed |

### Files Changed

- `.claude/settings.json`
- `.mcp.json`
- `CLAUDE.md`
- `plugins/tkb-quiz-tracker-v2/CLAUDE.md`
- `plugins/tkb-quiz-tracker-v2/README.md`
- `themes/tkb-child/CLAUDE.md`
- `themes/tkb-child/README.md`
- `frameworks/CLAUDE.md`
- `frameworks/compassionate-agility/README.md`
- `frameworks/liberation-mapping/README.md`
- `frameworks/stewards-manual/README.md`
- `workshops/templates/README.md`
- `presentations/templates/README.md`
- `products/gumroad/README.md`
- `products/courses/README.md`
- `docs/CONTRIBUTING.md`
- `docs/SECURITY.md`
- `docs/STACK.md`
- `.gitignore`
- `.env.example`
- `README.md`
- `LICENSE`

### Next Session

- `P1.18` — Restructure the operations journal around a standard daily closeout template
- `P1.19` — Create the multi-phase project roadmap with task IDs, dependencies, and ownership
- `P2.1` — Create the GitHub Organization
- `P3.1` — Scaffold the Docusaurus documentation site after GitHub setup is complete

### Commits

- `9ae21df` Initial repository structure for TKB Strategies open consulting model
- `2cba379` Remove failed Git bootstrap artifact

## 2026-03-22 — Session 2

| Field | Value |
|---|---|
| Phase | Phase 1 completion / Phase 2-3 preparation |
| Focus | Project tracking infrastructure, Docusaurus planning, and Phase 2 preparation |
| Branch | `main` |

### Completed

- `P1.18` — Restructured the Operations Journal with a standard daily closeout template
- `P1.19` — Created the project roadmap, then expanded it to 9 phases and 82 tasks
- Updated the root `CLAUDE.md` with project tracking and Docusaurus public-site context
- `P2.10` — Created the GitHub Organization profile README at `.github/profile/README.md`
- `P2.3` / `P3.1` preparation — Created `scripts/setup-remote.sh` and `scripts/setup-docusaurus.sh`
- `P3.9` — Pre-created `site/CLAUDE.md` for Docusaurus-specific AI context
- `P3.10` — Pre-created `site/README.md` for Docusaurus onboarding
- `P3.8` — Updated `.gitignore` with Docusaurus exclusions ahead of the scaffold

### Decisions Made

| Decision | Rationale | Impact |
|---|---|---|
| Added Docusaurus as Phase 3 in the roadmap | GitHub Pages plus Docusaurus provides a free, Markdown-native publishing layer for the open consulting model so frameworks, methodology, and tools can publish directly from repo content | Original phases were renumbered from 3-8 to 4-9, 13 Docusaurus tasks were added, and the roadmap now totals 82 tasks |
| Pre-created `site/CLAUDE.md` before the Docusaurus scaffold | AI context should be ready the moment the scaffold lands so Claude Code has full context from the first interaction with the `site/` directory | The `site/` directory now contains context files that the scaffold can layer onto |
| Created setup scripts instead of relying on inline instructions | Scripts are repeatable, self-documenting, and can prompt the next manual actions | Phase 2 and Phase 3 kickoff each reduce to a single command with guided follow-through |

### Blockers

| Blocker | Resolution | Status |
|---|---|---|
| WSL on `/mnt/c` would not honor direct `chmod +x` changes for shell scripts | Use `git update-index --chmod=+x` when committing executable scripts on this filesystem | Closed |
| Git commits from the coding sandbox fail because repository metadata lives outside the writable roots | Manual Git commit steps are now delegated to the terminal when needed | Closed |

### Files Changed

- `docs/OPERATIONS-JOURNAL.md`
- `docs/ROADMAP.md`
- `CLAUDE.md`
- `.github/profile/README.md`
- `scripts/setup-remote.sh`
- `scripts/setup-docusaurus.sh`
- `site/CLAUDE.md`
- `site/README.md`
- `.gitignore`

### Next Session

- `P2.1` — Create the GitHub Organization at `github.com`
- `P2.2` — Create the empty repository under the organization
- `P2.3` — Run `bash scripts/setup-remote.sh`
- `P2.4` — Push `main` and verify upstream tracking
- `P2.5` — Configure branch protection for `main`
- `P2.9` — Enable GitHub Pages
- `P3.1` — Run `bash scripts/setup-docusaurus.sh`

### Commits

- `69feedb` Add project roadmap and restructure operations journal for daily closeout tracking
- `ea07605` Update CLAUDE.md with project tracking and Docusaurus context
- `1680ab6` Add GitHub Organization profile README for public-facing org page
- `983d750` Add setup scripts for GitHub remote (Phase 2) and Docusaurus scaffold (Phase 3)
- Pending manual commit: `Add Docusaurus AI context and README ahead of Phase 3 scaffold`
- Pending manual commit: `Update .gitignore with Docusaurus exclusions (P3.8)`
- Pending manual commit: `Daily closeout — Session 2: tracking infrastructure, Docusaurus planning, Phase 2 prep`

## 2026-03-29 — Session 4

| Field | Value |
|---|---|
| Phase | Pre-Validation Debt Resolution |
| Focus | Cross-repo technical debt audit and Tier 1 remediation across all four active repos |
| Branch | `main` |

### Completed

- Reviewed `Tech-Debt-Assessment-2026-03-29.md` (ADR) and mapped actionable items to each repo
- **tkb-strategies** — Removed Docusaurus tutorial scaffold from `apps/client-portal/docs/` (TD-11); deleted stray `h origin main` file; confirmed `apps/client-portal/build/` and `apps/healing-plan/dist/` already excluded by `.gitignore` and not tracked (TD-10); committed `docs/CURRENT-STATE.md` and the tech debt ADR (TD-15/SD-05)
- **tkb-apps-script** — Linked `.clasp.json` to the live Apps Script project (TD-06); moved sync timestamp write to after the forEach loop to prevent silent data loss on failed runs (TD-02); added `getColumnMap()` helper and replaced magic column index fallbacks in `ContentSync.gs` (TD-08); replaced hardcoded column numbers in `Decommission.gs` using `getColumnMap()` (TD-19); documented intentional PAT auth deviation with trade-off rationale in `Config.gs` (SD-01); added plaintext-variables warning to `setFtpVariables()` with TD-13 migration note (TD-01 Option B); staged previously untracked `CpanelGitApi.gs` and `Migration.gs`; updated `PIPELINE-STATUS.md` with Known Debt table
- **tkb-pipeline** — Removed non-functional `set_repo_secrets` tool and `tweetnacl` dependency (TD-04); confirmed `package-lock.json` already committed (TD-05); ran `npm install` to sync lock file after dependency removal
- Verified TD-05 and partial TD-04 were already resolved before this session

### Decisions Made

| Decision | Rationale | Impact |
|---|---|---|
| TD-01 Option B: defer FTP-to-secrets migration | The real fix is eliminating FTP entirely (TD-13 SSH/rsync migration); encrypting FTP_PASS as a GitHub Secret is interim at best since all client repos are private | Warning comment added to `setFtpVariables()`; no change to provisioning behavior; FTP→SSH is the correct resolution path |
| Remove `set_repo_secrets` rather than fix it | `tweetnacl` doesn't implement libsodium sealed-box encryption; the correct library is `libsodium-wrappers`; the GAS layer handles FTP credential setting; a silently broken tool is worse than no tool | Tool removed from MCP server; `tweetnacl` removed from `package.json`; `package-lock.json` updated |
| Document PAT as intentional auth deviation (SD-01) | Apps Script cannot sign JWTs natively, which GitHub App auth requires; classic PAT is the pragmatic single-operator choice | Comment block added to `Config.gs` with trade-offs and rotation guidance; Capabilities Statement contradiction is now resolved at the code level |
| `clasp pull` not required for TD-06 validation | `clasp` (Google CLI) is not installed; manual file-by-file comparison against the live GAS editor achieves the same verification | Manual sync path documented; TD-06 resolved via `.clasp.json` update and live editor comparison |

### Blockers

| Blocker | Resolution | Status |
|---|---|---|
| `clasp` not installed — could not run `clasp pull` to verify live GAS code matches repo | Manual comparison: open changed files in GAS editor, confirm content matches repo | Closed |

### Files Changed

**tkb-strategies**
- `apps/client-portal/docs/tutorial-basics/` (deleted)
- `apps/client-portal/docs/tutorial-extras/` (deleted)
- `docs/CURRENT-STATE.md` (committed)
- `docs/architecture/adr/Tech-Debt-Assessment-2026-03-29.md` (committed)
- `docs/OPERATIONS-JOURNAL.md` (this entry)
- `docs/architecture/adr/Tech-Debt-Assessment-2026-03-29.md` (remediation tables updated)

**tkb-apps-script**
- `.clasp.json`
- `src/Config.gs`
- `src/ContentSync.gs`
- `src/Decommission.gs`
- `src/GitHubApi.gs`
- `PIPELINE-STATUS.md`
- `src/CpanelGitApi.gs` (staged)
- `src/Migration.gs` (staged)

**tkb-pipeline**
- `servers/index.js`
- `servers/package.json`
- `servers/package-lock.json`

### Next Session

- Run `buildRegistrySheet()` and `buildPeopleSheet()` in the GAS editor (once each)
- Run `buildPartnershipPrepForm()` and `buildUpdateForm()` in the GAS editor
- Run `setupTriggers()` and `wireAllFormTriggers()` to install the 5-minute sync timer and all form submit triggers
- Deploy the Dashboard as a GAS web app (Deploy → New deployment → Web app)
- Provision the first live engagement via the intake form
- TD-03 (provisioning rollback): implement `cleanupProvision()` during or immediately after first engagement

### Commits

- Pending — see commit scripts in this session's work above

---

## 2026-03-22 — Session 3

| Field | Value |
|---|---|
| Phase | Phase 2 (Complete) / Phase 3 (Substantially Complete) |
| Focus | GitHub org setup, WSL migration, Docusaurus editorial design, first deploy, README redesign, Day 1 progress post |
| Branch | `main`, `feature/*` |

### Completed

- `P2.1-P2.6` — Completed GitHub org setup, repo creation, remote connection, push, branch protection, and repository settings
- `P2.8-P2.10` — Added repository defaults, enabled GitHub Pages, and published the org profile surface
- `P3.1-P3.5` — Scaffolded Docusaurus, configured branding, and established the initial docs information architecture
- `P3.7-P3.11` — Built the landing page and navigation, deployed the docs workflow, and published the first GitHub Pages site
- Added `.gitattributes` LF enforcement after the WSL migration
- Migrated the working tree to the WSL-native Linux filesystem to resolve NTFS permission failures
- Redesigned `README.md` for a more structured public-facing repository presentation
- Installed the Mermaid theme for Docusaurus and added the Day 1 progress post with visual diagrams

### Next Session

- `P2.7` — Verify org profile README rendering
- `P3.6` — Update `site/CLAUDE.md`
- `P3.12` — Add Docusaurus to `STACK.md`
- `P3.13` — Evaluate a custom docs domain
- Choose the next execution track: Phase 4 WordPress staging or Phase 7 framework publishing
