---
sidebar_label: 'Practitioner E2E Walkthrough'
sidebar_position: 3
description: Validate the delivery platform practitioner lifecycle from inquiry through engagement closure.
---

# Practitioner E2E Walkthrough

Validate that the delivery platform supports a practitioner's full client
lifecycle: a person reaches out, you talk with them, you propose, they accept,
the work runs, and you close the engagement.

This is a real practitioner story, not a feature checklist. If a step fails,
capture what you saw and pause before continuing. Later steps depend on real
state produced by earlier steps.

:::warning Public documentation boundary
Use fabricated organizations, participants, and emails only. Do not enter
client names, client materials, financials, or private engagement details while
following this walkthrough.
:::

## Preconditions

Run the walkthrough from the TKB Delivery Platform checkout, not this
OpenStrategies docs repository.

### Local Services

| Service | Local URL | Notes |
| --- | --- | --- |
| Supabase | per `supabase status` | Apply all migrations against a clean dev DB before starting. If the API logs `ECONNREFUSED 127.0.0.1:54321`, Supabase is not reachable. |
| API (Fastify) | `http://localhost:3001` | Start with `npm run dev -w @tkb/api`. |
| Hub | `http://localhost:3000` | Start with `npm run dev -w @tkb/hub`. |
| Tenant | `http://localhost:3002` | Start with `npm run dev -w @tkb/tenant`. Used by the participant path. |
| Mailpit | `http://localhost:8025` UI / `1025` SMTP | Set `MAIL_DEV_MAILPIT_URL=http://localhost:8025` so test mail lands locally. Without Mailpit, configure a real email provider or mail will be logger-only. |
| Formbricks | `infra/local/formbricks/docker-compose.yml` | Required for inquiry intake. If unavailable, post the canonical webhook payload directly to the API. |
| Documenso | `infra/local/documenso/docker-compose.yml` | Required for proposal and agreement send. |
| Cal.com | `infra/local/cal-com/docker-compose.yml` | Required for discovery scheduling. |
| Google Drive | OAuth completed at `/admin/drive`; TKB root folder configured | Required for folder mapping and source-material sync. |

### Accounts

- One TKB practitioner account with `system_role='admin'`.
- A participant email inbox you can read. Mailpit is fine for local runs.

### Seed Assumptions

- A partnership with `documenso_template_id` set, ideally with
  `deliverables[]` populated. Without a template id, the proposal path lands in
  the `no_template` branch described below.
- A TKB Drive root folder with at least one named subfolder per category:
  Reference materials, Deliverables, and Internal.

### Substituting For Formbricks

If local Formbricks is unavailable, simulate the inquiry by posting the
canonical Formbricks webhook payload to
`http://localhost:3001/webhooks/formbricks`.

The expected payload shape and `INQUIRY_FORM_SURVEY_IDS` allow-list live in the
delivery-platform API route at `apps/api/src/routes/webhooks/formbricks.ts`.
Values outside locked sets such as `fields.budgetRange` or `fields.timeline`
should coerce to `NULL` with a warning log while the inquiry row still lands.

## Path A: New Organization Client

The dominant practitioner story: a new organization reaches out, discovery
happens, a proposal is sent and signed, the engagement runs, and the work closes.

### 1. Submit An Inquiry

Open `http://localhost:3000/inquiry` without authentication. Click
**Reach out** to summon the survey. Fill the partnership track with realistic
test data: organization name, contact name, email, role, phone, leadership
challenges, method questions, budget range, and timeline. Submit.

Expected result:

- The Formbricks surface confirms submission.
- A fresh `inquiries` row exists.
- `status='received'` and `inquiry_type='partnership'`.
- Typed Branch A columns such as `organization_name`,
  `leadership_challenges`, `contact_role`, and `contact_phone` are populated.
- A `wf5.inquiry.received` row appears in `activity_events`.

Useful SQL:

```sql
select id, contact_email, organization_name, leadership_challenges,
       contact_role, contact_phone, status
from inquiries
order by created_at desc
limit 1;
```

Stop if the row never lands, or if fields you filled are `NULL`. Trace
Formbricks to `/webhooks/formbricks` to `intakeInquiry`, and check the API logs
for the response id.

### 2. Review The Inquiry

Sign in as the practitioner and visit `http://localhost:3000/inquiries`. The
new inquiry should appear with a `received` chip. Open the detail page.

