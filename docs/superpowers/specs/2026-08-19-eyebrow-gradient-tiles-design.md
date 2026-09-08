# Eyebrow Gradient Tiles

## Objective

Replace the flat cyan square preceding each eyebrow label with a small rounded-square gradient tile inspired by the supplied reference image.

## Scope

- Apply to all eight existing `.eyebrow` labels.
- Preserve the current eyebrow typography, spacing, and HTML structure.
- Do not add image assets, WebGL contexts, icons, or JavaScript.

## Visual treatment

- Tile size: 12px by 12px.
- Shape: rounded square with a 4px corner radius.
- Use three static CSS gradient variants:
  1. Blue and violet with a soft cyan edge.
  2. Coral and gold with a soft pink highlight.
  3. Blue and cream with a pale yellow highlight.
- Rotate the variants across sections using `:nth-of-type` selectors so adjacent sections do not repeat the same palette.
- Retain cyan as the solid background fallback before the gradient declaration.
- No animation or shadow outside the tile.

## Responsive behavior

The tile keeps the same dimensions at every breakpoint. It remains aligned to the eyebrow text and must not alter line wrapping or section spacing.

## Verification

- Confirm all eight eyebrow labels display a rounded gradient tile.
- Confirm the three palettes rotate across the page.
- Check desktop and mobile layouts for unchanged label alignment and no overflow.
- Run the existing production build.
