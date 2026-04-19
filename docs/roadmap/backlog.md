# Backlog

Unshipped work only.

## When To Read This File

Read this file when discussing future features, prioritization, or scope boundaries. Do not treat anything here as already shipped behavior.

## Purpose

Keep future work separate from the current product spec so implementation context stays clean.

## Priority Now

### URL Sharing

Allow the current recipe state to round-trip through query parameters.

Scope:

- Serialize the active recipe and fermentation state into the URL
- Omit preset-backed values unless the user has overridden them
- Include sourdough-specific fields only when relevant
- Load state from the URL on page load
- Show a lightweight banner when a shared recipe is loaded

Notes:

- The current state architecture is already compatible with this direction
- Personal schedule preferences like bake hour and AM/PM should remain excluded

### Ball Weight To Diameter

Expose the relationship between dough-ball weight and expected pizza diameter.

Options:

- Read-only estimated diameter beside ball weight
- Editable diameter field with two-way sync

Preferred direction:

- Editable diameter, only if the implementation stays simple and predictable

## Lower Priority

- Portioning step in bake schedule
- Copy/export as plain text
- Local saved recipes via `localStorage`
- Output precision controls
- Accessibility polish
- Print layout mode toggle

## Internal Quality Follow-Ups

These are code-quality improvements rather than shipped user features.

- Add a small dev-facing invariant checker for high-risk state and calculation assumptions
- Refactor `updateOutputs()` into smaller display-sync helpers to reduce maintenance risk
- Add a lightweight manual console test harness for core calculation paths

## Explicitly Out Of Scope

- Accounts
- Backend persistence
- Framework migration
- New dependencies without explicit approval
