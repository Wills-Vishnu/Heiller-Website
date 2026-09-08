# V3 Dedicated Team Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add V3's exact orbiting-pill “A dedicated team, fully embedded” experience to V2 as the third major content section.

**Architecture:** Add semantic section markup and scoped styles to V2's existing `index.html`, while keeping the motion calculations in a focused TypeScript module. The module exposes pure orbit helpers for tests and initializes viewport-aware animation for the page. V2 remains dependency-free beyond its existing Vite and TypeScript toolchain.

**Tech Stack:** HTML, CSS, TypeScript, browser `requestAnimationFrame`, `IntersectionObserver`, `ResizeObserver`, Node test runner, Vite.

## Global Constraints

- Place the new section immediately after Services and before Results.
- Preserve all eight V3 pill labels, palettes, grain, typography, spacing, orbit geometry, layering, mobile blur, and reduced-motion behavior.
- Do not add React, GSAP, or another runtime dependency.
- Do not change unrelated V2 sections, IDs, or navigation targets.
- `D:\Design\Heiller` is not currently a Git repository, so commit steps must be deferred until the user initializes or links a repository.

---

## File Map

- Create `dedicated-team.ts`: pure orbit calculations plus DOM animation initialization.
- Create `tests/dedicated-team.test.mjs`: markup, palette, placement, responsive CSS, and motion-source tests.
- Modify `index.html`: section markup, scoped styles, and module entry script.

### Task 1: Lock the V3 Section Contract with Tests

**Files:**
- Create: `tests/dedicated-team.test.mjs`
- Test: `index.html`
- Test: `dedicated-team.ts`

**Interfaces:**
- Consumes: V2's static `index.html` and the future `dedicated-team.ts` module.
- Produces: A regression contract for section order, exact labels, palettes, accessibility, responsive presentation, and motion helpers.

- [ ] **Step 1: Write the failing markup and motion-source tests**

```js
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")
const motion = await readFile(new URL("../dedicated-team.ts", import.meta.url), "utf8").catch(() => "")

test("dedicated team is the third major section", () => {
  const services = html.indexOf('<section class="services" id="services">')
  const dedicated = html.indexOf('<section class="dedicated-team"')
  const results = html.indexOf('<section class="results"')
  assert.ok(services > -1 && dedicated > services && results > dedicated)
})

test("dedicated team contains the exact V3 pill set", () => {
  const section = html.match(/<section class="dedicated-team"[\s\S]*?<\/section>/)?.[0] ?? ""
  for (const label of [
    "Credentialing", "Patient registration", "Coding", "Billing",
    "Denial management", "A/R follow-up", "Eligibility", "Revenue reporting",
  ]) assert.match(section, new RegExp(`>${label}<`))
  assert.equal((section.match(/data-dedicated-pill/g) ?? []).length, 8)
})

test("dedicated team retains V3 responsive depth and reduced-motion rules", () => {
  assert.match(html, /\.dedicated-team__pill::after/)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*\.dedicated-team__field/)
  assert.match(motion, /prefers-reduced-motion:\s*reduce/)
  assert.match(motion, /IntersectionObserver/)
  assert.match(motion, /ResizeObserver/)
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test`

Expected: existing tests pass and `dedicated-team.test.mjs` fails because the section and motion module do not exist.

### Task 2: Add the Semantic Section and Exact V3 Styling

**Files:**
- Modify: `index.html`, immediately before `<!-- Results -->`
- Test: `tests/dedicated-team.test.mjs`

**Interfaces:**
- Consumes: the eight V3 pill labels and CSS custom properties `--pill-from`, `--pill-to`, and `--pill-accent`.
- Produces: `[data-dedicated-field]` containing eight `[data-dedicated-pill]` elements for the motion module.

- [ ] **Step 1: Add the section markup between Services and Results**

