# Formulas And Data

Canonical math and model reference.

Use this doc only when a task changes calculations, thresholds, schedule math, or calibrated constants.

## When To Read This File

Read this file when changing recipe math, fermentation math, interpolation, timing, thresholds, or model assumptions. Skip it for styling, copy changes, layout work, or roadmap discussions.

## Spreadsheet Sources

- Main spreadsheet: `pizza_dough_calculator_v17.xlsx`
- Yeast model sheets: `ATable`, `FTable`, `Calculator`, `Schedule`
- Sourdough model sheets: `STable`, `Calculator`, `Schedule`, `Calc`

## Lookup Tables And Constants

Do not casually re-derive these values. Use the calibrated constants already embedded in `script.js`.

- `A_TABLE`: yeast activity by room temperature
- `F_TABLE`: fridge fermentation multiplier by fridge time
- `S_TABLE`: sourdough starter activity by room temperature
- `RATIO_FACTORS`: sourdough feed-ratio multipliers for peak timing
- `MAX_ROOM_TIME_YEAST`: overproof threshold matrix for yeast
- `MAX_ROOM_TIME_SOURDOUGH`: overproof threshold table for sourdough

If exact numeric values are required, load `script.js` or the spreadsheet rather than expanding this doc.

## Ingredient Math

### Common Total

```text
totalDough = pizzas * ballWeight
```

### Yeast Path

```text
flour = totalDough / (1 + hydration + salt + oil + sugar + yeastPct)
water = flour * hydration
saltG = flour * salt
oilG = flour * oil
sugarG = flour * sugar
yeastG = flour * yeastPct
freshYeastG = instantDryYeastG * 3
```

### IDY Percentage

Room only:

```text
yeastPct = A(roomTemp) * roomTime^(-1.4524)
```

Cold rise:

```text
F_adjusted = 1 + (F_raw - 1) * (1 + (fridgeTemp - 5) * 0.035)
yeastPct = A(roomTemp) * (roomTime * F_adjusted)^(-1.4524)
```

### Sourdough Starter Suggestion

```text
suggestedStarterPct = AS(roomTemp) / (roomTime + adjustedFridgeTime / 6)
suggestedStarterPct = clamp(5%, 25%)
```

Current fridge correction:

```text
adjustedFridgeTime = fridgeTime * 2^((fridgeTemp - 4) / 10)
```

### Peak Time

```text
hydrationMultiplier = exp(-0.003 * (clamp(starterHydration, 50, 125) - 100))
peakTime = 8.5 * 2.2^((20 - roomTemp) / 10) * ratioFactor * hydrationMultiplier
```

This timing correction affects feed scheduling only. It does not change ingredient math or the suggested starter percentage.

Current feed-ratio multipliers:

- `1:1:1` -> `0.60`
- `1:2:2` -> `1.00`
- `1:3:3` -> `1.40`
- `1:4:4` -> `1.65`
- `1:5:5` -> `1.90`

### Sourdough Total Flour

In sourdough mode, starter flour and starter water are backed out of the bowl-added flour and water. The yeast term is omitted.

```text
F_total = totalDough / (1 + hydration + salt + oil + sugar)
starterWeight = F_total * starterPct
starterFlour = starterWeight / (1 + starterHydration)
starterWater = starterWeight * starterHydration / (1 + starterHydration)
flourAdded = F_total - starterFlour
waterAdded = F_total * hydration - starterWater
```

### Feed Preparation Quantities

```text
parts = ratioA + ratioB + ratioC
oldStarterNeeded = starterWeight * ratioA / parts
flourToFeed = starterWeight * ratioB / parts
waterToFeed = starterWeight * ratioC / parts
```

## Schedule Math

All schedule times are calculated backward from the target bake time.

### Warm-Up Time

Warm-up now uses a closed-form Newton cooling model, not a lookup table.

```text
warmUpMinutes = tau * ln((T_fridge - T_room) / (T_target - T_room))
```

Current implementation notes:

- Inputs are ball weight, fridge temperature, and room temperature
- `T_target = 10 C`
- Heat-transfer assumption: covered dough, `h = 5 W/m^2K`
- Auto result is snapped to the nearest 15 minutes
- Manual override replaces the auto value

### Yeast Modes

```text
pullFromFridge = bakeTime - warmUpTime
moveToFridge = pullFromFridge - fridgeTime
mixDough = moveToFridge - roomTime
```

### Sourdough Mode

```text
feedStarter = mixDough - peakTime
```

`Feed Starter` time is rounded to the nearest 30 minutes for display.

## Interpolation Rules

- `A_TABLE` and `S_TABLE`: 1D linear interpolation on room temperature
- `F_TABLE`: 1D linear interpolation on fridge time
- `MAX_ROOM_TIME_YEAST`: linear interpolation on temperature, log-scale interpolation on yeast percentage
- `MAX_ROOM_TIME_SOURDOUGH`: 1D linear interpolation on starter percentage

## Overproof Advisory

The advisory triggers before the estimated limit.

```text
advisoryThreshold = estimatedMaxSafeTime * 0.85
showAdvisory when roomTime >= advisoryThreshold
```

- Yeast path uses `MAX_ROOM_TIME_YEAST`
- Sourdough path uses `MAX_ROOM_TIME_SOURDOUGH`
- These thresholds are calibrated approximations, not experimentally validated safety limits

## Current Model Limitations

- Warm-up times are model-derived approximations, not experimentally validated measurements
- Starter hydration timing correction is evidence-informed but approximate
- Sourdough timing and overproof thresholds are calibrated estimates, not lab values
- Large numeric tables are intentionally omitted here to keep the doc light

## Implementation Notes

- Keep formulas aligned with the spreadsheet model unless the user explicitly requests a model change
- Prefer constant names that match `script.js`
- If a calibrated table or threshold changes, update the code and document the source of the change
