'use client';

import { useState, type SVGProps } from 'react';

export interface InteractiveGridPatternProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number];
  squaresClassName?: string;
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className = '',
  squaresClassName = '',
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares;
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      className={className}
      {...props}
      data-interactive-grid
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: horizontal * vertical }, (_, index) => {
        const x = (index % horizontal) * width;
        const y = Math.floor(index / horizontal) * height;

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={squaresClassName}
            data-hovered={hoveredSquare === index || undefined}
            onMouseEnter={() => setHoveredSquare(index)}
            onMouseLeave={() => setHoveredSquare(null)}
          />
        );
      })}
    </svg>
  );
}
