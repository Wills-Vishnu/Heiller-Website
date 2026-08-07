'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { workflowSteps } from '@/lib/site';

/**
 * Chapter 04 — the pipeline.
 *
 * An SVG spine draws itself down the page as the reader scrolls, its nodes
 * lighting up as each stage comes into view, while the eight stages fade and
 * slide in beside it.
 *
 * PATH DRAWING WITHOUT DrawSVGPlugin
 * GSAP's DrawSVG is a paid Club plugin. The same effect is achieved here with
 * `stroke-dasharray` set to the path's own `getTotalLength()` and
 * `stroke-dashoffset` animated from that length to zero.
 *
 * NO PIN — AND WHY
 * This section used to pin the heading + spine + all eight stages as one
 * block and scrub through them on a long, GSAP-controlled scroll distance.
 * The bug: with eight stages stacked in normal document flow (each roughly
 * 100–140px tall) below a full heading and lede, the pinned block ran well
 * past 1,000px tall — far beyond a typical laptop viewport. A `pin` fixes an
 * element's on-screen position for the whole trigger; content below the
 * visible edge isn't just off-screen while pinned, it's *unreachable* —
 * scrolling drives the animation timeline, not the clipped layout. The
 * reader could see the heading and the first couple of stages and nothing
 * else, no matter how much they scrolled.
 *
 * The fix keeps every visual beat (the spine draws, the nodes light up, the
 * stages slide in) but drives all of it from the spine's own natural scroll
 * position — `scrub` without `pin`. As the reader scrolls normally past this
 * section, the line draws and the stages reveal in step; nothing is ever
 * fixed in place, so nothing can ever be taller than the screen that shows
 * it. The heading uses `position: sticky` (plain CSS, not GSAP) so it stays
 * comfortably in view while the stage list scrolls past beside it — sticky
 * can only hold within its own column's height, so unlike a `pin` it can
 * never trap content off-screen.
 */
export function Workflow() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const path = pathRef.current;
      const steps = gsap.utils.toArray<HTMLElement>('[data-step]');
      const nodes = gsap.utils.toArray<SVGCircleElement>('[data-node]');
      if (!path || !steps.length) return;

      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      if (reducedMotion) {
        gsap.set(path, { strokeDashoffset: 0 });
        gsap.set(steps, { autoAlpha: 1, x: 0 });
        gsap.set(nodes, { scale: 1, autoAlpha: 1, transformOrigin: 'center' });
        return;
      }

      /* ---- The spine: scrubbed against its own scroll position, no pin ---- */
      gsap.set(nodes, { scale: 0.35, autoAlpha: 0.3, transformOrigin: 'center' });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top 75%',
          end: 'bottom 55%',
          scrub: 0.6,
        },
      });

      nodes.forEach((node, index) => {
        gsap.to(node, {
          scale: 1,
          autoAlpha: 1,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: steps[index],
            start: 'top 78%',
            end: 'top 55%',
            scrub: 0.5,
          },
        });
      });

      /* ---- The stages: batched fade/slide as each crosses into view ------- */
      gsap.set(steps, { autoAlpha: 0, x: 28 });

      ScrollTrigger.batch(steps, {
        start: 'top 85%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            x: 0,
            duration: 0.85,
            ease: EASE.glide,
            stagger: 0.1,
            overwrite: true,
          }),
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="workflow"
      aria-labelledby="workflow-heading"
      className="relative scroll-mt-24 py-[12vh]"
    >
      <div className="mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="lg:sticky lg:top-32 lg:col-span-4">
            <SectionIntro
              eyebrow="04 — Workflow"
              title="Eight stages. *Nothing* handed off blind."
              lede="Every claim carries its full history from registration to reconciliation. When something fails, the cause is already attached to it."
            />
            <span id="workflow-heading" className="sr-only">
              The evadde revenue cycle workflow
            </span>

            {/* The spine, sitting under the heading in the sticky column
                rather than stacked above eight stages the way it used to be. */}
            <svg
              viewBox="0 0 200 620"
              className="mt-10 hidden h-[38vh] max-h-[420px] w-full lg:block"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                {/* Blue through to green: the rail now resolves on the
                    positive token at the final stage (reconciliation), which
                    reads as "completed" far more directly than the old warm
                    terminal did once coral became a brand-only colour. */}
                <linearGradient id="wf-spine" x1="0" y1="0" x2="0" y2="620">
                  <stop offset="0%" style={{ stopColor: 'var(--color-cobalt)' }} />
                  <stop offset="62%" style={{ stopColor: 'var(--color-cobalt-400)' }} />
                  <stop offset="100%" style={{ stopColor: 'var(--color-positive)' }} />
                </linearGradient>
              </defs>

              {/* Ghost rail — shows the whole journey before it is drawn. */}
              <path
                d="M100 16 C 158 92, 42 168, 100 244 S 158 396, 100 468 S 42 560, 100 604"
                className="stroke-navy"
                strokeOpacity="0.08"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Drawn rail */}
              <path
                ref={pathRef}
                d="M100 16 C 158 92, 42 168, 100 244 S 158 396, 100 468 S 42 560, 100 604"
                stroke="url(#wf-spine)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Stage nodes, evenly spaced down the rail */}
              {workflowSteps.map((step, index) => {
                const y = 16 + (index * 588) / (workflowSteps.length - 1);
                const x = 100 + Math.sin(index * 1.15) * 26;
                return (
                  <g key={step.id}>
                    <circle
                      data-node
                      cx={x}
                      cy={y}
                      r="7"
                      className={[
                        'fill-surface',
                        index === workflowSteps.length - 1
                          ? 'stroke-positive'
                          : 'stroke-cobalt',
                      ].join(' ')}
                      strokeWidth="2.5"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="2.2"
                      className={
                        index === workflowSteps.length - 1
                          ? 'fill-positive'
                          : 'fill-cobalt'
                      }
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* The stages */}
          <div ref={trackRef} className="lg:col-span-7 lg:col-start-6">
            <ol>
              {workflowSteps.map((step) => (
                <li
                  key={step.id}
                  data-step
                  className="border-l-2 border-hairline py-5 pl-7 transition-colors duration-500 hover:border-cobalt/40 sm:py-6 sm:pl-9"
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span
                      aria-hidden="true"
                      className="font-display text-sm font-semibold tabular-nums text-cobalt"
                    >
                      {step.step}
                    </span>
                    <h3 className="text-title text-navy">{step.title}</h3>
                    <span className="ml-auto text-eyebrow font-medium uppercase text-faint">
                      {step.duration}
                    </span>
                  </div>
                  <p className="mt-2.5 max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
