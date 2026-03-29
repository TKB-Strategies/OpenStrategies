# Technical Debt Assessment — TKB Strategies

**Date:** March 29, 2026 (updated with Addendum B same day)
**Scope:** All four active repositories (`tkb-strategies`, `client-template`, `tkb-pipeline`, `tkb-apps-script`)
**Method:** Code-level audit against the Engineering Current State inventory + cross-reference against Capabilities Statement from the design conversation

---

## Scoring Method

Each item is scored on three axes:

- **Impact** (1–5): How much does this slow work down or put the system at risk?
- **Risk** (1–5): What happens if this is never addressed?
- **Effort** (1–5): How hard is the fix? (inverted in the formula — easier fixes score higher)

**Priority = (Impact + Risk) × (6 − Effort)**

Higher score = fix sooner.

---

## Summary by Category

| Category | Items | Top Priority Score |
|----------|------:|-------------------:|
| Security & credentials | 3 | 45 |
| Data integrity | 3 | 40 |
| Missing validation | 4 | 36 |
| Infrastructure & CI/CD | 5 | 35 |
| Architecture debt | 4 | 24 |
| Code quality | 4 | 20 |
| Documentation drift | 3 | 15 |

---

## Prioritized Debt Register

### Tier 1 — Fix Before First Real Engagement

These items create real risk during the pipeline validation work identified in the System Design Review.

---

#### TD-01: FTP credentials stored as GitHub Actions variables, not secrets

**Category:** Security
**Location:** `tkb-apps-script/GitHubApi.gs` → `setFtpVariables()`, lines 177–194

The pipeline stores FTP_HOST, FTP_USER, and FTP_PASS as **repository-level Actions variables** (via `setRepoVariable()`), not secrets. Variables are visible in plaintext to anyone with repo read access and appear in workflow logs. The deploy workflow references them with `${{ vars.FTP_HOST }}`, confirming they are not encrypted.

FTP credentials grant write access to the cPanel document root. Anyone who can read the repo can read the password.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 4 | 5 | 1 | **45** |

**Fix:** Change `setRepoVariable()` calls to use the GitHub Actions secrets API (`/repos/{owner}/{repo}/actions/secrets/`) with libsodium encryption. Update `deploy.yml` to reference `${{ secrets.FTP_PASS }}` instead of `${{ vars.FTP_PASS }}`. The MCP server's `set_repo_secrets` already has the encryption scaffolding (lines 158–207 of `index.js`) — port that pattern.

---

#### TD-02: Content sync writes timestamp before sync completes

**Category:** Data integrity
**Location:** `tkb-apps-script/ContentSync.gs`, line 22

```javascript
// Update timestamp immediately (so next run doesn't re-process on failure)
props.setProperty(lastSyncKey, new Date().toISOString());
```

The code intentionally updates `LAST_SYNC_TIMESTAMP` *before* processing any files. The comment says "so next run doesn't re-process on failure." The intent is to prevent duplicate processing, but the effect is the opposite of safe: if the sync crashes mid-run, the next cycle skips every file that was modified during the failed window. Those files are never synced unless manually re-touched in Drive.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 5 | 5 | 2 | **40** |

**Fix:** Move the timestamp write to after the sync loop completes successfully. If partial failure handling is desired, track per-engagement sync timestamps rather than a global one, and only advance the timestamp for engagements that synced without error.

---

#### TD-03: Provisioning has no rollback on partial failure

**Category:** Data integrity
**Location:** `tkb-apps-script/Provision.gs`, lines 98–225; `tkb-pipeline/servers/index.js`, lines 280–344

Both the Apps Script and MCP server implementations of provisioning run 4–9 steps sequentially. If step 1 (create repo) succeeds but step 4 (create subdomain) fails, you're left with an orphaned GitHub repo, a Drive folder, and a registry row pointing at a non-existent site. The code logs the error and continues to the next step, which means later steps may succeed against an inconsistent state.

