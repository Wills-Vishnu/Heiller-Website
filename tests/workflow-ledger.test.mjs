import assert from "node:assert/strict"
import test from "node:test"
import { LEDGER_CTA_GAP, buildCenterSpine, buildSerpentineRoute, getLedgerAmplitude, getLedgerProgress, smoothProgress } from "../workflow-ledger.js"

test("builds the centered spine and final chevron", () => {
  assert.deepEqual(buildCenterSpine({ x: 200, startY: 30, endY: 430 }), {
    d: "M 200 30 L 200 430",
    arrow: "M 193.5 422 L 200 430 L 206.5 422",
  })
})

test("clamps ledger scroll progress", () => {
  assert.equal(getLedgerProgress({ top: 720, bottom: 1400, viewportHeight: 1000 }), 0)
  assert.equal(getLedgerProgress({ top: -600, bottom: 400, viewportHeight: 1000 }), 1)
  assert.ok(getLedgerProgress({ top: -150, bottom: 850, viewportHeight: 1000 }) < 0.7)
})

test("scales ledger amplitude from narrow mobile through desktop", () => {
  assert.equal(getLedgerAmplitude(320), 12)
  assert.equal(getLedgerAmplitude(800), 20)
  assert.equal(getLedgerAmplitude(1600), 32)
})

test("builds a smooth alternating route that returns to the button center", () => {
  assert.deepEqual(buildSerpentineRoute({ x: 200, startY: 20, endY: 420, rowYs: [80, 160], amplitude: 24 }), {
    d: "M 200 20 C 200 50 176 50 176 80 C 176 120 224 120 224 160 C 224 290 200 290 200 420",
    arrow: "M 193.5 412 L 200 420 L 206.5 412",
  })
})

test("keeps the workflow arrow off the CTA surface", () => {
  assert.equal(LEDGER_CTA_GAP, 16)
})

test("smoothly approaches the target progress", () => {
  assert.equal(smoothProgress(0, 1, 0.16), 0.16)
  assert.equal(smoothProgress(0.9995, 1, 0.16), 1)
})
