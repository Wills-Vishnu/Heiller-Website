'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  aboutPage,
  aboutPrinciples,
  aboutStats,
  aboutStory,
  engagementModel,
  leadership,
  locations,
} from '@/lib/page-content';

/**
 * Every block on `/about`.
 *
 * Four structures, none of which appear anywhere else on the site: a
 * full-bleed light hero, an asymmetric story block with inline figures, an
 * oversized numbered list, a descending staircase, and a roster strip. The
 * full inventory of what is already claimed is at the top of
 * `sections/SecurityMotion.tsx`.
 */

/* -------------------------------------------------------------------------- */
/* Hero — full-bleed, light, offset two-column                                 */
/* -------------------------------------------------------------------------- */

/**
 * Full-bleed like the other two heroes, but light and split.
 *
 * Home is full-bleed video, `/security` is full-bleed near-black; this is
 * full-bleed white with the headline and lede sitting side by side rather than
 * stacked. Same edge-to-edge commitment, a third distinct register — and the
 * side-by-side split is what stops it reading as the security hero with the
 * colours inverted.
 */
export function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set('[data-ah]', { autoAlpha: 1, y: 0 });
        gsap.set('[data-ah-rule]', { scaleX: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: EASE.cinema } })
        .fromTo(
          '[data-ah]',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12 },
          0.1,
        )
        .fromTo(
          '[data-ah-rule]',
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: EASE.glide, transformOrigin: 'left' },
          0.4,
        );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={ref}
      aria-labelledby="about-hero-heading"
      className="relative flex min-h-[62svh] w-full flex-col justify-end px-6 pb-16 pt-40 sm:px-8 lg:px-14 lg:pb-20"
    >
      <div className="mx-auto w-full max-w-[88rem]">
        <nav aria-label="Breadcrumb" data-ah className="opacity-0">
          <ol className="flex items-center gap-1.5 text-[0.8125rem] text-faint">
            <li>
              <Link href="/" className="link-underline hover:text-navy">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="flex items-center">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="text-navy/70">
              About us
            </li>
          </ol>
        </nav>

        <p
          data-ah
          className="mt-10 text-eyebrow font-semibold uppercase text-cobalt opacity-0"
        >
          {aboutPage.eyebrow}
        </p>

        {/* Headline and lede side by side — the split that distinguishes this
            from the other two heroes, both of which stack. */}
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <h1
            id="about-hero-heading"
            data-ah
            className="font-display text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.04em] text-navy opacity-0 lg:col-span-7"
          >
            {aboutPage.title.split(/(\*[^*]+\*)/g).filter(Boolean).map((seg, i) => {
              const accent = seg.startsWith('*') && seg.endsWith('*');
              return (
                <span key={i} className={accent ? 'text-cobalt' : undefined}>
                  {accent ? seg.slice(1, -1) : seg}
                </span>
              );
            })}
          </h1>

          <p
            data-ah
            className="text-lead text-muted opacity-0 lg:col-span-5 lg:pb-3"
          >
            {aboutPage.lede}
          </p>
        </div>

        <span
          data-ah-rule
          aria-hidden="true"
          className="mt-14 block h-px w-full origin-left bg-hairline-strong"
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Story — asymmetric block with inline figures                                */
/* -------------------------------------------------------------------------- */

/**
 * The argument, with the four figures set into its margin.
 *
 * Previously the story and the stat strip were two separate sections; merging
 * them removed a heading and a full block of vertical space, and the figures
 * now function as evidence *beside* the claim rather than as an unexplained
 * row of numbers after it.
 *
 * The opening paragraph is set at lead size and the rest at body — a single
 * step of contrast that tells the eye where to start without needing a
 * pull-quote or a rule.
 */
