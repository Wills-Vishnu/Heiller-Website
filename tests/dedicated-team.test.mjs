import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")
const motion = await readFile(new URL("../dedicated-team.ts", import.meta.url), "utf8").catch(() => "")

test("dedicated team is positioned before the imported V3 sequence", () => {
  const services = html.indexOf('<section class="services" id="services">')
  const dedicated = html.indexOf('<section class="dedicated-team"')
  const why = html.indexOf('<section class="v3-why"')

  assert.ok(services > -1 && dedicated > services && why > dedicated)
})

test("dedicated team contains the exact V3 pill set", () => {
  const section = html.match(/<section class="dedicated-team"[\s\S]*?<\/section>/)?.[0] ?? ""

  for (const label of [
    "Credentialing",
    "Patient registration",
    "Coding",
    "Billing",
    "Denial management",
    "A/R follow-up",
    "Eligibility",
    "Revenue reporting",
    "Authorization",
  ]) assert.match(section, new RegExp(`>${label}<`))

  assert.equal((section.match(/data-dedicated-pill/g) ?? []).length, 9)
  assert.equal((section.match(/>Authorization<\/span>/g) ?? []).length, 1)
  assert.match(section, /--pill-from:#C8BBFF;--pill-to:#8F79F2;--pill-accent:#E0D5FF/)
  assert.match(motion, /const PILL_COUNT = 9/)
  assert.match(section, /aria-labelledby="dedicated-team-title"/)
  assert.match(section, /class="dedicated-team__pills" aria-hidden="true"/)
})

test("dedicated team retains V3 palettes and grain", () => {
  for (const color of [
    "#f49cff", "#ff9b7d", "#8ee8b8", "#ffe889",
    "#91b5ff", "#ff9ac9", "#ffc06c", "#9be8d6",
  ]) assert.match(html, new RegExp(color))

  assert.match(html, /\.dedicated-team__pill::after/)
  assert.match(html, /feTurbulence/)
})

test("dedicated team retains responsive depth and reduced-motion behavior", () => {
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*\.dedicated-team__field/)
  assert.match(motion, /prefers-reduced-motion:\s*reduce/)
  assert.match(motion, /IntersectionObserver/)
  assert.match(motion, /ResizeObserver/)
  assert.match(motion, /MAX_MOBILE_ORBIT_BLUR_PX\s*=\s*2\.5/)
})

