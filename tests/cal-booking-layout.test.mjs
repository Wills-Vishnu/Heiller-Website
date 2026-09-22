import test from "node:test"
import assert from "node:assert/strict"
import { getCalEmbedLayout, getReportedCalHeight } from "../cal-booking-layout.js"

test("uses Cal's larger inline-reported height", () => {
  assert.equal(getReportedCalHeight(300, "570px"), 570)
})

test("falls back to the measured height when the inline height is invalid", () => {
  assert.equal(getReportedCalHeight(300, "auto"), 300)
})

test("fills wide rails from the native Cal panel width", () => {
  assert.deepEqual(getCalEmbedLayout(1250, 570, 1440), {
    scale: 1250 / 1040,
    nativeWidth: 1040,
    scaledHeight: (570 - 64) * (1250 / 1040),
  })
})

test("caps desktop scale at 1.26", () => {
  const layout = getCalEmbedLayout(1400, 570, 1600)
  assert.equal(layout.scale, 1.26)
  assert.equal(layout.nativeWidth, 1400 / 1.26)
})

test("keeps tablet and mobile unscaled", () => {
  assert.deepEqual(getCalEmbedLayout(900, 570, 1200), {
    scale: 1,
    nativeWidth: 900,
    scaledHeight: 570,
  })
})
