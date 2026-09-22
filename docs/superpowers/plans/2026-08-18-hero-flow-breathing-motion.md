# Hero Flow Breathing Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the abrupt hero workflow-box activation with one calm, synchronized breathing motion while preserving the existing route sequence.

**Architecture:** Keep the current HTML, SVG routes, colors, positions, and per-node delays. Consolidate the three jumpy tag animations into one CSS keyframe sequence that eases from a near-full neutral state into the original node color, holds briefly, and gently settles back.

**Tech Stack:** Standalone HTML/CSS, inline SVG, CSS keyframes, Vite 6.

## Global Constraints

- Modify only the workflow tag animation in `design/index.html`.
- Preserve labels, positions, route geometry, arrow animation, node colors, and the 7.7-second sequence.
- Neutral boxes use `scale(0.94)`, the existing grey fill, dark text, and no glow.
- Active boxes use `scale(1)`, their original color, existing active text color, and a low-opacity matching bloom.
- Arrival lasts 500 milliseconds and return lasts approximately 650 milliseconds.
- Use no overshoot, bounce, spring, JavaScript animation, dependency, asset, or layout change.
- Preserve the existing reduced-motion state.
- This workspace is not a Git repository, so commit steps are documented but skipped locally.

---

### Task 1: Replace the jump with a unified breathing keyframe

**Files:**
- Modify: `design/index.html:219-369`
- Test: `design/index.html`

**Interfaces:**
- Consumes: existing `.tag`, `--node-color`, `--active-text`, `--node-delay`, and the 7.7-second phase timing.
- Produces: `node-breathe`, a single neutral-to-active-to-neutral animation used by all eight workflow tags.

- [ ] **Step 1: Record the current jumpy source state**

Run:

```powershell
$content = Get-Content -Raw design\index.html
[pscustomobject]@{
  SmallNeutralScale = ([regex]::Matches($content, 'scale\(0\.86\)')).Count
  OvershootScale = ([regex]::Matches($content, 'scale\(1\.025\)')).Count
  SpecializedKeyframes = ([regex]::Matches($content, '@keyframes (start-node-state|terminal-node-state)')).Count
  BreathingKeyframe = ([regex]::Matches($content, '@keyframes node-breathe')).Count
} | Format-List
```

Expected before implementation: `SmallNeutralScale` and `OvershootScale` are greater than zero, `SpecializedKeyframes` is `2`, and `BreathingKeyframe` is `0`.

- [ ] **Step 2: Replace the tag animation foundation**

Replace the current `.tag`, `.tag--start`, and `.tag--terminal` animation declarations with:

```css
  .tag {
    --node-color: #ECEEEE;
    --active-text: #303433;
    background: #ECEEEE;
    color: #303433;
    box-shadow: none;
    transform: scale(0.94);
    transform-origin: center;
    will-change: transform, background-color, box-shadow;
    animation: node-breathe 7.7s linear infinite;
    animation-delay: var(--node-delay);
  }
```

Delete the `.tag--start` and `.tag--terminal` animation-name overrides. Their HTML classes remain harmless, and Optimize continues using its inline `--active-text:#FFFFFF` value.

Expected: every node shares the same motion shape while retaining its existing phase delay and color variables.

- [ ] **Step 3: Replace all three node keyframes with the breathing sequence**

Delete `@keyframes node-state`, `@keyframes start-node-state`, and `@keyframes terminal-node-state`. Add:

```css
  @keyframes node-breathe {
    0% {
      transform: scale(0.94);
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
      animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    }
    6.5% {
      transform: scale(1);
      background: var(--node-color);
      color: var(--active-text);
      box-shadow: 0 0 26px 12px color-mix(in srgb, var(--node-color) 18%, transparent);
      animation-timing-function: linear;
    }
    10.5% {
      transform: scale(1);
      background: var(--node-color);
      color: var(--active-text);
      box-shadow: 0 0 26px 12px color-mix(in srgb, var(--node-color) 18%, transparent);
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    19% {
      transform: scale(0.94);
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
    }
    100% {
      transform: scale(0.94);
      background: #ECEEEE;
      color: #303433;
      box-shadow: none;
    }
  }
```

