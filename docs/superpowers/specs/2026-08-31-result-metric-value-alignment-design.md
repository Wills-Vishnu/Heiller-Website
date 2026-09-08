# Result Metric Value Alignment Design

## Goal

Align each animated result value (`95%`, `5%`, `35`, and `96%`) to the same left edge as its title and description.

## Approved Behaviour

- In the four `.v3-metrics` result cards, render the metric-mesh text with left alignment at the canvas origin.
- Keep the value container, card padding, typography, texture animation, and vertical spacing unchanged.
- Preserve the fallback text's existing left alignment so animated and fallback states share the same position.
- Keep every metric-mesh value outside `.v3-metrics`, including workflow ledger numbers, centered as it is today.
- Apply the same behavior at desktop, tablet, and mobile widths.

## Implementation Boundary

The shared `paintTarget` renderer in `metric-mesh.js` will detect whether the current target is inside `.v3-metrics`. Result-card targets use `context.textAlign = "left"` and an x-coordinate of `0`; other targets retain `context.textAlign = "center"` and `width / 2`.

## Verification

- Add a focused source contract covering both the result-card left-aligned branch and the centered default branch.
- Run the complete test suite and production build.
- In the browser, compare the rendered left edge of each result value canvas with its card title at desktop and mobile widths.
- Confirm workflow numbers remain centered, the console is clean, and there is no horizontal overflow.
