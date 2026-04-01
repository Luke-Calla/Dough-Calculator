# Field Tooltips Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ⓘ icon tooltips to four fields (Feed Ratio, Starter Hydration %, Starter %, Fridge Time) that reveal explanatory text on hover/tap.

**Architecture:** SVG icon added to the existing sprite; CSS rules appended to style.css; tooltip HTML added inside each `.field-label-row`; a single self-contained JS block at the bottom of script.js wires up all tooltips with shared helper functions.

**Tech Stack:** Vanilla HTML/CSS/JS — no libraries, no build step.

---

## File Map

| File | Changes |
|---|---|
| `index.html` | Add `#icon-info` symbol to sprite; add tooltip button + popover inside each of the four field-label-rows; wrap Fridge Time label in `.field-label-row` |
| `style.css` | Add `position: relative` to `.field-label-row`; add `.tooltip-btn`, `.tooltip-btn:hover`, `.tooltip-popover` rules |
| `script.js` | Add tooltip JS block at bottom: `openTooltip`, `closeTooltip`, `closeAllTooltips`, event listeners |

---

## Task 1: SVG icon + CSS foundation

**Files:**
- Modify: `index.html` (sprite section, lines 34–117)
- Modify: `style.css` (after `.field-label-row` rule, around line 274)

- [ ] **Step 1: Add `#icon-info` to the SVG sprite in index.html**

Find the closing `</defs>` tag in the sprite block and insert the new symbol before it:

```html
      <symbol id="icon-info" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7"/>
        <line x1="8" y1="7" x2="8" y2="11"/>
        <circle cx="8" cy="5" r="0.5" fill="currentColor"/>
      </symbol>
    </defs>
  </svg>
```

- [ ] **Step 2: Add `position: relative` to `.field-label-row` in style.css**

The existing rule is:
```css
.field-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 22px;
  margin-bottom: 4px;
}
```

Add `position: relative;` to it:
```css
.field-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 22px;
  margin-bottom: 4px;
  position: relative;
}
```

- [ ] **Step 3: Append tooltip CSS rules to style.css**

Add after the `.field-label-row` rule block:

```css
/* ========================================================
   TOOLTIPS
======================================================== */
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
  flex-shrink: 0;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
}
```

- [ ] **Step 4: Verify in browser**

Open in Live Server. No visual change expected yet — this just lays the foundation. Check DevTools that `.field-label-row` has `position: relative` applied.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css
git commit -m "feat: add tooltip icon to SVG sprite and tooltip CSS rules"
```

---

## Task 2: Tooltip HTML — Sourdough Starter card (3 fields)

**Files:**
- Modify: `index.html` (Sourdough Starter card, lines 251–284)

The three fields are: Starter %, Starter Hydration %, Feed Ratio. Each gets a `.tooltip-btn` and `.tooltip-popover` inside its `.field-label-row`.

**Starter %** has a badge — the tooltip button goes between the label and the badge.
**Starter Hydration %** and **Feed Ratio** have no badge — the button goes after the label.

- [ ] **Step 1: Add tooltip to Starter % field**

Find this block in index.html:
```html
            <div class="field-label-row">
                <label for="starterPct">Starter (%)</label>
                <div class="badge preset" id="starterPctBadge">Preset</div>
              </div>
```

Replace with:
```html
              <div class="field-label-row">
                <label for="starterPct">Starter (%)</label>
                <button class="tooltip-btn" aria-label="About Starter %" aria-expanded="false">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <use href="#icon-info"/>
                  </svg>
                </button>
                <div class="badge preset" id="starterPctBadge">Preset</div>
                <div class="tooltip-popover" role="tooltip" hidden>
                  How much starter to use as a percentage of total flour. More starter means a faster rise and less time needed.
                </div>
              </div>
```

- [ ] **Step 2: Add tooltip to Starter Hydration % field**

Find this block:
```html
              <div class="field-label-row">
                <label for="starterHydration">Starter Hydration (%)</label>
              </div>
```

Replace with:
```html
              <div class="field-label-row">
                <label for="starterHydration">Starter Hydration (%)</label>
                <button class="tooltip-btn" aria-label="About Starter Hydration" aria-expanded="false">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <use href="#icon-info"/>
                  </svg>
                </button>
                <div class="tooltip-popover" role="tooltip" hidden>
                  How much water is in your starter relative to the flour, by weight. At 100% you have equal parts of each. Stiff starters run from 50 to 65% and ferment more slowly.
                </div>
              </div>
```

- [ ] **Step 3: Add tooltip to Feed Ratio field**

Find this block:
```html
              <div class="field-label-row">
                <label for="feedRatio">Feed Ratio</label>
              </div>
```

Replace with:
```html
              <div class="field-label-row">
                <label for="feedRatio">Feed Ratio</label>
                <button class="tooltip-btn" aria-label="About Feed Ratio" aria-expanded="false">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <use href="#icon-info"/>
                  </svg>
                </button>
                <div class="tooltip-popover" role="tooltip" hidden>
                  1:2:2 means 1 part old starter, 2 parts flour, 2 parts water by weight. A lower ratio like 1:1:1 gives a faster rise; a higher ratio like 1:5:5 slows things down and gives you a longer window before peak.
                </div>
              </div>
