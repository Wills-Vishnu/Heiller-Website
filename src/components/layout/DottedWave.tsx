'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { scrollState } from '@/lib/scroll-state';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The blue dot-matrix dune field along the base of the hero.
 *
 * WHAT WAS WRONG THE FIRST TIME
 * The original version walked a fixed screen-space grid and only displaced each
 * dot's Y. That shears a flat grid — the dots stay in rigid columns, evenly
 * sized from top to bottom, and the result reads as a warped sheet of graph
 * paper rather than a landscape. No amount of tuning the sine functions fixes
 * that, because the missing ingredient is perspective, not waveform.
 *
 * WHAT THIS DOES INSTEAD
 * A real 3D ground plane, projected properly:
 *
 *   1. Points live on a uniform grid in WORLD space (x across, z into the
 *      distance), not on the screen.
 *   2. Height comes from summed travelling sine waves evaluated at (x, z).
 *   3. Each point is projected through a pinhole camera:
 *          persp = FOCAL / z
 *          screenX = centreX + worldX * persp
 *          screenY = horizon  + (CAM_Y - height) * persp
 *
 * Everything that makes the reference image read as terrain falls out of that
 * projection for free:
 *   - Dots shrink with distance (size ∝ persp).
 *   - Rows bunch together toward the horizon, so the far field gets dense
 *     while the foreground stays open.
 *   - A uniform world grid spreads wide when near and compresses when far, so
 *     dot density increases with depth without being faked.
 *   - Crests genuinely occlude-ish: a raised crest projects *upward* on screen
 *     proportionally to how near it is, which is what gives the rolling dune
 *     silhouette rather than a uniform ripple.
 *
 * MOTION — three layers, echoing the reference pen's `wave` + `swell` pair:
 *   TRAVEL   the whole waveform drifts along world X, the equivalent of the
 *            pen's `margin-left` scroll, but in the wave's own phase so it
 *            never seams or resets.
 *   SWELL    a slow global rise and fall of the entire surface, the pen's
 *            `swell` keyframe.
 *   SURGE    scroll velocity raises amplitude and accelerates travel, then
 *            decays — so each scroll visibly drives a swell through the field.
 *
 * PERFORMANCE
 * The naive version of this is millions of points. Three things bound it:
 *   - Per-row X limits are computed analytically from the projection, so we
 *     only ever iterate points that can land on screen.
 *   - Rows whose projected Y falls within ~1.4px of the previous row are
 *     skipped — beyond that they just overdraw each other.
 *   - World cell size scales with canvas width, keeping the point count
 *     roughly constant from a laptop to a 4K display.
 * Net result is ~8–10k `fillRect` calls per frame, which holds 60fps
 * comfortably and needs no WebGL.
 */

/* --- Camera & world ------------------------------------------------------- */

/**
 * Dot colours per theme, as [trough, crest] RGB triples.
 *
 * Canvas gets no cascade, so this is one of only two places in the codebase
 * that has to know the theme in JavaScript rather than inheriting it from a
 * CSS custom property.
 *
 * Dark is NOT simply the light ramp brightened. On a near-white page the
 * troughs recede by going *paler* than the crests; on a dark page they have to
 * recede by going *darker*, so the ramp inverts in luminance while keeping the
 * same hue relationship. Brightening the light values instead produces a
 * uniformly glowing field with no legible ridges at all.
 */
const PALETTES = {
  light: { trough: [150, 168, 205], crest: [45, 100, 240] },
  dark: { trough: [38, 52, 88], crest: [120, 160, 255] },
} as const;

/** Camera height above the plane, in world units. */
const CAM_Y = 1;
/** Nearest and furthest row depth. FAR mostly controls how dense the haze gets. */
const NEAR = 1;
const FAR = 15;
/** Wave height in world units. */
const AMPLITUDE = 0.3;
/** Minimum vertical gap between drawn rows, in CSS px. */
const MIN_ROW_GAP = 1.4;

