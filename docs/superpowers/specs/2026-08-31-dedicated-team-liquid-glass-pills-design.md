# Dedicated Team Liquid-Glass Pills Design

## Goal

Restyle all nine orbiting Dedicated Team pills with the same transparent liquid-glass language used by the hero workflow pills, without changing the orbit animation or section layout.

## Scope

Apply the treatment only to the nine `.dedicated-team__pill` elements: Credentialing, Patient registration, Coding, Billing, Denial management, A/R follow-up, Eligibility, Revenue reporting, and Authorization.

Preserve every label, its existing `--pill-from`, `--pill-to`, and `--pill-accent` palette, the nine-pill count, orbit geometry, 28-second idle speed, scroll response, foreground/rear depth, mobile blur, and section layering.

## Visual Treatment

Replace each opaque gradient surface with a translucent glass base softly tinted by its three existing palette variables. Match the hero glass language through:

- A fully rounded pill radius.
- A translucent tinted background that remains visibly transparent.
- `backdrop-filter` and `-webkit-backdrop-filter` blur and saturation.
- A thin bright outer border.
- Layered inset highlights and a soft exterior shadow.
- A `::before` colored highlight layer and a `::after` inset edge/grain layer.
- A dedicated label span positioned above both decorative layers.

Keep dark label text for every pill, including Authorization. The glass layers must not reduce text legibility when a pill moves across the grey logo, white field, or heading.

## Motion and Layering

Do not change `dedicated-team.ts`. The existing controller continues to own transforms, z-index values, scroll acceleration, responsive orbit radii, and mobile blur.

The glass styling must remain compatible with `filter: blur(...)` applied directly by the orbit controller. Rear pills stay at `z-index: 1`, the heading at `3`, and foreground pills at `4`; the logo remains at `0`.

Do not add hover, pointer, press, tilt, or JavaScript interactions. The pills remain decorative and the containing pill layer remains `pointer-events: none`.

## Pill Sizing

Increase the pills through internal padding only so their labels, glass layers, and natural content widths stay proportional:

- Desktop and tablet: change `padding: 9px 16px 10px` to `padding: 12px 20px 13px`.
- At `767px` and below: change `padding: 7px 11px` to `padding: 9px 14px`.

Keep the current desktop/tablet font scale and mobile `font-size: 9px`. Do not introduce fixed widths, fixed heights, or additional transform scaling.

## Responsive and Fallback Behavior

At `767px` and below, use the approved `padding: 9px 14px` while preserving `font-size: 9px`.

The same glass radius, border, layers, and label hierarchy apply at every width. Provide a solid translucent fallback for browsers without backdrop-filter support.

## Testing and Verification

- Assert that all nine exact pill labels remain present and each is wrapped once in `.dedicated-team__pill-label`.
- Assert the translucent background, bright border, `backdrop-filter`, `-webkit-backdrop-filter`, rounded radius, inset shadow, and exterior shadow.
- Assert both decorative pseudo-elements exist and use `pointer-events: none`.
- Assert the label is above both decorative layers.
- Assert the unsupported-backdrop-filter fallback exists.
- Assert desktop/tablet padding is `12px 20px 13px` and mobile padding is `9px 14px`.
- Assert the orbit controller remains unchanged in behavior and contains no pointer event handling.
- Run the full Node test suite and Vite production build.
- Verify desktop, 768px, 393px, and 320px layouts in the live browser.
- Confirm nine pills, preserved depth values, active orbit motion, mobile blur, readable labels, zero overflow, and zero console errors.

## Out of Scope

- Changes to the hero or Services liquid-glass components.
- Changes to pill labels, palettes, count, orbit speed, geometry, or blur calculations.
- Interactive pointer physics or new JavaScript.
- Changes to the logo, heading, section dimensions, or adjacent sections.
