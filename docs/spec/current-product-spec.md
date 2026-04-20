# Current Product Spec

Current source of truth for shipped product behavior.

## When To Read This File

Read this file when the task depends on current UI behavior, field behavior, output rules, constraints, or known limitations. Do not use it for detailed formulas, historical changes, or unshipped ideas.

## AI Brief

- Static zero-dependency pizza dough calculator
- Main files: `index.html`, `style.css`, `script.js`
- Secondary page: `how-it-works.html`
- Architecture rule: update `state`, then recalculate and re-render
- Do not read from the DOM for calculations
- Current leavener modes: `idy`, `fresh`, `sourdough`
- Use `docs/spec/formulas-and-data.md` only for math, constants, and model notes
- Use `docs/roadmap/backlog.md` only for unshipped work

## Product Goal

Provide a public pizza dough calculator that preserves the spreadsheet model while improving usability, readability, and learnability without introducing framework or backend complexity.

## Technical Constraints

- Three-file app architecture: `index.html`, `style.css`, `script.js`
- Static hosting only
- No frameworks
- No package manager
- No build tools
- No backend or persistence layer

## Core Invariants

- `state` is the single source of truth
- Calculations must not read from the DOM
- Internal units stay metric even when imperial display is active
- Lookup tables and calibrated thresholds are authoritative constants
- Preset-backed values can be overridden and cleanly reverted

## Shipped Feature Set

- Pizza style presets for ball weight, hydration, salt, oil, and sugar
- Live recalculation with 300ms debounce
- IDY, fresh yeast, and sourdough modes
- Sourdough starter percentage suggestion with user override
- Responsive layout: stacked on mobile, two columns on desktop
- Bake schedule with relative day labels
- Dynamic warm-up timing with optional manual override
- Dynamic overproof advisory
- Contextual tooltips for selected fermentation/sourdough fields
- Dark mode with system default and persisted user override
- Imperial/metric display toggle
- Print-friendly output card
- Standalone `how-it-works.html` knowledge page

## Inputs

### Pizza Settings

| Field | Type | Default | Notes |
|---|---|---|---|
| Pizza Style | Dropdown | Neapolitan | Drives preset recipe fields |
| Pizzas | Number | 4 | Direct input only |
| Ball Weight | Number | From style | Preset-capable; displayed in g or oz |

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
| Room Temp | Number | 22 C | Range 14-35 C, displayed in C or F |
| Fridge Temp | Number | 4 C | Range 4-8 C, displayed in C or F |
| Target Bake Time | Hour stepper + AM/PM | 7 PM | Schedule anchor |
| Warm-up Time | Auto + override | Auto | Visible only when fridge time > 0 |

### Sourdough Starter

Shown only in sourdough mode.

| Field | Type | Default | Notes |
|---|---|---|---|
| Starter % | Number | Auto-suggested | Range 5-25; shows **Auto** badge when using suggested value, **Custom ×** badge when overridden; ×badge click resets to suggestion |
| Starter Hydration % | Number | 100 | Range 50-125; affects peak timing only |
| Feed Ratio | Selector | 1:2:2 | Options: `1:1:1`, `1:2:2`, `1:3:3`, `1:4:4`, `1:5:5` |

## Style Presets

| Style | Ball Weight (g) | Hydration | Salt | Oil | Sugar |
|---|---|---|---|---|---|
| Neapolitan | 230 | 65% | 2.5% | 0% | 0% |
| New York | 240 | 62% | 2% | 3% | 1% |
| Canotto | 250 | 75% | 3% | 0% | 0% |
| Tonda Romana | 175 | 60% | 2.5% | 6% | 0% |

## Output Rules

### Recipe Output

- Always show total dough, flour, water, salt, oil, and sugar
- Yeast modes show `Yeast (IDY)` or `Yeast (Fresh)`
- Sourdough mode replaces the yeast row with `Starter`
- In sourdough mode, flour and water show bowl-added amounts after backing out starter contribution
- Starter detail output shows flour-in-starter and water-in-starter breakdown

### Schedule Output

- Room-only fermentation: `Mix Dough`, `Bake`
- Cold fermentation: `Mix Dough`, `Move to Fridge`, `Pull from Fridge`, `Bake`
- Sourdough adds `Feed Starter` before mixing
- `Feed Starter` time is rounded to the nearest 30 minutes for display
- Relative day labels use `Bake day`, `Day before`, or `X days before`

