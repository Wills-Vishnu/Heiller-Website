# Remaining Heiller Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the remaining homepage placeholders with finished Who We Help, Getting Started, Systems, FAQ, conversion, and footer sections, while removing Client Proof.

**Architecture:** Keep the single-file page architecture and replace only the existing future-section CSS and markup. Use semantic HTML, CSS Grid, native details/summary accordions, one decorative SVG network, and CSS-only motion so the redesign adds no dependencies or WebGL contexts.

**Tech Stack:** HTML, CSS, SVG, Node.js built-in test runner, Vite

## Global Constraints

- Use the exact approved headings and copy from `docs/superpowers/specs/2026-08-19-remaining-sections-design.md`.
- Do not include a Client Proof section.
- Do not invent client names, metrics, vendor logos, timelines, pricing, contact details, certifications, or legal destinations.
- Reuse the existing 1311px width, Plus Jakarta Sans, `#2A0F14`, `#CCCCCC` rules, and gradient eyebrow tiles.
- Do not add WebGL contexts, image assets, libraries, or framework dependencies.
- New motion must stop under `prefers-reduced-motion: reduce`.
- Preserve all earlier Hero, Trust, Services, Results, and Revenue Audit work.

---

### Task 1: Lock the content and semantic structure with regression tests

**Files:**
- Create: `tests/remaining-sections.test.mjs`
- Modify: `index.html:1930-2025`

**Interfaces:**
- Consumes: Existing `.page` document and the section IDs used by navigation.
- Produces: Stable IDs `who-we-help`, `getting-started`, `systems`, `questions`, and `contact`; five native FAQ disclosures; valid footer anchors.

- [ ] **Step 1: Write the failing source-level regression tests**

Create `tests/remaining-sections.test.mjs`:

```js
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")

test("finished sections replace every future placeholder", () => {
  for (const id of ["who-we-help", "getting-started", "systems", "questions", "contact"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`))
  }
  assert.doesNotMatch(html, /Client proof|Client Success Story|future-section|future-grid|future-proof/)
})

test("FAQ uses five native accessible disclosures", () => {
  assert.equal((html.match(/<details class="faq__item"/g) ?? []).length, 5)
  assert.equal((html.match(/<summary>/g) ?? []).length, 5)
})

test("systems language uses categories without vendor claims", () => {
  for (const label of [
    "EHR and practice management",
    "Clearinghouses",
    "Payer portals",
    "Payment systems",
    "Reporting",
  ]) assert.match(html, new RegExp(label))
  assert.doesNotMatch(html, /Epic|Athena|eClinicalWorks|Oracle|Salesforce|Stripe/i)
})

test("footer anchors only target real page sections", () => {
  const targets = [...html.matchAll(/class="site-footer__link" href="#([^"]+)"/g)].map(match => match[1])
  assert.deepEqual(targets, ["services", "results", "revenue-audit", "who-we-help", "getting-started", "questions"])
})
```

- [ ] **Step 2: Run the tests and verify the placeholders fail the contract**

Run:

```powershell
npm test
```

Expected: existing eyebrow tests pass and all new remaining-section tests fail.

- [ ] **Step 3: Replace placeholder markup with semantic finished sections**

Replace the placeholder block after `#revenue-audit` with this structure and the exact approved copy:

```html
<section class="audience" id="who-we-help" aria-labelledby="audience-title">
  <div class="section-shell">
    <div class="section-heading audience__heading">
      <div><div class="eyebrow"><i aria-hidden="true"></i><span>Who we help</span></div><h2 id="audience-title">Revenue cycle support that fits the way you practice</h2></div>
      <p>Different practices need different levels of support. Heiller can own a focused part of the revenue cycle or work across the full operation with your team.</p>
    </div>
    <div class="audience__grid">
      <article><span>01</span><h3>Independent practices</h3><p>Add accountable revenue cycle support without building a larger back office.</p></article>
      <article><span>02</span><h3>Specialty groups</h3><p>Bring clearer ownership to coding, billing, denials, and follow-up across a complex payer mix.</p></article>
      <article><span>03</span><h3>Growing medical groups</h3><p>Create consistent handoffs and reporting as providers, locations, and claim volume grow.</p></article>
    </div>
  </div>
</section>

<section class="onboarding" id="getting-started" aria-labelledby="onboarding-title">
  <div class="section-shell">
    <div class="section-heading onboarding__heading">
      <div><div class="eyebrow"><i aria-hidden="true"></i><span>Getting started</span></div><h2 id="onboarding-title">A clear start, without slowing your team down</h2></div>
      <p>We begin with the way your practice works today, define ownership together, and introduce change in a controlled sequence.</p>
    </div>
    <ol class="onboarding__steps">
      <li><span>01</span><h3>Understand the workflow</h3><p>Review the systems, reports, responsibilities, and handoffs already in place.</p></li>
      <li><span>02</span><h3>Define ownership</h3><p>Agree on scope, communication, escalation, and who owns each step.</p></li>
      <li><span>03</span><h3>Begin the work</h3><p>Start the agreed functions with clear roles for Heiller and your internal team.</p></li>
      <li><span>04</span><h3>Improve from performance</h3><p>Use reporting and recurring issue patterns to focus the next improvements.</p></li>
    </ol>
  </div>
</section>

<section class="systems" id="systems" aria-labelledby="systems-title">
  <div class="section-shell systems__layout">
    <div class="systems__copy"><div class="eyebrow"><i aria-hidden="true"></i><span>Your systems</span></div><h2 id="systems-title">Built around the systems your team already uses</h2><p>Heiller works within the operating environment of your practice. We first understand how information moves today, then define the connections and handoffs required for the agreed scope.</p></div>
    <div class="systems__network" aria-label="System categories connected to Heiller">
      <svg class="systems__lines" viewBox="0 0 720 520" aria-hidden="true"><path d="M360 260 L132 104 M360 260 L584 92 M360 260 L622 260 M360 260 L558 430 M360 260 L132 420" /></svg>
      <div class="systems__node systems__node--center">Heiller</div>
      <div class="systems__node systems__node--ehr">EHR and practice management</div>
      <div class="systems__node systems__node--clearing">Clearinghouses</div>
      <div class="systems__node systems__node--payer">Payer portals</div>
      <div class="systems__node systems__node--payment">Payment systems</div>
      <div class="systems__node systems__node--reporting">Reporting</div>
    </div>
  </div>
</section>

<section class="faq" id="questions" aria-labelledby="faq-title">
  <div class="section-shell faq__layout">
    <div><div class="eyebrow"><i aria-hidden="true"></i><span>Questions</span></div><h2 id="faq-title">What practices usually want to know</h2></div>
    <div class="faq__list">
      <details class="faq__item" open><summary>Can we use Heiller for one part of the revenue cycle?</summary><p>Yes. You can bring us in for one function or ask us to manage the full cycle. The scope is agreed before work begins, so ownership stays clear.</p></details>
      <details class="faq__item"><summary>Will we need to replace our existing systems?</summary><p>Not by default. We begin by understanding how your team works today and identify where Heiller should fit. Any system change would be discussed before it becomes part of the plan.</p></details>
      <details class="faq__item"><summary>How does Heiller work with our internal team?</summary><p>We define who owns each step, how handoffs happen, and how issues are escalated. Your team keeps clear points of contact while Heiller owns the work included in the agreed scope.</p></details>
      <details class="faq__item"><summary>What will we see in reporting?</summary><p>Reporting is organized around work completed, open issues, denials, aging, and collection activity. The exact view depends on the scope and the data available from your systems.</p></details>
      <details class="faq__item"><summary>How do we get started?</summary><p>Begin with a free revenue audit. We review your current workflow and reporting with you, identify where attention is needed, and agree on the most useful next step.</p></details>
    </div>
  </div>
</section>

<section class="final-contact" id="contact" aria-labelledby="contact-title">
  <div class="section-shell final-contact__inner"><div><div class="eyebrow"><i aria-hidden="true"></i><span>Start here</span></div><h2 id="contact-title">Find where revenue is getting stuck</h2><p>Start with a focused review of your current workflow and reporting. Get a clearer view of where attention is needed and what to discuss next.</p></div><a class="final-contact__cta" href="#revenue-audit">Get a free revenue audit <span aria-hidden="true">↗</span></a></div>
</section>

<footer class="site-footer"><div class="section-shell site-footer__inner"><div><a class="site-footer__brand" href="#hero">Heiller</a><p>Revenue cycle management for medical practices.</p></div><nav aria-label="Footer"><a class="site-footer__link" href="#services">Services</a><a class="site-footer__link" href="#results">Results</a><a class="site-footer__link" href="#revenue-audit">Revenue audit</a><a class="site-footer__link" href="#who-we-help">Who we help</a><a class="site-footer__link" href="#getting-started">Getting started</a><a class="site-footer__link" href="#questions">Questions</a></nav><p class="site-footer__legal">© 2026 Heiller.</p></div></footer>
```

