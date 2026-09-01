import { describe, expect, it } from 'vitest';
import {
  applyEdgeResistance,
  clampIndex,
  EDGE_RESISTANCE_MAX,
  getBaseOffset,
  getReleaseIndex,
  getSlotRole,
  resistOverdrag,
} from './leadership-carousel';

describe('clampIndex', () => {
  it('keeps an in-range index untouched', () => {
    expect(clampIndex(2, 4)).toBe(2);
  });

  it('clamps below zero', () => {
    expect(clampIndex(-3, 4)).toBe(0);
  });

  it('clamps past the last index', () => {
    expect(clampIndex(9, 4)).toBe(3);
  });

  it('is inert for an empty roster', () => {
    expect(clampIndex(2, 0)).toBe(0);
  });
});

describe('resistOverdrag', () => {
  it('is zero for no overshoot', () => {
    expect(resistOverdrag(0)).toBe(0);
    expect(resistOverdrag(-10)).toBe(0);
  });

  it('damps travel below the raw input', () => {
    expect(resistOverdrag(20)).toBeGreaterThan(0);
    expect(resistOverdrag(20)).toBeLessThan(20);
  });

  it('approaches the max but never reaches it, however far the pointer travels', () => {
    const large = resistOverdrag(5000);
    expect(large).toBeLessThan(EDGE_RESISTANCE_MAX);
    expect(large).toBeGreaterThan(EDGE_RESISTANCE_MAX * 0.9);
  });

  it('is monotonic — more overshoot never resists to a smaller value', () => {
    expect(resistOverdrag(10)).toBeLessThan(resistOverdrag(40));
    expect(resistOverdrag(40)).toBeLessThan(resistOverdrag(160));
  });
});

describe('applyEdgeResistance', () => {
  it('passes drags through untouched away from either edge', () => {
    expect(applyEdgeResistance(-40, { atStart: false, atEnd: false })).toBe(-40);
    expect(applyEdgeResistance(40, { atStart: false, atEnd: false })).toBe(40);
  });

  it('dampens a rightward (backward) drag at the first principal', () => {
    const resisted = applyEdgeResistance(50, { atStart: true, atEnd: false });
    expect(resisted).toBeGreaterThan(0);
    expect(resisted).toBeLessThan(50);
  });

  it('leaves a leftward (forward) drag alone at the first principal', () => {
    expect(applyEdgeResistance(-50, { atStart: true, atEnd: false })).toBe(-50);
  });

  it('dampens a leftward (forward) drag at the last principal', () => {
    const resisted = applyEdgeResistance(-50, { atStart: false, atEnd: true });
    expect(resisted).toBeLessThan(0);
    expect(resisted).toBeGreaterThan(-50);
  });

  it('leaves a rightward (backward) drag alone at the last principal', () => {
    expect(applyEdgeResistance(50, { atStart: false, atEnd: true })).toBe(50);
  });
});

describe('getBaseOffset', () => {
  it('is zero at the first slide', () => {
    expect(getBaseOffset(0, 300)).toBe(0);
  });

  it('steps back by exactly one pitch per index', () => {
    expect(getBaseOffset(2, 300)).toBe(-600);
  });
});

describe('getReleaseIndex', () => {
  const base = { activeIndex: 1, length: 4, slotPitch: 300 };

  it('snaps back when the drag is both too short and too slow', () => {
    expect(getReleaseIndex({ ...base, dragDelta: -10, velocity: 0.05 })).toBe(1);
  });

  it('advances one principal on a leftward drag past the distance threshold', () => {
    expect(getReleaseIndex({ ...base, dragDelta: -80, velocity: 0.05 })).toBe(2);
  });

  it('goes back one principal on a rightward drag past the distance threshold', () => {
    expect(getReleaseIndex({ ...base, dragDelta: 80, velocity: 0.05 })).toBe(0);
  });

  it('advances on a fast flick even with little travel', () => {
    expect(getReleaseIndex({ ...base, dragDelta: -20, velocity: -0.6 })).toBe(2);
  });

  it('never skips more than one principal regardless of drag size', () => {
    expect(getReleaseIndex({ ...base, dragDelta: -900, velocity: -3 })).toBe(2);
  });

  it('clamps forward motion at the last principal', () => {
    expect(getReleaseIndex({ activeIndex: 3, length: 4, slotPitch: 300, dragDelta: -200, velocity: -1 })).toBe(3);
  });

  it('clamps backward motion at the first principal', () => {
    expect(getReleaseIndex({ activeIndex: 0, length: 4, slotPitch: 300, dragDelta: 200, velocity: 1 })).toBe(0);
  });

  it('is a no-op for a degenerate (zero-width) track', () => {
    expect(getReleaseIndex({ ...base, slotPitch: 0, dragDelta: -900, velocity: -3 })).toBe(1);
  });
});

describe('getSlotRole', () => {
  it('labels the active slot', () => {
    expect(getSlotRole(1, 1, 7)).toBe('active');
  });

  it('labels the immediate next slot', () => {
    expect(getSlotRole(2, 1, 7)).toBe('next');
  });

  it('labels the second preview slot', () => {
    expect(getSlotRole(3, 1, 7)).toBe('next2');
  });

  it('hides slots already passed', () => {
    expect(getSlotRole(0, 2, 7)).toBe('hidden');
  });

  it('hides slots beyond the second preview', () => {
    expect(getSlotRole(4, 0, 7)).toBe('hidden');
  });

  it('wraps: slot 0 is next when last person (index 6) is active', () => {
    expect(getSlotRole(0, 6, 7)).toBe('next');
  });

  it('wraps: slot 1 is next2 when last person (index 6) is active', () => {
    expect(getSlotRole(1, 6, 7)).toBe('next2');
  });
});
