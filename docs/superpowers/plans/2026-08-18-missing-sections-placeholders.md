# Missing Sections Placeholders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add seven visible low-fidelity section scaffolds after Results and create a standalone visual-direction brief for Claude.

**Architecture:** Extend the standalone `design/index.html` page with one reusable placeholder design system and semantic markup for each missing conversion section. Keep the scaffolds intentionally neutral and static, then document the intended final direction separately so another designer can replace each section without guessing its purpose or inventing business facts.

**Tech Stack:** Standalone HTML/CSS, Vite 6, Markdown.

## Global Constraints

- Add the sections after Results in this order: Free Revenue Audit, Who Heiller Is For, How Onboarding Works, EHR and PM Compatibility, Client Success Story, Frequently Asked Questions, Final CTA and Footer.
- Preserve the existing Hero, Trust, Services, and Results markup and styles.
- Reuse the existing `1311px` content width, eyebrow treatment, heading scale, border color, typography, and spacing rhythm.
- Add no JavaScript, animation, dependency, image, font, or unverified business claim.
- Do not name supported integrations, clients, prices, contact details, contractual terms, or performance outcomes.
- Keep placeholders visibly unfinished, accessible, and responsive.
- This workspace is not a Git repository, so commit steps are documented but skipped locally.

---

### Task 1: Add the reusable placeholder system and seven section scaffolds

**Files:**
- Modify: `design/index.html:607-609`
- Modify: `design/index.html:884`
- Test: `design/index.html`

**Interfaces:**
- Consumes: existing `.eyebrow`, Plus Jakarta Sans typography, `#2A0F14`, `#6B7280`, `#CCCCCC`, and the `1311px` Results width.
- Produces: `.future-section`, `.future-grid`, `.future-block`, `.future-proof`, `.future-faq`, `.future-cta`, and `.future-footer` scaffolds.

- [ ] **Step 1: Record the missing-section baseline**

Run:

```powershell
$content = Get-Content -Raw design\index.html
[pscustomobject]@{
  FutureSections = ([regex]::Matches($content, '<section class="future-section')).Count
  FutureFooter = ([regex]::Matches($content, '<footer class="future-footer')).Count
  ResultsSections = ([regex]::Matches($content, '<section class="results"')).Count
} | Format-List
```

Expected before implementation: `FutureSections` is `0`, `FutureFooter` is `0`, and `ResultsSections` is `1`.

- [ ] **Step 2: Add the shared placeholder CSS before `</style>`**

Add:

```css
  /* Future conversion sections: visible low-fidelity scaffolds for design handoff. */
  .future-section {
    padding: 128px 40px;
    border-top: 1px solid #CCCCCC;
    background: #FFFFFF;
  }
  .future-section__inner {
    width: 100%;
    max-width: 1311px;
    margin: 0 auto;
  }
  .future-section__header {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(280px, 0.55fr);
    gap: 80px;
    align-items: end;
    margin-bottom: 64px;
  }
  .future-section .eyebrow {
    margin-bottom: 30px;
  }
  .future-section h2,
  .future-cta h2 {
    max-width: 760px;
    margin: 0;
    color: #2A0F14;
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    font-size: 46px;
    font-weight: 500;
    letter-spacing: -2px;
    line-height: 48px;
  }
  .future-section__intro {
    max-width: 440px;
    margin: 0;
    color: #6B7280;
    font-size: 16px;
    line-height: 1.6;
  }
  .future-label {
    display: inline-block;
    margin-bottom: 20px;
    color: #7A8280;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 1.6px;
    line-height: 1;
    text-transform: uppercase;
  }
  .future-grid {
    display: grid;
    border-top: 1px solid #CCCCCC;
    border-left: 1px solid #CCCCCC;
  }
  .future-grid--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .future-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .future-grid--5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .future-block {
    min-height: 220px;
    padding: 32px;
    border-right: 1px solid #CCCCCC;
    border-bottom: 1px solid #CCCCCC;
    background: #F7F8F7;
  }
  .future-block__number {
    display: block;
    margin-bottom: 54px;
    color: #9AA09E;
    font-size: 12px;
    letter-spacing: 1px;
  }
  .future-block h3 {
    margin: 0;
    color: #303433;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.4px;
    line-height: 1.25;
  }
  .future-block p {
    margin: 14px 0 0;
    color: #7A8280;
    font-size: 14px;
    line-height: 1.5;
  }
  .future-action {
    display: inline-flex;
    align-items: center;
    min-height: 48px;
    margin-top: 32px;
    padding: 0 22px;
    border: 1px solid #9AA09E;
    color: #616866;
    font-size: 14px;
  }
  .future-proof {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    min-height: 420px;
    border: 1px solid #CCCCCC;
  }
  .future-proof > div {
    padding: 40px;
  }
  .future-proof > div + div {
    border-left: 1px solid #CCCCCC;
  }
  .future-proof__metric {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #F7F8F7;
  }
  .future-proof__metric strong {
    color: #A0A5A3;
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    font-size: clamp(72px, 8vw, 118px);
    font-weight: 500;
    letter-spacing: -6px;
    line-height: 0.9;
  }
  .future-proof__story {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    background: #CCCCCC;
  }
  .future-proof__story div {
    padding: 28px;
    background: #FFFFFF;
  }
  .future-faq {
    border-top: 1px solid #CCCCCC;
  }
  .future-faq__row {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    gap: 24px;
    align-items: center;
    min-height: 88px;
    border-bottom: 1px solid #CCCCCC;
    color: #303433;
  }
  .future-faq__row span:first-child,
  .future-faq__row span:last-child {
    color: #9AA09E;
  }
  .future-cta {
    padding: 128px 40px 96px;
    border-top: 1px solid #CCCCCC;
    background: #F7F8F7;
  }
  .future-cta__inner,
  .future-footer__inner {
    width: 100%;
    max-width: 1311px;
    margin: 0 auto;
  }
  .future-cta__inner {
    display: flex;
    justify-content: space-between;
    gap: 64px;
    align-items: end;
  }
  .future-footer {
    padding: 40px;
    border-top: 1px solid #CCCCCC;
    background: #F7F8F7;
  }
  .future-footer__inner {
    display: grid;
    grid-template-columns: 1fr repeat(3, minmax(140px, 0.3fr));
    gap: 40px;
    color: #7A8280;
    font-size: 13px;
  }
  @media (max-width: 960px) {
    .future-section__header,
    .future-proof,
    .future-cta__inner {
      grid-template-columns: 1fr;
      gap: 32px;
    }
    .future-grid--4,
    .future-grid--5 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .future-grid--3,
    .future-proof__story {
      grid-template-columns: 1fr;
    }
    .future-proof > div + div {
      border-left: 0;
      border-top: 1px solid #CCCCCC;
    }
    .future-cta__inner {
      display: grid;
      align-items: start;
    }
    .future-footer__inner {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 640px) {
    .future-section,
    .future-cta,
    .future-footer {
      padding-inline: 24px;
    }
    .future-section {
      padding-block: 96px;
    }
    .future-grid--4,
    .future-grid--3,
    .future-grid--5,
    .future-footer__inner {
      grid-template-columns: 1fr;
    }
    .future-section h2,
    .future-cta h2 {
      font-size: 38px;
      line-height: 41px;
    }
    .future-faq__row {
      grid-template-columns: 28px 1fr auto;
      gap: 12px;
    }
  }
```

- [ ] **Step 3: Add the seven semantic scaffolds directly after Results**

Insert the following markup after the closing `</section>` for `.results` and before the closing `.page` div:

```html
    <!-- Future section 01: Free Revenue Audit -->
    <section class="future-section" aria-labelledby="audit-placeholder-title">
      <div class="future-section__inner">
        <div class="future-section__header">
          <div>
            <div class="eyebrow"><i></i><span>Free revenue audit</span></div>
            <h2 id="audit-placeholder-title">See where revenue is getting stuck</h2>
          </div>
          <p class="future-section__intro">Low-fidelity placeholder for the primary conversion offer. Replace with confirmed audit scope, required inputs, timeline, and deliverables.</p>
        </div>
        <div class="future-grid future-grid--4">
          <article class="future-block"><span class="future-block__number">01</span><h3>Share existing reports</h3><p>Input and privacy details require confirmation.</p></article>
          <article class="future-block"><span class="future-block__number">02</span><h3>Review core KPIs</h3><p>Define the metrics included in the audit.</p></article>
          <article class="future-block"><span class="future-block__number">03</span><h3>Receive priorities</h3><p>Define the format and depth of the findings.</p></article>
          <article class="future-block"><span class="future-block__number">04</span><h3>Discuss the findings</h3><p>Confirm the consultation format and duration.</p><span class="future-action">CTA placeholder</span></article>
        </div>
      </div>
    </section>

    <!-- Future section 02: Who Heiller Is For -->
    <section class="future-section" aria-labelledby="audience-placeholder-title">
      <div class="future-section__inner">
        <div class="future-section__header"><div><div class="eyebrow"><i></i><span>Who we help</span></div><h2 id="audience-placeholder-title">Built around the way your practice operates</h2></div><p class="future-section__intro">Audience-positioning placeholder. Replace with validated practice sizes, specialties, and operational pain points.</p></div>
        <div class="future-grid future-grid--3">
          <article class="future-block"><span class="future-label">Audience placeholder</span><h3>Independent practices</h3><p>Insert an approved, specific fit statement.</p></article>
          <article class="future-block"><span class="future-label">Audience placeholder</span><h3>Growing provider groups</h3><p>Insert an approved scaling or complexity statement.</p></article>
          <article class="future-block"><span class="future-label">Audience placeholder</span><h3>Specialty practices</h3><p>Insert only specialties Heiller can genuinely support.</p></article>
        </div>
      </div>
    </section>

    <!-- Future section 03: How Onboarding Works -->
    <section class="future-section" aria-labelledby="onboarding-placeholder-title">
      <div class="future-section__inner">
        <div class="future-section__header"><div><div class="eyebrow"><i></i><span>Getting started</span></div><h2 id="onboarding-placeholder-title">A clear transition, without losing momentum</h2></div><p class="future-section__intro">Process placeholder. Replace with the real onboarding sequence, responsibilities, timing, and support model.</p></div>
        <div class="future-grid future-grid--3">
          <article class="future-block"><span class="future-block__number">01</span><h3>Discovery</h3><p>Confirm goals, systems, team, and current workflow.</p></article>
          <article class="future-block"><span class="future-block__number">02</span><h3>Transition plan</h3><p>Define milestones, ownership, access, and safeguards.</p></article>
          <article class="future-block"><span class="future-block__number">03</span><h3>Ongoing management</h3><p>Define reporting, reviews, escalation, and support.</p></article>
        </div>
      </div>
    </section>

    <!-- Future section 04: EHR and PM Compatibility -->
    <section class="future-section" aria-labelledby="systems-placeholder-title">
      <div class="future-section__inner">
        <div class="future-section__header"><div><div class="eyebrow"><i></i><span>Your systems</span></div><h2 id="systems-placeholder-title">Designed to work with your existing workflow</h2></div><p class="future-section__intro">Compatibility placeholder. Add platform names or logos only after integration support is confirmed.</p></div>
        <div class="future-grid future-grid--5" aria-label="Unconfirmed integration placeholders">
          <div class="future-block"><span class="future-label">Logo placeholder</span><h3>EHR or PM</h3></div>
          <div class="future-block"><span class="future-label">Logo placeholder</span><h3>EHR or PM</h3></div>
          <div class="future-block"><span class="future-label">Logo placeholder</span><h3>EHR or PM</h3></div>
          <div class="future-block"><span class="future-label">Logo placeholder</span><h3>EHR or PM</h3></div>
          <div class="future-block"><span class="future-label">Logo placeholder</span><h3>EHR or PM</h3></div>
        </div>
      </div>
    </section>

    <!-- Future section 05: Client Success Story -->
    <section class="future-section" aria-labelledby="proof-placeholder-title">
      <div class="future-section__inner">
        <div class="future-section__header"><div><div class="eyebrow"><i></i><span>Client proof</span></div><h2 id="proof-placeholder-title">Show the work behind a verified result</h2></div><p class="future-section__intro">Evidence placeholder. Publish only with approved client identity, baseline, methodology, result, and quote.</p></div>
        <div class="future-proof">
          <div class="future-proof__metric"><span class="future-label">Verified metric required</span><strong>00%</strong><p class="future-section__intro">Metric definition and measurement period.</p></div>
          <div class="future-proof__story"><div><span class="future-label">Challenge</span><p>Approved client context.</p></div><div><span class="future-label">Action</span><p>Work Heiller completed.</p></div><div><span class="future-label">Result</span><p>Verified outcome and attribution.</p></div></div>
        </div>
      </div>
    </section>

    <!-- Future section 06: Frequently Asked Questions -->
    <section class="future-section" aria-labelledby="faq-placeholder-title">
      <div class="future-section__inner">
        <div class="future-section__header"><div><div class="eyebrow"><i></i><span>Questions</span></div><h2 id="faq-placeholder-title">What practices usually want to know</h2></div><p class="future-section__intro">Static FAQ scaffold. Replace with approved answers, then add interaction only if the final design requires it.</p></div>
        <div class="future-faq">
          <div class="future-faq__row"><span>01</span><span>How are fees structured?</span><span>+</span></div>
          <div class="future-faq__row"><span>02</span><span>What does the transition involve?</span><span>+</span></div>
          <div class="future-faq__row"><span>03</span><span>Which systems can Heiller support?</span><span>+</span></div>
          <div class="future-faq__row"><span>04</span><span>How will reporting and communication work?</span><span>+</span></div>
          <div class="future-faq__row"><span>05</span><span>How are security and access handled?</span><span>+</span></div>
        </div>
      </div>
    </section>

    <!-- Future section 07: Final CTA -->
    <section class="future-cta" aria-labelledby="final-cta-placeholder-title">
      <div class="future-cta__inner"><div><span class="future-label">Final conversion placeholder</span><h2 id="final-cta-placeholder-title">Find the next opportunity in your revenue cycle</h2></div><span class="future-action">Revenue audit CTA placeholder</span></div>
    </section>

    <!-- Future footer scaffold -->
    <footer class="future-footer">
      <div class="future-footer__inner"><div><strong>Heiller</strong><p>Brand and contact block placeholder.</p></div><div><span class="future-label">Navigation</span><p>Link placeholders</p></div><div><span class="future-label">Contact</span><p>Confirmed details required</p></div><div><span class="future-label">Legal</span><p>Privacy and legal links required</p></div></div>
    </footer>
```

