'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Batch-reveals any `[data-reveal]` descendant as it enters the viewport.
 *
 * The landing page's sections each hand-roll this — which was right there,
 * because each one wanted a different entrance (clip-path mask for Complexity,
 * rotateX for Services, a drawn spine for Workflow). The interior pages want
 * the same reveal everywhere, so hand-rolling it eight more times would be
 * copy-paste, not craft.
 *
 * Wrapping rather than per-element hooks matters for a second reason: it keeps
 * `/security` and `/about` as **server components**. They export `metadata`,
 * contain no interactivity of their own, and ship no JavaScript for their
 * content — only this wrapper and the hero are client-side.
 *
 * Uses `ScrollTrigger.batch` for the same reason the landing page does:
 * whatever crosses the threshold in one frame animates as one stagger, so a
 * fast scroll delivers the whole group together and a slow one delivers it in
 * sequence. Per-element triggers produce a mechanical ripple regardless of how
 * the reader actually arrives.
 */
export function RevealGroup({
  children,
  className = '',
  /** Seconds between items in a batch. */
  stagger = 0.08,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: 'div' | 'section';
}) {
  /* Always a `div` ref, never cast.
     A polymorphic `<Tag>` would force this to `HTMLElement`, which React's JSX
     types reject on a concrete element — and the usual escape hatch is an
     `as never` that discards real type safety. Instead the `section` branch
     below keeps its own semantic element and puts the ref on an inner `div`
     with `display: contents`, which participates in no layout at all. The
     scope is identical, the markup is still a `<section>`, and there is no
     cast anywhere. */
  const scopeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      if (!items.length) return;

      if (reducedMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0, filter: 'none' });
        return;
      }

      gsap.set(items, { autoAlpha: 0, y: 30, filter: 'blur(7px)' });

      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.95,
            ease: EASE.cinema,
            stagger,
            overwrite: true,
          }),
      });
    },
    { scope: scopeRef, dependencies: [reducedMotion] },
  );

  if (as === 'section') {
    return (
      <section className={className}>
        <div ref={scopeRef} style={{ display: 'contents' }}>
          {children}
        </div>
      </section>
    );
  }

  return (
    <div ref={scopeRef} className={className}>
      {children}
    </div>
  );
}
