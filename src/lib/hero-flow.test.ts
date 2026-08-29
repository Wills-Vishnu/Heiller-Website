import { describe, expect, it } from 'vitest';
import { FLOW_DURATION_MS, heroFlowNodes, heroFlowSegments } from './hero-flow';

describe('hero flow model', () => {
  it('preserves the approved eight-stage V2 sequence and timing', () => {
    expect(heroFlowNodes.map((node) => node.label)).toEqual([
      'Patient', 'Verify', 'Code', 'Claim',
      'Process', 'Payment', 'Report', 'Optimize',
    ]);
    expect(heroFlowNodes.map((node) => node.color)).toEqual([
      '#FFAB8D', '#FC7EC7', '#B3A5F5', '#B4E7BC',
      '#96D7FF', '#FAE261', '#97B6FF', '#4A2A76',
    ]);
    expect(heroFlowNodes.at(-1)?.activeText).toBe('#FFFFFF');
    expect(heroFlowSegments).toHaveLength(7);
    expect(FLOW_DURATION_MS).toBe(7700);
  });

  it('connects every adjacent stage exactly once', () => {
    expect(heroFlowSegments.map(({ from, to }) => `${from}:${to}`)).toEqual([
      'patient:verify', 'verify:code', 'code:claim', 'claim:process',
      'process:payment', 'payment:report', 'report:optimize',
    ]);
  });
});
