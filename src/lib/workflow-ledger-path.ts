export type CenterSpineInput = {
  /** Horizontal centre the spine runs down. */
  readonly x: number;
  /** Where the spine starts, just under the heading. */
  readonly startY: number;
  /** Where the spine ends, just above the CTA. */
  readonly endY: number;
  /** Y positions for the chevrons dropped between stages. */
  readonly arrowYs: readonly number[];
};

export type CenterSpine = {
  readonly d: string;
  readonly arrows: readonly string[];
};

const CHEVRON_HALF_WIDTH = 6.5;
const CHEVRON_HEIGHT = 8;

/** A downward chevron centred on (x, y), pointing at y. */
export function chevron(x: number, y: number): string {
  return `M ${x - CHEVRON_HALF_WIDTH} ${y - CHEVRON_HEIGHT} L ${x} ${y} L ${x + CHEVRON_HALF_WIDTH} ${y - CHEVRON_HEIGHT}`;
}

/**
 * A single vertical run down the middle of the ledger, with a chevron between
 * each pair of stages and one final chevron landing on the CTA. Arrows above
 * the start or below the end are dropped rather than drawn outside the line.
 */
export function buildCenterSpine(input: CenterSpineInput): CenterSpine {
  const { x, startY, endY, arrowYs } = input;
  const d = `M ${x} ${startY} L ${x} ${endY}`;
  const arrows = arrowYs
    .filter((y) => y >= startY && y <= endY)
    .map((y) => chevron(x, y));
  return { d, arrows };
}
