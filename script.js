/* =========================================================
   DATA: PRESET VALUES & LOOKUP TABLES
   =========================================================
   Exact values from your spreadsheet, stored as JS objects.
   Lookup by key: PRESETS['newyork'].hydration
========================================================= */

const PRESETS = {
  neapolitan: { ballWeight: 230, hydration: 65,  salt: 2.5, oil: 0, sugar: 0 },
  newyork:    { ballWeight: 240, hydration: 62,  salt: 2.0, oil: 3, sugar: 1 },
  canotto:    { ballWeight: 250, hydration: 75,  salt: 3.0, oil: 0, sugar: 0 },
  tonda:      { ballWeight: 175, hydration: 60,  salt: 2.5, oil: 6, sugar: 0 },
};

/*
  ATable: one calibrated coefficient per room temperature degree.
  Used in: yeastPct = A(roomTemp) x roomTime^(-1.4524)
*/
const A_TABLE = {
  14: 0.167054,   15: 0.143911, 16: 0.123975,   17: 0.103021,
  18: 0.085609,   19: 0.069950, 20: 0.057155,   21: 0.048054,
  22: 0.040402,   23: 0.033237, 24: 0.027343,   25: 0.024009,
  26: 0.019333,   27: 0.015568, 28: 0.013233,   29: 0.011248,
  30: 0.009561,   31: 0.007790, 32: 0.006347,   33: 0.005171,
  34: 0.004213,   35: 0.003433,
};

/*
  FTable: fridge multiplier per cold fermentation hour.
  Higher F = more fridge fermentation activity = less yeast needed.
*/
const F_TABLE = {
   0: 1.000000,  1: 1.050875,  2: 1.101750,  3: 1.152625,
   4: 1.203500,  5: 1.201566,  6: 1.200000,  7: 1.245996,
   8: 1.294308,  9: 1.344740, 10: 1.397134, 11: 1.451358,
  12: 1.507300, 13: 1.529758, 14: 1.551435, 15: 1.572414,
  16: 1.592759, 17: 1.612529, 18: 1.631772, 19: 1.650531,
  20: 1.668842, 21: 1.686737, 22: 1.704245, 23: 1.721392,
  24: 1.738200, 25: 1.760214, 26: 1.781982, 27: 1.803516,
  28: 1.824829, 29: 1.845929, 30: 1.866826, 31: 1.887529,
  32: 1.908046, 33: 1.928383, 34: 1.948549, 35: 1.968549,
  36: 1.988390, 37: 2.008077, 38: 2.027616, 39: 2.047010,
  40: 2.066266, 41: 2.085388, 42: 2.104379, 43: 2.123244,
  44: 2.141987, 45: 2.160610, 46: 2.179118, 47: 2.197514,
  48: 2.215800, 49: 2.233591, 50: 2.251275, 51: 2.268855,
  52: 2.286333, 53: 2.303712, 54: 2.320994, 55: 2.338183,
  56: 2.355279, 57: 2.372285, 58: 2.389203, 59: 2.406035,
  60: 2.422783, 61: 2.439449, 62: 2.456035, 63: 2.472541,
  64: 2.488970, 65: 2.505324, 66: 2.521603, 67: 2.537810,
  68: 2.553945, 69: 2.570011, 70: 2.586007, 71: 2.601937,
  72: 2.617800, 73: 2.633598, 74: 2.649333, 75: 2.665004,
  76: 2.680615, 77: 2.696164, 78: 2.711654, 79: 2.727086,
  80: 2.742459,
};

/*
  STable: one calibrated coefficient per room temperature degree.
  Used in: suggestedStarterPct = AS(roomTemp) / (roomTime + fridgeTime / 6)
  Covers all 22 integer degrees from 14–35°C.
*/
const S_TABLE = {
  14: 1.530509,  15: 1.469694,  16: 1.411295,  17: 1.355216,
  18: 1.301366,  19: 1.249656,  20: 1.200000,  21: 1.152317,
  22: 1.106529,  23: 1.062561,  24: 1.020340,  25: 0.979796,
  26: 0.940863,  27: 0.903478,  28: 0.867577,  29: 0.833789,
  30: 0.800000,  31: 0.768843,  32: 0.737686,  33: 0.709523,
  34: 0.681360,  35: 0.653197,
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
  '1:4:4': 1.65,
  '1:5:5': 1.90,
};

/*
  Overproof threshold tables — approximate maximum safe room-temperature
  proof time before overproof risk. Q10-derived estimates; not experimentally
  validated. Used with an 85% trigger factor so the advisory fires early.

  Yeast: 2D table keyed by IDY % (outer) and room temp °C (inner).
  Interpolation uses log scale on the yeast axis (time ∝ 1/yeast)
  and linear scale on the temp axis. Values in hours.
*/
const MAX_ROOM_TIME_YEAST = {
  0.001: { 18: 60,  20: 50,  22: 40,  24: 33,  26: 30  },
  0.003: { 18: 20,  20: 17,  22: 13,  24: 11,  26: 12  },
  0.005: { 18: 12,  20: 11,  22:  8,  24:  6,  26:  8  },
  0.010: { 18:  6,  20:  5,  22:  4,  24:  3,  26:  4  },
  0.020: { 18:  3,  20: 2.5, 22:  2,  24: 1.5, 26: 1.5 },
};
const YEAST_KEYS = [0.001, 0.003, 0.005, 0.010, 0.020];
const TEMP_KEYS  = [18, 20, 22, 24, 26];

/*
  Sourdough: 1D table keyed by starter % (as a decimal fraction).
  Approximate max safe room proof time at ~22°C. Values in hours.
*/
const MAX_ROOM_TIME_SOURDOUGH = {
  0.05: 24,
  0.10: 11,
  0.20:  7,
  0.25:  5,
};
const SOURDOUGH_STARTER_KEYS = [0.05, 0.10, 0.20, 0.25];


