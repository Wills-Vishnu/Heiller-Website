# Trust Strip Rail Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the HIPAA trust tab and icon panel exactly with the global content rails.

**Architecture:** Keep the existing trust section and global frame unchanged. Remove only the desktop `19px` horizontal inset from the tab and panel so both consume the full `trust__box` width; retain the existing responsive rules, which already use zero inset and full width.

**Tech Stack:** Static HTML/CSS, Node.js built-in test runner, Vite.

## Global Constraints

- The global rail maximum width remains `1311px`.
- The trust icon panel starts on the left rail and ends on the right rail.
- The “HIPAA compliant” tab starts on the left rail.
- Internal trust-item spacing, responsive behavior, shader width, copy, and motion remain unchanged.

---

### Task 1: Align the trust strip to the rails

**Files:**
- Modify: `D:/Design/Heiller/index.html:351-385`
- Test: `D:/Design/Heiller/tests/content-rails.test.mjs`

**Interfaces:**
- Consumes: `.trust__box`, which already shares `--content-frame-max` with `.content-rails`.
- Produces: `.trust__tab { left: 0; }` and `.trust__panel { left: 0; width: 100%; }`.

- [x] **Step 1: Write the failing regression test**

```js
test("desktop trust strip aligns its tab and panel to both rails", () => {
  assert.match(html, /\.trust__tab\s*\{[^}]*left:\s*0;/s)
  assert.match(html, /\.trust__panel\s*\{[^}]*left:\s*0;[^}]*width:\s*100%;/s)
  assert.doesNotMatch(html, /\.trust__panel\s*\{[^}]*width:\s*calc\(100%\s*-\s*38px\);/s)
})
```

- [x] **Step 2: Run the regression test and verify it fails**

Run: `node --test tests/content-rails.test.mjs`

Expected: FAIL because the desktop tab and panel still use `left: 19px`, and the panel uses `width: calc(100% - 38px)`.

- [x] **Step 3: Apply the minimal desktop CSS change**

```css
.trust__tab {
  left: 0;
}

.trust__panel {
  left: 0;
  width: 100%;
}
```

Leave all other trust-strip declarations unchanged.

- [x] **Step 4: Run automated verification**

Run: `npm test`

Expected: all tests pass.

Run: `npm run build`

Expected: TypeScript and Vite production build complete successfully.

- [x] **Step 5: Verify the live geometry**

At `http://127.0.0.1:5180/`, compare bounding boxes for `.content-rails`, `.trust__tab`, and `.trust__panel`.

Expected:

```text
trust tab left = rail left
trust panel left = rail left
trust panel right = rail right
```

Confirm no horizontal overflow or browser console errors.

- [x] **Step 6: Commit if Git becomes available**

The V2 project currently has no `.git` directory, so no commit can be created. If the project is initialized later, commit this atomic change as:

```bash
git add index.html tests/content-rails.test.mjs docs/superpowers/specs/2026-08-30-global-content-rails-design.md docs/superpowers/plans/2026-08-30-trust-strip-rail-alignment.md
git commit -m "fix: align trust strip with content rails"
```
