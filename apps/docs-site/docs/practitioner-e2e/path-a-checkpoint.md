---
title: Path A Checkpoint
sidebar_label: Path A Checkpoint
description: Capture evidence immediately after the new organization client walkthrough.
---

# Path A Checkpoint

Complete this immediately after Path A. Do not wait until the full walkthrough
is over; the row ids and URLs are easiest to capture while the browser tabs are
still open.

| Step | URL Or Surface | Expected | Actual | Pass/Fail | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | `/inquiry` | Inquiry row and typed Branch A columns populated | | | |
| 2 | `/inquiries/<id>` | Detail renders typed contact and partnership fields | | | |
| 3 | Mailpit | Discovery invite received | | | |
| 4 | `/inquiries/<id>` | Tier classified and `values_score` set | | | |
| 5 | `/inquiries/<id>` | Documenso envelope sent or `no_template` handled | | | |
| 6 | `/engagements/<id>` | Engagement created and redirect lands | | | |
| 7 | `/engagements/<id>/settings`; `/admin/drive` | Three categories linked; sync count message uses real numbers | | | |
| 8 | `/engagements/<id>/people` | Invite sends; participant and membership rows present | | | |
| 9 | `localhost:3002` | Tenant accepts magic link and shows engagement | | | |
| 10 | Engagement sub-routes | Work routes load and activity records | | | |
| 11 | `/engagements/<id>` | Gates preflight and completion submits cleanly | | | |

Record these ids before moving on:

| Item | Value |
| --- | --- |
| Inquiry id | |
| Organization id | |
| Engagement id | |
| Participant user id | |
| Drive sync run id(s) | |
| Closure event id | |