export function StoryBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-sb]');
      if (!items.length) return;

      if (reducedMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(items, { autoAlpha: 0, y: 26 });
      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: EASE.cinema,
            stagger: 0.1,
            overwrite: true,
          }),
      });
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <div ref={ref} className="grid gap-14 lg:grid-cols-12 lg:gap-16">
      <div className="flex flex-col gap-6 lg:col-span-7">
        {aboutStory.map((paragraph, index) => (
          <p
            key={index}
            data-sb
            className={[
              'opacity-0',
              index === 0
                ? 'text-lead text-navy/85'
                : 'text-[1.0625rem] leading-relaxed text-muted',
            ].join(' ')}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Figures in the margin. Stacked with rules rather than boxed — the
          editorial band on the home page owns horizontal figures, so these run
          vertically and sit alongside prose instead of standing alone. */}
      <dl className="lg:col-span-4 lg:col-start-9">
        {aboutStats.map((stat) => (
          <div
            key={stat.label}
            data-sb
            className="border-t border-hairline py-6 opacity-0 first:border-t-0 first:pt-0"
          >
            <dt className="font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-navy">
              {stat.value}
            </dt>
            <dd className="mt-2.5 text-[0.875rem] leading-relaxed text-muted">
              {stat.label}
            </dd>
          </div>
        ))}
        <p className="pt-2 text-[0.75rem] text-faint">
          Figures illustrative pending verification.
        </p>
      </dl>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Principles — oversized numbered list                                        */
/* -------------------------------------------------------------------------- */

/**
 * Four commitments as an oversized numbered list. No cards, no grid.
 *
 * The numeral does the structural work a card border would otherwise do — set
 * large and pale, it separates the entries visually while staying out of the
 * reading path. Each row spans the full measure, so the section reads as a
 * manifesto rather than as four feature tiles.
 */
export function PrincipleList() {
  const ref = useRef<HTMLOListElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>('[data-pr]');
      if (!rows.length) return;

      if (reducedMotion) {
        gsap.set(rows, { autoAlpha: 1, y: 0 });
        gsap.set('[data-pr-num]', { autoAlpha: 1 });
        return;
      }

      gsap.set(rows, { autoAlpha: 0, y: 30 });

      rows.forEach((row, index) => {
        const numeral = row.querySelector<HTMLElement>('[data-pr-num]');

        gsap.to(row, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: EASE.cinema,
          scrollTrigger: { trigger: row, start: 'top 88%', once: true },
        });

        if (numeral) {
          gsap.fromTo(
            numeral,
            { autoAlpha: 0, x: -14 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 1,
              ease: EASE.glide,
              delay: 0.12 + index * 0.03,
              scrollTrigger: { trigger: row, start: 'top 88%', once: true },
            },
          );
        }
      });
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <ol ref={ref} className="border-t border-hairline">
      {aboutPrinciples.map((principle, index) => (
        <li
          key={principle.title}
          data-pr
          className="group grid gap-4 border-b border-hairline py-10 opacity-0 lg:grid-cols-12 lg:items-baseline lg:gap-10"
        >
          <span
            data-pr-num
            aria-hidden="true"
            /* `text-navy/30`, not `text-haze`.
               `--color-haze` is a *divider* token — in dark mode it resolves to
               #1E2A47, which sits about two percent off the #0A0F1E canvas and
               made these numerals effectively invisible. `navy` is ink, so it
               inverts to near-white on dark; at 30% it lands as a legible grey
               against either background instead of dissolving into one of
               them. */
            className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-navy/30 transition-colors duration-500 group-hover:text-cobalt lg:col-span-2"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="font-display text-title font-semibold text-navy lg:col-span-4">
            {principle.title}
          </h3>
          <p className="text-[0.9375rem] leading-relaxed text-muted lg:col-span-6">
            {principle.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/* Engagement — descending staircase                                           */
/* -------------------------------------------------------------------------- */

/**
 * The four phases as a staircase, each stepped further right and down.
 *
 * Distinct from every other sequence on the site: Workflow runs a vertical
 * spine, `/security` runs a horizontal stepper, Complexity zig-zags around a
 * centre line. This descends diagonally, which suits a process where each
 * phase genuinely builds on the last rather than merely following it.
 *
 * The indent is a percentage of the container, so the diagonal holds its angle
 * at any width. Removed below `lg`, where a 45% indent on a phone would leave
 * the last card three words wide.
 */
const INDENT = ['lg:ml-0', 'lg:ml-[12%]', 'lg:ml-[24%]', 'lg:ml-[36%]'];

export function EngagementStaircase() {
  const ref = useRef<HTMLOListElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>('[data-es]');
      if (!steps.length) return;

      if (reducedMotion) {
        gsap.set(steps, { autoAlpha: 1, x: 0, y: 0 });
        return;
      }

      gsap.set(steps, { autoAlpha: 0, x: -28, y: 18 });
      steps.forEach((step) => {
        gsap.to(step, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.95,
          ease: EASE.cinema,
          scrollTrigger: { trigger: step, start: 'top 88%', once: true },
        });
      });
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <ol ref={ref} className="flex flex-col gap-6">
      {engagementModel.map((phase, index) => (
        <li
          key={phase.step}
          data-es
          className={[
            'relative max-w-[56ch] rounded-panel border border-hairline bg-surface p-8 opacity-0 shadow-rest',
            'transition-shadow duration-500 hover:shadow-lift',
            INDENT[index] ?? '',
          ].join(' ')}
        >
          {/* Riser: connects each tread to the one above, drawn only between
              steps so the first has nothing hanging off it. */}
          {index > 0 && (
            <span
              aria-hidden="true"
              className="absolute -top-6 left-8 hidden h-6 w-px bg-hairline-strong lg:block"
            />
          )}
          <p className="font-display text-sm font-semibold tabular-nums text-cobalt">
            {phase.step}
          </p>
          <h3 className="mt-2 font-display text-title font-semibold text-navy">
            {phase.title}
          </h3>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
            {phase.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/* Roster — team and locations in one strip                                    */
/* -------------------------------------------------------------------------- */

/**
 * Leadership and offices merged into a single column strip.
 *
 * Two sections became one: they answer the same underlying question — who and
 * where — and separating them cost a heading, a block of padding and a scroll
 * with very little content in it.
 *
 * Narrow columns under a shared top rule, no card boxes. The rule is what
 * groups them, which is a lighter structure than four bordered tiles and reads
 * as a masthead rather than a grid.
 */
export function RosterStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const cols = gsap.utils.toArray<HTMLElement>('[data-roster]');
      if (!cols.length) return;

      if (reducedMotion) {
        gsap.set(cols, { autoAlpha: 1, y: 0 });
        gsap.set('[data-roster-rule]', { scaleX: 1 });
        return;
      }

      gsap.set(cols, { autoAlpha: 0, y: 24 });
      gsap.set('[data-roster-rule]', { scaleX: 0, transformOrigin: 'left center' });

      gsap
        .timeline({
          scrollTrigger: { trigger: ref.current, start: 'top 84%', once: true },
        })
        .to('[data-roster-rule]', { scaleX: 1, duration: 1, ease: EASE.glide })
        .to(
          cols,
          { autoAlpha: 1, y: 0, duration: 0.85, ease: EASE.cinema, stagger: 0.1 },
          0.2,
        );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <div ref={ref}>
      <span
        data-roster-rule
        aria-hidden="true"
        className="block h-px w-full origin-left bg-hairline-strong"
      />

      <div className="grid gap-12 pt-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
        {leadership.map((person) => (
          <div key={person.role} data-roster className="opacity-0">
            <span
              aria-hidden="true"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline font-display text-sm font-semibold text-cobalt"
            >
              {person.initials}
            </span>
            <h3 className="mt-5 font-display text-[1rem] font-semibold text-navy">
              {person.name}
            </h3>
            <p className="mt-1 text-[0.8125rem] font-medium text-cobalt">
              {person.role}
            </p>
            <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
              {person.bio}
            </p>
          </div>
        ))}

        {locations.map((place) => (
          <div
            key={place.city}
            data-roster
            className="opacity-0 lg:border-l lg:border-hairline lg:pl-8"
          >
            <p className="text-eyebrow font-medium uppercase text-faint">
              {place.region}
            </p>
            <h3 className="mt-4 font-display text-[1rem] font-semibold text-navy">
              {place.city}
            </h3>
            <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
              {place.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Closing — centred rule-framed CTA                                           */
/* -------------------------------------------------------------------------- */

/**
 * Light, centred, framed by two rules.
 *
 * `/security` ends on a full-bleed dark band, so this deliberately does the
 * opposite — the two pages should not resolve the same way. No panel, no
 * gradient, no aurora: just type between two hairlines, which is the quietest
 * ending available and the right one after a page about who you are.
 */
export function AboutClosing() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set('[data-ac]', { autoAlpha: 1, y: 0 });
        gsap.set('[data-ac-rule]', { scaleX: 1 });
        return;
      }

      gsap
        .timeline({
          scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
        })
        .fromTo(
          '[data-ac-rule]',
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: EASE.glide, stagger: 0.12 },
        )
        .fromTo(
          '[data-ac]',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE.cinema, stagger: 0.1 },
          0.25,
        );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <div ref={ref} className="text-center">
      <span
        data-ac-rule
        aria-hidden="true"
        className="mx-auto block h-px w-full max-w-md origin-center bg-hairline-strong"
      />

      <h2
        data-ac
        className="mx-auto mt-14 max-w-[18ch] font-display text-headline font-semibold text-navy opacity-0"
      >
        Start with the audit.
      </h2>
      <p
        data-ac
        className="mx-auto mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted opacity-0"
      >
        Ninety days of claims, leakage quantified by root cause, findings handed
        over whether or not you work with us.
      </p>
      <div data-ac className="mt-9 opacity-0">
        <Link
          href="/#contact"
          className="group inline-flex items-center gap-2 rounded-pill bg-inverse px-7 py-3.5 text-[0.9375rem] font-medium text-on-inverse transition-transform duration-300 hover:scale-[1.03]"
        >
          Get a free revenue audit
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <span
        data-ac-rule
        aria-hidden="true"
        className="mx-auto mt-16 block h-px w-full max-w-md origin-center bg-hairline-strong"
      />
    </div>
  );
}
