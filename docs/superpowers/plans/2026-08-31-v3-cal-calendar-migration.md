# V3 Cal.com Calendar Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace V2's “Who we help” section with V3's live Cal.com month-view booking box and route V2 booking links to it.

**Architecture:** Keep V2 as a framework-free Vite page. A focused `cal-booking.ts` module owns all Cal.com constants and initializes one namespaced inline embed; `index.html` owns the accessible mount, square rail-aligned presentation, responsive dimensions, and booking anchors.

**Tech Stack:** HTML, CSS, TypeScript, Vite 6, Node's built-in test runner, `@calcom/embed-snippet` 1.3.x.

## Global Constraints

- Cal link is exactly `heiller/revenue-audit`; namespace is exactly `revenue-audit`.
- Layout is `month_view`, theme is `light`, both theme brand values are `#ff682c`, and `hideEventTypeDetails` is `false`.
- The replacement is the calendar box only: no copied V3 heading, FAQ, form, or marketing text.
- The outer frame and generated embed boundary are square, with 1px `#CCCCCC` borders overlapping visible content rails by 1px.
- At `640px` and below the rail overlap resets; minimum height is 540px above that breakpoint and 500px at or below it.
- The existing `#revenue-audit` editorial section remains; only its audit CTA target changes.
- V3 source files and Cal.com account settings remain untouched.
- `D:/Design/Heiller` is not a Git repository, so no branch, worktree, or commit step applies.

---

### Task 1: Specify the calendar replacement and links

**Files:**
- Create: `tests/cal-booking.test.mjs`
- Modify: `tests/remaining-sections.test.mjs`

**Interfaces:**
- Consumes: current `index.html`, `package.json`, and future `cal-booking.ts` as UTF-8 source.
- Produces: static contract tests for markup, configuration, styles, dependency, and link targets.

- [ ] **Step 1: Write failing contract tests**

  Create `tests/cal-booking.test.mjs` with assertions that require exactly one `#booking-calendar`, one `[data-cal-booking]` mount, the exact accessible label and `data-cal-link`, the `/cal-booking.ts` module script, `@calcom/embed-snippet`, all approved Cal constants/UI options, square borders, rail overlap, responsive minimum heights, and the mobile overlap reset. Assert that `.audience`, `#who-we-help`, and audience copy are absent. Update `tests/remaining-sections.test.mjs` so the finished-section and footer arrays expect `booking-calendar`, and assert footer text “Book an audit”.

- [ ] **Step 2: Run the focused tests and confirm RED**

  Run: `node --test tests/cal-booking.test.mjs tests/remaining-sections.test.mjs`

  Expected: failure because `#booking-calendar`, `cal-booking.ts`, the dependency, and updated links do not exist yet.

---

### Task 2: Add the V2 Cal.com runtime

**Files:**
- Create: `cal-booking.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: one `HTMLElement` matching `[data-cal-booking]`.
- Produces: one initialized `revenue-audit` Cal namespace mounted inline into that element.

- [ ] **Step 1: Install the vanilla embed dependency**

  Run: `npm install @calcom/embed-snippet@^1.3.3`

  Expected: `package.json` and `package-lock.json` record the dependency without adding React or Next.js.

- [ ] **Step 2: Inspect the installed public types before coding**

  Run: `rg -n \"EmbedSnippet|elementOrSelector|cssVarsPerTheme|hideEventTypeDetails|month_view\" node_modules/@calcom/embed-snippet`

  Expected: identify the package's callable API and any exported type constraints; use those exact names in the module.

- [ ] **Step 3: Implement one guarded initializer**

  Create `cal-booking.ts` that imports the package, declares the approved constants, returns immediately when the mount is absent or already initialized, marks the mount initialized, calls `init` with namespace `revenue-audit` and Cal's hosted origin, calls the namespaced `inline` command with `elementOrSelector`, link, light theme, and month view, then calls namespaced `ui` with both brand variables, visible event details, and month view. Do not add custom error logging or a fallback form.