The MCP server is worse — it only has 3 steps (repo, client.json commit, subdomain) and returns partial results with no cleanup path at all.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 4 | 4 | 3 | **24** |

**Fix (near-term):** Add a `cleanupProvision(slug, completedSteps)` function that reverses completed steps when a critical step fails. The decommission code already does most of this — factor it into a targeted cleanup. At minimum, if subdomain creation fails, delete the repo rather than leaving an orphan.

**Fix (longer-term):** Implement a state machine pattern where each step records its completion status in Script Properties. On retry, the provisioner picks up from the last successful step instead of starting over.

---

#### TD-04: MCP server `set_repo_secrets` silently skips if tweetnacl isn't installed

**Category:** Missing validation
**Location:** `tkb-pipeline/servers/index.js`, lines 170–183

```javascript
const sodium = await import("tweetnacl").catch(() => null);
if (!sodium) {
  results.push({
    name,
    status: "skipped — tweetnacl not available. Install it: npm i tweetnacl",
  });
  continue;
}
```

The `set_repo_secrets` tool appears to work but silently returns "skipped" for every secret if the dependency isn't installed. `tweetnacl` is not listed in `package.json`, so it will never be available unless manually installed. This means the tool always fails — and reports the failure as a soft status message rather than an error.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 3 | 4 | 1 | **35** |

**Fix:** Either add `tweetnacl` to `package.json` dependencies and `npm install`, or remove the `set_repo_secrets` tool entirely (since the Apps Script layer handles FTP variable setting). A tool that always silently fails is worse than no tool.

---

#### TD-05: No `package-lock.json` in MCP server

**Category:** Infrastructure
**Location:** `tkb-pipeline/servers/`

The MCP server has no lock file. All three dependencies use caret ranges (`^1.0.0`, `^7.1.0`, `^21.0.0`). Each `npm install` can pull different minor/patch versions. This is fine on a single developer's machine but becomes a source of invisible breakage if the plugin is ever installed in a different environment or included in a CI step.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 2 | 3 | 1 | **25** |

**Fix:** Run `npm install` in the `servers/` directory and commit the resulting `package-lock.json`.

---

#### TD-06: `clasp` project not linked to live Apps Script

**Category:** Infrastructure
**Location:** `tkb-apps-script/.clasp.json`

The `.clasp.json` contains `"scriptId": "PASTE_YOUR_SCRIPT_ID_HERE"`. This means the local GAS files and the live Apps Script project are not connected through `clasp`. There's no way to verify whether the code in the repo matches what's actually running in Google's infrastructure. Code drift between the repo and the live project is invisible.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 4 | 4 | 2 | **32** |

**Fix:** Get the script ID from the live Apps Script project (File → Project settings → Script ID), update `.clasp.json`, and run `clasp pull` to verify the live code matches the repo. Then establish a habit: edit locally, `clasp push` to deploy. This makes the repo the source of truth rather than a backup.

---

### Tier 2 — Fix During or After First Engagement

These items matter but won't block validation.

---

#### TD-07: Two parallel pipeline implementations with different auth

**Category:** Architecture debt
**Location:** `tkb-apps-script/` (classic PAT) vs. `tkb-pipeline/` (GitHub App)

The Apps Script pipeline and the MCP server both implement provisioning, but they use different GitHub authentication mechanisms (classic PAT vs. GitHub App), different runtimes, and slightly different step sequences. The Apps Script version has 9 steps; the MCP server has 3. The MCP server doesn't create Drive folders, roster sheets, or registry rows. Neither calls the other.

This isn't urgent — you're only going to use one path for the validation. But every feature added to one must eventually be ported to the other, or one needs to be deprecated.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 3 | 3 | 4 | **12** |

**Fix:** Decide which runtime is canonical for provisioning. The Apps Script version is more complete (9 steps vs. 3) and runs without infrastructure (no server process). The MCP server's value is in Claude Code integration. One path: keep Apps Script as the production provisioner; reduce the MCP server to a read-only query tool that lets Claude inspect engagement state without duplicating write operations.

