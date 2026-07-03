# damienfarrar.com — Refresh Plan

> Status: **v3 — hosting decision resolved**
> Author: Damien Farrar (with Claude)
> Date: 2026-07-03

## 1. Purpose & goals

Rebuild `damienfarrar.com` from scratch. The site is **dual-purpose**:

1. A personal portfolio for a full-stack engineer (Melbourne, 10+ yrs).
2. **A technical work sample** — source public on GitHub, shown in interviews.

Because the site *is* a code sample, engineering quality is a first-class feature.
The target signal is **full-stack breadth + lead/senior judgement**: clean
architecture, documented decisions, end-to-end type safety, tests, and CI/CD —
not just a nice-looking page.

### Design principles

1. **Two audiences, two surfaces.** Recruiters and clients read the *site* — it
   stays lean, fast, and content-first. Engineers read the *repo* — the depth
   (docs, ADRs, tests) lives there and never bloats the runtime.
2. **Restraint is the senior signal.** Enough architecture to show judgement —
   3–4 meaningful ADRs, one small live-data feature — and no enterprise ceremony
   a personal site can't justify. Every layer must earn its place.
3. **Working beats claimed.** Anything the repo showcases (rate limiting, a11y,
   perf) must actually work under its runtime constraints. A rate limiter that
   silently no-ops on serverless is worse than none.

### Success criteria

- A hiring manager skimming the repo in 5 minutes sees intentional architecture,
  tests, and CI — not a framework starter with content pasted in.
- Lighthouse **targets**: Performance ≥ 95, Best Practices ≥ 95, SEO ≥ 100.
  CI asserts these as *tolerant budgets* (median of 3 runs, hard-fail only below
  Performance 90) — scores are run-to-run noisy and must not flake the pipeline.
- **Accessibility: WCAG 2.2 AA** is the goal, verified by axe automation in e2e
  plus a manual keyboard/screen-reader pass. Lighthouse a11y 100 is a smoke
  check, not proof of compliance.
- No servers to babysit: the only persistence is a free-tier Redis (KV);
  hosting is free; content is editable via version control.
- Fully responsive, dark/light mode, `prefers-reduced-motion` respected.

## 2. Decisions

| # | Decision | Choice | Status | Rationale |
|---|----------|--------|--------|-----------|
| 1 | Rebuild vs upgrade | **Rebuild from scratch** | Locked | Angular 7 is EOL and uses `@angular/http` (removed in v8); no clean upgrade path. |
| 2 | Framework | **Next.js (App Router) + TypeScript** | Locked | Most widely recognized full-stack signal; frontend + backend in one repo; server components for perf. |
| 3 | Backend surface | **Single Next.js app** (route handlers / server actions) | Locked | Full-stack story without a second service to host/maintain. Service layer keeps it swappable later. |
| 4 | Styling | **Tailwind CSS (v4) + shadcn/ui** | Locked | Fully custom design, no dated Material theme; components live in-repo (good for a sample). |
| 5 | Content | **Typed MDX + JSON, Zod-validated** | Locked | Version-controlled, no CMS, schema is single source of truth. |
| 6 | Contact | **Route handler + Zod + rate limit + Resend** | Locked | Demonstrates real backend concerns; mechanics in §6. |
| 7 | Hosting | **Vercel** — deliberately not AWS, Azure, or both | Locked | Free, zero-ops, per-PR preview deploys, first-class Next.js support. Hand-rolled cloud hosting is the maintenance surface that killed the old site; multi-cloud on a portfolio is over-engineering. Recorded as an ADR (§6); cloud-depth signal carried by case-study content instead (§8). |
| 8 | Content scope | **Full concept from scratch** | Locked | New structure centered on deep project case studies. |
| 9 | Live data layer | **Upstash Redis (KV)**: contact rate limiting + per-project view counters | Proposed | Without any live data, the site reads as "static site with a form" — thin for a full-stack signal. One KV store serves both needs; write path + persistence demonstrated. Chosen over a guestbook (moderation burden conflicts with the restraint principle). |
| 10 | Live integration | **GitHub activity feed** on home, ISR-cached | Proposed | Visible live-data feature: external API + caching/revalidation strategy. First candidate to cut if time-boxed. |
| 11 | URL scheme | **Slugs** (`/projects/[slug]`), not numeric ids | Decided | Resolves v1 open question. Legacy `/detail/:id` not mapped unless analytics show traffic. |
| 12 | Bot protection | **Honeypot + rate limit** now; Turnstile only if real spam appears | Proposed | Proportionate; avoids third-party widget until justified. |
| 13 | DNS / IaC | **Domain stays in Route 53; records managed with Terraform in-repo** (`/infra/dns`) | Decided | Real, visible IaC with a tiny maintenance surface. Records must change at cutover anyway (Vercel pointing, Resend SPF/DKIM). |

## 3. Architecture

Single Next.js app, internally **layered so boundaries are visible**. UI never
touches data directly — it goes through a framework-agnostic service/domain layer.

