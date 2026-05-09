---
title: Caveats
sidebar_label: Caveats
description: Known blockers and substitutions that affect the practitioner E2E walkthrough.
---

# Caveats

These caveats block or alter the walkthrough. Keep them visible, but do not let
them replace the path-specific checkpoints.

## Documenso Template Ids

Documenso template ids are per partnership. Without one, proposal send lands in
`no_template`. That branch is documented in Path A and is not a regression
unless the manual prefill path fails.

## Drive Folder Categories

The folder map writes `source_material`, `deliverable`, and `internal`. If the
local DB still only accepts legacy categories such as `knowledge_base` and
`deliverable`, Reference materials and Internal picks will fail.

Apply the latest migration that aligns `drive_sync_configs.category` with the
folder-map UI before running Path A step 7.

## External Local Services

Formbricks, Cal.com, Documenso, and Drive are hard dependencies. If one is
unavailable, use the documented substitution or skip the affected branch and
mark the checkpoint honestly.

## Deferred Product Areas

Discourse/community and billing flows are deferred. Nothing in this walkthrough
exercises them.
