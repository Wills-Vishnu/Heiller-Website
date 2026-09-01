import type { CSSProperties } from 'react';
import { heroFlowNodeById, heroFlowNodes, heroFlowSegments } from '@/lib/hero-flow';
import styles from './home.module.css';

type FlowStyle = CSSProperties & Record<`--${string}`, string>;

export function HeroFlow() {
  return (
    <div className={styles.heroFlow} data-hero-flow aria-hidden="true">
      <svg viewBox="0 0 1079 275" role="presentation" focusable="false">
        <defs>
          {heroFlowSegments.map((segment) => {
            const source = heroFlowNodeById[segment.from];
            const destination = heroFlowNodeById[segment.to];
            return (
              <linearGradient key={segment.id} id={`flow-${segment.id}`}>
                <stop offset="0%" stopColor={source.color} />
                <stop offset="100%" stopColor={destination.color} />
              </linearGradient>
            );
          })}
        </defs>
        <g className={styles.flowTracks}>
          {heroFlowSegments.map((segment) => (
            <g key={segment.id}>
              <path data-flow-track d={segment.path} />
              <path className={styles.flowArrow} d={segment.arrow} />
            </g>
          ))}
        </g>
        <g>
          {heroFlowSegments.map((segment) => {
            const destination = heroFlowNodeById[segment.to];
            const style = { '--flow-delay': `${segment.delayMs}ms`, '--flow-arrow': destination.color } as FlowStyle;
            return (
              <g key={segment.id} style={style}>
                <path data-flow-travel className={styles.flowTravel} pathLength="100" stroke={`url(#flow-${segment.id})`} d={segment.path} />
                <path className={styles.flowTravelArrow} pathLength="100" d={segment.arrow} />
              </g>
            );
          })}
        </g>
        <g>
          {heroFlowNodes.map((node) => {
            const style = {
              '--node-color': node.color,
              '--node-text': node.activeText,
              '--node-delay': `${node.delayMs}ms`,
            } as FlowStyle;
            return (
              <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
                <g data-flow-node className={styles.flowNode} style={style}>
                  <rect width="101" height="57" rx="6" />
                  <text x="50.5" y="29" dominantBaseline="middle" textAnchor="middle">{node.label}</text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
