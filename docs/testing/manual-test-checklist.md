# Manual Test Checklist

Repeatable browser smoke-test checklist for this project.

## When To Read This File

Read this file after meaningful UI, logic, or interaction changes. Use it to verify core behavior in a project that does not have an automated test suite.

## How To Use It

- Run the relevant sections for the area you changed
- Run the full core smoke test after any substantial logic or shared UI change
- If behavior changes intentionally, update this checklist

## Core Smoke Test

### Page Load

- `index.html` loads without console errors
- Default fields render with sensible values
- Output card renders immediately
- Calculator subtitle reads clearly and the below-the-calculator explainer content renders
- Theme toggle works
- Unit toggle works

### Leavener Modes

- IDY mode calculates and labels yeast correctly
- Fresh yeast mode updates the yeast label and amount correctly
- Sourdough mode reveals starter inputs and starter-specific schedule/output behavior
- Switching between modes does not leave stale output labels behind

### Presets And Overrides

- Changing pizza style updates preset-backed fields
- Editing hydration, salt, oil, or sugar creates a custom override state
- Reverting a value to its preset clears the override
- Style changes clear the intended chemistry-related overrides only
- Pizza count and intended preserved fields remain stable when style changes

### Inputs And Blur Behavior

- Inputs do not snap to rounded values mid-typing
- Clearing a preset-capable field and blurring restores the effective value
- Numeric fields clamp to min/max on blur
- Rounding precision matches the expected field type on blur

### Output And Schedule

- Total dough and ingredient outputs update after input changes
- Room-only fermentation shows the correct reduced schedule
- Cold fermentation always shows `Move to Fridge`; `Pull from Fridge` appears only when effective warm-up is above `0`
- Relative day labels are sensible when times cross midnight

## Sourdough Checks

- Starter % shows **Auto** badge when using the suggestion; badge updates as fermentation inputs change
- Overriding starter % switches badge to **Custom ×** and freezes the value
- Clicking **Custom ×** badge clears the override and restores the suggestion
- Changing feed ratio changes feed timing behavior
- Starter detail output matches the displayed starter logic

## Warm-Up Checks

- Warm-up field only appears when fridge time is greater than zero
- Auto warm-up value updates when fridge time, room temp, or fridge temp changes
- Auto warm-up snaps to a 15-minute grid
- Manual warm-up override persists until reset unless fridge time or temperatures make it invalid, in which case it clamps back into range
- Resetting the override restores the current auto-calculated value

## Units And Formatting

- Unit toggle changes displayed weights between g and oz
- Unit toggle changes displayed temperatures between C and F
- Internal behavior remains stable after repeated toggle round-trips
- Feed-starter quantities and output units follow the active unit mode

## Tooltip And Interaction Checks

- Only one tooltip opens at a time
- Desktop hover/click behavior works
- Mobile tap behavior works — tooltip opens on tap, stays open, icon remains dark
- Clicking or tapping outside closes the active tooltip
- Tooltip icon is dark while its popover is open; reverts to grey when closed

## Layout Checks

- Desktop layout remains two-column at and above the desktop breakpoint
- Mobile layout stacks cleanly and remains readable
- Sticky output card stays visually tied to the calculator section and does not keep tracking through the lower explainer content
- Divider between the calculator and the lower explainer content is visible and intentional
- Feature cards, CTA banner, and FAQ remain readable and well-spaced on desktop and mobile
- No major overflow or clipped controls
- Focused inputs remain visible on touch devices with the soft keyboard open

## Calculator Explainer Checks

- `What this calculator includes` shows all three feature cards
- CTA banner links correctly to `how-it-works.html`
- FAQ rows expand and collapse cleanly using native disclosure behavior
- FAQ answers stay concise and readable without causing layout overflow

## Secondary Page Checks

- `how-it-works.html` loads without errors
- Nav structure and theme behavior stay aligned with the main page where expected
- Shared UI changes are reflected on both pages when intended

## Pre-Ship Sanity Check

- Spec docs reflect intentional behavior changes
- Changelog is updated for shipped user-visible changes
- Roadmap is updated only for unshipped work
