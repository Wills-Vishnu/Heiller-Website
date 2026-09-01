import { describe, expect, it } from 'vitest';
import { getMetricFrameTime, getMetricSampleWindow, METRIC_MESH_PALETTE } from './metric-mesh-renderer';

describe('metric mesh helpers', () => {
  it('uses the approved orange numeric gradient palette', () => {
    expect(METRIC_MESH_PALETTE).toEqual([
      [1, 0.357, 0.208],
      [1, 0.522, 0.561],
      [1, 0.42, 0.286],
      [0.961, 0.69, 0.42],
      [1, 0.733, 0.541],
    ]);
  });

  it('gives each metric a different sample window and freezes reduced motion', () => {
    expect(getMetricSampleWindow(0)).not.toEqual(getMetricSampleWindow(1));
    expect(getMetricSampleWindow(2)).not.toEqual(getMetricSampleWindow(3));
    expect(getMetricFrameTime(5000, true)).toBe(12);
    expect(getMetricFrameTime(5000, false)).toBe(5);
  });
});
