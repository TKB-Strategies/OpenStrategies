# Engineering Current State

**Date:** 2026-03-29
**Scope:** All active repositories under `/home/tboat/projects/`

---

## Repository Index

| Repo | Type | Primary Role |
|------|------|-------------|
| `tkb-strategies` | Monorepo | Public consulting platform — frameworks, apps, packages, service contracts |
| `client-template` | Docusaurus app | Per-engagement client knowledge base — cloneable template |
| `tkb-pipeline` | MCP server | Claude Code plugin for engagement provisioning and operations |
| `tkb-apps-script` | Google Apps Script | Automation layer for provisioning, sync, roster, and dashboard |

---

## 1. tkb-strategies

**Path:** `/home/tboat/projects/tkb-strategies`
**Branch model:** `main` is production; feature branches for new work
**Git remote:** GitHub (`TKB-Strategies` org)

### Top-level structure

```
tkb-strategies/
├── apps/
│   ├── docs-site/         Docusaurus public site → GitHub Pages
│   ├── client-portal/     Docusaurus client knowledge base (template instance)
│   └── healing-plan/      React/Vite standalone product app
├── packages/
│   ├── tenant-config/     TypeScript — TenantConfig type, validation, CSS generation
│   ├── workflow-engine/   JavaScript — client-portal navigation logic
│   ├── assessment-core/   JavaScript — healing plan scoring/structure
│   └── exports/           JavaScript — healing plan export logic
├── services/
│   ├── api/               Contract docs: tenants.md, assessments.md, exports.md
│   └── auth/              Contract docs: membership.md, roles.md, request-context.md
├── legacy/
│   ├── wordpress-plugin-quiz-tracker/   README placeholder only
│   └── wordpress-theme-tkb-child/       README placeholder only
├── frameworks/
│   ├── compassionate-agility/   README only
│   ├── liberation-mapping/      README only
│   └── stewards-manual/         README only
├── docs/                  Roadmap, journal, architecture ADRs, stack, security, contributing
├── workshops/templates/   README placeholder
├── presentations/templates/ README placeholder
├── products/
│   ├── courses/           README placeholder
│   └── gumroad/           README placeholder
└── tooling/scripts/       setup-docusaurus.sh, setup-remote.sh
```

### Known anomaly

A file named `h origin main` exists at the repo root — appears to be a misfired shell command captured as a file. Not a tracked concern in any doc, but present on disk.

---

### apps/docs-site

| Field | Value |
|-------|-------|
| Framework | Docusaurus (version in `package-lock.json`) |
| Package manager | npm |
| Config file | `docusaurus.config.js` (JavaScript, not TypeScript) |
| Deploy target | GitHub Pages (`tkb-strategies.github.io`) |
| Workflow | `.github/workflows/deploy-docs.yml` — triggers on push to `main` under `apps/docs-site/**` |
| Build command | `npm run build` (from `apps/docs-site/`) |
| Build artifact | `apps/docs-site/build/` |

**Content structure (`apps/docs-site/docs/`):**

| Path | Content |
|------|---------|
| `frameworks/compassionate-agility/` | Framework stub |
| `frameworks/liberation-mapping/` | Framework stub |
| `frameworks/stewards-manual/` | Framework stub |
| `project/roadmap.md` | Project roadmap (published) |
| `project/stack.md` | Stack documentation |
| `tools/quiz.md` | Quiz tool documentation |
| `workshops/index.md` | Workshops stub |

**Blog:** Two posts exist (`2026-03-22-day-one.mdx`, `2026-03-22-open-consulting-begins.md`)

---

### apps/client-portal

| Field | Value |
|-------|-------|
| Framework | Docusaurus 3.x |
| Package manager | npm (`package-lock.json` present) |
| Config file | `docusaurus.config.ts` (TypeScript) |
| Node version | 20 (`.nvmrc`) |
| Deploy target | cPanel FTP (workflow in `.github/workflows/`) |
| Workflow | Nested at `apps/client-portal/.github/workflows/` (not at repo root) |
| Build artifact | `apps/client-portal/build/` — **committed to repo** |

