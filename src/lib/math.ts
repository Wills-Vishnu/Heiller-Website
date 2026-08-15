/**
 * Framework-agnostic math helpers shared by the DOM and WebGL layers.
 * Everything here is allocation-free and safe to call inside a 60 fps loop.
 */

export const clamp = (v: number, min = 0, max = 1): number =>
  v < min ? min : v > max ? max : v;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Maps `v` from [inMin, inMax] to [outMin, outMax], clamped at both ends. */
export const mapRange = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => {
  if (inMax === inMin) return outMin;
  return outMin + (clamp((v - inMin) / (inMax - inMin)) * (outMax - outMin));
};

/** Classic Hermite smoothstep. Zero first derivative at both endpoints. */
export const smoothstep = (t: number): number => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

/** Ken Perlin's quintic. Zero first *and* second derivative — no visible seam. */
export const smootherstep = (t: number): number => {
  const x = clamp(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/**
 * Frame-rate independent exponential damping.
 *
 * The naive `current += (target - current) * 0.1` pattern is tied to frame
 * rate: it converges twice as fast at 120 fps as at 60 fps. This variant
 * integrates over the real elapsed time so motion feels identical on every
 * display, which matters because the whole camera rig is damped.
 *
 * @param lambda Higher is snappier. ~3 is languid, ~12 is responsive.
 */
export const damp = (
  current: number,
  target: number,
  lambda: number,
  dt: number,
): number => lerp(current, target, 1 - Math.exp(-lambda * dt));

/**
 * Reads a keyframed track at a fractional index.
 *
 * The scroll story is expressed as one value per chapter — e.g. camera Z is
 * `[9.5, 11, 8, ...]`. Given `t` in 0..1 across the whole page this returns the
 * smoothly interpolated value, so adding a chapter means adding one number to
 * an array rather than rewriting a timeline.
 *
 * @param values One entry per chapter. Must contain at least two entries.
 * @param t      Normalised scroll progress, 0..1.
 */
export const track = (values: readonly number[], t: number): number => {
  const segments = values.length - 1;
  if (segments < 1) return values[0] ?? 0;

  const x = clamp(t) * segments;
  const i = Math.min(Math.floor(x), segments - 1);
  return lerp(values[i], values[i + 1], smootherstep(x - i));
};

/**
 * Returns 1 while `t` sits inside chapter `index`, falling to 0 across
 * `falloff` chapters on either side. Used to gate elements that belong to a
 * single beat of the story (the security shell, the analytics grid) without
 * hard on/off popping.
 */
export const chapterWindow = (
  t: number,
  chapterCount: number,
  index: number,
  falloff = 1,
): number => {
  const position = clamp(t) * (chapterCount - 1);
  const distance = Math.abs(position - index);
  return smootherstep(1 - clamp(distance / falloff));
};

/**
 * Deterministic pseudo-random in [0, 1) from an integer seed.
 * Deterministic matters: the node lattice must render identically on the
 * server-adjacent first client frame and on every subsequent reload, otherwise
 * the scene visibly reshuffles on refresh.
 */
export const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

/** Golden-angle constant used for evenly distributed points on a sphere. */
export const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