/* =========================================================
   STATE
   =========================================================
   Single source of truth. We never read values back out of
   the DOM to calculate — we read state. DOM is only for display.
========================================================= */
const state = {
  leavener: 'idy',
  units: 'metric',        // 'metric' | 'imperial'
  ampm: 'pm',
  bakeHour: 7,
  warmUpOverride: null,   // null = use calculated value; number = user-set minutes
  inputs: {
    numBalls:   4,
    roomTemp:   22,
    roomTime:   4,
    fridgeTime: 14,
    fridgeTemp: 4,
  },
  presetValues: { ...PRESETS.newyork },
  userOverrides: {},
  sourdough: {
    starterPctSuggested: 0.20,  // computed; updated by updateOutputs()
    starterPctOverride: null,   // null = using suggestion; decimal fraction = user override
    starterHydration: 100,
    feedRatio: '1:2:2',
  },
  yeast: {
    pctSuggested: 0,   // computed; updated by updateOutputs()
    pctOverride:  null, // null = auto-calculated; decimal fraction = user override
  },
};

/* =========================================================
   HELPERS
========================================================= */

// Returns user override if one exists, otherwise the preset value
function getValue(field) {
  return state.userOverrides[field] !== undefined
    ? state.userOverrides[field]
    : state.presetValues[field];
}

// Clamp: keep a value within min/max bounds
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/* =========================================================
   UNIT CONVERSION
   =========================================================
   All internal state and calculations stay in metric (grams, °C).
   These helpers convert only at the input/output boundary.
========================================================= */
function toDisplayWeight(g) {
  return state.units === 'imperial' ? parseFloat((g * 0.035274).toFixed(2)) : g;
}
function weightUnit() {
  return state.units === 'imperial' ? 'oz' : 'g';
}
function toDisplayTemp(c) {
  return state.units === 'imperial' ? Math.round(c * 9 / 5 + 32) : Math.round(c);
}
function roundTo(val, decimals) {
  return parseFloat(val.toFixed(decimals));
}
function fromDisplayTemp(val) {
  return state.units === 'imperial' ? (val - 32) * 5 / 9 : val;
}
// Convert a displayed weight value (oz or g) back to grams for storage in state
function fromInputWeight(displayVal) {
  return state.units === 'imperial' ? Math.round(displayVal / 0.035274) : displayVal;
}

// Returns active starter % as a decimal fraction (e.g. 0.15 = 15%).
// Uses user override if set, otherwise the computed suggestion.
function getStarterPct() {
  return state.sourdough.starterPctOverride !== null
    ? state.sourdough.starterPctOverride
    : state.sourdough.starterPctSuggested;
}

// Clears the leavener % override and reverts to the suggested value.
function clearStarterOverride() {
  const input = document.getElementById('starterPct');
  if (state.leavener === 'sourdough') {
    state.sourdough.starterPctOverride = null;
    input.value = Math.round(state.sourdough.starterPctSuggested * 100);
  } else {
    state.yeast.pctOverride = null;
    input.value = parseFloat((state.yeast.pctSuggested * 100).toFixed(3));
  }
  input.classList.add('is-preset');
  calculate();
}

/*
  Linear interpolation between adjacent lookup table entries.
  Allows non-integer inputs (e.g. roomTemp = 22.5) to get
  a smooth result rather than always rounding to whole degrees.
*/
function interpolate(table, rawValue, minKey, maxKey) {
  const clamped = clamp(rawValue, minKey, maxKey);
  const lower = Math.floor(clamped);
  const upper = Math.ceil(clamped);
  if (lower === upper) return table[lower];
  const fraction = clamped - lower;
  return table[lower] + fraction * (table[upper] - table[lower]);
}

// Newton's law of cooling: time for covered dough ball to reach 10°C core.
// h=5 W/m²K (covered, still air), ρ=1100 kg/m³, cp=3500 J/kgK, target=10°C.
function calcWarmUpMinutes(ballWeight, roomTemp, fridgeTemp) {
  const TARGET = 10;
  if (roomTemp <= TARGET || fridgeTemp >= TARGET) return 0;
  const mass   = ballWeight / 1000;
  const radius = Math.pow((3 * mass) / (1100 * 4 * Math.PI), 1 / 3);
  const area   = 4 * Math.PI * radius * radius;
  const tau    = (mass * 3500) / (5 * area) / 60; // minutes
  return tau * Math.log((fridgeTemp - roomTemp) / (TARGET - roomTemp));
}

// Snap warm-up durations to the quarter-hour grid used by the warm-up controls.
function roundWarmUpMinutes(mins) {
  return Math.round(mins / 15) * 15;
}

// Linear interpolation across an arbitrary sorted array of numeric keys.
// Used for overproof threshold tables where keys are not consecutive integers.
function interpolateKeyed(keys, table, value) {
  const clamped = Math.max(keys[0], Math.min(keys[keys.length - 1], value));
  let lo = 0;
  for (let i = 0; i < keys.length - 1; i++) {
    if (keys[i] <= clamped) lo = i;
  }
  const k0 = keys[lo], k1 = keys[lo + 1];
  if (k0 === k1 || clamped === k0) return table[k0];
  const t = (clamped - k0) / (k1 - k0);
  return table[k0] + t * (table[k1] - table[k0]);
}

/* =========================================================
   CORE: Calculate yeast percentage
   =========================================================
   Directly translated from your spreadsheet formulas.

   Formula: yeastPct = A(roomTemp) x effectiveTime^(-1.4524)

   effectiveTime = roomTime alone for room-only ferments.
   For cold ferments, roomTime is multiplied by an F factor
   that accounts for fermentation activity in the fridge.
========================================================= */
function calcYeastPct(roomTemp, roomTime, fridgeTime, fridgeTemp) {
  const A = interpolate(A_TABLE, roomTemp, 14, 35);

  if (fridgeTime === 0) {
    return A * Math.pow(roomTime, -1.4524);
  } else {
    // F is calibrated at 5 degrees C.
    // The (fridgeTemp - 5) x 0.035 term adjusts for actual fridge temperature.
    const F_raw = interpolate(F_TABLE, fridgeTime, 0, 80);
    const F_adjusted = 1 + (F_raw - 1) * (1 + (fridgeTemp - 5) * 0.035);
    return A * Math.pow(roomTime * F_adjusted, -1.4524);
  }
}