**Content structure (`apps/client-portal/docs/`):**

| Path | Content |
|------|---------|
| `01-stabilize/`, `02-name/`, `03-structure/`, `04-practice/`, `05-sustain/` | Phase docs |
| `cohort/` | Cohort section with stub index |
| `tools-assessments/` | Tools/assessments stub |
| `tutorial-basics/`, `tutorial-extras/` | Docusaurus default scaffolding (not removed) |

**Templates:** `templates/coaching-profile.md`, `templates/session-note.md`

**Config:** `client.json` present — uses `"Example Organization"` placeholder values. Same schema as `client-template`.

**Note:** Docusaurus default tutorial pages (`tutorial-basics/`, `tutorial-extras/`) remain in the content tree and have not been removed.

---

### apps/healing-plan

| Field | Value |
|-------|-------|
| Framework | React 18 + Vite 6 |
| Package manager | npm (`package-lock.json` present) |
| Entry point | `src/main.jsx` → `src/App.jsx` |
| Deploy target | cPanel FTP via `.cpanel.yml` + GitHub Actions (`.github/workflows/`) |
| Build command | `vite build` |
| Build artifact | `dist/` — **committed to repo** |
| ADR | `docs/adr/001-static-deploy.md` |

**Source files:** `src/App.jsx`, `src/index.css`, `src/main.jsx`
**App entry:** `app.js` at root (purpose unclear without reading — distinct from `src/main.jsx`)

---

### packages/

All packages follow the pattern: `package.json` + `src/` + `README.md`. None have a build step, test runner, or published registry entry as of current state.

| Package | Language | Source file | Key exports |
|---------|----------|-------------|-------------|
| `tenant-config` | TypeScript | `src/index.ts` | `TenantConfig` type, `assertTenantConfig()`, `createTenantAccentCss()`, `isCoachingEngagement()`, `adjustHex()` |
| `workflow-engine` | JavaScript | `src/clientPortal.js` | Client portal navigation logic |
| `assessment-core` | JavaScript | `src/healingPlan.js` | Healing plan scoring/structure |
| `exports` | JavaScript | `src/healingPlan.js` | Healing plan export logic |

**tenant-config** is the most complete package — has a full TypeScript interface, runtime validation via `assertTenantConfig()`, and CSS variable generation from a `TenantConfig` object. The other three packages contain extracted logic with no documented API surface.

No monorepo workspace config (`package.json` with `workspaces` field) exists at the repo root. Packages are not linked to each other or to the apps.

---

### services/

All contents are Markdown contract documents — no runtime code exists in either lane.

| Lane | Contract docs |
|------|--------------|
| `api/` | `tenants.md`, `assessments.md`, `exports.md` |
| `auth/` | `membership.md`, `roles.md`, `request-context.md` |

---

### legacy/

Both directories contain only a `README.md` and a `CLAUDE.md`. No PHP source files are present in the monorepo — the WordPress plugin and theme exist as boundary markers, not as code.

---

### CI/CD (root workflows)

| Workflow | Trigger | Build path | Deploy target |
|----------|---------|-----------|--------------|
| `deploy-docs.yml` | Push to `main`, paths: `apps/docs-site/**` | `apps/docs-site/` | GitHub Pages |
| `deploy-client-portal.yml` | (details in workflow file) | `apps/client-portal/` | FTP / cPanel |
| `deploy-healing-plan.yml` | (details in workflow file) | `apps/healing-plan/` | FTP / cPanel |

---

### docs/

