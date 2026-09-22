# Remove Announcement Strip Design

## Goal

Remove the unrelated sky-blue announcement strip above the navigation and reclaim its vertical space.

## Approved change

- Delete the `.announce` and `.announce span` CSS rules.
- Delete the `<div class="announce">` element and its stablecoin/Stripe copy.
- Do not add a spacer or compensate with additional hero padding.
- Allow the hero to move upward naturally by the removed row's `35px` height.
- Keep the navigation markup, navigation styling, hero padding, gradient, connector animation, trust panel, and all unrelated content unchanged.

## Verification

- Confirm there are no `.announce` selectors or elements in `design/index.html`.
- Confirm the live page contains no `.announce` element.
- Confirm `.hero` retains `padding-top: 280px` and its top edge moves upward by `35px` relative to the previous layout.
- Confirm the navigation still renders and the project builds successfully.

## Scope

Only the announcement strip's markup and CSS are removed. No copy or layout elsewhere is changed.
