'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { gsap, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scrollState } from '@/lib/scroll-state';
import { DottedWave } from '@/components/layout/DottedWave';
import { ScrambleText } from '@/components/ui/ScrambleText';

/**
 * Hero for interior pages.
 *
 * Shares the landing hero's vocabulary — eyebrow treatment, headline face,
 * `*accent*` syntax, dot wave along the base — at roughly half the vertical
 * weight. An interior page is somewhere a reader arrived on purpose, so it
 * should get them to the content quickly rather than repeating the
 * full-viewport opening statement.
 *
 * FOUR LAYERS OF MOTION
 *   ENTRANCE   breadcrumb, eyebrow, headline and lede cascade in on their own
 *              delays. The headline can additionally resolve out of scrambled
 *              characters (`scramble`), which `/security` uses because
 *              decrypting text is literally that page's subject.
 *   RULE       the eyebrow's accent rule draws out from zero width rather than
 *              fading — a line that grows reads as deliberate, a line that
 *              fades reads as an artefact.
 *   DEPTH      on scroll, the four elements leave at different rates and the
 *              wave leaves slowest. Uniform parallax is just a slow scroll;
 *              differential parallax is what produces the sense of layers at
 *              different distances.
 *   POINTER    the whole block drifts a few pixels against the cursor, read
 *              from the shared scroll store rather than a new listener.
 *
 * Every one of those is gated behind `prefers-reduced-motion`, which gets the
 * finished state immediately.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  breadcrumb,
  /** Resolve the headline out of scrambled characters. */
  scramble = false,
}: {
  eyebrow: string;
  /** `*word*` renders in the accent colour, same as `SplitText`. */
  title: string;
  lede: string;
  breadcrumb: string;
  scramble?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set('[data-page-hero]', { autoAlpha: 1, y: 0, filter: 'none' });
        gsap.set('[data-hero-rule]', { scaleX: 1 });
        return;
      }

      /* ---- Entrance ------------------------------------------------------- */
      const intro = gsap.timeline({ defaults: { ease: EASE.cinema } });

      intro
        .fromTo(
          '[data-page-hero]',
          { autoAlpha: 0, y: 26, filter: 'blur(9px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
            stagger: 0.11,
          },
          0.08,
        )
        .fromTo(
          '[data-hero-rule]',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: EASE.glide, transformOrigin: 'left' },
          0.32,
        );

      /* ---- Differential exit ----------------------------------------------
         Each element gets its own rate. The numbers are small and the spread
         between them is what matters, not their absolute size. */
      const rates: Array<[string, number]> = [
        ['[data-page-hero="crumb"]', -140],
        ['[data-page-hero="eyebrow"]', -110],
        ['[data-page-hero="title"]', -70],
        ['[data-page-hero="lede"]', -40],
      ];

      rates.forEach(([selector, y]) => {
        gsap.to(selector, {
          y,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.7,
          },
        });
      });

      /* ---- Pointer drift ---------------------------------------------------
         Reads the damped pointer that `SmoothScrollProvider` already writes
         once per tick, rather than attaching another `pointermove` listener. */
      const quickX = gsap.quickTo(driftRef.current, 'x', {
        duration: 1.1,
        ease: 'power3',
      });
      const quickY = gsap.quickTo(driftRef.current, 'y', {
        duration: 1.1,
        ease: 'power3',
      });

      const drift = () => {
        quickX(scrollState.pointerX * 9);
        quickY(scrollState.pointerY * 5);
      };
      gsap.ticker.add(drift);

      return () => {
        gsap.ticker.remove(drift);
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  /* Split on `*accent*` the same way `SplitText` does, so a headline written
     for one component can be moved to the other without rewriting it. */
  const segments = title.split(/(\*[^*]+\*)/g).filter(Boolean);
  const plainTitle = title.replace(/\*/g, '');

  return (
    <section
      ref={sectionRef}
      aria-labelledby="page-hero-heading"
      className="relative overflow-hidden pb-[10vh] pt-40 lg:pb-[14vh] lg:pt-48"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34vh] min-h-[210px]">
        <DottedWave />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-14">
        <div ref={driftRef}>
          {/* Breadcrumb — orientation for a reader who landed here from search
              rather than from the home page. */}
          <nav
            aria-label="Breadcrumb"
            data-page-hero="crumb"
            className="opacity-0"
          >
            <ol className="flex items-center gap-1.5 text-[0.8125rem] text-faint">
              <li>
                <Link
                  href="/"
                  className="link-underline transition-colors duration-300 hover:text-navy"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="flex items-center">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li aria-current="page" className="text-navy/70">
                {breadcrumb}
              </li>
            </ol>
          </nav>

          <p
            data-page-hero="eyebrow"
            className="mt-8 inline-flex items-center gap-2.5 text-eyebrow font-semibold uppercase text-cobalt opacity-0"
          >
            <span
              data-hero-rule
              aria-hidden="true"
              className="h-px w-8 origin-left bg-cobalt/45"
            />
            {eyebrow}
          </p>

          <h1
            id="page-hero-heading"
            data-page-hero="title"
            className="mt-5 max-w-[20ch] font-display text-display font-semibold text-navy opacity-0"
          >
            {scramble ? (
              /* One scramble across the whole string rather than per accent
                 segment — two independently-resolving runs would look like a
                 glitch instead of a decrypt. The accent colour is reapplied
                 after resolve via the sibling markup below being replaced by
                 this single element, so `scramble` headlines are monochrome by
                 design. */
              <ScrambleText text={plainTitle} />
            ) : (
              segments.map((segment, index) => {
                const isAccent =
                  segment.startsWith('*') && segment.endsWith('*');
                return (
                  <span
                    key={index}
                    className={isAccent ? 'text-cobalt' : undefined}
                  >
                    {isAccent ? segment.slice(1, -1) : segment}
                  </span>
                );
              })
            )}
          </h1>

          <p
            data-page-hero="lede"
            className="mt-6 max-w-[62ch] text-lead text-muted opacity-0"
          >
            {lede}
          </p>
        </div>
      </div>
    </section>
  );
}
