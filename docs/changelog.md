# Changelog

Compressed history of shipped user-visible changes and notable fixes.

## When To Read This File

Read this file when historical context matters, such as tracing when behavior changed or understanding why an older implementation exists. Do not use it as the current source of truth for behavior.

## 2026-04-20 (session 2)

- Replaced the leavener % hint popup ("Suggested for your schedule: X%") with an **Auto / Custom ×** badge in the field label row, matching the warm-up badge pattern
- Tooltip icon on the leavener % field moved to the right side of the label row, grouped just left of the badge, using a `.field-label-right` flex wrapper
- Tooltip icon now stays dark while its popover is open via `[aria-expanded="true"]` CSS selector
- Fixed tooltip on mobile: hover and blur listeners are now desktop-only; touch devices use click-to-toggle only, preventing the icon from flashing grey immediately after a tap
- Replaced the fixed 300ms mobile keyboard scroll delay with a `visualViewport` resize listener so the focused field scrolls into view only after the keyboard has fully appeared; 500ms timeout retained as a fallback for browsers without the API
- Fixed tooltip icon bottom being clipped when selected by setting `overflow: visible; display: block` on `.tooltip-btn svg`

## 2026-04-20

- Fixed nav bar wrapping on mobile by reducing padding, brand font size, hiding the divider, and shrinking unit toggle buttons at `max-width: 639px`
- Made the nav bar sticky so it pins to the top of the page on scroll
- Fixed warm-up time stepper rendering too short on mobile by wrapping it in a `bake-time-row` flex container, matching the structure of the bake time field
- Raised the field-grid single-column collapse breakpoint from `480px` to `640px`, fixing cramped two-column layouts on mid-size phones
- Replaced the pizza cutter icon on `how-it-works.html` nav link with a proper calculator icon
- Leavener % override is now cleared when switching between leavener types — prevents stale IDY/fresh/sourdough overrides carrying across
- Fixed `is-preset` class not being applied when switching into sourdough mode with a cleared override
- Fresh yeast % is now displayed at the correct baker's percentage (`yeastPct × 3`); IDY-equivalent is still stored internally and used for all calculations

## 2026-04-19 (session 3)

- Shipped `how-it-works.html`, a standalone knowledge page covering baker's percentages, yeast vs sourdough, time/temperature, and the fermentation model
- Redesigned the "How to Use the Calculator" section from a centered single-column list into a full-width 2x2 tile grid
- Added a `How It Works` nav link to `index.html`; `how-it-works.html` includes a matching `Calculator` link

## 2026-04-19 (session 2)

- Refactored nav into `nav-left` and `nav-right` groups with a shared ghost-button baseline
- Replaced the single-button metric/imperial toggle with a segmented `Metric | Imperial` control
- Restyled the page link and added a brand divider in the nav
- Aligned `how-it-works.html` nav to match the main page
- Fixed metric temperature display rounding after repeated unit-toggle round trips
- Fixed mid-decimal input snapping so preset fields do not revert while the user is still typing
- Added per-field blur rounding rules
- Cleared only the intended style-chemistry overrides on style switch
- Reworded advisory copy to remove punctuation artifacts

## 2026-04-19

- Replaced the old warm-up lookup-table model with a Newton's-law-of-cooling formula
- Fixed warm-up direction so a warmer fridge produces less warm-up time
- Removed warm-up table constants and interpolation helpers no longer needed
- Added mobile keyboard-aware input scrolling on touch-only devices

## 2026-04-09

- Shipped the imperial/metric toggle while keeping all internal state in grams and Celsius
- Converted output weights to oz and temperatures to F when imperial mode is active
- Updated ball-weight and temperature input bounds dynamically on unit toggle
- Converted feed-starter schedule quantities in imperial mode
- Re-rendered all affected inputs and labels on unit changes
- Fixed squished tooltip popovers by wrapping the tooltip button and popover in a dedicated anchor element

## 2026-04-01 (session 2)

- Shipped dynamic warm-up time using the earlier lookup-table model
- Added warm-up override controls with 15-minute stepping
- Added preset/custom warm-up badge behavior
- Hid the warm-up field when fridge time is zero
- Added `Pull from Fridge` schedule guidance text
- Recalibrated the earlier warm-up table against a corrected thermal model

## 2026-04-01

- Updated default fermentation settings to 4h room, 14h fridge, 22 C room temp, and 4 C fridge temp
- Shipped sourdough fridge-temperature correction
- Shipped dynamic overproof advisory
- Tightened starter-percentage clamp to 5-25%
- Added starter-hydration timing correction and updated the input range to 50-125%
- Added `1:4:4` as a feed-ratio option
- Aligned auto warm-up values to the 15-minute grid used by manual warm-up overrides
- Improved dark-mode badge contrast
- Fixed the dark-mode pizza-style dropdown chevron
- Removed native number-input spinners from manual number fields

## 2026-03

- Added sourdough support with starter inputs and schedule step
- Added dark mode with system default and persisted override
- Added contextual tooltips for selected fermentation fields
- Fixed leavener toggle wiring across all three modes
- Moved fermentation values into `state.inputs` to remove DOM-read technical debt
- Promoted shared schedule helpers out of `calcSchedule()`
- Consolidated timeline SVGs into the `index.html` sprite system

## Early Web Build

- Split the original single-file prototype into `index.html`, `style.css`, and `script.js`
- Implemented a responsive two-column layout and print styles
- Added preset/custom override behavior for style-driven fields
- Added the custom bake-time stepper and relative day labels
- Verified core yeast calculations against the spreadsheet

## Current Open Limitation

- Warm-up and starter-hydration timing adjustments remain approximate models rather than experimentally validated measurements
