# Hero Flow Box Scale Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make neutral workflow boxes smaller and smoothly expand each box with its original color and halo as the route reaches it.

**Architecture:** Keep the existing 101 by 57 pixel positioned footprint and SVG geometry. Add center-origin CSS transform states to the existing tag animations so size, fill, text color, and glow share the current 7.7-second timeline without layout changes.

**Tech Stack:** Standalone HTML/CSS, inline SVG, CSS keyframes, Vite 6.

## Global Constraints

- Modify only the workflow tag animation in `design/index.html`.
- Preserve all labels, absolute positions, route coordinates, arrow geometry, colors, gradients, delays, and the 7.7-second loop.
- Neutral tags render at `scale(0.86)` with `#ECEEEE` fill, `#303433` text, and no glow.
- Arrival peaks at `scale(1.025)` and settles at `scale(1)` with the tag's existing original color and halo.
- Expansion is approximately 190 milliseconds, the full-size hold is approximately 0.8 seconds, and return is approximately 230 milliseconds.
- Transform origin is the center of each box; scaling must not affect layout or SVG geometry.
- Optimize remains purple with white text while active.
- Reduced motion shows eight smaller neutral tags with no animation or glow.
- Add no JavaScript animation, dependency, wrapper, asset, or unrelated refactor.
- This workspace is not a Git repository, so commit steps are documented but skipped locally.

---

### Task 1: Add centered scale states to the workflow tags

**Files:**
- Modify: `design/index.html:177-338`
- Test: `design/index.html`

**Interfaces:**
- Consumes: existing `.tag`, `.tag--start`, `.tag--terminal`, `--node-color`, `--active-text`, and `--node-delay` styles.
- Produces: synchronized neutral, arrival, active, and exit transform states without changing HTML or SVG geometry.

- [ ] **Step 1: Record the failing source-state check**

Run:

```powershell
$content = Get-Content -Raw design\index.html
[pscustomobject]@{
  NeutralScale = ([regex]::Matches($content, 'transform:\s*scale\(0\.86\)')).Count
  OvershootScale = ([regex]::Matches($content, 'transform:\s*scale\(1\.025\)')).Count
  TransformOrigin = ([regex]::Matches($content, 'transform-origin:\s*center')).Count
  WillChange = ([regex]::Matches($content, 'will-change:\s*transform')).Count
} | Format-List
```

Expected before implementation: every count is `0`.

- [ ] **Step 2: Add the neutral transform foundation**

In the animated `.tag` rule, keep the existing color properties and add:

```css
    transform: scale(0.86);
    transform-origin: center;
    will-change: transform;
```

Expected: inactive tags become smaller around their existing centers while their positioned footprints and route coordinates stay unchanged.

- [ ] **Step 3: Replace the generic destination and source keyframes**

Replace `@keyframes node-state` with:

```css
  @keyframes node-state {
    0% {
      transform: scale(0.86);
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
    }
    1.5% {
      transform: scale(1.025);
      background: var(--node-color);
      color: var(--active-text);
      box-shadow: 0 0 36px 18px color-mix(in srgb, var(--node-color) 32%, transparent);
    }
    2.5%, 14% {
      transform: scale(1);
      background: var(--node-color);
      color: var(--active-text);
      box-shadow: 0 0 32px 16px color-mix(in srgb, var(--node-color) 26%, transparent);
    }
    17%, 100% {
      transform: scale(0.86);
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
    }
  }
```

Replace `@keyframes start-node-state` with the same neutral-to-arrival-to-active-to-exit transform sequence:

```css
  @keyframes start-node-state {
    0% {
      transform: scale(0.86);
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
    }
    1.5% {
      transform: scale(1.025);
      background: var(--node-color);
      color: var(--active-text);
      box-shadow: 0 0 36px 18px color-mix(in srgb, var(--node-color) 32%, transparent);
    }
    2.5%, 14% {
      transform: scale(1);
      background: var(--node-color);
      color: var(--active-text);
      box-shadow: 0 0 32px 16px color-mix(in srgb, var(--node-color) 26%, transparent);
    }
    17%, 100% {
      transform: scale(0.86);
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
    }
  }
```

Expected: Patient and every intermediate node expand from the smaller grey state, overshoot subtly, hold at today's box size, then shrink smoothly.

- [ ] **Step 4: Add a compact terminal scale handoff**

Replace `@keyframes terminal-node-state` with:

```css
  @keyframes terminal-node-state {
    0% {
      transform: scale(0.86);
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
    }
    0.8% {
      transform: scale(1.025);
      background: var(--node-color);
      color: var(--active-text);
      box-shadow: 0 0 36px 18px color-mix(in srgb, var(--node-color) 32%, transparent);
    }
    1.5%, 2% {
      transform: scale(1);
      background: var(--node-color);
      color: var(--active-text);
      box-shadow: 0 0 32px 16px color-mix(in srgb, var(--node-color) 26%, transparent);
    }
    3%, 100% {
      transform: scale(0.86);
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
    }
  }
```

