'use client';

import { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { gsap, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { videoHero } from '@/lib/site';

/**
 * Chapter 00 — video hero.
 *
 * Built to a supplied spec — background video, left-aligned text block,
 * floating pill navbar at the bottom centre — then taken **full-bleed** on
 * request. The spec's 1400px rounded card is gone: no max-width, no 48px
 * radius, no border, no drop shadow. Leaving any of that behind makes it read
 * as a card someone stretched rather than as a full-screen hero.
 *
 * Two proportions had to move with it. The text block is vertically centred
 * instead of top-aligned (at 600px the spec's top offset sat just above the
 * navbar; at full height it strands the text against the ceiling), and the
 * type gets one extra size step at `xl` (14/15px and 42/56px were sized for a
 * 600px frame and read as small print in a full viewport).
 *
 * THREE DELIBERATE DEVIATIONS, ALL AGREED
 *
 * 1. GSAP, NOT `motion/react`. The spec calls for `motion.div` / `motion.nav`.
 *    This project drives every animation through GSAP on a single ticker
 *    shared with Lenis, so adding Motion would mean two animation libraries
 *    (~34kB gzipped) doing the same job on different clocks — Motion-driven
 *    elements would drift a frame from GSAP-driven ones during scroll. The
 *    entrance is identical: fade plus slight rise, nav delayed behind the text.
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
 * ⚠️ THREE THINGS TO CHECK BEFORE THIS SHIPS
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
 * THE COPY IS NOT ABOUT THIS BUSINESS. See the warning on `videoHero` in
 * `lib/site.ts`.
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
        gsap.set(['[data-hero-text]', '[data-hero-nav]'], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: EASE.cinema } })
        .fromTo(
          '[data-hero-text]',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 1 },
          0.15,
        )
        // Nav trails the text, per spec.
        .fromTo(
          '[data-hero-nav]',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.9 },
          0.6,
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
            className="h-full w-full scale-105 object-cover transition-transform duration-1000"
          >
            <source src={videoHero.videoSrc} type="video/mp4" />
          </video>
        </div>

        {/* Content.
            Vertically centred rather than top-aligned. At the spec's 600px the
            text sat near the top with the navbar just below it; at full
            viewport height that same offset strands it against the ceiling
            with a void underneath. `justify-center` keeps the block optically
            placed at any height. Horizontal alignment is unchanged.

            `pb-32` reserves the floating navbar's footprint so the two can
            never collide on a short viewport. */}
        <div className="relative z-20 mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-start justify-center px-8 pb-32 md:px-16">
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

        {/* Floating navbar. Labelled distinctly from the site's primary nav so
            assistive tech announces two landmarks with different names rather
            than two identical "navigation" regions. */}
        <div
          data-hero-nav
          className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2 opacity-0"
        >
          <nav
            aria-label="Hero shortcuts"
            className="flex items-center rounded-full border border-hairline bg-surface/90 px-1.5 py-1.5 shadow-[0_12px_40px_rgb(var(--shadow-tint)/0.1)] backdrop-blur-2xl"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-surface text-[13px] text-navy shadow-sm"
            >
              ✦
            </span>

            {videoHero.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 text-[12px] font-semibold text-muted transition-colors duration-300 hover:text-navy"
              >
                {item.label}
              </a>
            ))}

            <a
              href={videoHero.navCta.href}
              className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface px-5 py-2 text-[12px] font-semibold text-navy shadow-sm transition-all duration-300 hover:border-hairline-strong"
            >
              {videoHero.navCta.label}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </section>
  );
}