Expected result:

- The **Contact** card shows name, email, role, and phone.
- The **Partnership details** card renders every Branch A field plainly.
- The detail page exposes **Spawn discovery doc**, **Schedule discovery**, and
  **Decline** actions.

Stop if any field renders empty when the database row has data, or if a fresh
row shows a `(legacy)` chip.

### 3. Schedule Discovery

Click **Spawn discovery doc** if you want a Drive doc seeded for the call. Then
click **Schedule discovery** to send a Cal.com booking link to the contact.

Expected result:

- Mailpit receives a discovery invitation.
- The inquiry status advances.
- `wf5.discovery.doc_spawned`, if used, and `wf5.discovery.scheduled` activity
  events are recorded.

Stop if no mail appears within about 30 seconds. Check whether
`MAIL_DEV_MAILPIT_URL` is set on the API process and whether Cal.com config is
valid.

### 4. Classify Tier

After the discovery conversation, reopen the inquiry. Click **Classify tier**
and pick the tier that matches the shape of work. Values-fit fields are
practitioner-only and should not be sent to the contact or templated into
outbound documents.

Expected result:

- The selected tier persists.
- `values_score` is populated.
- A `wf5.tier.classified` event is recorded.

### 5. Build And Send The Proposal

Click **Build & send proposal** and walk the wizard:

- Confirm the tier.
- Confirm the partnership template.
- Spawn the Drive proposal doc.
- Review it in Drive.
- Return to the hub.
- Click **Send proposal**.

Expected result:

- A Documenso envelope is sent and visible in Mailpit.
- `wf5.proposal.spawned` and `wf5.proposal.sent` events are recorded.
- Inquiry status becomes `proposed`.

`no_template` branch: if the partnership has no `documenso_template_id`, the
auto-issue path lands in `no_template`. The detail panel should offer
**Switch to manual issue (prefilled)** linking to
`/agreements/new?engagement=...&participant=...`. This is acceptable; fail only
if the prefill fails or the link is missing.

### 6. Convert The Inquiry

After the contact signs, the Documenso webhook should flip the inquiry to
`signed`. From the inquiry detail, click **Convert to engagement**.

Expected result:

- An organization row is created or matched from the contact's organization
  name.
- A new engagement is created with
  `engagement_subject_kind='organization'`, an `organization_id`, the
  partnership linked, and status `provisioning`.
- The hub redirects to `/engagements/<id>`.
- The auto-issue path either succeeds or surfaces a `no_template` banner.

Stop if engagement creation fails on a `NOT NULL` or foreign-key error. That
usually means the subject-kind data shape is wrong.

### 7. Link Drive Folders And Sync

From `/engagements/<id>`, go to **Settings -> Folder map**. Pick three
engagement-root folders:

- **Reference materials**: organization-provided source content.
- **Deliverables**: TKB-produced artifacts the organization will receive.
- **Internal**: TKB internal working materials.

Each pick uses the shared Drive folder picker. Paste a Drive URL or browse from
the configured root. Then go to `http://localhost:3000/admin/drive`, find the
engagement in **Engagement folder map**, and click **Sync now**.

Expected result:

- All three picks succeed.
- `drive_sync_configs` has three rows with distinct `category` values and
  distinct `drive_folder_id` values.
- The sync message reports real numbers, for example
  `Synced 12 files across 3 runs (0 errors).`
- `content_versions` materialize for synced files.

Negative check: paste a Drive folder URL outside the configured TKB root and
try to preview it. The picker should reject it with
`Folder is outside the configured TKB Drive root.`

Stop if a folder pick fails with a constraint error, if the picker accepts an
out-of-root folder, or if the sync message reports zero when files actually
synced.

### 8. Invite Participants

From the engagement, open **People** and click **Invite participant**. Enter an
email, choose a role such as `member` or `facilitator`, and submit.

Expected result:

- Mailpit receives a magic-link email.
- An `engagement_participants` row is created.
- A `memberships` row is created under the engagement's parent organization.
- The API log shows the membership upsert running normally.

Stop if the invite returns 500. The failure is likely between auth-link
generation and membership or participant upserts.

### 9. Confirm Tenant Access

Open the participant magic link from Mailpit in a different browser profile so
the practitioner session does not leak into the participant test. The link
routes to the tenant app at `http://localhost:3002`.

