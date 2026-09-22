# Results benchmark section implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a borderless Results section after Services with four large MGMA benchmark counters that animate once when the section enters view.

**Architecture:** Extend the existing standalone `design/index.html` with semantic section markup, isolated Results CSS, and a small dependency-free counter IIFE. Reuse the page's existing 1311px alignment, eyebrow pattern, colors, typography, and restrained motion behavior without changing the Services grid or either WebGL shader.

**Tech Stack:** Vite 6, standalone HTML/CSS, vanilla JavaScript, IntersectionObserver, requestAnimationFrame.

## Global Constraints

- Place Results immediately after `.services` on `/design/`.
- Align the section to the existing 1311px HIPAA and Services width.
- Use the existing typeface, dark brown-black text, muted grey supporting copy, blue eyebrow square, and page spacing rhythm.
- Add no cards, pills, shadows, gradients, rounded containers, outer borders, grid strokes, packages, images, or framework changes.
- Keep all four figures clearly framed as MGMA industry benchmarks, not Heiller client outcomes.
- Use no em dashes.
- Animate counters once over approximately 1.1 seconds; reduced motion and missing IntersectionObserver support show final values immediately.
- Use four columns on desktop, two on tablet, and one on mobile without dividers between metrics; retain the single heading-to-metrics divider.
- Match the Services heading exactly: `46px` font size, `48px` line height, `500` weight, and `-2px` letter spacing.
- Display percentage benchmarks as `95%` and `96%`; do not include a plus sign in visible text, counter suffixes, or accessibility labels.
- Add one full-width divider between the Results heading and metrics using `1px solid #CCCCCC`.
- Preserve the current heading-to-metrics distance by splitting it into `54px` above and `54px` below the divider; use `38px` above and below at mobile width.
- This workspace is not a Git repository, so the documented commit step cannot run here.

---

### Task 1: Add the semantic Results layout and Heiller styling

**Files:**
- Modify: `design/index.html:347-469`
- Modify: `design/index.html:699-700`
- Test: live page at `http://127.0.0.1:5173/design/`

**Interfaces:**
- Consumes: existing `.eyebrow` presentation and the 1311px section alignment used by `.services__inner`.
- Produces: `.results`, `.results__inner`, `.results__stats`, four `.result` blocks, and four `[data-result-counter]` elements for Task 2.

- [ ] **Step 1: Run the failing Results DOM check**

Evaluate on the live page:

```js
(() => ({
  hasResults: Boolean(document.querySelector('.results')),
  resultCount: document.querySelectorAll('.result').length,
  counterCount: document.querySelectorAll('[data-result-counter]').length,
}))()
```

Expected before implementation:

```js
{ hasResults: false, resultCount: 0, counterCount: 0 }
```

- [ ] **Step 2: Add the Results markup directly after Services**

Insert immediately after the closing `</section>` for `.services`:

```html
    <!-- Results -->
    <section class="results" aria-labelledby="results-title">
      <div class="results__inner">
        <div class="eyebrow"><i></i><span>Results</span></div>
        <h2 id="results-title">Results measured against<br />the standard</h2>
        <dl class="results__stats">
          <div class="result">
            <dt class="result__number" aria-label="95 percent">
              <span data-result-counter data-value="95" data-suffix="%">95%</span>
            </dt>
            <dd>
              <strong>Clean claim rate</strong>
              <p>The share of claims accepted on the first submission.</p>
            </dd>
          </div>
          <div class="result">
            <dt class="result__number" aria-label="5 percent">
              <span data-result-counter data-value="5" data-suffix="%">5%</span>
            </dt>
            <dd>
              <strong>Denial rate</strong>
              <p>A strong revenue cycle keeps denials at or below this level.</p>
            </dd>
          </div>
          <div class="result">
            <dt class="result__number" aria-label="35 days">
              <span data-result-counter data-value="35" data-suffix="">35</span>
            </dt>
            <dd>
              <strong>Days in A/R</strong>
              <p>Clean claims should convert to cash within 30 to 40 days.</p>
            </dd>
          </div>
          <div class="result">
            <dt class="result__number" aria-label="96 percent">
              <span data-result-counter data-value="96" data-suffix="%">96%</span>
            </dt>
            <dd>
              <strong>Net collection rate</strong>
              <p>The share of contracted revenue successfully collected.</p>
            </dd>
          </div>
        </dl>
      </div>
    </section>
```

