import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")

test("eyebrow markers use the supplied logo shape", () => {
  assert.match(html, /\.eyebrow i\s*\{[^}]*width:\s*10px;[^}]*height:\s*10px;/s)
  assert.match(html, /\.eyebrow i\s*\{[^}]*-webkit-mask:\s*url\("data:image\/svg\+xml,[^"]*viewBox='0 0 256 256'/s)
  assert.match(html, /\.eyebrow i\s*\{[^}]*mask:\s*url\("data:image\/svg\+xml,[^"]*viewBox='0 0 256 256'/s)
})

test("eyebrow markers and labels share one grey", () => {
  assert.match(html, /\.eyebrow\s*\{[^}]*--eyebrow-grey:\s*#8E939B;/s)
  assert.match(html, /\.eyebrow i\s*\{[^}]*background:\s*var\(--eyebrow-grey\);/s)
  assert.match(html, /\.eyebrow span\s*\{[^}]*color:\s*var\(--eyebrow-grey\);/s)
})

test("eyebrow markers no longer use rotating gradient palettes", () => {
  const selectors = html.match(/\.page\s*>\s*section:nth-of-type\(3n\s*\+\s*[123]\)\s+\.eyebrow i/g) ?? []
  assert.equal(selectors.length, 0)
})
