# Services Architecture

This document defines the first service-layer boundaries for the TKB Strategies monorepo.

The intent is to create a safe bridge from static apps and legacy WordPress delivery toward a tenant-aware SaaS platform.

## Why Services Now

The repository already has:

- app lanes under `apps/`
- reusable logic under `packages/`
- legacy bridges under `legacy/`

The next architectural need is a documented service layer so future backend work does not grow ad hoc inside frontend apps or legacy WordPress code.

## Current Position

The service layer is still contract-first. There is no committed implementation code yet. This is intentional.

The right sequence is:

1. define domain boundaries
2. define request and authorization assumptions
3. reuse logic from `packages/`
4. implement only after the contracts are clear

## Service Lanes

### `services/api/`

Primary application-facing API layer.

Owns:

- tenant-scoped HTTP interfaces
- workflow and assessment operations
- export request orchestration
- integration with auth context

### `services/auth/`

Identity and tenancy boundary layer.

Owns:

- actor identity
- tenant membership
- role enforcement vocabulary
- downstream request auth context

### `services/jobs/`

Reserved for asynchronous work.

Expected future uses:

- export generation
- notifications
- scheduled reminders
- reconciliation tasks

### `services/webhooks/`

Reserved for inbound and outbound event surfaces.

Expected future uses:

- external platform notifications
- intake/event ingestion
- publishing triggers

## Design Rules

- service code should consume business rules from `packages/`, not redefine them
- tenant boundaries must be explicit in request context
- WordPress is not the persistence or identity model for the future platform
- apps should degrade gracefully while backend services are still emerging

## Near-Term Next Step

The next safe backend move after these service docs is to define a minimal request/response contract for:

- tenant config retrieval
- assessment definition retrieval
- export request submission

Those should be added only after the service boundaries here are accepted.

Initial contract documents now exist at:

- [services/api/tenants.md](../services/api/tenants.md)
- [services/api/assessments.md](../services/api/assessments.md)
- [services/api/exports.md](../services/api/exports.md)