```
UI (server + client components)
  -> API layer (route handlers + server actions)
    -> domain / services (pure business logic, testable)
      -> data adapters: content repo (MDX/JSON) · KV (Upstash) · GitHub · email (Resend)
```

Why it matters for the sample: the content source could swap from "local MDX" to
a real DB/CMS without touching UI. That decoupling is the senior signal.

### Live data layer

Two deliberately small dynamic features prove the full-stack story:

- **Per-project view counters** — KV write path via a route handler, read on the
  server. Invisible-ish UX; exists mainly for the code reader. No cookies, no PII.
- **GitHub activity strip** (home) — server-fetched, ISR-revalidated (~1h), so
  unauthenticated API limits are a non-issue.

Both **degrade gracefully**: if Redis or GitHub is unreachable, the site renders
without them — no error states leak to visitors.

### Repo structure

```
/app                      # routes
  /(site)/page.tsx        # home
  /projects/page.tsx      # index
  /projects/[slug]/page.tsx
  /projects/[slug]/opengraph-image.tsx   # dynamic OG image (next/og)
  /experience/page.tsx
  /about/page.tsx
  /contact/page.tsx
  /api/contact/route.ts   # POST: Zod + rate limit + Resend
  /api/views/[slug]/route.ts
  sitemap.ts / robots.ts / not-found.tsx
/components
  /ui                     # design-system primitives (shadcn/ui)
  /sections               # composed page sections
/lib
  /domain                 # types + pure business logic
  /content                # typed repo over MDX/JSON, Zod-validated at build
  /kv                     # Upstash client: rate limiter + view counters
  /github                 # activity fetch (ISR)
  /email                  # Resend adapter behind an interface
/content
  /projects/*.mdx
  experience.json
  profile.json
/tests
  /unit                   # vitest
  /e2e                    # playwright (+ axe)
/infra
  /dns                    # Terraform: Route 53 records (Vercel, Resend SPF/DKIM)
/docs
  /adr                    # 3–4 architecture decision records
  ARCHITECTURE.md
  REFRESH_PLAN.md         # this file
.github/workflows/ci.yml  # lint, typecheck, test, build, lighthouse
```

## 4. Content model

- `profile.json` — name, tagline, bio, socials, location.
- `experience.json` — array of roles (company, title, dates, summary, highlights,
  tech). Restructured from the old `api.damienfarrar.com` data — **the API is
  confirmed reachable (checked 2026-07-03)**, so migration is unblocked.
- `content/projects/*.mdx` — one file per case study. Frontmatter (Zod-validated):
  `title, slug, summary, role, dates, stack[], links{}, featured, order, cover`.
  Body = MDX case study: **Problem -> Approach -> Key decisions -> Outcome**.

All schemas defined once in `/lib/content` with Zod; TypeScript types inferred
from them and used through UI -> domain -> data.

## 5. Pages / IA

| Route | Purpose | Notes |
|-------|---------|-------|
| `/` | Hero + positioning + featured projects + activity strip | First impression; strong copy. |
| `/projects` | Case study index | Centerpiece. Depth over gallery. |
| `/projects/[slug]` | Individual case study | MDX; static-generated; per-slug OG image. |
| `/experience` | Career timeline | Data-driven from `experience.json`. |
| `/about` | Bio, photo, values | Old bio is a starting point. |
| `/contact` | Contact form | Backed by validated route handler. |

Global: dark/light mode, responsive nav + footer, custom 404/error pages, motion
where meaningful (respecting `prefers-reduced-motion`), per-page metadata.

## 6. Engineering-quality layer (the senior/lead signal)

- **ADRs** in `/docs/adr` — the handful that matter: rebuild-vs-upgrade, single
  app vs separate service, **hosting: Vercel, not AWS/Azure/both**, MDX vs CMS,
  KV live-data layer. Not a wall of ceremony. The hosting ADR carries the
  judgement signal: knowing how to run it on AWS and choosing not to, with reasons.
- **README as a design doc**: architecture diagram, tradeoffs, run/deploy steps.
- **`ARCHITECTURE.md`**: the layering, data flow, extension points.
- **End-to-end type safety**: Zod as source of truth, inferred types everywhere.
- **Contact hardening** (the part reviewers will actually read): server-side Zod
  validation; **Upstash sliding-window rate limit keyed by IP** (in-memory
  limiters no-op on serverless — see principle 3); honeypot field; generic error
  responses; no PII in logs.
- **Testing**: Vitest for domain/content logic; Playwright e2e for nav + contact
  (happy path and spam/limit paths) with **axe** checks. Deterministic: Resend
  mocked, KV faked, GitHub fixtures — CI never sends real email or hits live APIs.
- **CI/CD** (GitHub Actions): typecheck, ESLint, tests, build, Lighthouse
  tolerant budgets (§1); Vercel per-PR preview deploys.
- **SEO & sharing**: Metadata API per page, `sitemap.ts`, `robots.ts`, canonical
  URLs, JSON-LD (`Person`, per-project `CreativeWork`), dynamic OG images via
  `next/og`.