test("dedicated team orbit only animates while visible", () => {
  assert.match(motion, /const shouldAnimate = \(\): boolean => pageVisible && inView && !reducedMotion/)
  assert.match(motion, /const startOrbit = \(\): void => \{[\s\S]*?window\.requestAnimationFrame\(renderOrbit\)/)
  assert.match(motion, /const stopOrbit = \(\): void => \{[\s\S]*?window\.cancelAnimationFrame\(frame\)/)
  assert.match(motion, /rootMargin:\s*"0px"/)
  assert.doesNotMatch(motion, /frame = window\.requestAnimationFrame\(renderOrbit\)\s*\n\s*window\.addEventListener\("pagehide"/)
})

test("dedicated team uses the approved tighter preceding gap", () => {
  assert.match(html, /\.services\s*\{[^}]*padding-bottom:\s*96px;/s)
  assert.match(html, /@media\s*\(max-width:\s*960px\)[\s\S]*?\.services\s*\{[^}]*padding-bottom:\s*64px;/s)
  assert.match(html, /@media\s*\(max-width:\s*640px\)[\s\S]*?\.services\s*\{[^}]*padding-bottom:\s*48px;/s)
  assert.match(html, /\.dedicated-team\s*\{[^}]*padding:\s*clamp\(40px,\s*3\.5vw,\s*64px\)\s+clamp\(20px,\s*3\.2vw,\s*65px\)\s+clamp\(52px,\s*4\.8vw,\s*90px\);/s)
  assert.match(html, /@media\s*\(max-width:\s*767px\)[\s\S]*?\.dedicated-team\s*\{\s*padding:\s*40px 20px 52px;/s)
})

test("dedicated team idles at one orbit every 28 seconds", () => {
  assert.match(motion, /IDLE_ORBIT_DURATION_SECONDS\s*=\s*28/)
  assert.match(motion, /IDLE_ANGULAR_VELOCITY\s*=\s*TAU\s*\/\s*IDLE_ORBIT_DURATION_SECONDS/)
  assert.match(motion, /IDLE_ANGULAR_VELOCITY\s*\+\s*getTargetAngularVelocity\(sampledScrollVelocity\)/)
})

test("dedicated team heading is five pixels smaller across its responsive scale", () => {
  assert.match(html, /\.dedicated-team h2\s*\{[^}]*font-size:\s*clamp\(36px,\s*calc\(5\.1vw\s*-\s*5px\),\s*83px\);/s)
  assert.match(html, /@media\s*\(max-width:\s*767px\)[\s\S]*?\.dedicated-team h2\s*\{\s*font-size:\s*36px;\s*\}/s)
  assert.doesNotMatch(html, /\.dedicated-team h2\s*\{[^}]*font-size:\s*clamp\(41px,\s*5\.1vw,\s*88px\);/s)
})

test("dedicated team heading uses the shared gradient text treatment", () => {
  const section = html.match(/<section class="dedicated-team"[\s\S]*?<\/section>/)?.[0] ?? ""

  assert.match(section, /<span class="dedicated-team__title-copy">\s*<span class="dedicated-team__title-line">A dedicated team,<\/span>\s*<span class="dedicated-team__title-line">fully embedded<\/span>\s*<\/span>/)
  assert.match(section, /<canvas class="dedicated-team__title-gl" aria-hidden="true"><\/canvas>/)
  assert.match(html, /\.dedicated-team__title-gl\s*\{[^}]*position:\s*absolute;[^}]*pointer-events:\s*none;/s)
  assert.match(html, /\.dedicated-team--title-shader \.dedicated-team__title-copy\s*\{\s*color:\s*transparent;/s)
  assert.match(html, /readyClass:\s*"dedicated-team--title-shader"/)
  assert.match(html, /lines:\s*"\.dedicated-team__title-line"/)
})

test("dedicated team gradient heading uses a stronger lower contrast gradient", () => {
  const copyRule = html.match(/\.dedicated-team__title-copy\s*\{[^}]*\}/s)?.[0] ?? ""
  const canvasRule = html.match(/\.dedicated-team__title-gl\s*\{[^}]*\}/s)?.[0] ?? ""

  assert.doesNotMatch(copyRule, /-webkit-text-stroke|text-shadow/)
  assert.doesNotMatch(canvasRule, /filter:\s*[\s\S]*drop-shadow/)
  assert.match(html, /contrastGradient:\s*\[[\s\S]*rgba\(118,\s*104,\s*238,\s*0\.5\)[\s\S]*rgba\(236,\s*172,\s*54,\s*0\.62\)[\s\S]*\]/)
  assert.match(html, /g\.globalCompositeOperation\s*=\s*"source-atop";[\s\S]*g\.fillStyle\s*=\s*contrast;[\s\S]*g\.fillRect\(0,\s*0,\s*width,\s*height\);/)
})

test("dedicated team centers a large decorative inline mark", () => {
  const section = html.match(/<section class="dedicated-team"[\s\S]*?<\/section>/)?.[0] ?? ""
  const markRule = html.match(/\.dedicated-team__mark\s*\{[^}]*\}/s)?.[0] ?? ""
  assert.equal((section.match(/class="dedicated-team__mark"/g) ?? []).length, 1)
  assert.match(section, /<svg class="dedicated-team__mark"[^>]*aria-hidden="true"[^>]*focusable="false"[^>]*viewBox="47 -407\.5 406 406"/)
  assert.match(section, /<path[^>]*fill="currentColor"/)
  assert.match(markRule, /color:\s*#F1F2F4;/)
  assert.match(markRule, /width:\s*clamp\(360px,\s*54vw,\s*760px\);/)
  assert.match(markRule, /z-index:\s*0;/)
  assert.match(html, /\.dedicated-team h2\s*\{[^}]*z-index:\s*3;/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.dedicated-team__mark\s*\{\s*width:\s*min\(92vw,\s*420px\);/s)
})

test("dedicated team orbits across four explicit depth layers", () => {
  assert.match(motion, /getOrbitDepth\(x:\s*number\):\s*1\s*\|\s*4/)
  assert.match(motion, /return x < 0 \? 1 : 4/)
  assert.doesNotMatch(motion, /return x < 0 \? 1 : 3/)
})

test("dedicated team pills use the approved liquid-glass treatment", () => {
  const section = html.match(/<section class="dedicated-team"[\s\S]*?<\/section>/)?.[0] ?? ""
  const rule = html.match(/\.dedicated-team__pill\s*\{[^}]*\}/s)?.[0] ?? ""

  assert.equal((section.match(/class="dedicated-team__pill-label"/g) ?? []).length, 9)
  assert.match(rule, /border:\s*1px solid rgba\(255,\s*255,\s*255,\s*\.72\);/)
  assert.match(rule, /border-radius:\s*999px;/)
  assert.match(rule, /backdrop-filter:\s*blur\(14px\) saturate\(145%\);/)
  assert.match(rule, /-webkit-backdrop-filter:\s*blur\(14px\) saturate\(145%\);/)
  assert.match(rule, /box-shadow:[^;]*inset[^;]*0 9px 24px/s)
  assert.match(rule, /padding:\s*12px 20px 13px;/)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.dedicated-team__pill\s*\{\s*padding:\s*9px 14px;\s*font-size:\s*9px;/s)
  assert.doesNotMatch(rule, /(?:^|\n)\s*(?:width|height|min-width|min-height)\s*:/)
  assert.match(html, /\.dedicated-team__pill::before\s*\{[^}]*pointer-events:\s*none;/s)
  assert.match(html, /\.dedicated-team__pill::after\s*\{[^}]*pointer-events:\s*none;/s)
  assert.match(html, /\.dedicated-team__pill-label\s*\{[^}]*z-index:\s*1;/s)
  assert.match(html, /@supports not \(\(backdrop-filter:\s*blur\(1px\)\) or \(-webkit-backdrop-filter:\s*blur\(1px\)\)\)[\s\S]*?\.dedicated-team__pill\s*\{[^}]*background:/s)
  assert.doesNotMatch(motion, /pointer(?:down|move|up)/)
})
