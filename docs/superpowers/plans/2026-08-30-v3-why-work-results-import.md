# V3 Why, Workflow, and Results Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace V2’s current Results section with V3’s Why section and insert V3’s workflow-ledger and metric Results sections before the existing Revenue Audit.

**Architecture:** Keep V2’s static HTML/CSS architecture. Add semantic markup and scoped `v3-*` CSS classes in `index.html`, a vanilla scroll-driven ledger module in `workflow-ledger.js`, and one shared WebGL metric renderer in `metric-mesh.js`; reuse the V2 rail frame without adding runtime dependencies.

**Tech Stack:** Static HTML/CSS, ES modules, Canvas 2D, WebGL, IntersectionObserver, ResizeObserver, Node.js built-in test runner, Vite.

## Global Constraints

- Final order is Dedicated Team → `#why-heiller` → `#team-extension` → `#results` → existing `#revenue-audit`.
- Editorial copy is inset by up to `65px` inside the `1311px` rails.
- Why dividers and the Results metric grid span the complete rail width.
- Results boxes may touch the rails; headings and statements may not.
- Preserve exact V3 copy, workflow stages, metric values, desktop/mobile layout, motion, and reduced-motion behavior.
- Do not add React, Next.js, GSAP, or any runtime dependency.
- Keep V2 Revenue Audit and all later sections unchanged.

---

### Task 1: Replace Results and establish the three-section markup

**Files:**
- Modify: `D:/Design/Heiller/index.html:2455-2498`
- Create: `D:/Design/Heiller/tests/v3-section-import.test.mjs`

**Interfaces:**
- Produces: `#why-heiller`, `#team-extension`, `#results`, `[data-workflow-ledger]`, six `[data-workflow-row]` elements, and ten `[data-metric-mesh-value]` targets.
- Consumes: existing `#revenue-audit`, which remains immediately after the imported sections.

- [ ] **Step 1: Write the failing section-order and content test**

```js
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")

test("imports the three V3 sections before revenue audit", () => {
  const dedicated = html.indexOf('<section class="dedicated-team"')
  const why = html.indexOf('id="why-heiller"')
  const work = html.indexOf('id="team-extension"')
  const results = html.indexOf('id="results"')
  const audit = html.indexOf('id="revenue-audit"')
  assert.ok(dedicated < why && why < work && work < results && results < audit)
})

test("uses the exact V3 why copy", () => {
  for (const text of [
    "Built to stay close to the work.",
    "At Heiller, we work as an extension of your team.",
    "One accountable owner",
    "Fewer stalled handoffs",
    "Revenue-cycle focus",
    "Work you can inspect",
    "A flexible extension",
  ]) assert.match(html, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
})

test("uses the exact workflow stages and result metrics", () => {
  assert.equal((html.match(/data-workflow-row/g) ?? []).length, 6)
  for (const text of [
    "Intake and registration", "Coding and claim preparation", "Claim submission",
    "Denial recovery", "A/R follow-up", "Revenue reporting",
    "95%", "Clean claim rate", "5%", "Denial rate", "35", "Days in A/R",
    "96%", "Net collection rate",
  ]) assert.match(html, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
  assert.equal((html.match(/data-result-metric/g) ?? []).length, 4)
})
```

- [ ] **Step 2: Run the new test and verify it fails**

Run: `node --test tests/v3-section-import.test.mjs`

Expected: FAIL because `#why-heiller` and `#team-extension` do not exist.

- [ ] **Step 3: Replace the old Results markup**

Use this complete structure:

```html
<section class="v3-why" id="why-heiller" aria-labelledby="why-title">
  <div class="v3-why__inner">
    <div class="v3-why__intro">
      <h2 id="why-title">Built to stay close to the work.</h2>
      <p>At Heiller, we work as an extension of your team. We take ownership, stay close to the work, and keep every handoff visible.</p>
      <a class="v3-action v3-why__cta" href="#team-extension">See how we work <span aria-hidden="true">↗</span></a>
    </div>
    <div class="v3-reasons">
      <article class="v3-reason"><h3>1. One accountable owner</h3><p>Every claim and handoff has a named owner, so work does not disappear between teams.</p></article>
      <article class="v3-reason"><h3>2. Fewer stalled handoffs</h3><p>The next action stays visible, helping queues move without repeated status chasing.</p></article>
      <article class="v3-reason"><h3>3. Revenue-cycle focus</h3><p>The operating model is built around registration, coding, billing, denials, and collections.</p></article>
      <article class="v3-reason"><h3>4. Work you can inspect</h3><p>Reporting shows what moved, what stalled, and where attention is needed next.</p></article>
      <article class="v3-reason"><h3>5. A flexible extension</h3><p>Use Heiller for one revenue-cycle function or connect the work across the full cycle.</p></article>
    </div>
  </div>
</section>

<section class="v3-work" id="team-extension" aria-labelledby="work-title">
  <div class="v3-work__inner">
    <header class="v3-work__head"><h2 id="work-title">We work as an extension of your team</h2></header>
    <div class="v3-ledger" data-workflow-ledger>
      <svg class="v3-ledger__flow" data-ledger-flow aria-hidden="true">
        <path class="v3-ledger__track" data-ledger-track />
        <path class="v3-ledger__fill" data-ledger-fill pathLength="1" />
        <path class="v3-ledger__arrow" data-ledger-arrow />
      </svg>
      <ol class="v3-ledger__rows">
        <li class="v3-ledger__row" data-workflow-row><div class="v3-ledger__stage"><span class="metric-mesh-value v3-ledger__index" data-metric-mesh-value data-metric-index="0"><span class="metric-mesh-fallback">01</span><canvas class="metric-mesh-canvas" aria-hidden="true"></canvas></span><h3>Intake and registration</h3></div></li>
        <li class="v3-ledger__row" data-workflow-row><div class="v3-ledger__stage"><span class="metric-mesh-value v3-ledger__index" data-metric-mesh-value data-metric-index="1"><span class="metric-mesh-fallback">02</span><canvas class="metric-mesh-canvas" aria-hidden="true"></canvas></span><h3>Coding and claim preparation</h3></div></li>
        <li class="v3-ledger__row" data-workflow-row><div class="v3-ledger__stage"><span class="metric-mesh-value v3-ledger__index" data-metric-mesh-value data-metric-index="2"><span class="metric-mesh-fallback">03</span><canvas class="metric-mesh-canvas" aria-hidden="true"></canvas></span><h3>Claim submission</h3></div></li>
        <li class="v3-ledger__row" data-workflow-row><div class="v3-ledger__stage"><span class="metric-mesh-value v3-ledger__index" data-metric-mesh-value data-metric-index="3"><span class="metric-mesh-fallback">04</span><canvas class="metric-mesh-canvas" aria-hidden="true"></canvas></span><h3>Denial recovery</h3></div></li>
        <li class="v3-ledger__row" data-workflow-row><div class="v3-ledger__stage"><span class="metric-mesh-value v3-ledger__index" data-metric-mesh-value data-metric-index="4"><span class="metric-mesh-fallback">05</span><canvas class="metric-mesh-canvas" aria-hidden="true"></canvas></span><h3>A/R follow-up</h3></div></li>
        <li class="v3-ledger__row" data-workflow-row><div class="v3-ledger__stage"><span class="metric-mesh-value v3-ledger__index" data-metric-mesh-value data-metric-index="5"><span class="metric-mesh-fallback">06</span><canvas class="metric-mesh-canvas" aria-hidden="true"></canvas></span><h3>Revenue reporting</h3></div></li>
      </ol>
      <div class="v3-ledger__foot"><a class="v3-action" href="#revenue-audit">Start with a revenue audit <span aria-hidden="true">↗</span></a></div>
    </div>
  </div>
</section>

<section class="v3-results" id="results" aria-labelledby="results-title">
  <div class="v3-results__inner">
    <header class="v3-results__head">
      <div class="eyebrow"><i aria-hidden="true"></i><span>Performance standard</span></div>
      <h2 id="results-title"><span>Measure the work</span><span>that moves revenue.</span></h2>
    </header>
    <div class="v3-metrics">
      <article data-result-metric><strong class="metric-mesh-value" data-metric-mesh-value data-metric-index="6"><span class="metric-mesh-fallback">95%</span><canvas class="metric-mesh-canvas" aria-hidden="true"></canvas></strong><h3>Clean claim rate</h3><p>Operating target based on a strong first-submission benchmark.</p></article>
      <article data-result-metric><strong class="metric-mesh-value" data-metric-mesh-value data-metric-index="7"><span class="metric-mesh-fallback">5%</span><canvas class="metric-mesh-canvas" aria-hidden="true"></canvas></strong><h3>Denial rate</h3><p>Target ceiling measured against common industry benchmarks.</p></article>
      <article data-result-metric><strong class="metric-mesh-value" data-metric-mesh-value data-metric-index="8"><span class="metric-mesh-fallback">35</span><canvas class="metric-mesh-canvas" aria-hidden="true"></canvas></strong><h3>Days in A/R</h3><p>Target within a 30 to 40 day benchmark range.</p></article>
      <article data-result-metric><strong class="metric-mesh-value" data-metric-mesh-value data-metric-index="9"><span class="metric-mesh-fallback">96%</span><canvas class="metric-mesh-canvas" aria-hidden="true"></canvas></strong><h3>Net collection rate</h3><p>Target measured against an effective-collection benchmark.</p></article>
    </div>
  </div>
</section>
```

