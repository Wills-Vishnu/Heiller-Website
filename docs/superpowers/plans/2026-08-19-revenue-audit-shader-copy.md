# Revenue Audit Shader Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the approved two-line Revenue Audit statement with the live hero shader while matching the adjacent section heading's typography and alignment.

**Architecture:** Keep the accessible statement as real DOM text with two explicit line spans. Expose a small subscription API from the existing hero WebGL renderer, then copy each rendered hero frame into one 2D canvas and mask it to the statement glyphs. The audit statement retains its deep-brown text until the first masked frame succeeds.

**Tech Stack:** Static HTML/CSS, vanilla JavaScript, WebGL 1, Canvas 2D, Node test runner, Vite.

## Global Constraints

- Approved copy is exactly `We find the revenue leaks.` followed by `Then show you what to fix.`
- The line break must be explicit.
- The left Revenue Audit heading remains black.
- The right statement uses the same font family, weight, size, tracking, and line height as the left heading at every breakpoint.
- Reuse the existing hero WebGL canvas; do not create another WebGL context or shader preset.
- Preserve readable deep-brown text until shader masking succeeds.
- The presentation canvas is `aria-hidden="true"`.
- Reduced motion renders one frame without continuous masked-canvas repainting.
- The project folder is not a Git repository, so commit steps are intentionally replaced by verification checkpoints.

---

## File map

- Modify `index.html`: Revenue Audit markup, responsive typography, hero-renderer bridge, and masked text canvas.
- Create `tests/audit-intro-shader.test.mjs`: structural and resilience checks for copy, line breaks, accessibility, shared-frame API, masking, and reduced motion.

### Task 1: Lock the two-line accessible composition

**Files:**
- Modify: `index.html:1434-1461`
- Modify: `index.html:1855-1857`
- Modify: `index.html:1963-1964`
- Modify: `index.html:2060-2061`
- Modify: `index.html:2348-2353`
- Create: `tests/audit-intro-shader.test.mjs`

**Interfaces:**
- Produces: `.audit__intro-copy`, two `.audit__intro-line` elements, and `.audit__intro-gl` as stable hooks for Task 2.
- Consumes: Existing `.audit__head h2` responsive type values.

- [ ] **Step 1: Write the failing markup and typography tests**

Create `tests/audit-intro-shader.test.mjs`:

```js
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")

test("audit intro uses the approved explicit two-line copy", () => {
  assert.match(
    html,
    /<span class="audit__intro-copy">\s*<span class="audit__intro-line">We find the revenue leaks\.<\/span>\s*<span class="audit__intro-line">Then show you what to fix\.<\/span>\s*<\/span>/,
  )
})

test("audit intro canvas is presentation only", () => {
  assert.match(html, /<canvas class="audit__intro-gl" aria-hidden="true"><\/canvas>/)
})

test("audit intro shares the desktop heading scale", () => {
  const rule = html.match(/\.audit__intro\s*\{[\s\S]*?\}/)?.[0] ?? ""
  assert.match(rule, /font-size:\s*46px/)
  assert.match(rule, /font-weight:\s*500/)
  assert.match(rule, /letter-spacing:\s*-2px/)
  assert.match(rule, /line-height:\s*48px/)
})
```

- [ ] **Step 2: Run the new test and confirm it fails**

Run: `node --test tests/audit-intro-shader.test.mjs`

Expected: FAIL because `.audit__intro-copy`, `.audit__intro-line`, and `.audit__intro-gl` do not exist.

- [ ] **Step 3: Implement the explicit lines and canvas hook**

Replace the current paragraph with:

```html
<p class="audit__intro">
  <span class="audit__intro-copy">
    <span class="audit__intro-line">We find the revenue leaks.</span>
    <span class="audit__intro-line">Then show you what to fix.</span>
  </span>
  <canvas class="audit__intro-gl" aria-hidden="true"></canvas>
</p>
```

Use these desktop styles, preserving the existing responsive values already shared with `.audit__head h2`:

```css
.audit__intro {
  position: relative;
  align-self: start;
  margin: 0;
  max-width: none;
  color: #2A0F14;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 46px;
  font-weight: 500;
  letter-spacing: -2px;
  line-height: 48px;
}
.audit__intro-copy,
.audit__intro-line { display: block; }
.audit__intro-gl {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.audit--intro-shader .audit__intro-copy { color: transparent; }
```

Keep the existing breakpoint values synchronized with the heading: `clamp(32px, 4.6vw, 40px)` at 960px, `34px` at 640px, and `27px` at 389px.

- [ ] **Step 4: Run the focused test**

Run: `node --test tests/audit-intro-shader.test.mjs`

Expected: 3 tests PASS.

- [ ] **Step 5: Verification checkpoint**

Run: `npm test`

Expected: all existing tests plus the 3 new tests PASS.

### Task 2: Expose shared hero frames without adding WebGL contexts

**Files:**
- Modify: `index.html:2783-2834`
- Modify: `tests/audit-intro-shader.test.mjs`

**Interfaces:**
- Produces: `window.__heillerHeroShader.subscribe(listener)`, `retain()`, and `requestFrame()`.
- Consumes: The existing hero `canvas`, `drawFrame(now)`, `requestRender()`, visibility state, and requestAnimationFrame loop.

- [ ] **Step 1: Add failing tests for the shared-frame bridge**

Append:

```js
test("hero shader exposes shared frames without another WebGL context", () => {
  assert.match(html, /window\.__heillerHeroShader\s*=\s*\{/)
  assert.match(html, /subscribe:\s*subscribe/)
  assert.match(html, /retain:\s*retain/)
  assert.match(html, /requestFrame:\s*requestRender/)
})

test("hero animation stays active while an external consumer is visible", () => {
  assert.match(html, /inView\s*\|\|\s*externalUsers\s*>\s*0/)
})
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/audit-intro-shader.test.mjs`

Expected: the two bridge tests FAIL because the API is absent.

- [ ] **Step 3: Add the minimal shared-frame API to the hero renderer**

Add the following state and helpers beside the existing renderer state:

```js
var frameListeners = [];
var externalUsers = 0;

function isActive() {
  return inView || externalUsers > 0;
}

function subscribe(listener) {
  frameListeners.push(listener);
  var removed = false;
  return function () {
    if (removed) return;
    removed = true;
    frameListeners = frameListeners.filter(function (item) { return item !== listener; });
  };
}

function retain() {
  externalUsers += 1;
  requestRender();
  var released = false;
  return function () {
    if (released) return;
    released = true;
    externalUsers = Math.max(0, externalUsers - 1);
  };
}
```

After `gl.drawArrays(...)` in `drawFrame(now)`, notify subscribers:

```js
frameListeners.slice().forEach(function (listener) {
  listener(canvas, now);
});
```

Change both animation guards from `inView` to `isActive()`, then expose:

```js
window.__heillerHeroShader = {
  subscribe: subscribe,
  retain: retain,
  requestFrame: requestRender
};
```

- [ ] **Step 4: Run the focused test**

Run: `node --test tests/audit-intro-shader.test.mjs`

Expected: all bridge and markup tests PASS.

- [ ] **Step 5: Verification checkpoint**

Run: `npm test`

Expected: all tests PASS.

### Task 3: Mask live hero frames into the two lines

**Files:**
- Modify: `index.html` immediately after the hero shader script
- Modify: `tests/audit-intro-shader.test.mjs`

**Interfaces:**
- Consumes: `window.__heillerHeroShader`, `.audit__intro`, `.audit__intro-line`, and `.audit__intro-gl`.
- Produces: `.audit--intro-shader` only after a successful masked paint.

- [ ] **Step 1: Add failing behavior tests**

Append:

```js
test("audit intro masks shared hero frames to its real text", () => {
  assert.match(html, /__heillerHeroShader\.subscribe/)
  assert.match(html, /globalCompositeOperation\s*=\s*"destination-in"/)
  assert.match(html, /audit\.classList\.add\("audit--intro-shader"\)/)
})

test("audit intro handles reduced motion with one shared frame", () => {
  assert.match(html, /prefers-reduced-motion:\s*reduce/)
  assert.match(html, /if\s*\(reduced\)[\s\S]*?releaseHero\(\)[\s\S]*?unsubscribe\(\)/)
})
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/audit-intro-shader.test.mjs`