| File | Purpose |
|------|---------|
| `ROADMAP.md` | Phased task plan with IDs P1.x–P9.x |
| `OPERATIONS-JOURNAL.md` | Daily closeout log |
| `STACK.md` | Stack documentation |
| `SECURITY.md` | Security policy |
| `CONTRIBUTING.md` | Contribution guidelines |
| `SERVICES-ARCHITECTURE.md` | Services architecture overview |
| `MONOREPO-MIGRATION-PLAN.md` | Migration plan (now executed) |
| `architecture/adr/0001-adopt-monorepo-lanes.md` | ADR for monorepo lane structure |
| `journal/2026-03-22.md` | Day 1 journal |
| `journal/2026-03-29.md` | Day 2 journal (monorepo migration) |

---

## 2. client-template

**Path:** `/home/tboat/projects/client-template`
**Git remote:** GitHub (`Open-Strategies` org, repo: `client-site-template`)
**Purpose:** The canonical cloneable template for per-client Docusaurus knowledge bases. One instance = one engagement.

### Runtime

| Field | Value |
|-------|-------|
| Framework | Docusaurus 3.9.2 |
| React | 19.0 |
| TypeScript | ~5.6.2 |
| Package manager | Yarn (`yarn.lock` present) |
| Node version | 20 (`.nvmrc`, `engines.node >= 20.0`) |
| Config | `docusaurus.config.ts` (TypeScript) |

### Configuration contract

`client.json` at root defines the per-engagement configuration. Current file contains example/placeholder values.

| Field | Type | Purpose |
|-------|------|---------|
| `orgName` | string | Displayed org name |
| `slug` | string | URL and folder slug |
| `primaryContact` | string | Contact name |
| `primaryColor` / `secondaryColor` | hex string | Brand colors (client-specific) |
| `engagementType` | enum string | Drives sidebar/nav layout |
| `engagementScope` | string | `cohort` or `organization` |
| `clientPathway` | string | Entry pathway identifier |
| `phases[]` | array of `{id, label, slug}` | Phase structure |
| `components[]`, `frameworks[]`, `tools[]` | arrays | Applied content overlays |
| `contractTerms` | object | Duration, pricing, hours, sessions, participants |

**Engagement types supported:** `cohort-coaching`, `individual-coaching`, `grounded-growth`, `org-consulting`, `workshop-retreat`, `retainer-advisory`

### File structure

```
client-template/
├── docs/
│   ├── intro.md
│   ├── 01-stabilize/ through 05-sustain/   Phase content
│   ├── cohort/                              Cohort section
│   └── tools-assessments/
├── templates/
│   ├── coaching-profile.md
│   └── session-note.md
├── src/css/custom.css                       Design system source
├── static/img/                              .gitkeep (no real assets)
├── ops/
│   ├── ALL-TIME-OPS-JOURNAL.md
│   └── README.md
├── tkb-pipeline-dev/                        Embedded dev copy of pipeline plugin
│   ├── .claude-plugin/plugin.json
│   ├── .mcp.json
│   ├── agents/pipeline-orchestrator.md
│   ├── servers/index.js + package.json
│   └── skills/  (manage-roster, provision-engagement, sync-content, update-engagement)
├── client.json
├── docusaurus.config.ts
├── sidebars.ts
├── package.json
└── tsconfig.json
```

### Deploy

| Workflow | Trigger | Target |
|----------|---------|--------|
| `deploy.yml` | Push to `main` | FTP → cPanel (secrets: `FTP_HOST`, `FTP_USER`, `FTP_PASS`) |
| `deploy-pages.yml` | (in workflows dir) | GitHub Pages |

### Sensitive files present

`.config/` directory contains two private key `.pem` files:
- `tkb-deploy.2026-03-24.private-key.pem`
- `tkb-pipeline.2026-03-23.private-key.pem`

These are **not** in `.gitignore` by default — verify they are excluded from the repo's tracked files.

### Design system

- **Headlines:** DM Serif Display (Google Fonts)
- **Body:** Lato (Google Fonts)
- Design lives in `src/css/custom.css` — two-layer palette: fixed warm structural tones + configurable client accent colors driven from `client.json`
- Client accent values must never be hardcoded in CSS

