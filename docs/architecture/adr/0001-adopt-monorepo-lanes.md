# ADR 0001 — Adopt Monorepo App, Package, Service, and Legacy Lanes

- Status: Accepted
- Date: 2026-03-29

## Context

`OpenStrategies` started as a public documentation-first repository with a working Docusaurus site and several top-level business-category folders such as `frameworks/`, `plugins/`, `themes/`, `products/`, and `workshops/`.

That structure was no longer sufficient once the repository began absorbing:

- the public docs application
- a private client-facing application (`client-template`)
- a standalone product application (`healing-plan`)
- shared logic that should outlive any single app
- WordPress surfaces that are still operationally relevant but not part of the target SaaS center
- the first tenant-aware service boundaries for a future multi-tenant platform

The old layout mixed:

- business categories with technical boundaries
- source-of-truth content with published app content
- future platform logic with transitional WordPress concerns
- per-app deployment ownership with repo-level architecture

Without a clearer structure, the repository risked drift, duplicated logic, and a future backend growing ad hoc inside frontend apps or legacy WordPress code.

## Decision

The repository will use a monorepo structure organized around technical ownership lanes:

- `apps/` for deployable application surfaces
- `packages/` for reusable business logic, configuration, and shared modules
- `services/` for backend contracts and future service implementations
- `legacy/` for WordPress, cPanel, Google Apps Script, and other migration bridges
- `tooling/` for shared repository scripts
- `examples/` for reference integrations and sample tenants

Additional rules adopted with this decision:

1. The monorepo is the source of truth for shared packages.
2. Apps consume packages; packages do not depend on app-local code.
3. WordPress and similar transitional systems must not define the permanent platform center.
4. Deployment ownership lives at the repository root through root-level workflows.
5. Service boundaries should be documented before service implementations are introduced.
6. A migration is not considered complete until moved apps build successfully from their monorepo locations.

## Consequences

### Positive

- The repository now reflects deploy surfaces, reusable logic, service boundaries, and legacy bridges explicitly.
- `apps/docs-site`, `apps/client-portal`, and `apps/healing-plan` can evolve independently while sharing extracted packages.
- Shared logic such as tenant config, workflow generation, assessment structures, and exports has a durable home under `packages/`.
- Root-level workflows align CI/CD ownership with the actual repository layout.
- Future service implementation can start from documented boundaries instead of implicit coupling inside apps.

### Negative

- The repository now has more structural layers, which increases navigation overhead for small changes.
- Some older planning documents still reflect the pre-migration layout and must be refreshed over time.
- Content roots such as `frameworks/`, `workshops/`, `presentations/`, and `products/` still need a follow-up packaging pass to fully match the new structure.

### Neutral / Follow-on

- Legacy WordPress directories remain important for transition work, but new platform logic should not be added there without a clear migration reason.
- Standalone downstream repos, if needed later, should be published from monorepo subpaths rather than co-developed manually in parallel.
- Future ADRs should capture the next durable decisions, such as service runtime choice, schema format, or shared UI/design-token strategy.
