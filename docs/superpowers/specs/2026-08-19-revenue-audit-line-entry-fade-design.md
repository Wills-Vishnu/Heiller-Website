# Revenue Audit Line Entry Fade Design

## Goal

Soften the entrance of the Revenue Audit flow by fading the top of both the grey dashed track and the colored moving comet stream from transparent to fully visible.

## Visual Behavior

- The fade begins where the route first enters below the Revenue Audit heading.
- The first approximately 100px of the route transitions vertically from zero opacity to full opacity.
- The route is fully visible before it reaches the first audit row.
- Only the route entrance is affected. The remaining path, arrow, colors, comet cadence, tail length, and CTA arrival behavior stay unchanged.

## Implementation

Add an SVG `linearGradient` and `mask` inside the existing `.audit__flow` definitions. Wrap the `.audit__track` and `.audit__routes` elements in a masked group so the static dashed line and animated colored lines share the same spatial fade. Keep `.audit__arrow` outside the masked group because it sits at the route destination and should remain unchanged.

The mask gradient uses transparent black at the top, reaches full white at the end of the entry zone, and remains white for the rest of the SVG. Its dimensions are updated by the existing `build()` function so the fade uses approximately 100px on desktop and a shorter proportional distance on compact layouts.

## Responsive Behavior

- Desktop and tablet: target a 100px fade zone.
- Mobile: limit the fade zone to approximately 72px.
- The fade must remain attached to the measured start of the live SVG route after resize.

## Accessibility and Motion

The flow remains decorative and `aria-hidden`. The mask changes spatial opacity only and does not add motion. Existing reduced-motion behavior remains unchanged.

## Verification

- Confirm the masked group contains both `.audit__track` and `.audit__routes`.
- Confirm `.audit__arrow` remains outside the masked group.
- Confirm the mask gradient and mask dimensions are present.
- Visually verify the route fades in smoothly at desktop and mobile widths.
- Run the existing tests and production build.

