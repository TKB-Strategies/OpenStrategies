---
title: Overview And Setup
sidebar_label: Overview And Setup
description: Prepare the local delivery platform stack before running the practitioner E2E walkthrough.
---

# Practitioner E2E Walkthrough

Use this walkthrough to validate the delivery platform as a real practitioner
story: a person reaches out, you talk with them, you propose, they accept, the
work runs, and you close the engagement.

Do not treat this as a route checklist. Each page creates state that the next
page depends on. If a step fails, stop, capture the failure in the next
checkpoint page, and fix the blocker before continuing.

:::warning Public documentation boundary
Use fabricated organizations, participants, and emails only. Do not enter
client names, client materials, financials, or private engagement details while
following this walkthrough.
:::

## Page Order

1. **Path A: New Organization Client**: full inquiry-to-closure lifecycle.
2. **Path A Checkpoint**: capture evidence immediately after completing Path A.
3. **Path B: Individual Coaching**: direct and sponsored individual coaching.
4. **Path B Checkpoint**: capture evidence for both individual branches.
5. **Path C: Continue Engagement**: weekly operation on an active engagement.
6. **Path C Checkpoint**: capture evidence for continuation work.
7. **Path D: Closure Variations**: skip, cadence, reopen, and archive.
8. **Path D Checkpoint**: capture closure evidence.
9. **Caveats**: known blockers and substitutions.

## Local Services

Run these from the TKB Delivery Platform checkout, not this OpenStrategies docs
repository.

| Service | Local URL | Notes |
| --- | --- | --- |
| Supabase | per `supabase status` | Apply all migrations against a clean dev DB before starting. If the API logs `ECONNREFUSED 127.0.0.1:54321`, Supabase is not reachable. |
| API (Fastify) | `http://localhost:3001` | Start with `npm run dev -w @tkb/api`. |
| Hub | `http://localhost:3000` | Start with `npm run dev -w @tkb/hub`. |
| Tenant | `http://localhost:3002` | Start with `npm run dev -w @tkb/tenant`. Used by the participant path. |
| Mailpit | `http://localhost:8025` UI / `1025` SMTP | Set `MAIL_DEV_MAILPIT_URL=http://localhost:8025` so test mail lands locally. |
| Formbricks | `infra/local/formbricks/docker-compose.yml` | Required for inquiry intake unless you post the webhook payload directly. |
| Documenso | `infra/local/documenso/docker-compose.yml` | Required for proposal and agreement send. |
| Cal.com | `infra/local/cal-com/docker-compose.yml` | Required for discovery scheduling. |
| Google Drive | OAuth completed at `/admin/drive`; TKB root folder configured | Required for folder mapping and source-material sync. |

## Accounts And Seeds

- Use one TKB practitioner account with `system_role='admin'`.
- Use a participant email inbox you can read. Mailpit is fine for local runs.
- Seed a partnership with `documenso_template_id` set, ideally with
  `deliverables[]` populated.
- Prepare a TKB Drive root folder with one named subfolder per category:
  Reference materials, Deliverables, and Internal.

## Formbricks Substitute

If local Formbricks is unavailable, simulate the inquiry by posting the
canonical Formbricks webhook payload to
`http://localhost:3001/webhooks/formbricks`.

The payload shape and `INQUIRY_FORM_SURVEY_IDS` allow-list live in the delivery
platform API route at `apps/api/src/routes/webhooks/formbricks.ts`. Values
outside locked sets such as `fields.budgetRange` or `fields.timeline` should
coerce to `NULL` with a warning log while the inquiry row still lands.
