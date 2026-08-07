'use client';

import { useRef } from 'react';
import { Check, TrendingDown, TrendingUp } from 'lucide-react';
import { gsap, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scrollState } from '@/lib/scroll-state';
import {
  dashboard,
  dashboardStats,
  sparklinePath,
  stackTabs,
} from '@/lib/hero-visual';

/**
 * The hero illustration: a claim moving from paper to posted revenue.
 *
 * WHY THIS IS DOM AND SVG RATHER THAN AN IMAGE
 * The requirement was that it animate piece by piece as the reader scrolls.
 * A flat render can only ever move as one rectangle. Built as real elements,
 * every tab, card, chart and tick is independently addressable — which is what
 * makes the composition able to assemble itself, and later drift apart, in
 * response to scroll position.
 *
 * THE COMPOSITION READS LEFT TO RIGHT AS A PROCESS
 *   1. STACK      unstructured paper, tabbed by the five intake stages
 *   2. CLIPBOARD  the adjudication moment — "Claim Approved"
 *   3. LAPTOP     the outcome, as revenue the practice can actually see
 * That ordering is the entire argument of the page compressed into one image,
 * so the entrance animation deliberately plays in that same order rather than
 * revealing everything at once.
 *
 * DEPTH WITHOUT 3D
 * Everything sits inside a single shared `perspective` with elements at
 * different `translateZ`, so the pointer-parallax and scroll-tilt produce real
 * parallax separation between the stack, clipboard and laptop rather than a
 * flat layer sliding. No WebGL, no 3D library — just CSS transforms, which the
 * compositor handles on its own thread.
 */

const CHART_W = 168;
const CHART_H = 54;

