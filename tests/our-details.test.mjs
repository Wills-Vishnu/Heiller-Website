import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)
const html = await readFile(new URL("index.html", root), "utf8")
const css = await readFile(new URL("styles.css", root), "utf8")
const js = await readFile(new URL("our-details.js", root), "utf8")

test("Our Details section exists and is positioned directly after booking-calendar", () => {
  assert.match(html, /<section class="our-details" id="our-details"/)
  const bookingIndex = html.indexOf('id="booking-calendar"')
  const detailsIndex = html.indexOf('id="our-details"')
  const questionsIndex = html.indexOf('id="questions"')
  const footerIndex = html.indexOf('id="site-footer"')

  assert.ok(bookingIndex !== -1, "booking-calendar must exist")
  assert.ok(detailsIndex !== -1, "our-details must exist")
  assert.ok(questionsIndex !== -1, "questions must exist")
  assert.ok(
    bookingIndex < detailsIndex && detailsIndex < questionsIndex && questionsIndex < footerIndex,
    "our-details must be placed directly after booking-calendar and before questions"
  )
})

test("Our Details has centered header outside card matching other sections", () => {
  assert.match(html, /<header class="our-details__head">[\s\S]*?<div class="eyebrow"><i aria-hidden="true"><\/i><span>Contact &amp; location<\/span><\/div>[\s\S]*?<h2 id="our-details-title">Our details<\/h2>[\s\S]*?<\/header>/)
  assert.match(css, /\.our-details__head\s*\{[^}]*text-align:\s*center;/s)
  assert.match(css, /\.our-details__head \.eyebrow\s*\{[^}]*justify-content:\s*center;[^}]*margin-bottom:\s*24px;/s)
  assert.match(css, /\.our-details__head h2\s*\{[^}]*font-size:\s*clamp\(38px,\s*4\.3vw,\s*74px\);/s)
})

test("Our Details width matches the cal.com booking section", () => {
  assert.match(css, /\.our-details \.section-shell\s*\{[^}]*width:\s*min\(var\(--content-frame-max\),\s*calc\(100% - 2 \* var\(--content-frame-gutter\)\)\);[^}]*padding-inline:\s*0;/s)
  assert.match(css, /\.booking-calendar \.section-shell\s*\{[^}]*width:\s*min\(var\(--content-frame-max\),\s*calc\(100% - 2 \* var\(--content-frame-gutter\)\)\);/s)
})

test("Our Details card content contains office, hours, direct contact, and no x.com or 800 number", () => {
  assert.match(html, /OFFICE:/)
  assert.match(html, /3101 N\. CENTRAL AVE, STE 183 #7497,/)
  assert.match(html, /Phoenix, AZ, 85012, Maricopa, United States/)
  assert.match(html, /OFFICE HOURS:/)
  assert.match(html, /Monday – Friday/)
  assert.match(html, /8:00 AM – 6:00 PM MST/)
  assert.match(html, /Saturday – Sunday/)
  assert.match(html, /Closed/)
  assert.match(html, /href="mailto:connect@heillerrcm\.com"/)
  assert.doesNotMatch(html, /18004345537/)
  assert.doesNotMatch(html, /4809565010/)
  assert.match(html, /href="tel:\+15202311231"/)
  assert.match(html, /Direct:\s*<\/span>\s*<a[^>]*>\+1 520-231-1231<\/a>/)
  assert.match(html, /Direct inquiries answered within 2 business hours/)
  assert.match(html, /Open in Maps/)
  assert.match(html, /id="our-details-map"/)
  assert.match(html, /class="our-details__map-watermark"[^>]*>PHOENIX</)
  assert.match(html, /aria-label="Heiller on LinkedIn"/)
  assert.match(html, /aria-label="Heiller on Instagram"/)
  assert.doesNotMatch(html, /x\.com/)
})

test("Leaflet assets and our-details.js module are included", () => {
  assert.match(html, /leaflet@1\.9\.4\/dist\/leaflet\.css/)
  assert.match(html, /leaflet@1\.9\.4\/dist\/leaflet\.js/)
  assert.match(html, /<script type="module" src="\/our-details\.js"><\/script>/)
})

test("our-details.js initializes CARTO Voyager map tiles with user license key, top-right zoom, and custom beacon marker", () => {
  assert.match(js, /cartocdn\.com\/rastertiles\/voyager/)
  assert.match(js, /cb1_2jeu_1_c0503e1108327151a000e303/)
  assert.match(js, /position:\s*"topright"/)
  assert.match(js, /our-details__marker-ring/)
  assert.match(js, /our-details__marker-halo/)
  assert.match(js, /our-details__marker-dot/)
  assert.match(js, /33\.4839/)
  assert.match(js, /-112\.074/)
})

test("styles.css defines card layout, ultra-smooth middle blur fade, top-right zoom controls in front of map, subtopics gap, and animations", () => {
  assert.match(css, /\.our-details__card\s*\{[^}]*border-radius:\s*28px;/s)
  assert.match(css, /\.our-details__content\s*\{[^}]*gap:\s*32px;/s)
  assert.match(css, /\.our-details__map-fade\s*\{[^}]*backdrop-filter:\s*blur\(12px\);/s)
  assert.match(css, /\.our-details__map-fade\s*\{[^}]*mask-image:\s*linear-gradient/s)
  assert.match(css, /\.our-details__map \.leaflet-top\.leaflet-right\s*\{[^}]*right:\s*20px[^}]*z-index:\s*1000/s)
  assert.match(css, /\.our-details__map \.leaflet-control-zoom/)
  assert.match(css, /\.our-details__map-watermark/)
  assert.match(css, /@keyframes details-bubble-gradient/)
  assert.match(css, /@keyframes details-dot-shift/)
  assert.match(css, /\.our-details__hour-row--closed/)
  assert.match(css, /@keyframes pulse-halo/)
  assert.match(css, /@keyframes pulse-ring/)
})
