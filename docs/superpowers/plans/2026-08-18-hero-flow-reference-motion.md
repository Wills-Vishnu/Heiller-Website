# Hero Flow Reference Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the reference-style neutral workflow while revealing each node's original Heiller color and drawing every route from its source color into its destination color.

**Architecture:** Keep the existing workflow layout, labels, dashed SVG tracks, arrow geometry, and responsive sizing. Replace the bead and comet layers with synchronized SVG route overlays and CSS node-state animations driven by one `7.7s` timeline; preserve a static neutral workflow for reduced motion.

**Tech Stack:** Standalone HTML/CSS, inline SVG, CSS keyframes, Vite 6.

## Global Constraints

- Preserve every Heiller label, box position, box size, route coordinate, hero layout, and surrounding section.
- Inactive boxes are neutral light grey with dark text.
- The current source and arriving destination reveal their original box colors with matching soft glows.
- Each solid route blends from its source box color into its destination box color and finishes with a destination-colored arrowhead.
- Remove beads, dots, comet heads, detached trails, and permanent node colors.
- The sequence order is `Patient`, `Verify`, `Code`, `Claim`, `Process`, `Payment`, `Report`, `Optimize`.
- Use one approximately `7.7s` continuous loop with seven sequential route phases.
- Add no dependency, JavaScript animation loop, canvas, image, or asset.
- Reduced motion keeps neutral boxes and dashed routes while hiding traveling overlays and glow.
- This workspace is not a Git repository, so commit steps are documented but skipped locally.

---

### Task 1: Replace the hero motion layers and node states

**Files:**
- Modify: `design/index.html:177-284`
- Modify: `design/index.html:601-653`
- Test: live page at `http://127.0.0.1:5173/design/`

**Interfaces:**
- Consumes: existing `.flow__tags`, `.flow__wires`, `.wire-track`, `.wire-arrow`, `.wire-port`, and `.tag` geometry.
- Produces: `.wire-travel`, `.wire-travel-arrow`, `.wire-port`, and `.tag` elements synchronized through `--phase` and `--node-delay` custom properties.

- [ ] **Step 1: Record the failing source-state check**

Run:

```powershell
rg -n "signal-group|class=\"signal\"|wire-pulse|wire-arrow-pulse|background:#FFAB8D|background:#FC7EC7" design\index.html
```

Expected before implementation: matches for the obsolete beads, pulse classes, and permanent box colors.

- [ ] **Step 2: Replace the current signal and pulse CSS**

Remove `.signal-group`, `.signal`, `@keyframes signal-flow`, `.wire-pulse`, `@keyframes wire-trail`, `.wire-arrow-pulse`, and `@keyframes arrow-trail`. Add:

```css
  .wire-travel,
  .wire-travel-arrow {
    fill: none;
    stroke-width: 2.25px;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0;
    animation-duration: 7.7s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-delay: var(--phase);
  }
  .wire-travel {
    stroke: var(--route-stroke);
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation-name: route-travel;
  }
  .wire-travel-arrow {
    stroke: var(--arrow-color);
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation-name: arrow-arrival;
  }
  .wire-port {
    fill: #AEB4B2;
    animation: port-state 7.7s ease-in-out infinite;
    animation-delay: var(--phase);
  }
  .tag {
    --node-color: #ECEEEE;
    --active-text: #303433;
    background: #ECEEEE;
    color: #303433;
    box-shadow: none;
    animation: node-state 7.7s ease-in-out infinite;
    animation-delay: var(--node-delay);
  }
  .tag--start {
    animation-name: start-node-state;
  }
  .tag--terminal {
    animation-name: terminal-node-state;
  }
  @keyframes route-travel {
    0%, 1% { opacity: 0; stroke-dashoffset: 100; }
    2% { opacity: 1; stroke-dashoffset: 100; }
    11% { opacity: 1; stroke-dashoffset: 0; }
    13.5% { opacity: 0; stroke-dashoffset: 0; }
    100% { opacity: 0; stroke-dashoffset: 0; }
  }
  @keyframes arrow-arrival {
    0%, 9% { opacity: 0; stroke-dashoffset: 100; }
    10.5% { opacity: 1; stroke-dashoffset: 0; }
    13.5% { opacity: 0; stroke-dashoffset: 0; }
    100% { opacity: 0; stroke-dashoffset: 0; }
  }
  @keyframes port-state {
    0%, 13.5% { fill: var(--source-color); }
    16%, 100% { fill: #AEB4B2; }
  }
  @keyframes node-state {
    0%, 2.5% {
      background: var(--node-color);
      color: var(--active-text);
      box-shadow: 0 0 36px 18px color-mix(in srgb, var(--node-color) 32%, transparent);
    }
    3.5%, 14% {
      background: var(--node-color);
      color: var(--active-text);
      box-shadow: 0 0 32px 16px color-mix(in srgb, var(--node-color) 26%, transparent);
    }
    17%, 100% {
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
    }
  }
  @keyframes start-node-state {
    0%, 14% {
      background: var(--node-color);
      color: var(--active-text);
      box-shadow: 0 0 32px 16px color-mix(in srgb, var(--node-color) 26%, transparent);
    }
    17%, 100% {
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
    }
  }
  @keyframes terminal-node-state {
    0%, 2% {
      background: var(--node-color);
      color: var(--active-text);
      box-shadow: 0 0 36px 18px color-mix(in srgb, var(--node-color) 32%, transparent);
    }
    2.1%, 2.6% {
      background: var(--node-color);
      color: var(--active-text);
      box-shadow: 0 0 32px 16px color-mix(in srgb, var(--node-color) 26%, transparent);
    }
    3%, 100% {
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .wire-travel,
    .wire-travel-arrow {
      display: none;
    }
    .wire-port,
    .tag {
      animation: none;
    }
    .tag {
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
    }
    .wire-port {
      fill: #AEB4B2;
    }
  }
```