---

#### TD-08: Hardcoded column indices in registry/people sheet access

**Category:** Code quality
**Location:** `tkb-apps-script/ContentSync.gs`, lines 160–161; `Decommission.gs`, line 219

```javascript
const statusCol = headers.indexOf('Status') !== -1 ? headers.indexOf('Status') : 14;
const slugCol = headers.indexOf('Slug') !== -1 ? headers.indexOf('Slug') : 1;
```

The code first tries to find columns by header name, then falls back to hardcoded indices (14, 1, 2). If someone reorders columns in the Sheet, the header lookup fails silently to a wrong column. The Decommission code is worse — it directly accesses `data[i][3]` for engagements and uses `sheet.getRange(i + 1, 8)` with no header lookup at all.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 3 | 3 | 2 | **24** |

**Fix:** Create a shared `getColumnMap(sheet)` helper that builds a header→index map once and throws if required columns are missing. Use the map everywhere instead of magic numbers.

---

#### TD-09: No retry logic on GitHub or cPanel API calls

**Category:** Missing validation
**Location:** `tkb-apps-script/GitHubApi.gs` (all calls); `tkb-pipeline/servers/index.js` (all calls)

Every external API call in both implementations is fire-once. A transient 502 from GitHub or a timeout from cPanel during provisioning fails the entire step. The content sync is slightly more resilient (it catches per-file errors and continues), but the underlying API calls still have no retry.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 3 | 3 | 3 | **18** |

**Fix:** Wrap `githubFetch()` and `cpanelRequest()` in a retry wrapper with exponential backoff (2–3 attempts, doubling delay). Apps Script has a 6-minute execution limit, so keep total retry time under 30 seconds per call.

---

#### TD-10: Build artifacts committed to git in tkb-strategies

**Category:** Infrastructure
**Location:** `tkb-strategies/apps/client-portal/build/` and `tkb-strategies/apps/healing-plan/dist/`

Generated build output is tracked in the monorepo. These directories contain hashed JS/CSS bundles, HTML files, and other artifacts that should be produced by CI, not checked in. They bloat the repo, create merge noise, and make it unclear whether the source or the build is authoritative.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 2 | 2 | 2 | **16** |

**Fix:** Add `apps/client-portal/build/` and `apps/healing-plan/dist/` to `.gitignore`. Remove them from tracking with `git rm -r --cached`. Ensure CI/CD builds from source.

---

#### TD-11: Docusaurus tutorial scaffolding still in client-portal

**Category:** Code quality
**Location:** `tkb-strategies/apps/client-portal/docs/tutorial-basics/`, `tutorial-extras/`

Default Docusaurus tutorial content remains in the client-portal app. This shows up in the sidebar navigation and could confuse anyone viewing the site. It signals "this was scaffolded but not cleaned up."

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 1 | 1 | 1 | **10** |

**Fix:** Delete the tutorial directories. If sidebar config references them, remove those entries too.

---

#### TD-12: Monorepo has no workspace linkage

**Category:** Architecture debt
**Location:** `tkb-strategies/` root — no root `package.json` with `workspaces`

The monorepo has `apps/` and `packages/` directories, but there's no workspace configuration connecting them. The packages under `packages/` aren't consumed by any app. `tenant-config` defines the `TenantConfig` TypeScript type, but `apps/client-portal` doesn't import it — it has its own `client.json` with the same shape. The packages are organizational, not functional.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 2 | 2 | 4 | **8** |

**Fix (deferred):** This is the right structure for the future but premature to wire up now. The packages need consuming apps that actually build and test against them. Defer until the pipeline is validated and you're ready to make `tenant-config` the single source of truth for the `client.json` schema.

---

#### TD-13: FTP as primary deploy mechanism

**Category:** Infrastructure
**Location:** `client-template/.github/workflows/deploy.yml`; `tkb-apps-script/GitHubApi.gs` → `setFtpVariables()`

