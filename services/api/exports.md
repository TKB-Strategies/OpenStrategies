# Export Request Contract

This document defines the first API contract for export requests.

## Purpose

Create a stable boundary between frontend export intent and the eventual background or server-side export system.

The shared export builder in `packages/exports/` remains the source of formatting logic until the service layer needs to own generation directly.

## Initial Endpoint Shape

`POST /api/v1/exports`

Example:

```http
POST /api/v1/exports
Content-Type: application/json
```

```json
{
  "tenantSlug": "example-org",
  "assessmentId": "healing-centered-action-plan",
  "format": "txt",
  "payload": {
    "answers": {},
    "assessments": {}
  }
}
```

## Expected Response

```json
{
  "exportRequest": {
    "id": "exp_123",
    "status": "accepted",
    "format": "txt"
  }
}
```

## Initial Rules

- request must resolve to a tenant context unless explicitly anonymous
- `assessmentId` must correspond to a known assessment definition
- `format` must be explicit, even if only `txt` is supported initially
- the first implementation may process synchronously or return a no-op accepted response while the job system is still emerging

## First Consumers

- `apps/healing-plan`
- future `services/jobs`

## Deferred Decisions

- storage location for generated artifacts
- asynchronous job semantics
- signed download URLs
- retention and deletion policy
