# Responsive Workflow Ledger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Precisely align alternating workflow numbers with their labels and preserve the animated serpentine ledger on mobile down to 320px.

**Architecture:** Keep the existing semantic ordered list, two-column grid, decorative SVG, scroll-progress controller, and shared metric-mesh renderer. Make number boxes intrinsic, replace the mobile stacked fallback with a compact responsive version of the same grid, and centralize the route-amplitude calculation so narrow screens receive a proportionally smaller curve.

**Tech Stack:** Static HTML/CSS, vanilla JavaScript ES modules, SVG, WebGL-backed metric mesh, Node.js test runner, Vite.

## Global Constraints

- Preserve the six workflow stages, semantic ordered-list markup, route palette, scroll progress behavior, metric-mesh number treatment, CTA, and reduced-motion behavior.
- Do not add duplicate mobile markup or a second animation implementation.
- Do not change the surrounding Why, Results, or Revenue Audit sections.
- Allow “Coding and claim preparation” to wrap to two lines on mobile.
- Support 320px without horizontal overflow.
- The directory currently has no `.git` metadata; run every verification checkpoint, but do not fabricate commits. If Git metadata is restored before execution, use the supplied commit messages.

---

## File Map

- Modify `D:/Design/Heiller/index.html`: intrinsic number sizing and responsive ledger CSS.
- Modify `D:/Design/Heiller/workflow-ledger.js`: exported responsive amplitude calculation used by SVG measurement.
- Modify `D:/Design/Heiller/tests/v3-section-import.test.mjs`: structural regression coverage for number alignment and mobile composition.
- Modify `D:/Design/Heiller/tests/workflow-ledger.test.mjs`: route-amplitude unit coverage.
- Reference `D:/Design/Heiller/docs/superpowers/specs/2026-08-31-responsive-workflow-ledger-design.md`: approved behavior and acceptance criteria.

### Task 1: Preserve the alternating ledger layout on mobile

**Files:**
- Modify: `D:/Design/Heiller/tests/v3-section-import.test.mjs`
- Modify: `D:/Design/Heiller/index.html:2397-2415,2458-2474`

**Interfaces:**
- Consumes: existing `.v3-ledger__row`, `.v3-ledger__stage`, `.v3-ledger__index`, `.v3-ledger__flow`, and `@media (max-width: 767px)` selectors.
- Produces: one responsive two-column workflow composition whose odd stages share a right edge and even stages share a left edge.

- [ ] **Step 1: Add failing structural regression assertions**

Append this test to `tests/v3-section-import.test.mjs`:

```js
test("keeps the aligned serpentine ledger on mobile", () => {
  assert.match(html, /\.v3-ledger__index\s*\{[^}]*width:\s*fit-content;/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-ledger__row\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-ledger__row:nth-child\(odd\) \.v3-ledger__stage\s*\{[^}]*text-align:\s*right;[^}]*align-items:\s*flex-end;/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-ledger__row:nth-child\(even\) \.v3-ledger__stage\s*\{[^}]*text-align:\s*left;[^}]*align-items:\s*flex-start;/s)
  assert.doesNotMatch(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-ledger__flow\s*\{\s*display:\s*none;/s)
  assert.doesNotMatch(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-ledger__row\s*\{[^}]*border-top:/s)
})
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```powershell
node --test tests/v3-section-import.test.mjs
```

Expected: FAIL in `keeps the aligned serpentine ledger on mobile` because the index still uses `3ch`, the SVG is hidden, and mobile rows are block elements with dashed borders.

- [ ] **Step 3: Make number width intrinsic and retain explicit desktop edge alignment**

In `index.html`, replace the width declaration in `.v3-ledger__index`:

```css
.v3-ledger__index {
  width: fit-content;
  height: 1.1em;
  font-size: clamp(30px, 2.6vw, 50px);
  font-weight: 500;
  letter-spacing: -.06em;
  line-height: 1;
}
```

Keep these existing alignment rules unchanged:

```css
.v3-ledger__row:nth-child(odd) .v3-ledger__stage { grid-column: 1; text-align: right; align-items: flex-end; }
.v3-ledger__row:nth-child(even) .v3-ledger__stage { grid-column: 2; text-align: left; align-items: flex-start; }
```

- [ ] **Step 4: Replace the stacked mobile ledger rules with compact alternating rules**

Inside `@media (max-width: 767px)`, replace the existing `.v3-ledger` through `.v3-ledger__stage h3` declarations with:

```css
.v3-ledger { padding-inline: 16px; }
.v3-ledger__row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(28px, 10vw, 42px);
  padding-block: clamp(16px, 5vw, 22px);
}
.v3-ledger__row:nth-child(odd) .v3-ledger__stage {
  grid-column: 1;
  text-align: right;
  align-items: flex-end;
}
.v3-ledger__row:nth-child(even) .v3-ledger__stage {
  grid-column: 2;
  text-align: left;
  align-items: flex-start;
}
.v3-ledger__stage { min-width: 0; gap: 5px; }
.v3-ledger__index { font-size: clamp(25px, 8vw, 32px); }
.v3-ledger__stage h3 {
  max-width: 19ch;
  font-size: clamp(14px, 4.2vw, 18px);
  line-height: 1.08;
}
```

Delete the mobile declarations that hide `.v3-ledger__flow`, set rows to `display: block`, add dashed `border-top`, or force every stage to left alignment. Keep the existing full-width mobile CTA rules.

- [ ] **Step 5: Run the focused structural test**

Run:

```powershell
node --test tests/v3-section-import.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Record the atomic checkpoint**

