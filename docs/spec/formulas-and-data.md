# Formulas And Data

**Status:** Canonical math and model reference
**Use when:** A task changes calculations, interpolation, thresholds, or schedule logic

## Spreadsheet Sources

- Main spreadsheet: `pizza_dough_calculator_v17.xlsx`
- Yeast model source sheets: `ATable`, `FTable`, `Calculator`, `Schedule`
- Sourdough model source sheets: `STable`, `Calculator`, `Schedule`, `Calc`

## Lookup Tables And Constants

Do not re-derive these values. Use the calibrated constants already embedded in `script.js`.

- `A_TABLE`: yeast activity by room temperature
- `F_TABLE`: fridge fermentation multiplier by fridge time
- `S_TABLE`: sourdough starter activity by room temperature
- `RATIO_FACTORS`: starter feed ratio multipliers for peak time
- `MAX_ROOM_TIME_YEAST`: overproof threshold matrix for yeast
- `MAX_ROOM_TIME_SOURDOUGH`: overproof threshold table for sourdough
- `W_TABLE`: warm-up time in minutes by ball weight (g) and ΔT (°C); see Schedule Math

If the exact numeric data is needed, load `script.js` or the spreadsheet, not this doc.

## Ingredient Math

### Common totals

```text
totalDough = pizzas * ballWeight
```

### Yeast path

```text
flour = totalDough / (1 + hydration + salt + oil + sugar + yeastPct)
water = flour * hydration
saltG = flour * salt
oilG = flour * oil
sugarG = flour * sugar
yeastG = flour * yeastPct
freshYeastG = instantDryYeastG * 3
```

### IDY percentage

Room only:

```text
yeastPct = A(roomTemp) * roomTime^(-1.4524)
```

Cold rise:

```text
F_adjusted = 1 + (F_raw - 1) * (1 + (fridgeTemp - 5) * 0.035)
yeastPct = A(roomTemp) * (roomTime * F_adjusted)^(-1.4524)
```

### Sourdough starter suggestion

```text
suggestedStarterPct = AS(roomTemp) / (roomTime + adjustedFridgeTime / 6)
suggestedStarterPct = clamp(5%, 25%)
```

Current fridge correction uses a Q10 adjustment:

```text
adjustedFridgeTime = fridgeTime * 2^((fridgeTemp - 4) / 10)
```

### Peak time

```text
hydrationMultiplier = exp(-0.003 * (clamp(starterHydration, 50, 125) - 100))
peakTime = 8.5 * 2.2^((20 - roomTemp) / 10) * ratioFactor * hydrationMultiplier
```

This is an approximate correction added on top of the base peak-time model. It affects
timing only and does not change ingredient math or suggested starter %.

Current feed-ratio multipliers:

- `1:1:1` -> `0.60`
- `1:2:2` -> `1.00`
- `1:3:3` -> `1.40`
- `1:4:4` -> `1.65`
- `1:5:5` -> `1.90`

### Sourdough total flour

In sourdough mode, starter flour and water cancel out of the denominator. The yeast term is omitted.

```text
F_total = totalDough / (1 + hydration + salt + oil + sugar)
starterWeight = F_total * starterPct
starterFlour = starterWeight / (1 + starterHydration)
starterWater = starterWeight * starterHydration / (1 + starterHydration)
flourAdded = F_total - starterFlour
waterAdded = F_total * hydration - starterWater
```

### Feed preparation quantities

```text
parts = ratioA + ratioB + ratioC
oldStarterNeeded = starterWeight * ratioA / parts
flourToFeed = starterWeight * ratioB / parts
waterToFeed = starterWeight * ratioC / parts
```

## Schedule Math

Times are calculated backward from target bake time.

### Yeast modes

```text
ΔT = roomTemp − fridgeTemp
warmUpTime = bilinearInterpolate(W_TABLE, ballWeight, ΔT)   // clamped to table bounds
warmUpTime = override if user has set one, else round(warmUpTime / 15) * 15
pullFromFridge = bakeTime - warmUpTime
moveToFridge = pullFromFridge - fridgeTime
mixDough = moveToFridge - roomTime
```

W_TABLE rows: 200, 250, 300, 320, 350 g. Columns: ΔT 10–22°C in 2°C steps.
Model: Newton's law of cooling with Biot-number correction (Bi ≈ 0.55) for internal
temperature gradient. Calibrated to ~1.5–2 hr for 250–350g at ΔT 16–18°C.
Approximate; not experimentally validated.

### Sourdough mode

```text
feedStarter = mixDough - peakTime
```

Feed starter time is rounded to the nearest 30 minutes for display.

## Interpolation Rules

- `A_TABLE` and `S_TABLE`: 1D linear interpolation on room temperature
- `F_TABLE`: 1D interpolation on fridge time
- `MAX_ROOM_TIME_YEAST`: linear interpolation on temperature, log-scale interpolation on yeast percentage
- `MAX_ROOM_TIME_SOURDOUGH`: 1D linear interpolation on starter percentage
- `W_TABLE`: bilinear interpolation — first across ΔT within each weight row, then across weight rows

## Overproof Advisory

The advisory triggers before the estimated limit, not at the limit.

```text
advisoryThreshold = estimatedMaxSafeTime * 0.85
showAdvisory when roomTime >= advisoryThreshold
```

- Yeast path uses `MAX_ROOM_TIME_YEAST`
- Sourdough path uses `MAX_ROOM_TIME_SOURDOUGH`
- These thresholds are model-derived approximations, not experimentally validated limits

## Current Model Limitations

- Warm-up times are model-derived approximations (Biot-corrected Newton cooling); not experimentally validated
- Starter hydration timing correction is evidence-informed but approximate; clamped to 50-125% hydration
- Sourdough and overproof thresholds are calibrated estimates, not laboratory measurements
- Large data tables are intentionally omitted here to reduce token load

## Implementation Notes

- Keep formulas aligned with the spreadsheet model
- Prefer naming constants exactly as they appear in `script.js`
- If a task requires changing a calibrated table, update the code and note the spreadsheet source
