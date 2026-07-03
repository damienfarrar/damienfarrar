# ADR-0003: Host on Vercel — deliberately not AWS, Azure, or both

- **Status:** Accepted
- **Date:** 2026-07-03

## Context

The previous site ran on AWS (DNS remains in Route 53) and died of maintenance
neglect — hand-rolled cloud hosting is exactly the surface that rots on a
personal site. Hosting the rebuild on AWS (OpenNext/SST) or Azure was
considered for the cloud-skills signal; so was multi-cloud.

## Decision

Host on Vercel. Next.js is first-class there (ISR, image optimization, edge),
the free tier covers a personal site, per-PR preview deploys come built in, and
the ops surface is ~zero. Multi-cloud was rejected outright: on a portfolio it
reads as over-engineering — the opposite of the judgement this repo is meant
to demonstrate.

The cloud-depth signal is carried instead by:

1. **This ADR** — knowing how to run it on AWS and choosing not to, with reasons.
2. **DNS-as-code** — the Route 53 zone is managed by Terraform in `/infra/dns`
   (records must change at cutover anyway: Vercel pointing, Resend SPF/DKIM).
3. **Case-study content** — at least one featured project is cloud-native/AWS-heavy.

## Consequences

- Zero hosting cost or ops burden; previews per PR.
- Platform lock-in is accepted knowingly: the app is standard Next.js and the
  layering (ADR-0002) keeps a future move mechanical.
- AWS remains only where it earns its place: Route 53 + Terraform.
