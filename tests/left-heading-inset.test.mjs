import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")

test("selected left-aligned sections share one responsive inset token", () => {
  assert.match(html, /:root\s*\{[^}]*--left-heading-inset:\s*40px;/s)
  assert.match(html, /@media \(max-width:\s*960px\)[\s\S]*?:root\s*\{[^}]*--left-heading-inset:\s*24px;/s)
  assert.match(html, /@media \(max-width:\s*640px\)[\s\S]*?:root\s*\{[^}]*--left-heading-inset:\s*16px;/s)
  assert.match(html, /@media \(max-width:\s*389px\)[\s\S]*?:root\s*\{[^}]*--left-heading-inset:\s*12px;/s)
})

test("only the approved content groups consume the shared inset", () => {
  const rule = html.match(/\/\* Shared left-heading inset \*\/[\s\S]*?\{[^}]*padding-inline:\s*var\(--left-heading-inset\);[^}]*\}/)?.[0] ?? ""

  for (const selector of [
    ".v3-why__intro",
    ".v3-reason",
    ".v3-results__head",
    ".audit__head > div:first-child",
    ".faq__layout > div:first-child",
  ]) assert.match(rule, new RegExp(selector.replaceAll(".", "\\.").replaceAll(">", "\\>")))

  for (const selector of [".services__lead", ".hero__title", ".dedicated-team", ".v3-work__head", ".onboarding__heading", ".systems__copy", ".final-contact"])
    assert.doesNotMatch(rule, new RegExp(selector.replaceAll(".", "\\.")))
})

test("Why dividers remain on the full-width row container", () => {
  const reasonRule = html.match(/\.v3-reason\s*\{[^}]*\}/s)?.[0] ?? ""

  assert.match(reasonRule, /border-top:\s*1px solid #CCCCCC/)
  assert.doesNotMatch(reasonRule, /margin-inline/)
})