If Git metadata has been restored:

```powershell
git add index.html tests/v3-section-import.test.mjs
git commit -m "fix: preserve aligned workflow ledger on mobile"
```

Otherwise record that Task 1 passed its focused test and continue without a commit.

### Task 2: Scale the serpentine route amplitude for narrow screens

**Files:**
- Modify: `D:/Design/Heiller/tests/workflow-ledger.test.mjs`
- Modify: `D:/Design/Heiller/workflow-ledger.js:1-75`

**Interfaces:**
- Produces: `getLedgerAmplitude(width: number): number`, returning a clamped amplitude from 12px through 32px.
- Consumes: `getLedgerAmplitude(hostBox.width)` in `initWorkflowLedger().measure()`.

- [ ] **Step 1: Add a failing unit test for responsive amplitude**

Change the import and add the test in `tests/workflow-ledger.test.mjs`:

```js
import { buildCenterSpine, buildSerpentineRoute, getLedgerAmplitude, getLedgerProgress, smoothProgress } from "../workflow-ledger.js"

test("scales ledger amplitude from narrow mobile through desktop", () => {
  assert.equal(getLedgerAmplitude(320), 12)
  assert.equal(getLedgerAmplitude(800), 20)
  assert.equal(getLedgerAmplitude(1600), 32)
})
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```powershell
node --test tests/workflow-ledger.test.mjs
```

Expected: FAIL because `getLedgerAmplitude` is not exported.

- [ ] **Step 3: Implement and use the amplitude helper**

Add this export before `getLedgerProgress` in `workflow-ledger.js`:

```js
export function getLedgerAmplitude(width) {
  return Math.min(32, Math.max(12, width * 0.025))
}
```

Then replace the inline `amplitude` expression in `measure()` with:

```js
amplitude: getLedgerAmplitude(hostBox.width),
```

- [ ] **Step 4: Run the focused unit test**

Run:

```powershell
node --test tests/workflow-ledger.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Record the atomic checkpoint**

If Git metadata has been restored:

```powershell
git add workflow-ledger.js tests/workflow-ledger.test.mjs
git commit -m "fix: scale workflow route for narrow screens"
```

Otherwise record that Task 2 passed its focused test and continue without a commit.

### Task 3: Verify the complete responsive workflow ledger

**Files:**
- Verify: `D:/Design/Heiller/index.html`
- Verify: `D:/Design/Heiller/workflow-ledger.js`
- Verify: `D:/Design/Heiller/tests/v3-section-import.test.mjs`
- Verify: `D:/Design/Heiller/tests/workflow-ledger.test.mjs`

**Interfaces:**
- Consumes: the responsive CSS and `getLedgerAmplitude()` from Tasks 1 and 2.
- Produces: verified desktop, tablet, 393px, and 320px behavior with aligned numbers, wrapping labels, visible route animation, and no regressions.

- [ ] **Step 1: Run the complete automated test suite**

Run:

```powershell
npm test
```

Expected: all tests pass with zero failures.

- [ ] **Step 2: Run the production build**

Run:

```powershell
npm run build
```

Expected: TypeScript validation and Vite production build both succeed.

- [ ] **Step 3: Verify desktop and tablet geometry in the live browser**

At `http://127.0.0.1:5180/`, inspect the ledger at the normal desktop viewport and at 768px. For each of the six stages, compare `getBoundingClientRect()` values:

```js
Array.from(document.querySelectorAll(".v3-ledger__stage")).map(stage => {
  const number = stage.querySelector(".v3-ledger__index").getBoundingClientRect()
  const label = stage.querySelector("h3").getBoundingClientRect()
  return { number, label }
})
```

Expected: odd rows have `Math.abs(number.right - label.right) <= 1`; even rows have `Math.abs(number.left - label.left) <= 1`. The SVG path is visible and ends at the CTA.

- [ ] **Step 4: Verify 393px and 320px mobile geometry**

At each width, confirm:

- All six rows remain alternating around the center route.
- “Coding and claim preparation” occupies no more than two rendered lines.
- The document has no horizontal overflow: `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
- Odd and even number/label edge deltas remain within one CSS pixel.
- `.v3-ledger__flow` is visible and its fill dash offset changes with scroll unless reduced motion is enabled.
- The CTA remains full-width and the route terminates at its top center.

- [ ] **Step 5: Check runtime errors**

Read the browser console after desktop and mobile checks.

Expected: zero console errors.

- [ ] **Step 6: Record the final checkpoint**

If Git metadata has been restored and Tasks 1–2 were not committed separately:

```powershell
git add index.html workflow-ledger.js tests/v3-section-import.test.mjs tests/workflow-ledger.test.mjs docs/superpowers/specs/2026-08-31-responsive-workflow-ledger-design.md docs/superpowers/plans/2026-08-31-responsive-workflow-ledger.md
git commit -m "fix: keep workflow ledger responsive and aligned"
```

Otherwise report the verified changed files and the absence of repository metadata.
