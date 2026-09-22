# Global Content Rails Design

## Goal

Create two continuous vertical rails that establish a consistent maximum content width across V2 while allowing decorative backgrounds and shaders to remain full bleed.

## Frame

- Use `1311px`, matching the existing Services inner width, as the desktop maximum content width.
- Center the frame in the viewport.
- Draw one subtle vertical line at each frame edge from the top of the page through the bottom of the footer.
- Use the second section's exact structural stroke color, `#CCCCCC`, so the rails feel structural rather than decorative.
- Keep the rails non-interactive and outside the accessibility tree.

## Responsive Behavior

- At viewport widths greater than `1311px`, the frame remains `1311px` wide and centered; additional monitor width appears outside the rails.
- At narrower widths, rails align to the established responsive page gutters instead of causing horizontal overflow.
- Desktop gutters use `40px`, tablet gutters use `24px`, mobile gutters use `16px`, and narrow mobile gutters use `12px`, matching V2's current layout system.
- Hide both decorative rails at `640px` viewport width and below.
- Continue using the established `16px` mobile and `12px` narrow-mobile content gutters after the rails are hidden; hiding the rails must not alter content width or alignment.

## Content Containment

- Navigation, hero copy and flow content, trust content, Services, Dedicated Team content, Results, audit content, remaining informational sections, calls to action, and footer content must remain inside the rail boundaries.
- The HIPAA trust strip must use the complete rail width: its icon panel starts on the left rail and ends on the right rail.
- The “HIPAA compliant” tab starts on the left rail so the tab and icon panel read as one aligned framed unit.
- Existing section-specific inner widths may remain narrower than `1311px`.
- No content may expand beyond the rails on ultrawide displays.

## Full-Bleed Visuals

- Hero shaders, audit shaders, gradients, section background colors, and footer background artwork may extend beyond the rails to the browser edges.
- The rails use the same fixed `#CCCCCC` color across all backgrounds and do not use blend modes or adaptive color treatment.
- The Dedicated Team orbit stays geometrically contained within the content frame.

## Implementation Direction

- Define shared CSS custom properties for frame width, gutter, and divider color.
- Add a single non-semantic rail layer spanning the complete `.page` height.
- Align existing section inner containers to the shared frame using `width`, `max-width`, and centered margins rather than introducing a rigid full-page wrapper.
- Avoid changing section spacing, copy, motion, or unrelated visual styling.

## Verification

- Verify rail alignment with Services at the current desktop viewport.
- Verify both edges of the HIPAA trust icon panel align with the rails and its tab begins on the left rail.
- Verify content stops expanding at `1311px` on a 1920px and an ultrawide viewport.
- Verify shaders and section backgrounds remain full bleed.
- Verify tablet rails follow their established gutters and mobile content retains its established gutters with no horizontal overflow.
- Verify rails remain visible at `641px` and are absent at `640px`, `393px`, and `320px` while content gutters remain unchanged.
- Verify the rails span from page top through footer bottom.
- Run all automated tests and the production build.
