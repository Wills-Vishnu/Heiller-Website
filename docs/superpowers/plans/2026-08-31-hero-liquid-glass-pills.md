# Hero Liquid-Glass Pills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the eight hero workflow nodes as compact transparent liquid-glass pills without changing their route, labels, timing, or responsive layout.

**Architecture:** Keep the current `.tag` nodes and route animation, wrapping each label in `.tag__label` so two decorative pseudo-elements can sit below the text. Implement the glass entirely in scoped CSS and adapt the existing `node-breathe` keyframes to tint the translucent surface rather than replace it with an opaque fill.

**Tech Stack:** Static HTML/CSS, Node.js test runner, Vite.

## Global Constraints

- Keep exactly eight hero stages: Patient, Verify, Code, Claim, Process, Payment, Report, and Optimize.
- Preserve desktop/tablet coordinates, the mobile two-column grid, route geometry, 7.7-second timing, scale behavior, and reduced-motion behavior.
- Use a `999px` radius at every viewport width.
- Use both `backdrop-filter` and `-webkit-backdrop-filter`.
- Do not attach pointer, tilt, press, hover, or JavaScript behavior to hero nodes.
- Do not modify the Services liquid-glass action or adjacent hero/trust content.
- This directory has no Git metadata; do not fabricate commits.

---

## File Map

- Modify `D:/Design/Heiller/index.html`: hero node label wrappers, scoped glass styles, glass animation states, fallback, and responsive radius.
- Modify `D:/Design/Heiller/tests/hero-flow-responsive.test.mjs`: structural, visual-style, responsive, and non-interaction assertions.
- Reference `D:/Design/Heiller/docs/superpowers/specs/2026-08-31-hero-liquid-glass-pills-design.md`: approved requirements.

### Task 1: Convert the hero nodes to liquid-glass pills

**Files:**
- Modify: `D:/Design/Heiller/tests/hero-flow-responsive.test.mjs`
- Modify: `D:/Design/Heiller/index.html`

**Interfaces:**
- Consumes: `.flow__tags .tag`, `--node-color`, `--active-text`, and `node-breathe`.
- Produces: `.tag__label`, `.tag::before`, and `.tag::after` layers inside eight non-interactive glass nodes.

- [ ] **Step 1: Add failing regression assertions**

Append to `tests/hero-flow-responsive.test.mjs`:

```js
test('hero process nodes use the approved transparent liquid-glass pill treatment', async () => {
  const html = await readFile(landingPath, 'utf8');
  const flow = html.match(/<div class="flow__tags">[\s\S]*?<\/div>\s*<\/div>/)?.[0] ?? '';

  assert.equal((flow.match(/class="tag(?: tag--(?:start|terminal))?"/g) ?? []).length, 8);
  assert.equal((flow.match(/class="tag__label"/g) ?? []).length, 8);
  for (const label of ['Patient', 'Verify', 'Code', 'Claim', 'Process', 'Payment', 'Report', 'Optimize']) {
    assert.match(flow, new RegExp(`<span class="tag__label">${label}<\\/span>`));
  }

  assert.match(html, /\.tag\s*\{[^}]*border:\s*1px solid rgba\(255,\s*255,\s*255,\s*\.72\);[^}]*border-radius:\s*999px;[^}]*backdrop-filter:\s*blur\(14px\) saturate\(145%\);[^}]*-webkit-backdrop-filter:\s*blur\(14px\) saturate\(145%\);/s);
  assert.match(html, /\.tag::before\s*\{[^}]*pointer-events:\s*none;/s);
  assert.match(html, /\.tag::after\s*\{[^}]*pointer-events:\s*none;/s);
  assert.match(html, /\.tag__label\s*\{[^}]*z-index:\s*1;/s);
  assert.match(html, /@supports not \(\(backdrop-filter:\s*blur\(1px\)\) or \(-webkit-backdrop-filter:\s*blur\(1px\)\)\)[\s\S]*?\.tag\s*\{[^}]*background:/s);
  assert.doesNotMatch(html, /querySelectorAll\([^)]*\.flow__tags \.tag[^)]*\)[\s\S]{0,500}pointer(?:down|move|up)/s);
});

test('hero process keeps pill radii across responsive layouts', async () => {
  const html = await readFile(landingPath, 'utf8');
  assert.doesNotMatch(html, /\.flow__tags \.tag\s*\{[^}]*border-radius:\s*4px;/s);
  assert.match(html, /@media \(max-width:\s*960px\)[\s\S]*?\.flow__tags \.tag\s*\{[^}]*border-radius:\s*999px;/s);
  assert.match(html, /@media \(max-width:\s*640px\)[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/s);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
node --test tests/hero-flow-responsive.test.mjs
```

Expected: FAIL because the nodes have no label wrappers or liquid-glass rules and tablet still applies a 4px radius.

