# Heiller missing sections: visual direction for Claude

## Your task

Redesign the seven low-fidelity placeholder sections that follow Results in `design/index.html`. Work one section at a time, preserve the existing Hero, Trust, Services, and Results sections, and keep the page's current design language. The placeholder markup establishes order and intent, not final composition.

## Non-negotiable visual language

- Match the existing 1311px content grid, Plus Jakarta Sans typography, thin `#CCCCCC` dividers, dark burgundy headings, grey body copy, and generous white space.
- Favor editorial layouts, precise alignment, and purposeful asymmetry over generic card grids.
- Avoid excessive rounded corners, floating cards, heavy shadows, glass effects, decorative gradients, stock healthcare photography, and generic blue SaaS styling.
- Do not repeat the Services grid treatment in every section. Let each section have its own composition while sharing the same spacing and typography system.
- Keep responsive behavior deliberate at desktop, tablet, and mobile widths.

## Truth and content safeguards

- Do not invent Heiller client results, testimonials, client names, integrations, specialties, pricing, timelines, security processes, contact details, or contractual terms.
- Keep any unconfirmed information visibly marked as a placeholder.
- The existing Results figures are industry standards, not Heiller client outcomes.
- Any client-proof design must work with one real, approved case study rather than fabricated social proof.

## 01. Free Revenue Audit

Purpose: turn the benchmark Results section into a clear next step.

Direction: create a calm four-stage journey with a strong left-aligned heading and one clear CTA. Show what the visitor provides, what Heiller reviews, what they receive, and how findings are discussed. It should feel concrete and low friction, not promotional.

Needs confirmation: required reports, privacy and upload process, KPIs reviewed, deliverable format, consultation length, and turnaround time.

## 02. Who Heiller Is For

Purpose: help the right visitor recognize themselves quickly.

Direction: distinguish independent practices, growing groups, and supported specialties through different operating problems, not decorative personas. Consider an editorial index, segmented statements, or a typographic matrix instead of three identical cards.

Needs confirmation: practice sizes, locations, specialties, payer mixes, and operational scenarios Heiller accepts.

## 03. How Onboarding Works

Purpose: reduce fear of disruption and unclear responsibility.

Direction: show discovery, transition planning, and ongoing management as one continuous handoff. Use a quiet process line, staged document motif, or progressive layout. Emphasize continuity, ownership, and visibility rather than claiming unrealistic speed.

Needs confirmation: exact steps, timeline, system access, data transfer, staff responsibilities, training, reporting cadence, and escalation path.

## 04. EHR and PM Compatibility

Purpose: answer whether a practice can keep its current tools.

Direction: use a restrained compatibility band or system map. Logos should feel secondary to the message and must only appear when support is confirmed. Include a graceful fallback for systems not listed.

Needs confirmation: supported EHRs, practice-management platforms, clearinghouses, integration methods, read-only access options, and migration requirements.

## 05. Client Success Story

Purpose: replace generic trust language with verified evidence.

Direction: design one substantial case story using challenge, action, and result. Pair one dominant verified metric with client context and a named quote. Avoid carousels and walls of logos. The composition should remain credible even before photography is available.

Needs confirmation: client approval, identity, baseline, measurement period, Heiller's exact contribution, verified outcome, quote, and permission to publish.

## 06. Frequently Asked Questions

Purpose: resolve the objections that prevent a qualified visitor from contacting Heiller.

Direction: use a restrained accordion or editorial question list. Prioritize fees, agreements, transition, systems, reporting, security, support, and expected timeline. Keep interaction accessible and avoid oversized pill controls.

Needs confirmation: every final answer and all policy details.

## 07. Final CTA and Footer

Purpose: give visitors a decisive next action after objections are answered.

Direction: create a strong but quiet closing statement with one revenue-audit CTA. The footer should feel compact and intentional, with brand, navigation, confirmed contact information, privacy, and legal links. Do not introduce a new visual style at the bottom of the page.

Needs confirmation: CTA destination, form fields, response expectations, contact details, social profiles, privacy page, terms, and company details.

## Recommended working sequence

1. Inspect the existing page in the browser and read the current CSS before editing.
2. Design and implement one placeholder section at a time.
3. Show the user each section in the live preview before proceeding to the next.
4. Keep unconfirmed facts marked clearly and maintain a list of questions for the user.
5. Test at desktop, tablet, and mobile widths after every section.
6. Run `npm run build` before handing the work back.
