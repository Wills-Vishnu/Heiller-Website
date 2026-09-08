# Dedicated Team Heading Scale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the Dedicated Team center heading by exactly 5px across its complete responsive scale.

**Architecture:** Change only the heading’s desktop/fluid `font-size` declaration and its mobile override. Keep the existing selector, copy, line height, letter spacing, width, alignment, and orbit calculations intact.

**Tech Stack:** Static HTML/CSS, Node.js built-in test runner, Vite.

## Global Constraints

- Desktop/fluid heading scale changes from `clamp(41px, 5.1vw, 88px)` to `clamp(36px, calc(5.1vw - 5px), 83px)`.
- Mobile heading size changes from `41px` to `36px`.
- Heading copy, two-line wrap, line height, tracking, width, alignment, and orbit geometry remain unchanged.
- No other section typography changes.

---

### Task 1: Reduce the responsive heading scale

**Files:**
- Modify: `D:/Design/Heiller/index.html:2107-2115,2155-2159`
- Test: `D:/Design/Heiller/tests/dedicated-team.test.mjs`

**Interfaces:**
- Consumes: existing `.dedicated-team h2` desktop and `@media (max-width: 767px)` rules.
- Produces: a heading that is exactly 5px smaller at every responsive size.

- [x] **Step 1: Write the failing regression test**

```js
test("dedicated team heading is five pixels smaller across its responsive scale", () => {
  assert.match(html, /\.dedicated-team h2\s*\{[^}]*font-size:\s*clamp\(36px,\s*calc\(5\.1vw\s*-\s*5px\),\s*83px\);/s)
  assert.match(html, /@media\s*\(max-width:\s*767px\)[\s\S]*?\.dedicated-team h2\s*\{\s*font-size:\s*36px;\s*\}/s)
  assert.doesNotMatch(html, /\.dedicated-team h2\s*\{[^}]*font-size:\s*clamp\(41px,\s*5\.1vw,\s*88px\);/s)
})
```

- [x] **Step 2: Run the focused test and verify it fails**

Run: `node --test tests/dedicated-team.test.mjs`

Expected: FAIL because the existing rules still use `clamp(41px, 5.1vw, 88px)` and `41px`.

- [x] **Step 3: Apply the minimal CSS change**

```css
.dedicated-team h2 {
  font-size: clamp(36px, calc(5.1vw - 5px), 83px);
}

@media (max-width: 767px) {
  .dedicated-team h2 { font-size: 36px; }
}
```

Leave every other declaration in both rule blocks unchanged.

- [x] **Step 4: Run automated verification**

Run: `npm test`

Expected: all tests pass.

Run: `npm run build`

Expected: TypeScript and Vite production build complete successfully.

- [x] **Step 5: Verify computed sizes in the browser**

At `http://127.0.0.1:5180/`, read the computed `font-size` of `#dedicated-team-title` at desktop, tablet, and `393px` mobile widths.

Expected:

```text
desktop cap: 83px
fluid range: previous computed fluid size minus 5px
393px mobile: 36px
```

Confirm the text remains centered on two lines, the pills continue orbiting, there is no horizontal overflow, and the browser console has no errors or warnings.

- [x] **Step 6: Commit if Git becomes available**

The V2 project currently has no `.git` directory, so no commit can be created. If initialized later, commit this atomic change as:

```bash
git add index.html tests/dedicated-team.test.mjs docs/superpowers/specs/2026-08-30-v3-dedicated-team-section-design.md docs/superpowers/plans/2026-08-30-dedicated-team-heading-scale.md
git commit -m "fix: reduce dedicated team heading scale"
```
