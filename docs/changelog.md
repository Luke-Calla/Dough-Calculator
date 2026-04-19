# Changelog

## 2026-04-19 (session 3)

- Shipped `how-it-works.html`: standalone knowledge page covering baker's percentages, yeast vs sourdough, time/temperature, and the fermentation model
- "How to Use the Calculator" section redesigned from a centred single-column list to a full-width 2×2 tile grid
- Added "How It Works" nav link to `index.html`; `how-it-works.html` carries a matching "Calculator" link

## 2026-04-19 (session 2)

- Refactored nav into `nav-left` / `nav-right` layout with shared ghost-button baseline (44px touch targets, unified opacity/hover/transition)
- Replaced single-button metric/imperial flip with a segmented `Metric | Imperial` two-button control; active state uses `font-weight: 600` + terracotta text-decoration underline scoped to label `<span>`
- Page link (How It Works / Calculator) restyled: uppercase, `font-weight: 500`, `0.72rem`, collapses to icon at <640px
- Added `<span class="nav-brand-divider">` between brand and page link at `opacity: 0.2`
- Unit toggle divider replaced border-left with a `::before` pseudo-element at `height: 12px`, `opacity: 0.3`
- Moon icon `stroke-width` bumped to `2` to match surrounding text weight
- Aligned `how-it-works.html` nav to same structure as main page
- Fixed float precision bug: `toDisplayTemp` now rounds metric °C to integer, preventing multi-decimal artifacts after unit toggle round-trip
- Fixed mid-decimal input snap: `onPresetFieldInput` now returns early when value ends with `.`, preventing preset reversion while user is mid-type (e.g. typing `1.` toward `1.5` on a field whose preset is `1`)
- Added per-field blur rounding: integer for temps/times/ball weight/starter hydration; 1 d.p. for hydration/salt/oil/sugar/starter %; 3 d.p. for yeast %
- Style switch now clears hydration, salt, oil, sugar, and leavener % overrides; ball weight and num balls overrides preserved
- Overproof advisory copy: replaced em dashes with periods

## 2026-04-19

- Replaced warm-up time lookup table (`W_TABLE` + bilinear/trilinear interpolation) with Newton's law of cooling formula: `t = τ × ln[(T_fridge − T_room) / (T_target − T_room)]`; h=5 W/m²K (covered dough), T_target=10°C; fridge and room temps now modelled as independent axes
- Fixed warm-up direction bug: warmer fridge now correctly produces less warm-up time (was previously inverted via ΔT-only table)
- Removed `W_TABLE`, `W_TABLE_WEIGHTS`, `W_TABLE_FRIDGES`, `W_TABLE_ROOMS`, and `trilinearInterpolate` — `calcWarmUpMinutes` is now a closed-form formula
- Added mobile keyboard scroll: on touch-only devices, focusing an input scrolls it into view 300ms after focus (allows keyboard animation to complete); gated on `hover: none` media query so desktop is unaffected

## 2026-04-09

- Shipped imperial/metric toggle: nav button switches `state.units` between `'metric'` and `'imperial'`; all internal state stays in grams/°C, conversion applied only at input/output boundary
- Weights display as oz (2 d.p.) in imperial mode; temperatures display as °F (rounded integer) in imperial mode
- Ball weight and temperature input min/max/step attributes update dynamically on toggle
- Feed Starter schedule quantities convert to oz in imperial mode
- `syncInputDisplayToState()` re-renders all affected input fields and labels when toggling
- Removed "No metric/imperial toggle" from Known Limitations in spec
- Fixed tooltip popovers rendering squished (single-word-wide): wrapped each `.tooltip-btn` + `.tooltip-popover` pair in a `.tooltip-wrap` span; moved `position: relative` from `.field-label-row` to `.tooltip-wrap`; popover now uses `width: 260px` and `right: 0` to anchor to the icon button

## 2026-04-01 (session 2)

- Shipped dynamic warm-up time (feature 15.5): replaced hardcoded 2-hour constant with `W_TABLE` bilinear interpolation across ball weight and ΔT (roomTemp − fridgeTemp)
- Added warm-up override stepper in Fermentation card alongside Target Bake Time; steps in 15-min grid-snapped intervals (first step snaps to nearest 15-min boundary, subsequent steps move cleanly by 15)
- Warm-up display shows `X min` below 60 min, `X hr Y min` above; grey `is-auto` text when showing calculated value, normal text when overridden
- Auto/Custom × badge on warm-up field: "Auto" in preset style when calculated, "Custom ×" in red when overridden — clicking resets to calculated value
- Warm-up field hidden when fridgeTime = 0
- `Pull from Fridge` schedule step shows sub-line "Allow to warm before shaping" (no minute value)
- Recalibrated `W_TABLE` values: corrected lumped-capacitance model error by applying Biot-number correction (Bi ≈ 0.55) for internal temperature gradient; typical values now 1.5–2 hr for 250–350g balls at ΔT 16–18°C, up from the previous ~45–65 min
- Added `bilinearInterpolate()` helper for 2D table lookups; `calcWarmUpMinutes()` wraps it

## 2026-04-01

- Updated the catch-all fermentation defaults to 4h room, 14h fridge, 22C room temp, and 4C fridge temp
- Shipped sourdough fridge temperature correction
- Shipped dynamic overproof advisory based on leavener percentage and room temperature
- Tightened starter percentage clamp to 5-25%
- Added conservative starter hydration correction to sourdough peak timing only; aligned Starter Hydration input range to 50-125% and updated tooltip copy
- Added `1:4:4` as a feed-ratio option with matching peak-time multiplier and feed-prep quantity split
- Aligned auto-calculated warm-up times to the same 15-minute grid used by the warm-up override control
- Improved dark-mode badge contrast with dedicated preset/custom badge colors instead of shared body text tokens
- Fixed the dark-mode pizza-style dropdown chevron so it uses the same geometry as light mode and no longer clips
- Removed native browser number-input spinners from manually typed fields; custom bake-time and warm-up steppers remain

## 2026-03

- Added sourdough support with dedicated starter inputs and schedule step
- Added dark mode with system default and persisted user override
- Added contextual tooltips for selected fermentation fields
- Fixed leavener toggle wiring across all three modes
- Moved fermentation values into `state.inputs` to remove DOM-read technical debt
- Promoted shared schedule helpers out of `calcSchedule()`
- Consolidated timeline SVGs into the `index.html` sprite system

## Early Web Build

- Split the original single-file prototype into `index.html`, `style.css`, and `script.js`
- Implemented responsive two-column layout and print styles
- Added preset/custom override behavior for style-driven fields
- Added custom bake-time stepper and relative day labels
- Verified core yeast calculations against the spreadsheet

## Current Open Limitation

- Warm-up and starter-hydration timing adjustments are approximate models rather than experimentally validated measurements
