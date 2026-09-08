# Shared Left-Heading Inset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align four selected section heading groups and all Why-row content to the same responsive left-rail inset as the Services heading.

**Architecture:** Add one responsive CSS custom property at the page root and consume it through a narrowly scoped selector group. Keep structural section shells and Why dividers unchanged so only content alignment moves.

**Tech Stack:** HTML, CSS, Vite 6, Node test runner, live browser geometry inspection.

## Global Constraints

- Shared inset values are exactly 40px desktop, 24px at 960px and below, 16px at 640px and below, and 12px at 389px and below.
- Included groups are `.v3-why__intro`, `.v3-reason`, `.v3-results__head`, `.audit__head > div:first-child`, and `.faq__layout > div:first-child`.
- Why-row divider borders remain on `.v3-reason` and continue rail-to-rail.
- Services, hero, dedicated-team, workflow, onboarding, systems, contact, footer, audit rows, metrics, rails, cards, calendar, copy, typography, wrapping, animation, and vertical spacing remain unchanged.
- `D:/Design/Heiller` is not a Git repository, so no branch, worktree, or commit operation applies.

---

### Task 1: Specify the shared inset contract

**Files:**
- Create: `tests/left-heading-inset.test.mjs`

**Interfaces:**
- Consumes: CSS embedded in `index.html`.
- Produces: a static contract for the shared property, exact consumers, responsive values, and divider ownership.

- [ ] **Step 1: Write the failing contract test**

  Assert that `:root` defines `--left-heading-inset: 40px`, the 960px/640px/389px media queries override it to 24px/16px/12px, and one selector group applies `padding-inline: var(--left-heading-inset)` to exactly the five approved groups. Assert that `.v3-reason` retains `border-top: 1px solid #CCCCCC`, and that centered or excluded selectors do not appear in the inset group.

- [ ] **Step 2: Confirm RED**

  Run: `node --test tests/left-heading-inset.test.mjs`

  Expected: failure because the custom property and shared consumer rule do not exist.

---

### Task 2: Implement the shared responsive inset

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: the five approved content-group selectors.
- Produces: one responsive `--left-heading-inset` contract shared by all selected groups.

- [ ] **Step 1: Define the desktop token and consumers**

  Add `--left-heading-inset: 40px` to `:root`. Add a clearly labelled selector group containing only `.v3-why__intro`, `.v3-reason`, `.v3-results__head`, `.audit__head > div:first-child`, and `.faq__layout > div:first-child`, with `padding-inline: var(--left-heading-inset)`.

- [ ] **Step 2: Remove conflicting horizontal padding**

  Remove the existing `padding-inline` declarations from `.v3-why__intro`, `.v3-reason`, and `.v3-work__head, .v3-results__head` where they would override the shared rule. Preserve `.v3-work__head` by giving it its existing responsive padding separately because the centered workflow heading is excluded.

- [ ] **Step 3: Add exact responsive token overrides**

  Set `--left-heading-inset: 24px` in the existing 960px root media block, `16px` in the existing 640px root block, and `12px` in the existing 389px root block. Remove `.v3-why__intro`, `.v3-reason`, and `.v3-results__head` from the mobile hard-coded `padding-inline: 20px` group while retaining `.v3-work__head` at 20px.

- [ ] **Step 4: Confirm GREEN**

  Run: `node --test tests/left-heading-inset.test.mjs`

  Expected: all shared-inset contract tests pass.

---

### Task 3: Regression and browser geometry verification

**Files:**
- Verify only; modify implementation/tests only for defects within the approved spec.

**Interfaces:**
- Consumes: completed shared inset CSS.
- Produces: automated and visual evidence of equal offsets and preserved dividers.

- [ ] **Step 1: Run full automated verification**

  Run: `npm test`

  Expected: all Node tests pass.

  Run: `npm run build`

  Expected: TypeScript and Vite production build succeed.

- [ ] **Step 2: Compare desktop and tablet offsets**

  At 1440px and 768px, measure the left offset from the content rail for the Services reference and the four selected headings. Confirm each selected heading matches the Services offset. Confirm every Why-row content edge matches its heading and every Why divider still starts and ends on the rails.

- [ ] **Step 3: Compare mobile offsets**

  At 393px and 320px, compare the same content groups against the Services reference. Confirm the selected groups share the intended 16px/12px rhythm and the document has no horizontal overflow.

- [ ] **Step 4: Finish the branchless handoff**

  Confirm the browser console has no errors or warnings, reset the temporary viewport, mark the verified page as the deliverable, and report that no Git commit was created because the folder has no Git metadata.
