'use client';

import { useCallback, useRef, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Card with a pointer-tracking spotlight and an illuminated border edge.
 *
 * WHY NOT `TiltCard`
 * The landing page's cards tilt in 3D, which is great for a nine-item grid of
 * short marketing copy. The interior pages are dense reference text — a
 * compliance officer reading a subprocessor policy does not want the paragraph
 * rotating under their cursor. This gives the same "alive under the pointer"
 * quality with zero geometric distortion: only light moves.
 *
 * TWO LAYERS
 *   GLOW    a soft radial that follows the cursor inside the card.
 *   EDGE    a second radial clipped to the border ring, so the outline itself
 *           lights up near the pointer. This is the detail that reads as
 *           expensive — a glow alone looks like a generic hover state, but a
 *           border that catches light looks like a physical material.
 *
 * PERFORMANCE
 * Position is written straight to two CSS custom properties with
 * `style.setProperty`, and the fade in/out is a plain CSS transition on those
 * same properties. No GSAP, no React state — moving the pointer across a grid
 * of these renders nothing and allocates nothing.
 *
 * That is deliberate rather than lazy. `pointermove` already fires at pointer
 * frequency, so there is nothing to interpolate; routing it through a tween
 * would add a frame of latency and make the light lag the cursor. Custom
 * properties also let the browser handle the fade on the compositor without
 * either layer ever hitting React.
 *
 * `prefers-reduced-motion` disables the tracking while leaving the card's
 * static styling intact, and the handlers are no-ops on touch since a device
 * that never hovers never fires them.
 */
export function SpotlightCard({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  /* `Tag` is a union of three intrinsic elements, so JSX computes the `ref`
     prop as an intersection of `div`'s, `li`'s and `article`'s ref types —
     a plain `RefObject<HTMLDivElement>` (even cast) can never satisfy that
     intersection, which is what the earlier version of this file hit as a
     build error. A callback ref typed to the common `HTMLElement` base does
     satisfy it: function parameters are contravariant, so a callback willing
     to accept `HTMLElement | null` is a valid substitute anywhere a callback
     expecting one of its narrower subtypes is required. No cast needed. */
  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (reducedMotion) return;
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    },
    [reducedMotion],
  );

  const handleEnter = useCallback(() => {
    if (reducedMotion) return;
    // Faded via CSS transition rather than switched, so the light arrives
    // rather than appears.
    ref.current?.style.setProperty('--spot-opacity', '1');
  }, [reducedMotion]);

  const handleLeave = useCallback(() => {
    ref.current?.style.setProperty('--spot-opacity', '0');
  }, []);

  return (
    <Tag
      ref={setRef}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      className={`group/spot relative isolate overflow-hidden ${className}`}
      style={
        {
          '--spot-x': '50%',
          '--spot-y': '50%',
          '--spot-opacity': 0,
        } as React.CSSProperties
      }
    >
      {/* Border light. `padding: 1px` + `mask` composite leaves only the ring
          lit — a plain bordered element cannot have a gradient border that
          responds to the pointer. */}
      {/* Both layers transition `opacity`, whose value is read from
          `--spot-opacity`. Changing a custom property recomputes any property
          that references it, and the transition fires on that recomputation —
          so the fade is entirely declarative and the handlers only ever set a
          string. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] p-px opacity-[var(--spot-opacity)] transition-opacity duration-500 ease-out"
        style={{
          background:
            'radial-gradient(240px circle at var(--spot-x) var(--spot-y), var(--color-cobalt), transparent 65%)',
          WebkitMask:
            'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          maskComposite: 'exclude',
        }}
      />

      {/* Interior glow. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-[var(--spot-opacity)] transition-opacity duration-500 ease-out"
        style={{
          background:
            'radial-gradient(320px circle at var(--spot-x) var(--spot-y), color-mix(in srgb, var(--color-cobalt) 10%, transparent), transparent 70%)',
        }}
      />

      {children}
    </Tag>
  );
}

/**
 * Dark panel with a slowly drifting aurora behind it.
 *
 * Used for the closing CTA on both interior pages. The landing page ends on an
 * expanding radial bloom; this is its interior-page sibling — quieter, but not
 * static, so the last thing on the page is not a flat rectangle.
 *
 * Two counter-rotating radial gradients on long, non-matching durations. The
 * mismatch is deliberate: equal durations would make the pattern visibly
 * repeat every cycle, whereas 19s against 23s takes minutes to return to the
 * same configuration.
 */
export function AuroraPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={`relative isolate overflow-hidden bg-inverse text-on-inverse ${className}`}
    >
      {!reducedMotion && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-1/4 -top-1/2 -z-10 h-[160%] w-[80%] animate-[aurora-a_19s_ease-in-out_infinite] rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, color-mix(in srgb, var(--color-cobalt) 55%, transparent), transparent 65%)',
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-1/2 -right-1/4 -z-10 h-[160%] w-[80%] animate-[aurora-b_23s_ease-in-out_infinite] rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, color-mix(in srgb, var(--color-cobalt-400) 45%, transparent), transparent 65%)',
            }}
          />
        </>
      )}
      {children}
    </div>
  );
}
