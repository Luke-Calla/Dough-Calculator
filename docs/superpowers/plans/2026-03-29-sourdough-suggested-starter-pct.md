# Sourdough Suggested Starter % Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auto-suggest the Starter % from fermentation settings (room temp, room time, fridge time, feed ratio) using the STable lookup, with a PRESET/CUSTOM × badge that lets the user override it — and remove Peak Time as a user input, replacing it with a calculated value displayed in the bake schedule.

**Architecture:** All changes are in the three existing files (`script.js`, `index.html`, `style.css`). New pure functions (`calcSuggestedStarterPct`, `calcPeakTime`) follow the same pattern as `calcYeastPct`. The suggested starter % is recomputed inside `updateOutputs()` on every calculation pass — if the user hasn't overridden it, the input and state are updated automatically. The badge pattern mirrors the existing PRESET/CUSTOM × system for style-driven ratio fields, but implemented as a standalone mechanism inside the sourdough namespace (it is not style-driven).

**Tech Stack:** Vanilla HTML/CSS/JS, no build tools. Live Server for development.

---

## File Map

| File | What changes |
|---|---|
| `script.js` | Add `S_TABLE`, `RATIO_FACTORS`; add `calcSuggestedStarterPct()`, `calcPeakTime()`, `getStarterPct()`, `clearStarterOverride()`; update `state.sourdough`; update `calcIngredients()`, `calcSchedule()`, `updateOutputs()`; update event listeners |
| `index.html` | Add badge to Starter % field; fix input range; remove Peak Time input; set Feed Ratio default to 1:2:2; add starter detail block to output card |
| `style.css` | No changes required — existing `.badge`, `.badge.preset`, `.badge.custom`, `is-preset` styles already cover the new badge |

---

## Task 1: Add S_TABLE, RATIO_FACTORS, and the two new calculation functions

**Files:**
- Modify: `script.js` — after `F_TABLE`, before the `STATE` block

- [ ] **Step 1: Add S_TABLE and RATIO_FACTORS constants after F_TABLE in script.js**

Insert this block immediately after the closing `};` of `F_TABLE` (around line 54):

```javascript
/*
  STable: one calibrated coefficient per room temperature degree.
  Used in: suggestedStarterPct = AS(roomTemp) / (roomTime + fridgeTime / 6)
  Note: gaps at 29, 31, 33, 34°C — interpolate() handles these automatically.
*/
const S_TABLE = {
  14: 1.530509,  15: 1.469694,  16: 1.411295,  17: 1.355216,
  18: 1.301366,  19: 1.249656,  20: 1.200000,  21: 1.152317,
  22: 1.106529,  23: 1.062561,  24: 1.020340,  25: 0.979796,
  26: 0.940863,  27: 0.903478,  28: 0.867577,
  30: 0.800000,  32: 0.737686,  35: 0.653197,
};

/*
  Ratio factors for peak time calculation.
  Maps feed ratio string to the multiplier used in:
  peakTime = 8.5 × 2.2^((20 − roomTemp) / 10) × ratioFactor
*/
const RATIO_FACTORS = {
  '1:1:1': 0.60,
  '1:2:2': 1.00,
  '1:3:3': 1.40,
  '1:5:5': 1.90,
};
```

- [ ] **Step 2: Add calcSuggestedStarterPct() and calcPeakTime() after the calcYeastPct() function**

Insert after the closing `}` of `calcYeastPct()` (around line 136):

```javascript
/* =========================================================
   CORE: Calculate suggested starter percentage
   =========================================================
   Analogous to calcYeastPct but uses a simpler linear time model.
   Fridge fermentation counts as 1/6th the activity of room fermentation.

   Formula: suggestedStarterPct = AS(roomTemp) / (roomTime + fridgeTime / 6)
   Clamped to 5%–30% (0.05–0.30 as a decimal fraction).
========================================================= */
function calcSuggestedStarterPct(roomTemp, roomTime, fridgeTime) {
  const AS = interpolate(S_TABLE, roomTemp, 14, 35);
  const effectiveTime = roomTime + fridgeTime / 6;
  const raw = AS / effectiveTime;
  return Math.min(Math.max(raw, 0.05), 0.30);
}

/* =========================================================
   CORE: Calculate peak time from room temperature and feed ratio
   =========================================================
   Models Q10 ≈ 2.2 for starter fermentation activity.
   Baseline: 8.5 hours at 20°C on a 1:2:2 ratio.

   Formula: peakTime = 8.5 × 2.2^((20 − roomTemp) / 10) × ratioFactor
========================================================= */
function calcPeakTime(roomTemp, feedRatio) {
  const ratioFactor = RATIO_FACTORS[feedRatio] ?? 1.00;
  return 8.5 * Math.pow(2.2, (20 - roomTemp) / 10) * ratioFactor;
}
```