/* =========================================================
   CORE: Calculate suggested starter percentage
   =========================================================
   Analogous to calcYeastPct but uses a simpler linear time model.
   Fridge fermentation counts as 1/6th the activity of room fermentation,
   adjusted for actual fridge temperature via Q10 ≈ 2 (same assumption as
   the yeast path). At 4°C the multiplier is 1.0; at 8°C ≈ 1.41×.

   Formula: suggestedStarterPct = AS(roomTemp) / (roomTime + fridgeContribution)
   where fridgeContribution = fridgeTime × 2^((fridgeTemp − 4) / 10) / 6
   Clamped to 5%–25% (0.05–0.25 as a decimal fraction).
========================================================= */
function calcSuggestedStarterPct(roomTemp, roomTime, fridgeTime, fridgeTemp) {
  const AS = interpolate(S_TABLE, roomTemp, 14, 35);
  const fridgeContribution = fridgeTime * Math.pow(2, (fridgeTemp - 4) / 10) / 6;
  const effectiveTime = roomTime + fridgeContribution; // roomTime min is 3h, so never 0
  const raw = AS / effectiveTime;                      // Infinity if both 0 → clamped to 0.25 safely
  return Math.min(Math.max(raw, 0.05), 0.25);
}

/* =========================================================
   CORE: Hydration correction for starter peak time
   =========================================================
   Conservative, approximate correction derived from external
   research synthesis rather than the spreadsheet model.
   Baseline = 100% hydration. Stiffer starters peak slightly later.
   Clamped to 50–125% to avoid overfitting sparse evidence.

   Formula: multiplier = exp(-0.003 × (hydration - 100))
 ========================================================= */
function calcStarterHydrationPeakMultiplier(starterHydration) {
  const hydration = clamp(starterHydration, 50, 125);
  return Math.exp(-0.003 * (hydration - 100));
}

/* =========================================================
   CORE: Calculate peak time from room temperature, feed ratio,
   and starter hydration
   =========================================================
   Models Q10 ≈ 2.2 for starter fermentation activity.
   Baseline: 8.5 hours at 20°C on a 1:2:2 ratio.

   Formula:
   peakTime = 8.5 × 2.2^((20 − roomTemp) / 10) × ratioFactor × hydrationMultiplier
 ========================================================= */
function calcPeakTime(roomTemp, feedRatio, starterHydration = 100) {
  const ratioFactor = RATIO_FACTORS[feedRatio] ?? 1.00;
  const hydrationMultiplier = calcStarterHydrationPeakMultiplier(starterHydration);
  return 8.5 * Math.pow(2.2, (20 - roomTemp) / 10) * ratioFactor * hydrationMultiplier;
}

/* =========================================================
   CORE: Calculate overproof threshold
   =========================================================
   Returns the estimated maximum safe room-temperature proof
   time in hours before overproof risk.

   Yeast path: 2D interpolation over MAX_ROOM_TIME_YEAST.
     - Temp axis: linear interpolation between TEMP_KEYS.
     - Yeast axis: log-scale interpolation between YEAST_KEYS,
       because time ∝ 1/yeast (hyperbolic, not linear).
       Linear interpolation on a log scale is equivalent to
       interpolating on the straight line connecting two points
       on a log-linear plot, which matches the true curve far
       better than linear interpolation in raw yeast % space.

   Sourdough path: 1D linear interpolation over
   MAX_ROOM_TIME_SOURDOUGH. The sourdough table is coarser and
   not strongly temperature-dependent, so linear is sufficient.
========================================================= */
function calcOverproofThreshold(leavenerPct, roomTemp, leavener) {
  if (leavener === 'sourdough') {
    return interpolateKeyed(SOURDOUGH_STARTER_KEYS, MAX_ROOM_TIME_SOURDOUGH, leavenerPct);
  }

  // Yeast path: find bracketing yeast rows
  const clampedYeast = Math.max(YEAST_KEYS[0], Math.min(YEAST_KEYS[YEAST_KEYS.length - 1], leavenerPct));
  let lo = 0;
  for (let i = 0; i < YEAST_KEYS.length - 1; i++) {
    if (YEAST_KEYS[i] <= clampedYeast) lo = i;
  }
  const y0 = YEAST_KEYS[lo], y1 = YEAST_KEYS[lo + 1];

  // For each bracketing row, interpolate across the temp axis (linear)
  const t0 = interpolateKeyed(TEMP_KEYS, MAX_ROOM_TIME_YEAST[y0], roomTemp);
  const t1 = interpolateKeyed(TEMP_KEYS, MAX_ROOM_TIME_YEAST[y1], roomTemp);

  // Interpolate between the two rows using log scale on yeast %
  if (y0 === y1) return t0;
  const logFraction = (Math.log(clampedYeast) - Math.log(y0)) / (Math.log(y1) - Math.log(y0));
  return t0 + logFraction * (t1 - t0);
}

/* =========================================================
   CORE: Calculate all ingredient weights
========================================================= */
function calcIngredients() {
  const { numBalls, roomTemp, roomTime, fridgeTime, fridgeTemp } = state.inputs;
  const ballWt     = getValue('ballWeight');
  const hydration  = getValue('hydration') / 100;
  const saltPct    = getValue('salt') / 100;
  const oilPct     = getValue('oil') / 100;
  const sugarPct   = getValue('sugar') / 100;

  const totalDough = numBalls * ballWt;

  if (state.leavener === 'sourdough') {
    /*
      Sourdough path: no yeast percentage.
      The starter contributes both flour and water to the dough —
      these are backed out of the recipe totals so baker's % ratios
      remain accurate.

      starterWeight = flour × starterPct
      starterFlour  = starterWeight / (1 + starterHydration)   e.g. 50% of a 100% hydration starter
      starterWater  = starterWeight - starterFlour

      Flour derivation (no yeast term):
      totalDough = flour × (1 + hydration + salt + oil + sugar + starterPct)
      flour = totalDough / (1 + all ratios)
    */
    const starterPct      = getStarterPct();
    const starterHydRatio = state.sourdough.starterHydration / 100;

    if (starterHydRatio <= 0) {
      return {
        totalDough: Math.round(totalDough),
        validationError: 'Starter hydration must be greater than 0.',
      };
    }

    // Starter mass cancels out of the total dough equation when expressed as
    // a Baker's Percentage of total flour — no leavener term in denominator.
    const flour        = totalDough / (1 + hydration + saltPct + oilPct + sugarPct);
    const starterWt    = flour * starterPct;
    const starterFlour = starterWt / (1 + starterHydRatio);
    const starterWater = starterWt * starterHydRatio / (1 + starterHydRatio);

    const flourAdded = flour - starterFlour;
    const waterAdded = flour * hydration - starterWater;

    if (waterAdded < 0) {
      return {
        totalDough: Math.round(totalDough),
        validationError: 'Starter provides more water than the recipe hydration — reduce Starter % or lower Starter Hydration.',
      };
    }

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
  }

  /*
    Yeast path (IDY / Fresh):
    totalDough = flour × (1 + hydration + salt + oil + sugar + yeast)
    flour = totalDough / (1 + all ratios summed)
  */
  const yeastPct = state.yeast.pctOverride !== null
    ? state.yeast.pctOverride
    : calcYeastPct(roomTemp, roomTime, fridgeTime, fridgeTemp);
  const flour    = totalDough / (1 + hydration + saltPct + oilPct + sugarPct + yeastPct);

  return {
    totalDough: Math.round(totalDough),
    flour:      Math.round(flour),
    water:      Math.round(flour * hydration),
    salt:       parseFloat((flour * saltPct).toFixed(1)),
    yeastPct,
    yeastIDY:   parseFloat((flour * yeastPct).toFixed(2)),
    yeastFresh: parseFloat((flour * yeastPct * 3.0).toFixed(1)),
    oil:        parseFloat((flour * oilPct).toFixed(1)),
    sugar:      parseFloat((flour * sugarPct).toFixed(1)),
  };
}