export function DottedWave({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    /* ---- Theme -----------------------------------------------------------
       Cached and updated by a MutationObserver on the `dark` class rather than
       read per frame. `classList.contains` is cheap, but this runs inside the
       paint loop and the value changes at most a few times per session — an
       observer is the honest expression of "this is an event, not a poll". */
    let palette: (typeof PALETTES)[keyof typeof PALETTES] =
      document.documentElement.classList.contains('dark')
        ? PALETTES.dark
        : PALETTES.light;

    // Declared before the observer that reads it. Holds the surface's current
    // phase so a theme change repaints the frame the reader is looking at,
    // rather than snapping the wave back to t=0.
    let lastTime = 0;

    const themeObserver = new MutationObserver(() => {
      palette = document.documentElement.classList.contains('dark')
        ? PALETTES.dark
        : PALETTES.light;
      // Repaint immediately so the wave switches with everything else rather
      // than waiting for the next scroll — and so it updates at all when the
      // field is static under reduced motion.
      if (width) {
        ctx.clearRect(0, 0, width, height);
        paint(ctx, width, height, lastTime, 0, palette);
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    /* ---- Visibility gate -------------------------------------------------- */
    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: '150px' },
    );
    observer.observe(canvas);

    /* ---- Static frame for reduced motion ---------------------------------
       The dunes are part of the composition, so they still render — they just
       hold still. Same paint path as the animated branch, so the still frame
       is guaranteed to be the moving one at t=0. */
    if (reducedMotion) {
      const drawStatic = () => {
        resize();
        ctx.clearRect(0, 0, width, height);
        paint(ctx, width, height, 0, 0, palette);
      };
      drawStatic();
      window.addEventListener('resize', drawStatic);

      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('resize', drawStatic);
        observer.disconnect();
        themeObserver.disconnect();
      };
    }

    /* ---- Animated loop ---------------------------------------------------- */
    let time = 0;
    let surge = 0;

    const tick = (_t: number, deltaMs: number) => {
      if (!visible || !width) return;

      // Clamp so a backgrounded tab doesn't fast-forward the surface on return.
      const dt = Math.min(deltaMs, 34) / 1000;

      // Lenis reports velocity in px/frame and spikes hard on a flick, so it is
      // normalised and clamped before it can reach the surface function.
      const speed = Math.min(Math.abs(scrollState.velocity) / 45, 1);
      // Asymmetric envelope — rises fast, falls slowly. This is what makes a
      // scroll read as a swell rolling through rather than a slider tracking
      // the wheel position.
      surge += (speed - surge) * (speed > surge ? 0.2 : 0.03);

      time += dt * (0.5 + surge * 2.4);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      paint(ctx, width, height, time, surge, palette);
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', resize);
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Surface                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Height of the dune surface at a world coordinate.
 *
 * Four summed sines at deliberately incommensurable frequencies, travelling in
 * different directions. Because no frequency is a rational multiple of another,
 * the combined pattern's period is effectively longer than anyone will watch —
 * it never visibly loops. The two low-frequency terms carry the big dune
 * ridges; the two high-frequency ones break up the crests so they undulate
 * along their length instead of running as straight bars.
 *
 * Returns roughly −1…1.
 */
function surfaceHeight(x: number, z: number, travel: number): number {
  return (
    (Math.sin(x * 0.52 + z * 0.28 + travel) * 1.0 +
      Math.sin(x * 0.29 - z * 0.47 + travel * 0.72) * 0.74 +
      Math.sin((x + z * 0.6) * 0.21 + travel * 1.35) * 0.5 +
      Math.sin(x * 0.95 - z * 0.16 + travel * 1.7) * 0.22) /
    2.46
  );
}

/** Smooth 0→1 ramp. Used for the depth and edge fades. */
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function paint(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  surge: number,
  palette: (typeof PALETTES)[keyof typeof PALETTES],
) {
  const [tr, tg, tb] = palette.trough;
  const [cr, cg, cb] = palette.crest;

  /* Focal length is tied to canvas height so the nearest row always lands on
     the bottom edge regardless of how the hero is sized:
        screenY(NEAR, h=0) = CAM_Y * FOCAL / NEAR = height                    */
  const FOCAL = height;
  const centreX = width / 2;
  const horizon = 0;

  /* World cell size scales with width so a 4K display doesn't quietly quadruple
     the point count. Clamped so the look stays consistent across breakpoints. */
  const cell = 0.15 * Math.min(1.7, Math.max(1, width / 1500));

  const travel = time * 0.6;
  // The reference pen's `swell` keyframe: whole surface breathing vertically.
  const swell = Math.sin(time * 0.85) * 0.045;
  const amplitude = AMPLITUDE * (1 + surge * 0.7);

  let previousRowY = Infinity;

  for (let z = NEAR; z <= FAR; z += cell) {
    const persp = FOCAL / z;

    // Row position at zero height, used only for spacing decisions.
    const rowY = horizon + CAM_Y * persp;
    if (z > NEAR && previousRowY - rowY < MIN_ROW_GAP) continue;
    previousRowY = rowY;

    const depth = (z - NEAR) / (FAR - NEAR);

    /* Depth fade. Out toward the horizon so the field dissolves into the page
       instead of ending on a visible vanishing line, and very slightly in at
       the near edge so the foreground doesn't slam against the bottom cut. */
    const depthFade = (1 - smoothstep(0.5, 1, depth)) * smoothstep(0, 0.06, depth);
    if (depthFade <= 0.004) continue;

    // Dots shrink with distance. Clamped so the nearest never blob and the
    // furthest never drop below a subpixel that the canvas would drop anyway.
    const size = Math.min(3.2, Math.max(1, persp * 0.0105));

    // World-X at which a point lands exactly on the left/right canvas edge —
    // lets the inner loop skip everything off-screen without testing it.
    const xLimit = centreX / persp;
    const kMax = Math.ceil(xLimit / cell);

    for (let k = -kMax; k <= kMax; k += 1) {
      const worldX = k * cell;

      const n = surfaceHeight(worldX, z, travel);
      const y = horizon + (CAM_Y - (n * amplitude + swell)) * persp;

      // Crests can project above the canvas; troughs below it.
      if (y < -4 || y > height + 4) continue;

      const screenX = centreX + worldX * persp;

      // Dissolve at the left and right edges so the band has no hard sides.
      const edgeFade = smoothstep(0, 0.14, Math.min(screenX, width - screenX) / width);
      if (edgeFade <= 0.004) continue;

      // Crests brighter and bluer, troughs receding to pale slate. This is what
      // makes the ridges legible as ridges rather than a uniform speckle.
      const crest = (n + 1) / 2;
      const alpha = (0.16 + crest * 0.46) * depthFade * edgeFade;
      if (alpha < 0.012) continue;

      const r = Math.round(tr + (cr - tr) * crest);
      const g = Math.round(tg + (cg - tg) * crest);
      const b = Math.round(tb + (cb - tb) * crest);

      ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
      ctx.fillRect(screenX, y, size, size);
    }
  }
}
