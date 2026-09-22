# Service Card Title Font Design

## Goal

Change the titles in the six service cards to Plus Jakarta Sans.

## Approved Behaviour

- Apply `font-family: "Plus Jakarta Sans", system-ui, sans-serif` to `.card__title`.
- Affect exactly these six titles: HIPAA-conscious, Controlled access, Protected movement, Traceable activity, Secure infrastructure, and Continuity by design.
- Leave card descriptions in their current inherited font.
- Preserve title font size, weight, letter spacing, line height, wrapping, card spacing, icons, and responsive behavior.
- Do not change the services introduction panel, CTA, trust strip, or other card systems.

## Verification

- Add a focused source contract proving `.card__title` owns the Plus Jakarta Sans declaration.
- Confirm `.card` and `.card__body` do not receive a new font-family declaration.
- Run the complete test suite and production build.
- Verify all six title elements report Plus Jakarta Sans in the browser at desktop and mobile widths, with no overflow or console errors.
