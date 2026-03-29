# Assessment Definition Contract

This document defines the first API contract for retrieving assessment definitions.

## Purpose

Move assessment structure out of frontend-only ownership while still reusing shared package logic from `packages/assessment-core/`.

The first target is the healing plan domain, but the contract should be extensible to future tools.

## Initial Endpoint Shape

`GET /api/v1/assessments/:assessmentId`

Example:

```http
GET /api/v1/assessments/healing-centered-action-plan
```

## Expected Response

```json
{
  "assessment": {
    "id": "healing-centered-action-plan",
    "title": "Healing-Centered Leadership Action Plan",
    "sections": [
      { "id": "start", "label": "Starting place" },
      { "id": "assess", "label": "Assessment" }
    ],
    "areas": [
      {
        "key": "safety",
        "label": "Safety: Physical and emotional safety for all people (staff, young people, visitors)"
      }
    ],
    "barriers": [
      {
        "challenge": "Resistance to change",
        "hint": "Start small, share success stories, identify early adopters, honor fear as information"
      }
    ]
  }
}
```

## Initial Rules

- `assessmentId` is stable and machine-readable
- section ordering is authoritative
- assessment labels should be sourced from shared package definitions where possible
- this endpoint is read-only in the first implementation

## First Consumers

- `apps/healing-plan`
- future export and analytics workflows

## Deferred Decisions

- whether assessment definitions become tenant-overridable
- whether scoring and persistence sit behind separate endpoints
- whether versioning is handled in the path, payload, or metadata
