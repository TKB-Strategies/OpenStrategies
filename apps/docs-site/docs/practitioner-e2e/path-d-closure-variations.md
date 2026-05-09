---
title: "Path D: Closure Variations"
sidebar_label: "Path D: Closure Variations"
description: Validate closure skip, cadence, reopen, and archive variations.
---

# Path D: Closure Variations

Path A covers the happy completion. These checks cover the variations
practitioners need in real work.

## D1. Skip The Closure Loop

On a completion-eligible engagement, click **Mark complete...** and choose
**Skip the closure loop**. Write a one- or two-sentence reason and submit.

Expected:

- `wf7.closure.skipped` is recorded with the note in metadata.
- Engagement status becomes `completed`.
- No closure emails dispatch.
- The closure panel shows the skip note and **Reopen closure loop**.

## D2. Closure Cadence End-To-End

If Path A step 11 ran with cadence options enabled, survey emails should have
landed for client and owner. Submit the participant closure survey through
Mailpit and refresh engagement detail.

Expected:

- Closure responses appear in the closure panel, one per role.
- The +90 day check-back invitation is queued in cadence state.
- The +30 day case-study consent envelope is queued similarly.

The future emails should not fire during this walkthrough; they are scheduled.

## D3. Reopen And Re-Run

From a completed engagement, click **Reopen closure loop**. Adjust the opt-out
checkboxes and submit.

Expected:

- The dialog opens without a skip option.
- A fresh `wf7.closure.options_committed` event is recorded.
- Cadence state updates.
- The engagement remains `completed`.

## D4. Archive

From a completed engagement, click **Archive engagement** and confirm the
destructive-action dialog.

Expected:

- `engagements.archived_at` is set.
- The engagement disappears from the active dashboard.
- The direct URL still resolves and renders a read-only archived banner.
