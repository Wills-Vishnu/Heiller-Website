# Audit Route Number Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the desktop and tablet audit route turns with the centers of the left and right audit number columns while preserving the current mobile route.

**Architecture:** Extend the existing live-layout `build()` measurement in `index.html`. The route will retain its current rail-adjacent coordinates as fallbacks, then replace them above 640px with centers measured from the first odd and first even `.audit__index` elements.

**Tech Stack:** Static HTML/CSS/JavaScript, inline SVG, Node.js test runner, Vite.

## Global Constraints

- Apply number-centered route limits only above `640px`.
- Preserve the existing route coordinates at `max-width: 640px`.
- Preserve route animation, rounded corners, fade, arrow, CTA landing, number placement, and ledger content.
- Fall back safely to the current route limits if number measurements are unavailable.

---

### Task 1: Number-aligned audit route

**Files:**
- Create: `tests/audit-route-number-alignment.test.mjs`
- Modify: `index.html:3611-3740`

**Interfaces:**
- Consumes: `.audit__index` elements and their live `getBoundingClientRect()` values.
- Produces: `xL` and `xR` SVG coordinates used by the existing `rounded(pts, 30)` route builder.

- [ ] **Step 1: Write the failing contract test**

Create a Node test that reads `index.html` and asserts the audit script selects the left and right number anchors, retains fallback rail coordinates, gates number-center alignment behind `window.innerWidth > 640`, and calculates each number center relative to `ib.left`.

```js
import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8")
const script = html.match(/<!-- Audit flow:[\s\S]*?<\/script>/)?.[0] ?? ""

test("desktop audit route aligns to the number column centers", () => {
  assert.match(script, /var leftIndex = rows\[0\]\.querySelector\("\.audit__index"\)/)
  assert.match(script, /var rightIndex = rows\[1\]\.querySelector\("\.audit__index"\)/)
  assert.match(script, /window\.innerWidth > 640/)
  assert.match(script, /leftIndexBox\.left \+ leftIndexBox\.width \/ 2\) - ib\.left/)
  assert.match(script, /rightIndexBox\.left \+ rightIndexBox\.width \/ 2\) - ib\.left/)
})

test("mobile audit route keeps the existing rail-adjacent fallback", () => {
  assert.match(script, /var xL = \(lb\.left - ib\.left\) \+ 4\.5/)
  assert.match(script, /var xR = \(lb\.right - ib\.left\) - 5/)
})
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test tests/audit-route-number-alignment.test.mjs`

Expected: the desktop alignment assertion fails because the number anchors are not yet measured.

- [ ] **Step 3: Implement the live number-center geometry**

Immediately after the current `xL` and `xR` fallback declarations in `build()`, add:

```js
var leftIndex = rows[0].querySelector(".audit__index");
var rightIndex = rows[1].querySelector(".audit__index");
if (window.innerWidth > 640 && leftIndex && rightIndex) {
  var leftIndexBox = leftIndex.getBoundingClientRect();
  var rightIndexBox = rightIndex.getBoundingClientRect();
  xL = (leftIndexBox.left + leftIndexBox.width / 2) - ib.left;
  xR = (rightIndexBox.left + rightIndexBox.width / 2) - ib.left;
}
```

Do not change the route point order, rounding, animation constants, fade geometry, arrow construction, or CTA measurements.

- [ ] **Step 4: Run focused and complete verification**

Run:

```powershell
node --test tests/audit-route-number-alignment.test.mjs
npm test
npm run build
```

Expected: the focused test passes, all project tests pass, and Vite completes the production build.

- [ ] **Step 5: Verify responsive runtime geometry**

At widths `1440`, `768`, `393`, and `320`, inspect the audit section and confirm:

- At 1440 and 768, the route's left and right vertical runs align with the centers of `01` and `02`.
- At 393 and 320, the route uses the unchanged mobile limits.
- The final arrow remains centered above the CTA.
- The document has no horizontal overflow and the console has no warnings or errors.

This workspace is not a Git repository, so no commit step applies.
