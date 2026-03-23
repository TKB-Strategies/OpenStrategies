# Operations Journal

This document is the daily closeout log for the `tkb-strategies` repository. Every working session ends with an entry so the repository keeps a durable record of progress, decisions, blockers, and next steps.

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
