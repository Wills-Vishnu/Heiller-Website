import { describe, expect, it } from 'vitest';
import {
  canScrollNext,
  canScrollPrev,
  getMaxScroll,
  getScrollTarget,
  SCROLL_EPSILON,
} from './team-carousel';

const track = (scrollLeft: number) => ({ scrollLeft, scrollWidth: 2000, clientWidth: 800 });

describe('getMaxScroll', () => {
  it('is the overflow beyond the viewport', () => {
    expect(getMaxScroll(track(0))).toBe(1200);
  });

  it('never goes negative when the content fits', () => {
    expect(getMaxScroll({ scrollLeft: 0, scrollWidth: 600, clientWidth: 800 })).toBe(0);
  });
});

describe('canScrollPrev', () => {
  it('is false at rest', () => {
    expect(canScrollPrev(track(0))).toBe(false);
  });

  it('tolerates sub-pixel drift at the left edge', () => {
    expect(canScrollPrev(track(SCROLL_EPSILON))).toBe(false);
    expect(canScrollPrev(track(SCROLL_EPSILON + 1))).toBe(true);
  });
});

describe('canScrollNext', () => {
  it('is true while there is overflow left', () => {
    expect(canScrollNext(track(0))).toBe(true);
  });

  it('tolerates sub-pixel drift at the right edge', () => {
    expect(canScrollNext(track(1200 - SCROLL_EPSILON))).toBe(false);
    expect(canScrollNext(track(1199 - SCROLL_EPSILON))).toBe(true);
  });

  it('is false when every card already fits', () => {
    expect(canScrollNext({ scrollLeft: 0, scrollWidth: 600, clientWidth: 800 })).toBe(false);
  });
});

describe('getScrollTarget', () => {
  it('pages forward by one viewport', () => {
    expect(getScrollTarget(track(0), 'next')).toBe(800);
  });

  it('pages backward by one viewport', () => {
    expect(getScrollTarget(track(800), 'prev')).toBe(0);
  });

  it('clamps at the right edge instead of overshooting', () => {
    expect(getScrollTarget(track(1000), 'next')).toBe(1200);
  });

  it('clamps at the left edge instead of going negative', () => {
    expect(getScrollTarget(track(300), 'prev')).toBe(0);
  });
});
