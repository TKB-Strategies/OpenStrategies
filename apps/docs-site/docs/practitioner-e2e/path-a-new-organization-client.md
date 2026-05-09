---
title: "Path A: New Organization Client"
sidebar_label: "Path A: New Organization"
description: Run the full organization-client lifecycle from inquiry through closure.
---

# Path A: New Organization Client

This is the dominant practitioner story: a new organization reaches out,
discovery happens, a proposal is sent and signed, the engagement runs, and the
work closes.

## 1. Submit An Inquiry

Open `http://localhost:3000/inquiry` without authentication. Click
**Reach out**, fill the partnership track with realistic test data, and submit.

Expected:

- Formbricks confirms submission.
- A fresh `inquiries` row exists.
- `status='received'` and `inquiry_type='partnership'`.
- Typed Branch A columns are populated, not only `values_response`.
- `wf5.inquiry.received` appears in `activity_events`.

Useful SQL:

```sql
select id, contact_email, organization_name, leadership_challenges,
       contact_role, contact_phone, status
from inquiries
order by created_at desc
limit 1;
```

Stop if the row never lands or filled fields are `NULL`.

## 2. Review The Inquiry

Sign in as the practitioner and visit `http://localhost:3000/inquiries`. Open
the new inquiry.

Expected:

- The **Contact** card shows name, email, role, and phone.
- The **Partnership details** card renders every Branch A field plainly.
- The page exposes **Spawn discovery doc**, **Schedule discovery**, and
  **Decline**.

Stop if a fresh row renders empty fields or a `(legacy)` chip.

## 3. Schedule Discovery

Click **Spawn discovery doc** if useful. Click **Schedule discovery** to send a
Cal.com booking link.

Expected:

- Mailpit receives a discovery invitation.
- Inquiry status advances.
- `wf5.discovery.doc_spawned`, if used, and `wf5.discovery.scheduled` are
  recorded.

Stop if no mail appears within about 30 seconds.

## 4. Classify Tier

After discovery, reopen the inquiry. Click **Classify tier** and choose the
right tier. Values-fit fields are practitioner-only and should not travel to the
contact.

Expected:

- Tier persists.
- `values_score` is populated.
- `wf5.tier.classified` is recorded.

## 5. Build And Send The Proposal

Click **Build & send proposal** and walk the wizard: confirm tier, confirm
template, spawn the Drive proposal doc, review it, return to the hub, and click
**Send proposal**.

Expected:

- A Documenso envelope is sent and visible in Mailpit.
- `wf5.proposal.spawned` and `wf5.proposal.sent` are recorded.
- Inquiry status becomes `proposed`.

If there is no `documenso_template_id`, the path should land in `no_template`
and expose **Switch to manual issue (prefilled)**. That branch is acceptable;
fail only if the prefill link is missing or broken.

## 6. Convert The Inquiry

After Documenso marks the inquiry signed, click **Convert to engagement**.

Expected:

- An organization row is created or matched.
- A new engagement is created with
  `engagement_subject_kind='organization'`, an `organization_id`, the
  partnership linked, and status `provisioning`.
- The hub redirects to `/engagements/<id>`.

Stop on `NOT NULL` or foreign-key errors.

## 7. Link Drive Folders And Sync

From `/engagements/<id>`, go to **Settings -> Folder map**. Pick one folder for
each bucket:

- **Reference materials**: organization-provided source content.
- **Deliverables**: TKB-produced artifacts the organization will receive.
- **Internal**: TKB internal working materials.

Then go to `http://localhost:3000/admin/drive`, find the engagement in
**Engagement folder map**, and click **Sync now**.

Expected:

- All three picks succeed.
- `drive_sync_configs` has three rows with distinct categories and folder ids.
- The sync message reports real numbers, such as
  `Synced 12 files across 3 runs (0 errors).`
- `content_versions` materialize for synced files.

Negative check: paste a Drive folder URL outside the configured TKB root. The
picker should reject it with `Folder is outside the configured TKB Drive root.`

## 8. Invite Participants

Open **People**, click **Invite participant**, enter an email, choose a role,
and submit.

Expected:

- Mailpit receives a magic-link email.
- `engagement_participants` is created.
- `memberships` is created under the parent organization.
- The API log shows membership upsert running normally.

## 9. Confirm Tenant Access

Open the participant magic link in a different browser profile. It should route
to `http://localhost:3002`.

Expected:

- Tenant home renders with organization brand colors.
- The engagement appears in the participant view.
- Reference materials appear according to default visibility.
- Hub navigation is absent.

## 10. Work The Engagement

Back in the hub, open `/engagements/<id>` and exercise the working surfaces:

- **Work items**: create one open and one in-progress item.
- **Risks**: log one critical risk, then mitigate it.
- **Deliverables**: create one delivered item and leave one in-flight item.
- **People**: assign a closure form.
- **Sessions**: create a Cal.com booking.
- **Decisions**: record a decision.
- **Source materials**: upload a tenant-side file and confirm it appears.
- **Timeline**: confirm every action appears as activity.
- **Insights**: log a coaching insight if WF1 capture is wired locally.

Expected: every route loads, every write records activity, and the overview
status strip reflects current counts.

## 11. Complete The Engagement

Find **Wrap up this engagement**. For each unmet hard gate, click **View ->**,
resolve the offending item, return, and click **Refresh checks**.

When all hard gates pass, click **Mark complete...**, choose **Run the closure
loop**, keep the three opt-out checkboxes checked, and submit.

Expected:

- **View ->** links navigate to the right sub-routes.
- **Refresh checks** updates state without a full page reload.
- **Mark complete...** stays disabled until hard gates pass.
- Engagement status becomes `completed`.
- `engagement.completed` and `wf7.closure.options_committed` are recorded.
- Closure-survey emails dispatch to participant and owner.
- The closure panel renders cadence status, archive action, and reopen action.
