# Monorepo Migration Plan

This document is the working plan for restructuring `tkb-strategies` from a content-first umbrella repository into a polyglot monorepo that can support:

- public open-source methodology
- private client delivery surfaces
- standalone product apps
- transitional WordPress and cPanel deployment paths
- the long-term migration toward a multi-tenant SaaS platform

The intent is to redesign around the future system, not just the current folders.

## Goals

- Separate reusable platform logic from delivery channels.
- Preserve current public and private deploy paths while the SaaS is still emerging.
- Make room for multiple application types without forcing everything into Docusaurus or WordPress.
- Isolate legacy WordPress and Google Apps Script work so it does not define the permanent architecture.
- Support packages that can live both inside the monorepo and as their own downstream repositories.

## Current Confirmed Repo Status

As of 2026-03-29, the following states are confirmed from local remotes and GitHub checks:

| Project | Current state | Visibility | Notes |
|---|---|---|---|
| `OpenStrategies` | Active GitHub org repo | Public | Current repo at `TKB-Strategies/OpenStrategies`; GitHub Pages workflow confirmed |
| `healing-plan` | Reachable GitHub remote | Private or non-public | Local remote points to `TKB-Strategies/healing-plan`; unauthenticated GitHub API returns `404` |
| `client-template` | Local working project | Local-only | Not currently a Git repo on disk |

## Current Deployment Patterns

| Surface | Current deploy mode | Notes |
|---|---|---|
| `OpenStrategies` docs site | GitHub Actions -> GitHub Pages | Docusaurus build from `site/` |
| `client-template` | GitHub Actions -> FTP -> Namecheap | Static Docusaurus client site |
| `healing-plan` | GitHub Actions -> SSH/rsync -> Namecheap | Static Vite app with smoke test |
| WordPress plugin/theme work | Manual or hosting-managed WordPress deploy | Transitional path only |

These patterns should remain supported during migration. The redesign should not require a flag day.

## Target Structure

The target structure should distinguish deployable apps, reusable packages, future services, and legacy bridges:

```text
tkb-strategies/
├── apps/
│   ├── docs-site/
│   ├── client-portal/
│   ├── healing-plan/
│   ├── admin-studio/
│   └── marketing-site/
├── packages/
│   ├── tenant-config/
│   ├── workflow-engine/
│   ├── assessment-core/
│   ├── exports/
│   ├── ui/
│   ├── design-tokens/
│   ├── framework-compassionate-agility/
│   ├── framework-liberation-mapping/
│   ├── framework-stewards-manual/
│   ├── workshop-templates/
│   ├── presentation-templates/
│   ├── delivery-templates/
│   ├── product-course-kit/
│   └── product-gumroad-kit/
├── services/
│   ├── api/
│   ├── auth/
│   ├── jobs/
│   └── webhooks/
├── legacy/
│   ├── wordpress-plugin-quiz-tracker/
│   ├── wordpress-theme-tkb-child/
│   ├── gas-automations/
│   └── cpanel-hooks/
├── examples/
│   ├── demo-tenant/
│   └── reference-engagement/
├── tooling/
│   └── scripts/
└── docs/
    ├── architecture/
    ├── migration/
    └── operations/
```

## Classification Rules

Each asset should be mapped using these categories:

- `Core`: reusable capability that should survive into the SaaS
- `App`: deployable surface or product experience
- `Adapter`: bridge to WordPress, cPanel, Google Apps Script, or another transitional layer
- `Retire`: temporary structure or code that should be removed after migration

Each migration decision should also track:

- current repo visibility
- current deployment pattern
- whether the asset is tenant-aware
- whether the asset is tightly coupled to WordPress or another legacy system

## Migration Map

### Existing `OpenStrategies` repo

