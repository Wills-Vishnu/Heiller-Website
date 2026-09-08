# Services Paper Mesh Shader

## Objective

Replace only the animated background in the lower-left Services visual with a native WebGL shader that closely matches the approved Paper reference. Preserve the Services grid, dimensions, centered liquid-glass button, label, spring interaction, and `mailto:connect@heillerrcm.com` action.

## Visual Direction

The shader will reproduce the reference as a soft, continuously evolving mesh with five dominant color regions:

- pale powder blue in the upper-left;
- luminous yellow-green near the upper center;
- saturated cobalt blue on the right;
- rich green across the lower-left;
- teal blue across the lower-right.

Transitions must remain broad, blurred, and organic, without visible hard edges, particles, grain bands, or geometric shapes. Motion should feel fluid and atmospheric rather than like a rotating flat gradient.

## Rendering and Motion

Add a canvas inside `.services__visual`, behind the existing liquid-glass control. A small fragment shader will combine several slowly deforming radial color fields. Time-based warping will move the fields independently and continuously so the composition changes without obvious looping or synchronized pulsing.

The canvas will:

- fill the existing panel exactly;
- render at device-pixel density with a capped pixel ratio to avoid unnecessary GPU cost;
- resize with the panel through `ResizeObserver`;
- pause when the panel is outside the viewport;
- stop its animation loop when the document is hidden;
- render a single representative frame when reduced motion is requested.

If WebGL is unavailable or shader compilation fails, the panel will retain a CSS fallback using the same approved palette.

## Layering and Interaction

The shader canvas and fallback field are decorative and ignored by assistive technology. The current button remains centered above the shader and keeps its liquid-glass filter, pointer spring, focus treatment, label, and email destination. The shader must not capture pointer events or alter the Services grid geometry.

## Responsive Behavior

The composition will adapt to the panel aspect ratio so the principal color zones stay recognizable at desktop and mobile sizes. No extra wrapper, spacing, or fixed dimensions will be introduced.

## Verification

- Add tests for the shader canvas, CSS fallback, WebGL initialization, resize handling, visibility pausing, reduced-motion behavior, and preserved button action.
- Confirm the panel at desktop and mobile widths in the browser.
- Confirm the button remains centered and interactive.
- Confirm no overflow, WebGL errors, or console warnings.
- Run the complete test suite and production build.
