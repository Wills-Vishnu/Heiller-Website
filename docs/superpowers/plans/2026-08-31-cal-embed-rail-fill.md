# Cal.com Embed Rail-Fill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Uniformly enlarge the wide-desktop Cal.com embed so its visible booking panel reaches both content rails without affecting tablet or mobile.

**Architecture:** Put the pure responsive scale calculation in `cal-booking-layout.js`. The existing `cal-booking.ts` module observes the mounted iframe, calculates its native width/height variables, and lets CSS scale the `cal-inline` host with compensated frame height.

**Tech Stack:** TypeScript, JavaScript ES modules, CSS transforms, ResizeObserver, MutationObserver, Node.js test runner, Vite.

## Global Constraints

- Scale only above 1200px.
- Use a 1040px native panel target and cap scale at 1.26.
- Scale uniformly and center from the top edge.
- Compensate layout height so FAQ content cannot overlap.
- Do not access cross-origin iframe content.
- Preserve the existing unscaled tablet/mobile layout.

---

### Task 1: Pure layout calculation

**Files:**
- Create: `cal-booking-layout.js`
- Create: `tests/cal-booking-layout.test.mjs`

**Interfaces:**
- Produces: `getCalEmbedLayout(frameWidth, iframeHeight, viewportWidth)` returning `{ scale, nativeWidth, scaledHeight }`.
- Consumed by: `cal-booking.ts` in Task 2.

- [ ] **Step 1: Write failing unit tests**

```js
import test from "node:test"
import assert from "node:assert/strict"
import { getCalEmbedLayout } from "../cal-booking-layout.js"

test("fills wide rails from the native Cal panel width", () => {
  assert.deepEqual(getCalEmbedLayout(1250, 570, 1440), {
    scale: 1250 / 1040,
    nativeWidth: 1040,
    scaledHeight: 570 * (1250 / 1040),
  })
})

test("caps desktop scale at 1.26", () => {
  const layout = getCalEmbedLayout(1400, 570, 1600)
  assert.equal(layout.scale, 1.26)
  assert.equal(layout.nativeWidth, 1400 / 1.26)
})

test("keeps tablet and mobile unscaled", () => {
  assert.deepEqual(getCalEmbedLayout(900, 570, 1200), { scale: 1, nativeWidth: 900, scaledHeight: 570 })
})
```

- [ ] **Step 2: Run the unit test and confirm failure**

Run: `node --test tests/cal-booking-layout.test.mjs`

Expected: failure because the module does not exist.

- [ ] **Step 3: Implement the pure calculation**

```js
const DESKTOP_BREAKPOINT = 1200
const NATIVE_PANEL_WIDTH = 1040
const MAX_SCALE = 1.26

export function getCalEmbedLayout(frameWidth, iframeHeight, viewportWidth) {
  if (viewportWidth <= DESKTOP_BREAKPOINT || frameWidth <= 0 || iframeHeight <= 0) {
    return { scale: 1, nativeWidth: frameWidth, scaledHeight: iframeHeight }
  }
  const scale = Math.min(MAX_SCALE, Math.max(1, frameWidth / NATIVE_PANEL_WIDTH))
  return { scale, nativeWidth: frameWidth / scale, scaledHeight: iframeHeight * scale }
}
```

- [ ] **Step 4: Confirm the unit tests pass**

Run: `node --test tests/cal-booking-layout.test.mjs`

Expected: all three tests pass.

### Task 2: Runtime measurement and scaling CSS

**Files:**
- Modify: `cal-booking.ts`
- Modify: `index.html:1120-1158`
- Modify: `tests/cal-booking.test.mjs`

**Interfaces:**
- Consumes: `getCalEmbedLayout`, `[data-cal-booking]`, and the light-DOM Cal.com iframe.
- Produces: `--cal-embed-scale`, `--cal-embed-native-width`, `--cal-embed-native-height`, and `--cal-embed-scaled-height` on the booking frame.

- [ ] **Step 1: Add failing source contracts**

Extend the Cal booking test to assert that `cal-booking.ts` imports `getCalEmbedLayout`, uses `ResizeObserver` and `MutationObserver`, reads `iframe.offsetHeight`, and writes all four CSS variables. Assert the desktop CSS transforms `cal-inline` with `scale(var(--cal-embed-scale))`, uses `transform-origin: top center`, and gives the frame `height: var(--cal-embed-scaled-height)` only inside `@media (min-width: 1201px)`.

- [ ] **Step 2: Confirm the source contracts fail**

Run: `node --test tests/cal-booking.test.mjs`

Expected: failure because runtime scaling is not yet present.

- [ ] **Step 3: Implement observation and variable updates**

Import `getCalEmbedLayout`. After initializing the embed, define a throttled `syncEmbedLayout()` that finds `mount.querySelector("iframe")`, uses `mount.clientWidth`, `iframe.offsetHeight`, and `window.innerWidth`, then writes the four pixel/number properties. Observe mount mutations, mount resizing, iframe resizing once available, and window resizing. Keep all cross-origin content untouched.

- [ ] **Step 4: Add the wide-desktop CSS**

Inside `@media (min-width: 1201px)`, set the frame height from the variable and center a native-width `cal-inline` host transformed uniformly from `top center`. Keep the existing iframe width and square corner declarations. The existing mobile rule remains unchanged.

- [ ] **Step 5: Run automated verification**

```powershell
node --test tests/cal-booking-layout.test.mjs tests/cal-booking.test.mjs
npm test
npm run build
```

Expected: focused and full tests pass, and Vite completes the build.

- [ ] **Step 6: Verify live geometry**

At 1969px, confirm the scaled `cal-inline` visual bounds equal the booking rail bounds within 2px and FAQ top is below the visual embed bottom. At 1200px, 768px, 393px, and 320px, confirm scale is 1. Confirm no page overflow and a clean console.

This workspace is not a Git repository, so no commit step applies.
