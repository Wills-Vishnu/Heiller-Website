'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Mail } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CountUp } from '@/components/ui/CountUp';
import { ScrambleText } from '@/components/ui/ScrambleText';
import { SecurityGlyph } from '@/components/ui/SecurityGlyph';
import { securityPillars } from '@/lib/site';
import {
  attestations,
  dataLifecycle,
  disclosure,
  incidentTiers,
  securityPage,
  subprocessors,
} from '@/lib/page-content';

/**
 * Every block on `/security`.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHY THIS PAGE WAS REBUILT: `bg-inverse` IS NOT "DARK"
 *
 * The previous version used `bg-inverse` / `text-on-inverse` for the hero and
 * the closing band, intending them to read as dramatic dark slabs. Those
 * tokens mean *"the opposite of the current page"* — they exist so the primary
 * button can be near-black on a light page and near-white on a dark one.
 *
 * So in light mode the hero was dark, as intended. In **dark mode it flipped
 * to near-white**, and the page appeared to switch themes halfway down: a
 * blazing white hero above near-black content. That is the inversion that made
 * the page look broken, and no amount of restyling fixes it while those tokens
 * are load-bearing for full sections.
 *
 * The rule this produced, now applied everywhere here:
 *
 *   `inverse` / `on-inverse` → small elements only (buttons, pills, chips)
 *   whole sections           → `surface` / `frost` / `mist`, which track the
 *                              theme in the same direction as everything else
 *
 * A section that must be dark in *both* themes would need its own non-flipping
 * token pair. None is used here, because a page that ignores the reader's
 * theme choice is a worse answer than one that follows it.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE SECOND FIX: ROOM TO READ
 *
 * The old lifecycle ran five columns across at desktop — roughly 230px each,
 * for paragraphs of 40+ words. That is a column of confetti. It is now
 * full-width horizontal bands, so every line has the whole measure. The
 * attestations came off an overlapping stack (negative margins eating into
 * the text) onto a roomy two-by-two.
 *
 * General principle for this page: it is read closely by one person doing a
 * job, not skimmed. Density is the enemy.
 */

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Full-bleed, theme-following, with a meta row instead of a lede paragraph.
 *
 * Distinct from the other two heroes: home is video, `/about` splits headline
 * and lede side by side. This one runs the headline full width and puts four
 * scannable facts underneath on a divided row — the shape of a document
 * header, which is the right signal for a page of evidence.
 */