- [ ] **Step 3: Verify the functions exist and are plausible — open browser console and test**

Open the page in Live Server, open browser console (F12), and run:

```javascript
calcSuggestedStarterPct(20, 12, 24)   // expect ~0.075 (7.5%)
calcSuggestedStarterPct(20, 36, 0)    // expect 0.0333... → clamped to 0.05 (5%)
calcPeakTime(20, '1:2:2')             // expect 8.5
calcPeakTime(15, '1:2:2')             // expect ~12.6
calcPeakTime(20, '1:5:5')             // expect ~16.2
```

- [ ] **Step 4: Commit**

```bash
git add Code/script.js
git commit -m "feat: add S_TABLE, RATIO_FACTORS, calcSuggestedStarterPct, calcPeakTime"
```

---

## Task 2: Update state and add helper functions

**Files:**
- Modify: `script.js` — `state.sourdough` block and helpers section

- [ ] **Step 1: Update state.sourdough**

Replace the current `sourdough` block in `state`:

```javascript
// Before:
sourdough: {
  starterPct: 20,
  starterHydration: 100,
  peakTime: 8,
  feedRatio: '1:1:1',
},

// After:
sourdough: {
  starterPctSuggested: 0.20,  // computed; updated by updateOutputs()
  starterPctOverride: null,   // null = using suggestion; number = user override (as %)
  starterHydration: 100,
  feedRatio: '1:2:2',
},
```

- [ ] **Step 2: Add getStarterPct() and clearStarterOverride() to the helpers section**

Insert after the `clamp()` function (before the `interpolate()` function):

```javascript
// Returns the active starter percentage as a decimal fraction.
// Uses user override if set, otherwise the current suggestion.
function getStarterPct() {
  const pct = state.sourdough.starterPctOverride !== null
    ? state.sourdough.starterPctOverride
    : state.sourdough.starterPctSuggested * 100;
  return pct / 100;
}

// Clears the user's starter % override and reverts to the suggested value.
function clearStarterOverride() {
  state.sourdough.starterPctOverride = null;
  const suggested = Math.round(state.sourdough.starterPctSuggested * 100);
  const input = document.getElementById('starterPct');
  input.value = suggested;
  input.classList.add('is-preset');
  const badge = document.getElementById('starterPctBadge');
  badge.className = 'badge preset';
  badge.textContent = 'Preset';
  badge.onclick = null;
  calculate();
}
```

- [ ] **Step 3: Update calcIngredients() to use getStarterPct() instead of state.sourdough.starterPct**

In `calcIngredients()`, find this line:

```javascript
const starterPct = state.sourdough.starterPct / 100;
```

Replace with:

```javascript
const starterPct = getStarterPct();
```

Also remove this validation block (starterPct is always > 0 now — it is clamped to 0.05 minimum):

```javascript
if (starterPct <= 0) {
  return {
    totalDough: Math.round(totalDough),
    validationError: 'Starter % must be greater than 0.',
  };
}
```

Also add `starterFlour` and `starterWater` to the returned object for the output detail section:

```javascript
// Before:
return {
  totalDough:   Math.round(totalDough),
  flour:        Math.round(flourAdded),
  water:        Math.round(waterAdded),
  salt:         parseFloat((flour * saltPct).toFixed(1)),
  starter:      Math.round(starterWt),
  oil:          parseFloat((flour * oilPct).toFixed(1)),
  sugar:        parseFloat((flour * sugarPct).toFixed(1)),
};

// After:
return {
  totalDough:   Math.round(totalDough),
  flour:        Math.round(flourAdded),
  water:        Math.round(waterAdded),
  salt:         parseFloat((flour * saltPct).toFixed(1)),
  starter:      Math.round(starterWt),
  starterFlour: Math.round(starterFlour),
  starterWater: Math.round(starterWater),
  oil:          parseFloat((flour * oilPct).toFixed(1)),
  sugar:        parseFloat((flour * sugarPct).toFixed(1)),
};
```

- [ ] **Step 4: Verify in browser console — no errors on page load**

