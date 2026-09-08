# V3 FAQ Replacement Design

## Goal

Remove the V2 Getting Started and Systems sections, then replace the V2 FAQ with the V3 revenue-audit FAQ.

## Page Flow

The affected sequence becomes:

1. Booking calendar
2. V3-style FAQ
3. Final contact
4. Footer

The `#getting-started` and `#systems` sections are removed completely.

## FAQ Content

The replacement keeps the existing `#questions` anchor and uses the V3 eyebrow `Faq`, heading `Questions before we begin`, and these exact entries:

1. **What does the revenue audit include?** A focused review of the reporting and workflow information you already have, followed by a prioritized view of where revenue may be delayed or lost.
2. **What information do you need?** We begin with existing reports and operational context. The first conversation determines what can be reviewed without creating unnecessary preparation work.
3. **How long does it take?** Timing depends on scope and data availability. We confirm a realistic review window before any information is shared.
4. **How is sensitive information handled?** We agree on a secure sharing method and limit the review to the information required for the agreed scope.
5. **What happens after the review?** You receive prioritized findings and recommended next actions, whether or not you engage Heiller for ongoing work.

## Visual and Interaction Design

- Use a white section background.
- Match the V3 desktop layout: two columns sized `.8fr 1.2fr`, separated by an `8vw` gap.
- Use V3 heading scale and line breaks: `Questions before` / `we begin`.
- Use thin grey row separators and full-width accordion buttons.
- Use a plus icon that rotates 45 degrees while its answer is open.
- Animate answer expansion with a grid-row and opacity transition.
- Implement the interaction with native `<details>` and `<summary>` elements so no React dependency or additional JavaScript is required.
- On mobile, stack the heading above the FAQ list with the V3 mobile spacing and heading scale.
- Respect reduced-motion preferences by disabling FAQ transitions.

## Cleanup

- Remove the footer link to `#getting-started` because its destination no longer exists.
- Keep the footer Questions link targeting `#questions`.
- Remove CSS that is used only by the deleted onboarding and systems sections.
- Preserve shared section, eyebrow, content-frame, final-contact, calendar, and footer styles.

## Verification

- Add a source contract proving the deleted section IDs are absent and the exact five V3 FAQ entries are present.
- Confirm every internal footer anchor targets an element that still exists.
- Confirm the FAQ uses five native accessible disclosures.
- Run the complete test suite and production build.
- Verify desktop and mobile layouts in the browser, including accordion interaction, clean console output, and no horizontal overflow.
