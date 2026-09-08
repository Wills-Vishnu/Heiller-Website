# Dedicated Team Liquid-Glass Pills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Maintain the transparent liquid-glass surfaces and make all nine Dedicated Team orbit pills slightly taller and wider without changing their animation or typography.

**Architecture:** Keep the orbit controller untouched and implement the change in the existing HTML/CSS. Wrap each label in `.dedicated-team__pill-label`, then use two scoped pseudo-elements below it for the glass highlight and inset edge/grain.

**Tech Stack:** Static HTML/CSS, TypeScript orbit controller, Node.js test runner, Vite.

## Global Constraints

- Preserve exactly nine pill labels and their existing three-color custom properties.
- Preserve `PILL_COUNT = 9`, the 28-second idle orbit, scroll response, radii, depth values `1 | 4`, and mobile blur.
- Use desktop/tablet `padding: 12px 20px 13px`.
- Use mobile `padding: 9px 14px` and preserve `font-size: 9px`.
- Do not change `dedicated-team.ts` or add pointer interactions.
- Do not modify the hero, Services, logo, heading, section dimensions, or adjacent sections.
- This directory has no Git metadata; do not fabricate commits.

---

### Task 0: Increase orbit-pill padding

**Files:**
- Modify: `D:/Design/Heiller/tests/dedicated-team.test.mjs`
- Modify: `D:/Design/Heiller/index.html`

**Interfaces:**
- Consumes: the existing content-sized `.dedicated-team__pill` layout.
- Produces: larger pills through padding only, with unchanged font size and transforms.

- [ ] **Step 1: Add failing padding assertions**

Add to the existing liquid-glass pill regression test:

```js
assert.match(rule, /padding:\s*12px 20px 13px;/)
assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.dedicated-team__pill\s*\{\s*padding:\s*9px 14px;\s*font-size:\s*9px;/s)
assert.doesNotMatch(rule, /(?:^|\n)\s*(?:width|height|min-width|min-height)\s*:/)
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run `node --test tests/dedicated-team.test.mjs`.

Expected: FAIL because desktop/tablet padding is `9px 16px 10px` and mobile padding is `7px 11px`.

- [ ] **Step 3: Apply the approved padding**

In the primary pill rule, set:

```css
padding: 12px 20px 13px;
```

In `@media (max-width: 767px)`, set:

```css
.dedicated-team__pill { padding: 9px 14px; font-size: 9px; }
```

- [ ] **Step 4: Run complete verification**

Run `node --test tests/dedicated-team.test.mjs`, `npm test`, and `npm run build`.

Expected: all commands pass with zero failures.

- [ ] **Step 5: Verify live geometry**

At desktop, 768px, 393px, and 320px, confirm the pills are visibly larger, all nine labels remain readable, orbit depth/blur is preserved, and there is no horizontal overflow. Restore the viewport and leave `http://127.0.0.1:5180/#dedicated-team-title` open.

### Task 1: Restyle all nine orbit pills

**Files:**
- Modify: `D:/Design/Heiller/tests/dedicated-team.test.mjs`
- Modify: `D:/Design/Heiller/index.html`
- Verify unchanged: `D:/Design/Heiller/dedicated-team.ts`

**Interfaces:**
- Consumes: `.dedicated-team__pill`, `--pill-from`, `--pill-to`, `--pill-accent`, and controller-applied transform/z-index/filter styles.
- Produces: `.dedicated-team__pill-label` above `.dedicated-team__pill::before` and `::after` glass layers.

- [ ] **Step 1: Add failing regression assertions**

Append to `tests/dedicated-team.test.mjs`:

```js
test("dedicated team pills use the approved liquid-glass treatment", () => {
  const section = html.match(/<section class="dedicated-team"[\s\S]*?<\/section>/)?.[0] ?? ""
  const rule = html.match(/\.dedicated-team__pill\s*\{[^}]*\}/s)?.[0] ?? ""

  assert.equal((section.match(/class="dedicated-team__pill-label"/g) ?? []).length, 9)
  assert.match(rule, /border:\s*1px solid rgba\(255,\s*255,\s*255,\s*\.72\);/)
  assert.match(rule, /border-radius:\s*999px;/)
  assert.match(rule, /backdrop-filter:\s*blur\(14px\) saturate\(145%\);/)
  assert.match(rule, /-webkit-backdrop-filter:\s*blur\(14px\) saturate\(145%\);/)
  assert.match(rule, /box-shadow:[^;]*inset[^;]*0 9px 24px/s)
  assert.match(html, /\.dedicated-team__pill::before\s*\{[^}]*pointer-events:\s*none;/s)
  assert.match(html, /\.dedicated-team__pill::after\s*\{[^}]*pointer-events:\s*none;/s)
  assert.match(html, /\.dedicated-team__pill-label\s*\{[^}]*z-index:\s*1;/s)
  assert.match(html, /@supports not \(\(backdrop-filter:\s*blur\(1px\)\) or \(-webkit-backdrop-filter:\s*blur\(1px\)\)\)[\s\S]*?\.dedicated-team__pill\s*\{[^}]*background:/s)
  assert.doesNotMatch(motion, /pointer(?:down|move|up)/)
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run `node --test tests/dedicated-team.test.mjs`.

Expected: FAIL because label wrappers and the new glass rules do not exist.

- [ ] **Step 3: Wrap every pill label**

Preserve each outer span and inline palette, replacing direct text with:

```html
<span class="dedicated-team__pill-label">Credentialing</span>
```

Repeat with the exact other eight labels inside their current `.dedicated-team__pill` elements.

- [ ] **Step 4: Replace the pill surface styles**

Retain positioning, sizing, typography, and `will-change`. Set the visual declarations to:

```css
border: 1px solid rgba(255, 255, 255, .72);
border-radius: 999px;
background:
  radial-gradient(circle at 24% 12%, color-mix(in srgb, var(--pill-accent) 24%, rgba(255,255,255,.8)), transparent 46%),
  linear-gradient(135deg, color-mix(in srgb, var(--pill-from) 32%, rgba(255,255,255,.48)), color-mix(in srgb, var(--pill-to) 34%, rgba(255,255,255,.4)));
box-shadow: inset 0 1px 1px rgba(255,255,255,.9), inset 0 -1px 1px rgba(30,45,65,.12), 0 9px 24px rgba(54,72,101,.14);
backdrop-filter: blur(14px) saturate(145%);
-webkit-backdrop-filter: blur(14px) saturate(145%);
```

- [ ] **Step 5: Add the decorative layers and fallback**

Replace the current `::after` rule and add the following complete layer rules:

```css
.dedicated-team__pill::before {
  content: "";
  position: absolute;
  z-index: 0;
  width: 72%;
  aspect-ratio: 1;
  left: 24%;
  top: -58%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.92) 0%, color-mix(in srgb, var(--pill-accent) 24%, transparent) 44%, transparent 72%);
  filter: blur(8px);
  opacity: .74;
  pointer-events: none;
}
.dedicated-team__pill::after {
  content: "";
  position: absolute;
  z-index: 0;
  inset: 2px;
  border-radius: inherit;
  box-shadow: inset 7px 5px 12px rgba(255,255,255,.22), inset -7px -5px 14px rgba(39,59,85,.08);
  opacity: .28;
  mix-blend-mode: soft-light;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.72'/%3E%3C/svg%3E");
}
.dedicated-team__pill-label {
  position: relative;
  z-index: 1;
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .dedicated-team__pill { background: rgba(238, 243, 249, .92); }
}
```

- [ ] **Step 6: Run automated verification**

Run:

```powershell
node --test tests/dedicated-team.test.mjs
npm test
npm run build
```

Expected: all commands pass with zero failures.

- [ ] **Step 7: Verify the live page**

At desktop, 768px, 393px, and 320px, confirm nine transparent glass pills, preserved orbit/depth/blur, readable labels, no overflow, and no console errors. Restore the viewport and leave `http://127.0.0.1:5180/#dedicated-team-title` open.
