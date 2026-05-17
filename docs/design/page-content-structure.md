# Page Content Structure Design

Proposed reference for the content split between the calculator page and the how-it-works page.

## Status

- Status: proposed
- Created: 2026-05-16
- Scope: content structure, page hierarchy, and user intent
- Not scope: formula changes, calculator state changes, new dependencies, or visual redesign details

## When To Read This File

Read this file before restructuring `index.html`, `how-it-works.html`, or the explanatory sections shared between them.

Use `docs/spec/current-product-spec.md` for shipped behavior, and use `docs/spec/formulas-and-data.md` for math. This document is a planning reference for what each public page should communicate.

## Product Framing

The app has two main jobs:

- Help someone calculate a real dough formula and bake schedule quickly.
- Help someone understand enough to trust and adjust the result.

Those jobs should map cleanly to the two pages:

- `index.html`: the working tool.
- `how-it-works.html`: the explanatory guide.

The calculator page should answer, "What should I enter, and what do I do next?"

The how-it-works page should answer, "Why did the calculator give me this?"

The docs should answer, "What exactly is the shipped behavior and formula contract?"

## Calculator Page Intent

The calculator page is for action. It should stay practical and focused on producing a usable recipe.

It should not become a textbook. Any explanation here should help the user choose an input or understand the output.

### Recommended Structure

1. Sticky navigation
   - Brand: `Dough Formula`
   - Link to `How It Works`
   - Unit toggle
   - Theme toggle

2. Short page header
   - Title: `Pizza Dough Calculator`
   - One-sentence description of ingredient weights and bake scheduling.

3. Primary calculator surface
   - Inputs on the left, output on the right at desktop widths.
   - Single-column flow on mobile.
   - Output stays visually tied to the calculator, not to lower explanatory content.

4. Input groups
   - Pizza Settings: style, pizza count, ball weight.
   - Dough Ratios: hydration, salt, oil, sugar, leavener mode.
   - Sourdough Starter: starter percentage, starter hydration, feed ratio; visible only for sourdough.
   - Fermentation: room time, fridge time, room temperature, fridge temperature, target bake time, warm-up time.

5. Output groups
   - Final dough mass.
   - Ingredient weights.
   - Starter breakdown when sourdough is active.
   - Validation warnings and overproof advisories.
   - Backwards bake schedule.

6. Light explainer band
   - A compact section below the calculator.
   - Explains what the calculator includes without repeating the full how-to page.
   - Links users to the deeper explanation.

7. Practical FAQ
   - Focused on common input and output decisions.
   - Kept short enough that it does not compete with the calculator.

### Calculator Page Content

Keep:

- What this calculator includes.
- Why ingredient weights are based on baker's percentages.
- Why the yeast amount can look small.
- How to measure very small yeast amounts.
- How presets should be treated as starting points.
- How sourdough mode changes the output.
- Why fridge time affects both formula and schedule.
- What the calculator cannot know.

Avoid:

- Long formula derivations.
- Detailed calibration-table explanations.
- Broad fermentation science sections.
- Research-style claims that are not directly connected to calculator use.

### Suggested Calculator FAQ

- What dough ball weight should I use?
- Why is the yeast amount so small?
- How do I measure such a small amount of yeast?
- What hydration should I start with?
- Can I use sourdough instead of yeast?
- Why does fridge time matter?
- What does the calculator not know?

## How-It-Works Page Intent

The how-it-works page is for understanding. It should explain the calculator without turning into code notes or spreadsheet notes.

It should feel like a practical guide for people who want to adjust the numbers with more confidence.

### Recommended Structure

1. Hero
   - Title: `How the Dough Calculator Works` or `How It Works`
   - Supporting copy about baker's percentages, fermentation timing, and schedule planning.
   - Tone should be clear and useful rather than overly grand.

2. Quick workflow
   - Choose style and batch size.
   - Choose leavener.
   - Set time and temperature.
   - Read the formula and schedule.