export function HeroVisual({ className = '' }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Pointer parallax gets its OWN element rather than sharing `stage`.
  // Both effects want to write rotateX — the scrubbed scroll tilt and the
  // pointer follow — and GSAP resolves that by last-write-wins on a shared
  // property, so on one element the two silently overwrite each other every
  // frame and the parallax appears dead. Two nested transforms compose
  // instead of competing.
  const tiltRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const line = stage.querySelector<SVGPathElement>('[data-spark-line]');
      const area = stage.querySelector<SVGPathElement>('[data-spark-area]');

      /* ---- Reduced motion: assemble everything, statically ----------------- */
      if (reducedMotion) {
        gsap.set(['[data-layer]', '[data-tab]', '[data-stat]', '[data-check]'], {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
        });
        if (line) gsap.set(line, { strokeDashoffset: 0 });
        if (area) gsap.set(area, { autoAlpha: 1 });
        gsap.set([stage, tiltRef.current], { rotateX: 0, rotateY: 0, scale: 1 });
        return;
      }

      /* ---- Intro: the composition assembles ------------------------------- */
      const intro = gsap.timeline({ defaults: { ease: EASE.cinema } });

      intro
        // 1. Paper stack rises first — it's the "before" state.
        .fromTo(
          '[data-layer="stack"]',
          { autoAlpha: 0, y: 44, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.1 },
          0.25,
        )
        // Tabs slide out of the stack's spine, top to bottom.
        .fromTo(
          '[data-tab]',
          { autoAlpha: 0, x: -18 },
          { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.07 },
          0.6,
        )
        // 2. Clipboard — the decision point.
        .fromTo(
          '[data-layer="clipboard"]',
          { autoAlpha: 0, y: 40, rotate: -4 },
          { autoAlpha: 1, y: 0, rotate: 0, duration: 1 },
          0.75,
        )
        .fromTo(
          '[data-check]',
          { autoAlpha: 0, scale: 0.3 },
          { autoAlpha: 1, scale: 1, duration: 0.75, ease: 'back.out(2.4)' },
          1.35,
        )
        // 3. Laptop — the outcome.
        .fromTo(
          '[data-layer="laptop"]',
          { autoAlpha: 0, y: 46, scale: 0.95 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.15 },
          0.5,
        )
        .fromTo(
          '[data-stat]',
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09 },
          1.25,
        );

      // The revenue line draws itself last — it's the payoff of the whole image.
      if (line) {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        intro.to(line, { strokeDashoffset: 0, duration: 1.5, ease: 'none' }, 1.15);
      }
      if (area) {
        intro.fromTo(area, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.7);
      }

      /* ---- Scroll: the composition separates ------------------------------
         Each layer leaves at its own rate and in its own direction, so
         scrolling pulls the image apart into its three constituent ideas
         rather than sliding one picture off the screen. This is the
         "animates on every scroll" behaviour — it is scrubbed, so it tracks
         the wheel continuously in both directions rather than firing once. */
      const drift = [
        { sel: '[data-layer="stack"]', y: -70, x: -34, rotate: -3.5 },
        { sel: '[data-layer="clipboard"]', y: -128, x: 16, rotate: 4 },
        { sel: '[data-layer="laptop"]', y: -46, x: 30, rotate: 2 },
      ];

      drift.forEach(({ sel, y, x, rotate }) => {
        gsap.to(sel, {
          y,
          x,
          rotate,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.7,
          },
        });
      });

      // The whole stage also tips back slightly as it leaves, which sells the
      // perspective — without it the layers just translate and read as flat.
      gsap.to(stage, {
        rotateX: 9,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.7,
        },
      });

      /* ---- Pointer parallax ------------------------------------------------
         Reads the damped pointer from the scroll store (written once per tick
         by SmoothScrollProvider) rather than attaching its own listener, so
         this adds no extra input handling and stays on the shared clock. */
      const quickX = gsap.quickTo(tiltRef.current, 'rotateY', {
        duration: 0.8,
        ease: 'power3',
      });
      const quickY = gsap.quickTo(tiltRef.current, 'rotateX', {
        duration: 0.8,
        ease: 'power3',
      });

      const followPointer = () => {
        quickX(scrollState.pointerX * 6);
        quickY(scrollState.pointerY * -4);
      };
      gsap.ticker.add(followPointer);

      return () => {
        gsap.ticker.remove(followPointer);
      };
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={rootRef} className={`relative ${className}`} aria-hidden="true">
      {/* Soft ground shadow. Sits behind everything and never moves, which is
          what keeps the drifting layers feeling anchored to a surface. */}
      <div
        className="pointer-events-none absolute inset-x-[8%] bottom-[6%] h-[22%] rounded-[50%] blur-2xl"
        style={{ background: 'radial-gradient(ellipse, rgba(47,107,255,0.16), transparent 70%)' }}
      />

      <div
        ref={stageRef}
        className="relative aspect-[4/3] w-full"
        style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
      >
        <div
          ref={tiltRef}
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <PaperStack />
          <Laptop />
          <Clipboard />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Layer 1 — the paper stack                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Nine sheets with slight random-looking offsets, plus five labelled tabs.
 *
 * The offsets are hand-tuned rather than generated: a real `Math.random()`
 * would differ between server and client render and trip a hydration warning,
 * and a seeded PRNG is more machinery than nine numbers deserve.
 */
const SHEETS = [
  { x: 0, y: 0, r: 0 },
  { x: 1.2, y: -2.4, r: -0.5 },
  { x: -0.8, y: -4.9, r: 0.4 },
  { x: 1.8, y: -7.3, r: -0.3 },
  { x: -1.4, y: -9.8, r: 0.6 },
  { x: 0.6, y: -12.2, r: -0.4 },
  { x: -1.9, y: -14.7, r: 0.3 },
  { x: 1.1, y: -17.1, r: -0.6 },
  { x: -0.4, y: -19.6, r: 0.2 },
];

