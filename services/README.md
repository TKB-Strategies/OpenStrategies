# Services

This directory is reserved for tenant-aware backend services that will support the TKB Strategies SaaS transition.

These services do not replace the current static delivery surfaces immediately. They are introduced gradually so the monorepo can define stable platform contracts before backend implementation accelerates.

Current service lanes:

- `api/` - application-facing HTTP APIs for tenant, workflow, and assessment operations
- `auth/` - identity, session, and tenant-boundary rules
- `jobs/` - asynchronous processing for exports, notifications, and background tasks
- `webhooks/` - inbound and outbound event integrations

At this stage, the service directories are contract-first. They document responsibilities, boundaries, and expected inputs and outputs before application code is added.
