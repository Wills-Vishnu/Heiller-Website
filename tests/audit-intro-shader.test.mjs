import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")

test("audit intro marketing copy is removed", () => {
  assert.doesNotMatch(html, /We find the revenue leaks\.|Then show you what to fix\./)
  assert.doesNotMatch(html, /audit__intro(?:-copy|-line|-gl)?|audit--intro-shader/)
  assert.match(html, /<h2 id="audit-title">See where revenue is getting stuck\.<\/h2>/)
})

test("hero shader exposes shared frames without another WebGL context", () => {
  assert.match(html, /window\.__heillerHeroShader\s*=\s*\{/)
  assert.match(html, /subscribe:\s*subscribe/)
  assert.match(html, /retain:\s*retain/)
  assert.match(html, /requestFrame:\s*requestRender/)
  assert.match(html, /preserveDrawingBuffer:\s*true/)
})

test("hero shader lower edge is feathered", () => {
  assert.match(html, /\.hero-bg\s*\{[^}]*transform:\s*translateY\(470px\) scaleY\(-0\.550\);[^}]*mask-image:\s*linear-gradient\(to bottom, transparent 0, rgba\(0, 0, 0, 0\.62\) 70px, #000 145px\);/s)
})

test("hero animation stays active while an external consumer is visible", () => {
  assert.match(html, /inView\s*\|\|\s*externalUsers\s*>\s*0/)
})

test("dedicated heading masks shared hero frames to its real text", () => {
  assert.match(html, /var hero = window\.__heillerHeroShader/)
  assert.match(html, /hero\.subscribe\(paint\)/)
  assert.match(html, /globalCompositeOperation\s*=\s*"source-in"/)
  assert.match(html, /readyClass:\s*"dedicated-team--title-shader"/)
  assert.match(html, /root\.classList\.add\(config\.readyClass\)/)
})

test("gradient text handles reduced motion with one shared frame", () => {
  assert.match(html, /prefers-reduced-motion:\s*reduce/)
  assert.match(html, /if\s*\(reduced\)[\s\S]*?releaseHero\(\)[\s\S]*?unsubscribe\(\)[\s\S]*?observer\.disconnect\(\)/)
})
