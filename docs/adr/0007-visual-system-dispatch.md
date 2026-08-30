# ADR-0007: The visual system — an ops console, reworked to "Dispatch"

- **Status:** Accepted
- **Date:** 2026-08-30

## Context

Phase 2 chose a direction — "the ops console" — from seven mockup candidates:
dark-first, instrument-panel restraint, square corners, one warm accent, a
registration/crop mark for the logo. That concept still holds.

The execution didn't. A pass over the built site before launch found it fluent
in a generic register rather than a chosen one: a blue-tinted near-black ground
(the default serious-dark-UI colour), Barlow for body (a top-ten Google font
with little character), Martian Mono for labels (the developer-tool mono of the
moment), and `#3ddc84` for status — which is Android's brand green. None of it
was wrong; all of it was defaulting. A reader would place it as "a developer's
site" without the design saying anything specific.

## Decision

Keep the concept, rework the palette and type. Internal name: "Dispatch".

- **Ground:** a true-neutral graphite, no blue cast (`#141414` dark, `#f1f1f0`
  light). The blue tint was the single most recognisable borrowed choice.
- **Type:** the IBM Plex superfamily — Plex Sans for headings _and_ body, Plex
  Mono for labels and telemetry. A slab serif (Zilla Slab) was tried for
  headings to add a second register; it was reverted because legibility at real
  reading sizes mattered more than the contrast. Headings are sentence case,
  not uppercase display type.
- **Accent:** amber kept (`#ffb454` / `#a35b00`). It was the one deliberate
  choice in the original palette — it sidesteps the reflex blue/violet/green
  and it isn't a terminal-green cliché. Status green moved off the Android
  value to a plain pine.
- **Unchanged:** `--radius: 0`, flat fills, no gradients, no decorative
  shadows, and the registration-mark logo. That stance is the identity; the
  palette stays quiet behind it.

## Consequences

- One type family: fewer tokens to keep consistent, and headings/body/labels
  read as one system. The tradeoff is no textural contrast in the type —
  accepted, because the slab that would have provided it cost readability.
- The generated OG images vendor Plex as `woff` (`lib/og/`), because satori
  can't read the `woff2` that `next/font` ships.
- ADRs 0001–0006 are about architecture; this is the first about how the site
  looks — including why the first version of it wasn't kept.
