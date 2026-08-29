'use client';

import { useEffect, useRef, useState } from 'react';
import type { Person } from '@/lib/team-content';
import {
  applyEdgeResistance,
  getBaseOffset,
  getReleaseIndex,
  getSlotRole,
  wrapIndex,
} from '@/lib/leadership-carousel';
import { LeadershipPortraitCard } from './LeadershipPortraitCard';
import styles from './team.module.css';

/** Pointer must move at least this far before a gesture commits to being a drag. */
const MOVE_LOCK_PX = 4;

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  /** Last computed drag delta — reused as the release distance. */
  delta: number;
  lastX: number;
  lastT: number;
  velocity: number;
  /** Undecided until the gesture proves itself horizontal (vs. a vertical scroll). */
  locked: boolean;
};

/**
 * The draggable strip: one oversized active portrait with up to two shrinking
 * previews, plus circular/infinite wrapping so the last person leads back
 * to the first in both directions.
 *
 * Circular strategy: the DOM always holds all real cards in order. When the
 * active card is near the end of the array, the "next" slots wrap around to
 * indices 0, 1 … — `getSlotRole` handles that mapping. The track's visual
 * offset is anchored to `activeIndex` exactly as before; what changes is that
 * releasing at the end wraps to 0 instead of stopping.
 *
 * The live drag is applied by mutating `trackRef` directly (not through React
 * state) to keep latency at zero — state updates go through a render, a render
 * is the delay that makes a drag feel like it's chasing the pointer. `activeIndex`
 * (and everything downstream — selector, identity block, description) remains
 * the single React source of truth.
 */
export function LeadershipCarousel({
  people,
  activeIndex,
  onChangeIndex,
}: {
  people: readonly Person[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const pitchRef = useRef(0);
  /**
   * A pointerdown that ends up dragging a preview card still ends in a
   * native `click` on whatever element is under the pointer at release.
   * Set the instant a gesture crosses the move-lock threshold, read (and
   * cleared) by the capturing click handler below, one JS task later.
   */
  const justDraggedRef = useRef(false);

  const [pitch, setPitch] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Measures one step of the track live via an invisible probe —
  // the actual widths are CSS clamp()s that shift with viewport size.
  useEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      pitchRef.current = width;
      setPitch(width);
    });
    observer.observe(probe);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || dragging) return;
    // External activeIndex changes animate via the stylesheet's transition.
    track.style.transform = `translateX(${getBaseOffset(activeIndex, pitchRef.current)}px)`;
  }, [activeIndex, pitch, dragging]);

  const length = people.length;

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      delta: 0,
      lastX: event.clientX,
      lastT: event.timeStamp,
      velocity: 0,
      locked: false,
    };
    setDragging(true);
    track.style.transition = 'none';

    if (event.pointerType !== 'touch') event.preventDefault();

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  }

  function handlePointerMove(event: PointerEvent) {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track || event.pointerId !== drag.pointerId) return;

    const rawDx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (!drag.locked) {
      if (Math.abs(rawDx) < MOVE_LOCK_PX && Math.abs(dy) < MOVE_LOCK_PX) return;
      // Predominantly vertical gesture — let the browser handle scrolling.
      if (Math.abs(dy) > Math.abs(rawDx)) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
        dragRef.current = null;
        setDragging(false);
        track.style.transition = '';
        return;
      }
      drag.locked = true;
      justDraggedRef.current = true;
    }

    if (event.cancelable) event.preventDefault();

    const dt = event.timeStamp - drag.lastT;
    if (dt > 0) drag.velocity = (event.clientX - drag.lastX) / dt;
    drag.lastX = event.clientX;
    drag.lastT = event.timeStamp;

    // Circular: no edge resistance — drag passes through 1:1 in both directions.
    const resisted = applyEdgeResistance(rawDx, { atStart: false, atEnd: false });
    drag.delta = resisted;
    track.style.transform = `translateX(${getBaseOffset(activeIndex, pitchRef.current) + resisted}px)`;
  }

  function handlePointerUp(event: PointerEvent) {
    const drag = dragRef.current;
    const track = trackRef.current;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
    if (!drag || event.pointerId !== drag.pointerId) return;
    dragRef.current = null;

    const target = drag.locked
      ? getReleaseIndex({ activeIndex, length, dragDelta: drag.delta, velocity: drag.velocity, slotPitch: pitchRef.current })
      : activeIndex;

    if (track) {
      track.style.transition = '';
      track.style.transform = `translateX(${getBaseOffset(target, pitchRef.current)}px)`;
    }
    setDragging(false);
    if (target !== activeIndex) onChangeIndex(target);
  }

  /**
   * Swallows clicks that followed a real drag (the browser fires a native
   * click on pointer-up regardless). Ordinary taps on preview cards, which
   * never cross the move-lock threshold, are untouched.
   */
  function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!justDraggedRef.current) return;
    justDraggedRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onChangeIndex(wrapIndex(activeIndex - 1, length));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      onChangeIndex(wrapIndex(activeIndex + 1, length));
    }
  }

  return (
    <div
      ref={viewportRef}
      className={styles.leadershipViewport}
      data-dragging={dragging || undefined}
      onPointerDown={handlePointerDown}
      onClickCapture={handleClickCapture}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Leadership team, drag or use the arrow keys to browse"
    >
      <span ref={probeRef} className={styles.leadershipPitchProbe} aria-hidden="true" />
      <div ref={trackRef} className={styles.leadershipTrack}>
        {people.map((person, index) => (
          <LeadershipPortraitCard
            key={person.id}
            person={person}
            role={getSlotRole(index, activeIndex, length)}
            onSelect={() => onChangeIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
