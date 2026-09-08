# Revenue Audit Line Entry Fade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fade the first portion of both Revenue Audit flow layers from transparent to fully visible without changing the existing route animation.

**Architecture:** Add one SVG user-space gradient and mask to the existing Audit flow. Group the dashed track and colored route stream under that mask, then update the gradient and mask geometry from the existing responsive `build()` function using the measured `startY` coordinate.

**Tech Stack:** HTML5 inline SVG, vanilla JavaScript, Node test runner, Vite

## Global Constraints

- Fade both `.audit__track` and `.audit__routes` through the same SVG mask.
- Keep `.audit__arrow` outside the masked group.
- Reach full opacity before the first audit row.
- Use a 100px fade zone on desktop and tablet and a 72px fade zone on mobile.
- Do not change route speed, comet cadence, tail length, colors, arrow behavior, CTA behavior, or reduced-motion behavior.
- This folder is not a Git repository, so commit steps cannot be performed until version control is initialized.

---

### Task 1: Add Audit Fade Regression Tests

**Files:**
- Create: `D:\Design\Heiller\tests\audit-flow-fade.test.mjs`

**Interfaces:**
- Consumes: `D:\Design\Heiller\index.html`
- Produces: source-level assertions for the shared mask structure, arrow boundary, and responsive mask sizing

- [ ] **Step 1: Write the failing tests**

```js
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")
const flow = html.match(/<svg class="audit__flow"[\s\S]*?<\/svg>/)?.[0] ?? ""

test("audit track and routes share an entry fade mask", () => {
  assert.match(flow, /id="audit-entry-fade-grad"/)
  assert.match(flow, /id="audit-entry-mask"/)
  assert.match(flow, /<g class="audit__fade-group" mask="url\(#audit-entry-mask\)">[\s\S]*?audit__track[\s\S]*?audit__routes[\s\S]*?<\/g>/)
})

test("audit destination arrow remains outside the entry mask", () => {
  const groupEnd = flow.indexOf("</g>")
  const arrow = flow.indexOf('class="audit__arrow"')
  assert.ok(groupEnd > -1 && arrow > groupEnd)
})

test("audit fade follows measured route start responsively", () => {
  assert.match(html, /var fadeDistance = window\.innerWidth <= 640 \? 72 : 100;/)
  assert.match(html, /fadeGradient\.setAttribute\("y1", startY\)/)
  assert.match(html, /fadeGradient\.setAttribute\("y2", startY \+ fadeDistance\)/)
})
```

- [ ] **Step 2: Run the tests and confirm failure**

Run: `npm test`

Expected: the three new tests fail because the fade definitions and masked group do not yet exist.

---

### Task 2: Add the Responsive Shared SVG Mask

**Files:**
- Modify: `D:\Design\Heiller\index.html`

**Interfaces:**
- Consumes: the existing `.audit__flow`, `startY`, `W`, and `H` measurements
- Produces: `#audit-entry-fade-grad`, `#audit-entry-mask`, `.audit__fade-rect`, and `.audit__fade-group`

- [ ] **Step 1: Add the mask definitions and masked group**

Replace the existing Audit flow definitions and path siblings with:

```html
<defs>
  <linearGradient id="audit-route-grad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFAB8D" />
    <stop offset="0.36" stop-color="#FC7EC7" />
    <stop offset="0.68" stop-color="#B3A5F5" />
    <stop offset="1" stop-color="#7EC98C" />
  </linearGradient>
  <linearGradient id="audit-entry-fade-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100">
    <stop offset="0" stop-color="black" />
    <stop offset="1" stop-color="white" />
  </linearGradient>
  <mask id="audit-entry-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1" height="1">
    <rect class="audit__fade-rect" x="0" y="0" width="1" height="1" fill="url(#audit-entry-fade-grad)" />
  </mask>
</defs>
<g class="audit__fade-group" mask="url(#audit-entry-mask)">
  <path class="audit__track" d="" />
  <g class="audit__routes"></g>
</g>
<path class="audit__arrow" d="" />
```

- [ ] **Step 2: Capture the new SVG elements in the Audit script**

After the existing `arrow` query, add:

```js
var fadeGradient = audit.querySelector("#audit-entry-fade-grad");
var fadeMask = audit.querySelector("#audit-entry-mask");
var fadeRect = audit.querySelector(".audit__fade-rect");
```

Extend the guard to require all three:

```js
if (!inner || !ledger || !rows.length || !cta || !svg || !routesGroup || !fadeGradient || !fadeMask || !fadeRect) return;
```

- [ ] **Step 3: Update mask geometry inside `build()`**

Immediately after computing `startY`, add:

```js
var fadeDistance = window.innerWidth <= 640 ? 72 : 100;
fadeGradient.setAttribute("y1", startY);
fadeGradient.setAttribute("y2", startY + fadeDistance);
fadeMask.setAttribute("x", 0);
fadeMask.setAttribute("y", 0);
fadeMask.setAttribute("width", W);
fadeMask.setAttribute("height", H);
fadeRect.setAttribute("width", W);
fadeRect.setAttribute("height", H);
```

The gradient remains black above `startY`, transitions to white across the entry distance, and stays white below its final stop because SVG gradients use pad spread behavior by default.

- [ ] **Step 4: Run the tests**

Run: `npm test`

Expected: all tests pass.

---

### Task 3: Build and Browser Verification

**Files:**
- Verify: `D:\Design\Heiller\index.html`
- Verify: `D:\Design\Heiller\tests\audit-flow-fade.test.mjs`

**Interfaces:**
- Consumes: local Vite server at `http://127.0.0.1:5180/#revenue-audit`
- Produces: verified desktop and mobile route-entry fade

- [ ] **Step 1: Run the production build**

Run: `npm run build`

Expected: TypeScript checking and Vite production build complete successfully.

- [ ] **Step 2: Inspect desktop geometry**

At 1280px width, confirm the mask gradient `y1` equals the path start and `y2 - y1` equals 100.

- [ ] **Step 3: Inspect mobile geometry**

At 390px width, confirm the mask gradient `y1` equals the path start and `y2 - y1` equals 72.

- [ ] **Step 4: Visually verify the fade**

At both widths, confirm the grey dashed track and colored moving route emerge gradually, reach full visibility before the first row, and leave the final arrow unchanged.

- [ ] **Step 5: Confirm no regression**

Confirm there is no horizontal overflow, no Vite error overlay, and the comet cadence, CTA fill animation, and destination arrow still run as before.