Reload the page. Open console. Check there are no JS errors. The page should still work in IDY/Fresh mode.

- [ ] **Step 5: Commit**

```bash
git add Code/script.js
git commit -m "feat: update sourdough state — suggestion/override model for starter %, remove peakTime"
```

---

## Task 3: Update HTML — badge, range, remove Peak Time, Feed Ratio default, starter detail

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add badge to Starter (%) field and fix its range**

Find the Starter (%) field in the sourdoughCard:

```html
<!-- Before -->
<div class="field">
  <div class="field-label-row">
    <label for="starterPct">Starter (%)</label>
  </div>
  <div class="input-wrap">
    <input type="number" id="starterPct" value="20" min="5" max="150">
  </div>
</div>
```

Replace with:

```html
<!-- After -->
<div class="field">
  <div class="field-label-row">
    <label for="starterPct">Starter (%)</label>
    <div class="badge preset" id="starterPctBadge">Preset</div>
  </div>
  <div class="input-wrap">
    <input type="number" id="starterPct" class="is-preset" min="5" max="30">
  </div>
</div>
```

Note: `value` is removed — the initial value will be set by `updateOutputs()` on page load.

- [ ] **Step 2: Remove the Peak Time input field**

Find and delete this entire field block from the sourdoughCard field-grid:

```html
<div class="field">
  <div class="field-label-row">
    <label for="peakTime">Peak Time (hrs)</label>
  </div>
  <div class="input-wrap">
    <input type="number" id="peakTime" value="8" min="4" max="24">
  </div>
</div>
```

- [ ] **Step 3: Set Feed Ratio default to 1:2:2**

Find the feedRatio select element:

```html
<!-- Before -->
<select id="feedRatio">
  <option value="1:1:1">1:1:1</option>
  <option value="1:2:2">1:2:2</option>
  <option value="1:3:3">1:3:3</option>
  <option value="1:5:5">1:5:5</option>
</select>
```

Replace with:

```html
<!-- After -->
<select id="feedRatio">
  <option value="1:1:1">1:1:1</option>
  <option value="1:2:2" selected>1:2:2</option>
  <option value="1:3:3">1:3:3</option>
  <option value="1:5:5">1:5:5</option>
</select>
```

- [ ] **Step 4: Add starter detail block to the output card**

In the output card, find the Starter ingredient row (the one with `id="yeastLabel"`):

```html
<div class="ingredient">
  <div class="ingredient-label" id="yeastLabel">Yeast (IDY)</div>
  <div class="ingredient-value" id="outYeast">—<span class="unit">g</span></div>
</div>
```

Insert the starter detail block immediately after it:

```html
<div class="ingredient">
  <div class="ingredient-label" id="yeastLabel">Yeast (IDY)</div>
  <div class="ingredient-value" id="outYeast">—<span class="unit">g</span></div>
</div>
<div class="starter-detail" id="starterDetail">
  <div class="starter-detail-row">
    <span class="starter-detail-label">Flour in starter</span>
    <span class="starter-detail-value"><span id="outStarterFlour">—</span><span class="unit">g</span></span>
  </div>
  <div class="starter-detail-row">
    <span class="starter-detail-label">Water in starter</span>
    <span class="starter-detail-value"><span id="outStarterWater">—</span><span class="unit">g</span></span>
  </div>
</div>
```

- [ ] **Step 5: Verify the page still loads without JS errors**

Reload in Live Server. Switching to Sourdough mode should show the card with 3 fields (Starter %, Starter Hydration %, Feed Ratio). Peak Time should be gone. The Starter % should show a Preset badge.

- [ ] **Step 6: Commit**

```bash
git add Code/index.html
git commit -m "feat: sourdough HTML — starter % badge, remove peak time input, feed ratio default 1:2:2, starter detail block"
```

---

## Task 4: Add starter detail styles to CSS

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Add starter detail styles**

Find the end of the sourdough-specific section in style.css (after `#sourdoughCard.visible`). Add:

```css
/* Starter detail block — shown only in sourdough mode, below the Starter ingredient row */
.starter-detail {
  display: none;
  padding: 6px 0 2px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 4px;
}

.starter-detail.visible {
  display: block;
}

.starter-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 3px 0;
}

.starter-detail-label {
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
}

.starter-detail-value {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}
```

- [ ] **Step 2: Verify styles don't break anything**

Reload the page. Sourdough mode output card should look unchanged (the detail block is hidden by default — JS will show it).