- [ ] **Step 4: Run the structural source check**

Run:

```powershell
$content = Get-Content -Raw design\index.html
[pscustomobject]@{
  FutureSections = ([regex]::Matches($content, '<section class="future-section')).Count
  FinalCta = ([regex]::Matches($content, '<section class="future-cta"')).Count
  FutureFooter = ([regex]::Matches($content, '<footer class="future-footer')).Count
  ExistingCoreSections = ([regex]::Matches($content, '<section class="(hero|trust|services|results)')).Count
  NamedPlatforms = ([regex]::Matches($content, 'Epic|Cerner|athenahealth|eClinicalWorks|NextGen')).Count
} | Format-List
```

Expected: `FutureSections` is `6`, `FinalCta` is `1`, `FutureFooter` is `1`, `ExistingCoreSections` is `4`, and `NamedPlatforms` is `0`.

- [ ] **Step 5: Build the project**

Run: `npm run build`

Expected: TypeScript validation and the Vite production build complete with exit code `0`.

- [ ] **Step 6: Commit when Git is available**

```bash
git add design/index.html
git commit -m "feat: scaffold missing conversion sections"
```

Expected locally: skip because `D:\Design\Heiller` has no `.git` repository.

---

### Task 2: Create the Claude visual-direction handoff

**Files:**
- Create: `docs/handoffs/claude-missing-sections-visual-brief.md`
- Test: `docs/handoffs/claude-missing-sections-visual-brief.md`

**Interfaces:**
- Consumes: the seven semantic placeholders from Task 1 and the approved design spec.
- Produces: one self-contained brief the user can paste into Claude or reference from the workspace.

- [ ] **Step 1: Create the handoff brief**

Write the brief with these exact sections:

```markdown
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
```

- [ ] **Step 2: Scan the brief for invented facts and placeholders**

Run:

```powershell
$brief = Get-Content -Raw docs\handoffs\claude-missing-sections-visual-brief.md
[pscustomobject]@{
  SectionDirections = ([regex]::Matches($brief, '^## 0[1-7]\.', 'Multiline')).Count
  Safeguards = ([regex]::Matches($brief, 'Do not invent|must only appear when support is confirmed|Needs confirmation')).Count
  Todos = ([regex]::Matches($brief, 'TBD|TODO|implement later')).Count
} | Format-List
```

Expected: `SectionDirections` is `7`, `Safeguards` is at least `8`, and `Todos` is `0`.

- [ ] **Step 3: Commit when Git is available**

```bash
git add docs/handoffs/claude-missing-sections-visual-brief.md
git commit -m "docs: add Claude visual handoff for missing sections"
```

Expected locally: skip because `D:\Design\Heiller` has no `.git` repository.

---

### Task 3: Verify the scaffolds in the live preview

**Files:**
- Test: `http://127.0.0.1:5173/design/`

**Interfaces:**
- Consumes: Task 1's scaffolds and Task 2's visual brief.
- Produces: verified desktop and mobile structure, clean runtime, and a user-visible handoff.

- [ ] **Step 1: Reload the existing preview**

Expected: the existing page loads and all seven placeholder sections appear after Results in the approved order.

- [ ] **Step 2: Inspect desktop alignment**

Expected: each placeholder aligns with the Results content width, divider strokes remain consistent, no placeholder looks like verified final content, and the page has no horizontal overflow.

- [ ] **Step 3: Inspect a mobile viewport at 390 by 844 pixels**

Expected: all multi-column scaffolds stack into one readable column, headings remain legible, no labels clip, and there is no horizontal overflow.

- [ ] **Step 4: Inspect browser health**

Expected: the console contains no new errors or warnings.

- [ ] **Step 5: Leave the updated preview available and hand off the brief**

Expected: the current `/design/` tab remains visible for review and the user receives a clickable link to the Claude brief.
