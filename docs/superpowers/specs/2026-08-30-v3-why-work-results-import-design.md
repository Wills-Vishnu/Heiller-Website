# V3 Why, Workflow, and Results Import Design

## Goal

Replace V2’s current Results section with V3’s “Built to stay close to the work.” section, then insert the next two V3 sections—“We work as an extension of your team” and “Measure the work that moves revenue.”—before V2’s existing Revenue Audit section.

## Final Section Order

1. Existing V2 Dedicated Team orbit section.
2. Imported V3 Why Heiller section with `id="why-heiller"`.
3. Imported V3 Team Extension workflow section with `id="team-extension"`.
4. Imported V3 Results metric section with `id="results"`.
5. Existing V2 Revenue Audit section with `id="revenue-audit"`.

The old V2 Results markup and styling are removed or replaced; the `#results` anchor continues to exist on the imported V3 metric section.

## Rail and Spacing Model

- All three sections use the existing V2 `1311px` rail frame as their maximum outer width.
- Editorial headings, statements, reason text, workflow heading, and other unboxed copy use a maximum `65px` desktop inset from each rail.
- The Why-section divider lines span the complete width between the rails; each row’s text remains inset by the responsive editorial gutter.
- The workflow ledger may use the complete rail width for its route geometry, but stage content retains V3’s internal responsive padding.
- The Results metric grid touches the left and right rails because its border and boxes are structural parts of the design.
- At mobile widths, the global rails remain hidden and these sections use V3’s `20px` content padding.

## Section 1: Why Heiller

### Desktop

- Two-column intro with:
  - Heading: “Built to stay close to the work.”
  - Statement: “At Heiller, we work as an extension of your team. We take ownership, stay close to the work, and keep every handoff visible.”
- Preserve V3’s typography, line height, wrapping, column balance, and white background.
- Do not show the “See how we work” CTA on desktop.
- Render five full-width divided rows using the exact V3 copy:
  1. One accountable owner — Every claim and handoff has a named owner, so work does not disappear between teams.
  2. Fewer stalled handoffs — The next action stays visible, helping queues move without repeated status chasing.
  3. Revenue-cycle focus — The operating model is built around registration, coding, billing, denials, and collections.
  4. Work you can inspect — Reporting shows what moved, what stalled, and where attention is needed next.
  5. A flexible extension — Use Heiller for one revenue-cycle function or connect the work across the full cycle.

### Mobile

- Stack the heading, statement, and rows into one column using V3’s sizes and spacing.
- Show V3’s full-width pill CTA, “See how we work,” linking to `#team-extension`.
- Preserve V3’s full-width divider above the first reason row and between subsequent rows.

## Section 2: Team Extension Workflow

- Heading: “We work as an extension of your team”.
- Port V3’s six-stage alternating workflow ledger:
  1. Intake and registration
  2. Coding and claim preparation
  3. Claim submission
  4. Denial recovery
  5. A/R follow-up
  6. Revenue reporting
- Preserve the alternating left/right desktop arrangement, two-digit gradient stage numbers, centered dashed spine, gradient fill, arrow ending, and V3 spacing.
- Draw the colored spine progressively as the section scrolls through the viewport.
- Recalculate its SVG geometry on resize and after fonts are ready.
- The centered CTA reads “Start with a revenue audit” and links to `#revenue-audit`.
- On mobile, remove the vertical SVG route and render the six stages as a single-column dashed list using V3 typography and spacing.
- With reduced motion, show the complete gradient spine without scroll animation.

## Section 3: Results Metrics

- Eyebrow: “Performance standard”.
- Two-line heading: “Measure the work” / “that moves revenue.”
- Render the exact four V3 metric boxes:
  1. `95%` — Clean claim rate — Operating target based on a strong first-submission benchmark.
  2. `5%` — Denial rate — Target ceiling measured against common industry benchmarks.
  3. `35` — Days in A/R — Target within a 30 to 40 day benchmark range.
  4. `96%` — Net collection rate — Target measured against an effective-collection benchmark.
- Preserve V3’s bordered four-column desktop grid, card height, typography, and spacing.
- The grid’s outer border aligns exactly with both V2 rails.
- Reuse or extend V2’s existing metric shader renderer so the four values retain V3’s animated blue, lavender, and gold mesh without creating unnecessary WebGL contexts.
- On mobile, stack the metric boxes into one column and retain the shared outer border treatment.
- With reduced motion or unavailable WebGL, display the static V3 gradient-text fallback.

## Native V2 Integration

- Implement the sections in V2’s existing static HTML, CSS, and TypeScript architecture; do not add React, Next.js, GSAP, or another runtime dependency.
- Port only the V3 behavior required by these sections.
- Reuse the existing V2 button treatment where it already matches the approved V3 pill buttons.
- Keep all headings semantic, preserve ordered workflow meaning, and mark decorative canvases and SVG routes as presentation-only.
- Keep the existing Revenue Audit and all later V2 sections unchanged.

## Performance and Error Handling

- Run workflow and metric animations only while their sections are near the viewport and the document is visible.
- Reuse shared animation frames and WebGL resources where the existing V2 renderer supports them.
- If canvas or WebGL initialization fails, preserve readable gradient fallback values with no layout shift.
- Disconnect observers and cancel animation work when no longer needed.

## Verification

- Verify the exact section order and IDs.
- Compare the three sections with the confirmed V3 deployment at desktop width.
- Verify headings and row copy remain at least `65px` inside the desktop rails.
- Verify Why dividers and the Results box grid align with both rails.
- Verify the workflow spine draws with scroll, recalculates on resize, and completes under reduced motion.
- Verify all four metric shaders animate and retain fallbacks.
- Verify mobile layouts at `393px` and `320px`, including hidden global rails, stacked Why rows, single-column workflow, and stacked metric boxes.
- Verify no horizontal overflow, console errors, accessibility regressions, or added runtime dependencies.
- Run all automated tests and the production build.