### tkb-pipeline-dev/

An embedded copy of the `tkb-pipeline` MCP server and skills lives inside this repo at `tkb-pipeline-dev/`. It contains an identical `servers/index.js`, the four skills, the pipeline orchestrator agent, and its own `node_modules`. This is a dev/testing copy — see `tkb-pipeline` for the canonical version.

---

## 3. tkb-pipeline

**Path:** `/home/tboat/projects/tkb-pipeline`
**Purpose:** MCP server that automates client engagement provisioning and operations. Used as a Claude Code plugin via `.mcp.json`.

### Runtime

| Field | Value |
|-------|-------|
| Runtime | Node.js (ESM, `"type": "module"`) |
| MCP SDK | `@modelcontextprotocol/sdk ^1.0.0` |
| GitHub client | `@octokit/rest ^21.0.0` + `@octokit/auth-app ^7.1.0` |
| Auth method | GitHub App (App ID + private key + installation ID) |
| cPanel integration | Direct HTTPS requests to port 2083 |
| Entry point | `servers/index.js` |
| No build step | Runs directly with `node` |

### File structure

```
tkb-pipeline/
├── servers/
│   ├── index.js           MCP server — 8 tools
│   └── package.json
├── skills/
│   ├── provision-engagement/SKILL.md
│   ├── update-engagement/SKILL.md
│   ├── sync-content/SKILL.md
│   └── manage-roster/SKILL.md
├── agents/
│   └── pipeline-orchestrator.md
├── .claude-plugin/
│   └── plugin.json
├── .mcp.json              Points server to servers/index.js
├── .env.example
└── README.md
```

### Exposed MCP tools (8)

| Tool | Action |
|------|--------|
| `provision_engagement` | Full provisioning: repo + config + subdomain |
| `create_repo_from_template` | Create repo from `Open-Strategies/client-site-template` |
| `commit_file` | Create or update a file in any repo |
| `get_repo_contents` | Read file or list directory in a repo |
| `list_repos` | List all repos in `TKB-Strategies` org |
| `create_subdomain` | Create a cPanel subdomain via UAPI |
| `list_subdomains` | List existing subdomains |
| `set_repo_secrets` | Set GitHub Actions secrets on a repo |

### Claude Code skills (4)

| Skill | Purpose |
|-------|---------|
| `provision-engagement` | Full onboarding from intake to live subdomain |
| `update-engagement` | Modify config, add phases, extend timelines |
| `sync-content` | Push Drive content into client repos |
| `manage-roster` | Coachee lifecycle management |

### Configuration

Credentials are injected via environment variables. The `.mcp.json` passes non-secret env vars directly; secrets (`GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY_PATH`, `GITHUB_APP_INSTALLATION_ID`, `CPANEL_*`) are expected in `.claude/settings.local.json` (not tracked).

| Env var | Source | Purpose |
|---------|--------|---------|
| `GITHUB_APP_ID` | settings.local.json | GitHub App ID |
| `GITHUB_APP_PRIVATE_KEY_PATH` | settings.local.json | Path to GitHub App private key `.pem` |
| `GITHUB_APP_INSTALLATION_ID` | settings.local.json | Installation ID for TKB-Strategies org |
| `GITHUB_ORG` | .mcp.json | `TKB-Strategies` |
| `GITHUB_TEMPLATE_ORG` | .mcp.json | `Open-Strategies` |
| `GITHUB_TEMPLATE_REPO` | .mcp.json | `client-site-template` |
| `CPANEL_DOMAIN` | .mcp.json | `tkbstrategies.com` |
| `CPANEL_API_TOKEN`, `CPANEL_USERNAME`, `CPANEL_HOSTNAME` | settings.local.json | cPanel auth |

### GitHub App requirements

The GitHub App must be installed on the `TKB-Strategies` org with:
- Repository → Contents: Read & write
- Repository → Administration: Read & write
- Repository → Secrets: Read & write
- Repository → Metadata: Read-only