- [ ] **Step 4: Run the focused tests to expose only missing markup/style work**

  Run: `node --test tests/cal-booking.test.mjs tests/remaining-sections.test.mjs`

  Expected: runtime-configuration assertions pass; section/link/style assertions remain red.

---

### Task 3: Replace the audience section and align the calendar box

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `cal-booking.ts` and V2's `.section-shell`/global rail geometry.
- Produces: accessible `#booking-calendar` markup, square responsive frame, and direct booking anchors.

- [ ] **Step 1: Replace audience markup with the calendar-only mount**

  Remove the complete `<section class="audience" id="who-we-help">…</section>` block. Insert in the same position a `<section class="booking-calendar" id="booking-calendar" aria-label="Book a free revenue audit">` containing one `.section-shell` and one `.booking-calendar__frame` carrying `data-cal-booking` and `data-cal-link="heiller/revenue-audit"`.

- [ ] **Step 2: Replace audience CSS with square calendar CSS**

  Remove audience-only base and responsive selectors while preserving shared selectors used by onboarding, systems, and FAQ. Add section spacing consistent with adjacent finished sections. Set the frame to `box-sizing: border-box`, white background, `border: 1px solid #CCCCCC`, `border-radius: 0`, `overflow: hidden`, `min-height: 540px`, `margin-inline: -1px`, and `width: calc(100% + 2px)`. Force the generated Cal custom element and iframe boundary to width 100%, max-width 100%, and `border-radius: 0 !important` without fixing the iframe's final height.

- [ ] **Step 3: Add the mobile overlap reset**

  Inside the existing `@media (max-width: 640px)` rules, set the booking frame to `margin-inline: 0`, `width: 100%`, and `min-height: 500px`. Ensure no horizontal overflow is introduced at the 320px gutter.

- [ ] **Step 4: Route booking links and load the module**

  Change `#audit-cta` from `href="#"` to `href="#booking-calendar"` and remove its obsolete booking-destination comment. Change the footer link from “Who we help”/`#who-we-help` to “Book an audit”/`#booking-calendar`, preserving “Revenue audit”/`#revenue-audit`. Add `<script type="module" src="/cal-booking.ts"></script>` with the other end-of-body modules.

- [ ] **Step 5: Run focused tests and confirm GREEN**

  Run: `node --test tests/cal-booking.test.mjs tests/remaining-sections.test.mjs`

  Expected: all calendar and remaining-section tests pass.

---

### Task 4: Regression and production verification

**Files:**
- Verify only; modify implementation/tests only if a check reveals a defect covered by the approved spec.

**Interfaces:**
- Consumes: complete V2 implementation.
- Produces: passing test/build evidence and a browser-verified calendar experience.

- [ ] **Step 1: Run the complete automated suite**

  Run: `npm test`

  Expected: every Node test passes with no skipped tests.

- [ ] **Step 2: Run the production build**

  Run: `npm run build`

  Expected: TypeScript/Vite build succeeds and emits the site bundle without errors.

- [ ] **Step 3: Load and inspect the live desktop calendar**

  Navigate the running V2 server to `http://127.0.0.1:5180/#booking-calendar` at 1440px wide. Confirm the hosted Cal.com month view appears, the box has square corners, its borders sit over both visible rails, the accessible section/mount exists once, the iframe is not horizontally clipped, and the console has no errors.

- [ ] **Step 4: Verify responsive behavior**

  Repeat visual and DOM/geometry checks at 768px, 393px, and 320px. Confirm the 768px box still overlaps visible rails, the phone layouts reset the overlap, content stays within the viewport, corners remain square, and the calendar remains usable.

- [ ] **Step 5: Verify both booking links**

  Activate the audit CTA and footer “Book an audit” link in turn. Confirm each updates the hash to `#booking-calendar` and scrolls to the calendar box; confirm footer “Revenue audit” still targets `#revenue-audit`.

- [ ] **Step 6: Mark the final browser view and complete the branchless handoff**

  Reset the browser viewport, leave the V2 page on `#booking-calendar`, mark the clean calendar view as the deliverable, and summarize exact files changed plus test/build/browser evidence. Because the folder is not a Git repository, report that no commit was created.
