# Responsive Hero Process Flow Design

## Objective

Center the Patient → Optimize process diagram beneath the hero copy and make it responsive without changing its node labels, sequence, route animation, or surrounding page sections.

## Desktop Geometry

The hero flow wrapper will use the shared content-frame maximum width rather than a fixed 1400px width. The flow stage will remain centered between the global rails. The internal route canvas will use a fixed design coordinate system and be centered inside the available stage so the left and right endpoints have equal visual margins.

## Responsive Behavior

The route will preserve its stepped desktop composition and scale proportionally from its design dimensions. CSS custom properties will calculate a bounded scale from the available width, and the stage height will follow the scaled route height so it does not leave excessive blank space or overlap the following Trust section.

At mobile widths, the same complete diagram remains visible. Labels, ports, connecting paths, and animation stay together as one scaled unit rather than wrapping independently. The minimum scale must keep node text readable and avoid horizontal overflow.

## Accessibility and Motion

- Keep the existing visible text and route animation semantics.
- Preserve the existing reduced-motion behavior.
- Do not duplicate or hide meaningful node text.
- Avoid introducing horizontal page scrolling.

## Verification

- Measure equal left and right margins at desktop widths.
- Verify the complete Patient → Optimize route at 393px, 768px, 1280px, and 1440px.
- Confirm the diagram does not overlap adjacent sections.
- Confirm a clean console, passing tests, and a successful production build.