Each metric value uses:

```html
<strong class="metric-mesh-value" data-metric-mesh-value data-metric-index="0">
  <span class="metric-mesh-fallback">95%</span>
  <canvas class="metric-mesh-canvas" aria-hidden="true"></canvas>
</strong>
```

- [ ] **Step 4: Run the focused test**

Run: `node --test tests/v3-section-import.test.mjs`

Expected: all three tests pass.

---

### Task 2: Port V3 layout and mixed rail spacing

**Files:**
- Modify: `D:/Design/Heiller/index.html` CSS before `/* Global content frame */`
- Modify: `D:/Design/Heiller/tests/v3-section-import.test.mjs`
- Modify: `D:/Design/Heiller/tests/content-rails.test.mjs`

**Interfaces:**
- Consumes: `--content-frame-max`, `--content-frame-gutter`, `#CCCCCC` rail/divider color.
- Produces: full-rail section inner wrappers, `65px` editorial insets, full-width Why dividers, and a full-width Results grid.

- [ ] **Step 1: Add failing layout assertions**

```js
test("uses mixed rail spacing for editorial copy and structural boxes", () => {
  assert.match(html, /\.v3-why__inner,[\s\S]*?\.v3-results__inner\s*\{[^}]*max-width:\s*var\(--content-frame-max\);/s)
  assert.match(html, /\.v3-why__intro\s*\{[^}]*padding-inline:\s*clamp\(20px,\s*3\.2vw,\s*65px\);/s)
  assert.match(html, /\.v3-reason\s*\{[^}]*padding-inline:\s*clamp\(20px,\s*3\.2vw,\s*65px\);[^}]*border-top:\s*1px solid #CCCCCC;/s)
  assert.match(html, /\.v3-metrics\s*\{[^}]*border:\s*1px solid #CCCCCC;/s)
})
```

Extend the global-frame selector test to include `.v3-why__inner`, `.v3-work__inner`, and `.v3-results__inner` and remove the obsolete `.results__inner` requirement.

- [ ] **Step 2: Verify the layout test fails**

Run: `node --test tests/v3-section-import.test.mjs tests/content-rails.test.mjs`

Expected: FAIL because the scoped V3 layout rules do not exist.

- [ ] **Step 3: Add the scoped desktop and mobile CSS**

Implement the following exact layout foundations, followed by the typography and spacing values from V3:

```css
.v3-why, .v3-work, .v3-results { background: #FFFFFF; }
.v3-why__inner, .v3-work__inner, .v3-results__inner {
  width: 100%; max-width: var(--content-frame-max); margin-inline: auto;
}
.v3-why__intro {
  display: grid; grid-template-columns: repeat(2,minmax(0,1fr));
  gap: clamp(40px,5vw,96px); padding: clamp(40px,4vw,64px) clamp(20px,3.2vw,65px);
}
.v3-reason {
  display: grid; grid-template-columns: repeat(2,minmax(0,1fr));
  gap: clamp(40px,5vw,96px); padding: 26px clamp(20px,3.2vw,65px);
  border-top: 1px solid #CCCCCC;
}
.v3-work__head, .v3-results__head { padding-inline: clamp(20px,3.2vw,65px); }
.v3-metrics { display:grid; grid-template-columns:repeat(4,1fr); border:1px solid #CCCCCC; }
@media (max-width:767px) {
  .v3-why__intro, .v3-reason { grid-template-columns:1fr; }
  .v3-why__intro, .v3-reason, .v3-work__head, .v3-results__head { padding-inline:20px; }
  .v3-metrics { grid-template-columns:1fr; }
}
```

