'use client';

import { useRef } from 'react';
import { gsap, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { CountUp } from '@/components/ui/CountUp';
import { FadeUp } from '@/components/ui/SplitText';
import { problemStats } from '@/lib/site';

/**
 * Chapter 01 — the leak.
 *
 * LAYOUT: an editorial stat band. No cards.
 *
 * This section used to be three stacked cards in a right-hand column, which
 * made it structurally identical to Complexity directly below it — same
 * heading-left / cards-right split, same vertical rhythm. Two adjacent
 * sections that share a skeleton read as one long section, and the reader
 * stops distinguishing them.
 *
 * So this one has no card chrome at all: three oversized figures sitting
 * directly on the page, divided by hairlines, under a full-width heading.
 * Removing the boxes is what makes it unmistakably a different section from
 * two metres away, which is the distance at which layout actually gets judged.
 *
 * THE LEAK LINE
 * Under each figure a thin vertical gradient drains downward and fades out —
 * the chapter's argument rendered as a graphic rather than stated again. It
 * animates on a long, offset loop per column so the three never pulse
 * together, which would read as a progress indicator rather than a seep.
 */
export function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const columns = gsap.utils.toArray<HTMLElement>('[data-stat-col]');
      if (!columns.length) return;

      if (reducedMotion) {
        gsap.set(columns, { autoAlpha: 1, y: 0 });
        gsap.set('[data-leak]', { autoAlpha: 0.5, scaleY: 1 });
        gsap.set('[data-stat-rule]', { scaleX: 1 });
        return;
      }

      gsap.set(columns, { autoAlpha: 0, y: 34 });
      gsap.set('[data-stat-rule]', { scaleX: 0, transformOrigin: 'left center' });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
      });

      // Rules draw first, figures rise into the space they define.
      tl.to('[data-stat-rule]', {
        scaleX: 1,
        duration: 0.9,
        ease: EASE.glide,
        stagger: 0.1,
      }).to(
        columns,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: EASE.cinema,
          stagger: 0.12,
        },
        0.18,
      );

      /* Leak lines. Each on its own duration and delay so they never
         synchronise — three lines pulsing in unison reads as a loading state,
         three seeping independently reads as a slow loss. */
      gsap.utils.toArray<HTMLElement>('[data-leak]').forEach((line, index) => {
        gsap.set(line, { transformOrigin: 'top center', scaleY: 0, autoAlpha: 0 });
        gsap.to(line, {
          scaleY: 1,
          autoAlpha: 0.55,
          duration: 2.4 + index * 0.6,
          ease: 'power1.inOut',
          repeat: -1,
          repeatDelay: 0.5 + index * 0.35,
          delay: index * 0.8,
          yoyo: true,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        });
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="problem"
      aria-labelledby="problem-heading"
      className="relative py-[16vh] lg:py-[22vh]"
    >
      <div className="mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-14">
        {/* Full-width heading rather than a left column — the band below needs
            the whole measure, and it further separates this section's skeleton
            from Complexity's split layout. */}
        <SectionIntro
          eyebrow="01 — The leak"
          title="Revenue does not *vanish.* It leaks."
          lede="No single catastrophic event costs a practice its margin. It goes a claim at a time — a missing modifier, an expired authorisation, an appeal window that closed on a Friday. By the time it shows up in a monthly report, the money is already unrecoverable."
          className="max-w-3xl"
        />
        <span id="problem-heading" className="sr-only">
          The problem: revenue leakage in the healthcare revenue cycle
        </span>

        <ul className="mt-20 grid gap-y-14 lg:mt-28 lg:grid-cols-3 lg:gap-x-0">
          {problemStats.map((stat, index) => (
            <li
              key={stat.label}
              className={[
                'relative',
                // Vertical dividers between columns, not around them — a box
                // would reintroduce the card this layout exists to avoid.
                index > 0 ? 'lg:border-l lg:border-hairline lg:pl-12' : '',
                index < problemStats.length - 1 ? 'lg:pr-12' : '',
              ].join(' ')}
            >
              {/* Top rule, drawn on entrance. */}
              <span
                data-stat-rule
                aria-hidden="true"
                className="block h-px w-full origin-left bg-hairline-strong"
              />

              <div data-stat-col className="pt-8 opacity-0">
                <p className="flex items-baseline font-display text-[clamp(3.25rem,7vw,5.5rem)] font-semibold leading-none tracking-[-0.045em] text-navy">
                  <CountUp
                    value={stat.value}
                    prefix={'prefix' in stat ? stat.prefix : ''}
                    suffix={stat.suffix}
                  />
                </p>

                {/* The leak: a thin column of colour draining out of the
                    figure and dissipating. */}
                <span
                  data-leak
                  aria-hidden="true"
                  className="mt-5 block h-16 w-px"
                  style={{
                    background:
                      'linear-gradient(to bottom, var(--color-cobalt), transparent)',
                  }}
                />

                <p className="mt-5 max-w-[26ch] text-[1.0625rem] font-medium leading-snug text-navy">
                  {stat.label}
                </p>
                <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-faint">
                  {stat.note}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <FadeUp delay={0.2}>
          <p className="mt-16 max-w-[46ch] text-sm leading-relaxed text-faint">
            Figures are illustrative industry benchmarks shown for context. Replace
            with cited sources before publishing.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
