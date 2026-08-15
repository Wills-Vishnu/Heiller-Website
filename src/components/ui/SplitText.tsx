'use client';

import { Fragment, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SplitTextProps {
  /**
   * The text to reveal. Supports a lightweight inline syntax:
   *   `*word*`  renders the word in the editorial italic serif accent face.
   */
  text: string;
  as?: ElementType;
  className?: string;
  /** Seconds to wait before the reveal begins. */
  delay?: number;
  /** Seconds between each word. Lower = tighter, more urgent. */
  stagger?: number;
  /** `scroll` ties the reveal to a ScrollTrigger; `mount` plays immediately. */
  play?: 'scroll' | 'mount';
  /** ScrollTrigger start string. Only used when `play === 'scroll'`. */
  start?: string;
  /**
   * Hide the whole block from assistive technology. Use when the same string is
   * already exposed by a neighbouring element (e.g. the hero's `sr-only` h1),
   * so the sentence is announced exactly once.
   */
  ariaHidden?: boolean;
}

/**
 * Masked word-by-word text reveal.
 *
 * GSAP's official SplitText is a paid Club plugin, so this is a hand-rolled
 * equivalent. Each word is wrapped in an `overflow: hidden` box with the word
 * itself translated 110% below the baseline; animating it back to 0 produces
 * the "rising out of the page" reveal without any clip-path or filter cost.
 *
 * ACCESSIBILITY
 * The word wrappers are `aria-hidden` and the full string is exposed once via
 * `aria-label` on the host element, so assistive technology reads one coherent
 * sentence rather than a stream of disconnected words.
 */
export function SplitText({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  stagger = 0.055,
  play = 'scroll',
  start = 'top 82%',
  ariaHidden = false,
}: SplitTextProps) {
  const scope = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  /**
   * Narrowing the polymorphic tag to a concrete intrinsic satisfies TypeScript's
   * ref typing without a generic-heavy polymorphic-component dance. Every value
   * we ever pass (`span`, `p`, `h1`–`h3`) is an `HTMLElement`, so the ref is
   * structurally correct at runtime.
   */
  const Element = Tag as 'span';

  useGSAP(
    () => {
      const words = scope.current?.querySelectorAll<HTMLElement>('[data-word]');
      if (!words?.length) return;

      if (reducedMotion) {
        gsap.set(words, { yPercent: 0, autoAlpha: 1 });
        return;
      }

      // `gsap.fromTo()`, not a separate `gsap.set()` followed by `gsap.to()`.
      // The two-call version shipped a real bug: `gsap.set()` unconditionally
      // pins words back to `yPercent: 110` every time this effect runs, with
      // no atomic pairing to the reveal that follows. If the effect re-runs
      // after the reveal has already played — a dependency change, a fast
      // remount, React StrictMode's double-invoke in dev — that bare `set()`
      // re-hides already-visible words, and if the following `ScrollTrigger`
      // doesn't happen to re-fire in the same tick, they stay hidden forever:
      // present in the DOM (the `aria-label` reads correctly), invisible on
      // screen. `fromTo()` defines the "from" and "to" states as one
      // operation, so every run is self-contained and can't leave a headline
      // stranded mid-hide — this is the same pattern `FadeUp` below already
      // uses, and `FadeUp`'s eyebrow/lede reveals are the ones that don't
      // exhibit this failure.
      const animation = {
        yPercent: 0,
        autoAlpha: 1,
        duration: 1.1,
        ease: EASE.cinema,
        stagger,
        delay,
      };

      if (play === 'mount') {
        gsap.fromTo(words, { yPercent: 110, autoAlpha: 1 }, animation);
        return;
      }

      gsap.fromTo(
        words,
        { yPercent: 110, autoAlpha: 1 },
        {
          ...animation,
          scrollTrigger: { trigger: scope.current, start, once: true },
        },
      );
    },
    { scope, dependencies: [text, reducedMotion, play] },
  );

  const segments = text.split(/(\*[^*]+\*)/g).filter(Boolean);

  return (
    <Element
      ref={scope}
      className={className}
      aria-hidden={ariaHidden || undefined}
      aria-label={ariaHidden ? undefined : text.replace(/\*/g, '')}
    >
      {segments.map((segment, segmentIndex) => {
        const isAccent = segment.startsWith('*') && segment.endsWith('*');
        const content = isAccent ? segment.slice(1, -1) : segment;

        return (
          <Fragment key={segmentIndex}>
            {content.split(/\s+/).filter(Boolean).map((word, wordIndex) => (
              <Fragment key={`${segmentIndex}-${wordIndex}`}>
                <span className="split-word" aria-hidden="true">
                  <span data-word className={isAccent ? 'accent-word' : undefined}>
                    {word}
                  </span>
                </span>{' '}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </Element>
  );
}

/**
 * Non-splitting sibling for content that should share the same entrance timing
 * but must remain a single selectable, copy-pasteable string (body copy).
 */
export function FadeUp({
  children,
  className = '',
  delay = 0,
  start = 'top 85%',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  start?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!scope.current) return;

      if (reducedMotion) {
        gsap.set(scope.current, { autoAlpha: 1, y: 0, filter: 'none' });
        return;
      }

      gsap.fromTo(
        scope.current,
        { autoAlpha: 0, y: 28, filter: 'blur(8px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.05,
          ease: EASE.cinema,
          delay,
          scrollTrigger: { trigger: scope.current, start, once: true },
        },
      );
    },
    { scope, dependencies: [reducedMotion] },
  );

  return (
    <div ref={scope} className={className} style={{ visibility: 'hidden' }}>
      {children}
    </div>
  );
}