Expected result:

- The tenant home renders with the organization's brand colors.
- The engagement appears in the participant view.
- Reference materials from the Drive sync appear according to their default
  visibility.
- Hub navigation is absent.

Stop if the magic link is rejected or the participant lands in an empty
workspace.

### 10. Work The Engagement

Back as the practitioner, open `/engagements/<id>` and exercise each working
surface:

- **Work items**: create one open item and one in-progress item.
- **Risks**: log one critical risk, then mitigate it.
- **Deliverables**: create one delivered item and leave one in-flight item.
- **People**: assign a closure form to the participant.
- **Sessions**: create a Cal.com booking from the link.
- **Decisions**: record a decision.
- **Source materials**: upload a tenant-side file and confirm it appears.
- **Timeline**: confirm every action appears as an activity event in order.
- **Insights**: if WF1 capture is wired in the local stack, log a coaching
  insight; otherwise skip this check.

Expected result:

- Every sub-route loads.
- Every create or update writes a `wf*` activity event.
- The engagement overview status strip reflects current counts.

### 11. Complete The Engagement

From the engagement page, find **Wrap up this engagement**. Read the gate
checklist. For each unmet hard gate, click its **View ->** link, resolve the
offending item, return, click **Refresh checks**, and watch the gate update in
place.

When all hard gates pass, click **Mark complete...**. Choose
**Run the closure loop**, keep the three opt-out checkboxes checked, and submit.

Expected result:

- Each **View ->** link navigates to the correct sub-route.
- **Refresh checks** updates state without a full page reload.
- **Mark complete...** stays disabled while any hard gate fails.
- After submit, engagement status is `completed`.
- `engagement.completed` and `wf7.closure.options_committed` events are
  recorded.
- Closure-survey emails dispatch immediately to the participant and engagement
  owner.
- The page renders the closure panel with cadence status, archive action, and
  reopen affordance.

Stop if the dialog submits but the server returns a hard-gate error, or if no
closure email lands in Mailpit within about 30 seconds.

## Path B: Individual Coaching

Individual coaching uses the same lifecycle shape as Path A, but the engagement
scopes to a person rather than an organization. Two branches matter because the
participant-access model differs.

### B1. Direct Coaching, No Sponsor

Visit `/engagements/new`. Choose **Individual coaching** as the subject kind.
Skip sponsor organization. Pick or invite the coachee by email. If the coachee
is new, the invite path should create both `auth.users` and `profiles` rows.
Complete the wizard.

Expected result:

- `engagement_subject_kind='individual'`.
- `organization_id IS NULL`.
- `individual_user_id` is populated.
- No phase scaffold is created.

Invite a co-coach from **People**. The invite should succeed and the API log
should indicate that membership upsert was skipped for orgless individual
coaching. There should be no `memberships` row with a `NULL` organization:

```sql
select count(*) from memberships
where user_id = '<invited-user>'
  and organization_id is null;
```

Expected count: `0`. The `engagement_participants` row should exist; that is
the access path for orgless individual engagements.

From here, run Path A steps 7 through 11. There is no phase scaffold to work
through.

Stop if any invite or participant-access step returns `NOT NULL` or foreign-key
errors on `organization_id`.

### B2. Sponsored Individual Coaching

Repeat the individual coaching path, but choose a sponsor organization in the
wizard.

Expected result:

- Membership upsert runs normally.
- A `memberships` row is created under the sponsor organization.
- The coachee appears on that organization's roster.

This confirms the orgless behavior did not leak into the sponsored case.

## Path C: Continue An Existing Engagement

Use this weekly-operation path on an active engagement that already has
accumulated state.

Open the active engagement and triage the Attention strip. Items at the top are
gates pulling on the practitioner for action. Click into each one and resolve or
defer it. Then walk the tabs:

- **Work items**: review open items and archive stale ones.
- **Risks**: re-rate current risks.
- **Deliverables**: advance in-flight items toward delivered.
- **People**: review submitted forms.
- **Sessions**: confirm the next session.
- **Source materials**: sync new partner files from the engagement detail or
  `/admin/drive`.
- **Timeline**: confirm the morning's work landed as activity events.

Expected result:

- The Attention strip surfaces real items.
- Every sub-route loads.
- The timeline reflects the actions you took.

