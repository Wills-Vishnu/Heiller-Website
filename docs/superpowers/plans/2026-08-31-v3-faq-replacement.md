# V3 FAQ Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the Getting Started and Systems sections and replace V2's FAQ with the exact V3 revenue-audit FAQ.

**Architecture:** Keep the V2 `#questions` anchor and native disclosure markup, but replace its content and presentation with the V3 FAQ. Remove the two obsolete section trees, their exclusive CSS, and the dead footer link while preserving the surrounding calendar/contact flow.

**Tech Stack:** Static HTML/CSS, native `<details>` disclosures, Node.js test runner, Vite.

## Global Constraints

- Page order must be booking calendar → questions → final contact → footer.
- Use the exact V3 FAQ heading, five questions, and five answers from the approved spec.
- Preserve the `#questions` footer destination.
- Remove all markup and exclusive CSS for `#getting-started` and `#systems`.
- Use native accessible disclosure behavior and respect reduced motion.

---

### Task 1: Page structure, content, and navigation

**Files:**
- Modify: `tests/remaining-sections.test.mjs`
- Modify: `index.html:3053-3128`

**Interfaces:**
- Consumes: existing `#booking-calendar`, `#questions`, `#contact`, and footer navigation.
- Produces: the final ordered section sequence and exact V3 FAQ markup.

- [ ] **Step 1: Update the structural tests first**

Change the finished-section expectation to `booking-calendar`, `questions`, and `contact`; assert `getting-started` and `systems` IDs are absent. Replace the systems-language test with an exact V3 FAQ content test covering the eyebrow, heading, and all five questions. Update the footer targets to:

```js
["services", "results", "revenue-audit", "booking-calendar", "questions", "contact"]
```

Add an order assertion that the index positions satisfy:

```js
booking < questions && questions < contact && contact < footer
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/remaining-sections.test.mjs`

Expected: failures because the deleted sections and old FAQ still exist.

- [ ] **Step 3: Replace the affected HTML**

Delete both `<section class="onboarding" ...>` and `<section class="systems" ...>` blocks. Replace the FAQ heading with:

```html
<div>
  <div class="eyebrow"><i aria-hidden="true"></i><span>Faq</span></div>
  <h2 id="faq-title"><span>Questions before</span><span>we begin</span></h2>
</div>
```

Replace the five disclosure entries with the exact questions and answers in the approved design specification. Remove the footer's `#getting-started` link and keep `#questions`.

- [ ] **Step 4: Run the focused structural test**

Run: `node --test tests/remaining-sections.test.mjs`

Expected: the structural/content/footer tests pass.

### Task 2: V3 FAQ styling and obsolete CSS removal

**Files:**
- Modify: `index.html:1090-1348`
- Modify: `index.html:1510-1565`

**Interfaces:**
- Consumes: `.faq`, `.faq__layout`, `.faq__list`, `.faq__item`, and the shared `.section-shell`/`.eyebrow` patterns.
- Produces: V3's responsive two-column FAQ presentation and animated native disclosures.

- [ ] **Step 1: Add styling contracts**

Extend `tests/remaining-sections.test.mjs` to assert:

```js
assert.match(html, /\.faq__layout\s*\{[^}]*grid-template-columns:\s*\.8fr 1\.2fr;[^}]*gap:\s*8vw;/s)
assert.match(html, /\.faq\s*\{[^}]*background:\s*#FFFFFF;/s)
assert.match(html, /\.faq__item summary::after\s*\{[^}]*content:\s*"\+";/s)
assert.match(html, /\.faq__item\[open\] summary::after\s*\{[^}]*transform:\s*translateY\(-50%\) rotate\(45deg\);/s)
assert.doesNotMatch(html, /\.onboarding(?:__|\s|,|\{)/)
assert.doesNotMatch(html, /\.systems(?:__|\s|,|\{)/)
```

- [ ] **Step 2: Confirm the focused test fails**

Run: `node --test tests/remaining-sections.test.mjs`

Expected: failure against the old FAQ CSS and obsolete selectors.

- [ ] **Step 3: Implement the V3 CSS and remove obsolete rules**

Use:

```css
.faq { padding: clamp(64px, 7vw, 125px) 40px; background: #FFFFFF; }
.faq__layout { display: grid; grid-template-columns: .8fr 1.2fr; gap: 8vw; }
.faq h2 { margin-top: 18px; max-width: 9ch; font: 500 clamp(39px, 4vw, 67px)/.94 "Plus Jakarta Sans", system-ui, sans-serif; letter-spacing: -.055em; }
.faq h2 span { display: block; }
.faq__list { border-top: 1px solid #CCCCCC; }
.faq__item { border-bottom: 1px solid #CCCCCC; }
.faq__item summary { position: relative; padding: 18px 34px 18px 0; font-family: "Plus Jakarta Sans", system-ui, sans-serif; cursor: pointer; list-style: none; }
.faq__item summary::after { content: "+"; position: absolute; right: 0; top: 50%; transform: translateY(-50%) rotate(0); transition: transform .3s ease; }
.faq__item[open] summary::after { transform: translateY(-50%) rotate(45deg); }
.faq__item p { max-width: 55ch; padding: 0 30px 26px 0; color: rgba(8,8,8,.6); font-size: 13px; line-height: 1.5; }
```

At `max-width: 960px`, stack `.faq__layout` and use `gap: 55px`. At `max-width: 640px`, set FAQ padding to `68px 24px`, heading size to `clamp(32px, 10.2vw, 45px)`, and preserve readable row sizing. Remove all onboarding/system selectors, keyframes, and responsive overrides. In reduced motion, disable the FAQ icon transition.

- [ ] **Step 4: Run all verification**

```powershell
node --test tests/remaining-sections.test.mjs
npm test
npm run build
```

Expected: focused tests and the full suite pass, and Vite completes the production build.

- [ ] **Step 5: Verify live behavior**

At desktop, tablet, and mobile widths, confirm the removed sections are absent, the FAQ directly follows the calendar, all five disclosures toggle, plus icons rotate, focus remains visible, there is no horizontal overflow, and the console is clean.

This workspace is not a Git repository, so no commit step applies.
