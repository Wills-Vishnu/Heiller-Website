# Animated Landscape Footer Design

## Goal

Replace the current dark footer with a light editorial footer and an atmospheric animated landscape inspired by the supplied reference. The result must feel native to Heiller's existing visual language, use only real navigation destinations, and avoid unnecessary social or placeholder links.

## Structure

The footer will contain three vertical zones:

1. A light navigation area with the Heiller brand statement on the left and grouped navigation on the right.
2. A thin legal divider with the copyright line below it.
3. A full-width animated landscape field occupying the lower portion of the footer.

Navigation groups:

- Explore: Services, Results, Revenue audit
- Company: Who we help, Getting started
- Support: Questions, Get in touch

Every navigation item must point to an existing page anchor. No social buttons, placeholder URLs, invented contact information, or unsupported legal links will be added.

## Visual Direction

The upper footer will use a pale off-white surface, dark Heiller typography, generous but controlled whitespace, and compact link columns. The lower artwork will use layered, softly curved shapes in Heiller blue, lavender, coral, amber, and deep green. A fine grain overlay will connect the artwork to the existing hero and service gradients without reducing text legibility.

The footer should evoke the supplied landscape reference without copying its specific artwork. The shapes will be produced from CSS and inline SVG layers so they remain responsive and do not require a raster asset.

## Motion

Landscape layers will drift horizontally and vertically at different slow speeds to create depth. Movement must be continuous, low-amplitude, and atmospheric. There will be no abrupt scaling, bouncing, or cursor-driven behavior.

When `prefers-reduced-motion: reduce` is active, all landscape animation will stop while preserving the final composition.

## Responsive Behavior

- Desktop: brand column plus three navigation columns; wide landscape field.
- Tablet: brand remains separate while navigation columns tighten proportionally.
- Mobile: brand stacks above navigation; navigation uses two columns; landscape height is reduced to limit page length.
- The footer must not create horizontal overflow at 320px, 768px, 1024px, or 1440px.

## Accessibility

- Preserve semantic `footer` and `nav` elements.
- Keep visible keyboard focus styles on every link.
- Maintain WCAG AA text contrast in the light navigation area.
- Treat the animated landscape as decorative and hide it from assistive technology.
- Stop all decorative animation for reduced-motion users.

## Verification

- Confirm every footer anchor resolves to a real section.
- Confirm keyboard focus is visible across all footer links.
- Verify no horizontal overflow at the four target breakpoints.
- Verify landscape animation runs normally and stops under reduced motion.
- Run the existing test suite and production build.

