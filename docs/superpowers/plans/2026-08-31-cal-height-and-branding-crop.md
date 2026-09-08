# Cal.com Full Height and Branding Crop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the complete Cal.com desktop height and clip only its 64px bottom branding zone.

**Architecture:** Extend the pure layout helper to select the larger reported height and calculate desktop visible height after the crop. Update the existing Cal observer to watch style changes and feed the stable native height into the CSS variables; CSS clips the scaled iframe at the compensated frame boundary.

**Tech Stack:** JavaScript ES modules, TypeScript, CSS overflow clipping, MutationObserver, Node.js test runner, Vite.

## Global Constraints

- Use the larger of computed/offset and inline-reported iframe heights.
- Crop 64 native pixels only above 1200px.
- Keep the iframe itself at full native height before uniform scaling.
- Keep tablet/mobile full-height, unscaled, and uncropped.
- Do not access cross-origin iframe content.

---

### Task 1: Stable height and crop calculations

**Files:**
- Modify: `cal-booking-layout.js`
- Modify: `tests/cal-booking-layout.test.mjs`

**Interfaces:**
- Produces: `getReportedCalHeight(offsetHeight, inlineHeight)`.
- Updates: `getCalEmbedLayout(frameWidth, iframeHeight, viewportWidth)` so `scaledHeight` subtracts the 64px desktop crop before scaling.

- [ ] **Step 1: Add failing calculation tests**

Add assertions that `getReportedCalHeight(300, "570px")` returns `570`, invalid inline values fall back to the offset height, wide desktop `scaledHeight` equals `(570 - 64) * scale`, and the 1200px path retains all 570px.

- [ ] **Step 2: Confirm the focused test fails**

Run: `node --test tests/cal-booking-layout.test.mjs`

Expected: failure because reported-height selection and crop calculation are absent.

- [ ] **Step 3: Implement the calculations**

```js
const DESKTOP_BRANDING_CROP = 64

export function getReportedCalHeight(offsetHeight, inlineHeight) {
  const reportedHeight = Number.parseFloat(inlineHeight)
  return Math.max(offsetHeight, Number.isFinite(reportedHeight) ? reportedHeight : 0)
}
```

For desktop, calculate `scaledHeight` with `Math.max(0, iframeHeight - DESKTOP_BRANDING_CROP) * scale`. Keep the existing tablet/mobile return unchanged.

- [ ] **Step 4: Confirm focused tests pass**

Run: `node --test tests/cal-booking-layout.test.mjs`

Expected: all calculation tests pass.

### Task 2: Runtime height recovery and visual crop

**Files:**
- Modify: `cal-booking.ts`
- Modify: `index.html`
- Modify: `tests/cal-booking.test.mjs`

**Interfaces:**
- Consumes: `getReportedCalHeight`, `iframe.offsetHeight`, and `iframe.style.height`.
- Produces: stable full iframe height variables and a clipped desktop booking frame.

- [ ] **Step 1: Add failing source contracts**

Assert the booking module imports and calls `getReportedCalHeight`, reads `iframe.style.height`, and observes `{ childList: true, subtree: true, attributes: true, attributeFilter: ["style"] }`. Assert the scaled frame CSS uses `overflow: hidden`.

- [ ] **Step 2: Confirm the source contracts fail**

Run: `node --test tests/cal-booking.test.mjs`

Expected: failure because the runtime still reads only `offsetHeight` and does not clip.

- [ ] **Step 3: Implement the runtime changes**

Replace the direct `iframe.offsetHeight` assignment with `getReportedCalHeight(iframe.offsetHeight, iframe.style.height)`. Expand the mutation observer options to include iframe style changes. Add `overflow: hidden` to the wide-desktop scaled frame rule.

- [ ] **Step 4: Run automated verification**

```powershell
node --test tests/cal-booking-layout.test.mjs tests/cal-booking.test.mjs
npm test
npm run build
```

Expected: focused tests and the full suite pass, and Vite completes the production build.

- [ ] **Step 5: Verify live behavior**

At wide desktop, confirm the iframe native height is 570px, the full scaled iframe is 718.2px, the clipped frame is approximately 637.6px, both horizontal rail deltas stay within 2px, and the FAQ begins at the frame bottom. Confirm no page overflow and a clean console. At 1200px, 768px, 393px, and 320px, confirm scale 1 and no crop.

This workspace is not a Git repository, so no commit step applies.
