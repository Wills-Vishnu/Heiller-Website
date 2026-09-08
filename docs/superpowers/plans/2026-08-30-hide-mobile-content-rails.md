# Hide Mobile Content Rails Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the two decorative global content rails on phone viewports without changing mobile content gutters.

**Architecture:** Add one visibility rule to the existing `@media (max-width: 640px)` block. The rail layer is hidden with `display: none`, while the shared gutter variables and all content-container widths remain unchanged.

**Tech Stack:** Static HTML/CSS, Node.js built-in test runner, Vite.

## Global Constraints

- Rails remain visible at `641px` and above.
- Rails are hidden at `640px` and below.
- Existing `16px` mobile and `12px` narrow-mobile gutters remain unchanged.
- Content alignment, widths, backgrounds, shaders, and section borders remain unchanged.

---

### Task 1: Hide the rail layer at the phone breakpoint

**Files:**
- Modify: `D:/Design/Heiller/index.html:2204-2206`
- Test: `D:/Design/Heiller/tests/content-rails.test.mjs`

**Interfaces:**
- Consumes: the existing `.content-rails` layer and `@media (max-width: 640px)` breakpoint.
- Produces: `.content-rails { display: none; }` only at `640px` and below.

- [x] **Step 1: Write the failing regression test**

```js
test("decorative rails are hidden on phone widths without changing gutters", () => {
  assert.match(html, /@media \(max-width:\s*640px\)\s*\{[\s\S]*?:root\s*\{\s*--content-frame-gutter:\s*16px;\s*\}[\s\S]*?\.content-rails\s*\{\s*display:\s*none;\s*\}/s)
  assert.match(html, /@media \(max-width:\s*389px\)[\s\S]*?--content-frame-gutter:\s*12px;/s)
})
```

- [x] **Step 2: Run the focused test and verify it fails**

Run: `node --test tests/content-rails.test.mjs`

Expected: FAIL because the `640px` media query currently changes only the gutter variable.

- [x] **Step 3: Apply the minimal CSS change**

```css
@media (max-width: 640px) {
  :root { --content-frame-gutter: 16px; }
  .content-rails { display: none; }
}
```

Leave the `389px` gutter override and all desktop rail styling unchanged.

- [x] **Step 4: Run automated verification**

Run: `npm test`

Expected: all tests pass.

Run: `npm run build`

Expected: TypeScript and Vite production build complete successfully.

- [x] **Step 5: Verify the cutoff in the browser**

At `http://127.0.0.1:5180/`, read the computed display and pseudo-element widths for `.content-rails` at `641px`, `640px`, `393px`, and `320px`.

Expected:

```text
641px: rail layer visible
640px: rail layer display none
393px: rail layer display none; content gutter 16px
320px: rail layer display none; content gutter 12px
```

Confirm no horizontal overflow and no browser console errors or warnings.

- [x] **Step 6: Commit if Git becomes available**

The V2 project currently has no `.git` directory, so no commit can be created. If initialized later, commit this atomic change as:

```bash
git add index.html tests/content-rails.test.mjs docs/superpowers/specs/2026-08-30-global-content-rails-design.md docs/superpowers/plans/2026-08-30-hide-mobile-content-rails.md
git commit -m "fix: hide content rails on mobile"
```
