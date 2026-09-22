import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")
const body = html.slice(html.indexOf("<body"))

test("finished sections replace every unfinished placeholder", () => {
  for (const id of ["booking-calendar", "questions"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`))
  }
  assert.doesNotMatch(html, /id=["'](?:getting-started|systems|contact)["']/)
  assert.doesNotMatch(body, /placeholder-title|future-grid|future-proof|future-faq|future-cta|future-footer|Client proof|Client Success Story/)
})

test("FAQ uses five native accessible disclosures", () => {
  assert.equal((html.match(/<details class="faq__item"/g) ?? []).length, 5)
  assert.equal((html.match(/<summary>/g) ?? []).length, 5)
})

test("FAQ imports the exact V3 revenue-audit content", () => {
  const faq = body.match(/<section class="faq"[\s\S]*?<\/section>/)?.[0] ?? ""
  assert.match(faq, /<span>Faq<\/span>/)
  assert.match(faq, /<span>Questions before<\/span><span>we begin<\/span>/)
  for (const question of [
    "What does the revenue audit include?",
    "What information do you need?",
    "How long does it take?",
    "How is sensitive information handled?",
    "What happens after the review?",
  ]) assert.match(faq, new RegExp(question.replace(/[?]/g, "\\?")))
})

test("footer anchors only target real page sections", () => {
  const targets = [...html.matchAll(/class="site-footer__link" href="#([^"]+)"/g)].map(match => match[1])
  assert.deepEqual(targets, ["services", "why-heiller", "results", "revenue-audit", "booking-calendar", "questions"])
  assert.match(html, /class="site-footer__link" href="#booking-calendar">Book an audit<\/a>/)
  assert.match(html, /class="site-footer__cta" href="#booking-calendar">/)
  assert.doesNotMatch(html, /href="#contact"/)
})

test("top nav menu items match live page sections", () => {
  const nav = html.match(/<nav class="nav__links">[\s\S]*?<\/nav>/)?.[0] ?? ""
  const targets = [...nav.matchAll(/class="nav__item" href="#([^"]+)"/g)].map(match => match[1])

  assert.deepEqual(targets, ["services", "why-heiller", "results", "questions"])
  assert.match(html, /<a class="nav__brand" href="#hero" aria-label="Heiller home">/)
  assert.match(html, /<a class="btn-demo" href="#booking-calendar"><span>Get a free revenue audit<\/span>/)
  assert.doesNotMatch(nav, /Solutions|Resources/)
  assert.doesNotMatch(nav, /<div class="nav__item"/)
})

test("top nav CTA uses liquid glass styling", () => {
  const rule = html.match(/\.btn-demo\s*\{[^}]*\}/s)?.[0] ?? ""

  assert.match(rule, /isolation:\s*isolate;/)
  assert.match(rule, /overflow:\s*hidden;/)
  assert.match(rule, /border-radius:\s*999px;/)
  assert.match(rule, /background:[^;]*linear-gradient[\s\S]*rgba\(255,255,255,\.12\);/s)
  assert.match(rule, /backdrop-filter:\s*blur\(14px\) saturate\(145%\);/)
  assert.match(rule, /box-shadow:[^;]*inset[^;]*0 14px 38px/s)
  assert.match(html, /\.btn-demo::before\s*\{[^}]*radial-gradient/s)
  assert.match(html, /\.btn-demo::after\s*\{[^}]*box-shadow:\s*inset/s)
  assert.match(html, /\.btn-demo > span,[\s\S]*?\.btn-demo svg\s*\{[^}]*z-index:\s*1;/s)
})

test("page anchor navigation uses native smooth scrolling with reduced-motion fallback", () => {
  assert.match(html, /html\s*\{\s*margin:\s*0;[^}]*scroll-behavior:\s*smooth;[^}]*scroll-padding-top:\s*24px;/s)
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)\s*\{\s*html\s*\{\s*scroll-behavior:\s*auto;\s*\}/s)
})

test("mobile CTAs expand to full-width liquid glass except the top nav action", () => {
  const mobileCtaRule = html.match(/\/\* Mobile CTAs, excluding the top navigation action[\s\S]*?\.site-footer__cta\s*\{[^}]*\}/s)?.[0] ?? ""

  assert.match(mobileCtaRule, /\.services-liquid-glass,[\s\S]*?\.v3-action\.v3-why__cta,[\s\S]*?\.v3-ledger__foot \.v3-action,[\s\S]*?\.audit__cta,[\s\S]*?\.site-footer__cta/)
  assert.doesNotMatch(mobileCtaRule, /\.btn-demo/)
  assert.match(mobileCtaRule, /width:\s*100%;/)
  assert.match(mobileCtaRule, /height:\s*54px;/)
  assert.match(mobileCtaRule, /border-radius:\s*999px;/)
  assert.match(mobileCtaRule, /backdrop-filter:\s*blur\(14px\) saturate\(145%\);/)
  assert.match(html, /\.services-liquid-glass\s*\{[^}]*width:\s*calc\(100% - 32px\);/s)
  assert.match(html, /\.v3-action\.v3-why__cta::before,[\s\S]*?\.audit__cta::before\s*\{[^}]*radial-gradient/s)
})

test("calendar flows directly into FAQ and footer", () => {
  const booking = body.indexOf('id="booking-calendar"')
  const questions = body.indexOf('id="questions"')
  const footer = body.indexOf('<footer class="site-footer" id="site-footer">')
  assert.ok(booking < questions && questions < footer)
})

test("V3 FAQ styling replaces deleted section CSS", () => {
  assert.match(html, /\.faq__layout\s*\{[^}]*grid-template-columns:\s*\.8fr 1\.2fr;[^}]*gap:\s*8vw;/s)
  assert.match(html, /\.faq h2\s*\{[^}]*max-width:\s*12ch;/s)
  assert.match(html, /\.faq__list\s*\{\s*padding-right:\s*var\(--left-heading-inset\);/s)
  assert.match(html, /\.faq__item\s*\{\s*border-top:\s*1px solid #CCCCCC;\s*\}/s)
  assert.match(html, /\.faq__item:first-child\s*\{\s*border-top:\s*0;\s*\}/s)
  assert.doesNotMatch(html, /\.faq__list\s*\{\s*border-top:/)
  assert.doesNotMatch(html, /\.faq__item\s*\{\s*border-bottom:/)
  assert.match(html, /\.faq\s*\{[^}]*background:\s*#FFFFFF;/s)
  assert.match(html, /\.faq__item summary::after\s*\{[^}]*content:\s*"\+";/s)
  assert.match(html, /\.faq__item\[open\] summary::after\s*\{[^}]*transform:\s*translateY\(-50%\) rotate\(45deg\);/s)
  assert.doesNotMatch(html, /\.onboarding(?:__|\s|,|\{)/)
  assert.doesNotMatch(html, /\.systems(?:__|\s|,|\{)/)
  assert.doesNotMatch(html, /\.final-contact(?:__|\s|,|\{)/)
})

test("footer uses the V3 sticky reveal structure", () => {
  const footer = html.match(/<footer class="site-footer" id="site-footer">[\s\S]*?<\/footer>/)?.[0] ?? ""
  assert.match(footer, /Explore/)
  assert.match(footer, /Company/)
  assert.match(footer, /Contact/)
  assert.match(footer, /Revenue-cycle work with clear ownership, close collaboration, and fewer lost handoffs\./)
  assert.match(footer, /Start with a revenue audit/)
  assert.match(footer, /<a class="site-footer__cta" href="#booking-calendar">\s*<span>Start with a revenue audit<\/span>\s*<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">/)
  assert.match(footer, /<span class="site-footer__shader-logo" aria-hidden="true"><\/span>/)
  const footerBrand = footer.match(/<a class="site-footer__brand"[\s\S]*?<\/a>/)?.[0] ?? ""
  assert.doesNotMatch(footerBrand, /<svg/)
  assert.match(footer, /connect@heillerrcm\.com/)
  assert.match(footer, /data-privacy-open>Privacy<\/button>/)
  assert.match(footer, /3101 N\. Central Ave, Ste 183 #7497/)
  assert.match(footer, /Phoenix, AZ 85012/)
  assert.match(html, /\.site-footer::after\s*\{[^}]*content:\s*"heiller";[^}]*left:\s*-0\.055em;[^}]*width:\s*max-content;[^}]*text-align:\s*left;/s)
  assert.match(html, /\.site-footer::after\s*\{[^}]*font-size:\s*43vw;/s)
  assert.match(html, /@media \(max-width: 760px\)\s*\{[\s\S]*?\.site-footer::after\s*\{[^}]*font-size:\s*43vw;/s)
  assert.match(html, /\.site-footer__top > p\s*\{[^}]*margin-left:\s*calc\(var\(--left-heading-inset\) \* \.76\);/s)
  assert.match(html, /\.site-footer__cta\s*\{[^}]*isolation:\s*isolate;[^}]*justify-content:\s*center;[^}]*border:\s*1px solid rgba\(255,255,255,\.54\);[^}]*backdrop-filter:\s*blur\(14px\) saturate\(145%\);/s)
  assert.match(html, /\.site-footer__cta::before\s*\{[^}]*radial-gradient/s)
  assert.match(html, /\.site-footer__cta::after\s*\{[^}]*box-shadow:\s*inset/s)
  assert.match(html, /\.site-footer__cta svg\s*\{[^}]*width:\s*12px;[^}]*height:\s*12px;/s)
  assert.match(html, /\.site-footer\s*\{[^}]*position:\s*sticky;[^}]*background:\s*#FFFFFF;/s)
  assert.doesNotMatch(footer, /href="#"/)
  assert.doesNotMatch(footer, /instagram|linkedin|twitter|youtube/i)
})

test("footer uses the flipped hero shader background", () => {
  const footer = html.match(/<footer class="site-footer" id="site-footer">[\s\S]*?<\/footer>/)?.[0] ?? ""

  assert.match(footer, /<canvas class="site-footer__bg" aria-hidden="true"><\/canvas>/)
  assert.match(html, /\.site-footer__bg\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*z-index:\s*0;[^}]*mask-image:\s*linear-gradient\(to bottom, transparent 0, rgba\(0, 0, 0, 0\.12\) 28px, rgba\(0, 0, 0, 0\.72\) 82px, #000 150px\);[^}]*pointer-events:\s*none;/s)
  assert.match(html, /\.hero-bg\s*\{[^}]*transform-origin:\s*0 0;[^}]*transform:\s*translateY\(470px\) scaleY\(-0\.550\);/s)
  assert.match(html, /querySelectorAll\("\.hero-bg, \.site-footer__bg"\)/)
  assert.match(html, /var exposeSharedShader = canvas\.classList\.contains\("hero-bg"\)/)
  assert.match(html, /if \(canvas\.classList\.contains\("site-footer__bg"\)\)\s*\{\s*U\.colors = \[/)
  assert.match(html, /\[0\.1411764705882353, 0\.3607843137254902, 1\]/)
  assert.match(html, /\[0\.43529411764705883, 0\.6588235294117647, 1\]/)
  assert.match(html, /\[0\.1411764705882353, 0\.4196078431372549, 1\]/)
  assert.match(html, /\[0\.9529411764705882, 0\.9058823529411765, 0\.7686274509803922\]/)
  assert.match(html, /U\.colorCount = 6;/)
  assert.match(html, /U\.hue = 0;/)
  assert.match(html, /U\.contrast = 1\.04;/)
  assert.doesNotMatch(html, /flipShaderY/)
  assert.doesNotMatch(html, /screenUv\.y = 1\.0 - screenUv\.y/)
  assert.match(html, /gl\.uniform4f\(uni\.cursor, 0, U\.cursorEffect/)
  assert.match(html, /if \(exposeSharedShader\)\s*\{\s*window\.__heillerHeroShader\s*=/)
  assert.match(html, /\.site-footer__top\s*\{[^}]*z-index:\s*2;/s)
  assert.match(html, /\.site-footer__nav\s*\{[^}]*z-index:\s*2;/s)
})

test("hero and footer shader canvases stay static until visible", () => {
  assert.match(html, /var visible = document\.visibilityState === "visible", inView = !\("IntersectionObserver" in window\);/)
  assert.match(html, /drawFrame\(performance\.now\(\)\); \/\/ paint at least one frame even if the tab starts hidden\s*if \(isActive\(\)\) requestRender\(\);/)
  assert.match(html, /window\.addEventListener\("resize", function \(\) \{ resizeCanvas\(\); if \(isActive\(\)\) requestRender\(\); \}\);/)
})

test("footer brand uses the Paper Gem Smoke shader-style mark", async () => {
  await access(new URL("../public/footer-gem-logo.svg", import.meta.url))

  assert.match(html, /\.site-footer__shader-logo\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;[^}]*conic-gradient\(from var\(--footer-gem-angle, 0deg\)[^}]*mask:\s*url\("\/footer-gem-logo\.svg"\) center \/ 82% 82% no-repeat;[^}]*animation:\s*footer-gem-smoke 6s linear infinite;/s)
  assert.match(html, /\.site-footer__shader-logo::before,[\s\S]*?\.site-footer__shader-logo::after\s*\{/s)
  assert.match(html, /@keyframes footer-gem-smoke\s*\{\s*to\s*\{\s*--footer-gem-angle:\s*360deg;\s*\}/s)
  assert.match(html, /@keyframes footer-gem-drift\s*\{/)
})

test("privacy drawer is ported from V3 with static-page behavior", () => {
  assert.match(html, /<section\s+class="privacy-drawer"[\s\S]*role="dialog"[\s\S]*aria-modal="true"[\s\S]*aria-labelledby="privacy-title"[\s\S]*hidden/)
  assert.match(html, /<h2 class="privacy-drawer__title" id="privacy-title">Privacy notice<\/h2>/)
  assert.match(html, /Effective August 22, 2026/)
  assert.match(html, /Heiller does not sell or rent your contact information\./)
  assert.match(html, /3101 N\. Central Ave, Ste 183 #7497, Phoenix, AZ 85012, Maricopa, United States/)
  assert.match(html, /window\.location\.hash === "#privacy"/)
  assert.match(html, /document\.body\.style\.setProperty\("position", "fixed", "important"\)/)
  assert.match(html, /event\.key !== "Escape"/)
})

test("footer interaction supports reduced motion", () => {
  assert.match(html, /prefers-reduced-motion:\s*reduce[\s\S]*site-footer__cta/)
  assert.match(html, /prefers-reduced-motion:\s*reduce[\s\S]*site-footer__shader-logo/)
})