Expected: the mask and reduced-motion tests FAIL.

- [ ] **Step 3: Add the masked-copy renderer**

Add an IIFE that:

1. Selects the audit, intro, line spans, output canvas, and `window.__heillerHeroShader`.
2. Returns without changing text color if any dependency or the 2D context is unavailable.
3. Copies a vertically flipped, cover-cropped hero frame into the output canvas.
4. Switches to `destination-in` and draws both real line strings at their measured DOM positions using the computed heading font.
5. Adds `.audit--intro-shader` only after the first successful paint.
6. Uses an IntersectionObserver to retain hero rendering only while the audit statement is visible.
7. In reduced-motion mode, paints once, releases the hero renderer, and unsubscribes.

Use this core implementation:

```js
(function () {
  var audit = document.querySelector(".audit");
  var intro = audit && audit.querySelector(".audit__intro");
  var lines = intro && Array.prototype.slice.call(intro.querySelectorAll(".audit__intro-line"));
  var output = intro && intro.querySelector(".audit__intro-gl");
  var hero = window.__heillerHeroShader;
  var g = output && output.getContext("2d");
  if (!audit || !intro || !lines.length || !output || !hero || !g) return;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var releaseHero = null;
  var unsubscribe = null;

  function paint(source) {
    var rect = intro.getBoundingClientRect();
    var width = Math.max(1, Math.round(rect.width));
    var height = Math.max(1, Math.round(rect.height));
    output.width = Math.round(width * dpr);
    output.height = Math.round(height * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, width, height);

    var scale = Math.max(width / source.width, height / source.height);
    var sourceWidth = width / scale;
    var sourceHeight = height / scale;
    var sourceX = (source.width - sourceWidth) * 0.5;
    var sourceY = (source.height - sourceHeight) * 0.5;
    g.save();
    g.translate(0, height);
    g.scale(1, -1);
    g.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
    g.restore();

    var style = window.getComputedStyle(intro);
    g.globalCompositeOperation = "destination-in";
    g.fillStyle = "#000";
    g.font = [style.fontWeight, style.fontSize, style.fontFamily].join(" ");
    g.textBaseline = "top";
    if ("letterSpacing" in g) g.letterSpacing = style.letterSpacing;
    lines.forEach(function (line) {
      var lineRect = line.getBoundingClientRect();
      g.fillText(line.textContent, lineRect.left - rect.left, lineRect.top - rect.top);
    });
    g.globalCompositeOperation = "source-over";
    audit.classList.add("audit--intro-shader");

    if (reduced) {
      if (releaseHero) { releaseHero(); releaseHero = null; }
      if (unsubscribe) { unsubscribe(); unsubscribe = null; }
    }
  }

  unsubscribe = hero.subscribe(paint);
  var observer = new IntersectionObserver(function (entries) {
    var active = entries[0] ? entries[0].isIntersecting : true;
    if (active && !releaseHero) {
      releaseHero = hero.retain();
      hero.requestFrame();
    } else if (!active && releaseHero) {
      releaseHero();
      releaseHero = null;
    }
  }, { threshold: 0 });
  observer.observe(intro);

  window.addEventListener("resize", hero.requestFrame);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(hero.requestFrame);
  }
})();
```

- [ ] **Step 4: Run focused and full automated checks**

Run: `node --test tests/audit-intro-shader.test.mjs`

Expected: all audit intro shader tests PASS.

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 5: Run the production build**

Run: `npm run build`

Expected: TypeScript validation and Vite build complete successfully.

- [ ] **Step 6: Browser verification checkpoint**

Open `http://127.0.0.1:5180/#revenue-audit` at 1440px, 768px, 390px, and 320px widths. Confirm exactly two lines, aligned desktop tops, live shader-only glyphs, no rectangular canvas fill, brown readable fallback before initialization, and a static painted frame under reduced motion. Confirm the console has no WebGL or Canvas errors.