FTP is unencrypted, doesn't support atomic deploys, and has caused issues before (the CI/CD lessons memory notes "FTP deploys are unreliable — path jailing caused silent misredirection"). The healing-plan app already uses SSH/rsync, which is proven. But the client-template pipeline still uses FTP for all client sites.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 3 | 3 | 3 | **18** |

**Fix:** Migrate the client-template deploy workflow from FTP to SSH/rsync, matching the healing-plan pattern. This requires: (1) setting up an SSH deploy key per client repo or a shared deploy key, (2) updating the provisioning step to set SSH secrets instead of FTP variables, (3) updating `deploy.yml` to use `webfactory/ssh-agent` + `rsync`. Do this after the first engagement validates — don't change the deploy mechanism mid-validation.

---

#### TD-14: `getDefaultPhases()` duplicated across three codebases

**Category:** Code quality
**Location:** `tkb-apps-script/Config.gs`, `tkb-pipeline/servers/index.js`, `client-template/docusaurus.config.ts` (via `client.json` defaults)

The phase definitions for each engagement type are copy-pasted across the Apps Script config, the MCP server, and implicitly in the client template. If a phase label changes (e.g., "Co-design" → "Co-Design"), all three need manual updates.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 2 | 2 | 2 | **16** |

**Fix (near-term):** Treat `tkb-apps-script/Config.gs` as the source of truth for phases since it's the active provisioning layer. Document this in a comment in the MCP server's copy. **Fix (longer-term):** Extract phase definitions into `packages/tenant-config` and consume them in both runtimes — this is exactly the kind of shared logic the monorepo packages are meant for, but only after the packages are actually wired up.

---

#### TD-15: Documentation describes a system state that doesn't exist yet

**Category:** Documentation drift
**Location:** `TKB-Full-Stack-Architecture.md`, Day 2 journal, ADR-0001

The architecture docs describe "working end-to-end" content sync, "tested" provisioning with dashboard, and a monorepo where "all three active app lanes are verified." The engineering current state shows that content sync has never run with real data, the dashboard hasn't been deployed, and the monorepo packages aren't wired. The docs are aspirational, not descriptive.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 2 | 3 | 3 | **15** |

**Fix:** Add a status disclaimer to the top of architecture docs distinguishing "designed" from "validated." After the pipeline validation, update the docs to reflect what actually works. Don't rewrite them now — they'll change during validation anyway.

---

#### TD-16: `tkb-pipeline-dev/` embedded in client-template

**Category:** Architecture debt
**Location:** `client-template/tkb-pipeline-dev/`

A full copy of the MCP server, skills, and agent lives inside the client-template repo. This is a dev convenience that becomes a maintenance trap: changes to the canonical `tkb-pipeline` must be manually copied into the embedded version. The two copies will inevitably drift.

| Impact | Risk | Effort | Priority |
|:------:|:----:|:------:|:--------:|
| 2 | 2 | 2 | **16** |

**Fix:** Remove `tkb-pipeline-dev/` from the template repo and point development MCP config to the canonical `tkb-pipeline/` directory. If the template needs pipeline tools during testing, symlink or use a path reference in `.mcp.json`.

---

### Tier 3 — Track for Later

These are genuine debt but low priority given the current project stage.

---

#### TD-17: No test coverage in any repo

**Category:** Test debt
**Location:** All repos

No repository has a test runner, test files, or test scripts configured. The only verification mechanism is `testProvision()` in Apps Script and manual build verification.

| Impact: 2 | Risk: 2 | Effort: 4 | Priority: **8** |

**Note:** At this scale (solo developer, pre-validation), manual testing is pragmatic. Automated tests become valuable when: (a) someone else is contributing, (b) you're making changes that could break existing engagements, or (c) you're refactoring shared code. Add tests for the content sync and provisioning paths first when the time comes.

---