- [ ] **Step 3: Replace the colored arrow pulse paths with route overlays**

Inside `.flow__wires`, replace the single cyan-to-green gradient with seven direction-aware gradients:

```html
              <defs>
                <linearGradient id="route-patient-verify" gradientUnits="userSpaceOnUse" x1="50.5" y1="65" x2="129" y2="72.5"><stop offset="0%" stop-color="#FFAB8D" /><stop offset="100%" stop-color="#FC7EC7" /></linearGradient>
                <linearGradient id="route-verify-code" gradientUnits="userSpaceOnUse" x1="187.5" y1="109" x2="230" y2="159.5"><stop offset="0%" stop-color="#FC7EC7" /><stop offset="100%" stop-color="#B3A5F5" /></linearGradient>
                <linearGradient id="route-code-claim" gradientUnits="userSpaceOnUse" x1="288.5" y1="196" x2="331" y2="246.5"><stop offset="0%" stop-color="#B3A5F5" /><stop offset="100%" stop-color="#B4E7BC" /></linearGradient>
                <linearGradient id="route-claim-process" gradientUnits="userSpaceOnUse" x1="448" y1="246.5" x2="645" y2="246.5"><stop offset="0%" stop-color="#B4E7BC" /><stop offset="100%" stop-color="#96D7FF" /></linearGradient>
                <linearGradient id="route-process-payment" gradientUnits="userSpaceOnUse" x1="703.5" y1="210" x2="739" y2="159.5"><stop offset="0%" stop-color="#96D7FF" /><stop offset="100%" stop-color="#FAE261" /></linearGradient>
                <linearGradient id="route-payment-report" gradientUnits="userSpaceOnUse" x1="797.5" y1="123" x2="833" y2="72.5"><stop offset="0%" stop-color="#FAE261" /><stop offset="100%" stop-color="#97B6FF" /></linearGradient>
                <linearGradient id="route-report-optimize" gradientUnits="userSpaceOnUse" x1="891.5" y1="36" x2="970" y2="28.5"><stop offset="0%" stop-color="#97B6FF" /><stop offset="100%" stop-color="#4A2A76" /></linearGradient>
              </defs>
```

Replace the seven `.wire-arrow-pulse` paths with these route and arrow overlay pairs:

