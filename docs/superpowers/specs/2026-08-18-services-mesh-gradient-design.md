# Services Mesh Gradient Design

## Goal

Fill the empty lower-left area of the Services grid with the supplied 21st.dev “Mesh drift” shader while preserving the existing layout, borders, typography, hero shader, and service cards.

## Project Context

The current `/design/` page is a standalone HTML page built by Vite and TypeScript. It does not use React, Tailwind CSS, or shadcn. The supplied shader has no third-party runtime dependencies, so it will be adapted to the page’s existing vanilla WebGL pattern rather than introducing or migrating frameworks for this isolated visual.

## Visual Design

- A decorative canvas fills the complete lower-left Services grid cell beneath the 356px introduction block.
- The canvas is clipped to the cell and does not cover the introduction, service cards, or surrounding borders.
- The supplied green palette remains unchanged.
- Grain is reduced from `0.091` to `0.050`, matching the existing hero shader.
- Motion remains continuous but ambient, using the supplied `0.727` time scale.
- The shader does not react to pointer input.

## Structure

- Add a dedicated lower-left visual element after `.services__intro`.
- Keep `.services__inner` as the two-column grid.
- Place the visual in column one, row two, with its height derived from the remaining Services frame height.
- Keep `.cards` spanning both grid rows in column two.
- Add a single decorative `<canvas>` with `aria-hidden="true"`.

## WebGL Lifecycle

- Initialize a separate WebGL context for the Services canvas.
- Compile the supplied vertex and fragment shaders without external dependencies.
- Resize using `ResizeObserver`, capped by the same two-million-pixel budget used by the hero shader.
- Render continuously while the canvas is visible and the document is active.
- Pause rendering when offscreen or when the document is hidden.
- For `prefers-reduced-motion: reduce`, render one frame and stop continuous animation.
- If WebGL is unavailable or shader compilation fails, leave the cell white without affecting page content.

## Isolation

- Do not modify the approved hero shader or its uniforms.
- Do not add React, Tailwind, shadcn, image assets, icons, or packages.
- Do not alter the HIPAA/Services outer alignment or the service-card dimensions.

## Verification

- Production build succeeds.
- Canvas occupies the entire lower-left cell and remains within its borders.
- Introduction and eight service cards retain their current geometry.
- Grain uniform is `0.050` and time scale is `0.727`.
- Animation advances across frames under normal motion settings.
- No horizontal overflow or card overflow is introduced.
- Browser console remains free of new errors and warnings.

