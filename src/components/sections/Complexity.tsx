'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { complexityFacets } from '@/lib/site';

/**
 * Chapter 02 — healthcare complexity.
 *
 * LAYOUT: facets alternating either side of a centre spine.
 *
 * The previous version was a vertical list in a right-hand column beside a
 * sticky heading — structurally the same as Problem above it, which made two
 * consecutive chapters read as one. This inverts the whole skeleton: the
 * heading is centred at the top, and the four facets accumulate down a central
 * line, alternating sides, each tethered to the spine by a short connector.
 *
 * The form carries the argument. "Nobody designed this system, it accumulated"
 * is a claim about sediment building up either side of a fault, and that is
 * literally the shape on screen — where a tidy single-column list said the
 * opposite of the sentence above it.
 *
 * WHY NOT A PIN
 * An earlier version pinned the intro and scrubbed through the facets. With
 * all four stacked in normal flow the pinned block ran taller than a laptop
 * viewport, and a pin makes anything past the fold *unreachable* — scrolling
 * advances the timeline rather than the content. Batched reveals have none of
 * that failure mode.
 */
export function Complexity() {
  const sectionRef = useRef<HTMLElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const facets = gsap.utils.toArray<HTMLElement>('[data-facet]');
      if (!facets.length) return;

      if (reducedMotion) {
        gsap.set(facets, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0, x: 0 });
        gsap.set('[data-facet-node]', { scale: 1, autoAlpha: 1 });
        gsap.set('[data-spine-fill]', { scaleY: 1 });
        return;
      }

      /* Spine fills as the reader descends, so the line reads as being laid
         down by the scroll rather than pre-existing. Scrubbed, so scrolling
         back up retracts it. */
      gsap.set('[data-spine-fill]', { scaleY: 0, transformOrigin: 'top center' });
      gsap.to('[data-spine-fill]', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: spineRef.current,
          start: 'top 72%',
          end: 'bottom 60%',
          scrub: 0.6,
        },
      });

      /* Facets wipe in with a clip-path mask — a mask reads as something being
         *uncovered*, which is the right verb for this chapter — and slide in
         from whichever side they sit on. */
      facets.forEach((facet) => {
        const fromLeft = facet.dataset.side === 'left';
        gsap.set(facet, {
          autoAlpha: 0,
          clipPath: 'inset(0% 0% 100% 0%)',
          y: 30,
          x: fromLeft ? -24 : 24,
        });
      });

      ScrollTrigger.batch(facets, {
        start: 'top 86%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            x: 0,
            duration: 1,
            ease: EASE.glide,
            stagger: 0.12,
            overwrite: true,
          });

          // The node on the spine ignites just after its facet arrives.
          const nodes = batch
            .map((facet) =>
              facet
                .closest('[data-facet-row]')
                ?.querySelector<HTMLElement>('[data-facet-node]'),
            )
            .filter((node): node is HTMLElement => Boolean(node));

          gsap.fromTo(
            nodes,
            { scale: 0.2, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.7,
              ease: 'back.out(2.2)',
              stagger: 0.12,
              delay: 0.18,
              overwrite: true,
            },
          );
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="complexity"
      aria-labelledby="complexity-heading"
      className="relative py-[14vh] lg:py-[18vh]"
    >
      <div className="mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-14">
        <SectionIntro
          eyebrow="02 — Complexity"
          title="Nobody designed this system. It *accumulated.*"
          lede="Four decades of payer contracts, coding revisions and compliance rules, each layered on the last. Your staff are not bad at their jobs. They are operating a machine that was never assembled on purpose."
          align="center"
        />
        <span id="complexity-heading" className="sr-only">
          Why healthcare revenue cycles are complex
        </span>

        <div ref={spineRef} className="relative mx-auto mt-20 max-w-5xl lg:mt-28">
          {/* Spine. Hidden below `lg`, where the layout collapses to a single
              column and a centre line would just be a stray rule. */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-hairline lg:block"
          >
            <span
              data-spine-fill
              className="absolute inset-0 block w-px origin-top bg-gradient-to-b from-cobalt to-cobalt-400"
            />
          </span>

          <ol className="flex flex-col gap-10 lg:gap-4">
            {complexityFacets.map((facet, index) => {
              const isLeft = index % 2 === 0;
              return (
                <li
                  key={facet.title}
                  data-facet-row
                  className="relative lg:grid lg:grid-cols-2 lg:items-center lg:gap-16"
                >
                  {/* Node on the spine. */}
                  <span
                    data-facet-node
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 z-10 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt ring-4 ring-frost lg:block"
                  />

                  <div
                    data-facet
                    data-side={isLeft ? 'left' : 'right'}
                    className={[
                      'surface-card rounded-panel p-8 transition-colors duration-500 hover:bg-cobalt-50/40 sm:p-9',
                      // Column placement is what produces the zig-zag. Row
                      // placement is explicit so the two columns never
                      // auto-flow into the wrong row.
                      isLeft
                        ? 'lg:col-start-1 lg:text-right'
                        : 'lg:col-start-2',
                    ].join(' ')}
                  >
                    <span
                      aria-hidden="true"
                      className="font-display text-sm font-semibold tabular-nums text-cobalt"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 text-title text-navy">{facet.title}</h3>
                    <p
                      className={[
                        'mt-3 leading-relaxed text-muted',
                        isLeft ? 'lg:ml-auto' : '',
                        'max-w-[46ch]',
                      ].join(' ')}
                    >
                      {facet.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
