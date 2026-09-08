# Hero flow box scale motion design

## Goal

Bring the Heiller workflow boxes closer to the supplied 7.68-second reference. Neutral boxes should look smaller. When a box becomes active, or when a traveling arrow reaches it, the box should expand smoothly while its original color and matching glow appear. It should hold briefly, then return to its smaller neutral state as the sequence advances.

## Scope

- Change only the visual state animation of the eight workflow name boxes.
- Preserve the current labels, positions, route coordinates, arrow geometry, colors, gradient mappings, and 7.7-second sequence.
- Do not add JavaScript animation, dependencies, wrappers, images, or assets.
- Do not alter the hero layout or surrounding sections.

## Motion approach

Use CSS transforms on the existing `.tag` elements. The positioned 101 by 57 pixel box remains the fixed layout footprint, so the SVG routes and ports do not move. Only the rendered box scales from its center.

- Neutral state: `scale(0.86)`, grey fill, dark text, no glow.
- Arrival emphasis: expand through a restrained `scale(1.025)` overshoot as the destination arrow arrives.
- Active hold: settle at `scale(1)` with the box's original color and a soft matching halo.
- Exit: ease back to `scale(0.86)` while the fill returns to grey and the halo fades.
- Transform origin: center center.
- Easing: smooth ease-out for expansion and ease-in-out for return. There must be no bounce, sharp snap, or layout shift.

The visual maximum is approximately the box size used before this change. The smaller neutral state creates the size contrast rather than making active boxes crowd the routes.

## Sequence behavior

- `Patient` begins active in peach at full size.
- The active source remains at full size while its route travels.
- Near arrow arrival, the destination expands, reveals its own original color, and gains its matching halo.
- The destination becomes the next full-size source.
- The previous source shrinks and returns to neutral grey.
- The same behavior repeats through `Verify`, `Code`, `Claim`, `Process`, `Payment`, `Report`, and `Optimize`.
- `Optimize` expands in purple with white text, holds briefly, then returns to the smaller neutral state before the loop restarts.
- A destination may begin expanding while the previous source is easing out, creating a smooth handoff. Two boxes must not remain fully emphasized after the handoff.

## Timing

- Keep the existing 7.7-second master loop and all existing route and node delays.
- Each connection retains its approximately 1.1-second phase.
- Expansion and color arrival complete in roughly 180 milliseconds.
- The active box holds at full size and full color for roughly 0.8 seconds.
- The return to the neutral scale completes in roughly 180 milliseconds.
- The scale, fill, text color, and halo transitions must feel synchronized.

## Visual treatment

- Neutral boxes use the existing `#ECEEEE` fill and `#303433` text.
- Active boxes keep the existing original Heiller palette.
- Active Optimize keeps white text for contrast.
- Glows remain soft, wide, and derived from each node's original color.
- Scaling must not blur the text noticeably or move the visual center of a box.
- Ports, dashed tracks, traveling gradients, and destination-colored arrowheads remain unchanged.

## Responsive behavior

- Keep the fixed workflow geometry and existing responsive scale behavior.
- Use `transform-origin: center` so each box grows evenly in all directions.
- The active box and glow must not introduce horizontal or vertical page overflow.
- No box may overlap another box or obscure a route arrowhead at its maximum scale.

## Accessibility and performance

- Animate `transform`, background color, text color, and box shadow only.
- Add `will-change: transform` to the eight workflow tags to keep the scale handoffs smooth.
- Under `prefers-reduced-motion: reduce`, disable all box animation and show every box in the smaller neutral state with no glow.
- Keep the SVG wiring decorative and unchanged.

## Verification

- Every inactive box renders at `scale(0.86)`.
- Every box reaches its original color and approximately `scale(1)` during a complete loop.
- Each destination begins expanding when its arrow arrives.
- The expansion includes only a restrained `1.025` overshoot and no visible bounce.
- The active state holds for approximately 0.8 seconds before returning smoothly to neutral.
- Patient through Optimize all receive the same size behavior, with the existing dedicated start and terminal timing preserved.
- Optimize uses white text while purple and returns to dark text while neutral.
- Existing route gradients, arrow colors, labels, geometry, and loop order remain unchanged.
- Reduced motion shows eight smaller neutral boxes, no glow, and no animated transforms.
- The page has no new overflow, console warnings, or build errors.
