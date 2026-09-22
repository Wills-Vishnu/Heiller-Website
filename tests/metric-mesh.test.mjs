import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import { METRIC_MESH_PALETTE, getMetricFrameTime, getMetricSampleWindow } from "../metric-mesh.js"

const source = readFileSync(new URL("../metric-mesh.js", import.meta.url), "utf8")

test("uses the V3 blue lavender and gold palette", () => {
  assert.deepEqual(METRIC_MESH_PALETTE[0], [0.812, 0.878, 1])
  assert.deepEqual(METRIC_MESH_PALETTE[3], [0.984, 0.788, 0.416])
})

test("freezes reduced motion and distributes sample windows", () => {
  assert.equal(getMetricFrameTime(5000, true), 12)
  assert.deepEqual(getMetricSampleWindow(0, 4), { x: 0, y: 0.38, width: 0.62, height: 0.62 })
  assert.deepEqual(getMetricSampleWindow(3, 4), { x: 0.38, y: 0, width: 0.62, height: 0.62 })
})

test("left aligns result values while retaining centered workflow metrics", () => {
  assert.match(source, /const isResultMetric = Boolean\(target\.closest\("\.v3-metrics"\)\)/)
  assert.match(source, /context\.textAlign = isResultMetric \? "left" : "center"/)
  assert.match(source, /const textX = isResultMetric \? 0 : width \/ 2/)
  assert.match(source, /context\.fillText\(fallback\.textContent\.trim\(\), textX, height \/ 2\)/)
})