---

## 4. tkb-apps-script

**Path:** `/home/tboat/projects/tkb-apps-script`
**Purpose:** Google Apps Script automation layer for the full engagement pipeline. Mirrors most of `tkb-pipeline`'s behavior using Google's runtime (Sheets, Drive, Forms, Gmail) instead of the MCP server pattern.

### Runtime

| Field | Value |
|-------|-------|
| Language | Google Apps Script (`.gs` = server-side JavaScript) |
| Tooling | `clasp` for local file management |
| Script ID | Placeholder (`PASTE_YOUR_SCRIPT_ID_HERE`) — not yet linked to a live project |
| Source root | `src/` |

### File inventory (14 `.gs` + 1 `.html`)

| File | Purpose | Test status |
|------|---------|------------|
| `Config.gs` | Script Properties config, phase defaults, `slugify()` | — |
| `GitHubApi.gs` | GitHub REST: create repos, commit files, read content, set variables | — |
| `CpanelApi.gs` | cPanel UAPI/API2: create and delete subdomains | — |
| `CpanelGitApi.gs` | cPanel Git Version Control: create, pull, delete repos | Optional feature |
| `DriveHelpers.gs` | Drive folder creation, file export, sync path mapping | — |
| `Provision.gs` | 9-step provisioning orchestrator (`onIntakeFormSubmit`) | Tested end-to-end |
| `ContentSync.gs` | 5-minute timer: Drive changes → GitHub commits | Built, untested |
| `RosterHandler.gs` | Assessment form + roster sheet edits → coachee profile updates | Built, untested |
| `UpdateHandler.gs` | Engagement update form → `client.json` changes | Built, untested |
| `Decommission.gs` | 7-step lifecycle teardown with dry-run support | Built, untested |
| `DashboardApi.gs` | Web app: serve dashboard HTML, data endpoint, workflow endpoints | Built, untested |
| `Triggers.gs` | Timer and form trigger installation | — |
| `BuildForms.gs` | One-time builders: intake, assessment, partnership prep, update forms | — |
| `BuildSheets.gs` | One-time builders: registry and people directory sheets | **Needs to be run** |
| `Migration.gs` | Scan/analyze/restructure/provision existing Drive client folders | Built, untested |
| `Dashboard.html` | Pipeline dashboard UI: stats, charts, action buttons, migration wizard | Built, untested |

### External integrations

| System | Access method | Credentials location |
|--------|--------------|---------------------|
| GitHub | REST API via `UrlFetchApp` using classic PAT | Script Properties (`GITHUB_PAT`) |
| cPanel | HTTPS to port 2083 via `UrlFetchApp` | Script Properties (`CPANEL_API_TOKEN`, etc.) |
| Google Drive | Drive service (`DriveApp`) | Ambient via Apps Script |
| Google Sheets | Sheets service (`SpreadsheetApp`) | Ambient via Apps Script |
| Google Forms | Forms service (`FormApp`) | Ambient via Apps Script |
| Gmail | Mail service (`MailApp`) | Ambient via Apps Script |

### Pipeline automation flow

```
Intake Form submit
  → onIntakeFormSubmit() → provisionEngagement()
      → createRepoFromTemplate()    GitHub API
      → waitForRepo()               GitHub API (poll)
      → commitFile(client.json)     GitHub API
      → createSubdomain()           cPanel UAPI
      → createEngagementFolders()   Google Drive
      → createRosterSheet()         Google Sheets (coaching types only)
      → addToRegistry()             Google Sheets
      → sendConfirmation()          Gmail

Every 5 minutes (timer trigger):
  → syncDriveContent()
      → getActiveEngagements()     Registry sheet
      → getModifiedFiles()         Google Drive
      → exportDocAsMarkdown()      Drive export API
      → commitFile()               GitHub API → GitHub Actions → FTP deploy

On roster sheet edit:
  → onRosterEdit() → updateCoacheeSpine()  GitHub API

On assessment form submit:
  → onAssessmentResponse()
      → updateRosterRow()          Google Sheets
      → buildCoacheeProfile()      GitHub API
      → updatePeopleDirectory()    Google Sheets

On update form submit:
  → onUpdateFormSubmit() → processEngagementUpdate()
      → getFileContent(client.json) GitHub API
      → commitFile(client.json)     GitHub API

Decommission:
  → decommissionEngagement(slug)
      → updateRegistryStatus()     Google Sheets → Archived
      → DELETE repo                GitHub API
      → deleteSubdomain()          cPanel API2
      → moveTo(_Archive)           Google Drive
      → archivePeopleForEngagement() Google Sheets
```

