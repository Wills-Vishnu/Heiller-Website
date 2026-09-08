# Connector Comet Motion Design

## Goal

Make the colored signal travel smoothly along each dashed connector without looking like a rigid sliding line, while keeping the motion restrained and easy to follow.

## Approved visual treatment

- Use a headless wake made from six equal-sized `3px` circular micro-beads.
- Space the beads `96ms` apart, creating a `480ms` total wake—three times the previous `160ms` tail length.
- Fade the beads progressively from approximately `80%` to `10%` opacity so no particle reads as a distinct comet head.
- Keep every bead centered on the existing connector path, including its rounded corners.
- Use the source node's existing color for all six particles.
- Use opacity—not blur, glow, shadow, or a dominant bead size—to distinguish the wake.
- Preserve the current route sequence, animation duration, and connector geometry.

## Origin boxes

- Remove the CSS fill that currently overrides the inline SVG colors.
- Each tiny origin box must exactly match the background color of the name box it belongs to.
- Keep the origin boxes above the dashed track and preserve their current size and position.

## Accessibility and fallback

- Treat all signal beads as decorative and hide them from assistive technology.
- Continue hiding the moving signals when `prefers-reduced-motion: reduce` is active.
- The dashed connector tracks, arrows, labels, and colored origin boxes remain visible without animation.

## Verification

- Confirm that all six wake beads remain centered on horizontal, vertical, and curved path sections.
- Confirm that every wake contains six `3px` beads and spans `480ms` from first to last particle.
- Confirm that no particle uses a distinct head class, size, or treatment.
- Confirm that no `filter`, `box-shadow`, or `drop-shadow` is applied to the signal.
- Confirm all seven origin boxes match their corresponding node colors.
- Confirm animation sequencing remains readable and does not create simultaneous overlaps.
- Confirm the page builds and loads without browser console errors.

## Scope

Only the connector signals and origin-box color override are changed. Node layout, connector geometry, dashed tracks, arrowheads, typography, page spacing, and other sections remain unchanged.
