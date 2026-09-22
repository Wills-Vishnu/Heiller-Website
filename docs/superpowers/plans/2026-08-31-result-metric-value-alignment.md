# Result Metric Value Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Left-align the four animated result values with their card copy without changing any other animated metric.

**Architecture:** Add a results-card context check inside the existing `paintTarget` canvas renderer. That branch selects left alignment and x-coordinate zero; the default branch preserves centered rendering for workflow metrics.

**Tech Stack:** JavaScript Canvas 2D, Node.js test runner, Vite.

## Global Constraints

- Change only metric targets inside `.v3-metrics`.
- Preserve centered rendering for every other metric-mesh target.
- Keep animation, palette, typography, card geometry, and responsive behavior unchanged.

---

### Task 1: Context-aware metric canvas alignment

**Files:**
- Modify: `tests/metric-mesh.test.mjs`
- Modify: `metric-mesh.js:109-128`

**Interfaces:**
- Consumes: `target.closest(".v3-metrics")` and the existing canvas `width`.
- Produces: `textAlign` and `textX` values used by `context.textAlign` and `context.fillText`.

- [ ] **Step 1: Add a failing source contract**

Extend `tests/metric-mesh.test.mjs` to read `metric-mesh.js` and assert both branches:

```js
const source = readFileSync(new URL("../metric-mesh.js", import.meta.url), "utf8")

test("left aligns result values while retaining centered workflow metrics", () => {
  assert.match(source, /const isResultMetric = Boolean\(target\.closest\("\.v3-metrics"\)\)/)
  assert.match(source, /context\.textAlign = isResultMetric \? "left" : "center"/)
  assert.match(source, /const textX = isResultMetric \? 0 : width \/ 2/)
  assert.match(source, /context\.fillText\(fallback\.textContent\.trim\(\), textX, height \/ 2\)/)
})
```

- [ ] **Step 2: Confirm the test fails**

Run: `node --test tests/metric-mesh.test.mjs`

Expected: the new alignment test fails because all canvases are currently centered.

- [ ] **Step 3: Implement the minimal renderer branch**

Replace the fixed alignment and x-coordinate in `paintTarget` with:

```js
const isResultMetric = Boolean(target.closest(".v3-metrics"))
context.textAlign = isResultMetric ? "left" : "center"
context.textBaseline = "middle"
context.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`
const textX = isResultMetric ? 0 : width / 2
context.fillText(fallback.textContent.trim(), textX, height / 2)
```

- [ ] **Step 4: Run automated verification**

Run:

```powershell
node --test tests/metric-mesh.test.mjs
npm test
npm run build
```

Expected: focused tests pass, all project tests pass, and Vite completes the build.

- [ ] **Step 5: Verify the rendered layout**

At desktop and mobile widths, confirm each result canvas begins at the same horizontal coordinate as its `h3`, workflow metric alignment is unchanged, there is no horizontal overflow, and the console has no warnings or errors.

This workspace is not a Git repository, so no commit step applies.
