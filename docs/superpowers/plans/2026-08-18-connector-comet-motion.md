# Connector Comet Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace rigid glowing connector bars with smooth path-following signal beads and make each origin box match its node color.

**Architecture:** Keep the existing SVG tracks and node geometry. Represent each moving signal as a three-bead group whose children share one CSS `offset-path` through custom properties but use small timing offsets, so each bead independently follows bends instead of rotating as one rigid trail.

**Tech Stack:** Static HTML, CSS Motion Path, Vite build, in-app browser verification.

## Global Constraints

- Use opacity and size—not blur, glow, or shadow—to distinguish the wake.
- Preserve the current sequence and overall animation pace unless browser verification reveals visible overlap.
- Keep the origin boxes above the dashed track and preserve their current size and position.
- Hide all moving signals when `prefers-reduced-motion: reduce` is active.
- Do not change node layout, connector geometry, dashed tracks, typography, page spacing, or unrelated sections.

---

### Task 1: Replace rigid comets with path-following bead groups

**Files:**
- Modify: `design/index.html`
- Verify: `design/index.html` source assertions and live `/design/` DOM/computed styles

**Interfaces:**
- Consumes: existing connector paths, colors, and delays.
- Produces: `.signal-group`, `.signal`, `.signal--head`, `.signal--wake-one`, and `.signal--wake-two` decorative motion elements.

- [x] **Step 1: Run source checks that demonstrate the current failure**

Run:

```powershell
rg -n "drop-shadow|\.wire-port \{ fill:|width: 44px|class=\"comet\"" design/index.html
```

Expected: matches show a shadow filter, the grey port override, a 44px comet, and seven rigid comet elements.

- [x] **Step 2: Replace the CSS motion treatment**

Remove `.wire-port { fill: #AEB2B1; }`, `.comet`, and `@keyframes comet-flow`. Add:

```css
.signal-group {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.signal {
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--signal-color);
  offset-path: var(--signal-route);
  offset-distance: 0%;
  offset-anchor: center;
  animation: signal-flow 4.7s linear infinite both;
  animation-delay: var(--signal-delay);
}
.signal--wake-one {
  width: 4px;
  height: 4px;
  opacity: 0.52;
  animation-delay: calc(var(--signal-delay) + 80ms);
}
.signal--wake-two {
  width: 2.5px;
  height: 2.5px;
  opacity: 0.24;
  animation-delay: calc(var(--signal-delay) + 160ms);
}
@keyframes signal-flow {
  0% { offset-distance: 0%; opacity: 0; }
  4% { opacity: var(--signal-opacity, 1); }
  35% { offset-distance: 100%; opacity: var(--signal-opacity, 1); }
  43% { offset-distance: 100%; opacity: 0; }
  100% { offset-distance: 100%; opacity: 0; }
}
```

Set `--signal-opacity: 0.52` and `0.24` on the two wake classes so the keyframes preserve their intended opacity. Update reduced motion to target `.signal-group` instead of `.comet`.

- [x] **Step 3: Replace each comet with a three-bead group**

Use these exact seven groups:

```html
<span class="signal-group" aria-hidden="true" style="--signal-route:path('M50.5 65 L50.5 68.75 Q50.5 72.5 54.25 72.5 L121 72.5');--signal-color:#FFAB8D;--signal-delay:0s"><i class="signal signal--head"></i><i class="signal signal--wake-one"></i><i class="signal signal--wake-two"></i></span>
<span class="signal-group" aria-hidden="true" style="--signal-route:path('M187.5 109 L187.5 142.25 Q187.5 159.5 204.75 159.5 L222 159.5');--signal-color:#FC7EC7;--signal-delay:0.6s"><i class="signal signal--head"></i><i class="signal signal--wake-one"></i><i class="signal signal--wake-two"></i></span>
<span class="signal-group" aria-hidden="true" style="--signal-route:path('M288.5 196 L288.5 229.25 Q288.5 246.5 305.75 246.5 L323 246.5');--signal-color:#B3A5F5;--signal-delay:1.2s"><i class="signal signal--head"></i><i class="signal signal--wake-one"></i><i class="signal signal--wake-two"></i></span>
<span class="signal-group" aria-hidden="true" style="--signal-route:path('M448 246.5 L637 246.5');--signal-color:#B4E7BC;--signal-delay:1.8s"><i class="signal signal--head"></i><i class="signal signal--wake-one"></i><i class="signal signal--wake-two"></i></span>
<span class="signal-group" aria-hidden="true" style="--signal-route:path('M703.5 210 L703.5 173.25 Q703.5 159.5 717.25 159.5 L731 159.5');--signal-color:#96D7FF;--signal-delay:2.4s"><i class="signal signal--head"></i><i class="signal signal--wake-one"></i><i class="signal signal--wake-two"></i></span>
<span class="signal-group" aria-hidden="true" style="--signal-route:path('M797.5 123 L797.5 86.25 Q797.5 72.5 811.25 72.5 L825 72.5');--signal-color:#FAE261;--signal-delay:3.0s"><i class="signal signal--head"></i><i class="signal signal--wake-one"></i><i class="signal signal--wake-two"></i></span>
<span class="signal-group" aria-hidden="true" style="--signal-route:path('M891.5 36 L891.5 32.25 Q891.5 28.5 895.25 28.5 L962 28.5');--signal-color:#97B6FF;--signal-delay:3.6s"><i class="signal signal--head"></i><i class="signal signal--wake-one"></i><i class="signal signal--wake-two"></i></span>
```

Routes, colors, and delays remain: Patient `#FFAB8D/0s`, Verify `#FC7EC7/0.6s`, Code `#B3A5F5/1.2s`, Claim `#B4E7BC/1.8s`, Process `#96D7FF/2.4s`, Payment `#FAE261/3.0s`, Report `#97B6FF/3.6s`.

- [x] **Step 4: Run build and source assertions**

Run:

```powershell
npm run build
rg -n "drop-shadow|class=\"comet\"|\.wire-port \{ fill:" design/index.html
```

Expected: build succeeds; `rg` returns no matches.

- [x] **Step 5: Verify the live browser state**

Reload `http://127.0.0.1:5173/design/` and assert: seven `.signal-group` elements, 21 `.signal` elements, seven `.wire-port` elements whose computed fills equal their inline fills, no shadow/filter on `.signal`, nonzero changing `offset-distance`, and no console errors.

- [x] **Step 6: Record completion**

No commit is possible because `D:\Design\Heiller` is not a Git repository. Report the modified file, successful build, and live verification results.
