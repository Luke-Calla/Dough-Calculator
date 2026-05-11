# Pizza Dough Calculator

Static pizza dough calculator for the web.

This project preserves the spreadsheet-based dough and schedule model while presenting it as a zero-dependency frontend with a simple static-hosting footprint.

## Quick start

- Open `index.html` directly in a browser, or
- Serve the folder with any simple static server

There is no `package.json`, no build step, no bundler, and no backend.

## Main files

- `index.html`
  Main calculator page and output card structure.
- `style.css`
  Layout, design tokens, responsive rules, and component styling.
- `script.js`
  State, constants, calculations, rendering, and event wiring.
- `site-shell.js`
  Shared page-shell behavior such as the theme toggle.
- `how-it-works.html`
  Static explanatory page with shared navigation and theme behavior.

## Architecture rules

- Keep the project zero-dependency unless the user explicitly approves a different architecture.
- `state` in `script.js` is the single source of truth.
- Calculation paths must not read from the DOM.
- Internal units stay metric; conversions happen only at the display boundary.

## Docs map

- `docs/README.md`
  Documentation entrypoint and reading guide.
- `docs/spec/current-product-spec.md`
  Current shipped behavior and UI rules.
- `docs/spec/formulas-and-data.md`
  Math, constants, schedule logic, and model notes.
- `docs/code-map.md`
  Fast navigation map for the codebase.
- `docs/architecture/repo-structure-principles.md`
  General notes for organizing repos and choosing file boundaries.
- `docs/testing/manual-test-checklist.md`
  Manual validation checklist for UI and logic changes.
- `docs/changelog.md`
  Shipped user-visible changes.
- `docs/roadmap/backlog.md`
  Unshipped future work.

## Validation

Manual browser verification is the default path for this project.

After meaningful UI or logic changes, use `docs/testing/manual-test-checklist.md` and verify at least:

- IDY, fresh yeast, and sourdough modes
- preset/custom override behavior
- unit toggle behavior
- bake schedule output
- warm-up auto vs override behavior
- mobile layout and focused-input usability
- `how-it-works.html` parity when shared UI changes

## Structural note

The current two-page HTML structure is acceptable for this project and does not need to be split just because the files are moderately large.

Recent cleanup already moved active `how-it-works.html` page styles into `style.css` and shared page-shell behavior into `site-shell.js`.

If readability or maintenance becomes painful later, the next cleanup to consider is:

- continue modular cleanup inside `script.js` before splitting the HTML pages themselves
