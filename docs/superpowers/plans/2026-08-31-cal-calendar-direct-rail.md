# Cal.com Direct-Rail Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove V2's outer calendar presentation box so the Cal.com embed surface aligns directly with the global content rails.

**Architecture:** Keep the current Cal.com runtime and accessible markup unchanged. Narrow the change to the calendar CSS contract and its static test, allowing Cal.com to own height while V2 owns only rail alignment, square edges, and responsive width.

**Tech Stack:** HTML, CSS, TypeScript, Vite 6, Node test runner, Cal.com embed snippet.

## Global Constraints

- Preserve `#booking-calendar`, `heiller/revenue-audit`, namespace `revenue-audit`, and all current booking-link targets.
- Remove wrapper border, wrapper background treatment, overflow clipping, fixed minimum height, and calendar-section presentation padding.
- Keep desktop/tablet `margin-inline: -1px` and `width: calc(100% + 2px)`.
- Keep `cal-inline` and iframe width at 100%, maximum width at 100%, and radius at zero.
- Do not scale, stretch, crop, or rebuild Cal.com's cross-origin interface.
- At 640px and below, reset to zero inline margin and 100% width with no horizontal overflow.
- `D:/Design/Heiller` is not a Git repository, so no branch, worktree, or commit operation applies.

---

### Task 1: Update the direct-rail presentation contract

**Files:**
- Modify: `tests/cal-booking.test.mjs`

**Interfaces:**
- Consumes: calendar CSS embedded in `index.html`.
- Produces: a failing contract that rejects the obsolete outer box and preserves alignment behavior.

- [ ] **Step 1: Replace the framed-box assertions**

  Rename the presentation test to describe the direct-rail embed. Keep assertions for `margin-inline: -1px`, `width: calc(100% + 2px)`, square iframe edges, and the mobile reset. Replace positive assertions for border, overflow clipping, and desktop/mobile minimum heights with negative assertions. Add a negative assertion that `.booking-calendar` does not set padding.

- [ ] **Step 2: Confirm the focused test fails**

  Run: `node --test tests/cal-booking.test.mjs`

  Expected: the presentation test fails because `index.html` still supplies the old border, clipping, minimum heights, and section padding.

---

### Task 2: Remove the outer calendar box

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: the existing `.booking-calendar`, `.booking-calendar__frame`, `cal-inline`, and iframe selectors.
- Produces: a natural-height Cal.com embed directly aligned to the rails.

- [ ] **Step 1: Remove calendar section padding from shared rules**

  Remove `.booking-calendar` from the base grouped section-padding selector. Delete its dedicated 960px, 640px, and 389px padding overrides. Retain the plain white page background without introducing a new display box.

- [ ] **Step 2: Reduce the wrapper to alignment only**

  Keep `box-sizing: border-box`, `width: calc(100% + 2px)`, `margin-inline: -1px`, and `border-radius: 0`. Remove `min-height`, `overflow`, `border`, and wrapper `background` declarations. Preserve the existing `cal-inline` and iframe sizing/radius declarations.

- [ ] **Step 3: Remove mobile fixed height**

  Keep only `margin-inline: 0` and `width: 100%` in the 640px calendar-frame rule. Remove the 500px minimum height.

- [ ] **Step 4: Confirm the focused test passes**

  Run: `node --test tests/cal-booking.test.mjs`

  Expected: all calendar contract tests pass.

---

### Task 3: Regression and live-browser verification

**Files:**
- Verify only; modify implementation/tests only for a defect within the approved spec.

**Interfaces:**
- Consumes: completed direct-rail CSS.
- Produces: automated and visual evidence that the embed remains functional and responsive.

- [ ] **Step 1: Run the full suite and production build**

  Run: `npm test`

  Expected: all Node tests pass.

  Run: `npm run build`

  Expected: TypeScript and Vite production build succeed.

- [ ] **Step 2: Verify desktop and tablet geometry**

  At 1440px and 768px, navigate to `http://127.0.0.1:5180/#booking-calendar`. Confirm one live Cal.com iframe, square edges, natural height, no wrapper border, no separate white presentation area, and a 1px overlap with each visible rail.

- [ ] **Step 3: Verify phone geometry**

  At 393px and 320px, confirm rails are hidden, the wrapper uses the page gutter and 100% available width, the Cal.com embed remains usable, and document scroll width does not exceed document client width.

- [ ] **Step 4: Check console and mark the deliverable**

  Confirm there are no browser errors or warnings, reset the temporary viewport override, and mark the V2 calendar view as the deliverable. Report that no Git commit exists because the workspace has no Git metadata.
