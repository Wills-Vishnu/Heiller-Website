'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Headline that resolves out of scrambled characters, left to right.
 *
 * Chosen for `/security` specifically because the effect *means* something
 * there — text decrypting into legibility is the page's subject matter. It
 * would be decoration anywhere else, which is why it is not the default
 * headline treatment site-wide.
 *
 * THREE PROBLEMS THIS SOLVES THAT NAIVE IMPLEMENTATIONS DO NOT
 *
 * 1. REFLOW. Swapping characters for random ones changes their widths, so a
 *    scrambling headline visibly jitters and shoves the paragraph below it
 *    around for the whole animation. Here the real string is rendered in the
 *    normal flow (transparent) and the scrambling copy is layered on top,
 *    absolutely positioned. The layout box is defined by the final text from
 *    the first frame and never moves.
 *
 * 2. LINE WRAPPING. Even with the box locked, the overlay could wrap at
 *    different points than the real text and look broken mid-animation. Spaces
 *    and punctuation are therefore never scrambled — only letters and digits
 *    are — so word boundaries and word count are identical throughout and both
 *    layers wrap the same way.
 *
 * 3. ACCESSIBILITY. The scrambling layer is `aria-hidden`, and the real string
 *    sits in the normal flow at `opacity: 0` rather than `visibility: hidden`
 *    or `display: none` — opacity keeps it in the accessibility tree, so screen
 *    readers get the actual headline and never the gibberish. It is also the
 *    server-rendered text, so crawlers and no-JS readers see it too.
 */

/** Glyphs to scramble through. Deliberately mixed-case alphanumerics plus a few
 *  symbols — a set of only symbols reads as corruption rather than cipher. */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&$@?';

/** Characters left alone, so wrapping and word shape stay stable. */
const PRESERVED = /[\s.,;:!?—–\-'"()/*]/;

export function ScrambleText({
  text,
  className = '',
  /** Seconds for the resolve front to travel the whole string. */
  duration = 1.6,
  delay = 0,
  /** `scroll` waits for the element; `mount` plays immediately. */
  play = 'mount',
}: {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  play?: 'scroll' | 'mount';
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const realRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const real = realRef.current;
      const live = liveRef.current;
      if (!real || !live) return;

      /* Reduced motion gets the finished headline with a plain fade. The
         scramble is rapid flashing text — exactly the kind of motion the
         preference exists to suppress, so it is skipped entirely rather than
         slowed down. */
      if (reducedMotion) {
        gsap.set(real, { autoAlpha: 1 });
        gsap.set(live, { autoAlpha: 0 });
        return;
      }

      const chars = [...text];
      /* Per-character randomness, generated once. Doing this inside the tick
         would make every character re-roll its timing every frame and the
         resolve front would shimmer instead of advancing. */
      const jitter = chars.map(() => Math.random() * 0.35);

      const state = { progress: 0 };

      const render = () => {
        // Where the resolve front currently sits, in character units.
        const front = state.progress * chars.length;

        live.textContent = chars
          .map((char, index) => {
            if (PRESERVED.test(char)) return char;

            // Fully resolved: the front has passed this character.
            if (index < front - jitter[index] * chars.length * 0.12) return char;

            // Not yet reached at all — blank, so the headline builds up rather
            // than starting as a solid block of noise.
            if (index > front + 6) return ' ';

            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('');
      };

      live.textContent = '';

      const tween = gsap.to(state, {
        progress: 1,
        duration,
        delay,
        ease: 'power2.inOut',
        onUpdate: render,
        onComplete: () => {
          // Hand off to the real text. Cross-fading rather than snapping keeps
          // the final frame from flickering if the two layers wrap differently
          // on an awkward viewport width.
          gsap.to(live, { autoAlpha: 0, duration: 0.25 });
          gsap.to(real, { autoAlpha: 1, duration: 0.25 });
        },
        ...(play === 'scroll'
          ? {
              scrollTrigger: { trigger: wrapRef.current, start: 'top 85%', once: true },
            }
          : {}),
      });

      return () => {
        tween.kill();
      };
    },
    { scope: wrapRef, dependencies: [text, reducedMotion, play] },
  );

  return (
    <span ref={wrapRef} className={`relative inline-block ${className}`}>
      {/* Real text: defines the layout box, is what assistive tech reads, and
          is what a crawler sees. Starts transparent and is faded in when the
          scramble completes.

          `data-scramble-real` exists solely so the `<noscript>` block in
          `app/layout.tsx` can force it back to full opacity — without that, a
          reader with JavaScript disabled would get an invisible headline,
          which is exactly the failure mode that fail-safe exists to prevent. */}
      <span ref={realRef} data-scramble-real className="opacity-0">
        {text}
      </span>

      {/* Scrambling overlay. `whitespace-pre-wrap` preserves the padding spaces
          used for not-yet-reached characters, which is what makes the headline
          assemble instead of appearing all at once. */}
      <span
        ref={liveRef}
        aria-hidden="true"
        className="absolute left-0 top-0 w-full whitespace-pre-wrap"
      />
    </span>
  );
}
