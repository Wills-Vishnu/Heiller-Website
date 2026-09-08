# Dedicated Team Inline Logo Design

## Goal

Add the supplied Heiller SVG mark as a considerably larger, very light-grey focal element behind the “A dedicated team, fully embedded” heading while preserving the section’s orbiting depth effect. Add “Authorization” as a ninth orbiting service pill.

## Source Asset

Use the exact path and `viewBox` from `C:/Users/Jijin/Downloads/SVG@2x (2).svg`. Embed the SVG directly in the Dedicated Team field rather than loading it as an image or CSS mask.

The inline SVG is decorative:

- Apply `aria-hidden="true"`.
- Apply `focusable="false"`.
- Do not add a title or accessible name.
- Keep pointer events disabled.

## Mark Appearance

The SVG path uses a CSS-controlled light-grey fill of `#F1F2F4`. The mark remains flat and unanimated so it acts as a stable visual anchor behind the moving pills.

The mark is centered on both axes within `.dedicated-team__field` and retains its square aspect ratio. Its responsive width is:

- Desktop and tablet: `clamp(360px, 54vw, 760px)`.
- Mobile at `767px` and below: `min(92vw, 420px)`.

No transform-based text scaling or rasterization is introduced; the inline vector must remain crisp at every size.

## Layering

The section uses four explicit visual levels:

1. The inline grey logo at `z-index: 0`.
2. Rear orbiting pills at `z-index: 1`.
3. The centered heading at `z-index: 3`.
4. Foreground orbiting pills at `z-index: 4`.

Update `getOrbitDepth(x)` to return `1` for rear pills and `4` for foreground pills. Preserve the existing rule that horizontal orbit position determines which depth a pill occupies.

The headline and every pill must remain above the mark. Pills continue to pass behind and in front of the headline as they orbit.

## Authorization Pill

Add one pill with the exact visible label “Authorization” to the existing service-pill collection. Use the same markup, animation, blur, depth, typography, and responsive sizing as the other pills.

Give the new pill a soft lavender-to-indigo gradient using `--pill-from: #C8BBFF`, `--pill-to: #8F79F2`, and `--pill-accent: #E0D5FF` so it is distinct but remains within the section’s current palette.

Increase `PILL_COUNT` from `8` to `9`. Keep the existing start angle and use the current single-orbit positioning algorithm, which distributes the nine pills at equal 40-degree intervals. Do not create a second orbit or special-case the new pill’s position.

## Responsive Behavior

Preserve the current Dedicated Team field height, heading scale, orbit radii, mobile pill blur, section spacing, and reduced-motion behavior.

At 320px and 393px:

- The logo remains centered and nearly fills the available field width.
- The logo stays within the section without creating horizontal overflow.
- The heading remains readable against the light-grey fill.
- Orbiting pills remain visible at their existing responsive sizes and continue using rear/foreground depth.
- All nine pills remain evenly distributed on the same orbit without horizontal overflow.

## Testing and Verification

- Add structural assertions for one inline `.dedicated-team__mark` SVG with `aria-hidden="true"`, `focusable="false"`, and the supplied `viewBox`.
- Assert the light-grey fill and responsive desktop/mobile widths.
- Assert that the pill collection contains nine entries, including exactly one pill labelled “Authorization”.
- Assert that the orbit code uses `PILL_COUNT = 9` while retaining the existing start angle and positioning algorithm.
- Update depth tests so `getOrbitDepth()` is verified to return `1 | 4`.
- Run the complete Node test suite and Vite production build.
- Verify the live section at 320px, 393px, tablet, and desktop.
- Confirm the mark and heading centers differ by no more than one CSS pixel.
- Confirm the heading and every orbiting pill render above the mark.
- Confirm no horizontal overflow or browser console errors.

## Out of Scope

- Changes to the supplied SVG geometry.
- Animation of the logo.
- Changes to heading copy, typography, or section dimensions.
- Changes to existing pill copy or colors, orbit speed, orbit radii, or blur calculations.
- Changes to adjacent sections.