- [ ] **Step 3: Wrap all eight labels**

Change each node’s direct text in `index.html` to a label span, preserving every existing class and inline custom property. Example:

```html
<div class="tag tag--start" style="left:0;top:0;--node-delay:0s;--node-color:#FFAB8D;"><span class="tag__label">Patient</span></div>
```

Apply the same `<span class="tag__label">…</span>` wrapper to Verify, Code, Claim, Process, Payment, Report, and Optimize.

- [ ] **Step 4: Add the scoped glass surface**

Replace the visual declarations in the primary `.tag` rules with:

```css
.tag {
  --node-color: #ECEEEE;
  --active-text: #303433;
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 101px;
  height: 57px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .72);
  border-radius: 999px;
  background: color-mix(in srgb, rgba(255, 255, 255, .46) 92%, var(--node-color) 8%);
  box-shadow: inset 0 1px 1px rgba(255,255,255,.9), inset 0 -1px 1px rgba(30,45,65,.12), 0 10px 28px rgba(54,72,101,.12);
  backdrop-filter: blur(14px) saturate(145%);
  -webkit-backdrop-filter: blur(14px) saturate(145%);
  color: #303433;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 17px;
  line-height: 100%;
  text-align: center;
  transform: scale(0.94);
  transform-origin: center;
  will-change: transform, background-color, border-color, box-shadow;
  animation: node-breathe 7.7s linear infinite;
  animation-delay: var(--node-delay);
}
.tag::before {
  content: "";
  position: absolute;
  width: 72%;
  aspect-ratio: 1;
  left: 28%;
  top: -52%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.9) 0%, color-mix(in srgb, var(--node-color) 28%, transparent) 42%, transparent 72%);
  filter: blur(8px);
  opacity: .72;
  pointer-events: none;
}
.tag::after {
  content: "";
  position: absolute;
  inset: 2px;
  border-radius: inherit;
  box-shadow: inset 7px 5px 12px rgba(255,255,255,.22), inset -7px -5px 14px rgba(39,59,85,.08);
  pointer-events: none;
}
.tag__label {
  position: relative;
  z-index: 1;
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .tag { background: rgba(238, 243, 249, .92); }
}
```

- [ ] **Step 5: Adapt active and reduced-motion states**

Replace `node-breathe` with:

```css
@keyframes node-breathe {
  0% {
    transform: scale(0.94);
    background: color-mix(in srgb, rgba(255, 255, 255, .46) 92%, var(--node-color) 8%);
    border-color: rgba(255,255,255,.72);
    color: #303433;
    box-shadow: inset 0 1px 1px rgba(255,255,255,.9), inset 0 -1px 1px rgba(30,45,65,.12), 0 10px 28px rgba(54,72,101,.12);
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  }
  6.5%, 10.5% {
    transform: scale(1);
    background: color-mix(in srgb, rgba(255,255,255,.38) 54%, var(--node-color) 46%);
    border-color: color-mix(in srgb, var(--node-color) 48%, white);
    color: var(--active-text);
    box-shadow: inset 0 1px 1px rgba(255,255,255,.92), inset 0 -1px 1px color-mix(in srgb, var(--node-color) 22%, transparent), 0 0 26px 12px color-mix(in srgb, var(--node-color) 18%, transparent);
  }
  6.5% { animation-timing-function: linear; }
  10.5% { animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
  19%, 100% {
    transform: scale(0.94);
    background: color-mix(in srgb, rgba(255, 255, 255, .46) 92%, var(--node-color) 8%);
    border-color: rgba(255,255,255,.72);
    color: #303433;
    box-shadow: inset 0 1px 1px rgba(255,255,255,.9), inset 0 -1px 1px rgba(30,45,65,.12), 0 10px 28px rgba(54,72,101,.12);
  }
}
```

Inside the existing reduced-motion `.tag` rule, keep `animation: none`, `transform: scale(0.94)`, and `will-change: auto`, then set the same idle `background`, `border-color`, `color`, and `box-shadow` values used at 0% above.

- [ ] **Step 6: Preserve the pill radius responsively**

Replace the `border-radius: 4px` tablet declaration with:

```css
border-radius: 999px;
```

Keep all existing proportional positions, mobile grid declarations, heights, fonts, and gaps unchanged.

- [ ] **Step 7: Run focused and full automated verification**

Run:

```powershell
node --test tests/hero-flow-responsive.test.mjs
npm test
npm run build
```

Expected: every command succeeds with zero failures.

- [ ] **Step 8: Verify the live page**

At desktop, 768px, 393px, and 320px, confirm eight glass pills, preserved route/grid geometry, visible active tint, readable labels, no overflow, and no console errors. Restore the normal viewport and leave `http://127.0.0.1:5180/#hero` open.

Because the directory has no Git metadata, report the changed files and verification results without fabricating a commit.
