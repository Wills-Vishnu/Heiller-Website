import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")

test("imports the three V3 sections before revenue audit", () => {
  const dedicated = html.indexOf('<section class="dedicated-team"')
  const why = html.indexOf('id="why-heiller"')
  const work = html.indexOf('id="team-extension"')
  const results = html.indexOf('id="results"')
  const audit = html.indexOf('id="revenue-audit"')
  assert.ok(dedicated < why && why < work && work < results && results < audit)
})

test("uses the exact V3 why copy", () => {
  for (const text of [
    "Built to stay close to the work.",
    "At Heiller, we work as an extension of your team.",
    "One accountable owner",
    "Fewer stalled handoffs",
    "Revenue-cycle focus",
    "Work you can inspect",
    "A flexible extension",
  ]) assert.match(html, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
})

test("uses the exact workflow stages and result metrics", () => {
  assert.equal((html.match(/data-workflow-row/g) ?? []).length, 6)
  for (const text of [
    "Intake and registration", "Coding and claim preparation", "Claim submission",
    "Denial recovery", "A/R follow-up", "Revenue reporting",
    "95%", "Clean claim rate", "5%", "Denial rate", "35", "Days in A/R",
    "96%", "Net collection rate",
  ]) assert.match(html, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
  assert.equal((html.match(/data-result-metric/g) ?? []).length, 4)
  assert.equal((html.match(/data-metric-mesh-value/g) ?? []).length, 10)
})

test("uses mixed rail spacing for editorial copy and structural boxes", () => {
  assert.match(html, /\.v3-why__inner,[\s\S]*?\.v3-results__inner\s*\{[^}]*max-width:\s*var\(--content-frame-max\);/s)
  assert.match(html, /\/\* Shared left-heading inset \*\/[\s\S]*?\.v3-why__intro,[\s\S]*?\.v3-reason,[\s\S]*?\.v3-results__head,[\s\S]*?padding-inline:\s*var\(--left-heading-inset\);/s)
  assert.match(html, /\.v3-reason\s*\{[^}]*border-top:\s*1px solid #CCCCCC;/s)
  assert.match(html, /\.v3-reason:first-child\s*\{\s*border-top:\s*0;/s)
  assert.match(html, /\.v3-metrics\s*\{[^}]*border:\s*1px solid #CCCCCC;/s)
})

test("results section uses a tighter top gap than bottom gap", () => {
  assert.match(html, /\.v3-results\s*\{\s*padding-block:\s*clamp\(32px,\s*4vw,\s*72px\)\s+clamp\(64px,\s*7vw,\s*120px\);/s)
})

test("results eyebrow uses the shared heading spacing without an extra grid gap", () => {
  assert.match(html, /\.v3-results__head\s*\{\s*display:\s*block;\s*margin-bottom:\s*clamp\(48px,\s*6vw,\s*96px\);\s*text-align:\s*center;/s)
  assert.doesNotMatch(html, /\.v3-results__head\s*\{[^}]*gap:/s)
})

test("results and revenue audit headings are centered and size matched", () => {
  const resultsRule = html.match(/\.v3-work__head h2, \.v3-results__head h2\s*\{[^}]*\}/s)?.[0] ?? ""
  const auditHeadRule = html.match(/\.audit__head\s*\{[^}]*\}/s)?.[0] ?? ""
  const auditTitleRule = html.match(/\.audit__head h2\s*\{[^}]*\}/s)?.[0] ?? ""

  assert.match(html, /\.v3-results__head\s*\{[^}]*text-align:\s*center;/s)
  assert.match(html, /\.v3-results__head h2\s*\{[^}]*max-width:\s*830px;[^}]*margin-inline:\s*auto;/s)
  assert.match(html, /\.v3-results__head \.eyebrow,\s*\.audit__head \.eyebrow\s*\{\s*justify-content:\s*center;\s*\}/s)
  assert.match(auditHeadRule, /grid-template-columns:\s*minmax\(0, 1fr\);/)
  assert.match(auditHeadRule, /justify-items:\s*center;/)
  assert.match(auditHeadRule, /text-align:\s*center;/)
  assert.match(resultsRule, /font-size:\s*clamp\(38px,\s*4\.3vw,\s*74px\);/)
  assert.match(resultsRule, /letter-spacing:\s*-\.06em;/)
  assert.match(resultsRule, /line-height:\s*\.94;/)
  assert.match(auditTitleRule, /font-size:\s*clamp\(38px,\s*4\.3vw,\s*74px\);/)
  assert.match(auditTitleRule, /letter-spacing:\s*-\.06em;/)
  assert.match(auditTitleRule, /line-height:\s*\.94;/)
})

test("mobile results metrics remove only the outer horizontal dividers", () => {
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-metrics\s*\{[^}]*grid-template-columns:\s*1fr;[^}]*border-top:\s*0;[^}]*border-bottom:\s*0;[^}]*\}/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-metrics article\s*\{[^}]*border-bottom:\s*1px solid #CCCCCC;/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-metrics article:last-child\s*\{\s*border-bottom:\s*0;\s*\}/s)
})

