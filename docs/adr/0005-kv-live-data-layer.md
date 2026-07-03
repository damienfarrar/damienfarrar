# ADR-0005: A small KV-backed live-data layer (Upstash Redis)

- **Status:** Proposed
- **Date:** 2026-07-03

## Context

With content fully static (ADR-0004), the site could read as "a static site
with a form" — thin evidence for a full-stack signal. Serverless functions are
also stateless, so the contact endpoint's rate limiter needs external state:
an in-memory limiter on Vercel silently no-ops.

## Decision

One free-tier Upstash Redis (KV) instance serving two deliberately small jobs:

1. **Sliding-window rate limiting** for `/api/contact` (keyed by IP).
2. **Per-project view counters** — a real write path with persistence. No
   cookies, no PII.

Plus one read-side live integration: a GitHub activity strip on the home page,
ISR-cached (~1h). All three degrade gracefully — if Redis or GitHub is
unreachable, the site renders without them.

A guestbook was rejected (moderation burden), as was a relational DB/ORM
(nothing here needs a schema — restraint principle).

## Consequences

- Demonstrates persistence, serverless-correct rate limiting, external API
  caching/revalidation — with one free dependency and no servers.
- KV is deliberately the _only_ persistence in v1; anything needing relational
  data is a future ADR.
- The GitHub strip is the first feature cut if time-boxed.
