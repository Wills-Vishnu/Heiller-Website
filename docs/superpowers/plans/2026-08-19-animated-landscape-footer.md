# Animated Landscape Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dark Heiller footer with a responsive light navigation footer and a decorative, slowly animated grainy landscape.

**Architecture:** Keep the existing single-page HTML architecture. Update the semantic footer markup in `index.html`, build the landscape from decorative inline HTML/CSS layers, and extend the existing Node source tests to lock down real anchors, reduced-motion support, and the absence of provisional links.

**Tech Stack:** HTML5, CSS, inline SVG/CSS decoration, Node test runner, Vite

## Global Constraints

- Use only existing page anchors and real Heiller copy.
- Add no social buttons, placeholder URLs, invented contact information, or unsupported legal links.
- Treat all landscape artwork as decorative and hidden from assistive technology.
- Stop landscape animation when `prefers-reduced-motion: reduce` is active.
- Prevent horizontal overflow at 320px, 768px, 1024px, and 1440px.
- Preserve the current final-contact section and its revenue-audit CTA.
- This folder is not a Git repository, so commit steps cannot be performed until version control is initialized.

---

### Task 1: Add Footer Structure Regression Tests

**Files:**
- Modify: `D:\Design\Heiller\tests\remaining-sections.test.mjs`

**Interfaces:**
- Consumes: the static HTML source loaded by the existing test file
- Produces: assertions for grouped footer navigation, valid anchors, decorative artwork, and reduced-motion CSS

- [ ] **Step 1: Write the failing tests**

Append tests that isolate the `<footer class="site-footer">` markup and assert:

```js
test("footer uses real grouped navigation and decorative artwork", () => {
  const footer = html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0] ?? ""
  assert.match(footer, /Explore/)
  assert.match(footer, /Company/)
  assert.match(footer, /Support/)
  assert.match(footer, /class="site-footer__landscape" aria-hidden="true"/)
  assert.doesNotMatch(footer, /href="#"/)
  assert.doesNotMatch(footer, /instagram|linkedin|twitter|youtube/i)
})

test("footer landscape supports reduced motion", () => {
  assert.match(html, /prefers-reduced-motion:\s*reduce[\s\S]*site-footer__landscape/)
})
```

- [ ] **Step 2: Run the new tests and confirm failure**

Run: `npm test`

Expected: the new footer assertions fail because the current footer is dark, ungrouped, and has no landscape element.

---

### Task 2: Replace Footer Markup and Styling

**Files:**
- Modify: `D:\Design\Heiller\index.html`

**Interfaces:**
- Consumes: existing anchors `#services`, `#results`, `#revenue-audit`, `#who-we-help`, `#getting-started`, `#questions`, and `#contact`
- Produces: `.site-footer__content`, `.site-footer__nav-group`, `.site-footer__legal`, and `.site-footer__landscape`

- [ ] **Step 1: Replace the footer markup**

Use this semantic structure, preserving the existing brand statement:

```html
<footer class="site-footer">
  <div class="section-shell site-footer__content">
    <div class="site-footer__brand-block">
      <a class="site-footer__brand" href="#hero">Heiller</a>
      <p>Revenue cycle management for medical practices.</p>
    </div>
    <nav class="site-footer__nav" aria-label="Footer">
      <div class="site-footer__nav-group">
        <h2>Explore</h2>
        <a href="#services">Services</a>
        <a href="#results">Results</a>
        <a href="#revenue-audit">Revenue audit</a>
      </div>
      <div class="site-footer__nav-group">
        <h2>Company</h2>
        <a href="#who-we-help">Who we help</a>
        <a href="#getting-started">Getting started</a>
      </div>
      <div class="site-footer__nav-group">
        <h2>Support</h2>
        <a href="#questions">Questions</a>
        <a href="#contact">Get in touch</a>
      </div>
    </nav>
    <p class="site-footer__legal">© 2026 Heiller.</p>
  </div>
  <div class="site-footer__landscape" aria-hidden="true">
    <div class="site-footer__grain"></div>
    <div class="site-footer__ridge site-footer__ridge--back"></div>
    <div class="site-footer__ridge site-footer__ridge--middle"></div>
    <div class="site-footer__ridge site-footer__ridge--front"></div>
  </div>
</footer>
```

- [ ] **Step 2: Replace the current dark footer CSS**

Implement a light editorial content area, three navigation columns, visible focus states, and a landscape with layered clipped shapes:

