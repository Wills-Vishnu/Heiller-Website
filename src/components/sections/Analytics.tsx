'use client';

import { useMemo, useRef } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { gsap, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { CountUp } from '@/components/ui/CountUp';
import { FadeUp } from '@/components/ui/SplitText';
import { analyticsMetrics, denialSeries, revenueSeries } from '@/lib/site';

const CHART_WIDTH = 720;
const CHART_HEIGHT = 260;
const CHART_PAD = 16;

/**
 * Converts a normalised 0–1 series into a smooth SVG path.
 *
 * Uses cubic segments with horizontal control handles at half the x-step, which
 * produces a monotone-ish curve without the overshoot that a naive Catmull-Rom
 * introduces — important here, because an overshooting line on a revenue chart
 * would draw values that never occurred.
 */
function buildCurve(series: number[]): string {
  const stepX = (CHART_WIDTH - CHART_PAD * 2) / (series.length - 1);
  const toPoint = (value: number, index: number): [number, number] => [
    CHART_PAD + index * stepX,
    CHART_PAD + (1 - value) * (CHART_HEIGHT - CHART_PAD * 2),
  ];

  const [startX, startY] = toPoint(series[0], 0);
  let path = `M${startX.toFixed(2)} ${startY.toFixed(2)}`;

  for (let i = 1; i < series.length; i++) {
    const [prevX, prevY] = toPoint(series[i - 1], i - 1);
    const [x, y] = toPoint(series[i], i);
    const handle = (x - prevX) / 2;
    path += ` C${(prevX + handle).toFixed(2)} ${prevY.toFixed(2)}, ${(x - handle).toFixed(
      2,
    )} ${y.toFixed(2)}, ${x.toFixed(2)} ${y.toFixed(2)}`;
  }

  return path;
}

/**
 * Chapter 06 — the payoff.
 *
 * Numbers count up, curves draw themselves, and the whole panel arrives on a
 * single scroll trigger so the dashboard reads as *booting*, not as four
 * unrelated widgets fading in.
 *
 * Honesty note: the underlying figures live in `lib/site.ts` and are flagged as
 * placeholders. The animation is designed to make real numbers feel earned, not
 * to make invented ones feel true — replace them before launch.
 */
export function Analytics() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const revenuePath = useMemo(() => buildCurve([...revenueSeries]), []);
  const denialPath = useMemo(() => buildCurve([...denialSeries]), []);
  const revenueArea = useMemo(
    () =>
      `${revenuePath} L${CHART_WIDTH - CHART_PAD} ${CHART_HEIGHT - CHART_PAD} L${CHART_PAD} ${
        CHART_HEIGHT - CHART_PAD
      } Z`,
    [revenuePath],
  );

  useGSAP(
    () => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;

      const lines = gsap.utils.toArray<SVGPathElement>('[data-curve]');
      // Plain `.querySelector`, not `sectionRef.current?.querySelector` — the
      // `?.` on a possibly-null ref widens the result to
      // `Element | null | undefined`, and GSAP's `TweenTarget` accepts `null`
      // but not `undefined`. Guarding the ref above first keeps this a clean
      // `Element | null`, same pattern as `HeroVisual.tsx`.
      const area = sectionEl.querySelector('[data-area]');
      const bars = gsap.utils.toArray<HTMLElement>('[data-bar]');

      if (reducedMotion) {
        lines.forEach((line) => gsap.set(line, { strokeDashoffset: 0 }));
        gsap.set(area, { autoAlpha: 1 });
        gsap.set(bars, { scaleY: 1 });
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: '[data-dashboard]', start: 'top 78%', once: true },
      });

      lines.forEach((line, index) => {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        timeline.to(
          line,
          { strokeDashoffset: 0, duration: 2.1, ease: EASE.glide },
          index * 0.18,
        );
      });

      timeline.fromTo(
        area,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1.6, ease: 'power2.out' },
        0.5,
      );

      timeline.fromTo(
        bars,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.9,
          ease: EASE.cinema,
          stagger: 0.045,
          transformOrigin: 'bottom center',
        },
        0.35,
      );
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
          eyebrow="06 — Revenue & analytics"
          title="The variance, *explained.* Not just plotted."
          lede="Yield by payer, provider and procedure — refreshed daily, with the reason attached. A dashboard that only shows you the shape of a problem has moved the problem, not solved it."
          className="max-w-3xl"
        />
        <span id="analytics-heading" className="sr-only">
          Revenue optimisation and analytics results
        </span>

        <FadeUp delay={0.1}>
          <div
            data-dashboard
            className="surface-card mt-16 overflow-hidden rounded-panel lg:mt-24"
          >
            {/* Metric strip */}
            <ul className="grid grid-cols-2 gap-px bg-hairline lg:grid-cols-4">
              {analyticsMetrics.map((metric) => {
                const Trend = metric.direction === 'up' ? TrendingUp : TrendingDown;
                // "Good" is direction-dependent: denial rate falling is a win.
                const positive =
                  metric.id === 'denial' || metric.id === 'ar-days'
                    ? metric.direction === 'down'
                    : metric.direction === 'up';

                return (
                  <li key={metric.id} className="bg-surface p-7 sm:p-8">
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
                    <p
                      className={[
                        'mt-3 inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[0.8125rem] font-medium',
                        positive
                          ? 'bg-positive/10 text-positive'
                          : 'bg-negative/10 text-negative',
                      ].join(' ')}
                    >
                      <Trend className="h-3.5 w-3.5" aria-hidden="true" />
                      {metric.delta}
                    </p>
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-faint">
                      {metric.caption}
                    </p>
                  </li>
                );
              })}
            </ul>

            {/* Chart */}
            <div className="grid gap-10 border-t border-hairline p-7 sm:p-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 className="text-title text-navy">Collections vs denials</h3>
                  <div className="flex items-center gap-5 text-[0.8125rem] text-muted">
                    <span className="inline-flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-0.5 w-5 rounded-full bg-cobalt"
                      />
                      Net collections
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-0.5 w-5 rounded-full bg-negative"
                      />
                      Denial rate
                    </span>
                  </div>
                </div>

                <svg
                  viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                  className="mt-6 w-full"
                  role="img"
                  aria-label="Line chart: net collections trending upward over twelve months while denial rate trends downward."
                >
                  <defs>
                    <linearGradient id="an-area" x1="0" y1="0" x2="0" y2="1">
                      {/* `stopColor` can't read a Tailwind class, and CSS
                          variables don't resolve inside SVG presentation
                          attributes — so theme-aware gradient stops have to go
                          through inline style. Same pattern everywhere a
                          gradient needs to follow the theme. */}
                      <stop
                        offset="0%"
                        style={{ stopColor: 'var(--color-cobalt)' }}
                        stopOpacity="0.18"
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: 'var(--color-cobalt)' }}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  {/* Baseline rules */}
                  {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
                    const y = CHART_PAD + fraction * (CHART_HEIGHT - CHART_PAD * 2);
                    return (
                      <line
                        key={fraction}
                        x1={CHART_PAD}
                        y1={y}
                        x2={CHART_WIDTH - CHART_PAD}
                        y2={y}
                        className="stroke-navy"
                        strokeOpacity="0.07"
                        strokeWidth="1"
                      />
                    );
                  })}

                  <path data-area d={revenueArea} fill="url(#an-area)" opacity="0" />
                  <path
                    data-curve
                    d={revenuePath}
                    fill="none"
                    className="stroke-cobalt"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    data-curve
                    d={denialPath}
                    fill="none"
                    className="stroke-negative"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Denial-reason breakdown */}
              <div className="lg:col-span-4">
                <h3 className="text-title text-navy">Denials by root cause</h3>
                <p className="mt-2 text-[0.8125rem] text-faint">
                  Reasons routed back upstream, last 90 days
                </p>

                <ul className="mt-7 flex h-40 items-end gap-2.5">
                  {[
                    { label: 'Elig.', value: 0.86 },
                    { label: 'Auth', value: 0.64 },
                    { label: 'Code', value: 0.48 },
                    { label: 'Doc.', value: 0.36 },
                    { label: 'Timely', value: 0.26 },
                    { label: 'Other', value: 0.18 },
                  ].map((bar) => (
                    <li key={bar.label} className="flex flex-1 flex-col items-center gap-2.5">
                      <span className="flex h-full w-full items-end">
                        <span
                          data-bar
                          className="w-full rounded-t-md bg-gradient-to-t from-cobalt/25 to-cobalt"
                          style={{ height: `${bar.value * 100}%` }}
                        />
                      </span>
                      <span className="text-[0.6875rem] font-medium text-faint">
                        {bar.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          <p className="mt-6 text-sm text-faint">
            Figures shown are placeholders. Replace with audited client outcomes before
            publishing.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