- [ ] **Step 4: Run the source-level tests**

Run `npm test`.

Expected: all content and semantic tests pass; visual styling remains for later tasks.

---

### Task 2: Build the audience and onboarding visual systems

**Files:**
- Modify: `index.html:707-940`

**Interfaces:**
- Consumes: `.section-shell`, `.section-heading`, `.audience`, and `.onboarding` markup from Task 1.
- Produces: Three-column audience strip and four-step timeline with responsive two-by-two behavior.

- [ ] **Step 1: Replace generic future-section CSS with shared section foundations**

```css
.section-shell{width:100%;max-width:1311px;margin:0 auto}.audience,.onboarding,.systems,.faq{padding:112px 40px}.section-heading{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.52fr);gap:72px;align-items:end;margin-bottom:64px}.section-heading h2,.systems h2,.faq h2,.final-contact h2{max-width:760px;color:#2A0F14;font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-size:46px;font-weight:500;letter-spacing:-2px;line-height:1.05}.section-heading>p,.systems__copy>p,.final-contact p{color:#6B7280;font-size:15px;line-height:1.55}.audience{background:#fff}.audience__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-block:1px solid #ccc}.audience__grid article{min-height:310px;padding:36px 42px}.audience__grid article+article{border-left:1px solid #ccc}.audience__grid span,.onboarding__steps span{display:block;color:#9AA7C8;font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-size:13px;letter-spacing:.18em}.audience__grid h3,.onboarding__steps h3{margin:92px 0 16px;color:#2A0F14;font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-size:25px;font-weight:500;letter-spacing:-.8px}.audience__grid p,.onboarding__steps p{max-width:30ch;color:#6B7280;font-size:15px;line-height:1.5}
.onboarding{background:#F8FAFC}.onboarding__steps{position:relative;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin:0;padding:0;list-style:none;border-top:1px solid #ccc}.onboarding__steps::before{content:"";position:absolute;left:0;right:0;top:-1px;height:2px;background:linear-gradient(90deg,#FFB13B,#FF6576,#A579FF,#55CFFF);transform:scaleX(.24);transform-origin:left;animation:onboarding-line 8s ease-in-out infinite}.onboarding__steps li{min-height:300px;padding:30px 34px;border-bottom:1px solid #ccc}.onboarding__steps li+li{border-left:1px solid #ccc}.onboarding__steps h3{margin-top:78px}@keyframes onboarding-line{0%,15%{transform:scaleX(.24)}40%{transform:scaleX(.5)}65%{transform:scaleX(.75)}90%,100%{transform:scaleX(1)}}
```

- [ ] **Step 2: Add tablet and mobile rules**

```css
@media(max-width:960px){.audience,.onboarding,.systems,.faq{padding:88px 32px}.section-heading{grid-template-columns:1fr;gap:24px}.audience__grid article{padding:30px 24px}.audience__grid h3,.onboarding__steps h3{margin-top:56px}}
@media(max-width:640px){.audience,.onboarding,.systems,.faq{padding:72px 24px}.section-heading h2,.systems h2,.faq h2,.final-contact h2{font-size:34px;letter-spacing:-1.3px}.audience__grid{grid-template-columns:1fr}.audience__grid article{display:grid;grid-template-columns:42px 1fr;column-gap:16px;min-height:0;padding:26px 0}.audience__grid article+article{border-left:0;border-top:1px solid #ccc}.audience__grid h3{margin:0 0 8px}.audience__grid p{grid-column:2}.onboarding__steps{grid-template-columns:repeat(2,minmax(0,1fr))}.onboarding__steps::before{display:none}.onboarding__steps li{min-height:220px;padding:24px 18px}.onboarding__steps li:nth-child(3){border-left:0}.onboarding__steps h3{margin-top:40px;font-size:19px}.onboarding__steps p{font-size:13px}}
```

