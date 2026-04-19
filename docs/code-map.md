# Code Map

Quick map of the main code responsibilities in this repository.

## When To Read This File

Read this file when you need to jump to the right part of the code quickly, especially before editing `script.js`. It is a navigation aid, not a substitute for reading the relevant code.

## File Roles

- `index.html`: form structure, output markup, nav, icon sprite
- `style.css`: design tokens, layout, responsive rules, component styling
- `script.js`: state, constants, calculations, rendering, event listeners, interaction wiring
- `how-it-works.html`: standalone explanatory page with shared nav/theme conventions

## `script.js` Responsibility Map

### State And Constants

Look here for:

- Global `state`
- Preset values
- Lookup tables and calibrated constants
- Thresholds and interpolation inputs

Use this area when changing:

- Presets
- Model constants
- Leavener-specific defaults
- Any rule tied to spreadsheet-derived data

### Utility And Formatting Helpers

Look here for:

- Clamping
- Interpolation helpers
- Unit conversion helpers
- Number and time formatting helpers

Use this area when changing:

- Display formatting
- Unit handling
- Shared calculation utilities

### Core Calculations

Look here for:

- Ingredient math
- Yeast percentage logic
- Sourdough starter suggestion logic
- Warm-up timing logic
- Overproof/advisory logic

Use this area when changing:

- Recipe outputs
- Fermentation model behavior
- Timing assumptions
- Ingredient calculations

### Schedule Generation

Look here for:

- `calcSchedule()`
- Feed-starter timing
- Warm-up insertion
- Relative day labeling

Use this area when changing:

- Timeline steps
- Schedule ordering
- Timing rounding and display rules

### Rendering And Output Sync

Look here for:

- `updateOutputs()`
- DOM writes for ingredient outputs
- DOM writes for schedule output
- Badge/display synchronization

Use this area when changing:

- Output card structure
- Display synchronization
- Derived UI states

### Event Wiring

Look here for:

- Input listeners
- Style-switch behavior
- Toggle behavior
- Tooltip/theme/unit interactions

Use this area when changing:

- User interaction behavior
- Input lifecycles
- Override/reset flows

## High-Risk Areas

- Anything that changes `state` shape
- Anything that mixes DOM reads into calculation paths
- Unit-toggle logic
- Sourdough starter contribution math
- Warm-up and schedule timing logic
- Preset/custom override behavior

## Related Docs

- Current behavior: `docs/spec/current-product-spec.md`
- Formula reference: `docs/spec/formulas-and-data.md`
- Durable decisions: `docs/architecture/decisions.md`
- Manual validation: `docs/testing/manual-test-checklist.md`
