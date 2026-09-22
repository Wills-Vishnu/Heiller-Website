# Audit Route Number Alignment Design

## Goal

Reduce the horizontal span of the animated dashed audit route on desktop and tablet so its alternating turns align with the visible audit number columns instead of sitting close to the page rails.

## Approved Geometry

- Above the mobile breakpoint, measure the live horizontal center of the first left-side audit number (`01`) and the first right-side audit number (`02`). Apply those centers only while the responsive layout presents them as distinct left and right columns.
- Use those measured centers as the shared left and right boundaries for every alternating horizontal pass of the route.
- Continue measuring relative to `.future-section__inner`, matching the existing SVG coordinate system.
- Preserve the route's current start position, row-divider vertical positions, rounded corners, entry fade, comet animation, and final travel to the CTA center.
- At the mobile breakpoint (`max-width: 640px`), retain the existing left and right route coordinates without alteration.

## Responsive and Runtime Behaviour

The route continues to rebuild from live layout measurements on initial render, after fonts load, on window load, and through the existing resize handling. Number-center measurements therefore follow responsive typography and layout changes without fixed pixel assumptions.

If the number elements are unavailable or the responsive layout has stacked them into one column, the route falls back to its current rail-adjacent coordinates so the animation remains functional.

## Scope

Only the audit route's desktop and tablet horizontal boundaries change. Number placement, ledger content, divider styling, CTA placement, SVG styling, animation timing, and mobile presentation remain unchanged.

## Verification

- Add a contract test proving desktop/tablet route boundaries are derived from the centers of `01` and `02`.
- Confirm the mobile branch retains the existing route-coordinate calculation.
- Run the complete test suite and production build.
- Verify the audit section in the browser at desktop, tablet, and mobile widths, including a clean console and no horizontal overflow.
