import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")
const flow = html.match(/<svg class="audit__flow"[\s\S]*?<\/svg>/)?.[0] ?? ""

test("audit track and scroll-fill route share an entry fade mask", () => {
  assert.match(flow, /id="audit-entry-fade-grad"/)
  assert.match(flow, /id="audit-entry-mask"/)
  assert.match(flow, /<g class="audit__fade-group" mask="url\(#audit-entry-mask\)">[\s\S]*?audit__track[\s\S]*?audit__route[\s\S]*?pathLength="1"[\s\S]*?<\/g>/)
})

test("audit destination arrow remains outside the entry mask", () => {
  const groupEnd = flow.indexOf("</g>")
  const arrow = flow.indexOf('class="audit__arrow"')
  assert.ok(groupEnd > -1 && arrow > groupEnd)
})

test("audit fade follows measured route start responsively", () => {
  assert.match(html, /var fadeDistance = window\.innerWidth <= 640 \? 72 : 100;/)
  assert.match(html, /fadeGradient\.setAttribute\("y1", startY\)/)
  assert.match(html, /fadeGradient\.setAttribute\("y2", startY \+ fadeDistance\)/)
})

test("audit route starts from the centered heading", () => {
  assert.match(html, /var startX = \(hb\.left \+ hb\.width \/ 2\) - ib\.left;/)
  assert.match(html, /var pts = \[\s*\[startX, startY\],\s*\[startX, ys\[0\]\], \[xR, ys\[0\]\]/s)
})

test("audit route uses scroll progress instead of running trails", () => {
  assert.match(html, /function getAuditProgress\(\)/)
  assert.match(html, /var end = viewportHeight \* 0\.42;/)
  assert.match(html, /route\.style\.strokeDashoffset = String\(1 - clamped\)/)
  assert.doesNotMatch(html, /audit__routes/)
  assert.doesNotMatch(html, /is-flowing/)
  assert.doesNotMatch(html, /audit-cta-hit/)
  assert.doesNotMatch(html, /TAIL_N|TAIL_STEP|PERIOD|SPEED/)
})