#### TD-18: Apps Script `var` / `const` inconsistency

**Category:** Code quality
**Location:** All `.gs` files, especially `DriveHelpers.gs`, `BuildForms.gs`, `BuildSheets.gs`

The codebase mixes `var` and `const` across files. `DriveHelpers.gs` uses `var results = []` specifically because `const` doesn't allow reassignment, but `let` would be the correct modern choice. `BuildForms.gs` uses `var` 14 times alongside `const`. This is cosmetic in Apps Script (no block-scoping bugs observed), but signals incomplete modernization.

| Impact: 1 | Risk: 1 | Effort: 1 | Priority: **10** |

---

#### TD-19: People directory column access uses magic number for status

**Category:** Code quality
**Location:** `tkb-apps-script/Decommission.gs`, line 227

`sheet.getRange(i + 1, 8).setValue('Completed')` — column 8 is hardcoded. If the People sheet structure changes, this silently writes "Completed" to the wrong column.

| Impact: 2 | Risk: 2 | Effort: 1 | Priority: **20** |

---

## Phased Remediation Plan

### Before First Engagement Validation (This Week)

| ID | Item | Est. Time |
|----|------|-----------|
| TD-01 | Move FTP creds from variables to secrets | 1 hour |
| TD-02 | Fix sync timestamp to write after completion | 30 min |
| TD-04 | Fix or remove `set_repo_secrets` in MCP server | 30 min |
| TD-05 | Commit `package-lock.json` for MCP server | 5 min |
| TD-06 | Link `clasp` to live Apps Script project | 15 min |

### During First Engagement (When Issues Surface)

| ID | Item | Est. Time |
|----|------|-----------|
| TD-03 | Add provisioning rollback/cleanup on failure | 2 hours |
| TD-08 | Create shared column-map helper for Sheets access | 1 hour |
| TD-19 | Replace magic column numbers in Decommission.gs | 30 min |

### After First Engagement Stabilizes

| ID | Item | Est. Time |
|----|------|-----------|
| TD-13 | Migrate client-template deploy from FTP to SSH/rsync | 2 hours |
| TD-09 | Add retry logic to API calls | 1 hour |
| TD-10 | Remove build artifacts from git | 30 min |
| TD-11 | Remove Docusaurus tutorial scaffolding | 15 min |
| TD-14 | Consolidate `getDefaultPhases()` to single source | 1 hour |
| TD-16 | Remove embedded `tkb-pipeline-dev/` from template | 30 min |
| TD-15 | Update architecture docs to reflect validated state | 1 hour |

### Deferred (When Scale Demands It)

| ID | Item | Trigger |
|----|------|---------|
| TD-07 | Decide canonical pipeline runtime | Second engagement or first external contributor |
| TD-12 | Wire monorepo workspaces | When packages are consumed by apps |
| TD-17 | Add automated tests | When someone else contributes, or before refactoring shared code |
| TD-18 | Modernize `var` to `let`/`const` | During any file-by-file edit pass |

---

## How This Connects to the System Design Review

The System Design Review concluded that the next work should be validation — running the pipeline with real data and watching what breaks. This debt assessment identifies what to fix *before* that validation (Tier 1) versus what to fix *during or after* (Tiers 2–3).

The most important finding: **TD-01 (FTP credentials in plaintext variables) and TD-02 (sync timestamp written before sync completes) should be fixed before any real client data flows through the pipeline.** TD-01 is a security concern; TD-02 is a data loss risk. Both are small fixes — under an hour combined.

Everything else can be addressed as it surfaces during validation, which is exactly how debt should be managed at this stage: fix what the work reveals, not what a checklist predicts.

---

## Addendum B — Specification Drift

*Added after cross-referencing the Capabilities Statement (from the design conversation) against the Engineering Current State (from the implementation conversation).*

The Capabilities Statement was written before the GAS code existed. It describes what was designed. The Engineering Current State describes what was built. Comparing them reveals a category of debt the code-level audit couldn't see: places where the implementation diverged from the spec, where decisions were reversed without updating the source documents, and where the same concept now has two different descriptions depending on which document you read.

