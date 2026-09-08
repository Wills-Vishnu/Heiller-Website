# Service Card Title Font Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply Plus Jakarta Sans to only the six service card titles.

**Architecture:** Add the font-family declaration to the existing `.card__title` rule. Protect the selector boundary with a static CSS contract so descriptions and containers continue inheriting their current font.

**Tech Stack:** HTML/CSS, Node.js test runner, Vite.

## Global Constraints

- Affect only `.card__title`.
- Preserve descriptions, typography metrics, layout, icons, and responsive rules.
- Use `"Plus Jakarta Sans", system-ui, sans-serif`.

---

### Task 1: Service card title font

**Files:**
- Create: `tests/service-card-title-font.test.mjs`
- Modify: `index.html:693-699`

**Interfaces:**
- Consumes: the existing `.card__title` CSS selector.
- Produces: an inherited font stack on the six title elements only.

- [ ] **Step 1: Add the failing CSS contract**

```js
import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8")

test("only service card titles use Plus Jakarta Sans", () => {
  const titleRule = html.match(/\.card__title\s*\{[^}]*\}/)?.[0] ?? ""
  const cardRule = html.match(/\.card\s*\{[^}]*\}/)?.[0] ?? ""
  const bodyRule = html.match(/\.card__body\s*\{[^}]*\}/)?.[0] ?? ""
  assert.match(titleRule, /font-family:\s*"Plus Jakarta Sans", system-ui, sans-serif;/)
  assert.doesNotMatch(cardRule, /font-family:/)
  assert.doesNotMatch(bodyRule, /font-family:/)
})
```

- [ ] **Step 2: Confirm the test fails**

Run: `node --test tests/service-card-title-font.test.mjs`

Expected: failure because `.card__title` does not yet declare the font.

- [ ] **Step 3: Add the font declaration**

Add this property to the existing `.card__title` rule:

```css
font-family: "Plus Jakarta Sans", system-ui, sans-serif;
```

- [ ] **Step 4: Run automated verification**

```powershell
node --test tests/service-card-title-font.test.mjs
npm test
npm run build
```

Expected: the focused test and full suite pass, and Vite completes the build.

- [ ] **Step 5: Verify live typography**

At desktop and mobile widths, confirm all six `.card__title` elements compute to Plus Jakarta Sans, `.card__body` retains its inherited font, there is no horizontal overflow, and the console is clean.

This workspace is not a Git repository, so no commit step applies.
