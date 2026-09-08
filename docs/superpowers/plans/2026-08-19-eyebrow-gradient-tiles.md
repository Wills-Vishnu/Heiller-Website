# Eyebrow Gradient Tiles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every flat cyan eyebrow marker with a 12px rounded-square gradient tile using three rotating palettes derived from the approved reference.

**Architecture:** Keep the existing `.eyebrow i` HTML unchanged and implement the treatment entirely in CSS. A shared base rule controls geometry and fallback color; three section-cycle selectors provide palette variation without JavaScript, image assets, or additional rendering contexts.

**Tech Stack:** HTML, CSS, Node.js built-in test runner, Vite

## Global Constraints

- Apply the treatment to all eight existing `.eyebrow` labels.
- Keep each tile exactly 12px by 12px with a 4px corner radius.
- Preserve existing eyebrow typography, spacing, and responsive behavior.
- Use no image assets, WebGL contexts, icons, shadows, or JavaScript.
- Retain `#40CFFF` as the solid-color fallback before every gradient declaration.
- Keep the tiles static and respect the existing page design language.

---

### Task 1: Add and verify the rotating gradient tile system

**Files:**
- Create: `tests/eyebrow-gradient-tiles.test.mjs`
- Modify: `package.json:7-11`
- Modify: `index.html:436`

**Interfaces:**
- Consumes: Existing `.page > section` ordering and the `.eyebrow > i + span` markup.
- Produces: A CSS-only three-palette cycle for every `.eyebrow i` marker.

- [ ] **Step 1: Write the failing source-level regression test**

Create `tests/eyebrow-gradient-tiles.test.mjs`:

```js
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")

test("eyebrow markers use the approved rounded-square dimensions", () => {
  assert.match(html, /\.eyebrow i\s*\{[^}]*width:\s*12px;[^}]*height:\s*12px;[^}]*border-radius:\s*4px;/s)
})

test("eyebrow markers provide three rotating gradient palettes", () => {
  const selectors = html.match(/\.page\s*>\s*section:nth-of-type\(3n\s*\+\s*[123]\)\s+\.eyebrow i/g) ?? []
  assert.equal(selectors.length, 3)
  assert.match(html, /radial-gradient\(/)
  assert.match(html, /linear-gradient\(/)
})

test("the cyan fallback appears before the gradients", () => {
  assert.match(html, /\.eyebrow i\s*\{[^}]*background:\s*#40CFFF;/s)
})
```

- [ ] **Step 2: Expose the test command and verify the regression test fails**

Add the test script to `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "preview": "vite preview --port 4173",
  "test": "node --test tests/*.test.mjs"
}
```

Run:

```powershell
npm test
```

Expected: FAIL because `.eyebrow i` is still 11px, has no corner radius, and has no three-palette selectors.

- [ ] **Step 3: Implement the shared geometry and three palettes**

Replace the existing `.eyebrow i` rule in `index.html` with:

```css
.eyebrow i {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  border-radius: 4px;
  background: #40CFFF;
}
.page > section:nth-of-type(3n + 1) .eyebrow i {
  background: #40CFFF;
  background-image:
    radial-gradient(circle at 72% 18%, rgba(224, 144, 255, 0.95) 0 16%, transparent 48%),
    linear-gradient(145deg, #4055FF 0%, #755CFF 42%, #55D5FF 100%);
}
.page > section:nth-of-type(3n + 2) .eyebrow i {
  background: #40CFFF;
  background-image:
    radial-gradient(circle at 70% 18%, rgba(247, 159, 255, 0.9) 0 18%, transparent 50%),
    linear-gradient(145deg, #FFC52F 0%, #FF8A3D 38%, #FF485A 76%, #FF72D2 100%);
}
.page > section:nth-of-type(3n + 3) .eyebrow i {
  background: #40CFFF;
  background-image:
    radial-gradient(circle at 72% 20%, rgba(255, 235, 174, 0.98) 0 18%, transparent 52%),
    linear-gradient(145deg, #2B9BFF 0%, #75BCFF 45%, #BFD8FF 100%);
}
```

- [ ] **Step 4: Run automated verification**

Run:

```powershell
npm test
npm run build
```

Expected: all three tests pass and Vite completes the production build without errors.

- [ ] **Step 5: Verify the visual result in the local browser**

Open `http://127.0.0.1:5180/` and verify:

- All eight eyebrow labels have 12px rounded-square tiles.
- Blue/violet, coral/gold, and blue/cream palettes rotate without adjacent duplication.
- Label alignment and spacing remain unchanged at desktop width.
- At 390px and 320px, tiles remain aligned and cause no overflow or wrapping changes.

- [ ] **Step 6: Record the change**

This directory currently has no Git repository, so no commit command can succeed. Preserve the verified source and test files in place. If Git is initialized later, commit them atomically with:

```powershell
git add index.html package.json tests/eyebrow-gradient-tiles.test.mjs
git commit -m "feat: add gradient eyebrow tiles"
```
