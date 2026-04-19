# CLAUDE.md

Working guidance for AI assistants in this repository.

## When To Read This File

Read this file for project guardrails, editing rules, verification expectations, and change-management rules. Do not use it as the canonical source for shipped product behavior or formulas.

## Project Summary

- Static pizza dough calculator for the web
- Zero-dependency frontend: no framework, no package manager, no build step
- Primary code files: `index.html`, `style.css`, `script.js`
- Secondary page: `how-it-works.html`

## First Files To Read

Load these in this order unless the task is narrowly scoped:

1. `docs/spec/current-product-spec.md`
2. `CLAUDE.md`
3. `docs/spec/formulas-and-data.md` only if calculations or schedule logic change
4. `docs/roadmap/backlog.md` only if the task is about future work
5. `docs/changelog.md` only if historical context matters

## Non-Negotiable Constraints

- Keep the project zero-dependency
- Do not introduce npm, frameworks, bundlers, TypeScript, a backend, or external services without explicit user approval
- Preserve the simple static-hosting model
- Prefer small, direct changes over abstractions added "just in case"

If a request would add meaningful technical or maintenance complexity, stop and ask before proceeding.

## Development Model

- No build step
- Open `index.html` directly, or run a simple local static server
- There is no `package.json`, test runner, transpiler, or bundler
- Manual browser verification is the default validation path

## Source Of Truth Rules

- `state` in `script.js` is the single source of truth
- Inputs update `state`
- Calculations read from `state`, not from the DOM
- Rendering writes results back to the DOM

Never make the DOM authoritative for recipe math, fermentation math, or schedule logic.

## Architecture Snapshot

- `index.html`: structure, form controls, output card, SVG sprite
- `style.css`: layout, tokens, responsive rules, visual system
- `script.js`: state, constants, calculations, formatting, event wiring
- `how-it-works.html`: static explanatory page with matching navigation/theme behavior

## Calculation And Domain Rules

- Baker's percentages are the core recipe model
- Ingredient percentages are expressed relative to flour weight
- `state.leavener` must remain one of `'idy'`, `'fresh'`, or `'sourdough'`
- In sourdough mode, starter flour and water must be backed out of bowl-added flour and water so target ratios stay correct
- Lookup tables and calibrated thresholds in `script.js` are copied from the spreadsheet model; do not casually re-derive or "simplify" them

## Schedule Rules

- `calcSchedule()` counts backward from the target bake time
- Cold-ferment warm-up time is model-derived and snapped to a 15-minute grid unless manually overridden
- Sourdough `Feed Starter` time is rounded to the nearest 30 minutes for display
- Day labels are relative to bake day

## High-Risk Behaviors To Preserve

- Preset/custom badge behavior for style-driven fields
- Starter percentage suggestion vs override behavior in sourdough mode
- Unit toggle converts only at the display boundary; internal state remains metric
- Style changes clear only the intended chemistry-related overrides while preserving the intended user-entered fields
- Blur rounding and clamping happen on blur, not mid-typing

## Code Invariants

- `state.leavener` must stay one of `'idy'`, `'fresh'`, or `'sourdough'`
- Internal weight state must remain grams
- Internal temperature state must remain Celsius
- `calcIngredients()` and `calcSchedule()` must stay calculation-first paths and must not depend on DOM reads
- Sourdough mode must back starter flour and water out of bowl-added flour and water
- Auto warm-up values must stay on the 15-minute grid unless intentionally redesigned
- Shared nav/theme changes should keep `index.html` and `how-it-works.html` aligned where intended

## UI And Styling Guardrails

- Preserve the existing visual language: cream background, charcoal output card, terracotta accents, Playfair Display + Inter
- Reuse existing CSS custom properties before adding new one-off values
- Maintain mobile usability and desktop two-column behavior
- Keep nav behavior and page parity aligned between `index.html` and `how-it-works.html`

## When To Update Docs

Update docs when behavior changes:

- `docs/spec/current-product-spec.md` for current product behavior
- `docs/spec/formulas-and-data.md` for math, constants, or model notes
- `docs/changelog.md` for shipped user-visible changes
- `docs/roadmap/backlog.md` when planned work changes materially
- `docs/testing/manual-test-checklist.md` when the validation surface changes
- `docs/architecture/decisions.md` when a durable architectural decision is made or revised
- `docs/code-map.md` when core function ownership changes

## Change Checklist

Before closing out a non-trivial change, check:

- If behavior changed, update `docs/spec/current-product-spec.md`
- If formulas, thresholds, or calibrated constants changed, update `docs/spec/formulas-and-data.md`
- If a user-visible feature shipped, update `docs/changelog.md`
- If future scope changed, update `docs/roadmap/backlog.md`
- If shared nav or theme behavior changed, verify both pages
- If inputs, outputs, or interaction rules changed, review `docs/testing/manual-test-checklist.md`

## Manual Verification Checklist

After meaningful UI or logic changes, verify at least:

- IDY, fresh yeast, and sourdough modes
- Preset/custom override behavior
- Unit toggle behavior
- Bake schedule output
- Warm-up auto vs override behavior
- Mobile layout and focused-input usability
- `how-it-works.html` navigation/theme parity if shared UI changed