This matters because anyone (including a future-you or a collaborator) reading the pipeline spec will form expectations that the actual code contradicts. The debt here isn't in the code — it's in the gap between the map and the territory.

### SD-01: Auth Strategy Contradiction — "GitHub App, not PAT" vs. Actual PAT Usage

**Category:** Documentation drift / Architecture debt
**Priority Score: 36** (Impact 4 × Risk 4 × (6 − Effort 2) = 32; elevated to 36 for safety implication)

The Capabilities Statement locks in a technical decision: "GitHub App authentication, not PAT — Scoped permissions, auto-rotating tokens, no expiration." This is listed under Section 5.3 as a permanent, locked decision with a clear rationale.

The actual GAS implementation uses a **classic PAT** stored in Script Properties (`GITHUB_PAT`). The MCP server (`tkb-pipeline`) uses the GitHub App. So the "locked decision" was reversed for the primary production implementation, and the document that calls it locked was never updated.

**Why this is more than a typo:** The rationale for the GitHub App decision was security — scoped permissions and auto-rotating tokens. The classic PAT has `repo` scope (full access to all repos in both orgs), doesn't expire automatically, and is stored as a plaintext Script Property. If someone reads the Capabilities Statement and assumes the system uses scoped GitHub App auth, they'll have an incorrect security model in their head.

**Specifically what diverged:**

| What the spec says | What was built |
|---|---|
| GitHub App auth (locked decision) | Apps Script: classic PAT; MCP server: GitHub App |
| Scoped permissions, auto-rotating | PAT: full repo scope, manual rotation |
| One auth mechanism | Two parallel auth mechanisms against the same org |

**Fix:** Either migrate the GAS pipeline to use the GitHub App (which requires JWT signing — more complex in Apps Script but achievable via `Utilities.computeHmacSha256Signature`) or explicitly document in the Capabilities Statement that the PAT is an intentional deviation with known security trade-offs. Don't leave a "locked decision" that contradicts production.

---

### SD-02: Function Names Diverged From Spec

**Category:** Documentation drift
**Priority Score: 10** (Impact 2 × Risk 1 × (6 − Effort 1) = 15; lowered for low actual risk)

The Capabilities Statement Section 9 lists functions that "have not been written": `provisionNewEngagement()`, `processAssessmentResponse()`, `processRosterChange()`, `syncClientContent()`. These were the specified function names.

The actual implementation uses different names: `provisionEngagement()`, `onAssessmentResponse()` → `processAssessment()`, `onRosterEdit()` → `updateCoacheeSpine()`, `syncDriveContent()`.

This is cosmetic — the behavior matches even if the names don't. But anyone reading the spec and then searching the codebase for the function names will find nothing, which creates confusion about whether the features were actually built.

**Fix:** Update the Capabilities Statement's function name references to match what was implemented. This is a 10-minute find-and-replace.

---

### SD-03: Roster Sheet Schema Mismatch

**Category:** Data integrity / Specification drift
**Priority Score: 24** (Impact 3 × Risk 3 × (6 − Effort 3) = 18; elevated for data pipeline risk)

The Capabilities Statement Section 4.5 specifies five new roster columns: energy baseline (dropdown 1–5), burnout risk (dropdown L/E/H), sessions completed (auto-incremented), last session date (auto-populated), and profile doc link (auto-generated). These columns feed the Tier 1 metrics extraction pipeline.

The actual roster sheet implementation in `DriveHelpers.gs` creates 10 columns: Name, Role, Email, Cadence, Start Date, Spine Location, Status, Assessment Date, Assessment Summary, Notes. None of the five specified metrics columns were implemented.

This means the metrics extraction pipeline (v1.1 amendment) has no data source. The Tier 1 metrics — support level, burnout risk, session count — have nowhere to live in the actual roster schema. The `RosterHandler.gs` processes assessment data into the simpler schema (summary text in one column), not the structured metric fields the spec describes.