function PaperStack() {
  return (
    <div
      data-layer="stack"
      className="absolute left-[2%] top-[20%] w-[46%] opacity-0"
      style={{ transform: 'translateZ(-60px)', transformStyle: 'preserve-3d' }}
    >
      <div className="relative">
        {/* Sheets, bottom to top. */}
        {SHEETS.map((sheet, index) => (
          <div
            key={index}
            className="absolute inset-x-0 rounded-[3px] border border-navy/[0.07] bg-surface"
            style={{
              top: `${sheet.y}px`,
              transform: `translateX(${sheet.x}px) rotate(${sheet.r}deg)`,
              height: '62%',
              // `--shadow-tint` is navy on light and pure black on dark. A
              // navy shadow over a navy-black canvas composites *lighter*
              // than the canvas — a glow, not a shadow.
              boxShadow:
                index === SHEETS.length - 1
                  ? '0 10px 24px -12px rgb(var(--shadow-tint) / 0.28)'
                  : '0 1px 0 rgb(var(--shadow-tint) / 0.05)',
              zIndex: index,
            }}
          />
        ))}

        {/* Spacer establishing the stack's box height. */}
        <div className="pt-[76%]" />

        {/* Tabs. Positioned as a percentage down the stack's own height so they
            stay attached when the composition scales at other breakpoints. */}
        <ul className="absolute inset-0 z-20">
          {stackTabs.map((label, index) => (
            <li
              key={label}
              data-tab
              className="absolute left-[26%] w-[82%] opacity-0"
              style={{ top: `${11 + index * 13.4}%` }}
            >
              <span
                className="block truncate rounded-[4px] border border-cobalt/15 bg-surface px-2.5 py-[7px] text-[clamp(0.5rem,0.72vw,0.72rem)] font-medium leading-none text-navy/85"
                style={{
                  boxShadow: '0 4px 10px -4px rgb(var(--shadow-tint) / 0.16)',
                  transform: `rotate(${index % 2 === 0 ? -0.6 : 0.5}deg)`,
                }}
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Layer 2 — the laptop and its dashboard                                      */
/* -------------------------------------------------------------------------- */

function Laptop() {
  return (
    <div
      data-layer="laptop"
      className="absolute right-0 top-[12%] w-[62%] opacity-0"
      style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
    >
      {/* Screen */}
      <div
        className="relative rounded-[10px] border border-navy/12 bg-gradient-to-b from-surface to-mist p-[3px]"
        style={{ boxShadow: '0 24px 48px -20px rgb(var(--shadow-tint) / 0.3)' }}
      >
        <div className="rounded-[8px] bg-surface p-[6%]">
          {/* Dashboard header */}
          <p className="text-[clamp(0.52rem,0.78vw,0.8rem)] font-semibold leading-none text-navy/70">
            {dashboard.title}
          </p>

          <div className="mt-[4%] flex items-end justify-between gap-3">
            <div>
              <p className="font-display text-[clamp(1.05rem,2.1vw,2rem)] font-semibold leading-none tracking-[-0.03em] text-navy">
                {dashboard.headline}
              </p>
              <p className="mt-[6px] flex items-center gap-1.5 text-[clamp(0.44rem,0.62vw,0.62rem)] leading-none text-faint">
                {dashboard.period}
                <span className="inline-flex items-center gap-0.5 font-medium text-positive">
                  <TrendingUp className="h-2.5 w-2.5" />
                  {dashboard.delta}
                </span>
              </p>
            </div>

            {/* Chart */}
            <svg
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              className="h-auto w-[52%] shrink-0 overflow-visible"
              fill="none"
            >
              <defs>
                <linearGradient id="hv-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    style={{ stopColor: 'var(--color-cobalt)' }}
                    stopOpacity="0.22"
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: 'var(--color-cobalt)' }}
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {/* Baseline grid — three hairlines, no axis labels. At this size
                  labels would be illegible noise; the grid alone is enough to
                  read the shape as a chart. */}
              {[0.25, 0.55, 0.85].map((t) => (
                <line
                  key={t}
                  x1="0"
                  x2={CHART_W}
                  y1={CHART_H * t}
                  y2={CHART_H * t}
                  className="stroke-navy"
                  strokeOpacity="0.06"
                  strokeWidth="1"
                />
              ))}

              <path
                data-spark-area
                d={`${sparklinePath(CHART_W, CHART_H)} L${CHART_W},${CHART_H} L0,${CHART_H} Z`}
                fill="url(#hv-fill)"
                opacity="0"
              />
              <path
                data-spark-line
                d={sparklinePath(CHART_W, CHART_H)}
                className="stroke-cobalt"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Stat cards */}
          <ul className="mt-[6%] grid grid-cols-3 gap-[3%]">
            {dashboardStats.map((stat) => {
              const Icon = stat.direction === 'up' ? TrendingUp : TrendingDown;
              return (
                <li
                  key={stat.label}
                  data-stat
                  className="rounded-[6px] border border-navy/[0.07] bg-frost/70 p-[8%] opacity-0"
                >
                  <p className="truncate text-[clamp(0.38rem,0.55vw,0.56rem)] leading-none text-faint">
                    {stat.label}
                  </p>
                  <p className="mt-[7px] font-display text-[clamp(0.62rem,1.05vw,1rem)] font-semibold leading-none tracking-[-0.02em] text-navy">
                    {stat.value}
                  </p>
                  <p
                    className={[
                      'mt-[5px] flex items-center gap-0.5 text-[clamp(0.34rem,0.48vw,0.5rem)] font-medium leading-none',
                      // A falling denial rate is good news, so direction and
                      // sentiment are decoupled here on purpose.
                      'text-positive',
                    ].join(' ')}
                  >
                    <Icon className="h-2 w-2" />
                    {stat.delta}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Base / keyboard deck.
          Sized with `clamp()` rather than a percentage: this element's parent
          is auto-height (its height comes from the screen above it), and a
          percentage height against an auto-height containing block resolves
          to `auto` — i.e. zero for an empty div. The deck simply would not
          render. `clamp` keeps it proportional across breakpoints without
          depending on the parent resolving a height at all. */}
      <div
        className="mx-auto w-[104%] rounded-b-[6px] border-x border-b border-navy/12 bg-gradient-to-b from-mist to-haze"
        style={{
          height: 'clamp(7px, 1.15vw, 15px)',
          boxShadow: '0 14px 22px -14px rgb(var(--shadow-tint) / 0.34)',
        }}
      />
      <div
        className="mx-auto w-[46%] rounded-b-[4px] bg-haze/80"
        style={{ height: 'clamp(2px, 0.35vw, 5px)' }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Layer 3 — the approval clipboard                                            */
/* -------------------------------------------------------------------------- */

function Clipboard() {
  return (
    <div
      data-layer="clipboard"
      className="absolute bottom-[2%] left-[30%] w-[38%] opacity-0"
      style={{ transform: 'translateZ(110px)', transformStyle: 'preserve-3d' }}
    >
      <div
        className="relative rounded-[8px] border border-navy/[0.09] bg-surface px-[9%] pb-[11%] pt-[15%]"
        style={{
          boxShadow: '0 26px 46px -20px rgb(var(--shadow-tint) / 0.32)',
          transform: 'rotate(-6deg)',
        }}
      >
        {/* Clip */}
        <span className="absolute left-1/2 top-0 h-[9%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-[3px] border border-cobalt-700/30 bg-gradient-to-b from-cobalt-400 to-cobalt shadow-sm" />

        <p className="text-center text-[clamp(0.5rem,0.82vw,0.85rem)] font-semibold italic leading-none tracking-[-0.01em] text-navy/75">
          Claim Approved
        </p>

        {/* Ruled lines standing in for the claim body. */}
        <div className="mt-[9%] flex flex-col gap-[5px]">
          {[100, 88, 94].map((w, i) => (
            <span
              key={i}
              className="block h-px rounded-full bg-navy/10"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>

        {/* The tick */}
        <span
          data-check
          className="mx-auto mt-[10%] flex aspect-square w-[30%] items-center justify-center rounded-full border-[1.5px] border-cobalt text-cobalt opacity-0"
        >
          <Check className="h-[52%] w-[52%]" strokeWidth={3} />
        </span>
      </div>
    </div>
  );
}