- [ ] **Step 3: Commit**

```bash
git add Code/style.css
git commit -m "feat: add starter detail styles to output card"
```

---

## Task 5: Update calcSchedule() to use calculated peak time

**Files:**
- Modify: `script.js` — `calcSchedule()` function

- [ ] **Step 1: Update calcSchedule() signature to accept peakTime**

Change the function signature and the Feed Starter step from:

```javascript
function calcSchedule(starterWeight = 0) {
  ...
  if (state.leavener === 'sourdough') {
    const feedMins = mixMins - (state.sourdough.peakTime * 60);
    ...
    feedDetail = `Mix ${oldStarter}g old starter + ${flourFeed}g flour + ${waterFeed}g water`;
    ...
    steps.unshift({ name: 'Feed Starter', time: formatTime(feedMins), day: dayLabel(feedMins), isBake: false, icon: ICONS.feedStarter, detail: feedDetail });
  }
```

To:

```javascript
function calcSchedule(starterWeight = 0, peakTime = 8) {
  ...
  if (state.leavener === 'sourdough') {
    const feedMins = mixMins - (peakTime * 60);
    ...
    feedDetail = `Mix ${oldStarter}g old starter + ${flourFeed}g flour + ${waterFeed}g water`;
    ...
    const peakTimeDisplay = peakTime.toFixed(1);
    const feedDayLabel = dayLabel(feedMins);
    steps.unshift({
      name: 'Feed Starter',
      time: formatTime(feedMins),
      day: feedDayLabel,
      isBake: false,
      icon: ICONS.feedStarter,
      detail: feedDetail,
      peakDetail: `Feed ~${peakTimeDisplay} hrs before mixing`,
    });
  }
```

- [ ] **Step 2: Update the timeline HTML template in updateOutputs() to render peakDetail**

Find this template string in `updateOutputs()`:

```javascript
${step.detail ? `<div class="step-detail">${step.detail}</div>` : ''}
```

Replace with:

```javascript
${step.detail ? `<div class="step-detail">${step.detail}</div>` : ''}
${step.peakDetail ? `<div class="step-detail">${step.peakDetail}</div>` : ''}
```

- [ ] **Step 3: Verify in browser — switch to Sourdough mode**

The Feed Starter step in the bake schedule should now show two lines of sub-detail:
1. `Mix Xg old starter + Xg flour + Xg water`
2. `Feed ~X.X hrs before mixing`

(The values will only be correct after Task 6 wires everything together.)

- [ ] **Step 4: Commit**

```bash
git add Code/script.js
git commit -m "feat: calcSchedule accepts peakTime param, adds peak time detail line to Feed Starter step"
```

---

## Task 6: Update updateOutputs() to compute and sync suggested starter %, peakTime, and starter detail

**Files:**
- Modify: `script.js` — `updateOutputs()` function

- [ ] **Step 1: Add suggested starter % sync and peakTime computation to updateOutputs()**

At the top of `updateOutputs()`, before `const result = calcIngredients()`, insert:

```javascript
// In sourdough mode: recompute suggested starter % and peak time from current inputs.
// Update the starter % input if the user hasn't overridden it.
if (state.leavener === 'sourdough') {
  const { roomTemp, roomTime, fridgeTime } = state.inputs;
  const suggested = calcSuggestedStarterPct(roomTemp, roomTime, fridgeTime);
  state.sourdough.starterPctSuggested = suggested;

  if (state.sourdough.starterPctOverride === null) {
    const displayVal = Math.round(suggested * 100);
    document.getElementById('starterPct').value = displayVal;
  }
}
```

- [ ] **Step 2: Compute peakTime and pass it to calcSchedule()**

Find the existing lines in `updateOutputs()`:

```javascript
const result = calcIngredients();
const starterWeight = (state.leavener === 'sourdough' && !result.validationError)
  ? result.starter : 0;
const steps = calcSchedule(starterWeight);
```

Replace with:

```javascript
const result = calcIngredients();
const starterWeight = (state.leavener === 'sourdough' && !result.validationError)
  ? result.starter : 0;
const peakTime = state.leavener === 'sourdough'
  ? calcPeakTime(state.inputs.roomTemp, state.sourdough.feedRatio)
  : 0;
const steps = calcSchedule(starterWeight, peakTime);
```

- [ ] **Step 3: Show/hide starter detail block and populate it**

In the `else` branch of `if (result.validationError)` in `updateOutputs()`, after the sourdough label-switching block, add:

```javascript
const starterDetailEl = document.getElementById('starterDetail');
if (state.leavener === 'sourdough') {
  document.getElementById('outStarterFlour').textContent = result.starterFlour;
  document.getElementById('outStarterWater').textContent = result.starterWater;
  starterDetailEl.classList.add('visible');
} else {
  starterDetailEl.classList.remove('visible');
}
```

- [ ] **Step 4: Verify in browser — switch to Sourdough mode**

With default settings (Neapolitan, 12h room, 24h fridge, 22°C room temp, 1:2:2 feed ratio):
- Starter % input should auto-populate and show "Preset" badge
- Feed Starter step should show calculated peak time (~7.8 hrs at 22°C, 1:2:2)
- Starter detail block should show Flour in starter / Water in starter values
- Changing Room Time slider should update Starter % automatically
- Changing Room Temp should update Starter % and peak time

- [ ] **Step 5: Commit**

```bash
git add Code/script.js
git commit -m "feat: updateOutputs computes and syncs suggested starter %, peak time, and starter detail"
```

---

## Task 7: Wire up Starter % badge event listener

**Files:**
- Modify: `script.js` — event listeners section

- [ ] **Step 1: Replace the starterPct entry in the sourdough forEach with a dedicated badge-aware listener**

Find this block in the event listeners section:

```javascript
document.getElementById('feedRatio').addEventListener('change', function () {
  state.sourdough.feedRatio = this.value;
  calculate();
});

['starterPct', 'starterHydration', 'peakTime'].forEach(field => {
  const input = document.getElementById(field);
  const { min, max } = getNumericBounds(input);
  input.addEventListener('input', function() {
    const val = parseFloat(this.value);
    if (!isNaN(val)) state.sourdough[field] = clamp(val, min, max);
    calculate();
  });
  input.addEventListener('blur', function() {
    if (this.value === '' || isNaN(parseFloat(this.value))) {
      this.value = state.sourdough[field];
    } else {
      const clamped = clamp(parseFloat(this.value), min, max);
      this.value = clamped;
      state.sourdough[field] = clamped;
    }
    calculate();
  });
});
```

Replace with:

```javascript
document.getElementById('feedRatio').addEventListener('change', function () {
  state.sourdough.feedRatio = this.value;
  calculate();
});

// Starter % — badge-aware: typing sets an override (CUSTOM ×); clearing it reverts to suggestion (Preset)
(function () {
  const input = document.getElementById('starterPct');
  const badge = document.getElementById('starterPctBadge');

  input.addEventListener('input', function () {
    const val = parseFloat(this.value);
    if (isNaN(val)) return;
    const clamped = clamp(val, 5, 30);
    const suggested = Math.round(state.sourdough.starterPctSuggested * 100);

    if (clamped === suggested) {
      // Typed back to the suggested value — revert to Preset state
      state.sourdough.starterPctOverride = null;
      input.classList.add('is-preset');
      badge.className = 'badge preset';
      badge.textContent = 'Preset';
      badge.onclick = null;
    } else {
      // Differs from suggestion — switch to Custom state
      state.sourdough.starterPctOverride = clamped;
      input.classList.remove('is-preset');
      badge.className = 'badge custom';
      badge.textContent = 'Custom x';
      badge.onclick = clearStarterOverride;
    }
    calculate();
  });

  input.addEventListener('blur', function () {
    if (this.value === '' || isNaN(parseFloat(this.value))) {
      // Restore to current active value
      const activeVal = state.sourdough.starterPctOverride !== null
        ? state.sourdough.starterPctOverride
        : Math.round(state.sourdough.starterPctSuggested * 100);
      this.value = activeVal;
    } else {
      const clamped = clamp(parseFloat(this.value), 5, 30);
      this.value = clamped;
      if (state.sourdough.starterPctOverride !== null) {
        state.sourdough.starterPctOverride = clamped;
      }
    }
    calculate();
  });
})();

// starterHydration — simple clamped input with blur restore
['starterHydration'].forEach(field => {
  const input = document.getElementById(field);
  const { min, max } = getNumericBounds(input);
  input.addEventListener('input', function() {
    const val = parseFloat(this.value);
    if (!isNaN(val)) state.sourdough[field] = clamp(val, min, max);
    calculate();
  });
  input.addEventListener('blur', function() {
    if (this.value === '' || isNaN(parseFloat(this.value))) {
      this.value = state.sourdough[field];
    } else {
      const clamped = clamp(parseFloat(this.value), min, max);
      this.value = clamped;
      state.sourdough[field] = clamped;
    }
    calculate();
  });
});
```