Add V3’s exact heading/body sizes, row spacing, card heights, mobile CTA presentation, metric borders, and `prefers-reduced-motion` transition suppression. Do not apply an outer horizontal inset to `.v3-metrics`.

- [ ] **Step 4: Run the focused layout tests**

Run: `node --test tests/v3-section-import.test.mjs tests/content-rails.test.mjs`

Expected: all focused tests pass.

---

### Task 3: Port the scroll-driven workflow ledger

**Files:**
- Create: `D:/Design/Heiller/workflow-ledger.js`
- Create: `D:/Design/Heiller/tests/workflow-ledger.test.mjs`
- Modify: `D:/Design/Heiller/index.html` before `</body>`

**Interfaces:**
- Consumes: `[data-workflow-ledger]`, `[data-workflow-row]`, `[data-ledger-flow]`, `[data-ledger-track]`, `[data-ledger-fill]`, `[data-ledger-arrow]`.
- Produces: responsive SVG geometry and a normalized `strokeDashoffset` from `1` to `0`.

- [ ] **Step 1: Write failing pure-function tests**

```js
import assert from "node:assert/strict"
import test from "node:test"
import { buildCenterSpine, getLedgerProgress } from "../workflow-ledger.js"

test("builds the centered spine and final chevron", () => {
  assert.deepEqual(buildCenterSpine({ x: 200, startY: 30, endY: 430 }), {
    d: "M 200 30 L 200 430",
    arrow: "M 193.5 422 L 200 430 L 206.5 422",
  })
})

test("clamps ledger scroll progress", () => {
  assert.equal(getLedgerProgress({ top: 720, bottom: 1400, viewportHeight: 1000 }), 0)
  assert.equal(getLedgerProgress({ top: -150, bottom: 850, viewportHeight: 1000 }), 1)
})
```

- [ ] **Step 2: Verify the tests fail because the module is absent**

Run: `node --test tests/workflow-ledger.test.mjs`

Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement the ledger module**

Export `buildCenterSpine()` and `getLedgerProgress()`. Initialize the ledger only when the DOM target exists. Measure the first row, CTA foot, and host center; update SVG `viewBox`, paths, and fill dash offset. Use `ResizeObserver`, passive `scroll`, `IntersectionObserver`, `document.visibilityState`, and `document.fonts.ready`. On mobile `<=760px`, CSS hides the SVG. Under reduced motion, set dash offset to `0` and skip scroll animation.

```js
export function buildCenterSpine({ x, startY, endY }) {
  return {
    d: `M ${x} ${startY} L ${x} ${endY}`,
    arrow: `M ${x - 6.5} ${endY - 8} L ${x} ${endY} L ${x + 6.5} ${endY - 8}`,
  }
}

export function getLedgerProgress({ top, bottom, viewportHeight }) {
  const start = viewportHeight * 0.72
  const end = viewportHeight * 0.85
  return Math.max(0, Math.min(1, (start - top) / Math.max(1, bottom - top - end + start)))
}
```

Add `<script type="module" src="/workflow-ledger.js"></script>` before the existing Dedicated Team module.

- [ ] **Step 4: Run ledger and full tests**

Run: `node --test tests/workflow-ledger.test.mjs`

Expected: both tests pass.

Run: `npm test`

Expected: the full suite passes.

---

### Task 4: Port the shared V3 metric mesh renderer

**Files:**
- Create: `D:/Design/Heiller/metric-mesh.js`
- Create: `D:/Design/Heiller/tests/metric-mesh.test.mjs`
- Modify: `D:/Design/Heiller/index.html` CSS and scripts

**Interfaces:**
- Consumes: every `[data-metric-mesh-value]` with `.metric-mesh-fallback`, `.metric-mesh-canvas`, and `data-metric-index`.
- Produces: one shared hidden WebGL source, painted 2D text canvases, `data-metric-ready` on `<html>`, and static fallback when unavailable.