- [ ] **Step 3: Run tests and build**

Run `npm test` and `npm run build`.

Expected: all tests pass and the Vite build succeeds.

---

### Task 3: Build the systems network and accessible FAQ

**Files:**
- Modify: `index.html` style block

**Interfaces:**
- Consumes: `.systems__network`, `.systems__node`, `.faq__item`, and native details markup.
- Produces: Responsive systems constellation and keyboard-accessible accordion presentation.

- [ ] **Step 1: Add systems and FAQ CSS**

```css
.systems{background:#fff}.systems__layout{display:grid;grid-template-columns:minmax(0,.82fr) minmax(520px,1.18fr);gap:80px;align-items:center}.systems__copy .eyebrow{margin-bottom:48px}.systems__copy h2{margin-bottom:34px}.systems__network{position:relative;height:520px;border:1px solid #ccc;background:linear-gradient(#fff,#FAFCFF);overflow:hidden}.systems__lines{position:absolute;inset:0;width:100%;height:100%}.systems__lines path{fill:none;stroke:#C9CECD;stroke-width:1.2;stroke-dasharray:6 7;animation:system-pulse 9s linear infinite}.systems__node{position:absolute;display:flex;align-items:center;justify-content:center;max-width:190px;min-height:58px;padding:12px 16px;border:1px solid #D4D7D6;background:#fff;color:#303433;font-size:14px;text-align:center}.systems__node::before{content:"";width:9px;height:9px;margin-right:10px;border-radius:3px;background:linear-gradient(145deg,#4055FF,#55D5FF);flex:none}.systems__node--center{left:50%;top:50%;transform:translate(-50%,-50%);min-width:124px;border-color:#2A0F14;background:#2A0F14;color:#fff;font-size:18px}.systems__node--center::before{background:linear-gradient(145deg,#FFC52F,#FF485A)}.systems__node--ehr{left:5%;top:11%}.systems__node--clearing{right:5%;top:9%}.systems__node--payer{right:3%;top:44%}.systems__node--payment{right:8%;bottom:8%}.systems__node--reporting{left:5%;bottom:10%}@keyframes system-pulse{to{stroke-dashoffset:-130}}
.faq{background:#F7F8FF}.faq__layout{display:grid;grid-template-columns:minmax(280px,.62fr) minmax(0,1fr);gap:112px}.faq .eyebrow{margin-bottom:48px}.faq__list{border-top:1px solid #BFC4C3}.faq__item{border-bottom:1px solid #BFC4C3}.faq__item summary{position:relative;padding:28px 56px 28px 0;color:#2A0F14;font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-size:18px;font-weight:500;cursor:pointer;list-style:none}.faq__item summary::-webkit-details-marker{display:none}.faq__item summary::after{content:"+";position:absolute;right:0;top:50%;transform:translateY(-50%);font-size:24px;font-weight:400}.faq__item[open] summary::after{content:"−"}.faq__item p{max-width:64ch;padding:0 56px 28px 0;color:#6B7280;font-size:15px;line-height:1.58}.faq__item summary:focus-visible{outline:2px solid #4055FF;outline-offset:5px}
@media(prefers-reduced-motion:reduce){.onboarding__steps::before,.systems__lines path{animation:none}.onboarding__steps::before{transform:scaleX(1)}}
```

- [ ] **Step 2: Add systems and FAQ responsive rules**

```css
@media(max-width:960px){.systems__layout{grid-template-columns:1fr;gap:48px}.systems__network{height:460px}.faq__layout{grid-template-columns:1fr;gap:48px}}
@media(max-width:640px){.systems__network{height:430px}.systems__node{max-width:132px;min-height:52px;padding:9px 10px;font-size:11px}.systems__node--center{min-width:100px;font-size:15px}.systems__node--ehr{left:3%;top:8%}.systems__node--clearing{right:3%;top:8%}.systems__node--payer{right:3%;top:44%}.systems__node--payment{right:5%;bottom:7%}.systems__node--reporting{left:3%;bottom:8%}.faq__item summary{padding-block:24px;font-size:16px}.faq__item p{padding-right:24px;font-size:14px}}
```

