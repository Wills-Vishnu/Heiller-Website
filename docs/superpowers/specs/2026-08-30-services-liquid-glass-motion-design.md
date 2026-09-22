# Services Liquid-Glass Motion Adjustment

## Objective

Refine the existing liquid-glass treatment in the lower-left Services artwork without changing the surrounding Services grid, copy, contact action, or standalone demo.

## Alignment

The “Talk to us now” capsule must remain geometrically centered on both axes of `.services__visual`. Pointer-driven translation may temporarily offset it by the existing bounded spring distance, but its resting position must return to the exact center.

## Background Motion

The flowing green, cream, and cyan field will use a six-second alternating animation cycle. Its motion will have a rubber-band character: a fast initial pull, a small overshoot beyond the destination transform, a counter-settle, and a final resting transform before reversing.

The backdrop will use explicit multi-stop keyframes rather than a single easing curve so the overshoot remains controlled. The image field may rotate, translate, and stretch slightly, but it must continue covering the complete Services artwork without exposing an edge.

## Accessibility and Verification

- Preserve the static background and static button transform under `prefers-reduced-motion: reduce`.
- Confirm exact resting center alignment at desktop and mobile widths.
- Confirm no horizontal overflow or console errors.
- Run the complete test suite and production build.
