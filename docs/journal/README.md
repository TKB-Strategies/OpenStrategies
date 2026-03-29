# Journal Entry Requirements

This directory holds narrative day-level journal entries like [2026-03-22.md](./2026-03-22.md) and [2026-03-29.md](./2026-03-29.md). These are not the same as the session-based closeouts in [../OPERATIONS-JOURNAL.md](../OPERATIONS-JOURNAL.md).

Use this README as the exact specification for creating a new journal entry in this folder.

## Purpose

A journal entry in `docs/journal/` should:

- summarize a meaningful milestone day, not a minor work session
- capture architecture, decisions, momentum, and remaining work at a glance
- read like a durable project narrative, not a raw changelog
- include visuals that make the day understandable without needing to inspect commit history first

## File Naming

- The file name must be `YYYY-MM-DD.md`.
- Use the local project date for the working day being documented.
- Create one narrative entry per date unless there is a strong reason to split the day.

## Required Title Block

Every entry must begin with exactly this structure:

```md
# Day N — Short Descriptive Title

**Month DD, YYYY · TKB Strategies · OpenStrategies**
```

Requirements:

- `Day N` is the narrative day count, not the calendar day.
- The title after the dash should describe the day’s milestone clearly.
- The second line must be bold and use the same middle-dot formatting shown above.

## Required Section Structure

Use these nine top-level sections in this exact order:

1. `## 1. Executive Summary`
2. `## 2. Today's Journey — Timeline`
3. `## 3. Phase Progress Map`
4. `## 4. Architecture Established`
5. `## 5. Decisions Log`
6. `## 6. Dependency Map — Current State`
7. `## 7. Commits Merged to Main`
8. `## 8. Open Items`
9. `## 9. Day N Velocity`

Do not add extra top-level numbered sections unless the journal format is intentionally being revised everywhere.

## Required Visuals

Each entry must include these Mermaid diagrams:

- one `gantt` chart in Section 2
- one `pie` chart in Section 3
- one `flowchart` in Section 4
- one `flowchart` in Section 6

Requirements:

- Diagrams should reflect the actual work completed that day.
- Labels should be specific enough to stand on their own.
- Use the same visual density as the existing entries: substantial enough to be useful, not decorative filler.

## Required Tables

Each entry must include these tables:

- Section 5: decisions table with columns `#`, `Decision`, `Rationale`, `Impact`
- Section 7: commits table with columns `Hash`, `Message`, and a contextual third column such as `Phase` or `Area`
- Section 8: open-items table with columns `ID`, `Task`, `Priority`, `Notes`

Requirements:

- Decisions should be architectural or operational, not trivial edits.
- Commit rows should reflect the commits that actually landed on `main`.
- Open items should be concrete next-step work, not vague aspirations.

## Writing Requirements

- Write in complete prose, not just bullet fragments.
- Keep the tone factual and durable.
- Summarize real outcomes, not intentions.
- If a build, deploy, or verification step mattered, say whether it succeeded.
- If the day changed the architecture, make that explicit in Sections 1, 4, 5, and 9.

## Accuracy Requirements

- Pull commit hashes and messages from `git log`, not memory.
- Match the repository structure that actually exists at the time of writing.
- Do not claim deployment, build, or migration completion unless it was verified.
- If a diagram simplifies reality, keep the simplification directionally accurate.

## Relationship to `OPERATIONS-JOURNAL.md`

Use `docs/OPERATIONS-JOURNAL.md` for session-by-session closeouts.

Use `docs/journal/YYYY-MM-DD.md` when:

- the work represents a milestone day
- the repository structure changed materially
- the architecture or delivery model shifted
- you want a narrative artifact that is more presentation-ready than the ops journal

## Creation Checklist

Before considering a new journal entry complete, verify that it:

- uses the correct `YYYY-MM-DD.md` file name
- follows the exact title block format
- includes all nine required sections in order
- includes the four required Mermaid diagrams
- includes the three required tables
- references real commits on `main`
- reflects verified repository state
- is readable on its own without opening other files first
