# Tenant Membership Contract

This document defines the first contract for tenant membership in the future TKB Strategies platform.

## Purpose

Provide a stable model for answering:

- who belongs to a tenant
- in what capacity they belong
- what roles they hold within that tenant

This contract is the foundation for API authorization and app-level access control.

## Core Shape

```json
{
  "membership": {
    "userId": "usr_123",
    "tenantSlug": "example-org",
    "roles": ["tenant-admin"],
    "status": "active"
  }
}
```

## Required Fields

- `userId`
  - stable internal user identifier
- `tenantSlug`
  - canonical tenant lookup key
- `roles`
  - one or more tenant-scoped roles
- `status`
  - `active`, `invited`, `suspended`, or `revoked`

## Initial Rules

- membership is tenant-scoped, not global by default
- one user may hold membership in multiple tenants
- membership status must be checked before role evaluation
- a platform admin may operate without standard tenant membership, but must still resolve an explicit acting context when operating against tenant data

## First Consumers

- `services/auth`
- `services/api`
- future `apps/admin-studio`

## Deferred Decisions

- invitation and provisioning flow
- external identity-provider mapping
- membership audit history
