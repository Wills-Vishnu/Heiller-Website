'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { workflowCards } from '@/lib/home-content';
import { ArrowButton } from './ArrowButton';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { buildCenterSpine } from '@/lib/workflow-ledger-path';
import { MetricMeshProvider, MetricMeshValue } from './MetricMeshValues';
import styles from './home.module.css';

export function WorkflowLedger() {
  const hostRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLOListElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const [spine, setSpine] = useState<{ w: number; h: number; d: string; arrows: readonly string[] } | null>(null);

  const measure = useCallback(() => {
    const host = hostRef.current;
    const list = rowsRef.current;
    const cta = ctaRef.current;
    if (!host || !list || !cta) return;

    const hostBox = host.getBoundingClientRect();
    if (!hostBox.width || !hostBox.height) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-workflow-row]'));
    if (rows.length === 0) return;

    const ctaBox = cta.getBoundingClientRect();
    // The run carries a single chevron at its foot. It stops well clear of the
    // CTA so the arrowhead reads as the end of the line rather than crowding
    // the button.
    const endY = ctaBox.top - hostBox.top - 56;

    const next = {
      w: hostBox.width,
      h: hostBox.height,
      ...buildCenterSpine({
        x: hostBox.width / 2,
        startY: rows[0].getBoundingClientRect().top - hostBox.top - 28,
        endY,
        arrowYs: [endY],
      }),
    };
    // Only re-render when the geometry actually moves. Re-measuring resizes
    // the SVG, which re-triggers the observer, so an unconditional setState
    // here would loop and keep restarting the scroll fill.
    setSpine((current) =>
      current && current.w === next.w && current.h === next.h && current.d === next.d
        && current.arrows.length === next.arrows.length
        && current.arrows.every((arrow, index) => arrow === next.arrows[index])
        ? current
        : next,
    );
  }, []);

  useEffect(() => {
    measure();
    const host = hostRef.current;
    if (!host) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(host);
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    if (document.fonts?.ready) void document.fonts.ready.then(measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [measure]);

  // The spine draws itself as the ledger passes through the viewport. This
  // lives here rather than in the page-level GSAP context because the path
  // only exists after the first measure pass.
  useEffect(() => {
    const host = hostRef.current;
    const fill = fillRef.current;
    if (!spine || !host || !fill) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(fill, { strokeDashoffset: 0 });
      return;
    }
    const tween = gsap.fromTo(
      fill,
      { strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: host, start: 'top 72%', end: 'bottom 85%', scrub: 0.5, invalidateOnRefresh: true },
      },
    );
    ScrollTrigger.refresh();
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [spine]);

  return (
    <div className={styles.ledger} ref={hostRef} data-workflow-ledger>
      {spine ? (
        <svg
          className={styles.ledgerFlow}
          viewBox={`0 0 ${spine.w} ${spine.h}`}
          width={spine.w}
          height={spine.h}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="workflow-route" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff9b7d" />
              <stop offset="0.34" stopColor="#f49cff" />
              <stop offset="0.68" stopColor="#91b5ff" />
              <stop offset="1" stopColor="#8ee8b8" />
            </linearGradient>
          </defs>
          <path className={styles.ledgerTrack} d={spine.d} />
          {/* pathLength 1 lets the scroll fill run 1 -> 0 regardless of height. */}
          <path className={styles.ledgerFill} d={spine.d} pathLength={1} ref={fillRef} data-ledger-fill />
          {spine.arrows.map((arrow, index) => (
            <path key={index} className={styles.ledgerArrow} d={arrow} />
          ))}
        </svg>
      ) : null}

      <MetricMeshProvider>
        <ol className={styles.ledgerRows} ref={rowsRef}>
          {workflowCards.map((card, index) => (
            <li key={card.id} className={styles.ledgerRow} data-workflow-row>
              <div className={styles.ledgerStage}>
                <span className={styles.ledgerIndex} aria-hidden="true">
                  <MetricMeshValue id={`workflow-${card.id}`} value={String(index + 1).padStart(2, '0')} index={index} />
                </span>
                <h3>{card.title}</h3>
              </div>
            </li>
          ))}
        </ol>
      </MetricMeshProvider>

      <div className={styles.ledgerFoot} ref={ctaRef}>
        <ArrowButton label="Start with a revenue audit" href="#revenue-audit" dark />
      </div>
    </div>
  );
}