test("keeps the Why CTA mobile-only", () => {
  assert.match(html, /\.v3-action\.v3-why__cta\s*\{\s*display:\s*none;/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-action\.v3-why__cta\s*\{\s*display:\s*inline-flex;/s)
})

test("uses the approved Why typography reductions", () => {
  assert.match(html, /\.v3-why__intro h2\s*\{[^}]*font-size:\s*clamp\(41px,\s*calc\(5vw - 2px\),\s*82px\);/s)
  assert.match(html, /\.v3-why__intro > p\s*\{[^}]*font-size:\s*clamp\(20px,\s*calc\(2\.5vw - 5px\),\s*44px\);[^}]*line-height:\s*calc\(1\.02em - 0\.5px\);/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-why__intro h2\s*\{\s*font-size:\s*46px;/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-why__intro > p\s*\{\s*font-size:\s*26px;/s)
})

test("masks the route start and uses the metric palette", () => {
  assert.match(html, /id="v3-ledger-fade"/)
  assert.match(html, /mask="url\(#v3-ledger-start-mask\)"/)
  for (const color of ["#CFDFFF", "#5A96F5", "#A5A9F2", "#FBC96A", "#FBE0B3"]) assert.match(html, new RegExp(color, "i"))
})

test("keeps the aligned serpentine ledger on mobile", () => {
  assert.match(html, /\.v3-ledger__index\s*\{[^}]*width:\s*fit-content;/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-ledger__row\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-ledger__row:nth-child\(odd\) \.v3-ledger__stage\s*\{[^}]*text-align:\s*right;[^}]*align-items:\s*flex-end;/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-ledger__row:nth-child\(even\) \.v3-ledger__stage\s*\{[^}]*text-align:\s*left;[^}]*align-items:\s*flex-start;/s)
  assert.doesNotMatch(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-ledger__flow\s*\{\s*display:\s*none;/s)
  assert.doesNotMatch(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-ledger__row\s*\{[^}]*border-top:/s)
})

test("workflow ledger uses compact vertical spacing", () => {
  assert.match(html, /\.v3-ledger__row\s*\{[^}]*padding-block:\s*clamp\(8px,\s*1vw,\s*16px\);/s)
  assert.match(html, /\.v3-ledger__stage\s*\{[^}]*gap:\s*5px;/s)
  assert.match(html, /\.v3-ledger__stage h3\s*\{[^}]*font-size:\s*clamp\(15px,\s*calc\(1\.5vw - 2px\),\s*25px\);/s)
  assert.match(html, /\.v3-ledger__foot\s*\{[^}]*padding-top:\s*42px;/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-ledger__row\s*\{[^}]*padding-block:\s*clamp\(12px,\s*4vw,\s*18px\);/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-ledger__stage h3\s*\{[^}]*font-size:\s*clamp\(12px,\s*calc\(4\.2vw - 2px\),\s*16px\);/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-ledger__foot\s*\{[^}]*padding-top:\s*34px;/s)
})

test("workflow heading uses Tiempos Text Regular Italic", () => {
  assert.match(html, /\.v3-work__head h2\s*\{[^}]*font-family:\s*"Tiempos Text", Georgia, "Times New Roman", serif;[^}]*font-style:\s*italic;[^}]*font-weight:\s*400;/s)
  assert.match(html, /\.v3-work__head h2\s*\{[^}]*letter-spacing:\s*calc\(-\.\d+em - 0\.7px\);/s)
})

