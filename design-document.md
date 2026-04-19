# Pizza Dough Calculator
## Documentation Index

**Project:** Pizza Dough Calculator Web Tool
**Status:** Published, active development
**Last Updated:** April 19, 2026 (how-it-works page shipped)

This file is now a lightweight entrypoint instead of the full design archive. The goal is to keep the default AI context small and current.

## Start Here

For most implementation work, load these files in this order:

1. `docs/spec/current-product-spec.md`
2. `CLAUDE.md`
3. `docs/spec/formulas-and-data.md` only if the task touches calculations
4. `docs/roadmap/backlog.md` only if the task is about planned work
5. `docs/changelog.md` only if historical context matters

## Document Map

### Current spec
- `docs/spec/current-product-spec.md`
- Canonical product behavior, current UI, active constraints, AI brief

### Formulas and reference data
- `docs/spec/formulas-and-data.md`
- Canonical equations, lookup table names, spreadsheet source sheets, current model limitations

### Roadmap
- `docs/roadmap/backlog.md`
- Unshipped work only

### Change history
- `docs/changelog.md`
- Compressed history of shipped changes and notable fixes

## Source of Truth

- UI structure: `index.html`
- Styling: `style.css`
- Application logic and constants: `script.js`
- Working rules for AI/code changes: `CLAUDE.md`

## Core invariants

- Zero dependencies: no framework, no build step, no backend
- `state` in `script.js` is the single source of truth
- The DOM is display-only for calculations
- Lookup tables are calibrated constants and should be referenced, not re-derived

## Why this split exists

The previous monolithic design document mixed current behavior, shipped history, and future planning in one file. That made AI retrieval noisy, increased token usage, and raised the risk of stale instructions being pulled into implementation work. The new structure keeps current truth separate from archive and roadmap content.
