---
name: update-design-doc
description: Update the design document after shipping changes — both the Build Status log and any spec sections that no longer match the implementation
---

The design document is at `design-document.md` (in the repo root — full path: `Pizza Dough Fermentation/Website Version/Code/design-document.md`).

This skill has two parts. Run both every time.

---

## Part 1 — Update spec sections to match the implementation

Read `git diff HEAD~1` (or the relevant commits) to understand what changed. Then identify which spec sections in the design document describe that behaviour, and check whether they still accurately describe the code.

**What to look for:**

- Field names, labels, or UI copy that changed (e.g. "Flour (add)" → "Flour")
- Input layout changes (e.g. inputs moved to a new card)
- Removed or added UI elements (e.g. a detail block that was deleted)
- Calculation changes — formulas, table values, rounding behaviour
- Data structures or state shape that changed
- Display formatting changes (e.g. "rounded to 1 decimal place" → "rounded to nearest 30 min")

**How to update:**

- Edit only the sentences, rows, or code blocks that are factually wrong
- Keep the section structure intact — do not rewrite sections wholesale
- If a spec section accurately describes the code, leave it alone
- If a spec section describes something that was intentionally removed, remove or replace that description

---

## Part 2 — Update the Build Status section

- Move any resolved bugs from "Known bugs / pending fixes" to "Completed (post-launch iterations)"
- Add any new features or changes shipped since the last update as concise one-line entries under "Completed (post-launch iterations)"
- If no bugs remain, leave the "Known bugs / pending fixes" section empty (keep the heading)
- Keep all entries brief — one line each
- Update the date in the final line: `*Document last updated March 2026.*` to today's date