test("workflow section shows clipped grey logo halves at both rails", () => {
  const section = html.match(/<section class="v3-work"[\s\S]*?<\/section>/)?.[0] ?? ""
  const markRule = html.match(/\.v3-work__edge-mark\s*\{[^}]*\}/s)?.[0] ?? ""

  assert.equal((section.match(/class="v3-work__edge-mark/g) ?? []).length, 2)
  assert.match(section, /class="v3-work__edge-mark v3-work__edge-mark--left"[^>]*aria-hidden="true"[^>]*focusable="false"/)
  assert.match(section, /class="v3-work__edge-mark v3-work__edge-mark--right"[^>]*aria-hidden="true"[^>]*focusable="false"/)
  assert.match(markRule, /color:\s*#F1F2F4;/)
  assert.match(html, /\.v3-work__edge-mark--left\s*\{[^}]*left:\s*0;[^}]*clip-path:\s*inset\(0 0 0 50%\);[^}]*transform:\s*translate\(-50%,\s*-43%\);/s)
  assert.match(html, /\.v3-work__edge-mark--right\s*\{[^}]*right:\s*0;[^}]*clip-path:\s*inset\(0 50% 0 0\);[^}]*transform:\s*translate\(50%,\s*-43%\);/s)
  assert.doesNotMatch(html, /\.v3-work__inner\s*\{[^}]*overflow:\s*hidden;/s)
  assert.match(html, /\.v3-work__head\s*\{[^}]*z-index:\s*1;/s)
  assert.match(html, /\.v3-ledger\s*\{[^}]*z-index:\s*1;/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.v3-work__edge-mark\s*\{\s*display:\s*none;/s)
})

test("workflow CTA uses the liquid glass pill treatment", () => {
  const rule = html.match(/\.v3-ledger__foot \.v3-action\s*\{[^}]*\}/s)?.[0] ?? ""

  assert.match(html, /<a class="v3-action" href="#revenue-audit"><span>Start with a revenue audit<\/span><svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M3 9 9 3M4\.5 3H9v4\.5"/)
  assert.match(rule, /position:\s*relative;/)
  assert.match(rule, /isolation:\s*isolate;/)
  assert.match(rule, /overflow:\s*hidden;/)
  assert.match(rule, /justify-content:\s*center;/)
  assert.match(rule, /gap:\s*10px;/)
  assert.match(rule, /height:\s*48px;/)
  assert.match(rule, /border:\s*1px solid rgba\(255,255,255,\.54\);/)
  assert.match(rule, /background:[^;]*linear-gradient[\s\S]*rgba\(5,5,5,\.86\);/s)
  assert.match(rule, /backdrop-filter:\s*blur\(14px\) saturate\(145%\);/)
  assert.match(rule, /box-shadow:[^}]*0 14px 32px -10px rgba\(8,8,8,\.55\)/s)
  assert.match(html, /\.v3-ledger__foot \.v3-action::before\s*\{[^}]*radial-gradient/s)
  assert.match(html, /\.v3-ledger__foot \.v3-action::after\s*\{[^}]*box-shadow:\s*inset/s)
  assert.match(html, /\.v3-ledger__foot \.v3-action svg\s*\{[^}]*width:\s*12px;[^}]*height:\s*12px;/s)
})
