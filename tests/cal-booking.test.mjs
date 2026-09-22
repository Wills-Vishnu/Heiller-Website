import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)
const html = await readFile(new URL("index.html", root), "utf8")
const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"))
const readBookingModule = () => readFile(new URL("cal-booking.ts", root), "utf8").catch(() => "")

test("calendar-only section replaces Who we help", () => {
  assert.equal((html.match(/id="booking-calendar"/g) ?? []).length, 1)
  assert.equal((html.match(/data-cal-booking/g) ?? []).length, 1)
  assert.match(html, /<section class="booking-calendar" id="booking-calendar" aria-label="Book a free revenue audit">/)
  assert.match(html, /data-cal-link="heiller\/revenue-audit"/)
  assert.doesNotMatch(html, /class="audience"|id="who-we-help"|Independent practices|Specialty groups|Growing medical groups/)
})

test("V2 owns the approved Cal.com configuration", async () => {
  const bookingModule = await readBookingModule()

  assert.equal(packageJson.dependencies?.["@calcom/embed-snippet"], "^1.3.3")
  assert.match(html, /<script type="module" src="\/cal-booking\.ts"><\/script>/)
  assert.match(bookingModule, /@calcom\/embed-snippet/)
  assert.match(bookingModule, /heiller\/revenue-audit/)
  assert.match(bookingModule, /revenue-audit/)
  assert.match(bookingModule, /month_view/)
  assert.match(bookingModule, /theme:\s*["']light["']/)
  assert.equal((bookingModule.match(/#ff682c/g) ?? []).length, 2)
  assert.match(bookingModule, /hideEventTypeDetails:\s*false/)
  assert.match(bookingModule, /dataset\.calInitialized/)
})

test("Cal embed itself is square, overlaps desktop rails, and resets on mobile", () => {
  const sectionRule = html.match(/\.booking-calendar\s*\{[^}]*\}/s)?.[0] ?? ""
  const sectionRules = [...html.matchAll(/(?:^|\n)\s*\.booking-calendar(?:,|\s*\{)[\s\S]*?\}/g)].map(match => match[0]).join("\n")
  const frameRule = html.match(/\.booking-calendar__frame\s*\{[^}]*\}/s)?.[0] ?? ""

  assert.match(frameRule, /border-radius:\s*0/)
  assert.match(frameRule, /margin-inline:\s*-1px/)
  assert.match(frameRule, /width:\s*calc\(100% \+ 2px\)/)
  assert.doesNotMatch(sectionRule, /padding/)
  assert.doesNotMatch(sectionRules, /padding/)
  assert.doesNotMatch(frameRule, /border:\s*1px|background:|overflow:\s*hidden|min-height:/)
  assert.match(html, /\.booking-calendar \.section-shell\s*\{[^}]*width:\s*min\(var\(--content-frame-max\),\s*calc\(100% - 2 \* var\(--content-frame-gutter\)\)\);/s)
  assert.match(html, /\.booking-calendar__frame iframe[\s\S]*?border-radius:\s*0\s*!important/)
  assert.match(html, /@media \(max-width:\s*640px\)[\s\S]*?\.booking-calendar__frame\s*\{[^}]*margin-inline:\s*0;[^}]*width:\s*100%;/s)
  assert.doesNotMatch(html, /\.booking-calendar__frame\s*\{[^}]*min-height:/s)
})

test("wide desktop Cal embed fills the rails with measured uniform scaling", async () => {
  const bookingModule = await readBookingModule()
  assert.match(bookingModule, /getCalEmbedLayout/)
  assert.match(bookingModule, /new ResizeObserver/)
  assert.match(bookingModule, /new MutationObserver/)
  assert.match(bookingModule, /iframe\.offsetHeight/)
  assert.match(bookingModule, /getReportedCalHeight/)
  assert.match(bookingModule, /iframe\.style\.height/)
  assert.match(bookingModule, /iframeMutationObserver\.observe\(iframe,\s*\{\s*attributes:\s*true,\s*attributeFilter:\s*\["style"\]\s*\}\)/s)
  for (const property of [
    "--cal-embed-scale",
    "--cal-embed-native-width",
    "--cal-embed-native-height",
    "--cal-embed-scaled-height",
  ]) assert.match(bookingModule, new RegExp(property))

  assert.match(html, /@media \(min-width:\s*1201px\)[\s\S]*?\.booking-calendar__frame\[data-cal-scaled\]\s*\{[^}]*height:\s*var\(--cal-embed-scaled-height\);[^}]*overflow:\s*hidden;/s)
  assert.match(html, /\.booking-calendar__frame\[data-cal-scaled\] iframe\s*\{[^}]*transform:\s*scale\(var\(--cal-embed-scale\)\);[^}]*transform-origin:\s*top center;/s)
})

test("audit calls to action route to the calendar", () => {
  assert.match(html, /class="audit__cta" id="audit-cta" href="#booking-calendar"/)
  assert.match(html, /class="site-footer__link" href="#booking-calendar">Book an audit<\/a>/)
  assert.match(html, /class="site-footer__link" href="#revenue-audit">Revenue audit<\/a>/)
})
