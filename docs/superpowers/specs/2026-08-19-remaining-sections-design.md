# Remaining Heiller Sections

## Objective

Replace the unfinished homepage placeholders with five finished conversion sections and a real footer while preserving Heiller's existing visual language. Remove the Client Proof placeholder entirely until verified client material is available.

## Reference direction

The design uses Mobbin references for structure rather than visual duplication:

- Headspace: direct audience segmentation with clear buyer categories.
- Ramp: compact, ordered onboarding steps.
- Lattice: a central systems message surrounded by connected categories.
- Sketch: editorial heading paired with compact FAQ rows.
- Notion: one conversion action flowing directly into a restrained footer.

## Global design rules

- Use the existing 1311px content width, Plus Jakarta Sans typography, thin `#CCCCCC` rules, white canvas, and rounded gradient eyebrow tiles.
- Reuse the current heading scale and dark burgundy `#2A0F14`.
- Avoid generic floating cards, heavy shadows, large corner radii, stock imagery, and decorative icons without meaning.
- Do not add WebGL contexts. Any new motion must use CSS, remain subtle, and stop under `prefers-reduced-motion: reduce`.
- Do not invent client names, performance metrics, vendor logos, implementation timelines, pricing, contact details, certifications, or contractual promises.
- Keep section height purposeful and reduce mobile scrolling where readability allows.

## Section 1: Who we help

**Eyebrow:** Who we help

**Heading:** Revenue cycle support that fits the way you practice

**Introduction:** Different practices need different levels of support. Heiller can own a focused part of the revenue cycle or work across the full operation with your team.

Present three vertical audience columns separated by thin rules. Each column includes a large ordinal and concise copy.

### 01 — Independent practices

Add accountable revenue cycle support without building a larger back office.

### 02 — Specialty groups

Bring clearer ownership to coding, billing, denials, and follow-up across a complex payer mix.

### 03 — Growing medical groups

Create consistent handoffs and reporting as providers, locations, and claim volume grow.

On desktop, use a three-column strip. On mobile, stack the entries with tighter vertical padding and keep the number, heading, and copy within one row-like composition.

## Section 2: Getting started

**Eyebrow:** Getting started

**Heading:** A clear start, without slowing your team down

**Introduction:** We begin with the way your practice works today, define ownership together, and introduce change in a controlled sequence.

Use a four-step horizontal timeline. The active line carries a restrained coral-to-blue gradient. Large step numbers alternate above and below the line on desktop; mobile uses a compact two-by-two layout without the connecting animation.

### 01 — Understand the workflow

Review the systems, reports, responsibilities, and handoffs already in place.

### 02 — Define ownership

Agree on scope, communication, escalation, and who owns each step.

### 03 — Begin the work

Start the agreed functions with clear roles for Heiller and your internal team.

### 04 — Improve from performance

Use reporting and recurring issue patterns to focus the next improvements.

## Section 3: Your systems

**Eyebrow:** Your systems

**Heading:** Built around the systems your team already uses

**Introduction:** Heiller works within the operating environment of your practice. We first understand how information moves today, then define the connections and handoffs required for the agreed scope.

Use an asymmetric two-column section. The left side contains the heading and copy. The right side is a connected constellation with a central `Heiller` node and five system categories:

- EHR and practice management
- Clearinghouses
- Payer portals
- Payment systems
- Reporting

The constellation uses thin dashed connectors and small gradient ports that pulse slowly from the outer systems toward Heiller. It must not display unverified vendor logos or imply a named technical integration. Under reduced motion, show the completed static network. On mobile, retain all categories in a compact two-column network below the copy.

## Removed section: Client proof

Remove the Client Proof section from the page. Do not replace it with a blank area, generic testimonial, or unverified metric. A verified case study can be designed separately later.

## Section 4: Frequently asked questions

**Eyebrow:** Questions

**Heading:** What practices usually want to know

Place the heading in a fixed left column and five native `<details>` rows in the right column. Only one answer needs to be open initially. Use restrained plus/minus controls, thin rules, and no boxed accordion cards.

### Can we use Heiller for one part of the revenue cycle?

Yes. You can bring us in for one function or ask us to manage the full cycle. The scope is agreed before work begins, so ownership stays clear.

### Will we need to replace our existing systems?

Not by default. We begin by understanding how your team works today and identify where Heiller should fit. Any system change would be discussed before it becomes part of the plan.

### How does Heiller work with our internal team?

We define who owns each step, how handoffs happen, and how issues are escalated. Your team keeps clear points of contact while Heiller owns the work included in the agreed scope.

### What will we see in reporting?

Reporting is organized around work completed, open issues, denials, aging, and collection activity. The exact view depends on the scope and the data available from your systems.

### How do we get started?

Begin with a free revenue audit. We review your current workflow and reporting with you, identify where attention is needed, and agree on the most useful next step.

## Section 5: Final conversion and footer

Combine the final call to action and footer into one continuous composition.

**Heading:** Find where revenue is getting stuck

**Supporting copy:** Start with a focused review of your current workflow and reporting. Get a clearer view of where attention is needed and what to discuss next.

**Primary action:** Get a free revenue audit

Use a broad, low-height CSS gradient field derived from the hero palette, with the heading left aligned and the CTA on the right. Do not create another WebGL shader. The gradient flows into a dark footer rather than appearing as a separate rounded card.

The footer contains:

- Heiller name and the line `Revenue cycle management for medical practices.`
- Anchor links to Services, Results, Revenue audit, Who we help, Getting started, and Questions.
- `© 2026 Heiller.`

Do not add privacy, legal, social, email, address, or phone links until real destinations and details are available.

## Interaction and accessibility

- Add stable section IDs for all footer anchor links.
- Use native `<details>` and `<summary>` for keyboard and screen-reader accessible FAQs.
- Preserve visible focus indicators for every link and accordion control.
- Decorative connector SVGs and gradient tiles use `aria-hidden="true"`.
- Heading order remains logical, with one page `h1` and section `h2` elements.

## Responsive behavior

- Desktop: audience 3 columns, onboarding 4 columns, systems split 45/55, FAQ split 38/62, CTA split into text and action.
- Tablet: preserve audience and onboarding columns with reduced type and gaps where readable.
- Mobile: audience stacks, onboarding becomes 2x2, systems network moves below copy, FAQ becomes one column, CTA and footer stack.
- Verify at 320px, 390px, 768px, 1024px, and the default desktop viewport.

## Verification

- Confirm the Client Proof section is absent.
- Confirm no placeholder labels or provisional copy remain in the five sections or footer.
- Confirm every footer link reaches a real section.
- Confirm FAQ rows work with mouse and keyboard.
- Confirm reduced-motion mode disables the systems pulse.
- Confirm no horizontal overflow at all target widths.
- Run source-level regression tests and the Vite production build.