/* =========================================================
   UTILITIES: Time formatting helpers
   =========================================================
   Kept at top level — pure, stateless, no dependencies.
========================================================= */

// Format minutes-from-midnight as "6:00 PM"
function formatWarmUp(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

function formatTime(totalMins) {
  const normalised = ((totalMins % 1440) + 1440) % 1440;
  const h = Math.floor(normalised / 60);
  const m = normalised % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

// How many days before bake day is this step?
function dayLabel(stepMins) {
  const daysBefore = -Math.floor(stepMins / 1440);
  if (daysBefore === 0) return 'Bake day';
  if (daysBefore === 1) return 'Day before';
  return `${daysBefore} days before`;
}

/* =========================================================
   CORE: Build bake schedule
   =========================================================
   Counts backwards from bakeTime.
   Returns array of step objects.
========================================================= */
function calcSchedule(starterWeight = 0) {
  const { fridgeTime, roomTime, roomTemp, fridgeTemp } = state.inputs;
  const ballWeight = getValue('ballWeight');

  // Convert the hour stepper + AM/PM toggle into minutes from midnight
  const hour = state.bakeHour;
  let hour24;
  if (state.ampm === 'am') {
    hour24 = (hour === 12) ? 0 : hour;       // 12 AM = midnight = 0
  } else {
    hour24 = (hour === 12) ? 12 : hour + 12; // 12 PM = noon = 12
  }
  const bakeMinutes = hour24 * 60;

  const SVG_ATTRS = `width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;
  const ICONS = {
    feedStarter:    `<svg ${SVG_ATTRS}><use href="#icon-timeline-feed-starter"/></svg>`,
    mixDough:       `<svg ${SVG_ATTRS}><use href="#icon-timeline-mix-dough"/></svg>`,
    moveToFridge:   `<svg ${SVG_ATTRS}><use href="#icon-timeline-move-to-fridge"/></svg>`,
    pullFromFridge: `<svg ${SVG_ATTRS}><use href="#icon-timeline-pull-from-fridge"/></svg>`,
    bake:           `<svg ${SVG_ATTRS}><use href="#icon-timeline-bake"/></svg>`,
  };

  const steps = [];

  // Bake is always the anchor at the bottom
  steps.push({ name: 'Bake', time: formatTime(bakeMinutes), day: 'Bake day', isBake: true, icon: ICONS.bake });

  let mixMins;
  if (fridgeTime > 0) {
    const rawWarmUp = calcWarmUpMinutes(ballWeight, roomTemp, fridgeTemp);
    const warmUpMins = state.warmUpOverride !== null
      ? state.warmUpOverride
      : roundWarmUpMinutes(rawWarmUp);
    const pullMins = bakeMinutes - warmUpMins;
    const warmUpDetail = `Allow to warm before shaping`;
    steps.unshift({ name: 'Pull from Fridge', time: formatTime(pullMins), day: dayLabel(pullMins), isBake: false, icon: ICONS.pullFromFridge, detail: warmUpDetail });

    const moveMins = pullMins - (fridgeTime * 60);
    steps.unshift({ name: 'Move to Fridge', time: formatTime(moveMins), day: dayLabel(moveMins), isBake: false, icon: ICONS.moveToFridge });

    mixMins = moveMins - (roomTime * 60);
  } else {
    mixMins = bakeMinutes - (roomTime * 60);
  }
  steps.unshift({ name: 'Mix Dough', time: formatTime(mixMins), day: dayLabel(mixMins), isBake: false, icon: ICONS.mixDough });

  // Sourdough only: prepend a Feed Starter step before Mix Dough
  if (state.leavener === 'sourdough') {
    const peakTime = calcPeakTime(
      state.inputs.roomTemp,
      state.sourdough.feedRatio,
      state.sourdough.starterHydration
    );
    const feedMins = Math.round((mixMins - peakTime * 60) / 30) * 30;

    // Feed prep quantities — shown inline on the step
    let feedDetail = '';
    if (starterWeight > 0) {
      const [A, B, C] = state.sourdough.feedRatio.split(':').map(Number);
      const total      = A + B + C;
      const oldStarter = Math.round(starterWeight * A / total);
      const flourFeed  = Math.round(starterWeight * B / total);
      const waterFeed  = Math.round(starterWeight * C / total);
      const feedUnit = weightUnit();
      feedDetail = `Mix ${toDisplayWeight(oldStarter)}${feedUnit} old starter + ${toDisplayWeight(flourFeed)}${feedUnit} flour + ${toDisplayWeight(waterFeed)}${feedUnit} water`;
    }

    const peakDetail = `Feed ~${((mixMins - feedMins) / 60).toFixed(1)} hrs before mixing`;
    steps.unshift({ name: 'Feed Starter', time: formatTime(feedMins), day: dayLabel(feedMins), isBake: false, icon: ICONS.feedStarter, detail: feedDetail, peakDetail });
  }

  return steps;
}

/* =========================================================
   UI: Update DOM with latest calculations
========================================================= */
function updateOutputs() {
  // Recompute suggested leavener % from current inputs and update the field.
  // Must run before calcIngredients() so state reflects the latest suggestion.
  const leavenerInput = document.getElementById('starterPct');
  const leavenerHint  = document.getElementById('starterPctHint');
  if (state.leavener === 'sourdough') {
    const { roomTemp, roomTime, fridgeTime, fridgeTemp } = state.inputs;
    const suggested = calcSuggestedStarterPct(roomTemp, roomTime, fridgeTime, fridgeTemp);
    state.sourdough.starterPctSuggested = suggested;
    if (state.sourdough.starterPctOverride === null) {
      leavenerInput.value = Math.round(suggested * 100);
      leavenerHint.hidden = true;
    } else {
      document.getElementById('starterPctHintValue').textContent = Math.round(suggested * 100);
      leavenerHint.hidden = false;
    }
  } else {
    const { roomTemp, roomTime, fridgeTime, fridgeTemp } = state.inputs;
    const suggested = calcYeastPct(roomTemp, roomTime, fridgeTime, fridgeTemp);
    state.yeast.pctSuggested = suggested;
    if (state.yeast.pctOverride === null) {
      leavenerInput.value = parseFloat((suggested * 100).toFixed(3));
      leavenerInput.classList.add('is-preset');
      leavenerHint.hidden = true;
    } else {
      document.getElementById('starterPctHintValue').textContent = parseFloat((suggested * 100).toFixed(3));
      leavenerHint.hidden = false;
    }
  }

  // Sync warm-up stepper display and visibility
  const warmUpField = document.getElementById('warmUpField');
  if (warmUpField) {
    const hasFridge = state.inputs.fridgeTime > 0;
    warmUpField.hidden = !hasFridge;
    if (hasFridge) {
      const calcedWarmUp = roundWarmUpMinutes(calcWarmUpMinutes(getValue('ballWeight'), state.inputs.roomTemp, state.inputs.fridgeTemp));
      const activeWarmUp = state.warmUpOverride !== null ? state.warmUpOverride : calcedWarmUp;
      const warmUpDisplay = document.getElementById('warmUpDisplay');
      warmUpDisplay.textContent = formatWarmUp(activeWarmUp);
      warmUpDisplay.classList.toggle('is-auto', state.warmUpOverride === null);
      const warmUpBadge = document.getElementById('warmUpBadge');
      if (state.warmUpOverride === null) {
        warmUpBadge.className = 'badge preset';
        warmUpBadge.textContent = 'Auto';
        warmUpBadge.onclick = null;
      } else {
        warmUpBadge.className = 'badge custom';
        warmUpBadge.textContent = 'Custom ×';
        warmUpBadge.onclick = () => {
          state.warmUpOverride = null;
          calculate();
        };
      }
    }
  }

  const result = calcIngredients();
  const starterWeight = (state.leavener === 'sourdough' && !result.validationError)
    ? result.starter : 0;
  const steps = calcSchedule(starterWeight);
  const timeline = document.getElementById('timeline');

  // Brief fade on all ingredient values — confirms update
  document.querySelectorAll('.ingredient-value').forEach(el => {
    el.classList.add('updating');
    setTimeout(() => el.classList.remove('updating'), 150);
  });

  document.getElementById('outTotalWeight').textContent = toDisplayWeight(result.totalDough);
  document.getElementById('outTotalWeightUnit').textContent = weightUnit();

  const warning          = document.getElementById('sourdoughWarning');
  const overproofAdvisory = document.getElementById('overproofAdvisory');
  const ingredients      = document.getElementById('ingredientsSection');

  // Overproof advisory — dynamic threshold based on leavener amount and room temp.
  // Fires at 85% of estimated max safe proof time (warns early rather than at the cliff edge).
  // Leavener amount: yeastPct for IDY/Fresh, starterPct for sourdough.
  const { roomTime, roomTemp } = state.inputs;
  const leavenerPct = state.leavener === 'sourdough'
    ? getStarterPct()
    : (result.yeastPct ?? 0);
  const overproofThreshold = calcOverproofThreshold(leavenerPct, roomTemp, state.leavener);
  const showAdvisory = roomTime >= overproofThreshold * 0.85;
  if (showAdvisory) {
    overproofAdvisory.textContent = state.leavener === 'sourdough'
      ? 'Room time is approaching the overproof limit for this starter %. Expect excess sourness and reduced oven spring.'
      : 'Room time is approaching the overproof limit for this yeast %. Expect slack texture and poor oven spring.';
  }
  overproofAdvisory.classList.toggle('visible', showAdvisory);

  if (result.validationError) {
    warning.textContent = result.validationError;
    warning.classList.add('visible');
    ingredients.style.display = 'none';
    timeline.innerHTML = '';
  } else {
    warning.classList.remove('visible');
    ingredients.style.display = '';

    setIngredient('outFlour', result.flour);
    setIngredient('outWater', result.water);
    setIngredient('outSalt',  result.salt);
    setIngredient('outOil',   result.oil);
    setIngredient('outSugar', result.sugar);

    if (state.leavener === 'sourdough') {
      setIngredient('outYeast', result.starter);
      document.getElementById('yeastLabel').textContent = 'Starter';
      document.getElementById('flourLabel').textContent = 'Flour';
      document.getElementById('waterLabel').textContent = 'Water';
    } else {
      const yeastVal = state.leavener === 'idy' ? result.yeastIDY : result.yeastFresh;
      setIngredient('outYeast', yeastVal);
      document.getElementById('yeastLabel').textContent =
        state.leavener === 'idy' ? 'Yeast (IDY)' : 'Yeast (Fresh)';
      document.getElementById('flourLabel').textContent = 'Flour';
      document.getElementById('waterLabel').textContent = 'Water';
    }
    timeline.innerHTML = steps.map(step => `
      <div class="timeline-step">
        <div class="step-dot-col">
          ${step.icon
            ? `<div class="step-icon">${step.icon}</div>`
            : `<div class="step-dot ${step.isBake ? 'bake' : ''}"></div>`}
        </div>
        <div class="step-content">
          <div class="step-name ${step.isBake ? 'bake' : ''}">${step.name}</div>
          <div class="step-time">${step.time} &middot; ${step.day}</div>
          ${step.detail ? `<div class="step-detail">${step.detail}</div>` : ''}
          ${step.peakDetail ? `<div class="step-detail">${step.peakDetail}</div>` : ''}
        </div>
      </div>
    `).join('');
  }
}

function setIngredient(id, value) {
  document.getElementById(id).innerHTML = `${toDisplayWeight(value)}<span class="unit">${weightUnit()}</span>`;
}

function getNumericBounds(input, fallbackMin = -Infinity, fallbackMax = Infinity) {
  return {
    min: input.min !== '' ? parseFloat(input.min) : fallbackMin,
    max: input.max !== '' ? parseFloat(input.max) : fallbackMax,
  };
}

/* =========================================================
   UI: Load preset values for a style
========================================================= */
function loadPreset(style) {
  state.presetValues = { ...PRESETS[style] };

  // Clear style-chemistry overrides — these belong to the style, not the user's session
  ['hydration', 'salt', 'oil', 'sugar'].forEach(field => {
    delete state.userOverrides[field];
  });

  // Clear leavener % overrides so yeast/starter reverts to auto-calculated for this style
  state.yeast.pctOverride = null;
  state.sourdough.starterPctOverride = null;

  // Re-render all recipe fields. ballWeight keeps its override if the user set one.
  ['ballWeight', 'hydration', 'salt', 'oil', 'sugar'].forEach(field => {
    const input = document.getElementById(field);
    const badge = document.getElementById(field + 'Badge');
    if (field === 'ballWeight' && state.userOverrides.ballWeight !== undefined) {
      // User has a ball weight override — leave the value, but it stays as Custom
      return;
    }
    input.value = field === 'ballWeight'
      ? toDisplayWeight(state.presetValues[field])
      : state.presetValues[field];
    input.classList.add('is-preset');
    badge.className = 'badge preset';
    badge.textContent = 'Preset';
    badge.onclick = null;
  });
}

/* =========================================================
   UI: User typed into a preset field — switch to CUSTOM,
   or revert to PRESET if they've typed back the preset value
========================================================= */
function onPresetFieldInput(field, value) {
  if (value.endsWith('.')) return;
  const numVal = parseFloat(value);
  if (!isNaN(numVal)) {
    const input = document.getElementById(field);
    const badge = document.getElementById(field + 'Badge');

    // Ball weight input is in display units (oz or g); convert to grams for state comparison
    const stateVal = field === 'ballWeight' ? fromInputWeight(numVal) : numVal;

    if (stateVal === state.presetValues[field]) {
      // Typed value matches the preset — revert to PRESET state
      delete state.userOverrides[field];
      input.value = field === 'ballWeight' ? toDisplayWeight(state.presetValues[field]) : state.presetValues[field];
      input.classList.add('is-preset');
      badge.className = 'badge preset';
      badge.textContent = 'Preset';
      badge.onclick = null;
    } else {
      // Typed value differs from preset — switch to CUSTOM state
      state.userOverrides[field] = stateVal;
      input.classList.remove('is-preset');
      badge.className = 'badge custom';
      badge.textContent = 'Custom x';
      badge.onclick = () => clearOverride(field);
    }
  }
}

/* =========================================================
   UI: Clear override and revert to preset
========================================================= */
function clearOverride(field) {
  delete state.userOverrides[field];
  const input = document.getElementById(field);
  input.value = field === 'ballWeight'
    ? toDisplayWeight(state.presetValues[field])
    : state.presetValues[field];
  input.classList.add('is-preset');
  const badge = document.getElementById(field + 'Badge');
  badge.className = 'badge preset';
  badge.textContent = 'Preset';
  badge.onclick = null;
  calculate();
}

/* =========================================================
   UI: Leavener toggle
========================================================= */
function setLeavener(type) {
  state.leavener = type;
  document.getElementById('btnIDY').classList.toggle('active', type === 'idy');
  document.getElementById('btnFresh').classList.toggle('active', type === 'fresh');
  document.getElementById('btnSourdough').classList.toggle('active', type === 'sourdough');
  document.getElementById('sourdoughCard').classList.toggle('visible', type === 'sourdough');

  const label      = document.getElementById('leavenerPctLabel');
  const tooltipBtn = document.getElementById('leavenerTooltipBtn');
  const input      = document.getElementById('starterPct');
  if (type === 'sourdough') {
    label.textContent = 'Starter (%)';
    tooltipBtn.hidden = false;
    input.min  = 5;
    input.max  = 25;
    input.step = 0.1;
  } else {
    label.textContent = type === 'idy' ? 'Yeast IDY (%)' : 'Yeast Fresh (%)';
    tooltipBtn.hidden = true;
    // Close any open tooltip popover when switching away from sourdough
    const popover = tooltipBtn.parentElement.querySelector('.tooltip-popover');
    if (popover) { popover.hidden = true; tooltipBtn.setAttribute('aria-expanded', 'false'); }
    input.min  = 0.001;
    input.max  = 5;
    input.step = 0.001;
  }

  updateOutputs();
}

/* =========================================================
   UI: AM/PM toggle
========================================================= */
function setAmPm(value) {
  state.ampm = value;
  document.getElementById('btnAM').classList.toggle('active', value === 'am');
  document.getElementById('btnPM').classList.toggle('active', value === 'pm');
  calculate();
}

/* =========================================================
   UI: Bake hour stepper
   =========================================================
   Hours wrap 1 → 12 → 1 in both directions.
   Formula: subtract 1 to get 0-based, apply direction,
   mod 12 to wrap, add 1 back to get 1-based.
========================================================= */
function stepHour(direction) {
  state.bakeHour = ((state.bakeHour - 1 + direction + 12) % 12) + 1;
  document.getElementById('bakeHourDisplay').textContent = state.bakeHour;
  calculate();
}

/* =========================================================
   UI: Warm-up stepper
   =========================================================
   Steps in 30-minute increments, clamped to 30–180 min.
   First step sets an override from the current calculated value.
========================================================= */
function stepWarmUp(direction) {
  const ballWeight = getValue('ballWeight');
  const { roomTemp, fridgeTemp } = state.inputs;
  const calculated = roundWarmUpMinutes(calcWarmUpMinutes(ballWeight, roomTemp, fridgeTemp));
  const current = state.warmUpOverride !== null ? state.warmUpOverride : calculated;
  const snapped = direction > 0
    ? Math.floor(current / 15) * 15 + 15
    : Math.ceil(current / 15) * 15 - 15;
  state.warmUpOverride = clamp(snapped, 15, 240);
  calculate();
}

/* =========================================================
   DEBOUNCE
   =========================================================
   Wraps updateOutputs so it only fires 300ms after the user
   stops typing. Prevents recalculating on every keystroke.
========================================================= */
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const calculate = debounce(updateOutputs, 300);

/* =========================================================
   SLIDER SYNC
   =========================================================
   Keeps the range slider and companion number input in sync.
   Whichever one changes, the other updates to match.
========================================================= */
function syncSlider(sliderId, inputId, stateKey) {
  const slider = document.getElementById(sliderId);
  const input  = document.getElementById(inputId);

  slider.addEventListener('input', () => {
    input.value = slider.value;
    state.inputs[stateKey] = parseFloat(slider.value);
    calculate();
  });

  input.addEventListener('input', () => {
    const val = clamp(parseFloat(input.value) || 0,
      parseFloat(slider.min), parseFloat(slider.max));
    slider.value = val;
    state.inputs[stateKey] = val;
    calculate();
  });

  input.addEventListener('blur', () => {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const val = Math.round(clamp(parseFloat(input.value) || min, min, max));
    input.value = val;
    slider.value = val;
    state.inputs[stateKey] = val;
    calculate();
  });
}

/* =========================================================
   EVENT LISTENERS
   =========================================================
   Wire every user-facing control to the appropriate handler.
   addEventListener(event, callback) = "when X happens, run Y"
========================================================= */

document.getElementById('pizzaStyle').addEventListener('change', function() {
  loadPreset(this.value);
  calculate();
});

document.getElementById('numBalls').addEventListener('input', function() {
  state.inputs.numBalls = parseFloat(this.value) || 4;
  calculate();
});

// Select all text on focus for every number input on the page —
// lets the user type a new value immediately without deleting first
document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('focus', function() {
    this.select();
  });
});

['ballWeight', 'hydration', 'salt', 'oil', 'sugar'].forEach(field => {
  const input = document.getElementById(field);

  input.addEventListener('input', function() {
    onPresetFieldInput(field, this.value);
    calculate();
  });

  const FIELD_DECIMALS = { ballWeight: 0, hydration: 1, salt: 1, oil: 1, sugar: 1 };

  input.addEventListener('blur', function() {
    const raw = parseFloat(this.value);
    if (this.value === '' || isNaN(raw)) {
      this.value = field === 'ballWeight'
        ? toDisplayWeight(getValue(field))
        : getValue(field);
    } else if (field === 'ballWeight') {
      const grams = fromInputWeight(raw);
      this.value = toDisplayWeight(grams);
      onPresetFieldInput(field, this.value);
    } else {
      const rounded = roundTo(raw, FIELD_DECIMALS[field]);
      this.value = rounded;
      onPresetFieldInput(field, String(rounded));
    }
  });
});

document.getElementById('roomTemp').addEventListener('input', function() {
  const raw = parseFloat(this.value);
  if (!isNaN(raw)) state.inputs.roomTemp = fromDisplayTemp(raw);
  calculate();
});
document.getElementById('roomTemp').addEventListener('blur', function() {
  const min = parseFloat(this.min), max = parseFloat(this.max);
  const val = Math.round(clamp(parseFloat(this.value) || min, min, max));
  this.value = val;
  state.inputs.roomTemp = fromDisplayTemp(val);
  calculate();
});

document.getElementById('fridgeTemp').addEventListener('input', function() {
  const raw = parseFloat(this.value);
  if (!isNaN(raw)) state.inputs.fridgeTemp = fromDisplayTemp(raw);
  calculate();
});
document.getElementById('fridgeTemp').addEventListener('blur', function() {
  const min = parseFloat(this.min), max = parseFloat(this.max);
  const val = Math.round(clamp(parseFloat(this.value) || min, min, max));
  this.value = val;
  state.inputs.fridgeTemp = fromDisplayTemp(val);
  calculate();
});

// Leavener toggle — all three buttons share the same handler via data-leavener
document.querySelectorAll('.leavener-toggle button').forEach(btn => {
  btn.addEventListener('click', () => setLeavener(btn.dataset.leavener));
});

// Sourdough inputs — read into state.sourdough on change; restore on blank blur
document.getElementById('feedRatio').addEventListener('change', function () {
  state.sourdough.feedRatio = this.value;
  calculate();
});

// Leavener % — typing sets an override; typing back to the suggested value reverts to auto state.
// Handles sourdough (starter %) and IDY/Fresh (yeast %) with the same field.
(function () {
  const input = document.getElementById('starterPct');

  input.addEventListener('input', function () {
    const val = parseFloat(this.value);
    if (isNaN(val)) return;

    if (state.leavener === 'sourdough') {
      const clamped   = clamp(val, 5, 25);
      const suggested = Math.round(state.sourdough.starterPctSuggested * 100);
      if (clamped === suggested) {
        state.sourdough.starterPctOverride = null;
        input.classList.add('is-preset');
      } else {
        state.sourdough.starterPctOverride = clamped / 100;
        input.classList.remove('is-preset');
      }
    } else {
      const clamped   = clamp(val, 0.001, 5);
      const suggested = parseFloat((state.yeast.pctSuggested * 100).toFixed(3));
      if (clamped === suggested) {
        state.yeast.pctOverride = null;
        input.classList.add('is-preset');
      } else {
        state.yeast.pctOverride = clamped / 100;
        input.classList.remove('is-preset');
      }
    }
    calculate();
  });

  input.addEventListener('blur', function () {
    if (this.value === '' || isNaN(parseFloat(this.value))) {
      if (state.leavener === 'sourdough') {
        this.value = state.sourdough.starterPctOverride !== null
          ? Math.round(state.sourdough.starterPctOverride * 100)
          : Math.round(state.sourdough.starterPctSuggested * 100);
      } else {
        this.value = state.yeast.pctOverride !== null
          ? parseFloat((state.yeast.pctOverride * 100).toFixed(3))
          : parseFloat((state.yeast.pctSuggested * 100).toFixed(3));
      }
    } else {
      if (state.leavener === 'sourdough') {
        const rounded = roundTo(clamp(parseFloat(this.value), 5, 25), 1);
        this.value = rounded;
        if (state.sourdough.starterPctOverride !== null) {
          state.sourdough.starterPctOverride = rounded / 100;
        }
      } else {
        const rounded = roundTo(clamp(parseFloat(this.value), 0.001, 5), 3);
        this.value = rounded;
        if (state.yeast.pctOverride !== null) {
          state.yeast.pctOverride = rounded / 100;
        }
      }
    }
    calculate();
  });

  // Clicking the hint reverts to the auto-calculated suggestion
  document.getElementById('starterPctHint').addEventListener('click', clearStarterOverride);
})();

// starterHydration — simple clamped input with blur restore
(function () {
  const input = document.getElementById('starterHydration');
  const { min, max } = getNumericBounds(input);
  input.addEventListener('input', function () {
    const val = parseFloat(this.value);
    if (!isNaN(val)) state.sourdough.starterHydration = clamp(val, min, max);
    calculate();
  });
  input.addEventListener('blur', function () {
    if (this.value === '' || isNaN(parseFloat(this.value))) {
      this.value = state.sourdough.starterHydration;
    } else {
      const rounded = Math.round(clamp(parseFloat(this.value), min, max));
      this.value = rounded;
      state.sourdough.starterHydration = rounded;
    }
    calculate();
  });
})();

document.querySelectorAll('.hour-stepper button[data-step]').forEach(btn => {
  btn.addEventListener('click', () => {
    stepHour(parseInt(btn.dataset.step, 10));
  });
});

document.querySelectorAll('.hour-stepper button[data-warmup-step]').forEach(btn => {
  btn.addEventListener('click', () => {
    stepWarmUp(parseInt(btn.dataset.warmupStep, 10));
  });
});

document.querySelectorAll('.ampm-toggle button[data-ampm]').forEach(btn => {
  btn.addEventListener('click', () => {
    setAmPm(btn.dataset.ampm);
  });
});

syncSlider('roomTimeSlider', 'roomTime', 'roomTime');
syncSlider('fridgeTimeSlider', 'fridgeTime', 'fridgeTime');

/* =========================================================
   INITIALISE
   =========================================================
   Runs once on page load: populates fields with New York
   preset defaults and calculates the initial output.
========================================================= */
loadPreset(document.getElementById('pizzaStyle').value);
setLeavener(state.leavener);

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
    var popover = getPopover(btn);
    if (!popover) return;
    popover.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeTooltip(btn) {
    var popover = getPopover(btn);
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
    var mouseEnterTime = 0;

    // Hover open
    btn.addEventListener('mouseenter', function () {
      clearTimeout(closeTimer);
      mouseEnterTime = Date.now();
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
      var popover = getPopover(btn);
      if (!popover) return;
      // On mobile, a tap fires mouseenter then click in rapid succession.
      // If mouseenter just opened the tooltip (< 100ms ago), skip the toggle
      // so the synthesised click doesn't immediately close it again.
      if (!popover.hidden && Date.now() - mouseEnterTime < 100) return;
      if (popover.hidden) {
        openTooltip(btn);
      } else {
        closeTooltip(btn);
      }
    });

    // Escape key dismisses the tooltip and returns focus to the button
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeTooltip(btn); btn.focus(); }
    });

    // Blur closes the tooltip when focus leaves the button
    btn.addEventListener('blur', function () {
      closeTimer = setTimeout(function () { closeTooltip(btn); }, 150);
    });
  });
}());

/* ========================================================
   THEME TOGGLE
   ========================================================
   Wires the nav toggle button. On click: flip data-theme on
   <html>, update the icon and aria-label, save to localStorage.
======================================================== */
function initTheme() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  function getTheme() {
    return document.documentElement.getAttribute('data-theme');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateIcon(theme);
  }

  function updateIcon(theme) {
    const use = btn.querySelector('use');
    if (theme === 'dark') {
      use.setAttribute('href', '#icon-sun');
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      use.setAttribute('href', '#icon-moon');
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  // Set correct icon for the theme already applied by the inline script
  updateIcon(getTheme());

  btn.addEventListener('click', function () {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
}

/* ========================================================
   UNIT TOGGLE
   ========================================================
   Flips state.units between 'metric' and 'imperial', then
   re-renders all input fields and output values in the new
   unit system. Internal state (°C, grams) never changes.
======================================================== */
function syncInputDisplayToState() {
  const isImperial = state.units === 'imperial';

  // Temperature inputs
  const roomTempEl = document.getElementById('roomTemp');
  roomTempEl.value = toDisplayTemp(state.inputs.roomTemp);
  roomTempEl.min   = isImperial ? 57 : 14;
  roomTempEl.max   = isImperial ? 95 : 35;
  document.getElementById('labelRoomTemp').textContent =
    `Room Temp (${isImperial ? '°F' : '°C'})`;

  const fridgeTempEl = document.getElementById('fridgeTemp');
  fridgeTempEl.value = toDisplayTemp(state.inputs.fridgeTemp);
  fridgeTempEl.min   = isImperial ? 39 : 4;
  fridgeTempEl.max   = isImperial ? 46 : 8;
  document.getElementById('labelFridgeTemp').textContent =
    `Fridge Temp (${isImperial ? '°F' : '°C'})`;

  // Ball weight input
  const ballWeightEl = document.getElementById('ballWeight');
  const ballGrams    = getValue('ballWeight');
  if (isImperial) {
    ballWeightEl.value = toDisplayWeight(ballGrams);
    ballWeightEl.min   = parseFloat((100 * 0.035274).toFixed(2));
    ballWeightEl.max   = parseFloat((500 * 0.035274).toFixed(2));
    ballWeightEl.step  = '0.01';
    document.getElementById('labelBallWeight').textContent = 'Ball Weight (oz)';
  } else {
    ballWeightEl.value = ballGrams;
    ballWeightEl.min   = 100;
    ballWeightEl.max   = 500;
    ballWeightEl.step  = '';
    document.getElementById('labelBallWeight').textContent = 'Ball Weight (g)';
  }

  document.getElementById('btnMetric').classList.toggle('active', !isImperial);
  document.getElementById('btnImperial').classList.toggle('active', isImperial);
}

document.querySelectorAll('#unitToggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (state.units === btn.dataset.units) return;
    state.units = btn.dataset.units;
    syncInputDisplayToState();
    updateOutputs();
  });
});

initTheme();

/* ========================================================
   MOBILE KEYBOARD SCROLL
   When the soft keyboard opens it shrinks the viewport and
   can hide the focused field. We wait 300ms for the keyboard
   animation to finish, then scroll the field to the centre
   of whatever visible space remains.
======================================================== */
(function () {
  function onFocus(e) {
    var el = e.target;
    if (!el.matches('input, select')) return;
    setTimeout(function () {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
  if (window.matchMedia('(hover: none)').matches) {
    document.addEventListener('focusin', onFocus);
  }
}());
