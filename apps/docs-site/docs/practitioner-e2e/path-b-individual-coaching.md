---
title: "Path B: Individual Coaching"
sidebar_label: "Path B: Individual Coaching"
description: Validate direct and sponsored individual coaching engagement flows.
---

# Path B: Individual Coaching

Individual coaching follows the same lifecycle shape as Path A, but the
engagement scopes to a person rather than an organization. The access model is
the thing under test.

## B1. Direct Coaching, No Sponsor

Visit `/engagements/new`. Choose **Individual coaching** as the subject kind.
Skip sponsor organization. Pick or invite the coachee by email and complete the
wizard.

Expected:

- `engagement_subject_kind='individual'`.
- `organization_id IS NULL`.
- `individual_user_id` is populated.
- No phase scaffold is created.

Invite a co-coach from **People**.

Expected:

- The invite succeeds.
- The API log indicates membership upsert was skipped for orgless individual
  coaching.
- `engagement_participants` exists.
- No `memberships` row exists with a `NULL` organization.

Useful SQL:

```sql
select count(*) from memberships
where user_id = '<invited-user>'
  and organization_id is null;
```

Expected count: `0`.

From here, run Path A steps 7 through 11. There is no phase scaffold to work
through.

Stop if invite or participant access returns `NOT NULL` or foreign-key errors
on `organization_id`.

## B2. Sponsored Individual Coaching

Repeat the individual coaching path, but choose a sponsor organization in the
wizard.

Expected:

- Membership upsert runs normally.
- A `memberships` row is created under the sponsor organization.
- The coachee appears on that organization's roster.

This confirms the orgless behavior did not leak into sponsored coaching.
