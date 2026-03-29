# Request Context Contract

This document defines the minimum auth context that downstream services should receive after authentication and tenant resolution.

## Purpose

Ensure every tenant-aware request reaches business logic with a consistent context shape.

## Initial Shape

```json
{
  "auth": {
    "actorId": "usr_123",
    "actorType": "user",
    "tenantSlug": "example-org",
    "roles": ["tenant-admin"],
    "membershipStatus": "active",
    "isPlatformAdmin": false
  }
}
```

## Required Fields

- `actorId`
  - stable actor identifier
- `actorType`
  - `user`, `service`, or other future actor class
- `tenantSlug`
  - resolved tenant context for the request
- `roles`
  - role list after membership lookup
- `membershipStatus`
  - current membership state used for authorization
- `isPlatformAdmin`
  - explicit platform-level override signal

## Initial Rules

- tenant-aware endpoints should reject requests that reach business logic without a resolved tenant context
- request context should be derived once and passed downstream, not recomputed in each handler
- platform-admin operations against tenant resources must still carry an explicit tenant context
- public endpoints may omit tenant context only when the route is intentionally public

## First Consumers

- `services/api`
- future `services/jobs`

## Deferred Decisions

- token and session format
- tracing and audit fields
- impersonation and delegated access rules
