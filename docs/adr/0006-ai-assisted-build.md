# ADR-0006: Build with an AI pair — and say so

- **Status:** Accepted
- **Date:** 2026-07-20

## Context

This site was built in 2026. Most working engineers now build with AI
assistance; a portfolio repo that pretended otherwise would be performing a
workflow I don't actually use. The commit history makes the collaboration
visible anyway (`Co-Authored-By: Claude`), so the real choice was between
owning it and half-hiding it — and half-hiding it is the worst of both.

The concern this ADR answers: does heavy AI assistance undermine a repo whose
purpose is to demonstrate engineering judgement?

## Decision

Disclose it, and treat directing an AI as part of the demonstrated skill set.

The division of labour, concretely:

- **Human:** the refresh plan and its principles; every locked decision in it
  (rebuild-over-upgrade, single app, Vercel, MDX, KV — ADRs 0001–0005); the
  design direction, chosen across seven mockup candidates and two refinement
  rounds; the career facts and (in progress) the case-study content; review
  and course-correction throughout — including catching a stale hardcoded
  claim and an entity-rendering bug.
- **AI (Claude):** implementation of the agreed plan — scaffolding, layout and
  components, the content pipeline, adapters, route handlers, tests, CI
  wiring, Terraform — plus design exploration to my brief and this
  documentation, edited by me.

What keeps the output trustworthy is not who typed it; it's the machinery that
would catch either of us being wrong: Zod validation at every boundary, unit
and e2e tests (including axe), Lighthouse budgets asserted in CI, typed
end-to-end, and a full-history secrets scan before the repo went public. AI
assistance changed the velocity, not the bar.

## Consequences

- Anyone reading this repo knows how it was made; there is no gotcha.
- The uniform polish of the history is explained rather than suspicious.
- The claim I'm accountable for in interviews is not "I typed this" but
  "I can defend every decision in it" — which was always the claim that
  mattered.
- The parts of a portfolio no tool can generate — what I shipped over twenty
  years, what it cost, what I'd do differently — carry the differentiating
  weight, as the plan intended from the start.
