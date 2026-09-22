# Services Liquid-Glass Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Center the Services liquid-glass contact action precisely and give its flowing background a six-second rubber-band animation.

**Architecture:** Keep the existing Services markup and pointer-spring controller. Modify only the Services visual CSS and its focused contract test, using explicit keyframe overshoot stops for the image field.

**Tech Stack:** HTML, CSS keyframes, Node test runner, Vite.

## Global Constraints

- Do not change Services copy, grid structure, email action, or the standalone demo.
- Preserve reduced-motion behavior.
- Keep full image coverage throughout every keyframe.

---

### Task 1: Centering and Rubber-Band Motion

**Files:**
- Modify: `D:/Design/Heiller/index.html`
- Modify: `D:/Design/Heiller/tests/liquid-glass-button.test.mjs`

**Interfaces:**
- Consumes: `.services__visual`, `.services-liquid-glass`, and `services-field-drift`.
- Produces: exact grid centering at rest and a six-second alternating elastic image-field cycle.

- [ ] **Step 1: Add failing CSS contract assertions**

Assert that the Services visual uses `align-items: center`, `justify-items: center`, that the button has `place-self: center`, and that the image-field animation is `6s linear infinite alternate`. Assert explicit `0%`, `38%`, `58%`, `76%`, and `100%` rubber-band keyframe stops.

- [ ] **Step 2: Run the focused test**

Run: `node --test tests/liquid-glass-button.test.mjs`

Expected: the new centering/motion assertions fail.

- [ ] **Step 3: Implement the CSS adjustment**

Replace shorthand grid placement with explicit axis centering, add `place-self: center` to the button, change the field cycle from 18 seconds to 6 seconds, and replace the two-stop keyframes with bounded overshoot and settle transforms at the required stops.

- [ ] **Step 4: Run automated verification**

Run: `npm test`

Expected: all tests pass.

Run: `npm run build`

Expected: Vite production build succeeds.

- [ ] **Step 5: Verify in the browser**

At desktop and 393px mobile widths, measure the resting button and visual centers and confirm their X/Y deltas are within 1px. Confirm the background covers the cell, the console is clean, and reduced motion removes the field animation.

- [ ] **Step 6: Commit if Git is available**

```bash
git add index.html tests/liquid-glass-button.test.mjs docs/superpowers/specs/2026-08-30-services-liquid-glass-motion-design.md docs/superpowers/plans/2026-08-30-services-liquid-glass-motion.md
git commit -m "refine Services liquid glass motion"
```

If Git metadata is absent, report that no commit was created.
