'use client';

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { services } from '@/lib/site';

/**
 * Chapter 03 — the capability set.
 *
 * LAYOUT: a bento grid.
 *
 * Nine services in a uniform three-by-three read as a price list — every item
 * given identical weight, nothing to look at first, and structurally the same
 * as the Security grid further down. A bento fixes both: mixed cell sizes give
 * the eye an entry point and a path, and the irregular silhouette is
 * unmistakably not the section below it.
 *
 * SPANS
 * A six-column track, not four. Six is what lets nine cards of mixed size tile
 * *exactly* — no ragged final row, no `grid-flow-dense` papering over holes:
 *
 *   row 1   feature (2) + wide (4)
 *   row 2   feature continues (2) + two standard (2 + 2)
 *   row 3   three standard (2 + 2 + 2)
 *   row 4   two half-width (3 + 3)
 *
 * The first service gets the tall cell and the second the wide one, so the two
 * highest-value capabilities carry visual weight proportional to their
 * commercial weight.
 *
 * ⚠️ The spans below assume exactly nine services. Add or remove one and the
 * last row goes ragged — recompute the map so each row still sums to six.
 *
 * ENTRANCE
 * `ScrollTrigger.batch` groups whatever enters in the same frame into one
 * stagger, so a flick delivers the whole grid at once and a slow scroll
 * delivers it in sequence. Each card enters with a small `rotateX` as well as
 * a translate — depth on entry is what makes the grid read as a stack of
 * physical objects settling rather than boxes fading up.
 *
 * The icon inside each card gets its own nested tween a beat later. Secondary
 * motion arriving just after the primary is what reads as crafted rather than
 * as everything moving at once.
 */

/**
 * Bento placement by index, against a six-column track. Every row sums to six
 * — see the tiling table in the component doc above.
 */
const SPANS: readonly string[] = [
  'lg:col-span-2 lg:row-span-2', // 0 — tall feature
  'lg:col-span-4', // 1 — wide
  'lg:col-span-2', // 2
  'lg:col-span-2', // 3
  'lg:col-span-2', // 4
  'lg:col-span-2', // 5
  'lg:col-span-2', // 6
  'lg:col-span-3', // 7 — half
  'lg:col-span-3', // 8 — half
];

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-service-card]');
      const icons = gsap.utils.toArray<HTMLElement>('[data-service-icon]');
      if (!cards.length) return;

      if (reducedMotion) {
        gsap.set(cards, { autoAlpha: 1, y: 0, rotateX: 0, filter: 'none' });
        gsap.set(icons, { scale: 1, rotate: 0 });
        return;
      }

      gsap.set(cards, { autoAlpha: 0, y: 56, rotateX: -8, filter: 'blur(8px)' });
      gsap.set(icons, { scale: 0.55, rotate: -14, transformOrigin: 'center' });

      ScrollTrigger.batch(cards, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 1.05,
            ease: EASE.cinema,
            stagger: { each: 0.075, from: 'start' },
            overwrite: true,
          });

          // Map each card in this batch back to its own icon so the stagger
          // stays correct even when batches fire out of full-grid order (a
          // fast scroll can enter cards 4–9 in one batch while 1–3 arrived
          // in an earlier one).
          const batchIcons = batch
            .map((card) => card.querySelector<HTMLElement>('[data-service-icon]'))
            .filter((icon): icon is HTMLElement => Boolean(icon));

          gsap.to(batchIcons, {
            scale: 1,
            rotate: 0,
            duration: 0.8,
            ease: 'back.out(1.8)',
            delay: 0.16,
            stagger: { each: 0.075, from: 'start' },
            overwrite: true,
          });
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className="relative scroll-mt-24 py-[14vh] lg:py-[18vh]"
    >
      <div className="mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-14">
        <SectionIntro
          eyebrow="03 — Automation"
          title="Nine disciplines. *One* accountable system."
          lede="Take one function or take the whole cycle. Either way you get the same operating model: measured handoffs, a named owner for every claim, and a feedback loop that pushes every failure back to the step that caused it."
          className="max-w-3xl"
        />
        <span id="services-heading" className="sr-only">
          Revenue cycle management services
        </span>

        <ul className="mt-16 grid auto-rows-[minmax(13rem,auto)] grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-24 lg:grid-cols-6 lg:gap-6">
          {services.map((service, index) => {
            const isFeature = index === 0;
            return (
              <li
                key={service.id}
                data-service-card
                className={SPANS[index] ?? 'lg:col-span-2'}
                style={{ opacity: 0 }}
              >
                {/* No `TiltCard` on the feature cell: a two-row card tilting
                    under the pointer moves far more pixels at its corners than
                    a small one, and the effect goes from subtle to seasick. */}
                <article
                  className={[
                    'group relative flex h-full flex-col rounded-panel border border-hairline bg-surface p-8 shadow-rest',
                    'transition-shadow duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-lift',
                    isFeature ? 'lg:p-10' : '',
                  ].join(' ')}
                >
                  {/* Index — decorative, hidden from the accessibility tree so
                      the list is not read as "zero one Medical Coding". */}
                  <span
                    aria-hidden="true"
                    className="absolute right-7 top-7 font-display text-sm font-semibold tabular-nums text-haze transition-colors duration-500 group-hover:text-cobalt/45"
                  >
                    {service.index}
                  </span>

                  <ServiceIcon name={service.icon} />

                  <h3
                    className={[
                      'mt-7 text-navy',
                      isFeature ? 'text-headline' : 'text-title',
                    ].join(' ')}
                  >
                    {service.title}
                  </h3>

                  <p
                    className={[
                      'mt-3.5 flex-1 leading-relaxed text-muted',
                      isFeature ? 'max-w-[46ch] text-lead' : 'text-[0.9375rem]',
                    ].join(' ')}
                  >
                    {service.summary}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-hairline pt-5">
                    <span className="text-eyebrow font-medium uppercase text-faint">
                      {service.metric}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 text-haze transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cobalt"
                    />
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
