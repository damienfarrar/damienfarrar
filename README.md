# damienfarrar.com

Personal site and portfolio of Damien Farrar — and, deliberately, a **public
work sample**. The repo is meant to be read: architecture decisions are
documented, boundaries are explicit, and quality gates run in CI.

📋 [Refresh plan](docs/REFRESH_PLAN.md) · 📐 [ADRs](docs/adr/)

## Why this repo looks the way it does

Two audiences, two surfaces: recruiters and clients read the _site_ (lean,
fast, content-first); engineers read the _repo_ (docs, ADRs, tests). Restraint
is intentional — enough architecture to show judgement, no ceremony a personal
site can't justify. See the [design principles](docs/REFRESH_PLAN.md#design-principles).

## Built with an AI pair, on purpose

This repo was built with heavy AI assistance (Claude), directed by me — the
commit trailers say so honestly. The decisions were mine: the plan, the ADRs,
the design direction (picked across seven candidates), and the content. The
quality bar is enforced by machinery that doesn't care who typed: Zod at every
boundary, unit + e2e + axe tests, Lighthouse budgets in CI, and a full-history
secrets scan. How and why is documented in
[ADR-0006](docs/adr/0006-ai-assisted-build.md) — in 2026, directing an AI with
discipline _is_ part of the job, and this repo is a work sample of that too.

## Architecture

```
UI (server + client components)
  -> API layer (route handlers + server actions)
    -> domain / services (pure business logic, testable)
      -> data adapters: content repo (MDX/JSON) · KV (Upstash) · GitHub · email (Resend)
```

UI never touches data directly — everything goes through a framework-agnostic
service layer, so the content source could swap from local MDX to a DB/CMS
without touching components. Details in `docs/ARCHITECTURE.md` (coming in Phase 3).

## Stack

- **Next.js (App Router) + TypeScript** — [ADR-0002](docs/adr/0002-single-app-not-separate-service.md)
- **Tailwind CSS v4 + shadcn/ui**
- **Typed MDX/JSON content, Zod-validated** — [ADR-0004](docs/adr/0004-mdx-content-not-cms.md)
- **Upstash Redis (KV)** for rate limiting + view counters — [ADR-0005](docs/adr/0005-kv-live-data-layer.md)
- **Resend** for contact email
- **Vercel** hosting, DNS in Route 53 via Terraform — [ADR-0003](docs/adr/0003-host-on-vercel-not-aws-azure.md)

## Getting started

```bash
npm ci
npm run dev       # http://localhost:3000
```

Other scripts: `npm run build` · `npm run lint` · `npm run typecheck` ·
`npm run test` · `npm run format`

Live features (contact email, rate limiting, view counters, GitHub tiles)
are optional by environment — see [.env.example](.env.example). Without
keys, each degrades gracefully and the site still runs.

## Status

**Phases 1–5 done** — scaffold, design system ("ops console" direction),
typed content pipeline, pages + SEO, and the contact/live-data layer.
**Phase 6 (quality pass + launch) remains**: e2e + axe, Lighthouse budgets
in CI, real content, secrets-history scan, DNS cutover. Build phases and
estimates in the [plan, §7](docs/REFRESH_PLAN.md#7-build-phases). The
previous Angular 7 implementation lives in git history (`development`
branch) — [ADR-0001](docs/adr/0001-rebuild-not-upgrade.md) explains why it
was replaced rather than upgraded.
