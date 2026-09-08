import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8")

test("only service card titles use Plus Jakarta Sans", () => {
  const titleRule = html.match(/\.card__title\s*\{[^}]*\}/)?.[0] ?? ""
  const cardRule = html.match(/\.card\s*\{[^}]*\}/)?.[0] ?? ""
  const bodyRule = html.match(/\.card__body\s*\{[^}]*\}/)?.[0] ?? ""
  assert.match(titleRule, /font-family:\s*"Plus Jakarta Sans", system-ui, sans-serif;/)
  assert.doesNotMatch(cardRule, /font-family:/)
  assert.doesNotMatch(bodyRule, /font-family:/)
})