- [ ] **Step 3: Add the Results CSS before the closing `</style>`**

```css
  /* Results */
  .results {
    padding: 0 40px 176px;
    background: #FFFFFF;
  }
  .results__inner {
    width: 100%;
    max-width: 1311px;
    margin: 0 auto;
  }
  .results .eyebrow {
    margin-bottom: 46px;
  }
  .results h2 {
    max-width: 900px;
    margin: 0;
    color: #2A0F14;
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    font-size: 46px;
    font-weight: 500;
    letter-spacing: -2px;
    line-height: 48px;
  }
  .results__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 56px;
    margin: 54px 0 0;
    padding-top: 54px;
    border-top: 1px solid #CCCCCC;
  }
  .result {
    min-width: 0;
  }
  .result__number {
    margin: 0;
    color: #2A0F14;
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    font-size: clamp(76px, 7vw, 112px);
    font-weight: 500;
    letter-spacing: -6px;
    line-height: 0.9;
    font-variant-numeric: tabular-nums;
  }
  .result dd {
    margin: 30px 0 0;
  }
  .result strong {
    display: block;
    color: #030712;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.4px;
    line-height: 1.2;
  }
  .result p {
    max-width: 250px;
    margin: 14px 0 0;
    color: #6B7280;
    font-size: 15px;
    line-height: 1.5;
  }
  @media (max-width: 960px) {
    .results__stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 72px 48px;
    }
  }
  @media (max-width: 640px) {
    .results {
      padding: 0 24px 112px;
    }
    .results__stats {
      grid-template-columns: 1fr;
      gap: 60px;
      margin-top: 38px;
      padding-top: 38px;
    }
    .result__number {
      font-size: 84px;
    }
  }
```

- [ ] **Step 4: Run the Results DOM check again**

Expected after implementation:

```js
{ hasResults: true, resultCount: 4, counterCount: 4 }
```

- [ ] **Step 5: Verify desktop geometry and lack of decorative containers**

Evaluate:

```js
(() => {
  const services = document.querySelector('.services__inner').getBoundingClientRect()
  const results = document.querySelector('.results__inner').getBoundingClientRect()
  const statStyles = Array.from(document.querySelectorAll('.result')).map((node) => {
    const css = getComputedStyle(node)
    return {
      border: css.border,
      boxShadow: css.boxShadow,
      borderRadius: css.borderRadius,
    }
  })
  return {
    aligned: Math.abs(services.left - results.left) < 1 && Math.abs(services.right - results.right) < 1,
    columns: getComputedStyle(document.querySelector('.results__stats')).gridTemplateColumns.split(' ').length,
    statStyles,
  }
})()
```

Expected: `aligned: true`, `columns: 4`, and each stat has no visible border, shadow, or radius.

---

### Task 2: Add accessible once-only counter animation

**Files:**
- Modify: `design/index.html` immediately after the Services mesh IIFE and before `</script>`
- Test: live page at `http://127.0.0.1:5173/design/`

**Interfaces:**
- Consumes: Task 1's `[data-result-counter]`, `data-value`, and `data-suffix` attributes.
- Produces: once-only viewport counter animation with final-value fallbacks.

- [ ] **Step 1: Run the failing counter initialization check**

Reload while the Results section is below the viewport, then evaluate:

```js
Array.from(document.querySelectorAll('[data-result-counter]'), (node) => node.textContent)
```

Expected before the counter script: `['95%', '5%', '35', '96%']` with no animated transition.

- [ ] **Step 2: Add the counter IIFE**

Append before the closing `</script>`:

```js
  (function () {
    var counters = Array.prototype.slice.call(
      document.querySelectorAll("[data-result-counter]")
    );
    if (!counters.length) return;

    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function finalText(counter) {
      return counter.dataset.value + (counter.dataset.suffix || "");
    }

    function showFinal(counter) {
      counter.textContent = finalText(counter);
    }

    function animateCounter(counter) {
      var target = Number(counter.dataset.value);
      var suffix = counter.dataset.suffix || "";
      var startedAt = performance.now();
      var duration = 1100;

      function frame(now) {
        var progress = Math.max(0, Math.min((now - startedAt) / duration, 1));
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(frame);
        else showFinal(counter);
      }

      requestAnimationFrame(frame);
    }

    if (reducedMotion || !("IntersectionObserver" in window)) {
      counters.forEach(showFinal);
      return;
    }

    counters.forEach(function (counter) {
      counter.textContent = "0" + (counter.dataset.suffix || "");
    });

    var section = document.querySelector(".results");
    var observer = new IntersectionObserver(function (entries) {
      if (!entries[0] || !entries[0].isIntersecting) return;
      observer.disconnect();
      counters.forEach(animateCounter);
    }, { threshold: 0.25 });
    observer.observe(section);
  })();
```

- [ ] **Step 3: Verify final-value source and accessibility**

Run:

```js
(() => Array.from(document.querySelectorAll('.result__number'), (node) => ({
  ariaLabel: node.getAttribute('aria-label'),
  value: node.querySelector('[data-result-counter]').dataset.value,
  suffix: node.querySelector('[data-result-counter]').dataset.suffix,
})))()
```

Expected:

```js
[
  { ariaLabel: '95 percent', value: '95', suffix: '%' },
  { ariaLabel: '5 percent', value: '5', suffix: '%' },
  { ariaLabel: '35 days', value: '35', suffix: '' },
  { ariaLabel: '96 percent', value: '96', suffix: '%' },
]
```

- [ ] **Step 4: Verify the Results section contains no em dashes**

Run:

```powershell
rg -n "—|&mdash;|&#8212;" design\index.html
```

Expected: no matches.

- [ ] **Step 5: Build the project**

Run: `npm run build`

Expected: TypeScript validation and the Vite production build succeed with exit code `0`.

- [ ] **Step 6: Commit when Git is available**

```bash
git add design/index.html docs/superpowers/specs/2026-08-18-results-benchmarks-section-design.md docs/superpowers/plans/2026-08-18-results-benchmarks-section.md
git commit -m "feat: add animated results benchmarks section"
```

Expected in the current workspace: skip because `D:\Design\Heiller` has no `.git` repository.

---

### Task 3: Verify the Results section in the browser

**Files:**
- Test: live page at `http://127.0.0.1:5173/design/`

**Interfaces:**
- Consumes: Tasks 1 and 2's Results markup, styles, and animation.
- Produces: verified desktop, tablet, mobile, motion, and regression behavior.

- [ ] **Step 1: Verify desktop visual placement**

At the current desktop viewport, scroll to Results and capture a screenshot.

Expected: a left-aligned heading matching the Services heading at `46px`/`48px`, one full-width `1px solid #CCCCCC` divider, then four large numbers in one open row. The section has no card treatment, shadows, gradients, rounded containers, or extra dividers.

- [ ] **Step 2: Verify once-only animation**

Reload above the Results section, scroll it into view, and capture the counter text near the beginning and after at least 1.2 seconds.

Expected: the first capture shows intermediate values; the second shows `95%`, `5%`, `35`, and `96%`. Scrolling away and back does not restart the counters.

- [ ] **Step 3: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce` and reload.

Expected: the four final values appear immediately without a count-up transition.

- [ ] **Step 4: Verify tablet and mobile layouts**

Check at widths around 800px and 390px.

Expected: two columns at tablet width and one column at mobile width, with no dividers between metrics, clipping, or horizontal overflow. The single heading-to-metrics divider remains visible.

- [ ] **Step 5: Verify surrounding sections remain unchanged**

Expected: Services remains 1311px wide with its existing bordered grid and animated green canvas; Results starts after Services with open white space; the hero, HIPAA panel, and both shaders continue to render and animate.

- [ ] **Step 6: Verify browser health**

Expected: no new JavaScript, IntersectionObserver, layout, WebGL, console, or accessibility errors and no new warnings.