```css
.site-footer { overflow: hidden; background: #F8F8F5; color: #171918; }
.site-footer__content { display: grid; grid-template-columns: minmax(260px,.9fr) minmax(0,1.1fr); gap: 80px; padding: 72px 0 28px; }
.site-footer__nav { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 32px; }
.site-footer__nav-group { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.site-footer__nav-group h2 { margin: 0 0 10px; font-size: 14px; font-weight: 600; }
.site-footer__nav-group a { color: #555B59; font-size: 14px; text-decoration: none; }
.site-footer__legal { grid-column: 1/-1; margin-top: 32px; padding-top: 22px; border-top: 1px solid #C9CDCB; color: #676D6B; font-size: 12px; }
.site-footer__landscape { position: relative; height: 390px; overflow: hidden; background: linear-gradient(180deg,#F7F8F3 0%,#F4DDE0 30%,#8995E8 100%); isolation: isolate; }
.site-footer__ridge { position: absolute; width: 130%; left: -15%; transform-origin: center; will-change: transform; }
.site-footer__ridge--back { inset-block: 18% -22%; background: linear-gradient(120deg,#B99BF2,#6278DF 55%,#E1B7CA); clip-path: polygon(0 40%,16% 22%,31% 37%,47% 12%,67% 35%,84% 21%,100% 38%,100% 100%,0 100%); animation: footer-drift-back 22s ease-in-out infinite alternate; }
.site-footer__ridge--middle { inset-block: 38% -16%; background: linear-gradient(120deg,#F06A9A,#9E88CB 42%,#7E9D77 68%,#E88954); clip-path: polygon(0 36%,18% 54%,37% 28%,57% 46%,76% 24%,100% 45%,100% 100%,0 100%); animation: footer-drift-middle 18s ease-in-out infinite alternate; }
.site-footer__ridge--front { inset-block: 62% -10%; background: linear-gradient(105deg,#E14B43,#AF5D43 38%,#182B24 68%,#F07A45); clip-path: polygon(0 25%,22% 42%,43% 20%,61% 43%,79% 17%,100% 35%,100% 100%,0 100%); animation: footer-drift-front 15s ease-in-out infinite alternate; }
.site-footer__grain { position: absolute; inset: 0; z-index: 4; opacity: .2; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.58'/%3E%3C/svg%3E"); mix-blend-mode: multiply; }
@keyframes footer-drift-back { to { transform: translate3d(2%,-1.5%,0) scale(1.015); } }
@keyframes footer-drift-middle { to { transform: translate3d(-2%,1%,0) scale(1.02); } }
@keyframes footer-drift-front { to { transform: translate3d(1.5%,-1%,0) scale(1.018); } }
```

- [ ] **Step 3: Add responsive and reduced-motion rules**

```css
@media (max-width: 760px) {
  .site-footer__content { grid-template-columns: 1fr; gap: 40px; padding: 56px 0 24px; }
  .site-footer__nav { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 32px 24px; }
  .site-footer__landscape { height: 260px; }
}
@media (prefers-reduced-motion: reduce) {
  .site-footer__landscape * { animation: none !important; }
}
```

- [ ] **Step 4: Run the test suite and confirm it passes**

Run: `npm test`

Expected: all existing and new tests pass.

---

### Task 3: Production and Browser Verification

**Files:**
- Verify: `D:\Design\Heiller\index.html`
- Verify: `D:\Design\Heiller\tests\remaining-sections.test.mjs`

**Interfaces:**
- Consumes: the completed footer and local Vite preview
- Produces: a verified responsive, accessible footer at `http://127.0.0.1:5180/`

- [ ] **Step 1: Run the production build**

Run: `npm run build`

Expected: TypeScript checking and Vite production build complete successfully.

- [ ] **Step 2: Verify responsive overflow**

At 320×700, 768×900, 1024×800, and 1440×900, evaluate:

```js
document.documentElement.scrollWidth === document.documentElement.clientWidth
```

Expected: `true` at every width.

- [ ] **Step 3: Verify navigation and focus**

Keyboard-focus every footer link and confirm a visible outline. Click each link and confirm its hash matches an existing element ID.

- [ ] **Step 4: Verify motion preferences**

With normal motion, confirm each ridge has a running CSS animation. Emulate `prefers-reduced-motion: reduce` and confirm each ridge reports `animation-name: none`.

- [ ] **Step 5: Review the final composition**

Confirm the upper footer remains readable, the landscape begins below the legal line, the grain is subtle rather than noisy, and the landscape height does not dominate the mobile viewport.
