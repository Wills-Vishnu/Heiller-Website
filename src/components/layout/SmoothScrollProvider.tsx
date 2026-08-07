'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { scrollState, setPointerTarget, setScrollProgress } from '@/lib/scroll-state';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { damp } from '@/lib/math';

/**
 * Owns the page's scroll physics and is the single writer to the scroll store.
 *
 * Three systems have to agree on one clock or they will visibly disagree:
 *   1. Lenis         — interpolates the scroll position
 *   2. ScrollTrigger — drives every DOM timeline
 *   3. R3F's useFrame — drives the WebGL scene
 *
 * We solve this by making GSAP's ticker the master clock: Lenis is stepped from
 * inside it, and ScrollTrigger updates from Lenis's scroll event. R3F runs its
 * own rAF but only ever *reads* the store, so it can never be a frame ahead of
 * a value it also writes.
 *
 * `lagSmoothing(0)` is important. GSAP's default lag smoothing silently
 * fast-forwards timelines after a long frame, which desynchronises Lenis from
 * ScrollTrigger and produces a visible jump when a heavy section mounts.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    /* ---- Pointer parallax -------------------------------------------------
       Registered regardless of motion preference; the consumers decide how much
       (if any) parallax to apply. Passive listener, no layout reads. */
    const handlePointer = (event: PointerEvent) => {
      setPointerTarget(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener('pointermove', handlePointer, { passive: true });

    /* ---- Pointer damping --------------------------------------------------
       Smoothed here rather than inside `useFrame` so the damped value exists
       even when WebGL is unavailable (the DOM parallax layers read it too).
       Runs on GSAP's ticker, i.e. the same clock as everything else. */
    const dampPointer = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 34) / 1000;
      scrollState.pointerX = damp(scrollState.pointerX, scrollState.targetPointerX, 3.2, dt);
      scrollState.pointerY = damp(scrollState.pointerY, scrollState.targetPointerY, 3.2, dt);
    };
    gsap.ticker.add(dampPointer);

    /* ---- Reduced motion: native scrolling, no interpolation --------------- */
    if (reducedMotion) {
      const handleNativeScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(max > 0 ? window.scrollY / max : 0, 0);
        ScrollTrigger.update();
      };
      handleNativeScroll();
      window.addEventListener('scroll', handleNativeScroll, { passive: true });

      return () => {
        window.removeEventListener('pointermove', handlePointer);
        window.removeEventListener('scroll', handleNativeScroll);
        gsap.ticker.remove(dampPointer);
      };
    }

    /* ---- Lenis ------------------------------------------------------------
       `lerp` rather than `duration` gives a velocity-preserving feel that does
       not fight fast flicks. 0.085 is slow enough to feel weighted without the
       "swimming" lag that lower values introduce. */
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      // Touch devices already have excellent native inertia; overriding it
      // makes the page feel worse, not better.
      syncTouch: false,
      autoRaf: false,
    });

    lenis.on('scroll', (instance: Lenis) => {
      setScrollProgress(instance.progress || 0, instance.velocity || 0);
      ScrollTrigger.update();
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /* ---- ScrollTrigger <-> Lenis bridge -----------------------------------
       No `scrollerProxy` here, deliberately. Lenis drives `window.scrollY`
       natively rather than transforming a wrapper, so ScrollTrigger's default
       scroller is already correct. Installing a proxy in this configuration is
       a common copy-paste error that breaks `pin` and `scrub` in subtle ways.
       Calling `ScrollTrigger.update()` from Lenis's scroll event is the entire
       integration. */

    // Fonts change metrics, which changes every pinned section's height.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    // Anchor links must go through Lenis or they teleport past the smoothing.
    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -8, duration: 1.5 });
      // Move focus for keyboard and screen-reader users; scrollTo alone does not.
      (target as HTMLElement).setAttribute('tabindex', '-1');
      (target as HTMLElement).focus({ preventScroll: true });
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tick);
      gsap.ticker.remove(dampPointer);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
