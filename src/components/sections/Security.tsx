'use client';

import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { SecurityGlyph } from '@/components/ui/SecurityGlyph';
import { securityPillars } from '@/lib/site';

/**
 * Chapter 05 — trust as an engineering property.
 *
 * LAYOUT: stepped columns.
 *
 * Six pillars in a flat three-by-two was structurally identical to the
 * Services grid two chapters earlier — same column count, same uniform cells,
 * same silhouette. Here each column is offset progressively further down, so
 * the six cards descend on a diagonal.
 *
 * The offset is a layout decision, not a decorative one: it means the reader's
 * eye travels *through* the set rather than scanning a block, and every card
 * arrives at a different scroll position, which is what gives the batch
 * reveal below something to stagger against. A flat grid delivers all three of
 * a row simultaneously and the stagger is wasted.
 *
 * It also keeps the section calm, which matters here. This is the quietest
 * beat on the page by design — after four chapters of motion, stillness is the
 * strongest available signal for "safe" — so the interest comes from
 * composition rather than from anything moving.
 *
 * The offsets only apply at `lg`. Below that the grid collapses to one or two
 * columns where a vertical offset would just look like a broken margin.
 */

/** Vertical offset per column position. Applied at `lg` only. */
const STEP = ['lg:mt-0', 'lg:mt-16', 'lg:mt-32'];

export function Security() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-pillar]');
      const glyphs = gsap.utils.toArray<HTMLElement>('[data-security-glyph]');
      if (!cards.length) return;

      if (reducedMotion) {
        gsap.set(cards, { autoAlpha: 1, y: 0, filter: 'none' });
        gsap.set(glyphs, { scale: 1, autoAlpha: 1 });
        gsap.set('[data-security-cta]', { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        '[data-security-cta]',
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: EASE.glide,
          scrollTrigger: {
            trigger: '[data-security-cta]',
            start: 'top 92%',
            once: true,
          },
        },
      );

      gsap.set(cards, { autoAlpha: 0, y: 40, filter: 'blur(6px)' });
      gsap.set(glyphs, { scale: 0.7, autoAlpha: 0, transformOrigin: 'center' });

      ScrollTrigger.batch(cards, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.1,
            ease: EASE.cinema,
            stagger: 0.08,
            overwrite: true,
          });

          const batchGlyphs = batch
            .map((card) => card.querySelector<HTMLElement>('[data-security-glyph]'))
            .filter((glyph): glyph is HTMLElement => Boolean(glyph));

          gsap.to(batchGlyphs, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.9,
            ease: 'power3.out',
            delay: 0.2,
            stagger: 0.08,
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
      id="security"
      aria-labelledby="security-heading"
      className="relative scroll-mt-24 py-[14vh] lg:py-[20vh]"
    >
      <div className="mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-14">
        {/* Heading sits left here rather than centred, so it does not echo
            Complexity's centred intro earlier in the page. */}
        <SectionIntro
          eyebrow="05 — Security"
          title="Protected health information, treated *accordingly.*"
          lede="Every control below is verifiable, not asserted. If your compliance officer wants the evidence, we hand over the artefacts — policies, logs, attestations and the last penetration test."
          className="max-w-3xl"
        />
        <span id="security-heading" className="sr-only">
          Security and compliance
        </span>

        {/* `items-start` is load-bearing: without it the grid stretches every
            card to the tallest in its row and the stepped offsets collapse
            back into a flat block. */}
        <ul className="mt-16 grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {securityPillars.map((pillar, index) => (
            <li
              key={pillar.id}
              data-pillar
              className={[
                'group relative rounded-panel border border-hairline bg-surface p-9 shadow-rest',
                'transition-shadow duration-700 hover:shadow-lift sm:p-10',
                STEP[index % 3],
              ].join(' ')}
              style={{ opacity: 0 }}
            >
              {/* Corner accent that draws in on hover. */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-cobalt to-transparent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
              />

              <SecurityGlyph name={pillar.glyph} />

              <h3 className="mt-7 text-title text-navy">{pillar.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                {pillar.body}
              </p>
            </li>
          ))}
        </ul>

        {/* Route into the full page. The six pillars here are a summary; the
            attestations, PHI lifecycle, subprocessor list and incident windows
            a compliance reviewer actually needs live on /security.

            Deliberately NOT tagged `data-pillar`: that batch maps each card to
            its own [data-security-glyph] child, and this link has no glyph. */}
        <div
          data-security-cta
          className="mt-16 text-center lg:mt-24"
          style={{ opacity: 0 }}
        >
          <a
            href="/security"
            className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-cobalt transition-colors duration-300 hover:text-cobalt-700"
          >
            See every control, attestation and subprocessor
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
