# Auth Service

This service will own identity and tenancy boundaries for the future TKB Strategies SaaS platform.

## Responsibilities

- authenticate users and service actors
- assign tenant membership and roles
- authorize access to tenant-scoped resources
- provide session and token rules for apps and APIs

## Initial Access Model

The first contract should assume these actor classes:

- `platform-admin`
  - full cross-tenant administrative visibility
- `tenant-admin`
  - administrative access within one tenant
- `tenant-member`
  - standard authenticated user within one tenant
- `participant`
  - limited or workflow-specific user, potentially without a full admin surface

## Initial Security Boundaries

- every request must resolve to a tenant context unless explicitly marked as platform-level
- no tenant should be able to read or mutate another tenant's data
- public framework content remains outside tenant auth requirements
- exported files and assessment results must be treated as tenant-scoped artifacts unless explicitly anonymous

## Non-Goals For The First Implementation

- no production IdP decision yet
- no full user-management UI yet
- no coupling to WordPress user tables

## Contract Direction

The first implementation should define:

1. tenant membership model
2. role vocabulary
3. request context shape for downstream services
4. session/token verification contract for the API layer