export function SecurityHero() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const meta = [
    { k: 'Framework', v: 'HIPAA' },
    { k: 'Encryption', v: 'AES-256 · TLS 1.2+' },
    { k: 'Access', v: 'Per-client, least privilege' },
    { k: 'Breach notice', v: '24 hours' },
  ];

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set('[data-sh]', { autoAlpha: 1, y: 0 });
        gsap.set('[data-sh-rule]', { scaleX: 1 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: EASE.cinema } })
        .fromTo(
          '[data-sh]',
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.11 },
          0.1,
        )
        .fromTo(
          '[data-sh-rule]',
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: EASE.glide, transformOrigin: 'left' },
          0.45,
        );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={ref}
      aria-labelledby="security-hero-heading"
      className="relative flex min-h-[58svh] w-full flex-col justify-end px-6 pb-14 pt-40 sm:px-8 lg:px-14 lg:pb-16"
    >
      <div className="mx-auto w-full max-w-[88rem]">
        <nav aria-label="Breadcrumb" data-sh className="opacity-0">
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
              Security
            </li>
          </ol>
        </nav>

        <p
          data-sh
          className="mt-10 text-eyebrow font-semibold uppercase text-cobalt opacity-0"
        >
          {securityPage.eyebrow}
        </p>

        <h1
          id="security-hero-heading"
          data-sh
          className="mt-6 max-w-[18ch] font-display text-[clamp(2.5rem,6.5vw,5rem)] font-semibold leading-[1] tracking-[-0.04em] text-navy opacity-0"
        >
          <ScrambleText text={securityPage.title.replace(/\*/g, '')} />
        </h1>

        <p data-sh className="mt-8 max-w-[62ch] text-lead text-muted opacity-0">
          {securityPage.lede}
        </p>

        <span
          data-sh-rule
          aria-hidden="true"
          className="mt-14 block h-px w-full origin-left bg-hairline-strong"
        />

        {/* Meta row — the header of a document, not a marketing subhead. */}
        <dl data-sh className="grid gap-8 pt-8 opacity-0 sm:grid-cols-2 lg:grid-cols-4">
          {meta.map((item) => (
            <div key={item.k}>
              <dt className="text-eyebrow font-medium uppercase text-faint">
                {item.k}
              </dt>
              <dd className="mt-2 font-display text-[1.0625rem] font-semibold text-navy">
                {item.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Attestations — roomy two-by-two                                             */
/* -------------------------------------------------------------------------- */

/**
 * A single HIPAA attestation, at generous padding.
 *
 * This used to be a four-up grid (HIPAA, SOC 2, HITRUST, ISO 27001). The
 * other three were removed as unverified claims — heiller has never been
 * audited against them — rather than hedged with "aligned to" language,
 * because that distinction is exactly the kind of thing a government
 * reviewer checks. One real attestation beats four asserted ones, so this
 * renders as a single wide panel instead of stretching a lone tile across a
 * now-empty two-column grid.
 */
export function AttestationGrid() {
  const ref = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const tiles = gsap.utils.toArray<HTMLElement>('[data-att]');
      if (!tiles.length) return;

      if (reducedMotion) {
        gsap.set(tiles, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(tiles, { autoAlpha: 0, y: 32 });
      ScrollTrigger.batch(tiles, {
        start: 'top 86%',
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
    <ul ref={ref} className="grid gap-6">
      {attestations.map((item) => (
        <li
          key={item.id}
          data-att
          className="rounded-panel border border-hairline bg-surface p-9 opacity-0 shadow-rest transition-shadow duration-500 hover:shadow-lift lg:p-11"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <h3 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-none tracking-[-0.02em] text-navy">
              {item.label}
            </h3>
            <span className="rounded-pill bg-cobalt/10 px-3 py-1 text-[0.75rem] font-medium text-cobalt">
              {item.status}
            </span>
          </div>

          <p className="mt-6 max-w-[60ch] text-[1rem] leading-relaxed text-navy/85">
            {item.summary}
          </p>
          <p className="mt-4 max-w-[60ch] text-[0.9375rem] leading-relaxed text-muted">
            {item.detail}
          </p>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* Lifecycle — full-width bands                                                */
/* -------------------------------------------------------------------------- */

/**
 * The five PHI stages as full-width horizontal bands.
 *
 * Replaces a five-across stepper whose columns were ~230px wide — far too
 * narrow for 40-word paragraphs, and the single worst readability problem on
 * the old page. Each stage now gets the full measure: number and title in a
 * fixed left column, body running to a comfortable 70 characters beside it.
 *
 * The accent edge on the left grows from zero height as each band enters, so
 * the sequence still reads as a pipeline being laid down rather than a plain
 * list — the motion carries the meaning the horizontal axis used to.
 */
export function LifecycleBands() {
  const ref = useRef<HTMLOListElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const bands = gsap.utils.toArray<HTMLElement>('[data-band]');
      if (!bands.length) return;

      if (reducedMotion) {
        gsap.set(bands, { autoAlpha: 1, y: 0 });
        gsap.set('[data-band-edge]', { scaleY: 1 });
        return;
      }

      gsap.set(bands, { autoAlpha: 0, y: 24 });
      gsap.set('[data-band-edge]', { scaleY: 0, transformOrigin: 'top center' });

      bands.forEach((band) => {
        const edge = band.querySelector<HTMLElement>('[data-band-edge]');
        const trigger = { trigger: band, start: 'top 88%', once: true } as const;

        gsap.to(band, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: EASE.cinema,
          scrollTrigger: trigger,
        });

        if (edge) {
          gsap.to(edge, {
            scaleY: 1,
            duration: 0.9,
            ease: 'power3.out',
            delay: 0.15,
            scrollTrigger: trigger,
          });
        }
      });
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <ol ref={ref} className="flex flex-col">
      {dataLifecycle.map((stage) => (
        <li
          key={stage.step}
          data-band
          className="relative border-t border-hairline py-10 opacity-0 last:border-b lg:py-12"
        >
          <span
            data-band-edge
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-[3px] bg-cobalt"
          />

          <div className="grid gap-5 pl-8 lg:grid-cols-12 lg:gap-12 lg:pl-10">
            <div className="lg:col-span-4">
              <p className="font-display text-sm font-semibold tabular-nums text-cobalt">
                {stage.step}
              </p>
              <h3 className="mt-2 font-display text-title font-semibold text-navy">
                {stage.title}
              </h3>
            </div>
            <p className="max-w-[70ch] text-[1rem] leading-relaxed text-muted lg:col-span-8">
              {stage.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/* Controls — definition list                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The six control families as a definition list. Kept from the previous
 * version — it was the one block that was already roomy and card-free.
 */
export function ControlList() {
  const ref = useRef<HTMLDListElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>('[data-ctrl-row]');
      if (!rows.length) return;

      if (reducedMotion) {
        gsap.set(rows, { autoAlpha: 1, x: 0 });
        return;
      }

      gsap.set(rows, { autoAlpha: 0, x: -18 });
      ScrollTrigger.batch(rows, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            x: 0,
            duration: 0.75,
            ease: EASE.glide,
            stagger: 0.07,
            overwrite: true,
          }),
      });
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <dl ref={ref} className="border-t border-hairline">
      {securityPillars.map((pillar) => (
        <div
          key={pillar.id}
          data-ctrl-row
          className="group grid gap-5 border-b border-hairline py-9 opacity-0 transition-colors duration-500 hover:bg-cobalt-50/30 lg:grid-cols-12 lg:items-start lg:gap-12 lg:px-4"
        >
          <dt className="flex items-center gap-4 lg:col-span-4">
            <SecurityGlyph name={pillar.glyph} className="h-9 w-9 shrink-0 text-cobalt" />
            <span className="font-display text-[1.0625rem] font-semibold text-navy">
              {pillar.title}
            </span>
          </dt>
          <dd className="max-w-[70ch] text-[0.9375rem] leading-relaxed text-muted lg:col-span-8">
            {pillar.body}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* -------------------------------------------------------------------------- */
/* Subprocessors — data table                                                  */
/* -------------------------------------------------------------------------- */

export function SubprocessorTable() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const rootEl = ref.current;
      const rows = gsap.utils.toArray<HTMLElement>('[data-sp-row]');
      if (!rows.length) return;

      // Plain `.querySelector` on the guarded ref, not `ref.current?.querySelector`
      // — the `?.` widens the result to `HTMLElement | null | undefined`, and
      // GSAP's `TweenTarget` accepts `null` but not `undefined`.
      const sweep = rootEl?.querySelector<HTMLElement>('[data-sp-sweep]') ?? null;

      if (reducedMotion) {
        gsap.set(rows, { autoAlpha: 1, y: 0 });
        if (sweep) gsap.set(sweep, { autoAlpha: 0 });
        return;
      }

      gsap.set(rows, { autoAlpha: 0, y: 12 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 84%', once: true },
      });

      if (sweep) {
        tl.fromTo(
          sweep,
          { yPercent: -120, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.3 },
          0,
        )
          .to(sweep, { yPercent: 120, duration: 1, ease: 'power1.inOut' }, 0.3)
          .to(sweep, { autoAlpha: 0, duration: 0.3 }, 1.1);
      }

      tl.to(
        rows,
        { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE.glide, stagger: 0.1 },
        0.38,
      );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-panel border border-hairline bg-surface"
    >
      <span
        data-sp-sweep
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 opacity-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-cobalt) 14%, transparent), transparent)',
        }}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <caption className="sr-only">
            Subprocessors, purpose, hosting region and BAA status
          </caption>
          <thead>
            <tr className="border-b border-hairline bg-mist/40">
              {['Subprocessor', 'Purpose', 'Region', 'BAA'].map((head) => (
                <th
                  key={head}
                  scope="col"
                  className="px-7 py-5 text-eyebrow font-medium uppercase text-faint"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subprocessors.map((row) => (
              <tr
                key={row.name}
                data-sp-row
                className="border-b border-hairline transition-colors duration-500 last:border-0 hover:bg-cobalt-50/40"
              >
                <th
                  scope="row"
                  className="px-7 py-6 text-[0.9375rem] font-medium text-navy"
                >
                  {row.name}
                </th>
                <td className="px-7 py-6 text-[0.9375rem] text-muted">{row.purpose}</td>
                <td className="px-7 py-6 text-[0.9375rem] text-muted">{row.region}</td>
                <td className="px-7 py-6 text-[0.9375rem] text-positive">{row.baa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Closing — incidents, disclosure, packet                                     */
/* -------------------------------------------------------------------------- */

/**
 * Closing block, on the page's own surface rather than an inverted slab.
 *
 * This was the other half of the theme bug: a full-bleed `bg-inverse` band
 * that went near-white in dark mode. It now sits on `mist`, a recessed tone
 * that darkens in dark mode and lightens in light — separating it from the
 * sections above without ever fighting the theme.
 *
 * The three incident windows keep their counters; only the container changed.
 */
export function ClosingBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-cb]');
      if (!items.length) return;

      if (reducedMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(items, { autoAlpha: 0, y: 22 });
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: EASE.cinema,
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
      });
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <div ref={ref} className="rounded-panel bg-mist/60 p-9 lg:p-14">
      <h2
        data-cb
        className="max-w-[18ch] font-display text-headline font-semibold text-navy opacity-0"
      >
        What happens on the worst day.
      </h2>
      <p data-cb className="mt-4 max-w-[58ch] text-lead text-muted opacity-0">
        These windows are commitments, not intentions. The point of publishing them
        is that you can hold us to them.
      </p>

      <ul data-cb className="mt-12 grid gap-6 opacity-0 lg:grid-cols-3">
        {incidentTiers.map((tier) => (
          <li
            key={tier.level}
            className="rounded-card border border-hairline bg-surface p-7"
          >
            <p className="text-eyebrow font-semibold uppercase text-cobalt">
              {tier.level}
            </p>
            <p className="mt-4 font-display text-[2.25rem] font-semibold leading-none tracking-[-0.03em] text-navy">
              <CountUp value={tier.window} suffix={tier.unit} duration={1.4} />
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
              {tier.definition}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-14 grid gap-10 border-t border-hairline pt-12 lg:grid-cols-2 lg:gap-16">
        <div data-cb className="opacity-0">
          <h3 className="font-display text-title font-semibold text-navy">
            {disclosure.title}
          </h3>
          <p className="mt-4 max-w-[54ch] text-[0.9375rem] leading-relaxed text-muted">
            {disclosure.body}
          </p>
          <a
            href={disclosure.emailHref}
            className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-cobalt transition-colors duration-300 hover:text-cobalt-700"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span className="link-underline">{disclosure.email}</span>
          </a>
        </div>

        <div data-cb className="opacity-0">
          <h3 className="font-display text-title font-semibold text-navy">
            Request the full security packet
          </h3>
          <p className="mt-4 max-w-[54ch] text-[0.9375rem] leading-relaxed text-muted">
            Our security policy set, HIPAA compliance documentation and BAA
            template. Under NDA, usually the same business day.
          </p>
          {/* `bg-inverse` is correct *here* — a small element that should read
              as the opposite of its surroundings in either theme. */}
          <Link
            href="/#contact"
            className="group mt-7 inline-flex items-center gap-2 rounded-pill bg-inverse px-6 py-3 text-[0.9375rem] font-medium text-on-inverse transition-transform duration-300 hover:scale-[1.03]"
          >
            Request the packet
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
