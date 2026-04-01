# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dependency Philosophy

This project is intentionally zero-dependency: no npm, no frameworks, no build tools. Before implementing any feature that would require introducing a new library, package manager, bundler, or build step — STOP and flag this to the user explicitly. Explain what would be required and why, and ask them to confirm before proceeding. The same applies to suggesting architectural changes that would significantly increase ongoing maintenance (e.g. adding a backend, database, or external API dependency).

## Development

No build step. Open `index.html` directly in a browser (file:// or via a local server like `npx serve .` or VS Code Live Server).

There is no package.json, no npm, no bundler, no TypeScript compilation.

## Architecture

Three files: `index.html`, `script.js`, `style.css`. No frameworks, no dependencies.

**Core principle:** The `state` object in `script.js` is the single source of truth. The DOM is display-only — never read back for calculations. All inputs update `state`, then `updateOutputs()` re-renders.

**Data flow:**
1. User input → event listener updates `state`
2. `calculate()` (debounced 300ms) → `updateOutputs()`
3. `updateOutputs()` calls `calcIngredients()` + `calcSchedule()`, then writes to DOM

## Key Patterns

**Preset/Custom badge system** — applies to ball weight, hydration, salt, oil, sugar, and sourdough starter %. When a user overrides a preset field, a "Custom ×" badge appears; clicking it reverts to the preset. State tracks overrides in `state.userOverrides` (for recipe fields) and `state.sourdough.starterPctOverride` (for starter %). When `starterPctOverride === null`, the suggested value is used and the input auto-updates as fermentation params change.

**Baker's percentages** — all ingredient amounts (water, salt, oil, sugar, yeast/starter) are expressed as a fraction of flour weight. Formulas use these ratios directly; the final weights are computed at display time.

**Leavener modes** — `state.leavener` is `'idy'`, `'fresh'`, or `'sourdough'`. `calcIngredients()` branches on this. Sourdough mode backs the starter's own flour and water contribution out of the recipe totals to maintain target ratios.

**Fermentation lookup tables** — `A_TABLE` (yeast activity by temperature), `F_TABLE` (fridge fermentation multiplier by hours), `S_TABLE` (sourdough starter activity by temperature), and `RATIO_FACTORS` (peak time adjustment per feed ratio) are interpolated linearly via `interpolate()`. Do not derive these values — they are calibrated constants.

**Timeline** — `calcSchedule()` counts backward in minutes from the target bake time. Sourdough "Feed Starter" time is rounded to the nearest 30-minute interval. Times are rendered as HH:MM AM/PM with a day label relative to bake day.

## CSS

CSS custom properties on `:root` define the color palette (cream/charcoal/terracotta), fonts (Playfair Display + Inter), and spacing. The two-column layout (inputs left, output right) uses flexbox. The output card (`.output-card`) uses the charcoal/dark theme. Badge states are `.badge.preset` and `.badge.custom`.
