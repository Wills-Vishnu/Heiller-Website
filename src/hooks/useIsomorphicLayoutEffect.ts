'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * GSAP setup must run before paint to avoid a flash of un-animated content, but
 * `useLayoutEffect` logs a warning during SSR. This is the standard shim.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