3. Baker's percentages
   - Flour as the 100% reference.
   - Hydration, salt, oil, sugar, and leavener as percentages of flour.
   - Why this makes recipes scalable and predictable.

4. Pizza style presets
   - Explain that presets are starting points, not locked recipes.
   - Cover Neapolitan, New York, Canotto, and Tonda Romana at a high level.
   - Connect each preset to ball weight, hydration, salt, oil, and sugar.

5. Leavener modes
   - IDY: small percentages, predictable commercial yeast.
   - Fresh yeast: same activity intent, displayed at about three times the IDY-equivalent weight.
   - Sourdough: starter percentage, starter hydration, feed ratio, and peak timing.
   - Explain that sourdough backs starter flour and water out of the bowl-added flour and water.

6. Time and temperature
   - Room time and room temperature.
   - Fridge time and fridge temperature.
   - Why colder fermentation slows activity and changes both leavener amount and schedule.

7. Schedule logic
   - The calculator works backwards from target bake time.
   - Room-only path: mix dough, bake.
   - Cold-ferment path: mix dough, move to fridge, optionally pull from fridge, bake.
   - Sourdough path adds feed starter before mixing.

8. Warm-up and limitations
   - Warm-up is model-derived and snapped to a 15-minute grid.
   - Auto warm-up can validly be zero.
   - Overproof warnings are guidance, not guarantees.

9. What the calculator does not know
   - Starter health varies.
   - Real fridge temperatures vary.
   - Warm-up estimates are approximate.
   - Flour strength, handling, oven setup, and actual dough temperature are outside the calculator.

10. Return CTA
   - Clear link back to the calculator.
   - Avoid placeholder footer links unless the pages exist.

## Content Boundary Rules

Use these rules when deciding where a piece of content belongs.

- Put input help on the calculator page when it helps the user choose a value immediately.
- Put explanatory model content on the how-it-works page when it teaches why the value matters.
- Put formula contracts in `docs/spec/formulas-and-data.md`.
- Put shipped behavior in `docs/spec/current-product-spec.md`.
- Put future product ideas in `docs/roadmap/backlog.md`.

## Supporting Visuals

Use visuals only when they clarify the nearby text.

- The percentage table belongs with baker's percentages.
- The style cards belong with pizza presets.
- The leavener comparison belongs with leavener modes.
- The fermentation pace chart belongs with time and temperature.
- The timeline belongs with bake scheduling.
- The limitations table belongs with things the calculator cannot know.

Avoid decorative graphics that imply a measurement or feature the calculator does not actually provide.

## Tone Direction

The desired tone is practical and calm.

Prefer:

- "Use the preset as a starting point."
- "Longer fermentation usually needs less yeast."
- "Sourdough timing depends on starter strength, hydration, and feed ratio."

Avoid:

- Overly scientific or inflated language.
- Claims that imply certainty where the model is approximate.
- Copy that describes implementation details more than user meaning.

## Implementation Notes For Future Page Changes

- Keep the project zero-dependency and static.
- Preserve nav and theme parity between `index.html` and `how-it-works.html`.
- Do not change formula behavior while restructuring content.
- Keep calculator-page explanation compact so the output card remains the main event.
- If `how-it-works.html` changes shipped user-visible content, update `docs/changelog.md`.
- If the final page structure becomes shipped behavior, update `docs/spec/current-product-spec.md`.

## Suggested First Implementation Pass

The first page-change pass should focus on `how-it-works.html` only:

1. Retune the hero copy.
2. Keep the quick workflow section.
3. Replace the current broad science-heavy middle sections with the recommended sequence:
   - Baker's percentages
   - Pizza style presets
   - Leavener modes
   - Time and temperature
   - Schedule logic
   - Warm-up and limitations
4. Remove placeholder footer links unless real destination pages are added.
5. Verify mobile layout and shared navigation behavior.
