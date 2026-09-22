# Liquid Glass Button Demo Design

## Objective

Create a standalone HTML demonstration of the liquid-glass capsule button shown in the supplied reference. The demo must remain separate from the existing V2 landing page and must not introduce a new site, navigation, or supporting sections.

## Page Composition

The page contains only:

- A full-viewport photographic or abstract image used as the refracted backdrop.
- One centered capsule button labelled “Elegant”.
- The hidden SVG filter primitives required to create the optical treatment.

The demo will be saved as `liquid-glass-button.html` beside the existing V2 entry page so Vite can serve it directly without changing `index.html`.

## Visual Treatment

The button uses a translucent capsule surface with:

- Background blur and saturation.
- SVG displacement/refraction so the image beneath bends through the capsule.
- A soft inner highlight, bright directional rim, and restrained shadow.
- White, high-contrast button text.

The background will be self-contained and require no external image request. It will resemble the green, cream, and cyan flowing image in the reference closely enough to make the glass distortion legible.

## Interaction Physics

Pointer movement near or over the button updates a spring-driven state rather than applying cursor values directly. The button will:

- Lag subtly behind the pointer direction.
- Stretch slightly along the movement vector and compress across it.
- Tilt and translate by a small amount.
- Move its specular highlight toward the pointer.
- Compress on pointer down, rebound on release, and settle with a small overshoot.

The animation loop uses requestAnimationFrame with damped spring interpolation. Transform and filter updates remain bounded to avoid layout movement and motion sickness.

## Accessibility and Fallbacks

- Use a native `button` element with visible focus treatment.
- Support keyboard activation and the browser’s native button semantics.
- Under `prefers-reduced-motion: reduce`, disable spring deformation and retain a static glass appearance.
- On browsers without backdrop filtering, retain a translucent surface, border, and shadow.
- Keep the page responsive from narrow mobile screens through desktop displays.

## Verification

- Open the standalone page through the existing Vite development server.
- Confirm pointer tracking, press/release behavior, keyboard focus, and reduced-motion handling.
- Check common mobile and desktop viewport widths.
- Confirm the existing V2 `index.html` is unchanged.