| Current asset | Current role | Future role | Classification | Visibility | Deploy mode | Action | Target |
|---|---|---|---|---|---|---|---|
| `site/` | Public Docusaurus docs site | Public docs app | `App` | Public | GitHub Pages | Keep and rename | `apps/docs-site` |
| `site/docs/frameworks/*` | Framework docs inside app | Canonical framework content packages | `Core` | Public | Consumed by app | Extract from app | `packages/framework-* /content` |
| `frameworks/*` | Placeholder directories | Real framework packages | `Core` | Public | N/A | Replace stubs | `packages/framework-*` |
| `plugins/tkb-quiz-tracker-v2/` | WordPress plugin placeholder | Transitional plugin bridge | `Adapter` | Public | Legacy WordPress | Isolate from core platform | `legacy/wordpress-plugin-quiz-tracker` |
| `themes/tkb-child/` | WordPress child theme placeholder | Transitional theme bridge | `Adapter` | Public | Legacy WordPress | Isolate from core platform | `legacy/wordpress-theme-tkb-child` |
| `workshops/templates/` | Workshop template placeholder | Reusable workshop content package | `Core` | Public | Consumed by apps | Convert to package | `packages/workshop-templates` |
| `presentations/templates/` | Presentation template placeholder | Reusable delivery asset package | `Core` | Public | Consumed by apps | Convert to package | `packages/presentation-templates` |
| `products/courses/` | Product source placeholder | Course content/export package | `Core` | Public | Export pipeline | Convert to package | `packages/product-course-kit` |
| `products/gumroad/` | Product source placeholder | Digital product/export package | `Core` | Public | Export pipeline | Convert to package | `packages/product-gumroad-kit` |
| `scripts/` | Local repo scripts | Shared tooling | `Core` | Public | N/A | Centralize | `tooling/scripts` |

### External `client-template` project

| Current asset | Current role | Future role | Classification | Visibility | Deploy mode | Action | Target |
|---|---|---|---|---|---|---|---|
| `client-template/` | Private engagement KB template | Tenant portal app or tenant KB app | `App` | Local-only | FTP static | Promote into monorepo | `apps/client-portal` |
| `client.json` | Engagement metadata | Tenant config contract | `Core` | Local-only | Consumed by app | Extract schema and validation | `packages/tenant-config` |
| `sidebars.ts` | Generated phase navigation | Reusable engagement navigation logic | `Core` | Local-only | Consumed by app | Extract if reused | `packages/workflow-engine` |
| `templates/` | Delivery templates | Shared delivery assets | `Core` | Local-only | Consumed by apps/services | Convert to package | `packages/delivery-templates` |
| `docs/` | Client-facing content | Tenant-scoped content area | `App` | Local-only | FTP static | Keep app-local | `apps/client-portal/content` |

### External `healing-plan` repo

| Current asset | Current role | Future role | Classification | Visibility | Deploy mode | Action | Target |
|---|---|---|---|---|---|---|---|
| `healing-plan/` | Standalone facilitation app | Tenant-scoped product module | `App` | Private/non-public | SSH/rsync static | Promote into monorepo | `apps/healing-plan` |
| `src/App.jsx` | App shell plus domain logic | UI shell consuming shared assessment packages | `App` + `Core` | Private/non-public | SSH/rsync static | Split UI from logic | `apps/healing-plan` + `packages/assessment-core` + `packages/exports` |
| `src/index.css` | Product-local design layer | Shared tokens plus app skin | `App` + `Core` | Private/non-public | App build asset | Extract stable pieces | `packages/design-tokens` / `packages/ui` |
| `.github/workflows/deploy.yml` | Product deploy workflow | Transitional app deploy workflow | `App` | Private/non-public | SSH/rsync static | Preserve during migration | App workflow |
| `.cpanel.yml` | cPanel fallback hook | Historical deploy bridge | `Adapter` | Private/non-public | cPanel fallback | Retain only if still needed | `legacy/cpanel-hooks/` |

## Design Principles

### 1. Separate domain logic from delivery channel

Examples:

- framework content should not live only in the docs app
- assessment logic should not live only in a WordPress plugin or a single React component
- tenant metadata should not live only in a Docusaurus config file
- exports should not be coupled to one frontend app

