/**
 * Central GSAP setup. Import from here — never from 'gsap' directly — so that
 * plugin registration happens exactly once and no component can accidentally
 * animate before ScrollTrigger exists.
 *
 * Only free GSAP plugins are used. SplitText, DrawSVG, ScrollSmoother and
 * MorphSVG are Club GSAP products; their effects are reproduced here with
 * hand-rolled equivalents (see `components/ui/SplitText.tsx` for text masking
 * and the stroke-dashoffset technique in the workflow section for path draw).
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // Never round transforms — sub-pixel positioning is what keeps long, slow
  // parallax moves from stair-stepping.
  gsap.config({ force3D: true, nullTargetWarn: false });

  gsap.defaults({ ease: 'power3.out', duration: 1 });
}

/** Named easings matching the CSS custom properties in globals.css. */
export const EASE = {
  cinema: 'expo.out',
  glide: 'power3.out',
  swift: 'power2.inOut',
  settle: 'power4.out',
} as const;

/**
 * Standard entrance for a block of content. Deliberately combines four
 * channels — opacity, translate, scale and blur — because a single-channel
 * fade reads as "web page" while the combination reads as "camera focusing".
 */
export const ENTRANCE_FROM = {
  autoAlpha: 0,
  y: 44,
  scale: 0.985,
  filter: 'blur(10px)',
} as const;

export const ENTRANCE_TO = {
  autoAlpha: 1,
  y: 0,
  scale: 1,
  filter: 'blur(0px)',
  duration: 1.15,
  ease: EASE.cinema,
} as const;

export { gsap, ScrollTrigger, useGSAP };
