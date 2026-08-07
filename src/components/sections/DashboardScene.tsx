'use client';

import { useCallback, useRef } from 'react';
import { RotateCcw, TrendingDown, TrendingUp } from 'lucide-react';
import { gsap, useGSAP, EASE } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scrollState } from '@/lib/scroll-state';
import { dashboard, dashboardStats, sparklinePath } from '@/lib/hero-visual';

/**
 * Chapter 06½ — the dashboard you can pick up and turn.
 *
 * A genuinely interactive 3D object built entirely from CSS 3D transforms.
 * Drag it to rotate; release and it eases back. No WebGL, no three.js, no new
 * dependency — this project deliberately dropped three.js earlier and the
 * ~150kB is not worth paying back for one section.
 *
 * WHAT CSS 3D CAN AND CANNOT DO
 * It gives real perspective projection, real depth sorting between siblings,
 * and hardware-composited transforms. It cannot do curved surfaces, lighting
 * or shadows that respond to geometry. So the object here is *made of flat
 * panels* — which is exactly what a dashboard is, and why this subject suits
 * the technique rather than fighting it.
 *
 * HOW THE DEPTH IS BUILT
 * One `perspective` on the stage, `preserve-3d` on the rig, then each panel at
 * its own `translateZ`. Because they are real siblings in 3D space, rotating
 * the rig makes them slide past each other with correct parallax and
 * occlusion — the thing that separates this from a stack of `box-shadow`s
 * pretending to be depth.
 *
 * INTERACTION
 * Pointer events, not mouse events, so pen and touch work identically.
 * `setPointerCapture` means a drag that leaves the element still tracks, and
 * still releases — the classic bug here is a card that sticks to the cursor
 * forever because `pointerup` fired somewhere else.
 *
 * Idle, the rig drifts gently with the shared damped pointer position (read
 * from `scrollState`, no extra listener) and lifts on scroll. Dragging
 * suspends both; releasing hands control back.
 */

const CHART_W = 260;
const CHART_H = 72;