### 2. Support multiple deploy surfaces at once

The monorepo must support:

- GitHub Pages for public docs
- static artifact deploys for private client apps
- static artifact deploys for standalone product apps
- legacy WordPress delivery while the SaaS is under construction

### 3. Treat WordPress and cPanel as migration layers

WordPress plugins, themes, and cPanel hooks can remain in active use, but they should live under `legacy/` once the migration starts. They are important bridges, not the permanent platform center.

### 4. Keep packages independently releasable

Packages that should eventually exist as standalone repos must:

- have clear boundaries
- be buildable or publishable on their own
- have their own README and changelog conventions
- avoid hidden coupling to one app

The monorepo should be the source of truth. Standalone repos should be published outward from monorepo subpaths rather than co-developed manually in parallel.

## Execution Plan

### Phase A — Document and Stabilize

Goal: create architecture clarity before moving files.

- Add this migration plan to the repository.
- Update root docs references to include the monorepo migration plan.
- Treat the current repo as the public documentation and planning surface while migration design hardens.
- Do not move WordPress or content files yet.

### Phase B — Establish the New Skeleton

Goal: create the target lanes without breaking current behavior.

- Add `apps/`, `packages/`, `services/`, `legacy/`, `examples/`, and `tooling/`.
- Move `scripts/` into `tooling/scripts/`.
- Add root workspace conventions for polyglot development.
- Preserve existing deploy workflows during this step.

Status on 2026-03-29:

- `apps/`, `packages/`, `services/`, `legacy/`, `examples/`, and `tooling/` created
- `scripts/` moved to `tooling/scripts/`

### Phase C — Migrate Existing Public App

Goal: make the current docs app monorepo-native.

- Move `site/` to `apps/docs-site/`.
- Update GitHub Actions paths and cache locations.
- Keep GitHub Pages deployment intact.
- Do not extract content yet unless required to keep the build working.

Status on 2026-03-29:

- `site/` moved to `apps/docs-site/`
- GitHub Pages workflow paths updated to the new app location

### Phase D — Import Existing External Apps

Goal: bring private delivery apps into the monorepo while preserving current deploys.

- Import `client-template` as `apps/client-portal/`.
- Import `healing-plan` as `apps/healing-plan/`.
- Preserve app-local workflows initially:
  - client portal remains FTP deployed
  - healing plan remains SSH/rsync deployed

Status on 2026-03-29:

- external `client-template` imported to `apps/client-portal/` without `node_modules/`
- external `healing-plan` imported to `apps/healing-plan/` without `.git/` or `node_modules/`
- app-local workflow files preserved in each imported app as migration references

### Phase E — Extract Reusable Packages

Goal: separate product logic from app shells.

- Create `packages/tenant-config/` from `client.json` patterns and validation rules.
- Create `packages/workflow-engine/` from reusable engagement navigation and phase logic.
- Create `packages/assessment-core/` from healing-plan assessment structure and scoring or state models.
- Create `packages/exports/` from plan export behavior.
- Create `packages/design-tokens/` and `packages/ui/` from shared visual primitives.
- Convert frameworks, workshops, presentations, and product sources into content packages.

Status on 2026-03-29:

- `packages/tenant-config/` created as the first shared package
- `apps/client-portal/` now consumes shared tenant validation, accent CSS generation, and sidebar-building helpers from `packages/tenant-config/`
- `packages/workflow-engine/` created for client portal navigation and engagement flow helpers
- `apps/client-portal/` now consumes shared workflow/sidebar logic from `packages/workflow-engine/`
- `packages/assessment-core/` created for healing-plan assessment structure
- `packages/exports/` created for healing-plan text export generation
- `apps/healing-plan/` now consumes shared assessment and export modules instead of keeping that logic entirely inside `src/App.jsx`

### Phase F — Isolate Legacy Surfaces

Goal: prevent WordPress and older operational tooling from shaping the future platform.

