# Hero flow reference motion design

## Goal

Replace the current hero workflow animation on `/design/` with the visual behavior shown in `20260818-0302-37.6740671.mp4`. The Heiller labels and route geometry remain unchanged, but the node states, line travel, arrow animation, glow, sequencing, and loop should match the reference.

## Reference behavior

- Inactive name boxes are neutral light grey rather than permanently colored.
- One box is the active source at a time. It reveals its original Heiller fill color and a soft halo derived from the same color.
- The next destination briefly brightens in its own original color with a matching halo as the connection reaches it.
- A solid source-to-destination color gradient travels over the existing grey dashed path.
- The colored route follows the full path curvature and continues through the arrowhead without a detached head, bead, dot, stick-like trail, or shadow.
- After arrival, the destination remains in its original color as it becomes the source for the next connection.
- The previous source returns to neutral grey.
- The sequence advances continuously from `Patient` through `Verify`, `Code`, `Claim`, `Process`, `Payment`, `Report`, and `Optimize`, then loops.

## Implementation approach

- Keep the existing HTML workflow labels and SVG route geometry.
- Keep the grey dashed `.wire-track` paths as the persistent inactive network.
- Replace `.signal-group`, `.signal`, `.wire-pulse`, and `.wire-arrow-pulse` with one synchronized SVG overlay per route and arrow.
- Define seven direction-aware SVG gradients with `gradientUnits="userSpaceOnUse"`, using each source and destination box color at the matching route endpoints.
- Use SVG `pathLength`, `stroke-dasharray`, and `stroke-dashoffset` animation so the solid overlay draws directly along each route.
- Use CSS custom properties for each route index and node index so all motion shares one approximately `7.7s` timeline.
- Use synchronized CSS keyframes for three states: source active, route traveling, and destination arrival.
- Do not add a JavaScript animation loop, canvas layer, third-party dependency, or new asset.

## Visual treatment

- Inactive box fill: neutral light grey matching the reference.
- Inactive text: the current dark body color.
- Original box palette: Patient `#FFAB8D`, Verify `#FC7EC7`, Code `#B3A5F5`, Claim `#B4E7BC`, Process `#96D7FF`, Payment `#FAE261`, Report `#97B6FF`, and Optimize `#4A2A76`.
- Active and arrival fills use the box's original color.
- Active and arrival glows use a wide, low-opacity version of the same original color with no hard edge.
- Active Optimize text changes to white; all other active text remains dark.
- Persistent path: retain the current thin grey dashed stroke.
- Traveling path: a clean solid gradient stroke from the source box's original color to the destination box's original color.
- Each arrowhead finishes in the destination box's original color.
- Persistent ports remain small neutral grey squares; active source and arrival ports inherit their corresponding box colors.
- The existing box size, typography, positions, labels, route geometry, and hero layout do not change.

## Timing and sequence

- One complete loop lasts approximately `7.7s`, matching the reference recording.
- Seven route phases divide the loop evenly at approximately `1.1s` each.
- At the start of a phase, the source box reveals its original color.
- The solid route draws smoothly from the source port toward the arrow using a restrained ease-in-out curve.
- As the route reaches the arrow, the arrowhead colors as part of the same motion.
- The destination brightens in its original color with a soft matching halo near arrival.
- The destination remains in its original color as it becomes the next source while the previous source returns to grey.
- The next phase begins without a dead pause or abrupt reset.
- The `Optimize` arrival completes before the entire sequence loops back to `Patient`.
- Use dedicated start and terminal node states so `Patient` starts in peach and `Optimize` settles in purple before the next loop; never show two active source boxes at once.

## Responsive behavior

- Preserve the current workflow scale and geometry at existing breakpoints.
- Animation timing remains consistent across viewport sizes.
- No glow may cause horizontal or vertical page overflow.
- No extra motion is introduced outside the hero workflow.

## Accessibility and performance

- Treat all motion as decorative and retain `aria-hidden="true"` on the wiring layer.
- When `prefers-reduced-motion: reduce` is active, hide traveling overlays and glows, keep every node neutral grey, and leave the dashed workflow readable.
- Animate only SVG stroke properties, opacity, background color, and filtered halo opacity.
- Avoid layout-affecting animation and JavaScript frame work.

## Verification

- Inactive boxes are neutral grey.
- Only the current source and arriving destination reveal original colors; all other boxes remain neutral grey.
- Across a complete loop, the maximum number of simultaneous active source boxes is one.
- Each solid traveling line blends from its source box color into its destination box color.
- Each arrowhead resolves in the destination box color.
- The colored stroke follows curves and passes through each arrowhead cleanly.
- There are no beads, dots, comet heads, detached trails, or persistent colored boxes.
- The seven connections play sequentially in the correct order and loop in approximately `7.7s`.
- The existing labels, geometry, layout, and hero content remain unchanged.
- Reduced motion shows the static neutral workflow without traveling lines or glow.
- The production build passes and the live page has no new overflow or runtime errors.
