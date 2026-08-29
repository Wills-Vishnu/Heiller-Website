/**
 * Drag maths for the leadership carousel.
 *
 * Circular/infinite version: every function wraps around the roster end
 * rather than clamping, so the carousel has no hard start or end.
 *
 * Kept out of the component so the boundary-resistance, release-threshold
 * and slot-layout rules can be unit-tested without a layout engine or a
 * pointer-event simulator.
 */

/** Furthest a boundary drag can visually travel, in pixels. No longer used
 *  for true edges (the carousel is now infinite), but kept so the import
 *  still compiles if any legacy code references it. */
export const EDGE_RESISTANCE_MAX = 72;

/** A release must cover at least this fraction of one slot's pitch to advance. */
export const RELEASE_DISTANCE_RATIO = 0.18;

/** ...or be moving at least this fast (px/ms) to advance on a quick flick despite a short drag. */
export const RELEASE_VELOCITY_THRESHOLD = 0.45;

/** Which edge, if either, the active slide currently sits on. */
export type EdgeState = {
  readonly atStart: boolean;
  readonly atEnd: boolean;
};

/**
 * Wraps an index into `[0, length - 1]` using modulo.
 * This replaces the old clampIndex for circular navigation.
 * Also exported as `clampIndex` for backwards-compatible imports.
 */
export function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

/** Backwards-compatible alias — all existing call sites get wrapping for free. */
export const clampIndex = wrapIndex;

/**
 * Rubber-bands a positive overshoot (kept for API compatibility).
 * In the circular carousel this is no longer called because there are no
 * hard edges, but external code may still import it.
 */
export function resistOverdrag(overshoot: number, max: number = EDGE_RESISTANCE_MAX): number {
  if (overshoot <= 0) return 0;
  return (overshoot / (overshoot + max)) * max;
}

/**
 * In the infinite carousel there are no edges — the drag always passes
 * through 1:1. The `edge` parameter is kept for API compatibility.
 */
export function applyEdgeResistance(rawDelta: number, _edge: EdgeState, _max: number = EDGE_RESISTANCE_MAX): number {
  return rawDelta;
}

/** The track's resting offset for a given active index — one pitch per step, left. */
export function getBaseOffset(activeIndex: number, slotPitch: number): number {
  return activeIndex === 0 ? 0 : -(activeIndex * slotPitch);
}

export type ReleaseInput = {
  readonly activeIndex: number;
  readonly length: number;
  /** Final drag distance in px. Negative = dragged left (forward). */
  readonly dragDelta: number;
  /** Signed px/ms at release. Negative = flung left (forward). */
  readonly velocity: number;
  /** Width of one step along the track, in px. */
  readonly slotPitch: number;
};

/**
 * Decides where a drag release lands. Advances or retreats by exactly one
 * principal and wraps circularly — dragging past the last person lands on
 * the first, dragging before the first lands on the last.
 */
export function getReleaseIndex({ activeIndex, length, dragDelta, velocity, slotPitch }: ReleaseInput): number {
  if (slotPitch <= 0 || length <= 0) return wrapIndex(activeIndex, length);

  const meetsDistance = Math.abs(dragDelta) / slotPitch >= RELEASE_DISTANCE_RATIO;
  const meetsVelocity = Math.abs(velocity) >= RELEASE_VELOCITY_THRESHOLD;
  if (!meetsDistance && !meetsVelocity) return wrapIndex(activeIndex, length);

  const direction = dragDelta !== 0 ? dragDelta : velocity;
  const step = direction < 0 ? 1 : -1;
  return wrapIndex(activeIndex + step, length);
}

export type SlotRole = 'active' | 'next' | 'next2' | 'hidden';

/**
 * Where a given slot sits relative to the active one — now circular.
 *
 * Slots at offset +1 and +2 (wrapping) are 'next' and 'next2'.
 * Everything else is 'hidden'.
 *
 * This means:
 *   - When Jijin (index 6) is active, slot 0 (Karthik) gets offset = (0 - 6 + 7) % 7 = 1 → 'next'
 *   - Slot 1 (Prabhu) gets offset = (1 - 6 + 7) % 7 = 2 → 'next2'
 *   - All others are 'hidden'
 */
export function getSlotRole(slotIndex: number, activeIndex: number, length: number): SlotRole {
  if (length <= 0) return 'hidden';
  const offset = ((slotIndex - activeIndex) % length + length) % length;
  if (offset === 0) return 'active';
  if (offset === 1) return 'next';
  if (offset === 2) return 'next2';
  return 'hidden';
}
