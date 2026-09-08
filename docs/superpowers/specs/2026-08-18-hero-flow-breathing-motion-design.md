# Hero flow breathing motion design

## Goal

Replace the current abrupt workflow-box activation with a calm breathing motion that fits Heiller's restrained visual language. Each box should wake as the route reaches it, bloom gently into its original color, remain legible for a short moment, then settle back to neutral without a jump or bounce.

## Scope

- Change only the visual-state animation of the eight hero workflow name boxes.
- Preserve the labels, positions, route geometry, arrow animation, node colors, and 7.7-second sequence.
- Do not add JavaScript, dependencies, assets, or layout changes.

## Motion treatment

- Neutral boxes rest at `scale(0.94)` with the existing grey fill and dark text.
- Arrival eases to `scale(1)` over approximately 500 milliseconds.
- Original color, text color, and a restrained matching halo fade in throughout the same arrival window.
- The box holds briefly while the outgoing route begins travelling.
- It eases back to the neutral state over approximately 650 milliseconds.
- The next box begins breathing in as its arrow arrives, creating a continuous handoff.
- Use smooth custom cubic-bezier easing with no overshoot, spring, bounce, or sudden keyframe change.
- Keep the glow broad and low-opacity so it reads as a soft bloom rather than a shadow.

## Sequence behavior

- Patient begins the sequence with the same breathing treatment used by intermediate boxes.
- Verify through Report activate as their incoming arrows arrive.
- Optimize uses the same motion, with its existing purple fill and white active text, then settles before the loop restarts.
- The previous box may overlap the next box's fade-in slightly, but two boxes must not remain fully emphasized simultaneously.

## Accessibility and performance

- Keep `transform-origin: center` so boxes breathe without shifting the route layout.
- Animate transform, background color, text color, and box shadow only.
- Preserve the existing reduced-motion behavior: neutral grey boxes with no animated routes, scale changes, or glow.
- The motion must not create horizontal overflow or obscure route arrows.

## Verification

- No box scales below `0.94` or above `1`.
- Activation and deactivation are visibly gradual, with no jump at the start or end.
- Each box uses its original active color and the travelling route timing remains synchronized.
- Optimize remains readable with white active text.
- A complete loop preserves the Patient-to-Optimize order.
- The Vite production build succeeds and the browser console remains clean.
- The live preview at `http://127.0.0.1:5173/design/` shows a continuous, calm breathing sequence.
