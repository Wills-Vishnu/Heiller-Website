'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CountUpProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

/**
 * A number that counts up when it scrolls into view.
 *
 * Two details that separate this from the usual implementation:
 *
 * 1. `font-variant-numeric: tabular-nums`. Proportional digits change width as
 *    they tick, which makes the whole element jitter horizontally and drag its
 *    neighbours around. Tabular figures are non-negotiable for animated counts.
 *
 * 2. The animated value is written directly to `textContent` rather than to
 *    React state. A 2-second count at 120 Hz would otherwise be 240 renders per
 *    figure, and this component appears four times in the analytics section.
 *
 * The final value is also rendered server-side inside the element, so the
 * correct number is present for crawlers and for anyone whose animation never
 * runs.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 2,
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  const formatted = `${prefix}${value.toFixed(decimals)}${suffix}`;

  useGSAP(
    () => {
      const node = ref.current;
      if (!node || reducedMotion) return;

      const counter = { current: 0 };
      node.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;

      gsap.to(counter, {
        current: value,
        duration,
        // `power2.out` lands softly. Linear counting looks mechanical, and
        // anything with a back-ease overshoots past the real figure — which is
        // unacceptable when the figure is a performance claim.
        ease: 'power2.out',
        scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        onUpdate: () => {
          node.textContent = `${prefix}${counter.current.toFixed(decimals)}${suffix}`;
        },
        onComplete: () => {
          node.textContent = formatted;
        },
      });
    },
    { dependencies: [value, reducedMotion] },
  );

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {formatted}
    </span>
  );
}
