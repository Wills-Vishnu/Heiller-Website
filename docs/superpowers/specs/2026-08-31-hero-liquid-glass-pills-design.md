# Hero Liquid-Glass Pills Design

## Goal

Replace the eight flat rectangular workflow nodes in the hero process diagram with compact, transparent liquid-glass pills derived from the existing “Talk to us now” glass treatment.

## Scope

Apply the treatment only to the eight `.flow__tags .tag` nodes labelled Patient, Verify, Code, Claim, Process, Payment, Report, and Optimize. Preserve their copy, order, dimensions, desktop/tablet coordinates, mobile grid placement, connecting route, animation timing, and accessibility behavior.

## Visual Treatment

Keep each node’s existing `--node-color` as its active tint. Replace the opaque neutral rectangle with a translucent neutral glass base and use the node color as a subtle internal glow during the existing breathing sequence.

Each node must use:

- A pill radius of `999px` at every viewport size.
- A translucent white base rather than an opaque grey fill.
- `backdrop-filter` and `-webkit-backdrop-filter` blur/saturation treatment.
- A thin bright outer border.
- Layered inset highlights and a soft exterior shadow adapted from `.services-liquid-glass__surface`.
- A `::before` highlight/glow layer and `::after` inset edge layer, both non-interactive.
- A readable dark label above both decorative pseudo-elements.

The glass must remain visibly transparent against the hero background. The active tint should support the route animation without turning the node into an opaque colored block.

## Motion and Interaction

Retain the existing `node-breathe` animation and `--node-delay` sequence. Update its visual states to animate glass tint, border, and shadow while preserving its current 7.7-second timing and scale behavior.

Do not attach the interactive pointer tilt, press physics, or JavaScript from the Services button. The workflow nodes are informational rather than controls, and all eight should remain non-interactive.

Preserve the existing reduced-motion behavior. When motion is reduced, the nodes remain static glass pills with no new animation.

## Responsive Behavior

Preserve the 1079-by-275 desktop route geometry and the proportional tablet layout. At `640px` and below, preserve the current two-column grid and hidden wire layer.

Remove the tablet rule that restores a small rectangular radius. All responsive rules must retain the `999px` pill radius. Existing node widths, heights, font sizes, and mobile gaps remain unchanged.

Provide a solid translucent fallback for browsers that do not support backdrop filters; labels must remain readable and the active tint must still be visible.

## Testing and Verification

- Assert that hero workflow nodes use the liquid-glass border, blur, inset highlight, shadow, and `999px` radius.
- Assert that both decorative pseudo-elements exist and do not intercept pointer events.
- Assert that the eight exact labels and eight-node count remain unchanged.
- Assert that no pointer-interaction JavaScript is attached to hero nodes.
- Assert that tablet and mobile rules preserve pill radii and the existing responsive route/grid structure.
- Run the full Node test suite and Vite production build.
- Verify desktop, 768px, 393px, and 320px layouts in the live browser.
- Confirm the route animation, colored active states, label contrast, zero horizontal overflow, and zero browser console errors.

## Out of Scope

- Changes to the Services liquid-glass contact action.
- New hero node labels, route geometry, or animation timing.
- Interactive hover, pointer, tilt, or press physics.
- Changes to the hero heading, subtitle, background, trust panel, or following sections.
