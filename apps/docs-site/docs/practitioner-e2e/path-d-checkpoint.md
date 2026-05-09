---
title: Path D Checkpoint
sidebar_label: Path D Checkpoint
description: Capture closure variation evidence immediately after running Path D.
---

# Path D Checkpoint

Complete this immediately after the closure variations.

| Step | URL Or Surface | Expected | Actual | Pass/Fail | Notes |
| --- | --- | --- | --- | --- | --- |
| D1 | `/engagements/<id>` | Skip path completes and no closure mail sends | | | |
| D1 | Activity events | `wf7.closure.skipped` includes note metadata | | | |
| D2 | Mailpit and closure panel | Survey response appears by role | | | |
| D2 | Cadence state | +90 day and +30 day future actions are queued | | | |
| D3 | Reopen dialog | Skip option absent; new options persist | | | |
| D3 | Activity events | Fresh `wf7.closure.options_committed` recorded | | | |
| D4 | Dashboard and direct URL | Archived engagement hidden from active list but direct URL renders | | | |

Record these ids before wrapping:

| Item | Value |
| --- | --- |
| Skip-path engagement id | |
| Closure skipped event id | |
| Closure response id(s) | |
| Reopen options event id | |
| Archived engagement id | |