**What the spec expects to exist in the roster:**

| Column | Type | Feeds |
|---|---|---|
| Energy baseline | Dropdown 1–5 | Tier 1: direct capture |
| Burnout risk | Dropdown L/E/H | Tier 1: direct capture, Tier 3: cohort distribution |
| Sessions completed | Auto-increment | Tier 1: direct capture |
| Last session date | Auto-populate | Tier 2: derived per coachee |
| Profile doc link | Auto-generate | Profile navigation |

**What actually exists:**

| Column | Type | Feeds |
|---|---|---|
| Assessment Date | Date string | Nothing downstream |
| Assessment Summary | Free text | Profile page only |

**Fix:** This is a design decision, not just a code change. Either expand the roster schema to match the spec (which means updating `createRosterSheet()`, `updateRosterRow()`, and `onRosterEdit()`) or accept that the v1.1 metrics pipeline needs to be redesigned around the simpler schema. The former is the right path if you still want the metrics extraction — but it should happen after the basic roster flow is validated with real data. Don't add five columns to a sheet that hasn't been used yet.

---

### SD-04: Coaching Profile Generation Not Implemented

**Category:** Specification drift / Feature gap
**Priority Score: 12** (Impact 2 × Risk 2 × (6 − Effort 3) = 12)

The Capabilities Statement and v1.1 amendment describe a rich coaching profile auto-generation flow: a 9-section Google Doc created from a master template, with token replacement, session tabs, and metrics extraction. This is arguably the most valuable pipeline feature for the coaching practice.

What was actually built is a simpler version: `buildCoacheeProfile()` in `RosterHandler.gs` generates a basic Markdown page with name, role, spine badge, a table, and the assessment summary as free text. There is no Google Doc generation, no template copying, no token replacement, no session tabs, and no structured data extraction.

The Markdown profile is a useful starting point — it gives each coachee a presence on the site immediately after assessment. But the gap between "9-section coaching profile with structured session tabs" and "Markdown page with assessment summary" is substantial. Anyone who read the v1.1 amendment would expect the former.

**Fix:** This doesn't need to be fixed right now. The Markdown profile is the right v1 implementation — get it working with real data first. The 9-section Google Doc generation is Phase C work. But the Capabilities Statement should be updated to show the coaching profile as having two planned layers: the current Markdown site profile (built, untested) and the Google Doc working document (designed, not built).

---

### SD-05: Build Phase Status Conflicts Across Documents

**Category:** Documentation drift
**Priority Score: 15** (Impact 3 × Risk 2 × (6 − Effort 2) = 20; lowered for low operational risk)

The Capabilities Statement says Phase A is "~95% complete" with Phases B through G "Not started." The Day 2 journal says all pipeline build phases are complete with builds verified. The PIPELINE-STATUS.md says provisioning was "Tested, all 9 steps green" with most other behaviors "Built, untested." The Engineering Current State shows `buildRegistrySheet()` and `buildPeopleSheet()` have never been run.

These four documents describe four different states of the same system. Someone reading just one will have a different understanding than someone reading another.

| Document | Claims |
|---|---|
| Capabilities Statement | Phase A ~95%, B–G not started |
| Day 2 journal | All migration lanes verified, builds pass |
| PIPELINE-STATUS.md | Provisioning tested, most behaviors "built, untested" |
| Engineering Current State | Sheets not built, triggers not installed, dashboard not deployed |

**Fix:** The cleanest approach is to stop maintaining parallel status documents and consolidate into one. The PIPELINE-STATUS.md in the `apps-script/` directory is closest to the truth. Make it the single source for "what's built and what's tested," and add a clear disclaimer to the Capabilities Statement and Day 2 journal that their status sections are frozen snapshots from their respective conversation dates, not living references.

---

