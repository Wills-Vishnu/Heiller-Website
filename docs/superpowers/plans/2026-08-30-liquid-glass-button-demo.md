# Liquid Glass Button Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone liquid-glass capsule button demo over a self-contained flowing image without changing the V2 landing page.

**Architecture:** Create one directly served HTML entry containing the backdrop, accessible button, SVG filter definitions, styles, and a small damped-spring animation loop. Add one Node test file that validates isolation, accessibility, visual primitives, and motion fallbacks without coupling the demo to the landing page.

**Tech Stack:** HTML5, CSS custom properties, SVG filters, vanilla JavaScript, requestAnimationFrame, Node test runner, Vite.

## Global Constraints

- Do not modify `index.html` or add navigation/site sections.
- Serve the demo directly as `/liquid-glass-button.html`.
- Use no runtime dependency and no external image request.
- Use a native button labelled `Elegant` with visible keyboard focus.
- Disable spring deformation under `prefers-reduced-motion: reduce`.
- Preserve a usable translucent fallback when backdrop filtering is unavailable.

---

### Task 1: Standalone Liquid-Glass Demo

**Files:**
- Create: `D:/Design/Heiller/liquid-glass-button.html`
- Create: `D:/Design/Heiller/tests/liquid-glass-button.test.mjs`
- Verify unchanged: `D:/Design/Heiller/index.html`

**Interfaces:**
- Consumes: Vite's native multi-page HTML serving and browser Pointer Events.
- Produces: `/liquid-glass-button.html` and a self-contained `LiquidGlassController` animation loop scoped to `#liquid-glass-button`.

- [ ] **Step 1: Write failing isolation and markup tests**

Create `tests/liquid-glass-button.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const demoPath = new URL('../liquid-glass-button.html', import.meta.url);

test('liquid glass demo is a standalone accessible page', async () => {
  const html = await readFile(demoPath, 'utf8');
  assert.match(html, /<button[^>]+id="liquid-glass-button"/);
  assert.match(html, />\s*Elegant\s*</);
  assert.match(html, /<svg[^>]+aria-hidden="true"/);
  assert.doesNotMatch(html, /<nav\b|<footer\b|href=["']\/[^"']/);
});

test('demo includes refraction, spring physics, and reduced-motion handling', async () => {
  const html = await readFile(demoPath, 'utf8');
  assert.match(html, /feDisplacementMap/);
  assert.match(html, /backdrop-filter:/);
  assert.match(html, /requestAnimationFrame/);
  assert.match(html, /prefers-reduced-motion:\s*reduce/);
  assert.match(html, /pointerdown/);
  assert.match(html, /pointermove/);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test tests/liquid-glass-button.test.mjs`

Expected: FAIL with `ENOENT` for `liquid-glass-button.html`.

- [ ] **Step 3: Create the self-contained page shell and image field**

Create `liquid-glass-button.html` with a semantic document, an `aria-hidden="true"` SVG filter definition, a full-viewport `.image-field`, and:

```html
<main class="stage">
  <button class="liquid-glass" id="liquid-glass-button" type="button">
    <span class="liquid-glass__surface" aria-hidden="true"></span>
    <span class="liquid-glass__label">Elegant</span>
  </button>
</main>
```

Build the sample image from layered CSS radial and conic gradients plus pseudo-elements, keeping all assets local to the document.

- [ ] **Step 4: Add the optical surface and fallbacks**

Implement the capsule with CSS custom properties `--rx`, `--ry`, `--sx`, `--sy`, `--press`, `--highlight-x`, and `--highlight-y`. Apply:

```css
.liquid-glass__surface {
  background: rgba(226, 255, 245, 0.16);
  -webkit-backdrop-filter: url(#liquid-refraction) blur(10px) saturate(1.35);
  backdrop-filter: url(#liquid-refraction) blur(10px) saturate(1.35);
  box-shadow: inset 0 1px 1px rgba(255,255,255,.82),
              inset 0 -1px 1px rgba(14,83,62,.18),
              0 18px 50px rgba(10,70,52,.22);
}
```

Add a directional highlight pseudo-element positioned by the highlight variables, a visible `:focus-visible` outline, and an `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` translucent fallback.

- [ ] **Step 5: Add bounded damped-spring interaction**

Define state entries with `{ value, target, velocity }` and integrate each frame using:

```js
velocity += (target - value) * stiffness;
velocity *= damping;
value += velocity;
```

Use pointer position and pointer velocity to set bounded targets for translation (maximum 10px), rotation (maximum 4deg), and stretch (maximum 4%). On `pointerdown`, set press to `1`; on `pointerup`, `pointercancel`, and `lostpointercapture`, return it to `0`. Reset directional targets on `pointerleave`. Continue frames until every delta and velocity is below `0.001`.

- [ ] **Step 6: Add reduced-motion and keyboard behavior**

Use `matchMedia('(prefers-reduced-motion: reduce)')` to bypass spring transforms and keep the glass static. Preserve native Enter/Space activation. Add an active state for keyboard activation without requiring Pointer Events.

- [ ] **Step 7: Run focused and full tests**

Run: `node --test tests/liquid-glass-button.test.mjs`

Expected: 2 tests pass.

Run: `npm test`

Expected: all existing tests and the 2 new tests pass.

- [ ] **Step 8: Build and visually verify**

Run: `npm run build`

Expected: TypeScript and Vite build complete successfully and emit `dist/liquid-glass-button.html`.

Open `http://127.0.0.1:5180/liquid-glass-button.html` and verify:

- The page contains only the image field and centered “Elegant” capsule.
- Pointer movement creates restrained lag, stretch, tilt, and moving highlight.
- Pressing compresses the capsule and releasing produces a brief rebound.
- Tab focus is visible and Enter/Space activate the native button.
- At 393px and 1440px widths there is no overflow.
- The console contains no errors.
- `git diff -- index.html` is empty when Git metadata is available; otherwise compare the file checksum recorded before and after implementation.

- [ ] **Step 9: Commit the isolated demo when Git is available**

```bash
git add liquid-glass-button.html tests/liquid-glass-button.test.mjs docs/superpowers/specs/2026-08-30-liquid-glass-button-demo-design.md docs/superpowers/plans/2026-08-30-liquid-glass-button-demo.md
git commit -m "feat: add liquid glass button interaction demo"
```

If the directory is not a Git repository, report that no commit could be created rather than initializing or changing repository configuration.