Expected: the 0% to 6.5% segment takes about 500 milliseconds, the 10.5% to 19% segment takes about 655 milliseconds, and neither segment overshoots `scale(1)`.

- [ ] **Step 4: Update the reduced-motion neutral scale**

In the existing reduced-motion `.tag` rule, replace `scale(0.86)` with `scale(0.94)` and retain the grey background, dark text, no shadow, disabled animation, and `will-change: auto`.

Expected: reduced-motion users see the same stable neutral presentation without route, box, color, or glow animation.

- [ ] **Step 5: Run the source-state verification**

Run:

```powershell
$content = Get-Content -Raw design\index.html
[pscustomobject]@{
  NeutralScale = ([regex]::Matches($content, 'scale\(0\.94\)')).Count
  OvershootScale = ([regex]::Matches($content, 'scale\(1\.025\)')).Count
  OldKeyframes = ([regex]::Matches($content, '@keyframes (node-state|start-node-state|terminal-node-state)')).Count
  BreathingKeyframe = ([regex]::Matches($content, '@keyframes node-breathe')).Count
  MasterDuration = ([regex]::Matches($content, 'node-breathe 7\.7s linear infinite')).Count
} | Format-List
```

Expected: `NeutralScale` is at least `4`, `OvershootScale` is `0`, `OldKeyframes` is `0`, `BreathingKeyframe` is `1`, and `MasterDuration` is `1`.

- [ ] **Step 6: Build the project**

Run: `npm run build`

Expected: TypeScript validation and the Vite production build complete with exit code `0`.

- [ ] **Step 7: Commit when Git is available**

```bash
git add design/index.html docs/superpowers/specs/2026-08-18-hero-flow-breathing-motion-design.md docs/superpowers/plans/2026-08-18-hero-flow-breathing-motion.md
git commit -m "fix: soften hero workflow breathing motion"
```

Expected locally: skip because `D:\Design\Heiller` has no `.git` repository.

---

### Task 2: Verify one complete breathing loop in the live preview

**Files:**
- Test: `http://127.0.0.1:5173/design/`

**Interfaces:**
- Consumes: Task 1's `node-breathe` keyframes and the existing route timing.
- Produces: verified motion quality, sequence synchronization, reduced-motion behavior, layout stability, and browser health.

- [ ] **Step 1: Reload the existing preview and inspect the hero**

Expected: the eight labels and seven route segments remain in their existing positions, with no visual reflow or horizontal overflow.

- [ ] **Step 2: Observe a complete loop**

Watch Patient through Optimize for at least 8.5 seconds.

Expected: every box begins near full size in grey, breathes gradually into its original color as its route handoff occurs, holds briefly, and settles gradually. No box snaps, bounces, overshoots, or appears to cast a hard shadow.

- [ ] **Step 3: Verify computed animation values**

Read the computed style for each `.flow__tags .tag` during the loop.

Expected: all eight nodes use `node-breathe`, `7.7s` duration, centered transform origin, and their unchanged node-delay values; observed transform scale remains between `0.94` and `1`.

- [ ] **Step 4: Verify the terminal handoff**

Observe Report, Optimize, and the return to Patient.

Expected: Optimize blooms purple with white text and begins settling as Patient starts the next cycle. The overlap reads as a continuous handoff rather than two competing active states.

- [ ] **Step 5: Verify accessibility and browser health**

Expected: the reduced-motion media query holds every box at `scale(0.94)` with no glow or animation, and the browser console has no new errors or warnings.

- [ ] **Step 6: Leave the updated preview available**

Expected: `http://127.0.0.1:5173/design/` remains available for user review.