### SD-06: Deploy Mechanism — FTP (Spec) vs. SSH/rsync (Proven) vs. FTP (Template)

**Category:** Infrastructure / Specification drift
**Priority Score: 18** (duplicates TD-13 but adds spec context)

The Capabilities Statement specifies FTP deployment as a locked decision and references `SamKirkland/FTP-Deploy-Action` in the GitHub Actions workflow. The healing-plan app (the only app actually deploying to production) uses SSH/rsync via `webfactory/ssh-agent`. The client-template still uses FTP. The CI/CD lessons memory explicitly says "FTP deploys are unreliable — path jailing caused silent misredirection."

So the spec locks in a mechanism that has already been proven unreliable and replaced in the one working deploy. The template repo still uses the unreliable mechanism.

**Fix:** Same as TD-13 in the original assessment — migrate client-template deploy to SSH/rsync. Additionally, update the Capabilities Statement to reflect that the deploy decision has evolved from FTP to SSH/rsync based on operational experience.

---

### SD-07: v1.1 Amendment Features Have No Implementation Path in Current Code

**Category:** Architecture debt / Specification drift
**Priority Score: 8** (Impact 2 × Risk 1 × (6 − Effort 4) = 6; tracked for awareness)

The v1.1 amendment describes four significant features: coaching profile auto-generation with Google Doc template copying, metrics extraction pipeline with 3 tiers, document-to-Markdown transformation with 3 patterns, and 8+ visualization components. None of these have implementation scaffolding in the current codebase. The GAS code that was built implements the v1.0 spec (provisioning, basic sync, basic roster handling, decommission), not v1.1.

This isn't debt in the traditional sense — the v1.1 features are future work, not broken work. But the Capabilities Statement describes them alongside v1.0 features without clearly separating "built" from "designed for a future phase." Someone scanning the document might assume these features are partially implemented rather than entirely unstarted.

**Fix:** Add a section to the Capabilities Statement (or a separate document) that clearly maps which spec version each GAS file implements. Something like: "The current codebase implements Pipeline Spec v1.0 Phases A–F. The v1.1 amendment (coaching profiles, metrics, transformations, visualizations) has no implementation yet."

---

## Revised Summary by Category (Including Addendum B)

| Category | Items | Highest Priority |
|----------|------:|:----------------:|
| Security & credentials | 4 | **45** (TD-01) |
| Data integrity | 4 | **40** (TD-02) |
| Specification drift | 7 | **36** (SD-01) |
| Missing validation | 4 | **36** (TD-04) |
| Infrastructure & CI/CD | 5 | **35** (TD-05) |
| Architecture debt | 5 | **24** (TD-03) |
| Code quality | 5 | **20** (TD-19) |
| Documentation drift | 4 | **15** (TD-15/SD-05) |

## Revised Remediation — What the Spec Drift Means for Next Steps

The specification drift items don't change the remediation order from the original assessment. TD-01 (FTP credentials) and TD-02 (sync timestamp) are still the most urgent fixes. But the drift findings add a requirement that wasn't visible before:

**Before the first real engagement, reconcile the auth strategy.** SD-01 (PAT vs. GitHub App contradiction) needs a deliberate decision, not a documentation update. Either the PAT is the right choice for Apps Script (simpler, functional, accepted trade-off) or the GitHub App migration is worth the complexity. Pick one and document it. The current state — where the spec says one thing and the code does another — is worse than either option on its own.

**After the first engagement validates, do a single documentation pass.** Don't update five documents individually. Write one status-of-the-world document that supersedes the Capabilities Statement's status sections, the Day 2 journal's claims, and PIPELINE-STATUS.md. That document is the System Design Review (already created in this session). Add the spec-to-code mapping table suggested in SD-07 and mark the others as historical snapshots.

The spec drift is a natural consequence of building in one conversation and designing in another. It's not a failure — it's what happens when implementation teaches you things the design phase couldn't predict. The debt is only real if the divergences stay invisible. Now they're not.
