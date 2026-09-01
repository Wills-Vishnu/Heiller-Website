'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createMetricMeshRenderer, type MetricMeshRenderer, type MetricMeshTarget } from '@/lib/metric-mesh-renderer';
import styles from './home.module.css';

type Registry = {
  register(id: string, target: MetricMeshTarget): void;
  unregister(id: string): void;
};

const MetricMeshContext = createContext<Registry | null>(null);
const NUMBER_VALUE_PATTERN = /^(\d+(?:\.\d+)?)(%)?$/;

function formatCount(value: number, suffix = '') {
  return `${Math.round(value)}${suffix}`;
}

export function MetricMeshProvider({ children }: { children: React.ReactNode }) {
  const sourceRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<MetricMeshRenderer | null>(null);
  const targetsRef = useRef(new Map<string, MetricMeshTarget>());

  const sync = useCallback(() => rendererRef.current?.setTargets([...targetsRef.current.values()]), []);
  const registry = useMemo<Registry>(() => ({
    register(id, target) { targetsRef.current.set(id, target); sync(); },
    unregister(id) { targetsRef.current.delete(id); sync(); },
  }), [sync]);

  useEffect(() => {
    const source = sourceRef.current;
    const wrapper = wrapperRef.current;
    if (!source || !wrapper) return;
    rendererRef.current = createMetricMeshRenderer(source, {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      onReady: () => { wrapper.dataset.metricReady = 'true'; },
    });
    sync();
    const observer = new ResizeObserver(() => rendererRef.current?.resize());
    observer.observe(wrapper);
    return () => {
      observer.disconnect();
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, [sync]);

  return (
    <MetricMeshContext.Provider value={registry}>
      <div ref={wrapperRef} className={styles.metricMeshProvider}>
        <canvas ref={sourceRef} data-metric-mesh-source aria-hidden="true" hidden />
        {children}
      </div>
    </MetricMeshContext.Provider>
  );
}

export function MetricMeshValue({
  id,
  value,
  index,
  animate = false,
}: {
  id: string;
  value: string;
  index: number;
  animate?: boolean;
}) {
  const registry = useContext(MetricMeshContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const parsed = useMemo(() => NUMBER_VALUE_PATTERN.exec(value), [value]);
  const [displayValue, setDisplayValue] = useState(() => (animate && parsed ? formatCount(0, parsed[2]) : value));

  useEffect(() => {
    if (!animate || !parsed) {
      setDisplayValue(value);
      return;
    }

    const target = Number(parsed[1]);
    const suffix = parsed[2] ?? '';
    const text = textRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!text || prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    let timeout = 0;
    let startedAt = 0;
    let hasRun = false;
    const duration = 1400;

    const run = (time: number) => {
      if (startedAt === 0) startedAt = time;
      const progress = Math.min((time - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(formatCount(target * eased, suffix));
      if (progress < 1) frame = requestAnimationFrame(run);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || hasRun) return;
      hasRun = true;
      setDisplayValue(formatCount(0, suffix));
      timeout = window.setTimeout(() => {
        frame = requestAnimationFrame(run);
      }, index * 120);
      observer.disconnect();
    }, { threshold: 0.35 });

    observer.observe(text);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [animate, index, parsed, value]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const text = textRef.current;
    if (!registry || !canvas || !text) return;
    const computed = window.getComputedStyle(text);
    const font = `${computed.fontWeight || 500} ${computed.fontSize || '96px'} ${computed.fontFamily || 'sans-serif'}`;
    registry.register(id, { canvas, value: displayValue, index, font });
    return () => registry.unregister(id);
  }, [displayValue, id, index, registry]);

  return (
    <strong className={styles.metricMeshValue} aria-label={animate ? value : undefined}>
      <span ref={textRef} className={styles.metricMeshFallback}>{displayValue}</span>
      <canvas ref={canvasRef} data-metric-mesh aria-hidden="true" />
    </strong>
  );
}