export function DashboardScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  /* Drag state lives in refs, not React state. A pointermove handler that set
     state would re-render the whole subtree on every frame of a drag. */
  const dragging = useRef(false);
  const pointerId = useRef<number | null>(null);
  const start = useRef({ x: 0, y: 0, rx: 0, ry: 0 });
  const rot = useRef({ x: -8, y: -22 });

  const applyRotation = useCallback((duration = 0) => {
    const rig = rigRef.current;
    if (!rig) return;
    gsap.to(rig, {
      rotateX: rot.current.x,
      rotateY: rot.current.y,
      duration,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      dragging.current = true;
      pointerId.current = event.pointerId;
      // Keeps receiving events even if the pointer leaves the element.
      event.currentTarget.setPointerCapture(event.pointerId);
      start.current = {
        x: event.clientX,
        y: event.clientY,
        rx: rot.current.x,
        ry: rot.current.y,
      };
    },
    [reducedMotion],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current || reducedMotion) return;

      const dx = event.clientX - start.current.x;
      const dy = event.clientY - start.current.y;

      // Clamped so the object can never turn edge-on and vanish, and never
      // flips past vertical into an upside-down reading of the panels.
      rot.current.y = gsap.utils.clamp(-55, 55, start.current.ry + dx * 0.28);
      rot.current.x = gsap.utils.clamp(-32, 32, start.current.rx - dy * 0.22);
      applyRotation(0.25);
    },
    [applyRotation, reducedMotion],
  );

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      dragging.current = false;
      if (pointerId.current !== null) {
        event.currentTarget.releasePointerCapture?.(pointerId.current);
        pointerId.current = null;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    rot.current = { x: -8, y: -22 };
    applyRotation(1);
  }, [applyRotation]);

  useGSAP(
    () => {
      const rig = rigRef.current;
      if (!rig) return;

      if (reducedMotion) {
        gsap.set(rig, { rotateX: -6, rotateY: -16 });
        gsap.set('[data-panel]', { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(rig, { rotateX: rot.current.x, rotateY: rot.current.y });

      /* Entrance — panels arrive from below at staggered depths, so the object
         assembles in Z as well as Y. */
      gsap.fromTo(
        '[data-panel]',
        { autoAlpha: 0, y: 60 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: EASE.cinema,
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
        },
      );

      /* Idle drift. Suspended while dragging so the two never fight for the
         same property — the classic symptom is an object that feels like it is
         being pulled back by an invisible spring mid-drag. */
      const quickX = gsap.quickTo(rig, 'rotateY', { duration: 1.2, ease: 'power3' });
      const quickY = gsap.quickTo(rig, 'rotateX', { duration: 1.2, ease: 'power3' });

      const idle = () => {
        if (dragging.current) return;
        quickX(rot.current.y + scrollState.pointerX * 7);
        quickY(rot.current.x + scrollState.pointerY * -5);
      };
      gsap.ticker.add(idle);

      return () => {
        gsap.ticker.remove(idle);
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="explore"
      aria-labelledby="explore-heading"
      className="relative scroll-mt-24 py-[12vh] lg:py-[16vh]"
    >
      <div className="mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-14">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* Copy */}
          <div className="lg:col-span-4">
            <p className="inline-flex items-center gap-2.5 text-eyebrow font-semibold uppercase text-cobalt">
              <span aria-hidden="true" className="h-px w-8 bg-cobalt/45" />
              Interactive
            </p>
            <h2
              id="explore-heading"
              className="mt-5 font-display text-headline font-semibold text-navy"
            >
              Turn it over.
            </h2>
            <p className="mt-5 max-w-[42ch] text-lead text-muted">
              Every figure your team acts on, in one surface. Drag to look at it from
              another angle — which is roughly what we do to a revenue cycle before we
              touch it.
            </p>

            <button
              type="button"
              onClick={reset}
              className="mt-8 inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface px-5 py-2.5 text-[0.875rem] font-medium text-navy shadow-rest transition-all duration-300 hover:shadow-lift"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset view
            </button>
          </div>

          {/* Stage.
              `touch-action: none` is what makes dragging work on a phone — the
              browser otherwise claims the gesture for scrolling and the
              pointermove stream stops after a few pixels. */}
          <div className="lg:col-span-7 lg:col-start-6">
            <div
              className="relative mx-auto w-full max-w-[46rem] cursor-grab touch-none select-none active:cursor-grabbing"
              style={{ perspective: '1600px' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              role="img"
              aria-label={`Interactive 3D revenue dashboard showing ${dashboard.headline} this month, with claims processed, collection rate and denial rate. Drag to rotate.`}
            >
              <div
                ref={rigRef}
                className="relative aspect-[16/11] w-full"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Back plate — furthest, largest, dimmest. Gives the object a
                    body for the front panels to float in front of. */}
                <div
                  data-panel
                  className="absolute inset-[6%] rounded-panel border border-hairline bg-mist/70"
                  style={{ transform: 'translateZ(-90px)' }}
                />

                {/* Main dashboard panel */}
                <div
                  data-panel
                  className="absolute inset-x-0 top-[8%] mx-auto w-[86%] rounded-panel border border-hairline bg-surface p-6 shadow-lift sm:p-8"
                  style={{ transform: 'translateZ(0px)' }}
                >
                  <p className="text-[0.8125rem] font-semibold text-navy/70">
                    {dashboard.title}
                  </p>

                  <div className="mt-3 flex items-end justify-between gap-6">
                    <div>
                      <p className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold leading-none tracking-[-0.035em] text-navy">
                        {dashboard.headline}
                      </p>
                      <p className="mt-2.5 flex items-center gap-2 text-[0.75rem] text-faint">
                        {dashboard.period}
                        <span className="inline-flex items-center gap-1 font-medium text-positive">
                          <TrendingUp className="h-3 w-3" aria-hidden="true" />
                          {dashboard.delta}
                        </span>
                      </p>
                    </div>

                    <svg
                      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                      className="h-auto w-[48%] shrink-0 overflow-visible"
                      fill="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="ds-fill" x1="0" y1="0" x2="0" y2="1">
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
                      <path
                        d={`${sparklinePath(CHART_W, CHART_H)} L${CHART_W},${CHART_H} L0,${CHART_H} Z`}
                        fill="url(#ds-fill)"
                      />
                      <path
                        d={sparklinePath(CHART_W, CHART_H)}
                        className="stroke-cobalt"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Stat cards — nearest the viewer, so they part around the
                    main panel as the rig turns. This is the parallax that sells
                    the whole thing as an object rather than an image. */}
                <ul
                  data-panel
                  className="absolute inset-x-0 bottom-[6%] mx-auto flex w-[94%] gap-3"
                  style={{ transform: 'translateZ(85px)' }}
                >
                  {dashboardStats.map((stat) => {
                    const Icon = stat.direction === 'up' ? TrendingUp : TrendingDown;
                    return (
                      <li
                        key={stat.label}
                        className="flex-1 rounded-card border border-hairline bg-surface p-3.5 shadow-float sm:p-4"
                      >
                        <p className="truncate text-[0.625rem] leading-none text-faint">
                          {stat.label}
                        </p>
                        <p className="mt-2 font-display text-[clamp(0.9rem,1.6vw,1.25rem)] font-semibold leading-none tracking-[-0.02em] text-navy">
                          {stat.value}
                        </p>
                        <p className="mt-1.5 flex items-center gap-1 text-[0.625rem] font-medium leading-none text-positive">
                          <Icon className="h-2.5 w-2.5" aria-hidden="true" />
                          {stat.delta}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <p className="mt-6 text-center text-[0.8125rem] text-faint">
              Drag the dashboard to rotate it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
