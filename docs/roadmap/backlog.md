# Backlog

**Status:** Unshipped work only
**Purpose:** Keep future work separate from the current product spec

## Next Up

### URL sharing

Allow the current recipe state to round-trip through query parameters.

Scope:
- Serialize active recipe and fermentation state into the URL
- Omit preset-backed values unless overridden
- Support sourdough-specific fields when relevant
- Load state from URL on page load
- Show a lightweight banner when a recipe is loaded from a shared link

Notes:
- Architecture is already ready for this feature
- Bake hour and AM/PM should stay personal and remain excluded

### How It Works page

Add a second static page explaining the fermentation model.

Scope:
- What baker's percentages are
- How time and temperature affect fermentation
- What the lookup tables represent
- Yeast vs sourdough differences

### Ball weight to diameter

Surface the relation between dough ball weight and expected pizza diameter.

Options:
- Read-only estimated diameter beside ball weight
- Editable diameter field with two-way sync

Preferred direction:
- Editable field, if complexity stays manageable

## Lower Priority

- Metric/imperial toggle
- Portioning step in bake schedule
- Copy/export as plain text
- Local saved recipes via `localStorage`
- Output precision controls
- Accessibility polish
- Print layout mode toggle

## Not In Scope

- Accounts
- Backend persistence
- New dependencies or frameworks without explicit approval
