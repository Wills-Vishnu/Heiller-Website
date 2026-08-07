/**
 * A deliberately un-reactive scroll store.
 *
 * WHY NOT REACT STATE / CONTEXT / ZUSTAND?
 * `SmoothScrollProvider` writes progress, velocity and pointer position into
 * this mutable singleton on every Lenis tick — which on a high-refresh
 * trackpad can exceed 120 Hz. Routing that through React state would
 * re-render the component tree at that frequency for no benefit: nothing on
 * the page currently needs a value that updates *during* a scroll, only
 * values that update at scroll *boundaries* (handled by GSAP's own
 * ScrollTrigger instances inside each section) or that persist across
 * renders without triggering one (`reducedMotion`, read once per animation
 * setup).
 *
 * Kept intentionally small. This file used to also carry the render budget
 * for a WebGL background layer (`SCENE_BUDGET`, `detectQuality`,
 * `SceneQuality`) — that layer has been removed from the site, so those
 * exports went with it rather than being left as dead weight.
 */

import { CHAPTER_COUNT } from './site';

export interface ScrollState {
  /** Normalised progress across the entire document, 0..1. */
  progress: number;
  /** Signed scroll velocity in px/frame, smoothed. */
  velocity: number;
  /** Fractional chapter position, 0..CHAPTER_COUNT-1. Informational. */
  chapter: number;
  /** Smoothed pointer position in normalised device coords, -1..1. */
  pointerX: number;
  pointerY: number;
  /** Raw pointer target; consumers may damp toward it themselves. */
  targetPointerX: number;
  targetPointerY: number;
  /** True when the OS requests reduced motion. */
  reducedMotion: boolean;
}

export const scrollState: ScrollState = {
  progress: 0,
  velocity: 0,
  chapter: 0,
  pointerX: 0,
  pointerY: 0,
  targetPointerX: 0,
  targetPointerY: 0,
  reducedMotion: false,
};

/* -------------------------------------------------------------------------- */
/* Chapter change notification                                                 */
/* -------------------------------------------------------------------------- */

type ChapterListener = (chapterIndex: number) => void;

const chapterListeners = new Set<ChapterListener>();
let lastEmittedChapter = -1;

/**
 * Subscribe to integer chapter boundaries. Returns an unsubscribe function.
 * Safe to call from `useEffect`. Nothing in the current codebase uses this,
 * but it costs nothing to keep — any future component that needs to react to
 * "the reader has reached section N" without a dedicated ScrollTrigger can
 * hook in here instead of re-deriving chapter math.
 */
export function onChapterChange(listener: ChapterListener): () => void {
  chapterListeners.add(listener);
  if (lastEmittedChapter >= 0) listener(lastEmittedChapter);
  return () => chapterListeners.delete(listener);
}

/**
 * Called by `SmoothScrollProvider` on every Lenis tick. Keep it cheap.
 */
export function setScrollProgress(progress: number, velocity: number): void {
  scrollState.progress = progress;
  scrollState.velocity = velocity;
  scrollState.chapter = progress * (CHAPTER_COUNT - 1);

  const nearest = Math.round(scrollState.chapter);
  if (nearest !== lastEmittedChapter) {
    lastEmittedChapter = nearest;
    for (const listener of chapterListeners) listener(nearest);
  }
}

export function setPointerTarget(x: number, y: number): void {
  scrollState.targetPointerX = x;
  scrollState.targetPointerY = y;
}
