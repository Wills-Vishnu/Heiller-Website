import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")

test("page exposes one decorative global rail layer", () => {
  assert.equal((html.match(/<div class="content-rails" aria-hidden="true"><\/div>/g) ?? []).length, 1)
  assert.match(html, /<div class="page">\s*<div class="content-rails" aria-hidden="true"><\/div>/)
})

test("rails use the exact Services width and responsive gutters", () => {
  assert.match(html, /--content-frame-max:\s*1311px;/)
  assert.match(html, /--content-frame-gutter:\s*40px;/)
  assert.match(html, /@media \(max-width:\s*960px\)[\s\S]*?--content-frame-gutter:\s*24px;/)
  assert.match(html, /@media \(max-width:\s*640px\)[\s\S]*?--content-frame-gutter:\s*16px;/)
  assert.match(html, /@media \(max-width:\s*389px\)[\s\S]*?--content-frame-gutter:\s*12px;/)
  assert.match(html, /\.content-rails\s*\{[^}]*top:\s*0;[^}]*bottom:\s*0;[^}]*width:\s*min\(var\(--content-frame-max\),\s*calc\(100%\s*-\s*2\s*\*\s*var\(--content-frame-gutter\)\)\);/s)
})

test("every section content container shares the global frame", () => {
  const rule = html.match(/\/\* Global content frame \*\/[\s\S]*?\{[^}]*max-width:\s*var\(--content-frame-max\);[^}]*\}/)?.[0] ?? ""

  for (const selector of [
    ".nav__inner",
    ".hero__head",
    ".hero__flow",
    ".trust__box",
    ".services__inner",
    ".dedicated-team__field",
    ".v3-why__inner",
    ".v3-work__inner",
    ".v3-results__inner",
    ".future-section__inner",
    ".section-shell",
  ]) assert.match(rule, new RegExp(selector.replaceAll(".", "\\.")))

  assert.doesNotMatch(rule, /\.hero-bg|\.site-footer/)
  assert.doesNotMatch(html, /\.site-footer__content/)
})

test("V3 footer content stays inside the global rails", () => {
  assert.match(html, /\.site-footer\s*\{[^}]*padding:\s*clamp\(50px,\s*6vw,\s*110px\)\s+0\s+0;/s)
  assert.match(html, /\.site-footer__top\s*\{[^}]*width:\s*min\(var\(--content-frame-max\),\s*calc\(100%\s*-\s*2\s*\*\s*var\(--content-frame-gutter\)\)\);[^}]*margin-inline:\s*auto;[^}]*padding-inline:\s*var\(--left-heading-inset\);/s)
  assert.match(html, /\.site-footer__nav\s*\{[^}]*width:\s*min\(calc\(var\(--content-frame-max\)\s*\*\s*0\.62\s*-\s*2\s*\*\s*var\(--left-heading-inset\)\),\s*calc\(\(100%\s*-\s*2\s*\*\s*var\(--content-frame-gutter\)\)\s*\*\s*0\.62\s*-\s*2\s*\*\s*var\(--left-heading-inset\)\)\);/s)
  assert.match(html, /\.site-footer__bottom\s*\{[^}]*left:\s*50%;[^}]*width:\s*min\(calc\(var\(--content-frame-max\)\s*-\s*2\s*\*\s*var\(--left-heading-inset\)\),\s*calc\(100%\s*-\s*2\s*\*\s*var\(--content-frame-gutter\)\s*-\s*2\s*\*\s*var\(--left-heading-inset\)\)\);[^}]*transform:\s*translateX\(-50%\);/s)
})

test("rails match the second section's fixed grey strokes", () => {
  const rails = html.match(/\.content-rails::before,[\s\S]*?\}/)?.[0] ?? ""
  assert.match(rails, /background:\s*#CCCCCC;/)
  assert.doesNotMatch(rails, /mix-blend-mode/)
})

test("desktop trust strip aligns its tab and panel to both rails", () => {
  assert.match(html, /\.trust__tab\s*\{[^}]*left:\s*0;/s)
  assert.match(html, /\.trust__panel\s*\{[^}]*left:\s*0;[^}]*width:\s*100%;/s)
  assert.doesNotMatch(html, /\.trust__panel\s*\{[^}]*width:\s*calc\(100%\s*-\s*38px\);/s)
})

test("decorative rails are hidden on phone widths without changing gutters", () => {
  assert.match(html, /@media \(max-width:\s*640px\)\s*\{[\s\S]*?:root\s*\{[^}]*--content-frame-gutter:\s*16px;[^}]*\}[\s\S]*?\.content-rails\s*\{\s*display:\s*none;\s*\}/s)
  assert.match(html, /@media \(max-width:\s*389px\)[\s\S]*?--content-frame-gutter:\s*12px;/s)
})

test("tablet keeps content inside rails with internal spacing", () => {
  assert.match(html, /@media \(min-width:\s*641px\) and \(max-width:\s*960px\)\s*\{[\s\S]*?\.nav,\s*[\s\S]*?\.faq\s*\{[^}]*padding-inline:\s*0;/s)
  assert.match(html, /@media \(min-width:\s*641px\) and \(max-width:\s*960px\)[\s\S]*?\.nav__inner,[\s\S]*?\.section-shell\s*\{[^}]*width:\s*min\(var\(--content-frame-max\),\s*calc\(100%\s*-\s*2\s*\*\s*var\(--content-frame-gutter\)\)\);/s)
  assert.match(html, /@media \(min-width:\s*641px\) and \(max-width:\s*960px\)[\s\S]*?\.nav__row\s*\{[^}]*padding-inline:\s*var\(--left-heading-inset\);/s)
  assert.match(html, /@media \(min-width:\s*641px\) and \(max-width:\s*960px\)[\s\S]*?\.hero__flow\s*\{[^}]*max-width:\s*var\(--content-frame-max\);[^}]*padding-inline:\s*var\(--left-heading-inset\);/s)
  assert.match(html, /@media \(min-width:\s*641px\) and \(max-width:\s*960px\)[\s\S]*?\.v3-reason,[\s\S]*?\.booking-calendar__frame\s*\{[^}]*margin-inline:\s*var\(--left-heading-inset\);[^}]*width:\s*auto;/s)
  assert.match(html, /@media \(min-width:\s*641px\) and \(max-width:\s*960px\)[\s\S]*?\.faq__list\s*\{[^}]*padding-inline:\s*var\(--left-heading-inset\);/s)
  assert.match(html, /@media \(min-width:\s*641px\) and \(max-width:\s*960px\)[\s\S]*?\.site-footer__top,[\s\S]*?\.site-footer__bottom\s*\{[^}]*width:\s*min\(var\(--content-frame-max\),\s*calc\(100%\s*-\s*2\s*\*\s*var\(--content-frame-gutter\)\)\);[^}]*padding-inline:\s*var\(--left-heading-inset\);/s)
  assert.match(html, /@media \(min-width:\s*641px\) and \(max-width:\s*960px\)[\s\S]*?\.hero-bg\s*\{[^}]*transform:\s*translateY\(420px\) scaleY\(-1\.14\);/s)
})
