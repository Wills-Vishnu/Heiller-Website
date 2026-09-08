# Cal.com Embed Rail-Fill Design

## Goal

Enlarge the visible Cal.com booking panel on wide desktop screens so its own rectangular border touches the site's left and right content rails.

## Root Cause

The V2 booking frame already spans the 1311px content rails. Cal.com renders its booking panel inside a cross-origin iframe with an internal width of approximately 1040px, leaving centered white space on both sides. V2 cannot directly override that cross-origin internal max-width.

## Approved Approach

- Above 1200px, render the iframe at the native panel width and uniformly scale the complete Cal.com embed up to the available rail width.
- Derive the scale from `rail width / 1040`, capped at `1.26` so the desktop design remains controlled.
- Center the scaled iframe horizontally within the booking frame.
- Increase the booking frame's layout height by the same scale so the enlarged embed never overlaps the following FAQ.
- Keep the visible calendar border and outer embed corners square.
- At 1200px and below, reset width, transform, and height compensation to the current unscaled responsive embed.

## Runtime Behaviour

A small booking-layout module will measure the live `.booking-calendar__frame` width and its Cal.com iframe height after the embed loads. It will write CSS custom properties for scale and compensated height, then repeat the measurement on window resize and Cal.com embed resize events. Until an iframe is available, the current layout remains unchanged.

The module does not access or modify cross-origin iframe content.

## Verification

- Add unit tests for the desktop scale calculation, including its 1.26 cap and the unscaled 1200px-and-below path.
- Add a source contract for the scaling CSS and height compensation.
- Run the complete test suite and production build.
- In the browser, verify the visible calendar rectangle aligns with both rails on wide desktop, the FAQ begins below it without overlap, and tablet/mobile retain the existing layout.
- Confirm there is no horizontal page overflow and no console warning or error.
