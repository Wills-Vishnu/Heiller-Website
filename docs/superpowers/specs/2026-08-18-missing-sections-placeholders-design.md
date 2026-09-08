# Missing sections placeholder design

## Goal

Add visible, low-fidelity scaffolds for the seven conversion sections missing after Results. The scaffolds should make the intended page rhythm and hierarchy clear to the next designer without locking them into finished visual decisions.

## Section order

1. Free Revenue Audit
2. Who Heiller Is For
3. How Onboarding Works
4. EHR and PM Compatibility
5. Client Success Story
6. Frequently Asked Questions
7. Final CTA and Footer

## Shared visual language

- Use the existing page content width, eyebrow treatment, heading scale, typography, border color, and spacing rhythm.
- Keep the page predominantly white with quiet neutral placeholder surfaces.
- Avoid gradients, shadows, decorative stock imagery, oversized pills, and generic rounded-card grids.
- Use square or minimally rounded blocks consistent with the existing Services and Results sections.
- Separate sections with the same thin neutral divider used elsewhere on the page.
- Label unfinished visual regions clearly as placeholders so they cannot be mistaken for final content.
- Keep every section responsive, with desktop rows collapsing into a single readable column on small screens.

## Placeholder compositions

### Free Revenue Audit

Use a left-aligned heading and short explanation followed by four horizontal steps: share reports, review KPIs, receive priorities, and discuss findings. Include one clearly marked CTA placeholder.

### Who Heiller Is For

Use a heading plus three audience blocks for independent practices, growing multi-provider groups, and specialty practices. Leave room for specialty-specific language rather than generic healthcare imagery.

### How Onboarding Works

Use a calm three-step sequence: discovery, transition plan, and ongoing management. The visual should communicate continuity and low disruption rather than speed alone.

### EHR and PM Compatibility

Use a restrained compatibility band with neutral logo placeholders and a short statement about working with existing systems. Do not display or imply support for a named platform until confirmed.

### Client Success Story

Use one featured proof composition rather than a testimonial carousel. Reserve areas for a verified metric, challenge, action, result, client identity, and quote. Mark all evidence fields as requiring approved client data.

### Frequently Asked Questions

Use a simple stacked accordion placeholder. Suggested topics are fees, contracts, transition, systems, reporting, security, support, and expected timeline. The placeholder is static and adds no interaction yet.

### Final CTA and Footer

Use a decisive closing heading, a revenue-audit CTA placeholder, and a compact footer scaffold for navigation, contact information, privacy, and legal links. Do not invent contact or legal details.

## Handoff document

Create a separate Markdown brief for Claude containing the purpose, conversion role, suggested composition, visual guardrails, content requirements, and facts that must be confirmed for each section.

## Accessibility and performance

- Preserve semantic section headings in order.
- Placeholder labels must remain readable and must not rely on color alone.
- Add no JavaScript, third-party dependency, image, font, or animation.
- Placeholder markup must not introduce horizontal overflow.

## Verification

- All seven sections appear after Results in the approved order.
- Existing Hero, Trust, Services, and Results sections remain unchanged.
- Desktop sections align to the existing content grid.
- Mobile layout stacks without clipping or horizontal scrolling.
- The production build succeeds and the browser console remains clean.
- The Claude handoff brief is complete and contains no invented claims, client outcomes, integrations, contact details, or pricing.