- Move plugin work into `legacy/wordpress-plugin-quiz-tracker/`.
- Move theme work into `legacy/wordpress-theme-tkb-child/`.
- Add `legacy/gas-automations/` when Google Apps Script assets are brought in.
- Move cPanel fallback hooks into `legacy/cpanel-hooks/` if they are still needed.

Status on 2026-03-29:

- WordPress plugin placeholder moved to `legacy/wordpress-plugin-quiz-tracker/`
- WordPress theme placeholder moved to `legacy/wordpress-theme-tkb-child/`
- Root repo docs updated to treat WordPress surfaces as legacy migration bridges

### Phase G — Introduce Platform Services

Goal: begin the real SaaS backend without destabilizing delivery.

- Add `services/api/` for tenant-aware APIs.
- Add `services/auth/` for identity and tenancy boundaries.
- Add `services/jobs/` for asynchronous exports, notifications, and workflow tasks.
- Keep existing static deploys until those services are ready to replace them.

Operational update on 2026-03-29:

- root-level monorepo workflows added for `apps/client-portal/` and `apps/healing-plan/`
- `apps/client-portal/` normalized to npm with a committed `package-lock.json` so the root workflow can run deterministically
- `services/api/` and `services/auth/` now have initial contract documentation
- `docs/SERVICES-ARCHITECTURE.md` defines the first service-layer boundaries for the SaaS transition
- `services/api/tenants.md`, `services/api/assessments.md`, and `services/api/exports.md` now define the first concrete API contract surfaces
- `services/auth/membership.md`, `services/auth/roles.md`, and `services/auth/request-context.md` now define the first concrete auth contract surfaces

Cleanup update on 2026-03-29:

- nested workflow files removed from `apps/client-portal/` and `apps/healing-plan/`
- root workflows under `.github/workflows/` are now the sole documented deploy paths

## First File-Move Pass

This is the recommended first pass before any deep refactor:

| Current path | Target path | Notes |
|---|---|---|
| `site/` | `apps/docs-site/` | Preserve build and deploy behavior |
| `scripts/` | `tooling/scripts/` | Update references after move |
| external `client-template/` | `apps/client-portal/` | Import as-is first |
| external `healing-plan/` | `apps/healing-plan/` | Import as-is first |
| `plugins/tkb-quiz-tracker-v2/` | `legacy/wordpress-plugin-quiz-tracker/` | Only after skeleton is in place |
| `themes/tkb-child/` | `legacy/wordpress-theme-tkb-child/` | Only after skeleton is in place |

This first pass is intentionally conservative. It changes container boundaries before internal logic.

## Risks and Controls

| Risk | Why it matters | Control |
|---|---|---|
| Breaking public docs deploy | `OpenStrategies` is the current public surface | Move `site/` first with minimal internal change and update workflow paths in the same change |
| Overfitting to WordPress | WordPress is transitional, not end-state | Move WordPress work under `legacy/` and keep core logic elsewhere |
| Mixing private and public material | The repo still has a strict confidentiality boundary | Preserve public/private review rules and keep client content out of public packages |
| Premature backend design | SaaS services are coming but not fully defined | Extract shared logic first; add services only after boundaries are clear |
| Duplicating source of truth | Current content already risks drift between root and app | Make packages canonical and apps consumers |

## Decisions Locked In

- The redesign must account for the future multi-tenant SaaS, not just current folders.
- Deployment patterns are part of the architecture and must be preserved during migration.
- Public docs, private client delivery, and product apps should be separate app lanes.
- WordPress and cPanel are active bridges, but they are not the future platform center.
- The monorepo should become the source of truth for packages that may also publish to standalone repos later.

## Next Actions

Recommended next implementation steps:

1. Create the top-level skeleton directories without moving existing code.
2. Move `site/` to `apps/docs-site/` and update the GitHub Pages workflow.
3. Import `healing-plan` and `client-template` into `apps/`.
4. Extract `tenant-config`, `assessment-core`, and `exports` as the first shared packages.
5. Move WordPress assets into `legacy/`.