- [ ] **Step 3: Verify keyboard behavior**

In the local browser, focus each summary with Tab and toggle it with Enter and Space.

Expected: every answer opens and closes, focus remains visible, and the plus/minus state updates.

---

### Task 4: Finish the conversion field and footer

**Files:**
- Modify: `index.html` style block

**Interfaces:**
- Consumes: `.final-contact` and `.site-footer` markup.
- Produces: One integrated CTA/footer composition with working internal links.

- [ ] **Step 1: Add final conversion and footer CSS**

```css
.final-contact{padding:112px 40px;background:radial-gradient(circle at 74% 18%,rgba(244,149,255,.72),transparent 38%),radial-gradient(circle at 18% 82%,rgba(255,193,48,.8),transparent 38%),linear-gradient(120deg,#758CFF 0%,#FF7B71 58%,#FF9A36 100%)}.final-contact__inner{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:72px;align-items:end}.final-contact .eyebrow{margin-bottom:40px}.final-contact h2{max-width:760px;color:#160B13;font-size:58px;line-height:1}.final-contact p{max-width:590px;margin-top:28px;color:rgba(22,11,19,.72);font-size:16px}.final-contact__cta{display:inline-flex;align-items:center;gap:10px;border:1px solid #160B13;border-radius:3px;padding:16px 18px;background:#160B13;color:#fff;font-size:15px;text-decoration:none;white-space:nowrap}.final-contact__cta:focus-visible,.site-footer a:focus-visible{outline:2px solid #fff;outline-offset:4px}.site-footer{padding:70px 40px 32px;background:#111817;color:#fff}.site-footer__inner{display:grid;grid-template-columns:minmax(240px,.8fr) minmax(0,1.2fr);gap:64px}.site-footer__brand{color:#fff;font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-size:28px;font-weight:600;text-decoration:none}.site-footer__inner>div>p{max-width:300px;margin-top:14px;color:#A9B1AF;font-size:14px;line-height:1.5}.site-footer nav{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px 28px}.site-footer__link{color:#D9DFDD;font-size:14px;text-decoration:none}.site-footer__link:hover{color:#fff}.site-footer__legal{grid-column:1/-1;margin-top:42px;padding-top:24px;border-top:1px solid rgba(255,255,255,.16);color:#7F8B88;font-size:12px}
```

- [ ] **Step 2: Add responsive CTA/footer rules**

```css
@media(max-width:760px){.final-contact{padding:80px 24px}.final-contact__inner{grid-template-columns:1fr;gap:40px}.final-contact h2{font-size:42px}.final-contact__cta{justify-self:start}.site-footer{padding:56px 24px 28px}.site-footer__inner{grid-template-columns:1fr;gap:42px}.site-footer nav{grid-template-columns:repeat(2,minmax(0,1fr))}.site-footer__legal{margin-top:10px}}
```

- [ ] **Step 3: Run full automated verification**

Run:

```powershell
npm test
npm run build
```

Expected: all tests pass and the production build succeeds.

---

### Task 5: Browser verification and final polish

**Files:**
- Modify only if verification reveals a defect: `index.html`

**Interfaces:**
- Consumes: Completed page from Tasks 1-4.
- Produces: Verified responsive and accessible homepage.

- [ ] **Step 1: Verify target widths**

Check 320px, 390px, 768px, 1024px, and desktop. At each width assert `document.documentElement.scrollWidth === document.documentElement.clientWidth`.

- [ ] **Step 2: Verify section sequence and copy**

Confirm the sequence is Revenue Audit → Who We Help → Getting Started → Systems → Questions → Final CTA → Footer and Client Proof is absent.

- [ ] **Step 3: Verify motion and controls**

Confirm the onboarding line and systems connectors move normally, stop with reduced motion, and all FAQ disclosures work by keyboard.

- [ ] **Step 4: Verify every footer link**

Click each footer link and confirm it lands on the intended visible section without a dead `#` destination.

- [ ] **Step 5: Record the change**

The directory currently has no Git repository, so preserve the verified files in place. If Git is initialized later, commit the implementation atomically:

```powershell
git add index.html tests/remaining-sections.test.mjs
git commit -m "feat: finish homepage conversion sections"
```
