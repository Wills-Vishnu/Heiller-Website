# Trust Panel Width Design

## Problem

The trust box is `1349px` wide, while its bordered feature panel is hard-coded to `1128px` and offset `19px` from the left. This produces a correct `19px` left inset but an unintended `202px` right gap, making the panel border appear truncated.

## Approved correction

- Preserve the existing `19px` left inset.
- Replace the fixed `1128px` panel width with `calc(100% - 38px)`.
- The resulting panel width is `1311px`, leaving matching `19px` insets on both sides of the `1349px` trust box.
- Keep the tab width, panel height, feature-item distribution, typography, border styling, and vertical position unchanged.

## Verification

- Confirm the live `.trust__panel` width is `1311px`.
- Confirm the live left and right gaps between `.trust__panel` and `.trust__box` are both `19px`.
- Confirm all five feature items remain inside the bordered panel and are distributed across its full width.
- Confirm the project builds successfully and the page loads without browser console errors.

## Scope

Only the width calculation of `.trust__panel` changes. The trust box, HIPAA tab, service section, connector animation, and all unrelated layout remain unchanged by this correction.