```

- [ ] **Step 4: Verify in browser**

Switch to Sourdough mode in the calculator. Three ⓘ icons should be visible next to the three field labels. Clicking them does nothing yet (JS not wired). The badge on Starter % should still sit at the far right.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add tooltip HTML to sourdough starter card fields"
```

---

## Task 3: Tooltip HTML — Fridge Time

**Files:**
- Modify: `index.html` (Fermentation card, slider-field for Fridge Time ~line 307)

The Fridge Time field uses a `.slider-field` with a bare `<label>` — no `.field-label-row`. Wrap the label in a `.field-label-row` div to match the same tooltip pattern.

- [ ] **Step 1: Wrap Fridge Time label and add tooltip**

Find this block in index.html:
```html
          <div class="slider-field" style="margin-bottom: 14px;">
            <label>Fridge Time (hrs)</label>
            <div class="slider-row">
```

Replace with:
```html
          <div class="slider-field" style="margin-bottom: 14px;">
            <div class="field-label-row">
              <label>Fridge Time (hrs)</label>
              <button class="tooltip-btn" aria-label="About Fridge Time" aria-expanded="false">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <use href="#icon-info"/>
                </svg>
              </button>
              <div class="tooltip-popover" role="tooltip" hidden>
                Set to 0 for a room-temperature ferment only. A cold rise slows fermentation down and gives more time for flavour development.
              </div>
            </div>
            <div class="slider-row">
```

- [ ] **Step 2: Check for label style regression**

The existing CSS rule `.slider-field label` applies a specific font size and colour to the bare label. Wrapping the label in `.field-label-row` means `.slider-field label` still matches (it's a descendant selector), so no style change is needed. Verify in the browser that "Fridge Time (hrs)" still looks identical to "Room Time (hrs)" above it.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add tooltip HTML to Fridge Time field"
```

---

## Task 4: JavaScript tooltip logic

**Files:**
- Modify: `script.js` (append to bottom of file)

- [ ] **Step 1: Append tooltip JS block to script.js**

Add this block at the very end of script.js:

```javascript
/* =========================================================
   TOOLTIPS
   ⓘ icon on hover (desktop) or tap (mobile) shows a popover.
   Only one tooltip open at a time.
========================================================= */
(function () {
  function getPopover(btn) {
    return btn.parentElement.querySelector('.tooltip-popover');
  }

  function openTooltip(btn) {
    closeAllTooltips();
    const popover = getPopover(btn);
    if (!popover) return;
    popover.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeTooltip(btn) {
    const popover = getPopover(btn);
    if (!popover) return;
    popover.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  function closeAllTooltips() {
    document.querySelectorAll('.tooltip-btn').forEach(closeTooltip);
  }

  // Close on outside click/tap
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.tooltip-btn') && !e.target.closest('.tooltip-popover')) {
      closeAllTooltips();
    }
  });

  document.querySelectorAll('.tooltip-btn').forEach(function (btn) {
    var closeTimer = null;

    // Hover open
    btn.addEventListener('mouseenter', function () {
      clearTimeout(closeTimer);
      openTooltip(btn);
    });

    // Hover close — short delay so cursor can travel into the popover
    btn.addEventListener('mouseleave', function () {
      closeTimer = setTimeout(function () { closeTooltip(btn); }, 150);
    });

    // Keep open while cursor is inside the popover
    var popover = getPopover(btn);
    if (popover) {
      popover.addEventListener('mouseenter', function () {
        clearTimeout(closeTimer);
      });
      popover.addEventListener('mouseleave', function () {
        closeTimer = setTimeout(function () { closeTooltip(btn); }, 150);
      });
    }

    // Click/tap toggle
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); // prevent document click handler from immediately closing
      const popover = getPopover(btn);
      if (!popover) return;
      if (popover.hidden) {
        openTooltip(btn);
      } else {
        closeTooltip(btn);
      }
    });
  });
}());
```

- [ ] **Step 2: Verify tooltip behaviour in browser**

Open in Live Server. Check each of the following:

1. Switch to Sourdough mode. Hover over the ⓘ next to Starter % — popover appears. Move cursor away — popover closes after ~150ms.
2. Hover from the ⓘ button into the popover — popover stays open.
3. Move cursor out of the popover — it closes.
4. Click the ⓘ on Feed Ratio — popover appears. Click it again — closes.
5. Open one tooltip, then hover over a different one — first closes, second opens.
6. Open a tooltip, then click somewhere else on the page — closes.
7. On a touch device (or DevTools mobile emulation): tap ⓘ to open, tap outside to close.
8. Check Fridge Time tooltip in the Fermentation card — works the same way.
9. Confirm the Starter % badge is still right-aligned with the ⓘ icon to its left.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: wire up tooltip open/close JS for all four fields"
```

---

## Task 5: Final check and push

- [ ] **Step 1: Full manual smoke test**

Run through the complete calculator flow with tooltips present:
- Yeast mode: no ⓘ icons visible anywhere (sourdough card is hidden)
- Sourdough mode: three ⓘ icons visible in Sourdough Starter card, one in Fermentation card
- All calculations still produce correct output (tooltips are purely additive — no logic changes)
- Print preview (Ctrl+P): tooltips don't appear in print output (they're hidden by default and `hidden` attribute means they won't print)

- [ ] **Step 2: Push to GitHub (triggers Netlify redeploy)**

```bash
git push
```

Verify the live site at https://magical-dango-953b75.netlify.app updates correctly.
