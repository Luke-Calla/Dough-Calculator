# Current Product Spec

**Status:** Current source of truth for product behavior
**Scope:** What the shipped calculator does today, plus active constraints and known limitations

## AI Brief

- Project type: static, zero-dependency pizza dough calculator
- Main files: `index.html`, `style.css`, `script.js`
- Architecture rule: update `state`, then recalculate and re-render; do not read from DOM for calculations
- Current leavener modes: `idy`, `fresh`, `sourdough`
- Current major shipped features: presets, live recalculation, bake schedule, sourdough mode, dark mode, contextual tooltips, dynamic overproof advisory, dynamic warm-up timing
- Current known model limitations: warm-up timing and starter hydration timing are approximate models, not measured lab values
- Use `docs/spec/formulas-and-data.md` only for math, constants, and spreadsheet references
- Use `docs/roadmap/backlog.md` only for unshipped work

## Product Overview

Convert the Excel calculator into a public web tool with a better user experience while keeping the codebase simple enough to learn from and maintain without frameworks or a backend.

## Tech Constraints

- Three-file architecture: `index.html`, `style.css`, `script.js`
- No frameworks, no package manager, no build tools
- Static hosting only
- Custom domain optional

## Core Invariants

- `state` is the single source of truth
- Calculations must not read values back from the DOM
- Lookup tables are calibrated constants copied from the spreadsheet model
- Preset-driven values can be overridden, then reverted cleanly

## Current Feature Set

- Yeast and sourdough support
- Responsive layout: stacked on mobile, two columns on desktop
- Live calculation with 300ms debounce
- Preset and custom override handling for style-driven recipe fields
- Bake schedule with relative day labels
- Dynamic warm-up timing with optional manual override
- Leavener toggle with mode-specific output changes
- Dark mode with system default and persisted user override
- Print-friendly recipe card
- URL-ready architecture, but share links are not yet shipped
- Dynamic overproof advisory based on leavener percentage and room temperature
- Contextual tooltips for selected fermentation fields

## Current Inputs

### Pizza Settings

| Field | Type | Default | Notes |
|---|---|---|---|
| Pizza Style | Dropdown | Neapolitan | Drives preset recipe fields |
| Pizzas | Number | 4 | Always direct input |
| Ball Weight (g) | Number | From style | Preset-capable |

### Dough Ratios

| Field | Type | Default | Notes |
|---|---|---|---|
| Hydration (%) | Number | From style | Preset-capable |
| Salt (%) | Number | From style | Preset-capable |
| Oil (%) | Number | From style | Preset-capable |
| Sugar (%) | Number | From style | Preset-capable |
| Leavener | Toggle | IDY | `idy`, `fresh`, `sourdough` |

### Fermentation

| Field | Type | Default | Notes |
|---|---|---|---|
| Room Time (hrs) | Slider + number | 4 | Range 3-36 |
| Fridge Time (hrs) | Slider + number | 14 | Range 0-80 |
| Room Temp (C) | Number | 22 | Range 14-35 |
| Fridge Temp (C) | Number | 4 | Range 4-8 |
| Target Bake Time | Hour stepper + AM/PM | 7 PM | Display/schedule anchor |

### Sourdough Starter

Shown only in sourdough mode.

| Field | Type | Default | Notes |
|---|---|---|---|
| Starter % | Number | Auto-suggested | Range 5-25; user override allowed |
| Starter Hydration % | Number | 100 | Range 50-125; slightly adjusts peak timing only |
| Feed Ratio | Selector | 1:2:2 | Options: `1:1:1`, `1:2:2`, `1:3:3`, `1:4:4`, `1:5:5` |

## Preset Values by Style

| Style | Ball Weight (g) | Hydration | Salt | Oil | Sugar |
|---|---|---|---|---|---|
| Neapolitan | 230 | 65% | 2.5% | 0% | 0% |
| New York | 240 | 62% | 2% | 3% | 1% |
| Canotto | 250 | 75% | 3% | 0% | 0% |
| Tonda Romana | 175 | 60% | 2.5% | 6% | 0% |

## Output Rules

### Recipe output

- Always show final dough mass, flour, water, salt, oil, sugar
- Yeast modes show `YEAST (IDY)` or `YEAST (FRESH)`
- Sourdough mode replaces the yeast row with `Starter`
- In sourdough mode, flour and water are the quantities added to the bowl after backing out the starter contribution

### Bake schedule

- Room-only fermentation shows `Mix Dough` and `Bake`
- Cold fermentation shows `Mix Dough`, `Move to Fridge`, `Pull from Fridge`, `Bake`
- Sourdough mode adds `Feed Starter` before mixing
- `Pull from Fridge` warm-up timing is model-derived and auto-snaps to 15-minute intervals unless manually overridden
- `Feed Starter` time is rounded to the nearest 30 minutes for display
- Day labels are relative to bake day: `Bake day`, `Day before`, or `X days before`

## Interaction Rules

### Preset and custom overrides

- Style-driven fields default to preset values
- User edits create a custom override
- Reverting to the exact preset value removes the override
- If a preset-capable input is cleared and blurred, it restores its effective value

### Live updates

- Recalculate on input changes with 300ms debounce
- Inputs clamp to valid min and max ranges on blur
- Number inputs select all on focus

### Tooltips

- One tooltip open at a time
- Desktop uses hover support
- Mobile uses tap support
- Escape and blur close active tooltip

## Layout

- Mobile-first CSS
- Breakpoint at 768px
- Desktop: inputs left, output card right
- Mobile: single column with output below inputs

## Branding

- Functional name: Pizza Dough Calculator
- Nav placeholder brand: Dough Formula
- Typography: Playfair Display + Inter
- Palette: cream background, dark charcoal output card, terracotta accents

## Known Limitations

- Warm-up timing for `Pull from Fridge` is model-derived rather than experimentally validated
- Starter hydration slightly adjusts sourdough peak timing, but the correction is approximate
- URL sharing is designed but not shipped
- No metric/imperial toggle
- No account, storage, or backend features

## References

- Calculation details: `docs/spec/formulas-and-data.md`
- Planned work: `docs/roadmap/backlog.md`
- Historical changes: `docs/changelog.md`
- Working rules for code changes: `CLAUDE.md`
