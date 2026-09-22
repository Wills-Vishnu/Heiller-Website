# Results benchmark section design

## Goal

Add a Results section directly after Services on `/design/`. The section presents four MGMA industry benchmarks as large animated numbers while staying within the existing Heiller visual language.

## Content

- Eyebrow: `Results`
- Heading: `Results measured against the standard`
- Metric 1: `95%` with label `Clean claim rate` and explanation `The share of claims accepted on the first submission.`
- Metric 2: `5%` with label `Denial rate` and explanation `A strong revenue cycle keeps denials at or below this level.`
- Metric 3: `35` with label `Days in A/R` and explanation `Clean claims should convert to cash within 30 to 40 days.`
- Metric 4: `96%` with label `Net collection rate` and explanation `The share of contracted revenue successfully collected.`
- Do not display a source or disclaimer line beneath the metrics.

The section must not imply that the figures are Heiller client outcomes.

## Layout

- Place the section immediately after `.services` in `design/index.html`.
- Align the content to the same 1311px maximum width used by the HIPAA and Services sections.
- Use generous vertical spacing to separate the open Results layout from the bordered Services grid above.
- Keep the heading left aligned and match the Services heading exactly: `46px` font size, `48px` line height, `500` weight, and `-2px` letter spacing.
- Add one horizontal divider between the heading and the metrics. It spans the full 1311px Results width and uses the existing grid stroke: `1px solid #CCCCCC`.
- Split the existing heading-to-metrics spacing evenly above and below the divider so the metrics retain their current vertical position.
- Place four equal stat blocks next to one another on desktop.
- Do not add cards, pills, shadows, gradients, rounded containers, outer borders, or internal metric dividers beyond the single approved horizontal divider.
- Use spacing alone to establish the four-column rhythm.

## Visual language

- Reuse the current page typeface and dark brown-black heading color.
- Reuse the muted grey used by existing supporting copy.
- Reuse the blue square and small eyebrow treatment from `Our services`.
- Keep the numbers visually dominant without competing with the hero heading.
- Remove the plus sign from both percentage benchmarks everywhere, including visible text, counter suffixes, and accessibility labels.
- Use the existing page spacing rhythm and restrained motion style.
- Do not use em dashes.

## Counter behavior

- Start each number at zero when JavaScript is available.
- Animate each value once when the section first enters the viewport.
- Use a smooth ease-out duration of approximately 1.1 seconds.
- Preserve each metric's `%` suffix exactly.
- When `prefers-reduced-motion: reduce` is active, show final values immediately.
- If `IntersectionObserver` is unavailable, show final values immediately.
- The numbers remain readable final values without JavaScript.

## Responsive behavior

- Desktop: four columns in one row.
- Tablet: two columns.
- Mobile: one column.
- Maintain consistent vertical spacing without adding any extra divider lines at smaller widths; keep the single heading-to-metrics divider.
- Prevent horizontal overflow and keep all supporting copy within its stat block.

## Accessibility

- Use semantic heading and definition-list markup for the metrics.
- Final values and labels must be available to assistive technology before animation begins.
- Treat animation as visual enhancement only.

## Verification

- The section appears directly after Services and aligns to its left and right edges.
- The heading is left aligned and uses the exact Services heading typography.
- Four unbordered metrics sit side by side at desktop width.
- A single `1px solid #CCCCCC` divider spans the Results width between the heading and metrics.
- Counters animate once on entry and end at `95%`, `5%`, `35`, and `96%`.
- Reduced motion and missing observer support display final values immediately.
- No em dashes, card borders, additional grid strokes, shadows, gradients, or rounded containers are added.
- Tablet and mobile layouts use two and one columns respectively without overflow.
- The production build succeeds and the browser console has no new errors or warnings.