Stop if the Attention strip is empty while something obviously needs attention,
or if any sub-route returns a server error.

## Path D: Closure Variations

Path A covers the happy completion. These checks cover the variations
practitioners need in real work.

### D1. Skip The Closure Loop

On a completion-eligible engagement, click **Mark complete...** and choose
**Skip the closure loop**. Write a one- or two-sentence reason and submit.

Expected result:

- A `wf7.closure.skipped` event is recorded with the note in metadata.
- The engagement status becomes `completed`.
- No closure emails dispatch.
- The closure panel shows the skip note and a **Reopen closure loop**
  affordance.

### D2. Closure Cadence End-To-End

If Path A step 11 ran with cadence options enabled, survey emails should have
landed for client and owner. Submit the participant closure survey through the
Mailpit magic link and refresh the engagement detail.

Expected result:

- Closure responses appear in the closure panel, one per role.
- The +90 day check-back invitation is queued in cadence state.
- The +30 day case-study consent envelope is queued similarly.

The future emails should not fire during this walkthrough; they are scheduled.

### D3. Reopen And Re-Run

From a completed engagement, click **Reopen closure loop**. The dialog should
open without a skip option. Adjust the opt-out checkboxes and submit.

Expected result:

- A fresh `wf7.closure.options_committed` event is recorded.
- Cadence state updates.
- The engagement remains `completed`.

### D4. Archive

From a completed engagement, click **Archive engagement** and confirm the
destructive-action dialog.

Expected result:

- `engagements.archived_at` is set.
- The engagement disappears from the active dashboard.
- The direct URL still resolves and renders a read-only archived banner.

## Evidence Table

Fill this in as you go. Capture URLs and database row ids in **Notes** so a
failure is reproducible.

| Step | Path | URL | Expected | Actual | Pass/Fail | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | A | `/inquiry` | Inquiry row, typed Branch A columns populated | | | |
| 2 | A | `/inquiries/<id>` | Detail renders typed fields | | | |
| 3 | A | `/inquiries/<id>` | Discovery invite in Mailpit | | | |
| 4 | A | `/inquiries/<id>` | Tier classified, `values_score` set | | | |
| 5 | A | `/inquiries/<id>` | Documenso envelope sent or `no_template` branch handled | | | |
| 6 | A | `/inquiries/<id>` to `/engagements/<id>` | Engagement created, redirect lands | | | |
| 7 | A | `/engagements/<id>/settings`; `/admin/drive` | Three categories linked; sync count message real | | | |
| 8 | A | `/engagements/<id>/people` | Invite sends; participant and membership rows present | | | |
| 9 | A | `localhost:3002` | Tenant accepts magic link; engagement visible | | | |
| 10 | A | every sub-route | All sub-routes load; events recorded | | | |
| 11 | A | `/engagements/<id>` | Gates preflight; completion submits cleanly | | | |
| B1 | B | `/engagements/new` to invite | Orgless engagement; invite skips membership | | | |
| B2 | B | `/engagements/new` to invite | Sponsored engagement; membership upsert runs | | | |
| C | C | `/engagements/<id>` | Attention strip and every sub-route load | | | |
| D1 | D | `/engagements/<id>` | Skip path lands cleanly | | | |
| D2 | D | `/engagements/<id>` | Cadence dispatches; responses appear | | | |
| D3 | D | `/engagements/<id>` | Reopen dialog; new options persist | | | |
| D4 | D | `/engagements/<id>` | Archive succeeds; dashboard hides | | | |

## Known Caveats

These caveats block or alter the walkthrough.

- **Documenso template ids are per partnership.** Without one, proposal send
  lands in `no_template`. That branch is documented above and is not a
  regression unless the manual prefill path fails.
- **Drive folder categories must match the database constraint.** The folder
  map writes `source_material`, `deliverable`, and `internal`. If the local DB
  still only accepts legacy categories such as `knowledge_base` and
  `deliverable`, Reference materials and Internal picks will fail. Apply the
  latest migration that aligns `drive_sync_configs.category` with the folder
  map UI before running Path A step 7.
- **Formbricks, Cal.com, Documenso, and Drive are hard dependencies.** If one
  is unavailable, use the documented substitution or skip the affected branch
  and mark the evidence table honestly.
- **Discourse and billing are deferred.** Nothing in this walkthrough exercises
  forum/community or billing flows.
