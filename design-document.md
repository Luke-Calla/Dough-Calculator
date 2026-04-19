# Pizza Dough Calculator

Documentation entrypoint for this repository.

## Purpose

This file is intentionally short. It helps humans and LLMs find the current source of truth without loading archived planning material by default.

## When To Read This File

Read this file first when you need to understand the documentation layout or choose which document to load next. Do not use it as a substitute for the current spec, formulas reference, or roadmap.

## Read Order

1. `docs/spec/current-product-spec.md`
2. `CLAUDE.md`
3. `docs/spec/formulas-and-data.md` if the task touches calculations
4. `docs/roadmap/backlog.md` if the task is about unshipped work
5. `docs/changelog.md` if historical context is needed

## Document Map

- `docs/spec/current-product-spec.md`
  Current product behavior, constraints, shipped UI, active limitations
- `docs/spec/formulas-and-data.md`
  Canonical formulas, lookup-table references, calibrated-model notes
- `docs/testing/manual-test-checklist.md`
  Repeatable manual smoke tests for browser verification
- `docs/code-map.md`
  Quick map of major responsibilities inside `script.js`
- `docs/architecture/decisions.md`
  Durable architectural decisions and reasoning
- `docs/roadmap/backlog.md`
  Unshipped work only
- `docs/changelog.md`
  Shipped changes and notable fixes
- `docs/archive/`
  Historical implementation plans and design notes; not current source of truth

## Code Source Of Truth

- `index.html`: structure and UI content
- `style.css`: styling and responsive behavior
- `script.js`: state, constants, calculations, rendering, interactions
- `CLAUDE.md`: working rules for AI/code changes

## Core Invariants

- Zero dependencies
- No build step
- Static hosting only
- `state` is the single source of truth
- Calculation logic must not read from the DOM
- Calibrated constants should be preserved unless intentionally updated

## Why The Docs Are Split

Current behavior, math references, roadmap items, and historical implementation notes are separated so retrieval stays precise and token-efficient. Load only the document type needed for the task.
