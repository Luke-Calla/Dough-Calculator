# Architecture Decisions

Durable project decisions that should stay true unless intentionally changed.

## When To Read This File

Read this file when proposing refactors, changing data flow, introducing new tooling, or making a decision with long-term maintenance impact. Use it to understand why the project is structured the way it is.

## Decision 1: Zero-Dependency Frontend

- Status: active
- Decision: keep the project as a zero-dependency static frontend
- Why: low maintenance, easy hosting, easy learning, minimal toolchain overhead
- Implication: adding npm, frameworks, bundlers, a backend, or external services requires explicit approval

## Decision 2: `state` Is The Single Source Of Truth

- Status: active
- Decision: all calculations read from `state`, not from the DOM
- Why: predictable data flow, easier reasoning, fewer sync bugs
- Implication: inputs update `state`; rendering writes UI from derived values

## Decision 3: Internal Units Stay Metric

- Status: active
- Decision: internal state stores grams and Celsius even when imperial mode is displayed
- Why: avoids conversion drift and branching complexity in calculation code
- Implication: conversion happens only at the input/output boundary

## Decision 4: Spreadsheet Model Overrides Theoretical Simplification

- Status: active
- Decision: calibrated lookup tables and formulas copied from the spreadsheet are authoritative unless intentionally revised
- Why: the calculator aims to preserve the spreadsheet's practical behavior
- Implication: do not "clean up" constants or derive replacement math without explicit intent and documentation

## Decision 5: Simplicity Over Premature Abstraction

- Status: active
- Decision: prefer small direct code over generalized abstractions that do not yet pay for themselves
- Why: this codebase is meant to stay approachable and maintainable without framework machinery
- Implication: avoid adding indirection, helper layers, or new architecture without a concrete benefit

## Decision 6: Docs Are Split By Job

- Status: active
- Decision: current behavior, formulas, roadmap, changelog, testing, and architecture notes live in separate docs
- Why: improves retrieval quality for humans and LLMs, reduces stale-context risk
- Implication: update the right doc instead of expanding a single monolithic design file

## Decision 7: Shared UI Changes Require Two-Page Awareness

- Status: active
- Decision: changes to shared nav/theme patterns should consider both `index.html` and `how-it-works.html`
- Why: the project now has two user-facing pages with intended parity in shared chrome
- Implication: verify both pages after shared UI changes

## Working Invariants

- `state.leavener` is limited to `idy`, `fresh`, and `sourdough`
- Internal state remains metric even when imperial display is active
- Calculation paths must not depend on DOM reads
- Sourdough ingredient output must represent bowl-added flour/water after backing out starter contribution
- Preset/custom override flows should remain reversible and predictable
- Warm-up auto values should stay grid-snapped unless intentionally redesigned
