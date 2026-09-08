# Services Mesh Gradient Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the supplied animated green “Mesh drift” WebGL shader to the empty lower-left Services grid cell with grain reduced to `0.050`.

**Architecture:** Add one absolutely positioned decorative canvas inside `.services__inner`, sized to the existing 520px-wide lower-left area without changing grid geometry. Initialize it through an isolated vanilla WebGL IIFE that ports the supplied React component’s shader and lifecycle behavior, while leaving the existing hero shader untouched.

**Tech Stack:** Vite 6, TypeScript build validation, standalone HTML/CSS, WebGL 1.

## Global Constraints

- Preserve the existing hero shader and its uniforms.
- Preserve the 1311px HIPAA/Services alignment and all eight card dimensions.
- Use the supplied green palette and continuous `0.727` time scale.
- Set the Services shader grain to exactly `0.050`.
- Add no React, Tailwind, shadcn, assets, icons, or packages.
- Respect `prefers-reduced-motion: reduce` by rendering a single frame.
- This workspace is not a Git repository, so commit steps are documented but cannot be executed.

---

### Task 1: Add the lower-left shader surface and WebGL runtime

**Files:**
- Modify: `design/index.html:334-349`
- Modify: `design/index.html:594-603`
- Modify: `design/index.html` immediately after the existing hero shader IIFE

**Interfaces:**
- Consumes: existing `.services__inner` positioned container and the supplied Mesh drift `VERT`, `FRAG`, and uniform recipe.
- Produces: `.services__visual`, `.services-mesh`, and an isolated Services WebGL runtime bound only to `canvas.services-mesh`.

- [ ] **Step 1: Run the failing browser geometry check**

Evaluate on `http://127.0.0.1:5173/design/`:

```js
(() => {
  const canvas = document.querySelector('.services-mesh')
  if (!canvas) return { pass: false, reason: 'services canvas missing' }
  const visual = canvas.closest('.services__visual')
  const intro = document.querySelector('.services__intro')
  const services = document.querySelector('.services__inner')
  const cards = document.querySelector('.cards')
  const vr = visual.getBoundingClientRect()
  const ir = intro.getBoundingClientRect()
  const sr = services.getBoundingClientRect()
  const cr = cards.getBoundingClientRect()
  return {
    pass:
      vr.left === sr.left + 1 &&
      vr.top === ir.bottom &&
      vr.right === cr.left &&
      vr.bottom === sr.bottom - 1,
    width: vr.width,
    height: vr.height,
  }
})()
```

Expected before implementation: `{ pass: false, reason: "services canvas missing" }`.

- [ ] **Step 2: Add the decorative surface styles**

Add beside the Services CSS:

```css
.services__visual {
  position: absolute;
  left: 0;
  top: 356px;
  bottom: 0;
  width: 520px;
  overflow: hidden;
  pointer-events: none;
}
.services-mesh {
  display: block;
  width: 100%;
  height: 100%;
}
```

- [ ] **Step 3: Add the decorative canvas**

Insert immediately after `.services__intro` and before `.cards`:

```html
<div class="services__visual" aria-hidden="true">
  <canvas class="services-mesh"></canvas>
</div>
```

- [ ] **Step 4: Add the isolated Mesh drift shader runtime**

Append a new IIFE after the hero shader IIFE. It must:

```js
(function () {
  var canvas = document.querySelector('.services-mesh')
  if (!canvas) return
  var gl = canvas.getContext('webgl', { antialias: false })
  if (!gl) return

  // Use the supplied component's VERT and FRAG source verbatim.
  // Use the supplied UNIFORMS recipe with only grain changed:
  var U = {
    colors: [
      [0.011764705882352941, 0.07058823529411765, 0.054901960784313725],
      [0.054901960784313725, 0.48627450980392156, 0.35294117647058826],
      [0.48627450980392156, 0.8980392156862745, 0.4666666666666667],
      [0.9568627450980393, 1, 0.7803921568627451],
      [0.9568627450980393, 1, 0.7803921568627451],
      [0.9568627450980393, 1, 0.7803921568627451],
      [0.9568627450980393, 1, 0.7803921568627451],
      [0.9568627450980393, 1, 0.7803921568627451],
    ],
    colorCount: 4,
    scale: 1.160,
    intensity: 0.340,
    paramA: 0.500,
    warp: 0.000,
    detail: 2.400,
    contrast: 1.158,
    brightness: 0.000,
    saturation: 1.000,
    hue: 0.0000,
    vignette: 0.000,
    blur: 0.0000,
    grain: 0.050,
    seed: 1453.0,
    rotate: 0.0000,
    offsetX: 0.000,
    offsetY: 0.000,
    drift: 0.000,
    cursorEnabled: false,
    cursorEffect: 2.0,
    cursorStrength: 0.650,
    cursorRadius: 0.460,
    oklab: 0.0,
    timeScale: 0.727,
  }
```

The IIFE must compile/link the supplied shaders, upload all uniforms, use the same full-screen triangle buffer, cap the backing buffer to two million pixels, observe canvas resizing and intersection, pause while the document is hidden, and cleanly cancel its animation frame on unload. When `matchMedia('(prefers-reduced-motion: reduce)').matches` is true, draw one frame without scheduling the next.

- [ ] **Step 5: Run the browser geometry check again**

Expected: `pass: true`, width `520`, and height equal to the Services frame remainder beneath the introduction.

- [ ] **Step 6: Verify runtime shader state**

Inspect the canvas over two animation frames:

```js
(() => {
  const canvas = document.querySelector('.services-mesh')
  const gl = canvas.getContext('webgl')
  return {
    hasContext: Boolean(gl),
    cssWidth: canvas.getBoundingClientRect().width,
    cssHeight: canvas.getBoundingClientRect().height,
    backingWidth: canvas.width,
    backingHeight: canvas.height,
  }
})()
```

Expected: `hasContext: true`; CSS and backing dimensions are non-zero.

- [ ] **Step 7: Build the project**

Run: `npm run build`

Expected: TypeScript validation and Vite production build both succeed.

- [ ] **Step 8: Commit the isolated feature when Git is available**

```bash
git add design/index.html docs/superpowers/specs/2026-08-18-services-mesh-gradient-design.md docs/superpowers/plans/2026-08-18-services-mesh-gradient.md
git commit -m "feat: add animated mesh gradient to services grid"
```

Expected in the current workspace: skip because `D:\Design\Heiller` has no `.git` repository.

---

### Task 2: Perform browser regression verification

**Files:**
- Test: live page at `http://127.0.0.1:5173/design/`

**Interfaces:**
- Consumes: `.services-mesh` and the existing Services/HIPAA geometry.
- Produces: verified visual behavior with no regressions.

- [ ] **Step 1: Verify preserved layout geometry**

Check that the HIPAA panel and Services frame both remain 1311px wide with identical left and right edges; verify eight cards exist and none report scroll overflow.

- [ ] **Step 2: Verify continuous animation**

Capture two screenshots at least 250ms apart and confirm the mesh field changes while the surrounding grid geometry remains stationary.

- [ ] **Step 3: Verify reduced-motion behavior**

Emulate `prefers-reduced-motion: reduce`, reload, and confirm the canvas renders but does not continue requesting animated frames.

- [ ] **Step 4: Verify the browser console**

Expected: no new WebGL compilation, linking, runtime, or layout errors and no new warnings.

- [ ] **Step 5: Mark the live `/design/` page as the deliverable**

Expected: the lower-left cell is filled by the green animated mesh, clipped exactly to the grid, with all approved content unchanged.

