# Role Vocabulary Contract

This document defines the initial role vocabulary for the future TKB Strategies platform.

## Purpose

Provide a shared, explicit role model across apps and services so access decisions are consistent.

## Initial Roles

- `platform-admin`
  - full administrative visibility across tenants
  - may inspect and manage tenant configuration and service operations
- `tenant-admin`
  - administrative visibility within one tenant
  - may manage tenant settings, content, and workflow operations
- `tenant-member`
  - authenticated tenant user with standard working access
  - may read and interact with tenant-scoped resources permitted by app behavior
- `participant`
  - limited-scope actor for guided tools, assessments, or workflow participation
  - may have no access to administrative surfaces

## Initial Rules

- roles are additive, not mutually exclusive
- `platform-admin` is platform-scoped, not tenant-scoped
- all non-platform roles should be interpreted inside a tenant context
- apps should not invent role names outside this vocabulary without updating this contract first

## Authorization Direction

The first implementation should evaluate access in this order:

1. authenticate actor
2. resolve tenant context
3. load membership
4. verify membership status
5. evaluate roles against requested action

## Deferred Decisions

- fine-grained permissions beyond role level
- temporary or delegated roles
- role inheritance and policy composition