```html
<section class="dedicated-team" aria-labelledby="dedicated-team-title">
  <div class="dedicated-team__field" data-dedicated-field>
    <h2 id="dedicated-team-title">A dedicated team,<br />fully embedded</h2>
    <div class="dedicated-team__pills" aria-hidden="true">
      <span class="dedicated-team__pill" data-dedicated-pill style="--pill-from:#f49cff;--pill-to:#b725d0;--pill-accent:#705cff">Credentialing</span>
      <span class="dedicated-team__pill" data-dedicated-pill style="--pill-from:#ff9b7d;--pill-to:#f43725;--pill-accent:#ffcf62">Patient registration</span>
      <span class="dedicated-team__pill" data-dedicated-pill style="--pill-from:#8ee8b8;--pill-to:#16bd72;--pill-accent:#56d6d6">Coding</span>
      <span class="dedicated-team__pill" data-dedicated-pill style="--pill-from:#ffe889;--pill-to:#f4ca17;--pill-accent:#ff9d57">Billing</span>
      <span class="dedicated-team__pill" data-dedicated-pill style="--pill-from:#91b5ff;--pill-to:#3d6de8;--pill-accent:#8c62ee">Denial management</span>
      <span class="dedicated-team__pill" data-dedicated-pill style="--pill-from:#ff9ac9;--pill-to:#f05098;--pill-accent:#c55cff">A/R follow-up</span>
      <span class="dedicated-team__pill" data-dedicated-pill style="--pill-from:#ffc06c;--pill-to:#ee7b24;--pill-accent:#ff5f55">Eligibility</span>
      <span class="dedicated-team__pill" data-dedicated-pill style="--pill-from:#9be8d6;--pill-to:#50c9aa;--pill-accent:#63a7ff">Revenue reporting</span>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add scoped CSS matching V3**

Add rules for `.dedicated-team`, `.dedicated-team__field`, `.dedicated-team h2`, `.dedicated-team__pills`, `.dedicated-team__pill`, and `.dedicated-team__pill::after`. Use V3's desktop values:

```css
.dedicated-team { position: relative; overflow: hidden; background: #fff; padding: clamp(64px, 6vw, 112px) clamp(20px, 3.2vw, 65px) clamp(52px, 4.8vw, 90px); }
.dedicated-team__field { position: relative; min-height: clamp(450px, 52vw, 760px); display: grid; place-items: center; }
.dedicated-team h2 { position: relative; z-index: 2; margin: 0; text-align: center; font-size: clamp(41px, 5.1vw, 88px); line-height: .91; letter-spacing: -.055em; pointer-events: none; }
.dedicated-team__pills { position: absolute; inset: 0; pointer-events: none; }
.dedicated-team__pill { position: absolute; left: 50%; top: 50%; isolation: isolate; overflow: hidden; padding: 9px 16px 10px; border-radius: 99px; background: radial-gradient(circle at 24% 18%, color-mix(in srgb, var(--pill-accent) 72%, white), transparent 42%), linear-gradient(135deg, var(--pill-from), var(--pill-to)); color: #080808; font-size: clamp(10px, .8vw, 15px); font-weight: 600; white-space: nowrap; will-change: transform, filter; }
```

The `::after` rule must use V3's 96×96 fractal-noise SVG data URI at `.09` opacity. At `max-width: 767px`, set the section padding to `64px 20px 52px`, field minimum height to `470px`, heading size to `41px`, and pill sizing to `7px 11px` with `9px` text.

- [ ] **Step 3: Run the tests**

Run: `npm test`

Expected: placement, labels, palettes, and CSS checks pass; motion-source checks remain failing until Task 3.

### Task 3: Port V3 Orbit Physics and Lifecycle

**Files:**
- Create: `dedicated-team.ts`
- Modify: `index.html`, before `</body>`
- Test: `tests/dedicated-team.test.mjs`

**Interfaces:**
- Produces: `getOrbitTransform(index, angle, width, height, compact)`, `getOrbitDepth(x)`, `getOrbitBlur(x, width, mobile, reducedMotion)`, `getTargetAngularVelocity(scrollVelocity)`, and `dampAngularVelocity(current, target, deltaSeconds)`.
- Consumes: `[data-dedicated-field]` and `[data-dedicated-pill]` from Task 2.

- [ ] **Step 1: Implement the pure V3 motion helpers**

Use the V3 constants exactly:

```ts
const TAU = Math.PI * 2
const PILL_COUNT = 8
const START_ANGLE = -(Math.PI * 3) / 8
const MAX_SCROLL_VELOCITY = 2400
const MAX_ANGULAR_VELOCITY = 5.76
const SETTLE_TIME_CONSTANT_SECONDS = 0.1
const COMPACT_RADIUS_X = 0.324
const MAX_MOBILE_ORBIT_BLUR_PX = 2.5
```

Calculate `radiusX` as `width * (compact ? 0.324 : 0.35)` and `radiusY` as `height * (compact ? 0.36 : 0.324)`. Preserve V3's smoothstep rear-depth blur and exponential angular-velocity damping.

- [ ] **Step 2: Implement the DOM lifecycle**

Initialize the field once, measure it with `getBoundingClientRect()`, and apply each pill using `translate3d(x, y, 0) translate(-50%, -50%)`, `z-index` 1 behind or 3 in front, and the calculated mobile blur. Use:

- `ResizeObserver` to remeasure and relayout.
- `IntersectionObserver` with `rootMargin: "12% 0px"` to limit active animation.
- A passive `scroll` listener to sample pixels per second.
- `requestAnimationFrame` for damping and orbit updates.
- `visibilitychange` to pause work in a background tab.
- A reduced-motion media query to keep the initial static layout and disable blur.

- [ ] **Step 3: Load the module from V2**

Add before `</body>`:

```html
<script type="module" src="/dedicated-team.ts"></script>
```

- [ ] **Step 4: Run tests and production build**

Run: `npm test && npm run build`

Expected: all tests pass and Vite emits a successful production bundle without TypeScript errors.

### Task 4: Browser Verification and Fidelity Pass

**Files:**
- Modify if required: `index.html`
- Modify if required: `dedicated-team.ts`
- Test: `tests/dedicated-team.test.mjs`

**Interfaces:**
- Consumes: completed section and V3 at `https://heiller-v3.vercel.app/` as the visual reference.
- Produces: verified desktop, mobile, and reduced-motion behavior in V2.

- [ ] **Step 1: Verify desktop at 1440px**

Confirm the new section is between Services and Results; heading wrapping, section height, eight starting positions, palette, grain, scroll direction, acceleration, settling, and stacking match V3.

- [ ] **Step 2: Verify mobile at 393px and 320px**

Confirm no horizontal overflow, heading stays readable, pills remain within the field, rear pills blur to no more than `2.5px`, and front pills remain sharp.

- [ ] **Step 3: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`; confirm a stable eight-pill arrangement, no orbit movement, and no blur.

- [ ] **Step 4: Run the final verification suite**

Run: `npm test && npm run build`

Expected: every test passes and the production build succeeds.

