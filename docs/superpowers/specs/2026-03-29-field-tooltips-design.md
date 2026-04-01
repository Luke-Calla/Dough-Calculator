# Field Tooltips — Design Spec

**Date:** 2026-03-29
**Status:** Approved

---

## Overview

Add contextual ⓘ icon tooltips to a small set of fields where the input is not self-evident. Tooltips appear on hover (desktop) or tap (mobile) and float over content without causing layout shift.

---

## Fields with Tooltips

| Field | Location | Tooltip text |
|---|---|---|
| Feed Ratio | Sourdough Starter card | "1:2:2 means 1 part old starter, 2 parts flour, 2 parts water by weight. A lower ratio like 1:1:1 gives a faster rise; a higher ratio like 1:5:5 slows things down and gives you a longer window before peak." |
| Starter Hydration % | Sourdough Starter card | "How much water is in your starter relative to the flour, by weight. At 100% you have equal parts of each. Stiff starters run from 50 to 65% and ferment more slowly." |
| Starter % | Sourdough Starter card | "How much starter to use as a percentage of total flour. More starter means a faster rise and less time needed." |
| Fridge Time | Fermentation card | "Set to 0 for a room-temperature ferment only. A cold rise slows fermentation down and gives more time for flavour development." |

All other fields (Pizzas, Ball Weight, Hydration, Salt, Oil, Sugar, Room Temp, Fridge Temp, Room Time, Target Bake Time, leavener toggle) are self-explanatory and receive no tooltip.

---

## Interaction Model

**Desktop:**
- Hover on ⓘ icon opens the tooltip
- Click also toggles (so keyboard and click users both work)
- Moving cursor away or clicking outside closes it

**Mobile:**
- Tap to open
- Tap the icon again or tap outside to close

**General:**
- Only one tooltip open at a time; opening a new one closes any open one
- No animation required (simple show/hide is sufficient)

---

## HTML Structure

Each tooltip is contained entirely within `.field-label-row`. That element gets `position: relative`, so the popover can anchor to it with `top: 100%`:

```html
<div class="field-label-row">
  <label for="feedRatio">Feed Ratio</label>
  <button class="tooltip-btn" aria-label="About Feed Ratio" aria-expanded="false">
    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"
         stroke-linecap="round" stroke-linejoin="round">
      <use href="#icon-info"/>
    </svg>
  </button>
  <div class="tooltip-popover" role="tooltip" hidden>
    1:2:2 means 1 part old starter...
  </div>
</div>
```

For fields that also have a badge (Starter %), the tooltip button sits between the label and the badge so the badge remains right-aligned:

```html
<div class="field-label-row">
  <label for="starterPct">Starter (%)</label>
  <button class="tooltip-btn" aria-label="About Starter %" aria-expanded="false">...</button>
  <div class="badge preset" id="starterPctBadge">Preset</div>
  <div class="tooltip-popover" role="tooltip" hidden>
    How much starter to use...
  </div>
</div>
```

The `.tooltip-popover` is always a child of `.field-label-row`, never a sibling.

---

## SVG Icon

Add a new `#icon-info` symbol to the sprite in `index.html`:

```html
<symbol id="icon-info" viewBox="0 0 16 16">
  <circle cx="8" cy="8" r="7"/>
  <line x1="8" y1="7" x2="8" y2="11"/>
  <circle cx="8" cy="5" r="0.5" fill="currentColor"/>
</symbol>
```

---

## CSS

`.field-label-row` gets `position: relative` to anchor the absolute popover. The popover's `top: 100%` places it just below the label row, floating over the input beneath it.

```css
.field-label-row {
  position: relative;
}

.tooltip-btn {
  background: none;
  border: none;
  padding: 0;
  margin-left: 4px;
  cursor: pointer;
  color: #aaa;
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

.tooltip-btn:hover {
  color: #666;
}

.tooltip-popover {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 20;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 0.8rem;
  line-height: 1.5;
  color: #444;
  max-width: 280px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
}
```

The `.field-label-row` height does not change when a tooltip is open — the popover floats over content below via `z-index`.

---

## JavaScript

One self-contained block at the bottom of `script.js`. Attaches shared listener logic to all `.tooltip-btn` elements — no per-field code.

**Open/close logic:**
1. On `mouseenter` of `.tooltip-btn`: open its sibling `.tooltip-popover`, set `aria-expanded="true"`
2. On `mouseleave` of `.tooltip-btn`: close, unless the cursor has moved into the popover itself
3. On `mouseleave` of `.tooltip-popover`: close
4. On `click` of `.tooltip-btn`: toggle (handles keyboard/click users and mobile tap)
5. On `click` of `document`: close all open tooltips (tap-outside-to-dismiss)

**One-at-a-time:** Before opening a tooltip, close all others.

**Helper functions:**
```javascript
function openTooltip(btn) { ... }   // shows popover, sets aria-expanded
function closeTooltip(btn) { ... }  // hides popover, clears aria-expanded
function closeAllTooltips() { ... } // iterates all .tooltip-btn, calls closeTooltip
```

---

## Fridge Time — special case

The Fridge Time field uses a slider layout (`.slider-field`) rather than the `.field` / `.field-label-row` pattern. The tooltip icon attaches to the `<label>` row inside `.slider-field`. The `.slider-field` gets `position: relative` and the popover positions relative to it, same as other fields.

---

## Out of scope

- No "don't show again" or localStorage persistence
- No animation or transition
- No tooltips on output card fields or bake schedule
- No arrow/caret on the popover bubble
