# ADR-0004: Content as typed MDX/JSON in-repo, not a CMS

- **Status:** Accepted
- **Date:** 2026-07-03

## Context

Content is small (profile, experience timeline, 3–5 case studies) and changes
rarely — a few times a year, by one technical author. A headless CMS adds an
account, an API dependency, a webhook/rebuild pipeline, and a second place
where truth lives.

## Decision

Content lives in the repo: `profile.json`, `experience.json`, and one MDX file
per case study. Zod schemas in `lib/content` validate everything at build time
and are the single source of truth for types (inferred, flowing UI → domain →
data). Invalid content fails the build, not the reader.

## Consequences

- Content changes are pull requests: reviewed, versioned, previewed on Vercel.
- No CMS outage class of failure; the site builds from a git clone alone.
- A non-technical editor would outgrow this immediately — an accepted
  constraint; swapping the content adapter for a CMS later is confined to
  `lib/content` by design (ADR-0002 layering).
