# Why Typography and Serpentine Workflow Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved Why typography reductions and replace the desktop workflow spine with a smoothly fading, scroll-filled serpentine route that reaches the audit button.

**Architecture:** Preserve the static V2 HTML/CSS and vanilla module structure. Extend `workflow-ledger.js` with deterministic pure geometry and smoothing functions, measure live row/button positions, and render one responsive SVG path shared by the dashed track and gradient fill.

**Tech Stack:** Static HTML/CSS, ES modules, SVG, ResizeObserver, IntersectionObserver, Node.js test runner, Vite.

## Global Constraints

- Heading reduction is exactly 2px at desktop and mobile sizes.
- Statement reduction is exactly 3px, with computed line height tightened by exactly 0.5px.
- Route palette is pale blue, blue, lavender, gold, pale gold.
- Route touches the top-center of the audit button and stays hidden at widths `<=760px`.
- Reduced motion shows the complete route without scroll animation.
- No new dependency and no changes to copy, Results cards, or Revenue Audit.

---

### Task 1: Typography reductions and SVG fade contract

**Files:**
- Modify: `D:/Design/Heiller/index.html`
- Modify: `D:/Design/Heiller/tests/v3-section-import.test.mjs`

**Interfaces:**
- Produces exact responsive typography rules and the SVG mask/gradient structure consumed by `workflow-ledger.js`.

- [ ] **Step 1: Add failing static assertions**

```js
test("uses the approved Why typography reductions", () => {
  assert.match(html, /\.v3-why__intro h2\s*\{[^}]*font-size:\s*clamp\(41px,\s*calc\(5vw - 2px\),\s*82px\);/s)
  assert.match(html, /\.v3-why__intro > p\s*\{[^}]*font-size:\s*clamp\(22px,\s*calc\(2\.5vw - 3px\),\s*46px\);[^}]*line-height:\s*calc\(1\.02em - 0\.5px\);/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-why__intro h2\s*\{\s*font-size:\s*46px;/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-why__intro > p\s*\{\s*font-size:\s*28px;/s)
})

test("masks the route start and uses the metric palette", () => {
  assert.match(html, /id="v3-ledger-fade"/)
  assert.match(html, /mask="url\(#v3-ledger-start-mask\)"/)
  for (const color of ["#CFDFFF", "#5A96F5", "#A5A9F2", "#FBC96A", "#FBE0B3"]) assert.match(html, new RegExp(color, "i"))
})
```

- [ ] **Step 2: Run `node --test tests/v3-section-import.test.mjs` and verify failure**

Expected: typography and mask assertions fail against the current rules.

- [ ] **Step 3: Apply exact CSS and SVG markup**

Use `clamp(41px, calc(5vw - 2px), 82px)`, `clamp(22px, calc(2.5vw - 3px), 46px)`, `calc(1.02em - 0.5px)`, mobile sizes `46px` and `28px`, a 64px vertical fade gradient, and a masked group containing the track and fill. Keep the endpoint arrow outside the mask.

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `node --test tests/v3-section-import.test.mjs`

---

### Task 2: Smooth serpentine route geometry and scroll fill

**Files:**
- Modify: `D:/Design/Heiller/workflow-ledger.js`
- Modify: `D:/Design/Heiller/tests/workflow-ledger.test.mjs`

**Interfaces:**
- Produces: `buildSerpentineRoute({ x, startY, endY, rowYs, amplitude }) -> { d, arrow }`.
- Produces: `smoothProgress(current, target, easing) -> number`.
- Consumes live row centers and the CTA button’s top-center edge.

- [ ] **Step 1: Add failing pure-function tests**

```js
test("builds a smooth alternating route that returns to the button center", () => {
  assert.deepEqual(buildSerpentineRoute({ x: 200, startY: 20, endY: 420, rowYs: [80, 160], amplitude: 24 }), {
    d: "M 200 20 C 200 50 176 50 176 80 C 176 120 224 120 224 160 C 224 290 200 290 200 420",
    arrow: "M 193.5 412 L 200 420 L 206.5 412",
  })
})

test("smoothly approaches the target progress", () => {
  assert.equal(smoothProgress(0, 1, 0.16), 0.16)
  assert.equal(smoothProgress(0.9995, 1, 0.16), 1)
})
```

- [ ] **Step 2: Run `node --test tests/workflow-ledger.test.mjs` and verify failure**

Expected: exports are missing.

- [ ] **Step 3: Implement geometry and smoothing**

Build points from center start, alternating `x - amplitude` / `x + amplitude` row centers, and center endpoint. Connect each pair with `C previous.x midpointY next.x midpointY next.x next.y`. Measure amplitude as `min(32, max(18, hostWidth * 0.025))`; use the CTA anchor’s top edge for `endY`. Replace direct dash-offset writes with a `requestAnimationFrame` interpolation using easing `0.16`; reveal the endpoint arrow only over the final 8%.

- [ ] **Step 4: Run focused and full tests**

Run: `node --test tests/workflow-ledger.test.mjs`

Run: `npm test`

Expected: all tests pass.

---

### Task 3: Production and browser verification

**Files:**
- Modify only if verification finds a scoped defect.

**Interfaces:**
- Verifies the typography, responsive route, scroll fill, reduced-motion fallback, and unchanged phone stack.

- [ ] **Step 1: Run `npm run build`**

Expected: TypeScript and Vite complete successfully.

- [ ] **Step 2: Verify desktop live behavior**

At 1440px and 1969px, confirm the heading/statement reductions, top fade, smooth alternating path, continuous gradient fill, and endpoint at the audit button.

- [ ] **Step 3: Verify responsive behavior**

At 760px, 393px, and 320px, confirm the SVG remains hidden, stacked rows remain intact, and horizontal overflow is zero.

- [ ] **Step 4: Verify runtime quality**

Confirm no console warnings/errors, the route recomputes on resize, and reduced-motion logic resolves to a fully drawn path.

- [ ] **Step 5: Record repository limitation**

`D:/Design/Heiller` has no `.git` directory, so no commit or worktree operation is available. Leave the verified inline changes in place.
