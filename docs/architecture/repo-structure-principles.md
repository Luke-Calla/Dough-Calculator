# Repo Structure Principles

Reusable notes for organizing small and medium codebases so they stay easy to change over time.

## Main Goal

Structure a repo so the next change is obvious:

- where the code should live
- which file owns the behavior
- what can be reused safely
- what can change without surprising side effects

Good structure is mostly about reducing hesitation during future edits.

## Core Principles

### Organize By Responsibility

Prefer grouping code by what it does, not by how many lines it has.

Good examples:

- `calculator.js` for calculator-specific behavior
- `site-shell.js` for shared page-shell behavior
- `site.css` for shared styling
- `docs/spec/` for current behavior
- `docs/archive/` for old plans

Less helpful patterns:

- one giant file containing unrelated concerns
- lots of tiny files split before a clear boundary exists
- folders that mix active source, experiments, and archived notes

### Separate Feature Logic From UI Glue

Keep domain logic away from rendering and DOM wiring where possible.

A healthy split often looks like:

- state and calculations in one area
- rendering helpers in another
- event listeners near the edge of the app

This makes logic easier to trust, easier to test mentally, and safer to refactor.

### Keep Shared Shell Code Separate

Theme, nav, shared layout, and other cross-page behavior usually belong in a shared shell file rather than inside a feature file.

This helps avoid:

- loading feature code on pages that do not need it
- duplicating the same behavior across multiple HTML files
- mixing page-level concerns with app-specific logic

### Prefer One Source Of Truth

Important facts should have one owner.

Examples:

- one state object owns interactive values
- one stylesheet owns active shared styles
- one spec document describes current shipped behavior

When the same fact is maintained in multiple places, drift becomes likely.

### Extract Only After A Pattern Is Real

Duplication is not automatically a problem. Repeated code becomes a refactor target when:

- the same behavior exists in multiple places
- the same bug would need to be fixed twice
- the duplication is starting to slow changes down

Do not create abstractions only because code might grow later.

### Make File Names Explain Intent

The best file names tell future readers why a file exists.

Examples:

- `site-shell.js` is clearer than `theme.js` if the file may later own other shared page behavior
- `repo-structure-principles.md` is clearer than `notes.md`

Generic names like `script.js` and `style.css` are acceptable early on, but they become less helpful as a repo grows.

### Keep Active And Historical Docs Separate

Documentation is easier to trust when current source-of-truth docs are distinct from historical notes.

A practical pattern is:

- `docs/spec/` for shipped behavior and formulas
- `docs/architecture/` for durable technical decisions
- `docs/testing/` for validation steps
- `docs/roadmap/` for future work
- `docs/archive/` for old plans and superseded notes

### Optimize For Change, Not Perfection

The best structure is not the most abstract one. It is the one that makes common edits easy and uncommon edits understandable.

Ask:

- if I add a new page, where does shared behavior go?
- if I add a new feature, what file should own it?
- if I fix a bug, is there one clear place to do it?

If those answers are obvious, the structure is probably doing its job.

## Practical Heuristics

- If two pages need the same behavior, extract it.
- If one file changes for unrelated reasons, split it by responsibility.
- If a file name no longer matches its responsibility, rename it before it becomes misleading.
- If a file is large but internally cohesive, size alone is not a problem.
- If code is dead but hard to delete safely, quarantine it clearly and remove it later.
- If a doc is current, keep it out of `archive`.

## A Simple Default Layout

For small static or frontend-heavy repos, this is a solid baseline:

- `index.html` for the main entry page
- feature pages as separate `.html` files when needed
- one shared CSS file until styling boundaries become painful
- one feature-focused JS file per major app area
- one shared shell JS file for cross-page UI behavior
- `docs/` split by purpose rather than by chronology

## When To Rename Files

Rename a file when:

- its responsibility changed
- it is now shared more broadly than its name suggests
- new contributors would guess the wrong place to edit

Do not rename files just to sound more advanced. Rename them when the new name reduces confusion.

## Short Checklist

Before adding or moving code, ask:

1. Is this feature-specific or shared?
2. Is this domain logic or UI glue?
3. Does one place clearly own this behavior?
4. Will this filename still make sense six months from now?
5. Am I simplifying future edits, or just rearranging code?