```html
              <path class="wire-travel" pathLength="100" style="--phase:0s;--route-stroke:url(#route-patient-verify)" d="M50.5 65 L50.5 68.75 Q50.5 72.5 54.25 72.5 L121 72.5" />
              <path class="wire-travel-arrow" pathLength="100" style="--phase:0s;--arrow-color:#FC7EC7" d="M121 65.5 L129 72.5 L121 79.5" />
              <path class="wire-travel" pathLength="100" style="--phase:1.1s;--route-stroke:url(#route-verify-code)" d="M187.5 109 L187.5 142.25 Q187.5 159.5 204.75 159.5 L222 159.5" />
              <path class="wire-travel-arrow" pathLength="100" style="--phase:1.1s;--arrow-color:#B3A5F5" d="M222 152.5 L230 159.5 L222 166.5" />
              <path class="wire-travel" pathLength="100" style="--phase:2.2s;--route-stroke:url(#route-code-claim)" d="M288.5 196 L288.5 229.25 Q288.5 246.5 305.75 246.5 L323 246.5" />
              <path class="wire-travel-arrow" pathLength="100" style="--phase:2.2s;--arrow-color:#B4E7BC" d="M323 239.5 L331 246.5 L323 253.5" />
              <path class="wire-travel" pathLength="100" style="--phase:3.3s;--route-stroke:url(#route-claim-process)" d="M448 246.5 L637 246.5" />
              <path class="wire-travel-arrow" pathLength="100" style="--phase:3.3s;--arrow-color:#96D7FF" d="M637 239.5 L645 246.5 L637 253.5" />
              <path class="wire-travel" pathLength="100" style="--phase:4.4s;--route-stroke:url(#route-process-payment)" d="M703.5 210 L703.5 173.25 Q703.5 159.5 717.25 159.5 L731 159.5" />
              <path class="wire-travel-arrow" pathLength="100" style="--phase:4.4s;--arrow-color:#FAE261" d="M731 152.5 L739 159.5 L731 166.5" />
              <path class="wire-travel" pathLength="100" style="--phase:5.5s;--route-stroke:url(#route-payment-report)" d="M797.5 123 L797.5 86.25 Q797.5 72.5 811.25 72.5 L825 72.5" />
              <path class="wire-travel-arrow" pathLength="100" style="--phase:5.5s;--arrow-color:#97B6FF" d="M825 65.5 L833 72.5 L825 79.5" />
              <path class="wire-travel" pathLength="100" style="--phase:6.6s;--route-stroke:url(#route-report-optimize)" d="M891.5 36 L891.5 32.25 Q891.5 28.5 895.25 28.5 L962 28.5" />
              <path class="wire-travel-arrow" pathLength="100" style="--phase:6.6s;--arrow-color:#4A2A76" d="M962 21.5 L970 28.5 L962 35.5" />
```

- [ ] **Step 4: Neutralize and synchronize the ports**

Replace the seven permanently colored port rectangles with:

```html
              <rect class="wire-port" style="--phase:0s;--source-color:#FFAB8D" x="48" y="62.5" width="5" height="5" rx="1" />
              <rect class="wire-port" style="--phase:1.1s;--source-color:#FC7EC7" x="185" y="106.5" width="5" height="5" rx="1" />
              <rect class="wire-port" style="--phase:2.2s;--source-color:#B3A5F5" x="286" y="193.5" width="5" height="5" rx="1" />
              <rect class="wire-port" style="--phase:3.3s;--source-color:#B4E7BC" x="445.5" y="244" width="5" height="5" rx="1" />
              <rect class="wire-port" style="--phase:4.4s;--source-color:#96D7FF" x="701" y="207.5" width="5" height="5" rx="1" />
              <rect class="wire-port" style="--phase:5.5s;--source-color:#FAE261" x="795" y="120.5" width="5" height="5" rx="1" />
              <rect class="wire-port" style="--phase:6.6s;--source-color:#97B6FF" x="889" y="33.5" width="5" height="5" rx="1" />
```

- [ ] **Step 5: Remove all signal-group markup and synchronize the boxes**

Delete all seven `.signal-group` spans. Replace the eight tags with:

```html
            <div class="tag tag--start" style="left:0;top:0;--node-delay:0s;--node-color:#FFAB8D;">Patient</div>
            <div class="tag" style="left:137px;top:44px;--node-delay:0.9s;--node-color:#FC7EC7;">Verify</div>
            <div class="tag" style="left:238px;top:131px;--node-delay:2s;--node-color:#B3A5F5;">Code</div>
            <div class="tag" style="left:339px;top:218px;--node-delay:3.1s;--node-color:#B4E7BC;">Claim</div>
            <div class="tag" style="left:653px;top:218px;--node-delay:4.2s;--node-color:#96D7FF;">Process</div>
            <div class="tag" style="left:747px;top:131px;--node-delay:5.3s;--node-color:#FAE261;">Payment</div>
            <div class="tag" style="left:841px;top:44px;--node-delay:6.4s;--node-color:#97B6FF;">Report</div>
            <div class="tag tag--terminal" style="left:978px;top:0;--node-delay:7.4s;--node-color:#4A2A76;--active-text:#FFFFFF;">Optimize</div>
```

