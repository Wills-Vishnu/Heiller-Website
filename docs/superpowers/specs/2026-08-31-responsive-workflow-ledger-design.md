# Responsive Workflow Ledger Design

## Goal

Refine the existing “We work as an extension of your team” workflow ledger so each animated number aligns precisely with its label and the alternating serpentine composition remains intact on mobile.

## Scope

- Preserve the existing six workflow stages, semantic ordered-list markup, route palette, scroll progress behavior, metric-mesh number treatment, CTA, and reduced-motion behavior.
- Change the number sizing and responsive ledger layout only.
- Do not add duplicate mobile markup or a second animation implementation.
- Do not change the surrounding Why or Results sections.

## Number and Label Alignment

The fixed `3ch` width on `.v3-ledger__index` will be removed. Each number will use its intrinsic inline width so the visible glyphs, fallback text, and metric-mesh canvas share the smallest box required by the two-digit value.

Each `.v3-ledger__stage` remains a vertical group:

- Odd, left-side stages align both the number and label to the group’s right edge.
- Even, right-side stages align both the number and label to the group’s left edge.

This makes left-side numbers end where their labels end and right-side numbers begin where their labels begin.

## Responsive Composition

The current mobile rule that hides `.v3-ledger__flow` and converts rows into a dashed single-column list will be removed. The same two-column alternating grid and measured SVG route will render at every supported width.

At `767px` and below:

- Retain the odd/even column assignments and left/right text alignment.
- Keep the route visible and driven by the existing scroll-progress animation.
- Reduce horizontal gap, row padding, number size, label size, and route amplitude to fit the narrower frame.
- Constrain stage width so labels may wrap naturally to no more than two lines in the supplied copy.
- Keep the CTA full-width below the route, as in the existing mobile presentation.
- Remove the dashed row borders because the animated route remains the visual connector.

The composition must fit at `320px` without horizontal overflow. “Coding and claim preparation” may wrap to two lines; labels are not required to remain on one line.

## Animation and Geometry

The existing `workflow-ledger.js` measurement and scroll animation remain the source of truth. It will continue measuring row centers, the host center, and the CTA endpoint after responsive layout changes.

The serpentine amplitude will remain fluid and will be allowed to reduce further on narrow screens so the path stays proportional to the smaller two-column gap. Resize observation and font-ready remeasurement continue to update the SVG geometry after wrapping or viewport changes.

For `prefers-reduced-motion: reduce`, the route remains fully drawn and static. The number mesh retains its existing reduced-motion frame behavior.

## Accessibility

- Preserve the semantic `<ol>` and six `<li>` workflow stages.
- Keep the SVG decorative with `aria-hidden="true"`.
- Keep label text as headings and preserve DOM order from stage 01 through stage 06.
- Do not use transforms to scale text, ensuring crisp rendering and reliable browser zoom behavior.

## Verification

- Add a structural regression assertion that mobile retains the grid and visible flow rather than the dashed stacked fallback.
- Keep the existing route geometry and scroll-progress tests passing.
- Verify live layout at `320px`, `393px`, tablet, and desktop widths.
- Confirm odd-row number and label right edges match and even-row number and label left edges match within one CSS pixel.
- Confirm the longest mobile label wraps to no more than two lines.
- Confirm the route remains visible, animates toward the CTA, and remeasures after viewport changes.
- Confirm no horizontal overflow or browser console errors.
- Confirm reduced motion shows the completed static route.

## Out of Scope

- Copy changes.
- Changes to the metric-mesh palette or shader.
- Changes to the Why, Results, or Revenue Audit sections.
- New dependencies or duplicated mobile content.
