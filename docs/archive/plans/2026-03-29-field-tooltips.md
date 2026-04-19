# Field Tooltips Implementation Plan

Historical implementation plan.

## Status

- Date: 2026-03-29
- State: implemented
- Do not use this file as the current source of truth
- Current behavior is documented in `docs/spec/current-product-spec.md` and reflected in code

## Summary

This plan covered the original implementation of tooltip support for:

- Feed Ratio
- Starter Hydration %
- Starter %
- Fridge Time

The implemented approach was:

- Add an `icon-info` symbol to the SVG sprite
- Add tooltip button and popover markup near the relevant labels
- Add shared tooltip CSS
- Add one shared JS block for open/close behavior

## Why This File Still Exists

It can be useful as a historical artifact when tracing how the tooltip feature was introduced, but it should not guide new work unless that work specifically involves understanding the original implementation path.