- [ ] **Step 6: Run the source-state check again**

Run:

```powershell
$obsolete = rg -n "signal-group|class=\"signal\"|wire-pulse|wire-arrow-pulse|background:#FFAB8D|background:#FC7EC7" design\index.html
if ($LASTEXITCODE -eq 1) { 'OBSOLETE_MOTION_REMOVED=true' } else { $obsolete; exit 1 }
rg -n "gradientUnits=\"userSpaceOnUse\"|--route-stroke|--arrow-color|--source-color|--node-color|--node-delay" design\index.html
```

Expected: `OBSOLETE_MOTION_REMOVED=true`, seven user-space route gradients, seven route stroke assignments, seven destination arrow colors, seven source port colors, eight node colors, and eight synchronized node delays.

- [ ] **Step 7: Build the project**

Run: `npm run build`

Expected: TypeScript validation and Vite production build complete with exit code `0`.

- [ ] **Step 8: Commit when Git is available**

```bash
git add design/index.html docs/superpowers/specs/2026-08-18-hero-flow-reference-motion-design.md docs/superpowers/plans/2026-08-18-hero-flow-reference-motion.md
git commit -m "feat: match hero workflow reference motion"
```

Expected locally: skip because `D:\Design\Heiller` has no `.git` repository.

---

### Task 2: Verify the sequence in the live browser

**Files:**
- Test: live page at `http://127.0.0.1:5173/design/`

**Interfaces:**
- Consumes: Task 1's synchronized node and route animations.
- Produces: verified reference-matched motion across a complete loop and reduced-motion fallback.

- [ ] **Step 1: Verify static DOM and computed styles**

Evaluate:

```js
(() => ({
  tags: document.querySelectorAll('.flow__tags .tag').length,
  routes: document.querySelectorAll('.wire-travel').length,
  arrows: document.querySelectorAll('.wire-travel-arrow').length,
  gradients: document.querySelectorAll('.flow__wires defs linearGradient[id^="route-"]').length,
  signals: document.querySelectorAll('.signal-group, .signal, .wire-pulse, .wire-arrow-pulse').length,
  inactiveFill: getComputedStyle(document.querySelector('.tag')).backgroundColor,
  routeDuration: getComputedStyle(document.querySelector('.wire-travel')).animationDuration,
  nodeColors: Array.from(document.querySelectorAll('.flow__tags .tag'), node => node.style.getPropertyValue('--node-color')),
  routeColors: Array.from(document.querySelectorAll('.wire-travel'), node => node.style.getPropertyValue('--route-stroke')),
  arrowColors: Array.from(document.querySelectorAll('.wire-travel-arrow'), node => node.style.getPropertyValue('--arrow-color')),
}))()
```

Expected: eight tags, seven routes, seven arrow overlays, seven route gradients, zero obsolete signal elements, neutral base fill, `7.7s` duration, the eight approved node colors, seven route-gradient references, and seven destination arrow colors.

- [ ] **Step 2: Observe one complete loop**

Capture the hero at multiple points across at least eight seconds.

Expected: each box reveals its approved original color when active, the next box arrives in its own original color with a matching soft glow, and inactive boxes return to neutral grey. Only one route draws at a time. Each traveling stroke blends from its source box color into its destination box color, stays directly on the dashed track, and reaches an arrowhead in the destination color. Optimize uses white text while active.

- [ ] **Step 3: Compare motion artifacts with the reference**

Expected: no bead, comet head, detached stick-like trail, persistent active colors, hard-edged shadow, abrupt arrow recolor, color discontinuity at the arrowhead, or line cutting across a curve.

- [ ] **Step 4: Verify geometry and page health**

Evaluate:

```js
(() => ({
  labels: Array.from(document.querySelectorAll('.flow__tags .tag'), node => node.textContent.trim()),
  horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  heroWidth: document.querySelector('.hero').getBoundingClientRect().width,
}))()
```

Expected: labels remain `Patient`, `Verify`, `Code`, `Claim`, `Process`, `Payment`, `Report`, `Optimize`; no horizontal overflow; hero width remains unchanged.

- [ ] **Step 5: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce` and reload.

Expected: all boxes and ports are neutral grey, the dashed routes remain visible, traveling overlays and glows are absent, and the workflow remains readable.

- [ ] **Step 6: Verify browser health**

Expected: no new CSS, SVG, animation, layout, accessibility, or console errors and no new warnings.
