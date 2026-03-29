# API Service

This service will become the primary application API layer for tenant-aware TKB Strategies products.

## Responsibilities

- expose tenant-scoped APIs to apps such as `client-portal` and `healing-plan`
- provide a stable surface for assessments, exports, workflow state, and content retrieval
- enforce server-side authorization rules in coordination with the auth service
- replace frontend-only or WordPress-bound logic when those capabilities move into the SaaS platform

## Initial Domain Areas

- `tenants`
  - tenant lookup
  - tenant configuration retrieval
  - tenant feature flags
- `workflows`
  - engagement phases
  - progress state
  - content gating and sequencing
- `assessments`
  - assessment definitions
  - scoring and result persistence
  - export requests
- `content`
  - framework package metadata
  - workshop and presentation package metadata

## Non-Goals For The First Implementation

- no direct migration of WordPress runtime behavior into the API
- no premature persistence model lock-in
- no auth implementation inside this service

## Contract Direction

The first implementation should start with:

1. health/readiness endpoints
2. tenant config read endpoints
3. assessment definition read endpoints
4. export request interfaces that can initially be no-op or local-only

The service should consume shared package logic wherever possible rather than duplicating business rules from `packages/`.
