# Why Typography and Serpentine Workflow Route Design

## Goal

Refine the imported V3 Why and workflow sections in V2 without changing their copy, section order, rail geometry, metric cards, or mobile stacking behavior.

## Typography

- Reduce the `Built to stay close to the work.` heading by exactly 2px throughout its responsive scale.
  - Desktop fluid range changes from `43px–84px` to `41px–82px`.
  - Mobile override changes from `48px` to `46px`.
- Reduce the adjacent Heiller statement by exactly 3px throughout its responsive scale.
  - Desktop fluid range changes from `25px–49px` to `22px–46px`.
  - Mobile override changes from `31px` to `28px`.
- Tighten the statement’s computed line height by exactly `0.5px`, expressed as `calc(1.02em - 0.5px)` so the adjustment remains proportional at every responsive size.

## Workflow Route

- Replace the straight center spine with one continuous, smooth serpentine SVG path.
- The route begins at the horizontal center above the first workflow row.
- It alternates gently left and right through the vertical centers of the six workflow rows using cubic Bézier curves. The amplitude is responsive and capped so the route remains within the central gap and never intersects stage text.
- The route returns to the horizontal center and ends at the top-center edge of the `Start with a revenue audit` button.
- A single chevron at the endpoint points into the button.
- The neutral dashed track uses the existing grey divider color and rounded dashes.
- A top SVG mask fades the first 64px of both the dashed track and animated route from transparent to opaque.
- The animated fill uses the exact metric-mesh palette in this order: pale blue, blue, lavender, gold, pale gold.
- Scroll progress continues to control `strokeDashoffset` from hidden to fully drawn. The fill must advance continuously without stepped transitions.
- Under reduced motion, the complete gradient route and endpoint arrow are visible without scroll animation.

## Responsive Behavior

- Desktop and tablet widths above `760px` show the serpentine route.
- At `760px` and below, the existing stacked mobile ledger remains unchanged and the SVG route stays hidden.
- The route is recomputed after resize and font loading using live row and button geometry.

## Testing and Verification

- Unit-test deterministic serpentine path generation, endpoint geometry, and scroll-progress clamping.
- Add static CSS assertions for the exact typography reductions, fade mask, gradient palette, and smooth stroke behavior.
- Run the full Node test suite and Vite production build.
- Verify the live section at desktop and mobile widths, confirm the route reaches the button, and confirm there are no console errors or horizontal overflow.

## Out of Scope

- Copy changes.
- Changes to the Results cards or Revenue Audit section.
- Showing the workflow route on phone layouts.
- New libraries or runtime dependencies.
