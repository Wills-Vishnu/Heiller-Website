# Revenue Audit Shader Copy Design

## Objective

Turn the supporting statement in the Revenue Audit heading into a deliberate two-line typographic partner to the main section heading. Fill only this supporting statement with the existing animated hero shader while keeping the left heading black.

## Approved copy

Line 1: `We find the revenue leaks.`

Line 2: `Then show you what to fix.`

The line break is explicit so the composition stays two lines rather than depending on viewport wrapping.

## Layout and typography

- Keep the current two-column audit heading grid on desktop.
- Align the top of the shader statement with the top of the left section heading.
- Use the same font family, weight, size, tracking, and line height as the left heading at every responsive breakpoint.
- Keep the left heading black. The shader applies only to the right statement.
- On tablet and mobile, retain the existing stacked heading layout. The shader statement follows the heading and uses the same responsive type scale.

## Shader treatment

- Reuse frames from the existing hero WebGL canvas rather than creating a second WebGL renderer.
- Add one presentation-only canvas over the right statement and mask the copied hero frame to the statement glyphs.
- Preserve the hero shader's animation, palette, grain, and timing exactly.
- Keep the real text in the DOM for accessibility and layout. Hide its painted glyphs only after the masked canvas has rendered successfully.
- Mark the presentation canvas `aria-hidden="true"`.
- Repaint after resize, font loading, and while the section is visible.
- When reduced motion is requested, render one shader frame without continuous repainting.
- If the hero canvas or 2D masking is unavailable, leave the approved deep-brown text visible and readable.

## Scope

This change affects only the Revenue Audit supporting statement. It does not recolor the left heading, change the hero shader, add a new shader preset, or alter the audit flow animation.

## Verification

- The statement is exactly two lines at desktop, tablet, and mobile widths.
- Its top edge aligns with the left heading on desktop.
- The shader is clipped cleanly to the glyphs with no rectangular canvas background.
- The statement remains readable if shader rendering does not initialize.
- Reduced-motion behavior is static.
- Existing automated tests and the production build pass.
