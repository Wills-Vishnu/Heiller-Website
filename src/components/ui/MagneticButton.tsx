'use client';

import {
  useCallback,
  useRef,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Variant = 'primary' | 'secondary' | 'ghost';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: Variant;
  className?: string;
  withArrow?: boolean;
  disabled?: boolean;
  /** Screen-reader label when the visible text is not self-describing. */
  ariaLabel?: string;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  /* `bg-inverse text-on-inverse`, NOT `bg-navy text-white`.
     `navy` is headline ink, so under the dark theme it inverts to near-white —
     which would render this as white text on a white pill. The inverse pair is
     defined precisely so "the opposite of the page" flips deliberately: a
     near-black pill on light, a near-white pill on dark. */
  primary:
    'bg-inverse text-on-inverse shadow-[0_10px_26px_-10px_rgb(var(--shadow-tint)/0.45)] hover:shadow-[0_18px_40px_-12px_rgba(47,107,255,0.5)]',
  // Solid surface, hairline edge. Was translucent + blurred, which read as
  // glass over the wave rather than as a button sitting on the page.
  secondary:
    'bg-surface text-navy ring-1 ring-inset ring-hairline hover:ring-cobalt/30 shadow-rest hover:shadow-lift',
  ghost: 'text-navy hover:text-cobalt',
};

/**
 * The site's single interactive control.
 *
 * Four micro-interactions, layered:
 *
 *   MAGNETISM  the button translates toward the cursor within its bounds, and
 *              the label translates further than the shell — a parallax that
 *              makes the control feel like it has depth rather than just
 *              sliding around.
 *   SHEEN      a specular band tracks the pointer across the surface.
 *   RIPPLE     a click spawns a circle at the exact pointer position, scales it
 *              past the bounds and removes it. Spawned imperatively so repeated
 *              clicks never queue behind React state.
 *   ELEVATION  shadow deepens and warms on hover via CSS transition.
 *
 * All of it is disabled under `prefers-reduced-motion`, where the button falls
 * back to a colour-only hover state.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  withArrow = false,
  disabled = false,
  ariaLabel,
}: MagneticButtonProps) {
  const shellRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const sheenRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (reducedMotion || disabled) return;
      const shell = shellRef.current;
      if (!shell) return;

      const bounds = shell.getBoundingClientRect();
      const offsetX = event.clientX - (bounds.left + bounds.width / 2);
      const offsetY = event.clientY - (bounds.top + bounds.height / 2);

      // Clamped to ~22% of the button's own size so it never detaches from its
      // layout slot and start overlapping neighbours.
      const pullX = gsap.utils.clamp(-14, 14, offsetX * 0.28);
      const pullY = gsap.utils.clamp(-10, 10, offsetY * 0.32);

      gsap.to(shell, { x: pullX, y: pullY, duration: 0.5, ease: 'power3.out' });
      gsap.to(labelRef.current, {
        x: pullX * 0.35,
        y: pullY * 0.35,
        duration: 0.6,
        ease: 'power3.out',
      });
      gsap.to(sheenRef.current, {
        xPercent: (offsetX / bounds.width) * 120,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    },
    [reducedMotion, disabled],
  );

  const handlePointerLeave = useCallback(() => {
    if (reducedMotion) return;
    gsap.to([shellRef.current, labelRef.current], {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.55)',
    });
    gsap.to(sheenRef.current, { opacity: 0, duration: 0.4 });
  }, [reducedMotion]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!reducedMotion && shellRef.current) {
        const shell = shellRef.current;
        const bounds = shell.getBoundingClientRect();

        const ripple = document.createElement('span');
        ripple.setAttribute('aria-hidden', 'true');
        const size = Math.max(bounds.width, bounds.height) * 2.2;

        Object.assign(ripple.style, {
          position: 'absolute',
          left: `${event.clientX - bounds.left - size / 2}px`,
          top: `${event.clientY - bounds.top - size / 2}px`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '999px',
          pointerEvents: 'none',
          background:
            variant === 'primary'
              ? // The primary pill inverts with the theme, so a fixed white
                // ripple would be invisible on the dark theme's light pill.
                // `currentColor` is the label colour — always the contrast
                // partner of whatever the pill currently is. The alpha is mixed
                // into the colour rather than set via `opacity`, because GSAP
                // animates `opacity` on this element and would overwrite it.
                'radial-gradient(circle, color-mix(in srgb, currentColor 38%, transparent) 0%, transparent 68%)'
              : 'radial-gradient(circle, rgba(47,107,255,0.24) 0%, rgba(47,107,255,0) 68%)',
        });

        shell.appendChild(ripple);
        gsap.fromTo(
          ripple,
          { scale: 0, opacity: 1 },
          {
            scale: 1,
            opacity: 0,
            duration: 0.85,
            ease: 'power2.out',
            onComplete: () => ripple.remove(),
          },
        );
      }

      onClick?.();
    },
    [onClick, reducedMotion, variant],
  );

  const shellClasses = [
    'group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden',
    'rounded-pill px-7 py-3.5 text-[0.9375rem] font-medium tracking-[-0.01em]',
    'transition-[background-color,box-shadow,color,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
    'will-change-transform',
    VARIANT_CLASSES[variant],
    disabled ? 'pointer-events-none opacity-50' : '',
    className,
  ].join(' ');

  const inner = (
    <>
      {/* Sheen — pure decoration, never announced. */}
      <span
        ref={sheenRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 opacity-0"
        style={{
          background:
            variant === 'primary'
              ? // Same reasoning as the ripple: tracks the label colour so the
                // sheen stays visible whichever way the pill is inverted.
                'linear-gradient(100deg, transparent, color-mix(in srgb, currentColor 26%, transparent), transparent)'
              : 'linear-gradient(100deg, transparent, rgba(47,107,255,0.14), transparent)',
        }}
      />
      <span ref={labelRef} className="relative z-10 inline-flex items-center gap-2">
        {children}
        {withArrow && (
          <ArrowRight
            className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-1"
            aria-hidden="true"
          />
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={shellRef as RefObject<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        className={shellClasses}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={shellRef as RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      className={shellClasses}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      {inner}
    </button>
  );
}
