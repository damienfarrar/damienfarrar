# ADR-0001: Rebuild from scratch rather than upgrade Angular

- **Status:** Accepted
- **Date:** 2026-07-03

## Context

The previous site was Angular 7 (2018): EOL framework, `@angular/http` (removed
in Angular 8), TSLint/Protractor (both discontinued), Angular Material 7 with a
stock theme. An in-place migration would cross six major versions with a
breaking HTTP-client rewrite at the first step, and still land on an
architecture designed around a separate CRUD API that no longer earns its keep.

## Decision

Rebuild from scratch on Next.js (App Router) + TypeScript. Preserve the old app
in git history rather than carrying any of it forward.

## Consequences

- No migration debt; the codebase demonstrates current (2026) idioms — the
  point of the repo as a work sample.
- Old content (bio, experience data, project imagery) is migrated as _data_,
  not code.
- Angular knowledge is no longer demonstrated by this repo; that signal is
  carried by CV/experience content instead.
