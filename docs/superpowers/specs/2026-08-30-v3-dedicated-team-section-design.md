# V3 Dedicated Team Section in V2

## Goal

Insert V3's “A dedicated team, fully embedded” orbiting-pill section into V2 as the third major content section.

## Placement

The new section appears immediately after V2's Services section and before Results. Existing section IDs, navigation targets, and surrounding content remain unchanged.

## Visual Design

- White section background.
- Centered two-line heading: “A dedicated team,” and “fully embedded”.
- Eight pill labels copied from V3: Credentialing, Patient registration, Coding, Billing, Denial management, A/R follow-up, Eligibility, and Revenue reporting.
- Preserve V3's pill gradients, accent highlights, grain texture, typography, sizing, rounded shape, and front/back stacking.
- Preserve V3's desktop and mobile section dimensions, orbit radii, spacing, and responsive type scale.

## Heading Scale Adjustment

- Reduce the center heading by exactly `5px` at every responsive size.
- Change the desktop/fluid scale from `clamp(41px, 5.1vw, 88px)` to `clamp(36px, calc(5.1vw - 5px), 83px)`.
- Change the mobile override from `41px` to `36px`.
- Preserve the heading’s two-line copy, line height, tracking, alignment, width, and orbit geometry.

## Motion

- Port V3's orbit geometry and scroll-responsive angular velocity into V2's existing browser JavaScript.
- Pills accelerate in the direction and proportion of scrolling, then settle smoothly.
- Animation runs only while the section is near the viewport and the page is visible.
- Recalculate orbit geometry when the section resizes.
- On mobile, pills behind the heading receive V3's depth blur and stacking behavior.
- With `prefers-reduced-motion: reduce`, pills retain a stable orbit arrangement without animated movement or depth blur.

## Implementation Boundaries

- Implement natively in V2's existing HTML, CSS, and JavaScript.
- Do not add React, GSAP, or another runtime dependency.
- Reproduce the relevant V3 calculations and behavior without changing unrelated V2 sections.
- Decorative pills are hidden from assistive technology; the section heading remains semantic and addressable through `aria-labelledby`.

## Verification

- Verify placement between Services and Results.
- Verify all eight labels and palettes.
- Compare desktop behavior at 1440px with V3.
- Verify the computed heading size is exactly `5px` smaller than the previous responsive value at desktop, tablet, and mobile widths.
- Verify mobile layout and depth blur at 393px and a narrow 320px viewport.
- Verify reduced-motion behavior.
- Run V2's production build and automated tests.