Expected: Optimize performs the same purple expansion and return in the short terminal window, uses white active text, and does not remain emphasized after Patient restarts.

- [ ] **Step 5: Lock the reduced-motion scale**

In the existing reduced-motion `.tag` rule, add the neutral transform and remove compositor promotion:

```css
    .tag {
      transform: scale(0.86);
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
      will-change: auto;
    }
```

Expected: reduced motion shows eight smaller neutral boxes without scale, fill, or glow animation.

- [ ] **Step 6: Run the source-state check again**

Run:

```powershell
$content = Get-Content -Raw design\index.html
[pscustomobject]@{
  NeutralScale = ([regex]::Matches($content, 'transform:\s*scale\(0\.86\)')).Count
  OvershootScale = ([regex]::Matches($content, 'transform:\s*scale\(1\.025\)')).Count
  FullScale = ([regex]::Matches($content, 'transform:\s*scale\(1\)')).Count
  TransformOrigin = ([regex]::Matches($content, 'transform-origin:\s*center')).Count
  WillChange = ([regex]::Matches($content, 'will-change:\s*transform')).Count
} | Format-List
```

Expected: neutral scale appears in the base rule, all three keyframes, and reduced-motion rule; overshoot and full scale appear in all three keyframes; transform origin and transform compositor promotion each appear once.

- [ ] **Step 7: Build the project**

Run: `npm run build`

Expected: TypeScript validation and the Vite production build finish with exit code `0`.

- [ ] **Step 8: Commit when Git is available**

```bash
git add design/index.html docs/superpowers/specs/2026-08-18-hero-flow-box-scale-motion-design.md docs/superpowers/plans/2026-08-18-hero-flow-box-scale-motion.md
git commit -m "feat: add workflow box scale handoffs"
```

Expected locally: skip because `D:\Design\Heiller` has no `.git` repository.

---

### Task 2: Verify the scale handoffs in the live preview

**Files:**
- Test: live page at `http://127.0.0.1:5173/design/`

**Interfaces:**
- Consumes: Task 1's tag transforms and the existing route timeline.
- Produces: verified full-loop scale, color, glow, geometry, reduced-motion, and runtime behavior.

- [ ] **Step 1: Reload and verify static computed styles**

Evaluate:

```js
(() => {
  const tag = document.querySelector('.flow__tags .tag')
  const style = getComputedStyle(tag)
  return {
    tags: document.querySelectorAll('.flow__tags .tag').length,
    transformOrigin: style.transformOrigin,
    animationDuration: style.animationDuration,
    routeGradients: document.querySelectorAll('.flow__wires linearGradient[id^="route-"]').length,
    labels: Array.from(document.querySelectorAll('.flow__tags .tag'), node => node.textContent.trim()),
  }
})()
```

Expected: eight tags, centered transform origin, `7.7s` animation duration, seven route gradients, and the unchanged Patient-to-Optimize labels.

- [ ] **Step 2: Sample one complete loop**

Across at least 8.2 seconds, sample every 25 to 50 milliseconds and record each tag's computed transform, background, text color, and shadow.

Expected:

- Every tag is observed near a `0.86` transform scale while neutral.
- Every tag is observed at or near `1` while showing its existing original color and matching halo.
- Every tag except the terminal node is observed briefly above `1` and no higher than `1.025` during arrival.
- Optimize is observed purple with white text at full size.
- The previous source shrinks as the destination expands; no two boxes remain fully emphasized after the handoff.

- [ ] **Step 3: Compare the visible motion with the reference**

Observe at least one full loop in the hero viewport.

Expected: neutral boxes read as smaller; the arriving box expands from its center with color and glow; the overshoot is subtle; the active size hold lasts about 0.8 seconds; the return is smooth; text remains sharp; no box jumps, bounces, or changes its positioned center.

- [ ] **Step 4: Verify routes and layout remain unchanged**

Evaluate:

```js
(() => ({
  routes: document.querySelectorAll('.wire-travel').length,
  arrows: document.querySelectorAll('.wire-travel-arrow').length,
  gradients: document.querySelectorAll('.flow__wires linearGradient[id^="route-"]').length,
  horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  labels: Array.from(document.querySelectorAll('.flow__tags .tag'), node => node.textContent.trim()),
}))()
```

Expected: seven routes, seven arrows, seven gradients, no horizontal overflow, and unchanged labels.

- [ ] **Step 5: Verify reduced motion and browser health**

Inspect the active reduced-motion CSS rule and browser console.

Expected: reduced motion disables tag animation, holds every tag at `scale(0.86)`, keeps every tag grey with dark text and no glow, and resets `will-change` to `auto`; browser console has no errors or warnings.

- [ ] **Step 6: Keep the updated preview open**

Mark the existing `http://127.0.0.1:5173/design/` tab as the deliverable and make the in-app browser visible.

Expected: the user can review the completed animated hero in the existing preview tab.
