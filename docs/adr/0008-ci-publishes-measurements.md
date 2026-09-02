# ADR-0008: CI publishes measurements to KV; the panel only reads

- **Status:** Accepted
- **Date:** 2026-09-02

## Context

The home-page panel claims to be the site reporting on itself, but two of its
tiles were assertions rather than reports. The Lighthouse tile stated the
targets configured in `lighthouserc.json` (95+/100/100) — true, and checkable
in the repo, but not a measurement of the deployed build. The CI tile showed
the last run's conclusion with no indication of when that run happened.

Both weaknesses have the same root: the panel could only report things
reachable from a request — GitHub's API and KV counters. Everything CI knows
(real Lighthouse scores, bundle size, dependency drift) died with the job.

The problem sharpens now the site is essentially finished. Event metrics
("last commit", "commits this week") decay towards zero and imply
abandonment, and the only honest way to move them is to do work. State
metrics — what the system _is_ — stay meaningful during quiet periods, but
nothing was carrying them out of CI.

## Decision

CI writes measurements to the existing Upstash instance (ADR-0005) under a
`metrics:*` namespace; the app reads them and never writes them.

- `scripts/publish-metrics.mjs` runs as a step in the `lighthouse` job, reads
  LHCI's representative (median) run from `.lighthouseci/manifest.json`, and
  sets `metrics:lighthouse`.
- The workflow gained a weekly `schedule`, so every gate re-runs and every
  published measurement refreshes without a commit.
- `lib/kv/metrics.ts` validates what comes back with Zod and returns `null`
  on anything missing or malformed. No measurement, no tile.
- Measurements publish even when a budget assertion failed (`!cancelled()`).
  A red number is precisely when the panel should show the real one.
- The publish step is skipped on pull requests, where fork runs have no
  secrets.

Rejected: committing a generated `metrics.json` back to the repo. It works and
needs no secrets, but it puts bot commits in a log whose value is that it is
entirely deliberate. Also rejected: reading LHCI's `temporary-public-storage`
uploads at request time — a third-party URL with no stability guarantee on the
site's critical path.

## Consequences

- The Lighthouse tile now reports measured scores with the SHA and age of the
  measuring run. It hides until CI has published once — including in local
  dev and in e2e, consistent with how every other live tile behaves.
- The CI tile carries its run age and drops the green past 14 days (two missed
  weekly runs), so a stalled schedule shows up as staleness instead of a
  stale "Passing".
- The panel's freshness is now decoupled from commit rate. A quiet month reads
  as a stable system rather than an abandoned one, which removes the temptation
  to manufacture activity to keep it looking alive.
- The write path is one script and one KV key. Bundle size and dependency
  drift are the obvious next tiles and need no new mechanism — a step that
  computes a number and a key to put it in.
- KV is now load-bearing for a visible tile rather than only for counters and
  rate limiting. It still degrades to nothing, so the failure mode is a
  shorter panel.
