/**
 * Content and geometry for the hero illustration.
 *
 * Split out of the component so the labels are editable without touching SVG
 * path data, and so the stack geometry is derived from one place rather than
 * being hand-typed nine times.
 */

/** The five labelled tabs down the left edge of the document stack. */
export const stackTabs = [
  'Patient Information',
  'Insurance Verification',
  'Medical Coding',
  'Claim Submission',
  'Payment Posting',
] as const;

/** Dashboard stat cards under the revenue chart. */
export const dashboardStats = [
  // PLACEHOLDER — illustrative figures, same caveat as `problemStats`.
  { label: 'Claims Processed', value: '12,543', delta: '18.6%', direction: 'up' },
  { label: 'Collection Rate', value: '98%', delta: '22.1%', direction: 'up' },
  { label: 'Denial Rate', value: '3.2%', delta: '11.4%', direction: 'down' },
] as const;

export const dashboard = {
  title: 'Revenue Overview',
  // PLACEHOLDER
  headline: '$2.4M+',
  period: 'This Month',
  delta: '28.6%',
} as const;

/**
 * The revenue sparkline, as normalised 0–1 points.
 *
 * Deliberately not monotonic — a line that only ever goes up looks like
 * marketing rather than data. It dips twice and still finishes decisively
 * higher, which is both more credible and more interesting to watch draw.
 */
export const sparkline = [
  0.18, 0.24, 0.19, 0.31, 0.28, 0.42, 0.38, 0.52, 0.61, 0.55, 0.72, 0.86,
] as const;

/**
 * Builds the `d` attribute for a smooth-ish polyline through `sparkline`.
 *
 * Uses a Catmull-Rom-to-Bezier conversion so the curve passes exactly through
 * every data point — a plain quadratic smoothing would round off the dips,
 * which are the whole reason the series is shaped the way it is.
 */
export function sparklinePath(width: number, height: number): string {
  const points = sparkline.map((value, index) => ({
    x: (index / (sparkline.length - 1)) * width,
    y: height - value * height,
  }));

  let d = `M${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    // Catmull-Rom tension 0.5 → cubic Bezier control points.
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d +=
      ` C${c1x.toFixed(2)},${c1y.toFixed(2)}` +
      ` ${c2x.toFixed(2)},${c2y.toFixed(2)}` +
      ` ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }

  return d;
}
