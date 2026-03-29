# Tenant Config Contract

This document defines the first API contract for tenant configuration retrieval.

## Purpose

Provide tenant-scoped applications a stable way to retrieve tenant identity, branding, and workflow metadata without hardcoding those values into each app shell forever.

The response shape should align with `packages/tenant-config/`.

## Initial Endpoint Shape

`GET /api/v1/tenants/:tenantSlug/config`

Example:

```http
GET /api/v1/tenants/example-org/config
```

## Expected Response

```json
{
  "tenant": {
    "slug": "example-org",
    "orgName": "Example Organization",
    "tagline": "Powered by TKB Strategies",
    "primaryColor": "#D4920B",
    "secondaryColor": "#345168",
    "logoPath": "/img/logo.svg",
    "engagementType": "cohort-coaching",
    "engagementScope": "cohort",
    "clientPathway": "org-contracted-coaching",
    "phases": [
      { "id": "01", "label": "Stabilize", "slug": "stabilize" },
      { "id": "02", "label": "Name", "slug": "name" }
    ],
    "components": [],
    "frameworks": [],
    "tools": []
  }
}
```

## Initial Rules

- `tenantSlug` is the canonical lookup key
- response must validate against shared tenant-config rules
- no contract terms, billing details, or internal-only fields should be returned to a public or client-facing app by default
- phase order is authoritative in the API response

## First Consumers

- `apps/client-portal`
- future `apps/admin-studio`

## Deferred Decisions

- where tenant config is persisted
- whether tenant config is cached at edge or app level
- whether the same endpoint supports platform-admin overrides
