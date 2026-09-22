# Cal.com Full Height and Branding Crop Design

## Goal

Show the complete Cal.com booking panel without internal vertical scrolling while hiding the bottom Cal.com wordmark on wide desktop screens.

## Root Cause

Cal.com reports a 570px inline iframe height, but the current rail-fill measurement reads the temporarily constrained 300px computed height. The runtime then writes 300px back as an important CSS height, creating a feedback loop that clips the calendar and introduces internal scrolling.

## Approved Height Fix

- Read both `iframe.offsetHeight` and the numeric height reported by `iframe.style.height`.
- Use the larger valid value as the native Cal.com iframe height.
- Observe the iframe `style` attribute so later Cal.com height messages trigger another layout calculation.
- Continue applying the existing uniform wide-desktop scale and rail alignment.

## Approved Branding Crop

- On screens wider than 1200px, crop 64 native pixels from the bottom of the full Cal.com iframe before calculating the visible wrapper height.
- Calculate desktop wrapper height as `(nativeHeight - 64) × scale`.
- Keep the iframe at its full scaled height, and apply `overflow: hidden` to the booking frame so only the bottom branding zone is clipped.
- Keep the iframe aligned to the top and centered between the rails.
- At 1200px and below, use the full reported height with no crop and no scale.

## Limitations

The Cal.com wordmark is inside a cross-origin iframe and cannot be targeted directly. The crop is intentionally limited to wide desktop screens, but it depends on Cal.com's current bottom branding placement. If Cal.com changes its layout or a later booking step places controls in that zone, the crop value may require adjustment.

## Verification

- Extend layout unit tests to cover reported inline height selection and the 64px desktop crop.
- Confirm tablet/mobile calculations retain the full iframe height.
- Run the complete test suite and production build.
- In the browser, verify the complete desktop calendar panel is visible, the bottom wordmark is clipped, both rail edges remain aligned, the FAQ starts immediately after the cropped frame, and no internal or page-level horizontal overflow appears.
- Confirm tablet/mobile remain unscaled and uncropped with clean console output.
