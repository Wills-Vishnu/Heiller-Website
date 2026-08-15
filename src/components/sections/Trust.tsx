'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { TiltCard } from '@/components/ui/TiltCard';
import { FadeUp } from '@/components/ui/SplitText';
import { complianceBadges, trustPoints } from '@/lib/site';

/**
 * Chapter 05 — why trust us.
 *
 * This used to be a continuous marquee of client logos and three testimonial
 * cards — all fictional. heiller has three real clients as of 2026, no
 * permissioned logos to show, and no attributable quotes to publish. A
 * fabricated logo wall and invented named endorsements are not layout
 * placeholders; they're deceptive advertising, so the whole social-proof
 * structure is gone rather than reskinned with new fake names.
 *
 * What replaced it: three plain, true statements about why a small, new
 * company is worth trusting anyway — direct access to the people doing the
 * work, transparency about actually being new, and an open offer to talk to
 * a real client instead of reading a quote from one. Same card treatment
 * (tilt on hover, staggered entrance) as the testimonials it replaced, so
 * the section still carries visual weight without carrying invented proof.
 */
export function Trust() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-trust-card]');
      if (!cards.length) return;

      if (reducedMotion) {
        gsap.set(cards, { autoAlpha: 1, y: 0, rotateY: 0 });
        return;
      }

      gsap.set(cards, { autoAlpha: 0, y: 48, rotateY: -6 });
      ScrollTrigger.batch(cards, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            rotateY: 0,
            duration: 1.15,
            ease: EASE.cinema,
            stagger: 0.11,
            overwrite: true,
          }),
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="trust"
      aria-labelledby="trust-heading"
      className="relative py-[14vh] lg:py-[20vh]"
    >
      <div className="mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-14">
        <SectionIntro
          eyebrow="05 — Why trust us"
          title="Small, new, and *upfront* about both."
          lede="We'd rather tell you exactly how big we are than perform a scale we don't have yet."
          align="center"
        />
        <span id="trust-heading" className="sr-only">
          Why work with a small, new revenue cycle management team
        </span>

        {/* ---- Trust points ---------------------------------------------------- */}
        <ul className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-3">
          {trustPoints.map((point) => (
            <li key={point.id} data-trust-card style={{ opacity: 0 }}>
              <TiltCard className="h-full" intensity={5} lift={12}>
                <article className="group flex h-full flex-col rounded-panel border border-hairline bg-surface p-8 shadow-rest transition-shadow duration-700 hover:shadow-lift sm:p-9">
                  <h3 className="font-display text-[1.1875rem] font-semibold leading-snug text-navy">
                    {point.title}
                  </h3>
                  <p className="mt-4 flex-1 text-[1rem] leading-relaxed text-muted">
                    {point.body}
                  </p>
                </article>
              </TiltCard>
            </li>
          ))}
        </ul>

        {/* ---- Compliance badges ---------------------------------------------- */}
        <FadeUp delay={0.12}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
            {complianceBadges.map((badge) => (
              <span
                key={badge.label}
                className="group inline-flex items-center gap-2.5 rounded-pill border border-hairline bg-surface py-2.5 pl-4 pr-5 shadow-rest transition-all duration-500 hover:border-cobalt/30 hover:shadow-lift"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-positive transition-transform duration-500 group-hover:scale-150"
                />
                <span className="font-display text-[0.8125rem] font-semibold text-navy">
                  {badge.label}
                </span>
                <span className="text-[0.75rem] text-faint">{badge.detail}</span>
              </span>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.16}>
          <div className="mt-12 text-center">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-cobalt transition-colors duration-300 hover:text-cobalt-700"
            >
              More about who we are and how we work
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
