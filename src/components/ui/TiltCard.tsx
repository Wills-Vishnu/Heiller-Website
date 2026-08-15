'use client';

import {
  useCallback,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees on each axis. */
  intensity?: number;
  /** Pixels the card lifts toward the viewer on hover. */
  lift?: number;
}

/**
 * A card that responds to the pointer with three coordinated cues.
 *
 *   TILT   rotateX / rotateY proportional to cursor offset from centre. The
 *          sign is inverted on X so the card leans *toward* the cursor, which
 *          is the direction that reads as physical rather than repulsive.
 *   LIFT   translateZ plus a deepening shadow. Rotation alone reads as a
 *          gimmick; rotation with correlated shadow reads as an object.
 *   SPECULAR  a radial highlight tracking the pointer across the surface,
 *          positioned via CSS custom properties so the browser can update it
 *          without a style recalculation of the subtree.
 *
 * Perspective lives on the wrapper, not the card, so sibling cards each get
 * their own vanishing point — a shared perspective on a grid makes cards at the
 * edges shear unpleasantly.
 */
export function TiltCard({
  children,
  className = '',
  intensity = 7,
  lift = 14,
}: TiltCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const card = cardRef.current;
      if (!card) return;

      const bounds = card.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width;
      const py = (event.clientY - bounds.top) / bounds.height;

      gsap.to(card, {
        rotateY: (px - 0.5) * intensity * 2,
        rotateX: -(py - 0.5) * intensity * 2,
        z: lift,
        duration: 0.6,
        ease: 'power3.out',
        transformPerspective: 900,
      });

      // Custom properties, not inline styles on children — one write, no reflow.
      card.style.setProperty('--spec-x', `${px * 100}%`);
      card.style.setProperty('--spec-y', `${py * 100}%`);
      card.style.setProperty('--spec-opacity', '1');
    },
    [intensity, lift, reducedMotion],
  );

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card || reducedMotion) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.6)',
    });
    card.style.setProperty('--spec-opacity', '0');
  }, [reducedMotion]);

  return (
    <div
      ref={wrapperRef}
      className="[perspective:1100px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        ref={cardRef}
        className={`relative isolate [transform-style:preserve-3d] will-change-transform ${className}`}
        style={
          {
            '--spec-x': '50%',
            '--spec-y': '50%',
            '--spec-opacity': '0',
          } as CSSProperties
        }
      >
        {/* Specular highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] transition-opacity duration-500"
          style={{
            opacity: 'var(--spec-opacity)',
            background:
              'radial-gradient(420px circle at var(--spec-x) var(--spec-y), rgba(47,107,255,0.13), rgba(107,152,255,0.06) 38%, transparent 62%)',
          }}
        />
        {children}
      </div>
    </div>
  );
}
