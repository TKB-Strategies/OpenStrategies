---
title: Path B Checkpoint
sidebar_label: Path B Checkpoint
description: Capture evidence immediately after individual coaching validation.
---

# Path B Checkpoint

Complete this immediately after both individual coaching branches.

| Branch | URL Or Surface | Expected | Actual | Pass/Fail | Notes |
| --- | --- | --- | --- | --- | --- |
| B1 | `/engagements/new` | Orgless individual engagement created | | | |
| B1 | People invite | Invite succeeds and membership upsert is skipped | | | |
| B1 | SQL | No `memberships` row with `organization_id IS NULL` | | | |
| B1 | Path A steps 7-11 | Drive, tenant, work, and closure paths still work | | | |
| B2 | `/engagements/new` | Sponsored individual engagement created | | | |
| B2 | People invite | Membership upsert runs under sponsor org | | | |
| B2 | Sponsor roster | Coachee appears under sponsor organization | | | |

Record these ids before moving on:

| Item | Value |
| --- | --- |
| Orgless engagement id | |
| Orgless coachee user id | |
| Sponsored engagement id | |
| Sponsor organization id | |
| Sponsored coachee user id | |
