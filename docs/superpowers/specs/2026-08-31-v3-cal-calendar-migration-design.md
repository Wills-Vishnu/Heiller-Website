# V3 Cal.com Calendar Migration Design

## Goal

Replace V2’s entire “Who we help” section with the live Cal.com calendar box from V3, move the calendar configuration into V2, and route booking links directly to it.

## Source and Runtime

Use V3’s `D:/RCM_V3/src/components/home/CalBooking.tsx` as the configuration source. Move the following values into a new V2 vanilla TypeScript module:

- Cal link: `heiller/revenue-audit`.
- Namespace: `revenue-audit`.
- Layout: `month_view`.
- Theme: `light`.
- Brand color for light and dark configuration: `#ff682c`.
- Event-type details remain visible.

Add `@calcom/embed-snippet` at `^1.3.3` to V2. Do not move React, Next.js, or `@calcom/embed-react` into V2.

The new module initializes the namespace once, mounts one inline calendar into the V2 container, and applies the V3 `ui` configuration. It must safely return without side effects if the container is absent.

## Section Replacement

Remove the existing `.audience` section markup, including its heading and three audience cards. Replace it in the same document position with a calendar-only section:

- Section anchor: `#booking-calendar`.
- Accessible label: “Book a free revenue audit”.
- One calendar mount element carrying `data-cal-link="heiller/revenue-audit"`.
- No eyebrow, heading, paragraph, duplicate form, or fallback marketing copy.

Remove audience-specific CSS that no longer has a consumer. Do not change surrounding sections.

## Rail Alignment and Shape

The calendar section uses V2’s shared content frame. Its visible box spans from the left global content rail to the right global content rail.

On widths where the rails are visible:

- Apply a 1px negative inline margin and `width: calc(100% + 2px)` so the calendar’s left and right borders sit directly over the two rail strokes.
- Use a square outer frame with `border-radius: 0`.
- Use `overflow: hidden` and a 1px border matching V2’s `#CCCCCC` rail color.

The Cal.com iframe must also render with square corners through the V2 wrapper/iframe styles. V2 cannot alter styles inside the cross-origin Cal.com document, so this requirement applies to the outer container, generated inline custom element, and iframe boundary.

At `640px` and below, where V2’s global rails are hidden, remove the negative overlap and use the full available section width. Corners remain square.

## Responsive Height

Allow Cal.com’s inline embed to update its own content height. Give the mount a useful loading minimum height:

- Desktop/tablet: `min-height: 540px`.
- Mobile at `640px` and below: `min-height: 500px`.

Do not lock the final iframe to a fixed height or introduce horizontal scrolling.

## Booking Links

- Change the current audit CTA `href="#"` to `href="#booking-calendar"`.
- Change the footer link label from “Who we help” to “Book an audit”.
- Change that footer link target from `#who-we-help` to `#booking-calendar`.
- Preserve the existing footer “Revenue audit” link to V2’s current `#revenue-audit` editorial section.

## Loading and Failure Behavior

The outer calendar box is present immediately while Cal.com loads. If the hosted Cal.com script or iframe fails, leave the square bordered mount in place and log no custom error containing sensitive data. Do not add a duplicate booking form.

## Testing and Verification

- Assert the “Who we help” markup and `#who-we-help` anchor are removed.
- Assert one `#booking-calendar` section and one Cal.com mount with the exact link and accessible label.
- Assert `@calcom/embed-snippet` is a V2 dependency and the new module is loaded by V2.
- Assert the namespace, link, layout, theme, brand color, and `hideEventTypeDetails: false` match V3.
- Assert the square radius, 1px rail overlap, desktop/mobile minimum heights, and mobile overlap reset.
- Assert the audit CTA and “Book an audit” footer link target `#booking-calendar` while the existing “Revenue audit” footer link still targets `#revenue-audit`.
- Run the full V2 Node test suite and Vite production build.
- Verify the live V2 calendar at desktop, 768px, 393px, and 320px.
- Confirm the box aligns over visible rails, remains square, loads the Cal.com month view, resizes without horizontal overflow, and produces no browser console errors.

## Out of Scope

- Changes to the V3 project or its calendar component.
- Changes to the Cal.com event type, account, availability, or booking workflow.
- Copying V3’s audit heading, FAQ, or final statement into V2.
- Changes to V2’s existing `#revenue-audit` editorial content beyond its CTA target.