- **Security headers** in `next.config`: CSP, HSTS, `Referrer-Policy`, etc.
- **Performance**: RSC-first with minimal client JS, `next/font`, `next/image`.
- **Conventional commits** + a clean, readable git history.

## 7. Build phases

Estimates are rough, part-time evenings; ~2–3 weeks elapsed overall. Content is
the critical path but never blocks build — placeholders swap out late.

1. **Scaffold + tooling** *(1–2 evenings)* — Next.js + TS + Tailwind + shadcn/ui,
   ESLint/Prettier, CI skeleton, README + ADR stubs. *Deliverable: deployable empty shell.*
2. **Design direction + system** *(3–4 evenings)* — moodboard/direction, type
   scale, color tokens, **one hero mockup — approval checkpoint before
   build-out**; then theming (dark/light), nav, footer, base components.
   *Deliverable: approved direction + styled shell.*
3. **Content model + domain/data layers** *(1–2 evenings)* — Zod schemas, content
   repo, services, unit tests for the domain. *Deliverable: typed content pipeline.*
4. **Pages** *(3–5 evenings)* — home, projects index + case study, experience,
   about, 404/error, metadata + OG. *Deliverable: full site with placeholder content.*
5. **Contact + live data layer** *(2–3 evenings)* — contact route (validation,
   rate limit, honeypot, Resend), view counters, GitHub activity strip, e2e tests.
   *Deliverable: working dynamic features.*
6. **Quality pass + launch** *(2–3 evenings)* — a11y audit (axe + manual
   keyboard/screen-reader), Lighthouse budgets, docs finalized, real content in,
   secrets scan, DNS cutover. *Deliverable: launched site.*

## 8. Content & accounts I need from Damien

- Updated bio (old one is a fine base).
- 3–5 projects to feature, each with: what it was, your role, the problem, key
  technical decisions, and the outcome/impact. (Can start with placeholders.)
  **At least one should be a cloud-native/AWS-heavy case study** — content is
  the vehicle for cloud depth, not the portfolio's hosting.
- Headshot / any brand imagery, if desired.
- **Resend** account + verified sending domain (DNS records) — or defer and stub.
- **Upstash** account (free tier) for the KV layer.
- Optional GitHub token for the activity feed (public data works without one).
- AWS credentials for the Terraform DNS work at cutover (existing Route 53 zone).

## 9. Migration & cutover

- Old Angular app preserved in git history; new work on a branch.
- **Before the repo goes public: scan full git history for secrets** (gitleaks).
  Old code appears to contain only public API URLs, but verify — history is
  forever once pushed.
- Old `api.damienfarrar.com` backend **decommissioned** after cutover — confirm
  nothing else uses it first.
- DNS: already in **Route 53** (confirmed 2026-07-03) — stays there. Point
  `damienfarrar.com` at Vercel at cutover via the in-repo Terraform
  (`/infra/dns`), which also adds Resend SPF/DKIM records; keep old host until verified.
- Redirects: **check for inbound links first** (Search Console / analytics).
  If any exist, 301 `/professional` → `/experience` etc.; skip `/detail/:id`
  mapping unless traffic proves otherwise (§2 #11).

## 10. Risks & open questions

- **Content is the critical path.** Design/code scaffold fast; the case studies
  (the actual differentiator) depend on Damien's input.
- **Email deliverability** needs a verified domain in Resend (DNS work).
- **Spam**: honeypot + rate limit first; Turnstile is the escalation path.
- **GitHub API limits**: mitigated by ISR (~1h) caching; feature hides itself on failure.
- **Scope creep** (blog? analytics? i18n?) — deliberately out of scope for v1.
- Open: confirm the live-data features (§2 #9, #10) — plan proceeds with them as
  defaults; the GitHub feed is the first cut if time-boxed.
- Open: analytics tool (Vercel Analytics vs Plausible vs none) — decide in Phase 6.
- Open: Terraform state backend for `/infra/dns` (S3 vs Terraform Cloud free
  tier; never committed to git) — decide in Phase 1.

## 11. Explicitly out of scope for v1

Blog/CMS, authentication, i18n, a separate backend service, a **relational
database/ORM** — Upstash KV is deliberately the only persistence. Each of these
is a possible future ADR if the site grows.

## 12. Revision history

- **v1** (2026-07-01) — initial draft.
- **v2** (2026-07-02) — post-review revision: added design principles (dual
  audience, engineering restraint); made the full-stack signal concrete (KV live
  data layer, serverless-correct rate limiting, bot protection); added design
  direction checkpoint; added SEO/OG/structured-data plan, security headers,
  deterministic test strategy; made Lighthouse gates tolerant and separated WCAG
  verification from Lighthouse scores; added secrets-history audit; resolved the
  slug question; added effort estimates.
- **v3** (2026-07-03) — hosting question resolved: **Vercel over AWS/Azure/both**,
  recorded as an ADR; DNS-as-code added (Terraform, Route 53, `/infra/dns`);
  old API confirmed reachable (data migration unblocked); cloud-depth signal
  moved into case-study content.