- [ ] **Step 2: Verify badge behaviour in browser**

Switch to Sourdough mode. Verify:
1. Starter % shows "Preset" badge and a computed value (e.g. ~7% for default settings)
2. Typing a different value switches badge to "Custom x"
3. Clicking "Custom x" badge reverts to the suggested value and shows "Preset"
4. Typing the same value as the suggestion reverts badge to "Preset" automatically
5. Changing Room Time slider changes the Starter % (when in Preset state, not Custom)
6. Changing Room Temp changes the Starter % (when in Preset state)

- [ ] **Step 3: Commit**

```bash
git add Code/script.js
git commit -m "feat: starter % badge event listener — PRESET/CUSTOM × override pattern"
```

---

## Task 8: Clean up — remove peakTime from event listener list and state references

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Verify no remaining references to peakTime, feedRatioA, feedRatioB, feedRatioC, or starterPct as a plain state field**

Search for these in script.js and confirm they no longer appear (other than comments):

```
state.sourdough.peakTime
state.sourdough.starterPct
feedRatioA
feedRatioB
feedRatioC
```

If any remain from prior iterations, remove them now.

- [ ] **Step 2: Remove peakTime validation from calcIngredients() if still present**

Find and remove this block if it still exists:

```javascript
if (state.sourdough.peakTime <= 0) {
  return {
    totalDough: Math.round(totalDough),
    validationError: 'Peak time must be greater than 0 hours.',
  };
}
```

- [ ] **Step 3: Full end-to-end verification**

Test all of these scenarios in the browser:

| Scenario | Expected result |
|---|---|
| Load page in IDY mode | No JS errors; IDY calculates correctly |
| Switch to Sourdough | Starter % auto-filled with Preset badge; Feed Starter step shows in schedule |
| Change Room Time to 36h | Starter % updates (lower — more time = less starter needed) |
| Change Room Temp to 30°C | Starter % updates (lower — warmer = less starter needed) |
| Change Feed Ratio to 1:5:5 | Peak time in Feed Starter step increases |
| Override Starter % to 15 | Badge shows "Custom x"; subsequent fermentation changes don't overwrite it |
| Click "Custom x" | Starter % reverts to suggested value; badge shows "Preset" |
| Set Starter % to a very high value with 50% Starter Hydration | Warning fires: "Starter provides more water than..." |
| Switch back to IDY | Starter detail block hidden; Yeast label restored |

- [ ] **Step 4: Final commit**

```bash
git add Code/script.js Code/index.html Code/style.css
git commit -m "feat: sourdough suggested starter % complete — STable lookup, auto-suggest, PRESET/CUSTOM badge, calculated peak time"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ S_TABLE with all 20 coefficients including gaps at 29, 31, 33, 34 — handled by interpolate()
- ✅ suggestedStarterPct formula: `AS(roomTemp) / (roomTime + fridgeTime / 6)`, clamped 5–30%
- ✅ peakTime formula: `8.5 × 2.2^((20 − roomTemp) / 10) × ratioFactor`
- ✅ RATIO_FACTORS for all four feed ratio options
- ✅ Starter % badge: PRESET by default, CUSTOM × on override, × clears back to suggestion
- ✅ Badge recalculates when roomTemp, roomTime, fridgeTime, feedRatio change
- ✅ Peak Time removed as user input; displayed read-only in Feed Starter step
- ✅ Feed Ratio default changed to 1:2:2
- ✅ Starter % range changed to 5–30%
- ✅ Bake schedule: Feed Starter step gets "Feed ~X.X hrs before mixing" second line
- ✅ Output card: starter detail block (flour in starter, water in starter)
- ✅ starterFlour and starterWater added to calcIngredients() return value
- ✅ Edge case: negative added water warning preserved
- ✅ Edge case: STable range clamped to 14–35°C via interpolate() call

**One note:** The spec (§15.1.4) mentions a "Starter %" entry in the starter detail section. The plan currently shows only Flour in starter and Water in starter. The active starter % is already visible in the input field with its badge, so it is not duplicated in the detail block — this is a deliberate simplification. If the user wants it shown in the output card detail too, add a third `starter-detail-row` displaying `Math.round(getStarterPct() * 100)%`.
