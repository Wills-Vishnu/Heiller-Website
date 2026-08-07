'use client';

import { useEffect, useState } from 'react';
import { scrollState } from '@/lib/scroll-state';

/**
 * Tracks `prefers-reduced-motion` and mirrors it into the mutable scroll store
 * so the WebGL render loop can read it without a React subscription.
 *
 * Returns `false` on the first render (including SSR) and corrects on mount —
 * this is intentional. Assuming reduced-motion by default would make the hero
 * flash a static frame for everyone before hydrating into the animated version.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    const apply = (matches: boolean) => {
      setReduced(matches);
      scrollState.reducedMotion = matches;
    };

    apply(query.matches);
    const handler = (event: MediaQueryListEvent) => apply(event.matches);

    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return reduced;
}
