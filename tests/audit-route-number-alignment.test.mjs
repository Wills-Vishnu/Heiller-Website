import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8")
const script = html.match(/<!-- Audit flow:[\s\S]*?<\/script>/)?.[0] ?? ""

test("desktop audit route aligns to the number column centers", () => {
  assert.match(script, /var leftIndex = rows\[0\]\.querySelector\("\.audit__index"\)/)
  assert.match(script, /var rightIndex = rows\[1\]\.querySelector\("\.audit__index"\)/)
  assert.match(script, /window\.innerWidth > 640/)
  assert.match(script, /var leftIndexCenter = \(leftIndexBox\.left \+ leftIndexBox\.width \/ 2\) - ib\.left/)
  assert.match(script, /var rightIndexCenter = \(rightIndexBox\.left \+ rightIndexBox\.width \/ 2\) - ib\.left/)
  assert.match(script, /if \(rightIndexCenter - leftIndexCenter > 120\)/)
  assert.match(script, /xL = leftIndexCenter/)
  assert.match(script, /xR = rightIndexCenter/)
})

test("mobile audit route keeps the existing rail-adjacent fallback", () => {
  assert.match(script, /var xL = \(lb\.left - ib\.left\) \+ 4\.5/)
  assert.match(script, /var xR = \(lb\.right - ib\.left\) - 5/)
})

test("desktop audit route targets the calendar while mobile keeps the CTA", () => {
  assert.match(html, /@media \(min-width:\s*961px\)\s*\{\s*\.audit__foot\s*\{\s*display:\s*none;\s*\}\s*\}/s)
  assert.match(script, /var calendarFrame = document\.querySelector\("\.booking-calendar__frame"\)/)
  assert.match(script, /var desktopCalendarTarget = window\.innerWidth > 960 && fb/)
  assert.match(script, /\? \(fb\.left \+ fb\.width \/ 2\) - ib\.left/)
  assert.match(script, /\? fb\.top - ib\.top/)
  assert.match(script, /: \(cb\.left \+ cb\.width \/ 2\) - ib\.left/)
  assert.match(script, /: \(cb\.top - ib\.top\) - 12/)
  assert.match(script, /var H = Math\.max\(ib\.height, byTop \+ 24\)/)
  assert.match(script, /arrow\.setAttribute\("d", desktopCalendarTarget \? "" :/)
})
