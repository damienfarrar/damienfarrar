# ADR-0002: Single Next.js app, not a separate backend service

- **Status:** Accepted
- **Date:** 2026-07-03

## Context

The old site paired an SPA with a standalone API (`api.damienfarrar.com`) —
originally so the site itself could demonstrate full-stack work. A separate
service demonstrates service separation, but for a portfolio's actual needs
(mostly-static content, one form, two tiny live-data features) it doubles the
hosting, deployment, and maintenance surface. The old stack rotted precisely
because of that surface.

## Decision

One Next.js app. Backend concerns live in route handlers / server actions
behind an explicit internal layering (UI → API → domain/services → data
adapters). The full-stack signal comes from that visible layering and from
genuinely server-side features (validated contact endpoint, KV-backed
counters, rate limiting), not from a network boundary.

## Consequences

- One deploy, one repo, zero orphaned services.
- The domain/service layer is framework-agnostic, so extracting a real service
  later is a refactor, not a rewrite.
- Interviewers see judgement about _when a service boundary is warranted_ —
  the lead-level signal — rather than ceremony.
