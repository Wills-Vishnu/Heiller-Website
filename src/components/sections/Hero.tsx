'use client';

import { useEffect, useRef } from 'react';
import { gsap, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { videoHero } from '@/lib/site';

/**
 * Chapter 00 — video hero.
 *
 * Built to a supplied spec — background video, left-aligned text block, a
 * floating pill navbar at the bottom centre — then taken **full-bleed** on
 * request. The spec's 1400px rounded card is gone: no max-width, no 48px
 * radius, no border, no drop shadow. Leaving any of that behind makes it read
 * as a card someone stretched rather than as a full-screen hero.
 *
 * The floating pill navbar described above was removed in a later pass: the
 * site already has one persistent navigation bar (`layout/Navbar.tsx`,
 * imported once in `app/layout.tsx`), and a second nav landmark floating over
 * the hero duplicated it rather than adding anything. The text column is now
 * the section's only content, so `data-hero-nav` and its entrance tween are
 * gone along with it — search history for that name if you need to see what
 * it looked like.
 *
 * Two proportions had to move with the full-bleed change. The text block is
 * vertically centred instead of top-aligned (at 600px the spec's top offset
 * sat just above the floating nav; at full height it strands the text against
 * the ceiling), and the type gets one extra size step at `xl` (14/15px and
 * 42/56px were sized for a 600px frame and read as small print in a full
 * viewport).
 *
 * THREE DELIBERATE DEVIATIONS, ALL AGREED
 *
 * 1. GSAP, NOT `motion/react`. The spec calls for `motion.div`. This project
 *    drives every animation through GSAP on a single ticker shared with
 *    Lenis, so adding Motion would mean two animation libraries (~34kB
 *    gzipped) doing the same job on different clocks — Motion-driven elements
 *    would drift a frame from GSAP-driven ones during scroll. The entrance is
 *    identical: fade plus slight rise.
 *
 * 2. DESIGN TOKENS, NOT LITERAL HEX. `#0a1b33` → `text-navy`, `#64748b` →
 *    `text-muted`, `bg-white` → `bg-surface`, `border-slate-200` →
 *    `border-hairline`. Near-identical in light mode, and it means this
 *    section inverts correctly with the theme toggle instead of staying
 *    stubbornly light while the rest of the site goes dark.
 *
 * 3. THE VIDEO PAUSES UNDER `prefers-reduced-motion`. An autoplaying loop is
 *    moving content with no pause control, which is a WCAG 2.2.2 failure. The
 *    poster frame still shows, so the composition is unchanged — it just
 *    stops moving for readers who asked for that.
 *
 * ⚠️ TWO THINGS TO CHECK BEFORE THIS SHIPS
 *
 * NO SCRIM. The spec says "No overlays", so navy text sits directly on the
 * video. Whether that passes contrast depends entirely on what is under it at
 * any given frame, and it will change across the loop. If any of it becomes
 * hard to read, the fix is a low-opacity gradient behind the text column only
 * — not over the whole video.
 *
 * THE FIXED NAVBAR NOW SITS ON THE VIDEO. Going full-bleed removed the page
 * margin that used to separate them: `Navbar` is transparent until 80px of
 * scroll, so at rest its `text-navy/75` links are over moving footage. If they
 * are not legible, the cheapest fix is starting the navbar in its condensed
 * (frosted) state on `/` rather than adding a scrim here.
 *
 * The copy in `videoHero` (`lib/site.ts`) now describes heiller itself —
 * that mismatch has been fixed and no longer needs checking before launch.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  /* Playback is controlled here rather than left to the `autoPlay` attribute
     alone, because the attribute cannot be conditional after mount — a reader
     toggling the OS preference mid-session would otherwise keep a looping
     video they just asked to stop. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reducedMotion) {
      video.pause();
      return;
    }

    // Autoplay can reject (low-power mode, some mobile browsers). Nothing to
    // recover — the first frame stays on screen and the layout is unaffected.
    void video.play().catch(() => {});
  }, [reducedMotion]);

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set('[data-hero-text]', { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        '[data-hero-text]',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 1, ease: EASE.cinema },
        0.15,
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative"
    >
      {/* Full-bleed container.
          Was a 1400px rounded card; now edge to edge and viewport height. The
          card chrome — max-width, 48px radius, border, drop shadow — is all
          gone, because any of it left behind reads as a card that has been
          stretched rather than as a full-screen hero.

          `100svh` not `100vh`: on mobile browsers `vh` is measured against the
          *largest* viewport, so with the address bar visible a `100vh` hero is
          taller than the screen and pushes the bottom navbar out of sight on
          first paint. `svh` uses the smallest viewport, which is the one
          present when the page loads. `min-h` guards short landscape phones,
          where a pure viewport height leaves no room for the content. */}
      <div className="relative flex h-[100svh] min-h-[640px] w-full flex-col overflow-hidden bg-surface">
        {/* Background video layer. `aria-hidden` and `pointer-events-none`:
            it is decorative, carries no information, and must never take
            focus or intercept a click meant for the content above it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            /* `preload="auto"` because this is above the fold and any stall is
               now a full empty screen rather than an empty card. That makes it
               a real bandwidth cost on the critical path — if LCP suffers, a
               poster image plus `preload="metadata"` is the trade to make. */
            preload="auto"
            /* Dark-mode compatibility for a *video*: the file's pixels are
               fixed at encode time, so there is no token to redefine the way
               `--color-*` values are elsewhere on the site. `dark:brightness`
               + `dark:saturate` is the pure-CSS approximation — darkened and
               slightly desaturated footage reads as belonging to the dark
               palette instead of sitting on it as an unchanged light-mode
               rectangle. It costs nothing (no extra asset, no per-frame
               processing) and rides the same `.dark` class toggle as every
               other themed value on the page.
               `transition-[filter]` is grouped with `transform` in one
               utility rather than two separate `transition-*` classes —
               Tailwind's transition-property utilities each set the same CSS
               property, so a second one would silently overwrite the first
               instead of adding to it. */
            className="h-full w-full scale-105 object-cover transition-[transform,filter] duration-700 dark:brightness-[60%] dark:saturate-[80%]"
          >
            <source src={videoHero.videoSrc} type="video/mp4" />
          </video>
        </div>

        {/* Content.
            Vertically centred rather than top-aligned. At the spec's 600px the
            text sat near the top with the floating nav just below it; at full
            viewport height that same offset strands it against the ceiling
            with a void underneath. `justify-center` keeps the block optically
            placed at any height. Horizontal alignment is unchanged.

            No bottom padding reserved here — that was footprint for the
            floating pill navbar, which has been removed. The site's own
            `Navbar` (fixed, in `app/layout.tsx`) is the only navigation over
            this section now. */}
        <div className="relative z-20 mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-start justify-center px-8 md:px-16">
          <div data-hero-text className="opacity-0">
            <h1
              id="hero-heading"
              className="font-display text-[42px] font-medium leading-[1.08] tracking-[-0.03em] text-navy md:text-[56px] xl:text-[68px]"
            >
              {videoHero.headline[0]}
              <br />
              {videoHero.headline[1]}
            </h1>

            {/* The spec's 14/15px was sized for a 600px card. Both this and
                the headline get one extra step at `xl` so the block holds its
                proportions on a full-height viewport — at the original sizes
                the type reads as small print floating in a large frame. */}
            <p className="mt-6 max-w-[52ch] font-sans text-[14px] leading-relaxed text-muted md:text-[15px] xl:text-[17px]">
              {videoHero.subheadline}
            </p>

            {/* Hover scale is a CSS transform transition rather than a GSAP
                tween — a hover needs no timeline, and this keeps the
                interaction working before the JS bundle has hydrated. */}
            <a
              href={videoHero.cta.href}
              className="mt-8 inline-flex items-center rounded-full bg-inverse px-6 py-3 text-[13px] font-semibold text-on-inverse shadow-rest transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] active:scale-[0.98]"
            >
              {videoHero.cta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
