/**
 * Scroll maths for the team-member carousel.
 *
 * Kept out of the component so the paging and edge-detection rules can be
 * tested without a layout engine — jsdom reports every scroll dimension as 0,
 * which makes DOM-level assertions worthless here.
 */

export type ScrollState = {
  readonly scrollLeft: number;
  readonly scrollWidth: number;
  readonly clientWidth: number;
};

export type ScrollDirection = 'prev' | 'next';

/**
 * Sub-pixel slack. Browsers routinely land a fractional pixel short of the
 * true end of a scroll container, and without this the "next" button stays
 * enabled forever at the right-hand edge.
 */
export const SCROLL_EPSILON = 2;

/** The furthest left the track can be scrolled. Never negative. */
export function getMaxScroll({ scrollWidth, clientWidth }: ScrollState): number {
  return Math.max(0, scrollWidth - clientWidth);
}

export function canScrollPrev(state: ScrollState): boolean {
  return state.scrollLeft > SCROLL_EPSILON;
}

export function canScrollNext(state: ScrollState): boolean {
  return state.scrollLeft < getMaxScroll(state) - SCROLL_EPSILON;
}

/**
 * Where a prev/next press should land. Pages by a full viewport width and
 * clamps to the track, so repeated presses settle on the ends rather than
 * overshooting into empty space.
 */
export function getScrollTarget(state: ScrollState, direction: ScrollDirection): number {
  const step = direction === 'next' ? state.clientWidth : -state.clientWidth;
  const target = state.scrollLeft + step;
  return Math.min(Math.max(target, 0), getMaxScroll(state));
}
