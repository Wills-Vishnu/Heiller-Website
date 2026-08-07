'use client';

import { useRef } from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { TiltCard } from '@/components/ui/TiltCard';
import { FadeUp } from '@/components/ui/SplitText';
import { clientNames, complianceBadges, testimonials } from '@/lib/site';

/**
 * Placeholder client mark.
 *
 * Rendered as a geometric monogram plus a wordmark so the marquee reads as a
 * row of logos rather than a row of text, without shipping any real company's
 * trademark. Swap the whole component for `<Image>` tags once permissioned
 * logo files exist.
 */
function ClientMark({ name, index }: { name: string; index: number }) {
  return (
    <div className="group flex shrink-0 items-center gap-3 px-8 opacity-55 grayscale transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-100 hover:grayscale-0">
      <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden="true">
        <rect
          x="1.5"
          y="1.5"
          width="29"
          height="29"
          rx={index % 2 === 0 ? 9 : 3}
          fill="none"
          className="stroke-cobalt"
          strokeWidth="1.6"
          strokeOpacity="0.75"
        />
        <circle
          cx="16"
          cy="16"
          r={index % 3 === 0 ? 5 : 3.2}
          className="fill-cobalt"
          fillOpacity="0.7"
        />
      </svg>
      <span className="whitespace-nowrap font-display text-[0.9375rem] font-semibold tracking-[-0.02em] text-navy">
        {name}
      </span>
    </div>
  );
}

/**
 * Chapter 07 — social proof.
 *
 * A continuous marquee of client marks, three testimonial cards, and a
 * compliance badge row.
 *
 * The marquee runs on a GSAP timeline rather than a CSS animation for one
 * reason: it can be paused. A perpetually moving strip is a genuine problem for
 * readers with vestibular sensitivity and for anyone trying to actually read a
 * name, so it stops on hover, stops on focus-within, and never starts at all
 * under `prefers-reduced-motion` (where it becomes a static wrapped grid).
 */
export function Trust() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      /* ---- Marquee -------------------------------------------------------- */
      const marquee = marqueeRef.current;
      if (marquee && !reducedMotion) {
        // The track contains the list twice; translating exactly -50% lands on
        // an identical frame, so the loop is seamless with no measurement.
        const loop = gsap.to(marquee, {
          xPercent: -50,
          duration: 38,
          ease: 'none',
          repeat: -1,
        });

        const pause = () => loop.pause();
        const resume = () => loop.resume();

        const container = marquee.parentElement;
        container?.addEventListener('pointerenter', pause);
        container?.addEventListener('pointerleave', resume);
        container?.addEventListener('focusin', pause);
        container?.addEventListener('focusout', resume);

        // Also stop when scrolled out of view — no reason to burn frames on it.
        ScrollTrigger.create({
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()),
        });
      }

      /* ---- Testimonials --------------------------------------------------- */
      const quotes = gsap.utils.toArray<HTMLElement>('[data-quote]');
      if (!quotes.length) return;

      if (reducedMotion) {
        gsap.set(quotes, { autoAlpha: 1, y: 0, rotateY: 0 });
        return;
      }

      gsap.set(quotes, { autoAlpha: 0, y: 48, rotateY: -6 });
      ScrollTrigger.batch(quotes, {
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
      {/* ---- Client marquee --------------------------------------------------- */}
      <div className="relative overflow-hidden py-6">
        <p className="sr-only" id="clients-label">
          Selected clients
        </p>
        <div
          className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
          aria-labelledby="clients-label"
          role="group"
        >
          <div ref={marqueeRef} className="flex w-max will-change-transform">
            {/* Rendered twice; the duplicate is hidden from assistive tech. */}
            {[0, 1].map((copy) => (
              <div key={copy} className="flex" aria-hidden={copy === 1 || undefined}>
                {clientNames.map((name, index) => (
                  <ClientMark key={`${copy}-${name}`} name={name} index={index} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-[10vh] w-full max-w-[88rem] px-6 sm:px-8 lg:px-14">
        <SectionIntro
          eyebrow="07 — Trust"
          title="Chosen by the people who *audit* the numbers."
          lede="Practice administrators, revenue operations leads and CFOs — the readers who check the working before they believe the headline."
          align="center"
        />
        <span id="trust-heading" className="sr-only">
          Client testimonials and compliance credentials
        </span>

        {/* ---- Testimonials --------------------------------------------------- */}
        <ul className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <li key={testimonial.id} data-quote style={{ opacity: 0 }}>
              <TiltCard className="h-full" intensity={5} lift={12}>
                <figure className="group flex h-full flex-col rounded-panel border border-hairline bg-surface p-8 shadow-rest transition-shadow duration-700 hover:shadow-lift sm:p-9">
                  <Quote
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 text-cobalt/35 transition-colors duration-500 group-hover:text-cobalt/70"
                  />
                  <blockquote className="mt-6 flex-1 text-[1.0625rem] leading-relaxed text-navy">
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="mt-8 border-t border-hairline pt-5">
                    <span className="block font-display font-semibold text-navy">
                      {testimonial.name}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] text-faint">
                      {testimonial.role} · {testimonial.org}
                    </span>
                  </figcaption>
                </figure>
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
            <a
              href="/about"
              className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-cobalt transition-colors duration-300 hover:text-cobalt-700"
            >
              More about who we are and how we work
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              />
            </a>
          </div>
        </FadeUp>

        <FadeUp delay={0.22}>
          <p className="mt-8 text-center text-sm text-faint">
            Client names and testimonials shown are placeholders for layout purposes.
            Replace with permissioned, attributable references before launch.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
