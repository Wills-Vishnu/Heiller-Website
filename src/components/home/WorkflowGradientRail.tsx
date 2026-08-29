'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { workflowCards } from '@/lib/home-content';
import {
  createWorkflowGradientRenderer,
  WORKFLOW_GRADIENT_SCENES,
  type WorkflowVisual,
} from '@/lib/workflow-gradient-renderer';
import styles from './home.module.css';

const headline = (visual: WorkflowVisual) =>
  visual === 'denial' ? 'Find the cause' : visual === 'reporting' ? 'See what moves' : 'Keep work moving';

export function WorkflowGradientRail() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasesRef = useRef(new Map<WorkflowVisual, HTMLCanvasElement>());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const atlas = document.createElement('canvas');
    const targets = workflowCards.map((card) => ({
      visual: card.visual as WorkflowVisual,
      canvas: canvasesRef.current.get(card.visual as WorkflowVisual),
    }));
    if (targets.some((target) => !target.canvas)) return;

    const renderer = createWorkflowGradientRenderer({
      atlas,
      host,
      targets: targets as { visual: WorkflowVisual; canvas: HTMLCanvasElement }[],
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      onReady: () => setReady(true),
    });
    return () => renderer?.dispose();
  }, []);

  return (
    <div
      className={styles.workViewport}
      ref={hostRef}
      data-workflow-gradient-host
      data-gradient-ready={ready || undefined}
    >
      <div className={styles.workTrack} data-workflow-track>
        {workflowCards.map((card) => {
          const visual = card.visual as WorkflowVisual;
          return (
            <article key={card.id} className={styles.workCard} data-workflow-card>
              <div
                className={styles.workflowVisual}
                data-type={visual}
                style={{ '--workflow-fallback': WORKFLOW_GRADIENT_SCENES[visual].fallback } as React.CSSProperties}
              >
                <canvas
                  ref={(node) => {
                    if (node) canvasesRef.current.set(visual, node);
                    else canvasesRef.current.delete(visual);
                  }}
                  className={styles.workflowCanvas}
                  data-workflow-gradient-canvas
                  aria-hidden="true"
                />
                <div className={styles.visualTop}><span>heiller / {visual}</span><i /></div>
                <strong>{headline(visual)}</strong>
              </div>
              <div className={styles.workCardCopy}>
                <span>{card.kicker}</span><ArrowUpRight size={17} />
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
