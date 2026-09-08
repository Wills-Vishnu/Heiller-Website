# Shared Left-Heading Inset Design

## Goal

Give the selected left-aligned V2 section headings the same distance from the left content rail as the “One team for your revenue cycle” Services heading.

## Shared Inset

Define one reusable responsive inset for this alignment:

- Desktop above 960px: `40px`.
- Tablet from 641px through 960px: `24px`.
- Mobile from 390px through 640px: `16px`.
- Small mobile at 389px and below: `12px`.

The values match V2's existing Services/page gutter rhythm. They must be represented by one shared custom property so the selected sections cannot drift independently.

## Included Content

Apply the shared inset to exactly these left-aligned content groups:

1. The complete “Built to stay close to the work” intro content.
2. The text content inside all five numbered Why rows.
3. The “Measure the work that moves revenue” Results header.
4. The heading-side content group containing “See where revenue is getting stuck” in the revenue-audit header.
5. The left heading group containing “What practices usually want to know” in the FAQ layout.

For the Why rows, keep each horizontal divider spanning from the left rail to the right rail. Only the row's content is inset.

## Excluded Content

- Do not change “One team for your revenue cycle”; it is the visual reference.
- Do not change centered headings such as the hero, dedicated-team heading, or workflow heading.
- Do not change Getting started, Systems, Contact, footer headings, audit ledger row headings, or metric card headings.
- Do not move section shells, global rails, cards, grids, divider lines, or the Cal.com embed.
- Do not alter heading typography, copy, wrapping, animation, or vertical spacing.

## Responsive Behavior

All included content uses the same shared inset value at a given viewport width. Existing layout changes—such as stacked Why rows, stacked audit header content, and stacked FAQ columns—remain intact. The inset must not introduce horizontal overflow at 320px.

## Testing and Verification

- Add a static contract test for the shared custom property and its four exact responsive values.
- Assert that all five included selector groups consume that property.
- Assert that the Why row border stays on the row container and remains full-width.
- Assert that unrelated centered and left-aligned headings are not included in the shared inset selector.
- Run the full Node test suite and Vite production build.
- In the browser, compare the selected headings against the Services heading at 1440px, 768px, 393px, and 320px.
- Confirm equal left-rail offsets at each width, rail-to-rail Why dividers, no horizontal overflow, and no browser errors or warnings.