- [ ] **Step 1: Write failing renderer-contract tests**

```js
import assert from "node:assert/strict"
import test from "node:test"
import { METRIC_MESH_PALETTE, getMetricFrameTime, getMetricSampleWindow } from "../metric-mesh.js"

test("uses the V3 blue lavender and gold palette", () => {
  assert.deepEqual(METRIC_MESH_PALETTE[0], [0.812, 0.878, 1])
  assert.deepEqual(METRIC_MESH_PALETTE[3], [0.984, 0.788, 0.416])
})

test("freezes reduced motion and distributes sample windows", () => {
  assert.equal(getMetricFrameTime(5000, true), 12)
  assert.deepEqual(getMetricSampleWindow(0, 4), { x: 0, y: 0.38, width: 0.62, height: 0.62 })
  assert.deepEqual(getMetricSampleWindow(3, 4), { x: 0.38, y: 0, width: 0.62, height: 0.62 })
})
```

- [ ] **Step 2: Verify the renderer tests fail**

Run: `node --test tests/metric-mesh.test.mjs`

Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement the shared renderer**

Port V3’s shader palette and single-source renderer into `metric-mesh.js`. Sort targets by `data-metric-index`, read each fallback’s computed font, mask each 2D canvas with its value text, and sample the shared source with:

```js
export const METRIC_MESH_PALETTE = [
  [0.812, 0.878, 1], [0.353, 0.588, 0.961], [0.647, 0.663, 0.949],
  [0.984, 0.788, 0.416], [0.984, 0.878, 0.702],
]
export const getMetricFrameTime = (milliseconds, reduced) => reduced ? 12 : milliseconds / 1000
export function getMetricSampleWindow(index, count) {
  const fraction = Math.max(0, Math.min(1, index / Math.max(1, count - 1)))
  return { x: fraction * 0.38, y: (1 - fraction) * 0.38, width: 0.62, height: 0.62 }
}
```

Run frames only when `#team-extension` or `#results` intersects and the document is visible. Repaint on resize and font readiness. Under reduced motion, paint one fixed frame. If WebGL or shader compilation fails, return without setting `data-metric-ready`, leaving the gradient fallback visible.

Add `<script type="module" src="/metric-mesh.js"></script>` and remove the obsolete inline “Results stat numbers” shader block so only one metric WebGL context exists.

- [ ] **Step 4: Run renderer and full tests**

Run: `node --test tests/metric-mesh.test.mjs`

Expected: both tests pass.

Run: `npm test`

Expected: the full suite passes.

---

### Task 5: Production and browser verification

**Files:**
- Modify only if verification exposes a scoped defect.

**Interfaces:**
- Verifies all interfaces produced by Tasks 1–4.

- [ ] **Step 1: Run the production build**

Run: `npm run build`

Expected: TypeScript and Vite build complete successfully with no new dependency.

- [ ] **Step 2: Verify desktop at 1969px and 1440px**

Confirm exact section order, `65px` editorial inset, full-width Why dividers, Results grid touching both rails, six ledger rows, animated gradient spine, and all ten mesh values rendering through one WebGL source.

- [ ] **Step 3: Verify responsive layouts**

At `768px`, `393px`, and `320px`, confirm no overflow; at phone widths confirm hidden rails, stacked Why content and CTA, single-column dashed workflow, and stacked Results boxes.

- [ ] **Step 4: Verify runtime quality**

Confirm zero console errors/warnings, semantic headings, CTA targets, reduced-motion static states, and readable fallback values with WebGL disabled by inspection of the fallback CSS/DOM.

- [ ] **Step 5: Commit if Git becomes available**

The V2 project currently has no `.git` directory, so no commit can be created. If initialized later, commit these files atomically as:

```bash
git add index.html workflow-ledger.js metric-mesh.js tests/v3-section-import.test.mjs tests/workflow-ledger.test.mjs tests/metric-mesh.test.mjs tests/content-rails.test.mjs docs/superpowers/specs/2026-08-30-v3-why-work-results-import-design.md docs/superpowers/plans/2026-08-30-v3-why-work-results-import.md
git commit -m "feat: port V3 why workflow and results sections"
```
