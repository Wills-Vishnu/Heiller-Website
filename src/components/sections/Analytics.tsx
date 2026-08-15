'use client';

import { useRef } from 'react';
import { gsap, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { CountUp } from '@/components/ui/CountUp';
import { FadeUp } from '@/components/ui/SplitText';
import { analyticsMetrics } from '@/lib/site';

/**
 * Chapter 04 — the standard.
 *
 * This used to be a mock analytics dashboard: a 12-month line chart of
 * "collections vs denials" and a "denials by root cause" bar chart, both
 * built from fully invented numbers, sitting under four metric tiles that
 * claimed specific before/after deltas ("+6.2 pts", "within two quarters of
 * onboarding", "across the active book of business"). heiller has three
 * active clients as of 2026 — not enough volume for a "book of business"
 * statistic to mean anything, no independently audited results to publish,
 * and no live per-payer/per-CPT analytics platform behind the work (the
 * operation is mostly manual, AI-assisted where it speeds up the repetitive
 * parts). A fabricated dashboard built to imply otherwise is precisely the
 * kind of claim a government reviewer checks first, so it is gone.
 *
 * What replaced it: four tiles showing the same industry-benchmark ranges
 * MGMA (Medical Group Management Association) publishes — the standard any
 * RCM operation, ours included, is measured against — sourced honestly as
 * benchmarks rather than dressed up as our own telemetry. `analyticsMetrics`
 * in `lib/site.ts` documents the source for each figure. When heiller has a
 * real, citable outcome history, that is the moment to bring back a results
 * chart — built from actual numbers, not a redesign of this one.
 */
export function Analytics() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const tiles = gsap.utils.toArray<HTMLElement>('[data-metric-tile]');
      if (!tiles.length) return;

      if (reducedMotion) {
        gsap.set(tiles, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(tiles, { autoAlpha: 0, y: 28 });
      gsap.to(tiles, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: EASE.cinema,
        stagger: 0.09,
        scrollTrigger: { trigger: '[data-metric-grid]', start: 'top 80%', once: true },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="analytics"
      aria-labelledby="analytics-heading"
      className="relative scroll-mt-24 py-[14vh] lg:py-[20vh]"
    >
      <div className="mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-14">
        <SectionIntro
          eyebrow="04 — The standard"
          title="What good RCM looks like. *The bar we work to.*"
          lede="These are published MGMA industry benchmarks, not a claim about our own book of business — heiller is a small operation with a short track record, and we would rather show you the standard than dress up three clients' worth of data as a trend. Ask us directly how we're pacing against it."
          className="max-w-3xl"
        />
        <span id="analytics-heading" className="sr-only">
          Industry benchmark standards for revenue cycle management performance
        </span>

        <FadeUp delay={0.1}>
          <ul
            data-metric-grid
            className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-panel bg-hairline sm:grid-cols-2 lg:mt-24 lg:grid-cols-4"
          >
            {analyticsMetrics.map((metric) => (
              <li key={metric.id} data-metric-tile className="bg-surface p-7 sm:p-8">
                <p className="text-eyebrow font-medium uppercase text-faint">
                  {metric.label}
                </p>
                <p className="mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-semibold leading-none tracking-[-0.035em] text-navy">
                  <CountUp
                    value={metric.value}
                    decimals={metric.decimals}
                    suffix={metric.suffix}
                  />
                </p>
                <p className="mt-3 inline-flex items-center rounded-pill bg-cobalt/10 px-2.5 py-1 text-[0.75rem] font-medium text-cobalt">
                  {metric.benchmark}
                </p>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-faint">
                  {metric.caption}
                </p>
              </li>
            ))}
          </ul>
        </FadeUp>

        <FadeUp delay={0.15}>
          <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-faint">
            Source: MGMA practice-benchmarking data, industry-wide ranges published for
            medical group revenue cycle performance. These are not audited heiller client
            results.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
