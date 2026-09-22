# Responsive Hero Process Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Center the Patient → Optimize hero process diagram and keep its established responsive behavior intact.

**Architecture:** Center the 1079px desktop route canvas with percentage positioning and translation inside the shared content frame. Retain the existing proportional tablet layout and readable two-column mobile reflow, explicitly resetting desktop transforms at those breakpoints.

**Tech Stack:** HTML, responsive CSS, Node test runner, Vite.

## Global Constraints

- Preserve node order, labels, wire geometry, route animation, and reduced-motion behavior.
- Do not modify adjacent hero copy, Trust content, or Services content.
- Avoid horizontal page overflow.

---

### Task 1: Centered Responsive Hero Flow

**Files:**
- Modify: `D:/Design/Heiller/index.html`
- Create: `D:/Design/Heiller/tests/hero-flow-responsive.test.mjs`

**Interfaces:**
- Consumes: `.hero__flow`, `.flow__stage`, `.flow__tags`, and existing 960px/640px media queries.
- Produces: symmetric desktop route margins, fluid tablet scaling, and readable mobile reflow.

- [ ] **Step 1: Add failing structural CSS tests**

Assert that the desktop wrapper uses the shared frame width, `.flow__tags` is centered with `left: 50%` and `translateX(-50%)`, tablet rules reset left/transform and retain `aspect-ratio: 1079 / 275`, and mobile retains the two-column node grid without the wire layer.

- [ ] **Step 2: Run the focused test**

Run: `node --test tests/hero-flow-responsive.test.mjs`

Expected: desktop centering assertions fail.

- [ ] **Step 3: Implement responsive centering**

Remove the fixed `1400px` wrapper width, center the desktop route canvas from its midpoint, and reset the translation in the existing tablet media query where `.flow__tags` becomes full width.

- [ ] **Step 4: Run automated verification**

Run `npm test` and `npm run build`; both must pass.

- [ ] **Step 5: Verify browser geometry**

Measure the route or responsive node grid at 393px, 768px, 1280px, and 1440px. Confirm equal desktop margins within 1px, no horizontal overflow, no overlap with Trust, and no console errors.

- [ ] **Step 6: Commit if Git is available**

```bash
git add index.html tests/hero-flow-responsive.test.mjs docs/superpowers/specs/2026-08-31-responsive-hero-flow-design.md docs/superpowers/plans/2026-08-31-responsive-hero-flow.md
git commit -m "fix: center responsive hero flow"
```

If Git metadata is absent, report that no commit was created.
