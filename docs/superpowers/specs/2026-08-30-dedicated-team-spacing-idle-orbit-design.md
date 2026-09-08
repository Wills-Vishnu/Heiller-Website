# Dedicated Team Spacing and Idle Orbit Adjustment

## Goal

Reduce the vertical gap above the Dedicated Team section and keep its pills moving slowly when the page is not scrolling.

## Spacing

- Reduce Services desktop bottom padding from `192px` to `96px`.
- Reduce Services tablet bottom padding from `96px` to `64px`.
- Reduce Services mobile bottom padding from `72px` to `48px`.
- Change Dedicated Team desktop top padding from `clamp(64px, 6vw, 112px)` to `clamp(40px, 3.5vw, 64px)`.
- Change Dedicated Team mobile top padding from `64px` to `40px`.
- Preserve the section's horizontal and bottom padding.

## Motion

- Add a clockwise idle angular velocity of `2π / 28` radians per second, completing one lap every 28 seconds.
- Keep the existing V3 scroll-derived angular velocity. Fresh scroll input temporarily accelerates the orbit or reverses its direction.
- When scroll input settles, damp the orbit back to the 28-second idle velocity.
- Animate only while the section is near the viewport and the page is visible.
- Keep `prefers-reduced-motion: reduce` completely stationary with no depth blur.

## Scope

- Modify only Dedicated Team spacing, the preceding Services bottom gap, orbit motion, and their regression tests.
- Preserve all labels, colors, grain, orbit geometry, layering, responsive layout, and unrelated V2 sections.

## Verification

- Confirm the visual gap is reduced on desktop and mobile.
- Confirm a complete idle revolution is mathematically 28 seconds.
- Confirm scrolling still accelerates or reverses the orbit.
- Confirm reduced-motion behavior remains stationary.
- Run all automated tests and the production build.

