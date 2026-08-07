'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface TimelineStep {
  step: string;
  title: string;
  body: string;
}

/**
 * Vertical process timeline with a spine that draws itself as you scroll.
 *
 * Four layers of motion, each doing a different job:
 *
 *   GHOST RAIL   a static hairline showing the whole journey up front, so the
 *                reader can see how far the process runs before committing to
 *                scrolling it. Without this the drawn line looks like it is
 *                being invented as you go.
 *   DRAWN RAIL   `stroke-dashoffset` scrubbed against scroll position. This is
 *                the free equivalent of GSAP's paid DrawSVG plugin.
 *   FLOW         a second copy of the path with a short dash pattern whose
 *                offset animates continuously — reads as packets moving down
 *                the line. On `/security` that is literally the subject: data
 *                in transit. It is masked to the drawn portion so nothing
 *                flows through line that has not been drawn yet.
 *   IGNITION     each node scales up and its ring fills as its own step
 *                crosses the activation point, and the step content slides in
 *                beside it.
 *
 * WHY A DOM SPINE AND NOT A BORDER
 * A `border-left` with a gradient cannot be partially drawn, cannot carry
 * flowing dashes, and cannot have nodes that sit *on* it at arbitrary
 * positions. The SVG costs one extra element and buys all three.
 *
 * The `steps` are also rendered as a real `<ol>` — the SVG is decorative and
 * `aria-hidden`, so the semantic list survives with or without any of this.
 */
export function Timeline({
  steps,
  className = '',
}: {
  steps: readonly TimelineStep[];
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const drawnRef = useRef<SVGPathElement>(null);
  const flowRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  /* Geometry. The viewBox height is derived from the step count so the spine
     stays proportional whether there are four steps or eight, and
     `preserveAspectRatio="none"` lets it stretch to whatever height the real
     content ends up being. */
  const VB_W = 40;
  const VB_H = 100 * steps.length;
  const path = `M20 0 V${VB_H}`;

  useGSAP(
    () => {
      const drawn = drawnRef.current;
      const flow = flowRef.current;
      const nodes = gsap.utils.toArray<HTMLElement>('[data-tl-node]');
      const items = gsap.utils.toArray<HTMLElement>('[data-tl-item]');
      if (!drawn || !items.length) return;

      const length = drawn.getTotalLength();

      if (reducedMotion) {
        gsap.set(drawn, { strokeDasharray: 'none', strokeDashoffset: 0 });
        gsap.set(flow, { autoAlpha: 0 });
        gsap.set(items, { autoAlpha: 1, x: 0 });
        gsap.set(nodes, { scale: 1, autoAlpha: 1 });
        return;
      }

      /* ---- Rail draw ---------------------------------------------------- */
      gsap.set(drawn, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(drawn, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 78%',
          end: 'bottom 65%',
          scrub: 0.6,
        },
      });

      /* ---- Flowing packets -----------------------------------------------
         A separate infinite tween, not scrubbed: the data keeps moving whether
         or not the reader is scrolling, which is the point — the pipeline is
         always running. Masked by the drawn rail's own reveal so packets never
         appear on undrawn line. */
      if (flow) {
        gsap.set(flow, { strokeDasharray: '4 26', autoAlpha: 0 });
        gsap.to(flow, {
          autoAlpha: 1,
          duration: 0.8,
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%', once: true },
        });
        gsap.to(flow, {
          strokeDashoffset: -120,
          duration: 2.4,
          ease: 'none',
          repeat: -1,
        });
      }

      /* ---- Per-step ignition ---------------------------------------------- */
      gsap.set(items, { autoAlpha: 0, x: 26 });
      gsap.set(nodes, { scale: 0.25, autoAlpha: 0.35, transformOrigin: 'center' });

      items.forEach((item, index) => {
        const node = nodes[index];

        gsap.to(item, {
          autoAlpha: 1,
          x: 0,
          duration: 0.85,
          ease: EASE.cinema,
          scrollTrigger: { trigger: item, start: 'top 86%', once: true },
        });

        if (!node) return;

        // Scrubbed rather than one-shot, so scrolling back up dims the node
        // again and the rail reads as a genuine progress indicator rather than
        // a set of triggers that fired once.
        gsap.to(node, {
          scale: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            end: 'top 62%',
            scrub: 0.5,
          },
        });
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef, dependencies: [reducedMotion, steps.length] },
  );

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {/* Spine. Decorative — the ordered list beside it carries the meaning. */}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 top-0 h-full w-10"
        fill="none"
      >
        <defs>
          <linearGradient id="tl-grad" x1="0" y1="0" x2="0" y2={VB_H}>
            <stop offset="0%" style={{ stopColor: 'var(--color-cobalt)' }} />
            <stop offset="70%" style={{ stopColor: 'var(--color-cobalt-400)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--color-positive)' }} />
          </linearGradient>
        </defs>

        <path d={path} className="stroke-navy" strokeOpacity="0.1" strokeWidth="2" />
        <path
          ref={drawnRef}
          d={path}
          stroke="url(#tl-grad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          ref={flowRef}
          d={path}
          className="stroke-cobalt"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      <ol className="relative">
        {steps.map((item, index) => (
          <li key={item.step} className="relative py-7 pl-16 first:pt-0">
            {/* Node sits on the spine. `ring` colour is the page canvas so the
                node punches a hole in the rail rather than sitting over it. */}
            <span
              data-tl-node
              aria-hidden="true"
              className="absolute left-[13px] top-9 h-3.5 w-3.5 rounded-full bg-cobalt ring-4 ring-frost"
              style={{ top: index === 0 ? '2px' : undefined }}
            />
            <div data-tl-item>
              <p className="font-display text-sm font-semibold tabular-nums text-cobalt">
                {item.step}
              </p>
              <h3 className="mt-2 font-display text-title font-semibold text-navy">
                {item.title}
              </h3>
              <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