### Setup state (as of 2026-03-24)

| Step | Status |
|------|--------|
| Script Properties configured (GitHub, cPanel, FTP, Drive) | Done |
| `buildRegistrySheet()` | **Pending** |
| `buildPeopleSheet()` | **Pending** |
| `buildPartnershipPrepForm()` | Done |
| `buildUpdateForm()` | Done |
| Intake + assessment form triggers wired | Done |
| 5-minute content sync timer | Needs `setupTriggers()` |
| Dashboard deployed as web app | Pending |
| `delete_repo` scope on PAT | Pending |
| cPanel Git integration | Optional, disabled by default |
| End-to-end provisioning test | Passed |

### Note on GitHub auth

The Apps Script layer uses a **classic PAT** stored in Script Properties. The `tkb-pipeline` MCP server uses a **GitHub App** (App ID + private key). These are separate credential paths serving the same GitHub org.

---

## Cross-repo relationships

```
Open-Strategies/client-site-template (GitHub)
    ↑ cloned from
    client-template/           (local canonical copy + dev pipeline embed)

    tkb-apps-script/           creates repos from this template via GitHub API
    tkb-pipeline/servers/      creates repos from this template via Octokit

tkb-strategies/apps/client-portal/
    ↑ is an instance of the client-template pattern
    (manually placed, not provisioned through the pipeline)

tkb-pipeline/
    ↑ embedded dev copy lives in
    client-template/tkb-pipeline-dev/

tkb-strategies/packages/tenant-config/
    ↑ defines the TypeScript type for client.json
    (not yet consumed by apps — no workspace linkage)
```

---

## Notable observations

1. **Build artifacts committed.** `apps/client-portal/build/` and `apps/healing-plan/dist/` are tracked in `tkb-strategies`. These are typically gitignored in Docusaurus and Vite projects.

2. **No monorepo workspace config.** `tkb-strategies` has no root `package.json` with a `workspaces` field. The four packages under `packages/` are not linked to each other or to the apps — they are logically grouped but not wired as a functional workspace.

3. **Two parallel pipeline implementations.** `tkb-apps-script` and `tkb-pipeline` both implement provisioning against the same GitHub org and cPanel host via different auth mechanisms (PAT vs. GitHub App) and different runtimes (Google Apps Script vs. Node.js MCP server).

4. **Docusaurus default scaffolding not cleaned.** `apps/client-portal` still contains `tutorial-basics/` and `tutorial-extras/` from the original Docusaurus init.

5. **clasp scriptId is a placeholder.** `tkb-apps-script/.clasp.json` contains `"scriptId": "PASTE_YOUR_SCRIPT_ID_HERE"` — the local files have not been linked to a live Apps Script project via clasp.

6. **Legacy directories are stubs only.** `legacy/wordpress-plugin-quiz-tracker` and `legacy/wordpress-theme-tkb-child` contain only README and CLAUDE.md files. The actual PHP source is not present in this repo.

7. **Services layer is docs-only.** Everything under `tkb-strategies/services/` is Markdown. No runtime code, schemas, or scaffolding exists in either the `api/` or `auth/` lanes.

8. **Private keys in client-template.** `.config/` contains two `.pem` files. Confirm these are covered by `.gitignore` before any push from that directory.
