# @tkb/tenant-config

Shared tenant configuration types and helpers for TKB Strategies applications.

This package is the first extracted shared package from the imported client portal app. It provides:

- tenant configuration types
- lightweight runtime validation
- Docusaurus sidebar generation helpers
- tenant accent CSS generation helpers

The package does not own tenant-specific data. Each app keeps its own tenant instance data and passes it through these shared helpers.