### Warm-Up Model

- Warm-up time is based on Newton's law of cooling
- Inputs are ball weight, fridge temperature, and room temperature
- Assumptions: covered dough, heat transfer coefficient `h = 5 W/m^2K`, target dough temperature `10 C`
- Auto-calculated warm-up is snapped to a 15-minute grid
- User can override warm-up manually

### Unit Toggle

- Segmented `Metric | Imperial` control toggles `state.units`
- Internal state always stores grams and Celsius
- Conversion is applied only at input/output boundaries
- Weights display in oz to 2 decimal places in imperial mode
- Temperatures display as rounded integers in both units
- Feed-starter schedule quantities also follow the unit toggle

## Interaction Rules

### Preset And Custom Overrides

- Style-driven fields default to preset values
- User edits create custom overrides
- Reverting to the effective preset removes the override
- Clearing a preset-capable input and blurring restores its effective value
- Style changes clear hydration, salt, oil, sugar, and leavener-related overrides
- Style changes preserve the intended user-owned fields such as pizza count and ball-weight override
- Switching leavener type (IDY / fresh / sourdough) clears the previous leavener's % override — no stale value carries across

### Live Input Behavior

- Recalculate on change with 300ms debounce
- Clamp inputs to valid bounds on blur
- Round on blur, never mid-type
- Focus selects the full numeric input value

Current blur precision:

- 0 d.p.: room temp, fridge temp, ball weight, starter hydration, room time, fridge time
- 1 d.p.: hydration, salt, oil, sugar, starter %
- 3 d.p.: yeast %

Fresh yeast % display: the field shows `yeastPct × 3` when in fresh mode so the value reflects a true fresh-yeast baker's percentage. Internal state (`state.yeast.pctOverride`) always stores the IDY-equivalent; the ×3 conversion is applied only at the display and input boundaries.

### Tooltips

- Only one tooltip open at a time
- Desktop: hover opens, mouseleave/blur closes (with 150ms delay), click toggles
- Mobile (touch-only): click/tap toggles only — hover and blur listeners are not registered on touch devices
- Escape or outside click/tap closes the active tooltip
- The tooltip icon remains dark (`color: var(--text-mid)`) while its popover is open, via `[aria-expanded="true"]` CSS selector
- The leavener % field places the tooltip icon to the right of the label, immediately left of the Auto/Custom badge

### Mobile Keyboard Handling

- On touch-only devices, focusing an input or select triggers a `scrollIntoView` call once the soft keyboard has finished appearing
- Uses `visualViewport` resize event (fires when keyboard settles) with a 50ms settle delay; falls back to a 500ms fixed delay on browsers without the API
- Desktop behavior is unaffected

## Layout And Branding

- Mobile-first CSS
- Breakpoint at 768px
- Desktop layout: inputs left, output right
- Mobile layout: single column, output below inputs
- Brand name in nav: `Dough Formula`
- Functional name: `Pizza Dough Calculator`
- Typography: Playfair Display + Inter
- Palette: cream background, charcoal output card, terracotta accents

## Navigation

- `nav-left`: brand, divider, page link
- `nav-right`: unit toggle, theme toggle
- Shared ghost-button baseline across nav controls
- Nav is `position: sticky; top: 0` — stays pinned on scroll
- On mobile (`max-width: 639px`): padding reduced, brand font shrunk, divider hidden, unit toggle buttons compact, page link collapses to icon only
- `how-it-works.html` mirrors the same nav structure and theme behavior

## Known Limitations

- Warm-up timing is model-derived, not experimentally validated
- Starter hydration only lightly adjusts sourdough peak timing and is approximate
- Overproof thresholds are calibrated estimates, not measured guarantees
- URL sharing is architecturally ready but not shipped
- No account, storage, or backend features
- `how-it-works.html` is a static knowledge page with minimal JS

## References

- Calculation details: `docs/spec/formulas-and-data.md`
- Planned work: `docs/roadmap/backlog.md`
- Historical changes: `docs/changelog.md`
- AI/code working rules: `CLAUDE.md`
