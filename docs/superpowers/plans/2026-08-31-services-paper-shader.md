# Services Paper Mesh Shader Implementation Plan

**Goal:** Replace the Services panel background with a native responsive WebGL mesh matching the approved Paper reference while preserving the existing liquid-glass contact button.

**Architecture:** Keep a CSS mesh as the no-WebGL fallback, layer a dedicated canvas above it, and initialize an isolated fragment-shader runtime from the existing static HTML. The runtime owns resize, visibility, reduced-motion, and cleanup behavior without changing the surrounding Services layout.

**Tech Stack:** HTML, CSS, vanilla JavaScript, WebGL 1, Node test runner, Vite.

---

## Task 1: Lock the expected structure and runtime behavior

**Files:**
- Modify: `tests/liquid-glass-button.test.mjs`

1. Replace the old image-field animation expectations with assertions for a decorative shader canvas, matching fallback field, preserved contact action, WebGL setup, `ResizeObserver`, `IntersectionObserver`, document visibility handling, and reduced-motion rendering.
2. Run the focused test and confirm it fails against the current implementation.

## Task 2: Add the Paper-inspired shader layer

**Files:**
- Modify: `index.html`

1. Add the shader canvas behind the existing liquid-glass button.
2. Restyle `.services__image-field` as a static five-zone fallback matching the Paper palette.
3. Add canvas layering and responsive sizing without changing the Services panel geometry.
4. Remove the obsolete rubber-band background keyframes while keeping the button’s spring physics.

## Task 3: Implement the native WebGL renderer

**Files:**
- Modify: `index.html`

1. Replace the inert legacy Services renderer with a small full-screen triangle shader.
2. Use independently moving radial color fields and coordinate warping for an organic mesh.
3. Cap device pixel ratio, resize through `ResizeObserver`, pause offscreen and while hidden, and render one static frame for reduced motion.
4. Leave the CSS fallback visible if WebGL context creation, shader compilation, or program linking fails.

## Task 4: Verify behavior and presentation

**Files:**
- Verify: `index.html`
- Verify: `tests/liquid-glass-button.test.mjs`

1. Run the focused test, full test suite, and production build.
2. Inspect desktop and mobile layouts in the live browser.
3. Confirm the shader fills the panel, resembles the reference palette, the button remains centered and interactive, reduced-motion remains static, and the console has no new errors or warnings.
