# Field Tooltips Design Spec

Historical design note.

## Status

- Date: 2026-03-29
- State: implemented
- Use this doc for historical rationale only
- Current behavior lives in `docs/spec/current-product-spec.md` and the code

## Overview

This design introduced contextual info tooltips for a small set of fields where the meaning is not self-evident. Tooltips float over content and do not cause layout shift.

## Intended Tooltip Fields

| Field | Location | Purpose |
|---|---|---|
| Feed Ratio | Sourdough Starter card | Explain starter feeding ratios |
| Starter Hydration % | Sourdough Starter card | Explain hydration meaning and common ranges |
| Starter % | Sourdough Starter card | Explain starter amount as a percentage of flour |
| Fridge Time | Fermentation card | Explain room-only vs cold-rise behavior |

## Interaction Model

- Desktop: hover and click open the tooltip
- Mobile: tap opens the tooltip
- Only one tooltip should be open at a time
- Outside interaction closes the active tooltip

## Implementation Direction

- Use a shared SVG info icon in the sprite
- Keep tooltip HTML anchored to the relevant label row
- Use one shared JS block rather than per-field logic

## Out Of Scope

- Persistence such as "don't show again"
- Tooltip animations
- Tooltips on output-card rows or schedule steps
