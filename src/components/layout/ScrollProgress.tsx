'use client';

import { useRef } from 'react';
import { ScrollTrigger, useGSAP, gsap } from '@/lib/gsap';

/**
 * A hairline progress bar pinned to the very top of the viewport, filling
 * left-to-right as the reader moves through the nine-chapter story.
 *
 * This is the one piece of persistent, page-wide motion left after the WebGL
 * background was removed — and it earns its place: on a single continuous
 * scroll narrative, "how far am I through this" is genuinely useful
 * information, not just decoration. It also reinforces the page's core idea
 * (one continuous story, not nine separate screens) in a way a static header
 * can't.
 *
 * Implementation notes:
 * - No React state. `ScrollTrigger`'s own `onUpdate` writes directly to the
 *   fill element's `scaleX` via `gsap.set`, which is a compositor-only
 *   transform — this can update on every Lenis tick without costing a layout
 *   or paint, let alone a React render.
 * - `trigger: document.body` with `start: 'top top'` / `end: 'bottom bottom'`
 *   is the standard "progress across the whole page" pattern: `self.progress`
 *   is 0 at the very top of the document and 1 at the very bottom, matching
 *   the reader's actual position regardless of how content is added or
 *   resized above this component mounts.
 * - Not gated behind `prefers-reduced-motion`. Unlike a decorative loop, this
 *   motion is entirely reader-driven (it only moves because the reader
 *   scrolled) and conveys real information, so WCAG's "moving content" concern
 *   (SC 2.2.2) doesn't apply the way it would to an automatic animation.
 */
export function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const fill = fillRef.current;
    if (!fill) return;

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => gsap.set(fill, { scaleX: self.progress }),
    });

    return () => trigger.kill();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px] bg-navy/[0.05]"
    >
      <div
        ref={fillRef}
        className="h-full w-full origin-left bg-gradient-to-r from-cobalt via-cobalt-400 to-coral"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
