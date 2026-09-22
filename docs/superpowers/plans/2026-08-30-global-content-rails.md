# Global Content Rails Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Frame all page content within two continuous 1311px rails while keeping shaders and backgrounds full bleed.

**Architecture:** Define one responsive frame-width system in CSS, render one non-semantic rail overlay as a direct `.page` child, and cap each section's existing inner content container to the shared maximum. Existing section wrappers remain full width, so their canvases, backgrounds, and footer artwork are unaffected.

**Tech Stack:** HTML, CSS, Node test runner, Vite.

## Global Constraints

- Maximum rail and content width is exactly `1311px`.
- Responsive rail gutters are `40px`, `24px`, `16px`, and `12px` at V2's established breakpoints.
- Shaders, section backgrounds, and footer artwork remain full bleed.
- Rails are decorative, non-interactive, and hidden from assistive technology.
- No copy, spacing, animation, palette, or unrelated layout changes.
- Git commits are unavailable because `D:\Design\Heiller` is not a Git repository.

---

### Task 1: Add Failing Frame Regression Tests

**Files:**
- Create: `tests/content-rails.test.mjs`
- Test: `index.html`

**Interfaces:**
- Consumes: `.page`, `.content-rails`, shared content-container selectors, and CSS custom properties.
- Produces: regression coverage for rail markup, exact maximum width, responsive gutters, content containment, and full-bleed exclusions.

- [ ] Assert `.page` contains exactly one `<div class="content-rails" aria-hidden="true"></div>`.
- [ ] Assert `--content-frame-max: 1311px` and responsive gutter variables `40px/24px/16px/12px`.
- [ ] Assert the rail layer uses the shared calculated frame width and spans `top: 0; bottom: 0`.
- [ ] Assert all direct content containers are included in the shared max-width rule.
- [ ] Assert `.hero-bg` and `.site-footer__landscape` are excluded from the shared content selector.
- [ ] Run `npm test`; expect the new tests to fail before implementation.

### Task 2: Implement Rails and Shared Content Frame

**Files:**
- Modify: `index.html`
- Test: `tests/content-rails.test.mjs`

**Interfaces:**
- Produces: CSS variables `--content-frame-max` and `--content-frame-gutter`, plus `.content-rails`.
- Consumes: existing V2 direct inner containers.

- [ ] Add the CSS custom properties to `:root` and override the gutter at `960px`, `640px`, and `389px`.
- [ ] Add `.content-rails` as the first decorative child of `.page`.
- [ ] Size it with `width: min(var(--content-frame-max), calc(100% - 2 * var(--content-frame-gutter)))`, center it, and draw adaptive one-pixel rails using pseudo-elements.
- [ ] Keep it absolute from page top to bottom, pointer-free, and above full-bleed backgrounds without changing document flow.
- [ ] Apply `width: 100%; max-width: var(--content-frame-max); margin-inline: auto` to `.nav__inner`, `.hero__head`, `.hero__flow`, `.trust__box`, `.services__inner`, `.dedicated-team__field`, `.results__inner`, `.future-section__inner`, `.section-shell`, and `.site-footer__content`.
- [ ] Do not include `.hero-bg` or `.site-footer__landscape` in that rule.
- [ ] Run `npm test && npm run build`; expect all tests and build to pass.

### Task 3: Responsive Browser Verification

**Files:**
- Modify only if a verified defect is found: `index.html`, `tests/content-rails.test.mjs`

**Interfaces:**
- Consumes: completed shared frame.
- Produces: verified rail alignment and containment across desktop and mobile.

- [ ] At 1920px and 2560px, verify rails and Services are exactly 1311px wide and centered, with every content container inside them.
- [ ] Verify the rail layer spans from page top through the footer and backgrounds remain full viewport width.
- [ ] At 960px, 640px, 393px, and 320px, verify the rails follow the established gutters and no horizontal overflow appears.
- [ ] Confirm browser console has no warnings or errors.
- [ ] Run final `npm test && npm run build` verification.

### Task 4: Match the Second Section's Fixed Stroke Color

**Files:**
- Modify: `index.html`
- Modify: `tests/content-rails.test.mjs`

**Interfaces:**
- Consumes: the second section's `#CCCCCC` structural stroke token.
- Produces: fixed-color global rails without blend-mode adaptation.

- [ ] Add a failing regression asserting `#CCCCCC` rail backgrounds and no `mix-blend-mode` in the rail pseudo-element rule.
- [ ] Replace the adaptive rail background with `#CCCCCC` and remove `mix-blend-mode`.
- [ ] Run `npm test && npm run build`; expect every test and the build to pass.
- [ ] Verify the computed rail pseudo-element color is `rgb(204, 204, 204)` in the browser.
