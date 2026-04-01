# Changelog

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
