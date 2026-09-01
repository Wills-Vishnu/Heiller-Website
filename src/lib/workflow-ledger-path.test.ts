import { describe, expect, it } from 'vitest';
import { buildCenterSpine, chevron } from './workflow-ledger-path';

const base = {
  x: 500,
  startY: 40,
  endY: 700,
  arrowYs: [150, 300, 450, 600],
};

describe('chevron', () => {
  it('points down onto its anchor with both wings above it', () => {
    expect(chevron(100, 200)).toBe('M 93.5 192 L 100 200 L 106.5 192');
  });
});

describe('buildCenterSpine', () => {
  it('draws one straight vertical run down the given centre', () => {
    const { d } = buildCenterSpine(base);
    expect(d).toBe(`M ${base.x} ${base.startY} L ${base.x} ${base.endY}`);
  });

  it('places one chevron per requested position, all on the centre line', () => {
    const { arrows } = buildCenterSpine(base);
    expect(arrows).toHaveLength(base.arrowYs.length);
    arrows.forEach((arrow, index) => {
      expect(arrow).toBe(chevron(base.x, base.arrowYs[index]));
    });
  });

  it('drops arrows that would fall outside the run', () => {
    const { arrows } = buildCenterSpine({ ...base, arrowYs: [-20, 150, 900] });
    expect(arrows).toEqual([chevron(base.x, 150)]);
  });

  it('handles a spine with no arrows at all', () => {
    expect(buildCenterSpine({ ...base, arrowYs: [] }).arrows).toEqual([]);
  });
});
