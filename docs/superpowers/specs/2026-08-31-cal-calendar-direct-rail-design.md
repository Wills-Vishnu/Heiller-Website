# Cal.com Direct-Rail Calendar Design

## Goal

Remove the visible outer box around the V2 Cal.com embed so the embed itself is the calendar section surface and meets the page's left and right content rails directly.

## Desktop and Tablet Layout

- Preserve the existing `#booking-calendar` section, Cal.com link, namespace, configuration, and booking-link targets.
- Remove the calendar section's vertical presentation padding so there is no separate white display area above or below the embed.
- Remove the wrapper's border, background treatment, fixed loading minimum height, and overflow clipping.
- Keep the wrapper aligned one pixel beyond each content rail using `margin-inline: -1px` and `width: calc(100% + 2px)`.
- Keep the generated `cal-inline` element and iframe at `width: 100%`, `max-width: 100%`, and `border-radius: 0`.
- Let Cal.com control the embed's live height. Do not apply scaling, cropping, or horizontal stretching to the iframe contents.

Cal.com's own internal desktop spacing remains untouched because it belongs to the cross-origin booking page. The V2 page will not draw a second box around it.

## Mobile Layout

At `640px` and below, where global rails are hidden:

- Use the existing responsive page gutter through the section shell.
- Reset the wrapper to `margin-inline: 0` and `width: 100%`.
- Keep square iframe edges and natural Cal.com height.
- Preserve zero horizontal overflow at 393px and 320px.

## Accessibility and Behavior

- Preserve the section label “Book a free revenue audit”.
- Preserve one Cal.com mount and one iframe.
- Preserve both links to `#booking-calendar` and the existing footer link to `#revenue-audit`.
- Preserve the current once-only initialization guard and failure behavior.

## Verification

- Update the calendar contract test to reject wrapper borders, fixed minimum heights, and section presentation padding.
- Keep assertions for direct rail overlap, square iframe edges, mobile overlap reset, Cal.com configuration, and booking links.
- Run the full Node test suite and Vite production build.
- Inspect the live calendar at 1440px, 768px, 393px, and 320px.
- Confirm the iframe boundary meets visible rails on desktop/tablet, mobile has no horizontal overflow, Cal.com controls the rendered height, and the console has no errors or warnings.

## Out of Scope

- Scaling or cropping Cal.com's cross-origin booking interface.
- Rebuilding the calendar locally.
- Changing Cal.com account, event, availability, or booking data.
- Changing surrounding V2 sections or V3 source files.
